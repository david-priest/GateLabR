# gatingml_export.R — Export GateLabR workspace as Cytobank Gating-ML 2.0 XML

if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b

# ── Internal helpers ──────────────────────────────────────────────────────────

.gml_ex_esc <- function(s) {
  s <- gsub("&",  "&amp;",  as.character(s), fixed = TRUE)
  s <- gsub("<",  "&lt;",   s, fixed = TRUE)
  s <- gsub(">",  "&gt;",   s, fixed = TRUE)
  s <- gsub('"',  "&quot;", s, fixed = TRUE)
  s
}

.gml_ex_b64id <- function(name) {
  # Base64-encode a name; replace '=' padding with '.' to match Cytobank format
  b64 <- base64enc::base64encode(charToRaw(as.character(name)))
  gsub("=", ".", b64, fixed = TRUE)
}

.gml_ex_num <- function(x) {
  # Format with 15 significant figures (matches Java double precision)
  sprintf("%.15g", as.numeric(x))
}

.gml_ex_gate_id <- function(numeric_id, name) {
  paste0("Gate_", numeric_id, "_", .gml_ex_b64id(name))
}

# ── Transform registry builder ────────────────────────────────────────────────

# Returns list(ch_to_tr, tr_defs) where:
#   ch_to_tr: channel_name → transform_id (or NULL for no transform)
#   tr_defs:  transform_id → list(type, T, [W, M, A])
.gml_ex_build_transforms <- function(channel_names, is_flow, cofactor,
                                     logicle_w_params, scatter_cofactor_params,
                                     counts_mat) {
  log10e   <- log10(exp(1))     # ≈ 0.43429448190325176
  ch_to_tr <- list()
  tr_defs  <- list()

  if (!is_flow) {
    # CyTOF: one fasinh transform for all arcsinh-transformed channels.
    # Gating-ML 2.0 fasinh: f(x) = (arcsinh(x*sinh(M*ln10)/T) - A*ln10) / ((M+A)*ln10)
    # With M=log10(e), M*ln10=1, so f(x) = arcsinh(x*sinh(1)/T).
    # To encode arcsinh(x/cofactor): T = cofactor * sinh(1).
    gml_T <- cofactor * sinh(log10e * log(10))
    tr_id <- paste0("Tr_Arcsinh_", round(cofactor, 4))
    tr_defs[[tr_id]] <- list(type = "fasinh", T = gml_T, M = log10e, A = 0.0)
    raw_fn <- if (exists(".is_cytof_raw_channel", mode = "function")) {
      .is_cytof_raw_channel
    } else {
      function(ch) grepl("^(time|event_length|cell_length|file_number)$", ch, ignore.case = TRUE)
    }
    for (ch in channel_names) {
      ch_to_tr[[ch]] <- if (!raw_fn(ch)) tr_id else NULL
    }
  } else {
    # Flow: logicle for fluorescence channels, fasinh for scatter, none for QC
    for (ch in channel_names) {
      if (.is_qc_channel(ch)) {
        ch_to_tr[[ch]] <- NULL

      } else if (.is_scatter_channel(ch)) {
        cf_s <- 150
        if (!is.null(scatter_cofactor_params) && !is.null(scatter_cofactor_params[[ch]])) {
          v <- suppressWarnings(as.numeric(scatter_cofactor_params[[ch]]))
          if (is.finite(v) && v > 0) cf_s <- v
        }
        gml_T_s <- cf_s * sinh(log10e * log(10))
        tr_id_s <- paste0("Tr_Fasinh_", round(cf_s))
        if (is.null(tr_defs[[tr_id_s]])) {
          tr_defs[[tr_id_s]] <- list(type = "fasinh", T = gml_T_s, M = log10e, A = 0.0)
        }
        ch_to_tr[[ch]] <- tr_id_s

      } else {
        # Fluorescence: per-channel logicle
        raw_vals <- if (!is.null(counts_mat) && ch %in% colnames(counts_mat)) {
          counts_mat[, ch]
        } else NULL
        t_val <- .resolve_logicle_t(raw_vals)
        w_val <- if (!is.null(logicle_w_params) && !is.null(logicle_w_params[[ch]])) {
          max(0.1, min(suppressWarnings(as.numeric(logicle_w_params[[ch]])), 2.0))
        } else if (!is.null(raw_vals)) {
          .estimate_logicle_w(raw_vals, t_val = t_val)
        } else 0.5
        if (!is.finite(w_val)) w_val <- 0.5
        tr_id_l <- paste0("Tr_Logicle_", gsub("[^A-Za-z0-9]", "_", ch))
        tr_defs[[tr_id_l]] <- list(type = "logicle", T = t_val, W = w_val, M = 4.5, A = 0.0)
        ch_to_tr[[ch]] <- tr_id_l
      }
    }
  }
  list(ch_to_tr = ch_to_tr, tr_defs = tr_defs)
}

# ── XML-building helpers ──────────────────────────────────────────────────────

.gml_ex_scale_json <- function(channel, tr_id, cofactor, is_flow,
                                scatter_cofactor_params) {
  if (is.null(tr_id)) {
    flag <- 1L; arg <- "1"; mn <- 1.0; mx <- 1570900.0
  } else if (!is_flow) {
    # CyTOF arcsinh
    flag <- 4L; arg <- as.character(cofactor); mn <- -5.0; mx <- 12000.0
  } else if (grepl("^Tr_Logicle_", tr_id)) {
    # Flow logicle
    flag <- 5L; arg <- "4.5"; mn <- -0.5; mx <- 4.5
  } else {
    # Flow scatter arcsinh
    cf_s <- 150
    if (!is.null(scatter_cofactor_params) && !is.null(scatter_cofactor_params[[channel]])) {
      v <- suppressWarnings(as.numeric(scatter_cofactor_params[[channel]]))
      if (is.finite(v) && v > 0) cf_s <- v
    }
    flag <- 4L; arg <- as.character(cf_s); mn <- -2.0; mx <- 12.0
  }
  sprintf('{"flag":%d,"argument":"%s","min":%s,"max":%s,"bins":256,"size":256}',
          flag, arg, .gml_ex_num(mn), .gml_ex_num(mx))
}

.gml_ex_definition_json <- function(gate, x_tr, y_tr, cofactor, is_flow,
                                     scatter_cofactor_params) {
  verts  <- gate$vertices
  x_vals <- vapply(verts, function(v) as.numeric(v[[1]]), numeric(1))
  y_vals <- vapply(verts, function(v) as.numeric(v[[2]]), numeric(1))
  cx <- mean(x_vals, na.rm = TRUE)
  cy <- mean(y_vals, na.rm = TRUE)

  sx <- .gml_ex_scale_json(gate$x_channel, x_tr, cofactor, is_flow, scatter_cofactor_params)
  sy <- .gml_ex_scale_json(gate$y_channel, y_tr, cofactor, is_flow, scatter_cofactor_params)

  header <- sprintf('"scale":{"x":%s,"y":%s},"positive":false,"negative":false,"locked":false,"label":[%s,%s]',
                    sx, sy, .gml_ex_num(cx), .gml_ex_num(cy))

  if (identical(gate$gate_type, "rectangle")) {
    geom <- sprintf('"rectangle":{"x1":%s,"y1":%s,"x2":%s,"y2":%s}',
                    .gml_ex_num(min(x_vals)), .gml_ex_num(min(y_vals)),
                    .gml_ex_num(max(x_vals)), .gml_ex_num(max(y_vals)))
  } else {
    vstr <- vapply(verts, function(v) {
      sprintf("[%s,%s]", .gml_ex_num(as.numeric(v[[1]])), .gml_ex_num(as.numeric(v[[2]])))
    }, character(1))
    geom <- sprintf('"polygon":{"vertices":[%s]}', paste(vstr, collapse = ","))
  }
  paste0("{", header, ",", geom, "}")
}

# Escape for XML text content: & < > only.  Do NOT escape " — it is legal in
# text nodes and Cytobank stores raw JSON there; escaping it as &quot; produces
# text that Cytobank's JSON parser cannot read.
.gml_ex_esc_text <- function(s) {
  s <- gsub("&",  "&amp;",  as.character(s), fixed = TRUE)
  s <- gsub("<",  "&lt;",   s, fixed = TRUE)
  s <- gsub(">",  "&gt;",   s, fixed = TRUE)
  s
}

.gml_ex_custom_info <- function(name, numeric_id, gate_seq, type_str, def_json) {
  c(
    '    <data-type:custom_info>',
    '      <cytobank>',
    paste0('        <name>',      .gml_ex_esc(name), '</name>'),
    paste0('        <id>',        numeric_id, '</id>'),
    paste0('        <gate_id>',   gate_seq, '</gate_id>'),
    paste0('        <type>',      type_str, '</type>'),
    '        <version>-1</version>',
    '        <compensation_id>-2</compensation_id>',
    '        <fcs_file_id />',
    '        <tailored>false</tailored>',
    '        <tailored_per_population>false</tailored_per_population>',
    '        <tailored_per_population_gateset_id />',
    '        <fcs_file_filename />',
    '        <gating_group_id>-1</gating_group_id>',
    '        <gating_group_name>Default group</gating_group_name>',
    '        <file_sync_mode>0</file_sync_mode>',
    '        <pop_sync_mode>0</pop_sync_mode>',
    paste0('        <definition>', .gml_ex_esc_text(def_json), '</definition>'),
    '      </cytobank>',
    '    </data-type:custom_info>'
  )
}

# fcs_name: the FCS $PnN parameter name to use in data-type:name.
# Falls back to channel (the display name) when not supplied.
.gml_ex_dim <- function(channel, tr_id, min_val = NULL, max_val = NULL,
                         fcs_name = NULL, compensation_ref = "uncompensated") {
  dim_name <- if (!is.null(fcs_name)) fcs_name else channel
  tr_attr  <- if (!is.null(tr_id))   paste0(' gating:transformation-ref="', tr_id, '"') else ""
  min_attr <- if (!is.null(min_val)) paste0(' gating:min="', .gml_ex_num(min_val), '"') else ""
  max_attr <- if (!is.null(max_val)) paste0(' gating:max="', .gml_ex_num(max_val), '"') else ""
  c(
    paste0('    <gating:dimension gating:compensation-ref="', compensation_ref, '"',
           min_attr, max_attr, tr_attr, '>'),
    paste0('      <data-type:fcs-dimension data-type:name="', .gml_ex_esc(dim_name), '" />'),
    '    </gating:dimension>'
  )
}

# pnn_fn: optional function(display_channel) → FCS $PnN name.
# When supplied the data-type:fcs-dimension name attribute uses the FCS parameter
# name instead of the internal display name (Cytobank requires $PnN names).
.gml_ex_rectangle <- function(gate, gml_id, num_id, seq_idx,
                               x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params,
                               pnn_fn = NULL, comp_ref_fn = NULL) {
  verts  <- gate$vertices
  x_vals <- vapply(verts, function(v) as.numeric(v[[1]]), numeric(1))
  y_vals <- vapply(verts, function(v) as.numeric(v[[2]]), numeric(1))
  def    <- .gml_ex_definition_json(gate, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params)
  c(
    paste0('  <gating:RectangleGate gating:id="', gml_id, '">'),
    .gml_ex_custom_info(gate$name, num_id, seq_idx, "RectangleGate", def),
    .gml_ex_dim(gate$x_channel, x_tr, min(x_vals), max(x_vals),
                fcs_name = if (!is.null(pnn_fn)) pnn_fn(gate$x_channel) else NULL,
                compensation_ref = if (!is.null(comp_ref_fn)) comp_ref_fn(gate$x_channel) else "uncompensated"),
    .gml_ex_dim(gate$y_channel, y_tr, min(y_vals), max(y_vals),
                fcs_name = if (!is.null(pnn_fn)) pnn_fn(gate$y_channel) else NULL,
                compensation_ref = if (!is.null(comp_ref_fn)) comp_ref_fn(gate$y_channel) else "uncompensated"),
    '  </gating:RectangleGate>'
  )
}

.gml_ex_polygon <- function(gate, gml_id, num_id, seq_idx,
                             x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params,
                             pnn_fn = NULL, comp_ref_fn = NULL) {
  def <- .gml_ex_definition_json(gate, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params)
  vert_lines <- unlist(lapply(gate$vertices, function(v) c(
    '    <gating:vertex>',
    paste0('      <gating:coordinate data-type:value="', .gml_ex_num(as.numeric(v[[1]])), '" />'),
    paste0('      <gating:coordinate data-type:value="', .gml_ex_num(as.numeric(v[[2]])), '" />'),
    '    </gating:vertex>'
  )))
  c(
    paste0('  <gating:PolygonGate gating:id="', gml_id, '">'),
    .gml_ex_custom_info(gate$name, num_id, seq_idx, "PolygonGate", def),
    .gml_ex_dim(gate$x_channel, x_tr,
                fcs_name = if (!is.null(pnn_fn)) pnn_fn(gate$x_channel) else NULL,
                compensation_ref = if (!is.null(comp_ref_fn)) comp_ref_fn(gate$x_channel) else "uncompensated"),
    .gml_ex_dim(gate$y_channel, y_tr,
                fcs_name = if (!is.null(pnn_fn)) pnn_fn(gate$y_channel) else NULL,
                compensation_ref = if (!is.null(comp_ref_fn)) comp_ref_fn(gate$y_channel) else "uncompensated"),
    vert_lines,
    '  </gating:PolygonGate>'
  )
}

.gml_ex_transform <- function(tr_id, tr) {
  body <- if (identical(tr$type, "fasinh")) {
    sprintf('    <transforms:fasinh transforms:T="%s" transforms:M="%s" transforms:A="%s" />',
            .gml_ex_num(tr$T), .gml_ex_num(tr$M), .gml_ex_num(tr$A))
  } else if (identical(tr$type, "logicle")) {
    sprintf('    <transforms:logicle transforms:T="%s" transforms:W="%s" transforms:M="%s" transforms:A="%s" />',
            .gml_ex_num(tr$T), .gml_ex_num(tr$W), .gml_ex_num(tr$M), .gml_ex_num(tr$A))
  } else character(0)
  c(paste0('  <transforms:transformation transforms:id="', tr_id, '">'), body,
    '  </transforms:transformation>')
}

# Build a JSON blob of per-channel scale settings. Version 3 retains the legacy
# display lo/hi values and adds raw_lo/raw_hi in compensated linear measurement
# space. The raw endpoints are portable between GateLabR/flowCore and GateLab,
# whose normalized logicle display coordinates are intentionally different.
.gml_ex_build_scales_json <- function(channel_names, global_scale_ranges,
                                      logicle_w_params, scatter_cofactor_params,
                                      is_flow, cofactor, counts_mat,
                                      compensation_on, spillover_matrix) {
  gsr <- as.list(global_scale_ranges %||% list())
  wl  <- as.list(logicle_w_params %||% list())
  cf  <- as.list(scatter_cofactor_params %||% list())
  channels <- list()
  for (ch in channel_names) {
    rng   <- gsr[[ch]]
    lo    <- suppressWarnings(as.numeric(rng$lo %||% NA))
    hi    <- suppressWarnings(as.numeric(rng$hi %||% NA))
    w     <- suppressWarnings(as.numeric(wl[[ch]] %||% NA))
    cofac <- suppressWarnings(as.numeric(cf[[ch]] %||% NA))
    entry <- list()
    if (is.finite(lo))    entry$lo <- lo
    if (is.finite(hi))    entry$hi <- hi
    if (is.finite(w))     entry$w <- w
    if (is.finite(cofac)) entry$cofactor <- cofac
    if (is.finite(lo) && is.finite(hi) && hi > lo) {
      raw_range <- tryCatch({
        if (isTRUE(is_flow)) {
          raw_vals <- if (!is.null(counts_mat) && ch %in% colnames(counts_mat)) {
            counts_mat[, ch]
          } else NULL
          flow_inverse_channel_values(
            display_vals = c(lo, hi),
            channel_name = ch,
            raw_channel_vals = raw_vals,
            logicle_w_params = logicle_w_params,
            scatter_cofactor_params = scatter_cofactor_params
          )
        } else {
          raw_fn <- if (exists(".is_cytof_raw_channel", mode = "function")) {
            .is_cytof_raw_channel
          } else {
            function(x) grepl("^(time|event_length|cell_length|file_number)$", x, ignore.case = TRUE)
          }
          if (isTRUE(raw_fn(ch))) c(lo, hi) else cofactor * sinh(c(lo, hi))
        }
      }, error = function(e) c(NA_real_, NA_real_))
      if (length(raw_range) == 2L && all(is.finite(raw_range)) && raw_range[2] > raw_range[1]) {
        entry$raw_lo <- as.numeric(raw_range[1])
        entry$raw_hi <- as.numeric(raw_range[2])
      }
    }
    if (length(entry) > 0) channels[[ch]] <- entry
  }
  comp_enabled <- isTRUE(is_flow) && isTRUE(compensation_on)
  comp <- list(
    enabled = comp_enabled,
    reference = if (comp_enabled) "FCS" else "uncompensated",
    channels = character(0)
  )
  if (comp_enabled) {
    if (!is.matrix(spillover_matrix) || nrow(spillover_matrix) < 2L ||
        ncol(spillover_matrix) != nrow(spillover_matrix)) {
      stop("Compensation is enabled, but no valid spillover matrix is available for Gating-ML export.")
    }
    spill_channels <- colnames(spillover_matrix)
    row_channels <- rownames(spillover_matrix)
    if (is.null(spill_channels) || anyNA(spill_channels) || any(!nzchar(spill_channels)) ||
        anyDuplicated(spill_channels) || is.null(row_channels) ||
        !setequal(row_channels, spill_channels)) {
      stop("The active spillover matrix needs matching, unique row and column channel names for Gating-ML export.")
    }
    spillover_matrix <- spillover_matrix[spill_channels, spill_channels, drop = FALSE]
    if (any(!is.finite(spillover_matrix))) {
      stop("The active spillover matrix contains non-finite values and cannot be exported safely.")
    }
    comp$channels <- as.character(spill_channels)
    comp$matrix <- lapply(seq_len(nrow(spillover_matrix)), function(i) {
      unname(as.numeric(spillover_matrix[i, ]))
    })
  }
  state <- list(version = 3L, compensation = comp)
  if (length(channels) > 0L) state$channels <- channels
  if (!isTRUE(is_flow)) state$cytof_cofactor <- cofactor
  as.character(jsonlite::toJSON(state,
                                auto_unbox = TRUE, null = "null", digits = NA))
}

# Quadrant gates are not emitted yet. Omitting only their direct populations
# would re-parent descendants and change membership, so the whole dependent
# population branch must travel together as one explicit omission.
.gml_ex_quadrant_omissions <- function(gates, populations) {
  quadrant_ids <- names(Filter(function(g) identical(g$gate_type, "quadrant"), gates))
  population_ids <- character(0)
  add_branch <- function(pid) {
    if (pid %in% population_ids) return(invisible(NULL))
    population_ids <<- c(population_ids, pid)
    for (child_id in populations[[pid]]$children %||% character(0)) add_branch(child_id)
    invisible(NULL)
  }
  if (length(quadrant_ids) > 0L) {
    for (pid in names(populations)) {
      refs <- populations[[pid]]$gate_refs %||% list()
      if (any(vapply(refs, function(ref) ref$gate_id %in% quadrant_ids, logical(1)))) {
        add_branch(pid)
      }
    }
  }
  list(gate_ids = quadrant_ids, population_ids = population_ids)
}

# ── Main export function ──────────────────────────────────────────────────────

#' Export GateLabR workspace as Gating-ML 2.0 XML
#'
#' Gates are exported in DISPLAY coordinate space:
#'   - CyTOF: gate vertices are already in exprs (arcsinh) space; exported as-is.
#'     Metal channels reference an arcsinh (fasinh) transform; QC channels (Time
#'     etc.) have no transform-ref (raw space).
#'   - Flow: gate vertices are in raw (counts) space; forward-transformed to
#'     logicle/arcsinh display space before export.  Fluorescence channels
#'     reference a per-channel logicle transform; scatter channels reference a
#'     fasinh (arcsinh) transform; QC channels have no transform-ref.
#'
#' @param gates           rv$gates
#' @param gate_order      rv$gate_order
#' @param populations     rv$populations
#' @param root_population_id  rv$root_population_id
#' @param sce             SingleCellExperiment (used for cofactor, instrument_type)
#' @param file_path       Output .xml file path
#' @param format          "cytobank" (default) or "standard".
#'   "cytobank": writes FCS $PnN channel names, BooleanGate definition JSON,
#'               no GatingHierarchy — required for Cytobank import.
#'   "standard": writes display channel names, full GatingHierarchy,
#'               simple BooleanGates — suitable for re-import into GateLabR
#'               and other GatingML-aware tools.
#' @param logicle_w_params     Per-channel logicle W values (flow only)
#' @param scatter_cofactor_params  Per-channel scatter cofactors (flow only)
#' @param counts_mat      Raw events×channels matrix (flow only; for T estimation)
#' @param allow_quadrant_omission Explicit acknowledgement that quadrant gates
#'   and every dependent population branch will be omitted.
#' @return invisibly returns file_path
export_gatingml_to_cytobank <- function(gates, gate_order, populations,
                                        root_population_id, sce, file_path,
                                        format = c("cytobank", "standard"),
                                        logicle_w_params = NULL,
                                        scatter_cofactor_params = NULL,
                                        counts_mat = NULL,
                                        global_scale_ranges = NULL,
                                        compensation_on = FALSE,
                                        spillover_matrix = NULL,
                                        allow_quadrant_omission = FALSE) {
  format <- match.arg(format)
  cytobank_mode <- identical(format, "cytobank")
  if (!requireNamespace("base64enc", quietly = TRUE))
    stop("Package 'base64enc' is required. Install with: install.packages('base64enc')")
  if (!requireNamespace("jsonlite", quietly = TRUE))
    stop("Package 'jsonlite' is required. Install with: install.packages('jsonlite')")
  if (is.null(gates) || length(gates) == 0)
    stop("No gates to export.")

  quadrant_omissions <- .gml_ex_quadrant_omissions(gates, populations)
  if (length(quadrant_omissions$gate_ids) > 0L && !isTRUE(allow_quadrant_omission)) {
    stop(
      "This workspace contains ", length(quadrant_omissions$gate_ids),
      " unsupported quadrant gate(s) and ", length(quadrant_omissions$population_ids),
      " dependent population(s). Export again only after explicitly accepting their omission; ",
      "the .rds workspace preserves them in full."
    )
  }
  if (length(quadrant_omissions$gate_ids) > 0L) {
    warning(
      length(quadrant_omissions$gate_ids), " quadrant gate(s) and ",
      length(quadrant_omissions$population_ids),
      " dependent population(s), including descendants, were omitted from GatingML."
    )
  }

  md       <- S4Vectors::metadata(sce)
  is_flow  <- identical(md$instrument_type, "flow")
  cofactor <- suppressWarnings(as.numeric(md$cofactor %||% 5))
  if (!is.finite(cofactor) || cofactor <= 0) cofactor <- 5
  ch_names <- rownames(sce)

  # Build a function that maps internal display channel names → the name used in
  # data-type:fcs-dimension.
  # Cytobank mode: must use FCS $PnN parameter names (e.g. "Y89Di"), not display
  #   labels ("89Y_CD45"), because Cytobank matches channels by $PnN.
  # Standard mode: keep display names so the file round-trips into GateLabR.
  ch_to_pnn_map <- as.list(md$channel_to_pnn %||% list())
  pnn_fn <- if (cytobank_mode) {
    function(ch) {
      v <- ch_to_pnn_map[[ch]]
      if (!is.null(v) && nzchar(v)) as.character(v) else as.character(ch)
    }
  } else {
    function(ch) as.character(ch)   # standard: keep display name
  }

  # ── Transform registry ──────────────────────────────────────────────────────
  tr_reg   <- .gml_ex_build_transforms(ch_names, is_flow, cofactor,
                                        logicle_w_params, scatter_cofactor_params,
                                        counts_mat)
  ch_to_tr <- tr_reg$ch_to_tr
  tr_defs  <- tr_reg$tr_defs

  # Per-channel scale settings (display Min/Max range + logicle W + cofactor),
  # saved into the root custom_info block so GateLabR can restore them on import.
  scales_json <- .gml_ex_build_scales_json(ch_names, global_scale_ranges,
                                           logicle_w_params, scatter_cofactor_params,
                                           is_flow, cofactor, counts_mat,
                                           compensation_on, spillover_matrix)
  spill_channels <- if (isTRUE(is_flow) && isTRUE(compensation_on) &&
                        is.matrix(spillover_matrix)) colnames(spillover_matrix) else character(0)
  comp_ref_fn <- function(ch) {
    if (ch %in% spill_channels) "FCS" else "uncompensated"
  }

  # ── Gate vertices in display (export) space ─────────────────────────────────
  # Flow: gates stored in raw space → forward-transform to logicle/arcsinh space.
  # CyTOF: gates already in exprs space → use as-is.
  if (is_flow && !is.null(counts_mat) && ncol(counts_mat) > 0) {
    display_gates <- lapply(gates, function(g) {
      g$vertices <- flow_forward_vertices(
        vertices              = g$vertices,
        x_channel             = g$x_channel,
        y_channel             = g$y_channel,
        raw_mat               = counts_mat,
        channel_names         = colnames(counts_mat),
        logicle_w_params      = logicle_w_params,
        scatter_cofactor_params = scatter_cofactor_params
      )
      g
    })
  } else {
    display_gates <- gates
  }

  # ── Assign numeric IDs to gates ─────────────────────────────────────────────
  gate_to_gml_id   <- list()   # app gate_id → GML element id string
  gate_numeric_ids <- list()   # app gate_id → integer
  gate_seq_ids     <- list()   # app gate_id → sequential index (used in <gate_id> and definition JSON)

  for (i in seq_along(gate_order)) {
    gid <- gate_order[[i]]
    if (is.null(display_gates[[gid]])) next
    # Quadrant gates have no GatingML 2.0 representation here yet — skip them so
    # they get no id; populations referencing them are filtered out below (the
    # workspace .rds still preserves quadrant gates in full).
    if (identical(display_gates[[gid]]$gate_type, "quadrant")) {
      next
    }
    num_id               <- 180000000L + i
    gate_numeric_ids[[gid]] <- num_id
    gate_to_gml_id[[gid]]   <- .gml_ex_gate_id(num_id, display_gates[[gid]]$name)
    gate_seq_ids[[gid]]      <- i
  }
  # ── Build gate XML lines ─────────────────────────────────────────────────────
  gate_lines <- character(0)
  for (i in seq_along(gate_order)) {
    gid <- gate_order[[i]]
    g   <- display_gates[[gid]]
    if (is.null(g)) next
    gml_id <- gate_to_gml_id[[gid]]
    num_id <- gate_numeric_ids[[gid]]
    x_tr   <- ch_to_tr[[g$x_channel]] %||% NULL
    y_tr   <- ch_to_tr[[g$y_channel]] %||% NULL

    if (identical(g$gate_type, "rectangle")) {
      gate_lines <- c(gate_lines, .gml_ex_rectangle(
        g, gml_id, num_id, i, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params,
        pnn_fn = pnn_fn, comp_ref_fn = comp_ref_fn))
    } else if (identical(g$gate_type, "polygon")) {
      gate_lines <- c(gate_lines, .gml_ex_polygon(
        g, gml_id, num_id, i, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params,
        pnn_fn = pnn_fn, comp_ref_fn = comp_ref_fn))
    }
  }

  # ── Process populations: build BooleanGates + GatingHierarchy ───────────────
  # Pass 1: assign gate_set_id (sequential) and GateSet element IDs to every
  # population that has at least one valid gate ref.  We need these IDs before
  # building XML because child populations reference parent GateSet IDs.
  pop_bool_num    <- list()   # pop_id → bool_num (integer)
  pop_bool_gml_id <- list()   # pop_id → "GateSet_NNNNNNNN"
  pop_to_gml      <- list()   # pop_id → gml_id  (used for hierarchy in standard mode)
  next_bool_id    <- 36000000L

  export_population_ids <- setdiff(names(populations), quadrant_omissions$population_ids)
  for (pid in export_population_ids) {
    if (identical(pid, root_population_id)) next
    pop       <- populations[[pid]]
    gate_refs <- pop$gate_refs %||% list()
    valid     <- Filter(function(r) !is.null(gate_to_gml_id[[r$gate_id]]), gate_refs)
    if (length(valid) == 0) next

    bool_num <- next_bool_id
    next_bool_id <- next_bool_id + 1L
    pop_bool_num[[pid]]    <- bool_num
    pop_bool_gml_id[[pid]] <- paste0("GateSet_", bool_num)
    pop_to_gml[[pid]]      <- pop_bool_gml_id[[pid]]
  }

  # Pass 2: build XML
  bool_lines <- character(0)

  for (pid in export_population_ids) {
    if (identical(pid, root_population_id)) next
    pop       <- populations[[pid]]
    gate_refs <- pop$gate_refs %||% list()
    valid     <- Filter(function(r) !is.null(gate_to_gml_id[[r$gate_id]]), gate_refs)
    if (length(valid) == 0) next

    bool_num    <- pop_bool_num[[pid]]
    bool_gml_id <- pop_bool_gml_id[[pid]]

    # Locate nearest ancestor that itself has a BooleanGate (non-root parent)
    parent_bool_num    <- NULL
    parent_bool_gml_id <- NULL
    walk_id <- pop$parent_id
    while (!is.null(walk_id) && !identical(walk_id, root_population_id)) {
      if (!is.null(pop_bool_gml_id[[walk_id]])) {
        parent_bool_num    <- pop_bool_num[[walk_id]]
        parent_bool_gml_id <- pop_bool_gml_id[[walk_id]]
        break
      }
      walk_id <- populations[[walk_id]]$parent_id
    }

    if (cytobank_mode) {
      # ── Cytobank format ─────────────────────────────────────────────────────
      # Build gateReference lines for own gates
      own_ref_lines <- if (length(valid) == 1) {
        gr   <- valid[[1]]
        comp <- if (!isTRUE(gr$include)) ' gating:complement="true"' else ""
        orig <- gate_to_gml_id[[gr$gate_id]]
        c(paste0('      <gating:gateReference gating:ref="', orig, '"', comp, ' />'))
      } else {
        vapply(valid, function(gr) {
          comp <- if (!isTRUE(gr$include)) ' gating:complement="true"' else ""
          paste0('      <gating:gateReference gating:ref="', gate_to_gml_id[[gr$gate_id]], '"', comp, ' />')
        }, character(1))
      }

      # Append parent GateSet reference if this population has a non-root parent
      if (!is.null(parent_bool_gml_id)) {
        parent_ref <- paste0('      <gating:gateReference gating:ref="', parent_bool_gml_id, '" />')
        ref_lines <- c(own_ref_lines, parent_ref)
      } else {
        ref_lines <- own_ref_lines
      }

      # GatingML requires ≥2 refs in <gating:and> — pad single-ref lists
      if (length(ref_lines) == 1) {
        ref_lines <- c(
          ref_lines,
          '      <!-- Single-gate root population: ref twice (GatingML requires ≥2 args for "and") -->',
          ref_lines[[1]]
        )
      }

      # Definition JSON — own gate seq_ids + optional parent pop reference
      all_seq   <- vapply(valid, function(gr) gate_seq_ids[[gr$gate_id]], integer(1))
      neg_seq   <- all_seq[!vapply(valid, function(gr) isTRUE(gr$include), logical(1))]
      expr_parts <- vapply(valid, function(gr) {
        sid <- gate_seq_ids[[gr$gate_id]]
        if (isTRUE(gr$include)) paste0("gate_", sid) else paste0("NOT gate_", sid)
      }, character(1))
      if (!is.null(parent_bool_num)) {
        # pop_N uses the gate_set_id (1-based offset from 36000000)
        parent_gs_id <- parent_bool_num - 36000000L + 1L
        expr_parts <- c(expr_parts, paste0("pop_", parent_gs_id))
      }
      bool_expr <- paste(expr_parts, collapse = " AND ")
      bool_def_json <- sprintf(
        '{"gates":[%s],"negGates":[%s],"tailoredPerPopulation":{},"booleanExpression":"%s"}',
        paste(all_seq, collapse = ","),
        paste(neg_seq, collapse = ","),
        bool_expr
      )

      bool_lines <- c(bool_lines,
        paste0('  <gating:BooleanGate gating:id="', bool_gml_id, '">'),
        '    <data-type:custom_info>',
        '      <cytobank>',
        paste0('        <name>',        .gml_ex_esc(pop$name), '</name>'),
        paste0('        <id>',          bool_num, '</id>'),
        paste0('        <gate_set_id>', bool_num - 36000000L + 1L, '</gate_set_id>'),
        '        <version>-1</version>',
        '        <tailored>false</tailored>',
        '        <tailored_per_population>false</tailored_per_population>',
        '        <compensation_id>0</compensation_id>',
        '        <gating_group_id>-1</gating_group_id>',
        '        <gating_group_name>Default group</gating_group_name>',
        paste0('        <definition>', .gml_ex_esc_text(bool_def_json), '</definition>'),
        '      </cytobank>',
        '    </data-type:custom_info>',
        '    <gating:and>',
        ref_lines,
        '    </gating:and>',
        '  </gating:BooleanGate>'
      )

    } else {
      # ── Standard format ─────────────────────────────────────────────────────
      # Only populations with multiple gates need a BooleanGate; single-gate
      # populations reference the gate element directly in the GatingHierarchy.
      # This keeps the file clean and round-trips back into GateLabR cleanly.
      if (length(valid) > 1) {
        ref_lines <- vapply(valid, function(gr) {
          comp <- if (!isTRUE(gr$include)) ' gating:complement="true"' else ""
          paste0('      <gating:gateReference gating:ref="', gate_to_gml_id[[gr$gate_id]], '"', comp, ' />')
        }, character(1))

        bool_lines <- c(bool_lines,
          paste0('  <gating:BooleanGate gating:id="', bool_gml_id, '">'),
          '    <data-type:custom_info>',
          '      <cytobank>',
          paste0('        <name>', .gml_ex_esc(pop$name), '</name>'),
          paste0('        <id>',   bool_num, '</id>'),
          '        <version>-1</version>',
          '      </cytobank>',
          '    </data-type:custom_info>',
          '    <gating:and>',
          ref_lines,
          '    </gating:and>',
          '  </gating:BooleanGate>'
        )
      } else {
        # Single-gate: point directly at the underlying gate element
        gr <- valid[[1]]
        pop_to_gml[[pid]] <- paste0(
          gate_to_gml_id[[gr$gate_id]],
          if (!isTRUE(gr$include)) "|complement" else ""
        )
      }
    }
  }

  # ── GatingHierarchy (standard mode only) ────────────────────────────────────
  hier_lines <- character(0)
  if (!cytobank_mode) {
    .build_pair <- function(pid, indent) {
      ref_raw <- pop_to_gml[[pid]]
      if (is.null(ref_raw)) return(character(0))
      pop   <- populations[[pid]]
      comp  <- if (grepl("\\|complement$", ref_raw)) ' gating:complement="true"' else ""
      gref  <- sub("\\|complement$", "", ref_raw)
      out   <- c(
        paste0(indent, '<gating:PopulationGatePair gating:gate-ref="', gref, '"', comp, '>'),
        paste0(indent, '  <gating:name>', .gml_ex_esc(pop$name), '</gating:name>')
      )
      for (child_id in pop$children %||% character(0)) {
        out <- c(out, .build_pair(child_id, paste0(indent, "  ")))
      }
      c(out, paste0(indent, '</gating:PopulationGatePair>'))
    }
    root_pop <- populations[[root_population_id]]
    for (child_id in root_pop$children %||% character(0)) {
      hier_lines <- c(hier_lines, .build_pair(child_id, "    "))
    }
  }

  # ── Assemble and write ───────────────────────────────────────────────────────
  schema_loc <- paste(
    "http://www.isac-net.org/std/Gating-ML/v2.0/gating",
    "http://flowcyt.sourceforge.net/gating/2.0/xsd/Gating-ML.v2.0.xsd",
    "http://www.isac-net.org/std/Gating-ML/v2.0/transformations",
    "http://flowcyt.sourceforge.net/gating/2.0/xsd/Transformations.v2.0.xsd",
    "http://www.isac-net.org/std/Gating-ML/v2.0/datatypes",
    "http://flowcyt.sourceforge.net/gating/2.0/xsd/DataTypes.v2.0.xsd"
  )

  about_str <- if (cytobank_mode) {
    "Gating-ML 2.0 export from GateLabR (Cytobank-compatible)"
  } else {
    "Gating-ML 2.0 export from GateLabR (standard / re-importable)"
  }

  all_lines <- c(
    '<?xml version="1.0" encoding="UTF-8"?>',
    paste0('<gating:Gating-ML',
           ' xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"',
           ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
           ' xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"',
           ' xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes"',
           ' xsi:schemaLocation="', schema_loc, '">'),
    '  <data-type:custom_info>',
    '    <cytobank>',
    paste0('      <about>', .gml_ex_esc(about_str), '</about>'),
    paste0('      <export_timestamp>', format(Sys.time(), "%Y-%m-%dT%H:%M:%S"), '</export_timestamp>'),
    '    </cytobank>',
    '    <gatelabr_scales>',
    paste0('      <definition>', .gml_ex_esc_text(scales_json), '</definition>'),
    '    </gatelabr_scales>',
    '  </data-type:custom_info>',
    # Transform definitions
    unlist(lapply(names(tr_defs), function(id) .gml_ex_transform(id, tr_defs[[id]]))),
    # Gate elements
    gate_lines,
    # BooleanGates (one per population in Cytobank mode; multi-gate pops only in standard)
    bool_lines,
    # GatingHierarchy (standard mode only — encodes population tree + include/exclude)
    if (length(hier_lines) > 0) c('  <gating:GatingHierarchy>', hier_lines, '  </gating:GatingHierarchy>') else character(0),
    '</gating:Gating-ML>'
  )

  writeLines(all_lines, con = file_path, useBytes = FALSE)
  message("GatingML exported [", format, "]: ", length(gates), " gate(s) → ", file_path)
  invisible(file_path)
}
