# Package index

## Launching the app

- [`launchGatingApp()`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
  : Launch GateLabR
- [`launchReactGateLab()`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md)
  : Launch GateLabR with the canonical GateLab React interface
- [`gatelabStop()`](https://david-priest.github.io/GateLabR/reference/gatelabStop.md)
  : Stop the running GateLabR app
- [`gatelabSync()`](https://david-priest.github.io/GateLabR/reference/gatelabSync.md)
  : Hand the console's object to the running app

## Reading a saved workspace back in R

“Save to SCE” stores which events every population holds, so a gating
result can be read back without re-gating. These read that record, the
transforms the object was drawn on, and build a GatingSet from a gated
SCE.

- [`gatelabHierarchies()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabHierarchy()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabPopulations()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  [`gatelabLeafPopulation()`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md)
  : Population hierarchies stored in a gated SingleCellExperiment
- [`gatelabTransforms()`](https://david-priest.github.io/GateLabR/reference/gatelabTransforms.md)
  : The display transform of every channel, as the app drew it
- [`gatelabGatingSet()`](https://david-priest.github.io/GateLabR/reference/gatelabGatingSet.md)
  : Build a flowWorkspace GatingSet from a gated SingleCellExperiment

## Drawing a gating strategy in R

The gating path to chosen populations as the Strategy tab draws it, made
in R from the saved workspace and the stored memberships. The panel, the
contours and the event thinning it is built from can be used on their
own.

- [`gatelabStrategyPlot()`](https://david-priest.github.io/GateLabR/reference/gatelabStrategyPlot.md)
  : A gating strategy, drawn as GateLab's Strategy tab draws it
- [`gatelabPanelGrob()`](https://david-priest.github.io/GateLabR/reference/gatelabPanelGrob.md)
  : One gating panel, drawn as GateLab draws it
- [`gatelabContour()`](https://david-priest.github.io/GateLabR/reference/gatelabContour.md)
  : Density contours as GateLab draws them
- [`gatelabDisplayEvents()`](https://david-priest.github.io/GateLabR/reference/gatelabDisplayEvents.md)
  : The events GateLab draws for a pooled population
- [`print(`*`<gatelab_strategy>`*`)`](https://david-priest.github.io/GateLabR/reference/print.gatelab_strategy.md)
  [`plot(`*`<gatelab_strategy>`*`)`](https://david-priest.github.io/GateLabR/reference/print.gatelab_strategy.md)
  [`print(`*`<gatelab_panel>`*`)`](https://david-priest.github.io/GateLabR/reference/print.gatelab_strategy.md)
  [`plot(`*`<gatelab_panel>`*`)`](https://david-priest.github.io/GateLabR/reference/print.gatelab_strategy.md)
  : Draw a gating strategy or a panel on the current device

## Retired

Kept as an exported stub so existing scripts fail with an explanation
rather than “could not find function”. It never starts an application.

- [`launchLegacyGateLabR()`](https://david-priest.github.io/GateLabR/reference/launchLegacyGateLabR.md)
  : Launch the previous GateLabR Shiny interface (defunct)
