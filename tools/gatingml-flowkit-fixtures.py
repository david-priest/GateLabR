"""
Write the FlowKit-written Gating-ML fixtures under tests/testthat/fixtures/gatingml/, with the events
FlowKit places in each population, so the R tests can check that GateLabR's importer reads Gating-ML
from another writer to the same events.

Everything here is synthetic: the flow events are events.csv (written by gatingml-fixtures.ts), the
CyTOF events are drawn here from a seeded generator, the channel names are generic and the gate names
are made up. FlowKit evaluates each gate on the axes its dimensions declare, as Gating-ML 2.0 defines,
so its populations are the reference.

Run from the root of this repository with a Python that has FlowKit (tested with FlowKit 1.3.1):

    python tools/gatingml-flowkit-fixtures.py tests/testthat/fixtures/gatingml
"""
import json
import sys
import warnings
from pathlib import Path

import flowkit as fk
import numpy as np
import pandas as pd
from flowkit import gates as G
from flowkit import transforms as T

warnings.filterwarnings("ignore")

out_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "tests/testthat/fixtures/gatingml")
flow = pd.read_csv(out_dir / "events.csv")


def cytof_events(n=600, seed=20260925):
    """Mass-cytometry-like counts: many events near zero, a positive population over two decades."""
    r = np.random.default_rng(seed)

    def marker():
        pos = r.random(n) < 0.45
        return np.where(pos, 10 ** (0.8 + 2 * r.random(n)), np.abs(r.normal(0, 1.5, n)))

    return pd.DataFrame({
        "Time": np.arange(n, dtype=float),
        "Event_length": np.round(10 + 30 * r.random(n)),
        "Ce140Di": marker(),
        "Nd142Di": marker(),
        "Sm147Di": marker(),
        "Ir191Di": 10 ** (2 + 1.5 * r.random(n)),
    })


cytof = cytof_events()
cytof.round(6).to_csv(out_dir / "cytof-events.csv", index=False)
cytof = pd.read_csv(out_dir / "cytof-events.csv")


def cut(values, q):
    """A cut at quantile q, halfway between two distinct values, so no event lies on it."""
    a = np.unique(np.asarray(values, dtype=float))
    k = int(np.clip(np.floor(q * (len(a) - 1)), 0, len(a) - 2))
    return float((a[k] + a[k + 1]) / 2)


def dim(name, tr=None, lo=None, hi=None):
    return fk.Dimension(name, compensation_ref="uncompensated", transformation_ref=tr,
                        range_min=lo, range_max=hi)


def applied(transform, values):
    return transform.apply(np.asarray(values, dtype=float).reshape(-1, 1)).ravel()


membership = {}


def write(name, gs, events, gates):
    """Export gs, and record FlowKit's events (1-based) for each gate, keyed by its path."""
    with open(out_dir / f"flowkit-{name}.xml", "wb") as fh:
        fk.export_gatingml(gs, fh)
    sample = fk.Sample(events, sample_id=name, subsample=0)
    result = gs.gate_sample(sample)
    pops = {}
    for gate, parents in gates:
        path = "/" + "/".join(list(parents) + [gate])
        mask = np.asarray(result.get_gate_membership(gate, gate_path=("root",) + tuple(parents)))
        pops[path] = [int(i) + 1 for i in np.flatnonzero(mask)]
    membership[name] = pops


# fasinh with A != 0: rectangles on flow fluorescence and scatter, in transformed units.
asinh_a1 = T.AsinhTransform(262144, 4.5, 1.0)
gs = fk.GatingStrategy()
gs.add_transform("Asinh_A1", asinh_a1)
f1 = applied(asinh_a1, flow["FL1-A"])
fsc, ssc = applied(asinh_a1, flow["FSC-A"]), applied(asinh_a1, flow["SSC-A"])
gs.add_gate(G.RectangleGate("FL1_high", [dim("FL1-A", "Asinh_A1", lo=cut(f1, 0.55))]), ("root",))
gs.add_gate(G.RectangleGate("Scatter_box", [
    dim("FSC-A", "Asinh_A1", lo=cut(fsc, 0.2), hi=cut(fsc, 0.9)),
    dim("SSC-A", "Asinh_A1", lo=cut(ssc, 0.1), hi=cut(ssc, 0.8)),
]), ("root",))
write("fasinh", gs, flow, [("FL1_high", ()), ("Scatter_box", ())])

# flin: a rectangle and a polygon with slanted edges, both on the linear scale.
lin = T.LinearTransform(262144, 1000)
gs = fk.GatingStrategy()
gs.add_transform("Lin", lin)
lx, ly = applied(lin, flow["FSC-A"]), applied(lin, flow["SSC-A"])
gs.add_gate(G.RectangleGate("Lin_box", [
    dim("FSC-A", "Lin", lo=cut(lx, 0.3), hi=cut(lx, 0.95)),
    dim("SSC-A", "Lin", lo=cut(ly, 0.05)),
]), ("root",))
gs.add_gate(G.PolygonGate("Lin_slant", [dim("FSC-A", "Lin"), dim("SSC-A", "Lin")], [
    [cut(lx, 0.1), cut(ly, 0.2)], [cut(lx, 0.8), cut(ly, 0.05)],
    [cut(lx, 0.95), cut(ly, 0.9)], [cut(lx, 0.3), cut(ly, 0.7)],
]), ("root",))
write("flin", gs, flow, [("Lin_box", ()), ("Lin_slant", ())])

# Polygons whose edges are straight on logicle and on arcsinh (A != 0) axes, so curved in raw values.
logicle = T.LogicleTransform(262144, 0.5, 4.5, 0)
gs = fk.GatingStrategy()
gs.add_transform("Logicle", logicle)
gs.add_transform("Asinh_A1", asinh_a1)
g1, g2 = applied(logicle, flow["FL1-A"]), applied(logicle, flow["FL2-A"])
gs.add_gate(G.PolygonGate("Slant_logicle", [dim("FL1-A", "Logicle"), dim("FL2-A", "Logicle")], [
    [cut(g1, 0.05), cut(g2, 0.3)], [cut(g1, 0.6), cut(g2, 0.02)],
    [cut(g1, 0.98), cut(g2, 0.7)], [cut(g1, 0.35), cut(g2, 0.97)],
]), ("root",))
gs.add_gate(G.PolygonGate("Slant_asinh", [dim("FSC-A", "Asinh_A1"), dim("SSC-A", "Asinh_A1")], [
    [cut(fsc, 0.05), cut(ssc, 0.4)], [cut(fsc, 0.5), cut(ssc, 0.02)],
    [cut(fsc, 0.97), cut(ssc, 0.6)], [cut(fsc, 0.4), cut(ssc, 0.98)],
]), ("root",))
write("slanted", gs, flow, [("Slant_logicle", ()), ("Slant_asinh", ())])

# The standard model: every gate is a population placed by its parent_id, and a BooleanGate's
# operands keep their own parents.
g3 = applied(logicle, flow["FL3-A"])
gs = fk.GatingStrategy()
gs.add_transform("Logicle", logicle)
gs.add_gate(G.RectangleGate("Cells", [
    dim("FSC-A", lo=cut(flow["FSC-A"], 0.25), hi=cut(flow["FSC-A"], 0.98)),
    dim("SSC-A", lo=cut(flow["SSC-A"], 0.05)),
]), ("root",))
gs.add_gate(G.RectangleGate("FL1_pos", [dim("FL1-A", "Logicle", lo=cut(g1, 0.45))]), ("root", "Cells"))
gs.add_gate(G.RectangleGate("FL3_pos", [dim("FL3-A", "Logicle", lo=cut(g3, 0.4))]), ("root", "Cells"))
gs.add_gate(G.BooleanGate("Both", "and", [
    {"ref": "FL1_pos", "path": ("root", "Cells"), "complement": False},
    {"ref": "FL3_pos", "path": ("root", "Cells"), "complement": False},
]), ("root", "Cells"))
gs.add_gate(G.PolygonGate("FL2_box", [dim("FL1-A", "Logicle"), dim("FL2-A", "Logicle")], [
    [cut(g1, 0.5), cut(g2, 0.3)], [cut(g1, 0.99), cut(g2, 0.3)],
    [cut(g1, 0.99), cut(g2, 0.95)], [cut(g1, 0.5), cut(g2, 0.95)],
]), ("root", "Cells", "FL1_pos"))
gs.add_gate(G.BooleanGate("Both_anywhere", "and", [
    {"ref": "FL1_pos", "path": ("root", "Cells"), "complement": False},
    {"ref": "FL3_pos", "path": ("root", "Cells"), "complement": False},
]), ("root",))
gs.add_gate(G.BooleanGate("Deep", "and", [
    {"ref": "Both", "path": ("root", "Cells"), "complement": False},
    {"ref": "FL2_box", "path": ("root", "Cells", "FL1_pos"), "complement": False},
]), ("root", "Cells", "Both"))
gs.add_gate(G.RectangleGate("Debris", [dim("FSC-A", hi=cut(flow["FSC-A"], 0.25))]), ("root",))
write("boolean", gs, flow, [
    ("Cells", ()), ("FL1_pos", ("Cells",)), ("FL2_box", ("Cells", "FL1_pos")), ("FL3_pos", ("Cells",)),
    ("Both", ("Cells",)), ("Deep", ("Cells", "Both")), ("Both_anywhere", ()), ("Debris", ()),
])

# NOT and OR, which GateLabR's positive-AND model cannot hold.
gs = fk.GatingStrategy()
gs.add_transform("Logicle", logicle)
gs.add_gate(G.RectangleGate("Cells", [dim("FSC-A", lo=cut(flow["FSC-A"], 0.25))]), ("root",))
gs.add_gate(G.RectangleGate("FL1_pos", [dim("FL1-A", "Logicle", lo=cut(g1, 0.45))]), ("root", "Cells"))
gs.add_gate(G.RectangleGate("FL3_pos", [dim("FL3-A", "Logicle", lo=cut(g3, 0.4))]), ("root", "Cells"))
gs.add_gate(G.BooleanGate("FL1_neg", "not", [
    {"ref": "FL1_pos", "path": ("root", "Cells"), "complement": False},
]), ("root", "Cells"))
gs.add_gate(G.BooleanGate("Either", "or", [
    {"ref": "FL1_pos", "path": ("root", "Cells"), "complement": False},
    {"ref": "FL3_pos", "path": ("root", "Cells"), "complement": False},
]), ("root", "Cells"))
gs.add_gate(G.BooleanGate("FL1_not_FL3", "and", [
    {"ref": "FL1_pos", "path": ("root", "Cells"), "complement": False},
    {"ref": "FL3_pos", "path": ("root", "Cells"), "complement": True},
]), ("root", "Cells"))
write("not-or", gs, flow, [
    ("Cells", ()), ("FL1_pos", ("Cells",)), ("FL3_pos", ("Cells",)), ("FL1_neg", ("Cells",)),
    ("Either", ("Cells",)), ("FL1_not_FL3", ("Cells",)),
])

# Mass cytometry: gates in raw values (no transformation-ref) on channels the data hold as
# arcsinh(x / 5), beside the same arcsinh as the data's and an arcsinh of another cofactor.
canonical = T.AsinhTransform(5 * np.sinh(1), np.log10(np.e), 0)  # arcsinh(x / 5)
other = T.AsinhTransform(262144, 4.5, 0)
gs = fk.GatingStrategy()
gs.add_transform("Arcsinh_5", canonical)
gs.add_transform("Asinh_other", other)
c1, c2, c3 = cytof["Ce140Di"], cytof["Nd142Di"], cytof["Sm147Di"]
gs.add_gate(G.RectangleGate("Raw_box", [
    dim("Ce140Di", lo=cut(c1, 0.3), hi=cut(c1, 0.97)),
    dim("Sm147Di", lo=cut(c3, 0.1)),
]), ("root",))
gs.add_gate(G.PolygonGate("Raw_slant", [dim("Ce140Di"), dim("Nd142Di")], [
    [cut(c1, 0.05), cut(c2, 0.4)], [cut(c1, 0.55), cut(c2, 0.02)],
    [cut(c1, 0.97), cut(c2, 0.6)], [cut(c1, 0.35), cut(c2, 0.98)],
]), ("root",))
a1, a2 = applied(canonical, c1), applied(canonical, c2)
gs.add_gate(G.PolygonGate("Arcsinh_slant", [dim("Ce140Di", "Arcsinh_5"), dim("Nd142Di", "Arcsinh_5")], [
    [cut(a1, 0.05), cut(a2, 0.4)], [cut(a1, 0.55), cut(a2, 0.02)],
    [cut(a1, 0.97), cut(a2, 0.6)], [cut(a1, 0.35), cut(a2, 0.98)],
]), ("root",))
o1 = applied(other, c1)
gs.add_gate(G.RectangleGate("Other_range", [dim("Ce140Di", "Asinh_other", lo=cut(o1, 0.5))]), ("root",))
gs.add_gate(G.RectangleGate("Time_window", [dim("Time", lo=100.5, hi=450.5)]), ("root",))
write("cytof", gs, cytof, [
    ("Raw_box", ()), ("Raw_slant", ()), ("Arcsinh_slant", ()), ("Other_range", ()), ("Time_window", ()),
])

with open(out_dir / "flowkit-membership.json", "w") as fh:
    json.dump(membership, fh, separators=(",", ":"))
