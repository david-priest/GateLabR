/* Three-pane GateLabR shell, powered by vendored Split.js 1.6.5. */
'use strict';

(function () {
  var STORAGE_KEY = 'gatelabr-pane-sizes-v1';
  var DEFAULT_SIZES = [25, 42, 33];
  var splitInstance = null;
  var resizeFrame = null;

  function validSizes(value) {
    return Array.isArray(value) && value.length === 3 &&
      value.every(function (n) { return Number.isFinite(n) && n >= 8 && n <= 80; }) &&
      Math.abs(value.reduce(function (sum, n) { return sum + n; }, 0) - 100) < 1;
  }

  function savedSizes() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      return validSizes(parsed) ? parsed : DEFAULT_SIZES.slice();
    } catch (err) {
      return DEFAULT_SIZES.slice();
    }
  }

  function storeSizes(sizes) {
    if (!validSizes(sizes)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sizes));
    } catch (err) {
      // Private browsing or a locked-down browser may disable localStorage.
    }
  }

  function minSizes() {
    var width = document.documentElement.clientWidth || window.innerWidth || 1280;
    if (width < 1050) return [220, 400, 300];
    return [280, 520, 360];
  }

  function notifyPlots() {
    if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame);
    resizeFrame = window.requestAnimationFrame(function () {
      resizeFrame = null;
      window.dispatchEvent(new CustomEvent('gatelabr:paneresize'));
      if (window.CytofD3 && typeof window.CytofD3.resize === 'function') {
        window.CytofD3.resize();
      }
    });
  }

  function resetSizes() {
    if (!splitInstance) return;
    splitInstance.setSizes(DEFAULT_SIZES.slice());
    storeSizes(DEFAULT_SIZES.slice());
    notifyPlots();
  }

  function adjustGutter(index, delta) {
    if (!splitInstance) return;
    var sizes = splitInstance.getSizes();
    var left = index;
    var right = index + 1;
    var nextLeft = sizes[left] + delta;
    var nextRight = sizes[right] - delta;
    if (nextLeft < 8 || nextRight < 8) return;
    sizes[left] = nextLeft;
    sizes[right] = nextRight;
    splitInstance.setSizes(sizes);
    storeSizes(splitInstance.getSizes());
    notifyPlots();
  }

  function configureGutters(shell) {
    var gutters = shell.querySelectorAll('.gutter.gutter-horizontal');
    gutters.forEach(function (gutter, index) {
      gutter.setAttribute('role', 'separator');
      gutter.setAttribute('aria-orientation', 'vertical');
      gutter.setAttribute('aria-label', index === 0 ?
        'Resize data and plot panes' : 'Resize plot and gates panes');
      gutter.setAttribute('tabindex', '0');
      gutter.title = 'Drag to resize. Double-click or press Enter to reset all panes.';
      gutter.addEventListener('dblclick', resetSizes);
      gutter.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === 'Home') {
          event.preventDefault();
          resetSizes();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          adjustGutter(index, event.shiftKey ? -5 : -2);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          adjustGutter(index, event.shiftKey ? 5 : 2);
        }
      });
    });
  }

  function initialise() {
    var shell = document.getElementById('gatelabr-shell');
    if (!shell || splitInstance || typeof window.Split !== 'function') return;

    splitInstance = window.Split([
      '#gatelabr-left-pane',
      '#gatelabr-center-pane',
      '#gatelabr-right-pane'
    ], {
      sizes: savedSizes(),
      minSize: minSizes(),
      gutterSize: 8,
      snapOffset: 0,
      expandToMin: true,
      cursor: 'col-resize',
      onDrag: notifyPlots,
      onDragEnd: function (sizes) {
        storeSizes(sizes);
        notifyPlots();
      }
    });

    configureGutters(shell);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise);
  } else {
    initialise();
  }
})();
