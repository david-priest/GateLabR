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
  sce_name = NULL,
  agent = NULL,
  blocking = NULL
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

  Port for Shiny. By default the app is served on one port from session
  to session (`getOption("gatelabr.port", 4283)`), because the browser
  keeps what the app remembers on its own account (the language, the
  gate edge mode, snapping) per address, and a port chosen afresh in
  each R session loses it. When that port is in use, for instance by a
  second GateLabR session, Shiny chooses one and a message says so.
  `options(gatelabr.port = FALSE)` always leaves the choice to Shiny.

- launch.browser:

  Whether to open a browser window (default: `TRUE`).

- sce_name:

  Optional name of the global-environment variable that gates,
  populations and `colData` are written back to. Defaults to the symbol
  the caller passed as `sce`. Delegating wrappers must forward the
  user's symbol explicitly, because
  [`substitute()`](https://rdrr.io/r/base/substitute.html) would
  otherwise resolve to the wrapper's own parameter name.

- agent:

  Open the tab connected to an agent's relay: `TRUE` reads the address
  the relay recorded in `~/.gatelab/agent-relay.json`, or give the
  `ws://` address itself. The agent then reads the gating as you see it
  and proposes gates, which appear in the tab with a badge; saving stays
  yours. `NULL` (the default) opens the tab as usual; the Agent menu in
  the header can connect it later.

- blocking:

  Whether the call returns only when the app stops. `NULL` (the default)
  returns at once when the installed Shiny can run an app in the
  background
  ([`shiny::startApp()`](https://rdrr.io/pkg/shiny/man/startApp.html),
  Shiny 1.14 and later) and otherwise blocks as before, saying so.
  `FALSE` insists on returning at once and is an error with an older
  Shiny; `TRUE` blocks.

## Value

Invisibly the running app's handle when the call returns at once (its
`$stop()` stops the app, as does
[`gatelabStop`](https://david-priest.github.io/GateLabR/reference/gatelabStop.md)),
otherwise invisibly `NULL` once the app has stopped. The app is serviced
while R is idle at the prompt, so a long computation pauses it until the
prompt returns. While it runs, the console may change the object it was
launched on: the app then refuses to save over that change until
[`gatelabSync`](https://david-priest.github.io/GateLabR/reference/gatelabSync.md)
hands it the console's object. When the app stops with no population
memberships stored in the object, or with memberships older than the
workspace, a warning says so: the readers
([`gatelabPopulations`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md),
[`gatelabHierarchy`](https://david-priest.github.io/GateLabR/reference/gatelabMemberships.md))
need an explicit "Save to SCE", which autosaves do not replace.
