/**
 * CyTOF biaxial plot — pure D3/canvas, no Plotly.
 *
 * Rendering:  HTML5 Canvas for scatter dots (fast at 50k+ events)
 *             SVG overlay for axes, gate overlays, and interaction
 *
 * Interaction modes:
 *   navigate  — static view (no pan/zoom)
 *   draw-rect — mousedown/drag/mouseup rubber-band rectangle
 *   draw-poly — click-to-vertex polygon; click near first vertex to close
 *
 * Gate editing (selected gate only):
 *   Vertex handles — drag a single vertex; rectangle stays axis-aligned
 *   Fill area      — drag whole gate as a unit
 *
 * Shiny communication:
 *   Shiny.setInputValue() on gate complete / edit / select
 *   Shiny.addCustomMessageHandler() for R → JS updates
 */

'use strict';

(function () {

    // ── Layout constants ────────────────────────────────────────────────────
    let PLOT_W    = 460;
    let PLOT_H    = 460;
    const M       = { top: 20, right: 15, bottom: 45, left: 55 };
    let W         = 0;
    let H         = 0;
    const CTNR    = 'cytof-plot-container';
    const VRAD    = 7;      // vertex handle radius (px)
    const CLOSEPX = 28;     // polygon close-click threshold (px)

    // ── Module state ────────────────────────────────────────────────────────
    let _ready    = false;
    let _canvas   = null;
    let _ctx      = null;
    let _svg      = null;   // d3 selection
    let _g        = null;   // plot-area group (translated by margins)

    let _xBase    = null;   // base (un-zoomed) linear scale
    let _yBase    = null;
    let _zoom     = null;
    let _zt       = d3.zoomIdentity;

    let _plotData = null;
    let _mode     = 'navigate';

    // Polygon draw
    let _polyVerts = [];    // [{dx,dy}] placed vertices in data coords
    let _mouseData = null;  // {dx,dy} live cursor

    // Rectangle draw
    let _rectStart   = null;  // {dx,dy}
    let _rectCurrent = null;

    // Density / contour cache (base-scale pixel space)
    let _densityCache = null;
    let _contourCache = null;
    let _contourKey   = null;  // fingerprint of x/y data used to build _contourCache
    let _channelPickerEl = null;  // floating searchable channel-picker overlay

    // requestAnimationFrame handles for throttling
    let _zoomRafId = null;   // retained for compatibility; zoom is disabled
    let _drawRafId = null;   // rubber-band + poly-preview redraws

    // Drag guard: true while a gate vertex/move drag is active.
    // Prevents gates_only updates from calling _drawGates mid-drag
    // (which would destroy the SVG element currently being dragged).
    let _dragging = false;
    let _polyJustClosed = false;  // guard: suppress _onClick after mousedown closes polygon

    // Pending-edit map: gate_id → {vertices, seq}
    // Populated when _notifyGateEdit fires; cleared when server acks via clearPendingEdit().
    // Prevents a stale server response (from an earlier PUT) from overwriting local
    // vertex positions that are newer than what the server has confirmed yet.
    let _pendingEdits = {};
    let _editSeq      = 0;
    let _lastPlotSeq  = 0;
    let _deferredPlot = null;

    // ── Helpers ─────────────────────────────────────────────────────────────
    function _zx() { return _xBase; }
    function _zy() { return _yBase; }

    function _ptr(event) {
        return d3.pointer(event, _g.node());
    }

    function _shinyInput(name, value) {
        if (typeof Shiny !== 'undefined') {
            Shiny.setInputValue(name, value, {priority: 'event'});
        }
    }

    function _closedLine() {
        return d3.line().x(function (d) { return d[0]; })
                        .y(function (d) { return d[1]; })
                        .curve(d3.curveLinearClosed);
    }

    function _toPx(verts, zx, zy) {
        return verts.map(function (v) { return [zx(v[0]), zy(v[1])]; });
    }

    function _centroid(pts) {
        var cx = 0, cy = 0;
        pts.forEach(function (p) { cx += p[0]; cy += p[1]; });
        return [cx / pts.length, cy / pts.length];
    }

    // ── DOM init ─────────────────────────────────────────────────────────────
    function _init() {
        var ctnr = document.getElementById(CTNR);
        if (!ctnr) return;

        // Compute responsive plot dimensions: walk up the DOM until we find a
        // non-trivial rendered width (e.g. the Bootstrap column element).
        var _availW = 0;
        var _el = ctnr.parentElement;
        while (_el && _availW < 50) {
            _availW = (_el.getBoundingClientRect().width || _el.clientWidth) | 0;
            _el = _el.parentElement;
        }
        if (_availW < 50) _availW = (window.innerWidth * 0.30) | 0;
        PLOT_W = Math.min(Math.max(380, _availW - 32), 630);
        PLOT_H = PLOT_W;
        W = PLOT_W - M.left - M.right;
        H = PLOT_H - M.top  - M.bottom;

        ctnr.innerHTML = '';
        ctnr.style.cssText = [
            'position:relative',
            'display:inline-block',
            'width:'  + PLOT_W + 'px',
            'height:' + PLOT_H + 'px',
        ].join(';');

        // Canvas for scatter / density
        _canvas = document.createElement('canvas');
        _canvas.width  = PLOT_W;
        _canvas.height = PLOT_H;
        _canvas.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;';
        ctnr.appendChild(_canvas);
        _ctx = _canvas.getContext('2d');

        // SVG for axes + gate overlays + interaction
        var svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('width',  PLOT_W);
        svgEl.setAttribute('height', PLOT_H);
        svgEl.style.cssText = 'position:absolute;top:0;left:0;overflow:visible;';
        ctnr.appendChild(svgEl);
        _svg = d3.select(svgEl);

        // Clip path
        _svg.append('defs').append('clipPath').attr('id', 'cytof-clip')
            .append('rect').attr('width', W).attr('height', H);

        // Main group (inside margins)
        _g = _svg.append('g')
            .attr('transform', 'translate(' + M.left + ',' + M.top + ')');

        // Plot area border (transparent fill so canvas shows through)
        _g.append('rect').attr('class', 'plot-bg')
            .attr('width', W).attr('height', H)
            .attr('fill', 'none')
            .attr('stroke', '#555').attr('stroke-width', 1);

        // Transparent overlay for pointer events — MUST be BELOW gate-layer
        // so gate elements (vertex circles, fill handles) receive events first
        _g.append('rect').attr('class', 'cytof-overlay')
            .attr('width', W).attr('height', H)
            .attr('fill', 'none')
            .style('pointer-events', 'all');

        // Gate overlay layer — no clip so gates remain visible/editable beyond the plot edge
        _g.append('g').attr('class', 'gate-layer');

        // In-progress drawing layer (clipped)
        _g.append('g').attr('class', 'draw-layer')
            .attr('clip-path', 'url(#cytof-clip)');

        // Axes
        _g.append('g').attr('class', 'x-axis')
            .attr('transform', 'translate(0,' + H + ')');
        _g.append('g').attr('class', 'y-axis');

        // Axis labels — click to open channel picker
        _g.append('text').attr('class', 'cytof-xlabel')
            .attr('text-anchor', 'middle')
            .attr('x', W / 2).attr('y', H + 40)
            .style('font-size', '14px').style('fill', '#1a73e8')
            .style('cursor', 'pointer').style('user-select', 'none')
            .on('pointerdown', function(event) { event.stopPropagation(); })
            .on('click', function() { _showChannelPicker('x'); });
        _g.append('text').attr('class', 'cytof-ylabel')
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(-90)')
            .attr('x', -H / 2).attr('y', -48)
            .style('font-size', '14px').style('fill', '#1a73e8')
            .style('cursor', 'pointer').style('user-select', 'none')
            .on('pointerdown', function(event) { event.stopPropagation(); })
            .on('click', function() { _showChannelPicker('y'); });

        // Title
        _svg.append('text').attr('class', 'cytof-title')
            .attr('text-anchor', 'middle')
            .attr('x', M.left + W / 2).attr('y', 16)
            .style('font-size', '11px').style('fill', '#555');

        // Hard-disable viewport zoom/pan interactions.
        // Any existing d3-zoom listeners are removed explicitly.
        _zoom = null;
        _svg.on('.zoom', null);

        // SVG pointer events (rect draw + poly click + poly mousemove)
        _svg.on('mousedown.draw', _onMousedown)
            .on('mousemove.draw', _onMousemove)
            .on('click.draw',    _onClick);

        _ready = true;
    }

    // ── Mode ─────────────────────────────────────────────────────────────────
    function _applyMode(newMode) {
        _mode = newMode;
        // Cancel any in-progress drawing
        _polyVerts = []; _mouseData = null;
        _rectStart = null; _rectCurrent = null;
        if (_g) _g.select('.draw-layer').selectAll('*').remove();

        if (!_g) return;
        _g.select('.cytof-overlay').style('cursor',
            newMode === 'navigate' ? 'default' : 'crosshair');
    }

    // ── Pointer events — rect gate ───────────────────────────────────────────
    function _onMousedown(event) {
        // Poly-close: fire on mousedown so one press is sufficient.
        // Clicking the first-vertex green circle or within CLOSEPX of it closes the polygon.
        if (_mode === 'draw-poly' && _polyVerts.length >= 3) {
            var [px, py] = _ptr(event);
            var zx = _zx(), zy = _zy();
            var fx = zx(_polyVerts[0].dx), fy = zy(_polyVerts[0].dy);
            if (Math.hypot(px - fx, py - fy) <= CLOSEPX) {
                event.preventDefault();
                event.stopPropagation();
                _closePolygon();
                return;
            }
        }
        if (_mode !== 'draw-rect') return;
        event.preventDefault();
        var [px, py] = _ptr(event);
        var zx = _zx(), zy = _zy();
        _rectStart   = { dx: zx.invert(px), dy: zy.invert(py) };
        _rectCurrent = { dx: _rectStart.dx, dy: _rectStart.dy };
        _drawInProgress();
        d3.select(window)
            .on('mousemove.rd', _onRectMove)
            .on('mouseup.rd',   _onRectUp);
    }

    function _onRectMove(event) {
        if (!_rectStart) return;
        var [px, py] = _ptr(event);
        var zx = _zx(), zy = _zy();
        _rectCurrent = { dx: zx.invert(px), dy: zy.invert(py) };
        if (_drawRafId) return;
        _drawRafId = requestAnimationFrame(function () {
            _drawRafId = null;
            _drawInProgress();
        });
    }

    function _onRectUp(event) {
        d3.select(window).on('mousemove.rd', null).on('mouseup.rd', null);
        if (!_rectStart) return;

        var [px, py] = _ptr(event);
        var zx = _zx(), zy = _zy();
        _rectCurrent = { dx: zx.invert(px), dy: zy.invert(py) };

        var x0 = Math.min(_rectStart.dx, _rectCurrent.dx);
        var x1 = Math.max(_rectStart.dx, _rectCurrent.dx);
        var y0 = Math.min(_rectStart.dy, _rectCurrent.dy);
        var y1 = Math.max(_rectStart.dy, _rectCurrent.dy);

        _rectStart = null; _rectCurrent = null;
        _g.select('.draw-layer').selectAll('*').remove();

        if (Math.abs(zx(x1) - zx(x0)) < 5 || Math.abs(zy(y1) - zy(y0)) < 5) return;
        _notifyNewGate('rectangle', [[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
    }

    // ── Pointer events — polygon gate ────────────────────────────────────────
    function _onMousemove(event) {
        if (_mode !== 'draw-poly' || _polyVerts.length === 0) return;
        var [px, py] = _ptr(event);
        var zx = _zx(), zy = _zy();
        _mouseData = { dx: zx.invert(px), dy: zy.invert(py) };
        if (_drawRafId) return;
        _drawRafId = requestAnimationFrame(function () {
            _drawRafId = null;
            _drawPolyPreview();
        });
    }

    function _onClick(event) {
        if (_mode !== 'draw-poly') return;

        // If polygon was closed via mousedown, swallow this click and reset guard
        if (_polyJustClosed) { _polyJustClosed = false; return; }

        var [px, py] = _ptr(event);
        var zx = _zx(), zy = _zy();

        // Close check as fallback (in case mousedown didn't fire)
        if (_polyVerts.length >= 3) {
            var fx = zx(_polyVerts[0].dx), fy = zy(_polyVerts[0].dy);
            if (Math.hypot(px - fx, py - fy) <= CLOSEPX) {
                _closePolygon();
                return;
            }
        }

        // Ignore clicks on existing gate elements (vertex handles or gate bodies)
        if (event.target.classList.contains('vh') ||
            event.target.classList.contains('gate-fill')) return;

        var dx = zx.invert(px), dy = zy.invert(py);
        _polyVerts.push({ dx: dx, dy: dy });
        _drawPolyPreview();
    }

    function _closePolygon() {
        if (_polyVerts.length < 3) return;
        var verts = _polyVerts.map(function (v) { return [v.dx, v.dy]; });
        _polyVerts = []; _mouseData = null;
        _polyJustClosed = true;
        _g.select('.draw-layer').selectAll('*').remove();
        _notifyNewGate('polygon', verts);
    }

    // ── In-progress visuals ──────────────────────────────────────────────────
    function _drawInProgress() {
        var dl = _g.select('.draw-layer');
        dl.selectAll('*').remove();
        if (!_rectStart || !_rectCurrent) return;

        var zx = _zx(), zy = _zy();
        var sx = zx(Math.min(_rectStart.dx, _rectCurrent.dx));
        var ex = zx(Math.max(_rectStart.dx, _rectCurrent.dx));
        var sy = zy(Math.max(_rectStart.dy, _rectCurrent.dy));
        var ey = zy(Math.min(_rectStart.dy, _rectCurrent.dy));
        dl.append('rect').attr('class', 'rubber-band')
            .attr('x', sx).attr('y', sy)
            .attr('width',  Math.max(0, ex - sx))
            .attr('height', Math.max(0, ey - sy));
    }

    function _drawPolyPreview() {
        var dl = _g.select('.draw-layer');
        dl.selectAll('*').remove();
        if (_polyVerts.length === 0) return;

        var zx = _zx(), zy = _zy();
        var sv = _polyVerts.map(function (v) { return [zx(v.dx), zy(v.dy)]; });
        var all = _mouseData
            ? sv.concat([[zx(_mouseData.dx), zy(_mouseData.dy)]])
            : sv;

        if (all.length >= 2) {
            dl.append('path').attr('class', 'poly-preview-line')
                .attr('d', d3.line().x(function (d) { return d[0]; })
                                    .y(function (d) { return d[1]; })(all))
                .attr('fill', 'none')
                .attr('stroke', '#333').attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '5 3');
        }

        dl.selectAll('circle.pv').data(sv)
            .enter().append('circle').attr('class', 'pv')
            .attr('cx', function (d) { return d[0]; })
            .attr('cy', function (d) { return d[1]; })
            .attr('r', 4).attr('fill', '#444').attr('fill-opacity', 0.85)
            .attr('stroke', 'white').attr('stroke-width', 1);

        // Highlight first vertex when cursor is close enough to close
        if (_polyVerts.length >= 3 && _mouseData) {
            var fx = zx(_polyVerts[0].dx), fy = zy(_polyVerts[0].dy);
            var near = Math.hypot(zx(_mouseData.dx) - fx,
                                  zy(_mouseData.dy) - fy) <= CLOSEPX;
            dl.select('circle.pv')
                .attr('r',    near ? 12 : 4)
                .attr('fill', near ? '#2ca02c' : '#444');
        }
    }

    // ── Axis tick formatter for arcsinh-scaled scatter channels ─────────────
    // d is an arcsinh(raw/cofactor) value; we show the raw linear value.
    function _scatterTickFormat(cofactor) {
        return function(d) {
            var raw = (cofactor || 150) * Math.sinh(d);
            var abs = Math.abs(raw);
            var sign = raw < 0 ? '-' : '';
            if (abs >= 1e6) return sign + (abs / 1e6).toFixed(1) + 'M';
            if (abs >= 1e3) return sign + Math.round(abs / 1e3) + 'K';
            return sign + Math.round(abs).toLocaleString();
        };
    }

    // ── Base64 binary decode ──────────────────────────────────────────────────
    // x/y event data is sent as base64-encoded float32 to avoid double JSON
    // serialisation (server→Dash→browser) of 100K floats.
    function _decodeFloats(b64) {
        var bin = atob(b64);
        var bytes = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        return new Float32Array(bytes.buffer);
    }

    // ── Contour cache fingerprint ─────────────────────────────────────────────
    // Sample ~200 evenly-spaced values from x and y to cheaply identify
    // whether the underlying data changed. Reusing the KDE when the same
    // channels are shown (e.g. two different gates with the same x/y axes)
    // avoids the expensive d3.contourDensity recomputation.
    function _makeContourKey(pd) {
        if (!pd || !pd.x || !pd.x.length) return null;
        var x = pd.x, y = pd.y, n = x.length;
        var step = Math.max(1, Math.floor(n / 200));
        var parts = [n, pd.x_label, pd.y_label, pd.kde_bandwidth || 0,
                     pd.contour_threshold || 5];
        for (var i = 0; i < n; i += step) {
            parts.push(x[i], y[i]);
        }
        return parts.join('|');
    }

    // ── Build a D3 axis with logicle ticks (FlowJo-style) ──────────────────
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
        allPositions.sort(function(a, b) { return a - b; });
        var axis = axisFn(scale)
            .tickValues(allPositions)
            .tickFormat(function(d) { return labelMap[d] || ''; })
            .tickSizeOuter(0);
        return { axis: axis, majorSet: majorSet };
    }

    // Style major (full-length) vs minor (short, no label) ticks
    function _styleLogicleAxis(sel, majorSet, isBottom) {
        sel.selectAll('.tick').each(function(d) {
            var tick = d3.select(this);
            var isMajor = majorSet[d];
            tick.select('line').attr(isBottom ? 'y2' : 'x2',
                isMajor ? (isBottom ? 6 : -6) : (isBottom ? 3 : -3));
            if (!isMajor) tick.select('text').style('display', 'none');
        });
    }

    // Hide major-tick labels that are too close together in pixel space.
    // Used for logicle (CyTOF asinh + flow logicle) axes.
    // Simple left-to-right pass — no zero-protection, which belongs only on
    // scatter-log10 axes (FSC/SSC).  Those axes skip this function entirely
    // via the (tick_mode === 'scatter_log10') condition in _redraw().
    function _hideCompressedLabels(sel, scale, minSpacingPx) {
        var labeled = [];
        sel.selectAll('.tick text').each(function(d) {
            var el = d3.select(this);
            if (el.style('display') !== 'none' && el.text() !== '') {
                labeled.push({ el: el, px: scale(d) });
            }
        });
        labeled.sort(function(a, b) { return a.px - b.px; });
        var lastPx = -Infinity;
        for (var i = 0; i < labeled.length; i++) {
            if (Math.abs(labeled[i].px - lastPx) < minSpacingPx) {
                labeled[i].el.style('display', 'none');
            } else {
                lastPx = labeled[i].px;
            }
        }
    }

    // ── Full redraw ───────────────────────────────────────────────────────────
    function _redraw() {
        if (!_xBase) return;
        _zt = d3.zoomIdentity;
        var zx = _zx(), zy = _zy();
        var pd = _plotData || {};
        var xIsLog     = pd.x_is_log;
        var yIsLog     = pd.y_is_log;
        var xIsLogicle = pd.x_is_logicle === true;
        var yIsLogicle = pd.y_is_logicle === true;
        var xScCf = pd.x_scatter_cofactor || 150;
        var yScCf = pd.y_scatter_cofactor || 150;
        var xTicks = pd.x_logicle_ticks;
        var yTicks = pd.y_logicle_ticks;

        // ── X axis ──
        if (xIsLogicle && xTicks && xTicks.major_pos && xTicks.major_pos.length > 0) {
            var xLg = _buildLogicleAxis(zx, xTicks, d3.axisBottom);
            _g.select('.x-axis').call(xLg.axis);
            _styleLogicleAxis(_g.select('.x-axis'), xLg.majorSet, true);
            // scatter_log10 (FSC/SSC) labels are decade-spaced and never overlap.
            // CyTOF (asinh) and flow signal (logicle) may need compression near zero.
            if (xTicks.tick_mode === 'asinh' || xTicks.tick_mode === 'logicle') {
                _hideCompressedLabels(_g.select('.x-axis'), zx, 28);
            }
        } else if (xIsLog) {
            _g.select('.x-axis').call(
                d3.axisBottom(zx).ticks(5).tickFormat(_scatterTickFormat(xScCf))
            );
            _hideCompressedLabels(_g.select('.x-axis'), zx, 28);
        } else {
            _g.select('.x-axis').call(d3.axisBottom(zx).ticks(6));
            _hideCompressedLabels(_g.select('.x-axis'), zx, 28);
        }
        _g.select('.x-axis').selectAll('.tick text').style('font-size', '12px');

        // ── Y axis ──
        if (yIsLogicle && yTicks && yTicks.major_pos && yTicks.major_pos.length > 0) {
            var yLg = _buildLogicleAxis(zy, yTicks, d3.axisLeft);
            _g.select('.y-axis').call(yLg.axis);
            _styleLogicleAxis(_g.select('.y-axis'), yLg.majorSet, false);
            if (yTicks.tick_mode === 'asinh' || yTicks.tick_mode === 'logicle') {
                _hideCompressedLabels(_g.select('.y-axis'), zy, 18);
            }
        } else if (yIsLog) {
            _g.select('.y-axis').call(
                d3.axisLeft(zy).ticks(5).tickFormat(_scatterTickFormat(yScCf))
            );
            _hideCompressedLabels(_g.select('.y-axis'), zy, 18);
        } else {
            _g.select('.y-axis').call(d3.axisLeft(zy).ticks(6));
            _hideCompressedLabels(_g.select('.y-axis'), zy, 18);
        }
        _g.select('.y-axis').selectAll('.tick text').style('font-size', '12px');

        _drawCanvas(zx, zy);
        _drawGates(zx, zy);
        if (_rectStart)          _drawInProgress();
        if (_polyVerts.length > 0) _drawPolyPreview();
    }

    // ── Canvas rendering ──────────────────────────────────────────────────────
    function _drawCanvas(zx, zy) {
        _ctx.clearRect(0, 0, PLOT_W, PLOT_H);
        if (!_plotData || !_plotData.x || !_plotData.x.length) return;
        // Multi-sample overlay mode: always use scatter with per-point colors
        if (_plotData.overlay_mode && _plotData.color_indices) {
            _drawOverlayScatter(zx, zy);
        } else if (_plotData.display_mode === 'pseudocolor') {
            _drawPseudocolor(zx, zy);
        } else if (_plotData.display_mode === 'contour') {
            _drawContour(zx, zy);
        } else {
            _drawScatter(zx, zy);
        }
    }

    function _drawScatter(zx, zy) {
        var x = _plotData.x, y = _plotData.y, n = x.length;
        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(M.left, M.top, W, H);
        _ctx.clip();
        _ctx.fillStyle = '#1f77b4';
        _ctx.globalAlpha = _plotData.point_alpha || 0.35;
        for (var i = 0; i < n; i++) {
            var px = zx(x[i]) + M.left;
            var py = zy(y[i]) + M.top;
            if (px < M.left - 2 || px > M.left + W + 2 ||
                py < M.top  - 2 || py > M.top  + H + 2) continue;
            _ctx.beginPath();
            _ctx.arc(px, py, 1.5, 0, 6.2832);
            _ctx.fill();
        }
        _ctx.restore();
    }

    // ── Overlay scatter: per-point colors from color_indices + color_palette ──
    function _drawOverlayScatter(zx, zy) {
        var x = _plotData.x, y = _plotData.y, n = x.length;
        var ci = _plotData.color_indices;
        var palette = _plotData.color_palette || ['#1f77b4'];
        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(M.left, M.top, W, H);
        _ctx.clip();
        _ctx.globalAlpha = _plotData.point_alpha || 0.45;

        // Batch by color for fewer fillStyle switches
        var buckets = {};
        for (var i = 0; i < n; i++) {
            var c = ci[i] || 0;
            if (!buckets[c]) buckets[c] = [];
            buckets[c].push(i);
        }
        for (var c in buckets) {
            _ctx.fillStyle = palette[c] || palette[0];
            var indices = buckets[c];
            for (var j = 0; j < indices.length; j++) {
                var idx = indices[j];
                var px = zx(x[idx]) + M.left;
                var py = zy(y[idx]) + M.top;
                if (px < M.left - 2 || px > M.left + W + 2 ||
                    py < M.top  - 2 || py > M.top  + H + 2) continue;
                _ctx.beginPath();
                _ctx.arc(px, py, 1.5, 0, 6.2832);
                _ctx.fill();
            }
        }

        // Draw legend in top-right corner
        var labels = _plotData.color_labels || [];
        if (labels.length > 0) {
            _ctx.globalAlpha = 1.0;
            var lx = M.left + W - 8;
            var ly = M.top + 12;
            _ctx.font = '11px sans-serif';
            _ctx.textAlign = 'right';
            for (var k = 0; k < Math.min(labels.length, palette.length); k++) {
                _ctx.fillStyle = palette[k];
                _ctx.fillRect(lx - 2, ly - 8, 10, 10);
                _ctx.fillStyle = '#333';
                _ctx.fillText(labels[k], lx - 16, ly);
                ly += 14;
            }
        }
        _ctx.restore();
    }

    function _ptsInDomain() {
        // Return base-scale pixel coords filtered to the plot area [0,W]×[0,H]
        var x = _plotData.x, y = _plotData.y, pts = [];
        for (var i = 0; i < x.length; i++) {
            var px = _xBase(x[i]), py = _yBase(y[i]);
            if (px >= 0 && px <= W && py >= 0 && py <= H) pts.push([px, py]);
        }
        return pts;
    }

    // ── Channel picker (clicking axis labels) ────────────────────────────────
    function _showChannelPicker(axis) {
        _hideChannelPicker();
        if (!_plotData || !_plotData.channels || !_plotData.channels.length) return;

        var labelSel = _g.select(axis === 'x' ? '.cytof-xlabel' : '.cytof-ylabel');
        if (labelSel.empty()) return;
        var labelRect = labelSel.node().getBoundingClientRect();

        var panel = document.createElement('div');
        panel.style.cssText = [
            'position:fixed', 'z-index:9999',
            'min-width:240px', 'max-width:420px',
            'font-size:13px', 'border:1px solid #aaa',
            'border-radius:4px', 'background:#fff',
            'box-shadow:0 3px 12px rgba(0,0,0,0.22)',
            'padding:6px'
        ].join(';');
        panel.style.left = Math.min(labelRect.left, window.innerWidth - 260) + 'px';
        panel.style.top  = (labelRect.bottom + 4) + 'px';

        var input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type to search channels...';
        input.autocomplete = 'off';
        input.style.cssText = [
            'display:block', 'width:100%',
            'border:1px solid #b8c2cf', 'border-radius:3px',
            'padding:4px 6px', 'font-size:12px',
            'margin-bottom:5px'
        ].join(';');

        var sel = document.createElement('select');
        sel.size = Math.min(_plotData.channels.length, 12);
        sel.style.cssText = [
            'display:block', 'width:100%',
            'font-size:12px', 'border:1px solid #c5cdd8',
            'border-radius:3px', 'outline:none',
            'cursor:pointer'
        ].join(';');

        panel.appendChild(input);
        panel.appendChild(sel);

        var currentVal = axis === 'x' ? _plotData.x_label : _plotData.y_label;
        var channels = _plotData.channels.slice();
        var _pickerFired = false;
        function _selectChannel(val) {
            if (_pickerFired) return;
            _pickerFired = true;
            _hideChannelPicker();
            if (typeof Shiny !== 'undefined') {
                Shiny.setInputValue('axis_label_click',
                    { axis: axis, selected: val, _ts: Date.now() },
                    { priority: 'event' });
            }
        }

        function _renderOptions(query) {
            var q = (query || '').toLowerCase();
            var filtered = channels.filter(function(ch) {
                return ch.toLowerCase().indexOf(q) !== -1;
            });

            sel.innerHTML = '';
            if (filtered.length === 0) {
                var none = document.createElement('option');
                none.text = '(no matching channels)';
                none.disabled = true;
                sel.appendChild(none);
                return;
            }

            filtered.forEach(function(ch, idx) {
                var opt = document.createElement('option');
                opt.value = opt.text = ch;
                if ((q && idx === 0) || (!q && ch === currentVal)) opt.selected = true;
                sel.appendChild(opt);
            });
        }

        _renderOptions('');

        sel.addEventListener('change', function() { _selectChannel(sel.value); });
        // Backup: mouseup on option (some browsers don't fire change on listbox click)
        sel.addEventListener('mouseup', function(e) {
            if (e.target.tagName === 'OPTION' && e.target.value !== currentVal) {
                _selectChannel(e.target.value);
            }
        });
        sel.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') _hideChannelPicker();
            if (e.key === 'Enter' && sel.value) _selectChannel(sel.value);
        });

        input.addEventListener('input', function() {
            _renderOptions(input.value);
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                _hideChannelPicker();
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                sel.focus();
                return;
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (sel.value) _selectChannel(sel.value);
            }
        });
        // Close on any outside click
        setTimeout(function() {
            document.addEventListener('mousedown', _outsidePickerClick, true);
        }, 10);

        document.body.appendChild(panel);
        _channelPickerEl = panel;
        input.focus();
    }

    function _outsidePickerClick(e) {
        if (_channelPickerEl && !_channelPickerEl.contains(e.target)) {
            _hideChannelPicker();
        }
    }

    function _hideChannelPicker() {
        if (_channelPickerEl) {
            _channelPickerEl.remove();
            _channelPickerEl = null;
            document.removeEventListener('mousedown', _outsidePickerClick, true);
        }
    }

    function _computeBandwidth(pts) {
        // Explicit bandwidth from the Smoothing slider (0 = auto)
        if (_plotData && _plotData.kde_bandwidth > 0) {
            return _plotData.kde_bandwidth;
        }
        // Adaptive bandwidth: tighter with more points to resolve fine structure,
        // broader with fewer points to avoid noise.
        var baseBw = Math.max(2, Math.min(10, Math.round(1200 / Math.sqrt(pts.length || 1))));
        // For scatter channels (FSC/SSC), the cofactor slider modulates the bandwidth:
        // lower cofactor → finer bandwidth → more population detail visible.
        if (_plotData && (_plotData.x_is_log || _plotData.y_is_log)) {
            var cf = Math.min(
                _plotData.x_scatter_cofactor || 150,
                _plotData.y_scatter_cofactor || 150
            );
            var cfMod = Math.max(0.3, Math.min(1.5, cf / 300));
            baseBw = Math.max(1.5, baseBw * cfMod);
        }
        return baseBw;
    }

    // FlowJo-style pseudocolor: jet-like colormap (blue → cyan → green → yellow → red)
    function _jetColor(t) {
        // t in [0,1]; returns [r,g,b] each in [0,255]
        var r, g, b;
        if (t < 0.125) {
            r = 0; g = 0; b = 128 + t * (127 / 0.125);
        } else if (t < 0.375) {
            r = 0; g = ((t - 0.125) / 0.25) * 255; b = 255;
        } else if (t < 0.625) {
            r = ((t - 0.375) / 0.25) * 255; g = 255; b = 255 - ((t - 0.375) / 0.25) * 255;
        } else if (t < 0.875) {
            r = 255; g = 255 - ((t - 0.625) / 0.25) * 255; b = 0;
        } else {
            r = 255 - ((t - 0.875) / 0.125) * 127; g = 0; b = 0;
        }
        return [Math.round(r), Math.round(g), Math.round(b)];
    }

    // Build a 256-entry lookup table for fast pseudocolor rendering
    var _jetLUT = null;
    function _ensureJetLUT() {
        if (_jetLUT) return;
        _jetLUT = new Array(256);
        for (var i = 0; i < 256; i++) {
            var rgb = _jetColor(i / 255);
            _jetLUT[i] = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
        }
    }

    function _drawPseudocolor(zx, zy) {
        var x = _plotData.x, y = _plotData.y, n = x.length;
        if (n === 0) return;

        _ensureJetLUT();

        // Compute per-point density using a grid-based approach for performance
        if (!_densityCache) {
            // Use a binned density grid at 256×256 for 4× the cells vs the old 128×128.
            // The grid is padded by `pad` cells on every side so that points just outside
            // the plot boundary (common for CyTOF arcsinh data piled near 0) still
            // contribute to the smoothed density of edge cells, eliminating the axis shadow.
            var gridSize = 256;
            var radius   = 3;
            var pad      = radius;         // padding so blur sees data beyond the plot edge
            var extSize  = gridSize + 2 * pad;
            var grid     = new Float32Array(extSize * extSize);
            var pxArr    = new Float32Array(n), pyArr = new Float32Array(n);

            for (var i = 0; i < n; i++) {
                pxArr[i] = _xBase(x[i]);
                pyArr[i] = _yBase(y[i]);
            }

            // Bin points into extended grid (includes points slightly outside plot)
            var xStep = W / gridSize, yStep = H / gridSize;
            for (var i = 0; i < n; i++) {
                var gx = Math.floor(pxArr[i] / xStep) + pad;
                var gy = Math.floor(pyArr[i] / yStep) + pad;
                if (gx >= 0 && gx < extSize && gy >= 0 && gy < extSize) {
                    grid[gy * extSize + gx]++;
                }
            }

            // Box-blur the extended grid
            var smoothed = new Float32Array(extSize * extSize);
            for (var sy = 0; sy < extSize; sy++) {
                for (var sx = 0; sx < extSize; sx++) {
                    var sum = 0, cnt = 0;
                    for (var dy = -radius; dy <= radius; dy++) {
                        for (var dx = -radius; dx <= radius; dx++) {
                            var ny = sy + dy, nx = sx + dx;
                            if (ny >= 0 && ny < extSize && nx >= 0 && nx < extSize) {
                                sum += grid[ny * extSize + nx];
                                cnt++;
                            }
                        }
                    }
                    smoothed[sy * extSize + sx] = sum / cnt;
                }
            }

            // Look up per-point density from smoothed extended grid
            var densities = new Float32Array(n);
            var maxDens = 0;
            for (var i = 0; i < n; i++) {
                var gx = Math.floor(pxArr[i] / xStep) + pad;
                var gy = Math.floor(pyArr[i] / yStep) + pad;
                // clamp so out-of-range points still get a density reading
                gx = Math.max(0, Math.min(extSize - 1, gx));
                gy = Math.max(0, Math.min(extSize - 1, gy));
                densities[i] = smoothed[gy * extSize + gx];
                if (densities[i] > maxDens) maxDens = densities[i];
            }

            _densityCache = { densities: densities, maxDens: maxDens, px: pxArr, py: pyArr };
        }

        var cache = _densityCache;
        if (!cache.maxDens) { _drawScatter(zx, zy); return; }

        // Sort by density so high-density points draw on top
        var indices = new Array(n);
        for (var i = 0; i < n; i++) indices[i] = i;
        indices.sort(function(a, b) { return cache.densities[a] - cache.densities[b]; });

        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(M.left, M.top, W, H);
        _ctx.clip();
        _ctx.globalAlpha = _plotData.point_alpha || 0.85;

        for (var j = 0; j < n; j++) {
            var i = indices[j];
            var px = zx(x[i]) + M.left;
            var py = zy(y[i]) + M.top;
            if (px < M.left - 2 || px > M.left + W + 2 ||
                py < M.top  - 2 || py > M.top  + H + 2) continue;
            var t = cache.densities[i] / cache.maxDens;
            var lutIdx = Math.max(0, Math.min(255, Math.floor(t * 255)));
            _ctx.fillStyle = _jetLUT[lutIdx];
            _ctx.beginPath();
            _ctx.arc(px, py, 1.5, 0, 6.2832);
            _ctx.fill();
        }
        _ctx.restore();
    }

    function _drawContour(zx, zy) {
        if (!_contourCache) {
            var pts = _ptsInDomain();
            if (!pts.length) { _contourCache = { contours: [], outlierPts: [] }; return; }

            var bw = _computeBandwidth(pts);
            var kde = d3.contourDensity()
                .x(function (d) { return d[0]; })
                .y(function (d) { return d[1]; })
                .size([W, H])
                .bandwidth(bw);

            var threshold = _plotData.contour_threshold || 5;

            // Step 1: coarse pass to find peak density
            var coarseC = kde.thresholds(20)(pts);
            if (!coarseC.length) { _contourCache = { contours: [], outlierPts: [] }; return; }
            var peakDensity = coarseC[coarseC.length - 1].value;
            if (!peakDensity) { _contourCache = { contours: [], outlierPts: [] }; return; }

            // Step 2: outer contour = threshold% of peak (not threshold% of index)
            var outerDensity = Math.max(peakDensity * (threshold / 100), peakDensity * 0.005);

            // Step 3: 18 log-spaced thresholds from outerDensity to peakDensity
            var nLevels = 18;
            var logThresholds = d3.range(nLevels).map(function(i) {
                return Math.exp(Math.log(outerDensity) + (Math.log(peakDensity) - Math.log(outerDensity)) * i / (nLevels - 1));
            });
            var contours = kde.thresholds(logThresholds)(pts);
            if (!contours.length) { _contourCache = { contours: [], outlierPts: [] }; return; }

            // Step 4: classify outliers via offscreen canvas mask of the outermost contour
            var offN = 256, oxS = offN / W, oyS = offN / H;
            var offCanvas = document.createElement('canvas');
            offCanvas.width = offN; offCanvas.height = offN;
            var offCtx = offCanvas.getContext('2d');
            offCtx.fillStyle = '#000';
            offCtx.fillRect(0, 0, offN, offN);
            offCtx.fillStyle = '#fff';
            offCtx.beginPath();
            contours[0].coordinates.forEach(function (polygon) {   // boundary contour at outerDensity
                polygon.forEach(function (ring) {
                    ring.forEach(function (pt, j) {
                        var px = pt[0] * oxS, py = pt[1] * oyS;
                        if (j === 0) offCtx.moveTo(px, py);
                        else         offCtx.lineTo(px, py);
                    });
                    offCtx.closePath();
                });
            });
            offCtx.fill('evenodd');
            var pixels = offCtx.getImageData(0, 0, offN, offN).data;

            var outlierPts = pts.filter(function (pt) {
                var gx = Math.max(0, Math.min(offN - 1, Math.floor(pt[0] * oxS)));
                var gy = Math.max(0, Math.min(offN - 1, Math.floor(pt[1] * oyS)));
                return pixels[(gy * offN + gx) * 4] < 128;  // black = outside contour
            });

            _contourCache = { contours: contours, outlierPts: outlierPts };
        }

        var cc = _contourCache;
        _ctx.save();
        _ctx.beginPath();
        _ctx.rect(M.left, M.top, W, H);
        _ctx.clip();
        _ctx.translate(M.left + _zt.x, M.top + _zt.y);
        _ctx.scale(_zt.k, _zt.k);

        // Outlier dots (small solid black, outside the outermost contour)
        _ctx.fillStyle = '#111111';
        _ctx.globalAlpha = (_plotData.point_alpha || 0.6);
        var dotR = 0.9 / _zt.k;
        cc.outlierPts.forEach(function (pt) {
            _ctx.beginPath();
            _ctx.arc(pt[0], pt[1], dotR, 0, 6.2832);
            _ctx.fill();
        });

        // Contour lines (unfilled, bold dark strokes)
        _ctx.strokeStyle = '#111111';
        _ctx.lineWidth = 1.0 / _zt.k;
        _ctx.globalAlpha = Math.min(1.0, (_plotData.point_alpha || 0.75) + 0.15);
        cc.contours.forEach(function (contour) {
            contour.coordinates.forEach(function (polygon) {
                polygon.forEach(function (ring) {
                    _ctx.beginPath();
                    ring.forEach(function (pt, j) {
                        if (j === 0) _ctx.moveTo(pt[0], pt[1]);
                        else         _ctx.lineTo(pt[0], pt[1]);
                    });
                    _ctx.closePath();
                    _ctx.stroke();
                });
            });
        });
        _ctx.restore();
    }

    // ── Gate overlay rendering ────────────────────────────────────────────────
    //
    // KEY DESIGN: We NEVER call _drawGates during a drag.
    // Drag handlers do fine-grained in-place updates to the SVG elements
    // they already own.  _drawGates is only called on:
    //   • initial render / data change
    //   • drag END (to sync the fully-updated state)
    //
    function _drawGates(zx, zy) {
        var gl = _g.select('.gate-layer');
        gl.selectAll('*').remove();
        if (!_plotData || !_plotData.gates) return;

        var xCh   = _plotData.x_label;
        var yCh   = _plotData.y_label;
        var selId = _plotData.selected_gate_id;

        // Render the selected gate last so it sits on top of all others in
        // SVG z-order — its vertex handles and hit areas are then never
        // obscured by an overlapping gate's fill, making dragging reliable.
        var orderedGates = selId
            ? _plotData.gates.slice().sort(function (a, b) {
                if (a.gate_id === selId) return  1;
                if (b.gate_id === selId) return -1;
                return 0;
              })
            : _plotData.gates;

        orderedGates.forEach(function (gate) {
            var isNormal  = gate.x_channel === xCh && gate.y_channel === yCh;
            var isFlipped = gate.x_channel === yCh && gate.y_channel === xCh;
            if (!isNormal && !isFlipped) return;
            if (!gate.vertices || gate.vertices.length < 2) return;

            var isSel = gate.gate_id === selId;
            var color = gate.color || '#e41a1c';
            var line  = _closedLine();
            // Flipped: swap v[0]/v[1] so the gate renders transposed on the current axes
            var pts   = isFlipped
                ? gate.vertices.map(function (v) { return [zx(v[1]), zy(v[0])]; })
                : _toPx(gate.vertices, zx, zy);
            // Gates are editable in both normal and flipped orientation
            var isEditable = true;

            var gg = gl.append('g').attr('class', 'saved-gate');

            // ── Hit area: thick transparent stroke around the boundary ──
            // Catches clicks near the gate edge even when not over the fill.
            var hitEl = gg.append('path').attr('class', 'gate-hit')
                .datum(pts).attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(0,0,0,0)')
                .attr('stroke-width', 14)
                .style('pointer-events', 'stroke')
                .style('cursor', 'move');

            // ── Fill area: near-zero opacity fill so pointer-events:all works ──
            // fill-opacity:0 is unreliable for hit-testing; use 0.001 instead.
            var fillEl = gg.append('path').attr('class', 'gate-fill')
                .datum(pts).attr('d', line)
                .attr('fill',         color)
                .attr('fill-opacity', 0.001)
                .attr('stroke', 'none')
                .style('pointer-events', 'all')
                .style('cursor', 'move');

            if (isSel && isEditable) {
                // Selected gate: whole-gate drag moves immediately
                var moveDrag = _makeGateMoveDrag(gate, gg, fillEl, zx, zy, isFlipped);
                fillEl.call(moveDrag);
                hitEl.call(moveDrag);
            } else {
                // Non-selected gate: click selects it; click+drag selects AND moves it.
                // No DOM rebuild at drag start (would detach the drag handler).
                var selectMoveDrag = _makeGateSelectOrMoveDrag(gate, gg, zx, zy, isFlipped);
                fillEl.call(selectMoveDrag);
                hitEl.call(selectMoveDrag);
            }

            // ── Visible outline — pointer-events:none, hits go to fill/hit ──
            var outlineEl = gg.append('path').attr('class', 'gate-outline')
                .datum(pts).attr('d', line)
                .attr('fill', 'none')
                .attr('stroke', color)
                .attr('stroke-width', isSel ? 2.5 : 1.5)
                .style('pointer-events', 'none');

            // ── Gate label — data-space centroid + draggable offset ──────
            // Centroid in data coords (works for both rect and polygon)
            // For flipped gates, display centroid swaps x/y
            var cx_data = d3.mean(gate.vertices, function (v) { return v[0]; });
            var cy_data = d3.mean(gate.vertices, function (v) { return v[1]; });

            var lo    = gate.label_offset || [0, 0];
            var labelG = gg.append('g').attr('class', 'gate-label')
                .attr('transform', isFlipped
                    ? 'translate(' + zx(cy_data + lo[1]) + ',' + zy(cx_data + lo[0]) + ')'
                    : 'translate(' + zx(cx_data + lo[0]) + ',' + zy(cy_data + lo[1]) + ')');

            var pctLine = (gate.percent_of_parent != null)
                ? Number(gate.percent_of_parent).toFixed(1) + '%'
                : null;
            var bg  = labelG.append('rect')
                .attr('rx', 3).attr('fill', color).attr('fill-opacity', 0.85);
            var txt = labelG.append('text')
                .attr('text-anchor', 'middle')
                .attr('fill', 'white').style('font-size', '12px');
            txt.append('tspan')
                .attr('x', 0)
                .attr('dy', pctLine ? '-0.55em' : '0.35em')
                .text(gate.name);
            if (pctLine) {
                txt.append('tspan')
                    .attr('x', 0).attr('dy', '1.3em')
                    .style('font-size', '11px')
                    .text(pctLine);
            }
            var bb = txt.node().getBBox();
            bg.attr('x', bb.x - 3).attr('y', bb.y - 2)
              .attr('width', bb.width + 6).attr('height', bb.height + 4);

            // Make label draggable (moves label_offset in data space; no gate change)
            (function (g_ref, cxd, cyd, flipped) {
                var origOffset, dragStartDx, dragStartDy;
                var labelDrag = d3.drag()
                    .on('start', function (event) {
                        _dragging = true;
                        origOffset = (g_ref.label_offset || [0, 0]).slice();
                        var p = _ptr(event);
                        dragStartDx = _zx().invert(p[0]);
                        dragStartDy = _zy().invert(p[1]);
                        event.sourceEvent.stopPropagation();
                    })
                    .on('drag', function (event) {
                        var p   = _ptr(event);
                        var zx2 = _zx(), zy2 = _zy();
                        var ddx = zx2.invert(p[0]) - dragStartDx;
                        var ddy = zy2.invert(p[1]) - dragStartDy;
                        if (flipped) {
                            // Screen x-delta maps to gate's y offset, screen y-delta to gate's x offset
                            g_ref.label_offset = [origOffset[0] + ddy, origOffset[1] + ddx];
                            labelG.attr('transform', 'translate(' +
                                zx2(cyd + g_ref.label_offset[1]) + ',' +
                                zy2(cxd + g_ref.label_offset[0]) + ')');
                        } else {
                            g_ref.label_offset = [origOffset[0] + ddx, origOffset[1] + ddy];
                            labelG.attr('transform', 'translate(' +
                                zx2(cxd + g_ref.label_offset[0]) + ',' +
                                zy2(cyd + g_ref.label_offset[1]) + ')');
                        }
                    })
                    .on('end', function () {
                        _dragging = false;
                        _notifyLabelMove(g_ref.gate_id, g_ref.label_offset);
                        _flushDeferredPlot();
                    });
                labelG.style('cursor', 'move')
                      .style('pointer-events', 'all')
                      .call(labelDrag);
            }(gate, cx_data, cy_data, isFlipped));

            // Store label reference so _updateGateElements can find it after
            // the label is lifted to the top-layer group (see below).
            gate._labelEl = labelG;

            // ── Vertex handles (selected + editable gate) ──
            // Appended AFTER label so they are topmost in z-order.
            var vertCircles = null;
            if (isSel && isEditable) {
                vertCircles = gg.selectAll('circle.vh')
                    .data(gate.vertices)
                    .enter().append('circle').attr('class', 'vh')
                    .attr('cx', function (d) { return isFlipped ? zx(d[1]) : zx(d[0]); })
                    .attr('cy', function (d) { return isFlipped ? zy(d[0]) : zy(d[1]); })
                    .attr('r', VRAD)
                    .attr('fill', color).attr('fill-opacity', 0.9)
                    .attr('stroke', 'white').attr('stroke-width', 2)
                    .style('cursor', 'crosshair')
                    .style('pointer-events', 'all');

                vertCircles.each(function (d, i) {
                    d3.select(this).call(
                        _makeVertexDrag(gate, i, gg, fillEl, outlineEl,
                                        vertCircles, labelG, zx, zy, isFlipped)
                    );
                });
            }
        });

        // ── Lift all gate labels to a top layer ──────────────────────────────
        // Each label is initially appended inside its gate's <g.saved-gate>.
        // Later gates in the DOM sit on top of earlier gates, so a gate fill
        // (pointer-events:all) can obscure a label from an earlier gate.
        // Moving all labels into a single group appended last guarantees every
        // label is above every gate fill, making label drag always reachable.
        var labelsLayer = gl.append('g').attr('class', 'gate-labels-layer');
        gl.selectAll('.gate-label').each(function () {
            labelsLayer.node().appendChild(this);
        });
    }

    // ── Drag: move entire gate ────────────────────────────────────────────────
    // ── Drag: select + optionally move a non-selected gate ───────────────────
    // On mousedown: immediately records selection in _plotData and notifies sidebar.
    // On drag (mouse moved): moves the gate exactly like _makeGateMoveDrag.
    // On end with no movement: the async Tier-1 render (triggered by the
    //   selected-gate-store update) redraws gates showing the gate as selected.
    // We never call _selectGate() here (which calls _drawGates()) because that
    // would destroy the SVG element we are currently dragging.
    function _makeGateSelectOrMoveDrag(gate, gg, zx, zy, flipped) {
        var origVerts, startDx, startDy, didMove;
        return d3.drag()
            .on('start', function (event) {
                if (_mode !== 'navigate') return;
                event.sourceEvent.stopPropagation();
                _dragging = true;
                didMove   = false;
                var p = _ptr(event);
                origVerts = gate.vertices.map(function (v) { return [v[0], v[1]]; });
                startDx   = zx.invert(p[0]);
                startDy   = zy.invert(p[1]);
                // Update selection state in-memory immediately (no DOM rebuild).
                if (_plotData) _plotData.selected_gate_id = gate.gate_id;
                // Notify Shiny sidebar asynchronously; _dragging guard keeps _drawGates
                // from firing until after this drag sequence is fully complete.
                _shinyInput('gate_select', gate.gate_id);
            })
            .on('drag', function (event) {
                if (_mode !== 'navigate') return;
                didMove = true;
                var p   = _ptr(event);
                var ddx = zx.invert(p[0]) - startDx;
                var ddy = zy.invert(p[1]) - startDy;
                if (flipped) {
                    gate.vertices = origVerts.map(function (v) { return [v[0] + ddy, v[1] + ddx]; });
                } else {
                    gate.vertices = origVerts.map(function (v) { return [v[0] + ddx, v[1] + ddy]; });
                }
                _updateGateElements(gate, gg, zx, zy, flipped);
            })
            .on('end', function () {
                _dragging = false;
                if (didMove) {
                    // Persist the move; _pendingEdits protects against stale server data.
                    _notifyGateEdit(gate);
                } else if (_xBase && _plotData) {
                    // Pure click-select: render selection immediately so vertices appear
                    // without waiting for an async gates_only round-trip.
                    _drawGates(_zx(), _zy());
                }
                // If not moved (pure click): the Tier-1 render queued during 'start'
                // will fire now that _dragging is false and call _drawGates to visually
                // highlight the newly-selected gate and show vertex handles.
                _flushDeferredPlot();
            });
    }

    function _makeGateMoveDrag(gate, gg, fillEl, zx, zy, flipped) {
        var origVerts, startDx, startDy;
        return d3.drag()
            .on('start', function (event) {
                _dragging = true;
                var [px, py] = _ptr(event);
                origVerts = gate.vertices.map(function (v) { return [v[0], v[1]]; });
                startDx   = zx.invert(px);
                startDy   = zy.invert(py);
                event.sourceEvent.stopPropagation();
            })
            .on('drag', function (event) {
                var [px, py] = _ptr(event);
                var ddx = zx.invert(px) - startDx;
                var ddy = zy.invert(py) - startDy;
                if (flipped) {
                    // Screen x-axis = gate's y_channel, screen y-axis = gate's x_channel
                    gate.vertices = origVerts.map(function (v) {
                        return [v[0] + ddy, v[1] + ddx];
                    });
                } else {
                    gate.vertices = origVerts.map(function (v) {
                        return [v[0] + ddx, v[1] + ddy];
                    });
                }
                _updateGateElements(gate, gg, zx, zy, flipped);
            })
            .on('end', function () {
                _dragging = false;
                _notifyGateEdit(gate);
                _flushDeferredPlot();
            });
    }

    // ── Drag: move a single vertex ────────────────────────────────────────────
    function _makeVertexDrag(gate, vertIdx, gg, fillEl, outlineEl,
                              vertCircles, labelG, zx, zy, flipped) {
        return d3.drag()
            .on('start', function (event) {
                _dragging = true;
                event.sourceEvent.stopPropagation();
            })
            .on('drag', function (event) {
                var [px, py] = _ptr(event);
                // Screen coordinates → gate's native data coordinates
                // Normal: screen x = gate x, screen y = gate y
                // Flipped: screen x = gate y, screen y = gate x
                var gateX = flipped ? zy.invert(py) : zx.invert(px);
                var gateY = flipped ? zx.invert(px) : zy.invert(py);

                if (gate.gate_type === 'rectangle') {
                    // Keep rectangle axis-aligned: move opposite corners accordingly
                    var opp  = gate.vertices[(vertIdx + 2) % 4];
                    var x0 = Math.min(gateX, opp[0]);
                    var x1 = Math.max(gateX, opp[0]);
                    var y0 = Math.min(gateY, opp[1]);
                    var y1 = Math.max(gateY, opp[1]);
                    gate.vertices[0] = [x0, y0];
                    gate.vertices[1] = [x1, y0];
                    gate.vertices[2] = [x1, y1];
                    gate.vertices[3] = [x0, y1];
                } else {
                    gate.vertices[vertIdx][0] = gateX;
                    gate.vertices[vertIdx][1] = gateY;
                }

                _updateGateElements(gate, gg, zx, zy, flipped);
            })
            .on('end', function () {
                _dragging = false;
                _notifyGateEdit(gate);
                _flushDeferredPlot();
            });
    }

    // ── In-place gate element update (called during drag — no DOM removal) ────
    function _updateGateElements(gate, gg, zx, zy, flipped) {
        var pts = flipped
            ? gate.vertices.map(function (v) { return [zx(v[1]), zy(v[0])]; })
            : _toPx(gate.vertices, zx, zy);
        var line = _closedLine();
        var pathD = line(pts);

        // Update all paths in place
        gg.select('.gate-hit').datum(pts).attr('d', pathD);
        gg.select('.gate-fill').datum(pts).attr('d', pathD);
        gg.select('.gate-outline').datum(pts).attr('d', pathD);

        // Update vertex handle positions
        gg.selectAll('circle.vh').each(function (d, i) {
            var v = gate.vertices[i];
            d3.select(this)
                .attr('cx', flipped ? zx(v[1]) : zx(v[0]))
                .attr('cy', flipped ? zy(v[0]) : zy(v[1]));
        });

        // Update label position — data-space centroid + label_offset (preserves user-moved position)
        var cx_data2 = d3.mean(gate.vertices, function(v) { return v[0]; });
        var cy_data2 = d3.mean(gate.vertices, function(v) { return v[1]; });
        var lo2 = gate.label_offset || [0, 0];
        // Use stored reference (label may have been lifted to a top-layer group).
        var labelSel = (gate._labelEl && gate._labelEl.node())
            ? gate._labelEl
            : gg.select('.gate-label');
        labelSel.attr('transform', flipped
            ? 'translate(' + zx(cy_data2 + lo2[1]) + ',' + zy(cx_data2 + lo2[0]) + ')'
            : 'translate(' + zx(cx_data2 + lo2[0]) + ',' + zy(cy_data2 + lo2[1]) + ')');
    }

    // ── Dash communication ────────────────────────────────────────────────────
    function _notifyNewGate(gateType, verts) {
        if (!_plotData) return;

        // Compute initial label offset so the label starts centered above the gate.
        var xs = verts.map(function(v) { return v[0]; });
        var ys = verts.map(function(v) { return v[1]; });
        var cx     = (d3.min(xs) + d3.max(xs)) / 2;
        var cy     = (d3.min(ys) + d3.max(ys)) / 2;
        var yMax   = d3.max(ys);
        var yMargin = (d3.max(ys) - d3.min(ys)) * 0.20;
        var labelOffset = [0, (yMax - cy) + yMargin];

        _shinyInput('new_gate', {
            gate_type:    gateType,
            vertices:     verts,
            x_channel:    _plotData.x_label,
            y_channel:    _plotData.y_label,
            label_offset: labelOffset,
        });
    }

    function _notifyGateEdit(gate) {
        var seq = ++_editSeq;
        // Record pending edit so the fast-path render doesn't overwrite with stale server data.
        _pendingEdits[gate.gate_id] = {
            seq:          seq,
            vertices:     gate.vertices.map(function (v) { return [v[0], v[1]]; }),
            label_offset: gate.label_offset ? [gate.label_offset[0], gate.label_offset[1]] : [0, 0],
        };
        _shinyInput('gate_edit', {
            gate_id:   gate.gate_id,
            name:      gate.name,
            gate_type: gate.gate_type,
            x_channel: gate.x_channel,
            y_channel: gate.y_channel,
            vertices:  gate.vertices,
            color:     gate.color,
            seq:       seq,
        });
    }

    function _notifyLabelMove(gateId, offset) {
        _shinyInput('gate_label_move', {
            gate_id: gateId, label_offset: offset
        });
    }

    function _getPlotSeq(plotData) {
        if (!plotData || plotData._plot_seq == null) return null;
        var seq = Number(plotData._plot_seq);
        return Number.isFinite(seq) ? seq : null;
    }

    function _isStalePlot(plotData) {
        var seq = _getPlotSeq(plotData);
        return seq != null && seq < _lastPlotSeq;
    }

    function _recordPlotSeq(plotData) {
        var seq = _getPlotSeq(plotData);
        if (seq != null && seq > _lastPlotSeq) _lastPlotSeq = seq;
    }

    function _mergePendingEditsIntoGates(gates) {
        if (!gates || !gates.length) return gates;
        if (Object.keys(_pendingEdits).length === 0) return gates;
        return gates.map(function (g) {
            var pe = _pendingEdits[g.gate_id];
            if (!pe) return g;
            return Object.assign({}, g, {
                vertices:     pe.vertices,
                label_offset: pe.label_offset,
            });
        });
    }

    function _flushDeferredPlot() {
        if (_dragging || !_deferredPlot) return;
        var next = _deferredPlot;
        _deferredPlot = null;
        render(next.plotData, next.mode);
    }

    function _selectGate(gateId) {
        if (_plotData) _plotData.selected_gate_id = gateId;
        if (_xBase)    _drawGates(_zx(), _zy());
        _shinyInput('gate_select', gateId);
    }

    // ── Public API ────────────────────────────────────────────────────────────

    function clear() {
        /* Called when plot-data-store becomes null (new FCS upload, channel reset). */
        if (_ctx && _canvas) {
            _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
        }
        if (_g) {
            _g.select('.gate-layer').selectAll('*').remove();
            _g.select('.x-axis').call(d3.axisBottom(d3.scaleLinear()).tickValues([]));
            _g.select('.y-axis').call(d3.axisLeft(d3.scaleLinear()).tickValues([]));
            _g.select('.cytof-xlabel').text('');
            _g.select('.cytof-ylabel').text('');
        }
        if (_svg) {
            _svg.select('.cytof-title').text('');
        }
        _plotData     = null;
        _densityCache = null;
        _contourCache = null;
        _zt           = d3.zoomIdentity;
        _pendingEdits = {};
        _deferredPlot = null;
    }

    function render(plotData, mode) {
        if (!plotData) return;

        // Forced renders — explicit scale edits (Min/Max, logicle W) and the
        // Refresh button — must never be swallowed by the seq guard or the
        // gates-only fast path below. Those optimisations can otherwise drop a
        // scale change outright, or apply only the gate overlays on top of a
        // stale canvas scale, leaving the plot looking unchanged until the user
        // flips to another biplot and back. A forced payload always runs a full
        // _redraw(), which rebuilds the axis scales from the new ranges.
        var forced = plotData.force_full === true;

        if (!forced && _isStalePlot(plotData)) return;

        if (_dragging) {
            if (!_deferredPlot) {
                _deferredPlot = { plotData: plotData, mode: mode };
            } else {
                var incomingSeq = _getPlotSeq(plotData);
                var deferredSeq = _getPlotSeq(_deferredPlot.plotData);
                if (deferredSeq == null || incomingSeq == null || incomingSeq >= deferredSeq) {
                    _deferredPlot = { plotData: plotData, mode: mode };
                }
            }
            return;
        }

        var ctnr = document.getElementById(CTNR);
        if (!ctnr) return;

        // Init (or re-init if canvas missing, or if column width has changed)
        if (!_ready || !ctnr.querySelector('canvas')) {
            _init();
        } else {
            // Re-measure enclosing column width; re-init if it changed by >30 px
            var _chkW = 0, _chkEl = ctnr.parentElement;
            while (_chkEl && _chkW < 50) {
                _chkW = (_chkEl.getBoundingClientRect().width || _chkEl.clientWidth) | 0;
                _chkEl = _chkEl.parentElement;
            }
            var _targetW = Math.min(Math.max(380, _chkW - 32), 630);
            if (_chkW >= 50 && Math.abs(_targetW - PLOT_W) > 30) _init();
        }

        // ── Fast path: only gate overlays changed, no canvas redraw needed ───
        if (!forced && plotData.gates_only && _ready && _xBase && _plotData) {
            _plotData.gates = _mergePendingEditsIntoGates(plotData.gates);
            _plotData.selected_gate_id = plotData.selected_gate_id;
            _recordPlotSeq(plotData);
            // Skip _drawGates while a drag is active: calling it would destroy
            // the SVG element currently being dragged, detaching the D3 drag handler.
            if (!_dragging) _drawGates(_zx(), _zy());
            return;
        }

        plotData.gates = _mergePendingEditsIntoGates(plotData.gates || []);

        // Decode binary event arrays (base64 float32 → Float32Array)
        if (plotData.x_b64) {
            var decoded = {
                x: _decodeFloats(plotData.x_b64),
                y: _decodeFloats(plotData.y_b64),
            };
            // Decode per-point color indices (base64 uint8) for overlay mode
            if (plotData.color_b64) {
                var bin = atob(plotData.color_b64);
                var ci = new Uint8Array(bin.length);
                for (var i = 0; i < bin.length; i++) ci[i] = bin.charCodeAt(i);
                decoded.color_indices = ci;
            }
            plotData = Object.assign({}, plotData, decoded);
        }

        var newMode = mode || 'navigate';

        var axisChanged = !_plotData ||
            plotData.x_label !== _plotData.x_label ||
            plotData.y_label !== _plotData.y_label;

        var cofactorChanged = _plotData && (
            plotData.x_scatter_cofactor !== _plotData.x_scatter_cofactor ||
            plotData.y_scatter_cofactor !== _plotData.y_scatter_cofactor
        );

        // Range change without channel change happens when the user edits Min/Max
        // for the current channel(s).  Without clearing _zt, the stale zoom
        // transform masks the new axis range so the plot appears unchanged until
        // the user pans/zooms or flips axes.  Tolerance is loose so harmless
        // floating-point jitter (e.g. gate-driven auto-expansion within 0.5%)
        // does NOT trigger an unwanted view reset that would lose the user's zoom.
        var rangeChanged = false;
        if (_plotData && plotData.x_range && _plotData.x_range &&
                          plotData.y_range && _plotData.y_range) {
            var _xspan = Math.abs(_plotData.x_range[1] - _plotData.x_range[0]) || 1;
            var _yspan = Math.abs(_plotData.y_range[1] - _plotData.y_range[0]) || 1;
            var _tolX = _xspan * 0.005;
            var _tolY = _yspan * 0.005;
            if (Math.abs(plotData.x_range[0] - _plotData.x_range[0]) > _tolX ||
                Math.abs(plotData.x_range[1] - _plotData.x_range[1]) > _tolX ||
                Math.abs(plotData.y_range[0] - _plotData.y_range[0]) > _tolY ||
                Math.abs(plotData.y_range[1] - _plotData.y_range[1]) > _tolY) {
                rangeChanged = true;
            }
        }

        if (axisChanged || plotData.reset_view || cofactorChanged || rangeChanged) {
            _zt = d3.zoomIdentity;
        }
        // Always clear density cache (pseudocolor). For contour, only clear if data changed.
        _densityCache = null;
        var newContourKey = _makeContourKey(plotData);
        if (newContourKey !== _contourKey) {
            _contourCache = null;
            _contourKey   = newContourKey;
        }

        _plotData = plotData;
        _recordPlotSeq(plotData);

        // Build base scales
        var xr = plotData.x_range;
        var yr = plotData.y_range;
        if (!xr || xr[0] == null) {
            xr = [d3.min(plotData.x) || 0, d3.max(plotData.x) || 1];
        }
        if (!yr || yr[0] == null) {
            yr = [d3.min(plotData.y) || 0, d3.max(plotData.y) || 1];
        }
        _xBase = d3.scaleLinear().domain(xr).range([0, W]);
        _yBase = d3.scaleLinear().domain(yr).range([H, 0]);

        // Axis labels
        _g.select('.cytof-xlabel').text(plotData.x_label || '');
        _g.select('.cytof-ylabel').text(plotData.y_label || '');
        _svg.select('.cytof-title').text(
            plotData.n_events != null
                ? Number(plotData.n_events).toLocaleString() + ' events'
                : '');

        if (newMode !== _mode) _applyMode(newMode);

        _redraw();
    }

    function setMode(mode) {
        if (!_ready) return;
        var m = mode || 'navigate';
        if (m !== _mode) _applyMode(m);
    }

    // ── Boot ─────────────────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(_init, 100);
        });
    } else {
        setTimeout(_init, 100);
    }

    // ── Expose ────────────────────────────────────────────────────────────────

    function clearPendingEdit(gateId, seq) {
        // Called by the Shiny clearPendingEdit handler when the server confirms a gate edit.
        // Removes the pending entry so subsequent render() calls use server data freely.
        var pe = _pendingEdits[gateId];
        if (pe && (seq == null || pe.seq <= seq)) {
            delete _pendingEdits[gateId];
        }
        _flushDeferredPlot();
    }

    window.CytofD3 = { render: render, setMode: setMode, clear: clear, clearPendingEdit: clearPendingEdit };

    // ── Shiny message handlers (R → JS) ──────────────────────────────────────
    // These replace the Dash clientside callbacks.

    function _registerShinyHandlers() {
        if (typeof Shiny === 'undefined') return;

        Shiny.addCustomMessageHandler('updatePlot', function(data) {
            if (!data) {
                if (window.CytofD3) window.CytofD3.clear();
                return;
            }
            window.CytofD3.render(data, data._mode || 'navigate');
        });

        Shiny.addCustomMessageHandler('setMode', function(mode) {
            window.CytofD3.setMode(mode || 'navigate');
        });

        Shiny.addCustomMessageHandler('clearPendingEdit', function(data) {
            if (data && window.CytofD3) {
                window.CytofD3.clearPendingEdit(data.gate_id, data.seq);
            }
        });

        Shiny.addCustomMessageHandler('setAlpha', function(alpha) {
            if (_plotData) {
                _plotData.point_alpha = alpha;
                if (_ready && _xBase) _drawCanvas(_zx(), _zy());
            }
        });
    }

    // Register handlers when Shiny is ready
    if (typeof Shiny !== 'undefined') {
        _registerShinyHandlers();
    } else {
        // Shiny not yet available — wait for it
        document.addEventListener('DOMContentLoaded', function() {
            // Shiny takes a moment to initialize after DOMContentLoaded
            var checkInterval = setInterval(function() {
                if (typeof Shiny !== 'undefined') {
                    clearInterval(checkInterval);
                    _registerShinyHandlers();
                }
            }, 100);
        });
    }

})();
