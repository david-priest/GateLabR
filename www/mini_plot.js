/**
 * mini_plot.js — Static mini-plot renderer for Strategy and Illustration tabs.
 *
 * Renders small biaxial/histogram plots with gate overlays into container divs.
 * No interactivity (no zoom/pan, no gate editing). Used for multi-panel grids.
 *
 * Supports: scatter, pseudocolor, contour display modes.
 * Each plot = canvas (dots) + SVG overlay (axes, gate polygons, labels, title).
 */

'use strict';

(function () {
    var _miniContextMenuEl = null;
    var _renderVersions = { illustration: 0, strategy: 0 };

    function _escapeCssAttr(value) {
        if (window.CSS && typeof window.CSS.escape === 'function') {
            return window.CSS.escape(String(value));
        }
        return String(value).replace(/(["\\])/g, '\\$1');
    }

    function _resolveCurrentPlotCell(plotDiv) {
        if (!plotDiv) return null;
        var key = plotDiv.getAttribute('data-plot-key');
        var rv = plotDiv.getAttribute('data-render-version');
        var family = plotDiv.getAttribute('data-render-family') || 'illustration';
        var currentVersion = String(_renderVersions[family] || 0);

        if (plotDiv.isConnected && rv === currentVersion) {
            return plotDiv;
        }

        if (key) {
            var selector = '.mini-plot-cell[data-render-family="' + _escapeCssAttr(family) + '"][data-plot-key="' + _escapeCssAttr(key) + '"][data-render-version="' + currentVersion + '"]';
            var live = document.querySelector(selector);
            if (live) return live;
        }

        return plotDiv.isConnected ? plotDiv : null;
    }

    // ── Jet colormap (256 entries) ──────────────────────────────────────────
    var _jetLUT = (function () {
        var lut = new Array(256);
        for (var i = 0; i < 256; i++) {
            var t = i / 255;
            var r, g, b;
            if      (t < 0.125) { r = 0;                    g = 0;                     b = 0.5 + t * 4; }
            else if (t < 0.375) { r = 0;                    g = (t - 0.125) * 4;       b = 1; }
            else if (t < 0.625) { r = (t - 0.375) * 4;      g = 1;                     b = 1 - (t - 0.375) * 4; }
            else if (t < 0.875) { r = 1;                    g = 1 - (t - 0.625) * 4;   b = 0; }
            else                { r = 1 - (t - 0.875) * 4;  g = 0;                     b = 0; }
            r = Math.max(0, Math.min(1, r));
            g = Math.max(0, Math.min(1, g));
            b = Math.max(0, Math.min(1, b));
            lut[i] = 'rgb(' + Math.round(r * 255) + ',' + Math.round(g * 255) + ',' + Math.round(b * 255) + ')';
        }
        return lut;
    })();

    function _normalizeDisplayMode(mode) {
        var m = String(mode || 'scatter').toLowerCase();
        if (m === 'pseudo' || m === 'pseudocolor' || m === 'pseudocolour') return 'pseudocolor';
        if (m === 'contour' || m === 'contours') return 'contour';
        if (m === 'scatter') return 'scatter';
        return 'scatter';
    }

    function _normalizePlotSize(size) {
        var px = parseInt(size, 10);
        if (!isFinite(px)) px = 200;
        if (px < 120) px = 120;
        if (px > 800) px = 800;
        return px;
    }

    // ── Render a single mini plot ───────────────────────────────────────────
    function renderMiniPlot(container, cfg) {
        container.innerHTML = '';
        var size = _normalizePlotSize(cfg.plot_size);
        var displayMode = _normalizeDisplayMode(cfg.display_mode);
        var M = { top: 22, right: 8, bottom: 38, left: 42 };
        var W = size - M.left - M.right;
        var H = size - M.top - M.bottom;

        container.style.position = 'relative';
        container.style.width = size + 'px';
        container.style.height = size + 'px';
        container.style.minWidth = size + 'px';
        container.style.minHeight = size + 'px';
        container.style.flex = '0 0 auto';
        container.style.display = 'inline-block';
        container.style.verticalAlign = 'top';

        // Keep a normalized render config on the plot cell for high-DPI export rerenders.
        container.__miniPlotCfg = Object.assign({}, cfg, {
            plot_size: size,
            display_mode: displayMode
        });

        // Canvas — rendered at 2× internal resolution for crisp on-screen display.
        // Drawing code uses logical coordinates (0..size); ctx.scale() maps
        // them to the physical pixel buffer.
        var CANVAS_SCALE = Number(cfg.canvas_scale);
        if (!isFinite(CANVAS_SCALE) || CANVAS_SCALE <= 0) CANVAS_SCALE = 2;
        var canvas = document.createElement('canvas');
        canvas.width  = size * CANVAS_SCALE;
        canvas.height = size * CANVAS_SCALE;
        canvas.style.position = 'absolute';
        canvas.style.top  = '0';
        canvas.style.left = '0';
        canvas.style.width  = size + 'px';
        canvas.style.height = size + 'px';
        container.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size * CANVAS_SCALE, size * CANVAS_SCALE);
        ctx.scale(CANVAS_SCALE, CANVAS_SCALE);

        // SVG — force Arial/Helvetica so exported PDF text is not Times Roman
        var svg = d3.select(container).append('svg')
            .attr('width', size).attr('height', size)
            .style('position', 'absolute')
            .style('top', '0').style('left', '0')
            .style('font-family', 'Arial, Helvetica, sans-serif');

        var g = svg.append('g')
            .attr('transform', 'translate(' + M.left + ',' + M.top + ')');

        // Scales
        var xr = cfg.x_range || [0, 1];
        var yr = cfg.y_range || [0, 1];
        var xScale = d3.scaleLinear().domain(xr).range([0, W]);
        var yScale = d3.scaleLinear().domain(yr).range([H, 0]);

        var fs = cfg.font_sizes || {};
        var tickFs = (fs.tick || 9) + 'px';
        var axisFs = (fs.axis_label || 11) + 'px';
        var gateFs = (fs.gate_label || 9) + 'px';
        var titleFs = (fs.title || 11) + 'px';

        // ── Draw data ───────────────────────────────────────────────────────
        var x = cfg.x, y = cfg.y;
        var xBack = cfg.x_back, yBack = cfg.y_back;
        var hasDual = !!(xBack && xBack.length > 0 && yBack && yBack.length > 0);
        if (hasDual && displayMode === 'pseudocolor') {
            // Dual overlays are intentionally limited to scatter/contour for readability.
            displayMode = 'scatter';
        }
        var overlayTraces = cfg.overlay_traces;  // [{x,y,color,name}, ...]
        var hasOverlay = !!(overlayTraces && overlayTraces.length > 0);
        if (hasOverlay && displayMode === 'pseudocolor') displayMode = 'scatter';

        if (x && x.length > 0 && y && y.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(M.left, M.top, W, H);
            ctx.clip();

            // Configurable point radius and alpha
            var dotR = Number(cfg.point_size);
            if (!isFinite(dotR) || dotR <= 0) dotR = 1.2;
            var cfgAlpha = Number(cfg.point_alpha);
            var hasAlpha = isFinite(cfgAlpha) && cfgAlpha > 0;

            if (!hasOverlay && displayMode === 'pseudocolor') {
                _drawPseudocolor(ctx, x, y, xScale, yScale, M, W, H, dotR, cfgAlpha);
            } else if (!hasOverlay && displayMode === 'contour') {
                _drawContour(ctx, x, y, xScale, yScale, M, W, H, {
                    contour_threshold: cfg.contour_threshold,
                    point_alpha: cfg.point_alpha,
                    kde_bandwidth: cfg.kde_bandwidth,
                    line_color: cfg.pop_color || '#111111',
                    outlier_color: cfg.pop_color || '#111111',
                    dot_radius: dotR
                });
                if (hasDual) {
                    _drawContour(ctx, xBack, yBack, xScale, yScale, M, W, H, {
                        contour_threshold: cfg.contour_threshold,
                        point_alpha: cfg.point_alpha,
                        kde_bandwidth: cfg.kde_bandwidth,
                        line_color: cfg.back_color || '#d95f02',
                        outlier_color: cfg.back_color || '#d95f02',
                        dot_radius: dotR
                    });
                }
            } else {
                // Scatter (including overlay biplot)
                var alpha = hasAlpha ? cfgAlpha : (hasOverlay ? 0.28 : (hasDual ? 0.42 : 0.35));

                // Draw additional overlay traces first (underneath the main pop)
                if (hasOverlay) {
                    for (var oi = 0; oi < overlayTraces.length; oi++) {
                        var tr = overlayTraces[oi];
                        if (!tr.x || !tr.y) continue;
                        ctx.fillStyle = tr.color;
                        ctx.globalAlpha = alpha;
                        for (var ti = 0; ti < tr.x.length; ti++) {
                            var tpx = xScale(tr.x[ti]) + M.left;
                            var tpy = yScale(tr.y[ti]) + M.top;
                            if (tpx < M.left - 2 || tpx > M.left + W + 2 ||
                                tpy < M.top  - 2 || tpy > M.top  + H + 2) continue;
                            ctx.beginPath();
                            ctx.arc(tpx, tpy, dotR, 0, 6.2832);
                            ctx.fill();
                        }
                    }
                }

                ctx.fillStyle = cfg.pop_color || '#444444';
                ctx.globalAlpha = alpha;
                for (var i = 0; i < x.length; i++) {
                    var px = xScale(x[i]) + M.left;
                    var py = yScale(y[i]) + M.top;
                    if (px < M.left - 2 || px > M.left + W + 2 ||
                        py < M.top - 2 || py > M.top + H + 2) continue;
                    ctx.beginPath();
                    ctx.arc(px, py, dotR, 0, 6.2832);
                    ctx.fill();
                }

                if (hasDual && !hasOverlay) {
                    ctx.fillStyle = cfg.back_color || '#d95f02';
                    ctx.globalAlpha = hasAlpha ? cfgAlpha : 0.42;
                    for (var j = 0; j < xBack.length; j++) {
                        var bpx = xScale(xBack[j]) + M.left;
                        var bpy = yScale(yBack[j]) + M.top;
                        if (bpx < M.left - 2 || bpx > M.left + W + 2 ||
                            bpy < M.top - 2 || bpy > M.top + H + 2) continue;
                        ctx.beginPath();
                        ctx.arc(bpx, bpy, dotR, 0, 6.2832);
                        ctx.fill();
                    }
                }
            }
            ctx.restore();
        } else if (x && x.length > 0 && (!y || y.length === 0)) {
            // Histogram mode — smooth KDE curves
            var overlayTraces = cfg.overlay_traces;
            var histLineWidth = Number(cfg.hist_line_width);
            if (!isFinite(histLineWidth) || histLineWidth <= 0) histLineWidth = 1.8;
            histLineWidth = Math.max(0.5, Math.min(6, histLineWidth));
            var histFillEnabled = !!cfg.hist_fill;
            var histFillAlpha = Number(cfg.hist_fill_alpha);
            if (!isFinite(histFillAlpha)) histFillAlpha = 0.22;
            histFillAlpha = Math.max(0, Math.min(1, histFillAlpha));
            var histOverlayMode = String(cfg.hist_overlay_mode || 'front_opaque');
            if (histOverlayMode !== 'blend' && histOverlayMode !== 'front_opaque') {
                histOverlayMode = 'front_opaque';
            }
            if (overlayTraces && overlayTraces.length > 0) {
                // Overlay: draw each population's KDE, main trace last for prominence
                for (var oi = 0; oi < overlayTraces.length; oi++) {
                    var tr = overlayTraces[oi];
                    if (tr.x && tr.x.length > 0) {
                        _drawKDEHistogram(ctx, tr.x, xScale, M, W, H, tr.color, {
                            fill_enabled: histFillEnabled,
                            fill_alpha: histFillAlpha,
                            line_width: histLineWidth
                        });
                    }
                }
                // Main trace on top
                _drawKDEHistogram(ctx, x, xScale, M, W, H, cfg.pop_color || '#444444', {
                    fill_enabled: histFillEnabled,
                    fill_alpha: (histFillEnabled && histOverlayMode === 'front_opaque') ? 1 : histFillAlpha,
                    line_width: histLineWidth
                });
            } else {
                _drawKDEHistogram(ctx, x, xScale, M, W, H, cfg.pop_color || '#444444', {
                    fill_enabled: histFillEnabled,
                    fill_alpha: histFillEnabled ? histFillAlpha : 0,
                    line_width: histLineWidth
                });
            }
        }

        // ── Axes ────────────────────────────────────────────────────────────
        var xAxisSel = g.append('g').attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + H + ')');
        var xTicks = cfg.x_logicle_ticks;
        if (cfg.x_is_logicle && xTicks && xTicks.major_pos && xTicks.major_pos.length > 0) {
            var xLg = _buildLogicleAxis(xScale, xTicks, d3.axisBottom);
            xAxisSel.call(xLg.axis);
            _styleLogicleAxis(xAxisSel, xLg.majorSet, true);
            if (!(xTicks && xTicks.tick_mode === 'scatter_log10')) {
                _hideCompressedLabels(xAxisSel, xScale, 28);
            }
        } else {
            xAxisSel.call(d3.axisBottom(xScale).ticks(4).tickFormat(_formatLinearVal));
            _hideCompressedLabels(xAxisSel, xScale, 28);
        }
        xAxisSel.selectAll('text').style('font-size', tickFs);

        if (y && y.length > 0) {
            var yAxisSel = g.append('g').attr('class', 'y-axis');
            var yTicks = cfg.y_logicle_ticks;
            if (cfg.y_is_logicle && yTicks && yTicks.major_pos && yTicks.major_pos.length > 0) {
                var yLg = _buildLogicleAxis(yScale, yTicks, d3.axisLeft);
                yAxisSel.call(yLg.axis);
                _styleLogicleAxis(yAxisSel, yLg.majorSet, false);
                if (!(yTicks && yTicks.tick_mode === 'scatter_log10')) {
                    _hideCompressedLabels(yAxisSel, yScale, 18);
                }
            } else {
                yAxisSel.call(d3.axisLeft(yScale).ticks(4).tickFormat(_formatLinearVal));
                _hideCompressedLabels(yAxisSel, yScale, 18);
            }
            yAxisSel.selectAll('text').style('font-size', tickFs);
        }

        // Axis labels
        g.append('text')
            .attr('x', W / 2).attr('y', H + 32)
            .attr('text-anchor', 'middle')
            .style('font-size', axisFs)
            .text(cfg.x_label || '');

        if (cfg.y_label) {
            g.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('x', -H / 2).attr('y', -32)
                .attr('text-anchor', 'middle')
                .style('font-size', axisFs)
                .text(cfg.y_label);
        }

        // ── Title ───────────────────────────────────────────────────────────
        if (cfg.title) {
            svg.append('text')
                .attr('x', size / 2).attr('y', 14)
                .attr('text-anchor', 'middle')
                .style('font-size', titleFs)
                .style('font-weight', '600')
                .text(cfg.title);
        }

        // ── Gate overlays ───────────────────────────────────────────────────
        if (cfg.gates && cfg.gates.length > 0) {
            var gateStyle = cfg.gate_style || {};
            cfg.gates.forEach(function (gate) {
                _drawGateOverlay(g, gate, xScale, yScale, W, H, gateFs, gateStyle);
            });
        }

        // ── Plot border ─────────────────────────────────────────────────────
        g.append('rect')
            .attr('width', W).attr('height', H)
            .attr('fill', 'none').attr('stroke', '#333').attr('stroke-width', 1);

        // ── Overlay legend (drawn in SVG so text is always sharp) ───────────
        // Shown when overlay_traces contains named entries.
        if (hasOverlay && cfg.legend_entries && cfg.legend_entries.length > 0) {
            var entries = cfg.legend_entries;   // [{color, name}, ...]
            var legFs = Math.max(7, (fs.tick || 9) - 1);
            var swatchSz = legFs;
            var rowH = legFs + 4;
            var legW = 0;
            entries.forEach(function (e) {
                var tw = (e.name || '').length * legFs * 0.6 + swatchSz + 6;
                if (tw > legW) legW = tw;
            });
            legW = Math.min(legW + 6, W - 4);
            var legH = entries.length * rowH + 6;
            var legX = W - legW - 2;
            var legY = 2;

            var legG = g.append('g')
                .attr('transform', 'translate(' + legX + ',' + legY + ')');
            legG.append('rect')
                .attr('width', legW).attr('height', legH)
                .attr('rx', 3).attr('ry', 3)
                .attr('fill', 'rgba(255,255,255,0.82)')
                .attr('stroke', '#ccc').attr('stroke-width', 0.5);

            entries.forEach(function (e, ei) {
                var ey = 4 + ei * rowH;
                legG.append('rect')
                    .attr('x', 4).attr('y', ey)
                    .attr('width', swatchSz).attr('height', swatchSz)
                    .attr('fill', e.color).attr('rx', 2);
                legG.append('text')
                    .attr('x', 4 + swatchSz + 4)
                    .attr('y', ey + swatchSz * 0.85)
                    .style('font-size', legFs + 'px')
                    .style('fill', '#222')
                    .text(e.name || '');
            });
        }
    }

    // ── Pseudocolor rendering ───────────────────────────────────────────────
    function _drawPseudocolor(ctx, x, y, xScale, yScale, M, W, H, dotR, pointAlpha) {
        if (!isFinite(dotR) || dotR <= 0) dotR = 1.2;
        if (!isFinite(pointAlpha) || pointAlpha <= 0) pointAlpha = 0.85;
        var n = x.length;
        var gridN = 128, pad = 2, extSize = gridN + 2 * pad;
        var xStep = W / gridN, yStep = H / gridN;

        // Grid-based density
        var grid = new Float32Array(extSize * extSize);
        for (var i = 0; i < n; i++) {
            var gx = Math.floor(xScale(x[i]) / xStep) + pad;
            var gy = Math.floor(yScale(y[i]) / yStep) + pad;
            gx = Math.max(0, Math.min(extSize - 1, gx));
            gy = Math.max(0, Math.min(extSize - 1, gy));
            grid[gy * extSize + gx]++;
        }

        // Simple box blur (2 passes)
        var blurred = new Float32Array(extSize * extSize);
        for (var pass = 0; pass < 2; pass++) {
            var src = pass === 0 ? grid : blurred;
            var dst = pass === 0 ? blurred : grid;
            for (var ry = 1; ry < extSize - 1; ry++) {
                for (var rx = 1; rx < extSize - 1; rx++) {
                    var sum = 0;
                    for (var dy = -1; dy <= 1; dy++)
                        for (var dx = -1; dx <= 1; dx++)
                            sum += src[(ry + dy) * extSize + (rx + dx)];
                    dst[ry * extSize + rx] = sum / 9;
                }
            }
        }

        // Compute per-point density
        var densities = new Float32Array(n);
        var maxDens = 0;
        for (var i = 0; i < n; i++) {
            var gx = Math.floor(xScale(x[i]) / xStep) + pad;
            var gy = Math.floor(yScale(y[i]) / yStep) + pad;
            gx = Math.max(0, Math.min(extSize - 1, gx));
            gy = Math.max(0, Math.min(extSize - 1, gy));
            densities[i] = grid[gy * extSize + gx];
            if (densities[i] > maxDens) maxDens = densities[i];
        }

        if (!maxDens) return;

        // Sort by density
        var indices = new Array(n);
        for (var i = 0; i < n; i++) indices[i] = i;
        indices.sort(function (a, b) { return densities[a] - densities[b]; });

        ctx.globalAlpha = pointAlpha;
        for (var j = 0; j < n; j++) {
            var idx = indices[j];
            var px = xScale(x[idx]) + M.left;
            var py = yScale(y[idx]) + M.top;
            var t = densities[idx] / maxDens;
            var lutIdx = Math.max(0, Math.min(255, Math.floor(t * 255)));
            ctx.fillStyle = _jetLUT[lutIdx];
            ctx.beginPath();
            ctx.arc(px, py, dotR, 0, 6.2832);
            ctx.fill();
        }
    }

    function _computeContourBandwidth(pts, cfg, W, H) {
        if (cfg && isFinite(cfg.kde_bandwidth) && cfg.kde_bandwidth > 0) {
            return cfg.kde_bandwidth;
        }
        var baseBw = Math.max(2, Math.min(10, Math.round(1200 / Math.sqrt(pts.length || 1))));

        // Keep contour smoothness visually consistent as panel size changes.
        // Baseline tuned to the gating editor's effective inner plot size.
        var minDim = Math.max(1, Math.min(W || 1, H || 1));
        var sizeScale = minDim / 320;
        sizeScale = Math.max(0.35, Math.min(2.2, sizeScale));

        return Math.max(1.2, Math.min(14, baseBw * sizeScale));
    }

    // ── Contour rendering (matched to gating editor style) ─────────────────
    function _drawContour(ctx, x, y, xScale, yScale, M, W, H, cfg) {
        var pts = [];
        for (var i = 0; i < x.length; i++) {
            var xv = x[i], yv = y[i];
            if (!isFinite(xv) || !isFinite(yv)) continue;
            var px = xScale(xv), py = yScale(yv);
            if (px >= 0 && px <= W && py >= 0 && py <= H) {
                pts.push([px, py]);
            }
        }
        if (!pts.length) return;

        var bw = _computeContourBandwidth(pts, cfg || {}, W, H);
        var kde = d3.contourDensity()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; })
            .size([W, H])
            .bandwidth(bw);

        var threshold = Number((cfg || {}).contour_threshold);
        if (!isFinite(threshold)) threshold = 5;
        threshold = Math.max(0, Math.min(100, threshold));

        var coarseC = kde.thresholds(20)(pts);
        if (!coarseC.length) return;
        var peakDensity = coarseC[coarseC.length - 1].value;
        if (!peakDensity) return;

        var outerDensity = Math.max(peakDensity * (threshold / 100), peakDensity * 0.005);

        var nLevels = 18;
        var logThresholds = d3.range(nLevels).map(function (i) {
            return Math.exp(Math.log(outerDensity) + (Math.log(peakDensity) - Math.log(outerDensity)) * i / (nLevels - 1));
        });
        var contours = kde.thresholds(logThresholds)(pts);
        if (!contours.length) return;

        var offN = 256, oxS = offN / W, oyS = offN / H;
        var offCanvas = document.createElement('canvas');
        offCanvas.width = offN;
        offCanvas.height = offN;
        var offCtx = offCanvas.getContext('2d');
        offCtx.fillStyle = '#000';
        offCtx.fillRect(0, 0, offN, offN);
        offCtx.fillStyle = '#fff';
        offCtx.beginPath();
        contours[0].coordinates.forEach(function (polygon) {
            polygon.forEach(function (ring) {
                ring.forEach(function (pt, j) {
                    var px = pt[0] * oxS;
                    var py = pt[1] * oyS;
                    if (j === 0) offCtx.moveTo(px, py);
                    else offCtx.lineTo(px, py);
                });
                offCtx.closePath();
            });
        });
        offCtx.fill('evenodd');
        var pixels = offCtx.getImageData(0, 0, offN, offN).data;

        var outlierPts = pts.filter(function (pt) {
            var gx = Math.max(0, Math.min(offN - 1, Math.floor(pt[0] * oxS)));
            var gy = Math.max(0, Math.min(offN - 1, Math.floor(pt[1] * oyS)));
            return pixels[(gy * offN + gx) * 4] < 128;
        });

        var alpha = Number((cfg || {}).point_alpha);
        if (!isFinite(alpha)) alpha = 0.6;
        alpha = Math.max(0.05, Math.min(1, alpha));

        ctx.save();
        ctx.beginPath();
        ctx.rect(M.left, M.top, W, H);
        ctx.clip();
        ctx.translate(M.left, M.top);

        // Outlier points outside the outermost contour.
        var outlierColor = ((cfg || {}).outlier_color) || '#111111';
        ctx.fillStyle = outlierColor;
        ctx.globalAlpha = alpha;
        var dotR = Number((cfg || {}).dot_radius);
        if (!isFinite(dotR) || dotR <= 0) dotR = 0.9;
        outlierPts.forEach(function (pt) {
            ctx.beginPath();
            ctx.arc(pt[0], pt[1], dotR, 0, 6.2832);
            ctx.fill();
        });

        // Dark contour outlines (same style direction as gating plot).
        var lineColor = ((cfg || {}).line_color) || '#111111';
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = Math.min(1.0, alpha + 0.15);
        contours.forEach(function (contour) {
            contour.coordinates.forEach(function (polygon) {
                polygon.forEach(function (ring) {
                    ctx.beginPath();
                    ring.forEach(function (pt, j) {
                        if (j === 0) ctx.moveTo(pt[0], pt[1]);
                        else ctx.lineTo(pt[0], pt[1]);
                    });
                    ctx.closePath();
                    ctx.stroke();
                });
            });
        });
        ctx.restore();
    }

    // ── KDE histogram rendering ─────────────────────────────────────────────
    // Draws a smooth Gaussian KDE curve (filled + stroked) instead of bins.
    // alpha: fill opacity (stroke is always more opaque).
    function _drawKDEHistogram(ctx, x, xScale, M, W, H, color, opts) {
        var n = x.length;
        if (n === 0) return;
        var fillEnabled = true;
        var fillAlpha = 0.35;
        var lineWidth = 1.8;

        if (typeof opts === 'number') {
            fillAlpha = opts;
        } else if (opts && typeof opts === 'object') {
            fillEnabled = !!opts.fill_enabled;
            fillAlpha = Number(opts.fill_alpha);
            lineWidth = Number(opts.line_width);
        }

        if (!isFinite(fillAlpha)) fillAlpha = 0.35;
        fillAlpha = Math.max(0, Math.min(1, fillAlpha));
        if (!isFinite(lineWidth) || lineWidth <= 0) lineWidth = 1.8;
        lineWidth = Math.max(0.5, Math.min(6, lineWidth));

        // Scott's bandwidth: 1.06 * σ * n^(-1/5)
        var mean = 0;
        for (var i = 0; i < n; i++) mean += x[i];
        mean /= n;
        var variance = 0;
        for (var i = 0; i < n; i++) { var d = x[i] - mean; variance += d * d; }
        variance /= n;
        var std = Math.sqrt(variance);
        var dom = xScale.domain();
        var domSpan = dom[1] - dom[0];
        var bw = (std > 0) ? 1.06 * std * Math.pow(n, -0.2)
                           : domSpan / 20;
        bw = Math.max(bw, domSpan / 200);   // floor to avoid razor-thin spike

        // Subsample for KDE evaluation when n is large
        var evalX = x;
        if (n > 3000) {
            evalX = [];
            var step = Math.ceil(n / 3000);
            for (var i = 0; i < n; i += step) evalX.push(x[i]);
        }
        var nEval = evalX.length;

        // Evaluate KDE at 300 equally-spaced points across the visible domain
        var nPts = 300;
        var pts = [];
        var maxD = 0;
        for (var i = 0; i < nPts; i++) {
            var xi = dom[0] + (i / (nPts - 1)) * domSpan;
            var density = 0;
            for (var j = 0; j < nEval; j++) {
                var u = (xi - evalX[j]) / bw;
                density += Math.exp(-0.5 * u * u);
            }
            density /= (nEval * bw * 2.5066);  // 2.5066 ≈ sqrt(2π)
            pts.push({ xi: xi, d: density });
            if (density > maxD) maxD = density;
        }
        if (!maxD) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(M.left, M.top, W, H);
        ctx.clip();
        ctx.translate(M.left, M.top);

        var scaleY = function (d) { return H - (d / maxD) * H * 0.92; };

        // Filled area under the curve
        if (fillEnabled && fillAlpha > 0) {
            ctx.beginPath();
            ctx.moveTo(xScale(pts[0].xi), H);
            for (var i = 0; i < nPts; i++) {
                ctx.lineTo(xScale(pts[i].xi), scaleY(pts[i].d));
            }
            ctx.lineTo(xScale(pts[nPts - 1].xi), H);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.globalAlpha = fillAlpha;
            ctx.fill();
        }

        // Outline
        ctx.beginPath();
        ctx.moveTo(xScale(pts[0].xi), scaleY(pts[0].d));
        for (var i = 1; i < nPts; i++) {
            ctx.lineTo(xScale(pts[i].xi), scaleY(pts[i].d));
        }
        ctx.strokeStyle = color;
        ctx.globalAlpha = fillEnabled ? Math.min(1, fillAlpha + 0.45) : 1;
        ctx.lineWidth = lineWidth;
        ctx.lineJoin = 'round';
        ctx.stroke();

        ctx.restore();
    }

    // ── Logicle axis helpers (FlowJo-style ticks, ported from cytof_plot.js) ──
    // tickData = { major_pos: [num,...], major_labels: [str,...], minor_pos: [num,...] }
    function _buildLogicleAxis(scale, tickData, axisFn) {
        var majorPos    = tickData.major_pos    || [];
        var majorLabels = tickData.major_labels || [];
        var minorPos    = tickData.minor_pos    || [];
        var labelMap = {}, majorSet = {}, i;
        for (i = 0; i < majorPos.length; i++) {
            labelMap[majorPos[i]] = majorLabels[i] || '';
            majorSet[majorPos[i]] = true;
        }
        var allPositions = majorPos.concat(minorPos);
        allPositions.sort(function (a, b) { return a - b; });
        var axis = axisFn(scale)
            .tickValues(allPositions)
            .tickFormat(function (d) { return labelMap[d] || ''; })
            .tickSizeOuter(0);
        return { axis: axis, majorSet: majorSet };
    }

    // Format a raw linear value with K / M abbreviations (catch-all for axes
    // where no custom tick list was supplied from R).
    function _formatLinearVal(v) {
        if (!isFinite(v) || Math.abs(v) < 1e-9) return '0';
        var abs = Math.abs(v);
        var sign = v < 0 ? '-' : '';
        if (abs >= 1e6) {
            var m = abs / 1e6;
            return sign + (+m.toPrecision(3)) + 'M';
        }
        if (abs >= 1e3) {
            var k = abs / 1e3;
            return sign + (+k.toPrecision(3)) + 'K';
        }
        if (abs >= 100) return sign + Math.round(abs).toLocaleString();
        if (abs >= 1) return sign + (+abs.toFixed(1));
        return sign + (+abs.toPrecision(2));
    }

    function _styleLogicleAxis(sel, majorSet, isBottom) {
        sel.selectAll('.tick').each(function (d) {
            var tick = d3.select(this);
            var isMajor = majorSet[d];
            tick.select('line').attr(isBottom ? 'y2' : 'x2',
                isMajor ? (isBottom ? 6 : -6) : (isBottom ? 3 : -3));
            if (!isMajor) tick.select('text').style('display', 'none');
        });
    }

    function _hideCompressedLabels(sel, scale, minSpacingPx) {
        var labeled = [];
        sel.selectAll('.tick text').each(function (d) {
            var el = d3.select(this);
            var txt = (el.text() || '').trim();
            if (el.style('display') !== 'none' && txt !== '') {
                labeled.push({ el: el, px: scale(d), val: d, txt: txt, hidden: false });
            }
        });
        labeled.sort(function (a, b) { return a.px - b.px; });

        // Identify zero label — it always takes priority over neighbours
        var zeroIdx = -1, zeroPx = null;
        for (var j = 0; j < labeled.length; j++) {
            var vj = Number(labeled[j].val);
            if (labeled[j].txt === '0' || (isFinite(vj) && Math.abs(vj) < 1e-9)) {
                zeroIdx = j;
                zeroPx = labeled[j].px;
                break;
            }
        }

        // Keep labels adjacent to zero with a softer spacing rule so nearby
        // decade labels (e.g. 10K/100K) can still appear when useful.
        var zeroAdjSpacing = Math.max(8, minSpacingPx * 0.55);
        var zeroProtectSpacing = Math.max(5, minSpacingPx * 0.38);

        // Pass 1 — standard left-to-right suppression, but never suppress zero
        var lastPx = -Infinity;
        var lastWasZero = false;
        for (var i = 0; i < labeled.length; i++) {
            var isZero = i === zeroIdx;
            var requiredSpacing = (isZero || lastWasZero) ? zeroAdjSpacing : minSpacingPx;
            if (Math.abs(labeled[i].px - lastPx) < requiredSpacing && !isZero) {
                labeled[i].el.style('display', 'none');
                labeled[i].hidden = true;
            } else {
                lastPx = labeled[i].px;
                lastWasZero = isZero;
            }
        }

        // Pass 2 — hide any surviving label that is still too close to zero
        if (zeroPx !== null) {
            for (var k = 0; k < labeled.length; k++) {
                if (!labeled[k].hidden && k !== zeroIdx &&
                        Math.abs(labeled[k].px - zeroPx) < zeroProtectSpacing) {
                    labeled[k].el.style('display', 'none');
                    labeled[k].hidden = true;
                }
            }
        }
    }

    // ── Gate overlay rendering ──────────────────────────────────────────────
    function _drawGateOverlay(g, gate, xScale, yScale, W, H, gateFs, gateStyle) {
        gateStyle = gateStyle || {};
        var pubStyle  = !!gateStyle.pub_style;
        var lineWidth = (isFinite(Number(gateStyle.line_width)) && Number(gateStyle.line_width) > 0)
            ? Number(gateStyle.line_width) : 1.5;

        var verts = gate.vertices;
        if (!verts || verts.length < 2) return;

        var points;
        if (gate.gate_type === 'rectangle' && verts.length === 2) {
            var x0 = xScale(verts[0][0]), y0 = yScale(verts[0][1]);
            var x1 = xScale(verts[1][0]), y1 = yScale(verts[1][1]);
            points = [
                [x0, y0], [x1, y0], [x1, y1], [x0, y1]
            ];
        } else {
            points = verts.map(function (v) {
                return [xScale(v[0]), yScale(v[1])];
            });
        }

        var pathStr = 'M' + points.map(function (p) {
            return p[0] + ',' + p[1];
        }).join('L') + 'Z';

        g.append('path')
            .attr('d', pathStr)
            .attr('fill', 'none')
            .attr('stroke', pubStyle ? '#000000' : gate.color)
            .attr('stroke-width', lineWidth);

        // Label (name on line 1, percentage on line 2 — matching gating editor)
        if (gate.name) {
            var cx = d3.mean(points, function (p) { return p[0]; });
            var cy = d3.mean(points, function (p) { return p[1]; });
            var lo = gate.label_offset || [0, 0];

            // Convert label_offset from data space
            var ox = lo[0] ? (xScale(lo[0]) - xScale(0)) : 0;
            var oy = lo[1] ? (yScale(lo[1]) - yScale(0)) : 0;

            var pctLine = (gate.percent_of_parent != null)
                ? Number(gate.percent_of_parent).toFixed(1) + '%'
                : null;

            // Estimate label width to clamp within plot area
            var fsNum = parseFloat(gateFs);
            if (!isFinite(fsNum) || fsNum <= 0) fsNum = 9;
            var nameTxt = String(gate.name || '');
            var pctTxt = pctLine || '';
            var longerTxt = nameTxt.length > pctTxt.length ? nameTxt : pctTxt;
            var estHalfW = longerTxt.length * fsNum * 0.32 + 4;

            var lx = Math.max(estHalfW, Math.min(W - estHalfW, cx + ox));
            var ly = Math.max(10, Math.min(H - 5, cy + oy));

            var label = g.append('g').attr('transform', 'translate(' + lx + ',' + ly + ')');
            var text = label.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', pubStyle ? '#000000' : '#fff')
                .style('font-size', gateFs);
            text.append('tspan')
                .attr('x', 0)
                .attr('dy', pctLine ? '-0.55em' : '0.35em')
                .text(gate.name);
            if (pctLine) {
                text.append('tspan')
                    .attr('x', 0).attr('dy', '1.3em')
                    .style('font-size', (fsNum - 1) + 'px')
                    .text(pctLine);
            }

            if (!pubStyle) {
                // Background rect (guard getBBox for offscreen/non-rendered SVG contexts).
                var bbox;
                try {
                    bbox = text.node().getBBox();
                } catch (_bboxErr) {
                    var estW = Math.max(6, longerTxt.length * fsNum * 0.60);
                    var estH = pctLine ? fsNum * 2.2 : fsNum * 1.1;
                    bbox = { x: -estW / 2, y: -estH / 2, width: estW, height: estH };
                }

                label.insert('rect', 'text')
                    .attr('x', bbox.x - 2).attr('y', bbox.y - 1)
                    .attr('width', bbox.width + 4).attr('height', bbox.height + 2)
                    .attr('rx', 2)
                    .attr('fill', gate.color).attr('fill-opacity', 0.85);
            }
        }
    }

    // ── Grid rendering functions ────────────────────────────────────────────

    function renderStrategyGrid(containerId, data) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        _renderVersions.strategy += 1;
        var renderVersion = String(_renderVersions.strategy);

        var steps = data.steps;
        if (!steps || steps.length === 0) {
            container.innerHTML = '<em style="color:#999;">No gate steps for this population.</em>';
            return;
        }

        var gateView = data.gate_view;
        if (!Array.isArray(gateView)) gateView = [String(gateView || 'forward')];
        var showForward = gateView.indexOf('forward') !== -1;
        var showBack = gateView.indexOf('back') !== -1;
        if (!showForward && !showBack) showForward = true;

        container.style.overflowX = 'auto';
        container.style.overflowY = 'visible';

        var plotSize = _normalizePlotSize(data.plot_size);
        var displayMode = _normalizeDisplayMode(data.display_mode);
        if (showForward && showBack && displayMode === 'pseudocolor') {
            displayMode = 'scatter';
        }
        var contourThreshold = Number(data.contour_threshold);
        if (!isFinite(contourThreshold)) contourThreshold = 5;
        var pointAlpha = Number(data.point_alpha);
        if (!isFinite(pointAlpha)) pointAlpha = 0.6;
        var pointSize = Number(data.point_size);
        if (!isFinite(pointSize) || pointSize <= 0) pointSize = 1.2;
        var kdeBandwidth = Number(data.kde_bandwidth);
        if (!isFinite(kdeBandwidth) || kdeBandwidth < 0) kdeBandwidth = 0;
        var histLineWidth = Number(data.hist_line_width);
        if (!isFinite(histLineWidth) || histLineWidth <= 0) histLineWidth = 1.8;
        histLineWidth = Math.max(0.5, Math.min(6, histLineWidth));
        var histFill = !!data.hist_fill;
        var histFillAlpha = Number(data.hist_fill_alpha);
        if (!isFinite(histFillAlpha)) histFillAlpha = 0.22;
        histFillAlpha = Math.max(0, Math.min(1, histFillAlpha));
        var histOverlayMode = String(data.hist_overlay_mode || 'front_opaque');
        if (histOverlayMode !== 'blend' && histOverlayMode !== 'front_opaque') {
            histOverlayMode = 'front_opaque';
        }
        var nColumns = parseInt(data.n_columns, 10);
        if (!isFinite(nColumns) || nColumns < 1) nColumns = steps.length;
        nColumns = Math.max(1, Math.min(24, nColumns));
        var fitToColumns = !!data.fit_to_columns;
        var fontSizes = data.font_sizes || {};
        var gateStyle = data.gate_style || {};
        var gapPx = 8;

        if (data.strategy_context_title) {
            var contextDiv = document.createElement('div');
            var contextFs = Number(data.strategy_context_title_font);
            if (!isFinite(contextFs) || contextFs <= 0) {
                contextFs = Math.max(9, Math.min(14, Number(fontSizes.title || 10) + 1));
            }
            contextDiv.className = 'strategy-context-title';
            contextDiv.textContent = String(data.strategy_context_title);
            contextDiv.style.fontSize = contextFs + 'px';
            contextDiv.style.fontWeight = '500';
            contextDiv.style.color = '#334155';
            contextDiv.style.lineHeight = '1.2';
            contextDiv.style.margin = '0 0 6px 0';
            contextDiv.style.whiteSpace = 'nowrap';
            contextDiv.style.overflow = 'hidden';
            contextDiv.style.textOverflow = 'ellipsis';
            container.appendChild(contextDiv);
        }

        if (showBack) {
            var legendDiv = document.createElement('div');
            legendDiv.className = 'strategy-legend';
            legendDiv.style.display = 'flex';
            legendDiv.style.flexWrap = 'wrap';
            legendDiv.style.alignItems = 'center';
            legendDiv.style.gap = '10px';
            legendDiv.style.margin = '0 0 8px 0';
            legendDiv.style.fontSize = '12px';
            legendDiv.style.color = '#334155';

            var legendTitle = document.createElement('span');
            legendTitle.textContent = 'Legend:';
            legendTitle.style.fontWeight = '600';
            legendDiv.appendChild(legendTitle);

            function addLegendItem(color, label) {
                var item = document.createElement('span');
                item.style.display = 'inline-flex';
                item.style.alignItems = 'center';
                item.style.gap = '5px';

                var swatch = document.createElement('span');
                swatch.style.width = '10px';
                swatch.style.height = '10px';
                swatch.style.borderRadius = '50%';
                swatch.style.background = color;
                swatch.style.border = '1px solid rgba(0,0,0,0.2)';

                var text = document.createElement('span');
                text.textContent = label;

                item.appendChild(swatch);
                item.appendChild(text);
                legendDiv.appendChild(item);
            }

            if (showForward) addLegendItem('#3182ce', 'Forward-gated');
            if (showBack) addLegendItem('#d95f02', 'Back-gated');

            container.appendChild(legendDiv);
        }

        var effectivePlotSize = plotSize;
        if (fitToColumns) {
            var availWidth = container.getBoundingClientRect().width || (plotSize * nColumns);
            var fitSize = Math.floor((availWidth - gapPx * (nColumns - 1)) / nColumns);
            if (isFinite(fitSize) && fitSize > 60) {
                effectivePlotSize = Math.max(plotSize, fitSize);
            }
        }
        if (typeof Shiny !== 'undefined' && Shiny && typeof Shiny.setInputValue === 'function') {
            Shiny.setInputValue('strategy_effective_plot_size', effectivePlotSize, { priority: 'event' });
        }
        var rowTargetWidth = nColumns * effectivePlotSize + gapPx * (nColumns - 1);

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid strategy-grid';
        gridDiv.id = containerId + '-grid';
        gridDiv.style.display = 'grid';
        gridDiv.style.gridTemplateColumns = 'repeat(' + nColumns + ', ' + effectivePlotSize + 'px)';
        gridDiv.style.gap = gapPx + 'px';
        gridDiv.style.width = 'max-content';
        gridDiv.style.minWidth = rowTargetWidth + 'px';
        container.appendChild(gridDiv);

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];

            // Plot container
            var plotDiv = document.createElement('div');
            plotDiv.className = 'mini-plot-cell';
            plotDiv.setAttribute('data-render-family', 'strategy');
            plotDiv.setAttribute('data-plot-key', String(step.gate_id || i));
            plotDiv.setAttribute('data-render-version', renderVersion);
            gridDiv.appendChild(plotDiv);

            var sign = step.include ? '' : 'NOT ';
            var modeTag = (showForward && showBack) ? ' (F+B)' : (showBack ? ' (Back)' : '');
            var pctTotalStr = (step.pct_total != null) ? ' [' + step.pct_total + '% total]' : '';
            var title = sign + step.gate_name + ': ' + step.pct_pass + '%' + pctTotalStr + modeTag;

            renderMiniPlot(plotDiv, {
                x: step.x,
                y: step.y,
                x_back: step.x_back,
                y_back: step.y_back,
                x_range: step.x_range,
                y_range: step.y_range,
                x_label: step.x_channel,
                y_label: step.y_channel,
                x_is_logicle: step.x_is_logicle,
                x_logicle_ticks: step.x_logicle_ticks,
                y_is_logicle: step.y_is_logicle,
                y_logicle_ticks: step.y_logicle_ticks,
                display_mode: displayMode,
                plot_size: effectivePlotSize,
                contour_threshold: contourThreshold,
                point_alpha: pointAlpha,
                point_size: pointSize,
                kde_bandwidth: kdeBandwidth,
                hist_line_width: histLineWidth,
                hist_fill: histFill,
                hist_fill_alpha: histFillAlpha,
                hist_overlay_mode: histOverlayMode,
                title: title,
                font_sizes: fontSizes,
                gate_style: gateStyle,
                pop_color: '#3182ce',
                back_color: '#d95f02',
                gates: [{
                    gate_id: step.gate_id,
                    name: step.gate_name,
                    percent_of_parent: step.pct_pass,
                    gate_type: step.gate_type,
                    vertices: step.vertices,
                    color: step.color,
                    label_offset: step.label_offset
                }]
            });

            plotDiv.oncontextmenu = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _showMiniContextMenu(event, this);
                return false;
            };
        }
    }

    function renderIllustrationGrid(containerId, data) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        _renderVersions.illustration += 1;
        var renderVersion = String(_renderVersions.illustration);

        // Allow wide illustration grids to overflow horizontally instead of shrinking panels.
        container.style.overflowX = 'auto';
        container.style.overflowY = 'visible';

        var plots = data.plots;          // keyed by "pop_id|x_channel"
        var popIds = data.pop_ids;       // ordered list
        var popNames = data.pop_names;   // {pop_id: name}
        var popCounts = data.pop_counts; // {pop_id: n_events}
        var xChannels = data.x_channels; // ordered list
        var yChannel = data.y_channel;
        var plotSize = _normalizePlotSize(data.plot_size);
        var displayMode = _normalizeDisplayMode(data.display_mode);
        var contourThreshold = Number(data.contour_threshold);
        if (!isFinite(contourThreshold)) contourThreshold = 5;
        var pointAlpha = Number(data.point_alpha);
        if (!isFinite(pointAlpha)) pointAlpha = 0.6;
        var pointSize = Number(data.point_size);
        if (!isFinite(pointSize) || pointSize <= 0) pointSize = 1.2;
        var kdeBandwidth = Number(data.kde_bandwidth);
        if (!isFinite(kdeBandwidth) || kdeBandwidth < 0) kdeBandwidth = 0;
        var nColumns = parseInt(data.n_columns, 10);
        if (!isFinite(nColumns) || nColumns < 1) nColumns = xChannels.length || 1;
        nColumns = Math.max(1, Math.min(24, nColumns));
        var fitToColumns = !!data.fit_to_columns;
        var fontSizes = data.font_sizes || {};
        var gateStyle = data.gate_style || {};
        var gateOverlays = data.gate_overlays || {}; // {pop_id|x_channel: [gate_overlay,...]}
        var gapPx = 8;

        var effectivePlotSize = plotSize;
        if (fitToColumns) {
            var availWidth = container.getBoundingClientRect().width || (plotSize * nColumns);
            var fitSize = Math.floor((availWidth - gapPx * (nColumns - 1)) / nColumns);
            if (isFinite(fitSize) && fitSize > 60) {
                // Expand to fit if possible, but never shrink below requested size.
                effectivePlotSize = Math.max(plotSize, fitSize);
            }
        }
        if (typeof Shiny !== 'undefined' && Shiny && typeof Shiny.setInputValue === 'function') {
            Shiny.setInputValue('illustration_effective_plot_size', effectivePlotSize, { priority: 'event' });
        }
        var rowTargetWidth = nColumns * effectivePlotSize + gapPx * (nColumns - 1);

        // Colorblind-friendly palette used when color_by_population is true
        var POP_COLORS = [
            '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
            '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
        ];
        var providedPopColors = data.population_colors || {};
        var colorByPop   = !!data.color_by_population;
        var overlayPops  = !!data.overlay_populations;
        // Overlay always forces per-pop colour so populations are distinguishable
        if (overlayPops) colorByPop = true;

        function _normalizeHexColor(x) {
            if (typeof x !== 'string') return null;
            var s = x.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(s)) return s;
            if (/^[0-9a-fA-F]{6}$/.test(s)) return '#' + s;
            return null;
        }

        // Build per-population colour map
        var popColorMap = {};
        for (var pi2 = 0; pi2 < popIds.length; pi2++) {
            var pid2 = popIds[pi2];
            var customColor = _normalizeHexColor(providedPopColors[pid2]);
            popColorMap[pid2] = colorByPop
                ? (customColor || POP_COLORS[pi2 % POP_COLORS.length])
                : '#444444';
        }

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid illustration-grid';
        gridDiv.id = containerId + '-grid';
        gridDiv.style.width = 'max-content';
        gridDiv.style.minWidth = rowTargetWidth + 'px';
        container.appendChild(gridDiv);

        if (overlayPops) {
            // ── OVERLAY MODE: one panel per x-channel, all populations overlaid ──
            // Legend entries (always shown in overlay mode)
            var legendEntries = popIds.map(function (pid) {
                return { color: popColorMap[pid], name: popNames[pid] || pid };
            });

            var rowDiv = document.createElement('div');
            rowDiv.className = 'illustration-row';
            rowDiv.style.display = 'grid';
            rowDiv.style.gridTemplateColumns = 'repeat(' + nColumns + ', ' + effectivePlotSize + 'px)';
            rowDiv.style.gap = gapPx + 'px';
            rowDiv.style.width = rowTargetWidth + 'px';
            rowDiv.style.minWidth = rowTargetWidth + 'px';
            gridDiv.appendChild(rowDiv);

            for (var ci = 0; ci < xChannels.length; ci++) {
                var xCh = xChannels[ci];

                // Collect traces from all populations for this channel
                // The first population is the "main" trace (pop_color); the rest
                // become overlay_traces so existing per-trace drawing is reused.
                var mainPid = null, mainData = null;
                var extraTraces = [];

                for (var pi = 0; pi < popIds.length; pi++) {
                    var pid = popIds[pi];
                    var key = pid + '|' + xCh;
                    var pd = plots[key];
                    if (!pd) continue;
                    if (mainPid === null) {
                        mainPid = pid;
                        mainData = pd;
                    } else {
                        extraTraces.push({
                            x: pd.x || [],
                            y: pd.y || null,
                            color: popColorMap[pid],
                            name: popNames[pid] || pid
                        });
                    }
                }
                if (!mainData) continue;

                var plotDiv = document.createElement('div');
                plotDiv.className = 'mini-plot-cell';
                plotDiv.style.justifySelf = 'start';
                plotDiv.setAttribute('data-render-family', 'illustration');
                plotDiv.setAttribute('data-plot-key', 'overlay|' + xCh);
                plotDiv.setAttribute('data-render-version', renderVersion);
                rowDiv.appendChild(plotDiv);

                var dispMode = displayMode;
                if (dispMode === 'pseudocolor') dispMode = 'scatter';

                renderMiniPlot(plotDiv, {
                    x:               mainData.x,
                    y:               mainData.y || null,
                    x_range:         mainData.x_range,
                    y_range:         mainData.y_range,
                    x_label:         mainData.x_label || xCh,
                    y_label:         mainData.y_label || yChannel,
                    x_is_logicle:    mainData.x_is_logicle,
                    x_logicle_ticks: mainData.x_logicle_ticks,
                    y_is_logicle:    mainData.y_is_logicle,
                    y_logicle_ticks: mainData.y_logicle_ticks,
                    display_mode:    dispMode,
                    plot_size:       effectivePlotSize,
                    contour_threshold: contourThreshold,
                    point_alpha:     pointAlpha,
                    point_size:      pointSize,
                    hist_line_width: Number(data.hist_line_width),
                    hist_fill:       !!data.hist_fill,
                    hist_fill_alpha: Number(data.hist_fill_alpha),
                    hist_overlay_mode: String(data.hist_overlay_mode || 'front_opaque'),
                    kde_bandwidth:   kdeBandwidth,
                    title:           xCh,
                    font_sizes:      fontSizes,
                    gate_style:      gateStyle,
                    pop_color:       popColorMap[mainPid],
                    overlay_traces:  extraTraces,
                    legend_entries:  legendEntries,
                    gates:           []
                });

                plotDiv.oncontextmenu = (function (div) {
                    return function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        _showMiniContextMenu(event, div);
                        return false;
                    };
                })(plotDiv);
            }

        } else {
            // ── NORMAL MODE: one row per population ──────────────────────────
            for (var pi = 0; pi < popIds.length; pi++) {
                var popId = popIds[pi];
                var popName = popNames[popId] || 'Unknown';
                var n = popCounts[popId] || 0;
                var popColor = popColorMap[popId];

                // Row header
                var headerDiv = document.createElement('div');
                headerDiv.className = 'illustration-row-header';
                headerDiv.textContent = popName + ' \u2014 ' + n.toLocaleString() + ' events';
                headerDiv.style.minWidth = rowTargetWidth + 'px';
                gridDiv.appendChild(headerDiv);

                // Row of plots
                var rowDiv = document.createElement('div');
                rowDiv.className = 'illustration-row';
                rowDiv.style.display = 'grid';
                rowDiv.style.gridTemplateColumns = 'repeat(' + nColumns + ', ' + effectivePlotSize + 'px)';
                rowDiv.style.gap = gapPx + 'px';
                rowDiv.style.width = rowTargetWidth + 'px';
                rowDiv.style.minWidth = rowTargetWidth + 'px';
                gridDiv.appendChild(rowDiv);

                for (var ci = 0; ci < xChannels.length; ci++) {
                    var xCh = xChannels[ci];
                    var key = popId + '|' + xCh;
                    var plotData = plots[key];
                    if (!plotData) continue;

                    var plotDiv = document.createElement('div');
                    plotDiv.className = 'mini-plot-cell';
                    plotDiv.style.justifySelf = 'start';
                    plotDiv.setAttribute('data-render-family', 'illustration');
                    plotDiv.setAttribute('data-plot-key', key);
                    plotDiv.setAttribute('data-render-version', renderVersion);
                    rowDiv.appendChild(plotDiv);

                    var gateOvl = gateOverlays[key] || [];

                    renderMiniPlot(plotDiv, {
                        x:               plotData.x,
                        y:               plotData.y || null,
                        x_range:         plotData.x_range,
                        y_range:         plotData.y_range,
                        x_label:         plotData.x_label || xCh,
                        y_label:         plotData.y_label || yChannel,
                        x_is_logicle:    plotData.x_is_logicle,
                        x_logicle_ticks: plotData.x_logicle_ticks,
                        y_is_logicle:    plotData.y_is_logicle,
                        y_logicle_ticks: plotData.y_logicle_ticks,
                        display_mode:    displayMode,
                        plot_size:       effectivePlotSize,
                        contour_threshold: contourThreshold,
                        point_alpha:     pointAlpha,
                        point_size:      pointSize,
                        hist_line_width: Number(data.hist_line_width),
                        hist_fill:       !!data.hist_fill,
                        hist_fill_alpha: Number(data.hist_fill_alpha),
                        hist_overlay_mode: String(data.hist_overlay_mode || 'front_opaque'),
                        kde_bandwidth:   kdeBandwidth,
                        title:           null,
                        font_sizes:      fontSizes,
                        gate_style:      gateStyle,
                        pop_color:       popColor,
                        gates:           gateOvl
                    });

                    plotDiv.oncontextmenu = (function (div) {
                        return function (event) {
                            event.preventDefault();
                            event.stopPropagation();
                            _showMiniContextMenu(event, div);
                            return false;
                        };
                    })(plotDiv);
                }
            }
        }
    }

    function _downloadBlob(blob, filename) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    function _svgToImage(svgEl) {
        return new Promise(function (resolve) {
            if (!svgEl) { resolve(null); return; }
            var svgClone = svgEl.cloneNode(true);
            svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

            svgClone.querySelectorAll('*').forEach(function (el) {
                var cs = window.getComputedStyle(el);
                if (!cs) return;
                var style = [
                    'font-size:' + cs.fontSize,
                    'font-family:' + cs.fontFamily,
                    'font-weight:' + cs.fontWeight,
                    'font-style:' + cs.fontStyle,
                    'fill:' + cs.fill,
                    'stroke:' + cs.stroke,
                    'stroke-width:' + cs.strokeWidth,
                    'opacity:' + cs.opacity
                ].join(';');
                el.setAttribute('style', (el.getAttribute('style') || '') + ';' + style);
            });

            var svgData = new XMLSerializer().serializeToString(svgClone);
            var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            var url = URL.createObjectURL(svgBlob);
            var img = new Image();
            img.onload = function () {
                URL.revokeObjectURL(url);
                resolve(img);
            };
            img.onerror = function () {
                URL.revokeObjectURL(url);
                resolve(null);
            };
            img.src = url;
        });
    }

    function _rasterizePlotCell(plotDiv, scale) {
        return new Promise(function (resolve) {
            var rect = plotDiv.getBoundingClientRect();
            var w = Math.max(1, Math.ceil(rect.width * scale));
            var h = Math.max(1, Math.ceil(rect.height * scale));
            var out = document.createElement('canvas');
            out.width = w;
            out.height = h;
            var octx = out.getContext('2d');
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, w, h);
            octx.scale(scale, scale);

            var pCanvas = plotDiv.querySelector('canvas');
            if (pCanvas) {
                octx.drawImage(pCanvas, 0, 0, rect.width, rect.height);
            }

            var pSvg = plotDiv.querySelector('svg');
            _svgToImage(pSvg).then(function (svgImg) {
                if (svgImg) {
                    octx.drawImage(svgImg, 0, 0, rect.width, rect.height);
                }
                resolve(out);
            });
        });
    }

    function _rasterizeGridToCanvas(gridEl, scale) {
        return new Promise(function (resolve) {
            var plots = gridEl.querySelectorAll('.mini-plot-cell');
            var gridRect = gridEl.getBoundingClientRect();
            var outW = Math.max(1, Math.ceil(gridRect.width  * scale));
            var outH = Math.max(1, Math.ceil(gridRect.height * scale));
            var out = document.createElement('canvas');
            out.width  = outW;
            out.height = outH;
            var octx = out.getContext('2d');
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, outW, outH);

            // Draw row headers / strategy arrows scaled up
            octx.save();
            octx.scale(scale, scale);
            var textEls = gridEl.querySelectorAll('.illustration-row-header, .strategy-arrow');
            textEls.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                var cs = window.getComputedStyle(el);
                var font = cs.font;
                if (!font || font === 'normal normal normal normal 16px / normal serif') {
                    font = [cs.fontStyle, cs.fontVariant, cs.fontWeight,
                            cs.fontSize + '/' + cs.lineHeight, cs.fontFamily].join(' ');
                }
                octx.font = font || '13px sans-serif';
                octx.fillStyle = cs.color || '#333';
                octx.textBaseline = 'middle';
                octx.fillText(
                    (el.textContent || '').trim(),
                    rect.left - gridRect.left,
                    rect.top  - gridRect.top + rect.height / 2
                );
            });
            octx.restore();

            // Render each plot cell at the requested scale so SVG axes/ticks are
            // drawn natively at that resolution (not bilinearly upscaled).
            var jobs = [];
            plots.forEach(function (plotDiv) {
                var rect = plotDiv.getBoundingClientRect();
                var dx = (rect.left - gridRect.left) * scale;
                var dy = (rect.top  - gridRect.top)  * scale;
                var dw = rect.width  * scale;
                var dh = rect.height * scale;
                var job = _rasterizePlotCell(plotDiv, scale).then(function (plotCanvas) {
                    octx.drawImage(plotCanvas, dx, dy, dw, dh);
                });
                jobs.push(job);
            });

            Promise.all(jobs).then(function () { resolve(out); });
        });
    }

    function _copyCanvasToClipboard(canvas) {
        return new Promise(function (resolve, reject) {
            if (!(navigator.clipboard && window.ClipboardItem)) {
                reject(new Error('Clipboard image API unavailable in this browser/session.'));
                return;
            }
            canvas.toBlob(function (blob) {
                if (!blob) {
                    reject(new Error('Unable to create image blob.'));
                    return;
                }
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
                    .then(resolve)
                    .catch(reject);
            }, 'image/png');
        });
    }

    function _hideMiniContextMenu() {
        if (_miniContextMenuEl) {
            _miniContextMenuEl.remove();
            _miniContextMenuEl = null;
        }
    }

    function _showMiniContextMenu(event, plotDiv) {
        _hideMiniContextMenu();
        var menu = document.createElement('div');
        menu.style.position = 'fixed';
        menu.style.left = event.clientX + 'px';
        menu.style.top = event.clientY + 'px';
        menu.style.zIndex = '10000';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #c7ced8';
        menu.style.borderRadius = '4px';
        menu.style.boxShadow = '0 4px 18px rgba(0,0,0,0.18)';
        menu.style.padding = '4px';

        function addItem(label, onClick) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = label;
            btn.style.display = 'block';
            btn.style.width = '100%';
            btn.style.textAlign = 'left';
            btn.style.border = '0';
            btn.style.background = 'transparent';
            btn.style.padding = '6px 8px';
            btn.style.fontSize = '12px';
            btn.style.cursor = 'pointer';
            btn.onmouseenter = function () { btn.style.background = '#eef3fb'; };
            btn.onmouseleave = function () { btn.style.background = 'transparent'; };
            btn.onclick = function (e) {
                e.preventDefault();
                _hideMiniContextMenu();
                onClick();
            };
            menu.appendChild(btn);
        }

        addItem('Copy image', function () {
            var liveCell = _resolveCurrentPlotCell(plotDiv);
            if (!liveCell) return;
            if (navigator.clipboard && window.ClipboardItem) {
                // Pass a Promise as the ClipboardItem value so navigator.clipboard.write()
                // is called synchronously (within the user-gesture window) while the blob
                // resolves asynchronously — browser keeps the gesture context alive.
                var blobPromise = _rasterizePlotCell(liveCell, 2).then(function (canvas) {
                    return new Promise(function (resolve, reject) {
                        canvas.toBlob(function (blob) {
                            blob ? resolve(blob) : reject(new Error('toBlob failed'));
                        }, 'image/png');
                    });
                });
                navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })])
                    .catch(function () {
                        // clipboard write failed — fall back to download
                        _rasterizePlotCell(liveCell, 2).then(function (canvas) {
                            canvas.toBlob(function (blob) {
                                if (blob) _downloadBlob(blob, 'plot.png');
                            }, 'image/png');
                        });
                    });
            } else {
                // Clipboard image API unavailable — fall back to download
                _rasterizePlotCell(liveCell, 2).then(function (canvas) {
                    canvas.toBlob(function (blob) {
                        if (blob) _downloadBlob(blob, 'plot.png');
                    }, 'image/png');
                });
            }
        });

        addItem('Download PNG', function () {
            var liveCell = _resolveCurrentPlotCell(plotDiv);
            if (!liveCell) return;
            _rasterizePlotCell(liveCell, 2).then(function (canvas) {
                canvas.toBlob(function (blob) {
                    if (blob) _downloadBlob(blob, 'plot.png');
                }, 'image/png');
            });
        });

        document.body.appendChild(menu);
        _miniContextMenuEl = menu;

        setTimeout(function () {
            document.addEventListener('mousedown', _hideMiniContextMenu, { once: true });
            document.addEventListener('scroll', _hideMiniContextMenu, { once: true, capture: true });
        }, 0);
    }

    // ── Export helpers ──────────────────────────────────────────────────────

    function exportGridPNG(gridId, filename) {
        var gridEl = document.getElementById(gridId);
        if (!gridEl) { alert('Grid not found: ' + gridId); return; }
        _rasterizeGridToCanvas(gridEl, 3).then(function (canvas) {
            canvas.toBlob(function (blob) {
                if (blob) _downloadBlob(blob, (filename || 'export') + '.png');
            }, 'image/png');
        });
    }

    function _loadJsPdf() {
        return new Promise(function (resolve, reject) {
            if (window.jspdf && window.jspdf.jsPDF) {
                resolve(window.jspdf.jsPDF);
                return;
            }
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
            script.onload = function () {
                if (window.jspdf && window.jspdf.jsPDF) resolve(window.jspdf.jsPDF);
                else reject(new Error('jsPDF loaded but not available.'));
            };
            script.onerror = function () {
                reject(new Error('Failed to load jsPDF library.'));
            };
            document.head.appendChild(script);
        });
    }

    function _buildPdfDataLayer(cell, dpi, fallbackPxW, fallbackPxH) {
        var targetDpi = Number(dpi);
        if (!isFinite(targetDpi) || targetDpi <= 0) targetDpi = 300;
        var pxScale = targetDpi / 96;

        var plotCfg = cell && cell.__miniPlotCfg ? cell.__miniPlotCfg : null;
        if (plotCfg) {
            var cellRect = cell.getBoundingClientRect();
            var exportSize = Math.max(1, Math.round(cellRect.width || plotCfg.plot_size || 200));
            var exportCfg = Object.assign({}, plotCfg, {
                plot_size: exportSize,
                canvas_scale: pxScale,
                // Data layer only: overlays are exported separately as vectors.
                gates: [],
                title: null,
                legend_entries: []
            });

            var offscreen = document.createElement('div');
            renderMiniPlot(offscreen, exportCfg);
            var exportCanvas = offscreen.querySelector('canvas');
            if (exportCanvas) {
                return exportCanvas.toDataURL('image/png');
            }
        }

        // Fallback: scale the currently displayed canvas when no config is available.
        var liveCanvas = cell ? cell.querySelector('canvas') : null;
        if (!liveCanvas) return null;
        return _rasterizeCanvasForPDF(liveCanvas, fallbackPxW, fallbackPxH);
    }

    function _renderSvgOverlayToPdf(pdf, svgEl, cellOxPx, cellOyPx, MM) {
        if (!svgEl) return Promise.resolve();

        // Stable vector overlay export: map SVG primitives directly into PDF commands
        // using per-cell pixel offsets so layout matches on-screen grid placement.
        _walkSVGToPDF(pdf, svgEl, cellOxPx, cellOyPx, MM, 0, 0);
        return Promise.resolve();
    }

    function _buildPdfTranslationMatrix(pdf, tx, ty) {
        if (pdf && typeof pdf.Matrix === 'function') {
            try {
                return new pdf.Matrix(1, 0, 0, 1, tx, ty);
            } catch (_e) {
                return null;
            }
        }
        if (window.jspdf && typeof window.jspdf.Matrix === 'function') {
            try {
                return new window.jspdf.Matrix(1, 0, 0, 1, tx, ty);
            } catch (_e2) {
                return null;
            }
        }
        return null;
    }

    function _placeFormObjectIdentity(pdf, formKey) {
        if (!pdf || typeof pdf.doFormObject !== 'function') return false;

        // Preferred for builds that expect a matrix-like object.
        if (pdf.identityMatrix) {
            try {
                pdf.doFormObject(formKey, pdf.identityMatrix);
                return true;
            } catch (_e1) {
                // continue to fallbacks
            }
        }

        // Some builds expose a Matrix constructor on the instance or namespace.
        var ident = _buildPdfTranslationMatrix(pdf, 0, 0);
        if (ident) {
            try {
                pdf.doFormObject(formKey, ident);
                return true;
            } catch (_e2) {
                // continue to fallbacks
            }
        }

        // Other builds accept omitted matrix and default to identity.
        try {
            pdf.doFormObject(formKey);
            return true;
        } catch (_e3) {
            return false;
        }
    }

    // ── PDF Export: hybrid raster+vector rendering ─────────────────────────
    // Each plot cell is drawn as:
    //   • A true-300-DPI raster PNG of the data layer (points/histograms/contours)
    //   • Vector overlays (axes, gates, labels, borders) from the SVG layer
    // Vector overlays are emitted via explicit jsPDF primitives for layout stability.

    function _parseRGB(css) {
        if (!css) return null;
        var m = css.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (m) return { r: +m[1], g: +m[2], b: +m[3] };
        if (css.charAt(0) === '#') {
            var hex = css.length === 4
                ? css[1]+css[1]+css[2]+css[2]+css[3]+css[3]
                : css.slice(1);
            return {
                r: parseInt(hex.substr(0,2), 16),
                g: parseInt(hex.substr(2,2), 16),
                b: parseInt(hex.substr(4,2), 16)
            };
        }
        var named = { black:[0,0,0], white:[255,255,255], red:[255,0,0],
                      green:[0,128,0], blue:[0,0,255], gray:[128,128,128],
                      grey:[128,128,128], transparent:null, none:null };
        var lc = (css || '').toLowerCase().trim();
        if (lc in named) { var c = named[lc]; return c ? {r:c[0],g:c[1],b:c[2]} : null; }
        return { r:0, g:0, b:0 };
    }

    function _pdfSetStroke(pdf, node, MM) {
        var cs = window.getComputedStyle(node);
        var stroke = node.getAttribute('stroke') || cs.stroke;
        if (!stroke || stroke === 'none' || stroke === 'rgba(0, 0, 0, 0)') return false;
        var c = _parseRGB(stroke);
        if (!c) return false;
        pdf.setDrawColor(c.r, c.g, c.b);
        var sw = parseFloat(node.getAttribute('stroke-width') || cs.strokeWidth) || 1;
        pdf.setLineWidth(Math.max(sw * MM, 0.05));
        return true;
    }

    function _pdfSetFill(pdf, node) {
        var cs = window.getComputedStyle(node);
        var fill = node.getAttribute('fill') || cs.fill;
        if (!fill || fill === 'none' || fill === 'rgba(0, 0, 0, 0)') return false;
        var c = _parseRGB(fill);
        if (!c) return false;
        pdf.setFillColor(c.r, c.g, c.b);
        return true;
    }

    function _pdfDrawLine(pdf, node, ox, oy, tx, ty, MM) {
        if (!_pdfSetStroke(pdf, node, MM)) return;
        var x1 = (parseFloat(node.getAttribute('x1')) || 0) + tx;
        var y1 = (parseFloat(node.getAttribute('y1')) || 0) + ty;
        var x2 = (parseFloat(node.getAttribute('x2')) || 0) + tx;
        var y2 = (parseFloat(node.getAttribute('y2')) || 0) + ty;
        pdf.line((ox+x1)*MM, (oy+y1)*MM, (ox+x2)*MM, (oy+y2)*MM);
    }

    function _pdfDrawRect(pdf, node, ox, oy, tx, ty, MM) {
        var rx = (parseFloat(node.getAttribute('x')) || 0) + tx;
        var ry = (parseFloat(node.getAttribute('y')) || 0) + ty;
        var rw = parseFloat(node.getAttribute('width')) || 0;
        var rh = parseFloat(node.getAttribute('height')) || 0;
        if (rw <= 0 || rh <= 0) return;

        // Skip very-low-opacity fills (gate overlays use fill-opacity 0.05 — barely
        // visible and would obscure data in a non-transparent PDF fill).
        var fo = parseFloat(node.getAttribute('fill-opacity'));
        var skipFill = isFinite(fo) && fo < 0.15;

        var hasFill   = !skipFill && _pdfSetFill(pdf, node);
        var hasStroke = _pdfSetStroke(pdf, node, MM);
        var style = hasFill && hasStroke ? 'FD' : hasFill ? 'F' : hasStroke ? 'S' : null;
        if (style) pdf.rect((ox+rx)*MM, (oy+ry)*MM, rw*MM, rh*MM, style);
    }

    function _pdfDrawPath(pdf, node, ox, oy, tx, ty, MM) {
        var d = node.getAttribute('d');
        if (!d) return;
        if (!_pdfSetStroke(pdf, node, MM)) return;
        // Parse only M, L, H, V, Z (the subset D3 axes produce)
        var parts = d.match(/[MLHVZmlhvz][^MLHVZmlhvz]*/g);
        if (!parts) return;
        var cx = 0, cy = 0, started = false;

        // Check for fill (gate overlay paths have fill + fill-opacity)
        var cs = window.getComputedStyle(node);
        var fillAttr = node.getAttribute('fill') || cs.fill;
        var hasFill = fillAttr && fillAttr !== 'none' && fillAttr !== 'rgba(0, 0, 0, 0)';
        var fillOpacity = parseFloat(node.getAttribute('fill-opacity'));
        if (!isFinite(fillOpacity)) fillOpacity = 1;

        // Build list of line segments (for simple paths) or a polygon (for filled paths)
        var polyPoints = [];
        var isClosedPath = false;
        for (var pi = 0; pi < parts.length; pi++) {
            var cmd = parts[pi].charAt(0);
            var nums = parts[pi].slice(1).trim();
            var args = nums.length > 0 ? nums.split(/[\s,]+/).map(Number) : [];
            switch (cmd) {
                case 'M': cx = args[0]; cy = args[1]; polyPoints.push([cx,cy]); started = true; break;
                case 'L': cx = args[0]; cy = args[1]; polyPoints.push([cx,cy]); break;
                case 'H': cx = args[0]; polyPoints.push([cx,cy]); break;
                case 'V': cy = args[0]; polyPoints.push([cx,cy]); break;
            case 'Z': case 'z': isClosedPath = true; break;
                // Relative commands
                case 'm': cx += args[0]; cy += args[1]; polyPoints.push([cx,cy]); started = true; break;
                case 'l': cx += args[0]; cy += args[1]; polyPoints.push([cx,cy]); break;
                case 'h': cx += args[0]; polyPoints.push([cx,cy]); break;
                case 'v': cy += args[0]; polyPoints.push([cx,cy]); break;
            }
        }

        // Skip very-low-opacity fills (gate overlays use fill-opacity 0.05)
        if (hasFill && fillOpacity >= 0.15 && polyPoints.length >= 3) {
            var fc = _parseRGB(fillAttr);
            if (fc) {
                pdf.setFillColor(fc.r, fc.g, fc.b);
                var startX = (ox + polyPoints[0][0] + tx) * MM;
                var startY = (oy + polyPoints[0][1] + ty) * MM;
                var deltas = [];
                for (var fi = 1; fi < polyPoints.length; fi++) {
                    deltas.push([
                        (polyPoints[fi][0] - polyPoints[fi-1][0]) * MM,
                        (polyPoints[fi][1] - polyPoints[fi-1][1]) * MM
                    ]);
                }
                pdf.lines(deltas, startX, startY, [1,1], 'F', true);
            }
            // Re-set stroke for outline on top
            _pdfSetStroke(pdf, node, MM);
        }

        // Draw stroke segments
        if (started && polyPoints.length >= 2) {
            for (var li = 0; li < polyPoints.length - 1; li++) {
                var p0 = polyPoints[li], p1 = polyPoints[li+1];
                pdf.line((ox+p0[0]+tx)*MM, (oy+p0[1]+ty)*MM,
                         (ox+p1[0]+tx)*MM, (oy+p1[1]+ty)*MM);
            }
            if (isClosedPath) {
                var pf = polyPoints[0];
                var pl = polyPoints[polyPoints.length - 1];
                pdf.line((ox+pl[0]+tx)*MM, (oy+pl[1]+ty)*MM,
                         (ox+pf[0]+tx)*MM, (oy+pf[1]+ty)*MM);
            }
        }
    }

    function _pdfDrawText(pdf, node, ox, oy, tx, ty, rotation, MM) {
        var txt = (node.textContent || '').trim();
        if (!txt) return;

        var cs = window.getComputedStyle(node);
        var localX = (parseFloat(node.getAttribute('x')) || 0) +
                     (parseFloat(node.getAttribute('dx')) || 0);
        var localY = (parseFloat(node.getAttribute('y')) || 0) +
                     (parseFloat(node.getAttribute('dy')) || 0);

        var fontSize = parseFloat(cs.fontSize) || 10;
        pdf.setFontSize(fontSize * 0.75);   // CSS px → PDF pt
        var fc = _parseRGB(cs.fill || cs.color || '#000');
        if (fc) pdf.setTextColor(fc.r, fc.g, fc.b);
        var wt = (cs.fontWeight === 'bold' || parseInt(cs.fontWeight) >= 600) ? 'bold' : 'normal';
        pdf.setFont('helvetica', wt);

        var anchor = node.getAttribute('text-anchor') || cs.textAnchor || 'start';
        var align = anchor === 'middle' ? 'center' : anchor === 'end' ? 'right' : 'left';

        // Base anchor position in local SVG units, transformed into PDF mm.
        var xPx = ox + tx + localX;
        var yPx = oy + ty + localY;
        var xMm = xPx * MM;
        var yMm = yPx * MM;

        if (rotation === 0) {
            pdf.text(txt, xMm, yMm, { align: align });
            return;
        }

        // Let jsPDF apply anchor alignment under rotation (closest to SVG text-anchor).
        pdf.text(txt, xMm, yMm, { align: align, angle: -rotation });
    }

    function _pdfDrawPolygon(pdf, node, tag, ox, oy, tx, ty, MM) {
        var pts = node.getAttribute('points');
        if (!pts) return;
        var nums = pts.trim().split(/[\s,]+/).map(Number);
        if (nums.length < 4) return;
        var coords = [];
        for (var i = 0; i < nums.length - 1; i += 2) {
            coords.push([(ox+nums[i]+tx)*MM, (oy+nums[i+1]+ty)*MM]);
        }
        var hasFill   = (tag === 'polygon') && _pdfSetFill(pdf, node);
        var hasStroke = _pdfSetStroke(pdf, node, MM);
        if (!hasFill && !hasStroke) return;

        // Build relative-delta array for pdf.lines()
        var deltas = [];
        for (var j = 1; j < coords.length; j++) {
            deltas.push([coords[j][0]-coords[j-1][0], coords[j][1]-coords[j-1][1]]);
        }
        var closed = (tag === 'polygon');
        var style = hasFill && hasStroke ? 'FD' : hasFill ? 'F' : 'S';
        pdf.lines(deltas, coords[0][0], coords[0][1], [1,1], style, closed);
    }

    function _pdfDrawCircle(pdf, node, ox, oy, tx, ty, MM) {
        var ccx = (parseFloat(node.getAttribute('cx')) || 0) + tx;
        var ccy = (parseFloat(node.getAttribute('cy')) || 0) + ty;
        var cr  = parseFloat(node.getAttribute('r')) || 0;
        if (cr <= 0) return;
        var hasFill   = _pdfSetFill(pdf, node);
        var hasStroke = _pdfSetStroke(pdf, node, MM);
        var style = hasFill && hasStroke ? 'FD' : hasFill ? 'F' : hasStroke ? 'S' : null;
        if (style) pdf.circle((ox+ccx)*MM, (oy+ccy)*MM, cr*MM, style);
    }

    // Recursively walk an SVG sub-tree and draw every element with jsPDF.
    // ox, oy = cell offset from grid origin (px).
    // tx, ty = accumulated translation from parent <g> transforms (SVG user units).
    function _walkSVGToPDF(pdf, node, ox, oy, MM, tx, ty) {
        if (node.nodeType !== 1) return;
        var cs = window.getComputedStyle(node);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        if (parseFloat(cs.opacity) === 0) return;

        var tag = (node.tagName || '').toLowerCase();

        // Accumulate translations from this element's transform attribute
        var curTx = tx, curTy = ty, rotation = 0;
        var tr = node.getAttribute('transform') || '';
        var tm = tr.match(/translate\(\s*([^,)\s]+)[\s,]+([^)\s]+)\s*\)/);
        if (tm) { curTx += parseFloat(tm[1]) || 0; curTy += parseFloat(tm[2]) || 0; }
        // Rotation (only meaningful on <text> elements in our SVG structure)
        var rm = tr.match(/rotate\(\s*([^)\s,]+)/);
        if (rm) rotation = parseFloat(rm[1]) || 0;

        switch (tag) {
            case 'line':     _pdfDrawLine(pdf, node, ox, oy, curTx, curTy, MM); break;
            case 'rect':     _pdfDrawRect(pdf, node, ox, oy, curTx, curTy, MM); break;
            case 'path':     _pdfDrawPath(pdf, node, ox, oy, curTx, curTy, MM); break;
            case 'text':     _pdfDrawText(pdf, node, ox, oy, curTx, curTy, rotation, MM); break;
            case 'polygon':  _pdfDrawPolygon(pdf, node, 'polygon',  ox, oy, curTx, curTy, MM); break;
            case 'polyline': _pdfDrawPolygon(pdf, node, 'polyline', ox, oy, curTx, curTy, MM); break;
            case 'circle':   _pdfDrawCircle(pdf, node, ox, oy, curTx, curTy, MM); break;
        }

        // Recurse into children (skip <text> children — already handled above)
        if (tag !== 'text') {
            for (var ci = 0; ci < node.children.length; ci++) {
                _walkSVGToPDF(pdf, node.children[ci], ox, oy, MM, curTx, curTy);
            }
        }
    }

    // High-resolution rasterisation of a single plot cell's canvas for PDF embed.
    function _rasterizeCanvasForPDF(canvas, targetW, targetH) {
        var out = document.createElement('canvas');
        out.width  = targetW;
        out.height = targetH;
        var ctx = out.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
        ctx.drawImage(canvas, 0, 0, targetW, targetH);
        return out.toDataURL('image/png');
    }

    function exportGridPDF(gridId, filename) {
        var gridEl = document.getElementById(gridId);
        if (!gridEl) { alert('Grid not found: ' + gridId); return; }

        var MM = 25.4 / 96;          // CSS px → mm at 96 DPI
        var RASTER_DPI = 300;         // target DPI for rasterised data
        var gridRect = gridEl.getBoundingClientRect();
        var wMm = gridRect.width  * MM;
        var hMm = gridRect.height * MM;
        var orientation = wMm >= hMm ? 'landscape' : 'portrait';

        _loadJsPdf().then(function (jsPDF) {
            var pdf = new jsPDF({
                orientation: orientation,
                unit: 'mm',
                format: [wMm, hMm],
                // Better compatibility with downstream vector tools (e.g., Illustrator)
                // that can be picky about compressed object streams.
                compress: false
            });
            pdf.setFont('helvetica');

            // ── White background ────────────────────────────────────────────
            pdf.setFillColor(255, 255, 255);
            pdf.rect(0, 0, wMm, hMm, 'F');

            // ── Header text (row headers, strategy arrows, col headers) ────
            var headerEls = gridEl.querySelectorAll(
                '.illustration-row-header, .strategy-arrow, .multi-strategy-col-header');
            headerEls.forEach(function (el) {
                var r   = el.getBoundingClientRect();
                var hcs = window.getComputedStyle(el);
                var fontSize = parseFloat(hcs.fontSize) || 12;
                pdf.setFontSize(fontSize * 0.75);
                var fc = _parseRGB(hcs.color);
                if (fc) pdf.setTextColor(fc.r, fc.g, fc.b);
                var fw = (hcs.fontWeight === 'bold' || parseInt(hcs.fontWeight) >= 600)
                         ? 'bold' : 'normal';
                pdf.setFont('helvetica', fw);

                var cx = (r.left - gridRect.left + r.width  / 2) * MM;
                var cy = (r.top  - gridRect.top  + r.height / 2) * MM;
                pdf.text((el.textContent || '').trim(), cx, cy,
                         { align: 'center', baseline: 'middle' });
            });

            // ── Plot cells ──────────────────────────────────────────────────
            var cells = gridEl.querySelectorAll('.mini-plot-cell');
            // Form-object grouping is intentionally disabled for runtime stability
            // across jsPDF builds. Some builds still throw internal matrix/toString
            // errors during form placement or serialization.
            var canUseFormObjects = false;

            var chain = Promise.resolve();
            cells.forEach(function (cell, cellIdx) {
                chain = chain.then(function () {
                    var cr = cell.getBoundingClientRect();
                    var cellOx = cr.left - gridRect.left;   // px offset from grid
                    var cellOy = cr.top  - gridRect.top;
                    var cellWMm = cr.width  * MM;
                    var cellHMm = cr.height * MM;
                    var cellOxMm = cellOx * MM;
                    var cellOyMm = cellOy * MM;

                    // 1) Rasterize only the plotted data layer at true 300 DPI.
                    var pxW = Math.max(1, Math.ceil(cellWMm / 25.4 * RASTER_DPI));
                    var pxH = Math.max(1, Math.ceil(cellHMm / 25.4 * RASTER_DPI));
                    var dataUrl = null;
                    try {
                        dataUrl = _buildPdfDataLayer(cell, RASTER_DPI, pxW, pxH);
                    } catch (_dataErr) {
                        // Never fail the whole export due to an offscreen rerender issue.
                        var liveCanvas = cell.querySelector('canvas');
                        if (liveCanvas) dataUrl = _rasterizeCanvasForPDF(liveCanvas, pxW, pxH);
                    }
                    var svgEl = cell.querySelector('svg');

                    if (canUseFormObjects) {
                        try {
                            var formKey = 'plot_cell_' + String(cellIdx);
                            // Build one form object per plot cell so downstream editors
                            // treat each panel as a grouped object.
                            pdf.beginFormObject(0, 0, wMm, hMm);

                            if (dataUrl) {
                                pdf.addImage(dataUrl, 'PNG',
                                             cellOxMm, cellOyMm,
                                             cellWMm, cellHMm, undefined, 'FAST');
                            }

                            return _renderSvgOverlayToPdf(pdf, svgEl, cellOx, cellOy, MM)
                                .then(function () {
                                    pdf.endFormObject(formKey);
                                    if (!_placeFormObjectIdentity(pdf, formKey)) {
                                        throw new Error('Form object placement unsupported');
                                    }
                                })
                                .catch(function () {
                                    // Fall back to direct page drawing if form objects fail.
                                    if (dataUrl) {
                                        pdf.addImage(dataUrl, 'PNG',
                                                     cellOxMm, cellOyMm,
                                                     cellWMm, cellHMm, undefined, 'FAST');
                                    }
                                    return _renderSvgOverlayToPdf(pdf, svgEl, cellOx, cellOy, MM);
                                });
                        } catch (_formErr) {
                            // Form-object API may vary by jsPDF build; use direct draw fallback.
                        }
                    }

                    if (dataUrl) {
                        pdf.addImage(dataUrl, 'PNG',
                                     cellOxMm, cellOyMm,
                                     cellWMm, cellHMm, undefined, 'FAST');
                    }

                    // 2) Draw overlays (axes, gates, labels, borders) as vector.
                    return _renderSvgOverlayToPdf(pdf, svgEl, cellOx, cellOy, MM);
                });
            });

            // ── Title text appended directly to SVG root (outside <g>) ──────
            // The title <text> is a child of the SVG, not the inner <g>, so we
            // already handle it during the SVG walk since _walkSVGToPDF
            // recurses into all children.

            return chain.then(function () {
                pdf.save((filename || 'export') + '.pdf');
            });
        }).catch(function (err) {
            alert('PDF export failed.\n' + (err && err.message ? err.message : err));
        });
    }

    function renderMultiStrategyGrid(containerId, data) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        _renderVersions.strategy += 1;
        var renderVersion = String(_renderVersions.strategy);

        var nodes = data.nodes;
        if (!nodes || nodes.length === 0) {
            var msg = data.error_msg ||
                'Select populations using the selector above or the checkboxes in the Populations panel (Gating tab), then click Render.';
            container.innerHTML = '<div style="padding:16px;color:#555;font-size:12px;">' + msg + '</div>';
            return;
        }

        var plotSize    = _normalizePlotSize(data.plot_size);
        var displayMode = _normalizeDisplayMode(data.display_mode);
        var fontSizes   = data.font_sizes || {};
        var gateStyle   = data.gate_style || {};
        var contourThreshold = isFinite(Number(data.contour_threshold)) ? Number(data.contour_threshold) : 5;
        var pointAlpha  = isFinite(Number(data.point_alpha)) ? Math.max(0.05, Math.min(1, Number(data.point_alpha))) : 0.6;
        var pointSize   = isFinite(Number(data.point_size)) && Number(data.point_size) > 0 ? Number(data.point_size) : 1.2;
        var kdeBandwidth = isFinite(Number(data.kde_bandwidth)) ? Math.max(0, Number(data.kde_bandwidth)) : 0;
        var histLineWidth = isFinite(Number(data.hist_line_width)) ? Math.max(0.5, Math.min(6, Number(data.hist_line_width))) : 1.8;
        var histFill = !!data.hist_fill;
        var histFillAlpha = isFinite(Number(data.hist_fill_alpha)) ? Math.max(0, Math.min(1, Number(data.hist_fill_alpha))) : 0.22;
        var histOverlayMode = String(data.hist_overlay_mode || 'front_opaque');
        if (histOverlayMode !== 'blend' && histOverlayMode !== 'front_opaque') histOverlayMode = 'front_opaque';
        var gapPx = 8;

        if (data.strategy_context_title) {
            var contextDiv = document.createElement('div');
            var contextFs = Number(data.strategy_context_title_font);
            if (!isFinite(contextFs) || contextFs <= 0) {
                contextFs = Math.max(9, Math.min(14, Number(fontSizes.title || 10) + 1));
            }
            contextDiv.className = 'strategy-context-title';
            contextDiv.textContent = String(data.strategy_context_title);
            contextDiv.style.fontSize = contextFs + 'px';
            contextDiv.style.fontWeight = '500';
            contextDiv.style.color = '#334155';
            contextDiv.style.lineHeight = '1.2';
            contextDiv.style.margin = '0 0 6px 0';
            contextDiv.style.whiteSpace = 'nowrap';
            contextDiv.style.overflow = 'hidden';
            contextDiv.style.textOverflow = 'ellipsis';
            container.appendChild(contextDiv);
        }

        // ── Safety net: resolve any (row,col) duplicates before layout ───────
        // The R layout already resolves these, but guard here too so a stale
        // payload or future code path never causes invisible stacked plots.
        (function () {
            // Sort by col asc, then node_id for a deterministic tie-break
            nodes = nodes.slice().sort(function (a, b) {
                var dc = (a.col || 0) - (b.col || 0);
                if (dc !== 0) return dc;
                return String(a.node_id || '').localeCompare(String(b.node_id || ''));
            });
            var used = {};
            nodes.forEach(function (n) {
                var row = n.row || 0;
                var col = n.col || 0;
                var key = row + '|' + col;
                while (used[key]) { col++; n.col = col; key = row + '|' + col; }
                used[key] = true;
            });
        })();

        var maxCol = 0, maxRow = 0;
        nodes.forEach(function (n) {
            if ((n.col || 0) > maxCol) maxCol = n.col || 0;
            if ((n.row || 0) > maxRow) maxRow = n.row || 0;
        });
        var nCols = maxCol + 1;
        var nRows = maxRow + 1;

        if (typeof Shiny !== 'undefined' && Shiny && typeof Shiny.setInputValue === 'function') {
            Shiny.setInputValue('strategy_effective_plot_size', plotSize, { priority: 'event' });
        }

        container.style.overflowX = 'auto';
        container.style.overflowY = 'visible';

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid multi-strategy-grid';
        gridDiv.id = containerId + '-grid';
        gridDiv.style.display = 'grid';
        gridDiv.style.gridTemplateColumns = 'repeat(' + nCols + ', ' + plotSize + 'px)';
        gridDiv.style.gridTemplateRows    = 'repeat(' + nRows + ', ' + plotSize + 'px)';
        gridDiv.style.gap     = gapPx + 'px';
        gridDiv.style.width   = 'max-content';
        gridDiv.style.padding = '4px';
        container.appendChild(gridDiv);

        nodes.forEach(function (node) {
            var plotDiv = document.createElement('div');
            plotDiv.className = 'mini-plot-cell';
            plotDiv.setAttribute('data-render-family',  'strategy');
            plotDiv.setAttribute('data-plot-key',       String(node.node_id || ''));
            plotDiv.setAttribute('data-render-version', renderVersion);
            // Explicit CSS grid placement (1-indexed)
            plotDiv.style.gridColumn = String((node.col || 0) + 1);
            plotDiv.style.gridRow    = String((node.row || 0) + 1);
            gridDiv.appendChild(plotDiv);

            var n_fmt = node.n_events ? Number(node.n_events).toLocaleString() : '';
            var title = (node.parent_pop_name || '') + (n_fmt ? ' (' + n_fmt + ')' : '');

            renderMiniPlot(plotDiv, {
                x:               node.x,
                y:               node.y,
                x_range:         node.x_range,
                y_range:         node.y_range,
                x_label:         node.x_channel,
                y_label:         node.y_channel,
                x_is_logicle:    node.x_is_logicle,
                x_logicle_ticks: node.x_logicle_ticks,
                y_is_logicle:    node.y_is_logicle,
                y_logicle_ticks: node.y_logicle_ticks,
                display_mode:    displayMode,
                plot_size:       plotSize,
                contour_threshold: contourThreshold,
                point_alpha:     pointAlpha,
                point_size:      pointSize,
                kde_bandwidth:   kdeBandwidth,
                hist_line_width: histLineWidth,
                hist_fill:       histFill,
                hist_fill_alpha: histFillAlpha,
                hist_overlay_mode: histOverlayMode,
                title:           title,
                font_sizes:      fontSizes,
                gate_style:      gateStyle,
                pop_color:       '#3182ce',
                gates:           node.gates || []
            });

            plotDiv.oncontextmenu = function (event) {
                event.preventDefault();
                event.stopPropagation();
                _showMiniContextMenu(event, this);
                return false;
            };
        });
    }

    // ── Public API ──────────────────────────────────────────────────────────
    window.CytofMiniPlot = {
        renderMiniPlot: renderMiniPlot,
        renderStrategyGrid: renderStrategyGrid,
        renderMultiStrategyGrid: renderMultiStrategyGrid,
        renderIllustrationGrid: renderIllustrationGrid,
        exportGridPNG: exportGridPNG,
        exportGridPDF: exportGridPDF
    };

    // ── Shiny message handlers ──────────────────────────────────────────────
    function _registerHandlers() {
        if (typeof Shiny === 'undefined') return;

        Shiny.addCustomMessageHandler('renderStrategyGrid', function (data) {
            CytofMiniPlot.renderStrategyGrid(data.containerId, data);
        });

        Shiny.addCustomMessageHandler('renderMultiStrategyGrid', function (data) {
            CytofMiniPlot.renderMultiStrategyGrid(data.containerId, data);
        });

        Shiny.addCustomMessageHandler('renderIllustrationGrid', function (data) {
            CytofMiniPlot.renderIllustrationGrid(data.containerId, data);
        });

        Shiny.addCustomMessageHandler('exportMiniPlotPNG', function (data) {
            if (data && data.render_data && data.render_data.containerId) {
                var rd = data.render_data;
                if (rd.render_family === 'strategy') {
                    if (rd.mode === 'multi') {
                        CytofMiniPlot.renderMultiStrategyGrid(rd.containerId, rd);
                    } else {
                        CytofMiniPlot.renderStrategyGrid(rd.containerId, rd);
                    }
                } else {
                    CytofMiniPlot.renderIllustrationGrid(rd.containerId, rd);
                }
                window.requestAnimationFrame(function () {
                    window.requestAnimationFrame(function () {
                        CytofMiniPlot.exportGridPNG(data.gridId, data.filename);
                    });
                });
                return;
            }
            CytofMiniPlot.exportGridPNG(data.gridId, data.filename);
        });

        Shiny.addCustomMessageHandler('exportMiniPlotPDF', function (data) {
            CytofMiniPlot.exportGridPDF(data.gridId, data.filename);
        });
    }

    if (typeof Shiny !== 'undefined') {
        _registerHandlers();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            var check = setInterval(function () {
                if (typeof Shiny !== 'undefined') {
                    clearInterval(check);
                    _registerHandlers();
                }
            }, 100);
        });
    }

})();
