# GateLabR 2.0.0

- `launchGatingApp()` now starts the shared GateLab TypeScript/React interface,
  and is the single supported entry point.
- **Breaking:** `launchLegacyGateLabR()` is removed. The previous
  GateLabR-specific Shiny interface (including its former UMAP view) is no
  longer reachable; use `launchGatingApp()`.
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
