# Launch the previous GateLabR Shiny interface (defunct)

The GateLabR-specific Shiny interface was retired in GateLabR 1.4.0.
GateLabR now has a single entry point,
[`launchGatingApp`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md),
which starts the shared GateLab React interface.

## Usage

``` r
launchLegacyGateLabR(...)
```

## Arguments

- ...:

  Ignored.

## Value

Never returns; always signals an error.

## Details

The entry point is kept only so that existing scripts fail with an
explanation instead of “could not find function”. It never starts an
application.
