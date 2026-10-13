# Density contours as GateLab draws them

Computes the contour lines and the outlier points of a biaxial plot by
the recipe GateLab's contour mode uses, so a figure made in R matches
the app's Gating, Strategy and Illustration plots. The events are placed
in a square pixel space (`ref_size`, the app's Gating plot), binned and
smoothed as `d3.contourDensity()` does (linear binning on a 4-pixel
grid, three box blurs each way), and contoured at log-spaced levels from
`threshold` percent of the peak density up to the peak. Points outside
the lowest contour are returned as outliers.

## Usage

``` r
gatelabContour(
  x,
  y,
  xlim,
  ylim,
  levels = 10,
  threshold = 5,
  bandwidth = NULL,
  ref_size = 560
)
```

## Arguments

- x, y:

  Numeric vectors of the events to draw, in display units (for mass
  cytometry, the arcsinh-transformed values). Give the events the app
  would draw, for example from
  [`gatelabDisplayEvents`](https://david-priest.github.io/GateLabR/reference/gatelabDisplayEvents.md).

- xlim, ylim:

  The axis ranges of the plot, each `c(low, high)`. The density is
  estimated in the plot's pixels, so the ranges change the contours.

- levels:

  Number of contour levels, 2 to 30 (the app's "Contour levels").

- threshold:

  Lowest level as a percentage of the peak density (the app's "Contour
  threshold").

- bandwidth:

  Kernel bandwidth in reference pixels. `NULL` takes the app's rule,
  `max(2, min(10, round(1200 / sqrt(n))))` for `n` events on the plot.

- ref_size:

  Side of the square pixel space the density is estimated in.

## Value

A list: `paths`, a data frame of contour lines (`x`, `y`, `group`,
`level`) in data units; `outliers`, a data frame (`x`, `y`) of the
events outside the lowest contour; `levels`, the density levels;
`bandwidth`; and `n`, the events on the plot.

## Details

Ported from d3-contour 4 (`density.js`) and d3-array 3 (`blur.js`) as
shipped in d3 7.9.0, and from GateLab's `_drawContour`. Two differences
remain: d3 accumulates in single precision, and the app finds outliers
on a 256-pixel raster of the lowest contour where this function tests
each point against the contour itself.

## See also

[`gatelabPanelGrob`](https://david-priest.github.io/GateLabR/reference/gatelabPanelGrob.md),
which draws them.

## Examples

``` r
set.seed(1)
x <- c(rnorm(2000, 1), rnorm(2000, 4))
y <- c(rnorm(2000, 4), rnorm(2000, 1))
contours <- gatelabContour(x, y, xlim = c(-1, 7), ylim = c(-1, 7))
length(unique(contours$paths$level))
#> [1] 10
nrow(contours$outliers)
#> [1] 62
```
