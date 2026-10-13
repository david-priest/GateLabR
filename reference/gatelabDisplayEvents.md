# The events GateLab draws for a pooled population

Picks the events a GateLab plot pooled over samples would draw: the
event cap is shared between the samples in proportion to their part of
the population (whole events, the remainder going to the largest
fractions), and each sample's events are thinned evenly along their
order in the object. Deterministic, so a plot made from the result is
the same every time and shows the same events as the app.

## Usage

``` r
gatelabDisplayEvents(member = NULL, sample_id, max_events = 10000)
```

## Arguments

- member:

  Logical vector, one value per event: the population to draw (the
  parent population of a gating plot). `NULL` takes every event.

- sample_id:

  The sample of each event (factor or character). Samples are taken in
  the order of the factor's levels, or of first appearance for a
  character vector.

- max_events:

  The cap on events drawn (the app's "Max events/panel"). 0 or `Inf`
  draws every event.

## Value

Integer vector of event positions, sample by sample.

## Details

Ported from GateLab's `allocateCombinedSampleCaps()` and `thinEvenly()`.
A sample whose share of the cap rounds to nothing still gives one event,
as in the app.

## See also

[`gatelabStrategyPlot`](https://david-priest.github.io/GateLabR/reference/gatelabStrategyPlot.md),
which thins each panel's events this way.

## Examples

``` r
sample_id <- rep(c("D1", "D2", "D3"), c(600, 300, 100))
keep <- gatelabDisplayEvents(NULL, sample_id, max_events = 50)
table(sample_id[keep])
#> 
#> D1 D2 D3 
#> 30 15  5 
```
