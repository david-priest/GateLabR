# coldata_overlay.R -- categorical colData columns served to the GateLab core for "Colour by".
#
# The dataset payload names every colData column so the export dialog can warn about collisions,
# but it carries no values: a large SCE holds many annotation columns and none belongs in the
# payload up front. A column that can colour a plot is advertised with its level count, and its
# values travel only when the user chooses it, in the same per-sample form the categorical
# export uses in the other direction (one byte per event indexing the levels, 255 for missing,
# and a single constant code for a sample with one value).

# The levels a column would be coloured by, or NULL when it cannot be: a factor keeps its declared
# levels in order (so a palette fixed in an analysis lines up), a character column is sorted, a
# logical is FALSE / TRUE. More than 254 levels cannot be coded in a byte and would not be
# distinguishable on a plot anyway.
.gatelabr_categorical_levels <- function(values) {
  levels <- if (is.factor(values)) {
    levels(values)
  } else if (is.logical(values)) {
    c("FALSE", "TRUE")
  } else if (is.character(values)) {
    sort(unique(values[!is.na(values)]))
  } else {
    return(NULL)
  }
  if (length(levels) == 0L || length(levels) > 254L || anyNA(levels)) return(NULL)
  levels
}

.gatelabr_categorical_coldata_columns <- function(sce) {
  cd <- SummarizedExperiment::colData(sce)
  out <- list()
  for (name in colnames(cd)) {
    levels <- .gatelabr_categorical_levels(cd[[name]])
    if (is.null(levels)) next
    out[[length(out) + 1L]] <- list(name = name, levelCount = length(levels))
  }
  out
}

.gatelabr_read_host_categorical_coldata <- function(
    sce,
    column_name,
    sample_column = NULL) {
  column_name <- as.character(column_name)
  if (length(column_name) != 1L || is.na(column_name) || !nzchar(column_name)) {
    stop("A colData column name is required.", call. = FALSE)
  }
  cd <- SummarizedExperiment::colData(sce)
  if (!column_name %in% colnames(cd)) {
    stop("colData has no column '", column_name, "'.", call. = FALSE)
  }
  values <- cd[[column_name]]
  levels <- .gatelabr_categorical_levels(values)
  if (is.null(levels)) {
    stop(
      "colData column '", column_name, "' cannot colour a plot: it must be a factor, ",
      "character or logical column with at most 254 levels.",
      call. = FALSE
    )
  }
  codes <- match(as.character(values), levels) - 1L
  codes[is.na(codes)] <- 255L

  partition <- .gatelabr_sample_partition(sce, sample_column, include_metadata = FALSE)
  sample_values <- lapply(seq_along(partition$samples), function(index) {
    rows <- partition$event_indices[[index]]
    sample_codes <- codes[rows]
    entry <- list(
      sampleId = partition$samples[[index]]$id,
      eventCount = length(rows)
    )
    if (length(rows) > 0L && length(unique(sample_codes)) == 1L) {
      entry$constantCode <- sample_codes[[1]]
    } else {
      entry$codesBase64 <- base64enc::base64encode(as.raw(sample_codes))
    }
    entry
  })

  # A palette fixed by the analysis rides along when it names every level, so the plot in the app
  # and the figures made in R agree on which colour is which cluster.
  palette <- S4Vectors::metadata(sce)$gatelab_palettes[[column_name]]
  colors <- if (is.character(palette) && !is.null(names(palette)) &&
                all(levels %in% names(palette))) {
    unname(palette[levels])
  } else {
    NULL
  }

  # I() keeps a one-level column an array in the JSON Shiny sends, where auto-unboxing would
  # otherwise turn it into a bare string.
  result <- list(
    columnName = column_name,
    levels = I(levels),
    sampleValues = sample_values
  )
  if (!is.null(colors)) result$colors <- I(colors)
  list(sce = sce, result = result)
}
