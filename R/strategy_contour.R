# strategy_contour.R -- the density contours and the event thinning of a GateLab plot, in R.
#
# gatelabContour() is d3.contourDensity() as the app's contour mode calls it, and
# gatelabDisplayEvents() is the app's rule for which events a plot pooled over samples draws.
# Both are ports, kept to the app's arithmetic, so a panel drawn in R (strategy_panel.R) and a
# strategy made of such panels (strategy_plot.R) show the contours and the dots the app shows.

#' Density contours as GateLab draws them
#'
#' Computes the contour lines and the outlier points of a biaxial plot by the recipe GateLab's
#' contour mode uses, so a figure made in R matches the app's Gating, Strategy and Illustration
#' plots. The events are placed in a square pixel space (\code{ref_size}, the app's Gating
#' plot), binned and smoothed as \code{d3.contourDensity()} does (linear binning on a 4-pixel
#' grid, three box blurs each way), and contoured at log-spaced levels from \code{threshold}
#' percent of the peak density up to the peak. Points outside the lowest contour are returned as
#' outliers.
#'
#' @details Ported from d3-contour 4 (\code{density.js}) and d3-array 3 (\code{blur.js}) as
#'   shipped in d3 7.9.0, and from GateLab's \code{_drawContour}. Two differences remain: d3
#'   accumulates in single precision, and the app finds outliers on a 256-pixel raster of the
#'   lowest contour where this function tests each point against the contour itself.
#'
#' @param x,y Numeric vectors of the events to draw, in display units (for mass cytometry, the
#'   arcsinh-transformed values). Give the events the app would draw, for example from
#'   \code{\link{gatelabDisplayEvents}}.
#' @param xlim,ylim The axis ranges of the plot, each \code{c(low, high)}. The density is
#'   estimated in the plot's pixels, so the ranges change the contours.
#' @param levels Number of contour levels, 2 to 30 (the app's "Contour levels").
#' @param threshold Lowest level as a percentage of the peak density (the app's "Contour
#'   threshold").
#' @param bandwidth Kernel bandwidth in reference pixels. \code{NULL} takes the app's rule,
#'   \code{max(2, min(10, round(1200 / sqrt(n))))} for \code{n} events on the plot.
#' @param ref_size Side of the square pixel space the density is estimated in.
#' @return A list: \code{paths}, a data frame of contour lines (\code{x}, \code{y},
#'   \code{group}, \code{level}) in data units; \code{outliers}, a data frame (\code{x},
#'   \code{y}) of the events outside the lowest contour; \code{levels}, the density levels;
#'   \code{bandwidth}; and \code{n}, the events on the plot.
#' @seealso \code{\link{gatelabPanelGrob}}, which draws them.
#' @examples
#' set.seed(1)
#' x <- c(rnorm(2000, 1), rnorm(2000, 4))
#' y <- c(rnorm(2000, 4), rnorm(2000, 1))
#' contours <- gatelabContour(x, y, xlim = c(-1, 7), ylim = c(-1, 7))
#' length(unique(contours$paths$level))
#' nrow(contours$outliers)
#' @export
gatelabContour <- function(x, y, xlim, ylim, levels = 10, threshold = 5, bandwidth = NULL,
                           ref_size = 560) {
  stopifnot(is.numeric(x), is.numeric(y), length(x) == length(y),
            is.numeric(xlim), length(xlim) == 2L, diff(xlim) > 0,
            is.numeric(ylim), length(ylim) == 2L, diff(ylim) > 0,
            is.numeric(ref_size), length(ref_size) == 1L, ref_size > 0)
  empty <- list(paths = data.frame(x = numeric(0), y = numeric(0), group = integer(0), level = numeric(0)),
                outliers = data.frame(x = numeric(0), y = numeric(0)),
                levels = numeric(0), bandwidth = NA_real_, n = 0L)
  # Pixel space as the canvas has it: x to the right, y downwards.
  px <- (x - xlim[1]) / diff(xlim) * ref_size
  py <- (ylim[2] - y) / diff(ylim) * ref_size
  keep <- is.finite(px) & is.finite(py) & px >= 0 & px <= ref_size & py >= 0 & py <= ref_size
  px <- px[keep]; py <- py[keep]
  n <- length(px)
  if (!n) return(empty)

  bw <- if (!is.null(bandwidth) && is.finite(bandwidth) && bandwidth > 0) bandwidth else
    max(2, min(10, .gatelabr_js_round(1200 / sqrt(n))))
  threshold <- max(0, min(100, threshold))
  levels <- max(2L, min(30L, as.integer(.gatelabr_js_round(levels))))

  dens <- .gatelabr_d3_density_grid(px, py, ref_size, bw)
  peak <- .gatelabr_d3_ticks(.Machine$double.xmin, max(dens$values) / 16, 20)
  peak <- if (length(peak)) peak[length(peak)] else NA_real_
  if (!is.finite(peak) || peak <= 0) {
    empty$outliers <- data.frame(x = x[keep], y = y[keep]); empty$n <- n; empty$bandwidth <- bw
    return(empty)
  }
  outer <- max(peak * threshold / 100, peak * 0.005)
  lev <- exp(log(outer) + (log(peak) - log(outer)) * (seq_len(levels) - 1) / (levels - 1))

  # Grid values sit at cell centres; a centre at grid position g is at pixel g * 4 - offset. A
  # ring of zeros round the grid closes every contour, as d3 does by reading the outside as empty.
  centre <- (seq(0, dens$size + 1) - 0.5) * 4 - dens$offset
  z <- matrix(0, dens$size + 2, dens$size + 2)
  z[seq_len(dens$size) + 1, seq_len(dens$size) + 1] <- dens$values
  lines <- grDevices::contourLines(centre, centre, z, levels = lev * 16)
  to_x <- function(p) xlim[1] + p / ref_size * diff(xlim)
  to_y <- function(p) ylim[2] - p / ref_size * diff(ylim)
  paths <- if (length(lines)) do.call(rbind, lapply(seq_along(lines), function(i) {
    data.frame(x = to_x(lines[[i]]$x), y = to_y(lines[[i]]$y), group = i, level = lines[[i]]$level / 16)
  })) else empty$paths

  # Outliers: events outside the region of the lowest level (even-odd over its rings).
  lowest <- Filter(function(l) isTRUE(all.equal(l$level, lev[1] * 16)), lines)
  inside <- logical(n)
  for (ring in lowest) inside <- xor(inside, .gatelabr_in_ring(px, py, ring$x, ring$y))
  list(paths = paths,
       outliers = data.frame(x = x[keep][!inside], y = y[keep][!inside]),
       levels = lev, bandwidth = bw, n = n)
}

# JavaScript's Math.round: halves go up. R's round() sends them to the even digit.
.gatelabr_js_round <- function(v) floor(v + 0.5)

# d3.contourDensity()'s grid for a square of `size` pixels: linear binning onto 4-pixel cells
# padded by three blur radii, then blur2() with the radius in cells. Returns the flat values
# (x fastest), the grid's side and the padding in pixels.
.gatelabr_d3_density_grid <- function(px, py, size, bandwidth) {
  radius <- (sqrt(4 * bandwidth^2 + 1) - 1) / 2
  offset <- 3 * radius
  side <- trunc(size + 2 * offset) %/% 4            # (size + 2 * offset) >> 2
  gx <- (px + offset) / 4; gy <- (py + offset) / 4
  ok <- gx >= 0 & gx < side & gy >= 0 & gy < side
  gx <- gx[ok]; gy <- gy[ok]
  x0 <- floor(gx); y0 <- floor(gy)
  # d3 measures the fraction from the cell centre, so it runs from -0.5 to 0.5. Kept as it is.
  tx <- gx - x0 - 0.5; ty <- gy - y0 - 0.5
  index <- c(x0 + y0 * side, x0 + 1 + y0 * side, x0 + 1 + (y0 + 1) * side, x0 + (y0 + 1) * side) + 1
  weight <- c((1 - tx) * (1 - ty), tx * (1 - ty), tx * ty, (1 - tx) * ty)
  inside <- index <= side * side                      # a typed array ignores writes past its end
  sums <- rowsum(weight[inside], index[inside])
  values <- numeric(side * side)
  values[as.integer(rownames(sums))] <- sums[, 1]
  list(values = .gatelabr_d3_blur2(values, side, side, radius / 4), size = side, offset = offset)
}

# d3-array's blur2(): three box blurs along x, then three along y, with the edge value held
# beyond each end and a fractional radius spread onto the two cells past the integer box.
.gatelabr_d3_blur2 <- function(values, width, height, radius) {
  if (!(radius > 0)) return(values)
  m <- matrix(values, nrow = width)                    # m[x, y]
  whole <- floor(radius); frac <- radius - whole; span <- 2 * radius + 1
  box <- function(a) {                                 # along the first dimension of `a`
    len <- nrow(a)
    at <- function(shift) a[pmin(len, pmax(1L, seq_len(len) + shift)), , drop = FALSE]
    total <- a
    for (k in seq_len(whole)) total <- total + at(-k) + at(k)
    if (frac > 0) total <- total + frac * (at(-whole - 1L) + at(whole + 1L))
    total / span
  }
  for (pass in 1:3) m <- box(m)
  m <- t(m)
  for (pass in 1:3) m <- box(m)
  as.vector(t(m))
}

# d3.ticks(start, stop, count): the "nice" values a d3 axis or contour generator takes, at a
# step of 1, 2 or 5 times a power of ten. Ported from d3-array 3 (ticks.js).
.gatelabr_d3_ticks <- function(start, stop, count) {
  if (!is.finite(start) || !is.finite(stop) || !(count > 0)) return(numeric(0))
  if (start == stop) return(start)
  reversed <- stop < start
  if (reversed) { swap <- start; start <- stop; stop <- swap }
  step <- (stop - start) / count
  power <- floor(log10(step))
  error <- step / 10^power
  factor <- if (error >= sqrt(50)) 10 else if (error >= sqrt(10)) 5 else if (error >= sqrt(2)) 2 else 1
  if (power < 0) {
    inc <- 10^(-power) / factor
    first <- .gatelabr_js_round(start * inc); last <- .gatelabr_js_round(stop * inc)
    if (first / inc < start) first <- first + 1
    if (last / inc > stop) last <- last - 1
    out <- if (last < first) numeric(0) else seq(first, last) / inc
  } else {
    inc <- 10^power * factor
    first <- .gatelabr_js_round(start / inc); last <- .gatelabr_js_round(stop / inc)
    if (first * inc < start) first <- first + 1
    if (last * inc > stop) last <- last - 1
    out <- if (last < first) numeric(0) else seq(first, last) * inc
  }
  if (reversed) rev(out) else out
}

# Even-odd test of points against one closed ring, vectorised over the points.
.gatelabr_in_ring <- function(px, py, vx, vy) {
  inside <- logical(length(px))
  j <- length(vx)
  for (i in seq_along(vx)) {
    if (vy[i] != vy[j]) {
      crosses <- ((vy[i] > py) != (vy[j] > py)) &
        (px < (vx[j] - vx[i]) * (py - vy[i]) / (vy[j] - vy[i]) + vx[i])
      inside <- xor(inside, crosses)
    }
    j <- i
  }
  inside
}

#' The events GateLab draws for a pooled population
#'
#' Picks the events a GateLab plot pooled over samples would draw: the event cap is shared
#' between the samples in proportion to their part of the population (whole events, the
#' remainder going to the largest fractions), and each sample's events are thinned evenly along
#' their order in the object. Deterministic, so a plot made from the result is the same every
#' time and shows the same events as the app.
#'
#' @details Ported from GateLab's \code{allocateCombinedSampleCaps()} and \code{thinEvenly()}.
#'   A sample whose share of the cap rounds to nothing still gives one event, as in the app.
#'
#' @param member Logical vector, one value per event: the population to draw (the parent
#'   population of a gating plot). \code{NULL} takes every event.
#' @param sample_id The sample of each event (factor or character). Samples are taken in the
#'   order of the factor's levels, or of first appearance for a character vector.
#' @param max_events The cap on events drawn (the app's "Max events/panel"). 0 or \code{Inf}
#'   draws every event.
#' @return Integer vector of event positions, sample by sample.
#' @seealso \code{\link{gatelabStrategyPlot}}, which thins each panel's events this way.
#' @examples
#' sample_id <- rep(c("D1", "D2", "D3"), c(600, 300, 100))
#' keep <- gatelabDisplayEvents(NULL, sample_id, max_events = 50)
#' table(sample_id[keep])
#' @export
gatelabDisplayEvents <- function(member = NULL, sample_id, max_events = 10000) {
  if (is.null(member)) member <- rep(TRUE, length(sample_id))
  stopifnot(is.logical(member), length(member) == length(sample_id))
  sample_id <- if (is.factor(sample_id)) droplevels(sample_id) else factor(sample_id, levels = unique(sample_id))
  per_sample <- split(which(member), sample_id[member], drop = FALSE)
  counts <- lengths(per_sample)
  if (!is.finite(max_events) || max_events <= 0 || sum(counts) <= max_events)
    return(unlist(per_sample, use.names = FALSE))
  caps <- .gatelabr_display_sample_caps(counts, max_events)
  unlist(Map(function(events, cap) .gatelabr_thin_evenly(events, max(1, cap)), per_sample, caps), use.names = FALSE)
}

# The cap shared between samples by their counts: whole events, the rest to the largest
# fractional remainders, the earlier sample winning a tie.
.gatelabr_display_sample_caps <- function(counts, cap) {
  counts <- pmax(0, floor(counts))
  total <- sum(counts)
  if (!is.finite(cap) || cap <= 0 || total <= cap) return(counts)
  cap <- max(1, floor(cap))
  share <- ifelse(counts > 0, counts * cap / total, 0)
  given <- pmin(counts, floor(share))
  left <- cap - sum(given)
  waiting <- which(counts > given)
  waiting <- waiting[order(-(share[waiting] - floor(share[waiting])), waiting)]
  more <- waiting[seq_len(min(left, length(waiting)))]
  given[more] <- given[more] + 1
  left <- cap - sum(given)
  for (i in seq_along(given)) {
    if (left <= 0) break
    add <- min(counts[i] - given[i], left)
    if (add > 0) { given[i] <- given[i] + add; left <- left - add }
  }
  given
}

# `values` thinned evenly to `cap` when there are more, the first and the last kept.
.gatelabr_thin_evenly <- function(values, cap) {
  n <- length(values)
  if (!is.finite(cap) || cap <= 0 || n <= cap) return(values)
  values[.gatelabr_js_round((seq_len(cap) - 1) * (n - 1) / max(1, cap - 1)) + 1]
}
