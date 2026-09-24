# Gating-ML fixtures

Everything here is synthetic: generic detector names (FSC-A, SSC-A, FL1-A, FL2-A, FL3-A, Time), no markers, made-up population names, and 600 events drawn from a seeded generator. `test-gatingml-import-format.R` uses them.

The XML files are GateLab's own exports of three strategies over those events, written by `tools/gatingml-fixtures.ts` from GateLab's exporter. The same script records which events GateLab places in each population (`membership*.json`, 1-based event indices keyed by the population's name path), so the tests can check that GateLabR's importer selects the same events.

| File | What it carries |
|---|---|
| `events.csv` | The events, one column per channel. |
| `membership.json`, `membership-0.8.3.json` | GateLab's populations for each strategy, and the two spillover matrices (the file's own and an external one). |
| `tree-standard.xml` | Standard format with the format mark (version 2): populations placed by `gating:parent_id`, logicle on Gating-ML's [0, 1] scale, a one-dimensional range gate. |
| `tree-cytobank.xml` | Cytobank format with the format mark: every population ANDs its ancestor chain, the tree is listed in the mark, fluorescence gates are under arcsinh. |
| `exclusion-standard.xml`, `exclusion-cytobank.xml` | A population that excludes one gate among several and one that is a single exclusion: a `gatelab_operand` NOT gate and a `gating:not` in the standard format, `gating:use-as-complement` in the Cytobank format. |
| `matrix-standard.xml`, `matrix-cytobank.xml` | Gates on channels compensated by a matrix that is not the file's own: a `spectrumMatrix` (`Spill_1`) and `Comp_` dimensions in the standard format; the same matrix unreferenced, with FCS dimensions and GateLab's compensation record, in the Cytobank format. |
| `*-0.8.3.xml` | The same strategies as GateLab 0.8.3 wrote them, before the format mark: a `GatingHierarchy`, logicle on flowCore's scale, `gating:complement`. |

GateLab 0.8.3's Cytobank-format tree and matrix files are not kept: 0.8.3 wrote gates drawn on a logicle axis at the wrong coordinates in that format, which later GateLab versions fix, so no reader can recover GateLab's populations from them. `exclusion-cytobank-0.8.3.xml` has the same fault but is kept, because the tests use it only for its `gating:complement` exclusions, which must be refused.

To regenerate, build the script against a GateLab checkout with its `node_modules` installed and run it from the root of this repository:

```sh
GL=/path/to/GateLab
"$GL/node_modules/.bin/esbuild" tools/gatingml-fixtures.ts --bundle --platform=node --format=esm \
  --packages=external --alias:@gatelab="$GL/src" --outfile="$GL/node_modules/.cache/gatingml-fixtures.mjs"
node "$GL/node_modules/.cache/gatingml-fixtures.mjs" tests/testthat/fixtures/gatingml          # current exporter
node "$GL/node_modules/.cache/gatingml-fixtures.mjs" tests/testthat/fixtures/gatingml -0.8.3   # from a 0.8.3 checkout
```

The second run writes six `-0.8.3` files, of which the two Cytobank-format ones above are then removed.
