# Gating-ML fixtures

Everything here is synthetic: generic detector names (FSC-A, SSC-A, FL1-A, FL2-A, FL3-A, Time), no markers, made-up population names, and 600 events drawn from a seeded generator. `test-gatingml-import-format.R` uses them.

The XML files other than `flowkit-*.xml` (see below) are GateLab's own exports of ten strategies over those events, written by `tools/gatingml-fixtures.ts` from GateLab's exporter. The same script records which events GateLab places in each population (`membership*.json`, 1-based event indices keyed by the population's name path), so the tests can check that GateLabR's importer selects the same events.

| File | What it carries |
|---|---|
| `events.csv` | The events, one column per channel. |
| `membership.json`, `membership-0.8.3.json` | GateLab's populations for each strategy, the two spillover matrices (the file's own and an external one), and the $TIMESTEP and $PnG of the file `timegain-*.xml` was written from. |
| `tree-standard.xml` | Standard format with the format mark (version 3): populations placed by `gating:parent_id`, logicle on Gating-ML's [0, 1] scale, Time in seconds and scale values (`"time": "seconds"`, `"gain": "gating-ml"`), a one-dimensional range gate, `gatelabr_scales` version 4 with the compensation reference `"dimensions"`, and GateLab's own record of each rectangle (`gatelab_rectangles`), which GateLabR does not need. |
| `tree-cytobank.xml` | Cytobank format with the format mark: every population ANDs its ancestor chain, the tree is listed in the mark, fluorescence gates are under arcsinh. |
| `exclusion-standard.xml`, `exclusion-cytobank.xml` | A population that excludes one gate among several and one that is a single exclusion: a `gatelab_operand` NOT gate and a `gating:not` in the standard format, `gating:use-as-complement` in the Cytobank format. |
| `matrix-standard.xml`, `matrix-cytobank.xml` | Gates on channels compensated by a matrix that is not the file's own: a `spectrumMatrix` (`Spill_1`) and `Comp_` dimensions in the standard format; in the Cytobank format, FCS dimensions whose gates name the same matrix by its Cytobank id (`compensation_id` 1, the matrix's `cytobank_compensation_id`), as Cytobank writes them. |
| `slanted-standard.xml`, `slanted-cytobank.xml` | Polygons with slanted edges on logicle fluorescence and on arcsinh scatter, which are straight on those axes and curved in raw values, beside a polygon on logicle axes whose edges are all parallel to an axis and a polygon in raw values. |
| `ellipse-standard.xml`, `ellipse-cytobank.xml` | An ellipse on logicle fluorescence: an `EllipsoidGate` in the standard format, a polygon on arcsinh axes in the Cytobank format. |
| `repeated-standard.xml`, `repeated-cytobank.xml` | Populations that gate on a gate already in their parent's chain, each with children, so that in the Cytobank format each one's chain is its parent's. |
| `flowjo-standard.xml`, `flowjo-cytobank.xml` | Gates from a synthetic FlowJo workspace as GateLab holds them under FlowJo's rule: two polygons on FlowJo's gate grid, written as rectilinear rings in raw values out to the largest float32 with GateLab's mark (`gatelab_flowjo_grid`); continuous polygons past the bottom of a biex table and the floor of a log axis, written raw with skirt loops out to 1e15; rectangles whose bounds FlowJo's rule opened, written raw with the bound left out. Beside them, rectangles drawn in GateLab with edges at a biex table's ends and at the floor of its own log axis (raw, with the bound left out, and a range unbounded on both sides, written with `gating:min` at the largest negative double) and a polygon on that log axis, written under `flog`. |
| `timegain-standard.xml`, `timegain-cytobank.xml` | Gates on Time and on channels with a gain, over the events as a file with $TIMESTEP 0.01 and $PnG 0.5 on FL1-A and 2 on FL2-A: raw, arcsinh and polygon gates on Time, a half-open range drawn in GateLab on whole-number ticks, and raw and logicle gates on FL1-A and FL2-A. The standard format writes Time in seconds and scale values; the Cytobank format writes both as stored. |
| `flog-standard.xml`, `flog-cytobank.xml` | Gating-ML's own `flog` from another writer's file, as GateLab holds it after importing that file: a range open below, which holds the event at zero, a rectangle and a polygon. |
| `bounds-standard.xml` | A transformation's `boundMin` and `boundMax` from another writer's file, as GateLab holds them after importing it: a bounded logicle rectangle and polygon, written back with the bounds, and a bounded `flin` range GateLab holds on raw values. The Cytobank format cannot carry a bound, so there is no Cytobank-format file. |
| `*-0.8.3.xml` | The tree, exclusion and matrix strategies as GateLab 0.8.3 wrote them, before the format mark: a `GatingHierarchy`, logicle on flowCore's scale, `gating:complement`. |

GateLab 0.8.3's Cytobank-format tree and matrix files are not kept: 0.8.3 wrote gates drawn on a logicle axis at the wrong coordinates in that format, which later GateLab versions fix, so no reader can recover GateLab's populations from them. `exclusion-cytobank-0.8.3.xml` has the same fault but is kept, because the tests use it only for its `gating:complement` exclusions, which must be refused.

To regenerate, build the script against a GateLab checkout with its `node_modules` installed and run it from the root of this repository:

```sh
GL=/path/to/GateLab
"$GL/node_modules/.bin/esbuild" tools/gatingml-fixtures.ts --bundle --platform=node --format=esm \
  --packages=external --alias:@gatelab="$GL/src" --outfile="$GL/node_modules/.cache/gatingml-fixtures.mjs"
node "$GL/node_modules/.cache/gatingml-fixtures.mjs" tests/testthat/fixtures/gatingml          # current exporter
node "$GL/node_modules/.cache/gatingml-fixtures.mjs" tests/testthat/fixtures/gatingml -0.8.3   # from a 0.8.3 checkout
```

The second run writes six `-0.8.3` files, of which the two Cytobank-format ones above are not kept. The slanted, ellipse, repeated, flowjo, timegain, flog and bounds strategies are written by the first run only. The current files were written by a GateLab release candidate with format mark version 3.

## FlowKit's files

`flowkit-*.xml` are Gating-ML files from another writer: FlowKit's `export_gatingml`, written by `tools/gatingml-flowkit-fixtures.py` over the same flow events and over 600 synthetic mass cytometry events (`cytof-events.csv`, drawn by that script from a seeded generator, with generic isotope channel names). FlowKit evaluates each gate on the axes its dimensions declare, as Gating-ML 2.0 defines, and the script records the events it places in each population in `flowkit-membership.json` (1-based event indices keyed by the population's name path).

| File | What it carries |
|---|---|
| `flowkit-fasinh.xml` | Rectangles under an arcsinh with A = 1 (T 262144, M 4.5), on fluorescence and on scatter. |
| `flowkit-flin.xml` | A rectangle and a polygon with slanted edges under `flin` (T 262144, A 1000). |
| `flowkit-slanted.xml` | Polygons with slanted edges on logicle axes (Gating-ML's scale) and on arcsinh axes with A = 1. |
| `flowkit-boolean.xml` | The standard model: every gate is a population placed by `gating:parent_id`, including BooleanGates that AND gates with parents of their own, one nested in another, one at the root, and a gate at the root that no BooleanGate uses. |
| `flowkit-not-or.xml` | A `gating:not`, a `gating:or` and a `use-as-complement` reference. |
| `flowkit-cytof.xml` | Gates on mass cytometry channels in raw values (no transformation), under arcsinh(x / 5), under an arcsinh of another cofactor, and on Time. |
| `flowkit-raw-channels.xml`, `flowkit-raw-channels-cytof.xml` | Gates on Time and Event_length, which GateLabR keeps in raw values, under `flin`, arcsinh (A other than 0) and logicle: rectangles, and polygons with slanted edges against a fluorescence or mass channel. |
| `flowkit-far-vertex-cytof.xml`, `flowkit-far-vertex.xml` | Polygons far larger than the data: thin wedges in raw values out to a vertex at 1e7 on mass cytometry channels, and a logicle polygon reaching past the top of scale on flow data. |

To regenerate, run from the root of this repository with a Python that has FlowKit (FlowKit 1.3.1 wrote these):

```sh
python tools/gatingml-flowkit-fixtures.py tests/testthat/fixtures/gatingml
```
