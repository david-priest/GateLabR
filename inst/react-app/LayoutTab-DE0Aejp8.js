import { a as tt, u as $r, j as b, t as va, w as sf, s as lf, z as gs, x as ms, y as Ja, A as xs, B as uf, E as bi, G as on, H as cf, I as Ol, J as Nl, f as ff, K as df, L as pf, M as Si, N as da, O as ys, P as jl, Q as hf, R as ie, T as Ir, U as cr, V as vf, W as gf, X as mf, Y as xf, Z as bs, _ as yf, $ as de, a0 as bf, S as Ss, a1 as Qa, a2 as Sf, a3 as Cf, a4 as Cs, a5 as wf, a6 as Ci, a7 as Ef, a8 as $n, a9 as ws, aa as Df, ab as kf, ac as Mf, ad as _f, ae as Es, af as zl, ag as Tf, ah as If, ai as Rf, aj as Ds, ak as ks, al as Pf, am as Of, an as Nf, ao as Ms, ap as jf, aq as zf, ar as Af, as as _s, at as Al, au as Bf, av as Gf, aw as Ff, ax as Lf, ay as Wf, az as Yf, aA as Xf, aB as Hf, aC as $f, aD as qf, l as ti, aE as Vf, aF as Uf, aG as Kf, aH as Zf, aI as Jf, aJ as Qf, aK as Ts } from "./embed-D_js-PHA.js";
function eo(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function Bl(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function Gl(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function ro(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function td() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function ed(t, e) {
  var r = ro("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function wi(t) {
  return t.replace(/_/g, ".");
}
function ln(t, e) {
  var r = null, n = "-1";
  return eo(t, function(a) {
    var i = ro("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = ed(a.versionTest.toLowerCase(), e) || n), n = wi(n), !0);
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
  return eo(t, function(n) {
    var a = Fl(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function Fl(t, e) {
  return Bl(t, function(r) {
    var n = r.brand;
    return ro("" + e.test, n.toLowerCase());
  });
}
var Ll = [{
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
}], Wl = [{
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
}], Ei = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], Yl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Xl = [{
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
function Hl(t) {
  return !!ln(Yl, t).preset;
}
function rd(t) {
  var e = Gl(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Hl(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = ln(Ll, e), o = i.preset, s = i.version, l = ln(Xl, e), u = l.preset, c = l.version, f = ln(Wl, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = ln(Ei, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function nd(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!qn(Yl, r).brand || Hl(Gl())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && eo(Ei, function(d) {
    return Fl(r, d);
  });
  var l = qn(Wl, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = qn(Ei, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = Bl(Xl, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = qn(Ll, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = wi(s.version), o.version = wi(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function ad(t) {
  return td() ? nd() : rd(t);
}
function id(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function od(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function rr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function $l(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function sd(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function ql(t, e) {
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
var ld = "function", ud = "object", cd = "string", fd = "number", no = "undefined", Vl = typeof window !== no, dd = typeof document !== no && document, pd = [{
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
function hd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ga(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function ao(t) {
  return typeof t === no;
}
function me(t) {
  return t && typeof t === ud;
}
function Ht(t) {
  return Array.isArray(t);
}
function Ee(t) {
  return typeof t === cd;
}
function bn(t) {
  return typeof t === fd;
}
function Ra(t) {
  return typeof t === ld;
}
function vd(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Ul(t, e, r, n, a) {
  var i = io(t, e, r);
  return i ? r : gd(t, e, r + 1, n, a);
}
function io(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function gd(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !io(t, e, u))
      return {
        value: u
      };
    var f = u, d = xe(a, function(p) {
      var v = p.open;
      return v === c;
    });
    if (d && (f = Ul(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function oo(t, e) {
  var r = Ee(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? pd : u, f = c.map(function(M) {
    var T = M.open, m = M.close;
    return T === m ? T : T + "|" + m;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", p = new RegExp(d, "g"), v = t.split(p).filter(function(M) {
    return M && M !== "undefined";
  }), g = v.length, x = [], y = [];
  function C() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var w = function(M) {
    var T = v[M].trim(), m = M, _ = xe(c, function(R) {
      var z = R.open;
      return z === T;
    }), j = xe(c, function(R) {
      var z = R.close;
      return z === T;
    });
    if (_) {
      if (m = Ul(_, v, M, g, c), m !== -1 && l)
        return C() && i || (x.push(v.slice(M, m + 1).join("")), M = m, i) ? (E = M, "break") : (E = M, "continue");
    } else if (j && !io(j, v, M)) {
      var O = hd(c);
      return O.splice(c.indexOf(j), 1), {
        value: oo(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: O
        })
      };
    } else if (vd(T, a) && !o)
      return C(), i ? (E = M, "break") : (E = M, "continue");
    m === -1 && (m = g - 1), y.push(v.slice(M, m + 1).join("")), M = m, E = M;
  }, E, k = 0; k < g; ++k) {
    var D = w(k);
    if (k = E, typeof D == "object") return D.value;
    if (D === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function nr(t) {
  return oo(t, "");
}
function vr(t) {
  return oo(t, ",");
}
function Kl(t) {
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
function Di(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function md(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function Sn() {
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
var Zl = /* @__PURE__ */ (function() {
  var t = Sn(), e = Vl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = Sn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), xd = /* @__PURE__ */ (function() {
  var t = Vl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function qr(t) {
  return Object.keys(t);
}
function Nt(t, e) {
  var r = mr(t), n = r.value, a = r.unit;
  if (me(e)) {
    var i = e[a];
    if (i) {
      if (Ra(i))
        return i(n);
      if (Vn[a])
        return Vn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return Vn[a] ? Vn[a](n) : n;
}
function ma(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function Is(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[St(e[0], Qt), St(e[0] / n, Qt)], [St(e[1] * n, Qt), St(e[1], Qt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = St(s, Qt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function so(t, e, r, n) {
  if (!n)
    return t.map(function(p, v) {
      return ma(p, e[v], r[v]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = Is(t, e, !1, o), l = s[0], u = s[1], c = Is(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function yd(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function ki(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function $t(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function bd(t) {
  return [0, 1].map(function(e) {
    return ki(t.map(function(r) {
      return r[e];
    }));
  });
}
function Rs(t) {
  var e = bd(t), r = $t(e, t[0]), n = $t(e, t[1]);
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
function Ps(t, e) {
  return t.forEach(function(r, n) {
    t[n] = St(t[n], e);
  }), t;
}
function Sd(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function Cd(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function te(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function lo(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function Jl(t, e) {
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
  return (t == null ? void 0 : t.ownerDocument) || dd;
}
function uo(t) {
  return Ie(t).documentElement;
}
function or(t) {
  return Ie(t).body;
}
function Ce(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Ql(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function Cn(t) {
  return me(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function wd(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function Ed(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function Dd(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function tu(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Pe(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = zt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!St(r[i], Qt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          Ed(r, n, a, o, e);
          break;
        }
    }
    if (!St(r[i], Qt))
      return [];
    Dd(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !St(u, Qt) || a === o || wd(r, n, s, a, e, -u);
    }
  }
  return n;
}
function kd(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function eu(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function Md(t, e) {
  for (var r = zt(e), n = 0; n < e - 1; ++n)
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
  for (var n = zt(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function xa(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = zt(t);
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
function _d(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function ru(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function oe(t, e, r) {
  r === void 0 && (r = e.length);
  var n = jt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function Td(t, e) {
  return jt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Id(t, e) {
  return jt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Rd(t, e) {
  return jt(t, kn(e, 4));
}
function Un(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return jt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Dn(t, e) {
  return oe(kn(e, 3), xr(t, 3));
}
function ei(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return jt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function Mi(t, e) {
  return jt(t, e, 4);
}
function kn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = zt(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function zt(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function co(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function yr(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function fo(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], p = r[1], v = n[0], g = n[1], x = a[0], y = a[1], C = i[0], w = i[1], E = o[0], k = o[1], D = s[0], M = s[1], T = [l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -C * c, -w * c, -E * d, -k * d, -D * v, -M * v, -x * u, -y * u, -C * f, -w * f, -E * p, -k * p, -D * g, -M * g], m = Pe(T, 8);
  if (!m.length)
    return [];
  var _ = jt(m, [x, y, C, w, E, k, D, M], 8);
  return _[8] = 1, Oe(kd(_), 3, 4);
}
var fn = function() {
  return fn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, fn.apply(this, arguments);
};
function po() {
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
function pa(t, e) {
  var r = oe(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function Pd(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = po(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = Mi(Gr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Pe(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Rr(t) {
  var e = po();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Fr(t, e) {
  e === void 0 && (e = 0);
  var r = Ht(t) ? t : nr(t);
  return r.map(function(n) {
    var a = Kl(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = me(e) ? fn(fn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = vr(o).map(function(R, z) {
        return z === 0 && "x%" in c ? c["%"] = e["x%"] : z === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Nt(R, c);
      }), d = f[0], p = f[1], v = p === void 0 ? 0 : p, g = f[2], x = g === void 0 ? 0 : g;
      s = ei, u = [d, v, x];
    } else if (i === "translateY") {
      var y = me(e) ? fn({ "%": e["y%"] }, e) : {
        "%": e
      }, v = Nt(o, y);
      s = ei, u = [0, v, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = ei, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var C = vr(o).map(function(R) {
        return parseFloat(R);
      }), w = C[0], E = C[1], k = E === void 0 ? w : E, D = C[2], M = D === void 0 ? 1 : D;
      s = Un, u = [w, k, M];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = Un, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var k = parseFloat(o);
      s = Un, u = [1, k, 1];
    } else if (i === "scaleZ") {
      var M = parseFloat(o);
      s = Un, u = [1, 1, M];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var T = mr(o), m = T.unit, _ = T.value, j = m === "rad" ? _ : _ * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = Rd) : i === "rotateX" ? s = Td : i === "rotateY" && (s = Id), u = j;
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
var Od = /* @__PURE__ */ (function() {
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
})(), Nd = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), jd = typeof Map == "function", zd = /* @__PURE__ */ (function() {
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
function Ad(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new zd();
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
var Bd = /* @__PURE__ */ (function() {
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
    var r = Ad(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function ho(t, e, r) {
  var n = jd ? Map : r ? Nd : Od, a = r || function(C) {
    return C;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], p = [], v = {}, g = [], x = 0, y = 0;
  return l.forEach(function(C, w) {
    c.set(C, w);
  }), u.forEach(function(C, w) {
    f.set(C, w);
  }), l.forEach(function(C, w) {
    var E = f.get(C);
    typeof E > "u" ? (++y, o.push(w)) : v[E] = y;
  }), u.forEach(function(C, w) {
    var E = c.get(C);
    typeof E > "u" ? (i.push(w), ++x) : (s.push([E, w]), y = v[w] || 0, d.push([E - y, w - x]), p.push(w === E), E !== w && g.push([E, w]));
  }), o.reverse(), new Bd(t, e, i, o, g, s, d, p);
}
var Gd = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = ho(this.list, n, this.findKeyCallback);
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
var _i = function(t, e) {
  return _i = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, _i(t, e);
};
function Fd(t, e) {
  _i(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var nu = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), au = /* @__PURE__ */ (function(t) {
  Fd(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, nu) || this;
  }
  return e;
})(Gd);
function Pr(t, e) {
  return ho(t, e, nu);
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
var Ti = function() {
  return Ti = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ti.apply(this, arguments);
};
function Ld() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var Mn = /* @__PURE__ */ (function() {
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
    }, n.currentTarget = this, Ld(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(Ti({
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
var Ii = function(t, e) {
  return Ii = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ii(t, e);
};
function Wd(t, e) {
  Ii(t, e);
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
function Yd(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Os(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Kn(t) {
  if (t) {
    if (Ee(t))
      return document.querySelector(t);
  } else return null;
  if (Ra(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var iu = /* @__PURE__ */ (function(t) {
  Wd(e, t);
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
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), p = d[0] - o[0], v = d[1] - o[1], g = s || [p ? Math.abs(p) / p : 0, v ? Math.abs(v) / v : 0];
    return this._prevScrollPos = d, this._lock = !1, !p && !v ? !1 : (this.emit("move", {
      offsetX: g[0] ? p : 0,
      offsetY: g[1] ? v : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? Yd : o;
    return s({
      container: Kn(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = Sn(), p = Math.max(l + this._prevTime - d, 0);
      if (p > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, p), !1;
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
      var i = a === !0 ? Os : a, o = Kn(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Os(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(Mn);
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
function Xd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function pe(t) {
  return St(t, Qt);
}
function Hd(t, e) {
  return t.every(function(r, n) {
    return pe(r - e[n]) === 0;
  });
}
function $d(t, e) {
  return !pe(t[0] - e[0]) && !pe(t[1] - e[1]);
}
function dn(t) {
  return t.length < 3 ? 0 : Math.abs(yd(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Ri(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = br(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(p) {
    return [a + (p[0] - s) * f, i + (p[1] - l) * d];
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
function ya(t, e, r) {
  var n = t[0], a = t[1], i = br(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = ba(l[0], l[1]), c = Pi(e), f = [];
  if (c.forEach(function(v) {
    var g = ba(v[0], v[1]), x = v[0];
    if (Hd(u, g))
      f.push({
        pos: t,
        line: v,
        type: "line"
      });
    else {
      var y = ou(vo(u, g), [l, v]);
      y.forEach(function(C) {
        v.some(function(w) {
          return $d(w, C);
        }) ? f.push({
          pos: C,
          line: v,
          type: "point"
        }) : pe(x[1] - a) !== 0 && f.push({
          pos: C,
          line: v,
          type: "intersection"
        });
      });
    }
  }), xe(f, function(v) {
    return v[0] === n;
  }))
    return !0;
  var d = 0, p = {};
  return f.forEach(function(v) {
    var g = v.pos, x = v.type, y = v.line;
    if (!(g[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var C = xe(y, function(k) {
            return k[1] !== a;
          }), w = p[g[0]], E = C[1] > a ? 1 : -1;
          w ? w !== E && ++d : p[g[0]] = E;
        }
      }
  }), d % 2 === 1;
}
function ba(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Qt && (o = 0), Math.abs(s) < Qt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function vo(t, e) {
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
function ou(t, e) {
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
    return r.every(function(v) {
      return 0 <= pe(d - v[0][0]) && 0 <= pe(v[0][1] - d) && 0 <= pe(p - v[1][0]) && 0 <= pe(v[1][1] - p);
    });
  })), n.map(function(f) {
    return [pe(f[0]), pe(f[1])];
  });
}
function Pi(t) {
  return Xd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function qd(t, e) {
  var r = t.slice(), n = e.slice();
  Rs(r) === -1 && r.reverse(), Rs(n) === -1 && n.reverse();
  var a = Pi(r), i = Pi(n), o = a.map(function(c) {
    return ba(c[0], c[1]);
  }), s = i.map(function(c) {
    return ba(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], p = [];
    s.forEach(function(v, g) {
      var x = vo(c, v), y = ou(x, [d, i[g]]);
      p.push.apply(p, y.map(function(C) {
        return {
          index1: f,
          index2: g,
          pos: C,
          type: "intersection"
        };
      }));
    }), p.sort(function(v, g) {
      return Be(d[0], v.pos) - Be(d[0], g.pos);
    }), l.push.apply(l, p), ya(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (ya(c[1], r)) {
      var d = !1, p = qe(l, function(v) {
        var g = v.index2;
        return g === f ? (d = !0, !1) : !!d;
      });
      p === -1 && (d = !1, p = qe(l, function(v) {
        var g = v.index1, x = v.index2;
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
function Oi(t, e) {
  var r = qd(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function Vd(t, e) {
  var r = Oi(t, e);
  return dn(r);
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
var Ni = function(t, e) {
  return Ni = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ni(t, e);
};
function Ud(t, e) {
  Ni(t, e);
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
function Kd(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function ri(t) {
  return Kd([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function Zd(t) {
  return t.touches && t.touches.length >= 2;
}
function Zn(t) {
  return t ? t.touches ? Qd(t.touches) : [su(t)] : [];
}
function Jd(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function Ns(t, e, r) {
  var n = r.length, a = pn(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = pn(e, n), c = u.clientX, f = u.clientY, d = pn(r, n), p = d.clientX, v = d.clientY, g = i - c, x = o - f, y = i - p, C = o - v;
  return {
    clientX: s,
    clientY: l,
    deltaX: g,
    deltaY: x,
    distX: y,
    distY: C
  };
}
function ni(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Qd(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(su(t[n]));
  return r;
}
function su(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function pn(t, e) {
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
var ai = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), ri(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), ri(e) - ri(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = Ns(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = Ns([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = pn(e, this.length), a = pn(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), ni(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), ni(e) / ni(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), js = ["textarea", "input"], lu = /* @__PURE__ */ (function(t) {
  Ud(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, p) {
      if (p === void 0 && (p = !0), !(!a.flag && d.cancelable === !1)) {
        var v = d.type.indexOf("drag") >= -1;
        if (!(a.flag && v)) {
          a._isDragAPI = !0;
          var g = a.options, x = g.container, y = g.pinchOutside, C = g.preventWheelClick, w = g.preventRightClick, E = g.preventDefault, k = g.checkInput, D = g.dragFocusedInput, M = g.preventClickEventOnDragStart, T = g.preventClickEventOnDrag, m = g.preventClickEventByCondition, _ = a._useTouch, j = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, C && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (j) {
            var O = a._window.document.activeElement, R = d.target;
            if (R) {
              var z = R.tagName.toLowerCase(), A = js.indexOf(z) > -1, W = R.isContentEditable;
              if (A || W) {
                if (k || !D && O === R)
                  return !1;
                if (O && (O === R || W && O.isContentEditable && O.contains(R)))
                  if (D)
                    R.blur();
                  else
                    return !1;
              } else if ((E || d.type === "touchstart") && O) {
                var $ = O.tagName.toLowerCase();
                (O.isContentEditable || js.indexOf($) > -1) && O.blur();
              }
              (M || T || m) && Jt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new ai(Zn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = p, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = Sn() - a.prevTime < 200, a._isMouseEvent = Jd(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var F = a._preventMouseEvent || a.emit("dragStart", Kt(Kt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: p, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
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
          }))) : _ && y && Xt(x, "touchstart", a.onDragStart), a.flag && Zd(d)) {
            if (clearTimeout(q), j && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, p) {
      if (a.flag) {
        var v = a.options.preventDefault;
        !a._isMouseEvent && v && d.preventDefault(), a._prevInputEvent = d;
        var g = Zn(d), x = a.moveClients(g, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Kt(Kt({}, x), { isScroll: !!p, inputEvent: d }));
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
        var p = a.options, v = p.pinchOutside, g = p.container, x = p.preventClickEventOnDrag, y = p.preventClickEventOnDragStart, C = p.preventClickEventByCondition, w = a.isDrag;
        (x || y || C) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !C && !y && x && !w && a._allowClickEvent(), a._useTouch && v && Xt(g, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var E = d != null && d.touches ? Zn(d) : [], k = E.length;
        k === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new ai(E));
        var D = a._getPosition(), M = Sn(), T = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || T ? 0 : M, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Kt({ data: a.data, datas: a.data, isDouble: T, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, D)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Xt(a._window, "click", a._onClick, !0);
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
    a._window = Ql(o) ? o : Ce(o), a.options = Kt({ checkInput: !1, container: o && !("document" in o) ? Ce(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
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
      var i = new ai(Zn(r));
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
})(Mn);
function tp(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var ep = tp;
function rp(t) {
  return ep(t).toString(36);
}
function np(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function ap(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? vr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function ip(t, e, r, n, a) {
  var i = Ie(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = ap(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function uu(t) {
  var e = "rCS" + rp(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = np(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = ip(e, t, n, r, a);
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
var ji = function() {
  return ji = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, ji.apply(this, arguments);
};
function op(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function cu(t, e) {
  var r = uu(e), n = r.className;
  return tt.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = op(a, ["className", "cspNonce"]), u = tt.useRef();
    return tt.useImperativeHandle(i, function() {
      return u.current;
    }, []), tt.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), tt.createElement(t, ji({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var zi = function(t, e) {
  return zi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, zi(t, e);
};
function _n(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  zi(t, e);
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
function sp(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function lp(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function up(t) {
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
var cp = ["n", "w", "s", "e"], go = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function fp(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function dp(t) {
  var e = fp(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var Vr = ad(), fu = Vr.browser.webkit, du = fu && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), pu = Vr.browser.name, hu = parseInt(Vr.browser.version, 10), pp = pu === "chrome", hp = Vr.browser.chromium, vp = parseInt(Vr.browser.chromiumVersion, 10) || 0, gp = pp && hu >= 109 || hp && vp >= 109, mp = pu === "firefox", xp = parseInt(Vr.browser.webkitVersion, 10) >= 612 || hu >= 15, mo = "moveable-", yp = go.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), bp = `
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
`.concat(yp, `
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
`).concat(dp(t), `
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

`).concat(du ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), Sp = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], Ai = 1e-4, ce = 1e-7, Jn = 1e-9, Bi = Math.pow(10, 10), zs = -Bi, Cp = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, xo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, vu = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, wp = [
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
  var a = t.length === 16, i = a ? 4 : 3, o = wr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], p = f[1], v = N(s[2], 2), g = v[0], x = v[1], y = N(s[3], 2), C = y[0], w = y[1], E = N(Ft(t, e, i), 2), k = E[0], D = E[1], M = Math.min(u, d, g, C), T = Math.min(c, p, x, w), m = Math.max(u, d, g, C), _ = Math.max(c, p, x, w);
  u = u - M || 0, d = d - M || 0, g = g - M || 0, C = C - M || 0, c = c - T || 0, p = p - T || 0, x = x - T || 0, w = w - T || 0, k = k - M || 0, D = D - T || 0;
  var j = t[0], O = t[i + 1], R = le(j * O);
  return {
    left: M,
    top: T,
    right: m,
    bottom: _,
    origin: [k, D],
    pos1: [u, c],
    pos2: [d, p],
    pos3: [g, x],
    pos4: [C, w],
    direction: R
  };
}
function gu(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, p = N(mt(Xr(s, [r - c, n - f], d), u), 2), v = p[0], g = p[1], x = N(Fe({ datas: a, distX: v, distY: g }), 2), y = x[0], C = x[1];
  return [y, C];
}
function Cr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, p = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Pe(a, p), r.inverseBeforeMatrix = Pe(i, p), r.absoluteOrigin = xr(It([s, l], u), p), r.startDragBeforeDist = oe(r.inverseBeforeMatrix, r.absoluteOrigin, p), r.startDragDist = oe(r.inverseMatrix, r.absoluteOrigin, p);
}
function Ep(t) {
  return Br(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Pa(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = qe(o, function(p) {
    return p.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : xe(l, function(p) {
    return p.index === i && p.functionName === r;
  }) ? u = i : u = i + l.filter(function(p) {
    return p.index < i;
  }).length;
  var c = Kh(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = Q(Q([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Oa(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function Dp(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(xu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = mu(e, Md([i, o], 4));
  return oe(s, xr([0, 0, 0], 4), 4);
}
function mu(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? jt(s, e, 4) : jt(e, s, 4), u = jt(Pe(r ? i : n, 4), l, 4), c = jt(u, Pe(r ? o : a, 4), 4);
  return c;
}
function xu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return mt(oe(a, It(s, [r, n]), l), o);
}
function Fe(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return mt(oe(e ? i : o, It(c, [n, a]), f), e ? l : u);
}
function kp(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return mt(oe(i, It(s, [n, a]), u), l);
}
function Mp(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = mr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var p = f ? i[s] / f : 0;
      return d * p;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function yu(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function _p(t, e) {
  return yu(e).map(function(r) {
    return t[r];
  });
}
function ii(t, e) {
  var r = (e + 1) / 2;
  return [
    ga(t[0][0], t[1][0], r, 1 - r),
    ga(t[0][1], t[1][1], r, 1 - r)
  ];
}
function re(t, e) {
  var r = ii([t[0], t[1]], e[0]), n = ii([t[2], t[3]], e[0]);
  return ii([r, n], e[1]);
}
function Tp(t, e, r, n, a, i) {
  var o = wr(e, r, n, a), s = re(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function Rn(t, e, r, n) {
  return jt(t, vn(e, n, r), n);
}
function Ip(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Ee(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Oe(Gr(r), 4, s) : l = Oe(jt(jt(u, Gr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return Rn(i, l, a, s);
}
function Rp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return Rn(n, jt(o || i, co(e, s), s), r, s);
}
function Na(t, e) {
  var r = Ur(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Ht(n) ? n : nr(n), Gi(t, e, a);
    },
    setTransformIndex: function(n) {
      Gi(t, e, n);
    }
  };
}
function ja(t, e, r) {
  var n = Ur(e), a = n.startTransforms;
  Gi(t, e, qe(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function Gi(t, e, r) {
  var n = Ur(e), a = e.datas;
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
function yo(t, e) {
  var r = Ur(t);
  r.nextTransforms = nr(e);
}
function Ur(t) {
  return t.originalDatas.beforeRenderable;
}
function Sa(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function Qn(t) {
  return (Sa(t) || []).join(" ");
}
function ta(t) {
  return Ur(t).nextStyle;
}
function bu(t, e, r, n, a) {
  yo(a, e);
  var i = se.drag(t, In(a, t.state, r, n)), o = i ? i.transform : e;
  return P(P({ transform: e, drag: i }, ue({
    transform: o
  }, a)), { afterTransform: o });
}
function bo(t, e, r, n, a, i) {
  var o = Ip(t.state, a, e, i), s = Np(t, r, n, o);
  return s;
}
function Su(t, e, r, n, a, i, o) {
  var s = bo(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, p = f ? c : 0, v = mt(n, s);
  return mt(v, [d, p]);
}
function Pp(t, e, r, n, a, i, o) {
  var s = Su(t, e, r, n, a, i, o);
  return s;
}
function Op(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function Np(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Ft(n, u, l);
}
function jp(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return Su(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function zp(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, p = s.left, v = s.top, g = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, C = Mp(a, e, r, f, d, l), w = o ? p : 0, E = o ? v : 0, k = Rn(u, x, C, y), D = Tp(n, k, e, r, y, g);
  return mt(D, [w, E]);
}
function Ap(t, e) {
  return re(ke(t.state), e);
}
function Bp(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function Gp(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Fp(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function Cu(t, e, r) {
  for (var n = t, a = [], i = uo(t) || or(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, p = !1, v = En(e, e, !0).offsetParent, g = 1; n && !s; ) {
    s = o;
    var x = he(n), y = x("position"), C = $u(n), w = y === "fixed", E = Fp(x), k = _d(Ah(C)), D = void 0, M = !1, T = !1, m = 0, _ = 0, j = 0, O = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (p = !0, R = Wh(n), v = R.fixedContainer);
    var z = k.length;
    !l && (z === 16 || E.length) && (l = !0, u = 4, Hi(a), d && (d = Oe(d, 3, 4))), l && z === 9 && (k = Oe(k, 3, 4));
    var A = Lh(n, t), W = A.tagName, $ = A.hasOffset, F = A.isSVG, q = A.origin, V = A.targetOrigin, L = A.offset, rt = N(L, 2), at = rt[0], Z = rt[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: Yh(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }));
    var nt = parseFloat(x("zoom")) || 1;
    if (w)
      D = R.fixedContainer, M = !0;
    else {
      var et = En(n, e, !1, !0, x), ot = et.offsetZoom;
      if (D = et.offsetParent, M = et.isEnd, T = et.isStatic, g *= ot, (et.isCustomElement || ot !== 1) && T)
        at -= D.offsetLeft, Z -= D.offsetTop;
      else if (mp || gp) {
        var it = et.parentSlotElement;
        if (it) {
          for (var ft = D, bt = 0, J = 0; ft && Gp(ft); )
            bt += ft.offsetLeft, J += ft.offsetTop, ft = ft.offsetParent;
          at -= bt, Z -= J;
        }
      }
    }
    if (fu && !xp && $ && !F && T && (y === "relative" || y === "static") && (at -= D.offsetLeft, Z -= D.offsetTop, o = o || M), w)
      $ && R.hasTransform && (j = D.clientLeft, O = D.clientTop);
    else if ($ && v !== D && (m = D.clientLeft, _ = D.clientTop), $ && D === i) {
      var lt = qu(n, !1);
      at += lt[0], Z += lt[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: vn(k, u, q)
    }), E.length && (a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: vn(Gr(E), u, q)
    })), $) {
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
      matrix: vn(co([nt, nt], u), u, [0, 0])
    }), d || (d = k), c || (c = q), f || (f = V), s || w)
      break;
    n = D, o = M, (!r || n === i) && (s = o);
  }
  return d || (d = zt(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: g,
    offsetContainer: v,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: p
  };
}
var fr = null, dr = null, Nr = null;
function Wr(t) {
  t ? (window.Map && (fr = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map()), Nr = []) : (fr = null, Nr = null, dr = null);
}
function Lp(t) {
  var e = dr == null ? void 0 : dr.get(t);
  if (e)
    return e;
  var r = gn(t, !0);
  return dr && dr.set(t, r), r;
}
function Wp(t, e) {
  if (Nr) {
    var r = xe(Nr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = Cu(t, e, !0);
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
function oi(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Re(t, e.name, a), d = t.moveables, p = [], v = f.map(function(g, x) {
    var y = d[x], C = y.state, w = C.gestos, E = g;
    if (s)
      E = new Lr(o).dragStart(n, g), p.push(E);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      E = In(g, C, n, u, i, o), p.push(E);
    }
    var k = e[r](y, P(P({}, E), { parentFlag: !0 }));
    return l && (w[o] = null), k;
  });
  return s && (c.childGestos = d.map(function(g) {
    return g.state.gestos[o];
  })), {
    eventParams: v,
    childEvents: p
  };
}
function $e(t, e, r, n, a, i) {
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
function Ca(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || ke(e.state), s = re(o, a), l = N(oe(kn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function wu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = Sr(t.props, e).zoom, u = hn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(v) {
    var g = v.dir;
    c[g] = !0;
  });
  var p = le(s);
  return r.map(function(v) {
    var g = v.data, x = v.classNames, y = v.dir, C = xo[y];
    if (!C || !c[y])
      return null;
    d[y] = !0;
    var w = (St(u, 15) + p * vu[y] + 720) % 180, E = {};
    return qr(g).forEach(function(k) {
      E["data-".concat(k)] = g[k];
    }), n.createElement("div", P({ className: gt.apply(void 0, Q(["control", "direction", y, e], N(x), !1)), "data-rotation": w, "data-direction": y }, E, { key: "direction-".concat(y), style: ka.apply(void 0, Q([o, l], N(C.map(function(k) {
      return i[k];
    })), !1)) }));
  });
}
function Eu(t, e, r, n) {
  var a = Sr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? go : o;
  return Q(Q([], N(s ? _u(t, n, r, l) : []), !1), N(wu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function wn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = $t(r, n), u = e ? St(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: gt.apply(void 0, Q(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: cn(r, n, a, l) });
}
function Du(t, e, r, n, a) {
  var i = r === !0 ? cp : r;
  return i.map(function(o, s) {
    var l = N(xo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return wn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function ku(t) {
  return function(e, r) {
    var n = Sr(e.props, t).edge;
    return n && (n === !0 || n.length) ? Q(Q([], N(Du(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(Yp(e, t, r)), !1) : Mu(e, t, r);
  };
}
function Mu(t, e, r) {
  return Eu(t, go, e, r);
}
function Yp(t, e, r) {
  return Eu(t, ["nw", "ne", "sw", "se"], e, r);
}
function _u(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = le(l), d = s / Math.PI * 180;
  return (n || qr(u)).map(function(p) {
    var v = xo[p];
    if (!v)
      return null;
    var g = (St(d, 15) + f * vu[p] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: gt.apply(void 0, Q([], N(x), !1)), "data-rotation": g, "data-direction": p, key: "direction-around-".concat(p), style: ka.apply(void 0, Q([s, c], N(v.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function So(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, p = d === void 0 ? 1 / 0 : d, v = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: p
  };
  return {
    vertical: As(v, e, !0),
    horizontal: As(v, r, !1)
  };
}
function za(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, p = e || t.props.bounds || {}, v = p.position || "client", g = v === "css", x = p.left, y = x === void 0 ? -1 / 0 : x, C = p.top, w = C === void 0 ? -1 / 0 : C, E = p.right, k = E === void 0 ? g ? -1 / 0 : 1 / 0 : E, D = p.bottom, M = D === void 0 ? g ? -1 / 0 : 1 / 0 : D;
  return g && (k = i + f - u - k, M = a + d - c - M), {
    left: y + u - o,
    right: k + u - o,
    top: w + c - s,
    bottom: M + c - s
  };
}
function Xp(t, e, r) {
  var n = za(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(mt(r, e), 2), d = f[0], p = f[1];
  H(d) < ce && (d = 0), H(p) < ce && (p = 0);
  var v = p > 0, g = d > 0, x = {
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
    g ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var C = p / d, w = r[1] - C * u, E = 0, k = 0, D = !1;
    g && o <= u ? (E = C * o + w, k = o, D = !0) : !g && u <= a && (E = C * a + w, k = a, D = !0), D && (E < i || E > s) && (D = !1), D || (v && s <= c ? (E = s, k = (E - w) / C, D = !0) : !v && c <= i && (E = i, k = (E - w) / C, D = !0)), D && (x.isBound = !0, x.pos = k, x.offset = u - k, y.isBound = !0, y.pos = E, y.offset = c - E);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function As(t, e, r) {
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
function Bs(t, e, r) {
  var n = r ? t.map(function(a) {
    return Dn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && H(a[0] - e.left) > 0.1 || a[0] > e.right && H(a[0] - e.right) > 0.1 || a[1] < e.top && H(a[1] - e.top) > 0.1 || a[1] > e.bottom && H(a[1] - e.bottom) > 0.1;
  });
}
function Hp(t, e, r) {
  var n = De(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return H(i - t[r ? 0 : 1]) - H(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return $t([0, 0], r ? [i, e] : [e, i]);
  });
}
function $p(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = za(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], p = l - n[1], v = c - n[1], g = {
    left: f,
    top: p,
    right: d,
    bottom: v
  };
  if (!Bs(r, g, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [p, 1],
    [v, 1]
  ].forEach(function(y) {
    var C = N(y, 2), w = C[0], E = C[1];
    r.forEach(function(k) {
      var D = $t([0, 0], k);
      x.push.apply(x, Q([], N(Hp(k, w, E).map(function(M) {
        return i + M - D;
      }).filter(function(M) {
        return !Bs(e, g, M);
      }).map(function(M) {
        return St(M * 180 / Math.PI, ce);
      })), !1));
    });
  }), x;
}
var qp = ["left", "right", "center"], Vp = ["top", "bottom", "middle"], Gs = {
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
function Kr(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function Co(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Up(t, e) {
  var r = Co(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function wo(t, e) {
  var r = Up(t, e), n = Vp.filter(function(i) {
    return i in r;
  }), a = qp.filter(function(i) {
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
function Kp(t, e, r) {
  var n = Ft(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function Zp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Qt && (a = 0), Math.abs(i) < Qt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return St(u, Qt);
  });
}
var Tu = "snapRotationThreshold", Iu = "snapRotationDegrees", Ru = "snapHorizontalThreshold", Pu = "snapVerticalThreshold";
function Aa(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = tl(o, l[Ru], 5), f = tl(i, l[Pu], 5);
  return Ou(t.state.guidelines, e, r, n, a, c, f, u);
}
function Ou(t, e, r, n, a, i, o, s) {
  return {
    vertical: Ls(t, "vertical", e, o * s[0], n),
    horizontal: Ls(t, "horizontal", r, i * s[1], a)
  };
}
function Jp(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(mt(r, e), 2), c = u[0], f = u[1], d = f > 0, p = c > 0;
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
  var x = Aa(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, C = x.horizontal;
  y.posInfos.filter(function(W) {
    var $ = W.pos;
    return p ? $ >= s : $ <= s;
  }), C.posInfos.filter(function(W) {
    var $ = W.pos;
    return d ? $ >= l : $ <= l;
  }), y.isSnap = y.posInfos.length > 0, C.isSnap = C.posInfos.length > 0;
  var w = Fi(y), E = w.isSnap, k = w.guideline, D = Fi(C), M = D.isSnap, T = D.guideline, m = M ? T.pos[1] : 0, _ = E ? k.pos[0] : 0;
  if (c === 0)
    M && (g.isSnap = !0, g.pos = T.pos[1], g.offset = i - g.pos);
  else if (f === 0)
    E && (v.isSnap = !0, v.pos = _, v.offset = a - _);
  else {
    var j = f / c, O = r[1] - j * a, R = 0, z = 0, A = !1;
    E ? (z = _, R = j * z + O, A = !0) : M && (R = m, z = (R - O) / j, A = !0), A && (v.isSnap = !0, v.pos = z, v.offset = a - z, g.isSnap = !0, g.pos = R, g.offset = i - R);
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
function Fs(t, e, r, n) {
  var a = wo(t.props.snapDirections, e), i = Aa(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return tr(l);
  }), a.horizontalNames.map(function(l) {
    return tr(l);
  }), r, n), o = tr(a.horizontalNames[i.horizontal.index]), s = tr(a.verticalNames[i.vertical.index]);
  return {
    vertical: P(P({}, i.vertical), { direction: s }),
    horizontal: P(P({}, i.horizontal), { direction: o })
  };
}
function Fi(t) {
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
function Ls(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var p = a[d] || "", v = t.map(function(g) {
      var x = g.pos, y = f - x[l];
      return {
        offset: y,
        dist: H(y),
        guideline: g,
        direction: p
      };
    }).filter(function(g) {
      var x = g.guideline, y = g.dist, C = x.type;
      return !(C !== e || y > n);
    }).sort(function(g, x) {
      return g.dist - x.dist;
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
function Qp(t, e, r, n, a) {
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
    var g = v[p + 1] || v[0];
    i.push(d), i.push([
      (d[0] + g[0]) / 2,
      (d[1] + g[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, Q([], N(_p([
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
function Nu(t, e) {
  var r = H(t.offset), n = H(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < ce ? 1 : n < ce ? -1 : r - n;
}
function wa(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Nu({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function th(t, e, r) {
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
function ju(t, e) {
  var r = ki([e[0][0], e[1][0]]), n = ki([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function Eo(t, e) {
  var r = N(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  H(i) < ce && (i = 0), H(o) < ce && (o = 0);
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
function zu(t, e, r, n) {
  return n === void 0 && (n = ce), t.every(function(a) {
    var i = Eo(a, e), o = i <= 0;
    return o === r || H(i) <= n;
  });
}
function Ws(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function eh(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], p = [[l, u], [l + c, u]], v = [[l + c, u], [l + c, u + f]], g = [[l, u + f], [l + c, u + f]];
  if (zu([
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
  var x = er(r, o, p, a), y = er(r, o, g, a), C = er(r, o, d, i), w = er(r, o, v, i), E = x.isBound && y.isBound, k = x.isBound || y.isBound, D = C.isBound && w.isBound, M = C.isBound || w.isBound, T = Yr(x.offset, y.offset), m = Yr(C.offset, w.offset), _ = [0, 0], j = !1, O = !1;
  return H(m) < H(T) ? (_ = [T, 0], j = k, O = E) : (_ = [0, m], j = M, O = D), {
    isAllBound: O,
    isVerticalBound: k,
    isHorizontalBound: M,
    isBound: j,
    offset: _
  };
}
function er(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = Ma(f[1] - c[1]), p = Ma(f[0] - c[0]), v = l, g = s, x = -s / l;
  if (p) {
    if (!d) {
      if (i && !v)
        return {
          isBound: !1,
          offset: 0
        };
      if (g) {
        var E = (c[1] - u[1]) / x + u[0];
        return Ws(E, c[0], f[0], n, a);
      } else {
        var C = c[1] - u[1], w = H(C) <= (a || 0);
        return {
          isBound: w,
          offset: w ? C : 0
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
      return Ws(y, c[1], f[1], n, a);
    } else {
      var C = c[0] - u[0], w = H(C) <= (a || 0);
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
function Au(t, e, r) {
  return e.map(function(n) {
    var a = eh(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Fe({
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
function rh(t, e, r) {
  var n, a = Do(t, e, [0, 0], !1).map(function(d) {
    return P(P({}, d), { multiple: d.multiple.map(function(p) {
      return H(p) * 2;
    }) });
  }), i = Au(t, a, r), o = wa(i, 0), s = wa(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(kp({
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
function nh(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function Do(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = wr(i, 100, 100, o ? 4 : 3), l = re(s, [0, 0]);
  return nh(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], p = c[2], v = [
      re(s, d),
      re(s, p)
    ], g = Zp(v), x = ju(l, v), y = x.vertical, C = x.horizontal, w = Eo(l, v) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: y,
      horizontalSign: C,
      lineConstants: g,
      line: [
        re(e, d),
        re(e, p)
      ]
    };
  });
}
function Ys(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Dn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Eo(r, i) <= 0;
    return !zu(e, i, o);
  });
}
function ah(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return H(r[0]);
  if (!i)
    return H(r[1]);
  var o = i / a;
  return H((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function ih(t) {
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
function oh(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], p = l - n[1], v = l + c - n[1], g = [
    [f, p],
    [d, p],
    [f, v],
    [d, v]
  ], x = re(r, [0, 0]);
  if (!Ys(r, g, x, 0))
    return [];
  var y = [], C = g.map(function(w) {
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
    var E = $t([0, 0], ih(w)), k = ah(w);
    y.push.apply(y, Q([], N(C.filter(function(D) {
      var M = N(D, 1), T = M[0];
      return T && k <= T;
    }).map(function(D) {
      var M = N(D, 2), T = M[0], m = M[1], _ = Math.acos(T ? k / T : 0), j = m + _, O = m - _;
      return [
        o + j - E,
        o + O - E
      ];
    }).reduce(function(D, M) {
      return D.push.apply(D, Q([], N(M), !1)), D;
    }, []).filter(function(D) {
      return !Ys(e, g, x, D);
    }).map(function(D) {
      return St(D * 180 / Math.PI, ce);
    })), !1));
  }), y;
}
function sh(t) {
  var e = t.props.innerBounds, r = jr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = re(l, [0, 0]), c = e.left, f = e.top, d = e.width, p = e.height, v = [[c, f], [c, f + p]], g = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + p]], y = [[c, f + p], [c + d, f + p]], C = Do(t, l, [0, 0], !1), w = [], E = [];
  return C.forEach(function(k) {
    var D = k.line, M = k.lineConstants, T = ju(u, D), m = T.horizontal, _ = T.vertical, j = er(D, M, g, _, 1, !0), O = er(D, M, y, _, 1, !0), R = er(D, M, v, m, 1, !0), z = er(D, M, x, m, 1, !0);
    j.isBound && !r.top && (w.push(f), r.top = !0), O.isBound && !r.bottom && (w.push(f + p), r.bottom = !0), R.isBound && !r.left && (E.push(c), r.left = !0), z.isBound && !r.right && (E.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: E
  };
}
function lh(t, e, r, n) {
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
function Li(t, e, r, n, a) {
  var i = lh(t, e, r, n);
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
function Ea(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Fi(e).offset : 0;
}
function uh(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], p = f[1], v = N(a, 2), g = v[0], x = v[1], y = -g, C = -x;
  if (t && o && s) {
    y = 0, C = 0;
    var w = [];
    if (u && c ? w.push([0, x], [g, 0]) : u ? w.push([g, 0]) : c ? w.push([0, x]) : d && p ? w.push([0, x], [g, 0]) : d ? w.push([g, 0]) : p && w.push([0, x]), w.length) {
      w.sort(function(M, T) {
        return De(mt([o, s], M)) - De(mt([o, s], T));
      });
      var E = w[0];
      if (E[0] && H(o) > Qt)
        y = -E[0], C = s * H(o + y) / H(o) - s;
      else if (E[1] && H(s) > Qt) {
        var k = s;
        C = -E[1], y = o * H(s + C) / H(k) - o;
      }
      if (t && c && u)
        if (H(y) > Qt && H(y) < H(g)) {
          var D = H(g) / H(y);
          y *= D, C *= D;
        } else if (H(C) > Qt && H(C) < H(x)) {
          var D = H(x) / H(C);
          y *= D, C *= D;
        } else
          y = Yr(-g, y), C = Yr(-x, C);
    }
  } else
    y = o || u ? -g : 0, C = s || c ? -x : 0;
  return [y, C];
}
function ch(t, e, r, n, a, i) {
  if (!Kr(t, "draggable"))
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
  var o = _o(i.absolutePoses, [e, r]), s = we(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(z) {
      return z[1];
    }),
    vertical: o.map(function(z) {
      return z[0];
    })
  }, p = Co(t.props.snapDirections), v = wo(p, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), g = Ba(t, a, v, d), x = g.vertical, y = g.horizontal, C = rh(t, o, i), w = C.vertical, E = C.horizontal, k = x.isSnap, D = y.isSnap, M = x.isBound || w.isBound, T = y.isBound || E.isBound, m = Yr(x.offset, w.offset), _ = Yr(y.offset, E.offset), j = N(uh(n, [e, r], [M, T], [k, D], [m, _]), 2), O = j[0], R = j[1];
  return [
    {
      isBound: M,
      isSnap: k,
      offset: O
    },
    {
      isBound: T,
      isSnap: D,
      offset: R
    }
  ];
}
function Ba(t, e, r, n) {
  n === void 0 && (n = r);
  var a = So(za(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Aa(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Ea(i[0], l), f = Ea(o[0], u), d = H(c), p = H(f);
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
function Xs(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = So(e, r, n), l = s.horizontal, u = s.vertical, c = Ou(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, p = Ea(l[0], f), v = Ea(u[0], d), g = H(p), x = H(v);
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
      offset: v,
      dist: x,
      bounds: u,
      snap: d
    }
  };
}
function fh(t, e, r, n) {
  var a = $t(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, p = a % 180, v = p < 3 || p > 177, g = p > 87 && p < 93;
  return d < l && (o || s && !g && (!n || !v)) ? "vertical" : c || f && !v && (!n || !g) ? "horizontal" : "";
}
function dh(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = re(e, l), f = re(e, u), d = n ? ph(t, c, f, a) : Ba(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), p = d.horizontal, v = p.offset, g = p.isBound, x = p.isSnap, y = d.vertical, C = y.offset, w = y.isBound, E = y.isSnap, k = mt(u, l);
    if (!C && !v)
      return {
        isBound: w || g,
        isSnap: E || x,
        sign: k,
        offset: [0, 0]
      };
    var D = fh(c, f, d, n);
    if (!D)
      return {
        sign: k,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var M = D === "vertical", T = [0, 0];
    return !n && H(u[0]) === 1 && H(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? T = Fe({
      datas: i,
      distX: -C,
      distY: -v
    }) : T = Li(c, f, -(M ? C : v), M, i).offset, T = T.map(function(m, _) {
      return m * (k[_] ? 2 / k[_] : 0);
    }), {
      sign: k,
      isBound: M ? w : g,
      isSnap: M ? E : x,
      offset: T
    };
  });
}
function Hs(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function ph(t, e, r, n) {
  var a = Xp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Jp(t, e, r), l = s.horizontal, u = s.vertical, c = Hs(i, l), f = Hs(o, u), d = H(c), p = H(f);
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
function hh(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], p = u.left, v = p === void 0 ? -1 / 0 : p, g = u.top, x = g === void 0 ? -1 / 0 : g, y = u.right, C = y === void 0 ? 1 / 0 : y, w = u.bottom, E = w === void 0 ? 1 / 0 : w;
    d.forEach(function(k) {
      var D = k[0] !== i[0], M = k[1] !== i[1], T = re(e, k), m = $t(n, T) * 360 / Math.PI;
      if (M) {
        var _ = T.slice();
        (H(m - 360) < 2 || H(m - 180) < 2) && (_[1] = n[1]);
        var j = Li(n, _, (n[1] < T[1] ? E : x) - T[1], !1, a), O = N(j.offset, 2), R = O[1], z = j.isOutside;
        isNaN(R) || (f = l + (z ? 1 : -1) * H(R));
      }
      if (D) {
        var _ = T.slice();
        (H(m - 90) < 2 || H(m - 270) < 2) && (_[0] = n[0]);
        var A = Li(n, _, (n[0] < T[0] ? C : v) - T[0], !0, a), W = N(A.offset, 1), $ = W[0], F = A.isOutside;
        isNaN($) || (c = s + (F ? 1 : -1) * H($));
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
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Cr(t, e), ja(t, e, "translate"), Oh(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = Et(t, e, P({ set: function(c) {
      r.startValue = c;
    } }, Na(t, e))), u = n || ct(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Pa(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, p = r.isDrag, v = r.prevDist, g = r.prevBeforeDist, x = r.startValue;
      if (p) {
        o && (f += o[0], d += o[1]);
        var y = t.props, C = y.parentMoveable, w = u ? 0 : y.throttleDrag || c || 0, E = n ? 0 : y.throttleDragRotate || 0, k = 0, D = !1, M = !1, T = !1, m = !1;
        if (!n && E > 0 && (f || d)) {
          var _ = y.startDragRotate || 0, j = St(_ + $t([0, 0], [f, d]) * 180 / Math.PI, E) - _, O = d * Math.abs(Math.cos((j - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(j / 180 * Math.PI)), z = De([R, O]);
          k = j * Math.PI / 180, f = z * Math.cos(k), d = z * Math.sin(k);
        }
        if (!i && !n && !a) {
          var A = N(ch(t, f, d, E, !s && l || o, r), 2), W = A[0], $ = A[1];
          D = W.isSnap, M = W.isBound, T = $.isSnap, m = $.isBound;
          var F = W.offset, q = $.offset;
          f += F, d += q;
        }
        var V = It(xu({ datas: r, distX: f, distY: d }), x), L = It(Dp({ datas: r, distX: f, distY: d }), x);
        Ps(L, ce), Ps(V, ce), E || (!D && !M && (L[0] = St(L[0], w), V[0] = St(V[0], w)), !T && !m && (L[1] = St(L[1], w), V[1] = St(V[1], w)));
        var rt = mt(V, x), at = mt(L, x), Z = mt(at, v), nt = mt(rt, g);
        r.prevDist = at, r.prevBeforeDist = rt, r.passDelta = Z, r.passDist = at;
        var et = r.left + rt[0], ot = r.top + rt[1], it = r.right - rt[0], ft = r.bottom - rt[1], bt = Oa(r, "translate(".concat(L[0], "px, ").concat(L[1], "px)"), "translate(".concat(at[0], "px, ").concat(at[1], "px)"));
        if (yo(e, bt), t.state.dragInfo.dist = n ? [0, 0] : at, !(!n && !C && Z.every(function(ht) {
          return !ht;
        }) && nt.some(function(ht) {
          return !ht;
        }))) {
          var J = t.state, lt = J.width, wt = J.height, pt = Et(t, e, P({ transform: bt, dist: at, delta: Z, translate: L, beforeDist: rt, beforeDelta: nt, beforeTranslate: V, left: et, top: ot, right: it, bottom: ft, width: lt, height: wt, isPinch: i }, ue({
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
    var l = oi(t, this, "dragStart", [
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
      var n = this.drag(t, P(P({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = oi(t, this, "drag", a, e, !1, "draggable").eventParams;
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
      var a = oi(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
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
function Bu(t, e) {
  var r = re(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function vh(t, e) {
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
function Gu(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = Op(e, a, i), l = Ft(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var $s = Ro("resizable"), Wi = {
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
  render: ku("resizable"),
  dragControlCondition: $s,
  viewClassName: Io("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = Ju(o, a, n, l), d = t.state, p = d.target, v = d.width, g = d.height, x = d.gestos;
    if (!f || !p || x.resizable)
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
    function C(m) {
      l.ratio = m && isFinite(m) ? m : 0;
    }
    l.startPositions = ke(t.state);
    function w(m) {
      var _ = Bu(l.startPositions, m);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function E(m) {
      var _ = Gu(t.state, m);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function k(m) {
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
      (!bn(_[0]) || isFinite(_[0])) && (_[0] = Nt("".concat(_[0]), 0) || 1 / 0), (!bn(_[1]) || isFinite(_[1])) && (_[1] = Nt("".concat(_[1]), 0) || 1 / 0), l.maxSize = _;
    }
    C(v / g), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = E, l.setMin = k, l.setMax = D;
    var M = Et(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(m) {
        var _ = N(m, 2), j = _[0], O = _[1];
        l.startWidth = j, l.startHeight = O;
      },
      setMin: k,
      setMax: D,
      setRatio: C,
      setFixedDirection: w,
      setFixedPosition: E,
      setOrigin: function(m) {
        l.transformOrigin = m;
      },
      dragStart: se.dragStart(t, new Lr().dragStart([0, 0], e))
    }), T = c || ct(t, "onResizeStart", M);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, T !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? M : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, p = e.resolveMatrix, v = n.isResize, g = n.transformOrigin, x = n.startWidth, y = n.startHeight, C = n.prevWidth, w = n.prevHeight, E = n.minSize, k = n.maxSize, D = n.ratio, M = n.startOffsetWidth, T = n.startOffsetHeight, m = n.isWidth;
    if (!v)
      return;
    if (p) {
      var _ = t.state.is3d, j = n.startOffsetMatrix, O = n.startTransformOrigin, R = _ ? 4 : 3, z = Gr(Sa(e)), A = Math.sqrt(z.length);
      R !== A && (z = Oe(z, A, R));
      var W = Rn(j, z, O, R), $ = wr(W, M, T, R);
      n.startPositions = $, n.nextTargetMatrix = z, n.nextAllMatrix = W;
    }
    var F = Sr(t.props, "resizable"), q = F.resizeFormat, V = F.throttleResize, L = V === void 0 ? a ? 0 : 1 : V, rt = F.parentMoveable, at = F.keepRatioFinally, Z = n.direction, nt = Z, et = 0, ot = 0;
    !Z[0] && !Z[1] && (nt = [1, 1]);
    var it = D && (o ?? F.keepRatio) || !1;
    function ft() {
      var Rt = n.fixedDirection, Gt = ac(nt, it, n, e);
      et = Gt.distWidth, ot = Gt.distHeight;
      var ve = nt[0] - Rt[0] || it ? Math.max(M + et, ce) : M, Ne = nt[1] - Rt[1] || it ? Math.max(T + ot, ce) : T;
      return it && M && T && (m ? Ne = ve / D : ve = Ne * D), [ve, Ne];
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
    s || (!a && i ? wt = Ap(t, [0, 0]) : wt = n.fixedPosition);
    var pt = [0, 0];
    i || (pt = Rh(t, J, lt, Z, wt, !u && c, n)), l && (!l[0] && (pt[0] = 0), !l[1] && (pt[1] = 0));
    function ht() {
      var Rt;
      q && (Rt = N(q([J, lt]), 2), J = Rt[0], lt = Rt[1]), J = St(J, L), lt = St(lt, L);
    }
    if (it) {
      nt[0] && nt[1] && pt[0] && pt[1] && (H(pt[0]) > H(pt[1]) ? pt[1] = 0 : pt[0] = 0);
      var yt = !pt[0] && !pt[1];
      yt && ht(), nt[0] && !nt[1] || pt[0] && !pt[1] || yt && m ? (J += pt[0], lt = J / D) : (!nt[0] && nt[1] || !pt[0] && pt[1] || yt && !m) && (lt += pt[1], J = lt * D);
    } else
      J += pt[0], lt += pt[1], J = Math.max(0, J), lt = Math.max(0, lt);
    r = N(so([J, lt], E, k, it ? D : !1), 2), J = r[0], lt = r[1], ht(), it && (f || at) && (m ? lt = J / D : J = lt * D), et = J - M, ot = lt - T;
    var Tt = [et - C, ot - w];
    n.prevWidth = et, n.prevHeight = ot;
    var xt = zp(t, J, lt, wt, g, n);
    if (!(!rt && Tt.every(function(Rt) {
      return !Rt;
    }) && xt.every(function(Rt) {
      return !Rt;
    }))) {
      var vt = se.drag(t, In(e, t.state, xt, !!i, !1, "draggable")), Mt = vt.transform, At = x + et, qt = y + ot, Lt = Et(t, e, P({ width: At, height: qt, offsetWidth: Math.round(J), offsetHeight: Math.round(lt), startRatio: D, boundingWidth: J, boundingHeight: lt, direction: Z, dist: [et, ot], delta: Tt, isPinch: !!i, drag: vt }, tc({
        style: {
          width: "".concat(At, "px"),
          height: "".concat(qt, "px")
        },
        transform: Mt
      }, vt, e)));
      return !d && ct(t, "onResize", Lt), Lt;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), p = H(f) > 3, v = H(d) > 3;
      if (p && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), v && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), p || v)
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
  dragGroupControlCondition: $s,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, P(P({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Re(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var p = r.minSize;
      a.forEach(function(v) {
        var g = v.datas, x = g.minSize, y = g.startOffsetWidth, C = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (C ? x[1] / C : 0);
        p[0] = Math.max(p[0], w), p[1] = Math.max(p[1], E);
      });
    }
    function l() {
      var p = r.maxSize;
      a.forEach(function(v) {
        var g = v.datas, x = g.maxSize, y = g.startOffsetWidth, C = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (C ? x[1] / C : 0);
        p[0] = Math.min(p[0], w), p[1] = Math.min(p[1], E);
      });
    }
    var u = $e(t, this, "dragControlStart", e, function(p, v) {
      return Ca(t, p, r, v);
    });
    s(), l();
    var c = function(p) {
      n.setFixedDirection(p), u.forEach(function(v, g) {
        v.setFixedDirection(p), Ca(t, v.moveable, r, a[g]);
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
    } }), d = ct(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = Sr(t.props, "resizable");
      Fa(t, "onBeforeResize", function(p) {
        ct(t, "onBeforeResizeGroup", Et(t, e, P(P({}, p), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, P(P({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = $e(t, this, "dragControl", e, function(p, v) {
          var g = N(oe(kn(t.rotation / 180 * Math.PI, 3), [
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
function si(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Ft(
    t.state.rootMatrix,
    // TO-DO #710
    mt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = It([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = $t(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Be(c, [r, n]);
}
function ha(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function li(t, e, r, n) {
  return ha($t(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function ui(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = Ih(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = St(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function Fu(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Ht(t))
    return t.map(function(x) {
      return Fu(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], p = Ku(f, r);
  if (c) {
    var v = c === "top" || c === "left", g = u === "bottom" || u === "left";
    d = f[v && !g || !v && g ? 0 : 1];
  }
  return [[d, p]];
}
function Yi(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (te(r, gt("rotation-control")) || t.props.rotateAroundControls && te(r, gt("around-control")) || te(r, gt("control")) && te(r, gt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Po(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var gh = `.rotation {
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
`, mh = {
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
  css: [gh],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? gt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = Sr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = Fu(a, c, f), p = [];
    if (d.forEach(function(y, C) {
      var w = N(y, 2), E = w[0], k = w[1];
      p.push(e.createElement(
        "div",
        { key: "rotation".concat(C), className: gt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(E[0], "px, ").concat(E[1], "px) rotate(").concat(k, "rad)")
        } },
        e.createElement("div", { className: gt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: gt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var v = qr(l || {}), g = {};
      v.forEach(function(y) {
        l[y].forEach(function(C) {
          g[C] = y;
        });
      });
      var x = [];
      Ht(o) && (x = o.map(function(y) {
        var C = g[y];
        return {
          data: C ? { resolve: C } : {},
          classNames: C ? ["move"] : [],
          dir: y
        };
      })), p.push.apply(p, Q([], N(wu(t, "rotatable", x, e)), !1));
    }
    return s && p.push.apply(p, Q([], N(_u(t, e)), !1)), p;
  },
  dragControlCondition: Yi,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, p = f.left, v = f.top, g = f.direction, x = f.beforeDirection, y = f.targetTransform, C = f.moveableClientRect, w = f.offsetMatrix, E = f.targetMatrix, k = f.allMatrix, D = f.width, M = f.height;
    if (!c && !d)
      return !1;
    var T = t.getRect();
    a.rect = T, a.transform = y, a.left = p, a.top = v;
    var m = function(nt) {
      var et = Gu(t.state, nt);
      a.fixedDirection = et.fixedDirection, a.fixedOffset = et.fixedOffset, a.fixedPosition = et.fixedPosition, L && L.setFixedPosition(nt);
    }, _ = function(nt) {
      var et = vh(t.state, nt);
      a.fixedDirection = et.fixedDirection, a.fixedOffset = et.fixedOffset, a.fixedPosition = et.fixedPosition, L && L.setFixedDirection(nt);
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
      var z = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (z) {
        var A = z.getAttribute("data-direction") || "", W = Cp[A];
        if (W) {
          a.isControl = !0, a.isAroundControl = te(z, gt("around-control")), a.controlDirection = W;
          var $ = z.getAttribute("data-resolve");
          $ && (a.resolveAble = $);
          var F = $h(f.rootMatrix, f.renderPoses, C);
          r = N(re(F, W), 2), j = r[0], O = r[1];
        }
      }
      a.beforeInfo = { origin: T.beforeOrigin }, a.afterInfo = { origin: T.origin }, a.absoluteInfo = {
        origin: T.origin,
        startValue: T.rotation
      };
      var q = m;
      m = function(nt) {
        var et = f.is3d ? 4 : 3, ot = N(It(eu(E, et), nt), 2), it = ot[0], ft = ot[1], bt = oe(w, xr([it, ft], et)), J = oe(k, xr([nt[0], nt[1]], et));
        q(nt);
        var lt = f.posDelta;
        a.beforeInfo.origin = mt(bt, lt), a.afterInfo.origin = mt(J, lt), a.absoluteInfo.origin = mt(J, lt), si(t, a.beforeInfo, j, O, C), si(t, a.afterInfo, j, O, C), si(t, a.absoluteInfo, j, O, C);
      }, _ = function(nt) {
        var et = re([
          [0, 0],
          [D, 0],
          [0, M],
          [D, M]
        ], nt);
        m(et);
      };
    }
    a.startClientX = j, a.startClientY = O, a.direction = g, a.beforeDirection = x, a.startValue = 0, a.datas = {}, ja(t, e, "rotate");
    var V = !1, L = !1;
    if (a.isControl && a.resolveAble) {
      var rt = a.resolveAble;
      rt === "resizable" && (L = Wi.dragControlStart(t, P(P({}, new Lr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    L || (V = se.dragStart(t, new Lr().dragStart([0, 0], e))), m(qh(t));
    var at = Et(t, e, P(P({ set: function(nt) {
      a.startValue = nt * Math.PI / 180;
    }, setFixedDirection: _, setFixedPosition: m }, Na(t, e)), { dragStart: V, resizeStart: L })), Z = ct(t, "onRotateStart", at);
    return a.isRotate = Z !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? at : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, p = i.beforeDirection, v = i.beforeInfo, g = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, C = i.startValue, w = i.rect, E = i.startClientX, k = i.startClientY;
    if (y) {
      Pa(t, e, "rotate");
      var D = Ep(e), M = p * D, T = t.props.parentMoveable, m = 0, _, j, O = 0, R, z, A = 0, W, $, F = 180 / Math.PI * C, q = x.startValue, V = !1, L = E + o, rt = k + s;
      if (!u && "parentDist" in e) {
        var at = e.parentDist;
        _ = at, R = at, W = at;
      } else c || u ? (_ = ha(l, p, v), R = ha(l, M, g), W = ha(l, M, x)) : (_ = li(L, rt, p, v), R = li(L, rt, M, g), W = li(L, rt, M, x), V = !0);
      if (j = F + _, z = F + R, $ = q + W, ct(t, "onBeforeRotate", Et(t, e, {
        beforeRotation: j,
        rotation: z,
        absoluteRotation: $,
        setRotation: function(wt) {
          R = wt - F, _ = R, W = R;
        }
      }, !0)), r = N(ui(t, w, v, _, F, V), 3), m = r[0], _ = r[1], j = r[2], n = N(ui(t, w, g, R, F, V), 3), O = n[0], R = n[1], z = n[2], a = N(ui(t, w, x, W, q, V), 3), A = a[0], W = a[1], $ = a[2], !(!A && !O && !m && !T && !d)) {
        var Z = Oa(i, "rotate(".concat(z, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = bo(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var nt = jp(t, R, i), et = mt(It(f || [0, 0], nt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = nt, i.requestValue = null;
        var ot = bu(t, Z, et, c, e), it = ot, ft = Be([L, rt], x.startAbsoluteOrigin) - x.startDist, bt = void 0;
        if (i.resolveAble === "resizable") {
          var J = Wi.dragControl(t, P(P({}, In(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: ft }));
          J && (bt = J, it = tc(it, J, e));
        }
        var lt = Et(t, e, P(P({ delta: O, dist: R, rotate: z, rotation: z, beforeDist: _, beforeDelta: m, beforeRotate: j, beforeRotation: j, absoluteDist: W, absoluteDelta: A, absoluteRotate: $, absoluteRotation: $, isPinch: !!c, resize: bt }, ot), it));
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
  dragGroupControlCondition: Yi,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = $e(t, this, "dragControlStart", e, function(f, d) {
      var p = f.state, v = p.left, g = p.top, x = p.beforeOrigin, y = It(mt([v, g], [a, i]), mt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, P(P({}, d), { parentRotate: 0 });
    }), u = P(P({}, s), { targets: t.props.targets, events: l }), c = ct(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Fa(t, "onBeforeRotate", function(u) {
        ct(t, "onBeforeRotateGroup", Et(t, e, P(P({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = $e(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), p = d[0], v = d[1], g = N(Dn(f, o * a), 2), x = g[0], y = g[1], C = [x - p, y - v];
          return c.datas.groupClient = [x, y], P(P({}, c), { parentRotate: i, groupDelta: C });
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
function xh(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function ko(t, e) {
  return xh(P(P({}, t), { classNames: Q([
    gt("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(St(r, 0.1), "px");
  }) }), e);
}
function qs(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, p = [0, 0];
    return p[o] = n, p[o ? 0 : 1] = -a + d, ko({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [gt("target", "bold", f)],
      posValue: p,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Vs(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? ar : ir, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var p = d.hide, v = d.elementRect;
    if (p)
      return !1;
    if (l && v) {
      var g = v.rect;
      if (g[u.start] <= c && f <= g[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, p) {
    var v = d.pos, g = d.size, x = d.element, y = d.className, C = [
      -n[0] + v[0],
      -n[1] + v[1]
    ];
    return ko({
      key: "".concat(e, "-default-guideline-").concat(p),
      classNames: x ? [gt("bold"), y] : [gt("normal"), y],
      direction: e,
      posValue: C,
      sizeValue: g,
      zoom: s
    }, i);
  });
}
function un(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, p = d === void 0 ? !0 : d, v = u.snapDistFormat, g = v === void 0 ? function(k, D) {
    return k;
  } : v, x = u.zoom, y = e === "horizontal" ? "X" : "Y", C = e === "vertical" ? "height" : "width", w = Math.abs(a), E = p ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: gt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[C] = "".concat(w, "px"), l) },
    ko({
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
function yh(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? ar : ir, s = r[o.start], l = r[o.end];
  return ec(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(p) {
      var v, g, x = p.element, y = p.elementRect.rect;
      if (y[o.end] < s)
        c.push(p);
      else if (l < y[o.start])
        f.push(p);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var C = p.pos, w = { element: x, rect: P(P({}, y), (v = {}, v[o.end] = y[o.start], v)) }, E = { element: x, rect: P(P({}, y), (g = {}, g[o.start] = y[o.end], g)) }, k = [0, 0], D = [0, 0];
        k[a] = C[a], k[i] = C[i], D[a] = C[a], D[i] = C[i] + p.size, c.push({
          type: t,
          pos: k,
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
function bh(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = yh(s, l, n, i), d = u ? ir : ar, p = u ? ar : ir, v = n[d.start], g = n[d.end];
    f.forEach(function(x) {
      var y = x.total, C = x.start, w = x.end, E = x.inner, k = r[c] + y[0].pos[c] - n[p.start], D = n;
      C.forEach(function(M) {
        var T = M.elementRect.rect, m = D[d.start] - T[d.end];
        if (m > 0) {
          var _ = [0, 0];
          _[u] = r[u] + D[d.start] - v - m, _[c] = k, o.push(un(t, s, "dashed", o.length, m, _, M.className, a));
        }
        D = T;
      }), D = n, w.forEach(function(M) {
        var T = M.elementRect.rect, m = T[d.start] - D[d.end];
        if (m > 0) {
          var _ = [0, 0];
          _[u] = r[u] + D[d.end] - v, _[c] = k, o.push(un(t, s, "dashed", o.length, m, _, M.className, a));
        }
        D = T;
      }), E.forEach(function(M) {
        var T = M.elementRect.rect, m = v - T[d.start], _ = T[d.end] - g, j = [0, 0], O = [0, 0];
        j[u] = r[u] - m, j[c] = k, O[u] = r[u] + g - v, O[c] = k, o.push(un(t, s, "dashed", o.length, m, j, M.className, a)), o.push(un(t, s, "dashed", o.length, _, O, M.className, a));
      });
    });
  }), o;
}
function Sh(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? ir : ar, f = l ? ar : ir, d = n[c.start], p = n[c.end], v = n[f.start], g = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, C = x.gapRects, w = Math.max.apply(Math, Q([v], N(C.map(function(D) {
        var M = D.rect;
        return M[f.start];
      })), !1)), E = Math.min.apply(Math, Q([g], N(C.map(function(D) {
        var M = D.rect;
        return M[f.end];
      })), !1)), k = (w + E) / 2;
      w === E || k === (v + g) / 2 || C.forEach(function(D) {
        var M = D.rect, T = D.className, m = [r[0], r[1]];
        if (M[c.end] < d)
          m[l] += M[c.end] - d;
        else if (p < M[c.start])
          m[l] += M[c.start] - d - y;
        else
          return;
        m[u] += k - v, i.push(un(t, l ? "vertical" : "horizontal", "gap", i.length, y, m, T, a));
      });
    });
  }), i;
}
function Xi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, p = t.props, v = p.snapGap, g = v === void 0 ? !0 : v, x = p.verticalGuidelines, y = p.horizontalGuidelines, C = p.snapThreshold, w = C === void 0 ? 5 : C, E = p.maxSnapElementGuidelineDistance, k = E === void 0 ? 1 / 0 : E, D = p.isDisplayGridGuidelines, M = we(ke(t.state)), T = M.top, m = M.left, _ = M.bottom, j = M.right, O = { top: T, left: m, bottom: _, right: j, center: (m + j) / 2, middle: (T + _) / 2 }, R = Dh(t), z = Q([], N(R), !1), A = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(q) {
    return q * w;
  });
  g && z.push.apply(z, Q([], N(Ch(t, O, A)), !1));
  var W = P({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (z.push.apply(z, Q([], N(Eh(t, o ? l : c, o ? s : u, f, d, W, D)), !1)), i) {
    var $ = a.left, F = a.top;
    W.left += $, W.top += F, W.right += $, W.bottom += F;
  }
  return z.push.apply(z, Q([], N(Wu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), z = z.filter(function(q) {
    var V = q.element, L = q.elementRect, rt = q.type;
    if (!V || !L)
      return !0;
    var at = L.rect;
    return Lu(O, at, rt, k);
  }), z;
}
function Ch(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", ar, ir],
    ["horizontal", ir, ar]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], p = f[1], v = f[2], g = e[p.start], x = e[p.end], y = e[p.center], C = e[v.start], w = e[v.end], E = {
      left: r[0],
      top: r[1]
    };
    function k(T) {
      var m = T.rect, _ = E[p.start];
      return m[p.end] < g + _ ? g - m[p.end] : x - _ < m[p.start] ? m[p.start] - x : -1;
    }
    var D = l.filter(function(T) {
      var m = T.rect;
      return m[v.start] > w || m[v.end] < C ? !1 : k(T) > 0;
    }).sort(function(T, m) {
      return k(T) - k(m);
    }), M = [];
    D.forEach(function(T) {
      D.forEach(function(m) {
        if (T !== m) {
          var _ = T.rect, j = m.rect, O = _[v.start], R = _[v.end], z = j[v.start], A = j[v.end];
          O > A || z > R || M.push([T, m]);
        }
      });
    }), M.forEach(function(T) {
      var m = N(T, 2), _ = m[0], j = m[1], O = _.rect, R = j.rect, z = O[p.start], A = O[p.end], W = R[p.start], $ = R[p.end], F = E[p.start], q = 0, V = 0, L = !1, rt = !1, at = !1;
      if (A <= g && x <= W) {
        if (rt = !0, q = (W - A - (x - g)) / 2, V = A + q + (x - g) / 2, H(V - y) > F)
          return;
      } else if (A < W && $ < g + F) {
        if (L = !0, q = W - A, V = $ + q, H(V - g) > F)
          return;
      } else if (A < W && x - F < z) {
        if (at = !0, q = W - A, V = z - q, H(V - x) > F)
          return;
      } else
        return;
      q && Lu(e, R, d, i) && (q > s || u.push({
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
function wh(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, p = s.snapRenderInfo, v = p && (((a = p.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = p.direction) === null || i === void 0 ? void 0 : i[1])), g = t.moveables;
  if (l && g && v && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, C = p.direction;
    if (y) {
      var w = C.map(function(k, D) {
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
        }, T = M.snapSize, m = M.posName, _ = M.sizeName, j = M.clientOffset;
        if (!T)
          return {
            dir: k,
            multiple: 1,
            snapSize: T,
            snapOffset: 0
          };
        var O = x[_], R = x[m], z = Cd(y.map(function(L) {
          return [
            L[m] - R,
            L[_],
            O - L[_] - L[m] + R
          ];
        })).filter(function(L) {
          return L;
        }).sort(function(L, rt) {
          return L - rt;
        }), A = z[0], W = z.map(function(L) {
          return St(L / A, 0.1) * T;
        }), $ = 1, F = St(O / A, 0.1);
        for ($ = 1; $ <= 10 && !W.every(function(L) {
          return L * $ % 1 === 0;
        }); ++$)
          ;
        var q = (-k + 1) / 2, V = ga(R - j, R - j + O, q, 1 - q);
        return {
          multiple: F * $,
          dir: k,
          snapSize: T,
          snapOffset: Math.round(V / T)
        };
      }), E = w.map(function(k) {
        return k.multiple || 1;
      });
      s.snapThresholdInfo.multiples = E, s.snapThresholdInfo.offset = w.map(function(k) {
        return k.snapOffset;
      }), w.forEach(function(k, D) {
        k.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function Eh(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, p = [], v = i.left, g = i.top, x = [0, 0];
  wh(t, n, a, i);
  var y = l.snapThresholdInfo, C = c, w = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var E = function(D) {
      p.push({
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
    }, k = 0; k <= r * 2; k += d)
      E(k);
    for (var k = -d; k >= -r; k -= d)
      E(k);
  }
  if (c) {
    for (var E = function(M) {
      p.push({
        type: "vertical",
        pos: [
          St(x[0] * C + M - n + v, 0.1),
          g
        ],
        className: gt("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, k = 0; k <= e * 2; k += c)
      E(k);
    for (var k = -c; k >= -e; k -= c)
      E(k);
  }
  return p;
}
function Lu(t, e, r, n) {
  return r === "horizontal" ? H(t.right - e.left) <= n || H(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? H(t.bottom - e.top) <= n || H(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function Dh(t) {
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
    var p = N(d, 2), v = p[0], g = p[1];
    u[g] = a[v];
  }), kh(t, l.map(function(d) {
    return i[d];
  })).map(function(d, p) {
    u[l[p]] = d;
  }), e.elementRects = u;
  var c = Co(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var p = d.element, v = d.top, g = v === void 0 ? c.top : v, x = d.left, y = x === void 0 ? c.left : x, C = d.right, w = C === void 0 ? c.right : C, E = d.bottom, k = E === void 0 ? c.bottom : E, D = d.center, M = D === void 0 ? c.center : D, T = d.middle, m = T === void 0 ? c.middle : T, _ = d.className, j = d.rect, O = wo({
      top: g,
      right: w,
      left: y,
      bottom: k,
      center: M,
      middle: m
    }, j), R = O.horizontal, z = O.vertical, A = O.horizontalNames, W = O.verticalNames, $ = j.top, F = j.left, q = j.right - F, V = j.bottom - $, L = [q, V];
    z.forEach(function(rt, at) {
      f.push({
        type: "vertical",
        element: p,
        pos: [
          St(rt, 0.1),
          $
        ],
        size: V,
        sizes: L,
        className: _,
        elementRect: d,
        elementDirection: Gs[W[at]] || W[at],
        direction: ""
      });
    }), R.forEach(function(rt, at) {
      f.push({
        type: "horizontal",
        element: p,
        pos: [
          F,
          St(rt, 0.1)
        ],
        size: q,
        sizes: L,
        className: _,
        elementRect: d,
        elementDirection: Gs[A[at]] || A[at],
        direction: ""
      });
    });
  }), f;
}
function Us(t, e) {
  return t ? t.map(function(r) {
    var n = me(r) ? r : { pos: r }, a = n.pos;
    return bn(a) ? n : P(P({}, n), { pos: Nt(a, e) });
  }) : [];
}
function Wu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, p = n + c - u;
  return Us(t, p).forEach(function(v) {
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
  }), Us(e, d).forEach(function(v) {
    s.push({
      type: "vertical",
      pos: [
        St(v.pos - a + l, 0.1),
        u
      ],
      size: p,
      className: v.className,
      direction: ""
    });
  }), s;
}
function kh(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(Kp(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], p = r ? 0 : s[1];
  return e.map(function(v) {
    var g = v.element.getBoundingClientRect(), x = g.left - c - d, y = g.top - f - p, C = y + g.height, w = x + g.width, E = N(Xr(i, [x, y], l), 2), k = E[0], D = E[1], M = N(Xr(i, [w, C], l), 2), T = M[0], m = M[1];
    return P(P({}, v), { rect: {
      left: k,
      right: T,
      top: D,
      bottom: m,
      center: (k + T) / 2,
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
      var s = gn(o), l = el(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = el(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = St(l[0], 1e-5), i.top = St(l[1], 1e-5), i.right = St(u[0], 1e-5), i.bottom = St(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Xi(t), e.enableSnap = !0, !0;
}
function Yu(t, e, r, n, a, i) {
  var o = wr(t, e, r, i ? 4 : 3), s = re(o, n);
  return _o(o, mt(a, s));
}
function Ks(t) {
  return t ? t / H(t) : 0;
}
function Mh(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = th(r, o, n), l = Do(t, e, r, n), u = Q(Q([], N(dh(t, e, s, n, a, i)), !1), N(Au(t, l, i)), !1), c = wa(u, 0), f = wa(u, 1);
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
function _h(t, e, r, n, a, i, o, s, l) {
  var u = re(e, o), c = Ba(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (St(d, Ai) || St(f, Ai)) {
    var p = N(Fe({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), v = p[0], g = p[1], x = Math.min(a || 1 / 0, r + o[0] * v), y = Math.min(i || 1 / 0, n + o[1] * g);
    return [x - r, y - n];
  }
  return [0, 0];
}
function Xu(t, e, r, n, a, i, o, s) {
  for (var l = ke(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var p = e(c, f), v = Mh(t, p, a, u, o, s), g = v.width, x = v.height, y = g.isBound, C = x.isBound, w = g.offset, E = x.offset;
    if (d === 1 && (y || (w = 0), C || (E = 0)), d === 0 && o && !y && !C)
      return [0, 0];
    if (u) {
      var k = H(w) * (r ? 1 / r : 1), D = H(E) * (n ? 1 / n : 1), M = y && C ? k < D : C || !y && k < D;
      M ? w = r * E / n : E = n * w / r;
    }
    c += w, f += E;
  }
  if (!u && a[0] && a[1]) {
    var T = hh(t, l, a, i, s), m = T.maxWidth, _ = T.maxHeight, j = N(_h(t, e(c, f).map(function(z) {
      return z.map(function(A) {
        return St(A, Ai);
      });
    }), r + c, n + f, m, _, a, o, s), 2), w = j[0], E = j[1];
    c += w, f += E;
  }
  return [c, f];
}
function hn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function Th(t, e) {
  e = hn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return H(t - n) < H(t - a) ? n : a;
}
function ci(t, e) {
  t = hn(t), e = hn(e);
  var r = hn(t - e);
  return Math.min(r, 360 - r);
}
function Ih(t, e, r, n) {
  var a, i = t.props, o = (a = i[Tu]) !== null && a !== void 0 ? a : 5, s = i[Iu];
  if (Kr(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, p = r * Math.PI / 180, v = [l, u, c, f].map(function(E) {
      return mt(E, d);
    }), g = v.map(function(E) {
      return Dn(E, p);
    }), x = Q(Q([], N($p(t, v, g, d, r)), !1), N(oh(t, v, g, d, r)), !1);
    x.sort(function(E, k) {
      return H(E - r) - H(k - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var C = s.slice().sort(function(E, k) {
      return ci(E, n) - ci(k, n);
    }), w = C[0];
    if (ci(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + Th(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function Rh(t, e, r, n, a, i, o) {
  if (!Kr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return Xu(t, function(d, p) {
    return Yu(l || c, e + d, r + p, s, a, f);
  }, e, r, n, a, i, o);
}
function Ph(t, e, r, n, a) {
  if (!Kr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = Xu(t, function(f, d) {
    return Yu(Rp(a, It(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function Oh(t, e) {
  e.absolutePoses = ke(t.state);
}
function Zs(t) {
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
function Js(t, e, r, n, a, i) {
  var o = So(za(t, i), e, r), s = o.vertical, l = o.horizontal, u = jr();
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
  var c = sh(t), f = c.boundMap, d = c.vertical, p = c.horizontal;
  return d.forEach(function(v) {
    qe(n, function(g) {
      var x = g.type, y = g.pos;
      return x === "bounds" && y === v;
    }) >= 0 || n.push({
      type: "bounds",
      pos: v
    });
  }), p.forEach(function(v) {
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
var Nh = Ro("", ["resizable", "scalable"]), jh = {
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
    Tu,
    Iu,
    Ru,
    Pu,
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
    if (!u || !u.render || !Kr(t, ""))
      return Ar(t, "boundMap", jr(), function(Z) {
        return JSON.stringify(Z);
      }), Ar(t, "innerBoundMap", jr(), function(Z) {
        return JSON.stringify(Z);
      }), [];
    r.guidelines = Xi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), p = Math.min(i[1], o[1], s[1], l[1]), v = u.externalPoses || [], g = ke(t.state), x = [], y = [], C = [], w = [], E = [], k = we(g), D = k.width, M = k.height, T = k.top, m = k.left, _ = k.bottom, j = k.right, O = { left: m, right: j, top: T, bottom: _, center: (m + j) / 2, middle: (T + _) / 2 }, R = v.length > 0, z = R ? we(v) : {};
    if (!u.request) {
      if (u.direction && E.push(Qp(t, g, u.direction, f, f)), u.snap) {
        var A = we(g);
        u.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), E.push(Fs(t, A, f, f));
      }
      R && (u.center && (z.middle = (z.top + z.bottom) / 2, z.center = (z.left + z.right) / 2), E.push(Fs(t, z, f, f))), E.forEach(function(Z) {
        var nt = Z.vertical.posInfos, et = Z.horizontal.posInfos;
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
        })), !1)), y.push.apply(y, Q([], N(et.filter(function(ot) {
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
        })), !1)), C.push.apply(C, Q([], N(Zs(nt)), !1)), w.push.apply(w, Q([], N(Zs(et)), !1));
      });
    }
    var W = Js(t, [m, j], [T, _], x, y), $ = W.boundMap, F = W.innerBoundMap;
    R && Js(t, [z.left, z.right], [z.top, z.bottom], x, y, u.externalBounds);
    var q = Q(Q([], N(C), !1), N(w), !1), V = q.filter(function(Z) {
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
    var rt = Ar(t, "boundMap", $, function(Z) {
      return JSON.stringify(Z);
    }, jr()), at = Ar(t, "innerBoundMap", F, function(Z) {
      return JSON.stringify(Z);
    }, jr());
    return ($ === rt || F === at) && ct(t, "onBound", {
      bounds: $,
      innerBounds: F
    }, !0), Q(Q(Q(Q(Q(Q([], N(bh(t, V, [d, p], O, e)), !1), N(Sh(t, L, [d, p], O, e)), !1), N(Vs(t, "horizontal", w, [a, n], O, e)), !1), N(Vs(t, "vertical", C, [a, n], O, e)), !1), N(qs(t, "horizontal", y, d, n, D, 0, e)), !1), N(qs(t, "vertical", x, p, a, M, 1, e)), !1);
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
    ea(t) || (e.guidelines = Xi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (Nh(t, e) || Yi(t, e))
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
function zh(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function gt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return id.apply(void 0, Q([mo], N(t), !1));
}
function Hu(t) {
  t();
}
function Ah(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : me(t) ? t : Gr(t);
}
function vn(t, e, r) {
  return xa(e, yr(r, e), t, yr(r.map(function(n) {
    return -n;
  }), e));
}
function Bh(t, e, r) {
  if (e === "%") {
    var n = Mo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function Gh(t) {
  var e = Fh(To(t, ":before"));
  return e.map(function(r, n) {
    var a = mr(r), i = a.value, o = a.unit;
    return i * Bh(t, o, n === 0);
  });
}
function Da(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function Fh(t) {
  return Da(t.transformOrigin);
}
function $u(t) {
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
function En(t, e, r, n, a) {
  var i, o, s = uo(t) || or(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var p = !1, v = t === e || u === e, g = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, C = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (v = !0);
    var w = he(u), E = u.tagName.toLowerCase(), k = $u(u), D = w("willChange"), M = parseFloat(w("zoom")) || 1;
    if (g = w("position"), n && M !== 1) {
      x = M;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && C && C !== "absolute" || E === "svg" || E === "foreignobject" || g !== "static" || k && k !== "none" || D === "transform"
    )
      break;
    var T = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, m = u.parentNode;
    T && (l = !0, c = m);
    var _ = m;
    if (_ && _.nodeType === 11) {
      u = _.host, p = !0, g = he(u)("position");
      break;
    }
    u = _, g = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: p,
    isStatic: g === "static",
    isEnd: v || !u || u === s,
    offsetParent: u || s
  };
}
function Lh(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = he(t), s = ao(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = du ? Gh(t) : Da(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(Xh(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = Da(o("transformOrigin")).map(function(f) {
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
function qu(t, e) {
  var r = he(t), n = he(or(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function Hi(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Oe(r, 3, 4));
  });
}
function Wh(t) {
  for (var e = t.parentElement, r = !1, n = or(t); e; ) {
    var a = To(e).transform;
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
function Ga(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(ru(t, !e).join(","), ")");
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
function Yh(t, e) {
  var r, n = Mo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, p = [0, 0], v = [l, u], g = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    p[0] = a * x / 2, p[1] = i * y / 2;
    var C = d === 2 ? Math.max(u, l) : Math.min(l, u);
    v[0] = C, v[1] = C, g[0] = (o - a) / 2 * x, g[1] = (s - i) / 2 * y;
  }
  var w = co(v, e);
  return r = N(g, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], vn(w, e, p);
}
function Xh(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = he(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Mo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, p = i ? e[1] : e[1] - f;
  return [c, f, d, p];
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
function Qs(t, e, r, n) {
  var a = wr(t, e, r, n);
  return we(a);
}
function Hh(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Uu(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), p = [0, 0];
  r === or(r) && (p = qu(o, !0));
  for (var v = o.getBoundingClientRect(), g = v.left - d.left + r.scrollLeft - (r.clientLeft || 0) + p[0], x = v.top - d.top + r.scrollTop - (r.clientTop || 0) + p[1], y = v.width, C = v.height, w = xa(n, a, l), E = Qs(w, c, f, n), k = E.left, D = E.top, M = E.width, T = E.height, m = Ft(w, s, n), _ = mt(m, [k, D]), j = [
    g + _[0] * y / M,
    x + _[1] * C / T
  ], O = [0, 0], R = 0; ++R < 10; ) {
    var z = Pe(a, n);
    i = N(mt(Ft(z, j, n), Ft(z, m, n)), 2), O[0] = i[0], O[1] = i[1];
    var A = xa(n, a, yr(O, n), l), W = Qs(A, c, f, n), $ = W.left, F = W.top, q = $ - g, V = F - x;
    if (H(q) < 2 && H(V) < 2)
      break;
    j[0] -= q, j[1] -= V;
  }
  return O.map(function(L) {
    return Math.round(L);
  });
}
function $h(t, e, r) {
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
function Vu(t, e) {
  return De([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function cn(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = $t(t, e));
  var a = Vu(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function ka(t, e) {
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
function Uu(t) {
  var e = t && !ao(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, p = 0, v = 1 / 0, g = 1 / 0, x = 1 / 0, y = 1 / 0, C = 0, w = 0, E = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var k = t.getBBox();
      E = !0, r = k.width, n = k.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var D = he(t), M = t.style, T = D("boxSizing") === "border-box", m = parseFloat(D("borderLeftWidth")) || 0, _ = parseFloat(D("borderRightWidth")) || 0, j = parseFloat(D("borderTopWidth")) || 0, O = parseFloat(D("borderBottomWidth")) || 0, R = parseFloat(D("paddingLeft")) || 0, z = parseFloat(D("paddingRight")) || 0, A = parseFloat(D("paddingTop")) || 0, W = parseFloat(D("paddingBottom")) || 0, $ = R + z, F = A + W, q = m + _, V = j + O, L = $ + q, rt = F + V, at = D("position"), Z = 0, nt = 0;
      if ("clientLeft" in t) {
        var et = null;
        if (at === "absolute") {
          var ot = En(t, or(t));
          et = ot.offsetParent;
        } else
          et = t.parentElement;
        if (et) {
          var it = he(et);
          Z = parseFloat(it("width")), nt = parseFloat(it("height"));
        }
      }
      c = Math.max($, Nt(D("minWidth"), Z) || 0), f = Math.max(F, Nt(D("minHeight"), nt) || 0), v = Nt(D("maxWidth"), Z), g = Nt(D("maxHeight"), nt), isNaN(v) && (v = 1 / 0), isNaN(g) && (g = 1 / 0), C = Nt(M.width, 0) || 0, w = Nt(M.height, 0) || 0, o = parseFloat(D("width")) || 0, s = parseFloat(D("height")) || 0, l = H(o - C) < 1 ? ma(c, C || o, v) : o, u = H(s - w) < 1 ? ma(f, w || s, g) : s, r = l, n = u, a = l, i = u, T ? (x = v, y = g, d = c, p = f, l = r - L, u = n - rt) : (x = v + L, y = g + rt, d = c + L, p = f + rt, r = l + L, n = u + rt), a = l + $, i = u + F;
    }
  return {
    svg: E,
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
    maxHeight: g,
    minOffsetWidth: d,
    minOffsetHeight: p,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function Ku(t, e) {
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
function Zu(t, e) {
  var r = t === or(t) || t === uo(t), n = {
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
function fi(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Zu(r, c) : c;
}
function gn(t, e) {
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
  return t && e ? Zu(t, s) : s;
}
function qh(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Oo(n, i, o) : l;
}
function Ju(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Qu(i, n);
  }
  return a;
}
function Qu(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function _o(t, e) {
  return [
    It(e, t[0]),
    It(e, t[1]),
    It(e, t[2]),
    It(e, t[3])
  ];
}
function ke(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return _o([n, a, i, o], [e, r]);
}
function $i(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function zr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && $i(t, e), n == null || n.unset(), t[r] = null;
}
function ue(t, e) {
  if (e) {
    var r = Ur(e);
    r.nextStyle = P(P({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: qr(t).map(function(n) {
      return "".concat(md(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function tc(t, e, r) {
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
function Fa(t, e, r) {
  t._emitter.on(e, r);
}
function ct(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function To(t, e) {
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
function qi(t, e) {
  return t === e || t == null && e == null;
}
function tl() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!ao(a))
      return a;
  }
  return t[r];
}
function ec(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function Vh(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function rc(t) {
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
  return oe(Pe(t, r), xr(e, r), r);
}
function Uh(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(Xr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Se(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Ft(t, [Ks(r[0] || 1), 0], n), i = Ft(t, [0, Ks(r[1] || 1)], n), o = Ft(t, [
    r[0] / De(a),
    r[1] / De(i)
  ], n);
  return It(e, o);
}
function _e(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Ma(t) {
  return H(t) <= ce ? 0 : t;
}
function Io(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Bp(e, t), n = r.deg;
    return n ? gt("view-control-rotation".concat(n)) : "";
  };
}
function Ro(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return te(a, gt("direction")) && (!t || te(a, gt(t)));
  };
}
function Kh(t, e, r) {
  var n, a = Fr(t, {
    "x%": function(k) {
      return k / 100 * e.offsetWidth;
    },
    "y%": function(k) {
      return k / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Fr([""])[0], p = r < 0 ? [] : a.slice(r), v = r < 0 ? [] : a.slice(r + 1), g = d ? [d] : [], x = Rr(c), y = Rr(f), C = Rr(p), w = Rr(v), E = jt(x, C, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Rr(g),
    afterFunctionMatrix: C,
    afterFunctionMatrix2: w,
    allFunctionMatrix: E,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: g[0],
    afterFunctions: p,
    afterFunctions2: v,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function Zh(t) {
  return !t || !me(t) || Cn(t) ? !1 : Ht(t) || "length" in t;
}
function Ge(t, e) {
  return t ? Cn(t) ? t : Ee(t) ? e ? document.querySelector(t) : t : Ra(t) ? t() : Ql(t) ? t : "current" in t ? t.current : t : null;
}
function Po(t, e) {
  if (!t)
    return [];
  var r = Zh(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return Ee(a) && e ? Q(Q([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (Ht(a) ? n.push(Po(a, e)) : n.push(Ge(a, e)), n);
  }, []);
}
function Jh(t, e, r) {
  var n = $t(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function el(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Pe(r, a);
  return n || (i = Oe(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, pa(i, e);
}
function nc(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = $t([0, 0], e), f = $t([0, 0], n), d = De(e), p = Math.cos(c - f) * d;
    if (!n[0])
      u = p, l = u * r;
    else if (!n[1])
      l = p, u = l / r;
    else {
      var v = n[0] * o, g = n[1] * s, x = Math.atan2(v + e[0], g + e[1]), y = Math.atan2(v, g);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var C = 0;
      H(x - y) < Math.PI / 2 || H(x - y) > Math.PI / 2 * 3 || (y += Math.PI), C = x - y, C > Math.PI * 2 ? C -= Math.PI * 2 : C > Math.PI ? C = 2 * Math.PI - C : C < -Math.PI && (C = -2 * Math.PI - C);
      var w = De([v + e[0], g + e[1]]) * Math.cos(C);
      l = w * Math.sin(y) - v, u = w * Math.cos(y) - g, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function ac(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, p = n.parentDistance, v = n.parentDist, g = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(M) {
    return H(t[M] - x[M]);
  }), C = [0, 1].map(function(M) {
    var T = y[M];
    return T !== 0 && (T = 2 / T), T;
  });
  if (v)
    l = v[0], u = v[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (bn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (g)
    l = (g[0] - 1) * o, u = (g[1] - 1) * s;
  else if (p) {
    var w = o * y[0], E = s * y[1], k = De([w, E]);
    l = p / k * w * C[0], u = p / k * E * C[1];
  } else {
    var D = Fe({ datas: r, distX: c, distY: f });
    D = C.map(function(M, T) {
      return D[T] * M;
    }), a = N(nc([o, s], D, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function Vi(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = Vi(n || ""), o = Vi(a || ""), s = P(P({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Oo(t, e, r) {
  var n = Vi(t, !0), a = n.x, i = n.y;
  return [
    Nt(a, e) || 0,
    Nt(i, r) || 0
  ];
}
function Qh(t, e, r) {
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
function ic(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Ht(r), o = Ht(a);
    return i && o ? ic(r, a) : !i && !o ? r === a : !1;
  });
}
function Ar(t, e, r, n, a) {
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
function H(t) {
  return Math.abs(t);
}
function di(t, e) {
  return Sd(t).map(function(r) {
    return e(r);
  });
}
function oc(t) {
  return bn(t) ? {
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
var tv = Tn("pinchable", {
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
    var p = ct(t, u, d);
    r.isPinch = p !== !1, r.ables = f;
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
      var d = r.ables, p = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(v) {
        v[p] && v[p](t, P(P({}, e), { datas: i[v.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
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
}), rl = Ro("scalable"), ev = {
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
  render: ku("scalable"),
  dragControlCondition: rl,
  viewClassName: Io("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = Ju(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, p = s.pos2, v = s.pos4;
    if (!o || !f)
      return !1;
    n || Cr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var g = !o[0] && !o[1] || o[0] || !o[1];
    ja(t, e, "scale"), r.isWidth = g;
    function x(D) {
      r.ratio = D && isFinite(D) ? D : 0;
    }
    r.startPositions = ke(t.state);
    function y(D) {
      var M = Bu(r.startPositions, D);
      r.fixedDirection = M.fixedDirection, r.fixedPosition = M.fixedPosition, r.fixedOffset = M.fixedOffset;
    }
    r.setFixedDirection = y, x(Be(d, p) / Be(p, v)), y([-o[0], -o[1]]);
    var C = function(D) {
      r.minScaleSize = D;
    }, w = function(D) {
      r.maxScaleSize = D;
    };
    C([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var E = Et(t, e, P(P({ direction: o, set: function(D) {
      r.startValue = D;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: C, setMaxScaleSize: w }, Na(t, e)), { dragStart: se.dragStart(t, new Lr().dragStart([0, 0], e)) })), k = ct(t, "onScaleStart", E);
    return r.startFixedDirection = r.fixedDirection, k !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? E : !1;
  },
  dragControl: function(t, e) {
    Pa(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, p = r.startOffsetHeight, v = r.isScale, g = r.startValue, x = r.isWidth, y = r.ratio;
    if (!v)
      return !1;
    var C = t.props, w = C.throttleScale, E = C.parentMoveable, k = f;
    !f[0] && !f[1] && (k = [1, 1]);
    var D = y && (n ?? C.keepRatio) || !1, M = t.state, T = [
      g[0],
      g[1]
    ];
    function m() {
      var J = ac(k, D, r, e), lt = J.distWidth, wt = J.distHeight, pt = d ? (d + lt) / d : 1, ht = p ? (p + wt) / p : 1;
      g[0] || (T[0] = lt / d), g[1] || (T[1] = wt / p);
      var yt = (k[0] || D ? pt : 1) * T[0], Tt = (k[1] || D ? ht : 1) * T[1];
      return yt === 0 && (yt = le(c[0]) * Jn), Tt === 0 && (Tt = le(c[1]) * Jn), [yt, Tt];
    }
    var _ = m();
    if (!i && t.props.groupable) {
      var j = M.snapRenderInfo || {}, O = j.direction;
      Ht(O) && (O[0] || O[1]) && (M.snapRenderInfo = { direction: f, request: e.isRequest });
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
    ], z = o, A = [0, 0], W = le(R[0] * R[1]), $ = !o && !a && i;
    if ($ || u ? z = bo(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (z = r.fixedPosition), i || (A = Ph(t, R, f, !l && s, r)), D) {
      k[0] && k[1] && A[0] && A[1] && (Math.abs(A[0] * d) > Math.abs(A[1] * p) ? A[1] = 0 : A[0] = 0);
      var F = !A[0] && !A[1];
      if (F && (x ? R[0] = St(R[0] * T[0], w) / T[0] : R[1] = St(R[1] * T[1], w) / T[1]), k[0] && !k[1] || A[0] && !A[1] || F && x) {
        R[0] += A[0];
        var q = d * R[0] * T[0] / y;
        R[1] = le(W * R[0]) * H(q / p / T[1]);
      } else if (!k[0] && k[1] || !A[0] && A[1] || F && !x) {
        R[1] += A[1];
        var V = p * R[1] * T[1] * y;
        R[0] = le(W * R[1]) * H(V / d / T[0]);
      }
    } else
      R[0] += A[0], R[1] += A[1], A[0] || (R[0] = St(R[0] * T[0], w) / T[0]), A[1] || (R[1] = St(R[1] * T[1], w) / T[1]);
    R[0] === 0 && (R[0] = le(c[0]) * Jn), R[1] === 0 && (R[1] = le(c[1]) * Jn), _ = zh(R, [T[0], T[1]]);
    var L = [
      d,
      p
    ], rt = [
      d * _[0],
      p * _[1]
    ];
    rt = so(rt, r.minScaleSize, r.maxScaleSize, D ? y : !1), _ = di(2, function(J) {
      return L[J] ? rt[J] / L[J] : rt[J];
    }), R = di(2, function(J) {
      return _[J] / T[J];
    });
    var at = di(2, function(J) {
      return c[J] ? R[J] / c[J] : R[J];
    }), Z = "scale(".concat(R.join(", "), ")"), nt = "scale(".concat(_.join(", "), ")"), et = Oa(r, nt, Z), ot = !g[0] || !g[1], it = Pp(t, ot ? nt : Z, r.fixedDirection, z, r.fixedOffset, r, ot), ft = $ ? it : mt(it, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = it, _[0] === c[0] && _[1] === c[1] && ft.every(function(J) {
      return !J;
    }) && !E && !$)
      return !1;
    var bt = Et(t, e, P({ offsetWidth: d, offsetHeight: p, direction: f, scale: _, dist: R, delta: at, isPinch: !!i }, bu(t, et, ft, i, e)));
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
  dragGroupControlCondition: rl,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Re(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = $e(t, this, "dragControlStart", e, function(u, c) {
      return Ca(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), Ca(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = P(P({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ct(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Fa(t, "onBeforeScale", function(c) {
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
          var d = N(oe(kn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), p = d[0], v = d[1];
          return P(P({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: It(s, [p, v])
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
    return ga(r, e[n], 1, 2);
  });
}
function nl(t, e, r) {
  var n = $t(t, e), a = $t(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function rv(t, e) {
  var r = nl(t[0], t[1], t[2]), n = nl(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var nv = {
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
  viewClassName: Io("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = Qe(l, u), p = Qe(u, l), v = Qe(l, c), g = Qe(c, l), x = Qe(c, f), y = Qe(f, c), C = Qe(u, f), w = Qe(f, u);
    return Q([
      e.createElement("div", { className: gt("line"), key: "middeLine1", style: cn(d, x, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine2", style: cn(p, y, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine3", style: cn(v, C, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine4", style: cn(g, w, o) })
    ], N(Mu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return te(r, gt("direction")) && te(r, gt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Qu(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, p = s.height, v = s.left, g = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Oe(f, 3, 4), r.targetInverseMatrix = tu(Pe(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = v, r.top = g, r.poses = [
      [0, 0],
      [d, 0],
      [0, p],
      [d, p]
    ].map(function(C) {
      return mt(C, l);
    }), r.nextPoses = r.poses.map(function(C) {
      var w = N(C, 2), E = w[0], k = w[1];
      return oe(r.warpTargetMatrix, [E, k, 0, 1], 4);
    }), r.startValue = zt(4), r.prevMatrix = zt(4), r.absolutePoses = ke(s), r.posIndexes = yu(o), Cr(t, e), ja(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = Et(t, e, P({ set: function(C) {
      r.startValue = C;
    } }, Na(t, e))), y = ct(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Pa(t, e, "matrix3d"), Kr(t, "warpable")) {
      var p = f.map(function(m) {
        return d[m];
      });
      p.length > 1 && p.push([
        (p[0][0] + p[1][0]) / 2,
        (p[0][1] + p[1][1]) / 2
      ]);
      var v = Ba(t, n, {
        horizontal: p.map(function(m) {
          return m[1] + i;
        }),
        vertical: p.map(function(m) {
          return m[0] + a;
        })
      }), g = v.horizontal, x = v.vertical;
      i -= g.offset, a -= x.offset;
    }
    var y = Fe({ datas: r, distX: a, distY: i }, !0), C = r.nextPoses.slice();
    if (f.forEach(function(m) {
      C[m] = It(C[m], y);
    }), !Sp.every(function(m) {
      return rv(m.map(function(_) {
        return c[_];
      }), m.map(function(_) {
        return C[_];
      }));
    }))
      return !1;
    var w = fo(c[0], c[2], c[1], c[3], C[0], C[2], C[1], C[3]);
    if (!w.length)
      return !1;
    var E = jt(o, w, 4), k = mu(r, E, !0), D = jt(Pe(s, 4), k, 4);
    r.prevMatrix = k;
    var M = jt(u, k, 4), T = Oa(r, "matrix3d(".concat(M.join(", "), ")"), "matrix3d(".concat(k.join(", "), ")"));
    return yo(e, T), ct(t, "onWarp", Et(t, e, P({ delta: D, matrix: M, dist: k, multiply: jt, transform: T }, ue({
      transform: T
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ct(t, "onWarpEnd", ye(t, e, {})), n) : !1;
  }
}, av = /* @__PURE__ */ gt("area-pieces"), aa = /* @__PURE__ */ gt("area-piece"), sc = /* @__PURE__ */ gt("avoid"), iv = gt("view-dragging");
function pi(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    Jl(e, sc), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function al(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: av },
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa })
  );
}
var lc = {
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
        al(e)
      ];
    if (!n || !a)
      return [];
    var d = fo([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), p = d.length ? Ga(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: rr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: p
      } }),
      al(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, p = l.top, v = we(u), g = v.left, x = v.top, y = v.width, C = v.height, w = f ? 4 : 3, E = N(Xr(c, [n - d, a - p], w), 2), k = E[0], D = E[1];
    k -= g, D -= x;
    var M = [
      { left: g, top: x, width: y, height: D - 10 },
      { left: g, top: x, width: k - 10, height: C },
      { left: g, top: x + D + 10, width: y, height: C - D - 10 },
      { left: g + k + 10, top: x, width: y - k - 10, height: C }
    ], T = [].slice.call(o.nextElementSibling.children);
    M.forEach(function(m, _) {
      T[_].style.cssText = "left: ".concat(m.left, "px;top: ").concat(m.top, "px; width: ").concat(m.width, "px; height: ").concat(m.height, "px;");
    }), lo(o, sc), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, pi(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || pi(t);
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
    pi(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Zl(function() {
      e.disableNativeEvent = !1;
    });
  }
}, ov = Tn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, p = o.top, v = o.offsetWidth, g = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(Oo(a, v, g), 2), C = y[0], w = y[1], E = f ? 4 : 3, k = Ft(c, [C, w], E);
      x = ka(l, n, mt(k, [d, p]));
    } else
      x = ka(l, n, s);
    return [
      e.createElement("div", { className: gt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function sv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var lv = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new iu(), s = Ge(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, p = Et(t, e, {
        scrollContainer: f,
        direction: d
      }), v = u ? "onScrollGroup" : "onScroll";
      u && (p.targets = u), ct(t, v, p);
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
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? sv : c, d = n.scrollOptions;
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
}, uc = {
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
}, uv = Tn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = oc(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, p = l.pos4, v = [c, f, d, p], g = [];
    return a > 0 && g.push([0, 2]), i > 0 && g.push([0, 1]), o > 0 && g.push([1, 3]), s > 0 && g.push([2, 3]), g.map(function(x, y) {
      var C = N(x, 2), w = C[0], E = C[1], k = v[w], D = v[E], M = u[w], T = u[E], m = fo([0, 0], [100, 0], [0, 100], [100, 100], k, D, M, T);
      if (m.length)
        return e.createElement("div", { key: "padding".concat(y), className: gt("padding"), style: {
          transform: Ga(m, !0)
        } });
    });
  }
}), il = ["nw", "ne", "se", "sw"];
function ia(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var cv = [1, 2, 5, 6], fv = [0, 3, 4, 7], pr = [1, -1, -1, 1], hr = [1, 1, -1, -1];
function No(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var p = d.horizontal, v = d.vertical, g = d.pos;
    if (v && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, v === 1 ? g[1] - i : s - g[1]);
      return l.push(_e(x, n, e)), x;
    } else {
      var x = Math.max(0, p === 1 ? g[0] - a : o - g[0]);
      return l.push(_e(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function cc(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function fc(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, p = t.slice(0, d), v = t.slice(d + 1), g = p.length, x = v.length, y = x > 0, C = N(p, 4), w = C[0], E = w === void 0 ? "0px" : w, k = C[1], D = k === void 0 ? E : k, M = C[2], T = M === void 0 ? E : M, m = C[3], _ = m === void 0 ? D : m, j = N(v, 4), O = j[0], R = O === void 0 ? E : O, z = j[1], A = z === void 0 ? y ? R : D : z, W = j[2], $ = W === void 0 ? y ? R : T : W, F = j[3], q = F === void 0 ? y ? A : _ : F, V = [E, D, T, _].map(function(et) {
    return Nt(et, e);
  }), L = [R, A, $, q].map(function(et) {
    return Nt(et, r);
  }), rt = V.slice(), at = L.slice();
  s = N(ia([rt[0], rt[1]], e), 2), rt[0] = s[0], rt[1] = s[1], l = N(ia([rt[3], rt[2]], e), 2), rt[3] = l[0], rt[2] = l[1], u = N(ia([at[0], at[3]], r), 2), at[0] = u[0], at[3] = u[1], c = N(ia([at[1], at[2]], r), 2), at[1] = c[0], at[2] = c[1];
  var Z = o ? rt : rt.slice(0, Math.max(i[0], g)), nt = o ? at : at.slice(0, Math.max(i[1], x));
  return Q(Q([], N(Z.map(function(et, ot) {
    var it = il[ot];
    return {
      virtual: ot >= g,
      horizontal: pr[ot],
      vertical: 0,
      pos: [n + et, a + (hr[ot] === -1 ? r : 0)],
      sub: !0,
      raw: V[ot],
      direction: it
    };
  })), !1), N(nt.map(function(et, ot) {
    var it = il[ot];
    return {
      virtual: ot >= x,
      horizontal: 0,
      vertical: hr[ot],
      pos: [n + (pr[ot] === -1 ? e : 0), a + et],
      sub: !0,
      raw: L[ot],
      direction: it
    };
  })), !1);
}
function dv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = cc(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function pv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = cc(t.slice(r)), d = f.horizontalRange, p = f.verticalRange;
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
    var C = hr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && p[1] === 0) {
      var w = [
        u + C,
        c
      ];
      t.push({
        horizontal: pr[0],
        vertical: 0,
        pos: w
      }), e.push(w);
    }
    for (var E = p[0], g = p[1]; g <= a; ++g) {
      var y = pr[g] === 1 ? u : s, x = 0;
      if (a === g ? x = o : g === 0 ? x = c + C : hr[g] === 1 ? x = e[r + E][1] : hr[g] === -1 && (x = l - (e[r + E][1] - c)), t.push({
        horizontal: 0,
        vertical: hr[g],
        pos: [y, x]
      }), e.push([y, x]), g === 0)
        break;
    }
  }
}
function hv(t, e) {
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
var vv = [
  [0, -1, "n"],
  [1, 0, "e"]
], gv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function jo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(D) {
      return "".concat(_e(D[0], i, n), " ").concat(_e(D[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], p = r[3][0], v = r[7][0], g = r[5][1];
    if (c)
      return [
        d,
        p,
        g,
        v
      ].map(function(D) {
        return "".concat(D, "px");
      });
    var x = [d, i - p, o - g, v].map(function(D, M) {
      return _e(D, M % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(mt(r[4], r[0]), 2), C = y[0], w = y[1];
      x.push.apply(x, Q(["round"], N(No(u.slice(8).map(function(D, M) {
        return P(P({}, D), { pos: r[M] });
      }), n, C, w, v, d, p, g).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var E = r[0], k = _e(H(r[1][1] - E[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [k] : [_e(H(r[2][0] - E[0]), i, n), k];
    return x.push("at", _e(E[0], i, n), _e(E[1], o, n)), x;
  }
}
function _a(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return gv.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: H(u),
      horizontal: H(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function dc(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    H(e[1] - e[0]),
    H(r[1] - r[0])
  ];
}
function ol(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, p;
  if (t) {
    var v = a;
    if (!v) {
      var g = he(t), x = g("clipPath");
      v = x !== "none" ? x : g("clip");
    }
    if (!((!v || v === "none" || v === "auto") && (v = n, !v))) {
      var y = Kl(v), C = y.prefix, w = C === void 0 ? v : C, E = y.value, k = E === void 0 ? "" : E, D = w === "circle", M = " ";
      if (w === "polygon") {
        var T = vr(k || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        M = ",";
        var m = T.map(function(At) {
          var qt = N(At.split(" "), 2), Lt = qt[0], Rt = qt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Nt(Lt, e),
              Nt(Rt, r)
            ]
          };
        }), _ = br(m.map(function(At) {
          return At.pos;
        }));
        return {
          type: w,
          clipText: v,
          poses: m,
          splitter: M,
          left: _.minX,
          right: _.maxX,
          top: _.minY,
          bottom: _.maxY
        };
      } else if (D || w === "ellipse") {
        var j = "", O = "", R = 0, z = 0, T = nr(k);
        if (D) {
          var A = "";
          i = N(T, 4), o = i[0], A = o === void 0 ? "50%" : o, s = i[2], j = s === void 0 ? "50%" : s, l = i[3], O = l === void 0 ? "50%" : l, R = Nt(A, Math.sqrt((e * e + r * r) / 2)), z = R;
        } else {
          var W = "", $ = "";
          u = N(T, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], $ = f === void 0 ? "50%" : f, d = u[3], j = d === void 0 ? "50%" : d, p = u[4], O = p === void 0 ? "50%" : p, R = Nt(W, e), z = Nt($, r);
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
        ], N(vv.slice(0, D ? 1 : 2).map(function(Lt) {
          return {
            vertical: H(Lt[1]),
            horizontal: Lt[0],
            direction: Lt[2],
            sub: !0,
            pos: [
              F[0] + Lt[0] * R,
              F[1] + Lt[1] * z
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: v,
          radiusX: R,
          radiusY: z,
          left: F[0] - R,
          top: F[1] - z,
          right: F[0] + R,
          bottom: F[1] + z,
          poses: m,
          splitter: M
        };
      } else if (w === "inset") {
        var T = nr(k || "0 0 0 0"), q = T.indexOf("round"), V = (q > -1 ? T.slice(0, q) : T).length, L = T.slice(V + 1), rt = N(T.slice(0, V), 4), at = rt[0], Z = rt[1], nt = Z === void 0 ? at : Z, et = rt[2], ot = et === void 0 ? at : et, it = rt[3], ft = it === void 0 ? nt : it, bt = N([at, ot].map(function(Lt) {
          return Nt(Lt, r);
        }), 2), J = bt[0], lt = bt[1], wt = N([ft, nt].map(function(Lt) {
          return Nt(Lt, e);
        }), 2), pt = wt[0], ht = wt[1], yt = e - ht, Tt = r - lt, xt = fc(L, yt - pt, Tt - J, pt, J), m = Q(Q([], N(_a(J, yt, Tt, pt)), !1), N(xt), !1);
        return {
          type: "inset",
          clipText: v,
          poses: m,
          top: J,
          left: pt,
          right: yt,
          bottom: Tt,
          radius: L,
          splitter: M
        };
      } else if (w === "rect") {
        var T = vr(k || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        M = ",";
        var vt = N(T.map(function(ve) {
          var Ne = mr(ve).value;
          return Ne;
        }), 4), Mt = vt[0], ht = vt[1], lt = vt[2], pt = vt[3], m = _a(Mt, ht, lt, pt);
        return {
          type: "rect",
          clipText: v,
          poses: m,
          top: Mt,
          right: ht,
          bottom: lt,
          left: pt,
          values: T,
          splitter: M
        };
      }
    }
  }
}
function mv(t, e, r, n, a) {
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
    var v = N(dc(t), 2), g = v[0], x = v[1], y = g && x ? g / x : 0;
    if (y && a) {
      var C = (e + 4) % 8, w = t[C].pos, E = [0, 0];
      o.indexOf("w") > -1 ? E[0] = -1 : o.indexOf("e") > -1 && (E[0] = 1), o.indexOf("n") > -1 ? E[1] = -1 : o.indexOf("s") > -1 && (E[1] = 1);
      var k = nc([g, x], r, y, E, !0), D = g + k[0], M = x + k[1], T = w[1], m = w[1], _ = w[0], j = w[0];
      E[0] === -1 ? _ = j - D : E[0] === 1 ? j = _ + D : (_ = _ - D / 2, j = j + D / 2), E[1] === -1 ? T = m - M : (E[1] === 1 || (T = m - M / 2), m = T + M);
      var O = _a(T, j, m, _);
      t.forEach(function(R, z) {
        l[z][0] = O[z].pos[0] - R.pos[0], l[z][1] = O[z].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, z) {
        var A = R.direction;
        A && (A.indexOf(d) > -1 && (l[z][0] = r[0]), A.indexOf(p) > -1 && (l[z][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), p && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var z = R === "n" || R === "s";
    t.forEach(function(A, W) {
      var $ = A.direction, F = A.horizontal, q = A.vertical;
      !$ || $.indexOf(R) === -1 || (l[W] = [
        z || !F ? 0 : r[0],
        !z || !q ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function xv(t, e) {
  var r = N(gu(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(C) {
    return C.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var p = cv.indexOf(s), v = fv.indexOf(s), g = c.length;
    if (pv(c, d, 8, p, v, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), g === c.length)
      return;
  } else
    return;
  var x = jo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ue({
    clipPath: y
  }, e))));
}
function yv(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(p) {
    return p.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (dv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = jo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ue({
    clipPath: d
  }, e))));
}
var bv = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, p = l.is3d, v = l.left, g = l.top, x = l.pos1, y = l.pos2, C = l.pos3, w = l.pos4, E = l.clipPathState, k = l.snapBoundInfos, D = l.rotation;
    if (!u || s)
      return [];
    var M = ol(u, c, f, a || "inset", E || n);
    if (!M)
      return [];
    var T = p ? 4 : 3, m = M.type, _ = M.poses, j = _.map(function(ht) {
      var yt = Ft(d, ht.pos, T);
      return [
        yt[0] - v,
        yt[1] - g
      ];
    }), O = [], R = [], z = m === "rect", A = m === "inset", W = m === "polygon";
    if (z || A || W) {
      var $ = A ? j.slice(0, 8) : j;
      R = $.map(function(ht, yt) {
        var Tt = yt === 0 ? $[$.length - 1] : $[yt - 1], xt = $t(Tt, ht), vt = Vu(Tt, ht);
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
    }), A && O.push.apply(O, Q([], N(j.slice(8).map(function(ht, yt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(yt), className: gt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + yt, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    })), !1)), m === "circle" || m === "ellipse") {
      var F = M.left, q = M.top, V = M.radiusX, L = M.radiusY, rt = N(mt(Ft(d, [F, q], T), Ft(d, [0, 0], T)), 2), at = rt[0], Z = rt[1], nt = "none";
      if (!i) {
        for (var et = Math.max(10, V / 5, L / 5), ot = [], it = 0; it <= et; ++it) {
          var ft = Math.PI * 2 / et * it;
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
        transform: "translate(".concat(-v + at, "px, ").concat(-g + Z, "px) ").concat(Ga(d))
      } }));
    }
    if (i) {
      var bt = we(Q([x, y, C, w], N(j), !1)), J = bt.width, lt = bt.height, wt = bt.left, pt = bt.top;
      if (W || z || A) {
        var ot = A ? j.slice(0, 8) : j;
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
    return k && ["vertical", "horizontal"].forEach(function(ht) {
      var yt = k[ht], Tt = ht === "horizontal";
      yt.isSnap && R.push.apply(R, Q([], N(yt.snap.posInfos.map(function(xt, vt) {
        var Mt = xt.pos, At = mt(Ft(d, Tt ? [0, Mt] : [Mt, 0], T), [v, g]), qt = mt(Ft(d, Tt ? [c, Mt] : [Mt, f], T), [v, g]);
        return wn(e, "", At, qt, o, "clip".concat(ht, "snap").concat(vt), "guideline");
      })), !1)), yt.isBound && R.push.apply(R, Q([], N(yt.bounds.map(function(xt, vt) {
        var Mt = xt.pos, At = mt(Ft(d, Tt ? [0, Mt] : [Mt, 0], T), [v, g]), qt = mt(Ft(d, Tt ? [c, Mt] : [Mt, f], T), [v, g]);
        return wn(e, "", At, qt, o, "clip".concat(ht, "bounds").concat(vt), "guideline", "bounds", "bold");
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = ol(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var p = d.clipText, v = d.type, g = d.poses, x = ct(t, "onClipStart", Et(t, e, {
      clipType: v,
      clipStyle: p,
      poses: g.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = p, Cr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, p = l.clipPath;
    if (!p)
      return !1;
    var v = Sr(t.props, "clippable"), g = v.keepRatio, x = 0, y = 0, C = o.draggable, w = Fe(e);
    s && C ? (r = N(C.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(w, 2), x = n[0], y = n[1]);
    var E = [x, y], k = t.state, D = k.width, M = k.height, T = !f && !u && !c, m = p.type, _ = p.poses, j = p.splitter, O = _.map(function(Ct) {
      return Ct.pos;
    });
    T && (x = -x, y = -y);
    var R = !u || _[d].direction === "nesw", z = m === "inset" || m === "rect", A = _.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var W = _[d], $ = W.horizontal, F = W.vertical, q = [
        x * H($),
        y * H(F)
      ];
      A = mv(_, d, q, z, g);
    } else R && (A = O.map(function() {
      return [x, y];
    }));
    var V = O.map(function(Ct, Wt) {
      return It(Ct, A[Wt]);
    }), L = Q([], N(V), !1);
    k.snapBoundInfos = null;
    var rt = p.type === "circle", at = p.type === "ellipse";
    if (rt || at) {
      var Z = we(V), nt = H(Z.bottom - Z.top), et = H(at ? Z.right - Z.left : nt), ot = V[0][1] + nt, it = V[0][0] - et, ft = V[0][0] + et;
      rt && (L.push([ft, Z.bottom]), A.push([1, 0])), L.push([Z.left, ot]), A.push([0, 1]), L.push([it, Z.bottom]), A.push([1, 0]);
    }
    var bt = Wu((v.clipHorizontalGuidelines || []).map(function(Ct) {
      return Nt("".concat(Ct), M);
    }), (v.clipVerticalGuidelines || []).map(function(Ct) {
      return Nt("".concat(Ct), D);
    }), D, M), J = [], lt = [];
    if (rt || at)
      J = [L[4][0], L[2][0]], lt = [L[1][1], L[3][1]];
    else if (z) {
      var wt = [L[0], L[2], L[4], L[6]], pt = [A[0], A[2], A[4], A[6]];
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
        return A[Wt][0];
      }).map(function(Ct) {
        return Ct[0];
      }), lt = L.filter(function(Ct, Wt) {
        return A[Wt][1];
      }).map(function(Ct) {
        return Ct[1];
      });
    var ht = [0, 0], yt = Xs(bt, v.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, J, lt, 5, 5), Tt = yt.horizontal, xt = yt.vertical, vt = Tt.offset, Mt = xt.offset;
    if (Tt.isBound && (ht[1] += vt), xt.isBound && (ht[0] += Mt), (at || rt) && A[0][0] === 0 && A[0][1] === 0) {
      var Z = we(V), At = Z.bottom - Z.top, qt = at ? Z.right - Z.left : At, Lt = xt.isBound ? H(Mt) : xt.snapIndex === 0 ? -Mt : Mt, Rt = Tt.isBound ? H(vt) : Tt.snapIndex === 0 ? -vt : vt;
      qt -= Lt, At -= Rt, rt && (At = Nu(xt, Tt) > 0 ? At : qt, qt = At);
      var Gt = L[0];
      L[1][1] = Gt[1] - At, L[2][0] = Gt[0] + qt, L[3][1] = Gt[1] + At, L[4][0] = Gt[0] - qt;
    } else if (z && g && u) {
      var ve = N(dc(_), 2), Ne = ve[0], Zr = ve[1], On = Ne && Zr ? Ne / Zr : 0, sr = _[d], lr = sr.direction || "", Ve = L[1][1], ot = L[5][1], it = L[7][0], ft = L[3][0];
      H(vt) <= H(Mt) ? vt = le(vt) * H(Mt) / On : Mt = le(Mt) * H(vt) * On, lr.indexOf("w") > -1 ? it -= Mt : lr.indexOf("e") > -1 ? ft -= Mt : (it += Mt / 2, ft -= Mt / 2), lr.indexOf("n") > -1 ? Ve -= vt : lr.indexOf("s") > -1 ? ot -= vt : (Ve += vt / 2, ot -= vt / 2);
      var Jr = _a(Ve, ft, ot, it);
      L.forEach(function(K, dt) {
        var Yt;
        Yt = N(Jr[dt].pos, 2), K[0] = Yt[0], K[1] = Yt[1];
      });
    } else
      L.forEach(function(Ct, Wt) {
        var Ue = A[Wt];
        Ue[0] && (Ct[0] -= Mt), Ue[1] && (Ct[1] -= vt);
      });
    var Le = jo(t, p, V), Qr = "".concat(m, "(").concat(Le.join(j), ")");
    if (k.clipPathState = Qr, rt || at)
      J = [L[4][0], L[2][0]], lt = [L[1][1], L[3][1]];
    else if (z) {
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
    if (k.snapBoundInfos = Xs(bt, v.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, J, lt, 1, 1), C) {
      var Me = k.is3d, Pt = k.allMatrix, Er = Me ? 4 : 3, je = ht;
      s && (je = [
        E[0] + ht[0] - w[0],
        E[1] + ht[1] - w[1]
      ]), C.deltaOffset = jt(Pt, [je[0], je[1], 0, 0], Er);
    }
    return ct(t, "onClip", Et(t, e, P({ clipEventType: "changed", clipType: m, poses: V, clipStyle: Qr, clipStyles: Le, distX: x, distY: y }, ue((a = {}, a[m === "rect" ? "clip" : "clipPath"] = Qr, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ct(t, "onClipEnd", ye(t, e, {})), a && (s ? yv(t, e) : i && xv(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, Sv = {
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
    var i = N(Fe(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, p = l.is3d, v = t.props.originRelative, g = v === void 0 ? !0 : v, x = p ? 4 : 3, y = [o, s];
    if (a) {
      var C = e.distOrigin;
      (C[0] || C[1]) && (y = C);
    }
    var w = It(r.startOrigin, y), E = It(r.startTargetOrigin, y), k = mt(y, r.prevOrigin), D = Rn(f, d, w, x), M = t.getRect(), T = we(wr(D, u, c, x)), m = [
      M.left - T.left,
      M.top - T.top
    ];
    r.prevOrigin = y;
    var _ = [
      _e(E[0], u, g),
      _e(E[1], c, g)
    ].join(" "), j = se.drag(t, In(e, t.state, m, !!n)), O = Et(t, e, P(P({ width: u, height: c, origin: w, dist: y, delta: k, transformOrigin: _, drag: j }, ue({
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
function Cv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    wv(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function wv(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function Ev(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function sl(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = nr(t), fc(i, e, r, 0, 0, n, a);
}
function ll(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = No(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = hv(f, u), p = d.horizontals, v = d.verticals, g = c.join(" ");
  i.borderRadiusState = g;
  var x = Et(t, e, P({ horizontals: p, verticals: v, borderRadius: g, width: o, height: s, delta: n, dist: r }, ue({
    borderRadius: g
  }, e)));
  return ct(t, "onRound", x), x;
}
function ul(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = To(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var Dv = {
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
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, p = d === void 0 ? [0, 0] : d, v = f.maxRoundControls, g = v === void 0 ? [4, 4] : v, x = f.zoom, y = f.roundPadding, C = y === void 0 ? 0 : y, w = f.isDisplayShadowRoundControls, E = f.groupable;
    if (!n)
      return null;
    var k = c || ul(t), D = s ? 4 : 3, M = sl(k, a, i, p, !0);
    if (!M)
      return null;
    var T = 0, m = 0, _ = E ? [0, 0] : [l, u];
    return M.map(function(j, O) {
      var R = j.horizontal, z = j.vertical, A = j.direction || "", W = Q([], N(j.pos), !1);
      m += Math.abs(R), T += Math.abs(z), R && A.indexOf("n") > -1 && (W[1] -= C), z && A.indexOf("w") > -1 && (W[0] -= C), R && A.indexOf("s") > -1 && (W[1] += C), z && A.indexOf("e") > -1 && (W[0] += C);
      var $ = mt(Ft(o, W, D), _), F = w && w !== "horizontal", q = j.vertical ? T <= g[1] && (F || !j.virtual) : m <= g[0] && (w || !j.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(O), className: gt("control", "border-radius", j.vertical ? "vertical" : "", j.virtual ? "virtual" : ""), "data-radius-index": O, style: {
        display: q ? "block" : "none",
        transform: "translate(".concat($[0], "px, ").concat($[1], "px) scale(").concat(x, ")")
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
    var p = t.props, v = p.roundRelative, g = p.minRoundControls, x = g === void 0 ? [0, 0] : g, y = t.state, C = y.width, w = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var E = ul(t), k = sl(E || "", C, w, x, !0) || [];
    return n.controlPoses = k, y.borderRadiusState = No(k, v, C, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N(Fe(e), 2), o = i[0], s = i[1], l = [o, s], u = mt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, p = d.width, v = d.height, g = n[a], x = g.vertical, y = g.horizontal, C = n.map(function(E) {
      var k = E.horizontal, D = E.vertical, M = [
        k * y * l[0],
        D * x * l[1]
      ];
      if (k) {
        if (f[0] === 1)
          return M;
        if (f[0] < 4 && k !== y)
          return M;
      } else {
        if (f[1] === 0)
          return M[1] = D * y * l[0] / p * v, M;
        if (x) {
          if (f[1] === 1)
            return M;
          if (f[1] < 4 && D !== x)
            return M;
        }
      }
      return [0, 0];
    });
    C[a] = l;
    var w = n.map(function(E, k) {
      return P(P({}, E), { pos: It(E.pos, C[k]) });
    });
    return a < 4 ? w.slice(0, a + 1).forEach(function(E) {
      E.virtual = !1;
    }) : w.slice(4, a + 1).forEach(function(E) {
      E.virtual = !1;
    }), r.prevDist = [o, s], ll(t, e, l, u, w);
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
        Ev(u, o);
      else if (s && (d === !0 || d === "line")) {
        var p = N(gu(t, e), 2), v = p[0], g = p[1];
        Cv(u, l, v, g);
      }
      c !== u.filter(function(y) {
        var C = y.virtual;
        return C;
      }).length && ll(t, e, [0, 0], [0, 0], u);
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
    Fa(t, "onRound", function(s) {
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
function kv(t, e) {
  var r = e ? 4 : 3, n = zt(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var pc = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(ru(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = kv(s, n) ? [] : nr(s);
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
}, hc = {
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
    return Fr(Sa(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, transformObject: r, transform: Qn(e) }, ue(ta(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Fr(Sa(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: Qn(e) }, ue(ta(e))));
  }
};
function mn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var p = Q([], N(e), !1);
  if (f) {
    var v = i.requestAble;
    p.some(function(O) {
      return O.name === v;
    }) || p.push.apply(p, Q([], N(t.props.ables.filter(function(O) {
      return O.name === v;
    })), !1));
  }
  if (!p.length || p.every(function(O) {
    return O.dragRelation;
  }))
    return !1;
  var g = i.inputEvent, x;
  l && g && (x = document.elementFromPoint(i.clientX, i.clientY) || g.target);
  var y = !1, C = function() {
    var O;
    y = !0, (O = i.stop) === null || O === void 0 || O.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var E = i.datas, k = d ? "controlGesto" : "targetGesto", D = t[k], M = function(O, R, z) {
    if (!(R in O) || D !== t[k])
      return !1;
    var A = O.name, W = E[A] || (E[A] = {});
    if (s && (W.isEventStart = !z || !O[z] || O[z](t, i)), !W.isEventStart)
      return !1;
    var $ = O[R](t, P(P({}, i), { stop: C, datas: W, originalDatas: E, inputTarget: x }));
    return t._emitter.off(), s && $ === !1 && (W.isEventStart = !1), $;
  };
  w && p.forEach(function(O) {
    O.unset && O.unset(t);
  }), M(pc, "drag".concat(n).concat(a));
  var T = 0, m = 0;
  r.forEach(function(O) {
    if (y)
      return !1;
    var R = "".concat(O).concat(n).concat(a), z = "".concat(O).concat(n, "Condition");
    a === "" && !f && Uh(t.state, i);
    var A = p.filter(function(F) {
      return F[R];
    });
    A = A.filter(function(F, q) {
      return F.name && A.indexOf(F) === q;
    });
    var W = A.filter(function(F) {
      return M(F, R, z);
    }), $ = W.length;
    y && ++T, $ && ++m, !y && s && A.length && !$ && (T += A.filter(function(F) {
      var q = F.name, V = E[q];
      return V.isEventStart ? F.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || m) && M(hc, "drag".concat(n).concat(a));
  var _ = D !== t[k] || T === r.length;
  if ((l || y || _) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(O) {
    O.state.gestos = {};
  }), p.forEach(function(O) {
    O.unset && O.unset(t);
  })), s && !_ && !f && m && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || _)
    return !1;
  if (!s && m && !o || l) {
    var j = t.props.flushSync || Hu;
    j(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && m && !o && mn(t, e, r, n, a + "After", i), !0;
}
function zo(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || te(i, "moveable-area") || te(i, "moveable-padding") || te(i, "moveable-edgeDraggable");
  };
}
function vc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = zo(t);
  return mc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function gc(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = zo(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return mc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function mc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, p = o.preventDefault, v = p === void 0 ? !0 : p, g = o.preventRightClick, x = g === void 0 ? !0 : g, y = o.preventWheelClick, C = y === void 0 ? !0 : y, w = o.dragContainer, E = Ge(w, !0), k = {
    preventDefault: v,
    preventRightClick: x,
    preventWheelClick: C,
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
  }, D = new lu(e, k), M = n === "Control";
  return ["drag", "pinch"].forEach(function(T) {
    ["Start", "", "End"].forEach(function(m) {
      D.on("".concat(T).concat(m), function(_) {
        var j, O = _.eventType, R = T === "drag" && _.isPinch;
        if (a[O] && !a[O](_)) {
          _.stop();
          return;
        }
        if (!R) {
          var z = T === "drag" ? [T] : ["drag", T], A = Q([], N(t[r]), !1), W = mn(t, A, z, n, m, _);
          W ? (t.props.stopPropagation || m === "Start" && M) && ((j = _ == null ? void 0 : _.inputEvent) === null || j === void 0 || j.stopPropagation()) : _.stop();
        }
      });
    });
  }), D;
}
var Mv = /* @__PURE__ */ (function() {
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
function _v(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = Cu(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, p = i.zoom, v = Wp(f, r), g = v.matrixes, x = v.is3d, y = v.offsetContainer, C = v.zoom, w = n, E = 4, k = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, D = l, M = zt(E), T = zt(E), m = zt(E), _ = zt(E), j = o.length, O = g.map(function(q) {
    return P(P({}, q), { matrix: q.matrix ? Q([], N(q.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (D = Oe(D, 3, 4), Hi(o)), !x && w && Hi(O), O.forEach(function(q) {
    T = jt(T, q.matrix, E);
  });
  var R = r || or(t), z = ((a = O[0]) === null || a === void 0 ? void 0 : a.target) || En(R, R, !0).offsetParent, A = O.slice(1).reduce(function(q, V) {
    return jt(q, V.matrix, E);
  }, zt(E));
  o.forEach(function(q, V) {
    if (j - 2 === V && (m = M.slice()), j - 1 === V && (_ = M.slice()), !q.matrix) {
      var L = o[V + 1], rt = Hh(q, L, z, E, jt(A, M, E));
      q.matrix = yr(rt, E);
    }
    M = jt(M, q.matrix, E);
  });
  var W = !k && s;
  D || (D = zt(W ? 4 : 3));
  var $ = Ga(k && D.length === 16 ? Oe(D, 4, 3) : D, W), F = T;
  return T = tu(T, E, E), {
    hasZoom: p !== 1 || C !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: T,
    originalRootMatrix: F,
    beforeMatrix: m,
    offsetMatrix: _,
    allMatrix: M,
    targetMatrix: D,
    targetTransform: $,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function Tv(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Uu(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = _v(t, e, r, n), c = Br(u.allMatrix, u.transformOrigin, a, i);
    s = P(P({}, u), c);
    var f = Br(u.allMatrix, [50, 50], 100, 100);
    o = Ku([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return P(P(P({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: zt(d), rootMatrix: zt(d), beforeMatrix: zt(d), offsetMatrix: zt(d), allMatrix: zt(d), targetMatrix: zt(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Ui(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = ra(), u = ra(), c = ra(), f = ra(), d = [0, 0], p = {}, v = Tv(e, r, a, !0);
  if (e) {
    var g = he(e);
    i.forEach(function(O) {
      p[O] = g(O);
    });
    var x = v.is3d ? 4 : 3, y = Br(v.offsetMatrix, It(v.transformOrigin, eu(v.targetMatrix, x)), v.width, v.height);
    o = y.direction, s = It(y.origin, [y.left - v.left, y.top - v.top]), f = gn(v.offsetRootContainer);
    var C = En(n, n, !0).offsetParent || v.offsetRootContainer;
    if (v.hasZoom) {
      var w = Br(jt(v.originalRootMatrix, v.allMatrix), v.transformOrigin, v.width, v.height), E = Br(v.originalRootMatrix, Da(he(C)("transformOrigin")).map(function(O) {
        return parseFloat(O);
      }), C.offsetWidth, C.offsetHeight);
      if (l = fi(w, f), c = fi(E, f, C, !0), t) {
        var k = w.left, D = w.top;
        u = fi({
          left: k,
          top: D,
          bottom: D,
          right: D
        }, f);
      }
    } else {
      l = gn(e), c = Lp(C), t && (u = gn(t));
      var M = c.left, T = c.top, m = c.clientLeft, _ = c.clientTop, j = [
        l.left - M,
        l.top - T
      ];
      d = mt(Xr(v.rootMatrix, j, 4), [m + v.left, _ + v.top]);
    }
  }
  return P({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: p, offsetDelta: d }, v);
}
function cl(t) {
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
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Ui(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new Mn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        xd(r._observerId), r._observerId = Zl(function() {
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
    var v = N(a || [0, 0], 2), g = v[0], x = v[1], y = n.left, C = n.top, w = n.target, E = n.direction, k = n.hasFixed, D = n.offsetDelta, M = r.targets, T = this.isDragging(), m = {};
    this.getEnabledAbles().forEach(function(A) {
      m["data-able-".concat(A.name.toLowerCase())] = !0;
    });
    var _ = this._getAbleClassName(), j = M && M.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, O = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - g, C - x];
    !f && r.useAccuratePosition && (R[0] += D[0], R[1] += D[1]);
    var z = {
      position: k ? "fixed" : "absolute",
      display: j ? "block" : "none",
      visibility: O ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (z["--moveable-line-padding"] = d), p && (z["--moveable-control-padding"] = p), tt.createElement(
      c,
      P({ cspNonce: l, ref: rr(this, "controlBox"), className: "".concat(gt("control-box", E === -1 ? "reverse" : "", T ? "dragging" : ""), " ").concat(_, " ").concat(i) }, m, { onClick: this._onPreventClick, style: z }),
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(mo) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && zo(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (Cn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = P({ width: 0, height: 0 }, r);
    var d = c.left, p = c.top, v = c.width, g = c.height, x = Ri([i, o, l, s], u), y = Vd(x, [
      [d, p],
      [d + v, p],
      [d + v, p + g],
      [d, p + g]
    ]), C = dn(x);
    return !y || !C ? 0 : Math.min(100, y / C * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? ya([r, n], Ri([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Wr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = Ui(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var p = cl(i.persistData);
      for (var v in p)
        d[v] = p[v];
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
    var r = this.state, n = ke(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = we(n), c = r.width, f = r.height, d = u.width, p = u.height, v = u.left, g = u.top, x = [r.left, r.top], y = It(x, r.origin), C = It(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: p,
      left: v,
      top: g,
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
      (n == null ? void 0 : n.isIdle()) === !1 && $i(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && $i(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return Jh(n, a, i);
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
    var f = c.request(i), d = a || n.isInstant, p = f.isControl ? "controlAbles" : "targetAbles", v = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), g = Q([], N(s[p]), !1), x = {
      request: function(y) {
        return mn(i, g, ["drag"], v, "", P(P({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return mn(i, g, ["drag"], v, "End", P(P({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return mn(i, g, ["drag"], v, "Start", P(P({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, p = r.left, v = r.top, g = r.isPersisted, x = n.zoom || 1;
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
    var y = oc(a || {}), C = y.left, w = y.top, E = y.bottom, k = y.right, D = l ? 4 : 3, M = [];
    g ? M = o : this.controlBox && n.groupable ? M = i : M = It(i, [p, v]);
    var T = xa(D, yr(M.map(function(z) {
      return -z;
    }), D), s, yr(o, D)), m = Se(T, u, [-C, -w], D), _ = Se(T, c, [k, -w], D), j = Se(T, f, [-C, E], D), O = Se(T, d, [k, E], D);
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
          Se(T, u, [-C - R, -w], D),
          Se(T, c, [k + R, -w], D)
        ],
        [
          Se(T, c, [k, -w - R], D),
          Se(T, d, [k, E + R], D)
        ],
        [
          Se(T, d, [k + R, E], D),
          Se(T, f, [-C - R, E], D)
        ],
        [
          Se(T, f, [-C, E + R], D),
          Se(T, u, [-C, -w - R], D)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !qi(s, n), c = u || !qi(l, a);
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
    return a[i] || (a[i] = cu(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = cl(i);
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
      createElement: tt.createElement
    };
    return this.renderState = {}, Vh(rc(na(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
    i && (zr(this, !1), this.updateState({ gestos: {} })), n || zr(this, !0), a && r && !this.targetGesto && (this.targetGesto = vc(this, a, "")), !this.controlGesto && n && (this.controlGesto = gc(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Ge(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: tt.createElement
    };
    return l.renderLines.map(function(c, f) {
      return wn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = qr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = na(u, [c]), d = f.length > 0, p = i[c];
        if (!d) {
          p && (p.destroy(), i[c] = null);
          return;
        }
        p || (p = new Mv(a, r, c), i[c] = p), p.setAbles(f);
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
      this.isDragging() ? iv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = ec(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = ho(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      Jl(n, i[u]);
    }), l.forEach(function(u) {
      lo(n, a[u]);
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
      return (!((f = s[p]) === null || f === void 0) && f.isEventStart || !((d = l[p]) === null || d === void 0) && d.isEventStart) && (v += " ".concat(gt("".concat(p).concat(r, "-dragging")))), v.trim();
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
          for (var d = up(u), p = d.next(); !p.done; p = d.next()) {
            var v = p.value;
            v.type === "attributes" && v.attributeName === "style" && n.checkUpdateRect();
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
    flushSync: Hu,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(tt.PureComponent), Ao = {
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
    var d = Ar(t, "parentPosition", [o, s], function(v) {
      return v.join(",");
    }), p = Ar(t, "requestStyles", t.getRequestChildStyles(), function(v) {
      return v.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), Q(Q([], N(a.map(function(v, g) {
      return e.createElement(Hr, { key: "moveable" + g, ref: $l(t, "moveables", g), target: v, origin: !1, requestStyles: p, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[g], zoom: u });
    })), !1), N(rc(c.map(function(v, g) {
      var x = v.pos1, y = v.pos2, C = v.pos3, w = v.pos4, E = [x, y, C, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(k, D) {
        var M = N(k, 2), T = M[0], m = M[1];
        return wn(e, "", mt(E[T], d), mt(E[m], d), u, "group-rect-".concat(g, "-").concat(D));
      });
    }))), !1);
  }
}, Iv = Tn("clickable", {
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
var Rv = Tn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? Du(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
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
}), xc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, Pv = [
  pc,
  uc,
  jh,
  tv,
  se,
  Rv,
  Wi,
  ev,
  nv,
  mh,
  lv,
  uv,
  ov,
  Sv,
  bv,
  Dv,
  Ao,
  xc,
  Iv,
  lc,
  hc
];
function fl(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function oa(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function dl(t, e) {
  return Math.max.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function pl(t, e) {
  return Math.min.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Ov(t, e) {
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
    var d = f / 180 * Math.PI, p = Math.tan(d), v = -1 / p, g = [Bi, zs], x = [[0, 0], [0, 0]], y = [Bi, zs], C = [[0, 0], [0, 0]];
    t.forEach(function(at) {
      at.forEach(function(Z) {
        var nt = fl([-p, 1, 0], Z), et = fl([-v, 1, 0], Z);
        g[0] > nt && (x[0] = Z, g[0] = nt), g[1] < nt && (x[1] = Z, g[1] = nt), y[0] > et && (C[0] = Z, y[0] = et), y[1] < et && (C[1] = Z, y[1] = et);
      });
    });
    var w = N(x, 2), E = w[0], k = w[1], D = N(C, 2), M = D[0], T = D[1], m = [-p, 1, oa([-p, 1], E)], _ = [-p, 1, oa([-p, 1], k)], j = [-v, 1, oa([-v, 1], M)], O = [-v, 1, oa([-v, 1], T)];
    r = N([
      [m, j],
      [m, O],
      [_, j],
      [_, O]
    ].map(function(at) {
      var Z = N(at, 2), nt = Z[0], et = Z[1];
      return vo(nt, et)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = g[1] - g[0];
  } else {
    var R = pl(t, 0), z = pl(t, 1), A = dl(t, 0), W = dl(t, 1);
    if (i = [R, z], o = [A, z], s = [R, W], l = [A, W], u = A - R, c = W - z, f % 180) {
      var $ = [s, i, l, o];
      n = N($, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - z, c = A - R;
    }
  }
  if (f % 360 > 180) {
    var $ = [l, s, o, i];
    a = N($, 4), i = a[0], o = a[1], s = a[2], l = a[3];
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
function yc(t, e) {
  var r = e.map(function(n) {
    if (Ht(n)) {
      var a = yc(t, n), i = a.length;
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
var Nv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new au(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    }), f = this.props.targetGroups || [], d = yc(c, f), p = s.useDefaultGroupRotate;
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
    function C(it, ft, bt) {
      var J = it.map(function(xt) {
        if (Ht(xt)) {
          var vt = C(xt, ft), Mt = [vt.pos1, vt.pos2, vt.pos3, vt.pos4];
          return v.push(vt), { poses: Mt, rotation: vt.rotation };
        } else
          return {
            poses: ke(xt.state),
            rotation: xt.getRotation()
          };
      }), lt = J.map(function(xt) {
        var vt = xt.rotation;
        return vt;
      }), wt = 0, pt = lt[0], ht = lt.every(function(xt) {
        return Math.abs(pt - xt) < 0.1;
      });
      g ? wt = !p && ht ? pt : x : wt = !p && !bt && ht ? pt : ft;
      var yt = J.map(function(xt) {
        var vt = xt.poses;
        return vt;
      }), Tt = Ov(yt, wt);
      return Tt;
    }
    var w = C(d, this.rotation, !0);
    g && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = v;
    var E = this.transformOrigin, k = this.rotation, D = this.scale, M = w.width, T = w.height, m = w.minX, _ = w.minY, j = Qh([
      [0, 0],
      [M, 0],
      [0, T],
      [M, T]
    ], Oo(E, M, T), this.rotation / 180 * Math.PI), O = br(j.result), R = O.minX, z = O.minY, A = " rotate(".concat(k, "deg)") + " scale(".concat(le(D[0]), ", ").concat(le(D[1]), ")"), W = "translate(".concat(-R, "px, ").concat(-z, "px)").concat(A);
    this.controlBox.style.transform = "translate3d(".concat(m, "px, ").concat(_, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(E, ";") + "width:".concat(M, "px;height:").concat(T, "px;") + "transform: ".concat(W), o.width = M, o.height = T;
    var $ = this.getContainer(), F = Ui(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || $, []), q = [F.left, F.top], V = N(ke(F), 4), L = V[0], rt = V[1], at = V[2], Z = V[3], nt = br([L, rt, at, Z]), et = [nt.minX, nt.minY], ot = le(D[0] * D[1]);
    F.pos1 = mt(L, et), F.pos2 = mt(rt, et), F.pos3 = mt(at, et), F.pos4 = mt(Z, et), F.left = m - F.left + et[0], F.top = _ - F.top + et[1], F.origin = mt(It(q, F.origin), et), F.beforeOrigin = mt(It(q, F.beforeOrigin), et), F.originalBeforeOrigin = It(q, F.originalBeforeOrigin), F.transformOrigin = mt(It(q, F.transformOrigin), et), u.style.transform = "translate(".concat(-R - et[0], "px, ").concat(-z - et[1], "px)") + A, Wr(), this.updateState(P(P({}, F), { posDelta: et, direction: ot, beforeDirection: ot }), a);
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
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (zr(this, !1), zr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = vc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = gc(this, "GroupControl")));
    var d = !qi(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !ic(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = P(P({}, Hr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Hr), jv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), tt.createElement(o, { cspNonce: i, ref: rr(this, "controlBox"), className: gt("control-box") }, l.map(function(d, p) {
      var v, g, x = (g = (v = a.individualGroupableProps) === null || v === void 0 ? void 0 : v.call(a, d, p)) !== null && g !== void 0 ? g : {};
      return tt.createElement(Hr, P({ key: "moveable" + p, ref: $l(r, "moveables", p) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[p] }));
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
function bc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Ee(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push.apply(r, Q([], N(bc(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function Sc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Ee(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push(Sc(n, e)) : r.push(n);
    }
  }), r;
}
function Cc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Ht(r) && Ht(a) ? Cc(r, a) : !0 : !1;
  });
}
var zv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new au(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = qr(r).join(`
`);
    this.defaultStyled = cu("div", od(mo, bp + a));
  }, e.getTotalAbles = function() {
    return Q([uc, Ao, xc, lc], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = sp(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = bc(u, c), d = f.length > 1, p = n.getTotalAbles(), v = Q(Q([], N(p), !1), N(i || []), !1), g = P(P(P({}, s), o || {}), { ables: v, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, C = s.persistData;
    if (C != null && C.children && (d = !0), s.individualGroupable)
      return tt.createElement(jv, P({ key: "individual-group", ref: rr(this, "moveable") }, g, { target: null, targets: f }));
    if (d) {
      var w = Sc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var E = y.props.target;
        E && f.indexOf(E) > -1 && (x = P({}, y.state));
      }
      return tt.createElement(Nv, P({ key: "group", ref: rr(this, "moveable") }, g, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var k = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var D = y.moveables || [], M = xe(D, function(T) {
          return T.props.target === k;
        });
        M && (x = P({}, M.state));
      }
      return tt.createElement(Hr, P({ key: "single", ref: rr(this, "moveable") }, g, { target: k, firstRenderState: x }));
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
    var n = this.refTargets, a = Po(this.props.target || this.props.targets), i = typeof document < "u", o = Cc(n, a), s = this.selectorMap, l = {};
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
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, lp([
    ql(wp)
  ], e.prototype, "moveable", void 0), e;
})(tt.PureComponent), Av = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = Pv, e;
})(zv), Ki = function(t, e) {
  return Ki = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ki(t, e);
};
function Bv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ki(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function Gv(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Pn = Gv(function(t, e) {
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
var Fv = Pn.names;
Pn.title;
var hl = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, vl = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function wc(t, e) {
  var r = (Fv[t] || e || "").toLowerCase();
  for (var n in hl)
    r = r.replace(n, hl[n]);
  return r.replace(/\s/g, "");
}
function Ec(t, e) {
  e === void 0 && (e = wc(t.keyCode, t.key));
  var r = Lv(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function Lv(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function gl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = vl[r] || 5, i = vl[n] || 5;
    return a - i;
  }), e;
}
var ml, Wv = /* @__PURE__ */ (function(t) {
  Bv(e, t);
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
      return ml || (ml = new e());
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
    return Ht(a) ? this.on("".concat(n, ".").concat(gl(a).join(".")), i) : Ee(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Ht(a) ? this.off("".concat(n, ".").concat(gl(a).join(".")), i) : Ee(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = wc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = Ec(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(Mn), Zi = function(t, e) {
  return Zi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Zi(t, e);
};
function Dc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Zi(t, e);
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
function Yv(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Xv(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function xn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Hv(t) {
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
function $v(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function qv(t, e, r) {
  var n = Ie(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function kc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Ie(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, p) {
    kc(d, c[p], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !te(l, d) && lo(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function Vv(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = Yv(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function hi(t, e, r) {
  t !== e && r(t, e);
}
function xl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var p = Math.abs(i), v = Math.abs(s), g = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = so([p, v], [0, 0], [g, x], !!e), p = n[0], v = n[1], i = (i >= 0 ? 1 : -1) * p, s = (s >= 0 ? 1 : -1) * v;
  var y = Math.min(0, i), C = Math.min(0, s), w = u + y, E = c + C;
  return {
    left: w,
    top: E,
    right: w + p,
    bottom: E + v,
    width: p,
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
function yl(t, e, r) {
  var n = Pr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return xn(xn(xn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function bl(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Be(t[n], t[n - 1]), e);
  return e;
}
var Mc = uu(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Ji = "selecto-selection ".concat(Mc.className), Bo = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Uv = xn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], Bo), _c = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Kv = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], Zv = /* @__PURE__ */ (function(t) {
  Dc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new iu(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, p = a.options, v = p.selectFromInside, g = p.selectByClick, x = p.rootContainer, y = p.boundContainer, C = p.preventDragFromInside, w = C === void 0 ? !0 : C, E = p.clickBySelectEnd, k = p.dragCondition;
      if (k && !k(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var D = Ce(a.container);
      u.innerWidth = D.innerWidth, u.innerHeight = D.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = po(), u.containerX = 0, u.containerY = 0;
      var M = a.container, T = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var m = a.container.getBoundingClientRect();
        u.containerX = m.left, u.containerY = m.top, u.scaleMatrix = Pd(a.container, x);
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
          Ee(j) ? O = Ie(M).querySelector(j) : j === !0 ? O = a.container : O = j;
          var R = O.getBoundingClientRect();
          _.left && (T.left = R.left), _.top && (T.top = R.top), _.right && (T.right = R.right), _.bottom && (T.bottom = R.bottom);
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
      }, A = [], W = g && !E, $ = !1;
      if (!v || W) {
        var F = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        $ = !!F, W && (A = F ? [F] : []);
      }
      var q = !v && $;
      if (q && !g)
        return s.stop(), !1;
      var V = d.type, L = V === "mousedown" || V === "touchstart", rt = !s.isClick && L ? a.emit("dragStart", Zt(Zt({}, s), {
        data: u.data
      })) : !0;
      if (!rt)
        return s.stop(), !1;
      if (a.continueSelect ? (A = yl(a.selectedTargets, A, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(A, z, s, !0, q && g && !E && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var at = pa(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(at[0], "px, ").concat(at[1], "px)");
      }
      if (q && g && !E)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, z, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var Z = a.options, nt = Z.scrollOptions, et = Z.innerScrollOptions, ot = !1;
        if (et) {
          for (var it = s.inputEvent, ft = it.target, bt = null, J = ft; J && J !== Ie(M).body; ) {
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
          }, et === !0 ? {} : et), a.dragScroll.dragStart(s, u.innerScrollOptions), ot = !0);
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
      var l = s.data, u = s.inputEvent, c = xl(s, a.options.ratio), f = l.selectFlag, d = a.container;
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
        var p = a._findElement((u == null ? void 0 : u.target) || qv(d, s.clientX, s.clientY), l.selectableTargets);
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
        var c = Cn(u) ? [u] : [].slice.call(u), f = s.target;
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
      return Ri(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ra(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (Cn(i))
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
        for (var p = f.parentElement, v = [], g = [], x = function() {
          var y = c.get(p);
          if (!y) {
            var C = getComputedStyle(p).overflow !== "visible";
            if (C) {
              var w = sa(p);
              y = {
                parentElement: p,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: xn([], g)
              }, v.push(p), v.forEach(function(E) {
                c.set(E, y);
              }), v = [];
            }
          }
          y ? (p = y.parentElement, c.get(p).indexes.push(d), g.push(p)) : v.push(p), p = p.parentElement;
        }; p && p !== u.body; )
          x();
        return g;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = Hv(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new Wv(a || Ce(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Ji, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    hi(i.keyContainer, n, function() {
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
    hi(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    hi(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, p = this.container;
    this.target = kc(Vv("div", {
      className: "".concat(Ji, " ").concat(d || "")
    }), this.target, p);
    var v = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Ie(p).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new lu(this.dragContainer, {
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
    }), Jt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Mc.inject(v, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, p = n.bottom, v = a.innerGroups, g = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, C = o == null ? void 0 : o.clientY, w = a.ignoreClick, E = [[c, f], [d, f], [d, p], [c, p]], k = function(F, q) {
      var V = mr(typeof l == "function" ? "".concat(l(q)) : "".concat(l)), L = w ? !1 : ya([y, C], F);
      if (!i && u && L)
        return !0;
      var rt = Oi(E, F);
      if (!rt.length)
        return !1;
      var at = dn(rt), Z = 0;
      if (at === 0 && dn(F) === 0 ? (Z = bl(F), at = bl(rt)) : Z = dn(F), V.unit === "px")
        return at >= V.value;
      var nt = ma(Math.round(at / Z * 100), 0, 100);
      return nt >= Math.min(100, V.value);
    }, D = a.selectableTargets, M = a.selectablePoints, T = a.selectableInners;
    if (!v)
      return D.filter(function(F, q) {
        return T[q] ? k(M[q], D[q]) : !1;
      });
    for (var m = [], _ = Math.floor(c / g), j = Math.floor(d / g), O = Math.floor(f / x), R = Math.floor(p / x), z = _; z <= j; ++z) {
      var A = v[z];
      if (A)
        for (var W = O; W <= R; ++W) {
          var $ = A[W];
          $ && $.forEach(function(F) {
            var q = M[F], V = T[F], L = D[F];
            V && k(q, L) && m.push(L);
          });
        }
    }
    return $v(m);
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
          var v = u.selectableInnerScrollParentMap, g = v.get(d);
          g && (g.paths.forEach(function(x) {
            var y = v.get(x);
            y.points.forEach(function(C) {
              C[0] -= i, C[1] -= o;
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
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Pr(u.startSelectedTargets, n), d = f.added, p = f.removed, v = f.prevList, g = f.list, x = {
      startSelected: v,
      startAdded: d.map(function(y) {
        return g[y];
      }),
      startRemoved: p.map(function(y) {
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
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", p = Pr(n, this.selectedTargets), v = p.added, g = p.removed, x = p.prevList, y = p.list, C = Pr(a, this.selectedTargets), w = C.added, E = C.removed, k = C.prevList, D = C.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: v.map(function(M) {
        return y[M];
      }),
      removed: g.map(function(M) {
        return x[M];
      }),
      afterAdded: w.map(function(M) {
        return D[M];
      }),
      afterRemoved: E.map(function(M) {
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
    a === void 0 && (a = xl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, p = i.scaleMatrix, v = pa(p, [s - f, o - d]), g = pa(p, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(v[0], "px, ").concat(v[1], "px);") + "width:".concat(g[0], "px;height:").concat(g[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = yl(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
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
    var o = Ec(n.inputEvent, n.key), s = [].concat(a), l = Ht(s[0]) ? s : [s];
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
        var g = !1;
        return p.every(function(x) {
          if (g)
            return !0;
          if (x === l)
            return g = !0, !0;
          var y = u.get(x);
          if (y) {
            var C = s[v], w = y.points, E = Oi(C, w);
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
      f.forEach(function(p, v) {
        var g = 1 / 0, x = -1 / 0, y = 1 / 0, C = -1 / 0;
        p.forEach(function(k) {
          var D = Math.floor(k[0] / i), M = Math.floor(k[1] / o);
          g = Math.min(D, g), x = Math.max(D, x), y = Math.min(M, y), C = Math.max(M, C);
        });
        for (var w = g; w <= x; ++w)
          for (var E = y; E <= C; ++E)
            d[w] = d[w] || {}, d[w][E] = d[w][E] || [], d[w][E].push(v);
      }), n.innerGroups = d;
    }
  }, e = Xv([sd(Bo, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = Di("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = Di("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(Mn), Jv = /* @__PURE__ */ (function(t) {
  Dc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(Zv), Qi = function(t, e) {
  return Qi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Qi(t, e);
};
function Qv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Qi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ta = function() {
  return Ta = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ta.apply(this, arguments);
};
function tg(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var Sl = _c.map(function(t) {
  return Di("on ".concat(t));
}), eg = /* @__PURE__ */ (function(t) {
  Qv(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return tt.createElement("div", {
      className: Ji,
      ref: rr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    Uv.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Jv(Ta(Ta({}, i), {
      portalContainer: this.selectionElement
    })), _c.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[Sl[s]] && u[Sl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    Bo.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, tg([ql(Kv)], e.prototype, "selecto", void 0), e;
})(tt.PureComponent);
function la(t, e, r) {
  const n = e + r;
  if (n < 0 || n >= t.length) return t.slice();
  const a = t.slice(), [i] = a.splice(e, 1);
  return a.splice(n, 0, i), a;
}
function rg({ recipe: t, onChange: e }) {
  const { t: r } = $r(), n = (c) => e({ ...t, ...c }), a = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.name) ?? `#${c}`;
  }, i = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.colour) ?? "#888";
  }, o = (c, f) => n({ columns: t.columns.map((d, p) => p === c ? { ...d, ...f } : d) }), s = new Set(t.columns.filter((c) => c.kind === "channel").map((c) => c.slot)), l = t.columns.some((c) => c.kind === "merge"), u = t.display.filter((c) => !s.has(c.slot));
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
            disabled: !c.hidden && t.columns.filter((p) => !p.hidden).length <= 1,
            onChange: (p) => o(f, { hidden: !p.target.checked })
          }
        ),
        c.kind === "channel" && c.slot !== void 0 ? /* @__PURE__ */ b.jsx("span", { className: "gl-cell-chip", style: { background: c.grey ? "#bdbdbd" : i(c.slot) }, title: a(c.slot) }) : /* @__PURE__ */ b.jsx("span", { className: "gl-cellpanel-merge-mark", title: r("Merge"), children: "+" }),
        /* @__PURE__ */ b.jsx(
          "input",
          {
            className: "gl-cellpanel-text",
            value: c.header,
            "aria-label": r("Column name"),
            onChange: (p) => o(f, { header: p.target.value })
          }
        ),
        c.kind === "channel" && c.slot !== void 0 && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: r("Draw this channel in grey rather than its colour"), children: [
            /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: c.grey === !0, onChange: (p) => o(f, { grey: p.target.checked }) }),
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
              onChange: (p) => n({ gain: { ...t.gain ?? {}, [c.slot]: Math.pow(2, Number(p.target.value)) } })
            }
          )
        ] }),
        c.kind === "merge" && /* @__PURE__ */ b.jsx("span", { className: "gl-cellpanel-merge", children: t.display.map((p) => /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: p.name, children: [
          /* @__PURE__ */ b.jsx(
            "input",
            {
              type: "checkbox",
              checked: (c.slots ?? []).includes(p.slot),
              onChange: (v) => {
                const g = new Set(c.slots ?? []);
                v.target.checked ? g.add(p.slot) : g.delete(p.slot), o(f, { slots: t.display.map((x) => x.slot).filter((x) => g.has(x)) });
              }
            }
          ),
          /* @__PURE__ */ b.jsx("span", { className: "gl-cell-chip", style: { background: p.colour } })
        ] }, p.slot)) }),
        /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ columns: la(t.columns, f, -1) }), children: "↑" }),
        /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.columns.length - 1, onClick: () => n({ columns: la(t.columns, f, 1) }), children: "↓" }),
        c.kind === "merge" && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), onClick: () => n({ columns: t.columns.filter((p, v) => v !== f) }), children: "×" })
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
          onChange: (d) => n({ cells: t.cells.map((p, v) => v === f ? { ...p, label: d.target.value } : p) })
        }
      ),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ cells: la(t.cells, f, -1) }), children: "↑" }),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.cells.length - 1, onClick: () => n({ cells: la(t.cells, f, 1) }), children: "↓" }),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), disabled: t.cells.length <= 1, onClick: () => n({ cells: t.cells.filter((d, p) => p !== f) }), children: "×" })
    ] }, `${c.event}-${f}`)) })
  ] });
}
const Te = "http://www.w3.org/2000/svg";
function ua(t, e) {
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
function Cl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Te, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || df), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function ng(t, e) {
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
function wl(t, e, r, n, a, i, o) {
  const s = gr(e, r, n, i), l = document.createElementNS(Te, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Te, "image"), d = gr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", pf(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, p = d > 0 ? s.width / d : 1;
    if (Math.abs(p - 1) > 1e-3) {
      const v = document.createElementNS(Te, "g");
      v.setAttribute("transform", `scale(${p})`), v.appendChild(f), l.appendChild(v);
    } else l.appendChild(f);
  }
  Ol(l, o), t.appendChild(l);
}
function El(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: gr(a, e, r, n) }));
}
function ag(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * Si, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function ig(t, e, r) {
  var v, g;
  const n = bi(e.page), a = va(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? ag(El(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(Te, "svg");
  c.setAttribute("xmlns", Te), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(Te, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: y } of El(t, i, r.zoom, s)) {
    if (y.left >= l || y.top >= u || y.left + y.width <= 0 || y.top + y.height <= 0) continue;
    d += 1;
    const C = x.dataset.title ?? ((v = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : v.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const M = document.createElementNS(Te, "rect");
      M.setAttribute("x", String(Math.round(y.left) + 0.5)), M.setAttribute("y", String(Math.round(y.top) + 0.5)), M.setAttribute("width", String(Math.round(y.width) - 1)), M.setAttribute("height", String(Math.round(y.height) - 1)), M.setAttribute("fill", "none"), M.setAttribute("stroke", "#94a3b8"), M.setAttribute("id", on("frame", d, C)), c.appendChild(M);
    }
    const w = x.querySelector(".gl-layout-text-surface");
    if (w) {
      const M = w instanceof HTMLTextAreaElement ? w.value : w.textContent ?? "", T = getComputedStyle(w), m = gr(w, i, r.zoom, s), _ = Number(x.dataset.zoom) || 1, j = (parseFloat(T.fontSize) || 14) * _, O = (parseFloat(T.paddingLeft) || 0) * _, R = (parseFloat(T.paddingTop) || 0) * _, z = ((g = ng(w, M)) == null ? void 0 : g.map((W) => ({ text: W.text, left: W.left * _, top: W.top * _ }))) ?? M.split(`
`).map((W, $) => ({ text: W, left: 0, top: $ * j * 1.3 })), A = document.createElementNS(Te, "g");
      A.setAttribute("id", on("text", d, M.trim().split(/\s+/).slice(0, 4).join(" "))), Cl(A, z, m.left + O, m.top + R, j, T), c.appendChild(A);
      continue;
    }
    const E = x.querySelector(".gl-layout-plot-host");
    if (!E) continue;
    if (E.__miniPlotCfg) {
      wl(c, E, i, r.zoom, r.dpi, s, on("plot", d, C));
      continue;
    }
    const k = E.querySelector(".gl-prop-chart");
    if (k) {
      const M = cf(k);
      if (M) {
        const T = gr(k, i, r.zoom, s), m = M.width > 0 ? T.width / M.width : 1, _ = document.createElementNS(Te, "g");
        _.setAttribute("id", on("chart", d, C)), _.setAttribute("transform", `translate(${T.left},${T.top}) scale(${m})`), _.appendChild(M.root), c.appendChild(_);
      }
      continue;
    }
    E.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((M) => {
      const T = (M.textContent ?? "").trim();
      if (!T) return;
      const m = getComputedStyle(M), _ = gr(M, i, r.zoom, s), j = M.offsetWidth > 0 ? _.width / M.offsetWidth : 1;
      Cl(c, [{ text: T, left: 0, top: 0 }], _.left, _.top, (parseFloat(m.fontSize) || 12) * j, m);
    });
    const D = on(E.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, C);
    E.querySelectorAll(".mini-plot-cell").forEach((M, T) => wl(c, M, i, r.zoom, r.dpi, s, `${D}-panel-${T + 1}`)), E.querySelectorAll("svg.gl-strategy-arrows").forEach((M) => {
      const T = gr(M, i, r.zoom, s), m = Number(M.getAttribute("width")) || M.clientWidth || T.width, _ = m > 0 ? T.width / m : 1, j = document.createElementNS(Te, "g");
      j.setAttribute("transform", `translate(${Math.round(T.left)},${Math.round(T.top)}) scale(${_})`), Array.from(M.childNodes).forEach((O) => j.appendChild(O.cloneNode(!0))), Ol(j, `${D}-arrows`), c.appendChild(j);
    });
  }
  const p = o ? { widthMm: l / Si, heightMm: u / Si } : Nl(e.page);
  return ff(c, { widthPx: l, heightPx: u, ...p }), { root: c, width: l, height: u, ...p };
}
function Dl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function og(t, e, r) {
  return va(e.page).map((n, a) => ig(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const kl = 72 / 25.4;
async function sg(t, e, r) {
  const n = e.page.dpi, a = sf(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      ua(new Blob([Dl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[`${a}-p${f + 1}.svg`] = lf(Dl(c.root));
    }), ua(new Blob([gs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      ua(await ms(await Ja(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await Ja(f, n);
      u[`${a}-p${c + 1}.png`] = new Uint8Array(await (await ms(d, n)).arrayBuffer()), await xs();
    }
    ua(new Blob([gs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * kl, f = u.heightMm * kl;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-BSxem5QO.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: p } = i(c);
    if (u > 0 && l.addPage([f, d], p), !await uf(l, c.root, { width: f, height: d })) {
      const v = await Ja(c, n);
      l.addImage(v, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await xs();
  }
  l.save(`${a}.pdf`);
}
const lg = "", Tc = "{none}", ca = [
  { id: "auto", label: "What differs across the page", template: lg },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: Tc }
], vi = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function ug(t, e) {
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
const gi = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function Ml(t, e) {
  return t.join(e);
}
function cg(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function _l(t, e, r, n, a) {
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
function Ia(t, e) {
  return t.trim() === Tc ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function fg(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const dg = "Unassigned";
function Ic(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function Rc(t) {
  return ie(t.recipe) && t.recipe.iterated === !0;
}
function Tl(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function mi(t, e, r, n, a, i) {
  const o = Rc(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = Tl(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = Tl(s.title, e, r, n))), {
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
function pg(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !ie(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: Ia(r.recipe.text, i) });
    }
}
function hg(t, e, r) {
  const n = vg(t, e);
  for (const a of n) pg(a.items, r);
  return n;
}
function vg(t, e) {
  const r = t.iteration ?? jl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((p) => mi(p, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((p, v) => ({
      index: v,
      units: [p],
      items: t.items.map((g) => mi(g, p, v + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = hf(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let p = 0; p < n; p += u) {
    const v = e.slice(p, p + u), g = [];
    v.forEach((x, y) => {
      const C = o === "row-major" ? Math.floor(y / i) : y % a, E = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: C * f };
      for (const k of t.items) g.push(mi(k, x, p + y + 1, n, E, y));
    }), d.push({ index: d.length, units: v, items: g });
  }
  return d;
}
function Pc(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function gg(t, e, r, n, a) {
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
  return Pc(t.source, e, r, a).map(i);
}
function mg(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const p of Pc(t.source, e, r, a)) {
    const v = ((d = p.metadata) == null ? void 0 : d[o]) ?? "";
    if (!v) {
      l.push(p);
      continue;
    }
    s.set(v, [...s.get(v) ?? [], p]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((p) => s.has(p)), ...u.filter((p) => !i.includes(p)).sort(ys)] : u.sort(ys), f = (p, v) => {
    const g = new Set(v.map((x) => {
      var y;
      return (y = n.find((C) => C.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${p}`,
      name: p,
      fileName: `${v.length} files`,
      ...g.size === 1 && [...g][0] ? { groupName: [...g][0] } : {},
      metadata: Ic(v.map((x) => x.metadata)),
      sampleIds: v.map((x) => x.id)
    };
  };
  return [
    ...c.map((p) => f(p, s.get(p))),
    ...l.length ? [f(dg, l)] : []
  ];
}
function xg(t, e, r) {
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
  return da(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function yg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const bg = (t) => [...t].sort((e, r) => e - r);
function xi(t, e) {
  const r = bg(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function Sg(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: xi(r, 0.5),
    q1: xi(r, 0.25),
    q3: xi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function Cg(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => Sg(n, r.get(n)));
}
function Oc(t) {
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
function wg(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function Eg(t, e) {
  if (e <= 0) return 0;
  const r = Dg(t);
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
function Dg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function kg(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - Eg(e / 2, t / 2))) : 1;
}
function Mg(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = Oc([...t, ...e]), s = a.slice(0, r).reduce((p, v) => p + v, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * wg(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${Nc(d)}` };
}
function _g(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = Oc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, p) => d + p, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = kg(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${Nc(u)}` };
}
function Tg(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? Mg(e[0], e[1]) : e.length > 2 ? _g(e) : null;
}
function Nc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function Ig(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const jc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function Rg(t, e, r, n, a) {
  var d, p;
  const i = e.find((v) => v.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((v) => n.includes(v.id)), l = [], u = [];
  for (const v of s) {
    let g = t.populationId;
    if (i && i.tree.id !== v.tree.id) {
      const C = Ir(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        v.tree,
        cr(a)
      );
      if (!C.id) {
        u.push(v.name);
        continue;
      }
      g = C.id;
    }
    let x;
    if (t.statistic === "median") {
      const C = t.channel ? v.sample.index(t.channel) : void 0, w = v.derived.masks[g];
      if (C === void 0 || !w) x = null;
      else {
        const E = v.sample.displayColumn(C), k = [];
        for (let D = 0; D < E.length; D++) w[D] && Number.isFinite(E[D]) && k.push(E[D]);
        x = k.length ? vf(k) : null;
      }
    } else
      x = v.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][g];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((p = r[v.id]) == null ? void 0 : p[t.groupBy]) ?? "" : v.name;
    l.push({ sampleId: v.id, name: v.name, group: y, value: x });
  }
  const c = Cg(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : jc[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? Tg(c) : null, population: o, axis: f, missing: u };
}
const yi = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), Pg = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function Og({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = tt.useMemo(() => Ig(t.points.map((_) => _.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((_) => yi(_).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), p = Math.max(0, ...u.map((_) => _.label.length)), v = u.length > 0 && p * o * 0.6 > (n - f - 8) / u.length, g = 8 + (v ? p * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - g), C = (_) => d + y - (_ - c.min) / (c.max - c.min || 1) * y, w = u.length ? x / u.length : x, E = (_) => f + (_ + 0.5) * w, k = Math.min(48, w * 0.6), D = r.pubStyle ? "#000000" : "#334155", M = r.pubStyle ? "#d4d4d8" : "#93c5fd", T = r.pubStyle ? "#000000" : "#1d4ed8", m = C(Math.max(c.min, 0));
  return /* @__PURE__ */ b.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ b.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ b.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ b.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ b.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ b.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ b.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: D }),
      c.ticks.map((_) => /* @__PURE__ */ b.jsxs("g", { children: [
        /* @__PURE__ */ b.jsx("line", { x1: f - 4, x2: f, y1: C(_), y2: C(_), stroke: D }),
        /* @__PURE__ */ b.jsx("text", { x: f - 6, y: C(_), textAnchor: "end", dominantBaseline: "central", children: yi(_) })
      ] }, _)),
      /* @__PURE__ */ b.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ b.jsx("line", { x1: f, x2: f + x, y1: m, y2: m, stroke: D })
    ] }),
    /* @__PURE__ */ b.jsx("g", { className: "gl-layout-chart-groups", children: u.map((_, j) => {
      const O = E(j), R = e.showPoints || e.chartType === "dots" ? _.points : [];
      return /* @__PURE__ */ b.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(_.mean) && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsx("rect", { x: O - k / 2, y: Math.min(C(_.mean), m), width: k, height: Math.abs(m - C(_.mean)), fill: M, stroke: D, strokeWidth: 0.8 }),
          _.n > 1 && _.sd > 0 && /* @__PURE__ */ b.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ b.jsx("line", { x1: O, x2: O, y1: C(_.mean - _.sd), y2: C(_.mean + _.sd) }),
            /* @__PURE__ */ b.jsx("line", { x1: O - k / 4, x2: O + k / 4, y1: C(_.mean + _.sd), y2: C(_.mean + _.sd) }),
            /* @__PURE__ */ b.jsx("line", { x1: O - k / 4, x2: O + k / 4, y1: C(_.mean - _.sd), y2: C(_.mean - _.sd) })
          ] })
        ] }),
        e.chartType === "box" && _.n > 0 && /* @__PURE__ */ b.jsxs("g", { stroke: D, strokeWidth: 1, fill: M, children: [
          /* @__PURE__ */ b.jsx("line", { x1: O, x2: O, y1: C(_.min), y2: C(_.q1) }),
          /* @__PURE__ */ b.jsx("line", { x1: O, x2: O, y1: C(_.q3), y2: C(_.max) }),
          /* @__PURE__ */ b.jsx("rect", { x: O - k / 2, y: C(_.q3), width: k, height: Math.max(0.5, C(_.q1) - C(_.q3)) }),
          /* @__PURE__ */ b.jsx("line", { x1: O - k / 2, x2: O + k / 2, y1: C(_.median), y2: C(_.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && _.n > 1 && /* @__PURE__ */ b.jsx("line", { x1: O - k / 2, x2: O + k / 2, y1: C(_.mean), y2: C(_.mean), stroke: D, strokeWidth: 2 }),
        R.map((z, A) => /* @__PURE__ */ b.jsx("circle", { cx: O + Pg(A + j * 31) * k * 0.3, cy: C(z.value), r: Math.max(2, o * 0.28), fill: T, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ b.jsx("title", { children: `${z.name}: ${yi(z.value)}` }) }, z.sampleId)),
        /* @__PURE__ */ b.jsx(
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
    t.test && u.length >= 2 && /* @__PURE__ */ b.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ b.jsx("line", { x1: E(0), x2: E(u.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ b.jsx("text", { x: (E(0) + E(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const Ng = tt.lazy(Al("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-B1sC70V9.js")).LayoutImageWall }))), jg = tt.lazy(Al("LayoutCellPanel", async () => ({ default: (await import("./LayoutCellPanel-C4UExL0s.js")).LayoutCellPanel }))), fa = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), zg = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, sn = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], Il = 10, Ag = { index: 0, units: [], items: [] }, Bg = {}, Rl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, Gg = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], Fg = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function Lg(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Wg(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function Yg(t, e, r) {
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
  if (n.kind === "cellpanel") return `${n.cells.length} ${n.cells.length === 1 ? "cell" : "cells"} · ${n.fileName || "images"}`;
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${jc[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = yn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${zl("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function yn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function to(t, e, r, n) {
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
    const d = Ci(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const p = f === i ? null : Ef(i.sample, f.sample, t.xChannel, l);
    if (p) {
      s.push({ name: f.name, reason: p });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function Xg({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = $r(), [l, u] = tt.useState(""), c = tt.useMemo(
    () => Object.fromEntries(t.filter((g) => g.metadata).map((g) => [g.id, g.metadata])),
    [t]
  ), f = tt.useMemo(
    () => Tf(c, [...new Set(Object.values(c).flatMap((g) => Object.keys(g)))].map((g) => ({ name: g }))),
    [c]
  ), d = tt.useMemo(() => new Set(t.filter((g) => !e.includes(g.id)).map((g) => g.id)), [t, e]), p = (g) => t.filter((x) => g instanceof Set ? g.has(x.id) : g.includes(x.id)).map((x) => x.id), v = l.trim().toLowerCase();
  return /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(p(r)), children: s("Checked files") }),
      /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(t.map((g) => g.id)), children: s("All files") }),
      n.map((g) => /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(t.filter((x) => a[x.id] === g.id).map((x) => x.id)), children: s("Group {name}", { name: g.name }) }, g.id))
    ] }),
    /* @__PURE__ */ b.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (g) => u(g.target.value)
      }
    ),
    /* @__PURE__ */ b.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((g) => !v || `${g.name} ${g.fileName ?? ""}`.toLowerCase().includes(v)).map((g) => /* @__PURE__ */ b.jsxs("label", { className: "gl-figure-row", title: g.fileName && g.fileName !== g.name ? `${g.name} · ${g.fileName}` : g.name, children: [
      /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(g.id),
          onChange: () => o(e.includes(g.id) ? e.filter((x) => x !== g.id) : p([...e, g.id]))
        }
      ),
      /* @__PURE__ */ b.jsx("span", { className: "gl-figure-row-name", children: g.name })
    ] }, g.id)) }),
    f.length > 0 && /* @__PURE__ */ b.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((g) => /* @__PURE__ */ b.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-name", title: g.name, children: g.name }),
      /* @__PURE__ */ b.jsx("div", { className: "gl-sample-facet-values", children: g.values.map((x) => {
        const y = If(x.sampleIds, d), C = x.sampleIds.length, w = y === C ? "all" : y === 0 ? "none" : "some", E = C > 0 ? Math.round(y / C * 100) : 0;
        return /* @__PURE__ */ b.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${E}%` } : void 0,
            "aria-pressed": y === C,
            title: `${x.value}: ${y} of ${C} pooled — ${y === C ? `click to drop all ${C}` : `click to pool all ${C}`}`,
            onClick: () => o(p(new Set(t.filter((k) => !Rf(x.sampleIds, d).has(k.id)).map((k) => k.id)))),
            children: [
              /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-label", children: x.value }),
              /* @__PURE__ */ b.jsxs("span", { className: "gl-sample-facet-count", children: [
                y,
                "/",
                C
              ] })
            ]
          },
          x.value
        );
      }) })
    ] }, g.name)) }),
    i && /* @__PURE__ */ b.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((g) => `${g.name} (${g.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function Hg({
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
  const c = tt.useRef(null), f = t.recipe, d = JSON.stringify(o), p = tt.useMemo(() => cr(r), [r]), v = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, g = yn(f), x = (g == null ? void 0 : g.join("|")) ?? "", y = tt.useMemo(
    () => x ? x.split("|").map((R) => e.find((z) => z.id === R) ?? null) : null,
    [e, x]
  ), C = v ? { ...r, ...v.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, E = f.kind === "text" || !v ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : Ci(f.populationId, v.tree, p, w == null ? void 0 : w.tree.id), k = E.id, D = E.missing ? ((j = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : j.name) ?? "the population" : null, M = f.kind === "text" ? null : u({ ...f, populationId: k }, void 0, t.unitId), T = (R) => M ? Ia(R, M) : R, m = f.kind === "strategy" ? T(((O = f.title) == null ? void 0 : O.trim()) || "{population}") : T(l), _ = JSON.stringify(f);
  return tt.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    const z = window.setTimeout(() => {
      var nt, et, ot;
      if (R.innerHTML = "", !v) {
        R.textContent = zl("The referenced file is unavailable or still loading."), R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const A = C.populations[k];
      if (D || !A) {
        R.textContent = D ? `${v.name} has no population corresponding to ${D}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const W = Math.max(120, t.width - 8), $ = Math.max(120, t.height - 8);
      if (f.kind === "strategy" && ((nt = f.populationIds) != null && nt.length)) {
        const it = v.tree, ft = it.root_population_id ?? "", bt = f.populationIds.map((Rt) => Ci(Rt, it, p, w == null ? void 0 : w.tree.id)).filter((Rt) => !Rt.missing).map((Rt) => Rt.id), J = Bf(v.sample, it.gates, it.populations, ft, v.derived.masks, bt, { maxEvents: o.maxEvents, globalScales: n }), lt = Math.max(1, f.columns ?? 4), wt = f.layout === "flow" ? Gf(J, lt, it.populations) : Ff(J, it.populations);
        if (!wt.length) {
          R.textContent = `${v.name} has none of the strategy's populations.`, R.className = "gl-layout-plot-host is-missing";
          return;
        }
        const pt = f.showArrows !== !1, ht = pt ? Lf(wt, it.populations) : [], yt = pt ? Wf(ht) : 8, Tt = pt ? Yf(ht) : 8, xt = Math.max(120, Math.min(800, f.plotSize ?? 200));
        R.removeAttribute("id");
        const vt = document.createElement("div");
        vt.id = `layout-strategy-${t.id}`, vt.style.width = "max-content", R.appendChild(vt);
        const Mt = (Rt) => {
          const Gt = Kf(wt, {
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
            fontSizes: fa(o),
            contextTitle: m
          });
          ti().renderMultiStrategyGrid(vt.id, Gt);
        };
        Mt(1), pt && Xf(vt);
        const At = vt.scrollWidth, qt = vt.scrollHeight, Lt = At > 0 && qt > 0 ? Math.max(0.1, Math.min(4, W / At, $ / qt)) : 1;
        Math.abs(Lt - 1) > 0.01 && (vt.style.zoom = String(Lt), Mt(Lt)), Hf(vt, ht, { color: f.arrowColor ?? (o.pubStyle ? "#444444" : null), width: f.arrowWidth ?? 1.5, anchor: f.arrowAnchor ?? "label" });
        return;
      }
      if (f.kind === "strategy") {
        const it = $f(
          v.sample,
          C.gates,
          C.populations,
          C.root_population_id ?? "",
          k,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), ft = 8, bt = 26, J = Math.max(1, it.length);
        let lt = 1, wt = 0;
        for (let ht = 1; ht <= J; ht++) {
          const yt = Math.ceil(J / ht), Tt = Math.floor((W - ft * (ht - 1)) / ht), xt = Math.floor(($ - bt - ft * (yt - 1)) / yt), vt = Math.min(Tt, xt);
          vt > wt && (wt = vt, lt = ht);
        }
        wt = Math.max(100, Math.min(800, wt));
        const pt = qf(
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
            fontSizes: fa(o),
            contextTitle: m
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const ht of Object.values(pt.plots ?? {})) ht.canvas_scale = s;
        ti().renderStrategyGrid(R.id, pt);
        return;
      }
      const F = Math.max(120, Math.min(W, $)), q = f.kind === "histogram" ? null : f.yChannel, V = {
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
        fontSizes: fa(o),
        scaleFontsWithPlot: !0
      }, L = (it, ft) => ti().renderMiniPlot(R, {
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
        font_sizes: fa(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: ft
      });
      if (y) {
        const { members: it } = to(f, e, p, w == null ? void 0 : w.tree.id), ft = it.length ? Vf(it, f.xChannel, q, n, V, p) : null;
        if (!ft) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        L(ft.config, ft.gates);
        return;
      }
      const rt = Uf(
        v.sample,
        C.gates,
        C.gate_order,
        C.populations,
        v.derived.masks,
        v.derived.stats.event_count,
        [k],
        [f.xChannel],
        q,
        n,
        V,
        v.derived.gateMasks
      ), at = `${k}|${f.xChannel}`, Z = (et = rt.plots) == null ? void 0 : et[at];
      if (!Z) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      L(Z, ((ot = rt.gate_overlays) == null ? void 0 : ot[at]) ?? []);
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
    k,
    D,
    s,
    m,
    y,
    p
  ]), f.kind === "text" ? /* @__PURE__ */ b.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ b.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function $g({
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
  divisionProfiles: g,
  imageService: x,
  canvasScale: y,
  onTextChange: C,
  onTextFocus: w,
  textEditing: E,
  onTextEditStart: k,
  onTextEditEnd: D,
  onIsolate: M
}) {
  var j;
  const { t: T } = $r(), m = jf(t), _ = m === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / m)), height: Math.max(1, Math.round(t.height / m)) };
  return /* @__PURE__ */ b.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": m === 1 ? void 0 : m,
      title: `${t.locked ? `${T("Locked")} · ` : ""}${He(t, n)}`,
      "data-title": He(t, n),
      onDoubleClick: M ? (O) => {
        O.stopPropagation(), M();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-item-body", style: m === 1 ? void 0 : { zoom: m, width: _.width, height: _.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ b.jsx(
        Vg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: E,
          onEditStart: k,
          onEditEnd: D,
          onCommit: C,
          onFocus: w
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ b.jsx(
        zf,
        {
          recipe: t.recipe,
          files: p,
          sources: v,
          state: a,
          globalScales: i,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ b.jsx(
        Af,
        {
          recipe: t.recipe,
          samples: p,
          state: a,
          metadataById: d,
          divisionProfiles: g,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "cellpanel" ? /* @__PURE__ */ b.jsx(tt.Suspense, { fallback: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ b.jsx(
        jg,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) }) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ b.jsx(tt.Suspense, { fallback: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ b.jsx(
        Ng,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ b.jsx(
        Og,
        {
          data: Rg(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          title: ((j = t.recipe.title) == null ? void 0 : j.trim()) || He(t, n)
        }
      ) }) : /* @__PURE__ */ b.jsx(
        Hg,
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
const qg = [
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
function Pl({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = $r();
  return /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-style-fields", children: [
    qg.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ b.jsxs(tt.Fragment, { children: [
      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ b.jsx(
          de,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? ks.maxEvents : t[a],
            min: Ds[a][0],
            max: Ds[a][1],
            step: o,
            integer: s,
            disabled: a === "maxEvents" && t.maxEvents === 0,
            onCommit: (l) => r({ [a]: l })
          }
        )
      ] }),
      a === "maxEvents" && // An event cap of 0 is every event, as on the Gating tab: a pooled plot of a whole SCE
      // can then be drawn as the Gating tab's pooled view draws it.
      /* @__PURE__ */ b.jsxs("label", { className: "gl-check" + ("maxEvents" in e ? " is-own" : ""), title: n("Draw every event of the plot's files rather than a sample of them; a plot of a million points repaints slowly. Counts and percentages always use every event."), children: [
        /* @__PURE__ */ b.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.maxEvents === 0,
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : ks.maxEvents })
          }
        ),
        n("All events")
      ] })
    ] }, a)),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      n("Gate labels"),
      /* @__PURE__ */ b.jsxs(
        "select",
        {
          "aria-label": n("Gate labels"),
          value: t.gateLabels,
          onChange: (a) => r({ gateLabels: a.target.value }),
          children: [
            /* @__PURE__ */ b.jsx("option", { value: "name-percent", children: n("Name and percentage") }),
            /* @__PURE__ */ b.jsx("option", { value: "percent", children: n("Percentage") }),
            /* @__PURE__ */ b.jsx("option", { value: "number", children: n("Number only") }),
            /* @__PURE__ */ b.jsx("option", { value: "name", children: n("Name only") }),
            /* @__PURE__ */ b.jsx("option", { value: "none", children: n("None") })
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
          onChange: (a) => r({ pubStyle: a.target.checked })
        }
      ),
      n("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ b.jsx(
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
function Vg({
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
  const { t: u } = $r(), [c, f] = tt.useState(e), d = tt.useRef(null);
  tt.useEffect(() => {
    if (!a) return;
    f(e);
    const v = d.current;
    v && (v.focus({ preventScroll: !0 }), v.setSelectionRange(v.value.length, v.value.length));
  }, [a]);
  const p = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ b.jsx(
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
  ) : /* @__PURE__ */ b.jsx(
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
function Kg({
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
  defaultY: v,
  illustrationConfig: g,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: C = Bg,
  imageService: w = null,
  onOpenInPlotting: E,
  dataRevision: k,
  densityColorPower: D,
  onOpenInGating: M,
  onExported: T
}) {
  var us, cs, fs, ds, ps, hs;
  const { t: m } = $r(), [_, j] = tt.useState([]), [O, R] = tt.useState(null), [z, A] = tt.useState(!0), [W, $] = tt.useState(null), [F, q] = tt.useState(null), [V, L] = tt.useState([]), [rt, at] = tt.useState([]), Z = tt.useRef(null), nt = tt.useRef(null), [et, ot] = tt.useState(null), [it, ft] = tt.useState(null), [bt, J] = tt.useState(
    u ?? ((us = r[0]) == null ? void 0 : us.id) ?? ""
  ), [lt, wt] = tt.useState("item"), [pt, ht] = tt.useState(!1), [yt, Tt] = tt.useState({ shift: !1, meta: !1 });
  tt.useEffect(() => {
    const h = (I) => Tt((B) => {
      const G = { shift: I.shiftKey, meta: I.metaKey || I.ctrlKey };
      return G.shift === B.shift && G.meta === B.meta ? B : G;
    }), S = () => Tt((I) => I.shift || I.meta ? { shift: !1, meta: !1 } : I);
    return window.addEventListener("keydown", h), window.addEventListener("keyup", h), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", h), window.removeEventListener("keyup", h), window.removeEventListener("blur", S);
    };
  }, []);
  const [xt, vt] = tt.useState(1), Mt = tt.useRef(xt);
  Mt.current = xt;
  const [At, qt] = tt.useState(xt);
  tt.useEffect(() => {
    const h = window.setTimeout(() => qt(xt), 250);
    return () => window.clearTimeout(h);
  }, [xt]);
  const Lt = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * At)), [Rt, Gt] = tt.useState("pdf"), [ve, Ne] = tt.useState(!1), [Zr, On] = tt.useState(3), [sr, lr] = tt.useState(!1), Ve = tt.useRef(null), Jr = tt.useRef(null), Le = (h) => {
    var S;
    j(h), (S = Ve.current) == null || S.focus({ preventScroll: !0 });
  }, Qr = (h) => Le(h ? [h] : []), Me = gf(
    r,
    r.map((h) => h.id),
    f,
    k
  ), Pt = tt.useMemo(
    () => Me.current ? Me.sources.map((h) => ({ ...h, derived: h.gating })) : [],
    [Me.current, Me.sources]
  ), Er = tt.useMemo(
    () => Object.fromEntries(r.map((h) => [h.id, h.metadata])),
    [r]
  ), je = tt.useMemo(() => cr(f), [f]), Ct = r.length === 0 || Me.current && Me.pending === 0, Wt = tt.useRef([]), Ue = tt.useRef([]), K = t.sheets.find(({ id: h }) => h === t.activeSheetId) ?? t.sheets[0], dt = (K == null ? void 0 : K.iteration) ?? jl, Yt = tt.useMemo(() => {
    const h = K == null ? void 0 : K.items.find((I) => ie(I.recipe) && I.recipe.iterated === !0), S = h && "sampleId" in h.recipe ? h.recipe.sampleId : u;
    return Pt.find(({ id: I }) => I === S) ?? Pt[0] ?? null;
  }, [K, Pt, u]), Ke = tt.useMemo(
    () => dt.mode === "populations" ? Yt ? xg(dt, Yt.tree, r.find(({ id: h }) => h === Yt.id) ?? Yt) : [] : dt.mode === "metadata" ? mg(dt, r, n, a, i, s == null ? void 0 : s[dt.column ?? ""]) : gg(dt, r, n, a, i),
    [dt, r, n, a, i, Yt, s]
  ), Dr = tt.useCallback((h, S, I) => {
    var ut;
    const B = r.find(({ id: _t }) => _t === h.sampleId) ?? null, G = Pt.find(({ id: _t }) => _t === h.sampleId) ?? null;
    let X = h.populationId;
    if (G && S && S !== h.sampleId) {
      const _t = Pt.find(({ id: ee }) => ee === S);
      if (_t && _t.tree.id !== G.tree.id) {
        const ee = Ir({ hierarchyId: _t.tree.id, populationId: h.populationId }, G.tree, cr(f));
        ee.id && (X = ee.id);
      }
    }
    const Y = G == null ? void 0 : G.tree.populations[X], st = yn(h);
    if (st && h.kind !== "strategy") {
      const { members: _t } = to(h, Pt, je, S ? (ut = Pt.find(({ id: Ut }) => Ut === S)) == null ? void 0 : ut.tree.id : void 0), ee = _t.reduce((Ut, vs) => Ut + (vs.gating.stats.event_count[vs.populationId] ?? 0), 0), be = I ? Ke.find((Ut) => Ut.id === I) : void 0;
      return _l(
        h,
        { name: be != null && be.sampleIds ? be.name : `${st.length} files`, fileName: `${st.length} files`, metadata: Ic(st.map((Ut) => Er[Ut])) },
        Y ? { id: X, name: Y.name } : null,
        _t.length ? ee : void 0,
        l
      );
    }
    const kt = G == null ? void 0 : G.derived.stats.event_count[X];
    return _l(
      h.kind === "strategy" ? {} : h,
      B ? { name: B.name, fileName: B.fileName ?? B.name, metadata: B.metadata } : null,
      Y ? { id: X, name: Y.name } : null,
      typeof kt == "number" ? kt : void 0,
      l
    );
  }, [r, Pt, f, l, je, Er, Ke]), ge = tt.useMemo(
    () => K ? hg(K, Ke, Dr) : [],
    [K, Ke, Dr]
  ), [La, kr] = tt.useState(0), [Go, zc] = tt.useState(!1), [Ac, Bc] = tt.useState(" · "), Fo = tt.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((h) => Object.keys(h)))].sort(),
    [l]
  ), Lo = tt.useMemo(() => ug(o, Fo), [o, Fo]), ze = Math.min(La, Math.max(0, ge.length - 1)), Vt = ge[ze] ?? Ag, Wo = ((cs = K == null ? void 0 : K.titleTemplate) == null ? void 0 : cs.trim()) || fg(
    Vt.items.flatMap((h) => {
      var S;
      return ie(h.recipe) ? [{ sampleId: ((S = yn(h.recipe)) == null ? void 0 : S.join(",")) ?? h.recipe.sampleId, populationId: h.recipe.populationId, label: h.recipe.kind === "strategy" ? void 0 : h.recipe.label }] : [];
    }),
    dt.mode === "metadata" ? { metadataColumn: dt.column } : void 0
  );
  tt.useEffect(() => {
    La !== ze && kr(ze);
  }, [La, ze]);
  const tn = (h) => h.split("::")[0], ae = [...new Set(_.map(tn))], fe = (K == null ? void 0 : K.items.filter(({ id: h }) => ae.includes(h))) ?? [], U = fe.length === 1 ? fe[0] : null, Ae = U ? Vt.items.find((h) => h.templateId === U.id) ?? null : null, Yo = (h) => h.split("::")[1] ?? "", Nn = (h) => {
    var S;
    return (S = Vt.items.find((I) => I.id === h)) == null ? void 0 : S.group;
  }, Xo = (h) => {
    const S = new Set(h.map(Nn).filter((G) => !!G));
    if (!S.size) return [...h];
    const I = new Set(h.map(Yo)), B = new Set(h);
    for (const G of Vt.items) G.group && S.has(G.group) && I.has(Yo(G.id)) && B.add(G.id);
    return [...B];
  }, en = mf(fe).length, Gc = fe.length > 1 && fe.every((h) => h.group && h.group === fe[0].group), Ho = (h, S) => {
    var G;
    if (!ie(h.recipe)) return "";
    const I = ((G = h.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!I) return "";
    const B = Dr(h.recipe, S);
    return B && Yg(I, B.population, [B.file, B.sample]) ? "" : I;
  }, Fc = Ae && ie(Ae.recipe) ? Ia(Wo, Dr(Ae.recipe, Ae.templateSampleId, Ae.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", Wa = fe.some((h) => h.locked), jn = new Set(((K == null ? void 0 : K.items) ?? []).filter((h) => h.locked).map((h) => h.id)), We = V.filter((h) => !jn.has(tn(h.dataset.itemId ?? "")) && h.dataset.itemId !== O), rn = We.length > 1 && We.every((h) => !Nn(h.dataset.itemId ?? "")), $o = tt.useRef(We);
  $o.current = We;
  const zn = tt.useRef(!1);
  tt.useEffect(() => {
    _.length && _.some((h) => !Vt.items.some((S) => S.id === h)) && j((h) => h.filter((S) => Vt.items.some((I) => I.id === S)));
  }, [Vt, _]), tt.useLayoutEffect(() => {
    var h;
    (h = Z.current) == null || h.updateRect();
  }, [Vt, xt, At]), tt.useLayoutEffect(() => {
    var G;
    if (!W) return;
    const h = [...W.querySelectorAll("[data-item-id]")], S = (X, Y) => X.length === Y.length && X.every((st, kt) => st === Y[kt]), I = h.filter((X) => _.includes(X.dataset.itemId ?? "")), B = h.filter((X) => !_.includes(X.dataset.itemId ?? ""));
    L((X) => S(X, I) ? X : I), at((X) => S(X, B) ? X : B), (G = nt.current) == null || G.setSelectedTargets(I);
  }, [W, _, Vt, K == null ? void 0 : K.id]), tt.useEffect(() => {
    as();
  }, [K == null ? void 0 : K.id]);
  const Ya = (h, S = !0) => {
    S && (Wt.current = [
      $n(t),
      ...Wt.current
    ].slice(0, 30), Ue.current = []), e(h);
  }, Mr = (h) => {
    const S = $n(t);
    h(S), Ya(S);
  }, Ot = (h) => {
    Mr((S) => {
      const I = S.sheets.find(({ id: B }) => B === S.activeSheetId);
      I && h(I);
    });
  }, Xa = tt.useRef(null), [Lc, Ha] = tt.useState(null), _r = (h, S) => {
    let I = "";
    const B = Xa.current;
    Xa.current = null, Ot((G) => {
      I = crypto.randomUUID();
      const X = _s(G, S == null ? void 0 : S.width, S == null ? void 0 : S.height);
      B && (X.x = Math.max(0, Math.round(B.x)), X.y = Math.max(0, Math.round(B.y))), G.items.push({
        id: I,
        ...X,
        recipe: h
      });
    }), Qr(I), Jc(I);
  }, ne = Pt.find(({ id: h }) => h === bt) ?? Pt[0] ?? null, $a = ne && c ? Ir(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    ne.tree,
    cr(f)
  ) : null, Ze = ($a == null ? void 0 : $a.id) ?? (ne == null ? void 0 : ne.tree.root_population_id) ?? "", An = (h) => {
    var S, I, B;
    if (!ne || !Ze) {
      ft(m("Check an FCS file and select a population first."));
      return;
    }
    _r({
      kind: h,
      sampleId: ne.id,
      populationId: Ze,
      ...dt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ne.sample.index(p) !== void 0 ? p : ((S = ne.sample.channels[0]) == null ? void 0 : S.key) ?? "",
      yChannel: h === "histogram" ? null : ne.sample.index(v) !== void 0 ? v : ((I = ne.sample.channels[1]) == null ? void 0 : I.key) ?? ((B = ne.sample.channels[0]) == null ? void 0 : B.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, qo = () => {
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
  }, Vo = () => _r({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Wc = (h, S) => {
    Ot((I) => {
      const B = I.items.find((G) => G.id === h);
      B && (B.recipe = S(B.recipe));
    });
  }, Yc = (h) => {
    h.preventDefault();
    const S = h.target.closest("[data-item-id]");
    if (S != null && S.dataset.itemId) {
      const X = S.dataset.itemId, Y = K == null ? void 0 : K.items.find(({ id: Ut }) => Ut === tn(X));
      if (!Y) return;
      const st = _.includes(X);
      st || Le(Xo([X]));
      const kt = Y.group ? ((K == null ? void 0 : K.items) ?? []).filter((Ut) => Ut.group === Y.group).map(({ id: Ut }) => Ut) : [Y.id], ut = st && ae.length > 1 ? ae : kt, _t = ut.length > 1, ee = ie(Y.recipe), be = [
        { label: _t ? m("Duplicate {n} items", { n: ut.length }) : m("Duplicate"), onClick: () => an(ut) },
        { label: m("Bring to front"), onClick: () => Ye(ut, "front") },
        { label: m("Bring forward"), onClick: () => Ye(ut, "forward") },
        { label: m("Send backward"), onClick: () => Ye(ut, "backward") },
        { label: m("Send to back"), onClick: () => Ye(ut, "back") },
        { label: Y.locked ? m("Unlock") : m("Lock"), onClick: () => Gn(ut, !Y.locked) },
        ...st && en > 1 ? [{ label: m("Group"), onClick: Bn }] : [],
        ...Y.group ? [{ label: m("Ungroup"), onClick: () => Ot((Ut) => Ms(Ut, ut)) }] : [],
        "separator",
        ...dt.mode !== "off" && ee ? [
          {
            label: "iterated" in Y.recipe && Y.recipe.iterated ? m("Stop following the iteration") : m("Follow the iteration"),
            onClick: () => Wc(Y.id, (Ut) => ie(Ut) ? { ...Ut, iterated: !Ut.iterated } : Ut)
          },
          "separator"
        ] : [],
        ...ee ? [{ label: m("Open in Gating"), onClick: () => M(Y.recipe) }] : [],
        ...Y.recipe.kind === "figure" && x ? [{ label: m("Edit in Illustration"), onClick: () => x(structuredClone(Y.recipe.illustration)) }] : [],
        ...Y.recipe.kind === "proportions" && E ? [{ label: m("Edit in Plotting"), onClick: () => E(structuredClone(Y.recipe.settings)) }] : [],
        { label: _t ? m("Remove {n} items", { n: ut.length }) : m("Remove"), onClick: () => nn(ut) }
      ];
      Ha({ x: h.clientX, y: h.clientY, items: be, label: He(Y, Pt) });
      return;
    }
    const I = h.currentTarget.getBoundingClientRect(), B = { x: (h.clientX - I.left) / xt, y: (h.clientY - I.top) / xt }, G = (X) => () => {
      Xa.current = B, X();
    };
    Ha({
      x: h.clientX,
      y: h.clientY,
      label: m("Page"),
      items: [
        { label: m("+ Biplot"), disabled: !Ct, onClick: G(() => An("biplot")) },
        { label: m("+ Histogram"), disabled: !Ct, onClick: G(() => An("histogram")) },
        { label: m("+ Gating strategy"), disabled: !Ct, onClick: G(Zo) },
        { label: m("+ Chart"), disabled: !Ct, onClick: G(qo) },
        { label: m("+ Text"), onClick: G(Vo) },
        { label: m("+ Illustration figure"), disabled: !Ct || !(g != null && g.figure), onClick: G(Uo) },
        { label: m("+ Plotting chart"), disabled: !Ct || !y, onClick: G(Ko) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...en > 1 ? [{ label: m("Group"), onClick: Bn }] : [],
        ...fe.some((X) => X.group) ? [{ label: m("Ungroup"), onClick: Va }] : [],
        { label: m("Select all"), disabled: !Vt.items.length, onClick: () => Le(Vt.items.filter((X) => !jn.has(X.templateId)).map(({ id: X }) => X)) }
      ]
    });
  }, Uo = () => {
    if (!(g != null && g.figure)) {
      ft(m("Make a figure on the Illustration tab first."));
      return;
    }
    K && _r({ kind: "figure", illustration: structuredClone(g), page: 0 }, Df(g, r, f, K));
  }, Ko = () => {
    if (!y || !K) return;
    const h = y(), S = kf(h, Mf(r), f, Er, C);
    if (!S.catLevels.length || !S.perSample.length) {
      ft(m("Choose files and populations on the Plotting tab first."));
      return;
    }
    _r({ kind: "proportions", settings: h }, _f(h, S, K));
  }, Zo = () => {
    var I;
    if (!ne || !Ze) {
      ft(m("Check an FCS file and select a population first."));
      return;
    }
    const h = ne.tree.root_population_id ?? "", S = Ze !== h ? Ze : ((I = da(ne.tree.populations, h).filter(({ popId: B }) => B !== h).at(-1)) == null ? void 0 : I.popId) ?? Ze;
    _r(
      {
        kind: "strategy",
        sampleId: ne.id,
        populationId: S,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...dt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Xc = () => {
    var G, X;
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
    const h = new Map(Pt.map((Y) => [Y.id, Y])), S = [], I = g.figure;
    for (const Y of Pt) {
      if (I) {
        if (!I.sampleIds.includes(Y.id)) continue;
        for (const kt of I.plots)
          if (kt.type !== "heatmap")
            for (const ut of kt.population ? [kt.population] : ((G = I.samplePopulations) == null ? void 0 : G[Y.id]) ?? I.populations) {
              const _t = Ir(
                ut,
                Y.tree,
                cr(f)
              );
              _t.id && _t.status !== "changed" && S.push({
                sampleId: Y.id,
                populationId: _t.id,
                xChannel: kt.x,
                yChannel: kt.y,
                type: kt.type
              });
            }
        continue;
      }
      const st = g.selectionMode === "matrix" ? ((X = g.selectedPopulationsBySample) == null ? void 0 : X[Y.id]) ?? [] : g.popIds;
      for (const kt of st)
        for (const ut of g.xChannels)
          S.push({ sampleId: Y.id, populationId: kt, xChannel: ut });
    }
    const B = S.slice(0, 60);
    if (B.length === 0) {
      ft(
        m("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Ot((Y) => {
      for (const st of B) {
        if (!h.get(st.sampleId)) continue;
        const ut = st.type ?? (g.plotType === "histogram" ? "histogram" : "biplot");
        Y.items.push({
          id: crypto.randomUUID(),
          ..._s(Y),
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
      S.length > B.length ? m(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: B.length
        }
      ) : m("Added {count} Illustration plots.", { count: B.length })
    );
  }, Dt = (h) => {
    U && Ot((S) => {
      const I = S.items.find(({ id: G }) => G === U.id);
      if (!I) return;
      const B = I.recipe;
      if (I.recipe = h(I.recipe), B.kind === "cellpanel" && I.recipe.kind === "cellpanel") {
        const G = Es(B), X = Es(I.recipe), Y = Math.max(0.1, Math.min(I.width / Math.max(1, G.width), I.height / Math.max(1, G.height)));
        I.width = Math.max(40, Math.round(X.width * Y)), I.height = Math.max(30, Math.round(X.height * Y));
      }
    });
  }, qa = (h) => Dt((S) => {
    if (S.kind !== "biplot" && S.kind !== "histogram") return S;
    const I = h ? r.filter((X) => h.includes(X.id)).map((X) => X.id) : [];
    if (!I.length) {
      const { pool: X, ...Y } = S;
      return Y;
    }
    const B = I.includes(S.sampleId) ? S.sampleId : I[0];
    let G = S.populationId;
    if (B !== S.sampleId) {
      const X = Pt.find(({ id: st }) => st === S.sampleId), Y = Pt.find(({ id: st }) => st === B);
      X && Y && (G = Ir({ hierarchyId: X.tree.id, populationId: G }, Y.tree, je).id ?? Y.tree.root_population_id ?? G);
    }
    return { ...S, sampleId: B, populationId: G, pool: { sampleIds: I } };
  }), Hc = tt.useMemo(() => {
    var X;
    const h = U == null ? void 0 : U.recipe;
    if (!h || !ie(h) || h.kind === "strategy" || !h.pool) return null;
    const S = Ae != null && Ae.templateSampleId ? (X = Pt.find(({ id: Y }) => Y === Ae.templateSampleId)) == null ? void 0 : X.tree.id : void 0, { members: I, leftOut: B } = to(h, Pt, je, S), G = h.kind === "biplot" && h.yChannel && I.length > 1 ? xf(je, I.map((Y) => Y.tree.id), h.xChannel, h.yChannel).omitted.map((Y) => Y.name) : [];
    return { pooled: I.length, total: h.pool.sampleIds.length, leftOut: B, omittedGates: G };
  }, [U, Ae, Pt, je]), nn = (h) => {
    Ot((S) => {
      S.items = S.items.filter((I) => !h.includes(I.id));
    }), j((S) => S.filter((I) => !h.includes(I)));
  }, an = (h, S) => {
    const I = [];
    return Ot((B) => {
      let G = Math.max(0, ...B.items.map((Y) => Y.z));
      const X = /* @__PURE__ */ new Map();
      for (const Y of h) {
        const st = B.items.find((ee) => ee.id === Y);
        if (!st) continue;
        const kt = crypto.randomUUID();
        I.push(kt);
        const ut = (S == null ? void 0 : S[Y]) ?? { x: st.x + 20, y: st.y + 20, width: st.width, height: st.height }, _t = st.group ? X.get(st.group) ?? crypto.randomUUID() : void 0;
        st.group && _t && X.set(st.group, _t), B.items.push({ ...st, ...ut, id: kt, locked: !1, z: ++G, recipe: { ...st.recipe }, ..._t ? { group: _t } : {} });
      }
    }), I.length && Le(I), I;
  }, $c = (h, S, I) => {
    Ot((B) => {
      for (const G of B.items)
        !h.includes(G.id) || G.locked || (G.x += S, G.y += I);
    });
  }, Ye = (h, S) => {
    Ot((I) => {
      const B = [...I.items].sort((st, kt) => st.z - kt.z), G = B.filter((st) => h.includes(st.id)), X = B.filter((st) => !h.includes(st.id));
      let Y;
      if (S === "front") Y = [...X, ...G];
      else if (S === "back") Y = [...G, ...X];
      else {
        Y = B;
        const st = Y.map((kt, ut) => ut);
        S === "forward" && st.reverse();
        for (const kt of st) {
          const ut = S === "forward" ? kt + 1 : kt - 1;
          !h.includes(Y[kt].id) || ut < 0 || ut >= Y.length || h.includes(Y[ut].id) || ([Y[kt], Y[ut]] = [Y[ut], Y[kt]]);
        }
      }
      Y.forEach((st, kt) => {
        st.z = kt;
      });
    });
  }, Bn = () => {
    en < 2 || Ot((h) => {
      Zf(h, ae);
    });
  }, Va = () => {
    fe.some((h) => h.group) && Ot((h) => Ms(h, ae));
  }, Gn = (h, S) => {
    Ot((I) => {
      for (const B of I.items) h.includes(B.id) && (B.locked = S);
    });
  }, qc = (h) => {
    Ot((S) => Jf(S, ae.filter((I) => {
      var B;
      return !((B = S.items.find((G) => G.id === I)) != null && B.locked);
    }), h));
  }, Vc = (h) => {
    Ot((S) => Qf(S, ae.filter((I) => {
      var B;
      return !((B = S.items.find((G) => G.id === I)) != null && B.locked);
    }), h));
  }, Fn = (h, S) => {
    const I = {};
    for (const G of h) {
      const X = G.dataset.itemId, Y = Vt.items.find((ut) => ut.id === X);
      if (!Y) continue;
      const { id: st, ...kt } = yg(Y, Wg(G));
      I[st] = kt;
    }
    const B = Object.keys(I);
    if (B.length) {
      if (S) {
        for (const G of h) {
          const X = Vt.items.find((Y) => Y.id === G.dataset.itemId);
          X && Object.assign(G.style, { left: `${X.x}px`, top: `${X.y}px`, width: `${X.width}px`, height: `${X.height}px` });
        }
        an(B, I);
        return;
      }
      Ot((G) => {
        for (const X of G.items) I[X.id] && Object.assign(X, I[X.id]);
      });
    }
  }, Jo = (h) => h.flatMap((S) => {
    if (!(S instanceof HTMLElement) || !S.parentElement) return [];
    const I = S.cloneNode(!0);
    I.classList.add("gl-layout-ghost"), I.classList.remove("is-selected"), I.removeAttribute("data-item-id"), I.setAttribute("aria-hidden", "true");
    const B = S.querySelectorAll("canvas");
    return I.querySelectorAll("canvas").forEach((G, X) => {
      var st;
      const Y = B[X];
      Y && (G.width = Y.width, G.height = Y.height, (st = G.getContext("2d")) == null || st.drawImage(Y, 0, 0));
    }), S.parentElement.insertBefore(I, S), [I];
  }), Ln = (h) => {
    if (Array.isArray(h)) for (const S of h) S.remove();
  }, Ua = (h) => {
    for (const S of h) {
      const I = Vt.items.find((B) => B.id === S.dataset.itemId);
      I && Object.assign(S.style, { left: `${I.x}px`, top: `${I.y}px`, width: `${I.width}px`, height: `${I.height}px` });
    }
  }, Qo = tt.useRef(Ua);
  Qo.current = Ua;
  const Je = tt.useRef(null), Wn = (h, S) => {
    const I = { targets: h, ghosts: S, cancelled: !1 };
    Je.current = I;
    const B = () => {
      window.removeEventListener("mouseup", B, !0), window.removeEventListener("touchend", B, !0), window.setTimeout(() => {
        Je.current === I && (Je.current = null, Ln(I.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", B, !0), window.addEventListener("touchend", B, !0);
  }, Yn = (h, S, I, B) => {
    const G = Je.current;
    Je.current = null, Ln(G == null ? void 0 : G.ghosts);
    const X = S == null ? void 0 : S.dist, Y = !X || Math.hypot(X[0] ?? 0, X[1] ?? 0) >= 3;
    G != null && G.cancelled || !I || !Y ? Ua(h) : B();
  }, ts = (h) => {
    var G;
    h.target.style.left = `${h.left}px`, h.target.style.top = `${h.top}px`;
    const S = (G = h.datas) == null ? void 0 : G.companions;
    if (!(S != null && S.length)) return;
    const I = h.left - h.datas.startLeft, B = h.top - h.datas.startTop;
    for (const { el: X, left: Y, top: st } of S)
      X.style.left = `${Y + I}px`, X.style.top = `${st + B}px`;
  }, es = (h) => {
    var I;
    const S = (I = h.datas) == null ? void 0 : I.companions;
    return [h.target, ...(S ?? []).map(({ el: B }) => B)];
  }, Uc = (h) => {
    var G;
    h.datas.alt = !!((G = h.inputEvent) != null && G.altKey);
    const S = h.target, I = rn ? $o.current.filter((X) => X !== S) : [];
    h.datas.startLeft = parseFloat(S.style.left) || 0, h.datas.startTop = parseFloat(S.style.top) || 0, h.datas.companions = I.map((X) => ({ el: X, left: parseFloat(X.style.left) || 0, top: parseFloat(X.style.top) || 0 }));
    const B = es(h);
    Wn(B, h.datas.alt ? Jo(B) : void 0);
  }, rs = (h) => {
    h.target.style.width = `${h.width}px`, h.target.style.height = `${h.height}px`, h.target.style.left = `${h.drag.left}px`, h.target.style.top = `${h.drag.top}px`;
  }, Kc = (h) => {
    var B;
    const S = (B = h.inputEvent) == null ? void 0 : B.target;
    if (!S) return;
    const I = Z.current;
    if (I != null && I.isMoveableElement(S)) {
      h.stop();
      return;
    }
    if (We.some((G) => G === S || G.contains(S)) && (h.stop(), We.length > 1 && !rn)) {
      I == null || I.dragStart(h.inputEvent);
      const G = h.inputEvent, X = (Y) => {
        var st;
        window.removeEventListener("mouseup", X), Math.hypot(Y.clientX - G.clientX, Y.clientY - G.clientY) < 4 && ((st = nt.current) == null || st.clickTarget(G, S));
      };
      window.addEventListener("mouseup", X);
    }
  }, Zc = (h) => {
    var G, X, Y;
    const S = h.isClick || h.isDragStart, I = new Set((h.removed ?? []).map((st) => Nn(st.dataset.itemId ?? "")).filter(Boolean)), B = Xo(
      h.selected.map((st) => st.dataset.itemId ?? "").filter((st) => st && (S || !jn.has(tn(st))))
    ).filter((st) => !I.has(Nn(st)));
    if (Le(B), h.isDragStart && !h.isClick) {
      if (!B.filter((ut) => !jn.has(tn(ut)) && ut !== O).length) return;
      (X = (G = h.inputEvent) == null ? void 0 : G.preventDefault) == null || X.call(G), zn.current = !0;
      const kt = () => {
        zn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", kt, { capture: !0, once: !0 }), 0), (Y = Z.current) == null || Y.waitToChangeTarget().then(() => {
        var ut;
        return (ut = Z.current) == null ? void 0 : ut.dragStart(h.inputEvent);
      });
    }
  }, Jc = (h) => {
    window.requestAnimationFrame(() => {
      var S, I, B;
      (B = (I = (S = Jr.current) == null ? void 0 : S.querySelector(`[data-item-id="${h}"]`)) == null ? void 0 : I.scrollIntoView) == null || B.call(I, { block: "nearest", inline: "nearest" });
    });
  }, ur = (h) => {
    Ot((S) => Pf(S, h));
  }, Qc = () => Ot((h) => Of(h)), tf = () => Ot((h) => Nf(h)), ns = (() => {
    const h = [], S = [];
    if (!K) return { vertical: h, horizontal: S };
    const I = bi(K.page), B = bs(K.page.marginMm);
    for (const G of va(K.page))
      h.push(G.x, G.x + B, G.x + I.width / 2, G.x + I.width - B, G.x + I.width), S.push(G.y, G.y + B, G.y + I.height / 2, G.y + I.height - B, G.y + I.height);
    return { vertical: [...new Set(h)], horizontal: [...new Set(S)] };
  })(), as = () => {
    const h = Ve.current;
    if (!h || !K) return;
    const S = { width: h.clientWidth - 36, height: h.clientHeight - 36 };
    if (S.width <= 0 || S.height <= 0) return;
    const I = Math.min(S.width / K.width, S.height / K.height);
    vt(Math.max(0.1, Math.min(4, Math.floor(I * 100) / 100)));
  };
  tt.useEffect(() => {
    const h = F;
    if (!h) return;
    const S = (I) => {
      if (!(I.altKey || I.shiftKey || I.ctrlKey)) return;
      const B = I.deltaY || I.deltaX;
      if (!B) return;
      I.preventDefault();
      const G = Mt.current, X = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-B * 25e-4) * 100) / 100));
      if (X === G) return;
      Mt.current = X, vt(X);
      const Y = h.getBoundingClientRect(), st = I.clientX - Y.left, kt = I.clientY - Y.top, ut = X / G, _t = (h.scrollLeft + st) * ut - st, ee = (h.scrollTop + kt) * ut - kt;
      requestAnimationFrame(() => {
        h.scrollLeft = _t, h.scrollTop = ee;
      });
    };
    return h.addEventListener("wheel", S, { passive: !1 }), () => h.removeEventListener("wheel", S);
  }, [F]);
  const is = (h) => {
    const S = h > 0 ? sn.find((I) => I > xt + 1e-3) : [...sn].reverse().find((I) => I < xt - 1e-3);
    S && vt(S);
  }, ef = () => new Promise((h) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => h())), 450);
  }), os = async () => {
    const h = Jr.current;
    if (!h || !K || sr) return;
    lr(!0);
    const S = ze;
    try {
      const I = [];
      for (let B = 0; B < ge.length; B++)
        ge.length > 1 && (kr(B), await ef()), I.push(...og(h, K, { zoom: xt, crop: ve ? { paddingMm: Zr } : void 0 }));
      await sg(I, K, Rt), T == null || T();
    } catch (I) {
      ft(I instanceof Error ? I.message : String(I));
    } finally {
      ge.length > 1 && kr(S), lr(!1);
    }
  }, Xe = (h) => {
    Ot((S) => {
      var I;
      if (h.mode === "off") {
        delete S.iteration;
        return;
      }
      if ((((I = S.iteration) == null ? void 0 : I.mode) ?? "off") === "off" && !S.items.some(Rc))
        for (const B of S.items) ie(B.recipe) && (B.recipe.iterated = !0);
      S.iteration = h;
    }), kr(0);
  }, rf = (h) => [...new Set(r.map((S) => {
    var I;
    return ((I = S.metadata) == null ? void 0 : I[h]) ?? "";
  }).filter(Boolean))], nf = dt.source.kind === "group" ? `group:${dt.source.groupId}` : dt.source.kind === "metadata" ? `meta:${dt.source.column}=${dt.source.value}` : dt.source.kind, af = (h) => {
    if (h === "all") return { kind: "all" };
    if (h.startsWith("group:")) return { kind: "group", groupId: h.slice(6) };
    if (h.startsWith("meta:")) {
      const [S, ...I] = h.slice(5).split("=");
      return { kind: "metadata", column: S, value: I.join("=") };
    }
    return { kind: "checked" };
  }, of = (h) => {
    const S = ws(h.nativeEvent);
    if (S) {
      h.preventDefault(), S === "undo" ? Xn() : Hn();
      return;
    }
    if (h.target.closest("input, textarea, select")) return;
    const I = h.metaKey || h.ctrlKey;
    if (h.key === "Escape") {
      j([]);
      return;
    }
    if (I && h.key.toLowerCase() === "a") {
      h.preventDefault(), Le(((K == null ? void 0 : K.items) ?? []).filter((Y) => !Y.locked).map((Y) => Y.id));
      return;
    }
    if (!_.length) return;
    if (h.key === "Enter" && _.length === 1) {
      const Y = Vt.items.find((st) => st.id === _[0]);
      if ((Y == null ? void 0 : Y.recipe.kind) === "text") {
        h.preventDefault(), R(Y.id);
        return;
      }
    }
    if (h.key === "Delete" || h.key === "Backspace") {
      h.preventDefault(), nn(ae);
      return;
    }
    if (I && h.key.toLowerCase() === "d") {
      h.preventDefault(), an(ae);
      return;
    }
    if (I && (h.key === "]" || h.key === "[")) {
      h.preventDefault(), Ye(ae, h.key === "]" ? h.shiftKey ? "front" : "forward" : h.shiftKey ? "back" : "backward");
      return;
    }
    if (I && h.key.toLowerCase() === "g") {
      h.preventDefault(), h.shiftKey ? Va() : Bn();
      return;
    }
    if (I && h.shiftKey && h.key.toLowerCase() === "l") {
      h.preventDefault(), Gn(ae, !Wa);
      return;
    }
    const B = h.shiftKey ? 10 : 1, X = {
      ArrowLeft: [-B, 0],
      ArrowRight: [B, 0],
      ArrowUp: [0, -B],
      ArrowDown: [0, B]
    }[h.key];
    X && (h.preventDefault(), $c(ae, X[0], X[1]));
  }, Ka = U == null ? void 0 : U.recipe, Bt = Ka && "sampleId" in Ka ? Pt.find(({ id: h }) => h === Ka.sampleId) ?? null : null, ss = Bt ? Bt.sample.channels.map((h) => ({
    value: h.key,
    label: Bt.sample.channelLabel(Bt.sample.index(h.key) ?? 0)
  })) : [], ls = Bt ? da(
    Bt.tree.populations,
    Bt.tree.root_population_id ?? ""
  ) : [], Xn = () => {
    const h = Wt.current.shift();
    h && (Ue.current = [
      $n(t),
      ...Ue.current
    ].slice(0, 30), Ya(h, !1));
  }, Hn = () => {
    const h = Ue.current.shift();
    h && (Wt.current = [
      $n(t),
      ...Wt.current
    ].slice(0, 30), Ya(h, !1));
  }, Za = tt.useRef({ undo: Xn, redo: Hn });
  return Za.current = { undo: Xn, redo: Hn }, tt.useEffect(() => {
    const h = (I) => {
      var G, X;
      if (I.key === "Escape" && Je.current) {
        const Y = Je.current;
        Y.cancelled = !0, I.preventDefault(), I.stopPropagation(), Qo.current(Y.targets), Ln(Y.ghosts), Y.ghosts = void 0, Lg(Z.current);
        return;
      }
      const B = ws(I);
      B && ((X = (G = I.target) == null ? void 0 : G.closest) != null && X.call(G, "input, textarea, select, [contenteditable='true']") || (I.preventDefault(), I.stopPropagation(), B === "undo" ? Za.current.undo() : Za.current.redo()));
    }, S = () => {
      const I = Je.current;
      I && (Ln(I.ghosts), I.ghosts = void 0);
    };
    return window.addEventListener("keydown", h, !0), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", h, !0), window.removeEventListener("blur", S);
    };
  }, []), K ? /* @__PURE__ */ b.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${pt ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ b.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": m("Layout sheets"),
            children: [
              t.sheets.map((h) => /* @__PURE__ */ b.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: et === h.id ? /* @__PURE__ */ b.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: h.name,
                  autoFocus: !0,
                  onFocus: (S) => S.currentTarget.select(),
                  onBlur: (S) => {
                    const I = S.currentTarget.value.trim();
                    I && Mr((B) => {
                      const G = B.sheets.find(
                        ({ id: X }) => X === h.id
                      );
                      G && (G.name = I);
                    }), ot(null);
                  },
                  onKeyDown: (S) => {
                    S.key === "Enter" && S.currentTarget.blur(), S.key === "Escape" && ot(null);
                  }
                }
              ) : /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === h.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === h.id ? " active" : ""}`,
                  title: m("Double-click to rename"),
                  onClick: () => Mr((S) => {
                    S.activeSheetId = h.id;
                  }),
                  onDoubleClick: () => ot(h.id),
                  children: h.name
                }
              ) }, h.id)),
              /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: m("New blank layout"),
                  onClick: () => {
                    const h = yf(
                      `Layout ${t.sheets.length + 1}`,
                      { ...K.page }
                    );
                    Mr((S) => {
                      S.sheets.push(h), S.activeSheetId = h.id;
                    }), j([]);
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
            onMouseDown: (h) => {
              h.target.closest("button") && h.preventDefault();
            },
            children: [
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => An("biplot"), disabled: !Ct, title: m(Ct ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: m("+ Biplot") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => An("histogram"), disabled: !Ct, title: m(Ct ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: m("+ Histogram") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Zo, disabled: !Ct, title: m(Ct ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: m("+ Gating strategy") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: qo, disabled: !Ct, title: m(Ct ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: m("+ Chart") }),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Add a text block; edit it on the page"),
                    onClick: Vo,
                    children: m("+ Text")
                  }
                ),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Xc, disabled: !Ct, title: m("Add one plot per file and plot of the Illustration tab's current selection"), children: m("Add Illustration selection") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Uo, disabled: !Ct, title: m("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: m("+ Illustration figure") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ko, disabled: !Ct || !y, title: m("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: m("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": m("Arrange"), children: [
                Gg.map(({ how: h, label: S, title: I }) => /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => qc(h), disabled: !_.length || pt, title: m(I), children: m(S) }, h)),
                Fg.map(({ how: h, label: S, title: I }) => /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Vc(h), disabled: en < 3 || pt, title: m(I), children: m(S) }, h)),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": z, onClick: () => A((h) => !h), title: m("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: m("Snap grid") })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": pt, onClick: () => ht(!pt), title: m("Show the page as it exports, without grid, margins or handles"), children: m(pt ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Wt.current.length, onClick: Xn, title: m("Undo the last layout edit (Cmd-Z)"), children: m("Undo") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Ue.current.length, onClick: Hn, title: m("Redo the undone edit (Shift-Cmd-Z)"), children: m("Redo") }),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const h = {
                        ...K,
                        id: crypto.randomUUID(),
                        page: { ...K.page },
                        name: `${K.name} copy`,
                        items: K.items.map((S) => ({
                          ...S,
                          id: crypto.randomUUID(),
                          recipe: { ...S.recipe }
                        }))
                      };
                      Mr((S) => {
                        S.sheets.push(h), S.activeSheetId = h.id;
                      }), j([]);
                    },
                    children: m("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: m("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      Mr((h) => {
                        const S = h.sheets.findIndex(
                          ({ id: I }) => I === h.activeSheetId
                        );
                        h.sheets.splice(S, 1), h.activeSheetId = h.sheets[Math.max(0, S - 1)].id;
                      }), j([]);
                    },
                    children: m("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": m("Zoom"), children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: as, title: m("Fit the page to the window"), children: m("Fit") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => is(-1), "aria-label": m("Zoom out"), title: m("Zoom out"), disabled: xt <= sn[0], children: "−" }),
                /* @__PURE__ */ b.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(xt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => is(1), "aria-label": m("Zoom in"), title: m("Zoom in"), disabled: xt >= sn[sn.length - 1], children: "+" })
              ] }),
              (ge.length > 1 || dt.mode !== "off") && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": m("Pages of the iteration"), children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => kr(Math.max(0, ze - 1)), disabled: ze === 0, "aria-label": m("Previous page"), title: m("Previous page"), children: "◀" }),
                /* @__PURE__ */ b.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  m("Page {n} of {count}", { n: ze + 1, count: Math.max(1, ge.length) }),
                  Vt.units.length > 0 && ` · ${Vt.units.map((h) => h.name).join(", ")}`
                ] }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => kr(Math.min(ge.length - 1, ze + 1)), disabled: ze >= ge.length - 1, "aria-label": m("Next page"), title: m("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ b.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void os(), disabled: sr || !K.items.length, title: ge.length > 1 ? m("Write every page of the iteration; the format is chosen under Page") : m("Write this sheet at its page size; the format is chosen under Page"), children: sr ? m("Exporting…") : m("Export {format}", { format: Rt.toUpperCase() }) }) }),
              /* @__PURE__ */ b.jsx("span", { className: "gl-layout-performance-note", children: m("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        it && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ b.jsx("span", { children: it }),
          /* @__PURE__ */ b.jsx("button", { type: "button", title: m("Dismiss"), "aria-label": m("Dismiss"), onClick: () => ft(null), children: "×" })
        ] }),
        /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ b.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ b.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((h) => /* @__PURE__ */ b.jsx(
              "button",
              {
                "aria-pressed": lt === h,
                title: m(h === "item" ? "The selected item, or the file new plots take" : h === "page" ? "Page size, margins, pages and export" : h === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => wt(h),
                children: m(h === "item" ? "Items" : h === "page" ? "Page" : h === "iterate" ? "Iterate" : "Style")
              },
              h
            )) }),
            lt === "item" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("File for new plots"),
                /* @__PURE__ */ b.jsx(
                  "select",
                  {
                    value: bt,
                    onChange: (h) => J(h.target.value),
                    children: r.map((h) => /* @__PURE__ */ b.jsx("option", { value: h.id, children: h.name }, h.id))
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              Me.error && /* @__PURE__ */ b.jsx("p", { role: "alert", children: Me.error }),
              fe.length > 1 && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-inspector", "aria-label": m("Selected layout items"), children: [
                /* @__PURE__ */ b.jsx("strong", { children: Gc ? m("{count} items selected, one group", { count: fe.length }) : m("{count} items selected", { count: fe.length }) }),
                /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                  en > 1 && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Bn, title: m("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: m("Group") }),
                  fe.some((h) => h.group) && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Va, title: m("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: m("Ungroup") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => an(ae), title: m("Copies of every selected item, 20 px down and right (Cmd-D)"), children: m("Duplicate") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye(ae, "front"), title: m("Draw the selected items over every other"), children: m("Bring to front") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye(ae, "back"), title: m("Draw the selected items under every other"), children: m("Send to back") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Gn(ae, !Wa), title: m("Lock or unlock the selected items"), children: m(Wa ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => nn(ae), title: m("Remove the selected items (Delete)"), children: m("Remove") })
                ] }),
                /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !fe.length && /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              U && /* @__PURE__ */ b.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": m("Selected layout item"),
                  children: [
                    /* @__PURE__ */ b.jsx("strong", { children: m("Selected") }),
                    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ b.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: U.showFrame === !0,
                          onChange: (h) => Ot((S) => {
                            const I = S.items.find(
                              (B) => B.id === U.id
                            );
                            I && (I.showFrame = h.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => an([U.id]), title: m("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: m("Duplicate") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye([U.id], "front"), title: m("Draw this item over every other"), children: m("Bring to front") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye([U.id], "back"), title: m("Draw this item under every other"), children: m("Send to back") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => nn([U.id]), title: m("Remove this item from the page (Delete)"), children: m("Remove") })
                    ] }),
                    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: m("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ b.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: U.locked === !0,
                          onChange: (h) => Gn([U.id], h.target.checked)
                        }
                      ),
                      m("Locked")
                    ] }),
                    /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((h) => /* @__PURE__ */ b.jsxs("label", { children: [
                      zg[h],
                      /* @__PURE__ */ b.jsx(
                        de,
                        {
                          "aria-label": `Item ${h}`,
                          min: h === "width" || h === "height" ? bf(U.recipe.kind)[h] : 0,
                          integer: !0,
                          value: U[h],
                          onCommit: (S) => Ot((I) => {
                            const B = I.items.find(
                              (G) => G.id === U.id
                            );
                            B && (B[h] = S);
                          })
                        }
                      )
                    ] }, h)) }),
                    U.recipe.kind === "text" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Text"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            value: U.recipe.text,
                            onChange: (h) => Dt(
                              (S) => S.kind === "text" ? { ...S, text: h.target.value } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Reads from"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            "aria-label": m("Reads from"),
                            value: U.recipe.readsFrom ?? "",
                            onChange: (h) => Dt((S) => {
                              if (S.kind !== "text") return S;
                              const I = { ...S };
                              return h.target.value ? I.readsFrom = h.target.value : delete I.readsFrom, I;
                            }),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "", children: m("Nothing: plain text") }),
                              K.items.filter((h) => ie(h.recipe)).map((h) => /* @__PURE__ */ b.jsx("option", { value: h.id, children: He(h, Pt) }, h.id))
                            ]
                          }
                        )
                      ] }),
                      U.recipe.readsFrom && /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: vi }) }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Font"),
                        /* @__PURE__ */ b.jsx(
                          de,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: U.recipe.fontSize,
                            onCommit: (h) => Dt(
                              (S) => S.kind === "text" ? { ...S, fontSize: h } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: U.recipe.bold === !0,
                            onChange: (h) => Dt((S) => {
                              if (S.kind !== "text") return S;
                              const I = { ...S };
                              return h.target.checked ? I.bold = !0 : delete I.bold, I;
                            })
                          }
                        ),
                        m("Bold")
                      ] })
                    ] }) : U.recipe.kind === "figure" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Figure page"),
                        /* @__PURE__ */ b.jsx(
                          de,
                          {
                            "aria-label": m("Figure page"),
                            value: U.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (h) => Dt((S) => S.kind === "figure" ? { ...S, page: Math.max(0, h - 1) } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: He(U, Pt),
                            value: U.recipe.title ?? "",
                            onChange: (h) => Dt((S) => S.kind === "figure" ? { ...S, title: h.target.value } : S)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(U.recipe.illustration)),
                          children: m("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(g != null && g.figure),
                          title: m("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Dt(
                            (h) => h.kind === "figure" && g ? { ...h, illustration: structuredClone(g) } : h
                          ),
                          children: m("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : U.recipe.kind === "cellpanel" ? /* @__PURE__ */ b.jsx(
                      rg,
                      {
                        recipe: U.recipe,
                        onChange: (h) => Dt((S) => S.kind === "cellpanel" ? h : S)
                      }
                    ) : U.recipe.kind === "imagewall" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("The cells as the Images tab showed them when the wall was added; their images are drawn from the file's waveform file.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: U.recipe.populationName,
                            value: U.recipe.title ?? "",
                            onChange: (h) => Dt((S) => S.kind === "imagewall" ? { ...S, title: h.target.value } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Tile size"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "number",
                            min: 16,
                            max: 200,
                            value: U.recipe.tile,
                            onChange: (h) => Dt((S) => S.kind === "imagewall" ? { ...S, tile: Math.max(16, Math.min(200, Math.round(Number(h.target.value) || 56))) } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Columns"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "number",
                            min: 1,
                            max: 24,
                            value: U.recipe.columns,
                            onChange: (h) => Dt((S) => S.kind === "imagewall" ? { ...S, columns: Math.max(1, Math.min(24, Math.round(Number(h.target.value) || 8))) } : S)
                          }
                        )
                      ] })
                    ] }) : U.recipe.kind === "proportions" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: He(U, Pt),
                            value: U.recipe.title ?? "",
                            onChange: (h) => Dt((S) => S.kind === "proportions" ? { ...S, title: h.target.value } : S)
                          }
                        )
                      ] }),
                      E && /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this chart's settings into the Plotting tab"),
                          onClick: () => E(structuredClone(U.recipe.settings)),
                          children: m("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !y,
                          title: m("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const h = y == null ? void 0 : y();
                            h && Dt((S) => S.kind === "proportions" ? { ...S, settings: h } : S);
                          },
                          children: m("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : U.recipe.kind === "chart" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: U.recipe.populationId,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, populationId: h.target.value } : S),
                            children: ls.map(({ popId: h, depth: S }) => {
                              var I;
                              return /* @__PURE__ */ b.jsxs("option", { value: h, children: [
                                " ".repeat(S * 2),
                                ((I = Bt == null ? void 0 : Bt.tree.populations[h]) == null ? void 0 : I.name) ?? h
                              ] }, h);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Statistic"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: U.recipe.statistic,
                            onChange: (h) => Dt((S) => {
                              var G;
                              if (S.kind !== "chart") return S;
                              const I = h.target.value, B = I === "median" && !S.channel ? (G = Bt == null ? void 0 : Bt.sample.channels[0]) == null ? void 0 : G.key : S.channel;
                              return { ...S, statistic: I, ...B ? { channel: B } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "percent_of_parent", children: m("% of parent") }),
                              /* @__PURE__ */ b.jsx("option", { value: "percent_of_total", children: m("% of total") }),
                              /* @__PURE__ */ b.jsx("option", { value: "count", children: m("Events") }),
                              /* @__PURE__ */ b.jsx("option", { value: "median", children: m("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      U.recipe.statistic === "median" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Channel"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: U.recipe.channel ?? "",
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, channel: h.target.value } : S),
                            children: ((Bt == null ? void 0 : Bt.sample.channels) ?? []).map((h) => /* @__PURE__ */ b.jsx("option", { value: h.key, children: (Bt == null ? void 0 : Bt.sample.labelForKey(h.key)) ?? h.key }, h.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Files"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: U.recipe.files,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, files: h.target.value === "all" ? "all" : "checked" } : S),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "checked", children: m("Checked files") }),
                              /* @__PURE__ */ b.jsx("option", { value: "all", children: m("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Group by"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: U.recipe.groupBy,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, groupBy: h.target.value } : S),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "", children: m("Each file") }),
                              o.map((h) => /* @__PURE__ */ b.jsx("option", { value: h, children: h }, h))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Chart"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: U.recipe.chartType,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, chartType: h.target.value } : S),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "bars", children: m("Bars (mean ± SD)") }),
                              /* @__PURE__ */ b.jsx("option", { value: "dots", children: m("Points with the mean") }),
                              /* @__PURE__ */ b.jsx("option", { value: "box", children: m("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: U.recipe.showPoints,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, showPoints: h.target.checked } : S)
                          }
                        ),
                        m("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: m("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: U.recipe.test,
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, test: h.target.checked } : S)
                          }
                        ),
                        m("Test between groups")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: He(U, Pt),
                            value: U.recipe.title ?? "",
                            onChange: (h) => Dt((S) => S.kind === "chart" ? { ...S, title: h.target.value } : S)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      !yn(U.recipe) && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("FCS"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: U.recipe.sampleId,
                            onChange: (h) => Dt((S) => {
                              if (S.kind === "text" || S.kind === "figure" || S.kind === "proportions" || S.kind === "imagewall" || S.kind === "cellpanel") return S;
                              const I = Pt.find(
                                (G) => G.id === h.target.value
                              );
                              if (!I) return S;
                              const B = Bt && Ir(
                                {
                                  hierarchyId: Bt.tree.id,
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
                            children: Pt.map((h) => /* @__PURE__ */ b.jsx("option", { value: h.id, children: h.name }, h.id))
                          }
                        )
                      ] }),
                      (U.recipe.kind === "biplot" || U.recipe.kind === "histogram") && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: m("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!U.recipe.pool,
                            onChange: (h) => {
                              if (!h.target.checked) {
                                qa(null);
                                return;
                              }
                              const S = U.recipe.kind === "biplot" || U.recipe.kind === "histogram" ? U.recipe.sampleId : "";
                              qa(n.includes(S) ? n : [S]);
                            }
                          }
                        ),
                        m("Pool files")
                      ] }),
                      (U.recipe.kind === "biplot" || U.recipe.kind === "histogram") && U.recipe.pool && /* @__PURE__ */ b.jsx(
                        Xg,
                        {
                          files: r,
                          pool: U.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: Hc,
                          onChange: qa
                        }
                      ),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: U.recipe.populationId,
                            onChange: (h) => Dt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                populationId: h.target.value
                              }
                            ),
                            children: ls.map(({ popId: h, depth: S }) => {
                              var I;
                              return /* @__PURE__ */ b.jsxs("option", { value: h, children: [
                                " ".repeat(S * 2),
                                ((I = Bt == null ? void 0 : Bt.tree.populations[h]) == null ? void 0 : I.name) ?? h
                              ] }, h);
                            })
                          }
                        )
                      ] }),
                      U.recipe.kind !== "strategy" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ b.jsx(
                            Ss,
                            {
                              label: m("X channel"),
                              value: U.recipe.xChannel,
                              options: ss,
                              onChange: (h) => Dt(
                                (S) => S.kind === "biplot" || S.kind === "histogram" ? { ...S, xChannel: h } : S
                              )
                            }
                          )
                        ] }),
                        U.recipe.kind === "biplot" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ b.jsx(
                            Ss,
                            {
                              label: m("Y channel"),
                              value: U.recipe.yChannel ?? "",
                              options: ss,
                              onChange: (h) => Dt(
                                (S) => S.kind === "biplot" ? { ...S, yChannel: h } : S
                              )
                            }
                          )
                        ] })
                      ] }),
                      U.recipe.kind === "strategy" && ((fs = U.recipe.populationIds) == null ? void 0 : fs.length) && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                        /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("{count} populations; the grid follows the live gates", { count: U.recipe.populationIds.length }) }),
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: m("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          m("Layout"),
                          /* @__PURE__ */ b.jsxs(
                            "select",
                            {
                              value: U.recipe.layout ?? "tree",
                              onChange: (h) => Dt((S) => S.kind === "strategy" ? { ...S, layout: h.target.value === "flow" ? "flow" : "tree" } : S),
                              children: [
                                /* @__PURE__ */ b.jsx("option", { value: "tree", children: m("Tree") }),
                                /* @__PURE__ */ b.jsx("option", { value: "flow", children: m("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (U.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          m("Columns"),
                          /* @__PURE__ */ b.jsx(de, { min: 1, max: 24, integer: !0, value: U.recipe.columns ?? 4, onCommit: (h) => Dt((S) => S.kind === "strategy" ? { ...S, columns: h } : S) })
                        ] }),
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: m("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ b.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: U.recipe.showArrows !== !1,
                              onChange: (h) => Dt((S) => S.kind === "strategy" ? { ...S, showArrows: h.target.checked } : S)
                            }
                          ),
                          m("Arrows")
                        ] }),
                        U.recipe.showArrows !== !1 && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: m("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ b.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!U.recipe.arrowColor,
                                onChange: (h) => Dt((S) => S.kind === "strategy" ? { ...S, arrowColor: h.target.checked ? "#444444" : void 0 } : S)
                              }
                            ),
                            m("One colour"),
                            U.recipe.arrowColor && /* @__PURE__ */ b.jsx(
                              "input",
                              {
                                type: "color",
                                value: U.recipe.arrowColor,
                                onChange: (h) => Dt((S) => S.kind === "strategy" ? { ...S, arrowColor: h.target.value } : S)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: m("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            m("Arrows from"),
                            /* @__PURE__ */ b.jsxs(
                              "select",
                              {
                                value: U.recipe.arrowAnchor ?? "label",
                                onChange: (h) => Dt((S) => S.kind === "strategy" ? { ...S, arrowAnchor: h.target.value === "gate" ? "gate" : void 0 } : S),
                                children: [
                                  /* @__PURE__ */ b.jsx("option", { value: "label", children: m("Gate label") }),
                                  /* @__PURE__ */ b.jsx("option", { value: "gate", children: m("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                            m("Arrow width"),
                            /* @__PURE__ */ b.jsx(de, { min: 0.5, max: 6, step: 0.25, value: U.recipe.arrowWidth ?? 1.5, onCommit: (h) => Dt((S) => S.kind === "strategy" ? { ...S, arrowWidth: h } : S) })
                          ] })
                        ] })
                      ] }),
                      U.recipe.kind === "strategy" && !((ds = U.recipe.populationIds) != null && ds.length) && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: U.recipe.fullPath,
                            onChange: (h) => Dt(
                              (S) => S.kind === "strategy" ? {
                                ...S,
                                fullPath: h.target.checked
                              } : S
                            )
                          }
                        ),
                        m("Full path from root")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        m("Display"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: U.recipe.displayMode,
                            onChange: (h) => Dt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                displayMode: h.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "pseudocolor", children: m("Pseudocolor") }),
                              /* @__PURE__ */ b.jsx("option", { value: "scatter", children: m("Scatter") }),
                              /* @__PURE__ */ b.jsx("option", { value: "contour", children: m("Contour") })
                            ]
                          }
                        )
                      ] }),
                      dt.mode !== "off" && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: dt.mode === "populations" ? m("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : dt.mode === "metadata" ? m("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: dt.column ?? "" }) : m("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: U.recipe.iterated === !0,
                            onChange: (h) => Dt(
                              (S) => S.kind === "text" ? S : { ...S, iterated: h.target.checked }
                            )
                          }
                        ),
                        m("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: m("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: vi }), children: [
                        m("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: Fc || He(U, Pt),
                            value: U.recipe.title ?? "",
                            onChange: (h) => Dt(
                              (S) => S.kind === "text" ? S : { ...S, title: h.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ b.jsxs("summary", { children: [
                          m("Style"),
                          Object.keys(U.recipe.style ?? {}).length > 0 ? ` · ${m("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ b.jsx(
                          Pl,
                          {
                            effective: Qa(K, U.recipe),
                            own: U.recipe.style ?? {},
                            onChange: (h) => Dt(
                              (S) => ie(S) ? { ...S, style: Ts({ ...S.style, ...h }) } : S
                            )
                          }
                        ),
                        Object.keys(U.recipe.style ?? {}).length > 0 && /* @__PURE__ */ b.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: m("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Dt((h) => {
                              if (!ie(h)) return h;
                              const { style: S, ...I } = h;
                              return I;
                            }),
                            children: m("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => M(
                            U.recipe
                          ),
                          children: m("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            lt === "page" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: m("Page") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Size"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: K.page.preset,
                    onChange: (h) => ur(Cf(h.target.value, K.page.orientation, K.page)),
                    children: [
                      Object.entries(Sf).map(([h, S]) => /* @__PURE__ */ b.jsx("option", { value: h, children: S.label }, h)),
                      /* @__PURE__ */ b.jsx("option", { value: "custom", children: m("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Orientation"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: K.page.orientation,
                    onChange: (h) => ur({ ...K.page, orientation: h.target.value }),
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "portrait", children: m("Portrait") }),
                      /* @__PURE__ */ b.jsx("option", { value: "landscape", children: m("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((h) => /* @__PURE__ */ b.jsxs("label", { children: [
                m(h === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ b.jsx(
                  de,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": m(h === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Nl(K.page)[h === "width" ? "widthMm" : "heightMm"],
                    onCommit: (S) => {
                      const I = K.page.orientation === "landscape", B = h === "width" == !I ? "widthMm" : "heightMm";
                      ur({ ...K.page, preset: "custom", [B]: S });
                    }
                  }
                )
              ] }, h)) }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Margin (mm)"),
                /* @__PURE__ */ b.jsx(
                  de,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: K.page.marginMm,
                    onCommit: (h) => ur({ ...K.page, marginMm: h })
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ b.jsxs("label", { children: [
                  m("Pages across"),
                  /* @__PURE__ */ b.jsx(de, { min: 1, max: Cs, step: 1, integer: !0, "aria-label": m("Pages across"), value: K.page.columns, onCommit: (h) => ur({ ...K.page, columns: h }) })
                ] }),
                /* @__PURE__ */ b.jsxs("label", { children: [
                  m("Pages down"),
                  /* @__PURE__ */ b.jsx(de, { min: 1, max: Cs, step: 1, integer: !0, "aria-label": m("Pages down"), value: K.page.rows, onCommit: (h) => ur({ ...K.page, rows: h }) })
                ] })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Qc, disabled: !K.items.length, title: m("Make the page a custom size that holds every item inside the margin, as one page"), children: m("Fit page to content") }),
                /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: tf, disabled: !K.items.length, title: m("Scale and centre every item, as one group, to fill the first page inside its margin"), children: m("Fit content to page") })
              ] }),
              /* @__PURE__ */ b.jsx("h3", { children: m("Export") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Format"),
                /* @__PURE__ */ b.jsxs("select", { value: Rt, onChange: (h) => Gt(h.target.value), children: [
                  /* @__PURE__ */ b.jsx("option", { value: "pdf", children: m("PDF · the page at its size") }),
                  /* @__PURE__ */ b.jsx("option", { value: "svg", children: m("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ b.jsx("option", { value: "png", children: m("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Resolution (dpi)"),
                /* @__PURE__ */ b.jsx(
                  de,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: K.page.dpi,
                    onCommit: (h) => ur({ ...K.page, dpi: h })
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: ve, onChange: (h) => Ne(h.target.checked) }),
                m("Crop to content")
              ] }),
              ve && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Padding (mm)"),
                /* @__PURE__ */ b.jsx(de, { min: 0, max: 50, step: 0.5, "aria-label": m("Padding (mm)"), value: Zr, onCommit: On })
              ] }),
              /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void os(), disabled: sr || !K.items.length, children: m(sr ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m(ve ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            lt === "iterate" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: m("Iterate") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Draw the sheet"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: dt.mode,
                    onChange: (h) => {
                      const S = h.target.value;
                      if (S === "metadata") {
                        const I = dt.column && o.includes(dt.column) ? dt.column : o[0] ?? "";
                        Xe({ ...dt, mode: "metadata", column: I, source: dt.source.kind === "metadata" ? { kind: "checked" } : dt.source });
                        return;
                      }
                      Xe({ ...dt, mode: S === "files" ? "files" : S === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "off", children: m("Once") }),
                      /* @__PURE__ */ b.jsx("option", { value: "files", children: m("Once per file") }),
                      /* @__PURE__ */ b.jsx("option", { value: "populations", children: m("Once per population") }),
                      /* @__PURE__ */ b.jsx("option", { value: "metadata", disabled: !o.length, children: m("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              dt.mode === "metadata" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Column"),
                /* @__PURE__ */ b.jsx("select", { value: dt.column ?? "", onChange: (h) => Xe({ ...dt, column: h.target.value }), children: o.map((h) => /* @__PURE__ */ b.jsx("option", { value: h, children: h }, h)) })
              ] }),
              dt.mode !== "off" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                dt.mode === "populations" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  m("Populations"),
                  /* @__PURE__ */ b.jsxs(
                    "select",
                    {
                      value: ((ps = dt.populations) == null ? void 0 : ps.kind) === "branch" ? dt.populations.populationId : "all",
                      onChange: (h) => Xe({
                        ...dt,
                        populations: h.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: h.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ b.jsx("option", { value: "all", children: m("All in the tree") }),
                        (Yt ? da(Yt.tree.populations, Yt.tree.root_population_id ?? "") : []).filter(({ popId: h }) => h !== (Yt == null ? void 0 : Yt.tree.root_population_id)).map(({ popId: h, depth: S }) => {
                          var I;
                          return /* @__PURE__ */ b.jsxs("option", { value: h, children: [
                            " ".repeat(S * 2),
                            m("Under {name}", { name: ((I = Yt == null ? void 0 : Yt.tree.populations[h]) == null ? void 0 : I.name) ?? h })
                          ] }, h);
                        })
                      ]
                    }
                  )
                ] }),
                (dt.mode === "files" || dt.mode === "metadata") && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  m("Files"),
                  /* @__PURE__ */ b.jsxs("select", { value: nf, onChange: (h) => Xe({ ...dt, source: af(h.target.value) }), children: [
                    /* @__PURE__ */ b.jsx("option", { value: "checked", children: m("Checked files") }),
                    /* @__PURE__ */ b.jsx("option", { value: "all", children: m("All files") }),
                    a.map((h) => /* @__PURE__ */ b.jsx("option", { value: `group:${h.id}`, children: m("Group {name}", { name: h.name }) }, h.id)),
                    dt.mode === "files" && o.flatMap(
                      (h) => rf(h).map((S) => /* @__PURE__ */ b.jsxs("option", { value: `meta:${h}=${S}`, children: [
                        h,
                        " = ",
                        S
                      ] }, `${h}=${S}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  m("Arrangement"),
                  /* @__PURE__ */ b.jsxs(
                    "select",
                    {
                      value: dt.arrangement.kind,
                      onChange: (h) => Xe({
                        ...dt,
                        arrangement: h.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ b.jsx("option", { value: "page-per-unit", children: dt.mode === "populations" ? m("One page per population") : dt.mode === "metadata" ? m("One page per value") : m("One page per file") }),
                        /* @__PURE__ */ b.jsx("option", { value: "tiles", children: m("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                dt.arrangement.kind === "tiles" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                  /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((h) => /* @__PURE__ */ b.jsxs("label", { children: [
                    m(h === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ b.jsx(
                      de,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": m(h === "columns" ? "Tiles across" : "Tiles down"),
                        value: dt.arrangement.kind === "tiles" ? dt.arrangement[h] : 1,
                        onCommit: (S) => {
                          dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, [h]: S } });
                        }
                      }
                    )
                  ] }, h)) }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    m("Order"),
                    /* @__PURE__ */ b.jsxs(
                      "select",
                      {
                        value: dt.arrangement.order,
                        onChange: (h) => dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, order: h.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ b.jsx("option", { value: "row-major", children: m("Across, then down") }),
                          /* @__PURE__ */ b.jsx("option", { value: "column-major", children: m("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    m("Gap between tiles (px)"),
                    /* @__PURE__ */ b.jsx(
                      de,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: dt.arrangement.gap,
                        onCommit: (h) => {
                          dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, gap: h } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: dt.mode === "populations" ? m("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Ke.length, of: (Yt == null ? void 0 : Yt.name) ?? "the file", pages: Math.max(1, ge.length) }) : dt.mode === "metadata" ? m("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Ke.length, column: dt.column ?? "", files: Ke.reduce((h, S) => {
                  var I;
                  return h + (((I = S.sampleIds) == null ? void 0 : I.length) ?? 0);
                }, 0), pages: Math.max(1, ge.length) }) : m("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Ke.length, pages: Math.max(1, ge.length) }) })
              ] })
            ] }),
            lt === "style" && K && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: m("Style") }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                m("Plot titles"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    "aria-label": m("Plot titles"),
                    value: Go ? "custom" : ((hs = ca.find((h) => h.template === (K.titleTemplate ?? ""))) == null ? void 0 : hs.id) ?? "custom",
                    onChange: (h) => {
                      const S = ca.find((I) => I.id === h.target.value);
                      zc(!S), Ot((I) => {
                        var B;
                        S ? S.template ? I.titleTemplate = S.template : delete I.titleTemplate : I.titleTemplate = ((B = I.titleTemplate) == null ? void 0 : B.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ca.map((h) => /* @__PURE__ */ b.jsx("option", { value: h.id, children: m(h.label) }, h.id)),
                      /* @__PURE__ */ b.jsx("option", { value: "custom", children: m("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const h = K.items.filter((S) => Ho(S));
                return h.length ? /* @__PURE__ */ b.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  m("{count} plots keep a title of their own, so the template does not reach them.", { count: h.length }),
                  " ",
                  /* @__PURE__ */ b.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: m("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Ot((S) => {
                        for (const I of S.items) ie(I.recipe) && delete I.recipe.title;
                      }),
                      children: m("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (Go || !ca.some((h) => h.template === (K.titleTemplate ?? ""))) && (() => {
                var kt;
                const h = K.titleTemplate ?? "", S = cg(h), I = (S == null ? void 0 : S.tokens) ?? [], B = (S == null ? void 0 : S.separator) ?? Ac, G = (ut) => {
                  var _t;
                  return ((_t = Lo.find((ee) => ee.token === ut)) == null ? void 0 : _t.label) ?? ut;
                }, X = (ut) => Ot((_t) => {
                  _t.titleTemplate = Ml(ut, B);
                }), Y = Vt.items.find((ut) => ie(ut.recipe)), st = Y && ie(Y.recipe) ? Ia(h, Dr(Y.recipe, Y.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ b.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": m("Title builder"), children: [
                  /* @__PURE__ */ b.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": m("Fields in the title"), children: [
                    I.length === 0 && /* @__PURE__ */ b.jsx("span", { className: "gl-hint", children: m(S === null && h ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    I.map((ut, _t) => /* @__PURE__ */ b.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": m("Remove {field}", { field: G(ut) }),
                        title: m("Remove {field} from the title", { field: G(ut) }),
                        onClick: () => X(I.filter((ee, be) => be !== _t)),
                        children: [
                          G(ut),
                          " ×"
                        ]
                      },
                      `${ut}-${_t}`
                    ))
                  ] }),
                  /* @__PURE__ */ b.jsx("div", { className: "gl-title-builder-fields", "aria-label": m("Fields to add"), children: Lo.map((ut) => /* @__PURE__ */ b.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": m("Add {field}", { field: ut.label }),
                      title: ut.token,
                      onClick: () => X([...I, ut.token]),
                      children: ut.label
                    },
                    ut.token
                  )) }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    m("Between fields"),
                    /* @__PURE__ */ b.jsx(
                      "select",
                      {
                        "aria-label": m("Separator"),
                        value: ((kt = gi.find((ut) => ut.value === B)) == null ? void 0 : kt.id) ?? "dot",
                        onChange: (ut) => {
                          var ee;
                          const _t = ((ee = gi.find((be) => be.id === ut.target.value)) == null ? void 0 : ee.value) ?? " · ";
                          Bc(_t), I.length && Ot((be) => {
                            be.titleTemplate = Ml(I, _t);
                          });
                        },
                        children: gi.map((ut) => /* @__PURE__ */ b.jsx("option", { value: ut.id, children: m(ut.label) }, ut.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    m("Template"),
                    /* @__PURE__ */ b.jsx(
                      "input",
                      {
                        "aria-label": m("Title template"),
                        value: h,
                        onChange: (ut) => Ot((_t) => {
                          _t.titleTemplate = ut.target.value;
                        })
                      }
                    )
                  ] }),
                  st && /* @__PURE__ */ b.jsx("div", { className: "gl-hint gl-title-builder-preview", children: m("First plot reads: {title}", { title: st }) })
                ] });
              })(),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: m(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: vi }) }),
              /* @__PURE__ */ b.jsx(
                Pl,
                {
                  effective: Qa(K),
                  own: K.style ?? {},
                  onChange: (h) => Ot((S) => {
                    S.style = Ts({ ...S.style, ...h });
                  })
                }
              ),
              Object.keys(K.style ?? {}).length > 0 && /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Ot((h) => {
                    delete h.style;
                  }),
                  children: m("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ b.jsx(wf, { menu: Lc, onClose: () => Ha(null) }),
          /* @__PURE__ */ b.jsxs(
            "div",
            {
              ref: (h) => {
                Ve.current = h, q(h);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": m("Layout page"),
              onKeyDown: of,
              children: [
                !pt && F && /* @__PURE__ */ b.jsx(
                  eg,
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
                    dragCondition: (h) => {
                      var S, I, B;
                      return !((B = (I = (S = h.inputEvent) == null ? void 0 : S.target) == null ? void 0 : I.closest) != null && B.call(I, "textarea, input, select, button"));
                    },
                    onDragStart: Kc,
                    onSelectEnd: Zc
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: K.width * xt, height: K.height * xt },
                    children: /* @__PURE__ */ b.jsxs(
                      "section",
                      {
                        ref: (h) => {
                          Jr.current = h, $(h);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": K.name,
                        onContextMenu: Yc,
                        style: { width: K.width, height: K.height, transform: `scale(${xt})` },
                        children: [
                          va(K.page).map((h) => {
                            const S = bi(K.page), I = bs(K.page.marginMm);
                            return /* @__PURE__ */ b.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: h.x, top: h.y, width: S.width, height: S.height }, children: I > 0 && /* @__PURE__ */ b.jsx("div", { className: "gl-layout-page-margin", style: { inset: I } }) }, `${h.row}-${h.column}`);
                          }),
                          Vt.items.length === 0 && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ b.jsx("strong", { children: m("Blank layout") }),
                            /* @__PURE__ */ b.jsx("span", { children: m(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Vt.items.map((h) => /* @__PURE__ */ b.jsx(
                            $g,
                            {
                              item: h,
                              templateText: (() => {
                                const S = K.items.find((I) => I.id === h.templateId);
                                return (S == null ? void 0 : S.recipe.kind) === "text" ? S.recipe.text : void 0;
                              })(),
                              selected: _.includes(h.id),
                              samples: Pt,
                              state: f,
                              globalScales: d,
                              dataRevision: k,
                              densityColorPower: D,
                              style: Qa(K, h.recipe),
                              titleTemplate: Ho(h, h.templateSampleId) || Wo,
                              describe: Dr,
                              checkedSampleIds: n,
                              metadataById: Er,
                              files: r,
                              sources: Me.sources,
                              divisionProfiles: C,
                              imageService: w,
                              canvasScale: Lt,
                              onTextChange: (S, I) => {
                                if (!S.trim()) {
                                  nn([h.templateId]);
                                  return;
                                }
                                Ot((B) => {
                                  const G = B.items.find(
                                    (X) => X.id === h.templateId
                                  );
                                  (G == null ? void 0 : G.recipe.kind) === "text" && (G.recipe.text = S, I > 0 && (G.height = Math.max(G.height, Math.ceil(I) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!_.includes(h.id) || _.length > 1) && j([h.id]);
                              },
                              textEditing: O === h.id,
                              onTextEditStart: () => {
                                j([h.id]), R(h.id);
                              },
                              onIsolate: h.group && _.includes(h.id) && _.length > 1 ? () => j([h.id]) : void 0,
                              onTextEditEnd: () => {
                                var S;
                                R((I) => I === h.id ? null : I), (S = Ve.current) == null || S.focus({ preventScroll: !0 });
                              }
                            },
                            h.id
                          )),
                          !pt && /* @__PURE__ */ b.jsx(
                            Av,
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
                              snapDirections: Rl,
                              elementSnapDirections: Rl,
                              elementGuidelines: rt,
                              verticalGuidelines: ns.vertical,
                              horizontalGuidelines: ns.horizontal,
                              snapGridWidth: z ? Il : 0,
                              snapGridHeight: z ? Il : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: rn,
                              container: rn ? W : void 0,
                              onDragStart: Uc,
                              onDrag: ts,
                              onDragEnd: (h) => {
                                const S = es(h);
                                Yn(S, h.lastEvent, h.isDrag, () => Fn(S, !!h.datas.alt));
                              },
                              onDragGroupStart: (h) => {
                                var S;
                                h.datas.alt = !!((S = h.inputEvent) != null && S.altKey), Wn([...h.targets ?? []], h.datas.alt ? Jo(h.targets ?? []) : void 0);
                              },
                              onDragGroup: (h) => h.events.forEach(ts),
                              onDragGroupEnd: (h) => Yn(h.targets, h.lastEvent, h.isDrag, () => Fn(h.targets, !!h.datas.alt)),
                              onResizeStart: (h) => {
                                var S;
                                Wn([h.target]), (S = h.inputEvent) != null && S.altKey && h.setFixedDirection([0, 0]);
                              },
                              onResize: rs,
                              onResizeEnd: (h) => Yn([h.target], h.lastEvent, h.isDrag, () => Fn([h.target], !1)),
                              onResizeGroupStart: (h) => {
                                var S;
                                Wn([...h.targets ?? []]), (S = h.inputEvent) != null && S.altKey && h.events.forEach((I) => I.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (h) => h.events.forEach(rs),
                              onResizeGroupEnd: (h) => Yn(h.targets, h.lastEvent, h.isDrag, () => Fn(h.targets, !1)),
                              onClick: (h) => {
                                var S, I;
                                if (zn.current) {
                                  zn.current = !1;
                                  return;
                                }
                                ((S = h.inputEvent) != null && S.shiftKey || rn) && ((I = nt.current) == null || I.clickTarget(h.inputEvent, h.inputTarget));
                              },
                              onClickGroup: (h) => {
                                var S;
                                (S = nt.current) == null || S.clickTarget(h.inputEvent, h.inputTarget);
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
  Kg as LayoutTab,
  Yg as isBakedTitle
};
