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
    # CyTOF: one fasinh transform; metal channels reference it, QC channels don't
    tr_id <- paste0("Tr_Arcsinh_", round(cofactor, 4))
    tr_defs[[tr_id]] <- list(type = "fasinh", T = cofactor, M = log10e, A = 0.0)
    for (ch in channel_names) {
      ch_to_tr[[ch]] <- if (.is_metal_channel(ch)) tr_id else NULL
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
        tr_id_s <- paste0("Tr_Fasinh_", round(cf_s))
        if (is.null(tr_defs[[tr_id_s]])) {
          tr_defs[[tr_id_s]] <- list(type = "fasinh", T = cf_s, M = log10e, A = 0.0)
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
    paste0('        <definition>', .gml_ex_esc(def_json), '</definition>'),
    '      </cytobank>',
    '    </data-type:custom_info>'
  )
}

.gml_ex_dim <- function(channel, tr_id, min_val = NULL, max_val = NULL) {
  tr_attr  <- if (!is.null(tr_id))   paste0(' gating:transformation-ref="', tr_id, '"') else ""
  min_attr <- if (!is.null(min_val)) paste0(' gating:min="', .gml_ex_num(min_val), '"') else ""
  max_attr <- if (!is.null(max_val)) paste0(' gating:max="', .gml_ex_num(max_val), '"') else ""
  c(
    paste0('    <gating:dimension gating:compensation-ref="FCS"', min_attr, max_attr, tr_attr, '>'),
    paste0('      <data-type:fcs-dimension data-type:name="', .gml_ex_esc(channel), '" />'),
    '    </gating:dimension>'
  )
}

.gml_ex_rectangle <- function(gate, gml_id, num_id, seq_idx,
                               x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params) {
  verts  <- gate$vertices
  x_vals <- vapply(verts, function(v) as.numeric(v[[1]]), numeric(1))
  y_vals <- vapply(verts, function(v) as.numeric(v[[2]]), numeric(1))
  def    <- .gml_ex_definition_json(gate, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params)
  c(
    paste0('  <gating:RectangleGate gating:id="', gml_id, '">'),
    .gml_ex_custom_info(gate$name, num_id, seq_idx, "RectangleGate", def),
    .gml_ex_dim(gate$x_channel, x_tr, min(x_vals), max(x_vals)),
    .gml_ex_dim(gate$y_channel, y_tr, min(y_vals), max(y_vals)),
    '  </gating:RectangleGate>'
  )
}

.gml_ex_polygon <- function(gate, gml_id, num_id, seq_idx,
                             x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params) {
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
    .gml_ex_dim(gate$x_channel, x_tr),
    .gml_ex_dim(gate$y_channel, y_tr),
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

# ── Main export function ──────────────────────────────────────────────────────

#' Export GateLabR workspace as Cytobank Gating-ML 2.0 XML
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
#' @param logicle_w_params     Per-channel logicle W values (flow only)
#' @param scatter_cofactor_params  Per-channel scatter cofactors (flow only)
#' @param counts_mat      Raw events×channels matrix (flow only; for T estimation)
#' @return invisibly returns file_path
export_gatingml_to_cytobank <- function(gates, gate_order, populations,
                                        root_population_id, sce, file_path,
                                        logicle_w_params = NULL,
                                        scatter_cofactor_params = NULL,
                                        counts_mat = NULL) {
  if (!requireNamespace("base64enc", quietly = TRUE))
    stop("Package 'base64enc' is required. Install with: install.packages('base64enc')")
  if (is.null(gates) || length(gates) == 0)
    stop("No gates to export.")

  md       <- S4Vectors::metadata(sce)
  is_flow  <- identical(md$instrument_type, "flow")
  cofactor <- suppressWarnings(as.numeric(md$cofactor %||% 5))
  if (!is.finite(cofactor) || cofactor <= 0) cofactor <- 5
  ch_names <- rownames(sce)

  # ── Transform registry ──────────────────────────────────────────────────────
  tr_reg   <- .gml_ex_build_transforms(ch_names, is_flow, cofactor,
                                        logicle_w_params, scatter_cofactor_params,
                                        counts_mat)
  ch_to_tr <- tr_reg$ch_to_tr
  tr_defs  <- tr_reg$tr_defs

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

  for (i in seq_along(gate_order)) {
    gid <- gate_order[[i]]
    if (is.null(display_gates[[gid]])) next
    num_id               <- 180000000L + i
    gate_numeric_ids[[gid]] <- num_id
    gate_to_gml_id[[gid]]   <- .gml_ex_gate_id(num_id, display_gates[[gid]]$name)
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
        g, gml_id, num_id, i, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params))
    } else if (identical(g$gate_type, "polygon")) {
      gate_lines <- c(gate_lines, .gml_ex_polygon(
        g, gml_id, num_id, i, x_tr, y_tr, cofactor, is_flow, scatter_cofactor_params))
    }
  }

  # ── Process populations: build BooleanGates for multi-gate populations ──────
  bool_lines   <- character(0)
  pop_to_gml   <- list()   # pop_id → list(gml_id, complement)
  next_bool_id <- 36000000L

  for (pid in names(populations)) {
    if (identical(pid, root_population_id)) next
    pop       <- populations[[pid]]
    gate_refs <- pop$gate_refs %||% list()
    valid     <- Filter(function(r) !is.null(gate_to_gml_id[[r$gate_id]]), gate_refs)
    if (length(valid) == 0) next

    if (length(valid) == 1) {
      gr <- valid[[1]]
      pop_to_gml[[pid]] <- list(
        gml_id     = gate_to_gml_id[[gr$gate_id]],
        complement = !isTRUE(gr$include)
      )
    } else {
      # Multiple gate refs → AND BooleanGate
      bool_num <- next_bool_id
      next_bool_id <- next_bool_id + 1L
      bool_gml_id  <- paste0("GateSet_", bool_num)

      ref_lines <- vapply(valid, function(gr) {
        comp <- if (!isTRUE(gr$include)) ' gating:complement="true"' else ""
        paste0('      <gating:gateReference gating:ref="', gate_to_gml_id[[gr$gate_id]], '"', comp, ' />')
      }, character(1))

      bool_lines <- c(bool_lines,
        paste0('  <gating:BooleanGate gating:id="', bool_gml_id, '">'),
        '    <data-type:custom_info>',
        '      <cytobank>',
        paste0('        <name>',         .gml_ex_esc(pop$name), '</name>'),
        paste0('        <id>',           bool_num, '</id>'),
        paste0('        <gate_set_id>',  bool_num - 36000000L + 1L, '</gate_set_id>'),
        '        <version>-1</version>',
        '        <tailored>false</tailored>',
        '        <tailored_per_population>false</tailored_per_population>',
        '        <compensation_id>0</compensation_id>',
        '        <gating_group_id>-1</gating_group_id>',
        '        <gating_group_name>Default group</gating_group_name>',
        '      </cytobank>',
        '    </data-type:custom_info>',
        '    <gating:and>',
        ref_lines,
        '    </gating:and>',
        '  </gating:BooleanGate>'
      )
      pop_to_gml[[pid]] <- list(gml_id = bool_gml_id, complement = FALSE)
    }
  }

  # ── Recursive GatingHierarchy builder ───────────────────────────────────────
  .build_pair <- function(pid, indent) {
    info <- pop_to_gml[[pid]]
    if (is.null(info)) return(character(0))
    pop  <- populations[[pid]]
    comp <- if (isTRUE(info$complement)) ' gating:complement="true"' else ""
    out  <- c(
      paste0(indent, '<gating:PopulationGatePair gating:gate-ref="', info$gml_id, '"', comp, '>'),
      paste0(indent, '  <gating:name>', .gml_ex_esc(pop$name), '</gating:name>')
    )
    for (child_id in pop$children %||% character(0)) {
      out <- c(out, .build_pair(child_id, paste0(indent, "  ")))
    }
    c(out, paste0(indent, '</gating:PopulationGatePair>'))
  }

  root_pop       <- populations[[root_population_id]]
  hier_lines     <- character(0)
  for (child_id in root_pop$children %||% character(0)) {
    hier_lines <- c(hier_lines, .build_pair(child_id, "    "))
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
    '      <about>Gating-ML 2.0 export from GateLabR</about>',
    paste0('      <export_timestamp>', format(Sys.time(), "%Y-%m-%dT%H:%M:%S"), '</export_timestamp>'),
    '    </cytobank>',
    '  </data-type:custom_info>',
    # Transform definitions
    unlist(lapply(names(tr_defs), function(id) .gml_ex_transform(id, tr_defs[[id]]))),
    # Gate elements
    gate_lines,
    # BooleanGates (multi-gate populations)
    bool_lines,
    # Population hierarchy
    if (length(hier_lines) > 0) c('  <gating:GatingHierarchy>', hier_lines, '  </gating:GatingHierarchy>') else character(0),
    '</gating:Gating-ML>'
  )

  writeLines(all_lines, con = file_path, useBytes = FALSE)
  message("GatingML exported: ", length(gates), " gate(s) → ", file_path)
  invisible(file_path)
}
