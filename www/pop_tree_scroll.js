/*
 * pop_tree_scroll.js — preserve the population-tree scroll position.
 *
 * The population tree (#population_tree_container > .population-tree-panel) is a
 * Shiny renderUI output. It re-renders on many reactive changes — selecting a
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
        return el && el.classList && el.classList.contains(PANEL_CLASS) &&
               el.parentElement && el.parentElement.id === CONTAINER_ID;
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

    function init() {
        var c = container();
        if (!c) { setTimeout(init, 200); return; }
        // Restore after Shiny swaps in a new panel (childList change in the
        // container's subtree). rAF lets layout settle so scrollHeight is final.
        var obs = new MutationObserver(function () {
            restore();
            requestAnimationFrame(restore);
        });
        obs.observe(c, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
