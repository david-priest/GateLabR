# gatingml_import.R — Cytobank Gating-ML 2.0 import for gates + populations

if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b

.gml_local_name <- function(node) {
  nm <- xml2::xml_name(node)
  sub("^.*[}:]", "", nm)
}

.gml_attr_local <- function(node, local_name) {
  attrs <- xml2::xml_attrs(node)
  if (length(attrs) == 0) return(NULL)
  nm <- names(attrs)
  base <- sub("^.*[}:]", "", nm)
  idx <- which(base == local_name)
  if (length(idx) == 0) return(NULL)
  unname(attrs[[idx[1]]])
}

.gml_children_local <- function(node, local_name) {
  kids <- xml2::xml_children(node)
  keep <- vapply(kids, function(k) identical(.gml_local_name(k), local_name), logical(1))
  kids[keep]
}

.gml_first_child_local <- function(node, local_name) {
  kids <- .gml_children_local(node, local_name)
  if (length(kids) == 0) return(NULL)
  kids[[1]]
}

.gml_num <- function(x) {
  suppressWarnings(as.numeric(x))
}

.gml_has_num <- function(x) {
  length(x) == 1L && !is.na(x) && is.finite(x)
}

.gml_parse_cytobank_name <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(NULL)
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(NULL)
  nm <- .gml_first_child_local(cb, "name")
  if (is.null(nm)) return(NULL)
  txt <- trimws(xml2::xml_text(nm))
  if (nchar(txt) == 0) NULL else txt
}

.gml_parse_cytobank_definition <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(NULL)
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(NULL)
  def <- .gml_first_child_local(cb, "definition")
  if (is.null(def)) return(NULL)
  txt <- trimws(xml2::xml_text(def))
  if (nchar(txt) == 0) return(NULL)
  tryCatch(jsonlite::fromJSON(txt), error = function(e) NULL)
}

.gml_parse_pop_parent_indices <- function(node) {
  defn <- .gml_parse_cytobank_definition(node)
  if (is.null(defn) || is.null(defn$booleanExpression)) return(integer(0))
  expr <- as.character(defn$booleanExpression)
  if (length(expr) == 0 || !nzchar(expr)) return(integer(0))
  hits <- regmatches(expr, gregexpr("\\bpop_([0-9]+)\\b", expr, perl = TRUE))[[1]]
  if (length(hits) == 0) return(integer(0))
  suppressWarnings(as.integer(sub("^pop_", "", hits)))
}

.gml_parse_transforms <- function(root_node) {
  out <- list()
  for (el in xml2::xml_children(root_node)) {
    if (!identical(.gml_local_name(el), "transformation")) next
    tr_id <- .gml_attr_local(el, "id")
    if (is.null(tr_id) || !nzchar(tr_id)) next

    # logicle transform (GateLabR flow export and FlowJo/BD exports)
    logicle_el <- .gml_first_child_local(el, "logicle")
    if (!is.null(logicle_el)) {
      t_v <- .gml_num(.gml_attr_local(logicle_el, "T"))
      w_v <- .gml_num(.gml_attr_local(logicle_el, "W"))
      m_v <- .gml_num(.gml_attr_local(logicle_el, "M"))
      a_v <- .gml_num(.gml_attr_local(logicle_el, "A"))
      if (.gml_has_num(t_v) && .gml_has_num(w_v)) {
        out[[tr_id]] <- list(
          type = "logicle",
          T    = t_v,
          W    = w_v,
          M    = if (.gml_has_num(m_v)) m_v else 4.5,
          A    = if (.gml_has_num(a_v)) a_v else 0.0
        )
        next
      }
    }

    # fasinh / arcsinh — store T as a plain scalar (backward-compatible)
    fasinh  <- .gml_first_child_local(el, "fasinh")
    arcsinh <- .gml_first_child_local(el, "arcsinh")
    t_val   <- NULL
    if (!is.null(fasinh))  t_val <- .gml_num(.gml_attr_local(fasinh,  "T"))
    if (!.gml_has_num(t_val)) {
      if (!is.null(arcsinh)) t_val <- .gml_num(.gml_attr_local(arcsinh, "T"))
    }
    if (.gml_has_num(t_val)) out[[tr_id]] <- t_val
  }
  out
}

.gml_parse_dimensions <- function(gate_node) {
  dims <- list()
  for (dim in .gml_children_local(gate_node, "dimension")) {
    param <- .gml_first_child_local(dim, "fcs-dimension")
    if (is.null(param)) param <- .gml_first_child_local(dim, "parameter")
    if (is.null(param)) next
    ch <- .gml_attr_local(param, "name")
    if (is.null(ch) || !nzchar(ch)) next
    d <- list(channel = ch)

    tr_ref <- .gml_attr_local(dim, "transformation-ref")
    if (!is.null(tr_ref) && nzchar(tr_ref)) d$transformation_ref <- tr_ref

    mn <- .gml_num(.gml_attr_local(dim, "min"))
    mx <- .gml_num(.gml_attr_local(dim, "max"))
    if (.gml_has_num(mn)) d$min <- mn
    if (.gml_has_num(mx)) d$max <- mx

    if (is.null(d$min) || is.null(d$max)) {
      for (sub_el in xml2::xml_children(dim)) {
        tag <- .gml_local_name(sub_el)
        if (!tag %in% c("min", "max")) next
        val <- .gml_num(.gml_attr_local(sub_el, "value"))
        if (!.gml_has_num(val)) next
        if (identical(tag, "min") && is.null(d$min)) d$min <- val
        if (identical(tag, "max") && is.null(d$max)) d$max <- val
      }
    }
    dims[[length(dims) + 1L]] <- d
  }
  dims
}

.gml_normalize_channel <- function(ch) {
  s <- trimws(ch)
  s <- gsub("[()]", "", s)
  s <- gsub("Di", "", s, ignore.case = TRUE)

  # Prefer isotope-like tokens found anywhere in the label, e.g.
  # "CD3 (Y89Di)" -> y89, "140Ce_Beads" -> ce140.
  all_hits <- unlist(regmatches(s, gregexpr("[A-Za-z]{1,3}[0-9]{2,3}|[0-9]{2,3}[A-Za-z]{1,3}", s, perl = TRUE)))
  if (length(all_hits) > 0) {
    for (tok in all_hits) {
      if (grepl("^[A-Za-z]{1,3}[0-9]{2,3}$", tok, perl = TRUE)) {
        parts <- regmatches(tok, regexec("^([A-Za-z]{1,3})([0-9]{2,3})$", tok, perl = TRUE))[[1]]
        if (length(parts) >= 3) return(paste0(tolower(parts[2]), parts[3]))
      }
      if (grepl("^[0-9]{2,3}[A-Za-z]{1,3}$", tok, perl = TRUE)) {
        parts <- regmatches(tok, regexec("^([0-9]{2,3})([A-Za-z]{1,3})$", tok, perl = TRUE))[[1]]
        if (length(parts) >= 3) return(paste0(tolower(parts[3]), parts[2]))
      }
    }
  }

  compact <- gsub("[^A-Za-z0-9]", "", s)
  m1 <- regexec("^([A-Za-z]{1,3})([0-9]{2,3})$", compact, perl = TRUE)
  p1 <- regmatches(compact, m1)[[1]]
  if (length(p1) >= 3) return(paste0(tolower(p1[2]), p1[3]))

  m2 <- regexec("^([0-9]{2,3})([A-Za-z]{1,3})$", compact, perl = TRUE)
  p2 <- regmatches(compact, m2)[[1]]
  if (length(p2) >= 3) return(paste0(tolower(p2[3]), p2[2]))

  tolower(gsub("[^a-z0-9]", "", ch))
}

.gml_guess_pnn_map_from_channels <- function(session_channels) {
  if (is.null(session_channels) || length(session_channels) == 0) return(list())
  out <- list()

  for (ch in session_channels) {
    text <- as.character(ch)
    hits <- unlist(regmatches(text, gregexpr("[A-Za-z]{1,3}[0-9]{2,3}Di|[0-9]{2,3}[A-Za-z]{1,3}Di|[A-Za-z]{1,3}[0-9]{2,3}|[0-9]{2,3}[A-Za-z]{1,3}", text, perl = TRUE)))
    if (length(hits) == 0) next
    for (tok in hits) {
      tok_clean <- gsub("[^A-Za-z0-9]", "", tok)
      if (!nzchar(tok_clean)) next
      out[[tok_clean]] <- text
      out[[gsub("Di$", "", tok_clean, ignore.case = TRUE)]] <- text
    }
  }

  if (length(out) == 0) return(list())
  out[!duplicated(names(out))]
}

.gml_resolve_channel <- function(ch, session_channels, pnn_to_channel = NULL) {
  if (ch %in% session_channels) return(ch)

  if (is.list(pnn_to_channel) || is.vector(pnn_to_channel)) {
    mapped <- NULL
    if (!is.null(names(pnn_to_channel)) && ch %in% names(pnn_to_channel)) {
      mapped <- unname(pnn_to_channel[[ch]])
    }
    if (!is.null(mapped) && mapped %in% session_channels) return(mapped)
  }

  low_map <- setNames(session_channels, tolower(session_channels))
  key_ci <- tolower(ch)
  ci <- if (key_ci %in% names(low_map)) unname(low_map[[key_ci]]) else NULL
  if (!is.null(ci) && nzchar(ci)) return(ci)

  norm_map <- setNames(session_channels, vapply(session_channels, .gml_normalize_channel, character(1)))
  nn <- .gml_normalize_channel(ch)
  nm <- if (nn %in% names(norm_map)) unname(norm_map[[nn]]) else NULL
  if (!is.null(nm) && nzchar(nm)) return(nm)

  NULL
}

.gml_make_inverter <- function(resolved_channel, trans_ref, transforms_map) {
  if (is.null(trans_ref) || !nzchar(trans_ref)) return(function(v) v)
  if (is.null(resolved_channel) || !nzchar(resolved_channel)) return(function(v) v)

  # CyTOF metal channels: gate coordinates are stored in exprs (arcsinh) space,
  # so no inversion is needed — return identity.
  is_signal <- if (exists(".is_metal_channel", mode = "function")) {
    isTRUE(.is_metal_channel(resolved_channel))
  } else {
    grepl("([0-9]{2,3}[A-Za-z]{1,2}|[A-Za-z]{1,2}[0-9]{2,3})", resolved_channel)
  }
  if (is_signal) return(function(v) v)

  # QC / instrument channels: always raw space, no inversion.
  if (grepl("^(time|event_length|cell_length|barcode)$", resolved_channel, ignore.case = TRUE)) {
    return(function(v) v)
  }

  tr_def <- transforms_map[[trans_ref]]
  if (is.null(tr_def)) return(function(v) v)

  # Logicle transform (from GateLabR flow export or FlowJo): apply logicle inverse.
  if (is.list(tr_def) && identical(tr_def$type, "logicle")) {
    t_v <- tr_def$T;  w_v <- tr_def$W
    m_v <- tr_def$M %||% 4.5;  a_v <- tr_def$A %||% 0.0
    if (!is.finite(t_v) || !is.finite(w_v) || t_v <= 0 || w_v < 0) return(function(v) v)
    return(function(v) {
      if (!requireNamespace("flowCore", quietly = TRUE)) return(v)
      tryCatch({
        lg     <- flowCore::logicleTransform("lg_fwd", w = w_v, t = t_v, m = m_v, a = a_v)
        inv_lg <- flowCore::inverseLogicleTransform(lg, transformationId = "lg_inv")
        as.numeric(inv_lg(as.numeric(v)))
      }, error = function(e) as.numeric(v))
    })
  }

  # fasinh / arcsinh: inverse is T * sinh(v)
  cf <- suppressWarnings(as.numeric(if (is.list(tr_def)) tr_def$T else tr_def))
  if (!.gml_has_num(cf) || cf <= 0) return(function(v) v)
  function(v) cf * sinh(v)
}

.gml_parse_gate_node <- function(node) {
  loc <- .gml_local_name(node)
  gml_id <- .gml_attr_local(node, "id")
  nm <- .gml_attr_local(node, "name")
  if (is.null(nm) || !nzchar(nm)) nm <- .gml_parse_cytobank_name(node)
  if (is.null(nm) || !nzchar(nm)) nm <- gml_id %||% uuid::UUIDgenerate()

  if (identical(loc, "RectangleGate")) {
    dims <- .gml_parse_dimensions(node)
    if (length(dims) < 2) return(NULL)
    x <- dims[[1]]
    y <- dims[[2]]

    xlo <- if (!is.null(x$min) && is.finite(x$min)) x$min else -1e9
    xhi <- if (!is.null(x$max) && is.finite(x$max)) x$max else 1e9
    ylo <- if (!is.null(y$min) && is.finite(y$min)) y$min else -1e9
    yhi <- if (!is.null(y$max) && is.finite(y$max)) y$max else 1e9

    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "rectangle",
      x_channel = x$channel,
      y_channel = y$channel,
      vertices = list(c(xlo, ylo), c(xhi, ylo), c(xhi, yhi), c(xlo, yhi)),
      channels = c(x$channel, y$channel),
      dims = dims
    ))
  }

  if (identical(loc, "PolygonGate")) {
    dims <- .gml_parse_dimensions(node)
    if (length(dims) < 2) return(NULL)

    verts <- list()
    for (v in .gml_children_local(node, "vertex")) {
      coords <- .gml_children_local(v, "coordinate")
      if (length(coords) < 2) next
      xv <- .gml_num(.gml_attr_local(coords[[1]], "value"))
      yv <- .gml_num(.gml_attr_local(coords[[2]], "value"))
      if (.gml_has_num(xv) && .gml_has_num(yv)) {
        verts[[length(verts) + 1L]] <- c(xv, yv)
      }
    }
    if (length(verts) < 3) return(NULL)

    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "polygon",
      x_channel = dims[[1]]$channel,
      y_channel = dims[[2]]$channel,
      vertices = verts,
      channels = c(dims[[1]]$channel, dims[[2]]$channel),
      dims = dims
    ))
  }

  if (identical(loc, "BooleanGate")) {
    op_el <- NULL
    op <- NULL
    for (kid in xml2::xml_children(node)) {
      kid_loc <- .gml_local_name(kid)
      if (kid_loc %in% c("and", "or", "not")) {
        op_el <- kid
        op <- kid_loc
        break
      }
    }
    if (is.null(op_el) || is.null(op)) return(NULL)

    refs <- list()
    for (r in .gml_children_local(op_el, "gateReference")) {
      rid <- .gml_attr_local(r, "ref")
      if (is.null(rid) || !nzchar(rid)) next
      comp <- identical(tolower(.gml_attr_local(r, "complement") %||% "false"), "true")
      refs[[length(refs) + 1L]] <- list(gate_id = rid, complement = comp)
    }

    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "boolean",
      operation = op,
      refs = refs,
      channels = character(0),
      pop_parent_indices = .gml_parse_pop_parent_indices(node)
    ))
  }

  NULL
}

.gml_default_label_offset <- function(vertices) {
  if (is.null(vertices) || length(vertices) == 0) return(c(0, 0))
  ys <- suppressWarnings(vapply(vertices, function(v) as.numeric(v[[2]]), numeric(1)))
  ys <- ys[is.finite(ys)]
  if (length(ys) == 0) return(c(0, 0))

  y_centroid <- mean(ys)
  y_max <- max(ys)
  y_min <- min(ys)
  gate_height <- max(0, y_max - y_min)
  # Place label just above the gate at horizontal center.
  c(0, (y_max - y_centroid) + max(0.15, gate_height * 0.08))
}

#' Import Cytobank Gating-ML 2.0 into GateLabR gate/population structures
#'
#' @param file_path Path to Gating-ML XML file
#' @param session_channels Character vector of available channel names in current SCE
#' @param pnn_to_channel Optional named mapping of FCS $PnN -> display channel name
#' @return List with gates, gate_order, populations, root_population_id and import stats
import_gatingml_from_cytobank <- function(file_path,
                                          session_channels,
                                          pnn_to_channel = NULL) {
  if (!requireNamespace("xml2", quietly = TRUE)) {
    stop("Package 'xml2' is required for Gating-ML import. Install with: install.packages('xml2')")
  }
  if (is.null(file_path) || !file.exists(file_path)) {
    stop("Gating-ML file not found.")
  }
  if (is.null(session_channels) || length(session_channels) == 0) {
    stop("No session channels available; load an SCE first.")
  }

  doc <- xml2::read_xml(file_path)
  root <- xml2::xml_root(doc)
  top_nodes <- xml2::xml_children(root)

  transforms_map <- .gml_parse_transforms(root)

  raw_gates <- list()
  bool_order <- character(0)
  hierarchy_node <- NULL

  for (el in top_nodes) {
    loc <- .gml_local_name(el)
    if (identical(loc, "GatingHierarchy") && is.null(hierarchy_node)) {
      hierarchy_node <- el
      next
    }
    g <- .gml_parse_gate_node(el)
    if (is.null(g) || is.null(g$gml_id) || !nzchar(g$gml_id)) next
    raw_gates[[g$gml_id]] <- g
    if (identical(g$gate_type, "boolean")) bool_order <- c(bool_order, g$gml_id)
  }

  gml_to_app <- list()
  app_gates <- list()
  gate_order <- character(0)
  n_skipped <- 0L

  for (gml_id in names(raw_gates)) {
    g <- raw_gates[[gml_id]]
    if (identical(g$gate_type, "boolean")) next

    channels <- unique(g$channels)
    resolved <- lapply(channels, function(ch) .gml_resolve_channel(ch, session_channels, pnn_to_channel))
    names(resolved) <- channels
    if (any(vapply(resolved, is.null, logical(1)))) {
      n_skipped <- n_skipped + 1L
      next
    }

    x_ch <- unname(resolved[[g$x_channel]])
    y_ch <- unname(resolved[[g$y_channel]])
    if (is.null(x_ch) || is.null(y_ch)) {
      n_skipped <- n_skipped + 1L
      next
    }

    x_tr <- if (length(g$dims) >= 1) g$dims[[1]]$transformation_ref %||% NULL else NULL
    y_tr <- if (length(g$dims) >= 2) g$dims[[2]]$transformation_ref %||% NULL else NULL
    inv_x <- .gml_make_inverter(x_ch, x_tr, transforms_map)
    inv_y <- .gml_make_inverter(y_ch, y_tr, transforms_map)

    verts <- lapply(g$vertices, function(v) c(inv_x(as.numeric(v[1])), inv_y(as.numeric(v[2]))))
    if (length(verts) < 3 && identical(g$gate_type, "polygon")) {
      n_skipped <- n_skipped + 1L
      next
    }

    app_id <- uuid::UUIDgenerate()
    gate <- list(
      gate_id = app_id,
      name = g$name,
      gate_type = g$gate_type,
      x_channel = x_ch,
      y_channel = y_ch,
      vertices = verts,
      color = next_gate_color(length(app_gates)),
      label_offset = .gml_default_label_offset(verts)
    )

    app_gates[[app_id]] <- gate
    gate_order <- c(gate_order, app_id)
    gml_to_app[[gml_id]] <- app_id
  }

  bool_ids <- names(raw_gates)[vapply(raw_gates, function(g) identical(g$gate_type, "boolean"), logical(1))]
  if (length(bool_ids) > 0) {
    for (iter in seq_len(12)) {
      changed <- FALSE
      for (bid in bool_ids) {
        if (!is.null(gml_to_app[[bid]])) next
        refs <- raw_gates[[bid]]$refs %||% list()
        if (length(refs) == 0) next
        ok <- all(vapply(refs, function(r) {
          rid <- r$gate_id
          !is.null(gml_to_app[[rid]]) || rid %in% bool_ids
        }, logical(1)))
        if (ok) {
          gml_to_app[[bid]] <- bid
          changed <- TRUE
        }
      }
      if (!changed) break
    }
  }

  root_pop <- new_root_population()
  root_pop_id <- root_pop$population_id
  populations <- setNames(list(root_pop), root_pop_id)

  if (!is.null(hierarchy_node)) {
    process_pair <- function(pair_node, parent_id) {
      gate_ref_gml <- .gml_attr_local(pair_node, "gate-ref")
      complement <- identical(tolower(.gml_attr_local(pair_node, "complement") %||% "false"), "true")

      name_node <- .gml_first_child_local(pair_node, "name")
      pop_name <- if (!is.null(name_node)) trimws(xml2::xml_text(name_node)) else ""
      if (!nzchar(pop_name) && !is.null(gate_ref_gml) && !is.null(raw_gates[[gate_ref_gml]])) {
        pop_name <- raw_gates[[gate_ref_gml]]$name
      }
      if (!nzchar(pop_name)) pop_name <- "Population"

      gate_refs <- list()
      if (!is.null(gate_ref_gml) && !is.null(gml_to_app[[gate_ref_gml]])) {
        ref_gate <- raw_gates[[gate_ref_gml]]
        if (!is.null(ref_gate) && identical(ref_gate$gate_type, "boolean")) {
          seen <- character(0)
          refs <- ref_gate$refs %||% list()
          for (r in refs) {
            rid <- r$gate_id
            aid <- gml_to_app[[rid]]
            if (is.null(aid) || identical(aid, rid) || aid %in% seen) next
            seen <- c(seen, aid)
            include <- !isTRUE(r$complement)
            if (identical(ref_gate$operation, "not")) include <- FALSE
            gate_refs[[length(gate_refs) + 1L]] <- new_gate_ref(aid, include = include)
          }
        } else {
          aid <- gml_to_app[[gate_ref_gml]]
          gate_refs[[1]] <- new_gate_ref(aid, include = !complement)
        }
      }

      if (length(gate_refs) == 0) return(NULL)

      pop <- new_population(pop_name, gate_refs = gate_refs, parent_id = parent_id)
      pid <- pop$population_id
      populations[[pid]] <<- pop
      populations <<- link_child_to_parent(populations, pid, parent_id)

      for (child_pair in .gml_children_local(pair_node, "PopulationGatePair")) {
        process_pair(child_pair, pid)
      }
      pid
    }

    for (top_pair in .gml_children_local(hierarchy_node, "PopulationGatePair")) {
      process_pair(top_pair, root_pop_id)
    }
  } else {
    bool_names <- list()
    bool_prim <- list()
    bool_include <- list()
    bool_pop_indices <- list()

    for (bid in bool_order) {
      g <- raw_gates[[bid]]
      if (is.null(g) || !identical(g$gate_type, "boolean")) next
      refs <- g$refs %||% list()

      prim <- character(0)
      inc <- list()
      seen <- character(0)
      for (r in refs) {
        rid <- r$gate_id
        if (rid %in% seen) next
        seen <- c(seen, rid)
        rg <- raw_gates[[rid]]
        if (!is.null(rg) && identical(rg$gate_type, "boolean")) next
        if (is.null(gml_to_app[[rid]])) next
        prim <- c(prim, rid)
        inc[[rid]] <- !isTRUE(r$complement)
      }

      bool_names[[bid]] <- g$name
      bool_prim[[bid]] <- unique(prim)
      bool_include[[bid]] <- inc
      bool_pop_indices[[bid]] <- g$pop_parent_indices %||% integer(0)
    }

    if (length(bool_names) == 0) {
      for (gid in gate_order) {
        g <- app_gates[[gid]]
        pop <- new_population(g$name, gate_refs = list(new_gate_ref(gid, include = TRUE)), parent_id = root_pop_id)
        pid <- pop$population_id
        populations[[pid]] <- pop
        populations <- link_child_to_parent(populations, pid, root_pop_id)
      }
    } else {
      parents <- list()
      for (bid in names(bool_names)) {
        pidx <- bool_pop_indices[[bid]] %||% integer(0)
        parent_bid <- NULL

        if (length(pidx) > 0) {
          for (idx in pidx) {
            if (is.na(idx) || idx < 1 || idx > length(bool_order)) next
            cand <- bool_order[[idx]]
            if (!identical(cand, bid)) {
              parent_bid <- cand
              break
            }
          }
        }

        if (is.null(parent_bid)) {
          my_set <- bool_prim[[bid]] %||% character(0)
          best <- NULL
          best_size <- -1L
          for (oid in names(bool_names)) {
            if (identical(oid, bid)) next
            oset <- bool_prim[[oid]] %||% character(0)
            if (length(oset) == 0) next
            if (all(oset %in% my_set) && length(oset) < length(my_set) && length(oset) > best_size) {
              best <- oid
              best_size <- length(oset)
            }
          }
          parent_bid <- best
        }
        parents[[bid]] <- parent_bid
      }

      get_depth <- function(bid) {
        d <- 0L
        cur <- bid
        seen <- character(0)
        while (!is.null(parents[[cur]]) && !is.null(cur) && !cur %in% seen) {
          seen <- c(seen, cur)
          cur <- parents[[cur]]
          d <- d + 1L
        }
        d
      }

      ordered_bids <- names(bool_names)
      if (length(ordered_bids) > 1) {
        ordered_bids <- ordered_bids[order(vapply(ordered_bids, get_depth, integer(1)))]
      }

      bid_to_pid <- setNames(vapply(ordered_bids, function(x) uuid::UUIDgenerate(), character(1)), ordered_bids)

      for (bid in ordered_bids) {
        pid <- bid_to_pid[[bid]]
        parent_bid <- parents[[bid]]
        parent_pid <- if (is.null(parent_bid)) root_pop_id else (bid_to_pid[[parent_bid]] %||% root_pop_id)

        my_prim <- bool_prim[[bid]] %||% character(0)
        parent_prim <- if (!is.null(parent_bid)) bool_prim[[parent_bid]] %||% character(0) else character(0)
        incr <- setdiff(my_prim, parent_prim)

        refs <- list()
        include_map <- bool_include[[bid]] %||% list()
        for (rid in names(include_map)) {
          if (!rid %in% incr) next
          app_id <- gml_to_app[[rid]]
          if (is.null(app_id) || identical(app_id, rid)) next
          refs[[length(refs) + 1L]] <- new_gate_ref(app_id, include = isTRUE(include_map[[rid]]))
        }
        if (length(refs) == 0) next

        pop_name <- bool_names[[bid]] %||% "Population"
        pop <- list(
          population_id = pid,
          name = pop_name,
          gate_refs = refs,
          parent_id = parent_pid,
          children = character(0),
          event_count = NULL,
          percent_of_parent = NULL
        )
        populations[[pid]] <- pop
        populations <- link_child_to_parent(populations, pid, parent_pid)
      }
    }
  }

  list(
    gates = app_gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = root_pop_id,
    n_gates_imported = length(app_gates),
    n_gates_skipped = as.integer(n_skipped),
    n_pops_imported = max(0L, length(populations) - 1L)
  )
}
