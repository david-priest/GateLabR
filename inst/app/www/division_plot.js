// division_plot.js — Division Profiler: a 1D histogram of one dye channel with
// division-gate boundaries, coloured by division level.
//
// Deliberately isolated from the 2D gating engine (window.CytofD3): it owns its
// container (#division-plot-container), its own R->JS message ("updateDivisionPlot")
// and (from increment 2) its own JS->R input ("division_gates"). It never touches
// CytofD3 state.
//
// Increment 1: static histogram + static boundary lines (no drag yet).
(function () {
  "use strict";

  var CTNR = "division-plot-container";
  var H = 430;
  var M = { top: 26, right: 16, bottom: 46, left: 58 };
  var _data = null, _seq = -1;

  // 12-colour Brewer "Paired" (matches DivisionProfiler), hard-coded to avoid a
  // new R dependency; R sends the actual palette in the payload anyway.
  var PAIRED = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
                "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];

  function _container() { return document.getElementById(CTNR); }

  function _decodeF32(b64) {
    var bin = atob(b64), n = bin.length, bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
    return new Float32Array(bytes.buffer);
  }

  // Division level for an x value. Div0 = brightest = above the top boundary.
  function _level(x, sortedBounds) {
    return sortedBounds.length - d3.bisectRight(sortedBounds, x);
  }

  function render(data) {
    if (!data) return;
    if (typeof data._div_seq === "number") {
      if (data._div_seq < _seq) return;
      _seq = data._div_seq;
    }
    _data = data;
    var el = _container();
    if (!el) return;

    var W = Math.max(360, el.clientWidth || 820);
    var iw = W - M.left - M.right, ih = H - M.top - M.bottom;

    var x = data.x_b64 ? _decodeF32(data.x_b64) : (data.x || []);
    var xr = data.x_range || [0, 8];
    var bounds = (data.boundaries || []).slice().sort(function (a, b) { return a - b; });
    var palette = (data.palette && data.palette.length) ? data.palette : PAIRED;
    var labels = data.bin_labels || [];

    // --- scales + binning ---
    var xs = d3.scaleLinear().domain(xr).range([0, iw]);
    var nbin = 120;
    var binW = (xr[1] - xr[0]) / nbin;
    var counts = new Array(nbin).fill(0);
    for (var i = 0; i < x.length; i++) {
      var v = x[i];
      if (v < xr[0] || v > xr[1]) continue;
      var bi = Math.min(nbin - 1, Math.max(0, Math.floor((v - xr[0]) / binW)));
      counts[bi]++;
    }
    var ymax = d3.max(counts) || 1;
    // sqrt count axis (the DivisionProfiler de-squash) so a dominant peak doesn't
    // flatten the ladder.
    var ys = d3.scaleSqrt().domain([0, ymax]).range([ih, 0]).nice();

    // --- svg scaffold ---
    d3.select(el).selectAll("svg").remove();
    var svg = d3.select(el).append("svg").attr("width", W).attr("height", H);
    var g = svg.append("g").attr("transform", "translate(" + M.left + "," + M.top + ")");

    function colorFor(xc) {
      var lv = _level(xc, bounds);
      return palette[Math.max(0, Math.min(palette.length - 1, lv))];
    }

    // bars coloured by division level
    g.append("g").attr("class", "division-bars")
      .selectAll("rect").data(counts).enter().append("rect")
      .attr("x", function (d, i) { return xs(xr[0] + i * binW); })
      .attr("width", Math.max(1, iw / nbin - 0.3))
      .attr("y", function (d) { return ys(d); })
      .attr("height", function (d) { return ih - ys(d); })
      .attr("fill", function (d, i) { return colorFor(xr[0] + (i + 0.5) * binW); });

    // axes
    g.append("g").attr("transform", "translate(0," + ih + ")")
      .call(d3.axisBottom(xs).ticks(6));
    g.append("g").call(d3.axisLeft(ys).ticks(5));
    svg.append("text").attr("x", M.left + iw / 2).attr("y", H - 10)
      .attr("text-anchor", "middle").attr("font-size", 12)
      .text((data.x_label || "channel") + " expression");
    svg.append("text").attr("transform", "rotate(-90)")
      .attr("x", -(M.top + ih / 2)).attr("y", 15)
      .attr("text-anchor", "middle").attr("font-size", 12).text("Count (sqrt)");

    // boundary lines (static in increment 1)
    g.append("g").attr("class", "division-gate-layer")
      .selectAll("line").data(bounds).enter().append("line")
      .attr("x1", function (d) { return xs(d); }).attr("x2", function (d) { return xs(d); })
      .attr("y1", 0).attr("y2", ih)
      .attr("stroke", "#111").attr("stroke-width", 1.3).attr("stroke-dasharray", "4 3");

    // per-bin labels (Div0..DivN) centred between boundaries
    var edges = [xr[0]].concat(bounds).concat([xr[1]]);
    for (var k = 0; k < edges.length - 1; k++) {
      var mid = (edges[k] + edges[k + 1]) / 2;
      var lv = _level(mid, bounds);
      g.append("text").attr("x", xs(mid)).attr("y", 12)
        .attr("text-anchor", "middle").attr("font-size", 10).attr("fill", "#333")
        .text(labels[lv] || ("Div" + lv));
    }
  }

  function clear() {
    var el = _container();
    if (el) d3.select(el).selectAll("svg").remove();
  }

  function _register() {
    if (!window.Shiny) return;
    Shiny.addCustomMessageHandler("updateDivisionPlot", function (d) { render(d); });
  }
  if (document.readyState !== "loading") _register();
  else document.addEventListener("DOMContentLoaded", _register);

  window.DivisionD3 = { render: render, clear: clear };
})();
