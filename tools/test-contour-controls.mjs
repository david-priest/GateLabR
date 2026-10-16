import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const main = readFileSync(new URL('../inst/app/www/cytof_plot.js', import.meta.url), 'utf8');
const mini = readFileSync(new URL('../inst/app/www/mini_plot.js', import.meta.url), 'utf8');
const keyFunction = main.slice(main.indexOf('function _makeContourKey(pd)'), main.indexOf('// ── Build a D3 axis'));
const key = runInNewContext(`(${keyFunction.trim()})`);
const payload = { x: [1, 2], y: [2, 3], x_range: [0, 5], y_range: [0, 5] };
assert.notEqual(key({ ...payload, contour_levels: 4 }), key({ ...payload, contour_levels: 12 }));
const mainLevels = main.match(/var nLevels = .*;/)[0];
const miniLevels = mini.slice(mini.indexOf('var requestedLevels ='), mini.indexOf('var logThresholds ='));
for (const [requested, expected] of [[2, 2], [4, 4], [10, 10], [1, 2], [99, 30], [4.6, 5]]) {
  assert.equal(runInNewContext(`${mainLevels}; nLevels`, { _plotData: { contour_levels: requested } }), expected);
  assert.equal(runInNewContext(`${miniLevels}; nLevels`, { cfg: { contour_levels: requested }, W: 200, H: 200 }), expected);
}
assert.equal((mini.match(/contour_levels: cfg.contour_levels/g) || []).length, 2);
const radius = main.slice(main.indexOf('function _pointRadius()'), main.indexOf('function _ensureJetLUT()'));
for (const size of [0.5, 1.5, 4]) {
  assert.equal(runInNewContext(`${radius}; _pointRadius() / _zt.k`, { _plotData: { point_size: size }, _zt: { k: 2 }, POINT_RADIUS_DEFAULT: 1.5 }), size / 2);
}
assert.ok(main.includes('var dotR = _pointRadius() / _zt.k;'));
console.log('Contour count, cache invalidation and point-radius checks passed.');
