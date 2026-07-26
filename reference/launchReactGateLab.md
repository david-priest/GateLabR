# Launch GateLabR with the canonical GateLab React interface

Starts the shared GateLab TypeScript/React application with a thin Shiny
adapter for a `SingleCellExperiment`. This is the migration interface;
the established R/Shiny interface remains available through
[`launchGatingApp`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
until feature-parity validation is complete.

## Usage

``` r
launchReactGateLab(
  sce = NULL,
  sample_column = NULL,
  port = NULL,
  launch.browser = TRUE
)
```

## Arguments

- sce:

  A `SingleCellExperiment`. If `NULL`, the first SCE in the global
  environment is used.

- sample_column:

  Optional `colData` column defining samples. When omitted, common
  sample columns such as `sample_id` are detected.

- port:

  Port for Shiny (default: auto-select).

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

## Value

Invisibly `NULL`; runs the Shiny app (blocking).
