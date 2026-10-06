# Stop the running GateLabR app

The app started by
[`launchGatingApp`](https://david-priest.github.io/GateLabR/reference/launchGatingApp.md)
without blocking keeps running after the prompt returns. This stops it,
which also removes its resource path, stops its compensation backend and
says whether population memberships are stored (see
[`launchReactGateLab`](https://david-priest.github.io/GateLabR/reference/launchReactGateLab.md)).
Nothing happens when no app is running.

## Usage

``` r
gatelabStop()
```

## Value

Invisibly `TRUE` when an app was stopped, `FALSE` when none was running.
