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
import { Sample, transformFromSpec } from "@gatelab/engine/sample";
import { exportGatingML, type GatingMLFormat } from "@gatelab/engine/gatingmlExport";
import { importGatingML } from "@gatelab/engine/gatingml";
import { flowJoWorkspaceToGatingML } from "@gatelab/engine/flowjoWorkspace";
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

/** $TIMESTEP and $PnG of the synthetic file where a strategy needs them (see timeGainStrategy). */
const TIMESTEP = "0.01";
const GAINS: Record<string, number> = { "FL1-A": 0.5, "FL2-A": 2 };

function sample(withSpillover: boolean, withTimestepAndGains = false): Sample {
  const fcs: FcsFile = {
    version: "FCS3.1",
    nEvents: N_EVENTS,
    instrument: "flow",
    keywords: withTimestepAndGains ? { $FIL: "synthetic.fcs", $TIMESTEP: TIMESTEP } : { $FIL: "synthetic.fcs" },
    spillover: withSpillover ? FCS_SPILLOVER : null,
    channels: CHANNELS.map((name, index) => ({
      index, name, marker: null, bits: 32, range: 262144,
      ...(withTimestepAndGains && GAINS[name] !== undefined ? { gain: GAINS[name] } : {}),
    })),
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

/**
 * Gates as GateLab holds them after importing a FlowJo workspace with FlowJo's rule (its default):
 * polygons on FlowJo's gate grid, which Gating-ML carries as the union of their cells (a
 * rectilinear ring in raw values out to the largest float32, with GateLab's mark); continuous
 * polygons on a biex and a log axis that reach past the biex table's bottom and the log axis's
 * floor, which Gating-ML carries in raw values with skirt loops out to 1e15; and rectangles, which
 * FlowJo compares in raw values, with a bound its rule opened at a clamp left out. Beside them,
 * gates drawn in GateLab on those axes: rectangles with edges at a biex table's ends, written raw
 * with the bound left out, one of them unbounded on both sides, and on GateLab's own log axis a
 * rectangle reaching its floor (written raw) and a polygon away from it (written under flog).
 */
function flowJoStrategy(s: Sample): Tree {
  const T = "http://www.isac-net.org/std/Gating-ML/v2.0/transformations";
  const D = "http://www.isac-net.org/std/Gating-ML/v2.0/datatypes";
  const G = "http://www.isac-net.org/std/Gating-ML/v2.0/gating";
  const p = (ch: string) => `<data-type:parameter data-type:name="${ch}"/>`;
  const dim = (ch: string, min?: number, max?: number) =>
    `<gating:dimension${min === undefined ? "" : ` gating:min="${min}"`}${max === undefined ? "" : ` gating:max="${max}"`}>` +
    `<data-type:fcs-dimension data-type:name="${ch}"/></gating:dimension>`;
  const polygon = (id: string, x: string, y: string, vertices: [number, number][], grid: boolean) =>
    `<gating:PolygonGate eventsInside="1" quadId="-1"${grid ? ' gateResolution="256"' : ""} gating:id="${id}">` +
    dim(x) + dim(y) +
    vertices.map(([a, b]) => `<gating:vertex><gating:coordinate data-type:value="${a}"/><gating:coordinate data-type:value="${b}"/></gating:vertex>`).join("") +
    "</gating:PolygonGate>";
  const rectangle = (id: string, dims: string[]) =>
    `<gating:RectangleGate eventsInside="1" percentX="0" percentY="0" gating:id="${id}">${dims.join("")}</gating:RectangleGate>`;
  const population = (name: string, gate: string, children = "") =>
    `<Population name="${name}" count="1"><Gate>${gate}</Gate>${children ? `<Subpopulations>${children}</Subpopulations>` : ""}</Population>`;
  const biexAxis = (ch: string) =>
    `<transforms:biex transforms:length="256" transforms:maxRange="262144" transforms:neg="0" transforms:width="-10" transforms:pos="4.41854">${p(ch)}</transforms:biex>`;
  const wsp = `<Workspace xmlns:transforms="${T}" xmlns:data-type="${D}" xmlns:gating="${G}"><SampleList><Sample>
  <DataSet uri="file:synthetic.fcs"/>
  <Transformations>
    <transforms:linear transforms:minRange="0" transforms:maxRange="262144" transforms:gain="1">${p("FSC-A")}</transforms:linear>
    <transforms:linear transforms:minRange="0" transforms:maxRange="262144" transforms:gain="1">${p("SSC-A")}</transforms:linear>
    ${biexAxis("FL1-A")}
    <transforms:log transforms:offset="1" transforms:decades="5">${p("FL2-A")}</transforms:log>
    ${biexAxis("FL3-A")}
  </Transformations>
  <SampleNode name="synthetic.fcs" count="${N_EVENTS}"><Subpopulations>
    ${population("Grid_cells", polygon("g1", "FSC-A", "FL1-A", [[30000, -500], [180000, -300], [170000, 40000], [40000, 20000]], true),
      population("Biex_poly", polygon("g2", "FL1-A", "FL3-A", [[-5000, -5000], [2500, -5000], [2500, 400], [600, 3000], [-5000, 3000]], false)) +
      population("Biex_low_rect", rectangle("g3", [dim("FL1-A", -1e6, 2000), dim("FL3-A", 1000, 1e6)])))}
    ${population("Biex_all_range", rectangle("g4", [dim("FL3-A", -1e7, 1e7)]))}
    ${population("Log_floor_rect", rectangle("g5", [dim("FL2-A", 0.1, 5000), dim("SSC-A", 10000, 150000)]),
      population("Log_floor_poly", polygon("g6", "FL2-A", "SSC-A", [[0.01, 20000], [20000, 30000], [30000, 140000], [0.01, 120000]], false)))}
    ${population("Log_rect", rectangle("g7", [dim("FL2-A", 100, 20000), dim("FSC-A", 20000, 200000)]))}
    ${population("Log_grid", polygon("g8", "FL2-A", "FL3-A", [[0.5, -800], [30000, -200], [50000, 50000], [3, 30000]], true))}
  </Subpopulations></SampleNode></Sample></SampleList></Workspace>`;
  const conv = flowJoWorkspaceToGatingML(wsp, 0, null, undefined, { flowJoGrid: true });
  const res = importGatingML(conv.gatingMl, s.channels.map((c) => c.key), {}, "flow");
  if (conv.gridPolygons !== 2) throw new Error(`expected 2 grid polygons, got ${conv.gridPolygons}`);

  // Rectangles drawn in GateLab on FlowJo's biex axis (as the continuous biex polygon holds it)
  // and on GateLab's own log axis, with edges at the clamps: FlowJo's rule does not apply to them,
  // so an edge at a biex table's end or at the log floor is written raw with that bound left out,
  // and a range over both ends of the table is unbounded on both sides.
  const biexPoly = Object.values(res.gates).find((g) => g.name === "Biex_poly") as Gate & { transforms?: Record<string, never> };
  const biexSpec = biexPoly.transforms!["FL3-A"];
  const biex = transformFromSpec(biexSpec);
  const [bottom, top] = [biex.forward(-Number.MAX_VALUE), biex.forward(Number.MAX_VALUE)];
  const onAxes = (gate: Gate, transforms: Record<string, unknown>): Gate =>
    Object.assign(gate, { space: "display", transforms }) as Gate;
  const flogSpec = { kind: "flog", T: 262144, M: 5 };
  const flog = transformFromSpec(flogSpec as never);
  const extra: Record<string, Gate> = {
    span: onAxes(newGate("Biex_span_gate", "rectangle", "FL3-A", "FL3-A", rect(bottom, bottom, top, top)),
      { "FL3-A": biexSpec }),
    floor: onAxes(newGate("Biex_floor_gate", "rectangle", "FL1-A", "FL3-A",
      rect(bottom, biex.forward(500), biex.forward(3000), biex.forward(60000))), { "FL1-A": biexSpec, "FL3-A": biexSpec }),
    logFloor: onAxes(newGate("Log_floor_gate", "rectangle", "FL2-A", "FL2-A", rect(0, 0, flog.forward(4000), flog.forward(4000))),
      { "FL2-A": flogSpec }),
    logPoly: onAxes(newGate("Log_poly_gate", "polygon", "FL1-A", "FL2-A",
      [[0.45, 0.4], [0.9, 0.5], [0.8, 0.95], [0.5, 0.75]]), { "FL1-A": flogSpec, "FL2-A": flogSpec }),
  };
  let populations = res.populations;
  const gates = { ...res.gates };
  const order = [...res.gate_order];
  for (const [name, gate] of [["Biex_span", extra.span], ["Biex_floor", extra.floor], ["Log_floor", extra.logFloor], ["Log_poly", extra.logPoly]] as const) {
    gates[gate.gate_id] = gate;
    order.push(gate.gate_id);
    const pop = newPopulation(name, [newGateRef(gate.gate_id, true)], res.root_population_id);
    populations = linkChildToParent({ ...populations, [pop.population_id]: pop }, pop.population_id, res.root_population_id);
  }
  return { gates, gate_order: order, populations, root_population_id: res.root_population_id };
}

/**
 * Gates on Time and on channels with a gain, over a file with $TIMESTEP 0.01 and $PnG 0.5 on FL1-A
 * and 2 on FL2-A. The standard format writes Time in seconds and every other coordinate as a
 * Gating-ML scale value, stored value / $PnG; the Cytobank format writes both as stored. Time_early
 * is half-open, the rule of a rectangle drawn in GateLab, on whole-number ticks, so an event lies
 * on each of its edges; Time_late is closed and shares an edge with it.
 */
function timeGainStrategy(s: Sample): Tree {
  const g = gateSet(s);
  const halfOpen = (gate: Gate): Gate => Object.assign(gate, { bounds: "half-open" }) as Gate;
  const cf = 50;
  const timeAsinh = newGate("Time_asinh_gate", "rectangle", "Time", "Time",
    rect(Math.asinh(150 / cf), Math.asinh(150 / cf), Math.asinh(500 / cf), Math.asinh(500 / cf)));
  Object.assign(timeAsinh, { space: "display", transforms: { Time: { kind: "asinh", cofactor: cf } } });
  const gates = {
    cells: g.cells,
    early: halfOpen(newGate("Time_early_gate", "rectangle", "Time", "Time", rect(100, 100, 300, 300))),
    late: newGate("Time_late_gate", "rectangle", "Time", "Time", rect(300, 300, 450, 450)),
    timeFl2: newGate("Time_FL2_gate", "polygon", "Time", "FL2-A", [[50, -2000], [550, -2000], [550, 30000], [50, 5000]]),
    fl2Logicle: displayGate(s, newGate("FL2_logicle_gate", "rectangle", "FL2-A", "FL1-A", rect(0.5, 0.1, 0.95, 0.9))),
    fl1Raw: halfOpen(newGate("FL1_raw_gate", "rectangle", "FL1-A", "FL2-A", rect(1000, -1000, 50000, 60000))),
    timeAsinh,
  };
  return build(gates, [
    { name: "Cells", parent: null, refs: [["cells", true]] },
    { name: "Early", parent: "Cells", refs: [["early", true]] },
    { name: "Early_FL2", parent: "Early", refs: [["fl2Logicle", true]] },
    { name: "Late", parent: "Cells", refs: [["late", true]] },
    { name: "Time_FL2", parent: "Cells", refs: [["timeFl2", true]] },
    { name: "FL1_raw", parent: null, refs: [["fl1Raw", true]] },
    { name: "Time_asinh", parent: null, refs: [["timeAsinh", true]] },
  ]);
}

/** A strategy from another writer's file, as GateLab holds it after importing that file. */
function fromThirdParty(s: Sample, body: string): Tree {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
${body}
</gating:Gating-ML>`;
  const res = importGatingML(xml, s.channels.map((c) => c.key), {}, "flow");
  if (res.warnings.length) throw new Error(`third-party import warned: ${res.warnings.join(" | ")}`);
  return { gates: res.gates, gate_order: res.gate_order, populations: res.populations, root_population_id: res.root_population_id };
}

const tpDim = (ch: string, tr: string | null, min?: number, max?: number) =>
  `    <gating:dimension gating:compensation-ref="uncompensated"${tr ? ` gating:transformation-ref="${tr}"` : ""}` +
  `${min === undefined ? "" : ` gating:min="${min}"`}${max === undefined ? "" : ` gating:max="${max}"`}>` +
  `<data-type:fcs-dimension data-type:name="${ch}"/></gating:dimension>`;
const tpPolygon = (id: string, dims: string[], vertices: [number, number][]) =>
  `  <gating:PolygonGate gating:id="${id}">\n${dims.join("\n")}\n` +
  vertices.map(([a, b]) => `    <gating:vertex><gating:coordinate data-type:value="${a}"/><gating:coordinate data-type:value="${b}"/></gating:vertex>`).join("\n") +
  "\n  </gating:PolygonGate>";
const tpRectangle = (id: string, dims: string[], parent?: string) =>
  `  <gating:RectangleGate gating:id="${id}"${parent ? ` gating:parent_id="${parent}"` : ""}>\n${dims.join("\n")}\n  </gating:RectangleGate>`;

/**
 * Gating-ML's own flog from another writer, which GateLab holds as that flog: a range with no lower
 * bound, which holds an event at zero (flog is -Inf there, and an absent bound is not tested) and
 * none below it, a rectangle, and a polygon with slanted edges on flog axes.
 */
function flogStrategy(s: Sample): Tree {
  return fromThirdParty(s, [
    '  <transforms:transformation transforms:id="Log5"><transforms:flog transforms:T="262144" transforms:M="5"/></transforms:transformation>',
    tpRectangle("FL1_log_open", [tpDim("FL1-A", "Log5", undefined, 0.7)]),
    tpRectangle("FL_log_box", [tpDim("FL1-A", "Log5", 0.4, 0.9), tpDim("FL2-A", "Log5", 0.3, 0.95)]),
    tpPolygon("FL_log_poly", [tpDim("FL1-A", "Log5"), tpDim("FL3-A", "Log5")],
      [[0.45, 0.35], [0.9, 0.5], [0.85, 0.95], [0.5, 0.8]]),
  ].join("\n"));
}

/**
 * A transformation's boundMin and boundMax, from another writer: values beyond a bound are held
 * at it before the gate is tested. GateLab keeps them on a logicle gate and writes them back as
 * the transformation's; a bounded flin rectangle it holds on raw values with the bound applied.
 * The Cytobank format cannot carry a bound, so this strategy is written in the standard format
 * only.
 */
function boundsStrategy(s: Sample): Tree {
  return fromThirdParty(s, [
    '  <transforms:transformation transforms:id="LgB" transforms:boundMin="0.1" transforms:boundMax="0.9">' +
      '<transforms:logicle transforms:T="262144" transforms:W="0.5" transforms:M="4.5" transforms:A="0"/></transforms:transformation>',
    '  <transforms:transformation transforms:id="LinB" transforms:boundMax="0.1">' +
      '<transforms:flin transforms:T="262144" transforms:A="0"/></transforms:transformation>',
    tpRectangle("Bounded_rect", [tpDim("FL1-A", "LgB", 0.05, 0.6), tpDim("FL2-A", "LgB", 0.5, 1)]),
    tpPolygon("Bounded_poly", [tpDim("FL1-A", "LgB"), tpDim("FL3-A", "LgB")],
      [[0.3, 0.2], [0.85, 0.4], [0.8, 0.85], [0.35, 0.7]]),
    tpRectangle("Lin_bounded", [tpDim("FL3-A", "LinB", 0.005, 0.5)]),
  ].join("\n"));
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
  withTimestepAndGains?: boolean;
  formats?: GatingMLFormat[];
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
  { stem: "flowjo", tree: flowJoStrategy, setup: () => {}, withSpillover: false, currentOnly: true },
  { stem: "timegain", tree: timeGainStrategy, setup: () => {}, withSpillover: false, currentOnly: true, withTimestepAndGains: true },
  { stem: "flog", tree: flogStrategy, setup: () => {}, withSpillover: false, currentOnly: true },
  { stem: "bounds", tree: boundsStrategy, setup: () => {}, withSpillover: false, currentOnly: true, formats: ["standard"] },
];

for (const f of fixtures) {
  if (suffix && f.currentOnly) continue;
  const s = sample(f.withSpillover, f.withTimestepAndGains);
  f.setup(s);
  const t = f.tree(s);
  memberships[f.stem] = membership(s, t);
  for (const format of f.formats ?? (["standard", "cytobank"] as GatingMLFormat[])) {
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
    ...(suffix ? {} : { timestep: Number(TIMESTEP), gains: GAINS }),
    populations: memberships,
  }) + "\n",
);
console.log(`wrote ${join(outDir, "events.csv")} and membership${suffix}.json`);
