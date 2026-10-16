# The flowCore Gating-ML kernel uses normalized units: H(T) = 1. Its constructor is
# public, but the shared forward/inverse kernel is internal, so require its presence
# explicitly rather than substituting a different transform when it is unavailable.
.gatelabr_hyperlog_kernel <- function() {
  get0("hyperlog_transform", envir = asNamespace("flowCore"), inherits = FALSE)
}

.gatelabr_hyperlog_transform <- function(spec) {
  p <- vapply(c("T", "W", "M", "A"), function(key) {
    value <- suppressWarnings(as.numeric(spec[[key]]))
    if (length(value) != 1L || !is.finite(value))
      stop("Invalid saved Hyperlog parameter: ", key, call. = FALSE)
    value
  }, numeric(1))
  # Decimal boundary parameters can differ from their computed bound by one ULP.
  # Use the browser contract's bound tolerance; this does not relax value accuracy.
  within <- function(value, bound) value <= bound || value - bound <= 1e-12 * abs(p[["M"]])
  if (p[["T"]] <= 0 || p[["M"]] <= 0 || p[["W"]] <= 0 ||
      !within(p[["W"]], p[["M"]] / 2) || !within(-p[["A"]], p[["W"]]) ||
      !within(p[["A"]], p[["M"]] - 2 * p[["W"]]))
    stop("Invalid saved Hyperlog parameter domain.", call. = FALSE)
  # The native constructor tests its bounds exactly. Canonicalize only tolerated
  # floating-point overshoot before calling it (for example, 4.42 - 2 * 0.87).
  p[["W"]] <- min(p[["W"]], p[["M"]] / 2)
  p[["A"]] <- min(max(p[["A"]], -p[["W"]]), p[["M"]] - 2 * p[["W"]])
  kernel <- .gatelabr_hyperlog_kernel()
  if (!is.function(kernel))
    stop("Cannot reconstruct saved Hyperlog coordinates: flowCore's native kernel is unavailable.", call. = FALSE)
  apply_native <- function(x, inverse) {
    output <- as.double(x)
    finite <- is.finite(output)
    # Subsetting supplies a fresh vector to the native kernel and preserves the
    # caller's data; undefined values and infinite endpoints keep their meanings.
    if (any(finite)) output[finite] <- kernel(output[finite], p[["T"]], p[["W"]],
                                             p[["M"]], p[["A"]], inverse)
    output
  }
  list(forward = function(x) apply_native(x, FALSE), inverse = function(y) apply_native(y, TRUE))
}
