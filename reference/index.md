# Package index

## Launching the app

- [`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
  : Launch GateLabR
- [`launchReactGateLab()`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md)
  : Launch GateLabR with the canonical GateLab React interface

## Reading a saved workspace back in R

“Save to SCE” stores which events every population holds, so a gating
result can be read back without re-gating. These four read that record.

- [`gatelabHierarchies()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabHierarchy()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabPopulations()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabLeafPopulation()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  : Population hierarchies stored in a gated SingleCellExperiment

## Retired

Kept as an exported stub so existing scripts fail with an explanation
rather than “could not find function”. It never starts an application.

- [`launchLegacyGateLabR()`](https://david-priest.github.io/GateLabR/reference/launchLegacyGateLabR.md)
  : Launch the previous GateLabR Shiny interface (defunct)
