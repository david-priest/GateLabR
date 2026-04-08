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

        // Canvas
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        container.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // SVG
        var svg = d3.select(container).append('svg')
            .attr('width', size).attr('height', size)
            .style('position', 'absolute')
            .style('top', '0').style('left', '0');

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
        if (x && x.length > 0 && y && y.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(M.left, M.top, W, H);
            ctx.clip();

            if (displayMode === 'pseudocolor') {
                _drawPseudocolor(ctx, x, y, xScale, yScale, M, W, H);
            } else if (displayMode === 'contour') {
                _drawContour(ctx, x, y, xScale, yScale, M, W, H, {
                    contour_threshold: cfg.contour_threshold,
                    point_alpha: cfg.point_alpha,
                    kde_bandwidth: cfg.kde_bandwidth,
                    line_color: cfg.pop_color || '#111111',
                    outlier_color: cfg.pop_color || '#111111'
                });
                if (hasDual) {
                    _drawContour(ctx, xBack, yBack, xScale, yScale, M, W, H, {
                        contour_threshold: cfg.contour_threshold,
                        point_alpha: cfg.point_alpha,
                        kde_bandwidth: cfg.kde_bandwidth,
                        line_color: cfg.back_color || '#d95f02',
                        outlier_color: cfg.back_color || '#d95f02'
                    });
                }
            } else {
                // Scatter
                ctx.fillStyle = cfg.pop_color || '#1f77b4';
                ctx.globalAlpha = hasDual ? 0.42 : 0.35;
                for (var i = 0; i < x.length; i++) {
                    var px = xScale(x[i]) + M.left;
                    var py = yScale(y[i]) + M.top;
                    if (px < M.left - 2 || px > M.left + W + 2 ||
                        py < M.top - 2 || py > M.top + H + 2) continue;
                    ctx.beginPath();
                    ctx.arc(px, py, 1.2, 0, 6.2832);
                    ctx.fill();
                }

                if (hasDual) {
                    ctx.fillStyle = cfg.back_color || '#d95f02';
                    ctx.globalAlpha = 0.42;
                    for (var j = 0; j < xBack.length; j++) {
                        var bpx = xScale(xBack[j]) + M.left;
                        var bpy = yScale(yBack[j]) + M.top;
                        if (bpx < M.left - 2 || bpx > M.left + W + 2 ||
                            bpy < M.top - 2 || bpy > M.top + H + 2) continue;
                        ctx.beginPath();
                        ctx.arc(bpx, bpy, 1.2, 0, 6.2832);
                        ctx.fill();
                    }
                }
            }
            ctx.restore();
        } else if (x && x.length > 0 && (!y || y.length === 0)) {
            // Histogram mode
            _drawHistogram(ctx, x, xScale, M, W, H, cfg.pop_color || '#1f77b4');
        }

        // ── Axes ────────────────────────────────────────────────────────────
        g.append('g').attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + H + ')')
            .call(d3.axisBottom(xScale).ticks(4))
            .selectAll('text').style('font-size', tickFs);

        if (y && y.length > 0) {
            g.append('g').attr('class', 'y-axis')
                .call(d3.axisLeft(yScale).ticks(4))
                .selectAll('text').style('font-size', tickFs);
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
            cfg.gates.forEach(function (gate) {
                _drawGateOverlay(g, gate, xScale, yScale, W, H, gateFs);
            });
        }

        // ── Plot border ─────────────────────────────────────────────────────
        g.append('rect')
            .attr('width', W).attr('height', H)
            .attr('fill', 'none').attr('stroke', '#333').attr('stroke-width', 1);
    }

    // ── Pseudocolor rendering ───────────────────────────────────────────────
    function _drawPseudocolor(ctx, x, y, xScale, yScale, M, W, H) {
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

        ctx.globalAlpha = 0.85;
        for (var j = 0; j < n; j++) {
            var idx = indices[j];
            var px = xScale(x[idx]) + M.left;
            var py = yScale(y[idx]) + M.top;
            var t = densities[idx] / maxDens;
            var lutIdx = Math.max(0, Math.min(255, Math.floor(t * 255)));
            ctx.fillStyle = _jetLUT[lutIdx];
            ctx.beginPath();
            ctx.arc(px, py, 1.2, 0, 6.2832);
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
        var dotR = 0.9;
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

    // ── Histogram rendering ─────────────────────────────────────────────────
    function _drawHistogram(ctx, x, xScale, M, W, H, color) {
        var n = x.length;
        if (n === 0) return;

        var nBins = 60;
        var xMin = xScale.domain()[0], xMax = xScale.domain()[1];
        var binWidth = (xMax - xMin) / nBins;
        var bins = new Array(nBins).fill(0);

        for (var i = 0; i < n; i++) {
            var bi = Math.floor((x[i] - xMin) / binWidth);
            if (bi >= 0 && bi < nBins) bins[bi]++;
        }

        var maxCount = Math.max.apply(null, bins);
        if (!maxCount) return;

        ctx.save();
        ctx.beginPath();
        ctx.rect(M.left, M.top, W, H);
        ctx.clip();
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.4;

        var barW = W / nBins;
        for (var i = 0; i < nBins; i++) {
            if (bins[i] === 0) continue;
            var barH = (bins[i] / maxCount) * H;
            ctx.fillRect(M.left + i * barW, M.top + H - barH, barW - 0.5, barH);
        }
        ctx.restore();
    }

    // ── Gate overlay rendering ──────────────────────────────────────────────
    function _drawGateOverlay(g, gate, xScale, yScale, W, H, gateFs) {
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

        // Fill
        g.append('path')
            .attr('d', pathStr)
            .attr('fill', gate.color)
            .attr('fill-opacity', 0.05)
            .attr('stroke', gate.color)
            .attr('stroke-width', 1.5);

        // Label
        if (gate.name) {
            var cx = d3.mean(points, function (p) { return p[0]; });
            var cy = d3.mean(points, function (p) { return p[1]; });
            var lo = gate.label_offset || [0, 0];

            // Convert label_offset from data space
            var ox = lo[0] ? (xScale(lo[0]) - xScale(0)) : 0;
            var oy = lo[1] ? (yScale(lo[1]) - yScale(0)) : 0;

            var lx = Math.max(0, Math.min(W, cx + ox));
            var ly = Math.max(10, Math.min(H, cy + oy));

            var label = g.append('g').attr('transform', 'translate(' + lx + ',' + ly + ')');
            var text = label.append('text')
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'central')
                .style('font-size', gateFs)
                .style('fill', '#fff')
                .text(gate.name);

            // Background
            var bbox = text.node().getBBox();
            label.insert('rect', 'text')
                .attr('x', bbox.x - 2).attr('y', bbox.y - 1)
                .attr('width', bbox.width + 4).attr('height', bbox.height + 2)
                .attr('rx', 2)
                .attr('fill', gate.color).attr('fill-opacity', 0.85);
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
        var kdeBandwidth = Number(data.kde_bandwidth);
        if (!isFinite(kdeBandwidth) || kdeBandwidth < 0) kdeBandwidth = 0;
        var nColumns = parseInt(data.n_columns, 10);
        if (!isFinite(nColumns) || nColumns < 1) nColumns = steps.length;
        nColumns = Math.max(1, Math.min(24, nColumns));
        var fitToColumns = !!data.fit_to_columns;
        var fontSizes = data.font_sizes || {};
        var gapPx = 8;

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
            var title = sign + step.gate_name + ': ' + step.pct_pass + '%' + modeTag;

            renderMiniPlot(plotDiv, {
                x: step.x,
                y: step.y,
                x_back: step.x_back,
                y_back: step.y_back,
                x_range: step.x_range,
                y_range: step.y_range,
                x_label: step.x_channel,
                y_label: step.y_channel,
                display_mode: displayMode,
                plot_size: effectivePlotSize,
                contour_threshold: contourThreshold,
                point_alpha: pointAlpha,
                kde_bandwidth: kdeBandwidth,
                title: title,
                font_sizes: fontSizes,
                pop_color: '#3182ce',
                back_color: '#d95f02',
                gates: [{
                    gate_id: step.gate_id,
                    name: step.gate_name + ' ' + step.pct_pass + '%',
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
        var kdeBandwidth = Number(data.kde_bandwidth);
        if (!isFinite(kdeBandwidth) || kdeBandwidth < 0) kdeBandwidth = 0;
        var nColumns = parseInt(data.n_columns, 10);
        if (!isFinite(nColumns) || nColumns < 1) nColumns = xChannels.length || 1;
        nColumns = Math.max(1, Math.min(24, nColumns));
        var fitToColumns = !!data.fit_to_columns;
        var fontSizes = data.font_sizes || {};
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
        var rowTargetWidth = nColumns * effectivePlotSize + gapPx * (nColumns - 1);

        var POP_COLORS = [
            '#3182ce', '#e6550d', '#31a354', '#756bb1', '#636363',
            '#e7298a', '#66a61e', '#e7ba52', '#7570b3', '#d95f02'
        ];

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid illustration-grid';
        gridDiv.id = containerId + '-grid';
        gridDiv.style.width = 'max-content';
        gridDiv.style.minWidth = rowTargetWidth + 'px';
        container.appendChild(gridDiv);

        for (var pi = 0; pi < popIds.length; pi++) {
            var popId = popIds[pi];
            var popName = popNames[popId] || 'Unknown';
            var n = popCounts[popId] || 0;
            var popColor = POP_COLORS[pi % POP_COLORS.length];

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
                    x: plotData.x,
                    y: plotData.y || null,
                    x_range: plotData.x_range,
                    y_range: plotData.y_range,
                    x_label: plotData.x_label || xCh,
                    y_label: plotData.y_label || yChannel,
                    display_mode: displayMode,
                    plot_size: effectivePlotSize,
                    contour_threshold: contourThreshold,
                    point_alpha: pointAlpha,
                    kde_bandwidth: kdeBandwidth,
                    title: null,
                    font_sizes: fontSizes,
                    pop_color: popColor,
                    gates: gateOvl
                });

                plotDiv.oncontextmenu = function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    _showMiniContextMenu(event, this);
                    return false;
                };
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
            var out = document.createElement('canvas');
            out.width = Math.max(1, Math.ceil(gridRect.width * scale));
            out.height = Math.max(1, Math.ceil(gridRect.height * scale));
            var octx = out.getContext('2d');
            octx.fillStyle = '#ffffff';
            octx.fillRect(0, 0, out.width, out.height);
            octx.scale(scale, scale);

            // Draw headers/arrows with their computed style.
            var textEls = gridEl.querySelectorAll('.illustration-row-header, .strategy-arrow');
            textEls.forEach(function (el) {
                var rect = el.getBoundingClientRect();
                var cs = window.getComputedStyle(el);
                var font = cs.font;
                if (!font || font === 'normal normal normal normal 16px / normal serif') {
                    font = [cs.fontStyle, cs.fontVariant, cs.fontWeight, cs.fontSize + '/' + cs.lineHeight, cs.fontFamily].join(' ');
                }
                octx.font = font || '13px sans-serif';
                octx.fillStyle = cs.color || '#333';
                octx.textBaseline = 'middle';
                octx.fillText((el.textContent || '').trim(), rect.left - gridRect.left, rect.top - gridRect.top + rect.height / 2);
            });

            var jobs = [];
            plots.forEach(function (plotDiv) {
                var rect = plotDiv.getBoundingClientRect();
                var x = rect.left - gridRect.left;
                var y = rect.top - gridRect.top;
                var job = _rasterizePlotCell(plotDiv, 1).then(function (plotCanvas) {
                    octx.drawImage(plotCanvas, x, y, rect.width, rect.height);
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
            _rasterizePlotCell(liveCell, 2)
                .then(_copyCanvasToClipboard)
                .catch(function () {
                    _rasterizePlotCell(liveCell, 2).then(function (canvas) {
                        canvas.toBlob(function (blob) {
                            if (blob) _downloadBlob(blob, 'plot.png');
                        }, 'image/png');
                    });
                });
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

    function exportGridSVG(gridId, filename) {
        var gridEl = document.getElementById(gridId);
        if (!gridEl) { alert('Grid not found: ' + gridId); return; }
        _rasterizeGridToCanvas(gridEl, 2).then(function (canvas) {
            var w = canvas.width;
            var h = canvas.height;
            var pngUrl = canvas.toDataURL('image/png');
            var svgText = [
                '<?xml version="1.0" encoding="UTF-8"?>',
                '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">',
                '<rect width="100%" height="100%" fill="white"/>',
                '<image href="' + pngUrl + '" x="0" y="0" width="' + w + '" height="' + h + '"/>',
                '</svg>'
            ].join('');
            _downloadBlob(new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' }), (filename || 'export') + '.svg');
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

    function exportGridPDF(gridId, filename) {
        var gridEl = document.getElementById(gridId);
        if (!gridEl) { alert('Grid not found: ' + gridId); return; }

        _rasterizeGridToCanvas(gridEl, 2).then(function (canvas) {
            _loadJsPdf().then(function (jsPDF) {
                var orientation = canvas.width >= canvas.height ? 'landscape' : 'portrait';
                var pdf = new jsPDF({
                    orientation: orientation,
                    unit: 'pt',
                    format: [canvas.width, canvas.height],
                    compress: true
                });
                var imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
                pdf.save((filename || 'export') + '.pdf');
            }).catch(function () {
                canvas.toBlob(function (blob) {
                    if (blob) _downloadBlob(blob, (filename || 'export') + '.png');
                }, 'image/png');
            });
        });
    }

    // ── Public API ──────────────────────────────────────────────────────────
    window.CytofMiniPlot = {
        renderMiniPlot: renderMiniPlot,
        renderStrategyGrid: renderStrategyGrid,
        renderIllustrationGrid: renderIllustrationGrid,
        exportGridPNG: exportGridPNG,
        exportGridSVG: exportGridSVG,
        exportGridPDF: exportGridPDF
    };

    // ── Shiny message handlers ──────────────────────────────────────────────
    function _registerHandlers() {
        if (typeof Shiny === 'undefined') return;

        Shiny.addCustomMessageHandler('renderStrategyGrid', function (data) {
            CytofMiniPlot.renderStrategyGrid(data.containerId, data);
        });

        Shiny.addCustomMessageHandler('renderIllustrationGrid', function (data) {
            CytofMiniPlot.renderIllustrationGrid(data.containerId, data);
        });

        Shiny.addCustomMessageHandler('exportMiniPlotPNG', function (data) {
            CytofMiniPlot.exportGridPNG(data.gridId, data.filename);
        });

        Shiny.addCustomMessageHandler('exportMiniPlotSVG', function (data) {
            CytofMiniPlot.exportGridSVG(data.gridId, data.filename);
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
