import { a as st, o as Xn, q as ec, s as rc, z as Io, t as nc, w as Gs, x as Ya, y as ac, A as ic, B as Ln, E as Fs, G as oc, H as re, j as E, I as Hr, J as br, K as sc, u as Si, L as lc, M as Ro, N as uc, O as De, P as cc, S as Po, Q as Ca, R as fc, T as dc, U as Oo, V as pc, W as En, X as vc, Y as hc, Z as gc, _ as mc, $ as zo, a0 as xc, a1 as yc, a2 as bc, a3 as Sc, a4 as Cc, a5 as Ec, a6 as Dc, a7 as Ao, a8 as wc, a9 as _c, aa as Mc, l as No, ab as kc, ac as Tc, ad as Ic, ae as Bo } from "./embed-8iuCsEkz.js";
function Ci(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function Ls(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function Ws(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function Ei(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Rc() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Pc(t, e) {
  var r = Ei("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function Xa(t) {
  return t.replace(/_/g, ".");
}
function qr(t, e) {
  var r = null, n = "-1";
  return Ci(t, function(a) {
    var i = Ei("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Pc(a.versionTest.toLowerCase(), e) || n), n = Xa(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function Dn(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return Ci(t, function(n) {
    var a = Ys(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function Ys(t, e) {
  return Ls(t, function(r) {
    var n = r.brand;
    return Ei("" + e.test, n.toLowerCase());
  });
}
var Xs = [{
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
}], Hs = [{
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
}], Ha = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], qs = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Vs = [{
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
function $s(t) {
  return !!qr(qs, t).preset;
}
function Oc(t) {
  var e = Ws(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: $s(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = qr(Xs, e), o = i.preset, s = i.version, l = qr(Vs, e), u = l.preset, c = l.version, f = qr(Hs, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = qr(Ha, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function zc(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!Dn(qs, r).brand || $s(Ws())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && Ci(Ha, function(d) {
    return Ys(r, d);
  });
  var l = Dn(Hs, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = Dn(Ha, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = Ls(Vs, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = Dn(Xs, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = Xa(s.version), o.version = Xa(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function Ac(t) {
  return Rc() ? zc() : Oc(t);
}
function Nc(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function Bc(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function qe(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Us(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function jc(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function Ks(t, e) {
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
var Gc = "function", Fc = "object", Lc = "string", Wc = "number", Di = "undefined", Zs = typeof window !== Di, Yc = typeof document !== Di && document, Xc = [{
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
}], Ut = 1e-7, wn = {
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
function Hc() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function Hn(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function wi(t) {
  return typeof t === Di;
}
function pe(t) {
  return t && typeof t === Fc;
}
function Yt(t) {
  return Array.isArray(t);
}
function be(t) {
  return typeof t === Lc;
}
function nn(t) {
  return typeof t === Wc;
}
function oa(t) {
  return typeof t === Gc;
}
function qc(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Js(t, e, r, n, a) {
  var i = _i(t, e, r);
  return i ? r : Vc(t, e, r + 1, n, a);
}
function _i(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function Vc(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !_i(t, e, u))
      return {
        value: u
      };
    var f = u, d = ve(a, function(p) {
      var h = p.open;
      return h === c;
    });
    if (d && (f = Js(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function Mi(t, e) {
  var r = be(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? Xc : u, f = c.map(function(_) {
    var M = _.open, T = _.close;
    return M === T ? M : M + "|" + T;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", p = new RegExp(d, "g"), h = t.split(p).filter(function(_) {
    return _ && _ !== "undefined";
  }), g = h.length, x = [], y = [];
  function b() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var C = function(_) {
    var M = h[_].trim(), T = _, k = ve(c, function(R) {
      var B = R.open;
      return B === M;
    }), A = ve(c, function(R) {
      var B = R.close;
      return B === M;
    });
    if (k) {
      if (T = Js(k, h, _, g, c), T !== -1 && l)
        return b() && i || (x.push(h.slice(_, T + 1).join("")), _ = T, i) ? (S = _, "break") : (S = _, "continue");
    } else if (A && !_i(A, h, _)) {
      var z = Hc(c);
      return z.splice(c.indexOf(A), 1), {
        value: Mi(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: z
        })
      };
    } else if (qc(M, a) && !o)
      return b(), i ? (S = _, "break") : (S = _, "continue");
    T === -1 && (T = g - 1), y.push(h.slice(_, T + 1).join("")), _ = T, S = _;
  }, S, w = 0; w < g; ++w) {
    var v = C(w);
    if (w = S, typeof v == "object") return v.value;
    if (v === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function Ve(t) {
  return Mi(t, "");
}
function ir(t) {
  return Mi(t, ",");
}
function Qs(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function or(t) {
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
function qa(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function $c(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function an() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function Ge(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function ve(t, e, r) {
  var n = Ge(t, e);
  return n > -1 ? t[n] : r;
}
var tl = /* @__PURE__ */ (function() {
  var t = an(), e = Zs && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = an(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), Uc = /* @__PURE__ */ (function() {
  var t = Zs && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Nr(t) {
  return Object.keys(t);
}
function Rt(t, e) {
  var r = or(t), n = r.value, a = r.unit;
  if (pe(e)) {
    var i = e[a];
    if (i) {
      if (oa(i))
        return i(n);
      if (wn[a])
        return wn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return wn[a] ? wn[a](n) : n;
}
function qn(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function jo(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[gt(e[0], Ut), gt(e[0] / n, Ut)], [gt(e[1] * n, Ut), gt(e[1], Ut)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = gt(s, Ut);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function ki(t, e, r, n) {
  if (!n)
    return t.map(function(p, h) {
      return qn(p, e[h], r[h]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = jo(t, e, !1, o), l = s[0], u = s[1], c = jo(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function Kc(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function Va(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Xt(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Zc(t) {
  return [0, 1].map(function(e) {
    return Va(t.map(function(r) {
      return r[e];
    }));
  });
}
function Go(t) {
  var e = Zc(t), r = Xt(e, t[0]), n = Xt(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Re(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function gt(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function Fo(t, e) {
  return t.forEach(function(r, n) {
    t[n] = gt(t[n], e);
  }), t;
}
function Jc(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function Qc(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Kt(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function Ti(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function el(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(r, " ");
  }
}
function $t(t, e, r, n) {
  t.addEventListener(e, r, n);
}
function Wt(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function _e(t) {
  return (t == null ? void 0 : t.ownerDocument) || Yc;
}
function Ii(t) {
  return _e(t).documentElement;
}
function Ke(t) {
  return _e(t).body;
}
function xe(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function rl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function on(t) {
  return pe(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function tf(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function ef(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function rf(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function nl(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function ke(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = At(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!gt(r[i], Ut)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          ef(r, n, a, o, e);
          break;
        }
    }
    if (!gt(r[i], Ut))
      return [];
    rf(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !gt(u, Ut) || a === o || tf(r, n, s, a, e, -u);
    }
  }
  return n;
}
function nf(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function al(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function af(t, e) {
  for (var r = At(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function sr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Te(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = At(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function Vn(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = At(t);
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
function wt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function ct(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function of(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function il(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function ne(t, e, r) {
  r === void 0 && (r = e.length);
  var n = Pt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function sf(t, e) {
  return Pt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function lf(t, e) {
  return Pt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function uf(t, e) {
  return Pt(t, cn(e, 4));
}
function _n(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Pt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function un(t, e) {
  return ne(cn(e, 3), sr(t, 3));
}
function Ea(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Pt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function $a(t, e) {
  return Pt(t, e, 4);
}
function cn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = At(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function At(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function Ri(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function lr(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function Pi(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], p = r[1], h = n[0], g = n[1], x = a[0], y = a[1], b = i[0], C = i[1], S = o[0], w = o[1], v = s[0], _ = s[1], M = [l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -b * c, -C * c, -S * d, -w * d, -v * h, -_ * h, -x * u, -y * u, -b * f, -C * f, -S * p, -w * p, -v * g, -_ * g], T = ke(M, 8);
  if (!T.length)
    return [];
  var k = Pt(T, [x, y, b, C, S, w, v, _], 8);
  return k[8] = 1, Te(nf(k), 3, 4);
}
var Ur = function() {
  return Ur = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ur.apply(this, arguments);
};
function Oi() {
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
function Tr(t, e) {
  return e === void 0 && (e = 0), yr(Ir(t, e));
}
function Wn(t, e) {
  var r = ne(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function cf(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = Oi(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = $a(Tr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = ke(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function yr(t) {
  var e = Oi();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Ir(t, e) {
  e === void 0 && (e = 0);
  var r = Yt(t) ? t : Ve(t);
  return r.map(function(n) {
    var a = Qs(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = pe(e) ? Ur(Ur({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = ir(o).map(function(R, B) {
        return B === 0 && "x%" in c ? c["%"] = e["x%"] : B === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Rt(R, c);
      }), d = f[0], p = f[1], h = p === void 0 ? 0 : p, g = f[2], x = g === void 0 ? 0 : g;
      s = Ea, u = [d, h, x];
    } else if (i === "translateY") {
      var y = pe(e) ? Ur({ "%": e["y%"] }, e) : {
        "%": e
      }, h = Rt(o, y);
      s = Ea, u = [0, h, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = Ea, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var b = ir(o).map(function(R) {
        return parseFloat(R);
      }), C = b[0], S = b[1], w = S === void 0 ? C : S, v = b[2], _ = v === void 0 ? 1 : v;
      s = _n, u = [C, w, _];
    } else if (i === "scaleX") {
      var C = parseFloat(o);
      s = _n, u = [C, 1, 1];
    } else if (i === "scaleY") {
      var w = parseFloat(o);
      s = _n, u = [1, w, 1];
    } else if (i === "scaleZ") {
      var _ = parseFloat(o);
      s = _n, u = [1, 1, _];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var M = or(o), T = M.unit, k = M.value, A = T === "rad" ? k : k * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = uf) : i === "rotateX" ? s = sf : i === "rotateY" && (s = lf), u = A;
    } else if (i === "matrix3d")
      s = $a, u = ir(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var z = ir(o).map(function(R) {
        return parseFloat(R);
      });
      s = $a, u = [
        z[0],
        z[1],
        0,
        0,
        z[2],
        z[3],
        0,
        0,
        0,
        0,
        1,
        0,
        z[4],
        z[5],
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
var ff = /* @__PURE__ */ (function() {
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
})(), df = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), pf = typeof Map == "function", vf = /* @__PURE__ */ (function() {
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
function hf(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new vf();
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
var gf = /* @__PURE__ */ (function() {
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
    var r = hf(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function zi(t, e, r) {
  var n = pf ? Map : r ? df : ff, a = r || function(b) {
    return b;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], p = [], h = {}, g = [], x = 0, y = 0;
  return l.forEach(function(b, C) {
    c.set(b, C);
  }), u.forEach(function(b, C) {
    f.set(b, C);
  }), l.forEach(function(b, C) {
    var S = f.get(b);
    typeof S > "u" ? (++y, o.push(C)) : h[S] = y;
  }), u.forEach(function(b, C) {
    var S = c.get(b);
    typeof S > "u" ? (i.push(C), ++x) : (s.push([S, C]), y = h[C] || 0, d.push([S - y, C - x]), p.push(C === S), S !== C && g.push([S, C]));
  }), o.reverse(), new gf(t, e, i, o, g, s, d, p);
}
var mf = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = zi(this.list, n, this.findKeyCallback);
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
var Ua = function(t, e) {
  return Ua = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ua(t, e);
};
function xf(t, e) {
  Ua(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var ol = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), sl = /* @__PURE__ */ (function(t) {
  xf(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, ol) || this;
  }
  return e;
})(mf);
function Sr(t, e) {
  return zi(t, e, ol);
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
var Ka = function() {
  return Ka = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ka.apply(this, arguments);
};
function yf() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var fn = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(r, n) {
    if (pe(r))
      for (var a in r)
        this.on(a, r[a]);
    else
      this._addEvent(r, n, {});
    return this;
  }, e.off = function(r, n) {
    if (!r)
      this._events = {};
    else if (pe(r))
      for (var a in r)
        this.off(a);
    else if (!n)
      this._events[r] = [];
    else {
      var i = this._events[r];
      if (i) {
        var o = Ge(i, function(s) {
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
    }, n.currentTarget = this, yf(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(Ka({
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
var Za = function(t, e) {
  return Za = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Za(t, e);
};
function bf(t, e) {
  Za(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Cr = function() {
  return Cr = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Cr.apply(this, arguments);
};
function Sf(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Lo(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Mn(t) {
  if (t) {
    if (be(t))
      return document.querySelector(t);
  } else return null;
  if (oa(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var ll = /* @__PURE__ */ (function(t) {
  bf(e, t);
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
    var i = Mn(a.container);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(Cr(Cr({}, a), {
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
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? Sf : o;
    return s({
      container: Mn(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = an(), p = Math.max(l + this._prevTime - d, 0);
      if (p > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, p), !1;
      this._prevTime = d;
      var h = this._getScrollPosition(s, n);
      this._prevScrollPos = h, c && (this._isWait = !0), u || (this._lock = !0);
      var g = {
        container: Mn(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, g), this.emit("scroll", g), this._isWait = !1, u || this.checkScroll(Cr(Cr({}, n), {
        prevScrollPos: h,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Lo : a, o = Mn(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Lo(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(fn);
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
function Cf() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function fe(t) {
  return gt(t, Ut);
}
function Ef(t, e) {
  return t.every(function(r, n) {
    return fe(r - e[n]) === 0;
  });
}
function Df(t, e) {
  return !fe(t[0] - e[0]) && !fe(t[1] - e[1]);
}
function Kr(t) {
  return t.length < 3 ? 0 : Math.abs(Kc(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Ja(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = ur(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(p) {
    return [a + (p[0] - s) * f, i + (p[1] - l) * d];
  });
}
function ur(t) {
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
function $n(t, e, r) {
  var n = t[0], a = t[1], i = ur(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = Un(l[0], l[1]), c = Qa(e), f = [];
  if (c.forEach(function(h) {
    var g = Un(h[0], h[1]), x = h[0];
    if (Ef(u, g))
      f.push({
        pos: t,
        line: h,
        type: "line"
      });
    else {
      var y = ul(Ai(u, g), [l, h]);
      y.forEach(function(b) {
        h.some(function(C) {
          return Df(C, b);
        }) ? f.push({
          pos: b,
          line: h,
          type: "point"
        }) : fe(x[1] - a) !== 0 && f.push({
          pos: b,
          line: h,
          type: "intersection"
        });
      });
    }
  }), ve(f, function(h) {
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
          var b = ve(y, function(w) {
            return w[1] !== a;
          }), C = p[g[0]], S = b[1] > a ? 1 : -1;
          C ? C !== S && ++d : p[g[0]] = S;
        }
      }
  }), d % 2 === 1;
}
function Un(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Ut && (o = 0), Math.abs(s) < Ut && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function Ai(t, e) {
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
function ul(t, e) {
  var r = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), n = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (fe(i - t[1][0])) {
      if (!fe(o - t[1][1])) {
        var u = Math.max.apply(Math, r.map(function(f) {
          return f[0][0];
        })), c = Math.min.apply(Math, r.map(function(f) {
          return f[0][1];
        }));
        if (fe(u - c) > 0)
          return [];
        n = [[u, o], [c, o]];
      }
    } else {
      var s = Math.max.apply(Math, r.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, r.map(function(f) {
        return f[1][1];
      }));
      if (fe(s - l) > 0)
        return [];
      n = [[i, s], [i, l]];
    }
  }
  return n.length || (n = t.filter(function(f) {
    var d = f[0], p = f[1];
    return r.every(function(h) {
      return 0 <= fe(d - h[0][0]) && 0 <= fe(h[0][1] - d) && 0 <= fe(p - h[1][0]) && 0 <= fe(h[1][1] - p);
    });
  })), n.map(function(f) {
    return [fe(f[0]), fe(f[1])];
  });
}
function Qa(t) {
  return Cf(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function wf(t, e) {
  var r = t.slice(), n = e.slice();
  Go(r) === -1 && r.reverse(), Go(n) === -1 && n.reverse();
  var a = Qa(r), i = Qa(n), o = a.map(function(c) {
    return Un(c[0], c[1]);
  }), s = i.map(function(c) {
    return Un(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], p = [];
    s.forEach(function(h, g) {
      var x = Ai(c, h), y = ul(x, [d, i[g]]);
      p.push.apply(p, y.map(function(b) {
        return {
          index1: f,
          index2: g,
          pos: b,
          type: "intersection"
        };
      }));
    }), p.sort(function(h, g) {
      return Re(d[0], h.pos) - Re(d[0], g.pos);
    }), l.push.apply(l, p), $n(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if ($n(c[1], r)) {
      var d = !1, p = Ge(l, function(h) {
        var g = h.index2;
        return g === f ? (d = !0, !1) : !!d;
      });
      p === -1 && (d = !1, p = Ge(l, function(h) {
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
function ti(t, e) {
  var r = wf(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function _f(t, e) {
  var r = ti(t, e);
  return Kr(r);
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
var ei = function(t, e) {
  return ei = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, ei(t, e);
};
function Mf(t, e) {
  ei(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var qt = function() {
  return qt = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, qt.apply(this, arguments);
};
function kf(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Da(t) {
  return kf([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function Tf(t) {
  return t.touches && t.touches.length >= 2;
}
function kn(t) {
  return t ? t.touches ? Rf(t.touches) : [cl(t)] : [];
}
function If(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function Wo(t, e, r) {
  var n = r.length, a = Zr(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = Zr(e, n), c = u.clientX, f = u.clientY, d = Zr(r, n), p = d.clientX, h = d.clientY, g = i - c, x = o - f, y = i - p, b = o - h;
  return {
    clientX: s,
    clientY: l,
    deltaX: g,
    deltaY: x,
    distX: y,
    distY: b
  };
}
function wa(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Rf(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(cl(t[n]));
  return r;
}
function cl(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function Zr(t, e) {
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
var _a = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Da(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Da(e) - Da(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = Wo(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = Wo([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = Zr(e, this.length), a = Zr(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), wa(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), wa(e) / wa(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Yo = ["textarea", "input"], fl = /* @__PURE__ */ (function(t) {
  Mf(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, p) {
      if (p === void 0 && (p = !0), !(!a.flag && d.cancelable === !1)) {
        var h = d.type.indexOf("drag") >= -1;
        if (!(a.flag && h)) {
          a._isDragAPI = !0;
          var g = a.options, x = g.container, y = g.pinchOutside, b = g.preventWheelClick, C = g.preventRightClick, S = g.preventDefault, w = g.checkInput, v = g.dragFocusedInput, _ = g.preventClickEventOnDragStart, M = g.preventClickEventOnDrag, T = g.preventClickEventByCondition, k = a._useTouch, A = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, b && (d.which === 2 || d.button === 1) || C && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (A) {
            var z = a._window.document.activeElement, R = d.target;
            if (R) {
              var B = R.tagName.toLowerCase(), N = Yo.indexOf(B) > -1, L = R.isContentEditable;
              if (N || L) {
                if (w || !v && z === R)
                  return !1;
                if (z && (z === R || L && z.isContentEditable && z.contains(R)))
                  if (v)
                    R.blur();
                  else
                    return !1;
              } else if ((S || d.type === "touchstart") && z) {
                var V = z.tagName.toLowerCase();
                (z.isContentEditable || Yo.indexOf(V) > -1) && z.blur();
              }
              (_ || M || T) && $t(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new _a(kn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = p, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = an() - a.prevTime < 200, a._isMouseEvent = If(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var G = a._preventMouseEvent || a.emit("dragStart", qt(qt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: p, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            G === !1 && a.stop(), a._isMouseEvent && a.flag && S && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var W = 0;
          if (A ? (a._attchDragEvent(), k && y && (W = setTimeout(function() {
            $t(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : k && y && Wt(x, "touchstart", a.onDragStart), a.flag && Tf(d)) {
            if (clearTimeout(W), A && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, p) {
      if (a.flag) {
        var h = a.options.preventDefault;
        !a._isMouseEvent && h && d.preventDefault(), a._prevInputEvent = d;
        var g = kn(d), x = a.moveClients(g, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", qt(qt({}, x), { isScroll: !!p, inputEvent: d }));
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
        var p = a.options, h = p.pinchOutside, g = p.container, x = p.preventClickEventOnDrag, y = p.preventClickEventOnDragStart, b = p.preventClickEventByCondition, C = a.isDrag;
        (x || y || b) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !b && !y && x && !C && a._allowClickEvent(), a._useTouch && h && Wt(g, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var S = d != null && d.touches ? kn(d) : [], w = S.length;
        w === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new _a(S));
        var v = a._getPosition(), _ = an(), M = !C && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = C || M ? 0 : _, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", qt({ data: a.data, datas: a.data, isDouble: M, isDrag: C, isClick: !C, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, v)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
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
    a._window = rl(o) ? o : xe(o), a.options = qt({ checkInput: !1, container: o && !("document" in o) ? xe(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      $t(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      $t(d, "mousedown", a.onDragStart), $t(d, "mousemove", a._passCallback);
    }), $t(l, "contextmenu", a._onContextMenu)), c && $t(xe(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        $t(d, "touchstart", a.onDragStart, f), $t(d, "touchmove", a._passCallback, f);
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
    return r === void 0 && (r = this._prevInputEvent), qt(qt({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: r });
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
      var i = new _a(kn(r));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", qt(qt({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: r, isTrusted: this._isTrusted, preventDefault: function() {
        r.preventDefault();
      }, preventDrag: function() {
        n._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(r, n) {
    if (!(!this.flag || !this.pinchFlag || n.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", qt(qt({ data: this.data, datas: this.data, movement: this.getMovement(n), angle: a.getAngle(n), rotation: a.getRotation(n), touches: a.getPositions(n), scale: a.getScale(n), distance: a.getDistance(n) }, a.getPosition(n)), { inputEvent: r, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(r) {
    if (this.pinchFlag) {
      var n = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", qt(qt({ data: this.data, datas: this.data, isPinch: n, touches: a.getPositions() }, a.getPosition()), { inputEvent: r }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(r, n, a) {
    var i = this._getPosition(r, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), qt(qt({ data: this.data, datas: this.data }, i), { movement: this.getMovement(r), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: n, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(r) {
    this.clientStores.splice(0, 0, r);
  }, e.prototype._getPosition = function(r, n) {
    var a = this.getCurrentStore(), i = a.getPosition(r, n), o = this.clientStores.slice(1).reduce(function(u, c) {
      var f = c.getPosition();
      return u.distX += f.distX, u.distY += f.distY, u;
    }, i), s = o.distX, l = o.distY;
    return qt(qt({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var r = this._window, n = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && ($t(n, "dragover", this.onDrag, a), $t(r, "dragend", this.onDragEnd)), this._useMouse && ($t(n, "mousemove", this.onDrag), $t(r, "mouseup", this.onDragEnd)), this._useTouch && ($t(n, "touchmove", this.onDrag, a), $t(r, "touchend", this.onDragEnd, a), $t(r, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var r = this._window, n = this.options.container;
    this._isDragAPI && (Wt(n, "dragover", this.onDrag), Wt(r, "dragend", this.onDragEnd)), this._useMouse && (Wt(n, "mousemove", this.onDrag), Wt(r, "mouseup", this.onDragEnd)), this._useTouch && (Wt(n, "touchstart", this.onDragStart), Wt(n, "touchmove", this.onDrag), Wt(r, "touchend", this.onDragEnd), Wt(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(fn);
function Pf(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Of = Pf;
function zf(t) {
  return Of(t).toString(36);
}
function Af(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Nf(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? ir(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Bf(t, e, r, n, a) {
  var i = _e(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = Nf(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function dl(t) {
  var e = "rCS" + zf(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Af(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Bf(e, t, n, r, a);
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
var ri = function() {
  return ri = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, ri.apply(this, arguments);
};
function jf(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function pl(t, e) {
  var r = dl(e), n = r.className;
  return st.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = jf(a, ["className", "cspNonce"]), u = st.useRef();
    return st.useImperativeHandle(i, function() {
      return u.current;
    }, []), st.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), st.createElement(t, ri({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var ni = function(t, e) {
  return ni = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, ni(t, e);
};
function dn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  ni(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var I = function() {
  return I = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, I.apply(this, arguments);
};
function Gf(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Ff(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function Lf(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function O(t, e) {
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
function Z(t, e, r) {
  if (arguments.length === 2) for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function pn(t, e) {
  return I({ events: [], props: [], name: t }, e);
}
var Wf = ["n", "w", "s", "e"], Ni = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Yf(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Xf(t) {
  var e = Yf(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var Br = Ac(), vl = Br.browser.webkit, hl = vl && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), gl = Br.browser.name, ml = parseInt(Br.browser.version, 10), Hf = gl === "chrome", qf = Br.browser.chromium, Vf = parseInt(Br.browser.chromiumVersion, 10) || 0, $f = Hf && ml >= 109 || qf && Vf >= 109, Uf = gl === "firefox", Kf = parseInt(Br.browser.webkitVersion, 10) >= 612 || ml >= 15, Bi = "moveable-", Zf = Ni.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), Jf = `
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
`.concat(Zf, `
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
`).concat(Xf(t), `
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

`).concat(hl ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), Qf = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], ai = 1e-4, le = 1e-7, Tn = 1e-9, ii = Math.pow(10, 10), Xo = -ii, td = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, ji = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, xl = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, ed = [
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
function vn(t, e, r, n, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(r, t.inputEvent)) !== null && s !== void 0 ? s : {}, u = l.originalDatas || l.datas, c = u[i] || (u[i] = {});
  return I(I({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Rr = /* @__PURE__ */ (function() {
  function t(e) {
    var r;
    e === void 0 && (e = "draggable"), this.ableName = e, this.prevX = 0, this.prevY = 0, this.startX = 0, this.startY = 0, this.isDrag = !1, this.isFlag = !1, this.datas = {
      draggable: {}
    }, this.datas = (r = {}, r[e] = {}, r);
  }
  return t.prototype.dragStart = function(e, r) {
    this.isDrag = !1, this.isFlag = !1;
    var n = r.originalDatas;
    return this.datas = n, n[this.ableName] || (n[this.ableName] = {}), I(I({}, this.move(e, r.inputEvent)), { type: "dragstart" });
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
function kr(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = dr(t, r, n, i), s = O(o, 4), l = O(s[0], 2), u = l[0], c = l[1], f = O(s[1], 2), d = f[0], p = f[1], h = O(s[2], 2), g = h[0], x = h[1], y = O(s[3], 2), b = y[0], C = y[1], S = O(Gt(t, e, i), 2), w = S[0], v = S[1], _ = Math.min(u, d, g, b), M = Math.min(c, p, x, C), T = Math.max(u, d, g, b), k = Math.max(c, p, x, C);
  u = u - _ || 0, d = d - _ || 0, g = g - _ || 0, b = b - _ || 0, c = c - M || 0, p = p - M || 0, x = x - M || 0, C = C - M || 0, w = w - _ || 0, v = v - M || 0;
  var A = t[0], z = t[i + 1], R = oe(A * z);
  return {
    left: _,
    top: M,
    right: T,
    bottom: k,
    origin: [w, v],
    pos1: [u, c],
    pos2: [d, p],
    pos3: [g, x],
    pos4: [b, C],
    direction: R
  };
}
function yl(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, p = O(ct(zr(s, [r - c, n - f], d), u), 2), h = p[0], g = p[1], x = O(Oe({ datas: a, distX: h, distY: g }), 2), y = x[0], b = x[1];
  return [y, b];
}
function fr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, p = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = ke(a, p), r.inverseBeforeMatrix = ke(i, p), r.absoluteOrigin = sr(wt([s, l], u), p), r.startDragBeforeDist = ne(r.inverseBeforeMatrix, r.absoluteOrigin, p), r.startDragDist = ne(r.inverseMatrix, r.absoluteOrigin, p);
}
function rd(t) {
  return kr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function sa(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Ge(o, function(p) {
    return p.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : ve(l, function(p) {
    return p.index === i && p.functionName === r;
  }) ? u = i : u = i + l.filter(function(p) {
    return p.index < i;
  }).length;
  var c = kp(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = Z(Z([], O(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function la(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function nd(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = O(Sl({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = bl(e, af([i, o], 4));
  return ne(s, sr([0, 0, 0], 4), 4);
}
function bl(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? Pt(s, e, 4) : Pt(e, s, 4), u = Pt(ke(r ? i : n, 4), l, 4), c = Pt(u, ke(r ? o : a, 4), 4);
  return c;
}
function Sl(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return ct(ne(a, wt(s, [r, n]), l), o);
}
function Oe(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return ct(ne(e ? i : o, wt(c, [n, a]), f), e ? l : u);
}
function ad(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return ct(ne(i, wt(s, [n, a]), u), l);
}
function id(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = or(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var p = f ? i[s] / f : 0;
      return d * p;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function Cl(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function od(t, e) {
  return Cl(e).map(function(r) {
    return t[r];
  });
}
function Ma(t, e) {
  var r = (e + 1) / 2;
  return [
    Hn(t[0][0], t[1][0], r, 1 - r),
    Hn(t[0][1], t[1][1], r, 1 - r)
  ];
}
function Qt(t, e) {
  var r = Ma([t[0], t[1]], e[0]), n = Ma([t[2], t[3]], e[0]);
  return Ma([r, n], e[1]);
}
function sd(t, e, r, n, a, i) {
  var o = dr(e, r, n, a), s = Qt(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function hn(t, e, r, n) {
  return Pt(t, Qr(e, n, r), n);
}
function ld(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (be(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Te(Tr(r), 4, s) : l = Te(Pt(Pt(u, Tr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return hn(i, l, a, s);
}
function ud(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return hn(n, Pt(o || i, Ri(e, s), s), r, s);
}
function ua(t, e) {
  var r = jr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Yt(n) ? n : Ve(n), oi(t, e, a);
    },
    setTransformIndex: function(n) {
      oi(t, e, n);
    }
  };
}
function ca(t, e, r) {
  var n = jr(e), a = n.startTransforms;
  oi(t, e, Ge(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function oi(t, e, r) {
  var n = jr(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
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
function Gi(t, e) {
  var r = jr(t);
  r.nextTransforms = Ve(e);
}
function jr(t) {
  return t.originalDatas.beforeRenderable;
}
function Kn(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function In(t) {
  return (Kn(t) || []).join(" ");
}
function Rn(t) {
  return jr(t).nextStyle;
}
function El(t, e, r, n, a) {
  Gi(a, e);
  var i = ie.drag(t, vn(a, t.state, r, n)), o = i ? i.transform : e;
  return I(I({ transform: e, drag: i }, se({
    transform: o
  }, a)), { afterTransform: o });
}
function Fi(t, e, r, n, a, i) {
  var o = ld(t.state, a, e, i), s = dd(t, r, n, o);
  return s;
}
function Dl(t, e, r, n, a, i, o) {
  var s = Fi(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, p = f ? c : 0, h = ct(n, s);
  return ct(h, [d, p]);
}
function cd(t, e, r, n, a, i, o) {
  var s = Dl(t, e, r, n, a, i, o);
  return s;
}
function fd(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function dd(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Gt(n, u, l);
}
function pd(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return Dl(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function vd(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, p = s.left, h = s.top, g = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, b = id(a, e, r, f, d, l), C = o ? p : 0, S = o ? h : 0, w = hn(u, x, b, y), v = sd(n, w, e, r, y, g);
  return ct(v, [C, S]);
}
function hd(t, e) {
  return Qt(Ce(t.state), e);
}
function gd(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function md(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function xd(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function wl(t, e, r) {
  for (var n = t, a = [], i = Ii(t) || Ke(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, p = !1, h = ln(e, e, !0).offsetParent, g = 1; n && !s; ) {
    s = o;
    var x = de(n), y = x("position"), b = Ul(n), C = y === "fixed", S = xd(x), w = of(hp(b)), v = void 0, _ = !1, M = !1, T = 0, k = 0, A = 0, z = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    C && (p = !0, R = bp(n), h = R.fixedContainer);
    var B = w.length;
    !l && (B === 16 || S.length) && (l = !0, u = 4, di(a), d && (d = Te(d, 3, 4))), l && B === 9 && (w = Te(w, 3, 4));
    var N = yp(n, t), L = N.tagName, V = N.hasOffset, G = N.isSVG, W = N.origin, $ = N.targetOrigin, j = N.offset, J = O(j, 2), Q = J[0], H = J[1];
    L === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: Sp(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }));
    var tt = parseFloat(x("zoom")) || 1;
    if (C)
      v = R.fixedContainer, _ = !0;
    else {
      var U = ln(n, e, !1, !0, x), et = U.offsetZoom;
      if (v = U.offsetParent, _ = U.isEnd, M = U.isStatic, g *= et, (U.isCustomElement || et !== 1) && M)
        Q -= v.offsetLeft, H -= v.offsetTop;
      else if (Uf || $f) {
        var lt = U.parentSlotElement;
        if (lt) {
          for (var ft = v, xt = 0, q = 0; ft && md(ft); )
            xt += ft.offsetLeft, q += ft.offsetTop, ft = ft.offsetParent;
          Q -= xt, H -= q;
        }
      }
    }
    if (vl && !Kf && V && !G && M && (y === "relative" || y === "static") && (Q -= v.offsetLeft, H -= v.offsetTop, o = o || _), C)
      V && R.hasTransform && (A = v.clientLeft, z = v.clientTop);
    else if (V && h !== v && (T = v.clientLeft, k = v.clientTop), V && v === i) {
      var nt = Kl(n, !1);
      Q += nt[0], H += nt[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: Qr(w, u, W)
    }), S.length && (a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: Qr(Tr(S), u, W)
    })), V) {
      var Et = n === t, pt = Et ? 0 : n.scrollLeft, vt = Et ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: lr([
          Q - pt + T - A,
          H - vt + k - z
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: W
      });
    if (tt !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: Qr(Ri([tt, tt], u), u, [0, 0])
    }), d || (d = w), c || (c = W), f || (f = $), s || C)
      break;
    n = v, o = _, (!r || n === i) && (s = o);
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
var er = null, rr = null, Er = null;
function Pr(t) {
  t ? (window.Map && (er = /* @__PURE__ */ new Map(), rr = /* @__PURE__ */ new Map()), Er = []) : (er = null, Er = null, rr = null);
}
function yd(t) {
  var e = rr == null ? void 0 : rr.get(t);
  if (e)
    return e;
  var r = tn(t, !0);
  return rr && rr.set(t, r), r;
}
function bd(t, e) {
  if (Er) {
    var r = ve(Er, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = wl(t, e, !0);
  return Er && Er.push([[t, e], n]), n;
}
function de(t) {
  var e = er == null ? void 0 : er.get(t);
  if (!e) {
    var r = xe(t).getComputedStyle(t);
    if (!er)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, er.set(t, e);
  }
  var n = e.cached, a = e.style;
  return function(i) {
    return i in n || (n[i] = a[i]), n[i];
  };
}
function Me(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, I(I({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function ka(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Me(t, e.name, a), d = t.moveables, p = [], h = f.map(function(g, x) {
    var y = d[x], b = y.state, C = b.gestos, S = g;
    if (s)
      S = new Rr(o).dragStart(n, g), p.push(S);
    else {
      if (C[o] || (C[o] = c.childGestos[x]), !C[o])
        return;
      S = vn(g, b, n, u, i, o), p.push(S);
    }
    var w = e[r](y, I(I({}, S), { parentFlag: !0 }));
    return l && (C[o] = null), w;
  });
  return s && (c.childGestos = d.map(function(g) {
    return g.state.gestos[o];
  })), {
    eventParams: h,
    childEvents: p
  };
}
function je(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Me(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], p = c;
    p = a(d, c);
    var h = e[r](d, I(I({}, p), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), h;
  });
  return u;
}
function Zn(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || Ce(e.state), s = Qt(o, a), l = O(ne(cn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function _l(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = cr(t.props, e).zoom, u = Jr(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(h) {
    var g = h.dir;
    c[g] = !0;
  });
  var p = oe(s);
  return r.map(function(h) {
    var g = h.data, x = h.classNames, y = h.dir, b = ji[y];
    if (!b || !c[y])
      return null;
    d[y] = !0;
    var C = (gt(u, 15) + p * xl[y] + 720) % 180, S = {};
    return Nr(g).forEach(function(w) {
      S["data-".concat(w)] = g[w];
    }), n.createElement("div", I({ className: ut.apply(void 0, Z(["control", "direction", y, e], O(x), !1)), "data-rotation": C, "data-direction": y }, S, { key: "direction-".concat(y), style: ea.apply(void 0, Z([o, l], O(b.map(function(w) {
      return i[w];
    })), !1)) }));
  });
}
function Ml(t, e, r, n) {
  var a = cr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? Ni : o;
  return Z(Z([], O(s ? Rl(t, n, r, l) : []), !1), O(_l(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function sn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Xt(r, n), u = e ? gt(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: ut.apply(void 0, Z(["line", "direction", e ? "edge" : "", e], O(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: $r(r, n, a, l) });
}
function kl(t, e, r, n, a) {
  var i = r === !0 ? Wf : r;
  return i.map(function(o, s) {
    var l = O(ji[o], 2), u = l[0], c = l[1];
    if (c != null)
      return sn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function Tl(t) {
  return function(e, r) {
    var n = cr(e.props, t).edge;
    return n && (n === !0 || n.length) ? Z(Z([], O(kl(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), O(Sd(e, t, r)), !1) : Il(e, t, r);
  };
}
function Il(t, e, r) {
  return Ml(t, Ni, e, r);
}
function Sd(t, e, r) {
  return Ml(t, ["nw", "ne", "sw", "se"], e, r);
}
function Rl(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = oe(l), d = s / Math.PI * 180;
  return (n || Nr(u)).map(function(p) {
    var h = ji[p];
    if (!h)
      return null;
    var g = (gt(d, 15) + f * xl[p] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: ut.apply(void 0, Z([], O(x), !1)), "data-rotation": g, "data-direction": p, key: "direction-around-".concat(p), style: ea.apply(void 0, Z([s, c], O(h.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function Li(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, p = d === void 0 ? 1 / 0 : d, h = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: p
  };
  return {
    vertical: Ho(h, e, !0),
    horizontal: Ho(h, r, !1)
  };
}
function fa(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, p = e || t.props.bounds || {}, h = p.position || "client", g = h === "css", x = p.left, y = x === void 0 ? -1 / 0 : x, b = p.top, C = b === void 0 ? -1 / 0 : b, S = p.right, w = S === void 0 ? g ? -1 / 0 : 1 / 0 : S, v = p.bottom, _ = v === void 0 ? g ? -1 / 0 : 1 / 0 : v;
  return g && (w = i + f - u - w, _ = a + d - c - _), {
    left: y + u - o,
    right: w + u - o,
    top: C + c - s,
    bottom: _ + c - s
  };
}
function Cd(t, e, r) {
  var n = fa(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = O(r, 2), u = l[0], c = l[1], f = O(ct(r, e), 2), d = f[0], p = f[1];
  Y(d) < le && (d = 0), Y(p) < le && (p = 0);
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
    var b = p / d, C = r[1] - b * u, S = 0, w = 0, v = !1;
    g && o <= u ? (S = b * o + C, w = o, v = !0) : !g && u <= a && (S = b * a + C, w = a, v = !0), v && (S < i || S > s) && (v = !1), v || (h && s <= c ? (S = s, w = (S - C) / b, v = !0) : !h && c <= i && (S = i, w = (S - C) / b, v = !0)), v && (x.isBound = !0, x.pos = w, x.offset = u - w, y.isBound = !0, y.pos = S, y.offset = c - S);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function Ho(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, Z([], O(e), !1)), o = Math.max.apply(Math, Z([], O(e), !1)), s = [];
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
function qo(t, e, r) {
  var n = r ? t.map(function(a) {
    return un(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && Y(a[0] - e.left) > 0.1 || a[0] > e.right && Y(a[0] - e.right) > 0.1 || a[1] < e.top && Y(a[1] - e.top) > 0.1 || a[1] > e.bottom && Y(a[1] - e.bottom) > 0.1;
  });
}
function Ed(t, e, r) {
  var n = Se(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return Y(i - t[r ? 0 : 1]) - Y(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Xt([0, 0], r ? [i, e] : [e, i]);
  });
}
function Dd(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = fa(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], p = l - n[1], h = c - n[1], g = {
    left: f,
    top: p,
    right: d,
    bottom: h
  };
  if (!qo(r, g, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [p, 1],
    [h, 1]
  ].forEach(function(y) {
    var b = O(y, 2), C = b[0], S = b[1];
    r.forEach(function(w) {
      var v = Xt([0, 0], w);
      x.push.apply(x, Z([], O(Ed(w, C, S).map(function(_) {
        return i + _ - v;
      }).filter(function(_) {
        return !qo(e, g, _);
      }).map(function(_) {
        return gt(_ * 180 / Math.PI, le);
      })), !1));
    });
  }), x;
}
var wd = ["left", "right", "center"], _d = ["top", "bottom", "middle"], Vo = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, $e = {
  start: "left",
  end: "right",
  center: "center"
}, Ue = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function Dr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function Gr(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function Wi(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Md(t, e) {
  var r = Wi(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function Yi(t, e) {
  var r = Md(t, e), n = _d.filter(function(i) {
    return i in r;
  }), a = wd.filter(function(i) {
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
function kd(t, e, r) {
  var n = Gt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function Td(t) {
  var e = O(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Ut && (a = 0), Math.abs(i) < Ut && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return gt(u, Ut);
  });
}
var Pl = "snapRotationThreshold", Ol = "snapRotationDegrees", zl = "snapHorizontalThreshold", Al = "snapVerticalThreshold";
function da(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = ls(o, l[zl], 5), f = ls(i, l[Al], 5);
  return Nl(t.state.guidelines, e, r, n, a, c, f, u);
}
function Nl(t, e, r, n, a, i, o, s) {
  return {
    vertical: Uo(t, "vertical", e, o * s[0], n),
    horizontal: Uo(t, "horizontal", r, i * s[1], a)
  };
}
function Id(t, e, r) {
  var n = O(r, 2), a = n[0], i = n[1], o = O(e, 2), s = o[0], l = o[1], u = O(ct(r, e), 2), c = u[0], f = u[1], d = f > 0, p = c > 0;
  c = ra(c), f = ra(f);
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
  var x = da(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, b = x.horizontal;
  y.posInfos.filter(function(L) {
    var V = L.pos;
    return p ? V >= s : V <= s;
  }), b.posInfos.filter(function(L) {
    var V = L.pos;
    return d ? V >= l : V <= l;
  }), y.isSnap = y.posInfos.length > 0, b.isSnap = b.posInfos.length > 0;
  var C = si(y), S = C.isSnap, w = C.guideline, v = si(b), _ = v.isSnap, M = v.guideline, T = _ ? M.pos[1] : 0, k = S ? w.pos[0] : 0;
  if (c === 0)
    _ && (g.isSnap = !0, g.pos = M.pos[1], g.offset = i - g.pos);
  else if (f === 0)
    S && (h.isSnap = !0, h.pos = k, h.offset = a - k);
  else {
    var A = f / c, z = r[1] - A * a, R = 0, B = 0, N = !1;
    S ? (B = k, R = A * B + z, N = !0) : _ && (R = T, B = (R - z) / A, N = !0), N && (h.isSnap = !0, h.pos = B, h.offset = a - B, g.isSnap = !0, g.pos = R, g.offset = i - R);
  }
  return {
    vertical: h,
    horizontal: g
  };
}
function Xe(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function $o(t, e, r, n) {
  var a = Yi(t.props.snapDirections, e), i = da(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return Xe(l);
  }), a.horizontalNames.map(function(l) {
    return Xe(l);
  }), r, n), o = Xe(a.horizontalNames[i.horizontal.index]), s = Xe(a.verticalNames[i.vertical.index]);
  return {
    vertical: I(I({}, i.vertical), { direction: s }),
    horizontal: I(I({}, i.horizontal), { direction: o })
  };
}
function si(t) {
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
function Uo(t, e, r, n, a) {
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
        dist: Y(y),
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
function Rd(t, e, r, n, a) {
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
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, Z([], O(od([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return Qt(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = da(t, s, l, i.map(function(d) {
    return Xe(d[0]);
  }), i.map(function(d) {
    return Xe(d[1]);
  }), n, a), c = Xe(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = Xe(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: I(I({}, u.vertical), { direction: c }),
    horizontal: I(I({}, u.horizontal), { direction: f })
  };
}
function Bl(t, e) {
  var r = Y(t.offset), n = Y(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < le ? 1 : n < le ? -1 : r - n;
}
function Jn(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Bl({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Pd(t, e, r) {
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
function jl(t, e) {
  var r = Va([e[0][0], e[1][0]]), n = Va([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function Xi(t, e) {
  var r = O(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  Y(i) < le && (i = 0), Y(o) < le && (o = 0);
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
function Gl(t, e, r, n) {
  return n === void 0 && (n = le), t.every(function(a) {
    var i = Xi(a, e), o = i <= 0;
    return o === r || Y(i) <= n;
  });
}
function Ko(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Od(t, e) {
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
  if (Gl([
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
  var x = He(r, o, p, a), y = He(r, o, g, a), b = He(r, o, d, i), C = He(r, o, h, i), S = x.isBound && y.isBound, w = x.isBound || y.isBound, v = b.isBound && C.isBound, _ = b.isBound || C.isBound, M = Or(x.offset, y.offset), T = Or(b.offset, C.offset), k = [0, 0], A = !1, z = !1;
  return Y(T) < Y(M) ? (k = [M, 0], A = w, z = S) : (k = [0, T], A = _, z = v), {
    isAllBound: z,
    isVerticalBound: w,
    isHorizontalBound: _,
    isBound: A,
    offset: k
  };
}
function He(t, e, r, n, a, i) {
  var o = O(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = ra(f[1] - c[1]), p = ra(f[0] - c[0]), h = l, g = s, x = -s / l;
  if (p) {
    if (!d) {
      if (i && !h)
        return {
          isBound: !1,
          offset: 0
        };
      if (g) {
        var S = (c[1] - u[1]) / x + u[0];
        return Ko(S, c[0], f[0], n, a);
      } else {
        var b = c[1] - u[1], C = Y(b) <= (a || 0);
        return {
          isBound: C,
          offset: C ? b : 0
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
      return Ko(y, c[1], f[1], n, a);
    } else {
      var b = c[0] - u[0], C = Y(b) <= (a || 0);
      return {
        isBound: C,
        offset: C ? b : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function Fl(t, e, r) {
  return e.map(function(n) {
    var a = Od(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Oe({
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
function zd(t, e, r) {
  var n, a = Hi(t, e, [0, 0], !1).map(function(d) {
    return I(I({}, d), { multiple: d.multiple.map(function(p) {
      return Y(p) * 2;
    }) });
  }), i = Fl(t, a, r), o = Jn(i, 0), s = Jn(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = O(ad({
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
function Ad(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function Hi(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = dr(i, 100, 100, o ? 4 : 3), l = Qt(s, [0, 0]);
  return Ad(r, n).map(function(u) {
    var c = O(u, 3), f = c[0], d = c[1], p = c[2], h = [
      Qt(s, d),
      Qt(s, p)
    ], g = Td(h), x = jl(l, h), y = x.vertical, b = x.horizontal, C = Xi(l, h) <= 0;
    return {
      multiple: f,
      centerSign: C,
      verticalSign: y,
      horizontalSign: b,
      lineConstants: g,
      line: [
        Qt(e, d),
        Qt(e, p)
      ]
    };
  });
}
function Zo(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return un(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Xi(r, i) <= 0;
    return !Gl(e, i, o);
  });
}
function Nd(t) {
  var e = O(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return Y(r[0]);
  if (!i)
    return Y(r[1]);
  var o = i / a;
  return Y((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Bd(t) {
  var e = O(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
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
function jd(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], p = l - n[1], h = l + c - n[1], g = [
    [f, p],
    [d, p],
    [f, h],
    [d, h]
  ], x = Qt(r, [0, 0]);
  if (!Zo(r, g, x, 0))
    return [];
  var y = [], b = g.map(function(C) {
    return [
      Se(C),
      Xt([0, 0], C)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(C) {
    var S = Xt([0, 0], Bd(C)), w = Nd(C);
    y.push.apply(y, Z([], O(b.filter(function(v) {
      var _ = O(v, 1), M = _[0];
      return M && w <= M;
    }).map(function(v) {
      var _ = O(v, 2), M = _[0], T = _[1], k = Math.acos(M ? w / M : 0), A = T + k, z = T - k;
      return [
        o + A - S,
        o + z - S
      ];
    }).reduce(function(v, _) {
      return v.push.apply(v, Z([], O(_), !1)), v;
    }, []).filter(function(v) {
      return !Zo(e, g, x, v);
    }).map(function(v) {
      return gt(v * 180 / Math.PI, le);
    })), !1));
  }), y;
}
function Gd(t) {
  var e = t.props.innerBounds, r = Dr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = Qt(l, [0, 0]), c = e.left, f = e.top, d = e.width, p = e.height, h = [[c, f], [c, f + p]], g = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + p]], y = [[c, f + p], [c + d, f + p]], b = Hi(t, l, [0, 0], !1), C = [], S = [];
  return b.forEach(function(w) {
    var v = w.line, _ = w.lineConstants, M = jl(u, v), T = M.horizontal, k = M.vertical, A = He(v, _, g, k, 1, !0), z = He(v, _, y, k, 1, !0), R = He(v, _, h, T, 1, !0), B = He(v, _, x, T, 1, !0);
    A.isBound && !r.top && (C.push(f), r.top = !0), z.isBound && !r.bottom && (C.push(f + p), r.bottom = !0), R.isBound && !r.left && (S.push(c), r.left = !0), B.isBound && !r.right && (S.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: C,
    vertical: S
  };
}
function Fd(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (Y(a) < Ut && (a = 0), Y(i) < Ut && (i = 0), !a)
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
function li(t, e, r, n, a) {
  var i = Fd(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Re(t, e), s = Re(i, t), l = Re(i, e), u = s > o || l > o, c = O(Oe({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function Qn(t, e) {
  return t.isBound ? t.offset : e.isSnap ? si(e).offset : 0;
}
function Ld(t, e, r, n, a) {
  var i = O(e, 2), o = i[0], s = i[1], l = O(r, 2), u = l[0], c = l[1], f = O(n, 2), d = f[0], p = f[1], h = O(a, 2), g = h[0], x = h[1], y = -g, b = -x;
  if (t && o && s) {
    y = 0, b = 0;
    var C = [];
    if (u && c ? C.push([0, x], [g, 0]) : u ? C.push([g, 0]) : c ? C.push([0, x]) : d && p ? C.push([0, x], [g, 0]) : d ? C.push([g, 0]) : p && C.push([0, x]), C.length) {
      C.sort(function(_, M) {
        return Se(ct([o, s], _)) - Se(ct([o, s], M));
      });
      var S = C[0];
      if (S[0] && Y(o) > Ut)
        y = -S[0], b = s * Y(o + y) / Y(o) - s;
      else if (S[1] && Y(s) > Ut) {
        var w = s;
        b = -S[1], y = o * Y(s + b) / Y(w) - o;
      }
      if (t && c && u)
        if (Y(y) > Ut && Y(y) < Y(g)) {
          var v = Y(g) / Y(y);
          y *= v, b *= v;
        } else if (Y(b) > Ut && Y(b) < Y(x)) {
          var v = Y(x) / Y(b);
          y *= v, b *= v;
        } else
          y = Or(-g, y), b = Or(-x, b);
    }
  } else
    y = o || u ? -g : 0, b = s || c ? -x : 0;
  return [y, b];
}
function Wd(t, e, r, n, a, i) {
  if (!Gr(t, "draggable"))
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
  var o = $i(i.absolutePoses, [e, r]), s = ye(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(B) {
      return B[1];
    }),
    vertical: o.map(function(B) {
      return B[0];
    })
  }, p = Wi(t.props.snapDirections), h = Yi(p, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), g = pa(t, a, h, d), x = g.vertical, y = g.horizontal, b = zd(t, o, i), C = b.vertical, S = b.horizontal, w = x.isSnap, v = y.isSnap, _ = x.isBound || C.isBound, M = y.isBound || S.isBound, T = Or(x.offset, C.offset), k = Or(y.offset, S.offset), A = O(Ld(n, [e, r], [_, M], [w, v], [T, k]), 2), z = A[0], R = A[1];
  return [
    {
      isBound: _,
      isSnap: w,
      offset: z
    },
    {
      isBound: M,
      isSnap: v,
      offset: R
    }
  ];
}
function pa(t, e, r, n) {
  n === void 0 && (n = r);
  var a = Li(fa(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : da(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Qn(i[0], l), f = Qn(o[0], u), d = Y(c), p = Y(f);
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
function Jo(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = Li(e, r, n), l = s.horizontal, u = s.vertical, c = Nl(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, p = Qn(l[0], f), h = Qn(u[0], d), g = Y(p), x = Y(h);
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
function Yd(t, e, r, n) {
  var a = Xt(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, p = a % 180, h = p < 3 || p > 177, g = p > 87 && p < 93;
  return d < l && (o || s && !g && (!n || !h)) ? "vertical" : c || f && !h && (!n || !g) ? "horizontal" : "";
}
function Xd(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = O(o, 2), l = s[0], u = s[1], c = Qt(e, l), f = Qt(e, u), d = n ? Hd(t, c, f, a) : pa(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), p = d.horizontal, h = p.offset, g = p.isBound, x = p.isSnap, y = d.vertical, b = y.offset, C = y.isBound, S = y.isSnap, w = ct(u, l);
    if (!b && !h)
      return {
        isBound: C || g,
        isSnap: S || x,
        sign: w,
        offset: [0, 0]
      };
    var v = Yd(c, f, d, n);
    if (!v)
      return {
        sign: w,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var _ = v === "vertical", M = [0, 0];
    return !n && Y(u[0]) === 1 && Y(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? M = Oe({
      datas: i,
      distX: -b,
      distY: -h
    }) : M = li(c, f, -(_ ? b : h), _, i).offset, M = M.map(function(T, k) {
      return T * (w[k] ? 2 / w[k] : 0);
    }), {
      sign: w,
      isBound: _ ? C : g,
      isSnap: _ ? S : x,
      offset: M
    };
  });
}
function Qo(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Hd(t, e, r, n) {
  var a = Cd(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Id(t, e, r), l = s.horizontal, u = s.vertical, c = Qo(i, l), f = Qo(o, u), d = Y(c), p = Y(f);
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
function qd(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], p = u.left, h = p === void 0 ? -1 / 0 : p, g = u.top, x = g === void 0 ? -1 / 0 : g, y = u.right, b = y === void 0 ? 1 / 0 : y, C = u.bottom, S = C === void 0 ? 1 / 0 : C;
    d.forEach(function(w) {
      var v = w[0] !== i[0], _ = w[1] !== i[1], M = Qt(e, w), T = Xt(n, M) * 360 / Math.PI;
      if (_) {
        var k = M.slice();
        (Y(T - 360) < 2 || Y(T - 180) < 2) && (k[1] = n[1]);
        var A = li(n, k, (n[1] < M[1] ? S : x) - M[1], !1, a), z = O(A.offset, 2), R = z[1], B = A.isOutside;
        isNaN(R) || (f = l + (B ? 1 : -1) * Y(R));
      }
      if (v) {
        var k = M.slice();
        (Y(T - 90) < 2 || Y(T - 270) < 2) && (k[0] = n[0]);
        var N = li(n, k, (n[0] < M[0] ? b : h) - M[0], !0, a), L = O(N.offset, 1), V = L[0], G = N.isOutside;
        isNaN(V) || (c = s + (G ? 1 : -1) * Y(V));
      }
    });
  }
  return {
    maxWidth: c,
    maxHeight: f
  };
}
var ie = {
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
    var c = Se(u), f = Xt(u, [0, 0]);
    return [e.createElement("div", { className: ut("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], fr(t, e), ca(t, e, "translate"), fp(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = bt(t, e, I({ set: function(c) {
      r.startValue = c;
    } }, ua(t, e))), u = n || rt(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      sa(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, p = r.isDrag, h = r.prevDist, g = r.prevBeforeDist, x = r.startValue;
      if (p) {
        o && (f += o[0], d += o[1]);
        var y = t.props, b = y.parentMoveable, C = u ? 0 : y.throttleDrag || c || 0, S = n ? 0 : y.throttleDragRotate || 0, w = 0, v = !1, _ = !1, M = !1, T = !1;
        if (!n && S > 0 && (f || d)) {
          var k = y.startDragRotate || 0, A = gt(k + Xt([0, 0], [f, d]) * 180 / Math.PI, S) - k, z = d * Math.abs(Math.cos((A - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(A / 180 * Math.PI)), B = Se([R, z]);
          w = A * Math.PI / 180, f = B * Math.cos(w), d = B * Math.sin(w);
        }
        if (!i && !n && !a) {
          var N = O(Wd(t, f, d, S, !s && l || o, r), 2), L = N[0], V = N[1];
          v = L.isSnap, _ = L.isBound, M = V.isSnap, T = V.isBound;
          var G = L.offset, W = V.offset;
          f += G, d += W;
        }
        var $ = wt(Sl({ datas: r, distX: f, distY: d }), x), j = wt(nd({ datas: r, distX: f, distY: d }), x);
        Fo(j, le), Fo($, le), S || (!v && !_ && (j[0] = gt(j[0], C), $[0] = gt($[0], C)), !M && !T && (j[1] = gt(j[1], C), $[1] = gt($[1], C)));
        var J = ct($, x), Q = ct(j, x), H = ct(Q, h), tt = ct(J, g);
        r.prevDist = Q, r.prevBeforeDist = J, r.passDelta = H, r.passDist = Q;
        var U = r.left + J[0], et = r.top + J[1], lt = r.right - J[0], ft = r.bottom - J[1], xt = la(r, "translate(".concat(j[0], "px, ").concat(j[1], "px)"), "translate(".concat(Q[0], "px, ").concat(Q[1], "px)"));
        if (Gi(e, xt), t.state.dragInfo.dist = n ? [0, 0] : Q, !(!n && !b && H.every(function(vt) {
          return !vt;
        }) && tt.some(function(vt) {
          return !vt;
        }))) {
          var q = t.state, nt = q.width, Et = q.height, pt = bt(t, e, I({ transform: xt, dist: Q, delta: H, translate: j, beforeDist: J, beforeDelta: tt, beforeTranslate: $, left: U, top: et, right: lt, bottom: ft, width: nt, height: Et, isPinch: i }, se({
            transform: xt
          }, e)));
          return !n && rt(t, "onDrag", pt), pt;
        }
      }
    }
  },
  dragAfter: function(t, e) {
    var r = e.datas, n = r.deltaOffset;
    return n[0] || n[1] ? (r.deltaOffset = [0, 0], this.drag(t, I(I({}, e), { deltaOffset: n }))) : !1;
  },
  dragEnd: function(t, e) {
    var r = e.parentEvent, n = e.datas;
    if (t.state.dragInfo = null, !!n.isDrag) {
      n.isDrag = !1;
      var a = he(t, e, {});
      return !r && rt(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = ka(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = I(I({}, s), { targets: t.props.targets, events: c }), d = rt(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var p = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [p[0] % 1, p[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, I(I({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = ka(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = I({ targets: t.props.targets, events: i }, n);
        return rt(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = ka(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return rt(t, "onDragGroupEnd", he(t, e, {
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
function Ll(t, e) {
  var r = Qt(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function Vd(t, e) {
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
function Wl(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = fd(e, a, i), l = Gt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var ts = Zi("resizable"), ui = {
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
  render: Tl("resizable"),
  dragControlCondition: ts,
  viewClassName: Ki("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = eu(o, a, n, l), d = t.state, p = d.target, h = d.width, g = d.height, x = d.gestos;
    if (!f || !p || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && fr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = h, l.startOffsetHeight = g, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = be(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function b(T) {
      l.ratio = T && isFinite(T) ? T : 0;
    }
    l.startPositions = Ce(t.state);
    function C(T) {
      var k = Ll(l.startPositions, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function S(T) {
      var k = Wl(t.state, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function w(T) {
      l.minSize = [
        Rt("".concat(T[0]), 0) || 0,
        Rt("".concat(T[1]), 0) || 0
      ];
    }
    function v(T) {
      var k = [
        T[0] || 1 / 0,
        T[1] || 1 / 0
      ];
      (!nn(k[0]) || isFinite(k[0])) && (k[0] = Rt("".concat(k[0]), 0) || 1 / 0), (!nn(k[1]) || isFinite(k[1])) && (k[1] = Rt("".concat(k[1]), 0) || 1 / 0), l.maxSize = k;
    }
    b(h / g), C(u || [-f[0], -f[1]]), l.setFixedDirection = C, l.setFixedPosition = S, l.setMin = w, l.setMax = v;
    var _ = bt(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(T) {
        var k = O(T, 2), A = k[0], z = k[1];
        l.startWidth = A, l.startHeight = z;
      },
      setMin: w,
      setMax: v,
      setRatio: b,
      setFixedDirection: C,
      setFixedPosition: S,
      setOrigin: function(T) {
        l.transformOrigin = T;
      },
      dragStart: ie.dragStart(t, new Rr().dragStart([0, 0], e))
    }), M = c || rt(t, "onResizeStart", _);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, M !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? _ : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, p = e.resolveMatrix, h = n.isResize, g = n.transformOrigin, x = n.startWidth, y = n.startHeight, b = n.prevWidth, C = n.prevHeight, S = n.minSize, w = n.maxSize, v = n.ratio, _ = n.startOffsetWidth, M = n.startOffsetHeight, T = n.isWidth;
    if (!h)
      return;
    if (p) {
      var k = t.state.is3d, A = n.startOffsetMatrix, z = n.startTransformOrigin, R = k ? 4 : 3, B = Tr(Kn(e)), N = Math.sqrt(B.length);
      R !== N && (B = Te(B, N, R));
      var L = hn(A, B, z, R), V = dr(L, _, M, R);
      n.startPositions = V, n.nextTargetMatrix = B, n.nextAllMatrix = L;
    }
    var G = cr(t.props, "resizable"), W = G.resizeFormat, $ = G.throttleResize, j = $ === void 0 ? a ? 0 : 1 : $, J = G.parentMoveable, Q = G.keepRatioFinally, H = n.direction, tt = H, U = 0, et = 0;
    !H[0] && !H[1] && (tt = [1, 1]);
    var lt = v && (o ?? G.keepRatio) || !1;
    function ft() {
      var Ft = n.fixedDirection, Ot = su(tt, lt, n, e);
      U = Ot.distWidth, et = Ot.distHeight;
      var kt = tt[0] - Ft[0] || lt ? Math.max(_ + U, le) : _, Ee = tt[1] - Ft[1] || lt ? Math.max(M + et, le) : M;
      return lt && _ && M && (T ? Ee = kt / v : kt = Ee * v), [kt, Ee];
    }
    var xt = O(ft(), 2), q = xt[0], nt = xt[1];
    d || (n.setFixedDirection(n.fixedDirection), rt(t, "onBeforeResize", bt(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Ft) {
        var Ot;
        return n.setFixedDirection(Ft), Ot = O(ft(), 2), q = Ot[0], nt = Ot[1], [q, nt];
      },
      setFixedPosition: function(Ft) {
        var Ot;
        return n.setFixedPosition(Ft), Ot = O(ft(), 2), q = Ot[0], nt = Ot[1], [q, nt];
      },
      boundingWidth: q,
      boundingHeight: nt,
      setSize: function(Ft) {
        var Ot;
        Ot = O(Ft, 2), q = Ot[0], nt = Ot[1];
      }
    }, !0)));
    var Et = s;
    s || (!a && i ? Et = hd(t, [0, 0]) : Et = n.fixedPosition);
    var pt = [0, 0];
    i || (pt = up(t, q, nt, H, Et, !u && c, n)), l && (!l[0] && (pt[0] = 0), !l[1] && (pt[1] = 0));
    function vt() {
      var Ft;
      W && (Ft = O(W([q, nt]), 2), q = Ft[0], nt = Ft[1]), q = gt(q, j), nt = gt(nt, j);
    }
    if (lt) {
      tt[0] && tt[1] && pt[0] && pt[1] && (Y(pt[0]) > Y(pt[1]) ? pt[1] = 0 : pt[0] = 0);
      var St = !pt[0] && !pt[1];
      St && vt(), tt[0] && !tt[1] || pt[0] && !pt[1] || St && T ? (q += pt[0], nt = q / v) : (!tt[0] && tt[1] || !pt[0] && pt[1] || St && !T) && (nt += pt[1], q = nt * v);
    } else
      q += pt[0], nt += pt[1], q = Math.max(0, q), nt = Math.max(0, nt);
    r = O(ki([q, nt], S, w, lt ? v : !1), 2), q = r[0], nt = r[1], vt(), lt && (f || Q) && (T ? nt = q / v : q = nt * v), U = q - _, et = nt - M;
    var _t = [U - b, et - C];
    n.prevWidth = U, n.prevHeight = et;
    var Mt = vd(t, q, nt, Et, g, n);
    if (!(!J && _t.every(function(Ft) {
      return !Ft;
    }) && Mt.every(function(Ft) {
      return !Ft;
    }))) {
      var ht = ie.drag(t, vn(e, t.state, Mt, !!i, !1, "draggable")), Dt = ht.transform, Bt = x + U, Zt = y + et, jt = bt(t, e, I({ width: Bt, height: Zt, offsetWidth: Math.round(q), offsetHeight: Math.round(nt), startRatio: v, boundingWidth: q, boundingHeight: nt, direction: H, dist: [U, et], delta: _t, isPinch: !!i, drag: ht }, nu({
        style: {
          width: "".concat(Bt, "px"),
          height: "".concat(Zt, "px")
        },
        transform: Dt
      }, ht, e)));
      return !d && rt(t, "onResize", jt), jt;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), p = Y(f) > 3, h = Y(d) > 3;
      if (p && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), h && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), p || h)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = he(t, e, {});
      return !n && rt(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: ts,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, I(I({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Me(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var p = r.minSize;
      a.forEach(function(h) {
        var g = h.datas, x = g.minSize, y = g.startOffsetWidth, b = g.startOffsetHeight, C = i * (y ? x[0] / y : 0), S = o * (b ? x[1] / b : 0);
        p[0] = Math.max(p[0], C), p[1] = Math.max(p[1], S);
      });
    }
    function l() {
      var p = r.maxSize;
      a.forEach(function(h) {
        var g = h.datas, x = g.maxSize, y = g.startOffsetWidth, b = g.startOffsetHeight, C = i * (y ? x[0] / y : 0), S = o * (b ? x[1] / b : 0);
        p[0] = Math.min(p[0], C), p[1] = Math.min(p[1], S);
      });
    }
    var u = je(t, this, "dragControlStart", e, function(p, h) {
      return Zn(t, p, r, h);
    });
    s(), l();
    var c = function(p) {
      n.setFixedDirection(p), u.forEach(function(h, g) {
        h.setFixedDirection(p), Zn(t, h.moveable, r, a[g]);
      });
    };
    r.setFixedDirection = c;
    var f = I(I({}, n), { targets: t.props.targets, events: u.map(function(p) {
      return I(I({}, p), { setMin: function(h) {
        p.setMin(h), s();
      }, setMax: function(h) {
        p.setMax(h), l();
      } });
    }), setFixedDirection: c, setMin: function(p) {
      n.setMin(p), s();
    }, setMax: function(p) {
      n.setMax(p), l();
    } }), d = rt(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = cr(t.props, "resizable");
      ha(t, "onBeforeResize", function(p) {
        rt(t, "onBeforeResizeGroup", bt(t, e, I(I({}, p), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, I(I({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = je(t, this, "dragControl", e, function(p, h) {
          var g = O(ne(cn(t.rotation / 180 * Math.PI, 3), [
            h.datas.originalX * u[0],
            h.datas.originalY * u[1],
            1
          ], 3), 2), x = g[0], y = g[1];
          return I(I({}, h), { parentDist: null, parentScale: u, dragClient: wt(c, [x, y]), parentKeepRatio: l });
        }), d = I({ targets: n.targets, events: f }, a);
        return rt(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = je(t, this, "dragControlEnd", e), i = he(t, e, {
        targets: t.props.targets,
        events: a
      });
      return rt(t, "onResizeGroupEnd", i), r;
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
function Ta(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Gt(
    t.state.rootMatrix,
    // TO-DO #710
    ct([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = wt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Xt(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Re(c, [r, n]);
}
function Yn(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function Ia(t, e, r, n) {
  return Yn(Xt(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function Ra(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = lp(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = gt(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function Yl(t, e, r) {
  var n = O(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Yt(t))
    return t.map(function(x) {
      return Yl(x, [a, i, o, s], r)[0];
    });
  var l = O((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], p = Ql(f, r);
  if (c) {
    var h = c === "top" || c === "left", g = u === "bottom" || u === "left";
    d = f[h && !g || !h && g ? 0 : 1];
  }
  return [[d, p]];
}
function ci(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (Kt(r, ut("rotation-control")) || t.props.rotateAroundControls && Kt(r, ut("around-control")) || Kt(r, ut("control")) && Kt(r, ut("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Ji(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var $d = `.rotation {
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
`, Ud = {
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
  css: [$d],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? ut("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = cr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = Yl(a, c, f), p = [];
    if (d.forEach(function(y, b) {
      var C = O(y, 2), S = C[0], w = C[1];
      p.push(e.createElement(
        "div",
        { key: "rotation".concat(b), className: ut("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(S[0], "px, ").concat(S[1], "px) rotate(").concat(w, "rad)")
        } },
        e.createElement("div", { className: ut("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: ut("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var h = Nr(l || {}), g = {};
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
      })), p.push.apply(p, Z([], O(_l(t, "rotatable", x, e)), !1));
    }
    return s && p.push.apply(p, Z([], O(Rl(t, e)), !1)), p;
  },
  dragControlCondition: ci,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, p = f.left, h = f.top, g = f.direction, x = f.beforeDirection, y = f.targetTransform, b = f.moveableClientRect, C = f.offsetMatrix, S = f.targetMatrix, w = f.allMatrix, v = f.width, _ = f.height;
    if (!c && !d)
      return !1;
    var M = t.getRect();
    a.rect = M, a.transform = y, a.left = p, a.top = h;
    var T = function(tt) {
      var U = Wl(t.state, tt);
      a.fixedDirection = U.fixedDirection, a.fixedOffset = U.fixedOffset, a.fixedPosition = U.fixedPosition, j && j.setFixedPosition(tt);
    }, k = function(tt) {
      var U = Vd(t.state, tt);
      a.fixedDirection = U.fixedDirection, a.fixedOffset = U.fixedOffset, a.fixedPosition = U.fixedPosition, j && j.setFixedDirection(tt);
    }, A = i, z = o;
    if (c || u || l) {
      var R = s || 0;
      a.beforeInfo = {
        origin: M.beforeOrigin,
        prevDeg: R,
        defaultDeg: R,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = I(I({}, a.beforeInfo), { origin: M.origin }), a.absoluteInfo = I(I({}, a.beforeInfo), { origin: M.origin, startValue: R });
    } else {
      var B = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (B) {
        var N = B.getAttribute("data-direction") || "", L = td[N];
        if (L) {
          a.isControl = !0, a.isAroundControl = Kt(B, ut("around-control")), a.controlDirection = L;
          var V = B.getAttribute("data-resolve");
          V && (a.resolveAble = V);
          var G = Dp(f.rootMatrix, f.renderPoses, b);
          r = O(Qt(G, L), 2), A = r[0], z = r[1];
        }
      }
      a.beforeInfo = { origin: M.beforeOrigin }, a.afterInfo = { origin: M.origin }, a.absoluteInfo = {
        origin: M.origin,
        startValue: M.rotation
      };
      var W = T;
      T = function(tt) {
        var U = f.is3d ? 4 : 3, et = O(wt(al(S, U), tt), 2), lt = et[0], ft = et[1], xt = ne(C, sr([lt, ft], U)), q = ne(w, sr([tt[0], tt[1]], U));
        W(tt);
        var nt = f.posDelta;
        a.beforeInfo.origin = ct(xt, nt), a.afterInfo.origin = ct(q, nt), a.absoluteInfo.origin = ct(q, nt), Ta(t, a.beforeInfo, A, z, b), Ta(t, a.afterInfo, A, z, b), Ta(t, a.absoluteInfo, A, z, b);
      }, k = function(tt) {
        var U = Qt([
          [0, 0],
          [v, 0],
          [0, _],
          [v, _]
        ], tt);
        T(U);
      };
    }
    a.startClientX = A, a.startClientY = z, a.direction = g, a.beforeDirection = x, a.startValue = 0, a.datas = {}, ca(t, e, "rotate");
    var $ = !1, j = !1;
    if (a.isControl && a.resolveAble) {
      var J = a.resolveAble;
      J === "resizable" && (j = ui.dragControlStart(t, I(I({}, new Rr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    j || ($ = ie.dragStart(t, new Rr().dragStart([0, 0], e))), T(wp(t));
    var Q = bt(t, e, I(I({ set: function(tt) {
      a.startValue = tt * Math.PI / 180;
    }, setFixedDirection: k, setFixedPosition: T }, ua(t, e)), { dragStart: $, resizeStart: j })), H = rt(t, "onRotateStart", Q);
    return a.isRotate = H !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? Q : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, p = i.beforeDirection, h = i.beforeInfo, g = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, b = i.startValue, C = i.rect, S = i.startClientX, w = i.startClientY;
    if (y) {
      sa(t, e, "rotate");
      var v = rd(e), _ = p * v, M = t.props.parentMoveable, T = 0, k, A, z = 0, R, B, N = 0, L, V, G = 180 / Math.PI * b, W = x.startValue, $ = !1, j = S + o, J = w + s;
      if (!u && "parentDist" in e) {
        var Q = e.parentDist;
        k = Q, R = Q, L = Q;
      } else c || u ? (k = Yn(l, p, h), R = Yn(l, _, g), L = Yn(l, _, x)) : (k = Ia(j, J, p, h), R = Ia(j, J, _, g), L = Ia(j, J, _, x), $ = !0);
      if (A = G + k, B = G + R, V = W + L, rt(t, "onBeforeRotate", bt(t, e, {
        beforeRotation: A,
        rotation: B,
        absoluteRotation: V,
        setRotation: function(Et) {
          R = Et - G, k = R, L = R;
        }
      }, !0)), r = O(Ra(t, C, h, k, G, $), 3), T = r[0], k = r[1], A = r[2], n = O(Ra(t, C, g, R, G, $), 3), z = n[0], R = n[1], B = n[2], a = O(Ra(t, C, x, L, W, $), 3), N = a[0], L = a[1], V = a[2], !(!N && !z && !T && !M && !d)) {
        var H = la(i, "rotate(".concat(B, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = Fi(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var tt = pd(t, R, i), U = ct(wt(f || [0, 0], tt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = tt, i.requestValue = null;
        var et = El(t, H, U, c, e), lt = et, ft = Re([j, J], x.startAbsoluteOrigin) - x.startDist, xt = void 0;
        if (i.resolveAble === "resizable") {
          var q = ui.dragControl(t, I(I({}, vn(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: ft }));
          q && (xt = q, lt = nu(lt, q, e));
        }
        var nt = bt(t, e, I(I({ delta: z, dist: R, rotate: B, rotation: B, beforeDist: k, beforeDelta: T, beforeRotate: A, beforeRotation: A, absoluteDist: L, absoluteDelta: N, absoluteRotate: V, absoluteRotation: V, isPinch: !!c, resize: xt }, et), lt));
        return rt(t, "onRotate", nt), nt;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = he(t, e, {});
      return rt(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: ci,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = je(t, this, "dragControlStart", e, function(f, d) {
      var p = f.state, h = p.left, g = p.top, x = p.beforeOrigin, y = wt(ct([h, g], [a, i]), ct(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, I(I({}, d), { parentRotate: 0 });
    }), u = I(I({}, s), { targets: t.props.targets, events: l }), c = rt(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      ha(t, "onBeforeRotate", function(u) {
        rt(t, "onBeforeRotateGroup", bt(t, e, I(I({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = je(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = O(c.datas.groupClient, 2), p = d[0], h = d[1], g = O(un(f, o * a), 2), x = g[0], y = g[1], b = [x - p, y - h];
          return c.datas.groupClient = [x, y], I(I({}, c), { parentRotate: i, groupDelta: b });
        });
        t.rotation = a * n.beforeRotation;
        var l = I({ targets: t.props.targets, events: s, set: function(u) {
          t.rotation = u;
        }, setGroupRotation: function(u) {
          t.rotation = u;
        } }, n);
        return rt(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isRotate) {
      this.dragControlEnd(t, e);
      var a = je(t, this, "dragControlEnd", e), i = he(t, e, {
        targets: t.props.targets,
        events: a
      });
      return rt(t, "onRotateGroupEnd", i), r;
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
function Kd(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function qi(t, e) {
  return Kd(I(I({}, t), { classNames: Z([
    ut("line", "guideline", t.direction)
  ], O(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(gt(r, 0.1), "px");
  }) }), e);
}
function es(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, p = [0, 0];
    return p[o] = n, p[o ? 0 : 1] = -a + d, qi({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [ut("target", "bold", f)],
      posValue: p,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function rs(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? $e : Ue, c = a[u.start], f = a[u.end];
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
    return qi({
      key: "".concat(e, "-default-guideline-").concat(p),
      classNames: x ? [ut("bold"), y] : [ut("normal"), y],
      direction: e,
      posValue: b,
      sizeValue: g,
      zoom: s
    }, i);
  });
}
function Vr(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, p = d === void 0 ? !0 : d, h = u.snapDistFormat, g = h === void 0 ? function(w, v) {
    return w;
  } : h, x = u.zoom, y = e === "horizontal" ? "X" : "Y", b = e === "vertical" ? "height" : "width", C = Math.abs(a), S = p ? parseFloat(C.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: ut("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[b] = "".concat(C, "px"), l) },
    qi({
      direction: e,
      classNames: [ut(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: C,
      zoom: x
    }, s),
    s.createElement("div", { className: ut("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, S > 0 ? g(S, e) : "")
  );
}
function Zd(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? $e : Ue, s = r[o.start], l = r[o.end];
  return au(e, function(u) {
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
        var b = p.pos, C = { element: x, rect: I(I({}, y), (h = {}, h[o.end] = y[o.start], h)) }, S = { element: x, rect: I(I({}, y), (g = {}, g[o.start] = y[o.end], g)) }, w = [0, 0], v = [0, 0];
        w[a] = b[a], w[i] = b[i], v[a] = b[a], v[i] = b[i] + p.size, c.push({
          type: t,
          pos: w,
          size: 0,
          elementRect: C,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: v,
          size: 0,
          elementRect: S,
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
function Jd(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = Zd(s, l, n, i), d = u ? Ue : $e, p = u ? $e : Ue, h = n[d.start], g = n[d.end];
    f.forEach(function(x) {
      var y = x.total, b = x.start, C = x.end, S = x.inner, w = r[c] + y[0].pos[c] - n[p.start], v = n;
      b.forEach(function(_) {
        var M = _.elementRect.rect, T = v[d.start] - M[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + v[d.start] - h - T, k[c] = w, o.push(Vr(t, s, "dashed", o.length, T, k, _.className, a));
        }
        v = M;
      }), v = n, C.forEach(function(_) {
        var M = _.elementRect.rect, T = M[d.start] - v[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + v[d.end] - h, k[c] = w, o.push(Vr(t, s, "dashed", o.length, T, k, _.className, a));
        }
        v = M;
      }), S.forEach(function(_) {
        var M = _.elementRect.rect, T = h - M[d.start], k = M[d.end] - g, A = [0, 0], z = [0, 0];
        A[u] = r[u] - T, A[c] = w, z[u] = r[u] + g - h, z[c] = w, o.push(Vr(t, s, "dashed", o.length, T, A, _.className, a)), o.push(Vr(t, s, "dashed", o.length, k, z, _.className, a));
      });
    });
  }), o;
}
function Qd(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? Ue : $e, f = l ? $e : Ue, d = n[c.start], p = n[c.end], h = n[f.start], g = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, b = x.gapRects, C = Math.max.apply(Math, Z([h], O(b.map(function(v) {
        var _ = v.rect;
        return _[f.start];
      })), !1)), S = Math.min.apply(Math, Z([g], O(b.map(function(v) {
        var _ = v.rect;
        return _[f.end];
      })), !1)), w = (C + S) / 2;
      C === S || w === (h + g) / 2 || b.forEach(function(v) {
        var _ = v.rect, M = v.className, T = [r[0], r[1]];
        if (_[c.end] < d)
          T[l] += _[c.end] - d;
        else if (p < _[c.start])
          T[l] += _[c.start] - d - y;
        else
          return;
        T[u] += w - h, i.push(Vr(t, l ? "vertical" : "horizontal", "gap", i.length, y, T, M, a));
      });
    });
  }), i;
}
function fi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, p = t.props, h = p.snapGap, g = h === void 0 ? !0 : h, x = p.verticalGuidelines, y = p.horizontalGuidelines, b = p.snapThreshold, C = b === void 0 ? 5 : b, S = p.maxSnapElementGuidelineDistance, w = S === void 0 ? 1 / 0 : S, v = p.isDisplayGridGuidelines, _ = ye(Ce(t.state)), M = _.top, T = _.left, k = _.bottom, A = _.right, z = { top: M, left: T, bottom: k, right: A, center: (T + A) / 2, middle: (M + k) / 2 }, R = np(t), B = Z([], O(R), !1), N = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(W) {
    return W * C;
  });
  g && B.push.apply(B, Z([], O(tp(t, z, N)), !1));
  var L = I({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (B.push.apply(B, Z([], O(rp(t, o ? l : c, o ? s : u, f, d, L, v)), !1)), i) {
    var V = a.left, G = a.top;
    L.left += V, L.top += G, L.right += V, L.bottom += G;
  }
  return B.push.apply(B, Z([], O(Hl(y || !1, x || !1, o ? l : c, o ? s : u, f, d, L)), !1)), B = B.filter(function(W) {
    var $ = W.element, j = W.elementRect, J = W.type;
    if (!$ || !j)
      return !0;
    var Q = j.rect;
    return Xl(z, Q, J, w);
  }), B;
}
function tp(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", $e, Ue],
    ["horizontal", Ue, $e]
  ].forEach(function(c) {
    var f = O(c, 3), d = f[0], p = f[1], h = f[2], g = e[p.start], x = e[p.end], y = e[p.center], b = e[h.start], C = e[h.end], S = {
      left: r[0],
      top: r[1]
    };
    function w(M) {
      var T = M.rect, k = S[p.start];
      return T[p.end] < g + k ? g - T[p.end] : x - k < T[p.start] ? T[p.start] - x : -1;
    }
    var v = l.filter(function(M) {
      var T = M.rect;
      return T[h.start] > C || T[h.end] < b ? !1 : w(M) > 0;
    }).sort(function(M, T) {
      return w(M) - w(T);
    }), _ = [];
    v.forEach(function(M) {
      v.forEach(function(T) {
        if (M !== T) {
          var k = M.rect, A = T.rect, z = k[h.start], R = k[h.end], B = A[h.start], N = A[h.end];
          z > N || B > R || _.push([M, T]);
        }
      });
    }), _.forEach(function(M) {
      var T = O(M, 2), k = T[0], A = T[1], z = k.rect, R = A.rect, B = z[p.start], N = z[p.end], L = R[p.start], V = R[p.end], G = S[p.start], W = 0, $ = 0, j = !1, J = !1, Q = !1;
      if (N <= g && x <= L) {
        if (J = !0, W = (L - N - (x - g)) / 2, $ = N + W + (x - g) / 2, Y($ - y) > G)
          return;
      } else if (N < L && V < g + G) {
        if (j = !0, W = L - N, $ = V + W, Y($ - g) > G)
          return;
      } else if (N < L && x - G < B) {
        if (Q = !0, W = L - N, $ = B - W, Y($ - x) > G)
          return;
      } else
        return;
      W && Xl(e, R, d, i) && (W > s || u.push({
        type: d,
        pos: d === "vertical" ? [$, 0] : [0, $],
        element: A.element,
        size: 0,
        className: A.className,
        isStart: j,
        isCenter: J,
        isEnd: Q,
        gap: W,
        hide: !0,
        gapRects: [k, A],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function ep(t, e, r, n) {
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
      var C = b.map(function(w, v) {
        var _ = v === 0 ? {
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
            dir: w,
            multiple: 1,
            snapSize: M,
            snapOffset: 0
          };
        var z = x[k], R = x[T], B = Qc(y.map(function(j) {
          return [
            j[T] - R,
            j[k],
            z - j[k] - j[T] + R
          ];
        })).filter(function(j) {
          return j;
        }).sort(function(j, J) {
          return j - J;
        }), N = B[0], L = B.map(function(j) {
          return gt(j / N, 0.1) * M;
        }), V = 1, G = gt(z / N, 0.1);
        for (V = 1; V <= 10 && !L.every(function(j) {
          return j * V % 1 === 0;
        }); ++V)
          ;
        var W = (-w + 1) / 2, $ = Hn(R - A, R - A + z, W, 1 - W);
        return {
          multiple: G * V,
          dir: w,
          snapSize: M,
          snapOffset: Math.round($ / M)
        };
      }), S = C.map(function(w) {
        return w.multiple || 1;
      });
      s.snapThresholdInfo.multiples = S, s.snapThresholdInfo.offset = C.map(function(w) {
        return w.snapOffset;
      }), C.forEach(function(w, v) {
        w.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function rp(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, p = [], h = i.left, g = i.top, x = [0, 0];
  ep(t, n, a, i);
  var y = l.snapThresholdInfo, b = c, C = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var S = function(v) {
      p.push({
        type: "horizontal",
        pos: [
          h,
          gt(x[1] * C + v - a + g, 0.1)
        ],
        className: ut("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, w = 0; w <= r * 2; w += d)
      S(w);
    for (var w = -d; w >= -r; w -= d)
      S(w);
  }
  if (c) {
    for (var S = function(_) {
      p.push({
        type: "vertical",
        pos: [
          gt(x[0] * b + _ - n + h, 0.1),
          g
        ],
        className: ut("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, w = 0; w <= e * 2; w += c)
      S(w);
    for (var w = -c; w >= -e; w -= c)
      S(w);
  }
  return p;
}
function Xl(t, e, r, n) {
  return r === "horizontal" ? Y(t.right - e.left) <= n || Y(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? Y(t.bottom - e.top) <= n || Y(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function np(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return pe(d) && "element" in d ? I(I({}, d), { element: Pe(d.element, !0) }) : {
      element: Pe(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Sr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var p = O(d, 2), h = p[0], g = p[1];
    u[g] = a[h];
  }), ap(t, l.map(function(d) {
    return i[d];
  })).map(function(d, p) {
    u[l[p]] = d;
  }), e.elementRects = u;
  var c = Wi(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var p = d.element, h = d.top, g = h === void 0 ? c.top : h, x = d.left, y = x === void 0 ? c.left : x, b = d.right, C = b === void 0 ? c.right : b, S = d.bottom, w = S === void 0 ? c.bottom : S, v = d.center, _ = v === void 0 ? c.center : v, M = d.middle, T = M === void 0 ? c.middle : M, k = d.className, A = d.rect, z = Yi({
      top: g,
      right: C,
      left: y,
      bottom: w,
      center: _,
      middle: T
    }, A), R = z.horizontal, B = z.vertical, N = z.horizontalNames, L = z.verticalNames, V = A.top, G = A.left, W = A.right - G, $ = A.bottom - V, j = [W, $];
    B.forEach(function(J, Q) {
      f.push({
        type: "vertical",
        element: p,
        pos: [
          gt(J, 0.1),
          V
        ],
        size: $,
        sizes: j,
        className: k,
        elementRect: d,
        elementDirection: Vo[L[Q]] || L[Q],
        direction: ""
      });
    }), R.forEach(function(J, Q) {
      f.push({
        type: "horizontal",
        element: p,
        pos: [
          G,
          gt(J, 0.1)
        ],
        size: W,
        sizes: j,
        className: k,
        elementRect: d,
        elementDirection: Vo[N[Q]] || N[Q],
        direction: ""
      });
    });
  }), f;
}
function ns(t, e) {
  return t ? t.map(function(r) {
    var n = pe(r) ? r : { pos: r }, a = n.pos;
    return nn(a) ? n : I(I({}, n), { pos: Rt(a, e) });
  }) : [];
}
function Hl(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, p = n + c - u;
  return ns(t, p).forEach(function(h) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        gt(h.pos - i + u, 0.1)
      ],
      size: d,
      className: h.className,
      direction: ""
    });
  }), ns(e, d).forEach(function(h) {
    s.push({
      type: "vertical",
      pos: [
        gt(h.pos - a + l, 0.1),
        u
      ],
      size: p,
      className: h.className,
      direction: ""
    });
  }), s;
}
function ap(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = O(kd(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], p = r ? 0 : s[1];
  return e.map(function(h) {
    var g = h.element.getBoundingClientRect(), x = g.left - c - d, y = g.top - f - p, b = y + g.height, C = x + g.width, S = O(zr(i, [x, y], l), 2), w = S[0], v = S[1], _ = O(zr(i, [C, b], l), 2), M = _[0], T = _[1];
    return I(I({}, h), { rect: {
      left: w,
      right: M,
      top: v,
      bottom: T,
      center: (w + M) / 2,
      middle: (v + T) / 2
    } });
  });
}
function Pn(t) {
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
    var o = Pe(n, !0);
    if (o) {
      var s = tn(o), l = us(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = us(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = gt(l[0], 1e-5), i.top = gt(l[1], 1e-5), i.right = gt(u[0], 1e-5), i.bottom = gt(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = fi(t), e.enableSnap = !0, !0;
}
function ql(t, e, r, n, a, i) {
  var o = dr(t, e, r, i ? 4 : 3), s = Qt(o, n);
  return $i(o, ct(a, s));
}
function as(t) {
  return t ? t / Y(t) : 0;
}
function ip(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Pd(r, o, n), l = Hi(t, e, r, n), u = Z(Z([], O(Xd(t, e, s, n, a, i)), !1), O(Fl(t, l, i)), !1), c = Jn(u, 0), f = Jn(u, 1);
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
function op(t, e, r, n, a, i, o, s, l) {
  var u = Qt(e, o), c = pa(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (gt(d, ai) || gt(f, ai)) {
    var p = O(Oe({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), h = p[0], g = p[1], x = Math.min(a || 1 / 0, r + o[0] * h), y = Math.min(i || 1 / 0, n + o[1] * g);
    return [x - r, y - n];
  }
  return [0, 0];
}
function Vl(t, e, r, n, a, i, o, s) {
  for (var l = Ce(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var p = e(c, f), h = ip(t, p, a, u, o, s), g = h.width, x = h.height, y = g.isBound, b = x.isBound, C = g.offset, S = x.offset;
    if (d === 1 && (y || (C = 0), b || (S = 0)), d === 0 && o && !y && !b)
      return [0, 0];
    if (u) {
      var w = Y(C) * (r ? 1 / r : 1), v = Y(S) * (n ? 1 / n : 1), _ = y && b ? w < v : b || !y && w < v;
      _ ? C = r * S / n : S = n * C / r;
    }
    c += C, f += S;
  }
  if (!u && a[0] && a[1]) {
    var M = qd(t, l, a, i, s), T = M.maxWidth, k = M.maxHeight, A = O(op(t, e(c, f).map(function(B) {
      return B.map(function(N) {
        return gt(N, ai);
      });
    }), r + c, n + f, T, k, a, o, s), 2), C = A[0], S = A[1];
    c += C, f += S;
  }
  return [c, f];
}
function Jr(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function sp(t, e) {
  e = Jr(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return Y(t - n) < Y(t - a) ? n : a;
}
function Pa(t, e) {
  t = Jr(t), e = Jr(e);
  var r = Jr(t - e);
  return Math.min(r, 360 - r);
}
function lp(t, e, r, n) {
  var a, i = t.props, o = (a = i[Pl]) !== null && a !== void 0 ? a : 5, s = i[Ol];
  if (Gr(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, p = r * Math.PI / 180, h = [l, u, c, f].map(function(S) {
      return ct(S, d);
    }), g = h.map(function(S) {
      return un(S, p);
    }), x = Z(Z([], O(Dd(t, h, g, d, r)), !1), O(jd(t, h, g, d, r)), !1);
    x.sort(function(S, w) {
      return Y(S - r) - Y(w - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var b = s.slice().sort(function(S, w) {
      return Pa(S, n) - Pa(w, n);
    }), C = b[0];
    if (Pa(C, n) <= o)
      return {
        isSnap: !0,
        dist: r + sp(n, C) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function up(t, e, r, n, a, i, o) {
  if (!Gr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return Vl(t, function(d, p) {
    return ql(l || c, e + d, r + p, s, a, f);
  }, e, r, n, a, i, o);
}
function cp(t, e, r, n, a) {
  if (!Gr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = Vl(t, function(f, d) {
    return ql(ud(a, wt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function fp(t, e) {
  e.absolutePoses = Ce(t.state);
}
function is(t) {
  var e = [];
  return t.forEach(function(r) {
    r.guidelineInfos.forEach(function(n) {
      var a = n.guideline;
      ve(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: r }));
    });
  }), e.map(function(r) {
    var n = r.guideline, a = r.posInfo;
    return I(I({}, n), { direction: a.direction });
  });
}
function os(t, e, r, n, a, i) {
  var o = Li(fa(t, i), e, r), s = o.vertical, l = o.horizontal, u = Dr();
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
  var c = Gd(t), f = c.boundMap, d = c.vertical, p = c.horizontal;
  return d.forEach(function(h) {
    Ge(n, function(g) {
      var x = g.type, y = g.pos;
      return x === "bounds" && y === h;
    }) >= 0 || n.push({
      type: "bounds",
      pos: h
    });
  }), p.forEach(function(h) {
    Ge(a, function(g) {
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
var dp = Zi("", ["resizable", "scalable"]), pp = {
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
    Pl,
    Ol,
    zl,
    Al,
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
    if (!u || !u.render || !Gr(t, ""))
      return _r(t, "boundMap", Dr(), function(H) {
        return JSON.stringify(H);
      }), _r(t, "innerBoundMap", Dr(), function(H) {
        return JSON.stringify(H);
      }), [];
    r.guidelines = fi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), p = Math.min(i[1], o[1], s[1], l[1]), h = u.externalPoses || [], g = Ce(t.state), x = [], y = [], b = [], C = [], S = [], w = ye(g), v = w.width, _ = w.height, M = w.top, T = w.left, k = w.bottom, A = w.right, z = { left: T, right: A, top: M, bottom: k, center: (T + A) / 2, middle: (M + k) / 2 }, R = h.length > 0, B = R ? ye(h) : {};
    if (!u.request) {
      if (u.direction && S.push(Rd(t, g, u.direction, f, f)), u.snap) {
        var N = ye(g);
        u.center && (N.middle = (N.top + N.bottom) / 2, N.center = (N.left + N.right) / 2), S.push($o(t, N, f, f));
      }
      R && (u.center && (B.middle = (B.top + B.bottom) / 2, B.center = (B.left + B.right) / 2), S.push($o(t, B, f, f))), S.forEach(function(H) {
        var tt = H.vertical.posInfos, U = H.horizontal.posInfos;
        x.push.apply(x, Z([], O(tt.filter(function(et) {
          var lt = et.guidelineInfos;
          return lt.some(function(ft) {
            var xt = ft.guideline;
            return !xt.hide;
          });
        }).map(function(et) {
          return {
            type: "snap",
            pos: et.pos
          };
        })), !1)), y.push.apply(y, Z([], O(U.filter(function(et) {
          var lt = et.guidelineInfos;
          return lt.some(function(ft) {
            var xt = ft.guideline;
            return !xt.hide;
          });
        }).map(function(et) {
          return {
            type: "snap",
            pos: et.pos
          };
        })), !1)), b.push.apply(b, Z([], O(is(tt)), !1)), C.push.apply(C, Z([], O(is(U)), !1));
      });
    }
    var L = os(t, [T, A], [M, k], x, y), V = L.boundMap, G = L.innerBoundMap;
    R && os(t, [B.left, B.right], [B.top, B.bottom], x, y, u.externalBounds);
    var W = Z(Z([], O(b), !1), O(C), !1), $ = W.filter(function(H) {
      return H.element && !H.gapRects;
    }), j = W.filter(function(H) {
      return H.gapRects;
    }).sort(function(H, tt) {
      return H.gap - tt.gap;
    });
    rt(t, "onSnap", {
      guidelines: W.filter(function(H) {
        var tt = H.element;
        return !tt;
      }),
      elements: $,
      gaps: j
    }, !0);
    var J = _r(t, "boundMap", V, function(H) {
      return JSON.stringify(H);
    }, Dr()), Q = _r(t, "innerBoundMap", G, function(H) {
      return JSON.stringify(H);
    }, Dr());
    return (V === J || G === Q) && rt(t, "onBound", {
      bounds: V,
      innerBounds: G
    }, !0), Z(Z(Z(Z(Z(Z([], O(Jd(t, $, [d, p], z, e)), !1), O(Qd(t, j, [d, p], z, e)), !1), O(rs(t, "horizontal", C, [a, n], z, e)), !1), O(rs(t, "vertical", b, [a, n], z, e)), !1), O(es(t, "horizontal", y, d, n, v, 0, e)), !1), O(es(t, "vertical", x, p, a, _, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, Pn(t);
  },
  drag: function(t) {
    var e = t.state;
    Pn(t) || (e.guidelines = fi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (dp(t, e) || ci(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return Kt(e.inputEvent.target, ut("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, Pn(t);
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
    t.state.snapRenderInfo = null, Pn(t);
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
function vp(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function ut() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Nc.apply(void 0, Z([Bi], O(t), !1));
}
function $l(t) {
  t();
}
function hp(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : pe(t) ? t : Tr(t);
}
function Qr(t, e, r) {
  return Vn(e, lr(r, e), t, lr(r.map(function(n) {
    return -n;
  }), e));
}
function gp(t, e, r) {
  if (e === "%") {
    var n = Vi(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function mp(t) {
  var e = xp(Ui(t, ":before"));
  return e.map(function(r, n) {
    var a = or(r), i = a.value, o = a.unit;
    return i * gp(t, o, n === 0);
  });
}
function ta(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function xp(t) {
  return ta(t.transformOrigin);
}
function Ul(t) {
  var e = de(t), r = e("transform");
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
function ln(t, e, r, n, a) {
  var i, o, s = Ii(t) || Ke(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var p = !1, h = t === e || u === e, g = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, b = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (h = !0);
    var C = de(u), S = u.tagName.toLowerCase(), w = Ul(u), v = C("willChange"), _ = parseFloat(C("zoom")) || 1;
    if (g = C("position"), n && _ !== 1) {
      x = _;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && b && b !== "absolute" || S === "svg" || S === "foreignobject" || g !== "static" || w && w !== "none" || v === "transform"
    )
      break;
    var M = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, T = u.parentNode;
    M && (l = !0, c = T);
    var k = T;
    if (k && k.nodeType === 11) {
      u = k.host, p = !0, g = de(u)("position");
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
function yp(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = de(t), s = wi(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = hl ? mp(t) : ta(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = O(Cp(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = ta(o("transformOrigin")).map(function(f) {
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
function Kl(t, e) {
  var r = de(t), n = de(Ke(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function di(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Te(r, 3, 4));
  });
}
function bp(t) {
  for (var e = t.parentElement, r = !1, n = Ke(t); e; ) {
    var a = Ui(e).transform;
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
function va(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(il(t, !e).join(","), ")");
}
function Vi(t) {
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
function Sp(t, e) {
  var r, n = Vi(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, p = [0, 0], h = [l, u], g = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    p[0] = a * x / 2, p[1] = i * y / 2;
    var b = d === 2 ? Math.max(u, l) : Math.min(l, u);
    h[0] = b, h[1] = b, g[0] = (o - a) / 2 * x, g[1] = (s - i) / 2 * y;
  }
  var C = Ri(h, e);
  return r = O(g, 2), C[e * (e - 1)] = r[0], C[e * (e - 1) + 1] = r[1], Qr(C, e, p);
}
function Cp(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = de(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Vi(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, p = i ? e[1] : e[1] - f;
  return [c, f, d, p];
}
function Gt(t, e, r) {
  return ne(t, sr(e, r), r);
}
function dr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Gt(t, a, n);
  });
}
function ye(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, Z([], O(e), !1)), a = Math.min.apply(Math, Z([], O(r), !1)), i = Math.max.apply(Math, Z([], O(e), !1)), o = Math.max.apply(Math, Z([], O(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function ss(t, e, r, n) {
  var a = dr(t, e, r, n);
  return ye(a);
}
function Ep(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Jl(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), p = [0, 0];
  r === Ke(r) && (p = Kl(o, !0));
  for (var h = o.getBoundingClientRect(), g = h.left - d.left + r.scrollLeft - (r.clientLeft || 0) + p[0], x = h.top - d.top + r.scrollTop - (r.clientTop || 0) + p[1], y = h.width, b = h.height, C = Vn(n, a, l), S = ss(C, c, f, n), w = S.left, v = S.top, _ = S.width, M = S.height, T = Gt(C, s, n), k = ct(T, [w, v]), A = [
    g + k[0] * y / _,
    x + k[1] * b / M
  ], z = [0, 0], R = 0; ++R < 10; ) {
    var B = ke(a, n);
    i = O(ct(Gt(B, A, n), Gt(B, T, n)), 2), z[0] = i[0], z[1] = i[1];
    var N = Vn(n, a, lr(z, n), l), L = ss(N, c, f, n), V = L.left, G = L.top, W = V - g, $ = G - x;
    if (Y(W) < 2 && Y($) < 2)
      break;
    A[0] -= W, A[1] -= $;
  }
  return z.map(function(j) {
    return Math.round(j);
  });
}
function Dp(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Gt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function Se(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Zl(t, e) {
  return Se([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function $r(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Xt(t, e));
  var a = Zl(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function ea(t, e) {
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
function cr(t, e) {
  var r = t[e];
  return pe(r) ? I(I({}, t), r) : t;
}
function Jl(t) {
  var e = t && !wi(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, p = 0, h = 1 / 0, g = 1 / 0, x = 1 / 0, y = 1 / 0, b = 0, C = 0, S = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var w = t.getBBox();
      S = !0, r = w.width, n = w.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var v = de(t), _ = t.style, M = v("boxSizing") === "border-box", T = parseFloat(v("borderLeftWidth")) || 0, k = parseFloat(v("borderRightWidth")) || 0, A = parseFloat(v("borderTopWidth")) || 0, z = parseFloat(v("borderBottomWidth")) || 0, R = parseFloat(v("paddingLeft")) || 0, B = parseFloat(v("paddingRight")) || 0, N = parseFloat(v("paddingTop")) || 0, L = parseFloat(v("paddingBottom")) || 0, V = R + B, G = N + L, W = T + k, $ = A + z, j = V + W, J = G + $, Q = v("position"), H = 0, tt = 0;
      if ("clientLeft" in t) {
        var U = null;
        if (Q === "absolute") {
          var et = ln(t, Ke(t));
          U = et.offsetParent;
        } else
          U = t.parentElement;
        if (U) {
          var lt = de(U);
          H = parseFloat(lt("width")), tt = parseFloat(lt("height"));
        }
      }
      c = Math.max(V, Rt(v("minWidth"), H) || 0), f = Math.max(G, Rt(v("minHeight"), tt) || 0), h = Rt(v("maxWidth"), H), g = Rt(v("maxHeight"), tt), isNaN(h) && (h = 1 / 0), isNaN(g) && (g = 1 / 0), b = Rt(_.width, 0) || 0, C = Rt(_.height, 0) || 0, o = parseFloat(v("width")) || 0, s = parseFloat(v("height")) || 0, l = Y(o - b) < 1 ? qn(c, b || o, h) : o, u = Y(s - C) < 1 ? qn(f, C || s, g) : s, r = l, n = u, a = l, i = u, M ? (x = h, y = g, d = c, p = f, l = r - j, u = n - J) : (x = h + j, y = g + J, d = c + j, p = f + J, r = l + j, n = u + J), a = l + V, i = u + G;
    }
  return {
    svg: S,
    offsetWidth: r,
    offsetHeight: n,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: u,
    inlineCSSWidth: b,
    inlineCSSHeight: C,
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
function Ql(t, e) {
  return Xt(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function On() {
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
function tu(t, e) {
  var r = t === Ke(t) || t === Ii(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = de(t)("overflow") !== "visible", I(I({}, e), n);
}
function Oa(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? tu(r, c) : c;
}
function tn(t, e) {
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
  return t && e ? tu(t, s) : s;
}
function wp(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Qi(n, i, o) : l;
}
function eu(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = ru(i, n);
  }
  return a;
}
function ru(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function $i(t, e) {
  return [
    wt(e, t[0]),
    wt(e, t[1]),
    wt(e, t[2]),
    wt(e, t[3])
  ];
}
function Ce(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return $i([n, a, i, o], [e, r]);
}
function pi(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function wr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && pi(t, e), n == null || n.unset(), t[r] = null;
}
function se(t, e) {
  if (e) {
    var r = jr(e);
    r.nextStyle = I(I({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: Nr(t).map(function(n) {
      return "".concat($c(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function nu(t, e, r) {
  var n = e.afterTransform || e.transform;
  return I(I({}, se(I(I(I({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function bt(t, e, r, n) {
  var a = e.datas;
  a.datas || (a.datas = {});
  var i = I(I({}, r), { target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, moveable: t, datas: a.datas, isRequest: e.isRequest, isRequestChild: e.isRequestChild, isFirstDrag: !!e.isFirstDrag, isTrusted: e.isTrusted !== !1, stopAble: function() {
    a.isEventStart = !1;
  }, stopDrag: function() {
    var o;
    (o = e.stop) === null || o === void 0 || o.call(e);
  } });
  return a.isStartEvent ? n || (a.lastEvent = i) : a.isStartEvent = !0, i;
}
function he(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), I(I({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function ha(t, e, r) {
  t._emitter.on(e, r);
}
function rt(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function Ui(t, e) {
  return xe(t).getComputedStyle(t, e);
}
function zn(t, e, r) {
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
function vi(t, e) {
  return t === e || t == null && e == null;
}
function ls() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!wi(a))
      return a;
  }
  return t[r];
}
function au(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function _p(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function iu(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Or() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return Y(n) - Y(r);
  }), t[0];
}
function zr(t, e, r) {
  return ne(ke(t, r), sr(e, r), r);
}
function Mp(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = O(zr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function me(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Gt(t, [as(r[0] || 1), 0], n), i = Gt(t, [0, as(r[1] || 1)], n), o = Gt(t, [
    r[0] / Se(a),
    r[1] / Se(i)
  ], n);
  return wt(e, o);
}
function we(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function ra(t) {
  return Y(t) <= le ? 0 : t;
}
function Ki(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = gd(e, t), n = r.deg;
    return n ? ut("view-control-rotation".concat(n)) : "";
  };
}
function Zi(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return Kt(a, ut("direction")) && (!t || Kt(a, ut(t)));
  };
}
function kp(t, e, r) {
  var n, a = Ir(t, {
    "x%": function(w) {
      return w / 100 * e.offsetWidth;
    },
    "y%": function(w) {
      return w / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Ir([""])[0], p = r < 0 ? [] : a.slice(r), h = r < 0 ? [] : a.slice(r + 1), g = d ? [d] : [], x = yr(c), y = yr(f), b = yr(p), C = yr(h), S = Pt(x, b, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: yr(g),
    afterFunctionMatrix: b,
    afterFunctionMatrix2: C,
    allFunctionMatrix: S,
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
function Tp(t) {
  return !t || !pe(t) || on(t) ? !1 : Yt(t) || "length" in t;
}
function Pe(t, e) {
  return t ? on(t) ? t : be(t) ? e ? document.querySelector(t) : t : oa(t) ? t() : rl(t) ? t : "current" in t ? t.current : t : null;
}
function Ji(t, e) {
  if (!t)
    return [];
  var r = Tp(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return be(a) && e ? Z(Z([], O(n), !1), O([].slice.call(document.querySelectorAll(a))), !1) : (Yt(a) ? n.push(Ji(a, e)) : n.push(Pe(a, e)), n);
  }, []);
}
function Ip(t, e, r) {
  var n = Xt(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function us(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = ke(r, a);
  return n || (i = Te(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, Wn(i, e);
}
function ou(t, e, r, n, a) {
  var i = O(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Xt([0, 0], e), f = Xt([0, 0], n), d = Se(e), p = Math.cos(c - f) * d;
    if (!n[0])
      u = p, l = u * r;
    else if (!n[1])
      l = p, u = l / r;
    else {
      var h = n[0] * o, g = n[1] * s, x = Math.atan2(h + e[0], g + e[1]), y = Math.atan2(h, g);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var b = 0;
      Y(x - y) < Math.PI / 2 || Y(x - y) > Math.PI / 2 * 3 || (y += Math.PI), b = x - y, b > Math.PI * 2 ? b -= Math.PI * 2 : b > Math.PI ? b = 2 * Math.PI - b : b < -Math.PI && (b = -2 * Math.PI - b);
      var C = Se([h + e[0], g + e[1]]) * Math.cos(b);
      l = C * Math.sin(y) - h, u = C * Math.cos(y) - g, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function su(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, p = n.parentDistance, h = n.parentDist, g = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(_) {
    return Y(t[_] - x[_]);
  }), b = [0, 1].map(function(_) {
    var M = y[_];
    return M !== 0 && (M = 2 / M), M;
  });
  if (h)
    l = h[0], u = h[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (nn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (g)
    l = (g[0] - 1) * o, u = (g[1] - 1) * s;
  else if (p) {
    var C = o * y[0], S = s * y[1], w = Se([C, S]);
    l = p / w * C * b[0], u = p / w * S * b[1];
  } else {
    var v = Oe({ datas: r, distX: c, distY: f });
    v = b.map(function(_, M) {
      return v[M] * _;
    }), a = O(ou([o, s], v, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function hi(t, e) {
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
    var r = O(t.split(" "), 2), n = r[0], a = r[1], i = hi(n || ""), o = hi(a || ""), s = I(I({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Qi(t, e, r) {
  var n = hi(t, !0), a = n.x, i = n.y;
  return [
    Rt(a, e) || 0,
    Rt(i, r) || 0
  ];
}
function Rp(t, e, r) {
  var n = t.map(function(i) {
    return ct(i, e);
  }), a = n.map(function(i) {
    return un(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return wt(i, e);
    })
  };
}
function lu(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Yt(r), o = Yt(a);
    return i && o ? lu(r, a) : !i && !o ? r === a : !1;
  });
}
function _r(t, e, r, n, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = r, r;
  return o === r || n(o) === n(r) ? o : (i[e] = r, r);
}
function oe(t) {
  return t >= 0 ? 1 : -1;
}
function Y(t) {
  return Math.abs(t);
}
function za(t, e) {
  return Jc(t).map(function(r) {
    return e(r);
  });
}
function uu(t) {
  return nn(t) ? {
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
var Pp = pn("pinchable", {
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
    }), d = bt(t, e, {});
    n && (d.targets = n);
    var p = rt(t, u, d);
    r.isPinch = p !== !1, r.ables = f;
    var h = r.isPinch;
    return h ? (f.forEach(function(g) {
      if (i[g.name] = i[g.name] || {}, !!g[c]) {
        var x = I(I({}, e), { datas: i[g.name], parentRotate: a, isPinch: !0 });
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
      var u = a * (1 - 1 / n), c = bt(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      rt(t, f, c);
      var d = r.ables, p = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(h) {
        h[p] && h[p](t, I(I({}, e), { datas: i[h.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = he(t, e, { isDrag: n });
      i && (l.targets = i), rt(t, s, l);
      var u = r.ables, c = "drag".concat(i ? "Group" : "", "ControlEnd");
      return u.forEach(function(f) {
        f[c] && f[c](t, I(I({}, e), { isDrag: n, datas: o[f.name], inputEvent: a, isPinch: !0 }));
      }), n;
    }
  },
  pinchGroupStart: function(t, e) {
    return this.pinchStart(t, I(I({}, e), { targets: t.props.targets }));
  },
  pinchGroup: function(t, e) {
    return this.pinch(t, I(I({}, e), { targets: t.props.targets }));
  },
  pinchGroupEnd: function(t, e) {
    return this.pinchEnd(t, I(I({}, e), { targets: t.props.targets }));
  }
}), cs = Zi("scalable"), Op = {
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
  render: Tl("scalable"),
  dragControlCondition: cs,
  viewClassName: Ki("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = eu(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, p = s.pos2, h = s.pos4;
    if (!o || !f)
      return !1;
    n || fr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var g = !o[0] && !o[1] || o[0] || !o[1];
    ca(t, e, "scale"), r.isWidth = g;
    function x(v) {
      r.ratio = v && isFinite(v) ? v : 0;
    }
    r.startPositions = Ce(t.state);
    function y(v) {
      var _ = Ll(r.startPositions, v);
      r.fixedDirection = _.fixedDirection, r.fixedPosition = _.fixedPosition, r.fixedOffset = _.fixedOffset;
    }
    r.setFixedDirection = y, x(Re(d, p) / Re(p, h)), y([-o[0], -o[1]]);
    var b = function(v) {
      r.minScaleSize = v;
    }, C = function(v) {
      r.maxScaleSize = v;
    };
    b([-1 / 0, -1 / 0]), C([1 / 0, 1 / 0]);
    var S = bt(t, e, I(I({ direction: o, set: function(v) {
      r.startValue = v;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: b, setMaxScaleSize: C }, ua(t, e)), { dragStart: ie.dragStart(t, new Rr().dragStart([0, 0], e)) })), w = rt(t, "onScaleStart", S);
    return r.startFixedDirection = r.fixedDirection, w !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? S : !1;
  },
  dragControl: function(t, e) {
    sa(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, p = r.startOffsetHeight, h = r.isScale, g = r.startValue, x = r.isWidth, y = r.ratio;
    if (!h)
      return !1;
    var b = t.props, C = b.throttleScale, S = b.parentMoveable, w = f;
    !f[0] && !f[1] && (w = [1, 1]);
    var v = y && (n ?? b.keepRatio) || !1, _ = t.state, M = [
      g[0],
      g[1]
    ];
    function T() {
      var q = su(w, v, r, e), nt = q.distWidth, Et = q.distHeight, pt = d ? (d + nt) / d : 1, vt = p ? (p + Et) / p : 1;
      g[0] || (M[0] = nt / d), g[1] || (M[1] = Et / p);
      var St = (w[0] || v ? pt : 1) * M[0], _t = (w[1] || v ? vt : 1) * M[1];
      return St === 0 && (St = oe(c[0]) * Tn), _t === 0 && (_t = oe(c[1]) * Tn), [St, _t];
    }
    var k = T();
    if (!i && t.props.groupable) {
      var A = _.snapRenderInfo || {}, z = A.direction;
      Yt(z) && (z[0] || z[1]) && (_.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    rt(t, "onBeforeScale", bt(t, e, {
      scale: k,
      setFixedDirection: function(q) {
        return r.setFixedDirection(q), k = T(), k;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(q) {
        k = q;
      }
    }, !0));
    var R = [
      k[0] / M[0],
      k[1] / M[1]
    ], B = o, N = [0, 0], L = oe(R[0] * R[1]), V = !o && !a && i;
    if (V || u ? B = Fi(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (B = r.fixedPosition), i || (N = cp(t, R, f, !l && s, r)), v) {
      w[0] && w[1] && N[0] && N[1] && (Math.abs(N[0] * d) > Math.abs(N[1] * p) ? N[1] = 0 : N[0] = 0);
      var G = !N[0] && !N[1];
      if (G && (x ? R[0] = gt(R[0] * M[0], C) / M[0] : R[1] = gt(R[1] * M[1], C) / M[1]), w[0] && !w[1] || N[0] && !N[1] || G && x) {
        R[0] += N[0];
        var W = d * R[0] * M[0] / y;
        R[1] = oe(L * R[0]) * Y(W / p / M[1]);
      } else if (!w[0] && w[1] || !N[0] && N[1] || G && !x) {
        R[1] += N[1];
        var $ = p * R[1] * M[1] * y;
        R[0] = oe(L * R[1]) * Y($ / d / M[0]);
      }
    } else
      R[0] += N[0], R[1] += N[1], N[0] || (R[0] = gt(R[0] * M[0], C) / M[0]), N[1] || (R[1] = gt(R[1] * M[1], C) / M[1]);
    R[0] === 0 && (R[0] = oe(c[0]) * Tn), R[1] === 0 && (R[1] = oe(c[1]) * Tn), k = vp(R, [M[0], M[1]]);
    var j = [
      d,
      p
    ], J = [
      d * k[0],
      p * k[1]
    ];
    J = ki(J, r.minScaleSize, r.maxScaleSize, v ? y : !1), k = za(2, function(q) {
      return j[q] ? J[q] / j[q] : J[q];
    }), R = za(2, function(q) {
      return k[q] / M[q];
    });
    var Q = za(2, function(q) {
      return c[q] ? R[q] / c[q] : R[q];
    }), H = "scale(".concat(R.join(", "), ")"), tt = "scale(".concat(k.join(", "), ")"), U = la(r, tt, H), et = !g[0] || !g[1], lt = cd(t, et ? tt : H, r.fixedDirection, B, r.fixedOffset, r, et), ft = V ? lt : ct(lt, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = lt, k[0] === c[0] && k[1] === c[1] && ft.every(function(q) {
      return !q;
    }) && !S && !V)
      return !1;
    var xt = bt(t, e, I({ offsetWidth: d, offsetHeight: p, direction: f, scale: k, dist: R, delta: Q, isPinch: !!i }, El(t, U, ft, i, e)));
    return rt(t, "onScale", xt), xt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = he(t, e, {});
    return rt(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: cs,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Me(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = je(t, this, "dragControlStart", e, function(u, c) {
      return Zn(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), Zn(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = I(I({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = rt(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      ha(t, "onBeforeScale", function(c) {
        rt(t, "onBeforeScaleGroup", bt(t, e, I(I({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = je(t, this, "dragControl", e, function(c, f) {
          var d = O(ne(cn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), p = d[0], h = d[1];
          return I(I({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: wt(s, [p, h])
          });
        }), u = I({ targets: t.props.targets, events: l }, n);
        return rt(t, "onScaleGroup", u), u;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isScale) {
      this.dragControlEnd(t, e);
      var a = je(t, this, "dragControlEnd", e), i = he(t, e, {
        targets: t.props.targets,
        events: a
      });
      return rt(t, "onScaleGroupEnd", i), r;
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
function Ye(t, e) {
  return t.map(function(r, n) {
    return Hn(r, e[n], 1, 2);
  });
}
function fs(t, e, r) {
  var n = Xt(t, e), a = Xt(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function zp(t, e) {
  var r = fs(t[0], t[1], t[2]), n = fs(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Ap = {
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
  viewClassName: Ki("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = Ye(l, u), p = Ye(u, l), h = Ye(l, c), g = Ye(c, l), x = Ye(c, f), y = Ye(f, c), b = Ye(u, f), C = Ye(f, u);
    return Z([
      e.createElement("div", { className: ut("line"), key: "middeLine1", style: $r(d, x, o) }),
      e.createElement("div", { className: ut("line"), key: "middeLine2", style: $r(p, y, o) }),
      e.createElement("div", { className: ut("line"), key: "middeLine3", style: $r(h, b, o) }),
      e.createElement("div", { className: ut("line"), key: "middeLine4", style: $r(g, C, o) })
    ], O(Il(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return Kt(r, ut("direction")) && Kt(r, ut("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = ru(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, p = s.height, h = s.left, g = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Te(f, 3, 4), r.targetInverseMatrix = nl(ke(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = h, r.top = g, r.poses = [
      [0, 0],
      [d, 0],
      [0, p],
      [d, p]
    ].map(function(b) {
      return ct(b, l);
    }), r.nextPoses = r.poses.map(function(b) {
      var C = O(b, 2), S = C[0], w = C[1];
      return ne(r.warpTargetMatrix, [S, w, 0, 1], 4);
    }), r.startValue = At(4), r.prevMatrix = At(4), r.absolutePoses = Ce(s), r.posIndexes = Cl(o), fr(t, e), ca(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = bt(t, e, I({ set: function(b) {
      r.startValue = b;
    } }, ua(t, e))), y = rt(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (sa(t, e, "matrix3d"), Gr(t, "warpable")) {
      var p = f.map(function(T) {
        return d[T];
      });
      p.length > 1 && p.push([
        (p[0][0] + p[1][0]) / 2,
        (p[0][1] + p[1][1]) / 2
      ]);
      var h = pa(t, n, {
        horizontal: p.map(function(T) {
          return T[1] + i;
        }),
        vertical: p.map(function(T) {
          return T[0] + a;
        })
      }), g = h.horizontal, x = h.vertical;
      i -= g.offset, a -= x.offset;
    }
    var y = Oe({ datas: r, distX: a, distY: i }, !0), b = r.nextPoses.slice();
    if (f.forEach(function(T) {
      b[T] = wt(b[T], y);
    }), !Qf.every(function(T) {
      return zp(T.map(function(k) {
        return c[k];
      }), T.map(function(k) {
        return b[k];
      }));
    }))
      return !1;
    var C = Pi(c[0], c[2], c[1], c[3], b[0], b[2], b[1], b[3]);
    if (!C.length)
      return !1;
    var S = Pt(o, C, 4), w = bl(r, S, !0), v = Pt(ke(s, 4), w, 4);
    r.prevMatrix = w;
    var _ = Pt(u, w, 4), M = la(r, "matrix3d(".concat(_.join(", "), ")"), "matrix3d(".concat(w.join(", "), ")"));
    return Gi(e, M), rt(t, "onWarp", bt(t, e, I({ delta: v, matrix: _, dist: w, multiply: Pt, transform: M }, se({
      transform: M
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, rt(t, "onWarpEnd", he(t, e, {})), n) : !1;
  }
}, Np = /* @__PURE__ */ ut("area-pieces"), An = /* @__PURE__ */ ut("area-piece"), cu = /* @__PURE__ */ ut("avoid"), Bp = ut("view-dragging");
function Aa(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    el(e, cu), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function ds(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Np },
    t.createElement("div", { className: An }),
    t.createElement("div", { className: An }),
    t.createElement("div", { className: An }),
    t.createElement("div", { className: An })
  );
}
var fu = {
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
    var r = t.props, n = r.target, a = r.dragArea, i = r.groupable, o = r.passDragArea, s = t.getState(), l = s.width, u = s.height, c = s.renderPoses, f = o ? ut("area", "pass") : ut("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: qe(t, "areaElement"), className: f }),
        ds(e)
      ];
    if (!n || !a)
      return [];
    var d = Pi([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), p = d.length ? va(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: qe(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: p
      } }),
      ds(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, p = l.top, h = ye(u), g = h.left, x = h.top, y = h.width, b = h.height, C = f ? 4 : 3, S = O(zr(c, [n - d, a - p], C), 2), w = S[0], v = S[1];
    w -= g, v -= x;
    var _ = [
      { left: g, top: x, width: y, height: v - 10 },
      { left: g, top: x, width: w - 10, height: b },
      { left: g, top: x + v + 10, width: y, height: b - v - 10 },
      { left: g + w + 10, top: x, width: y - w - 10, height: b }
    ], M = [].slice.call(o.nextElementSibling.children);
    _.forEach(function(T, k) {
      M[k].style.cssText = "left: ".concat(T.left, "px;top: ").concat(T.top, "px; width: ").concat(T.width, "px; height: ").concat(T.height, "px;");
    }), Ti(o, cu), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, Aa(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || Aa(t);
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
    Aa(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && tl(function() {
      e.disableNativeEvent = !1;
    });
  }
}, jp = pn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, p = o.top, h = o.offsetWidth, g = o.offsetHeight, x;
    if (!i && u && a) {
      var y = O(Qi(a, h, g), 2), b = y[0], C = y[1], S = f ? 4 : 3, w = Gt(c, [b, C], S);
      x = ea(l, n, ct(w, [d, p]));
    } else
      x = ea(l, n, s);
    return [
      e.createElement("div", { className: ut("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function Gp(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Fp = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new ll(), s = Pe(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, p = bt(t, e, {
        scrollContainer: f,
        direction: d
      }), h = u ? "onScrollGroup" : "onScroll";
      u && (p.targets = u), rt(t, h, p);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, p = c.inputEvent;
      t[l].scrollBy(f, d, p.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, I({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? Gp : c, d = n.scrollOptions;
      return r.drag(e, I({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(p) {
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
    return this.dragStart(t, I(I({}, e), { isControl: !0 }));
  },
  dragControl: function(t, e) {
    return this.drag(t, e);
  },
  dragControlEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  dragGroupStart: function(t, e) {
    return this.dragStart(t, I(I({}, e), { targets: t.props.targets }));
  },
  dragGroup: function(t, e) {
    return this.drag(t, I(I({}, e), { targets: t.props.targets }));
  },
  dragGroupEnd: function(t, e) {
    return this.dragEnd(t, I(I({}, e), { targets: t.props.targets }));
  },
  dragGroupControlStart: function(t, e) {
    return this.dragStart(t, I(I({}, e), { targets: t.props.targets, isControl: !0 }));
  },
  dragGroupControl: function(t, e) {
    return this.drag(t, I(I({}, e), { targets: t.props.targets }));
  },
  dragGroupControEnd: function(t, e) {
    return this.dragEnd(t, I(I({}, e), { targets: t.props.targets }));
  },
  unset: function(t) {
    var e, r = t.state;
    (e = r.dragScroll) === null || e === void 0 || e.dragEnd(), r.dragScroll = null;
  }
}, du = {
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
}, Lp = pn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = uu(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, p = l.pos4, h = [c, f, d, p], g = [];
    return a > 0 && g.push([0, 2]), i > 0 && g.push([0, 1]), o > 0 && g.push([1, 3]), s > 0 && g.push([2, 3]), g.map(function(x, y) {
      var b = O(x, 2), C = b[0], S = b[1], w = h[C], v = h[S], _ = u[C], M = u[S], T = Pi([0, 0], [100, 0], [0, 100], [100, 100], w, v, _, M);
      if (T.length)
        return e.createElement("div", { key: "padding".concat(y), className: ut("padding"), style: {
          transform: va(T, !0)
        } });
    });
  }
}), ps = ["nw", "ne", "se", "sw"];
function Nn(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var Wp = [1, 2, 5, 6], Yp = [0, 3, 4, 7], nr = [1, -1, -1, 1], ar = [1, 1, -1, -1];
function to(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var p = d.horizontal, h = d.vertical, g = d.pos;
    if (h && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, h === 1 ? g[1] - i : s - g[1]);
      return l.push(we(x, n, e)), x;
    } else {
      var x = Math.max(0, p === 1 ? g[0] - a : o - g[0]);
      return l.push(we(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function pu(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function vu(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, p = t.slice(0, d), h = t.slice(d + 1), g = p.length, x = h.length, y = x > 0, b = O(p, 4), C = b[0], S = C === void 0 ? "0px" : C, w = b[1], v = w === void 0 ? S : w, _ = b[2], M = _ === void 0 ? S : _, T = b[3], k = T === void 0 ? v : T, A = O(h, 4), z = A[0], R = z === void 0 ? S : z, B = A[1], N = B === void 0 ? y ? R : v : B, L = A[2], V = L === void 0 ? y ? R : M : L, G = A[3], W = G === void 0 ? y ? N : k : G, $ = [S, v, M, k].map(function(U) {
    return Rt(U, e);
  }), j = [R, N, V, W].map(function(U) {
    return Rt(U, r);
  }), J = $.slice(), Q = j.slice();
  s = O(Nn([J[0], J[1]], e), 2), J[0] = s[0], J[1] = s[1], l = O(Nn([J[3], J[2]], e), 2), J[3] = l[0], J[2] = l[1], u = O(Nn([Q[0], Q[3]], r), 2), Q[0] = u[0], Q[3] = u[1], c = O(Nn([Q[1], Q[2]], r), 2), Q[1] = c[0], Q[2] = c[1];
  var H = o ? J : J.slice(0, Math.max(i[0], g)), tt = o ? Q : Q.slice(0, Math.max(i[1], x));
  return Z(Z([], O(H.map(function(U, et) {
    var lt = ps[et];
    return {
      virtual: et >= g,
      horizontal: nr[et],
      vertical: 0,
      pos: [n + U, a + (ar[et] === -1 ? r : 0)],
      sub: !0,
      raw: $[et],
      direction: lt
    };
  })), !1), O(tt.map(function(U, et) {
    var lt = ps[et];
    return {
      virtual: et >= x,
      horizontal: 0,
      vertical: ar[et],
      pos: [n + (nr[et] === -1 ? e : 0), a + U],
      sub: !0,
      raw: j[et],
      direction: lt
    };
  })), !1);
}
function Xp(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = pu(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function Hp(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = pu(t.slice(r)), d = f.horizontalRange, p = f.verticalRange;
  if (n > -1)
    for (var h = nr[n] === 1 ? i - u : s - i, g = d[1]; g <= n; ++g) {
      var x = ar[g] === 1 ? c : l, y = 0;
      if (n === g ? y = i : g === 0 ? y = u + h : nr[g] === -1 && (y = s - (e[r][0] - u)), t.splice(r + g, 0, {
        horizontal: nr[g],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + g, 0, [y, x]), g === 0)
        break;
    }
  else if (a > -1) {
    var b = ar[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && p[1] === 0) {
      var C = [
        u + b,
        c
      ];
      t.push({
        horizontal: nr[0],
        vertical: 0,
        pos: C
      }), e.push(C);
    }
    for (var S = p[0], g = p[1]; g <= a; ++g) {
      var y = nr[g] === 1 ? u : s, x = 0;
      if (a === g ? x = o : g === 0 ? x = c + b : ar[g] === 1 ? x = e[r + S][1] : ar[g] === -1 && (x = l - (e[r + S][1] - c)), t.push({
        horizontal: 0,
        vertical: ar[g],
        pos: [y, x]
      }), e.push([y, x]), g === 0)
        break;
    }
  }
}
function qp(t, e) {
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
var Vp = [
  [0, -1, "n"],
  [1, 0, "e"]
], $p = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function eo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(v) {
      return "".concat(we(v[0], i, n), " ").concat(we(v[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], p = r[3][0], h = r[7][0], g = r[5][1];
    if (c)
      return [
        d,
        p,
        g,
        h
      ].map(function(v) {
        return "".concat(v, "px");
      });
    var x = [d, i - p, o - g, h].map(function(v, _) {
      return we(v, _ % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = O(ct(r[4], r[0]), 2), b = y[0], C = y[1];
      x.push.apply(x, Z(["round"], O(to(u.slice(8).map(function(v, _) {
        return I(I({}, v), { pos: r[_] });
      }), n, b, C, h, d, p, g).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var S = r[0], w = we(Y(r[1][1] - S[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [w] : [we(Y(r[2][0] - S[0]), i, n), w];
    return x.push("at", we(S[0], i, n), we(S[1], o, n)), x;
  }
}
function na(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return $p.map(function(o) {
    var s = O(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: Y(u),
      horizontal: Y(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function hu(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    Y(e[1] - e[0]),
    Y(r[1] - r[0])
  ];
}
function vs(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, p;
  if (t) {
    var h = a;
    if (!h) {
      var g = de(t), x = g("clipPath");
      h = x !== "none" ? x : g("clip");
    }
    if (!((!h || h === "none" || h === "auto") && (h = n, !h))) {
      var y = Qs(h), b = y.prefix, C = b === void 0 ? h : b, S = y.value, w = S === void 0 ? "" : S, v = C === "circle", _ = " ";
      if (C === "polygon") {
        var M = ir(w || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        _ = ",";
        var T = M.map(function(Bt) {
          var Zt = O(Bt.split(" "), 2), jt = Zt[0], Ft = Zt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Rt(jt, e),
              Rt(Ft, r)
            ]
          };
        }), k = ur(T.map(function(Bt) {
          return Bt.pos;
        }));
        return {
          type: C,
          clipText: h,
          poses: T,
          splitter: _,
          left: k.minX,
          right: k.maxX,
          top: k.minY,
          bottom: k.maxY
        };
      } else if (v || C === "ellipse") {
        var A = "", z = "", R = 0, B = 0, M = Ve(w);
        if (v) {
          var N = "";
          i = O(M, 4), o = i[0], N = o === void 0 ? "50%" : o, s = i[2], A = s === void 0 ? "50%" : s, l = i[3], z = l === void 0 ? "50%" : l, R = Rt(N, Math.sqrt((e * e + r * r) / 2)), B = R;
        } else {
          var L = "", V = "";
          u = O(M, 5), c = u[0], L = c === void 0 ? "50%" : c, f = u[1], V = f === void 0 ? "50%" : f, d = u[3], A = d === void 0 ? "50%" : d, p = u[4], z = p === void 0 ? "50%" : p, R = Rt(L, e), B = Rt(V, r);
        }
        var G = [
          Rt(A, e),
          Rt(z, r)
        ], T = Z([
          {
            vertical: 1,
            horizontal: 1,
            pos: G,
            direction: "nesw"
          }
        ], O(Vp.slice(0, v ? 1 : 2).map(function(jt) {
          return {
            vertical: Y(jt[1]),
            horizontal: jt[0],
            direction: jt[2],
            sub: !0,
            pos: [
              G[0] + jt[0] * R,
              G[1] + jt[1] * B
            ]
          };
        })), !1);
        return {
          type: C,
          clipText: h,
          radiusX: R,
          radiusY: B,
          left: G[0] - R,
          top: G[1] - B,
          right: G[0] + R,
          bottom: G[1] + B,
          poses: T,
          splitter: _
        };
      } else if (C === "inset") {
        var M = Ve(w || "0 0 0 0"), W = M.indexOf("round"), $ = (W > -1 ? M.slice(0, W) : M).length, j = M.slice($ + 1), J = O(M.slice(0, $), 4), Q = J[0], H = J[1], tt = H === void 0 ? Q : H, U = J[2], et = U === void 0 ? Q : U, lt = J[3], ft = lt === void 0 ? tt : lt, xt = O([Q, et].map(function(jt) {
          return Rt(jt, r);
        }), 2), q = xt[0], nt = xt[1], Et = O([ft, tt].map(function(jt) {
          return Rt(jt, e);
        }), 2), pt = Et[0], vt = Et[1], St = e - vt, _t = r - nt, Mt = vu(j, St - pt, _t - q, pt, q), T = Z(Z([], O(na(q, St, _t, pt)), !1), O(Mt), !1);
        return {
          type: "inset",
          clipText: h,
          poses: T,
          top: q,
          left: pt,
          right: St,
          bottom: _t,
          radius: j,
          splitter: _
        };
      } else if (C === "rect") {
        var M = ir(w || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        _ = ",";
        var ht = O(M.map(function(kt) {
          var Ee = or(kt).value;
          return Ee;
        }), 4), Dt = ht[0], vt = ht[1], nt = ht[2], pt = ht[3], T = na(Dt, vt, nt, pt);
        return {
          type: "rect",
          clipText: h,
          poses: T,
          top: Dt,
          right: vt,
          bottom: nt,
          left: pt,
          values: M,
          splitter: _
        };
      }
    }
  }
}
function Up(t, e, r, n, a) {
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
    var h = O(hu(t), 2), g = h[0], x = h[1], y = g && x ? g / x : 0;
    if (y && a) {
      var b = (e + 4) % 8, C = t[b].pos, S = [0, 0];
      o.indexOf("w") > -1 ? S[0] = -1 : o.indexOf("e") > -1 && (S[0] = 1), o.indexOf("n") > -1 ? S[1] = -1 : o.indexOf("s") > -1 && (S[1] = 1);
      var w = ou([g, x], r, y, S, !0), v = g + w[0], _ = x + w[1], M = C[1], T = C[1], k = C[0], A = C[0];
      S[0] === -1 ? k = A - v : S[0] === 1 ? A = k + v : (k = k - v / 2, A = A + v / 2), S[1] === -1 ? M = T - _ : (S[1] === 1 || (M = T - _ / 2), T = M + _);
      var z = na(M, A, T, k);
      t.forEach(function(R, B) {
        l[B][0] = z[B].pos[0] - R.pos[0], l[B][1] = z[B].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, B) {
        var N = R.direction;
        N && (N.indexOf(d) > -1 && (l[B][0] = r[0]), N.indexOf(p) > -1 && (l[B][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), p && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var B = R === "n" || R === "s";
    t.forEach(function(N, L) {
      var V = N.direction, G = N.horizontal, W = N.vertical;
      !V || V.indexOf(R) === -1 || (l[L] = [
        B || !G ? 0 : r[0],
        !B || !W ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function Kp(t, e) {
  var r = O(yl(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(b) {
    return b.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var p = Wp.indexOf(s), h = Yp.indexOf(s), g = c.length;
    if (Hp(c, d, 8, p, h, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), g === c.length)
      return;
  } else
    return;
  var x = eo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  rt(t, "onClip", bt(t, e, I({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, se({
    clipPath: y
  }, e))));
}
function Zp(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(p) {
    return p.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Xp(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = eo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  rt(t, "onClip", bt(t, e, I({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, se({
    clipPath: d
  }, e))));
}
var Jp = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, p = l.is3d, h = l.left, g = l.top, x = l.pos1, y = l.pos2, b = l.pos3, C = l.pos4, S = l.clipPathState, w = l.snapBoundInfos, v = l.rotation;
    if (!u || s)
      return [];
    var _ = vs(u, c, f, a || "inset", S || n);
    if (!_)
      return [];
    var M = p ? 4 : 3, T = _.type, k = _.poses, A = k.map(function(vt) {
      var St = Gt(d, vt.pos, M);
      return [
        St[0] - h,
        St[1] - g
      ];
    }), z = [], R = [], B = T === "rect", N = T === "inset", L = T === "polygon";
    if (B || N || L) {
      var V = N ? A.slice(0, 8) : A;
      R = V.map(function(vt, St) {
        var _t = St === 0 ? V[V.length - 1] : V[St - 1], Mt = Xt(_t, vt), ht = Zl(_t, vt);
        return e.createElement("div", { key: "clipLine".concat(St), className: ut("line", "clip-line", "snap-control"), "data-clip-index": St, style: {
          width: "".concat(ht, "px"),
          transform: "translate(".concat(_t[0], "px, ").concat(_t[1], "px) rotate(").concat(Mt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (z = A.map(function(vt, St) {
      return e.createElement("div", { key: "clipControl".concat(St), className: ut("control", "clip-control", "snap-control"), "data-clip-index": St, style: {
        transform: "translate(".concat(vt[0], "px, ").concat(vt[1], "px) rotate(").concat(v, "rad) scale(").concat(o, ")")
      } });
    }), N && z.push.apply(z, Z([], O(A.slice(8).map(function(vt, St) {
      return e.createElement("div", { key: "clipRadiusControl".concat(St), className: ut("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + St, style: {
        transform: "translate(".concat(vt[0], "px, ").concat(vt[1], "px) rotate(").concat(v, "rad) scale(").concat(o, ")")
      } });
    })), !1)), T === "circle" || T === "ellipse") {
      var G = _.left, W = _.top, $ = _.radiusX, j = _.radiusY, J = O(ct(Gt(d, [G, W], M), Gt(d, [0, 0], M)), 2), Q = J[0], H = J[1], tt = "none";
      if (!i) {
        for (var U = Math.max(10, $ / 5, j / 5), et = [], lt = 0; lt <= U; ++lt) {
          var ft = Math.PI * 2 / U * lt;
          et.push([
            $ + ($ - o) * Math.cos(ft),
            j + (j - o) * Math.sin(ft)
          ]);
        }
        et.push([$, -2]), et.push([-2, -2]), et.push([-2, j * 2 + 2]), et.push([$ * 2 + 2, j * 2 + 2]), et.push([$ * 2 + 2, -2]), et.push([$, -2]), tt = "polygon(".concat(et.map(function(vt) {
          return "".concat(vt[0], "px ").concat(vt[1], "px");
        }).join(", "), ")");
      }
      z.push(e.createElement("div", { key: "clipEllipse", className: ut("clip-ellipse", "snap-control"), style: {
        width: "".concat($ * 2, "px"),
        height: "".concat(j * 2, "px"),
        clipPath: tt,
        transform: "translate(".concat(-h + Q, "px, ").concat(-g + H, "px) ").concat(va(d))
      } }));
    }
    if (i) {
      var xt = ye(Z([x, y, b, C], O(A), !1)), q = xt.width, nt = xt.height, Et = xt.left, pt = xt.top;
      if (L || B || N) {
        var et = N ? A.slice(0, 8) : A;
        z.push(e.createElement("div", { key: "clipArea", className: ut("clip-area", "snap-control"), style: {
          width: "".concat(q, "px"),
          height: "".concat(nt, "px"),
          transform: "translate(".concat(Et, "px, ").concat(pt, "px)"),
          clipPath: "polygon(".concat(et.map(function(St) {
            return "".concat(St[0] - Et, "px ").concat(St[1] - pt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return w && ["vertical", "horizontal"].forEach(function(vt) {
      var St = w[vt], _t = vt === "horizontal";
      St.isSnap && R.push.apply(R, Z([], O(St.snap.posInfos.map(function(Mt, ht) {
        var Dt = Mt.pos, Bt = ct(Gt(d, _t ? [0, Dt] : [Dt, 0], M), [h, g]), Zt = ct(Gt(d, _t ? [c, Dt] : [Dt, f], M), [h, g]);
        return sn(e, "", Bt, Zt, o, "clip".concat(vt, "snap").concat(ht), "guideline");
      })), !1)), St.isBound && R.push.apply(R, Z([], O(St.bounds.map(function(Mt, ht) {
        var Dt = Mt.pos, Bt = ct(Gt(d, _t ? [0, Dt] : [Dt, 0], M), [h, g]), Zt = ct(Gt(d, _t ? [c, Dt] : [Dt, f], M), [h, g]);
        return sn(e, "", Bt, Zt, o, "clip".concat(vt, "bounds").concat(ht), "guideline", "bounds", "bold");
      })), !1));
    }), Z(Z([], O(z), !1), O(R), !1);
  },
  dragControlCondition: function(t, e) {
    return e.inputEvent && (e.inputEvent.target.getAttribute("class") || "").indexOf("clip") > -1;
  },
  dragStart: function(t, e) {
    var r = t.props, n = r.dragWithClip, a = n === void 0 ? !0 : n;
    return a ? !1 : this.dragControlStart(t, e);
  },
  drag: function(t, e) {
    return this.dragControl(t, I(I({}, e), { isDragTarget: !0 }));
  },
  dragEnd: function(t, e) {
    return this.dragControlEnd(t, e);
  },
  dragControlStart: function(t, e) {
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = vs(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var p = d.clipText, h = d.type, g = d.poses, x = rt(t, "onClipStart", bt(t, e, {
      clipType: h,
      clipStyle: p,
      poses: g.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = p, fr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, p = l.clipPath;
    if (!p)
      return !1;
    var h = cr(t.props, "clippable"), g = h.keepRatio, x = 0, y = 0, b = o.draggable, C = Oe(e);
    s && b ? (r = O(b.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = O(C, 2), x = n[0], y = n[1]);
    var S = [x, y], w = t.state, v = w.width, _ = w.height, M = !f && !u && !c, T = p.type, k = p.poses, A = p.splitter, z = k.map(function(Tt) {
      return Tt.pos;
    });
    M && (x = -x, y = -y);
    var R = !u || k[d].direction === "nesw", B = T === "inset" || T === "rect", N = k.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var L = k[d], V = L.horizontal, G = L.vertical, W = [
        x * Y(V),
        y * Y(G)
      ];
      N = Up(k, d, W, B, g);
    } else R && (N = z.map(function() {
      return [x, y];
    }));
    var $ = z.map(function(Tt, ee) {
      return wt(Tt, N[ee]);
    }), j = Z([], O($), !1);
    w.snapBoundInfos = null;
    var J = p.type === "circle", Q = p.type === "ellipse";
    if (J || Q) {
      var H = ye($), tt = Y(H.bottom - H.top), U = Y(Q ? H.right - H.left : tt), et = $[0][1] + tt, lt = $[0][0] - U, ft = $[0][0] + U;
      J && (j.push([ft, H.bottom]), N.push([1, 0])), j.push([H.left, et]), N.push([0, 1]), j.push([lt, H.bottom]), N.push([1, 0]);
    }
    var xt = Hl((h.clipHorizontalGuidelines || []).map(function(Tt) {
      return Rt("".concat(Tt), _);
    }), (h.clipVerticalGuidelines || []).map(function(Tt) {
      return Rt("".concat(Tt), v);
    }), v, _), q = [], nt = [];
    if (J || Q)
      q = [j[4][0], j[2][0]], nt = [j[1][1], j[3][1]];
    else if (B) {
      var Et = [j[0], j[2], j[4], j[6]], pt = [N[0], N[2], N[4], N[6]];
      q = Et.filter(function(Tt, ee) {
        return pt[ee][0];
      }).map(function(Tt) {
        return Tt[0];
      }), nt = Et.filter(function(Tt, ee) {
        return pt[ee][1];
      }).map(function(Tt) {
        return Tt[1];
      });
    } else
      q = j.filter(function(Tt, ee) {
        return N[ee][0];
      }).map(function(Tt) {
        return Tt[0];
      }), nt = j.filter(function(Tt, ee) {
        return N[ee][1];
      }).map(function(Tt) {
        return Tt[1];
      });
    var vt = [0, 0], St = Jo(xt, h.clipTargetBounds && { left: 0, top: 0, right: v, bottom: _ }, q, nt, 5, 5), _t = St.horizontal, Mt = St.vertical, ht = _t.offset, Dt = Mt.offset;
    if (_t.isBound && (vt[1] += ht), Mt.isBound && (vt[0] += Dt), (Q || J) && N[0][0] === 0 && N[0][1] === 0) {
      var H = ye($), Bt = H.bottom - H.top, Zt = Q ? H.right - H.left : Bt, jt = Mt.isBound ? Y(Dt) : Mt.snapIndex === 0 ? -Dt : Dt, Ft = _t.isBound ? Y(ht) : _t.snapIndex === 0 ? -ht : ht;
      Zt -= jt, Bt -= Ft, J && (Bt = Bl(Mt, _t) > 0 ? Bt : Zt, Zt = Bt);
      var Ot = j[0];
      j[1][1] = Ot[1] - Bt, j[2][0] = Ot[0] + Zt, j[3][1] = Ot[1] + Bt, j[4][0] = Ot[0] - Zt;
    } else if (B && g && u) {
      var kt = O(hu(k), 2), Ee = kt[0], Ht = kt[1], ze = Ee && Ht ? Ee / Ht : 0, Ze = k[d], K = Ze.direction || "", dt = j[1][1], et = j[5][1], lt = j[7][0], ft = j[3][0];
      Y(ht) <= Y(Dt) ? ht = oe(ht) * Y(Dt) / ze : Dt = oe(Dt) * Y(ht) * ze, K.indexOf("w") > -1 ? lt -= Dt : K.indexOf("e") > -1 ? ft -= Dt : (lt += Dt / 2, ft -= Dt / 2), K.indexOf("n") > -1 ? dt -= ht : K.indexOf("s") > -1 ? et -= ht : (dt += ht / 2, et -= ht / 2);
      var Jt = na(dt, ft, et, lt);
      j.forEach(function(Lr, xn) {
        var ce;
        ce = O(Jt[xn].pos, 2), Lr[0] = ce[0], Lr[1] = ce[1];
      });
    } else
      j.forEach(function(Tt, ee) {
        var mn = N[ee];
        mn[0] && (Tt[0] -= Dt), mn[1] && (Tt[1] -= ht);
      });
    var Je = eo(t, p, $), Ie = "".concat(T, "(").concat(Je.join(A), ")");
    if (w.clipPathState = Ie, J || Q)
      q = [j[4][0], j[2][0]], nt = [j[1][1], j[3][1]];
    else if (B) {
      var Et = [j[0], j[2], j[4], j[6]];
      q = Et.map(function(ee) {
        return ee[0];
      }), nt = Et.map(function(ee) {
        return ee[1];
      });
    } else
      q = j.map(function(Tt) {
        return Tt[0];
      }), nt = j.map(function(Tt) {
        return Tt[1];
      });
    if (w.snapBoundInfos = Jo(xt, h.clipTargetBounds && { left: 0, top: 0, right: v, bottom: _ }, q, nt, 1, 1), b) {
      var ue = w.is3d, Fr = w.allMatrix, Fe = ue ? 4 : 3, pr = vt;
      s && (pr = [
        S[0] + vt[0] - C[0],
        S[1] + vt[1] - C[1]
      ]), b.deltaOffset = Pt(Fr, [pr[0], pr[1], 0, 0], Fe);
    }
    return rt(t, "onClip", bt(t, e, I({ clipEventType: "changed", clipType: T, poses: $, clipStyle: Ie, clipStyles: Je, distX: x, distY: y }, se((a = {}, a[T === "rect" ? "clip" : "clipPath"] = Ie, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (rt(t, "onClipEnd", he(t, e, {})), a && (s ? Zp(t, e) : i && Kp(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, Qp = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : Kt(e.inputEvent.target, ut("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    fr(t, e);
    var n = bt(t, e, {
      dragStart: ie.dragStart(t, new Rr().dragStart([0, 0], e))
    }), a = rt(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = O(Oe(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, p = l.is3d, h = t.props.originRelative, g = h === void 0 ? !0 : h, x = p ? 4 : 3, y = [o, s];
    if (a) {
      var b = e.distOrigin;
      (b[0] || b[1]) && (y = b);
    }
    var C = wt(r.startOrigin, y), S = wt(r.startTargetOrigin, y), w = ct(y, r.prevOrigin), v = hn(f, d, C, x), _ = t.getRect(), M = ye(dr(v, u, c, x)), T = [
      _.left - M.left,
      _.top - M.top
    ];
    r.prevOrigin = y;
    var k = [
      we(S[0], u, g),
      we(S[1], c, g)
    ].join(" "), A = ie.drag(t, vn(e, t.state, T, !!n)), z = bt(t, e, I(I({ width: u, height: c, origin: C, dist: y, delta: w, transformOrigin: k, drag: A }, se({
      transformOrigin: k,
      transform: A.transform
    }, e)), { afterTransform: A.transform }));
    return rt(t, "onDragOrigin", z), z;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (rt(t, "onDragOriginEnd", he(t, e, {})), !0) : !1;
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
function tv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    ev(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function ev(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function rv(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function hs(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = Ve(t), vu(i, e, r, 0, 0, n, a);
}
function gs(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = to(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = qp(f, u), p = d.horizontals, h = d.verticals, g = c.join(" ");
  i.borderRadiusState = g;
  var x = bt(t, e, I({ horizontals: p, verticals: h, borderRadius: g, width: o, height: s, delta: n, dist: r }, se({
    borderRadius: g
  }, e)));
  return rt(t, "onRound", x), x;
}
function ms(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = Ui(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var nv = {
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
    return e === !0 || e === "line" ? ut("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, p = d === void 0 ? [0, 0] : d, h = f.maxRoundControls, g = h === void 0 ? [4, 4] : h, x = f.zoom, y = f.roundPadding, b = y === void 0 ? 0 : y, C = f.isDisplayShadowRoundControls, S = f.groupable;
    if (!n)
      return null;
    var w = c || ms(t), v = s ? 4 : 3, _ = hs(w, a, i, p, !0);
    if (!_)
      return null;
    var M = 0, T = 0, k = S ? [0, 0] : [l, u];
    return _.map(function(A, z) {
      var R = A.horizontal, B = A.vertical, N = A.direction || "", L = Z([], O(A.pos), !1);
      T += Math.abs(R), M += Math.abs(B), R && N.indexOf("n") > -1 && (L[1] -= b), B && N.indexOf("w") > -1 && (L[0] -= b), R && N.indexOf("s") > -1 && (L[1] += b), B && N.indexOf("e") > -1 && (L[0] += b);
      var V = ct(Gt(o, L, v), k), G = C && C !== "horizontal", W = A.vertical ? M <= g[1] && (G || !A.virtual) : T <= g[0] && (C || !A.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(z), className: ut("control", "border-radius", A.vertical ? "vertical" : "", A.virtual ? "virtual" : ""), "data-radius-index": z, style: {
        display: W ? "block" : "none",
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
    var f = bt(t, e, {}), d = rt(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, fr(t, e);
    var p = t.props, h = p.roundRelative, g = p.minRoundControls, x = g === void 0 ? [0, 0] : g, y = t.state, b = y.width, C = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var S = ms(t), w = hs(S || "", b, C, x, !0) || [];
    return n.controlPoses = w, y.borderRadiusState = to(w, h, b, C).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = O(Oe(e), 2), o = i[0], s = i[1], l = [o, s], u = ct(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, p = d.width, h = d.height, g = n[a], x = g.vertical, y = g.horizontal, b = n.map(function(S) {
      var w = S.horizontal, v = S.vertical, _ = [
        w * y * l[0],
        v * x * l[1]
      ];
      if (w) {
        if (f[0] === 1)
          return _;
        if (f[0] < 4 && w !== y)
          return _;
      } else {
        if (f[1] === 0)
          return _[1] = v * y * l[0] / p * h, _;
        if (x) {
          if (f[1] === 1)
            return _;
          if (f[1] < 4 && v !== x)
            return _;
        }
      }
      return [0, 0];
    });
    b[a] = l;
    var C = n.map(function(S, w) {
      return I(I({}, S), { pos: wt(S.pos, b[w]) });
    });
    return a < 4 ? C.slice(0, a + 1).forEach(function(S) {
      S.virtual = !1;
    }) : C.slice(4, a + 1).forEach(function(S) {
      S.virtual = !1;
    }), r.prevDist = [o, s], gs(t, e, l, u, C);
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
        rv(u, o);
      else if (s && (d === !0 || d === "line")) {
        var p = O(yl(t, e), 2), h = p[0], g = p[1];
        tv(u, l, h, g);
      }
      c !== u.filter(function(y) {
        var b = y.virtual;
        return b;
      }).length && gs(t, e, [0, 0], [0, 0], u);
    }
    var x = he(t, e, {});
    return rt(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Me(t, "roundable", e), o = I({ targets: t.props.targets, events: i.map(function(s, l) {
      return I(I({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return rt(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Me(t, "roundable", e), o = I({ targets: t.props.targets, events: i.map(function(s, l) {
      return I(I(I({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), se({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return rt(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Me(t, "roundable", e);
    ha(t, "onRound", function(s) {
      var l = I({ targets: t.props.targets, events: a.map(function(u, c) {
        return I(I(I({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), se({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      rt(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = I({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return I(I({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return rt(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function av(t, e) {
  var r = e ? 4 : 3, n = At(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var gu = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(il(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = av(s, n) ? [] : Ve(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return bt(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Yt(r) ? r : Ve(r);
      },
      isPinch: !!e.isPinch
    });
  },
  fillDragParams: function(t, e) {
    return bt(t, e, {
      isPinch: !!e.isPinch
    });
  },
  dragStart: function(t, e) {
    this.setTransform(t, e), this.resetStyle(e), rt(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), rt(t, "onBeforeRender", bt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), rt(t, "onBeforeRenderEnd", bt(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var r = this;
    this.dragStart(t, e);
    var n = Me(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.setTransform(l, o), r.resetStyle(o), r.fillDragStartParams(l, o);
    });
    rt(t, "onBeforeRenderGroupStart", bt(t, e, {
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
    var n = Me(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.resetStyle(o), r.fillDragParams(l, o);
    });
    rt(t, "onBeforeRenderGroup", bt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), rt(t, "onBeforeRenderGroupEnd", bt(t, e, {
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
}, mu = {
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
    rt(t, "onRenderStart", bt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    rt(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    rt(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    rt(t, "onRenderGroupStart", bt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Me(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    rt(t, "onRenderGroup", bt(t, e, I(I({ isPinch: !!e.isPinch, targets: t.props.targets, transform: In(e), transformObject: {} }, se(Rn(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Me(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    rt(t, "onRenderGroupEnd", bt(t, e, I({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: In(e) }, se(Rn(e)))));
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
    return Ir(Kn(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), bt(t, e, I({ isPinch: !!e.isPinch, transformObject: r, transform: In(e) }, se(Rn(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Ir(Kn(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), bt(t, e, I({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: In(e) }, se(Rn(e))));
  }
};
function en(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var p = Z([], O(e), !1);
  if (f) {
    var h = i.requestAble;
    p.some(function(z) {
      return z.name === h;
    }) || p.push.apply(p, Z([], O(t.props.ables.filter(function(z) {
      return z.name === h;
    })), !1));
  }
  if (!p.length || p.every(function(z) {
    return z.dragRelation;
  }))
    return !1;
  var g = i.inputEvent, x;
  l && g && (x = document.elementFromPoint(i.clientX, i.clientY) || g.target);
  var y = !1, b = function() {
    var z;
    y = !0, (z = i.stop) === null || z === void 0 || z.call(i);
  }, C = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  C && t.updateRect(a, !0, !1);
  var S = i.datas, w = d ? "controlGesto" : "targetGesto", v = t[w], _ = function(z, R, B) {
    if (!(R in z) || v !== t[w])
      return !1;
    var N = z.name, L = S[N] || (S[N] = {});
    if (s && (L.isEventStart = !B || !z[B] || z[B](t, i)), !L.isEventStart)
      return !1;
    var V = z[R](t, I(I({}, i), { stop: b, datas: L, originalDatas: S, inputTarget: x }));
    return t._emitter.off(), s && V === !1 && (L.isEventStart = !1), V;
  };
  C && p.forEach(function(z) {
    z.unset && z.unset(t);
  }), _(gu, "drag".concat(n).concat(a));
  var M = 0, T = 0;
  r.forEach(function(z) {
    if (y)
      return !1;
    var R = "".concat(z).concat(n).concat(a), B = "".concat(z).concat(n, "Condition");
    a === "" && !f && Mp(t.state, i);
    var N = p.filter(function(G) {
      return G[R];
    });
    N = N.filter(function(G, W) {
      return G.name && N.indexOf(G) === W;
    });
    var L = N.filter(function(G) {
      return _(G, R, B);
    }), V = L.length;
    y && ++M, V && ++T, !y && s && N.length && !V && (M += N.filter(function(G) {
      var W = G.name, $ = S[W];
      return $.isEventStart ? G.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || T) && _(mu, "drag".concat(n).concat(a));
  var k = v !== t[w] || M === r.length;
  if ((l || y || k) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(z) {
    z.state.gestos = {};
  }), p.forEach(function(z) {
    z.unset && z.unset(t);
  })), s && !k && !f && T && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || k)
    return !1;
  if (!s && T && !o || l) {
    var A = t.props.flushSync || $l;
    A(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && T && !o && en(t, e, r, n, a + "After", i), !0;
}
function ro(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || Kt(i, "moveable-area") || Kt(i, "moveable-padding") || Kt(i, "moveable-edgeDraggable");
  };
}
function xu(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = ro(t);
  return bu(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function yu(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = ro(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return bu(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function bu(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, p = o.preventDefault, h = p === void 0 ? !0 : p, g = o.preventRightClick, x = g === void 0 ? !0 : g, y = o.preventWheelClick, b = y === void 0 ? !0 : y, C = o.dragContainer, S = Pe(C, !0), w = {
    preventDefault: h,
    preventRightClick: x,
    preventWheelClick: b,
    container: S || xe(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(M) {
      return t.controlBox.contains(M.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, v = new fl(e, w), _ = n === "Control";
  return ["drag", "pinch"].forEach(function(M) {
    ["Start", "", "End"].forEach(function(T) {
      v.on("".concat(M).concat(T), function(k) {
        var A, z = k.eventType, R = M === "drag" && k.isPinch;
        if (a[z] && !a[z](k)) {
          k.stop();
          return;
        }
        if (!R) {
          var B = M === "drag" ? [M] : ["drag", M], N = Z([], O(t[r]), !1), L = en(t, N, B, n, T, k);
          L ? (t.props.stopPropagation || T === "Start" && _) && ((A = k == null ? void 0 : k.inputEvent) === null || A === void 0 || A.stopPropagation()) : k.stop();
        }
      });
    });
  }), v;
}
var iv = /* @__PURE__ */ (function() {
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
function ov(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = wl(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, p = i.zoom, h = bd(f, r), g = h.matrixes, x = h.is3d, y = h.offsetContainer, b = h.zoom, C = n, S = 4, w = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, v = l, _ = At(S), M = At(S), T = At(S), k = At(S), A = o.length, z = g.map(function(W) {
    return I(I({}, W), { matrix: W.matrix ? Z([], O(W.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && C && (v = Te(v, 3, 4), di(o)), !x && C && di(z), z.forEach(function(W) {
    M = Pt(M, W.matrix, S);
  });
  var R = r || Ke(t), B = ((a = z[0]) === null || a === void 0 ? void 0 : a.target) || ln(R, R, !0).offsetParent, N = z.slice(1).reduce(function(W, $) {
    return Pt(W, $.matrix, S);
  }, At(S));
  o.forEach(function(W, $) {
    if (A - 2 === $ && (T = _.slice()), A - 1 === $ && (k = _.slice()), !W.matrix) {
      var j = o[$ + 1], J = Ep(W, j, B, S, Pt(N, _, S));
      W.matrix = lr(J, S);
    }
    _ = Pt(_, W.matrix, S);
  });
  var L = !w && s;
  v || (v = At(L ? 4 : 3));
  var V = va(w && v.length === 16 ? Te(v, 4, 3) : v, L), G = M;
  return M = nl(M, S, S), {
    hasZoom: p !== 1 || b !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: M,
    originalRootMatrix: G,
    beforeMatrix: T,
    offsetMatrix: k,
    allMatrix: _,
    targetMatrix: v,
    targetTransform: V,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: C,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function sv(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Jl(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = ov(t, e, r, n), c = kr(u.allMatrix, u.transformOrigin, a, i);
    s = I(I({}, u), c);
    var f = kr(u.allMatrix, [50, 50], 100, 100);
    o = Ql([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return I(I(I({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: At(d), rootMatrix: At(d), beforeMatrix: At(d), offsetMatrix: At(d), allMatrix: At(d), targetMatrix: At(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function gi(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = On(), u = On(), c = On(), f = On(), d = [0, 0], p = {}, h = sv(e, r, a, !0);
  if (e) {
    var g = de(e);
    i.forEach(function(z) {
      p[z] = g(z);
    });
    var x = h.is3d ? 4 : 3, y = kr(h.offsetMatrix, wt(h.transformOrigin, al(h.targetMatrix, x)), h.width, h.height);
    o = y.direction, s = wt(y.origin, [y.left - h.left, y.top - h.top]), f = tn(h.offsetRootContainer);
    var b = ln(n, n, !0).offsetParent || h.offsetRootContainer;
    if (h.hasZoom) {
      var C = kr(Pt(h.originalRootMatrix, h.allMatrix), h.transformOrigin, h.width, h.height), S = kr(h.originalRootMatrix, ta(de(b)("transformOrigin")).map(function(z) {
        return parseFloat(z);
      }), b.offsetWidth, b.offsetHeight);
      if (l = Oa(C, f), c = Oa(S, f, b, !0), t) {
        var w = C.left, v = C.top;
        u = Oa({
          left: w,
          top: v,
          bottom: v,
          right: v
        }, f);
      }
    } else {
      l = tn(e), c = yd(b), t && (u = tn(t));
      var _ = c.left, M = c.top, T = c.clientLeft, k = c.clientTop, A = [
        l.left - _,
        l.top - M
      ];
      d = ct(zr(h.rootMatrix, A, 4), [T + h.left, k + h.top]);
    }
  }
  return I({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: p, offsetDelta: d }, h);
}
function xs(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = ur([e, r, n, a]), o = [i.minX, i.minY], s = ct(t.origin, o);
  return e = ct(e, o), r = ct(r, o), n = ct(n, o), a = ct(a, o), I(I({}, t), {
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
var Ar = /* @__PURE__ */ (function(t) {
  dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = I({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, gi(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new fn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        Uc(r._observerId), r._observerId = tl(function() {
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
    var h = O(a || [0, 0], 2), g = h[0], x = h[1], y = n.left, b = n.top, C = n.target, S = n.direction, w = n.hasFixed, v = n.offsetDelta, _ = r.targets, M = this.isDragging(), T = {};
    this.getEnabledAbles().forEach(function(N) {
      T["data-able-".concat(N.name.toLowerCase())] = !0;
    });
    var k = this._getAbleClassName(), A = _ && _.length && (C || f) || o || !this._hasFirstTarget && this.state.isPersisted, z = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - g, b - x];
    !f && r.useAccuratePosition && (R[0] += v[0], R[1] += v[1]);
    var B = {
      position: w ? "fixed" : "absolute",
      display: A ? "block" : "none",
      visibility: z ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (B["--moveable-line-padding"] = d), p && (B["--moveable-control-padding"] = p), st.createElement(
      c,
      I({ cspNonce: l, ref: qe(this, "controlBox"), className: "".concat(ut("control-box", S === -1 ? "reverse" : "", M ? "dragging" : ""), " ").concat(k, " ").concat(i) }, T, { onClick: this._onPreventClick, style: B }),
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
    a && this._changeAbleViewClassNames([]), wr(this, !1), wr(this, !0);
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
    return ve(n, function(a) {
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(Bi) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && ro(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (on(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = I({ width: 0, height: 0 }, r);
    var d = c.left, p = c.top, h = c.width, g = c.height, x = Ja([i, o, l, s], u), y = _f(x, [
      [d, p],
      [d + h, p],
      [d + h, p + g],
      [d, p + g]
    ]), b = Kr(x);
    return !y || !b ? 0 : Math.min(100, y / b * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? $n([r, n], Ja([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Pr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = gi(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var p = xs(i.persistData);
      for (var h in p)
        d[h] = p[h];
    }
    o && Pr(), this.updateState(d, s ? !1 : a);
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
    var r = this.state, n = Ce(this.state), a = O(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = ye(n), c = r.width, f = r.height, d = u.width, p = u.height, h = u.left, g = u.top, x = [r.left, r.top], y = wt(x, r.origin), b = wt(x, r.beforeOrigin), C = r.transformOrigin;
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
      transformOrigin: C,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && pi(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && pi(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return Ip(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = ve(l, function(y) {
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
    var f = c.request(i), d = a || n.isInstant, p = f.isControl ? "controlAbles" : "targetAbles", h = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), g = Z([], O(s[p]), !1), x = {
      request: function(y) {
        return en(i, g, ["drag"], h, "", I(I({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return en(i, g, ["drag"], h, "End", I(I({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return en(i, g, ["drag"], h, "Start", I(I({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
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
    var y = uu(a || {}), b = y.left, C = y.top, S = y.bottom, w = y.right, v = l ? 4 : 3, _ = [];
    g ? _ = o : this.controlBox && n.groupable ? _ = i : _ = wt(i, [p, h]);
    var M = Vn(v, lr(_.map(function(B) {
      return -B;
    }), v), s, lr(o, v)), T = me(M, u, [-b, -C], v), k = me(M, c, [w, -C], v), A = me(M, f, [-b, S], v), z = me(M, d, [w, S], v);
    r.renderPoses = [
      T,
      k,
      A,
      z
    ], r.renderLines = [
      [T, k],
      [k, z],
      [z, A],
      [A, T]
    ];
    {
      var R = x / 2;
      r.renderLines = [
        [
          me(M, u, [-b - R, -C], v),
          me(M, c, [w + R, -C], v)
        ],
        [
          me(M, c, [w, -C - R], v),
          me(M, d, [w, S + R], v)
        ],
        [
          me(M, d, [w + R, S], v),
          me(M, f, [-b - R, S], v)
        ],
        [
          me(M, f, [-b, S + R], v),
          me(M, u, [-b, -C - R], v)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !vi(s, n), c = u || !vi(l, a);
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
    return a[i] || (a[i] = pl(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = xs(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = zn(o, [s, l], i), f = zn(o, [u], i);
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
      createElement: st.createElement
    };
    return this.renderState = {}, _p(iu(zn(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return Z(Z([], O(n), !1), O(s), !1);
    }, Z([], O(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (wr(this, !1), this.updateState({ gestos: {} })), n || wr(this, !0), a && r && !this.targetGesto && (this.targetGesto = xu(this, a, "")), !this.controlGesto && n && (this.controlGesto = yu(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Pe(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: st.createElement
    };
    return l.renderLines.map(function(c, f) {
      return sn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = Nr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = zn(u, [c]), d = f.length > 0, p = i[c];
        if (!d) {
          p && (p.destroy(), i[c] = null);
          return;
        }
        p || (p = new iv(a, r, c), i[c] = p), p.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Pe(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Pe(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(Z(Z([], O(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Bp : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = au(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = O(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = zi(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      el(n, i[u]);
    }), l.forEach(function(u) {
      Ti(n, a[u]);
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
      return (!((f = s[p]) === null || f === void 0) && f.isEventStart || !((d = l[p]) === null || d === void 0) && d.isEventStart) && (h += " ".concat(ut("".concat(p).concat(r, "-dragging")))), h.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = xe(this.getControlBoxElement());
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
    var n = this, a, i = this.props, o = i.target, s = xe(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = Lf(u), p = d.next(); !p.done; p = d.next()) {
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
    flushSync: $l,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(st.PureComponent), no = {
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
    var d = _r(t, "parentPosition", [o, s], function(h) {
      return h.join(",");
    }), p = _r(t, "requestStyles", t.getRequestChildStyles(), function(h) {
      return h.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), Z(Z([], O(a.map(function(h, g) {
      return e.createElement(Ar, { key: "moveable" + g, ref: Us(t, "moveables", g), target: h, origin: !1, requestStyles: p, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[g], zoom: u });
    })), !1), O(iu(c.map(function(h, g) {
      var x = h.pos1, y = h.pos2, b = h.pos3, C = h.pos4, S = [x, y, b, C];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(w, v) {
        var _ = O(w, 2), M = _[0], T = _[1];
        return sn(e, "", ct(S[M], d), ct(S[T], d), u, "group-rect-".concat(g, "-").concat(v));
      });
    }))), !1);
  }
}, lv = pn("clickable", {
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
      rt(t, "onClick", bt(t, e, {
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
      i === -1 && (i = Ge(a, function(l) {
        return l.contains(n);
      }), s = i > -1), rt(t, "onClickGroup", bt(t, e, {
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
function xr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), I(I({}, t), { datas: e });
}
var uv = pn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? kl(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Kt(a, ut("direction")) && Kt(a, ut("edge")) && Kt(a, ut("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return ie.dragStart(t, xr(e));
  },
  drag: function(t, e) {
    return ie.drag(t, xr(e));
  },
  dragEnd: function(t, e) {
    return ie.dragEnd(t, xr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Kt(a, ut("direction")) && Kt(a, ut("line"));
  },
  dragGroupStart: function(t, e) {
    return ie.dragGroupStart(t, xr(e));
  },
  dragGroup: function(t, e) {
    return ie.dragGroup(t, xr(e));
  },
  dragGroupEnd: function(t, e) {
    return ie.dragGroupEnd(t, xr(e));
  },
  unset: function(t) {
    return ie.unset(t);
  }
}), Su = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, cv = [
  gu,
  du,
  pp,
  Pp,
  ie,
  uv,
  ui,
  Op,
  Ap,
  Ud,
  Fp,
  Lp,
  jp,
  Qp,
  Jp,
  nv,
  no,
  Su,
  lv,
  fu,
  mu
];
function ys(t, e) {
  var r = O(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function Bn(t, e) {
  var r = O(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function bs(t, e) {
  return Math.max.apply(Math, Z([], O(t.map(function(r) {
    var n = O(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Ss(t, e) {
  return Math.min.apply(Math, Z([], O(t.map(function(r) {
    var n = O(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function fv(t, e) {
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
  var f = gt(e, le);
  if (f % 90) {
    var d = f / 180 * Math.PI, p = Math.tan(d), h = -1 / p, g = [ii, Xo], x = [[0, 0], [0, 0]], y = [ii, Xo], b = [[0, 0], [0, 0]];
    t.forEach(function(Q) {
      Q.forEach(function(H) {
        var tt = ys([-p, 1, 0], H), U = ys([-h, 1, 0], H);
        g[0] > tt && (x[0] = H, g[0] = tt), g[1] < tt && (x[1] = H, g[1] = tt), y[0] > U && (b[0] = H, y[0] = U), y[1] < U && (b[1] = H, y[1] = U);
      });
    });
    var C = O(x, 2), S = C[0], w = C[1], v = O(b, 2), _ = v[0], M = v[1], T = [-p, 1, Bn([-p, 1], S)], k = [-p, 1, Bn([-p, 1], w)], A = [-h, 1, Bn([-h, 1], _)], z = [-h, 1, Bn([-h, 1], M)];
    r = O([
      [T, A],
      [T, z],
      [k, A],
      [k, z]
    ].map(function(Q) {
      var H = O(Q, 2), tt = H[0], U = H[1];
      return Ai(tt, U)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = g[1] - g[0];
  } else {
    var R = Ss(t, 0), B = Ss(t, 1), N = bs(t, 0), L = bs(t, 1);
    if (i = [R, B], o = [N, B], s = [R, L], l = [N, L], u = N - R, c = L - B, f % 180) {
      var V = [s, i, l, o];
      n = O(V, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = L - B, c = N - R;
    }
  }
  if (f % 360 > 180) {
    var V = [l, s, o, i];
    a = O(V, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var G = ur([i, o, s, l]), W = G.minX, $ = G.minY, j = G.maxX, J = G.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: W,
    minY: $,
    maxX: j,
    maxY: J,
    rotation: e
  };
}
function Cu(t, e) {
  var r = e.map(function(n) {
    if (Yt(n)) {
      var a = Cu(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = ve(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Yt(r[0]) ? r[0] : r;
}
var dv = /* @__PURE__ */ (function(t) {
  dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new sl(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Pr(!0), this.moveables.forEach(function(lt) {
      lt.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(lt) {
      return { finded: !1, manager: lt };
    }), f = this.props.targetGroups || [], d = Cu(c, f), p = s.useDefaultGroupRotate;
    d.push.apply(d, Z([], O(c.filter(function(lt) {
      var ft = lt.finded;
      return !ft;
    }).map(function(lt) {
      var ft = lt.manager;
      return ft;
    })), !1));
    var h = [], g = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function b(lt, ft, xt) {
      var q = lt.map(function(Mt) {
        if (Yt(Mt)) {
          var ht = b(Mt, ft), Dt = [ht.pos1, ht.pos2, ht.pos3, ht.pos4];
          return h.push(ht), { poses: Dt, rotation: ht.rotation };
        } else
          return {
            poses: Ce(Mt.state),
            rotation: Mt.getRotation()
          };
      }), nt = q.map(function(Mt) {
        var ht = Mt.rotation;
        return ht;
      }), Et = 0, pt = nt[0], vt = nt.every(function(Mt) {
        return Math.abs(pt - Mt) < 0.1;
      });
      g ? Et = !p && vt ? pt : x : Et = !p && !xt && vt ? pt : ft;
      var St = q.map(function(Mt) {
        var ht = Mt.poses;
        return ht;
      }), _t = fv(St, Et);
      return _t;
    }
    var C = b(d, this.rotation, !0);
    g && (this.rotation = C.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = h;
    var S = this.transformOrigin, w = this.rotation, v = this.scale, _ = C.width, M = C.height, T = C.minX, k = C.minY, A = Rp([
      [0, 0],
      [_, 0],
      [0, M],
      [_, M]
    ], Qi(S, _, M), this.rotation / 180 * Math.PI), z = ur(A.result), R = z.minX, B = z.minY, N = " rotate(".concat(w, "deg)") + " scale(".concat(oe(v[0]), ", ").concat(oe(v[1]), ")"), L = "translate(".concat(-R, "px, ").concat(-B, "px)").concat(N);
    this.controlBox.style.transform = "translate3d(".concat(T, "px, ").concat(k, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(S, ";") + "width:".concat(_, "px;height:").concat(M, "px;") + "transform: ".concat(L), o.width = _, o.height = M;
    var V = this.getContainer(), G = gi(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || V, []), W = [G.left, G.top], $ = O(Ce(G), 4), j = $[0], J = $[1], Q = $[2], H = $[3], tt = ur([j, J, Q, H]), U = [tt.minX, tt.minY], et = oe(v[0] * v[1]);
    G.pos1 = ct(j, U), G.pos2 = ct(J, U), G.pos3 = ct(Q, U), G.pos4 = ct(H, U), G.left = T - G.left + U[0], G.top = k - G.top + U[1], G.origin = ct(wt(W, G.origin), U), G.beforeOrigin = ct(wt(W, G.beforeOrigin), U), G.originalBeforeOrigin = wt(W, G.originalBeforeOrigin), G.transformOrigin = ct(wt(W, G.transformOrigin), U), u.style.transform = "translate(".concat(-R - U[0], "px, ").concat(-B - U[1], "px)") + N, Pr(), this.updateState(I(I({}, G), { posDelta: U, direction: et, beforeDirection: et }), a);
  }, e.prototype.getRect = function() {
    return I(I({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.triggerEvent = function(r, n, a) {
    if (a || r.indexOf("Group") > -1)
      return t.prototype.triggerEvent.call(this, r, n);
    this._emitter.trigger(r, n);
  }, e.prototype.getRequestChildStyles = function() {
    var r = this.getEnabledAbles().reduce(function(n, a) {
      var i, o, s = (o = (i = a.requestChildStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return Z(Z([], O(n), !1), O(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return Z([], O(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, Z(Z([], O(this.props.ables), !1), [no], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Pe(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (wr(this, !1), wr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = xu(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = yu(this, "GroupControl")));
    var d = !vi(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !lu(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = I(I({}, Ar.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Ar), pv = /* @__PURE__ */ (function(t) {
  dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), st.createElement(o, { cspNonce: i, ref: qe(this, "controlBox"), className: ut("control-box") }, l.map(function(d, p) {
      var h, g, x = (g = (h = a.individualGroupableProps) === null || h === void 0 ? void 0 : h.call(a, d, p)) !== null && g !== void 0 ? g : {};
      return st.createElement(Ar, I({ key: "moveable" + p, ref: Us(r, "moveables", p) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[p] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Pr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Pr();
  }, e.prototype.getRect = function() {
    return I(I({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this.moveables.map(function(l) {
      return l.request(r, I(I({}, n), { isInstant: !1 }), !1);
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
    var a = n, i = ve(this.moveables, function(o) {
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
    return Z([], O(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Ar);
function Eu(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (be(n)) {
        e[n] && r.push.apply(r, Z([], O(e[n]), !1));
        return;
      }
      Yt(n) ? r.push.apply(r, Z([], O(Eu(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function Du(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (be(n)) {
        e[n] && r.push.apply(r, Z([], O(e[n]), !1));
        return;
      }
      Yt(n) ? r.push(Du(n, e)) : r.push(n);
    }
  }), r;
}
function wu(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Yt(r) && Yt(a) ? wu(r, a) : !0 : !1;
  });
}
var vv = /* @__PURE__ */ (function(t) {
  dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new sl(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = Nr(r).join(`
`);
    this.defaultStyled = pl("div", Bc(Bi, Jf + a));
  }, e.getTotalAbles = function() {
    return Z([du, no, Su, fu], O(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Gf(a, ["ables", "props"]), l = O(this._updateRefs(!0), 2), u = l[0], c = l[1], f = Eu(u, c), d = f.length > 1, p = n.getTotalAbles(), h = Z(Z([], O(p), !1), O(i || []), !1), g = I(I(I({}, s), o || {}), { ables: h, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, b = s.persistData;
    if (b != null && b.children && (d = !0), s.individualGroupable)
      return st.createElement(pv, I({ key: "individual-group", ref: qe(this, "moveable") }, g, { target: null, targets: f }));
    if (d) {
      var C = Du(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var S = y.props.target;
        S && f.indexOf(S) > -1 && (x = I({}, y.state));
      }
      return st.createElement(dv, I({ key: "group", ref: qe(this, "moveable") }, g, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: C, firstRenderState: x }));
    } else {
      var w = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var v = y.moveables || [], _ = ve(v, function(M) {
          return M.props.target === w;
        });
        _ && (x = I({}, _.state));
      }
      return st.createElement(Ar, I({ key: "single", ref: qe(this, "moveable") }, g, { target: w, firstRenderState: x }));
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
    var n = this.refTargets, a = Ji(this.props.target || this.props.targets), i = typeof document < "u", o = wu(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (be(c)) {
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
    var u = O(this._updateRefs(), 3), c = u[0], f = u[1], d = u[2];
    this.refTargets = c, this.selectorMap = f, d && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, Ff([
    Ks(ed)
  ], e.prototype, "moveable", void 0), e;
})(st.PureComponent), hv = /* @__PURE__ */ (function(t) {
  dn(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = cv, e;
})(vv), mi = function(t, e) {
  return mi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, mi(t, e);
};
function gv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  mi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function mv(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var gn = mv(function(t, e) {
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
gn.code;
gn.codes;
gn.aliases;
var xv = gn.names;
gn.title;
var Cs = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, Es = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function _u(t, e) {
  var r = (xv[t] || e || "").toLowerCase();
  for (var n in Cs)
    r = r.replace(n, Cs[n]);
  return r.replace(/\s/g, "");
}
function Mu(t, e) {
  e === void 0 && (e = _u(t.keyCode, t.key));
  var r = yv(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function yv(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function Ds(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = Es[r] || 5, i = Es[n] || 5;
    return a - i;
  }), e;
}
var ws, bv = /* @__PURE__ */ (function(t) {
  gv(e, t);
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
    }, $t(n, "blur", a.blur), $t(n, "keydown", a.keydownEvent), $t(n, "keyup", a.keyupEvent), a;
  }
  var r = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return ws || (ws = new e());
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
    return Yt(a) ? this.on("".concat(n, ".").concat(Ds(a).join(".")), i) : be(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Yt(a) ? this.off("".concat(n, ".").concat(Ds(a).join(".")), i) : be(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = _u(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = Mu(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(fn), xi = function(t, e) {
  return xi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, xi(t, e);
};
function ku(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  xi(t, e);
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
function Sv(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Cv(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function rn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Ev(t) {
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
function Dv(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function wv(t, e, r) {
  var n = _e(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function Tu(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || _e(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, p) {
    Tu(d, c[p], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !Kt(l, d) && Ti(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function _v(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = Sv(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function Na(t, e, r) {
  t !== e && r(t, e);
}
function _s(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var p = Math.abs(i), h = Math.abs(s), g = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = ki([p, h], [0, 0], [g, x], !!e), p = n[0], h = n[1], i = (i >= 0 ? 1 : -1) * p, s = (s >= 0 ? 1 : -1) * h;
  var y = Math.min(0, i), b = Math.min(0, s), C = u + y, S = c + b;
  return {
    left: C,
    top: S,
    right: C + p,
    bottom: S + h,
    width: p,
    height: h
  };
}
function jn(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function Ms(t, e, r) {
  var n = Sr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return rn(rn(rn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function ks(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Re(t[n], t[n - 1]), e);
  return e;
}
var Iu = dl(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), yi = "selecto-selection ".concat(Iu.className), ao = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Mv = rn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], ao), Ru = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], kv = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], Tv = /* @__PURE__ */ (function(t) {
  ku(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new ll(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, p = a.options, h = p.selectFromInside, g = p.selectByClick, x = p.rootContainer, y = p.boundContainer, b = p.preventDragFromInside, C = b === void 0 ? !0 : b, S = p.clickBySelectEnd, w = p.dragCondition;
      if (w && !w(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var v = xe(a.container);
      u.innerWidth = v.innerWidth, u.innerHeight = v.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = Oi(), u.containerX = 0, u.containerY = 0;
      var _ = a.container, M = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var T = a.container.getBoundingClientRect();
        u.containerX = T.left, u.containerY = T.top, u.scaleMatrix = cf(a.container, x);
      }
      if (y) {
        var k = pe(y) && "element" in y ? Vt({
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
        }, A = k.element, z = void 0;
        if (A) {
          be(A) ? z = _e(_).querySelector(A) : A === !0 ? z = a.container : z = A;
          var R = z.getBoundingClientRect();
          k.left && (M.left = R.left), k.top && (M.top = R.top), k.right && (M.right = R.right), k.bottom && (M.bottom = R.bottom);
        }
      }
      u.boundArea = M;
      var B = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, N = [], L = g && !S, V = !1;
      if (!h || L) {
        var G = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        V = !!G, L && (N = G ? [G] : []);
      }
      var W = !h && V;
      if (W && !g)
        return s.stop(), !1;
      var $ = d.type, j = $ === "mousedown" || $ === "touchstart", J = !s.isClick && j ? a.emit("dragStart", Vt(Vt({}, s), {
        data: u.data
      })) : !0;
      if (!J)
        return s.stop(), !1;
      if (a.continueSelect ? (N = Ms(a.selectedTargets, N, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(N, B, s, !0, W && g && !S && C), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var Q = Wn(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(Q[0], "px, ").concat(Q[1], "px)");
      }
      if (W && g && !S)
        d.preventDefault(), C && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, B, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var H = a.options, tt = H.scrollOptions, U = H.innerScrollOptions, et = !1;
        if (U) {
          for (var lt = s.inputEvent, ft = lt.target, xt = null, q = ft; q && q !== _e(_).body; ) {
            var nt = getComputedStyle(q).overflow !== "visible";
            if (nt) {
              xt = q;
              break;
            }
            q = q.parentElement;
          }
          xt && (u.innerScrollOptions = Vt({
            container: xt,
            checkScrollEvent: !0
          }, U === !0 ? {} : U), a.dragScroll.dragStart(s, u.innerScrollOptions), et = !0);
        }
        !et && tt && tt.container && a.dragScroll.dragStart(s, tt), W && g && S && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = _s(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (u && a.emit("dragEnd", Vt(Vt({
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
        var p = a._findElement((u == null ? void 0 : u.target) || wv(d, s.clientX, s.clientY), l.selectableTargets);
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
      var l = _e(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === xe(a.container) && (u = l.documentElement);
        var c = on(u) ? [u] : [].slice.call(u), f = s.target;
        c.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = n.portalContainer;
    var i = n.container;
    a.options = Vt({
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
      getElementRect: jn,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = Sr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    return Vt(Vt({}, d), {
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
    var a = this.getElementRect || jn, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== jn) {
      var s = n.getBoundingClientRect();
      return Ja(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (oa(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (on(i))
        a.push(i);
      else if (pe(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(_e(n).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, r.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var n = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (n == null ? void 0 : n.container);
      i && this.dragScroll.checkScroll(Vt({
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = _e(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var p = f.parentElement, h = [], g = [], x = function() {
          var y = c.get(p);
          if (!y) {
            var b = getComputedStyle(p).overflow !== "visible";
            if (b) {
              var C = jn(p);
              y = {
                parentElement: p,
                indexes: [],
                points: [C.pos1, C.pos2, C.pos4, C.pos3],
                paths: rn([], g)
              }, h.push(p), h.forEach(function(S) {
                c.set(S, y);
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
    var i = Ev(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new bv(a || xe(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(yi, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    Na(i.keyContainer, n, function() {
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
    Na(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    Na(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, p = this.container;
    this.target = Tu(_v("div", {
      className: "".concat(yi, " ").concat(d || "")
    }), this.target, p);
    var h = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(_e(p).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new fl(this.dragContainer, {
      checkWindowBlur: !0,
      container: xe(p),
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
    }), $t(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Iu.inject(h, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, p = n.bottom, h = a.innerGroups, g = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, b = o == null ? void 0 : o.clientY, C = a.ignoreClick, S = [[c, f], [d, f], [d, p], [c, p]], w = function(G, W) {
      var $ = or(typeof l == "function" ? "".concat(l(W)) : "".concat(l)), j = C ? !1 : $n([y, b], G);
      if (!i && u && j)
        return !0;
      var J = ti(S, G);
      if (!J.length)
        return !1;
      var Q = Kr(J), H = 0;
      if (Q === 0 && Kr(G) === 0 ? (H = ks(G), Q = ks(J)) : H = Kr(G), $.unit === "px")
        return Q >= $.value;
      var tt = qn(Math.round(Q / H * 100), 0, 100);
      return tt >= Math.min(100, $.value);
    }, v = a.selectableTargets, _ = a.selectablePoints, M = a.selectableInners;
    if (!h)
      return v.filter(function(G, W) {
        return M[W] ? w(_[W], v[W]) : !1;
      });
    for (var T = [], k = Math.floor(c / g), A = Math.floor(d / g), z = Math.floor(f / x), R = Math.floor(p / x), B = k; B <= A; ++B) {
      var N = h[B];
      if (N)
        for (var L = z; L <= R; ++L) {
          var V = N[L];
          V && V.forEach(function(G) {
            var W = _[G], $ = M[G], j = v[G];
            $ && w(W, j) && T.push(j);
          });
        }
    }
    return Dv(T);
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
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Sr(u.startSelectedTargets, n), d = f.added, p = f.removed, h = f.prevList, g = f.list, x = {
      startSelected: h,
      startAdded: d.map(function(y) {
        return g[y];
      }),
      startRemoved: p.map(function(y) {
        return h[y];
      })
    };
    o && this.emit("selectStart", Vt(Vt(Vt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (c.added.length || c.removed.length) && this.emit("select", Vt(Vt(Vt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, r._selectEnd = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", p = Sr(n, this.selectedTargets), h = p.added, g = p.removed, x = p.prevList, y = p.list, b = Sr(a, this.selectedTargets), C = b.added, S = b.removed, w = b.prevList, v = b.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: h.map(function(_) {
        return y[_];
      }),
      removed: g.map(function(_) {
        return x[_];
      }),
      afterAdded: C.map(function(_) {
        return v[_];
      }),
      afterRemoved: S.map(function(_) {
        return w[_];
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
    a === void 0 && (a = _s(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, p = i.scaleMatrix, h = Wn(p, [s - f, o - d]), g = Wn(p, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(h[0], "px, ").concat(h[1], "px);") + "width:".concat(g[0], "px;height:").concat(g[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = Ms(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var b = this.emit("drag", Vt(Vt({}, n), {
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
    var o = Mu(n.inputEvent, n.key), s = [].concat(a), l = Yt(s[0]) ? s : [s];
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
            var b = s[h], C = y.points, S = ti(b, C);
            if (!S.length)
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
        p.forEach(function(w) {
          var v = Math.floor(w[0] / i), _ = Math.floor(w[1] / o);
          g = Math.min(v, g), x = Math.max(v, x), y = Math.min(_, y), b = Math.max(_, b);
        });
        for (var C = g; C <= x; ++C)
          for (var S = y; S <= b; ++S)
            d[C] = d[C] || {}, d[C][S] = d[C][S] || [], d[C][S].push(h);
      }), n.innerGroups = d;
    }
  }, e = Cv([jc(ao, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = qa("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = qa("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(fn), Iv = /* @__PURE__ */ (function(t) {
  ku(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(Tv), bi = function(t, e) {
  return bi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, bi(t, e);
};
function Rv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  bi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var aa = function() {
  return aa = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, aa.apply(this, arguments);
};
function Pv(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var Ts = Ru.map(function(t) {
  return qa("on ".concat(t));
}), Ov = /* @__PURE__ */ (function(t) {
  Rv(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return st.createElement("div", {
      className: yi,
      ref: qe(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    Mv.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Iv(aa(aa({}, i), {
      portalContainer: this.selectionElement
    })), Ru.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[Ts[s]] && u[Ts[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    ao.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Pv([Ks(kv)], e.prototype, "selecto", void 0), e;
})(st.PureComponent);
const Be = "http://www.w3.org/2000/svg";
function Gn(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Mr(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function Is(t, e, r, n, a, i) {
  const o = a * 1.3;
  e.forEach((s, l) => {
    if (!s) return;
    const u = document.createElementNS(Be, "text");
    u.setAttribute("x", String(r)), u.setAttribute("y", String(n + l * o + a * 0.82)), u.setAttribute("font-size", String(a)), u.setAttribute("font-family", i.fontFamily || "Arial, Helvetica, sans-serif"), u.setAttribute("font-weight", i.fontWeight || "400"), u.setAttribute("fill", i.color || "#1e293b"), u.setAttribute("xml:space", "preserve"), u.textContent = s, t.appendChild(u);
  });
}
function Rs(t, e, r, n, a, i) {
  const o = Mr(e, r, n, i), s = document.createElementNS(Be, "g");
  s.setAttribute("transform", `translate(${Math.round(o.left)},${Math.round(o.top)})`);
  const l = e.querySelector("canvas");
  if (l) {
    const c = document.createElementNS(Be, "image"), f = Mr(l, r, n, i);
    c.setAttribute("x", "0"), c.setAttribute("y", "0"), c.setAttribute("width", String(Math.round(f.width || o.width))), c.setAttribute("height", String(Math.round(f.height || o.height))), c.setAttribute("href", ic(e, a, Math.round(f.width || o.width)) ?? l.toDataURL("image/png")), s.appendChild(c);
  }
  const u = e.querySelector("svg");
  if (u) {
    const c = u.cloneNode(!0), f = u.clientWidth || Number(u.getAttribute("width")) || o.width, d = f > 0 ? o.width / f : 1;
    if (Math.abs(d - 1) > 1e-3) {
      const p = document.createElementNS(Be, "g");
      p.setAttribute("transform", `scale(${d})`), p.appendChild(c), s.appendChild(p);
    } else s.appendChild(c);
  }
  t.appendChild(s);
}
function zv(t, e, r) {
  const { width: n, height: a } = Ya(e.page), i = Xn(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, o = document.createElementNS(Be, "svg");
  o.setAttribute("xmlns", Be), o.setAttribute("width", String(n)), o.setAttribute("height", String(a)), o.setAttribute("viewBox", `0 0 ${n} ${a}`);
  const s = document.createElementNS(Be, "rect");
  s.setAttribute("width", "100%"), s.setAttribute("height", "100%"), s.setAttribute("fill", "#ffffff"), o.appendChild(s);
  const l = t.getBoundingClientRect(), u = [...t.querySelectorAll(".gl-layout-item")].sort((c, f) => (Number(c.style.zIndex) || 0) - (Number(f.style.zIndex) || 0));
  for (const c of u) {
    const f = Mr(c, l, r.zoom, i);
    if (f.left >= n || f.top >= a || f.left + f.width <= 0 || f.top + f.height <= 0) continue;
    if (c.classList.contains("has-frame")) {
      const g = document.createElementNS(Be, "rect");
      g.setAttribute("x", String(Math.round(f.left) + 0.5)), g.setAttribute("y", String(Math.round(f.top) + 0.5)), g.setAttribute("width", String(Math.round(f.width) - 1)), g.setAttribute("height", String(Math.round(f.height) - 1)), g.setAttribute("fill", "none"), g.setAttribute("stroke", "#94a3b8"), o.appendChild(g);
    }
    const d = c.querySelector(".gl-layout-text-surface");
    if (d) {
      const g = d instanceof HTMLTextAreaElement ? d.value : d.textContent ?? "", x = getComputedStyle(d), y = Mr(d, l, r.zoom, i), b = Number(c.dataset.zoom) || 1, C = (parseFloat(x.fontSize) || 14) * b, S = (parseFloat(x.paddingLeft) || 0) * b, w = (parseFloat(x.paddingTop) || 0) * b;
      Is(o, g.split(`
`), y.left + S, y.top + w, C, x);
      continue;
    }
    const p = c.querySelector(".gl-layout-plot-host");
    if (!p) continue;
    if (p.__miniPlotCfg) {
      Rs(o, p, l, r.zoom, r.dpi, i);
      continue;
    }
    const h = p.querySelector(".gl-prop-chart");
    if (h) {
      const g = ac(h);
      if (g) {
        const x = Mr(h, l, r.zoom, i), y = g.width > 0 ? x.width / g.width : 1, b = document.createElementNS(Be, "g");
        b.setAttribute("transform", `translate(${x.left},${x.top}) scale(${y})`), b.appendChild(g.root), o.appendChild(b);
      }
      continue;
    }
    p.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((g) => {
      const x = (g.textContent ?? "").trim();
      if (!x) return;
      const y = getComputedStyle(g), b = Mr(g, l, r.zoom, i), C = g.offsetWidth > 0 ? b.width / g.offsetWidth : 1;
      Is(o, [x], b.left, b.top, (parseFloat(y.fontSize) || 12) * C, y);
    }), p.querySelectorAll(".mini-plot-cell").forEach((g) => Rs(o, g, l, r.zoom, r.dpi, i));
  }
  return { root: o, width: n, height: a };
}
function Ps(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
async function Os(t) {
  return new Promise((e, r) => t.toBlob((n) => n ? e(n) : r(new Error("PNG export failed")), "image/png"));
}
function Av(t, e, r) {
  return Xn(e.page).map((n, a) => zv(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a }));
}
async function Nv(t, e, r) {
  const n = e.page.dpi, a = ec(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      Gn(new Blob([Ps(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const c = {};
    t.forEach((f, d) => {
      c[`${a}-p${d + 1}.svg`] = rc(Ps(f.root));
    }), Gn(new Blob([Io(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = [];
  for (const c of t) i.push(await nc(c, n));
  if (r === "png") {
    if (i.length === 1) {
      Gn(await Os(i[0]), `${a}.png`);
      return;
    }
    const c = {};
    for (const [f, d] of i.entries())
      c[`${a}-p${f + 1}.png`] = new Uint8Array(await (await Os(d)).arrayBuffer());
    Gn(new Blob([Io(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const { widthMm: o, heightMm: s } = Gs(e.page), { jsPDF: l } = await import("./jspdf.es.min-8ev2qW9X.js").then((c) => c.j), u = new l({ orientation: o >= s ? "landscape" : "portrait", unit: "mm", format: [o, s] });
  i.forEach((c, f) => {
    f > 0 && u.addPage([o, s], o >= s ? "landscape" : "portrait"), u.addImage(c.toDataURL("image/png"), "PNG", 0, 0, o, s);
  }), u.save(`${a}.pdf`);
}
const Bv = "", Pu = "{none}", Fn = [
  { id: "auto", label: "What differs across the page", template: Bv },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: Pu }
], Ba = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function jv(t, e) {
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
const ja = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function zs(t, e) {
  return t.join(e);
}
function Gv(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Fv(t, e, r, n, a) {
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
function ia(t, e) {
  return t.trim() === Pu ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function Lv(t) {
  const e = new Set(t.map((i) => i.sampleId)), r = new Set(t.map((i) => i.populationId)), n = t.some((i) => i.label), a = e.size <= 1 && r.size > 1 ? "{population}" : r.size <= 1 && e.size > 1 ? "{file}" : "{population} · {file}";
  return n ? `${a} · {plot}` : a;
}
function Ou(t) {
  return re(t.recipe) && t.recipe.iterated === !0;
}
function As(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function Ga(t, e, r, n, a, i) {
  const o = Ou(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = As(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = As(s.title, e, r, n))), {
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
function Wv(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !re(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId);
      i && (r.recipe = { ...r.recipe, text: ia(r.recipe.text, i) });
    }
}
function Yv(t, e, r) {
  const n = Xv(t, e);
  for (const a of n) Wv(a.items, r);
  return n;
}
function Xv(t, e) {
  const r = t.iteration ?? Fs;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((p) => Ga(p, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((p, h) => ({
      index: h,
      units: [p],
      items: t.items.map((g) => Ga(g, p, h + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = oc(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let p = 0; p < n; p += u) {
    const h = e.slice(p, p + u), g = [];
    h.forEach((x, y) => {
      const b = o === "row-major" ? Math.floor(y / i) : y % a, S = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: b * f };
      for (const w of t.items) g.push(Ga(w, x, p + y + 1, n, S, y));
    }), d.push({ index: d.length, units: h, items: g });
  }
  return d;
}
function Hv(t, e, r, n, a) {
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
function qv(t, e, r) {
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
  return Ln(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function Vv(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const $v = (t) => [...t].sort((e, r) => e - r);
function Fa(t, e) {
  const r = $v(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function Uv(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: Fa(r, 0.5),
    q1: Fa(r, 0.25),
    q3: Fa(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function Kv(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => Uv(n, r.get(n)));
}
function zu(t) {
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
function Zv(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function Jv(t, e) {
  if (e <= 0) return 0;
  const r = Qv(t);
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
function Qv(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function th(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - Jv(e / 2, t / 2))) : 1;
}
function eh(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = zu([...t, ...e]), s = a.slice(0, r).reduce((p, h) => p + h, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * Zv(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${Au(d)}` };
}
function rh(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = zu(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, p) => d + p, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = th(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${Au(u)}` };
}
function nh(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? eh(e[0], e[1]) : e.length > 2 ? rh(e) : null;
}
function Au(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function ah(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const Nu = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function ih(t, e, r, n, a) {
  var d, p;
  const i = e.find((h) => h.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((h) => n.includes(h.id)), l = [], u = [];
  for (const h of s) {
    let g = t.populationId;
    if (i && i.tree.id !== h.tree.id) {
      const b = Hr(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        h.tree,
        br(a)
      );
      if (!b.id) {
        u.push(h.name);
        continue;
      }
      g = b.id;
    }
    let x;
    if (t.statistic === "median") {
      const b = t.channel ? h.sample.index(t.channel) : void 0, C = h.derived.masks[g];
      if (b === void 0 || !C) x = null;
      else {
        const S = h.sample.displayColumn(b), w = [];
        for (let v = 0; v < S.length; v++) C[v] && Number.isFinite(S[v]) && w.push(S[v]);
        x = w.length ? sc(w) : null;
      }
    } else
      x = h.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][g];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((p = r[h.id]) == null ? void 0 : p[t.groupBy]) ?? "" : h.name;
    l.push({ sampleId: h.id, name: h.name, group: y, value: x });
  }
  const c = Kv(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : Nu[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? nh(c) : null, population: o, axis: f, missing: u };
}
const La = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), oh = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function sh({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = st.useMemo(() => ah(t.points.map((k) => k.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((k) => La(k).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), p = Math.max(0, ...u.map((k) => k.label.length)), h = u.length > 0 && p * o * 0.6 > (n - f - 8) / u.length, g = 8 + (h ? p * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - g), b = (k) => d + y - (k - c.min) / (c.max - c.min || 1) * y, C = u.length ? x / u.length : x, S = (k) => f + (k + 0.5) * C, w = Math.min(48, C * 0.6), v = r.pubStyle ? "#000000" : "#334155", _ = r.pubStyle ? "#d4d4d8" : "#93c5fd", M = r.pubStyle ? "#000000" : "#1d4ed8", T = b(Math.max(c.min, 0));
  return /* @__PURE__ */ E.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ E.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ E.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ E.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: v, children: i }),
    !t.points.length && /* @__PURE__ */ E.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ E.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: v, children: [
      /* @__PURE__ */ E.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: v }),
      c.ticks.map((k) => /* @__PURE__ */ E.jsxs("g", { children: [
        /* @__PURE__ */ E.jsx("line", { x1: f - 4, x2: f, y1: b(k), y2: b(k), stroke: v }),
        /* @__PURE__ */ E.jsx("text", { x: f - 6, y: b(k), textAnchor: "end", dominantBaseline: "central", children: La(k) })
      ] }, k)),
      /* @__PURE__ */ E.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ E.jsx("line", { x1: f, x2: f + x, y1: T, y2: T, stroke: v })
    ] }),
    /* @__PURE__ */ E.jsx("g", { className: "gl-layout-chart-groups", children: u.map((k, A) => {
      const z = S(A), R = e.showPoints || e.chartType === "dots" ? k.points : [];
      return /* @__PURE__ */ E.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(k.mean) && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
          /* @__PURE__ */ E.jsx("rect", { x: z - w / 2, y: Math.min(b(k.mean), T), width: w, height: Math.abs(T - b(k.mean)), fill: _, stroke: v, strokeWidth: 0.8 }),
          k.n > 1 && k.sd > 0 && /* @__PURE__ */ E.jsxs("g", { stroke: v, strokeWidth: 1, children: [
            /* @__PURE__ */ E.jsx("line", { x1: z, x2: z, y1: b(k.mean - k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ E.jsx("line", { x1: z - w / 4, x2: z + w / 4, y1: b(k.mean + k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ E.jsx("line", { x1: z - w / 4, x2: z + w / 4, y1: b(k.mean - k.sd), y2: b(k.mean - k.sd) })
          ] })
        ] }),
        e.chartType === "box" && k.n > 0 && /* @__PURE__ */ E.jsxs("g", { stroke: v, strokeWidth: 1, fill: _, children: [
          /* @__PURE__ */ E.jsx("line", { x1: z, x2: z, y1: b(k.min), y2: b(k.q1) }),
          /* @__PURE__ */ E.jsx("line", { x1: z, x2: z, y1: b(k.q3), y2: b(k.max) }),
          /* @__PURE__ */ E.jsx("rect", { x: z - w / 2, y: b(k.q3), width: w, height: Math.max(0.5, b(k.q1) - b(k.q3)) }),
          /* @__PURE__ */ E.jsx("line", { x1: z - w / 2, x2: z + w / 2, y1: b(k.median), y2: b(k.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && k.n > 1 && /* @__PURE__ */ E.jsx("line", { x1: z - w / 2, x2: z + w / 2, y1: b(k.mean), y2: b(k.mean), stroke: v, strokeWidth: 2 }),
        R.map((B, N) => /* @__PURE__ */ E.jsx("circle", { cx: z + oh(N + A * 31) * w * 0.3, cy: b(B.value), r: Math.max(2, o * 0.28), fill: M, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ E.jsx("title", { children: `${B.name}: ${La(B.value)}` }) }, B.sampleId)),
        /* @__PURE__ */ E.jsx(
          "text",
          {
            x: z,
            y: d + y + 6,
            textAnchor: h ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: v,
            transform: h ? `rotate(-45 ${z} ${d + y + 6})` : void 0,
            children: k.label
          }
        )
      ] }, k.label || String(A));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ E.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: v, children: [
      /* @__PURE__ */ E.jsx("line", { x1: S(0), x2: S(u.length - 1), y1: d - 4, y2: d - 4, stroke: v }),
      /* @__PURE__ */ E.jsx("text", { x: (S(0) + S(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const Wa = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), lh = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, Xr = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], Ns = 10, uh = { index: 0, units: [], items: [] }, ch = {}, Bs = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, fh = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], dh = [
  { how: "horizontal", label: "Spread ↔", title: "Equal gaps between three or more items, left to right" },
  { how: "vertical", label: "Spread ↕", title: "Equal gaps between three or more items, top to bottom" }
];
function ph(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function vh(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function Ne(t, e, r) {
  var o, s, l;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((o = n.title) != null && o.trim()) return n.title.trim();
  if (n.kind === "figure") return ((l = (s = n.illustration.figure) == null ? void 0 : s.name) == null ? void 0 : l.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  const a = e.find(({ id: u }) => u === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  return n.kind === "chart" ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${Nu[n.statistic]}` : n.kind === "strategy" ? `${(i == null ? void 0 : i.name) ?? "Population"} strategy` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function hh({
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
  var C;
  const c = st.useRef(null), f = t.recipe, d = JSON.stringify(o), p = f.kind === "text" ? null : e.find(({ id: S }) => S === f.sampleId) ?? null, h = p ? { ...r, ...p.tree } : r, g = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: S }) => S === t.templateSampleId) ?? null : null, x = f.kind === "text" || !p ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : wc(f.populationId, p.tree, br(r), g == null ? void 0 : g.tree.id), y = x.id, b = x.missing ? ((C = g == null ? void 0 : g.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : C.name) ?? "the population" : null;
  return st.useEffect(() => {
    const S = c.current;
    if (!S || f.kind === "text") return;
    const w = window.setTimeout(() => {
      var L, V, G;
      if (S.innerHTML = "", !p) {
        S.textContent = "The referenced file is unavailable or still loading.", S.className = "gl-layout-plot-host is-missing";
        return;
      }
      const v = h.populations[y];
      if (b || !v) {
        S.textContent = b ? `${p.name} has no population corresponding to ${b}.` : "The referenced population is unavailable.", S.className = "gl-layout-plot-host is-missing";
        return;
      }
      S.className = "gl-layout-plot-host";
      const _ = u({ ...f, populationId: y }), M = (W) => _ ? ia(W, _) : W, T = Math.max(120, t.width - 8), k = Math.max(120, t.height - 8);
      if (f.kind === "strategy") {
        const W = _c(
          p.sample,
          h.gates,
          h.populations,
          h.root_population_id ?? "",
          y,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), $ = 8, j = 26, J = Math.max(1, W.length);
        let Q = 1, H = 0;
        for (let U = 1; U <= J; U++) {
          const et = Math.ceil(J / U), lt = Math.floor((T - $ * (U - 1)) / U), ft = Math.floor((k - j - $ * (et - 1)) / et), xt = Math.min(lt, ft);
          xt > H && (H = xt, Q = U);
        }
        H = Math.max(100, Math.min(800, H));
        const tt = Mc(
          p.sample,
          W,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: Q,
            plotSize: H,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: Wa(o),
            contextTitle: M(((L = f.title) == null ? void 0 : L.trim()) || "{population}")
          }
        );
        S.id = `layout-strategy-${t.id}`;
        for (const U of Object.values(tt.plots ?? {})) U.canvas_scale = s;
        No().renderStrategyGrid(S.id, tt);
        return;
      }
      const A = Math.max(120, Math.min(T, k)), z = f.kind === "histogram" ? null : f.yChannel, R = kc(
        p.sample,
        h.gates,
        h.gate_order,
        h.populations,
        p.derived.masks,
        p.derived.stats.event_count,
        [y],
        [f.xChannel],
        z,
        n,
        {
          displayMode: f.displayMode,
          maxEvents: o.maxEvents,
          nColumns: 1,
          plotSize: A,
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
          fontSizes: Wa(o),
          scaleFontsWithPlot: !0
        }
      ), B = `${y}|${f.xChannel}`, N = (V = R.plots) == null ? void 0 : V[B];
      if (!N) {
        S.textContent = "No events are available for this FCS/population combination.", S.className = "gl-layout-plot-host is-missing";
        return;
      }
      No().renderMiniPlot(S, {
        ...N,
        display_mode: f.displayMode,
        plot_size: A,
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
        title: M(l),
        contour_levels: o.contourLevels,
        font_sizes: Wa(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: ((G = R.gate_overlays) == null ? void 0 : G[B]) ?? []
      });
    }, 80);
    return () => window.clearTimeout(w);
  }, [
    a,
    i,
    d,
    n,
    t.height,
    t.id,
    t.width,
    f,
    p,
    h.gate_order,
    h.gate_version,
    h.gates,
    h.stored_hierarchies,
    h.populations,
    h.root_population_id,
    y,
    b,
    s,
    l,
    u
  ]), f.kind === "text" ? /* @__PURE__ */ E.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ E.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function gh({
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
  onDelete: y,
  onOpenInGating: b,
  onTextChange: C,
  onTextFocus: S,
  onTextEscape: w
}) {
  var T;
  const { t: v } = Si(), _ = Cc(t), M = _ === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / _)), height: Math.max(1, Math.round(t.height / _)) };
  return /* @__PURE__ */ E.jsxs(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": _ === 1 ? void 0 : _,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: [
        /* @__PURE__ */ E.jsxs("header", { className: "gl-layout-item-head", children: [
          /* @__PURE__ */ E.jsxs("span", { title: Ne(t, n), children: [
            t.locked ? "🔒 " : "",
            Ne(t, n)
          ] }),
          /* @__PURE__ */ E.jsxs("div", { children: [
            re(t.recipe) && /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-item-action",
                title: v("Open in Gating"),
                onPointerDown: (k) => k.stopPropagation(),
                onClick: b,
                children: "↗"
              }
            ),
            /* @__PURE__ */ E.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-item-action",
                title: v("Remove from layout"),
                onPointerDown: (k) => k.stopPropagation(),
                onClick: y,
                children: "×"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ E.jsx("div", { className: "gl-layout-item-body", style: _ === 1 ? void 0 : { zoom: _, width: M.width, height: M.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ E.jsx(
          xh,
          {
            text: t.recipe.text,
            templateText: e ?? t.recipe.text,
            fontSize: t.recipe.fontSize,
            bold: t.recipe.bold,
            onCommit: C,
            onFocus: S,
            onEscape: w
          }
        ) : t.recipe.kind === "figure" ? /* @__PURE__ */ E.jsx(
          Ec,
          {
            recipe: t.recipe,
            files: p,
            sources: h,
            state: a,
            globalScales: i,
            width: Math.max(120, M.width - 8),
            height: Math.max(80, M.height - 8)
          }
        ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ E.jsx(
          Dc,
          {
            recipe: t.recipe,
            samples: p,
            state: a,
            metadataById: d,
            divisionProfiles: g,
            width: Math.max(120, M.width - 8),
            height: Math.max(80, M.height - 8),
            containerId: `layout-proportions-${t.id}`
          }
        ) : t.recipe.kind === "chart" ? /* @__PURE__ */ E.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ E.jsx(
          sh,
          {
            data: ih(t.recipe, n, d, f, a),
            recipe: t.recipe,
            style: l,
            width: Math.max(120, M.width - 8),
            height: Math.max(80, M.height - 8),
            title: ((T = t.recipe.title) == null ? void 0 : T.trim()) || Ne(t, n)
          }
        ) }) : /* @__PURE__ */ E.jsx(
          hh,
          {
            item: M,
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
      ]
    }
  );
}
const mh = [
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
function js({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = Si();
  return /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-style-fields", children: [
    mh.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
      n(i),
      /* @__PURE__ */ E.jsx(
        De,
        {
          "aria-label": n(i),
          value: t[a],
          min: zo[a][0],
          max: zo[a][1],
          step: o,
          integer: s,
          onCommit: (l) => r({ [a]: l })
        }
      )
    ] }, a)),
    /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      n("Gate labels"),
      /* @__PURE__ */ E.jsxs(
        "select",
        {
          "aria-label": n("Gate labels"),
          value: t.gateLabels,
          onChange: (a) => r({ gateLabels: a.target.value }),
          children: [
            /* @__PURE__ */ E.jsx("option", { value: "name-percent", children: n("Name and percentage") }),
            /* @__PURE__ */ E.jsx("option", { value: "percent", children: n("Percentage") }),
            /* @__PURE__ */ E.jsx("option", { value: "number", children: n("Number only") }),
            /* @__PURE__ */ E.jsx("option", { value: "name", children: n("Name only") }),
            /* @__PURE__ */ E.jsx("option", { value: "none", children: n("None") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ E.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ E.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (a) => r({ pubStyle: a.target.checked })
        }
      ),
      n("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ E.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ E.jsx(
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
function xh({
  text: t,
  templateText: e,
  fontSize: r,
  bold: n,
  onCommit: a,
  onFocus: i,
  onEscape: o
}) {
  const [s, l] = st.useState(t), [u, c] = st.useState(!1);
  return st.useEffect(() => {
    u || l(t);
  }, [t, u]), /* @__PURE__ */ E.jsx(
    "textarea",
    {
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: s,
      style: { fontSize: r, fontWeight: n ? 700 : 400 },
      onChange: (f) => l(f.target.value),
      onFocus: () => {
        c(!0), l(e), i();
      },
      onBlur: (f) => {
        c(!1), s !== e ? a(s, f.currentTarget.scrollHeight) : l(t);
      },
      onKeyDown: (f) => {
        f.stopPropagation(), f.key === "Escape" && (l(e), f.currentTarget.blur(), o());
      }
    }
  );
}
function bh({
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
  illustrationConfig: h,
  onOpenInIllustration: g,
  plottingSettings: x,
  divisionProfiles: y = ch,
  onOpenInPlotting: b,
  dataRevision: C,
  densityColorPower: S,
  onOpenInGating: w
}) {
  var _o, Mo, ko, To;
  const { t: v } = Si(), [_, M] = st.useState([]), [T, k] = st.useState(!0), [A, z] = st.useState(null), [R, B] = st.useState(null), [N, L] = st.useState([]), [V, G] = st.useState([]), W = st.useRef(null), $ = st.useRef(null), [j, J] = st.useState(null), [Q, H] = st.useState(null), [tt, U] = st.useState(
    l ?? ((_o = r[0]) == null ? void 0 : _o.id) ?? ""
  ), [et, lt] = st.useState("item"), [ft, xt] = st.useState(!1), [q, nt] = st.useState(1), Et = st.useRef(q);
  Et.current = q;
  const [pt, vt] = st.useState(q);
  st.useEffect(() => {
    const m = window.setTimeout(() => vt(q), 250);
    return () => window.clearTimeout(m);
  }, [q]);
  const St = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * pt)), [_t, Mt] = st.useState("pdf"), [ht, Dt] = st.useState(!1), Bt = st.useRef(null), Zt = st.useRef(null), jt = (m) => {
    var D;
    M(m), (D = Bt.current) == null || D.focus({ preventScroll: !0 });
  }, Ft = (m) => jt(m ? [m] : []), Ot = lc(
    r,
    r.map((m) => m.id),
    c,
    C
  ), kt = Ot.current ? Ot.sources.map((m) => ({
    ...m,
    derived: m.gating
  })) : [], Ee = st.useMemo(
    () => Object.fromEntries(r.map((m) => [m.id, m.metadata])),
    [r]
  ), Ht = r.length === 0 || Ot.current && Ot.pending === 0, ze = st.useRef([]), Ze = st.useRef([]), K = t.sheets.find(({ id: m }) => m === t.activeSheetId) ?? t.sheets[0], dt = (K == null ? void 0 : K.iteration) ?? Fs, Jt = st.useMemo(() => {
    const m = K == null ? void 0 : K.items.find((P) => re(P.recipe) && P.recipe.iterated === !0), D = m && "sampleId" in m.recipe ? m.recipe.sampleId : l;
    return kt.find(({ id: P }) => P === D) ?? kt[0] ?? null;
  }, [K, kt, l]), Je = st.useMemo(
    () => dt.mode === "populations" ? Jt ? qv(dt, Jt.tree, r.find(({ id: m }) => m === Jt.id) ?? Jt) : [] : Hv(dt, r, n, a, i),
    [dt, r, n, a, i, Jt]
  ), Ie = st.useCallback((m, D) => {
    const P = r.find(({ id: yt }) => yt === m.sampleId) ?? null, F = kt.find(({ id: yt }) => yt === m.sampleId) ?? null;
    let X = m.populationId;
    if (F && D && D !== m.sampleId) {
      const yt = kt.find(({ id: Ct }) => Ct === D);
      if (yt && yt.tree.id !== F.tree.id) {
        const Ct = Hr({ hierarchyId: yt.tree.id, populationId: m.populationId }, F.tree, br(c));
        Ct.id && (X = Ct.id);
      }
    }
    const it = F == null ? void 0 : F.tree.populations[X], ot = F == null ? void 0 : F.derived.stats.event_count[X];
    return Fv(
      m.kind === "strategy" ? {} : m,
      P ? { name: P.name, fileName: P.fileName ?? P.name, metadata: P.metadata } : null,
      it ? { id: X, name: it.name } : null,
      typeof ot == "number" ? ot : void 0,
      s
    );
  }, [r, kt, c, s]), ue = st.useMemo(
    () => K ? Yv(K, Je, Ie) : [],
    [K, Je, Ie]
  ), [Fr, Fe] = st.useState(0), [pr, Tt] = st.useState(!1), [ee, mn] = st.useState(" · "), Lr = st.useMemo(
    () => [...new Set(Object.values(s ?? {}).flatMap((m) => Object.keys(m)))].sort(),
    [s]
  ), xn = st.useMemo(() => jv(o, Lr), [o, Lr]), ce = Math.min(Fr, Math.max(0, ue.length - 1)), ae = ue[ce] ?? uh, io = ((Mo = K == null ? void 0 : K.titleTemplate) == null ? void 0 : Mo.trim()) || Lv(
    ae.items.flatMap((m) => re(m.recipe) ? [{ sampleId: m.recipe.sampleId, populationId: m.recipe.populationId, label: m.recipe.kind === "strategy" ? void 0 : m.recipe.label }] : [])
  );
  st.useEffect(() => {
    Fr !== ce && Fe(ce);
  }, [Fr, ce]);
  const oo = (m) => m.split("::")[0], Le = [...new Set(_.map(oo))], vr = (K == null ? void 0 : K.items.filter(({ id: m }) => Le.includes(m))) ?? [], at = vr.length === 1 ? vr[0] : null, yn = at ? ae.items.find((m) => m.templateId === at.id) ?? null : null, so = (m, D) => {
    var X;
    if (!re(m.recipe)) return "";
    const P = ((X = m.recipe.title) == null ? void 0 : X.trim()) ?? "";
    if (!P) return "";
    const F = Ie(m.recipe, D);
    return F && vh(P, F.population, [F.file, F.sample]) ? "" : P;
  }, Bu = yn && re(yn.recipe) ? ia(io, Ie(yn.recipe, yn.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", bn = vr.some((m) => m.locked);
  st.useEffect(() => {
    _.length && _.some((m) => !ae.items.some((D) => D.id === m)) && M((m) => m.filter((D) => ae.items.some((P) => P.id === D)));
  }, [ae, _]), st.useLayoutEffect(() => {
    if (!A) return;
    const m = [...A.querySelectorAll("[data-item-id]")], D = (X, it) => X.length === it.length && X.every((ot, yt) => ot === it[yt]), P = m.filter((X) => _.includes(X.dataset.itemId ?? "")), F = m.filter((X) => !_.includes(X.dataset.itemId ?? ""));
    L((X) => D(X, P) ? X : P), G((X) => D(X, F) ? X : F);
  }, [A, _, ae, K == null ? void 0 : K.id]), st.useEffect(() => {
    yo();
  }, [K == null ? void 0 : K.id]);
  const ga = (m, D = !0) => {
    D && (ze.current = [
      En(t),
      ...ze.current
    ].slice(0, 30), Ze.current = []), e(m);
  }, hr = (m) => {
    const D = En(t);
    m(D), ga(D);
  }, zt = (m) => {
    hr((D) => {
      const P = D.sheets.find(({ id: F }) => F === D.activeSheetId);
      P && m(P);
    });
  }, ma = st.useRef(null), [ju, xa] = st.useState(null), gr = (m, D) => {
    let P = "";
    const F = ma.current;
    ma.current = null, zt((X) => {
      P = crypto.randomUUID();
      const it = Ao(X, D == null ? void 0 : D.width, D == null ? void 0 : D.height);
      F && (it.x = Math.max(0, Math.round(F.x)), it.y = Math.max(0, Math.round(F.y))), X.items.push({
        id: P,
        ...it,
        recipe: m
      });
    }), Ft(P), Vu(P);
  }, te = kt.find(({ id: m }) => m === tt) ?? kt[0] ?? null, ya = te && u ? Hr(
    {
      hierarchyId: c.active_hierarchy_id,
      populationId: u
    },
    te.tree,
    br(c)
  ) : null, We = (ya == null ? void 0 : ya.id) ?? (te == null ? void 0 : te.tree.root_population_id) ?? "", Sn = (m) => {
    var D, P, F;
    if (!te || !We) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    gr({
      kind: m,
      sampleId: te.id,
      populationId: We,
      ...dt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: te.sample.index(d) !== void 0 ? d : ((D = te.sample.channels[0]) == null ? void 0 : D.key) ?? "",
      yChannel: m === "histogram" ? null : te.sample.index(p) !== void 0 ? p : ((P = te.sample.channels[1]) == null ? void 0 : P.key) ?? ((F = te.sample.channels[0]) == null ? void 0 : F.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, lo = () => {
    if (!te || !We) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    gr(
      {
        kind: "chart",
        sampleId: te.id,
        populationId: We,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: o[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, uo = () => gr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Gu = (m, D) => {
    zt((P) => {
      const F = P.items.find((X) => X.id === m);
      F && (F.recipe = D(F.recipe));
    });
  }, Fu = (m) => {
    m.preventDefault();
    const D = m.target.closest("[data-item-id]");
    if (D != null && D.dataset.itemId) {
      const it = D.dataset.itemId, ot = K == null ? void 0 : K.items.find(({ id: ge }) => ge === oo(it));
      if (!ot) return;
      const yt = _.includes(it);
      yt || jt([it]);
      const Ct = yt && Le.length > 1 ? Le : [ot.id], mt = Ct.length > 1, Lt = re(ot.recipe), Ae = [
        { label: mt ? v("Duplicate {n} items", { n: Ct.length }) : v("Duplicate"), onClick: () => Yr(Ct) },
        { label: v("Bring to front"), onClick: () => mr(Ct, "front") },
        { label: v("Send to back"), onClick: () => mr(Ct, "back") },
        { label: ot.locked ? v("Unlock") : v("Lock"), onClick: () => ba(Ct, !ot.locked) },
        "separator",
        ...dt.mode !== "off" && Lt ? [
          {
            label: "iterated" in ot.recipe && ot.recipe.iterated ? v("Stop following the iteration") : v("Follow the iteration"),
            onClick: () => Gu(ot.id, (ge) => re(ge) ? { ...ge, iterated: !ge.iterated } : ge)
          },
          "separator"
        ] : [],
        ...Lt ? [{ label: v("Open in Gating"), onClick: () => w(ot.recipe) }] : [],
        ...ot.recipe.kind === "figure" && g ? [{ label: v("Edit in Illustration"), onClick: () => g(structuredClone(ot.recipe.illustration)) }] : [],
        ...ot.recipe.kind === "proportions" && b ? [{ label: v("Edit in Plotting"), onClick: () => b(structuredClone(ot.recipe.settings)) }] : [],
        { label: mt ? v("Remove {n} items", { n: Ct.length }) : v("Remove"), onClick: () => Wr(Ct) }
      ];
      xa({ x: m.clientX, y: m.clientY, items: Ae, label: Ne(ot, kt) });
      return;
    }
    const P = m.currentTarget.getBoundingClientRect(), F = { x: (m.clientX - P.left) / q, y: (m.clientY - P.top) / q }, X = (it) => () => {
      ma.current = F, it();
    };
    xa({
      x: m.clientX,
      y: m.clientY,
      label: v("Page"),
      items: [
        { label: v("+ Biplot"), disabled: !Ht, onClick: X(() => Sn("biplot")) },
        { label: v("+ Histogram"), disabled: !Ht, onClick: X(() => Sn("histogram")) },
        { label: v("+ Gating strategy"), disabled: !Ht, onClick: X(po) },
        { label: v("+ Chart"), disabled: !Ht, onClick: X(lo) },
        { label: v("+ Text"), onClick: X(uo) },
        { label: v("+ Illustration figure"), disabled: !Ht || !(h != null && h.figure), onClick: X(co) },
        { label: v("+ Plotting chart"), disabled: !Ht || !x, onClick: X(fo) },
        "separator",
        { label: v("Select all"), disabled: !ae.items.length, onClick: () => jt(ae.items.map(({ id: it }) => it)) }
      ]
    });
  }, co = () => {
    if (!(h != null && h.figure)) {
      H(v("Make a figure on the Illustration tab first."));
      return;
    }
    K && gr({ kind: "figure", illustration: structuredClone(h), page: 0 }, vc(h, r, c, K));
  }, fo = () => {
    if (!x || !K) return;
    const m = x(), D = hc(m, gc(r), c, Ee, y);
    if (!D.catLevels.length || !D.perSample.length) {
      H(v("Choose files and populations on the Plotting tab first."));
      return;
    }
    gr({ kind: "proportions", settings: m }, mc(m, D, K));
  }, po = () => {
    var P;
    if (!te || !We) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    const m = te.tree.root_population_id ?? "", D = We !== m ? We : ((P = Ln(te.tree.populations, m).filter(({ popId: F }) => F !== m).at(-1)) == null ? void 0 : P.popId) ?? We;
    gr(
      {
        kind: "strategy",
        sampleId: te.id,
        populationId: D,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...dt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Lu = () => {
    var X, it;
    if (!h) {
      H(v("Render or configure an Illustration selection first."));
      return;
    }
    if (!h.figure && h.plotType === "heatmap") {
      H(
        v("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const m = new Map(kt.map((ot) => [ot.id, ot])), D = [], P = h.figure;
    for (const ot of kt) {
      if (P) {
        if (!P.sampleIds.includes(ot.id)) continue;
        for (const Ct of P.plots)
          if (Ct.type !== "heatmap")
            for (const mt of Ct.population ? [Ct.population] : ((X = P.samplePopulations) == null ? void 0 : X[ot.id]) ?? P.populations) {
              const Lt = Hr(
                mt,
                ot.tree,
                br(c)
              );
              Lt.id && Lt.status !== "changed" && D.push({
                sampleId: ot.id,
                populationId: Lt.id,
                xChannel: Ct.x,
                yChannel: Ct.y,
                type: Ct.type
              });
            }
        continue;
      }
      const yt = h.selectionMode === "matrix" ? ((it = h.selectedPopulationsBySample) == null ? void 0 : it[ot.id]) ?? [] : h.popIds;
      for (const Ct of yt)
        for (const mt of h.xChannels)
          D.push({ sampleId: ot.id, populationId: Ct, xChannel: mt });
    }
    const F = D.slice(0, 60);
    if (F.length === 0) {
      H(
        v("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    zt((ot) => {
      for (const yt of F) {
        if (!m.get(yt.sampleId)) continue;
        const mt = yt.type ?? (h.plotType === "histogram" ? "histogram" : "biplot");
        ot.items.push({
          id: crypto.randomUUID(),
          ...Ao(ot),
          recipe: {
            kind: mt,
            sampleId: yt.sampleId,
            populationId: yt.populationId,
            xChannel: yt.xChannel,
            yChannel: mt === "histogram" ? null : yt.yChannel ?? h.yChannel,
            displayMode: h.displayMode === "dots" ? "scatter" : h.displayMode
          }
        });
      }
    }), H(
      D.length > F.length ? v(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: F.length
        }
      ) : v("Added {count} Illustration plots.", { count: F.length })
    );
  }, It = (m) => {
    at && zt((D) => {
      const P = D.items.find(({ id: F }) => F === at.id);
      P && (P.recipe = m(P.recipe));
    });
  }, Wr = (m) => {
    zt((D) => {
      D.items = D.items.filter((P) => !m.includes(P.id));
    }), M((D) => D.filter((P) => !m.includes(P)));
  }, Yr = (m, D) => {
    const P = [];
    return zt((F) => {
      let X = Math.max(0, ...F.items.map((it) => it.z));
      for (const it of m) {
        const ot = F.items.find((mt) => mt.id === it);
        if (!ot) continue;
        const yt = crypto.randomUUID();
        P.push(yt);
        const Ct = (D == null ? void 0 : D[it]) ?? { x: ot.x + 20, y: ot.y + 20, width: ot.width, height: ot.height };
        F.items.push({ ...ot, ...Ct, id: yt, locked: !1, z: ++X, recipe: { ...ot.recipe } });
      }
    }), P.length && jt(P), P;
  }, Wu = (m, D, P) => {
    zt((F) => {
      for (const X of F.items)
        !m.includes(X.id) || X.locked || (X.x = Math.max(0, X.x + D), X.y = Math.max(0, X.y + P));
    });
  }, mr = (m, D) => {
    zt((P) => {
      const F = [...P.items].sort((yt, Ct) => yt.z - Ct.z), X = F.filter((yt) => m.includes(yt.id)), it = F.filter((yt) => !m.includes(yt.id));
      (D === "front" ? [...it, ...X] : [...X, ...it]).forEach((yt, Ct) => {
        yt.z = Ct;
      });
    });
  }, ba = (m, D) => {
    zt((P) => {
      for (const F of P.items) m.includes(F.id) && (F.locked = D);
    });
  }, Yu = (m) => {
    zt((D) => Tc(D, Le.filter((P) => {
      var F;
      return !((F = D.items.find((X) => X.id === P)) != null && F.locked);
    }), m));
  }, Xu = (m) => {
    zt((D) => Ic(D, Le, m));
  }, Cn = (m, D) => {
    const P = {};
    for (const X of m) {
      const it = X.dataset.itemId, ot = ae.items.find((mt) => mt.id === it);
      if (!ot) continue;
      const { id: yt, ...Ct } = Vv(ot, ph(X));
      P[yt] = Ct;
    }
    const F = Object.keys(P);
    if (F.length) {
      if (D) {
        for (const X of m) {
          const it = ae.items.find((ot) => ot.id === X.dataset.itemId);
          it && Object.assign(X.style, { left: `${it.x}px`, top: `${it.y}px`, width: `${it.width}px`, height: `${it.height}px` });
        }
        Yr(F, P);
        return;
      }
      zt((X) => {
        for (const it of X.items) P[it.id] && Object.assign(it, P[it.id]);
      });
    }
  }, vo = (m) => m.flatMap((D) => {
    if (!(D instanceof HTMLElement) || !D.parentElement) return [];
    const P = D.cloneNode(!0);
    P.classList.add("gl-layout-ghost"), P.classList.remove("is-selected"), P.removeAttribute("data-item-id"), P.setAttribute("aria-hidden", "true");
    const F = D.querySelectorAll("canvas");
    return P.querySelectorAll("canvas").forEach((X, it) => {
      var yt;
      const ot = F[it];
      ot && (X.width = ot.width, X.height = ot.height, (yt = X.getContext("2d")) == null || yt.drawImage(ot, 0, 0));
    }), D.parentElement.insertBefore(P, D), [P];
  }), ho = (m) => {
    if (Array.isArray(m)) for (const D of m) D.remove();
  }, go = (m) => {
    m.target.style.left = `${m.left}px`, m.target.style.top = `${m.top}px`;
  }, mo = (m) => {
    m.target.style.width = `${m.width}px`, m.target.style.height = `${m.height}px`, m.target.style.left = `${m.drag.left}px`, m.target.style.top = `${m.drag.top}px`;
  }, Hu = (m) => {
    var F;
    const D = (F = m.inputEvent) == null ? void 0 : F.target;
    if (!D) return;
    const P = W.current;
    if (P != null && P.isMoveableElement(D)) {
      m.stop();
      return;
    }
    N.some((X) => X === D || X.contains(D)) && (m.stop(), N.length > 1 && (P == null || P.dragStart(m.inputEvent)));
  }, qu = (m) => {
    var P, F, X;
    const D = m.selected.map((it) => it.dataset.itemId ?? "").filter(Boolean);
    jt(D), m.isDragStart && ((F = (P = m.inputEvent) == null ? void 0 : P.preventDefault) == null || F.call(P), (X = W.current) == null || X.waitToChangeTarget().then(() => {
      var it;
      return (it = W.current) == null ? void 0 : it.dragStart(m.inputEvent);
    }));
  }, Vu = (m) => {
    window.requestAnimationFrame(() => {
      var D, P, F;
      (F = (P = (D = Zt.current) == null ? void 0 : D.querySelector(`[data-item-id="${m}"]`)) == null ? void 0 : P.scrollIntoView) == null || F.call(P, { block: "nearest", inline: "nearest" });
    });
  }, Qe = (m) => {
    zt((D) => xc(D, m));
  }, $u = () => zt((m) => yc(m)), Uu = () => zt((m) => bc(m)), xo = (() => {
    const m = [], D = [];
    if (!K) return { vertical: m, horizontal: D };
    const P = Ya(K.page), F = Ro(K.page.marginMm);
    for (const X of Xn(K.page))
      m.push(X.x, X.x + F, X.x + P.width / 2, X.x + P.width - F, X.x + P.width), D.push(X.y, X.y + F, X.y + P.height / 2, X.y + P.height - F, X.y + P.height);
    return { vertical: [...new Set(m)], horizontal: [...new Set(D)] };
  })(), yo = () => {
    const m = Bt.current;
    if (!m || !K) return;
    const D = { width: m.clientWidth - 36, height: m.clientHeight - 36 };
    if (D.width <= 0 || D.height <= 0) return;
    const P = Math.min(D.width / K.width, D.height / K.height);
    nt(Math.max(0.1, Math.min(4, Math.floor(P * 100) / 100)));
  };
  st.useEffect(() => {
    const m = R;
    if (!m) return;
    const D = (P) => {
      if (!(P.altKey || P.shiftKey || P.ctrlKey)) return;
      const F = P.deltaY || P.deltaX;
      if (!F) return;
      P.preventDefault();
      const X = Et.current, it = Math.max(0.1, Math.min(4, Math.round(X * Math.exp(-F * 25e-4) * 100) / 100));
      if (it === X) return;
      Et.current = it, nt(it);
      const ot = m.getBoundingClientRect(), yt = P.clientX - ot.left, Ct = P.clientY - ot.top, mt = it / X, Lt = (m.scrollLeft + yt) * mt - yt, Ae = (m.scrollTop + Ct) * mt - Ct;
      requestAnimationFrame(() => {
        m.scrollLeft = Lt, m.scrollTop = Ae;
      });
    };
    return m.addEventListener("wheel", D, { passive: !1 }), () => m.removeEventListener("wheel", D);
  }, [R]);
  const bo = (m) => {
    const D = m > 0 ? Xr.find((P) => P > q + 1e-3) : [...Xr].reverse().find((P) => P < q - 1e-3);
    D && nt(D);
  }, Ku = () => new Promise((m) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => m())), 450);
  }), So = async () => {
    const m = Zt.current;
    if (!m || !K || ht) return;
    Dt(!0);
    const D = ce;
    try {
      const P = [];
      for (let F = 0; F < ue.length; F++)
        ue.length > 1 && (Fe(F), await Ku()), P.push(...Av(m, K, { zoom: q }));
      await Nv(P, K, _t);
    } catch (P) {
      H(P instanceof Error ? P.message : String(P));
    } finally {
      ue.length > 1 && Fe(D), Dt(!1);
    }
  }, tr = (m) => {
    zt((D) => {
      var P;
      if (m.mode === "off") {
        delete D.iteration;
        return;
      }
      if ((((P = D.iteration) == null ? void 0 : P.mode) ?? "off") === "off" && !D.items.some(Ou))
        for (const F of D.items) re(F.recipe) && (F.recipe.iterated = !0);
      D.iteration = m;
    }), Fe(0);
  }, Zu = (m) => [...new Set(r.map((D) => {
    var P;
    return ((P = D.metadata) == null ? void 0 : P[m]) ?? "";
  }).filter(Boolean))], Ju = dt.source.kind === "group" ? `group:${dt.source.groupId}` : dt.source.kind === "metadata" ? `meta:${dt.source.column}=${dt.source.value}` : dt.source.kind, Qu = (m) => {
    if (m === "all") return { kind: "all" };
    if (m.startsWith("group:")) return { kind: "group", groupId: m.slice(6) };
    if (m.startsWith("meta:")) {
      const [D, ...P] = m.slice(5).split("=");
      return { kind: "metadata", column: D, value: P.join("=") };
    }
    return { kind: "checked" };
  }, tc = (m) => {
    const D = Sc(m.nativeEvent);
    if (D) {
      m.preventDefault(), D === "undo" ? Do() : wo();
      return;
    }
    if (m.target.closest("input, textarea, select")) return;
    const P = m.metaKey || m.ctrlKey;
    if (m.key === "Escape") {
      M([]);
      return;
    }
    if (P && m.key.toLowerCase() === "a") {
      m.preventDefault(), jt(((K == null ? void 0 : K.items) ?? []).filter((ot) => !ot.locked).map((ot) => ot.id));
      return;
    }
    if (!_.length) return;
    if (m.key === "Delete" || m.key === "Backspace") {
      m.preventDefault(), Wr(Le);
      return;
    }
    if (P && m.key.toLowerCase() === "d") {
      m.preventDefault(), Yr(Le);
      return;
    }
    const F = m.shiftKey ? 10 : 1, it = {
      ArrowLeft: [-F, 0],
      ArrowRight: [F, 0],
      ArrowUp: [0, -F],
      ArrowDown: [0, F]
    }[m.key];
    it && (m.preventDefault(), Wu(Le, it[0], it[1]));
  }, Sa = at == null ? void 0 : at.recipe, Nt = Sa && "sampleId" in Sa ? kt.find(({ id: m }) => m === Sa.sampleId) ?? null : null, Co = Nt ? Nt.sample.channels.map((m) => ({
    value: m.key,
    label: Nt.sample.channelLabel(Nt.sample.index(m.key) ?? 0)
  })) : [], Eo = Nt ? Ln(
    Nt.tree.populations,
    Nt.tree.root_population_id ?? ""
  ) : [], Do = () => {
    const m = ze.current.shift();
    m && (Ze.current = [
      En(t),
      ...Ze.current
    ].slice(0, 30), ga(m, !1));
  }, wo = () => {
    const m = Ze.current.shift();
    m && (ze.current = [
      En(t),
      ...ze.current
    ].slice(0, 30), ga(m, !1));
  };
  return K ? /* @__PURE__ */ E.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${ft ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ E.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": v("Layout sheets"),
            children: [
              t.sheets.map((m) => /* @__PURE__ */ E.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: j === m.id ? /* @__PURE__ */ E.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: m.name,
                  autoFocus: !0,
                  onFocus: (D) => D.currentTarget.select(),
                  onBlur: (D) => {
                    const P = D.currentTarget.value.trim();
                    P && hr((F) => {
                      const X = F.sheets.find(
                        ({ id: it }) => it === m.id
                      );
                      X && (X.name = P);
                    }), J(null);
                  },
                  onKeyDown: (D) => {
                    D.key === "Enter" && D.currentTarget.blur(), D.key === "Escape" && J(null);
                  }
                }
              ) : /* @__PURE__ */ E.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === m.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === m.id ? " active" : ""}`,
                  title: v("Double-click to rename"),
                  onClick: () => hr((D) => {
                    D.activeSheetId = m.id;
                  }),
                  onDoubleClick: () => J(m.id),
                  children: m.name
                }
              ) }, m.id)),
              /* @__PURE__ */ E.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: v("New blank layout"),
                  onClick: () => {
                    const m = uc(
                      `Layout ${t.sheets.length + 1}`,
                      { ...K.page }
                    );
                    hr((D) => {
                      D.sheets.push(m), D.activeSheetId = m.id;
                    }), M([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ E.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (m) => {
              m.target.closest("button") && _.length && m.preventDefault();
            },
            children: [
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Sn("biplot"), disabled: !Ht, title: v(Ht ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: v("+ Biplot") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Sn("histogram"), disabled: !Ht, title: v(Ht ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: v("+ Histogram") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: po, disabled: !Ht, title: v(Ht ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: v("+ Gating strategy") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: lo, disabled: !Ht, title: v(Ht ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: v("+ Chart") }),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: v("Add a text block; edit it on the page"),
                    onClick: uo,
                    children: v("+ Text")
                  }
                ),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Lu, disabled: !Ht, title: v("Add one plot per file and plot of the Illustration tab's current selection"), children: v("Add Illustration selection") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: co, disabled: !Ht, title: v("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: v("+ Illustration figure") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: fo, disabled: !Ht || !x, title: v("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: v("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": v("Arrange"), children: [
                fh.map(({ how: m, label: D, title: P }) => /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Yu(m), disabled: !_.length || ft, title: v(P), children: v(D) }, m)),
                dh.map(({ how: m, label: D, title: P }) => /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Xu(m), disabled: _.length < 3 || ft, title: v(P), children: v(D) }, m)),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": T, onClick: () => k((m) => !m), title: v("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: v("Snap grid") })
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": ft, onClick: () => xt(!ft), title: v("Show the page as it exports, without grid, margins or handles"), children: v(ft ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !ze.current.length, onClick: Do, title: v("Undo the last layout edit (Cmd-Z)"), children: v("Undo") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Ze.current.length, onClick: wo, title: v("Redo the undone edit (Shift-Cmd-Z)"), children: v("Redo") }),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: v("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const m = {
                        ...K,
                        id: crypto.randomUUID(),
                        page: { ...K.page },
                        name: `${K.name} copy`,
                        items: K.items.map((D) => ({
                          ...D,
                          id: crypto.randomUUID(),
                          recipe: { ...D.recipe }
                        }))
                      };
                      hr((D) => {
                        D.sheets.push(m), D.activeSheetId = m.id;
                      }), M([]);
                    },
                    children: v("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ E.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: v("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      hr((m) => {
                        const D = m.sheets.findIndex(
                          ({ id: P }) => P === m.activeSheetId
                        );
                        m.sheets.splice(D, 1), m.activeSheetId = m.sheets[Math.max(0, D - 1)].id;
                      }), M([]);
                    },
                    children: v("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": v("Zoom"), children: [
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: yo, title: v("Fit the page to the window"), children: v("Fit") }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => bo(-1), "aria-label": v("Zoom out"), title: v("Zoom out"), disabled: q <= Xr[0], children: "−" }),
                /* @__PURE__ */ E.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(q * 100),
                  "%"
                ] }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => bo(1), "aria-label": v("Zoom in"), title: v("Zoom in"), disabled: q >= Xr[Xr.length - 1], children: "+" })
              ] }),
              (ue.length > 1 || dt.mode !== "off") && /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": v("Pages of the iteration"), children: [
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Fe(Math.max(0, ce - 1)), disabled: ce === 0, "aria-label": v("Previous page"), title: v("Previous page"), children: "◀" }),
                /* @__PURE__ */ E.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  v("Page {n} of {count}", { n: ce + 1, count: Math.max(1, ue.length) }),
                  ae.units.length > 0 && ` · ${ae.units.map((m) => m.name).join(", ")}`
                ] }),
                /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Fe(Math.min(ue.length - 1, ce + 1)), disabled: ce >= ue.length - 1, "aria-label": v("Next page"), title: v("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ E.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void So(), disabled: ht || !K.items.length, title: ue.length > 1 ? v("Write every page of the iteration; the format is chosen under Page") : v("Write this sheet at its page size; the format is chosen under Page"), children: ht ? v("Exporting…") : v("Export {format}", { format: _t.toUpperCase() }) }) }),
              /* @__PURE__ */ E.jsx("span", { className: "gl-layout-performance-note", children: v("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        Q && /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ E.jsx("span", { children: Q }),
          /* @__PURE__ */ E.jsx("button", { type: "button", title: v("Dismiss"), "aria-label": v("Dismiss"), onClick: () => H(null), children: "×" })
        ] }),
        /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ E.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ E.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((m) => /* @__PURE__ */ E.jsx(
              "button",
              {
                "aria-pressed": et === m,
                title: v(m === "item" ? "The selected item, or the file new plots take" : m === "page" ? "Page size, margins, pages and export" : m === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => lt(m),
                children: v(m === "item" ? "Items" : m === "page" ? "Page" : m === "iterate" ? "Iterate" : "Style")
              },
              m
            )) }),
            et === "item" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                "File for new plots",
                /* @__PURE__ */ E.jsx(
                  "select",
                  {
                    value: tt,
                    onChange: (m) => U(m.target.value),
                    children: r.map((m) => /* @__PURE__ */ E.jsx("option", { value: m.id, children: m.name }, m.id))
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: "Placed plots keep their own file and hierarchy, independently of the Gating selection." }),
              Ot.error && /* @__PURE__ */ E.jsx("p", { role: "alert", children: Ot.error }),
              vr.length > 1 && /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-inspector", "aria-label": v("Selected layout items"), children: [
                /* @__PURE__ */ E.jsx("strong", { children: v("{count} items selected", { count: vr.length }) }),
                /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-item-actions", children: [
                  /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Yr(_), title: v("Copies of every selected item, 20 px down and right (Cmd-D)"), children: v("Duplicate") }),
                  /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => mr(_, "front"), title: v("Draw the selected items over every other"), children: v("Bring to front") }),
                  /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => mr(_, "back"), title: v("Draw the selected items under every other"), children: v("Send to back") }),
                  /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => ba(_, !bn), title: v("Lock or unlock the selected items"), children: v(bn ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Wr(_), title: v("Remove the selected items (Delete)"), children: v("Remove") })
                ] }),
                /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("Align and spread them with the toolbar; drag any of them to move them together.") })
              ] }),
              !vr.length && /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("Click an item to select it, drag empty page to select several, Shift-click to add. Drag to move; drag a corner handle or an edge to resize; Option-drag to copy. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-Z undoes.") }),
              at && /* @__PURE__ */ E.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": v("Selected layout item"),
                  children: [
                    /* @__PURE__ */ E.jsx("strong", { children: v("Selected") }),
                    /* @__PURE__ */ E.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ E.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: at.showFrame === !0,
                          onChange: (m) => zt((D) => {
                            const P = D.items.find(
                              (F) => F.id === at.id
                            );
                            P && (P.showFrame = m.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Yr([at.id]), title: v("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: v("Duplicate") }),
                      /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => mr([at.id], "front"), title: v("Draw this item over every other"), children: v("Bring to front") }),
                      /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => mr([at.id], "back"), title: v("Draw this item under every other"), children: v("Send to back") }),
                      /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Wr([at.id]), title: v("Remove this item from the page (Delete)"), children: v("Remove") })
                    ] }),
                    /* @__PURE__ */ E.jsxs("label", { className: "gl-check", title: v("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ E.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: at.locked === !0,
                          onChange: (m) => ba([at.id], m.target.checked)
                        }
                      ),
                      v("Locked")
                    ] }),
                    /* @__PURE__ */ E.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((m) => /* @__PURE__ */ E.jsxs("label", { children: [
                      lh[m],
                      /* @__PURE__ */ E.jsx(
                        De,
                        {
                          "aria-label": `Item ${m}`,
                          min: m === "width" || m === "height" ? cc(at.recipe.kind)[m] : 0,
                          integer: !0,
                          value: at[m],
                          onCommit: (D) => zt((P) => {
                            const F = P.items.find(
                              (X) => X.id === at.id
                            );
                            F && (F[m] = D);
                          })
                        }
                      )
                    ] }, m)) }),
                    at.recipe.kind === "text" ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Text"),
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            value: at.recipe.text,
                            onChange: (m) => It(
                              (D) => D.kind === "text" ? { ...D, text: m.target.value } : D
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Reads from"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            "aria-label": v("Reads from"),
                            value: at.recipe.readsFrom ?? "",
                            onChange: (m) => It((D) => {
                              if (D.kind !== "text") return D;
                              const P = { ...D };
                              return m.target.value ? P.readsFrom = m.target.value : delete P.readsFrom, P;
                            }),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "", children: v("Nothing: plain text") }),
                              K.items.filter((m) => re(m.recipe)).map((m) => /* @__PURE__ */ E.jsx("option", { value: m.id, children: Ne(m, kt) }, m.id))
                            ]
                          }
                        )
                      ] }),
                      at.recipe.readsFrom && /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: Ba }) }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Font"),
                        /* @__PURE__ */ E.jsx(
                          De,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: at.recipe.fontSize,
                            onCommit: (m) => It(
                              (D) => D.kind === "text" ? { ...D, fontSize: m } : D
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: at.recipe.bold === !0,
                            onChange: (m) => It((D) => {
                              if (D.kind !== "text") return D;
                              const P = { ...D };
                              return m.target.checked ? P.bold = !0 : delete P.bold, P;
                            })
                          }
                        ),
                        v("Bold")
                      ] })
                    ] }) : at.recipe.kind === "figure" ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                      /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Figure page"),
                        /* @__PURE__ */ E.jsx(
                          De,
                          {
                            "aria-label": v("Figure page"),
                            value: at.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (m) => It((D) => D.kind === "figure" ? { ...D, page: Math.max(0, m - 1) } : D)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            placeholder: Ne(at, kt),
                            value: at.recipe.title ?? "",
                            onChange: (m) => It((D) => D.kind === "figure" ? { ...D, title: m.target.value } : D)
                          }
                        )
                      ] }),
                      g && /* @__PURE__ */ E.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: v("Load this figure into the Illustration tab"),
                          onClick: () => g(structuredClone(at.recipe.illustration)),
                          children: v("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ E.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(h != null && h.figure),
                          title: v("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => It(
                            (m) => m.kind === "figure" && h ? { ...m, illustration: structuredClone(h) } : m
                          ),
                          children: v("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : at.recipe.kind === "proportions" ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                      /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            placeholder: Ne(at, kt),
                            value: at.recipe.title ?? "",
                            onChange: (m) => It((D) => D.kind === "proportions" ? { ...D, title: m.target.value } : D)
                          }
                        )
                      ] }),
                      b && /* @__PURE__ */ E.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: v("Load this chart's settings into the Plotting tab"),
                          onClick: () => b(structuredClone(at.recipe.settings)),
                          children: v("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ E.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !x,
                          title: v("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const m = x == null ? void 0 : x();
                            m && It((D) => D.kind === "proportions" ? { ...D, settings: m } : D);
                          },
                          children: v("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : at.recipe.kind === "chart" ? /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Population"),
                        /* @__PURE__ */ E.jsx(
                          "select",
                          {
                            value: at.recipe.populationId,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, populationId: m.target.value } : D),
                            children: Eo.map(({ popId: m, depth: D }) => {
                              var P;
                              return /* @__PURE__ */ E.jsxs("option", { value: m, children: [
                                " ".repeat(D * 2),
                                ((P = Nt == null ? void 0 : Nt.tree.populations[m]) == null ? void 0 : P.name) ?? m
                              ] }, m);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Statistic"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            value: at.recipe.statistic,
                            onChange: (m) => It((D) => {
                              var X;
                              if (D.kind !== "chart") return D;
                              const P = m.target.value, F = P === "median" && !D.channel ? (X = Nt == null ? void 0 : Nt.sample.channels[0]) == null ? void 0 : X.key : D.channel;
                              return { ...D, statistic: P, ...F ? { channel: F } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "percent_of_parent", children: v("% of parent") }),
                              /* @__PURE__ */ E.jsx("option", { value: "percent_of_total", children: v("% of total") }),
                              /* @__PURE__ */ E.jsx("option", { value: "count", children: v("Events") }),
                              /* @__PURE__ */ E.jsx("option", { value: "median", children: v("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      at.recipe.statistic === "median" && /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Channel"),
                        /* @__PURE__ */ E.jsx(
                          "select",
                          {
                            value: at.recipe.channel ?? "",
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, channel: m.target.value } : D),
                            children: ((Nt == null ? void 0 : Nt.sample.channels) ?? []).map((m) => /* @__PURE__ */ E.jsx("option", { value: m.key, children: (Nt == null ? void 0 : Nt.sample.labelForKey(m.key)) ?? m.key }, m.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Files"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            value: at.recipe.files,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, files: m.target.value === "all" ? "all" : "checked" } : D),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "checked", children: v("Checked files") }),
                              /* @__PURE__ */ E.jsx("option", { value: "all", children: v("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Group by"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            value: at.recipe.groupBy,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, groupBy: m.target.value } : D),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "", children: v("Each file") }),
                              o.map((m) => /* @__PURE__ */ E.jsx("option", { value: m, children: m }, m))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Chart"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            value: at.recipe.chartType,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, chartType: m.target.value } : D),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "bars", children: v("Bars (mean ± SD)") }),
                              /* @__PURE__ */ E.jsx("option", { value: "dots", children: v("Points with the mean") }),
                              /* @__PURE__ */ E.jsx("option", { value: "box", children: v("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: at.recipe.showPoints,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, showPoints: m.target.checked } : D)
                          }
                        ),
                        v("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-check", title: v("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: at.recipe.test,
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, test: m.target.checked } : D)
                          }
                        ),
                        v("Test between groups")
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            placeholder: Ne(at, kt),
                            value: at.recipe.title ?? "",
                            onChange: (m) => It((D) => D.kind === "chart" ? { ...D, title: m.target.value } : D)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("FCS"),
                        /* @__PURE__ */ E.jsx(
                          "select",
                          {
                            value: at.recipe.sampleId,
                            onChange: (m) => It((D) => {
                              if (D.kind === "text" || D.kind === "figure" || D.kind === "proportions") return D;
                              const P = kt.find(
                                (X) => X.id === m.target.value
                              );
                              if (!P) return D;
                              const F = Nt && Hr(
                                {
                                  hierarchyId: Nt.tree.id,
                                  populationId: D.populationId
                                },
                                P.tree,
                                br(c)
                              );
                              return {
                                ...D,
                                sampleId: P.id,
                                populationId: (F == null ? void 0 : F.id) ?? P.tree.root_population_id ?? ""
                              };
                            }),
                            children: kt.map((m) => /* @__PURE__ */ E.jsx("option", { value: m.id, children: m.name }, m.id))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Population"),
                        /* @__PURE__ */ E.jsx(
                          "select",
                          {
                            value: at.recipe.populationId,
                            onChange: (m) => It(
                              (D) => D.kind === "text" ? D : {
                                ...D,
                                populationId: m.target.value
                              }
                            ),
                            children: Eo.map(({ popId: m, depth: D }) => {
                              var P;
                              return /* @__PURE__ */ E.jsxs("option", { value: m, children: [
                                " ".repeat(D * 2),
                                ((P = Nt == null ? void 0 : Nt.tree.populations[m]) == null ? void 0 : P.name) ?? m
                              ] }, m);
                            })
                          }
                        )
                      ] }),
                      at.recipe.kind !== "strategy" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                        /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ E.jsx(
                            Po,
                            {
                              label: v("X channel"),
                              value: at.recipe.xChannel,
                              options: Co,
                              onChange: (m) => It(
                                (D) => D.kind === "biplot" || D.kind === "histogram" ? { ...D, xChannel: m } : D
                              )
                            }
                          )
                        ] }),
                        at.recipe.kind === "biplot" && /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ E.jsx(
                            Po,
                            {
                              label: v("Y channel"),
                              value: at.recipe.yChannel ?? "",
                              options: Co,
                              onChange: (m) => It(
                                (D) => D.kind === "biplot" ? { ...D, yChannel: m } : D
                              )
                            }
                          )
                        ] })
                      ] }),
                      at.recipe.kind === "strategy" && /* @__PURE__ */ E.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: at.recipe.fullPath,
                            onChange: (m) => It(
                              (D) => D.kind === "strategy" ? {
                                ...D,
                                fullPath: m.target.checked
                              } : D
                            )
                          }
                        ),
                        v("Full path from root")
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                        v("Display"),
                        /* @__PURE__ */ E.jsxs(
                          "select",
                          {
                            value: at.recipe.displayMode,
                            onChange: (m) => It(
                              (D) => D.kind === "text" ? D : {
                                ...D,
                                displayMode: m.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ E.jsx("option", { value: "pseudocolor", children: v("Pseudocolor") }),
                              /* @__PURE__ */ E.jsx("option", { value: "scatter", children: v("Scatter") }),
                              /* @__PURE__ */ E.jsx("option", { value: "contour", children: v("Contour") })
                            ]
                          }
                        )
                      ] }),
                      dt.mode !== "off" && /* @__PURE__ */ E.jsxs("label", { className: "gl-check", title: dt.mode === "populations" ? v("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : v("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: at.recipe.iterated === !0,
                            onChange: (m) => It(
                              (D) => D.kind === "text" ? D : { ...D, iterated: m.target.checked }
                            )
                          }
                        ),
                        v("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: v("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: Ba }), children: [
                        v("Title"),
                        /* @__PURE__ */ E.jsx(
                          "input",
                          {
                            placeholder: Bu || Ne(at, kt),
                            value: at.recipe.title ?? "",
                            onChange: (m) => It(
                              (D) => D.kind === "text" ? D : { ...D, title: m.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ E.jsxs("summary", { children: [
                          v("Style"),
                          Object.keys(at.recipe.style ?? {}).length > 0 ? ` · ${v("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ E.jsx(
                          js,
                          {
                            effective: Ca(K, at.recipe),
                            own: at.recipe.style ?? {},
                            onChange: (m) => It(
                              (D) => re(D) ? { ...D, style: Bo({ ...D.style, ...m }) } : D
                            )
                          }
                        ),
                        Object.keys(at.recipe.style ?? {}).length > 0 && /* @__PURE__ */ E.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: v("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => It((m) => {
                              if (!re(m)) return m;
                              const { style: D, ...P } = m;
                              return P;
                            }),
                            children: v("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ E.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => w(
                            at.recipe
                          ),
                          children: v("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            et === "page" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
              /* @__PURE__ */ E.jsx("h3", { children: v("Page") }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Size"),
                /* @__PURE__ */ E.jsxs(
                  "select",
                  {
                    value: K.page.preset,
                    onChange: (m) => Qe(dc(m.target.value, K.page.orientation, K.page)),
                    children: [
                      Object.entries(fc).map(([m, D]) => /* @__PURE__ */ E.jsx("option", { value: m, children: D.label }, m)),
                      /* @__PURE__ */ E.jsx("option", { value: "custom", children: v("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Orientation"),
                /* @__PURE__ */ E.jsxs(
                  "select",
                  {
                    value: K.page.orientation,
                    onChange: (m) => Qe({ ...K.page, orientation: m.target.value }),
                    children: [
                      /* @__PURE__ */ E.jsx("option", { value: "portrait", children: v("Portrait") }),
                      /* @__PURE__ */ E.jsx("option", { value: "landscape", children: v("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((m) => /* @__PURE__ */ E.jsxs("label", { children: [
                v(m === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ E.jsx(
                  De,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": v(m === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Gs(K.page)[m === "width" ? "widthMm" : "heightMm"],
                    onCommit: (D) => {
                      const P = K.page.orientation === "landscape", F = m === "width" == !P ? "widthMm" : "heightMm";
                      Qe({ ...K.page, preset: "custom", [F]: D });
                    }
                  }
                )
              ] }, m)) }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Margin (mm)"),
                /* @__PURE__ */ E.jsx(
                  De,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: K.page.marginMm,
                    onCommit: (m) => Qe({ ...K.page, marginMm: m })
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ E.jsxs("label", { children: [
                  v("Pages across"),
                  /* @__PURE__ */ E.jsx(De, { min: 1, max: Oo, step: 1, integer: !0, "aria-label": v("Pages across"), value: K.page.columns, onCommit: (m) => Qe({ ...K.page, columns: m }) })
                ] }),
                /* @__PURE__ */ E.jsxs("label", { children: [
                  v("Pages down"),
                  /* @__PURE__ */ E.jsx(De, { min: 1, max: Oo, step: 1, integer: !0, "aria-label": v("Pages down"), value: K.page.rows, onCommit: (m) => Qe({ ...K.page, rows: m }) })
                ] })
              ] }),
              /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: $u, disabled: !K.items.length, title: v("Make the page a custom size that holds every item inside the margin, as one page"), children: v("Fit page to content") }),
                /* @__PURE__ */ E.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Uu, disabled: !K.items.length, title: v("Scale and centre every item, as one group, to fill the first page inside its margin"), children: v("Fit content to page") })
              ] }),
              /* @__PURE__ */ E.jsx("h3", { children: v("Export") }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Format"),
                /* @__PURE__ */ E.jsxs("select", { value: _t, onChange: (m) => Mt(m.target.value), children: [
                  /* @__PURE__ */ E.jsx("option", { value: "pdf", children: v("PDF · the page at its size") }),
                  /* @__PURE__ */ E.jsx("option", { value: "svg", children: v("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ E.jsx("option", { value: "png", children: v("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Resolution (dpi)"),
                /* @__PURE__ */ E.jsx(
                  De,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: K.page.dpi,
                    onCommit: (m) => Qe({ ...K.page, dpi: m })
                  }
                )
              ] }),
              /* @__PURE__ */ E.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void So(), disabled: ht || !K.items.length, children: v(ht ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            et === "iterate" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
              /* @__PURE__ */ E.jsx("h3", { children: v("Iterate") }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Draw the sheet"),
                /* @__PURE__ */ E.jsxs(
                  "select",
                  {
                    value: dt.mode,
                    onChange: (m) => tr({ ...dt, mode: m.target.value === "files" ? "files" : m.target.value === "populations" ? "populations" : "off" }),
                    children: [
                      /* @__PURE__ */ E.jsx("option", { value: "off", children: v("Once") }),
                      /* @__PURE__ */ E.jsx("option", { value: "files", children: v("Once per file") }),
                      /* @__PURE__ */ E.jsx("option", { value: "populations", children: v("Once per population") })
                    ]
                  }
                )
              ] }),
              dt.mode !== "off" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                dt.mode === "populations" && /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                  v("Populations"),
                  /* @__PURE__ */ E.jsxs(
                    "select",
                    {
                      value: ((ko = dt.populations) == null ? void 0 : ko.kind) === "branch" ? dt.populations.populationId : "all",
                      onChange: (m) => tr({
                        ...dt,
                        populations: m.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: m.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ E.jsx("option", { value: "all", children: v("All in the tree") }),
                        (Jt ? Ln(Jt.tree.populations, Jt.tree.root_population_id ?? "") : []).filter(({ popId: m }) => m !== (Jt == null ? void 0 : Jt.tree.root_population_id)).map(({ popId: m, depth: D }) => {
                          var P;
                          return /* @__PURE__ */ E.jsxs("option", { value: m, children: [
                            " ".repeat(D * 2),
                            v("Under {name}", { name: ((P = Jt == null ? void 0 : Jt.tree.populations[m]) == null ? void 0 : P.name) ?? m })
                          ] }, m);
                        })
                      ]
                    }
                  )
                ] }),
                dt.mode === "files" && /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                  v("Files"),
                  /* @__PURE__ */ E.jsxs("select", { value: Ju, onChange: (m) => tr({ ...dt, source: Qu(m.target.value) }), children: [
                    /* @__PURE__ */ E.jsx("option", { value: "checked", children: v("Checked files") }),
                    /* @__PURE__ */ E.jsx("option", { value: "all", children: v("All files") }),
                    a.map((m) => /* @__PURE__ */ E.jsx("option", { value: `group:${m.id}`, children: v("Group {name}", { name: m.name }) }, m.id)),
                    o.flatMap(
                      (m) => Zu(m).map((D) => /* @__PURE__ */ E.jsxs("option", { value: `meta:${m}=${D}`, children: [
                        m,
                        " = ",
                        D
                      ] }, `${m}=${D}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                  v("Arrangement"),
                  /* @__PURE__ */ E.jsxs(
                    "select",
                    {
                      value: dt.arrangement.kind,
                      onChange: (m) => tr({
                        ...dt,
                        arrangement: m.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ E.jsx("option", { value: "page-per-unit", children: dt.mode === "populations" ? v("One page per population") : v("One page per file") }),
                        /* @__PURE__ */ E.jsx("option", { value: "tiles", children: v("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                dt.arrangement.kind === "tiles" && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
                  /* @__PURE__ */ E.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((m) => /* @__PURE__ */ E.jsxs("label", { children: [
                    v(m === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ E.jsx(
                      De,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": v(m === "columns" ? "Tiles across" : "Tiles down"),
                        value: dt.arrangement.kind === "tiles" ? dt.arrangement[m] : 1,
                        onCommit: (D) => {
                          dt.arrangement.kind === "tiles" && tr({ ...dt, arrangement: { ...dt.arrangement, [m]: D } });
                        }
                      }
                    )
                  ] }, m)) }),
                  /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                    v("Order"),
                    /* @__PURE__ */ E.jsxs(
                      "select",
                      {
                        value: dt.arrangement.order,
                        onChange: (m) => dt.arrangement.kind === "tiles" && tr({ ...dt, arrangement: { ...dt.arrangement, order: m.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ E.jsx("option", { value: "row-major", children: v("Across, then down") }),
                          /* @__PURE__ */ E.jsx("option", { value: "column-major", children: v("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                    v("Gap between tiles (px)"),
                    /* @__PURE__ */ E.jsx(
                      De,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: dt.arrangement.gap,
                        onCommit: (m) => {
                          dt.arrangement.kind === "tiles" && tr({ ...dt, arrangement: { ...dt.arrangement, gap: m } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: dt.mode === "populations" ? v("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Je.length, of: (Jt == null ? void 0 : Jt.name) ?? "the file", pages: Math.max(1, ue.length) }) : v("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Je.length, pages: Math.max(1, ue.length) }) })
              ] })
            ] }),
            et === "style" && K && /* @__PURE__ */ E.jsxs(E.Fragment, { children: [
              /* @__PURE__ */ E.jsx("h3", { children: v("Style") }),
              /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                v("Plot titles"),
                /* @__PURE__ */ E.jsxs(
                  "select",
                  {
                    "aria-label": v("Plot titles"),
                    value: pr ? "custom" : ((To = Fn.find((m) => m.template === (K.titleTemplate ?? ""))) == null ? void 0 : To.id) ?? "custom",
                    onChange: (m) => {
                      const D = Fn.find((P) => P.id === m.target.value);
                      Tt(!D), zt((P) => {
                        var F;
                        D ? D.template ? P.titleTemplate = D.template : delete P.titleTemplate : P.titleTemplate = ((F = P.titleTemplate) == null ? void 0 : F.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      Fn.map((m) => /* @__PURE__ */ E.jsx("option", { value: m.id, children: v(m.label) }, m.id)),
                      /* @__PURE__ */ E.jsx("option", { value: "custom", children: v("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const m = K.items.filter((D) => so(D));
                return m.length ? /* @__PURE__ */ E.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  v("{count} plots keep a title of their own, so the template does not reach them.", { count: m.length }),
                  " ",
                  /* @__PURE__ */ E.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: v("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => zt((D) => {
                        for (const P of D.items) re(P.recipe) && delete P.recipe.title;
                      }),
                      children: v("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (pr || !Fn.some((m) => m.template === (K.titleTemplate ?? ""))) && (() => {
                var Ct;
                const m = K.titleTemplate ?? "", D = Gv(m), P = (D == null ? void 0 : D.tokens) ?? [], F = (D == null ? void 0 : D.separator) ?? ee, X = (mt) => {
                  var Lt;
                  return ((Lt = xn.find((Ae) => Ae.token === mt)) == null ? void 0 : Lt.label) ?? mt;
                }, it = (mt) => zt((Lt) => {
                  Lt.titleTemplate = zs(mt, F);
                }), ot = ae.items.find((mt) => re(mt.recipe)), yt = ot && re(ot.recipe) ? ia(m, Ie(ot.recipe, ot.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ E.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": v("Title builder"), children: [
                  /* @__PURE__ */ E.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": v("Fields in the title"), children: [
                    P.length === 0 && /* @__PURE__ */ E.jsx("span", { className: "gl-hint", children: v(D === null && m ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    P.map((mt, Lt) => /* @__PURE__ */ E.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": v("Remove {field}", { field: X(mt) }),
                        title: v("Remove {field} from the title", { field: X(mt) }),
                        onClick: () => it(P.filter((Ae, ge) => ge !== Lt)),
                        children: [
                          X(mt),
                          " ×"
                        ]
                      },
                      `${mt}-${Lt}`
                    ))
                  ] }),
                  /* @__PURE__ */ E.jsx("div", { className: "gl-title-builder-fields", "aria-label": v("Fields to add"), children: xn.map((mt) => /* @__PURE__ */ E.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": v("Add {field}", { field: mt.label }),
                      title: mt.token,
                      onClick: () => it([...P, mt.token]),
                      children: mt.label
                    },
                    mt.token
                  )) }),
                  /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline", children: [
                    v("Between fields"),
                    /* @__PURE__ */ E.jsx(
                      "select",
                      {
                        "aria-label": v("Separator"),
                        value: ((Ct = ja.find((mt) => mt.value === F)) == null ? void 0 : Ct.id) ?? "dot",
                        onChange: (mt) => {
                          var Ae;
                          const Lt = ((Ae = ja.find((ge) => ge.id === mt.target.value)) == null ? void 0 : Ae.value) ?? " · ";
                          mn(Lt), P.length && zt((ge) => {
                            ge.titleTemplate = zs(P, Lt);
                          });
                        },
                        children: ja.map((mt) => /* @__PURE__ */ E.jsx("option", { value: mt.id, children: v(mt.label) }, mt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ E.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    v("Template"),
                    /* @__PURE__ */ E.jsx(
                      "input",
                      {
                        "aria-label": v("Title template"),
                        value: m,
                        onChange: (mt) => zt((Lt) => {
                          Lt.titleTemplate = mt.target.value;
                        })
                      }
                    )
                  ] }),
                  yt && /* @__PURE__ */ E.jsx("div", { className: "gl-hint gl-title-builder-preview", children: v("First plot reads: {title}", { title: yt }) })
                ] });
              })(),
              /* @__PURE__ */ E.jsx("p", { className: "gl-hint", children: v(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: Ba }) }),
              /* @__PURE__ */ E.jsx(
                js,
                {
                  effective: Ca(K),
                  own: K.style ?? {},
                  onChange: (m) => zt((D) => {
                    D.style = Bo({ ...D.style, ...m });
                  })
                }
              ),
              Object.keys(K.style ?? {}).length > 0 && /* @__PURE__ */ E.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => zt((m) => {
                    delete m.style;
                  }),
                  children: v("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ E.jsx(pc, { menu: ju, onClose: () => xa(null) }),
          /* @__PURE__ */ E.jsxs(
            "div",
            {
              ref: (m) => {
                Bt.current = m, B(m);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": v("Layout page"),
              onKeyDown: tc,
              children: [
                !ft && R && /* @__PURE__ */ E.jsx(
                  Ov,
                  {
                    ref: $,
                    container: R,
                    dragContainer: R,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (m) => {
                      var D, P, F;
                      return !((F = (P = (D = m.inputEvent) == null ? void 0 : D.target) == null ? void 0 : P.closest) != null && F.call(P, "textarea, input, select, button"));
                    },
                    onDragStart: Hu,
                    onSelectEnd: qu
                  }
                ),
                /* @__PURE__ */ E.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: K.width * q, height: K.height * q },
                    children: /* @__PURE__ */ E.jsxs(
                      "section",
                      {
                        ref: (m) => {
                          Zt.current = m, z(m);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": K.name,
                        onContextMenu: Fu,
                        style: { width: K.width, height: K.height, transform: `scale(${q})` },
                        children: [
                          Xn(K.page).map((m) => {
                            const D = Ya(K.page), P = Ro(K.page.marginMm);
                            return /* @__PURE__ */ E.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: m.x, top: m.y, width: D.width, height: D.height }, children: P > 0 && /* @__PURE__ */ E.jsx("div", { className: "gl-layout-page-margin", style: { inset: P } }) }, `${m.row}-${m.column}`);
                          }),
                          ae.items.length === 0 && /* @__PURE__ */ E.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ E.jsx("strong", { children: v("Blank layout") }),
                            /* @__PURE__ */ E.jsx("span", { children: v(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          ae.items.map((m) => /* @__PURE__ */ E.jsx(
                            gh,
                            {
                              item: m,
                              templateText: (() => {
                                const D = K.items.find((P) => P.id === m.templateId);
                                return (D == null ? void 0 : D.recipe.kind) === "text" ? D.recipe.text : void 0;
                              })(),
                              selected: _.includes(m.id),
                              samples: kt,
                              state: c,
                              globalScales: f,
                              dataRevision: C,
                              densityColorPower: S,
                              style: Ca(K, m.recipe),
                              titleTemplate: so(m, m.templateSampleId) || io,
                              describe: Ie,
                              checkedSampleIds: n,
                              metadataById: Ee,
                              files: r,
                              sources: Ot.sources,
                              divisionProfiles: y,
                              canvasScale: St,
                              onTextChange: (D, P) => zt((F) => {
                                const X = F.items.find(
                                  (it) => it.id === m.templateId
                                );
                                (X == null ? void 0 : X.recipe.kind) === "text" && (X.recipe.text = D, P > 0 && (X.height = Math.max(X.height, Math.ceil(P) + 4)));
                              }),
                              onDelete: () => Wr([m.templateId]),
                              onOpenInGating: () => {
                                re(m.recipe) && w(m.recipe);
                              },
                              onTextFocus: () => {
                                (!_.includes(m.id) || _.length > 1) && M([m.id]);
                              },
                              onTextEscape: () => {
                                var D;
                                return (D = Bt.current) == null ? void 0 : D.focus({ preventScroll: !0 });
                              }
                            },
                            m.id
                          )),
                          !ft && N.length > 0 && /* @__PURE__ */ E.jsx(
                            hv,
                            {
                              ref: W,
                              target: N.length === 1 ? N[0] : N,
                              zoom: 1 / q,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !bn,
                              resizable: !bn,
                              snappable: !0,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: Bs,
                              elementSnapDirections: Bs,
                              elementGuidelines: V,
                              verticalGuidelines: xo.vertical,
                              horizontalGuidelines: xo.horizontal,
                              snapGridWidth: T ? Ns : 0,
                              snapGridHeight: T ? Ns : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              onDragStart: (m) => {
                                var D;
                                m.datas.alt = !!((D = m.inputEvent) != null && D.altKey), m.datas.alt && (m.datas.ghosts = vo([m.target]));
                              },
                              onDrag: go,
                              onDragEnd: (m) => {
                                ho(m.datas.ghosts), m.isDrag && Cn([m.target], !!m.datas.alt);
                              },
                              onDragGroupStart: (m) => {
                                var D;
                                m.datas.alt = !!((D = m.inputEvent) != null && D.altKey), m.datas.alt && (m.datas.ghosts = vo(m.targets));
                              },
                              onDragGroup: (m) => m.events.forEach(go),
                              onDragGroupEnd: (m) => {
                                ho(m.datas.ghosts), m.isDrag && Cn(m.targets, !!m.datas.alt);
                              },
                              onResize: mo,
                              onResizeEnd: (m) => {
                                m.isDrag && Cn([m.target], !1);
                              },
                              onResizeGroup: (m) => m.events.forEach(mo),
                              onResizeGroupEnd: (m) => {
                                m.isDrag && Cn(m.targets, !1);
                              },
                              onClickGroup: (m) => {
                                var D;
                                (D = $.current) == null || D.clickTarget(m.inputEvent, m.inputTarget);
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
  bh as LayoutTab,
  vh as isBakedTitle
};
