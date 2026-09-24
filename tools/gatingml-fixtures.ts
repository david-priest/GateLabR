/**
 * Write the synthetic Gating-ML fixtures under tests/testthat/fixtures/gatingml/ with GateLab's own
 * exporter, together with the events and the events each population selects in GateLab, so the R
 * tests can check that GateLabR's importer reads GateLab's files to the same events.
 *
 * Everything here is synthetic: generic detector names, no markers, made-up population names and
 * events drawn from a seeded generator. The strategies are fixed, so a run against the same
 * GateLab checkout rewrites the same files.
 *
 * Build it against the GateLab checkout whose exporter is to be tested, then run it:
 *
 *   GL=<path to a GateLab checkout with node_modules installed>
 *   "$GL/node_modules/.bin/esbuild" tools/gatingml-fixtures.ts --bundle --platform=node --format=esm \
 *     --packages=external --alias:@gatelab="$GL/src" --outfile="$GL/node_modules/.cache/gatingml-fixtures.mjs"
 *   node "$GL/node_modules/.cache/gatingml-fixtures.mjs" tests/testthat/fixtures/gatingml [suffix]
 *
 * The optional suffix is added to each file name except events.csv (e.g. "-0.8.3" for files from a
 * GateLab that predates the format mark). The events are the same on every run; the memberships
 * are GateLab's own for the gates as that version draws them, so they are written per suffix.
 */
import { JSDOM } from "jsdom";
import { randomUUID } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FcsFile } from "@gatelab/engine/fcs";
import { Sample } from "@gatelab/engine/sample";
import { exportGatingML, type GatingMLFormat } from "@gatelab/engine/gatingmlExport";
import { applyGatingStrategy } from "@gatelab/engine/populations";
import {
  linkChildToParent,
  newGate,
  newGateRef,
  newPopulation,
  newRootPopulation,
  type Gate,
  type PopulationMap,
  type Vertex,
} from "@gatelab/engine/models";

const dom = new JSDOM("");
for (const k of ["DOMParser", "XMLSerializer", "Node", "document"] as const) {
  (globalThis as never as Record<string, unknown>)[k] = (dom.window as never as Record<string, unknown>)[k];
}

const [outDir, suffix = ""] = process.argv.slice(2);
if (!outDir) throw new Error("usage: gatingml-fixtures.mjs <out-dir> [suffix]");

// ---------------------------------------------------------------------------
// Synthetic events
// ---------------------------------------------------------------------------

const N_EVENTS = 600;
const CHANNELS = ["FSC-A", "SSC-A", "FL1-A", "FL2-A", "FL3-A", "Time"];

/** mulberry32: a small seeded generator, so the events never change between runs. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeEvents(): number[][] {
  const r = rng(20260924);
  const normal = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r());
  // A fluorescence value: a negative population around zero, or a positive one spread over
  // two decades, so the logicle axis's linear and log regions are both populated.
  const fluor = () => (r() < 0.5 ? 400 * normal() : Math.pow(10, 2.8 + 2 * r()));
  const cols: number[][] = CHANNELS.map(() => []);
  for (let i = 0; i < N_EVENTS; i++) {
    const cell = r() < 0.7;
    const values = [
      cell ? 40_000 + 150_000 * r() : 3_000 + 20_000 * r(),
      cell ? 30_000 + 130_000 * r() : 2_000 + 15_000 * r(),
      fluor(),
      fluor(),
      fluor(),
      i,
    ];
    // Whole numbers are exact in the float32 columns GateLab keeps and in R's doubles alike.
    values.forEach((v, j) => cols[j].push(Math.round(v)));
  }
  return cols;
}

const EVENTS = makeEvents();

/** Own $SPILLOVER of the synthetic file, in FCS orientation (row = source, column = detector). */
const FCS_SPILLOVER = {
  channels: ["FL1-A", "FL2-A", "FL3-A"],
  matrix: [
    [1, 0.12, 0.02],
    [0.04, 1, 0.09],
    [0, 0.05, 1],
  ],
};

/** A matrix from outside the file, as a FlowJo workspace or a later single-stain run brings. */
const EXTERNAL_SPILLOVER = {
  channels: ["FL1-A", "FL2-A", "FL3-A"],
  matrix: [
    [1, 0.2, 0.05],
    [0.08, 1, 0.15],
    [0.01, 0.1, 1],
  ],
};

function sample(withSpillover: boolean): Sample {
  const fcs: FcsFile = {
    version: "FCS3.1",
    nEvents: N_EVENTS,
    instrument: "flow",
    keywords: { $FIL: "synthetic.fcs" },
    spillover: withSpillover ? FCS_SPILLOVER : null,
    channels: CHANNELS.map((name, index) => ({ index, name, marker: null, bits: 32, range: 262144 })),
    columns: EVENTS.map((col) => Float32Array.from(col)),
  };
  return new Sample(fcs);
}

// ---------------------------------------------------------------------------
// Strategies
// ---------------------------------------------------------------------------

type Tree = { gates: Record<string, Gate>; gate_order: string[]; populations: PopulationMap; root_population_id: string };

const rect = (x0: number, y0: number, x1: number, y1: number): Vertex[] => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

/** A gate drawn on the sample's current display axes: its vertices are in display units. */
function displayGate(s: Sample, gate: Gate): Gate {
  const g = gate as Gate & { space?: string; transforms?: unknown };
  g.space = "display";
  g.transforms = s.gateTransformSnapshot(gate.x_channel, gate.y_channel);
  return gate;
}

/**
 * The gates every strategy draws from. Cells, FL1_gate, FL3_gate and L_gate are drawn on the
 * display axes (arcsinh for scatter, logicle on GateLab's [0, 1] for fluorescence), so the file
 * declares their transforms; Poly_gate stays in raw space and is written raw. L_gate's edges are
 * all parallel to an axis, so it is the same gate whether its edges are straight in logicle or in
 * raw values; a slanted edge is not (GateLabR joins inverted vertices with straight raw edges).
 */
function gateSet(s: Sample) {
  const cf = (ch: string) => {
    const spec = s.transformSpec(ch);
    if (spec.kind !== "asinh") throw new Error(`${ch} is not on an arcsinh axis`);
    return spec.cofactor;
  };
  for (const ch of ["FL1-A", "FL2-A", "FL3-A"]) {
    if (s.transformSpec(ch).kind !== "logicle") throw new Error(`${ch} is not on a logicle axis`);
  }
  const a = (v: number, ch: string) => Math.asinh(v / cf(ch));
  return {
    cells: displayGate(s, newGate("Cells_gate", "rectangle", "FSC-A", "SSC-A",
      rect(a(30_000, "FSC-A"), a(20_000, "SSC-A"), a(200_000, "FSC-A"), a(170_000, "SSC-A")))),
    fl1: displayGate(s, newGate("FL1_gate", "rectangle", "FL1-A", "FL2-A", rect(0.55, 0.05, 0.98, 0.98))),
    // A range: one channel on both axes, which the standard format writes as one dimension.
    fl3: displayGate(s, newGate("FL3_gate", "rectangle", "FL3-A", "FL3-A", rect(0.55, 0.55, 0.98, 0.98))),
    poly: newGate("Poly_gate", "polygon", "FL1-A", "FL2-A", [[1_000, -2_000], [60_000, -2_000], [60_000, 3_000], [1_000, 40_000]]),
    lshape: displayGate(s, newGate("L_gate", "polygon", "FL2-A", "FL3-A",
      [[0.3, 0.3], [0.9, 0.3], [0.9, 0.5], [0.6, 0.5], [0.6, 0.9], [0.3, 0.9]])),
  };
}

/**
 * Gates whose edges are straight on the axes they were drawn on and curved in raw values: polygons
 * with slanted edges on logicle fluorescence and on arcsinh scatter, and an ellipse on logicle
 * fluorescence, which the Cytobank format writes as a polygon on arcsinh axes. GateLab evaluates
 * them in the space they were drawn in. They are kept out of gateSet so that the other strategies'
 * files do not change.
 */
function curvedGates(s: Sample) {
  const cf = (ch: string) => {
    const spec = s.transformSpec(ch);
    if (spec.kind !== "asinh") throw new Error(`${ch} is not on an arcsinh axis`);
    return spec.cofactor;
  };
  const a = (v: number, ch: string) => Math.asinh(v / cf(ch));
  const ellipse = {
    gate_id: randomUUID(),
    name: "Ellipse_gate",
    gate_type: "ellipse",
    x_channel: "FL1-A",
    y_channel: "FL2-A",
    mean: [0.75, 0.7],
    covariance: [[0.03, 0.012], [0.012, 0.03]],
    distance_square: 1,
    color: "#e41a1c",
    label_offset: null,
  } as unknown as Gate;
  return {
    slantFluor: displayGate(s, newGate("Slant_FL_gate", "polygon", "FL1-A", "FL2-A",
      [[0.35, 0.25], [0.8, 0.15], [0.95, 0.7], [0.45, 0.9]])),
    slantScatter: displayGate(s, newGate("Slant_scatter_gate", "polygon", "FSC-A", "SSC-A", [
      [a(35_000, "FSC-A"), a(45_000, "SSC-A")],
      [a(140_000, "FSC-A"), a(25_000, "SSC-A")],
      [a(195_000, "FSC-A"), a(140_000, "SSC-A")],
      [a(70_000, "FSC-A"), a(165_000, "SSC-A")],
    ])),
    ellipse: displayGate(s, ellipse),
  };
}

function build(
  gates: Record<string, Gate>,
  spec: { name: string; parent: string | null; refs: [string, boolean][] }[],
): Tree {
  const root = newRootPopulation();
  let populations: PopulationMap = { [root.population_id]: root };
  const ids: Record<string, string> = {};
  for (const p of spec) {
    const parent = p.parent ? ids[p.parent] : root.population_id;
    const pop = newPopulation(p.name, p.refs.map(([g, include]) => newGateRef(gates[g].gate_id, include)), parent);
    populations[pop.population_id] = pop;
    populations = linkChildToParent(populations, pop.population_id, parent);
    ids[p.name] = pop.population_id;
  }
  const byId = Object.fromEntries(Object.values(gates).map((g) => [g.gate_id, g]));
  return { gates: byId, gate_order: Object.keys(byId), populations, root_population_id: root.population_id };
}

/**
 * Positive AND populations only. The sibling order under Cells is deliberately not alphabetical,
 * and Both_positive, whose Cytobank chain contains FL1_positive's, sits under Cells: a reader
 * that infers parents from the chains puts it under FL1_positive instead.
 */
function treeStrategy(s: Sample): Tree {
  const g = gateSet(s);
  return build(g, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "FL3_positive", parent: "Cells", refs: [["fl3", true]] },
    { name: "L_subset", parent: "FL3_positive", refs: [["lshape", true]] },
    { name: "FL1_positive", parent: "Cells", refs: [["fl1", true]] },
    { name: "Poly_subset", parent: "FL1_positive", refs: [["poly", true]] },
    { name: "Both_positive", parent: "Cells", refs: [["fl1", true], ["fl3", true]] },
  ]);
}

/** One population excludes a gate among several references, another is a single exclusion. */
function exclusionStrategy(s: Sample): Tree {
  const g = gateSet(s);
  return build(g, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "FL1_not_FL3", parent: "Cells", refs: [["fl1", true], ["fl3", false]] },
    { name: "FL1_negative", parent: "Cells", refs: [["fl1", false]] },
  ]);
}

/**
 * Polygons with slanted edges on transformed axes, under Cells on logicle fluorescence and at the
 * top level on arcsinh scatter. L_subset's polygon has only edges parallel to an axis and
 * Poly_subset's is in raw values, so each is the same gate in raw values as on its axes.
 */
function slantedStrategy(s: Sample): Tree {
  const g = { ...gateSet(s), ...curvedGates(s) };
  return build({ cells: g.cells, slantFluor: g.slantFluor, lshape: g.lshape, poly: g.poly, slantScatter: g.slantScatter }, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "Slant_FL", parent: "Cells", refs: [["slantFluor", true]] },
    { name: "L_subset", parent: "Cells", refs: [["lshape", true]] },
    { name: "Poly_subset", parent: "Cells", refs: [["poly", true]] },
    { name: "Slant_scatter", parent: null, refs: [["slantScatter", true]] },
  ]);
}

/** An ellipse on logicle fluorescence beside a rectangle. */
function ellipseStrategy(s: Sample): Tree {
  const g = { ...gateSet(s), ...curvedGates(s) };
  return build({ cells: g.cells, ellipse: g.ellipse, fl1: g.fl1 }, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "Ellipse_pop", parent: "Cells", refs: [["ellipse", true]] },
    { name: "FL1_positive", parent: "Cells", refs: [["fl1", true]] },
  ]);
}

/**
 * Populations that gate on a gate already in their parent's chain: Cells_again repeats Cells's
 * gate and FL1_again repeats FL1_positive's, and each has children. In the Cytobank format each
 * one's chain is its parent's.
 */
function repeatedStrategy(s: Sample): Tree {
  const g = gateSet(s);
  return build({ cells: g.cells, fl1: g.fl1, lshape: g.lshape, fl3: g.fl3 }, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "Cells_again", parent: "Cells", refs: [["cells", true]] },
    { name: "FL1_positive", parent: "Cells_again", refs: [["fl1", true]] },
    { name: "FL1_again", parent: "FL1_positive", refs: [["fl1", true]] },
    { name: "L_subset", parent: "FL1_again", refs: [["lshape", true]] },
    { name: "FL3_positive", parent: "Cells", refs: [["fl3", true]] },
  ]);
}

/** Positive populations on channels compensated by a matrix that is not the file's own. */
function matrixStrategy(s: Sample): Tree {
  const g = gateSet(s);
  return build(g, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "FL1_positive", parent: "Cells", refs: [["fl1", true]] },
    { name: "FL3_positive", parent: "Cells", refs: [["fl3", true]] },
  ]);
}

// ---------------------------------------------------------------------------
// Export, and the events GateLab puts in each population
// ---------------------------------------------------------------------------

/** 1-based event indices of each population, keyed by its name path from the root. */
function membership(s: Sample, t: Tree): Record<string, number[]> {
  const { masks } = applyGatingStrategy(t.gates, t.populations, t.root_population_id, s.gateAssayData());
  const out: Record<string, number[]> = {};
  const walk = (id: string, path: string) => {
    for (const c of t.populations[id].children) {
      const p = `${path}/${t.populations[c].name}`;
      const m = masks[c] as Uint8Array;
      out[p] = [];
      for (let i = 0; i < m.length; i++) if (m[i]) out[p].push(i + 1);
      walk(c, p);
    }
  };
  walk(t.root_population_id, "");
  return out;
}

const TIMESTAMP = "2026-01-01T00:00:00";
mkdirSync(outDir, { recursive: true });
const memberships: Record<string, Record<string, number[]>> = {};

// currentOnly: strategies the tests read only as the current exporter writes them, which a run with
// a suffix does not write.
const fixtures: {
  stem: string;
  tree: (s: Sample) => Tree;
  setup: (s: Sample) => void;
  withSpillover: boolean;
  currentOnly?: boolean;
}[] = [
  { stem: "tree", tree: treeStrategy, setup: () => {}, withSpillover: false },
  { stem: "exclusion", tree: exclusionStrategy, setup: () => {}, withSpillover: false },
  {
    stem: "matrix",
    tree: matrixStrategy,
    setup: (s) => {
      s.installExternalSpillover(EXTERNAL_SPILLOVER, "Synthetic external matrix", { replaceEmbedded: true });
      s.setCompensation(true);
    },
    withSpillover: true,
  },
  { stem: "slanted", tree: slantedStrategy, setup: () => {}, withSpillover: false, currentOnly: true },
  { stem: "ellipse", tree: ellipseStrategy, setup: () => {}, withSpillover: false, currentOnly: true },
  { stem: "repeated", tree: repeatedStrategy, setup: () => {}, withSpillover: false, currentOnly: true },
];

for (const f of fixtures) {
  if (suffix && f.currentOnly) continue;
  const s = sample(f.withSpillover);
  f.setup(s);
  const t = f.tree(s);
  memberships[f.stem] = membership(s, t);
  for (const format of ["standard", "cytobank"] as GatingMLFormat[]) {
    const xml = exportGatingML({ ...t, sample: s, format, timestamp: TIMESTAMP });
    const out = join(outDir, `${f.stem}-${format}${suffix}.xml`);
    writeFileSync(out, xml);
    console.log(`wrote ${out}`);
  }
}

const header = CHANNELS.join(",");
const rows = Array.from({ length: N_EVENTS }, (_, i) => EVENTS.map((col) => col[i]).join(","));
writeFileSync(join(outDir, "events.csv"), [header, ...rows].join("\n") + "\n");
writeFileSync(
  join(outDir, `membership${suffix}.json`),
  JSON.stringify({
    fcs_spillover: FCS_SPILLOVER,
    external_spillover: EXTERNAL_SPILLOVER,
    populations: memberships,
  }) + "\n",
);
console.log(`wrote ${join(outDir, "events.csv")} and membership${suffix}.json`);
