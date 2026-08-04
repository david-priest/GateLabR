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
