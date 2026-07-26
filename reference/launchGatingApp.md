# Launch GateLabR

Opens the canonical GateLab React interface with a thin
`SingleCellExperiment` host. Works both from an installed package
([`library(GateLabR); launchGatingApp()`](https://david-priest.github.io/GateLabR))
and from a source clone (`source("launch.R"); launchGatingApp()`).

## Usage

``` r
launchGatingApp(
  sce = NULL,
  sample_column = NULL,
  port = NULL,
  launch.browser = TRUE
)
```

## Arguments

- sce:

  Optional `SingleCellExperiment`. If `NULL`, the first SCE in the
  global environment is used.

- sample_column:

  Optional `colData` column defining samples. When omitted, common
  sample columns such as `sample_id` are detected.

- port:

  Port for Shiny (default: auto-select).

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

## Value

Invisibly `NULL`; runs the Shiny app (blocking).
