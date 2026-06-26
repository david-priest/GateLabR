// division_plot.js — Division Profiler: a 1D histogram of one dye channel with
// DRAGGABLE division-gate boundaries, coloured by division level.
//
// Isolated from the 2D gating engine (window.CytofD3): it owns its container
// (#division-plot-container), its R->JS message ("updateDivisionPlot") and its
// JS->R input ("division_gates"). It never touches CytofD3 state.
//
// Interaction: each boundary is a full-height vertical line with an x-locked
// drag handle (cloned from the quadrant-gate vline drag), clamped between its
// neighbours so lines cannot cross. The bins recolour live during the drag; on
// drag-end the sorted boundaries are sent back to R as "division_gates".
(function () {
  "use strict";

  var CTNR = "division-plot-container";
  var H = 430;
  var BH = 330;   // biplot height (only drawn when a Y marker is supplied)
  var M = { top: 26, right: 16, bottom: 46, left: 58 };
  var PAIRED = ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
                "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];

  var _seq = -1, _editSeq = 0, _dragging = false;
  var S = null;   // render state

  function _container() { return document.getElementById(CTNR); }

  function _decodeF32(b64) {
    var bin = atob(b64), n = bin.length, bytes = new Uint8Array(n);
    for (var i = 0; i < n; i++) bytes[i] = bin.charCodeAt(i);
    return new Float32Array(bytes.buffer);
  }

  // Division level for an x value. Div0 = brightest = above the top boundary.
  function _level(x, b) { return b.length - d3.bisectRight(b, x); }
  function _colorFor(xc) {
    var lv = _level(xc, S.bounds);
    return S.palette[Math.max(0, Math.min(S.palette.length - 1, lv))];
  }

  // recolour bars + reposition per-bin labels for the current S.bounds; the
  // biplot's mirror lines track live too (its points recolour on drag-end).
  function _refresh() {
    S.bars.attr("fill", function (d, i) { return _colorFor(S.xr[0] + (i + 0.5) * S.binW); });
    var edges = [S.xr[0]].concat(S.bounds).concat([S.xr[1]]);
    S.labels.attr("x", function (d, k) { return S.xs((edges[k] + edges[k + 1]) / 2); })
            .text(function (d, k) {
              var lv = _level((edges[k] + edges[k + 1]) / 2, S.bounds);
              return (S.binLabels[lv] || ("Div" + lv));
            });
    if (S.biplot) _drawBiplotLines();
  }

  // canvas scatter of (dye x, marker y), coloured by division level
  function _drawBiplot() {
    var B = S.biplot; if (!B) return;
    var ctx = B.ctx;
    ctx.clearRect(0, 0, B.cw, B.ch);
    ctx.globalAlpha = B.alpha;
    for (var i = 0; i < B.bx.length; i++) {
      var lv = _level(B.bx[i], S.bounds);
      ctx.fillStyle = S.palette[Math.max(0, Math.min(S.palette.length - 1, lv))];
      var px = B.ox + B.xs(B.bx[i]);
      var py = B.oy + B.ys(B.by[i]);
      ctx.beginPath(); ctx.arc(px, py, 1.5, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  // read-only dashed division lines mirrored onto the biplot
  function _drawBiplotLines() {
    var B = S.biplot; if (!B) return;
    var sel = B.lineLayer.selectAll("line.dl").data(S.bounds);
    sel.enter().append("line").attr("class", "dl")
      .merge(sel)
      .attr("x1", function (d) { return B.xs(d); }).attr("x2", function (d) { return B.xs(d); })
      .attr("y1", 0).attr("y2", B.ih)
      .attr("stroke", "#111").attr("stroke-width", 1).attr("stroke-dasharray", "3,3")
      .attr("opacity", 0.7);
    sel.exit().remove();
  }

  function _emit() {
    if (!window.Shiny) return;
    _editSeq++;
    var sorted = S.bounds.slice().sort(function (a, b) { return a - b; });
    Shiny.setInputValue("division_gates", { boundaries: sorted, seq: _editSeq },
                        { priority: "event" });
  }

  function _showTip(px, val) {
    S.tip.style("display", null)
      .attr("transform", "translate(" + px + "," + (-6) + ")");
    S.tip.select("text").text(val.toFixed(2));
  }
  function _hideTip() { if (S) S.tip.style("display", "none"); }

  function render(data) {
    if (!data) return;
    if (typeof data._div_seq === "number") {
      if (data._div_seq < _seq) return;
      _seq = data._div_seq;
    }
    var el = _container();
    if (!el) return;

    var W = Math.max(360, el.clientWidth || 820);
    var iw = W - M.left - M.right, ih = H - M.top - M.bottom;

    var x = data.x_b64 ? _decodeF32(data.x_b64) : (data.x || []);
    var xr = data.x_range || [0, 8];
    var bounds = (data.boundaries || []).slice().sort(function (a, b) { return a - b; });
    var palette = (data.palette && data.palette.length) ? data.palette : PAIRED;
    var binLabels = data.bin_labels || [];

    var xs = d3.scaleLinear().domain(xr).range([0, iw]);
    var nbin = (data.bins && data.bins >= 2) ? Math.round(data.bins) : 120;
    var binW = (xr[1] - xr[0]) / nbin;
    var counts = new Array(nbin).fill(0);
    for (var i = 0; i < x.length; i++) {
      var v = x[i];
      if (v < xr[0] || v > xr[1]) continue;
      counts[Math.min(nbin - 1, Math.max(0, Math.floor((v - xr[0]) / binW)))]++;
    }
    var ymax = d3.max(counts) || 1;
    var ys = d3.scaleSqrt().domain([0, ymax]).range([ih, 0]).nice();

    d3.select(el).selectAll("svg").remove();
    d3.select(el).selectAll(".division-biplot-wrap").remove();
    var svg = d3.select(el).append("svg").attr("width", W).attr("height", H);
    var g = svg.append("g").attr("transform", "translate(" + M.left + "," + M.top + ")");

    S = { svg: svg, g: g, xs: xs, ih: ih, iw: iw, xr: xr, binW: binW,
          bounds: bounds, palette: palette, binLabels: binLabels };

    // bars
    S.bars = g.append("g").attr("class", "division-bars")
      .selectAll("rect").data(counts).enter().append("rect")
      .attr("x", function (d, i) { return xs(xr[0] + i * binW); })
      .attr("width", Math.max(1, iw / nbin - 0.3))
      .attr("y", function (d) { return ys(d); })
      .attr("height", function (d) { return ih - ys(d); });

    // axes + labels
    g.append("g").attr("transform", "translate(0," + ih + ")")
      .call(d3.axisBottom(xs).ticks(6)).attr("font-size", 12);
    g.append("g").call(d3.axisLeft(ys).ticks(5)).attr("font-size", 12);
    svg.append("text").attr("x", M.left + iw / 2).attr("y", H - 8)
      .attr("text-anchor", "middle").attr("font-size", 14)
      .text((data.x_label || "channel") + " expression");
    svg.append("text").attr("transform", "rotate(-90)")
      .attr("x", -(M.top + ih / 2)).attr("y", 14)
      .attr("text-anchor", "middle").attr("font-size", 14).text("Count (sqrt)");

    // per-bin labels (Div0..DivN)
    var edges = [xr[0]].concat(bounds).concat([xr[1]]);
    S.labels = g.append("g").attr("class", "division-bin-labels")
      .selectAll("text").data(d3.range(edges.length - 1)).enter().append("text")
      .attr("y", 12).attr("text-anchor", "middle").attr("font-size", 12)
      .attr("font-weight", "600").attr("fill", "#333");

    // draggable boundary lines
    var layer = g.append("g").attr("class", "division-gate-layer");
    S.lineGroups = [];
    bounds.forEach(function (b, idx) {
      var px = xs(b);
      var grp = layer.append("g").attr("class", "division-line").style("cursor", "ew-resize");
      var line = grp.append("line").attr("x1", px).attr("x2", px).attr("y1", 0).attr("y2", ih)
        .attr("stroke", "#111").attr("stroke-width", 1.4);
      var hit = grp.append("line").attr("x1", px).attr("x2", px).attr("y1", 0).attr("y2", ih)
        .attr("stroke", "transparent").attr("stroke-width", 12);
      var handle = grp.append("circle").attr("cx", px).attr("cy", 0).attr("r", 4.5)
        .attr("fill", "#111");
      S.lineGroups.push({ line: line, hit: hit, handle: handle });
      grp.call(d3.drag()
        .on("start", function (ev) { if (ev.sourceEvent) ev.sourceEvent.stopPropagation(); _dragging = true; })
        .on("drag", function (ev) {
          var p = d3.pointer(ev, S.g.node());
          var nx = S.xs.invert(p[0]);
          var lo = (idx > 0) ? S.bounds[idx - 1] + 1e-4 : S.xr[0];
          var hi = (idx < S.bounds.length - 1) ? S.bounds[idx + 1] - 1e-4 : S.xr[1];
          nx = Math.max(lo, Math.min(hi, nx));
          S.bounds[idx] = nx;
          var npx = S.xs(nx);
          line.attr("x1", npx).attr("x2", npx);
          hit.attr("x1", npx).attr("x2", npx);
          handle.attr("cx", npx);
          _refresh();
          _showTip(npx, nx);
        })
        .on("end", function () { _dragging = false; _hideTip(); if (S.biplot) _drawBiplot(); _emit(); }));
    });

    // drag tooltip (hidden until a drag)
    S.tip = g.append("g").attr("class", "division-tip").style("display", "none");
    S.tip.append("rect").attr("x", -18).attr("y", -14).attr("width", 36).attr("height", 14)
      .attr("rx", 2).attr("fill", "#111").attr("opacity", 0.85);
    S.tip.append("text").attr("y", -3).attr("text-anchor", "middle")
      .attr("font-size", 10).attr("fill", "#fff");

    // ── biplot (optional): dye x (shared scale + division lines) vs Y marker ──
    S.biplot = null;
    if (data.bx_b64 && data.y_b64) {
      var bx = _decodeF32(data.bx_b64), by = _decodeF32(data.y_b64);
      var yr = data.y_range || [d3.min(by) || 0, d3.max(by) || 1];
      var bih = BH - M.top - M.bottom;
      var bys = d3.scaleLinear().domain(yr).range([bih, 0]).nice();

      var wrap = d3.select(el).append("div")
        .attr("class", "division-biplot-wrap")
        .style("position", "relative").style("width", W + "px").style("height", BH + "px");
      var canvas = wrap.append("canvas")
        .attr("width", W).attr("height", BH)
        .style("position", "absolute").style("left", "0").style("top", "0").node();
      var bsvg = wrap.append("svg").attr("width", W).attr("height", BH)
        .style("position", "absolute").style("left", "0").style("top", "0");
      var bg = bsvg.append("g").attr("transform", "translate(" + M.left + "," + M.top + ")");
      bg.append("g").attr("transform", "translate(0," + bih + ")")
        .call(d3.axisBottom(xs).ticks(6)).attr("font-size", 12);
      bg.append("g").call(d3.axisLeft(bys).ticks(5)).attr("font-size", 12);
      bsvg.append("text").attr("x", M.left + iw / 2).attr("y", BH - 8)
        .attr("text-anchor", "middle").attr("font-size", 14)
        .text((data.x_label || "channel") + " expression");
      bsvg.append("text").attr("transform", "rotate(-90)")
        .attr("x", -(M.top + bih / 2)).attr("y", 14)
        .attr("text-anchor", "middle").attr("font-size", 14).text(data.y_label || "marker");
      var lineLayer = bg.append("g").attr("class", "division-biplot-lines");

      S.biplot = { ctx: canvas.getContext("2d"), cw: W, ch: BH, bx: bx, by: by,
                   xs: xs, ys: bys, ox: M.left, oy: M.top, ih: bih,
                   lineLayer: lineLayer, alpha: data.point_alpha || 0.4 };
      _drawBiplot();
      _drawBiplotLines();
    }

    _refresh();
  }

  function clear() {
    var el = _container();
    if (el) { d3.select(el).selectAll("svg").remove(); d3.select(el).selectAll(".division-biplot-wrap").remove(); }
  }

  function _register() {
    if (!window.Shiny) return;
    Shiny.addCustomMessageHandler("updateDivisionPlot", function (d) { render(d); });
  }
  if (document.readyState !== "loading") _register();
  else document.addEventListener("DOMContentLoaded", _register);

  window.DivisionD3 = { render: render, clear: clear };
})();
