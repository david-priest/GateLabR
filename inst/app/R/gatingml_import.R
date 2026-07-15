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

# Detect who wrote this Gating-ML so the importer can match channels + advise
# correctly: "gatelabr" (channels are display/marker names — a skip means a truly
# missing channel), "cytobank" (channels are FCS $PnN / metal — need the metal
# bridge), or "generic".
.gml_detect_source <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  if (!is.null(ci) && !is.null(.gml_first_child_local(ci, "gatelabr_scales"))) {
    return("gatelabr")
  }
  cb <- tryCatch(xml2::xml_find_first(root, ".//*[local-name()='cytobank']"),
                 error = function(e) NULL)
  if (!is.null(cb) && !inherits(cb, "xml_missing")) return("cytobank")
  "generic"
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

#' Parse GateLab/GateLabR scale and compensation state from custom_info.
.gml_parse_gatelabr_state <- function(root_node) {
  empty <- list(scales = NULL, compensation = NULL)
  ci <- .gml_first_child_local(root_node, "custom_info")
  if (is.null(ci)) return(empty)
  gs <- .gml_first_child_local(ci, "gatelabr_scales")
  if (is.null(gs)) return(empty)
  def <- .gml_first_child_local(gs, "definition")
  if (is.null(def)) return(empty)
  txt <- trimws(xml2::xml_text(def))
  if (nchar(txt) == 0) return(empty)
  parsed <- tryCatch(
    jsonlite::fromJSON(txt, simplifyVector = FALSE),
    error = function(e) stop("Invalid embedded GateLab scale or compensation metadata.")
  )
  if (!is.list(parsed)) stop("Invalid embedded GateLab scale or compensation metadata.")
  scales <- parsed$channels %||% NULL
  raw <- parsed$compensation
  if (is.null(raw)) return(list(scales = scales, compensation = NULL))
  if (!is.list(raw) || length(raw$enabled) != 1L || !is.logical(raw$enabled) ||
      is.na(raw$enabled)) {
    stop("Invalid embedded GateLab compensation state: enabled must be true or false.")
  }
  reference <- as.character(raw$reference %||% "")
  if (length(reference) != 1L || !reference %in% c("FCS", "uncompensated")) {
    stop("Invalid embedded GateLab compensation state: unsupported matrix reference.")
  }
  raw_channels <- raw$channels %||% list()
  channels <- if (length(raw_channels) == 0L) character(0) else
    unlist(raw_channels, use.names = FALSE)
  if (!is.character(channels) || anyNA(channels) || any(!nzchar(channels)) ||
      anyDuplicated(channels)) {
    stop("Invalid embedded GateLab compensation state: channel list is malformed.")
  }
  matrix <- NULL
  if (!is.null(raw$matrix)) {
    if (!is.list(raw$matrix) || length(raw$matrix) != length(channels)) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    rows <- lapply(raw$matrix, function(row) suppressWarnings(as.numeric(unlist(row, use.names = FALSE))))
    if (any(vapply(rows, length, integer(1)) != length(channels))) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    matrix <- do.call(rbind, rows)
    if (!is.matrix(matrix) || any(!is.finite(matrix))) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    dimnames(matrix) <- list(channels, channels)
  }
  enabled <- isTRUE(raw$enabled)
  if (enabled && (!identical(reference, "FCS") || length(channels) < 2L || is.null(matrix))) {
    stop("Invalid embedded GateLab compensation state: enabled compensation requires an FCS spillover matrix.")
  }
  list(
    scales = scales,
    compensation = list(
      enabled = enabled,
      reference = reference,
      channels = channels,
      matrix = matrix
    )
  )
}

.gml_parse_gatelabr_scales <- function(root_node) {
  .gml_parse_gatelabr_state(root_node)$scales
}

#' Extract Cytobank gate_id (primitive gates) or gate_set_id (boolean gates)
.gml_parse_cytobank_ids <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(list())
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(list())
  out <- list()
  gid_el <- .gml_first_child_local(cb, "gate_id")
  if (!is.null(gid_el)) {
    v <- suppressWarnings(as.integer(trimws(xml2::xml_text(gid_el))))
    if (length(v) == 1 && !is.na(v)) out$gate_id <- v
  }
  gsid_el <- .gml_first_child_local(cb, "gate_set_id")
  if (!is.null(gsid_el)) {
    v <- suppressWarnings(as.integer(trimws(xml2::xml_text(gsid_el))))
    if (length(v) == 1 && !is.na(v)) out$gate_set_id <- v
  }
  out
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

    # fasinh / arcsinh — store full {type, T, M, A} for correct inversion.
    # Gating-ML 2.0: f(x) = (arcsinh(x*sinh(M*ln10)/T) - A*ln10) / ((M+A)*ln10)
    fasinh_el  <- .gml_first_child_local(el, "fasinh")
    arcsinh_el <- .gml_first_child_local(el, "arcsinh")
    src_el <- fasinh_el %||% arcsinh_el
    t_val  <- NULL
    if (!is.null(fasinh_el))  t_val <- .gml_num(.gml_attr_local(fasinh_el,  "T"))
    if (!.gml_has_num(t_val) && !is.null(arcsinh_el)) {
      t_val <- .gml_num(.gml_attr_local(arcsinh_el, "T"))
    }
    if (.gml_has_num(t_val)) {
      m_val <- .gml_num(.gml_attr_local(src_el, "M"))
      a_val <- .gml_num(.gml_attr_local(src_el, "A"))
      out[[tr_id]] <- list(
        type = "fasinh",
        T    = t_val,
        M    = if (.gml_has_num(m_val)) m_val else log10(exp(1)),
        A    = if (.gml_has_num(a_val)) a_val else 0
      )
    }
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
    comp_ref <- .gml_attr_local(dim, "compensation-ref")
    if (!is.null(comp_ref) && nzchar(comp_ref)) d$compensation_ref <- comp_ref

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

.gml_parse_compensation_refs <- function(raw_gates) {
  refs <- character(0)
  unsupported <- character(0)
  for (g in raw_gates) {
    if (identical(g$gate_type, "boolean")) next
    for (d in g$dims %||% list()) {
      value <- trimws(as.character(d$compensation_ref %||% ""))
      if (!nzchar(value)) next
      lower <- tolower(value)
      if (identical(lower, "fcs")) refs <- c(refs, "FCS")
      else if (identical(lower, "uncompensated")) refs <- c(refs, "uncompensated")
      else unsupported <- c(unsupported, value)
    }
  }
  unsupported <- unique(unsupported)
  if (length(unsupported) > 0L) {
    stop(
      "This Gating-ML file references unsupported compensation matrix ",
      paste(sprintf('"%s"', unsupported), collapse = ", "),
      ". GateLabR can safely import FCS or uncompensated dimensions only."
    )
  }
  unique(refs)
}

.gml_compensation_matrices_match <- function(expected, actual, tolerance = 1e-8) {
  if (is.null(expected$matrix) || !is.matrix(expected$matrix) || !is.matrix(actual)) return(FALSE)
  channels <- as.character(expected$channels %||% character(0))
  actual_channels <- colnames(actual)
  actual_rows <- rownames(actual)
  if (length(channels) != ncol(actual) || is.null(actual_channels) || is.null(actual_rows) ||
      !setequal(channels, actual_channels) || !setequal(channels, actual_rows)) return(FALSE)
  aligned <- actual[channels, channels, drop = FALSE]
  if (!identical(dim(aligned), dim(expected$matrix)) || any(!is.finite(aligned))) return(FALSE)
  delta <- abs(expected$matrix - aligned)
  scale <- pmax(1, abs(expected$matrix), abs(aligned))
  all(delta <= tolerance * scale)
}

#' Resolve the compensation state required to preserve imported gate membership.
resolve_gatingml_compensation <- function(compensation, dimension_refs,
                                          is_flow, spillover_matrix = NULL) {
  none <- list(target = NULL, source = "none", requires_confirmation = FALSE)
  if (!isTRUE(is_flow)) return(none)

  if (!is.null(compensation)) {
    if (!isTRUE(compensation$enabled)) {
      if ("FCS" %in% dimension_refs) {
        stop("The embedded GateLab compensation state contradicts the Gating-ML dimension references.")
      }
      return(list(target = FALSE, source = "embedded", requires_confirmation = FALSE))
    }
    if (is.null(spillover_matrix)) {
      stop("This gating strategy was created with FCS spillover compensation enabled, but the loaded FCS has no usable spillover matrix.")
    }
    if (!.gml_compensation_matrices_match(compensation, spillover_matrix)) {
      stop("This gating strategy was created with a different FCS spillover matrix. Import was stopped to prevent changed population membership.")
    }
    return(list(target = TRUE, source = "embedded", requires_confirmation = FALSE))
  }

  if ("FCS" %in% dimension_refs) {
    if (is.null(spillover_matrix)) {
      stop("This Gating-ML file requires FCS spillover compensation, but the loaded FCS has no usable spillover matrix.")
    }
    return(list(target = TRUE, source = "dimensions", requires_confirmation = TRUE))
  }
  if ("uncompensated" %in% dimension_refs) {
    return(list(target = FALSE, source = "dimensions", requires_confirmation = FALSE))
  }
  none
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

  if ((is.list(pnn_to_channel) || is.vector(pnn_to_channel)) && length(pnn_to_channel)) {
    # exact $PnN key match
    if (!is.null(names(pnn_to_channel)) && ch %in% names(pnn_to_channel)) {
      mapped <- unname(pnn_to_channel[[ch]])
      if (!is.null(mapped) && mapped %in% session_channels) return(mapped)
    }
    # normalized key match: tolerate metal-name format variants between the
    # GatingML $PnN (e.g. "Pr141Di") and the map keys (e.g. "141Pr").
    nn_ch <- .gml_normalize_channel(ch)
    if (nzchar(nn_ch) && !is.null(names(pnn_to_channel))) {
      knorm <- vapply(names(pnn_to_channel), .gml_normalize_channel, character(1))
      hit <- which(knorm == nn_ch)
      for (h in hit) {
        mapped <- unname(pnn_to_channel[[h]])
        if (!is.null(mapped) && mapped %in% session_channels) return(mapped)
      }
    }
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

  # QC / instrument channels: always raw space, no inversion.
  if (grepl("^(time|event_length|cell_length|barcode)$", resolved_channel, ignore.case = TRUE)) {
    return(function(v) v)
  }

  tr_def <- transforms_map[[trans_ref]]
  if (is.null(tr_def)) return(function(v) v)

  # Logicle transform (from GateLabR flow export or FlowJo): apply logicle inverse
  # to convert vertices from logicle display space to raw space for evaluation.
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

  # fasinh / arcsinh: two distinct cases.
  #
  #   • CyTOF metal / Gaussian channels: rv$gates stores vertices in arcsinh
  #     EXPRS space (display space), and the GatingML export wrote them out
  #     in that same space.  Identity round-trip.
  #
  #   • FLOW scatter (FSC/SSC/...) channels: rv$gates stores vertices in RAW
  #     counts space, but the GatingML export forward-transformed them to
  #     arcsinh display space (so files are portable to Cytobank / FlowJo).
  #     We must apply the fasinh inverse here to put vertices BACK into raw
  #     counts space — otherwise an export+import roundtrip squashes flow
  #     scatter gates down to a tiny region near zero (raw≈display values get
  #     forward-transformed again at render time → asinh(raw/cf) ≈ 0).
  #
  # Gating-ML 2.0 fasinh:
  #     f(x) = (arcsinh(x*sinh(M*ln10)/T) - A*ln10) / ((M+A)*ln10)
  # Inverse:
  #     f^-1(y) = T/sinh(M*ln10) * sinh(y*(M+A)*ln10 + A*ln10)
  if (is.list(tr_def) && identical(tr_def$type, "fasinh")) {
    is_scatter <- exists(".is_scatter_channel", mode = "function") &&
                  isTRUE(.is_scatter_channel(resolved_channel))
    if (!is_scatter) return(function(v) v)

    t_v <- suppressWarnings(as.numeric(tr_def$T))
    m_v <- suppressWarnings(as.numeric(tr_def$M %||% log10(exp(1))))
    a_v <- suppressWarnings(as.numeric(tr_def$A %||% 0))
    if (!is.finite(t_v) || t_v <= 0 || !is.finite(m_v) || m_v <= 0) {
      return(function(v) v)
    }
    if (!is.finite(a_v)) a_v <- 0
    ln10  <- log(10)
    denom <- sinh(m_v * ln10)
    if (!is.finite(denom) || denom == 0) return(function(v) v)
    cf_eff <- t_v / denom
    k1 <- (m_v + a_v) * ln10
    k0 <- a_v * ln10
    return(function(v) {
      vv <- as.numeric(v)
      cf_eff * sinh(vv * k1 + k0)
    })
  }

  # Legacy fallback: plain numeric T (old saved state or unknown format).
  # Compute the proper Gating-ML 2.0 inverse just in case.
  cf <- suppressWarnings(as.numeric(if (is.list(tr_def)) tr_def$T else tr_def))
  if (.gml_has_num(cf) && cf > 0) {
    # For legacy data where Gaussian channels might still be raw in exprs,
    # compute the effective cofactor = T / sinh(M * ln(10)) and invert.
    return(function(v) cf * sinh(v))
  }
  function(v) v
}

.gml_parse_gate_node <- function(node) {
  loc <- .gml_local_name(node)
  gml_id <- .gml_attr_local(node, "id")
  nm <- .gml_attr_local(node, "name")
  if (is.null(nm) || !nzchar(nm)) nm <- .gml_parse_cytobank_name(node)
  if (is.null(nm) || !nzchar(nm)) nm <- gml_id %||% uuid::UUIDgenerate()

  if (identical(loc, "RectangleGate")) {
    dims <- .gml_parse_dimensions(node)
    if (length(dims) < 1 || length(dims) > 2) return(NULL)
    x <- dims[[1]]
    # A one-dimensional Gating-ML RectangleGate is a range gate. Repeating
    # the same channel on both axes preserves its interval membership exactly
    # in GateLabR's two-dimensional rectangle mask.
    y <- if (length(dims) >= 2) dims[[2]] else dims[[1]]

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
      dims = list(x, y)
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

    cb_ids <- .gml_parse_cytobank_ids(node)
    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "boolean",
      operation = op,
      refs = refs,
      channels = character(0),
      pop_parent_indices = .gml_parse_pop_parent_indices(node),
      gate_set_id = cb_ids$gate_set_id
    ))
  }

  NULL
}

.gml_gate_label <- function(node) {
  gate_id <- .gml_attr_local(node, "id")
  gate_name <- .gml_attr_local(node, "name") %||% .gml_parse_cytobank_name(node)
  suffix <- if (!is.null(gate_name) && nzchar(gate_name) && !identical(gate_name, gate_id)) {
    paste0(" (", gate_name, ")")
  } else {
    ""
  }
  paste0(.gml_local_name(node), if (!is.null(gate_id) && nzchar(gate_id)) paste0(" ", gate_id) else "", suffix)
}

.gml_stop_import_problems <- function(problems) {
  problems <- unique(problems)
  stop(
    paste0(
      "Gating-ML import cancelled because unsupported or invalid features were found:\n- ",
      paste(problems, collapse = "\n- ")
    ),
    call. = FALSE
  )
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
  import_problems <- character(0)
  supported_gate_types <- c("RectangleGate", "PolygonGate", "BooleanGate")

  for (el in top_nodes) {
    loc <- .gml_local_name(el)
    if (identical(loc, "GatingHierarchy") && is.null(hierarchy_node)) {
      hierarchy_node <- el
      next
    }

    if (endsWith(loc, "Gate") && !loc %in% supported_gate_types) {
      import_problems <- c(import_problems, paste0(.gml_gate_label(el), " is not supported."))
      next
    }
    if (!loc %in% supported_gate_types) next

    gate_id <- .gml_attr_local(el, "id")
    if (is.null(gate_id) || !nzchar(gate_id)) {
      import_problems <- c(import_problems, paste0(loc, " is missing its required id."))
      next
    }
    if (!is.null(raw_gates[[gate_id]])) {
      import_problems <- c(import_problems, paste0(loc, " has duplicate id ", gate_id, "."))
      next
    }

    if (identical(loc, "RectangleGate")) {
      n_dims <- length(.gml_parse_dimensions(el))
      if (n_dims < 1 || n_dims > 2) {
        import_problems <- c(
          import_problems,
          sprintf("%s has %d dimensions; only 1D ranges and 2D rectangles are supported.",
                  .gml_gate_label(el), n_dims)
        )
        next
      }
    } else if (identical(loc, "PolygonGate")) {
      n_dims <- length(.gml_parse_dimensions(el))
      n_vertices <- length(.gml_children_local(el, "vertex"))
      if (n_dims != 2 || n_vertices < 3) {
        import_problems <- c(
          import_problems,
          paste0(.gml_gate_label(el), " must contain exactly 2 dimensions and at least 3 vertices.")
        )
        next
      }
    } else if (identical(loc, "BooleanGate")) {
      operations <- Filter(
        function(child) .gml_local_name(child) %in% c("and", "or", "not"),
        as.list(xml2::xml_children(el))
      )
      refs <- if (length(operations) == 1) .gml_children_local(operations[[1]], "gateReference") else list()
      if (length(operations) != 1 || length(refs) == 0) {
        import_problems <- c(
          import_problems,
          paste0(.gml_gate_label(el), " must contain one non-empty Boolean operation.")
        )
        next
      }
      if (identical(.gml_local_name(operations[[1]]), "not") && length(refs) != 1) {
        import_problems <- c(
          import_problems,
          sprintf("%s uses NOT with %d references; unary NOT requires exactly one.",
                  .gml_gate_label(el), length(refs))
        )
        next
      }
    }

    g <- .gml_parse_gate_node(el)
    if (is.null(g) || is.null(g$gml_id) || !nzchar(g$gml_id)) {
      import_problems <- c(import_problems, paste0(.gml_gate_label(el), " could not be parsed."))
      next
    }
    raw_gates[[g$gml_id]] <- g
    if (identical(g$gate_type, "boolean")) bool_order <- c(bool_order, g$gml_id)
  }
  gatelabr_state <- .gml_parse_gatelabr_state(root)
  compensation_refs <- .gml_parse_compensation_refs(raw_gates)

  for (g in raw_gates) {
    for (dim in g$dims %||% list()) {
      ref <- dim$transformation_ref %||% NULL
      if (!is.null(ref) && nzchar(ref) && is.null(transforms_map[[ref]])) {
        import_problems <- c(
          import_problems,
          paste0(g$gml_id, " references unsupported or missing transformation ", ref, ".")
        )
      }
    }
    if (identical(g$gate_type, "boolean")) {
      for (ref in g$refs %||% list()) {
        target <- raw_gates[[ref$gate_id]]
        if (is.null(target)) {
          import_problems <- c(
            import_problems,
            paste0(g$gml_id, " references missing gate ", ref$gate_id, ".")
          )
        } else if (identical(target$gate_type, "boolean")) {
          # Cytobank/GateLab flat exports encode ancestry as a Boolean reference
          # plus a matching pop_X parent in custom_info. That pattern maps safely
          # to a parent population followed by incremental primitive gates.
          parent_indices <- g$pop_parent_indices %||% integer(0)
          target_position <- match(ref$gate_id, bool_order)
          target_gate_set_id <- target$gate_set_id %||% NA_integer_
          is_flat_parent_reference <- is.null(hierarchy_node) && any(
            parent_indices == target_position |
              (!is.na(target_gate_set_id) & parent_indices == target_gate_set_id),
            na.rm = TRUE
          )
          if (!isTRUE(is_flat_parent_reference)) {
            import_problems <- c(
              import_problems,
              paste0(g$gml_id, " contains a nested Boolean reference to ", ref$gate_id,
                     " that cannot be represented safely.")
            )
          }
        }
      }
    }
  }

  if (!is.null(hierarchy_node)) {
    pairs <- xml2::xml_find_all(hierarchy_node, ".//*[local-name()='PopulationGatePair']")
    for (pair in pairs) {
      ref <- .gml_attr_local(pair, "gate-ref")
      if (is.null(ref) || !nzchar(ref)) {
        import_problems <- c(import_problems, "A PopulationGatePair is missing gate-ref.")
      } else if (is.null(raw_gates[[ref]])) {
        import_problems <- c(
          import_problems,
          paste0("A PopulationGatePair references missing gate ", ref, ".")
        )
      }
    }
  }

  if (length(import_problems) > 0) .gml_stop_import_problems(import_problems)

  gml_to_app <- list()
  app_gates <- list()
  gate_order <- character(0)
  n_skipped <- 0L
  unresolved_channels <- character(0)

  for (gml_id in names(raw_gates)) {
    g <- raw_gates[[gml_id]]
    if (identical(g$gate_type, "boolean")) next

    channels <- unique(g$channels)
    resolved <- lapply(channels, function(ch) .gml_resolve_channel(ch, session_channels, pnn_to_channel))
    names(resolved) <- channels
    if (any(vapply(resolved, is.null, logical(1)))) {
      unresolved_channels <- c(unresolved_channels,
                               channels[vapply(resolved, is.null, logical(1))])
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
      gate_logic <- "and"
      if (!is.null(gate_ref_gml) && !is.null(gml_to_app[[gate_ref_gml]])) {
        ref_gate <- raw_gates[[gate_ref_gml]]
        if (!is.null(ref_gate) && identical(ref_gate$gate_type, "boolean")) {
          if (identical(ref_gate$operation, "or")) gate_logic <- "or"
          seen <- character(0)
          refs <- ref_gate$refs %||% list()
          for (r in refs) {
            rid <- r$gate_id
            aid <- gml_to_app[[rid]]
            if (is.null(aid) || identical(aid, rid) || aid %in% seen) next
            seen <- c(seen, aid)
            include <- if (identical(ref_gate$operation, "not")) {
              isTRUE(r$complement)
            } else {
              !isTRUE(r$complement)
            }
            gate_refs[[length(gate_refs) + 1L]] <- new_gate_ref(aid, include = include)
          }
          if (isTRUE(complement)) {
            gate_refs <- lapply(gate_refs, function(ref) {
              new_gate_ref(ref$gate_id, include = !isTRUE(ref$include), quadrant = ref$quadrant)
            })
            if (!identical(ref_gate$operation, "not")) {
              gate_logic <- if (identical(gate_logic, "and")) "or" else "and"
            }
          }
        } else {
          aid <- gml_to_app[[gate_ref_gml]]
          gate_refs[[1]] <- new_gate_ref(aid, include = !complement)
        }
      }

      if (length(gate_refs) == 0) return(NULL)

      pop <- new_population(pop_name, gate_refs = gate_refs, parent_id = parent_id,
                            gate_logic = gate_logic)
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

    # Build a robust gate_set_id → GML ID mapping for parent resolution.
    # Cytobank boolean expressions use "pop_X" where X = gate_set_id.
    gsid_to_gml <- list()
    for (bid in bool_order) {
      g <- raw_gates[[bid]]
      if (is.null(g) || !identical(g$gate_type, "boolean")) next
      gsid <- g$gate_set_id
      if (!is.null(gsid) && is.finite(gsid)) {
        gsid_to_gml[[as.character(gsid)]] <- bid
      }
    }

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
        inc[[rid]] <- if (identical(g$operation, "not")) {
          isTRUE(r$complement)
        } else {
          !isTRUE(r$complement)
        }
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
      # ── Resolve parent for each boolean gate ────────────────────────────
      parents <- list()
      for (bid in names(bool_names)) {
        pidx <- bool_pop_indices[[bid]] %||% integer(0)
        parent_bid <- NULL

        # Primary: resolve pop_X via explicit gate_set_id mapping (robust)
        if (length(pidx) > 0) {
          for (idx in pidx) {
            if (is.na(idx) || idx < 1) next
            cand <- gsid_to_gml[[as.character(idx)]]
            if (!is.null(cand) && !identical(cand, bid)) {
              parent_bid <- cand
              break
            }
          }
        }

        # Fallback 1: positional lookup in bool_order (for GatingML files
        # that lack gate_set_id but have boolean gates in order)
        if (is.null(parent_bid) && length(pidx) > 0) {
          for (idx in pidx) {
            if (is.na(idx) || idx < 1 || idx > length(bool_order)) next
            cand <- bool_order[[idx]]
            if (!identical(cand, bid)) {
              parent_bid <- cand
              break
            }
          }
        }

        # Fallback 2: heuristic — find the boolean gate whose primitive
        # gate set is the largest proper subset of this gate's set
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
          gate_logic = if (!is.null(raw_gates[[bid]]) &&
                          identical(raw_gates[[bid]]$operation, "or")) "or" else "and",
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
    skipped_channels = sort(unique(unresolved_channels)),
    source = .gml_detect_source(root),
    n_pops_imported = max(0L, length(populations) - 1L),
    scales = gatelabr_state$scales,
    compensation = gatelabr_state$compensation,
    compensation_refs = compensation_refs
  )
}
