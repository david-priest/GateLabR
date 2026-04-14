# fcs_import.R — Import FCS files into SingleCellExperiment objects
#
# Autodetects CyTOF vs flow cytometry from channel names and applies the
# appropriate transforms per the cytof-gating Python app's transform.py:
#
#   CyTOF: arcsinh(x / 5) for metal channels only
#          Raw for Time, Event_length, Center, Offset, Width, Residual, etc.
#
#   Flow:  Logicle (biexponential) for fluorescence / signal channels
#          arcsinh(x / 150) for FSC/SSC scatter channels
#          Raw for QC/timing channels (Time, Event_length, Width, etc.)

# ---------------------------------------------------------------------------
# Channel classification helpers
# ---------------------------------------------------------------------------

#' QC / instrument channels that should NEVER be transformed (CyTOF or flow)
.is_qc_channel <- function(channel_names) {
  qc_exact <- c("Time", "Event_length", "Cell_length", "Center", "Offset",
                "Width", "Residual", "file_number", "Beads")
  in_exact   <- tolower(channel_names) %in% tolower(qc_exact)
  in_pattern <- grepl(
    "gaussian|amplitude|beaddist|^width$|^center$|^offset$|^residual$",
    channel_names, ignore.case = TRUE)
  in_exact | in_pattern
}

#' Channels that stay raw (no arcsinh) in CyTOF exprs assay.
#' Only acquisition-level parameters: Time and event geometry.
#' Gaussian parameters (Center, Width, Offset, Residual, Amplitude, etc.)
#' are now arcsinh-transformed to match Cytobank's display/gating space.
.is_cytof_raw_channel <- function(channel_names) {
  raw_exact <- c("time", "event_length", "cell_length", "file_number")
  tolower(channel_names) %in% raw_exact
}

#' Flow-like acquisition suffixes used in channel names
.has_flow_suffix <- function(channel_names) {
  grepl("-(A|H|W|T)(\\b|\\)|\\s|$)", channel_names, ignore.case = TRUE)
}

#' CyTOF metal channels: Di suffix OR element+mass-number pattern
#'
#' Excludes flow cytometry channels that happen to match element+mass patterns
#' (e.g. BD S8 spectral: V500-A, B530-A, R670-A, UV379-A look like metal
#' channels but are fluorophore labels with area/height/width suffixes).
.is_metal_channel <- function(channel_names) {
  non_metal_exact  <- c("Time", "Event_length", "Cell_length",
                        "Center", "Offset", "Width", "Residual",
                        "file_number", "Beads", "Dead", "Live", "Viability")
  non_metal_prefix <- c("^FSC", "^SSC", "^Viab", "^Scatter")

  is_non_metal <- tolower(channel_names) %in% tolower(non_metal_exact) |
    Reduce(`|`, lapply(non_metal_prefix,
                       function(p) grepl(p, channel_names, ignore.case = TRUE)))

  # Flow cytometry channels have -A/-H/-W/-T suffixes (area/height/width/total)
  # CyTOF metal channels never have these suffixes.
  # Accept suffixes even when channels are renamed, e.g. "CD3-A (V500-A)".
  has_flow_suffix <- .has_flow_suffix(channel_names)

  # Handle both element-first and mass-first isotope labels.
  # Examples: Y89, Ce140, 89Y, 140Ce, Y89Di.
  looks_metal <- grepl("Di$", channel_names, ignore.case = TRUE) |
    grepl("(?<![A-Za-z0-9])[A-Z][a-z]?[0-9]{2,3}(?![A-Za-z0-9])",
          channel_names, perl = TRUE) |
    grepl("(?<![A-Za-z0-9])[0-9]{2,3}[A-Z][a-z]?(?![A-Za-z0-9])",
          channel_names, perl = TRUE)

  looks_metal & !is_non_metal & !has_flow_suffix
}

#' Flow scatter channels (FSC / SSC / LightLoss and variants)
.is_scatter_channel <- function(channel_names) {
  grepl(
    paste0("^FSC|^SSC",
           "|^FS[[:space:]\\-_]|^SS[[:space:]\\-_]",  # Beckman-Coulter: FS INT, SS LOG
           "|^FS$|^SS$",                                # bare FS / SS
           "|^LightLoss|^Extinction"),
    channel_names, ignore.case = TRUE
  ) & !.is_qc_channel(channel_names)
}

# ---------------------------------------------------------------------------
# Instrument-type autodetection
# ---------------------------------------------------------------------------

#' Autodetect CyTOF vs flow cytometry from channel names
#'
#' Heuristic:
#'   - If >= 2 FSC/SSC scatter channels present              → "flow"
#'     (scatter channels are definitive — CyTOF never has FSC/SSC)
#'   - If >= 25% of channels (and >= 3) are metal channels   → "cytof"
#'   - Fallback: any metals → "cytof", otherwise → "flow"
#'
#' @param channel_names Character vector of channel names
#' @return "cytof" or "flow"
detect_instrument_type <- function(channel_names) {
  if (length(channel_names) == 0) return("flow")

  n_total   <- length(channel_names)
  n_metal   <- sum(.is_metal_channel(channel_names))
  n_scatter <- sum(.is_scatter_channel(channel_names))
  n_flow_suffix <- sum(.has_flow_suffix(channel_names))
  n_qc <- sum(.is_qc_channel(channel_names))
  n_signal <- max(0, n_total - n_qc)

  # Scatter channels are definitive for flow — CyTOF never has FSC/SSC
  if (n_scatter >= 2)                               return("flow")

  # Strong evidence of CyTOF: multiple metals and no flow-style suffixes
  if (n_metal >= 3 && n_flow_suffix == 0) return("cytof")

  # Strong evidence of flow: multiple channels encoded with area/height/width suffixes
  if (n_flow_suffix >= 3) return("flow")

  # Relative signal composition fallback
  if (n_signal > 0 && (n_metal / n_signal) >= 0.35 && n_metal > n_flow_suffix) return("cytof")
  if (n_flow_suffix > n_metal) return("flow")

  if (n_metal > 0 && n_scatter == 0)                return("cytof")
  return("flow")
}

# ---------------------------------------------------------------------------
# Flow channel filtering (BD S8 spectral and similar instruments)
# ---------------------------------------------------------------------------

#' Filter and rename flow cytometry channels
#'
#' Mirrors the Python app's _filter_flow_channels logic:
#'   - Keep scatter channels (FSC/SSC) with -A, -H, -W suffixes only
#'   - Keep unmixed fluorophore channels that have an antibody marker label
#'     ($PnS != $PnN AND $PnS ends with "-A")
#'   - Keep LightLoss-A, Autofluorescence-A
#'   - Rename unmixed channels to "{PnS} ({PnN})" format
#'   - Drop all spectral raw channels, generic QC columns (Regions, EventNumber, etc.)
#'
#' @param ff flowFrame object (untransformed)
#' @return list(ff = filtered flowFrame, display_names = character vector,
#'              pnr_values = named numeric of $PnR per kept channel)
filter_flow_channels <- function(ff) {
  params <- flowCore::parameters(ff)
  pdata  <- flowCore::pData(params)
  pnn    <- as.character(pdata$name)  # $PnN
  pns    <- if ("desc" %in% colnames(pdata)) as.character(pdata$desc) else rep(NA, length(pnn))
  pnr    <- if ("range" %in% colnames(pdata)) as.numeric(pdata$range) else rep(NA, length(pnn))

  # Build keep/rename logic
  keep_idx     <- logical(length(pnn))
  display_name <- character(length(pnn))
  pnr_out      <- numeric(length(pnn))

  for (i in seq_along(pnn)) {
    ch <- pnn[i]
    desc <- pns[i]
    cu <- toupper(ch)

    # Scatter channels: FSC/SSC with -A, -H, -W suffixes
    if (grepl("^(FSC|SSC)", cu)) {
      if (grepl("-(A|H|W)$", ch, ignore.case = TRUE)) {
        keep_idx[i] <- TRUE
        display_name[i] <- ch
        pnr_out[i] <- pnr[i]
      }
      next
    }

    # LightLoss imaging scatter: keep -A, -H, -W variants (like FSC/SSC)
    if (grepl("^LightLoss", ch, ignore.case = TRUE) &&
        grepl("-(A|H|W)$", ch, ignore.case = TRUE)) {
      keep_idx[i] <- TRUE
      display_name[i] <- ch
      pnr_out[i] <- pnr[i]
      next
    }

    # Autofluorescence-A
    if (grepl("^Autofluorescence", ch, ignore.case = TRUE) &&
        grepl("-(A|H|W)$", ch, ignore.case = TRUE)) {
      keep_idx[i] <- TRUE
      display_name[i] <- ch
      pnr_out[i] <- pnr[i]
      next
    }

    # Unmixed fluorophore channels: PnS != PnN AND PnS ends with "-A"
    if (!is.na(desc) && nchar(trimws(desc)) > 0 &&
        desc != ch && grepl("-A$", desc)) {
      keep_idx[i] <- TRUE
      display_name[i] <- paste0(desc, " (", ch, ")")
      pnr_out[i] <- pnr[i]
      next
    }

    # Time and Event_length are kept as QC channels
    if (grepl("^(Time|Event_length|Cell_length)$", ch, ignore.case = TRUE)) {
      keep_idx[i] <- TRUE
      display_name[i] <- ch
      pnr_out[i] <- pnr[i]
      next
    }
  }

  if (sum(keep_idx) == 0) {
    # No spectral filtering possible — fallback to keeping all channels
    message("  No spectral channel filtering applied (no unmixed channels detected)")
    display_name <- ifelse(is.na(pns) | nchar(trimws(pns)) == 0, pnn, pns)
    return(list(ff = ff, display_names = display_name,
                pnr_values = setNames(pnr, display_name)))
  }

  # Subset the flowFrame to kept channels
  kept_pnn <- pnn[keep_idx]
  ff_filtered <- ff[, kept_pnn]
  names_out <- display_name[keep_idx]
  pnr_vals <- setNames(pnr_out[keep_idx], names_out)

  n_removed <- sum(!keep_idx)
  message("  Flow channel filter: kept ", sum(keep_idx), " channels, removed ",
          n_removed, " (spectral raw / QC)")

  list(ff = ff_filtered, display_names = names_out, pnr_values = pnr_vals)
}

# ---------------------------------------------------------------------------
# Transformation helpers
# ---------------------------------------------------------------------------

#' Estimate logicle W from channel values and top-of-scale T
#'
#' Matches the Python cytof-gating app's estimate_logicle_w():
#'   q = 5th percentile; if q >= 0 → default 0.5 (FlowJo default)
#'   abs_q = max(|q|, 1.0) — floor prevents log10 underflow
#'   W = (M - log10(T / abs_q)) / 2, clamped to [0.1, 2.0]
.estimate_logicle_w <- function(vals, t_val, m_val = 4.5,
                                default_w = 0.5,
                                min_w = 0.1,
                                max_w = 2.0) {
  q5 <- as.numeric(quantile(vals, 0.05, na.rm = TRUE))
  if (!is.finite(q5) || q5 >= 0 || !is.finite(t_val) || t_val <= 0) {
    return(default_w)
  }
  abs_q <- max(abs(q5), 1.0)
  w_val <- tryCatch(
    (m_val - log10(t_val / abs_q)) / 2,
    error = function(e) default_w
  )
  w_val <- max(min_w, min(w_val, max_w))
  as.numeric(w_val)
}

#' Estimate per-channel logicle W defaults for a matrix
#'
#' @param raw_mat event x channel matrix
#' @param channel_names channel names corresponding to columns in raw_mat
#' @return named numeric vector of W values for signal channels
estimate_logicle_w_params <- function(raw_mat, channel_names) {
  qc_mask      <- .is_qc_channel(channel_names)
  scatter_mask <- .is_scatter_channel(channel_names) & !qc_mask
  signal_mask  <- !qc_mask & !scatter_mask
  sig_chs <- channel_names[signal_mask]
  if (length(sig_chs) == 0) return(setNames(numeric(0), character(0)))

  w_vals <- vapply(sig_chs, function(ch) {
    vals <- raw_mat[, ch]
    t_val <- max(as.numeric(quantile(vals, 0.999, na.rm = TRUE)), 262144)
    .estimate_logicle_w(vals, t_val = t_val)
  }, numeric(1))
  setNames(w_vals, sig_chs)
}

.resolve_logicle_t <- function(raw_channel_vals) {
  if (is.null(raw_channel_vals) || length(raw_channel_vals) == 0) return(262144)
  t_val <- suppressWarnings(as.numeric(quantile(raw_channel_vals, 0.999, na.rm = TRUE)))
  if (!is.finite(t_val) || t_val <= 0) t_val <- 262144
  max(t_val, 262144)
}

flow_transform_channel_values <- function(raw_vals,
                                          channel_name,
                                          raw_channel_vals = NULL,
                                          logicle_w_params = NULL,
                                          scatter_cofactor_params = NULL) {
  if (.is_qc_channel(channel_name)) return(raw_vals)

  if (.is_scatter_channel(channel_name)) {
    cf <- 150
    if (!is.null(scatter_cofactor_params) && !is.null(scatter_cofactor_params[[channel_name]])) {
      cf <- as.numeric(scatter_cofactor_params[[channel_name]])
      if (!is.finite(cf) || cf <= 0) cf <- 150
    }
    return(asinh(raw_vals / cf))
  }

  t_val <- .resolve_logicle_t(raw_channel_vals)
  w_val <- if (!is.null(logicle_w_params) && !is.null(logicle_w_params[[channel_name]])) {
    as.numeric(logicle_w_params[[channel_name]])
  } else {
    vals_for_w <- if (!is.null(raw_channel_vals)) raw_channel_vals else raw_vals
    .estimate_logicle_w(vals_for_w, t_val = t_val)
  }
  if (!is.finite(w_val)) w_val <- 0.5
  w_val <- max(0.1, min(w_val, 2.0))

  lg <- flowCore::logicleTransform(
    transformationId = paste0("lg_fwd_", channel_name),
    w = w_val, t = t_val, m = 4.5, a = 0
  )
  as.numeric(lg(raw_vals))
}

flow_inverse_channel_values <- function(display_vals,
                                        channel_name,
                                        raw_channel_vals = NULL,
                                        logicle_w_params = NULL,
                                        scatter_cofactor_params = NULL) {
  if (.is_qc_channel(channel_name)) return(display_vals)

  if (.is_scatter_channel(channel_name)) {
    cf <- 150
    if (!is.null(scatter_cofactor_params) && !is.null(scatter_cofactor_params[[channel_name]])) {
      cf <- as.numeric(scatter_cofactor_params[[channel_name]])
      if (!is.finite(cf) || cf <= 0) cf <- 150
    }
    return(cf * sinh(display_vals))
  }

  t_val <- .resolve_logicle_t(raw_channel_vals)
  w_val <- if (!is.null(logicle_w_params) && !is.null(logicle_w_params[[channel_name]])) {
    as.numeric(logicle_w_params[[channel_name]])
  } else {
    vals_for_w <- if (!is.null(raw_channel_vals)) raw_channel_vals else display_vals
    .estimate_logicle_w(vals_for_w, t_val = t_val)
  }
  if (!is.finite(w_val)) w_val <- 0.5
  w_val <- max(0.1, min(w_val, 2.0))

  lg <- flowCore::logicleTransform(
    transformationId = paste0("lg_fwd_", channel_name),
    w = w_val, t = t_val, m = 4.5, a = 0
  )
  inv_lg <- flowCore::inverseLogicleTransform(
    lg,
    transformationId = paste0("lg_inv_", channel_name)
  )
  as.numeric(inv_lg(display_vals))
}

#' Generate FlowJo-style logicle axis ticks for a channel
#'
#' Returns flat vectors for easy JSON serialization:
#'   major_pos, major_labels  — decade tick positions + labels
#'   minor_pos                — intermediate tick positions (no labels)
#'
#' @param channel_name   channel name (to look up W / T)
#' @param axis_range     length-2 numeric — visible [lo, hi] in display space
#' @param raw_channel_vals  raw (untransformed) values for the channel (for T)
#' @param logicle_w_params  named list of user/auto W values
#' @return named list with major_pos (numeric), major_labels (character),
#'   minor_pos (numeric), or NULL on error
generate_logicle_ticks <- function(channel_name,
                                   axis_range,
                                   raw_channel_vals = NULL,
                                   logicle_w_params = NULL) {
  tryCatch({
    t_val <- .resolve_logicle_t(raw_channel_vals)
    w_val <- if (!is.null(logicle_w_params) && !is.null(logicle_w_params[[channel_name]])) {
      as.numeric(logicle_w_params[[channel_name]])
    } else {
      if (!is.null(raw_channel_vals)) {
        .estimate_logicle_w(raw_channel_vals, t_val = t_val)
      } else 0.5
    }
    if (!is.finite(w_val)) w_val <- 0.5
    w_val <- max(0.1, min(w_val, 2.0))

    lg <- flowCore::logicleTransform(
      transformationId = "lg_tick",
      w = w_val, t = t_val, m = 4.5, a = 0
    )

    # ---- use inverse to find raw values at the axis edges -----------------
    inv_lg <- flowCore::inverseLogicleTransform(
      flowCore::logicleTransform("lg_inv_tick", w = w_val, t = t_val, m = 4.5, a = 0),
      transformationId = "lg_inv_tick2"
    )
    lo <- axis_range[1];  hi <- axis_range[2]
    raw_lo <- tryCatch(as.numeric(inv_lg(lo)), error = function(e) -t_val)
    raw_hi <- tryCatch(as.numeric(inv_lg(hi)), error = function(e) t_val)
    if (!is.finite(raw_lo)) raw_lo <- -t_val
    if (!is.finite(raw_hi)) raw_hi <-  t_val

    # ---- generate decade candidates spanning the full visible raw range ---
    max_pos_exp <- ceiling(log10(max(raw_hi, 100)))
    min_neg_exp <- if (raw_lo < -1) ceiling(log10(abs(raw_lo))) else 2L
    min_neg_exp <- min(min_neg_exp, 5L)    # up to -100K on negative side

    pos_decades <- 10^seq(2, max_pos_exp)  # 100 … raw_hi rounded up to decade
    neg_decades <- -(10^seq(2, min_neg_exp))

    major_raw <- sort(unique(c(neg_decades, 0, pos_decades)))

    # Minor ticks: full 2–9 multipliers per decade (proper log spacing)
    minor_raw <- numeric(0)
    for (d in pos_decades) {
      minor_raw <- c(minor_raw, d * 2:9)
    }
    for (d in abs(neg_decades)) {
      minor_raw <- c(minor_raw, -(d * 2:9))
    }
    minor_raw <- sort(unique(minor_raw))
    minor_raw <- minor_raw[!minor_raw %in% major_raw]

    # ---- transform all candidates to display space ------------------------
    safe_lg <- function(raw_vals) {
      if (length(raw_vals) == 0) return(numeric(0))
      tryCatch(as.numeric(lg(raw_vals)),
               error = function(e) rep(NA_real_, length(raw_vals)))
    }

    major_disp <- safe_lg(major_raw)
    minor_disp <- safe_lg(minor_raw)

    # ---- format labels ----------------------------------------------------
    fmt_label <- function(raw) {
      vapply(raw, function(v) {
        a <- abs(v); s <- if (v < 0) "-" else ""
        if (a == 0)    "0"
        else if (a >= 1e6) paste0(s, a / 1e6, "M")
        else if (a >= 1e3) paste0(s, a / 1e3, "K")
        else               paste0(s, a)
      }, character(1))
    }

    # ---- filter to visible range -----------------------------------------
    keep_m <- is.finite(major_disp) & major_disp >= lo & major_disp <= hi
    keep_n <- is.finite(minor_disp) & minor_disp >= lo & minor_disp <= hi

    list(
      major_pos    = as.numeric(major_disp[keep_m]),
      major_labels = as.character(fmt_label(major_raw[keep_m])),
      minor_pos    = as.numeric(minor_disp[keep_n])
    )

  }, error = function(e) NULL)
}

#' Generate log-decade tick positions for an arcsinh-transformed axis
#'
#' For CyTOF data (or any arcsinh(x / cofactor) display space), returns
#' decade ticks (0, ±10, ±100, ±1K, ±10K, ±100K, ±1M) in display space
#' with intermediate 2–9 minor ticks per decade. Produces FlowJo-like
#' "log" axes that stay in sync with the actual data transform.
#'
#' @param axis_range  length-2 numeric — visible [lo, hi] in display space
#' @param cofactor    arcsinh cofactor (5 for metals, 150 for scatter)
#' @return named list(major_pos, major_labels, minor_pos) or NULL on error
generate_asinh_ticks <- function(axis_range, cofactor = 5) {
  tryCatch({
    cf <- suppressWarnings(as.numeric(cofactor))
    if (!is.finite(cf) || cf <= 0) cf <- 5
    if (is.null(axis_range) || length(axis_range) != 2) return(NULL)
    lo <- as.numeric(axis_range[1]); hi <- as.numeric(axis_range[2])
    if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)

    fwd <- function(raw) asinh(raw / cf)
    inv <- function(disp) cf * sinh(disp)

    raw_lo <- inv(lo); raw_hi <- inv(hi)

    # Decade range
    max_pos_exp <- if (raw_hi > 1) ceiling(log10(max(raw_hi, 10))) else 1L
    max_pos_exp <- max(1L, min(as.integer(max_pos_exp), 7L))
    min_neg_exp <- if (raw_lo < -1) ceiling(log10(abs(raw_lo))) else 0L
    min_neg_exp <- max(0L, min(as.integer(min_neg_exp), 7L))

    pos_decades <- 10^seq(1, max_pos_exp)
    neg_decades <- if (min_neg_exp >= 1) -(10^seq(1, min_neg_exp)) else numeric(0)

    major_raw <- sort(unique(c(neg_decades, 0, pos_decades)))

    minor_raw <- numeric(0)
    for (d in pos_decades) minor_raw <- c(minor_raw, d * 2:9)
    for (d in abs(neg_decades)) minor_raw <- c(minor_raw, -(d * 2:9))
    minor_raw <- sort(unique(minor_raw))
    minor_raw <- minor_raw[!minor_raw %in% major_raw]

    major_disp <- fwd(major_raw)
    minor_disp <- fwd(minor_raw)

    fmt_label <- function(raw) {
      vapply(raw, function(v) {
        a <- abs(v); s <- if (v < 0) "-" else ""
        if (a == 0)       "0"
        else if (a >= 1e6) paste0(s, a / 1e6, "M")
        else if (a >= 1e3) paste0(s, a / 1e3, "K")
        else               paste0(s, a)
      }, character(1))
    }

    keep_m <- is.finite(major_disp) & major_disp >= lo & major_disp <= hi
    keep_n <- is.finite(minor_disp) & minor_disp >= lo & minor_disp <= hi

    list(
      major_pos    = as.numeric(major_disp[keep_m]),
      major_labels = as.character(fmt_label(major_raw[keep_m])),
      minor_pos    = as.numeric(minor_disp[keep_n])
    )
  }, error = function(e) NULL)
}

#' Generate regular log-interval ticks for FSC/SSC scatter axes.
#'
#' Scatter channels are displayed in arcsinh(raw/cofactor) space, but users
#' expect canonical log-style ticks in raw units.
#' Uses major ticks at 1/2/5 x 10^n and minor ticks at 3/4/6/7/8/9 x 10^n.
#' Returned positions are in display space; labels are raw-space values.
#'
#' @param axis_range length-2 numeric visible [lo, hi] in display space
#' @param cofactor arcsinh cofactor for scatter channel (typically 150)
#' @return named list(major_pos, major_labels, minor_pos) or NULL on error
generate_scatter_ticks <- function(axis_range, cofactor = 150) {
  tryCatch({
    cf <- suppressWarnings(as.numeric(cofactor))
    if (!is.finite(cf) || cf <= 0) cf <- 150
    if (is.null(axis_range) || length(axis_range) != 2) return(NULL)
    lo <- as.numeric(axis_range[1]); hi <- as.numeric(axis_range[2])
    if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)

    fwd <- function(raw) asinh(raw / cf)
    inv <- function(disp) cf * sinh(disp)

    raw_lo <- inv(lo)
    raw_hi <- inv(hi)
    raw_min <- min(raw_lo, raw_hi)
    raw_max <- max(raw_lo, raw_hi)

    .decades_in_range <- function(vmin, vmax) {
      if (!is.finite(vmin) || !is.finite(vmax) || vmax <= 0) return(integer(0))
      e_lo <- floor(log10(max(vmin, 1e-9)))
      e_hi <- ceiling(log10(vmax))
      seq.int(as.integer(e_lo), as.integer(e_hi))
    }

    pos_maj <- numeric(0); pos_min <- numeric(0)
    neg_maj <- numeric(0); neg_min <- numeric(0)

    if (raw_max > 0) {
      # If range includes zero, start around the linear-to-log transition scale.
      pos_floor <- if (raw_min > 0) raw_min else (cf / 10)
      pos_floor <- max(pos_floor, 1e-9)
      exps_pos <- .decades_in_range(pos_floor, raw_max)
      if (length(exps_pos) > 0) {
        pow_pos <- 10^exps_pos
        pos_maj <- pow_pos
        pos_min <- as.vector(outer(2:9, pow_pos, `*`))
      }
    }

    if (raw_min < 0) {
      neg_abs_max <- abs(raw_min)
      neg_abs_floor <- if (raw_max < 0) abs(raw_max) else (cf / 10)
      neg_abs_floor <- max(neg_abs_floor, 1e-9)
      exps_neg <- .decades_in_range(neg_abs_floor, neg_abs_max)
      if (length(exps_neg) > 0) {
        pow_neg <- 10^exps_neg
        neg_maj <- -pow_neg
        neg_min <- -as.vector(outer(2:9, pow_neg, `*`))
      }
    }

    major_raw <- sort(unique(c(neg_maj, if (raw_min <= 0 && raw_max >= 0) 0 else numeric(0), pos_maj)))
    major_raw <- major_raw[major_raw >= raw_min & major_raw <= raw_max & is.finite(major_raw)]

    minor_raw <- sort(unique(c(neg_min, pos_min)))
    minor_raw <- minor_raw[minor_raw >= raw_min & minor_raw <= raw_max & is.finite(minor_raw)]
    minor_raw <- minor_raw[!minor_raw %in% major_raw]

    if (length(major_raw) == 0 && raw_min <= 0 && raw_max >= 0) {
      major_raw <- 0
    }

    major_disp <- fwd(major_raw)
    minor_disp <- fwd(minor_raw)

    fmt_label <- function(v) {
      a <- abs(v)
      s <- if (v < 0) "-" else ""
      if (a < 1e-9) return("0")
      if (a >= 1e6) return(paste0(s, format(signif(a / 1e6, 3), trim = TRUE, scientific = FALSE), "M"))
      if (a >= 1e3) return(paste0(s, format(signif(a / 1e3, 3), trim = TRUE, scientific = FALSE), "K"))
      if (a >= 1) return(paste0(s, format(round(a), trim = TRUE, scientific = FALSE)))
      paste0(s, format(signif(a, 2), trim = TRUE, scientific = FALSE))
    }

    list(
      major_pos = as.numeric(major_disp),
      major_labels = vapply(major_raw, fmt_label, character(1)),
      minor_pos = as.numeric(minor_disp),
      tick_mode = "scatter_log10"
    )
  }, error = function(e) NULL)
}

#' Generate nicely-rounded linear tick positions for scatter / linear-scale axes.
#'
#' Returns the same list structure as \code{generate_logicle_ticks} and
#' \code{generate_asinh_ticks} so it can be used identically downstream.
#' Tick positions are computed with \code{pretty()} and labelled with K / M
#' abbreviations (e.g. 100000 → "100K").
#'
#' @param axis_range  length-2 numeric [lo, hi] in display / data units
#' @param label_transform optional function applied to tick positions before
#'        formatting labels (e.g. inverse display transform)
#' @return named list(major_pos, major_labels, minor_pos) or NULL on error
generate_linear_ticks <- function(axis_range, label_transform = NULL) {
  tryCatch({
    lo <- as.numeric(axis_range[1])
    hi <- as.numeric(axis_range[2])
    if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)

    tks <- pretty(c(lo, hi), n = 5)
    tks <- tks[tks >= lo & tks <= hi]
    if (length(tks) == 0) return(NULL)

    fmt_label <- function(v) {
      a <- abs(v); s <- if (v < 0) "-" else ""
      if (a < 1e-9)      "0"
      else if (a >= 1e6) paste0(s, round(a / 1e6, 3), "M")
      else if (a >= 1e3) paste0(s, round(a / 1e3, 3), "K")
      else               paste0(s, format(a, scientific = FALSE, trim = TRUE))
    }

    label_vals <- tks
    if (is.function(label_transform)) {
      transformed <- suppressWarnings(as.numeric(label_transform(tks)))
      if (length(transformed) == length(tks) && all(is.finite(transformed))) {
        label_vals <- transformed
      }
    }

    list(
      major_pos    = as.numeric(tks),
      major_labels = vapply(label_vals, fmt_label, character(1)),
      minor_pos    = numeric(0)
    )
  }, error = function(e) NULL)
}

flow_forward_vertices <- function(vertices,
                                  x_channel,
                                  y_channel,
                                  raw_mat = NULL,
                                  channel_names = NULL,
                                  logicle_w_params = NULL,
                                  scatter_cofactor_params = NULL) {
  if (is.null(vertices) || length(vertices) == 0) return(vertices)

  x_raw <- NULL
  y_raw <- NULL
  if (!is.null(raw_mat) && !is.null(channel_names)) {
    if (x_channel %in% channel_names) x_raw <- raw_mat[, x_channel]
    if (y_channel %in% channel_names) y_raw <- raw_mat[, y_channel]
  }

  x_vals <- vapply(vertices, function(v) as.numeric(v[[1]]), numeric(1))
  y_vals <- vapply(vertices, function(v) as.numeric(v[[2]]), numeric(1))

  x_tx <- flow_transform_channel_values(
    raw_vals = x_vals,
    channel_name = x_channel,
    raw_channel_vals = x_raw,
    logicle_w_params = logicle_w_params,
    scatter_cofactor_params = scatter_cofactor_params
  )
  y_tx <- flow_transform_channel_values(
    raw_vals = y_vals,
    channel_name = y_channel,
    raw_channel_vals = y_raw,
    logicle_w_params = logicle_w_params,
    scatter_cofactor_params = scatter_cofactor_params
  )

  lapply(seq_along(x_tx), function(i) c(as.numeric(x_tx[[i]]), as.numeric(y_tx[[i]])))
}

flow_inverse_vertices <- function(vertices,
                                  x_channel,
                                  y_channel,
                                  raw_mat = NULL,
                                  channel_names = NULL,
                                  logicle_w_params = NULL,
                                  scatter_cofactor_params = NULL) {
  if (is.null(vertices) || length(vertices) == 0) return(vertices)

  x_raw <- NULL
  y_raw <- NULL
  if (!is.null(raw_mat) && !is.null(channel_names)) {
    if (x_channel %in% channel_names) x_raw <- raw_mat[, x_channel]
    if (y_channel %in% channel_names) y_raw <- raw_mat[, y_channel]
  }

  x_vals <- vapply(vertices, function(v) as.numeric(v[[1]]), numeric(1))
  y_vals <- vapply(vertices, function(v) as.numeric(v[[2]]), numeric(1))

  x_tx <- flow_inverse_channel_values(
    display_vals = x_vals,
    channel_name = x_channel,
    raw_channel_vals = x_raw,
    logicle_w_params = logicle_w_params,
    scatter_cofactor_params = scatter_cofactor_params
  )
  y_tx <- flow_inverse_channel_values(
    display_vals = y_vals,
    channel_name = y_channel,
    raw_channel_vals = y_raw,
    logicle_w_params = logicle_w_params,
    scatter_cofactor_params = scatter_cofactor_params
  )

  lapply(seq_along(x_tx), function(i) c(as.numeric(x_tx[[i]]), as.numeric(y_tx[[i]])))
}

#' Transform an event x channel matrix according to instrument type
#'
#' @param raw_mat event x channel matrix (untransformed)
#' @param channel_names character vector matching columns in raw_mat
#' @param instrument_type "cytof" or "flow"
#' @param cofactor arcsinh cofactor used for CyTOF metal channels
#' @param verbose print transform summary messages
#' @return transformed matrix (same dimensions as raw_mat)
transform_matrix_by_instrument <- function(raw_mat, channel_names,
                                           instrument_type,
                                           cofactor = 5,
                                           logicle_w_params = NULL,
                                           scatter_cofactor_params = NULL,
                                           verbose = FALSE) {
  if (!instrument_type %in% c("cytof", "flow")) {
    stop("instrument_type must be 'cytof' or 'flow'")
  }

  exprs_mat <- raw_mat

  if (instrument_type == "cytof") {
    # Arcsinh-transform ALL channels except acquisition-level raw params
    # (Time, Event_length, Cell_length, file_number).  This matches Cytobank's
    # display/gating space: both metal AND Gaussian parameter channels are
    # arcsinh-transformed, so imported GatingML gate vertices can be used
    # directly without coordinate conversion.
    raw_mask <- .is_cytof_raw_channel(channel_names)
    transform_mask <- !raw_mask
    if (any(transform_mask)) {
      exprs_mat[, transform_mask] <- asinh(raw_mat[, transform_mask] / cofactor)
      if (verbose) {
        n_metal <- sum(.is_metal_channel(channel_names))
        n_other <- sum(transform_mask) - n_metal
        message("  CyTOF: arcsinh/", cofactor, " on ",
                n_metal, " metal + ", n_other, " Gaussian/QC channel(s); ",
                sum(raw_mask), " channel(s) left raw")
      }
    } else {
      warning("No transformable channels detected; arcsinh/", cofactor,
              " applied to all channels as fallback.")
      exprs_mat <- asinh(raw_mat / cofactor)
    }
    return(exprs_mat)
  }

  # Flow cytometry — three channel classes
  qc_mask      <- .is_qc_channel(channel_names)
  scatter_mask <- .is_scatter_channel(channel_names) & !qc_mask
  signal_mask  <- !qc_mask & !scatter_mask

  # 1. Signal (fluorescence) channels -> logicle
  if (any(signal_mask)) {
    sig_chs <- channel_names[signal_mask]
    logicle_exprs <- raw_mat[, sig_chs, drop = FALSE]
    failed_chs <- character(0)

    for (ch in sig_chs) {
      vals <- raw_mat[, ch]
      logicle_exprs[, ch] <- tryCatch({
        t_val <- max(as.numeric(quantile(vals, 0.999, na.rm = TRUE)), 262144)
        m_val <- 4.5
        if (!is.null(logicle_w_params) && !is.null(logicle_w_params[[ch]])) {
          w_val <- as.numeric(logicle_w_params[[ch]])
          if (!is.finite(w_val)) w_val <- 0.5
          w_val <- max(0.1, min(w_val, 2.0))
        } else {
          w_val <- .estimate_logicle_w(vals, t_val = t_val, m_val = m_val)
        }
        lg <- flowCore::logicleTransform(
          transformationId = paste0("lg_", ch),
          w = w_val, t = t_val, m = m_val, a = 0)
        lg(vals)
      }, error = function(e) {
        tryCatch({
          ch_ff <- flowCore::flowFrame(exprs = raw_mat[, ch, drop = FALSE])
          tr <- flowCore::estimateLogicle(ch_ff, channels = ch)
          flowCore::exprs(flowCore::transform(ch_ff, tr))[, 1]
        }, error = function(e2) {
          failed_chs <<- c(failed_chs, ch)
          asinh(vals / 150)
        })
      })
    }
    exprs_mat[, sig_chs] <- logicle_exprs
    if (verbose) {
      message("  Flow: logicle on ", length(sig_chs) - length(failed_chs),
              " signal channel(s)")
      if (length(failed_chs) > 0) {
        message("  Flow: arcsinh/150 fallback on ", length(failed_chs),
                " channel(s): ", paste(failed_chs, collapse = ", "))
      }
    }
  }

  # 2. Scatter channels (FSC/SSC) -> arcsinh(x / cofactor)
  if (any(scatter_mask)) {
    scatter_chs <- channel_names[scatter_mask]
    for (ch in scatter_chs) {
      cf <- 150
      if (!is.null(scatter_cofactor_params) && !is.null(scatter_cofactor_params[[ch]])) {
        cf <- as.numeric(scatter_cofactor_params[[ch]])
        if (!is.finite(cf) || cf <= 0) cf <- 150
      }
      exprs_mat[, ch] <- asinh(raw_mat[, ch] / cf)
    }
    if (verbose) {
      message("  Flow: arcsinh/scatter-cofactor on ", sum(scatter_mask),
              " scatter channel(s): ",
              paste(channel_names[scatter_mask], collapse = ", "))
    }
  }

  # 3. QC/timing channels -> left as raw
  if (any(qc_mask) && verbose) {
    message("  Flow: ", sum(qc_mask), " QC channel(s) left raw: ",
            paste(channel_names[qc_mask], collapse = ", "))
  }

  exprs_mat
}

# ---------------------------------------------------------------------------
# Main import function
# ---------------------------------------------------------------------------

#' Import one or more FCS files and return a SingleCellExperiment
#'
#' @param file_paths   Character vector of FCS file paths
#' @param sample_names Optional character vector of sample names (derived from
#'                     filenames if NULL)
#' @param cofactor     Arcsinh cofactor for CyTOF metal channels (default 5)
#' @return A SingleCellExperiment with assays "counts" (raw) and "exprs"
#'         (transformed). SCE metadata contains instrument_type, transform_type,
#'         experiment_info (for the sample-filter table), and cofactor.
import_fcs_files <- function(file_paths, sample_names = NULL, cofactor = 5,
                             instrument_mode = c("auto", "cytof", "flow")) {

  instrument_mode <- match.arg(instrument_mode)

  if (!requireNamespace("flowCore", quietly = TRUE)) {
    stop("Package 'flowCore' is required.\n",
         "Install with: BiocManager::install('flowCore')")
  }

  if (length(file_paths) == 0) stop("No FCS file paths provided")

  if (is.null(sample_names)) {
    sample_names <- tools::file_path_sans_ext(basename(file_paths))
  }
  if (length(sample_names) != length(file_paths)) {
    stop("sample_names length must match file_paths length")
  }

  message("Importing ", length(file_paths), " FCS file(s) ...")

  all_counts     <- list()
  all_exprs      <- list()
  all_sample_ids <- character(0)
  channel_names  <- NULL
  instrument_type <- NULL
  detected_type <- NULL
  pnn_to_channel <- NULL
  channel_to_pnn <- NULL

  for (i in seq_along(file_paths)) {

    ff <- flowCore::read.FCS(file_paths[i], transformation = FALSE,
                              truncate_max_range = FALSE)

    # Detect instrument type from the first file
    if (is.null(instrument_type)) {
      params <- flowCore::parameters(ff)
      pdata  <- flowCore::pData(params)
      raw_names <- as.character(pdata$name)
      detected_type <- detect_instrument_type(raw_names)
      instrument_type <- if (instrument_mode == "auto") detected_type else instrument_mode
      if (instrument_mode == "auto") {
        message("  Detected instrument: ", instrument_type)
      } else {
        message("  Using user-selected instrument: ", instrument_type,
                " (auto detected: ", detected_type, ")")
      }
    }

    # For flow data: filter channels (removes spectral raw, renames unmixed)
    if (instrument_type == "flow") {
      filt <- filter_flow_channels(ff)
      ff <- filt$ff
      display_names <- filt$display_names
    } else {
      # CyTOF: use $PnS (desc) as display name, fall back to $PnN
      params <- flowCore::parameters(ff)
      pdata  <- flowCore::pData(params)
      if ("desc" %in% colnames(pdata)) {
        desc      <- as.character(pdata$desc)
        names_pn  <- as.character(pdata$name)
        display_names <- ifelse(is.na(desc) | nchar(trimws(desc)) == 0,
                                names_pn, desc)
      } else {
        display_names <- as.character(pdata$name)
      }
    }

    raw_mat <- flowCore::exprs(ff)
    pnn_names <- colnames(raw_mat)
    colnames(raw_mat) <- display_names

    if (!is.null(pnn_names) && length(pnn_names) == length(display_names)) {
      map_now <- setNames(as.character(display_names), as.character(pnn_names))
      inv_now <- setNames(as.character(pnn_names), as.character(display_names))
      if (is.null(pnn_to_channel)) {
        pnn_to_channel <- map_now
      } else {
        pnn_to_channel <- c(pnn_to_channel, map_now)
        pnn_to_channel <- pnn_to_channel[!duplicated(names(pnn_to_channel))]
      }
      if (is.null(channel_to_pnn)) {
        channel_to_pnn <- inv_now
      } else {
        channel_to_pnn <- c(channel_to_pnn, inv_now)
        channel_to_pnn <- channel_to_pnn[!duplicated(names(channel_to_pnn))]
      }
    }

    # Set channel names from first file
    if (is.null(channel_names)) {
      channel_names <- display_names
      message("  Channels: ", length(channel_names),
              " | metal: ", sum(.is_metal_channel(channel_names)),
              " | scatter: ", sum(.is_scatter_channel(channel_names)),
              " | QC: ", sum(.is_qc_channel(channel_names)))
    } else {
      # Check channel consistency across files
      if (!identical(sort(display_names), sort(channel_names))) {
        warning("File '", basename(file_paths[i]),
                "' has different channels; using common channels only.")
        common <- intersect(channel_names, display_names)
        if (length(common) == 0) stop("No common channels between files")
        channel_names <- common
      }
    }

    raw_mat   <- raw_mat[, channel_names, drop = FALSE]
    exprs_mat <- transform_matrix_by_instrument(
      raw_mat = raw_mat,
      channel_names = channel_names,
      instrument_type = instrument_type,
      cofactor = cofactor,
      verbose = (i == 1)
    )

    all_counts[[i]]  <- raw_mat
    all_exprs[[i]]   <- exprs_mat
    all_sample_ids   <- c(all_sample_ids,
                           rep(sample_names[i], nrow(raw_mat)))
  }

  # Concatenate all files
  counts_combined <- do.call(rbind, all_counts)
  exprs_combined  <- do.call(rbind, all_exprs)

  # Build SCE: channels × events
  sce <- SingleCellExperiment::SingleCellExperiment(
    assays = list(
      counts = t(counts_combined),
      exprs  = t(exprs_combined)
    )
  )

  # colData: sample_id as factor (enables "Color by colData" in the app)
  SummarizedExperiment::colData(sce)$sample_id <- factor(all_sample_ids)

  # experiment_info (used by build_sample_table() for the sample-filter DataTable)
  exp_info <- data.frame(
    sample_id = sample_names,
    n_cells   = vapply(all_counts, nrow, integer(1)),
    file_name = basename(file_paths),
    stringsAsFactors = FALSE
  )

  # Store provenance in SCE metadata
  S4Vectors::metadata(sce)$experiment_info <- exp_info
  S4Vectors::metadata(sce)$instrument_type <- instrument_type
  S4Vectors::metadata(sce)$instrument_type_detected <-
    if (!is.null(detected_type)) detected_type else instrument_type
  S4Vectors::metadata(sce)$instrument_type_source <-
    if (instrument_mode == "auto") "auto_detected" else "manual_override"
  S4Vectors::metadata(sce)$instrument_mode_choice <- instrument_mode
  S4Vectors::metadata(sce)$transform_type  <-
    if (instrument_type == "cytof") "arcsinh" else "logicle"
  S4Vectors::metadata(sce)$cofactor <- cofactor
  if (!is.null(pnn_to_channel) && length(pnn_to_channel) > 0) {
    S4Vectors::metadata(sce)$pnn_to_channel <- as.list(pnn_to_channel)
  }
  if (!is.null(channel_to_pnn) && length(channel_to_pnn) > 0) {
    S4Vectors::metadata(sce)$channel_to_pnn <- as.list(channel_to_pnn)
  }

  message("Done: ", ncol(sce), " events, ", nrow(sce),
          " channels, ", length(sample_names), " sample(s) [", instrument_type, "]")
  sce
}

# ---------------------------------------------------------------------------
# Utilities
# ---------------------------------------------------------------------------

#' Generate a clean R variable name from FCS filenames
make_sce_name <- function(file_paths) {
  base  <- tools::file_path_sans_ext(basename(file_paths[1]))
  clean <- gsub("[^A-Za-z0-9_]", "_", base)
  clean <- gsub("_+", "_", clean)
  clean <- sub("^_", "", clean)
  if (length(file_paths) > 1) clean <- paste0(clean, "_merged")
  paste0("sce_", clean)
}

#' Recompute exprs assay from counts using selected instrument mode
#'
#' Useful for SCE objects loaded from workspace/RDS where the mode needs to be
#' corrected or forced manually.
rebuild_sce_exprs_from_counts <- function(sce,
                                          instrument_type = c("cytof", "flow"),
                                          cofactor = 5,
                                          verbose = FALSE) {
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("Input object must be a SingleCellExperiment")
  }

  instrument_type <- match.arg(instrument_type)
  assays <- SummarizedExperiment::assayNames(sce)
  if (!"counts" %in% assays) {
    stop("SCE does not contain a 'counts' assay; cannot recompute 'exprs'.")
  }

  raw_mat <- as.matrix(t(SummarizedExperiment::assay(sce, "counts")))
  channel_names <- rownames(sce)
  if (is.null(channel_names) || length(channel_names) != ncol(raw_mat)) {
    channel_names <- colnames(raw_mat)
  }

  exprs_mat <- transform_matrix_by_instrument(
    raw_mat = raw_mat,
    channel_names = channel_names,
    instrument_type = instrument_type,
    cofactor = cofactor,
    verbose = verbose
  )

  SummarizedExperiment::assay(sce, "exprs") <- t(exprs_mat)
  S4Vectors::metadata(sce)$instrument_type <- instrument_type
  S4Vectors::metadata(sce)$transform_type <-
    if (instrument_type == "cytof") "arcsinh" else "logicle"
  S4Vectors::metadata(sce)$cofactor <- cofactor

  sce
}

#' Append additional FCS files into an existing SCE
#'
#' Re-imports incoming FCS files using the same transform pathway as
#' import_fcs_files(), then appends events to the existing SCE while preserving
#' workspace and other metadata fields already present on the original object.
append_fcs_to_sce <- function(sce,
                              file_paths,
                              sample_names = NULL,
                              cofactor = NULL,
                              instrument_mode = c("auto", "cytof", "flow")) {
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("Input object must be a SingleCellExperiment")
  }
  if (length(file_paths) == 0) {
    stop("No FCS file paths provided")
  }

  required_assays <- c("counts", "exprs")
  missing_assays <- setdiff(required_assays, SummarizedExperiment::assayNames(sce))
  if (length(missing_assays) > 0) {
    stop("SCE is missing required assay(s): ", paste(missing_assays, collapse = ", "))
  }

  instrument_mode <- match.arg(instrument_mode)

  md_existing <- S4Vectors::metadata(sce)
  instrument_existing <- md_existing$instrument_type
  if (is.null(instrument_existing) || !instrument_existing %in% c("cytof", "flow")) {
    instrument_existing <- detect_instrument_type(rownames(sce))
  }

  # Keep appended files on the current instrument transform unless user forces.
  append_mode <- instrument_mode
  if (append_mode == "auto") append_mode <- instrument_existing

  if (is.null(cofactor) || length(cofactor) == 0 || !is.finite(cofactor) || cofactor <= 0) {
    cofactor <- suppressWarnings(as.numeric(md_existing$cofactor))
    if (length(cofactor) == 0 || !is.finite(cofactor) || cofactor <= 0) {
      cofactor <- 5
    }
  }

  if (is.null(sample_names)) {
    sample_names <- tools::file_path_sans_ext(basename(file_paths))
  }
  if (length(sample_names) != length(file_paths)) {
    stop("sample_names length must match file_paths length")
  }

  # Avoid sample_id collisions with existing IDs.
  existing_sample_ids <- as.character(SummarizedExperiment::colData(sce)$sample_id)
  if (length(existing_sample_ids) > 0) {
    sample_names <- utils::tail(
      make.unique(c(unique(existing_sample_ids), as.character(sample_names)), sep = "_"),
      length(sample_names)
    )
  }

  incoming <- import_fcs_files(
    file_paths = file_paths,
    sample_names = sample_names,
    cofactor = cofactor,
    instrument_mode = append_mode
  )

  existing_channels <- rownames(sce)
  incoming_channels <- rownames(incoming)

  missing_in_incoming <- setdiff(existing_channels, incoming_channels)
  if (length(missing_in_incoming) > 0) {
    stop(
      "Cannot append: incoming files are missing ", length(missing_in_incoming),
      " existing channel(s), e.g. ", paste(utils::head(missing_in_incoming, 5), collapse = ", "),
      "."
    )
  }

  # Keep existing channel basis to avoid breaking saved gates/workspaces.
  incoming <- incoming[existing_channels, , drop = FALSE]

  counts_existing <- SummarizedExperiment::assay(sce, "counts")
  exprs_existing <- SummarizedExperiment::assay(sce, "exprs")
  counts_new <- SummarizedExperiment::assay(incoming, "counts")
  exprs_new <- SummarizedExperiment::assay(incoming, "exprs")

  combined_counts <- cbind(counts_existing[existing_channels, , drop = FALSE],
                           counts_new[existing_channels, , drop = FALSE])
  combined_exprs <- cbind(exprs_existing[existing_channels, , drop = FALSE],
                          exprs_new[existing_channels, , drop = FALSE])

  cd_existing <- as.data.frame(SummarizedExperiment::colData(sce))
  cd_new <- as.data.frame(SummarizedExperiment::colData(incoming))
  all_cd_cols <- union(colnames(cd_existing), colnames(cd_new))
  for (nm in setdiff(all_cd_cols, colnames(cd_existing))) cd_existing[[nm]] <- NA
  for (nm in setdiff(all_cd_cols, colnames(cd_new))) cd_new[[nm]] <- NA
  cd_existing <- cd_existing[, all_cd_cols, drop = FALSE]
  cd_new <- cd_new[, all_cd_cols, drop = FALSE]
  cd_combined <- S4Vectors::DataFrame(rbind(cd_existing, cd_new), check.names = FALSE)

  sce_out <- SingleCellExperiment::SingleCellExperiment(
    assays = list(
      counts = combined_counts,
      exprs = combined_exprs
    ),
    rowData = SummarizedExperiment::rowData(sce),
    colData = cd_combined
  )

  # Merge experiment_info tables by row-binding with column fill.
  exp_existing <- md_existing$experiment_info
  exp_new <- S4Vectors::metadata(incoming)$experiment_info
  if (is.null(exp_existing) || !is.data.frame(exp_existing)) {
    exp_combined <- exp_new
  } else if (is.null(exp_new) || !is.data.frame(exp_new)) {
    exp_combined <- exp_existing
  } else {
    exp_cols <- union(colnames(exp_existing), colnames(exp_new))
    for (nm in setdiff(exp_cols, colnames(exp_existing))) exp_existing[[nm]] <- NA
    for (nm in setdiff(exp_cols, colnames(exp_new))) exp_new[[nm]] <- NA
    exp_combined <- rbind(
      exp_existing[, exp_cols, drop = FALSE],
      exp_new[, exp_cols, drop = FALSE]
    )
    rownames(exp_combined) <- NULL
  }

  md_out <- md_existing
  md_out$experiment_info <- exp_combined
  md_out$instrument_type <- instrument_existing
  md_out$instrument_type_detected <- if (!is.null(md_existing$instrument_type_detected)) {
    md_existing$instrument_type_detected
  } else {
    instrument_existing
  }
  md_out$instrument_mode_choice <- if (!is.null(md_existing$instrument_mode_choice)) {
    md_existing$instrument_mode_choice
  } else {
    append_mode
  }
  md_out$instrument_type_source <- if (!is.null(md_existing$instrument_type_source)) {
    md_existing$instrument_type_source
  } else {
    "auto_detected"
  }
  md_out$transform_type <- if (instrument_existing == "cytof") "arcsinh" else "logicle"
  md_out$cofactor <- cofactor

  incoming_md <- S4Vectors::metadata(incoming)
  existing_ch_to_pnn <- md_existing$channel_to_pnn
  incoming_ch_to_pnn <- incoming_md$channel_to_pnn
  if (is.null(existing_ch_to_pnn) || length(existing_ch_to_pnn) == 0) {
    md_out$channel_to_pnn <- incoming_ch_to_pnn
  } else if (!is.null(incoming_ch_to_pnn) && length(incoming_ch_to_pnn) > 0) {
    merged <- c(existing_ch_to_pnn, incoming_ch_to_pnn)
    md_out$channel_to_pnn <- merged[!duplicated(names(merged))]
  }

  existing_pnn_to_ch <- md_existing$pnn_to_channel
  incoming_pnn_to_ch <- incoming_md$pnn_to_channel
  if (is.null(existing_pnn_to_ch) || length(existing_pnn_to_ch) == 0) {
    md_out$pnn_to_channel <- incoming_pnn_to_ch
  } else if (!is.null(incoming_pnn_to_ch) && length(incoming_pnn_to_ch) > 0) {
    merged <- c(existing_pnn_to_ch, incoming_pnn_to_ch)
    md_out$pnn_to_channel <- merged[!duplicated(names(merged))]
  }

  existing_append_history <- md_existing$fcs_append_history
  if (is.null(existing_append_history)) existing_append_history <- list()

  md_out$fcs_append_history <- c(
    existing_append_history,
    list(list(
      appended_at = as.character(Sys.time()),
      n_files = length(file_paths),
      file_names = basename(file_paths),
      sample_names = as.character(sample_names)
    ))
  )

  S4Vectors::metadata(sce_out) <- md_out
  sce_out
}
