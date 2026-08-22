# GateLabR 2.1.0

- The bundled GateLab interface moves from v0.4.2 to v0.7.0. The R host protocol is unchanged,
  with all six host contracts still at version 1, so saved workspaces, compensation provenance
  and assay bindings load without conversion.
- Gates now carry the coordinate space they were drawn in. A flow gate records whether its
  vertices are straight in raw channel values or in the transform it was drawn under, so moving
  a display control can no longer move an event in or out of a gate. Two letters on each gate
  label name the space of its x and y axes. Saved workspaces are unaffected: a gate with no
  recorded space resolves to what that sample did before the field existed.
- FlowJo `.wsp` workspaces open directly, with their own compensation matrix and a picker when
  the workspace is ambiguous. FlowJo's biex and log transforms are implemented, so imported gates
  land where FlowJo evaluates them.
- Gating-ML export declares the transform each gate's vertices are actually straight in, and
  import reads `transformation-ref` the way the specification means it.
- Fluorescence channels can be displayed with arcsinh instead of logicle, with an adjustable
  cofactor. Gate edges can be drawn straight, straight with a grey true edge, or bowed.
- Channels can be named with their detector as well as their marker, throughout the interface.
- Plots draw at the display's resolution rather than in CSS pixels, and the Strategy,
  Illustration and Compensation grids now colour by the same quantile rank the gating plot uses.
- Fixed: exporting a gating strategy to FCS no longer loses sibling populations to a file-name
  collision. `CD45RB+IgD+` and `CD45RB-IgD+` both sanitised to one name and each later export
  overwrote the earlier one.
- The core sync no longer copies GateLab's local development sample data into this package.

# GateLabR 2.0.0

- `launchGatingApp()` now starts the shared GateLab TypeScript/React interface,
  and is the single supported entry point.
- **Breaking:** `launchLegacyGateLabR()` is defunct and the previous
  GateLabR-specific Shiny interface is no longer reachable; use
  `launchGatingApp()`. Calling it now signals an error explaining the change.
  Note that the former Shiny-only UMAP view goes with it and is not yet
  available in the React interface.
- SCE assays are streamed lazily through a thin R host with explicit linear
  versus display-coordinate contracts.
- Compensation Apply runs in a cancellable background R process and installs
  revisioned assays atomically.
- Panel labels, population memberships, division calls and editable sample
  annotations have explicit `rowData()` / `colData()` write-back actions.
- Canonical GateLab workspaces, compensation provenance and assay bindings
  persist inside the SCE and restore without recomputation.
- Valid older workspaces with list-encoded gate coordinates are normalized
  without changing their geometry.
