/*
 * pop_tree_scroll.js — population-tree scroll preservation + arrow-key nav.
 *
 * Arrow keys: when the population list has focus (the container is tabindex=0
 * and is focused on row click), Up/Down move the active population to the
 * previous/next row (firing the same input as a click) and the re-render scrolls
 * the new active row into view.
 *
 * The population tree (#population_tree_container > #population_tree_ui >
 * .population-tree-panel) is a Shiny renderUI output — note Shiny inserts the
 * #population_tree_ui wrapper, so the scrollable panel is a grandchild, not a
 * direct child, of the container. It re-renders on many reactive changes —
 * selecting a
 * gate, clicking a population, gate counts updating — and each render replaces
 * the scrollable .population-tree-panel with a brand-new element whose scrollTop
 * is 0. The result: the list jumps back to the top while you're working partway
 * down it.
 *
 * Fix: remember the panel's scrollTop as the user scrolls, and restore it onto
 * the freshly-rendered panel right after each re-render. scrollTop is clamped to
 * the new content height, so genuinely shorter trees (e.g. a new dataset) settle
 * near the top naturally rather than snapping to a stale offset.
 */
(function () {
    var CONTAINER_ID = 'population_tree_container';
    var PANEL_CLASS  = 'population-tree-panel';

    var savedTop  = 0;
    var haveSaved = false;

    function container() { return document.getElementById(CONTAINER_ID); }
    function panel() {
        var c = container();
        return c ? c.querySelector('.' + PANEL_CLASS) : null;
    }

    function isOurPanel(el) {
        // Shiny's uiOutput wraps the panel in an intermediate
        // <div id="population_tree_ui">, so the panel is NOT a direct child of
        // the container — match by containment, not by parentElement.id.
        var c = container();
        return el && el.nodeType === 1 && el.classList &&
               el.classList.contains(PANEL_CLASS) && c && c.contains(el);
    }

    // Record scrollTop as the user scrolls. 'scroll' does not bubble, so listen
    // in the capture phase to catch it on the inner panel.
    document.addEventListener('scroll', function (e) {
        if (isOurPanel(e.target)) {
            savedTop  = e.target.scrollTop;
            haveSaved = true;
        }
    }, true);

    function restore() {
        if (!haveSaved) return;
        var p = panel();
        if (!p) return;
        var maxTop = Math.max(0, p.scrollHeight - p.clientHeight);
        var target = Math.min(savedTop, maxTop);
        if (p.scrollTop !== target) p.scrollTop = target;
    }

    // ── Arrow-key navigation ────────────────────────────────────────────────
    // pendingNav is set when an arrow keypress moved the active population; the
    // next re-render then scrolls the new active row into view instead of
    // restoring the previous scroll offset.
    var pendingNav = false;

    function isTypingTarget(el) {
        var t = el ? el.tagName : '';
        return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' ||
               (el && el.isContentEditable);
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        var c = container();
        if (!c) return;
        var ae = document.activeElement;
        if (isTypingTarget(ae)) return;                      // never hijack typing
        if (!(c === ae || c.contains(ae) || c.contains(e.target))) return;
        var rowEls = c.querySelectorAll('.pop-row[data-pop-id]');
        if (!rowEls.length) return;
        e.preventDefault();
        var idx = -1;
        for (var i = 0; i < rowEls.length; i++) {
            if (rowEls[i].classList.contains('active')) { idx = i; break; }
        }
        var dir = (e.key === 'ArrowDown') ? 1 : -1;
        var next;
        if (idx < 0) {
            next = (dir > 0) ? 0 : rowEls.length - 1;   // no active row → pick an end
        } else {
            next = idx + dir;
            if (next < 0 || next > rowEls.length - 1) return;  // already at a boundary
        }
        var pid = rowEls[next].getAttribute('data-pop-id');
        if (!pid) return;
        pendingNav = true;
        if (typeof Shiny !== 'undefined') {
            Shiny.setInputValue('pop_tree_click', pid, { priority: 'event' });
        }
    });

    function followActiveRow() {
        var c = container();
        if (!c) return;
        var act = c.querySelector('.pop-row.active');
        if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
        var p = panel();
        if (p) { savedTop = p.scrollTop; haveSaved = true; }  // persist new offset
    }

    function init() {
        var c = container();
        if (!c) { setTimeout(init, 200); return; }
        // After Shiny swaps in a new panel (childList change in the container's
        // subtree): if the change came from arrow-key navigation, scroll the new
        // active row into view; otherwise restore the user's scroll offset.
        // rAF lets layout settle so scrollHeight/positions are final.
        var obs = new MutationObserver(function () {
            if (pendingNav) {
                pendingNav = false;
                requestAnimationFrame(followActiveRow);
            } else {
                restore();
                requestAnimationFrame(restore);
            }
        });
        obs.observe(c, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
