# Launch the GateLabR interactive gating app

Opens the GateLabR Shiny application in a browser. Works both from an
installed package
([`library(GateLabR); launchGatingApp()`](https://david-priest.github.io/GateLabR))
and from a source clone (`source("launch.R"); launchGatingApp()`).

## Usage

``` r
launchGatingApp(sce = NULL, port = NULL, launch.browser = TRUE)
```

## Arguments

- sce:

  Optional `SingleCellExperiment`. If `NULL`, the app scans the global
  environment for any `SingleCellExperiment` objects and lets you pick
  one (or import FCS files directly).

- port:

  Port for Shiny (default: auto-select).

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

## Value

Invisibly `NULL`; runs the Shiny app (blocking).
