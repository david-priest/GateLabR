/**
 * mini_plot.js — Static mini-plot renderer for Strategy and Illustration tabs.
 *
 * Renders small biaxial/histogram plots with gate overlays into container divs.
 * No interactivity (no zoom/pan, no gate editing). Used for multi-panel grids.
 *
 * Supports: scatter, pseudocolor display modes.
 * Each plot = canvas (dots) + SVG overlay (axes, gate polygons, labels, title).
 */

'use strict';

(function () {

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

    // ── Render a single mini plot ───────────────────────────────────────────
    function renderMiniPlot(container, cfg) {
        container.innerHTML = '';
        var size = cfg.plot_size || 200;
        var M = { top: 22, right: 8, bottom: 38, left: 42 };
        var W = size - M.left - M.right;
        var H = size - M.top - M.bottom;

        container.style.position = 'relative';
        container.style.width = size + 'px';
        container.style.height = size + 'px';
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
        if (x && x.length > 0 && y && y.length > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(M.left, M.top, W, H);
            ctx.clip();

            if (cfg.display_mode === 'pseudocolor') {
                _drawPseudocolor(ctx, x, y, xScale, yScale, M, W, H);
            } else {
                // Scatter
                ctx.fillStyle = cfg.pop_color || '#1f77b4';
                ctx.globalAlpha = 0.35;
                for (var i = 0; i < x.length; i++) {
                    var px = xScale(x[i]) + M.left;
                    var py = yScale(y[i]) + M.top;
                    if (px < M.left - 2 || px > M.left + W + 2 ||
                        py < M.top - 2 || py > M.top + H + 2) continue;
                    ctx.beginPath();
                    ctx.arc(px, py, 1.2, 0, 6.2832);
                    ctx.fill();
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

        var steps = data.steps;
        if (!steps || steps.length === 0) {
            container.innerHTML = '<em style="color:#999;">No gate steps for this population.</em>';
            return;
        }

        var plotSize = data.plot_size || 200;
        var displayMode = data.display_mode || 'scatter';
        var fontSizes = data.font_sizes || {};

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid strategy-grid';
        gridDiv.id = containerId + '-grid';
        container.appendChild(gridDiv);

        for (var i = 0; i < steps.length; i++) {
            var step = steps[i];

            // Plot container
            var plotDiv = document.createElement('div');
            plotDiv.className = 'mini-plot-cell';
            gridDiv.appendChild(plotDiv);

            var sign = step.include ? '' : 'NOT ';
            var title = sign + step.gate_name + ': ' + step.pct_pass + '%';

            renderMiniPlot(plotDiv, {
                x: step.x,
                y: step.y,
                x_range: step.x_range,
                y_range: step.y_range,
                x_label: step.x_channel,
                y_label: step.y_channel,
                display_mode: displayMode,
                plot_size: plotSize,
                title: title,
                font_sizes: fontSizes,
                pop_color: '#3182ce',
                gates: [{
                    gate_id: step.gate_id,
                    name: step.gate_name + ' ' + step.pct_pass + '%',
                    gate_type: step.gate_type,
                    vertices: step.vertices,
                    color: step.color,
                    label_offset: step.label_offset
                }]
            });

            // Arrow between steps
            if (i < steps.length - 1) {
                var arrow = document.createElement('span');
                arrow.className = 'strategy-arrow';
                arrow.textContent = '\u2192';
                gridDiv.appendChild(arrow);
            }
        }
    }

    function renderIllustrationGrid(containerId, data) {
        var container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        var plots = data.plots;          // keyed by "pop_id|x_channel"
        var popIds = data.pop_ids;       // ordered list
        var popNames = data.pop_names;   // {pop_id: name}
        var popCounts = data.pop_counts; // {pop_id: n_events}
        var xChannels = data.x_channels; // ordered list
        var yChannel = data.y_channel;
        var plotSize = data.plot_size || 200;
        var displayMode = data.display_mode || 'scatter';
        var fontSizes = data.font_sizes || {};
        var gateOverlays = data.gate_overlays || {}; // {pop_id|x_channel: [gate_overlay,...]}

        var POP_COLORS = [
            '#3182ce', '#e6550d', '#31a354', '#756bb1', '#636363',
            '#e7298a', '#66a61e', '#e7ba52', '#7570b3', '#d95f02'
        ];

        var gridDiv = document.createElement('div');
        gridDiv.className = 'mini-plot-grid illustration-grid';
        gridDiv.id = containerId + '-grid';
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
            gridDiv.appendChild(headerDiv);

            // Row of plots
            var rowDiv = document.createElement('div');
            rowDiv.className = 'illustration-row';
            gridDiv.appendChild(rowDiv);

            for (var ci = 0; ci < xChannels.length; ci++) {
                var xCh = xChannels[ci];
                var key = popId + '|' + xCh;
                var plotData = plots[key];
                if (!plotData) continue;

                var plotDiv = document.createElement('div');
                plotDiv.className = 'mini-plot-cell';
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
                    plot_size: plotSize,
                    title: null,
                    font_sizes: fontSizes,
                    pop_color: popColor,
                    gates: gateOvl
                });
            }
        }
    }

    // ── Export: capture grid as PNG ──────────────────────────────────────────
    function exportGridPNG(gridId, filename) {
        var gridEl = document.getElementById(gridId);
        if (!gridEl) { alert('Grid not found: ' + gridId); return; }

        // Use html2canvas-style approach: composite all mini-plot canvases
        var plots = gridEl.querySelectorAll('.mini-plot-cell');
        if (plots.length === 0) { alert('No plots to export'); return; }

        // Measure bounding box of grid
        var gridRect = gridEl.getBoundingClientRect();
        var scale = 3; // 300 DPI / 96 DPI ≈ 3x

        var exportCanvas = document.createElement('canvas');
        exportCanvas.width = Math.ceil(gridRect.width * scale);
        exportCanvas.height = Math.ceil(gridRect.height * scale);
        var ectx = exportCanvas.getContext('2d');
        ectx.fillStyle = '#ffffff';
        ectx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        ectx.scale(scale, scale);

        // Draw text elements (headers, arrows)
        var textEls = gridEl.querySelectorAll('.illustration-row-header, .strategy-arrow');
        textEls.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            var x = rect.left - gridRect.left;
            var y = rect.top - gridRect.top;
            ectx.fillStyle = '#333';
            ectx.font = window.getComputedStyle(el).font || '13px sans-serif';
            ectx.fillText(el.textContent, x, y + rect.height * 0.75);
        });

        // Composite each plot's canvas + SVG
        var promises = [];
        plots.forEach(function (plotDiv) {
            var pCanvas = plotDiv.querySelector('canvas');
            var pSvg = plotDiv.querySelector('svg');
            if (!pCanvas) return;

            var rect = plotDiv.getBoundingClientRect();
            var x = rect.left - gridRect.left;
            var y = rect.top - gridRect.top;

            // Draw canvas
            ectx.drawImage(pCanvas, x, y, rect.width, rect.height);

            // Draw SVG
            if (pSvg) {
                var svgClone = pSvg.cloneNode(true);
                // Inline styles
                svgClone.querySelectorAll('text').forEach(function (t) {
                    var cs = window.getComputedStyle(t);
                    t.setAttribute('style',
                        'font-size:' + cs.fontSize + ';font-family:' + cs.fontFamily +
                        ';fill:' + (cs.fill || '#000'));
                });
                var svgData = new XMLSerializer().serializeToString(svgClone);
                var svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                var url = URL.createObjectURL(svgBlob);

                var p = new Promise(function (resolve) {
                    var img = new Image();
                    img.onload = function () {
                        ectx.drawImage(img, x, y, rect.width, rect.height);
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.onerror = function () {
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.src = url;
                });
                promises.push(p);
            }
        });

        Promise.all(promises).then(function () {
            exportCanvas.toBlob(function (blob) {
                var a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = (filename || 'export') + '.png';
                a.click();
                URL.revokeObjectURL(a.href);
            }, 'image/png');
        });
    }

    // ── Public API ──────────────────────────────────────────────────────────
    window.CytofMiniPlot = {
        renderMiniPlot: renderMiniPlot,
        renderStrategyGrid: renderStrategyGrid,
        renderIllustrationGrid: renderIllustrationGrid,
        exportGridPNG: exportGridPNG
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
