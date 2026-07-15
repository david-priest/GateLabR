# workspace.R — Save/load gating workspace to/from SCE metadata

.workspace_error <- function(detail) {
  stop("Invalid GateLabR workspace: ", detail, call. = FALSE)
}

.workspace_coordinate_pairs_valid <- function(value, min_rows) {
  if (is.data.frame(value)) value <- as.matrix(value)
  if (is.matrix(value)) {
    return(ncol(value) == 2L && nrow(value) >= min_rows &&
             is.numeric(value) && all(is.finite(value)))
  }
  if (!is.list(value) || length(value) < min_rows) return(FALSE)
  all(vapply(value, function(pair) {
    is.numeric(pair) && length(pair) == 2L && all(is.finite(pair))
  }, logical(1)))
}

#' Fill backward-compatible graph fields without repairing topology
normalize_workspace_graph <- function(workspace) {
  if (!is.list(workspace)) return(workspace)
  if (is.null(workspace$gate_order) && is.list(workspace$gates)) {
    workspace$gate_order <- names(workspace$gates)
    if (is.null(workspace$gate_order)) workspace$gate_order <- character(0)
  }
  workspace
}

#' Validate all gate references and population-tree links in a workspace
#'
#' Gating graph corruption changes event membership, so this deliberately fails
#' instead of dropping dangling references or guessing at parent/child links.
validate_workspace_graph <- function(workspace) {
  workspace <- normalize_workspace_graph(workspace)
  if (!is.list(workspace)) .workspace_error("the workspace payload is not a list.")
  required <- c("gates", "gate_order", "populations", "root_population_id")
  missing_fields <- setdiff(required, names(workspace))
  if (length(missing_fields)) {
    .workspace_error(paste0("missing required field(s): ", paste(missing_fields, collapse = ", "), "."))
  }

  gates <- workspace$gates
  if (!is.list(gates)) .workspace_error("gates must be a named list keyed by gate_id.")
  gate_ids <- names(gates)
  if (is.null(gate_ids)) gate_ids <- character(0)
  if (length(gates) && (length(gate_ids) != length(gates) || any(!nzchar(gate_ids)) || anyDuplicated(gate_ids))) {
    .workspace_error("gates must have unique, non-empty list names.")
  }

  for (gid in gate_ids) {
    gate <- gates[[gid]]
    if (!is.list(gate)) .workspace_error(sprintf("gate '%s' is not a list.", gid))
    if (!is.character(gate$gate_id) || length(gate$gate_id) != 1L || !identical(gate$gate_id, gid)) {
      .workspace_error(sprintf("gate map key '%s' does not match its gate_id.", gid))
    }
    if (!is.character(gate$name) || length(gate$name) != 1L || !nzchar(trimws(gate$name))) {
      .workspace_error(sprintf("gate '%s' has no name.", gid))
    }
    if (!is.character(gate$x_channel) || length(gate$x_channel) != 1L || !nzchar(gate$x_channel) ||
        !is.character(gate$y_channel) || length(gate$y_channel) != 1L || !nzchar(gate$y_channel)) {
      .workspace_error(sprintf("gate '%s' has invalid channel identifiers.", gid))
    }
    if (!is.character(gate$gate_type) || length(gate$gate_type) != 1L ||
        !gate$gate_type %in% c("polygon", "rectangle", "quadrant")) {
      .workspace_error(sprintf("gate '%s' has an unsupported gate_type.", gid))
    }
    if (identical(gate$gate_type, "polygon") &&
        !.workspace_coordinate_pairs_valid(gate$vertices, 3L)) {
      .workspace_error(sprintf("polygon gate '%s' has invalid geometry.", gid))
    }
    if (identical(gate$gate_type, "rectangle") &&
        !.workspace_coordinate_pairs_valid(gate$vertices, 2L)) {
      .workspace_error(sprintf("rectangle gate '%s' has invalid geometry.", gid))
    }
    if (identical(gate$gate_type, "quadrant") &&
        (!is.numeric(gate$center) || length(gate$center) != 2L || !all(is.finite(gate$center)))) {
      .workspace_error(sprintf("quadrant gate '%s' has an invalid center.", gid))
    }
  }

  gate_order <- workspace$gate_order
  if (!is.character(gate_order)) .workspace_error("gate_order must be a character vector of gate IDs.")
  if (anyDuplicated(gate_order)) .workspace_error("gate_order contains duplicate IDs.")
  missing_order <- setdiff(gate_ids, gate_order)
  unknown_order <- setdiff(gate_order, gate_ids)
  if (length(missing_order) || length(unknown_order)) {
    detail <- c(
      if (length(missing_order)) paste0("missing: ", paste(missing_order, collapse = ", ")),
      if (length(unknown_order)) paste0("unknown: ", paste(unknown_order, collapse = ", "))
    )
    .workspace_error(paste0("gate_order does not match the gate list (", paste(detail, collapse = "; "), ")."))
  }

  populations <- workspace$populations
  if (!is.list(populations) || length(populations) == 0L) {
    .workspace_error("populations must be a non-empty named list.")
  }
  pop_ids <- names(populations)
  if (is.null(pop_ids) || length(pop_ids) != length(populations) ||
      any(!nzchar(pop_ids)) || anyDuplicated(pop_ids)) {
    .workspace_error("populations must have unique, non-empty list names.")
  }
  root_id <- workspace$root_population_id
  if (!is.character(root_id) || length(root_id) != 1L || !nzchar(root_id) || !root_id %in% pop_ids) {
    .workspace_error("root_population_id is missing or does not identify a population.")
  }

  for (pid in pop_ids) {
    pop <- populations[[pid]]
    if (!is.list(pop)) .workspace_error(sprintf("population '%s' is not a list.", pid))
    if (!is.character(pop$population_id) || length(pop$population_id) != 1L ||
        !identical(pop$population_id, pid)) {
      .workspace_error(sprintf("population map key '%s' does not match its population_id.", pid))
    }
    if (!is.character(pop$name) || length(pop$name) != 1L || !nzchar(trimws(pop$name))) {
      .workspace_error(sprintf("population '%s' has no name.", pid))
    }
    if (!is.character(pop$gate_logic) || length(pop$gate_logic) != 1L ||
        !pop$gate_logic %in% c("and", "or")) {
      .workspace_error(sprintf("population '%s' has invalid gate_logic.", pid))
    }
    if (!is.character(pop$children)) {
      .workspace_error(sprintf("population '%s' has invalid children.", pid))
    }
    if (anyDuplicated(pop$children)) {
      .workspace_error(sprintf("population '%s' lists a child more than once.", pid))
    }
    if (!is.list(pop$gate_refs)) {
      .workspace_error(sprintf("population '%s' has invalid gate_refs.", pid))
    }

    if (identical(pid, root_id)) {
      if (!is.null(pop$parent_id)) .workspace_error("the root population must have parent_id = NULL.")
      if (length(pop$gate_refs)) .workspace_error("the root population cannot contain gate references.")
    } else {
      if (!is.character(pop$parent_id) || length(pop$parent_id) != 1L || !pop$parent_id %in% pop_ids) {
        .workspace_error(sprintf("population '%s' has a missing parent.", pid))
      }
      if (identical(pop$parent_id, pid)) .workspace_error(sprintf("population '%s' cannot be its own parent.", pid))
    }

    for (child_id in pop$children) {
      if (!child_id %in% pop_ids) {
        .workspace_error(sprintf("population '%s' refers to missing child '%s'.", pid, child_id))
      }
      if (!identical(populations[[child_id]]$parent_id, pid)) {
        .workspace_error(sprintf("parent/child links disagree for population '%s'.", child_id))
      }
    }

    for (ref in pop$gate_refs) {
      if (!is.list(ref) || !is.character(ref$gate_id) || length(ref$gate_id) != 1L ||
          !ref$gate_id %in% gate_ids) {
        .workspace_error(sprintf("population '%s' has a dangling gate reference.", pid))
      }
      if (!is.logical(ref$include) || length(ref$include) != 1L || is.na(ref$include)) {
        .workspace_error(sprintf("population '%s' has a gate reference without a boolean include value.", pid))
      }
      gate <- gates[[ref$gate_id]]
      if (identical(gate$gate_type, "quadrant")) {
        q <- ref$quadrant
        if (!is.numeric(q) || length(q) != 1L || !is.finite(q) || q != as.integer(q) || !q %in% 1:4) {
          .workspace_error(sprintf("population '%s' has an invalid quadrant reference.", pid))
        }
      } else if (!is.null(ref$quadrant)) {
        .workspace_error(sprintf("population '%s' assigns a quadrant to a non-quadrant gate.", pid))
      }
    }
  }

  for (pid in setdiff(pop_ids, root_id)) {
    parent_id <- populations[[pid]]$parent_id
    if (!pid %in% populations[[parent_id]]$children) {
      .workspace_error(sprintf("population '%s' is absent from its parent's children list.", pid))
    }
  }

  # Follow parent chains independently so a disconnected cycle is identified as
  # a cycle rather than merely as an unreachable branch.
  for (pid in pop_ids) {
    seen <- character(0)
    current <- pid
    while (!is.null(current)) {
      if (current %in% seen) .workspace_error(sprintf("population hierarchy contains a cycle at '%s'.", current))
      seen <- c(seen, current)
      current <- populations[[current]]$parent_id
    }
  }

  reached <- character(0)
  queue <- root_id
  while (length(queue)) {
    current <- queue[[1]]
    queue <- queue[-1]
    if (current %in% reached) next
    reached <- c(reached, current)
    queue <- c(queue, populations[[current]]$children)
  }
  unreachable <- setdiff(pop_ids, reached)
  if (length(unreachable)) {
    .workspace_error(paste0("population hierarchy contains unreachable nodes: ",
                            paste(unreachable, collapse = ", "), "."))
  }
  invisible(TRUE)
}

#' Save the gating workspace into SCE metadata
#' @return The modified SCE object
save_workspace <- function(sce, gates, gate_order, populations,
                           root_population_id,
                           gate_value_space = "display",
                           cytof_axis_range = list(),
                           global_scale_ranges = list(),
                           plot_range_override = NULL,
                           illust_pop_palette = list(),
                           illust_pop_selected = NULL,
                           illust_settings = NULL,
                           illust_presets = list(),
                           division_profiles = list(),
                           division_channel = NULL,
                           division_xrange = NULL,
                           division_bins = NULL,
                           division_subsample = NULL,
                           division_ymarker = NULL,
                           division_point_alpha = NULL,
                           division_col_name = NULL) {
  workspace <- list(
    gates = gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = root_population_id,
    gate_value_space = gate_value_space,
    cytof_axis_range = cytof_axis_range,
    global_scale_ranges = global_scale_ranges,
    plot_range_override = plot_range_override,
    illust_pop_palette = illust_pop_palette,
    illust_pop_selected = illust_pop_selected,
    illust_settings = illust_settings,
    illust_presets = illust_presets,
    division_profiles = division_profiles,
    division_channel = division_channel,
    division_xrange = division_xrange,
    division_bins = division_bins,
    division_subsample = division_subsample,
    division_ymarker = division_ymarker,
    division_point_alpha = division_point_alpha,
    division_col_name = division_col_name,
    version = 3L,
    saved_at = as.character(Sys.time())
  )
  validate_workspace_graph(workspace)
  S4Vectors::metadata(sce)$gating_workspace <- workspace
  sce
}

#' Load a gating workspace from SCE metadata
#' @return The workspace list, or NULL if none found
load_workspace <- function(sce) {
  ws <- S4Vectors::metadata(sce)$gating_workspace
  if (is.null(ws)) return(NULL)
  ws <- normalize_workspace_graph(ws)
  tryCatch({
    validate_workspace_graph(ws)
    ws
  }, error = function(e) {
    warning(conditionMessage(e), "; ignoring saved workspace.", call. = FALSE)
    NULL
  })
}

#' Check whether an SCE has a saved workspace
has_workspace <- function(sce) {
  !is.null(S4Vectors::metadata(sce)$gating_workspace)
}

#' Validate workspace channels against current SCE
#' Returns list of invalid gate IDs (channels not found)
validate_workspace_channels <- function(workspace, channel_names) {
  invalid_gates <- character(0)
  for (gid in names(workspace$gates)) {
    gate <- workspace$gates[[gid]]
    if (!gate$x_channel %in% channel_names || !gate$y_channel %in% channel_names) {
      invalid_gates <- c(invalid_gates, gid)
    }
  }
  invalid_gates
}

#' Remove channel-incompatible gates without changing surviving population logic
#'
#' Any population that references an invalid gate, plus its descendants, is removed
#' as one branch. Keeping the population after deleting only one of several AND/OR
#' references would silently change which events it represents.
prune_workspace_for_channels <- function(workspace, channel_names) {
  workspace <- normalize_workspace_graph(workspace)
  validate_workspace_graph(workspace)
  invalid_gates <- validate_workspace_channels(workspace, channel_names)
  if (!length(invalid_gates)) {
    return(list(workspace = workspace, invalid_gate_ids = character(0),
                removed_population_ids = character(0)))
  }

  populations <- workspace$populations
  root_id <- workspace$root_population_id
  seeds <- names(Filter(function(pop) {
    any(vapply(pop$gate_refs, function(ref) ref$gate_id %in% invalid_gates, logical(1)))
  }, populations))
  if (root_id %in% seeds) .workspace_error("the root population depends on a channel-incompatible gate.")

  removed <- character(0)
  queue <- seeds
  while (length(queue)) {
    pid <- queue[[1]]
    queue <- queue[-1]
    if (pid %in% removed || is.null(populations[[pid]])) next
    removed <- c(removed, pid)
    queue <- c(queue, populations[[pid]]$children)
  }

  keep_ids <- setdiff(names(populations), removed)
  workspace$populations <- populations[keep_ids]
  workspace$populations <- lapply(workspace$populations, function(pop) {
    pop$children <- pop$children[pop$children %in% keep_ids]
    pop
  })
  workspace$gates <- workspace$gates[setdiff(names(workspace$gates), invalid_gates)]
  workspace$gate_order <- workspace$gate_order[workspace$gate_order %in% names(workspace$gates)]
  if (!is.null(workspace$illust_pop_selected)) {
    workspace$illust_pop_selected <- intersect(as.character(workspace$illust_pop_selected), keep_ids)
  }
  if (is.list(workspace$illust_pop_palette) && !is.null(names(workspace$illust_pop_palette))) {
    workspace$illust_pop_palette <- workspace$illust_pop_palette[
      intersect(names(workspace$illust_pop_palette), keep_ids)
    ]
  }
  validate_workspace_graph(workspace)
  list(workspace = workspace, invalid_gate_ids = invalid_gates,
       removed_population_ids = removed)
}

#' Export a population as a colData column in the SCE
#' Applies the gating strategy to ALL cells, regardless of what was displayed
#' @return The modified SCE object
export_population_to_coldata <- function(sce, population_id, pop_name,
                                         gates, populations,
                                         root_population_id,
                                         assay_name = "exprs",
                                         col_name   = NULL,
                                         in_label   = "TRUE",
                                         out_label  = "FALSE",
                                         gating_data = NULL,
                                         gate_value_space = NULL) {
  assay_data <- gating_matrix_for_sce(
    sce,
    assay_name = assay_name,
    gate_value_space = gate_value_space,
    gating_data = gating_data
  )

  # Run full gating strategy
  result <- apply_gating_strategy(gates, populations, root_population_id,
                                  assay_data)
  pop_mask <- result$masks[[population_id]]

  if (is.null(pop_mask)) {
    stop("Population '", pop_name, "' not found in gating results.")
  }

  # Derive column name if not supplied
  if (is.null(col_name) || !nzchar(trimws(col_name))) {
    col_name <- gsub("[^A-Za-z0-9_]", "_", trimws(pop_name))
    col_name <- gsub("_+", "_", col_name)
    col_name <- sub("^_|_$", "", col_name)
    if (!nzchar(col_name)) col_name <- "population"
  }

  # Always reset the column first so repeated exports with the same name
  # never carry stale levels/assignments from a previous gating definition.
  SummarizedExperiment::colData(sce)[[col_name]] <- NULL
  SummarizedExperiment::colData(sce)[[col_name]] <- factor(
    pop_mask,
    levels = c(TRUE, FALSE),
    labels = c(in_label, out_label)
  )

  message("Exported population '", pop_name, "' as colData column '", col_name,
          "' (", in_label, " / ", out_label, ")")
  sce
}

# ── Division profiling helpers (pure; used by the Division tab) ────────────────

#' Seed N division-gate boundaries from a dye-channel value vector.
#'
#' Models CFSE/CellTrace dilution as evenly-spaced peaks on the dye axis: it finds
#' the brightest (undivided, Div0) peak, estimates the inter-division spacing from
#' the median gap between prominent density peaks (falling back to a fraction of
#' the bulk range), then places boundaries at the VALLEYS between successive
#' division peaks (p0 - spacing/2, p0 - 3·spacing/2, …), anchored on the bright end.
#' The Division tab lets the user drag/nudge afterwards, so this just needs to be a
#' good starting point. Returns a sorted-ascending numeric vector.
seed_division_boundaries <- function(values, n = 6) {
  values <- values[is.finite(values)]
  n <- as.integer(n)
  if (length(values) < 10L || n < 1L) return(numeric(0))
  qs <- stats::quantile(values, c(0.01, 0.99), names = FALSE)
  lo <- qs[1]; hi <- qs[2]; span <- hi - lo
  d <- tryCatch(stats::density(values, n = 1024), error = function(e) NULL)
  # brightest (undivided) peak p0 = rightmost prominent density peak (else hi);
  # detected = median gap between prominent peaks (a clean dilution ladder)
  p0 <- hi; detected <- NA_real_
  if (!is.null(d) && is.finite(span) && span > 0) {
    dy <- d$y
    is_peak <- c(FALSE, diff(sign(diff(dy))) < 0, FALSE)
    pk_x <- d$x[is_peak]; pk_y <- dy[is_peak]
    if (length(pk_x)) {
      keep <- pk_y >= 0.05 * max(dy); pk_x <- pk_x[keep]; pk_y <- pk_y[keep]
    }
    if (length(pk_x)) p0 <- max(pk_x)
    if (length(pk_x) >= 2L) {
      gaps <- diff(sort(pk_x)); gaps <- gaps[gaps > 0.04 * span]
      if (length(gaps)) detected <- stats::median(gaps)
    }
  }
  if (!is.finite(span) || span <= 0) return(sort(p0 - 0.5 * (seq_len(n) - 0.5)))
  # "fit" spacing spreads N boundaries from just below p0 down to ~lo, so they all
  # land within the data. Use the detected peak spacing ONLY when it is finer than
  # the fit (a real ladder) — never coarser, which would shove most gates off the
  # dim end / off-screen (the bug on broad, heavily-divided smears).
  fit_sp <- (p0 - lo) / n
  if (!is.finite(fit_sp) || fit_sp <= 0) fit_sp <- span / (n + 2L)
  spacing <- if (is.finite(detected) && detected > 0 && detected <= fit_sp) detected else fit_sp
  sort(p0 - spacing * (seq_len(n) - 0.5))
}

#' Assign each cell an integer division level from sorted boundaries.
#'
#' Div0 = brightest (above the top boundary). With N boundaries, levels run 0..N.
assign_division_levels <- function(expr, boundaries) {
  b <- sort(boundaries[is.finite(boundaries)])
  if (!length(b)) return(rep(0L, length(expr)))
  as.integer(length(b) - findInterval(expr, b))
}

#' Write a per-cell division-level vector as an ordered colData factor.
#'
#' Thin writer: the caller computes the integer level vector (0 = Div0 = brightest)
#' in DISPLAY space — see the Division tab — and passes it here. `NA` marks cells
#' in samples for which no boundaries were set. Levels are ordered
#' Div0 < Div1 < ... < Div`n_levels`. The column is reset first so repeated writes
#' never carry stale levels. Returns the modified SCE.
write_division_coldata <- function(sce, levels, n_levels, col_name = "div") {
  if (length(levels) != ncol(sce)) {
    stop("division level vector length (", length(levels),
         ") != number of cells (", ncol(sce), ").")
  }
  hi <- suppressWarnings(max(as.numeric(levels), na.rm = TRUE))
  if (!is.finite(hi)) hi <- 0
  n_levels <- max(as.integer(n_levels), as.integer(hi), 0L)
  labs <- paste0("Div", 0:n_levels)
  SummarizedExperiment::colData(sce)[[col_name]] <- NULL
  SummarizedExperiment::colData(sce)[[col_name]] <- factor(
    ifelse(is.na(levels), NA_character_, paste0("Div", levels)),
    levels = labs, ordered = TRUE
  )
  sce
}
