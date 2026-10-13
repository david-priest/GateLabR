# Draw a gating strategy or a panel on the current device

A strategy from
[`gatelabStrategyPlot`](https://david-priest.github.io/GateLabR/reference/gatelabStrategyPlot.md)
and a panel from
[`gatelabPanelGrob`](https://david-priest.github.io/GateLabR/reference/gatelabPanelGrob.md)
are grid drawings of a fixed size.
[`print()`](https://rdrr.io/r/base/print.html) and
[`plot()`](https://rdrr.io/r/graphics/plot.default.html) start a new
page on the current graphics device and draw the figure at its centre,
so one shows when it is returned at the console.

## Usage

``` r
# S3 method for class 'gatelab_strategy'
print(x, ...)

# S3 method for class 'gatelab_strategy'
plot(x, ...)

# S3 method for class 'gatelab_panel'
print(x, ...)

# S3 method for class 'gatelab_panel'
plot(x, ...)
```

## Arguments

- x:

  A `gatelab_strategy` or a `gatelab_panel`.

- ...:

  Ignored.

## Value

`x`, invisibly.

## Details

The figure keeps its own size whatever the device's, and a device
smaller than the figure cuts it off. To save a strategy at its size,
open the device with the strategy's `width` and `height` attributes
(inches); a panel is `plot_size * scale / 96` inches square.

## Examples

``` r
set.seed(1)
panel <- gatelabPanelGrob(rnorm(2000, 3), rnorm(2000, 3), xlim = c(-1, 7), ylim = c(-1, 7),
                          xlab = "CD4", ylab = "CD8", title = "All Events (2,000)")
file <- tempfile(fileext = ".pdf")
grDevices::pdf(file, width = 300 / 96, height = 300 / 96)
print(panel)
grDevices::dev.off()
#> agg_record_189439368d37 
#>                       2 
```
