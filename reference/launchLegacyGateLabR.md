# Launch the previous GateLabR Shiny interface

Opens the original GateLabR-specific Shiny application. This transition
launcher remains available for workflows that have not yet moved to the
shared React interface, including the former Shiny-only UMAP view.

## Usage

``` r
launchLegacyGateLabR(sce = NULL, port = NULL, launch.browser = TRUE)
```

## Arguments

- sce:

  Optional `SingleCellExperiment`. If `NULL`, the first SCE in the
  global environment is used.

- port:

  Port for Shiny (default: auto-select).

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

## Value

Invisibly `NULL`; runs the Shiny app (blocking).
