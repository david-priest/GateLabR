# Launch GateLabR with the canonical GateLab React interface

Starts the shared GateLab TypeScript/React application with a thin Shiny
adapter for a `SingleCellExperiment`. This is the interface started by
[`launchGatingApp`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md),
which is the single supported entry point.

## Usage

``` r
launchReactGateLab(
  sce = NULL,
  sample_column = NULL,
  port = NULL,
  launch.browser = TRUE,
  sce_name = NULL
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

- sce_name:

  Optional name of the global-environment variable that gates,
  populations and `colData` are written back to. Defaults to the symbol
  the caller passed as `sce`. Delegating wrappers must forward the
  user's symbol explicitly, because
  [`substitute()`](https://rdrr.io/r/base/substitute.html) would
  otherwise resolve to the wrapper's own parameter name.

## Value

Invisibly `NULL`; runs the Shiny app (blocking).
