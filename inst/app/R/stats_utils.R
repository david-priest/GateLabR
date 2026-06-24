# stats_utils.R — Population statistics computation for the Statistics tab

#' Compute per-population, per-channel statistics
#'
#' @param assay_data     matrix (events x channels) in display coordinates
#' @param raw_data       matrix (events x channels) of raw/untransformed counts
#'                       (used for MFI computations); falls back to assay_data
#' @param populations    named list of population objects
#' @param root_pop_id    root population ID
#' @param pop_masks      named list: pop_id -> logical mask
#' @param channels       character vector of channels to compute stats for
#' @param stat_types     character vector from: "count", "pct_parent", "pct_total",
#'                       "median", "mean", "geomean", "sd", "cv"
#' @param sample_mask    optional logical mask for sample filtering
#' @return data.frame with one row per population, columns for each requested stat
compute_population_stats <- function(assay_data,
                                     raw_data = NULL,
                                     populations,
                                     root_pop_id,
                                     pop_masks,
                                     channels,
                                     stat_types = c("count", "pct_parent", "median"),
                                     sample_mask = NULL) {
  if (is.null(raw_data)) raw_data <- assay_data

  # Get ordered list of population IDs (tree order within the selected subset)
  pop_ids <- sort_pop_ids_tree(populations, root_pop_id)
  # Ensure all selected populations are included even if root isn't selected
  missing <- setdiff(names(populations), pop_ids)
  pop_ids <- c(pop_ids, missing)
  pop_ids <- pop_ids[pop_ids %in% names(populations)]

  # Total events (root, with sample mask)
  root_mask <- pop_masks[[root_pop_id]]
  if (!is.null(sample_mask) && !is.null(root_mask)) root_mask <- root_mask & sample_mask
  n_total <- if (!is.null(root_mask)) sum(root_mask) else nrow(assay_data)

  rows <- list()
  for (pid in pop_ids) {
    pop  <- populations[[pid]]
    if (is.null(pop)) next
    mask <- pop_masks[[pid]]
    if (!is.null(sample_mask) && !is.null(mask)) mask <- mask & sample_mask

    n_events <- if (!is.null(mask)) sum(mask) else nrow(assay_data)

    # Percent of parent
    pct_parent <- NA_real_
    if (!identical(pid, root_pop_id) && !is.null(pop$parent_id)) {
      parent_mask <- pop_masks[[pop$parent_id]]
      if (!is.null(sample_mask) && !is.null(parent_mask)) parent_mask <- parent_mask & sample_mask
      parent_n <- if (!is.null(parent_mask)) sum(parent_mask) else nrow(assay_data)
      if (parent_n > 0) pct_parent <- round(n_events / parent_n * 100, 2)
    } else {
      pct_parent <- 100
    }

    # Percent of total
    pct_total <- if (n_total > 0) round(n_events / n_total * 100, 2) else NA_real_

    # Build the base row
    row <- list(
      Population = pop$name,
      pop_id     = pid
    )
    if ("count"      %in% stat_types) row$Count        <- n_events
    if ("pct_parent" %in% stat_types) row$`% Parent`   <- pct_parent
    if ("pct_total"  %in% stat_types) row$`% Total`    <- pct_total

    # Per-channel statistics (use raw data for meaningful MFI values)
    if (n_events > 0 && !is.null(mask) && any(mask)) {
      pop_raw <- raw_data[mask, , drop = FALSE]
      for (ch in channels) {
        if (!ch %in% colnames(pop_raw)) next
        vals <- pop_raw[, ch]
        vals <- vals[is.finite(vals)]
        if ("median"  %in% stat_types) row[[paste0(ch, " Median")]]  <- round(median(vals, na.rm = TRUE), 1)
        if ("mean"    %in% stat_types) row[[paste0(ch, " Mean")]]    <- round(mean(vals, na.rm = TRUE), 1)
        if ("geomean" %in% stat_types) {
          pos_vals <- vals[vals > 0]
          row[[paste0(ch, " GeoMean")]] <- if (length(pos_vals) > 0) {
            round(exp(mean(log(pos_vals))), 1)
          } else NA_real_
        }
        if ("sd"      %in% stat_types) row[[paste0(ch, " SD")]]     <- round(sd(vals, na.rm = TRUE), 1)
        if ("cv"      %in% stat_types) {
          m <- mean(vals, na.rm = TRUE)
          s <- sd(vals, na.rm = TRUE)
          row[[paste0(ch, " CV%")]] <- if (is.finite(m) && m != 0) round(s / abs(m) * 100, 1) else NA_real_
        }
      }
    } else {
      # No events — fill with NA
      for (ch in channels) {
        if (!ch %in% colnames(raw_data)) next
        if ("median"  %in% stat_types) row[[paste0(ch, " Median")]]  <- NA_real_
        if ("mean"    %in% stat_types) row[[paste0(ch, " Mean")]]    <- NA_real_
        if ("geomean" %in% stat_types) row[[paste0(ch, " GeoMean")]] <- NA_real_
        if ("sd"      %in% stat_types) row[[paste0(ch, " SD")]]      <- NA_real_
        if ("cv"      %in% stat_types) row[[paste0(ch, " CV%")]]     <- NA_real_
      }
    }

    rows[[length(rows) + 1]] <- row
  }

  # Convert list of lists to data.frame
  if (length(rows) == 0) return(data.frame())
  all_cols <- unique(unlist(lapply(rows, names)))
  df <- as.data.frame(
    lapply(all_cols, function(col) {
      vals <- lapply(rows, function(r) r[[col]] %||% NA)
      if (col %in% c("Population", "pop_id")) {
        as.character(unlist(vals))
      } else {
        as.numeric(unlist(vals))
      }
    }),
    stringsAsFactors = FALSE
  )
  colnames(df) <- all_cols
  # Drop the internal pop_id column
  df$pop_id <- NULL
  df
}

#' Walk population tree and return IDs in depth-first order
sort_pop_ids_tree <- function(populations, root_id) {
  result <- character(0)
  walk <- function(pid) {
    result <<- c(result, pid)
    pop <- populations[[pid]]
    if (!is.null(pop) && length(pop$children) > 0) {
      for (child_id in pop$children) walk(child_id)
    }
  }
  walk(root_id)
  result
}
