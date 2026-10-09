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
  launch.browser = TRUE,
  agent = NULL,
  blocking = NULL
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

  Port for Shiny. By default the app is served on one port from session
  to session (`getOption("gatelabr.port", 4283)`), so that the browser
  keeps what the app remembers on its own account (the language, the
  gate edge mode, snapping); see
  [`launchReactGateLab`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md).

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

- agent:

  Open the tab connected to an agent's relay: `TRUE` reads the address
  the relay recorded in `~/.gatelab/agent-relay.json`, or give the
  `ws://` address itself. See
  [`launchReactGateLab`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md).

- blocking:

  `NULL` (the default) returns at once when the installed Shiny can run
  the app in the background (1.14 and later) and blocks otherwise;
  `FALSE` insists on returning at once; `TRUE` blocks. See
  [`launchReactGateLab`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md).

## Value

Invisibly the app's handle when the call returns at once
([`gatelabStop`](https://david-priest.github.io/GateLabR/reference/gatelabStop.md)
stops the app,
[`gatelabSync`](https://david-priest.github.io/GateLabR/reference/gatelabSync.md)
hands it the object after a change at the console), otherwise invisibly
`NULL` once the app has stopped. Warns when the app stops with no
population memberships stored, or stale ones: the readers need an
explicit "Save to SCE".
