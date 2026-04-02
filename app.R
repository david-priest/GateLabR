# GateLabR — Main Shiny Application
# 3-column layout: sample filter | tabbed plot | gates + populations
# Tabs: Gating | Strategy | Illustration

# Remove the default 5 MB upload cap so large FCS / RDS files can be loaded
options(shiny.maxRequestSize = Inf)

library(shiny)
library(SingleCellExperiment)
library(SummarizedExperiment)
library(sp)
library(base64enc)
library(uuid)
library(jsonlite)
library(S4Vectors)
library(DT)

if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b

source("R/data_utils.R")
source("R/models.R")
source("R/gate_engine.R")
source("R/workspace.R")
source("R/fcs_import.R")
source("R/gatingml_import.R")
source("R/fcs_export.R")
source("R/strategy_utils.R")

# ── Discover SCE objects in global environment ──────────────────────────────
find_sce_objects <- function() {
  sce_names <- character(0)
  for (nm in ls(envir = .GlobalEnv)) {
    tryCatch({
      obj <- get(nm, envir = .GlobalEnv)
      if (methods::is(obj, "SingleCellExperiment")) {
        sce_names <- c(sce_names, nm)
      }
    }, error = function(e) NULL)
  }
  sce_names
}

.is_gate_col <- function(x) {
  is.factor(x) && all(levels(x) %in% c("In", "Out", "TRUE", "FALSE"))
}

build_sample_table <- function(sce) {
  cd <- as.data.frame(SummarizedExperiment::colData(sce))
  exp_info <- S4Vectors::metadata(sce)$experiment_info
  if (!is.null(exp_info) && is.data.frame(exp_info) && nrow(exp_info) > 0) {
    tbl <- exp_info
    keep <- !vapply(tbl, .is_gate_col, logical(1))
    tbl <- tbl[, keep, drop = FALSE]
    rownames(tbl) <- NULL
    if ("sample_id" %in% colnames(tbl) && "sample_id" %in% colnames(cd)) {
      cd_ids <- as.character(cd$sample_id)
      tbl_ids <- as.character(tbl$sample_id)
      group_map <- split(seq_along(cd_ids), cd_ids)
      keys <- tbl_ids
    } else {
      group_map <- setNames(lapply(seq_len(nrow(tbl)), function(i) i),
                            as.character(seq_len(nrow(tbl))))
      keys <- as.character(seq_len(nrow(tbl)))
    }
    return(list(table = tbl, group_map = group_map, keys = keys))
  }
  if ("sample_id" %in% colnames(cd)) {
    sample_ids <- as.character(cd$sample_id)
    unique_samples <- unique(sample_ids)
    const_cols <- vapply(cd, function(col_vals) {
      col_str <- as.character(col_vals)
      all(vapply(unique_samples, function(s) {
        length(unique(col_str[sample_ids == s])) == 1L
      }, logical(1)))
    }, logical(1))
    cd_const <- cd[, const_cols, drop = FALSE]
    gate_cols <- vapply(cd_const, .is_gate_col, logical(1))
    cd_const <- cd_const[, !gate_cols, drop = FALSE]
    if (ncol(cd_const) == 0) cd_const <- data.frame(sample_id = unique_samples)
    first_idx <- match(unique_samples, sample_ids)
    tbl <- cd_const[first_idx, , drop = FALSE]
    rownames(tbl) <- NULL
    group_map <- split(seq_along(sample_ids), sample_ids)
    keys <- unique_samples
    return(list(table = tbl, group_map = group_map, keys = keys))
  }
  if (ncol(cd) == 0) return(NULL)
  meta_cols <- vapply(cd, function(x) {
    (is.character(x) || is.factor(x)) && !.is_gate_col(x)
  }, logical(1))
  cd_meta <- cd[, meta_cols, drop = FALSE]
  if (ncol(cd_meta) == 0) return(NULL)
  cd_meta_str <- do.call(paste, c(lapply(cd_meta, as.character), sep = "\x1F"))
  unique_mask <- !duplicated(cd_meta_str)
  tbl <- cd_meta[unique_mask, , drop = FALSE]
  rownames(tbl) <- NULL
  group_map <- split(seq_len(nrow(cd)), cd_meta_str)
  keys <- cd_meta_str[unique_mask]
  list(table = tbl, group_map = group_map, keys = keys)
}

# ══════════════════════════════════════════════════════════════════════════════
# UI
# ══════════════════════════════════════════════════════════════════════════════

ui <- fluidPage(
  tags$head(
    tags$script(src = "d3.v7.min.js"),
    tags$script(src = "cytof_plot.js"),
    tags$script(src = "mini_plot.js"),
    tags$link(rel = "stylesheet", href = "custom.css")
  ),

  titlePanel("GateLabR"),

  fluidRow(
    # ═══════════════════════════════════════════════════════════════════════════
    # LEFT COLUMN: SCE/FCS + sample filter
    # ═══════════════════════════════════════════════════════════════════════════
    column(3,
      tags$div(class = "panel-section",

        # ── SCE + Assay on one row ──
        fluidRow(
          column(6, selectInput("sce_select", "SCE:", choices = NULL)),
          column(6, selectInput("assay_select", "Assay:", choices = NULL))
        ),
        tags$div(style = "margin: -4px 0 6px 0;",
          actionButton("rename_sce_btn", "Rename Loaded SCE",
                       class = "btn-xs btn-default")
        ),

        # ── FCS import ──
        tags$div(class = "section-header", "Import FCS"),
        tags$div(class = "fcs-inline-controls",
          tags$div(class = "fcs-inline-item",
            fileInput("fcs_upload", NULL,
                      multiple = TRUE, accept = ".fcs",
                      buttonLabel = "Choose FCS...",
                      placeholder = "No files selected")
          ),
          tags$div(class = "fcs-inline-item",
            fileInput("fcs_append_upload", NULL,
                      multiple = TRUE, accept = ".fcs",
                      buttonLabel = "Choose Append FCS...",
                      placeholder = "No files selected")
          ),
          tags$div(class = "fcs-inline-action",
            actionButton("append_fcs_btn", "Append",
                         class = "btn-sm btn-default")
          )
        ),
        radioButtons("instrument_mode", "Instrument mode:",
               choices = c("Auto-detect" = "auto",
               "Force CyTOF" = "cytof",
               "Force Flow" = "flow"),
               selected = "auto", inline = TRUE),
        actionButton("apply_instrument_mode_btn", "Apply Mode to Loaded SCE",
               class = "btn-sm btn-default", style = "margin-bottom: 6px;"),
        uiOutput("instrument_badge_ui"),

        # ── Sample filter ──
        tags$div(class = "section-header",
          "Sample Filter",
          tags$span(
            textOutput("sample_filter_summary", inline = TRUE),
            style = "font-weight: normal; font-size: 11px; color: #888;"
          )
        ),
        tags$div(class = "sample-filter-panel",
          tags$div(class = "sample-filter-subheader",
                   "Use column filters or click rows to select samples"),
          DT::dataTableOutput("sample_filter_table")
        )
      )
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # CENTER COLUMN: tabbed (Gating | Strategy | Illustration)
    # ═══════════════════════════════════════════════════════════════════════════
    column(5,
      tabsetPanel(id = "main_tabs", type = "tabs",

        # ── Tab 1: Gating (biplot) ────────────────────────────────────────────
        tabPanel("Gating",
          tags$div(class = "plot-controls-bar",
            tags$div(class = "mode-toolbar",
              actionButton("mode_navigate", "Nav", class = "btn-sm btn-default active-mode"),
              actionButton("mode_rect", "Rect", class = "btn-sm btn-default"),
              actionButton("mode_poly", "Poly", class = "btn-sm btn-default"),
              actionButton("mode_cancel", "Cancel", class = "btn-sm btn-warning")
            ),
            tags$div(style = "display:flex; gap:4px; margin-left: auto;",
              actionButton("flip_axes", "", icon = icon("arrows-h"),
                           class = "btn-xs btn-default"),
              actionButton("reset_view_btn", "Reset", class = "btn-xs btn-default"),
              actionButton("refresh_plot_btn", "Refresh", class = "btn-xs btn-default")
            )
          ),
          tags$div(id = "cytof-plot-container",
                   style = "width: 100%;"),

          # Hidden X/Y selects: axis-label clicks update these; UI is on the plot
          tags$div(style = "display:none;",
            selectInput("x_channel", NULL, choices = NULL),
            selectInput("y_channel", NULL, choices = NULL)
          ),

          tags$div(class = "below-plot-controls",
            # Display mode + opacity on one compact row
            tags$div(style = "display:flex; align-items:center; gap:8px; flex-wrap:wrap;",
              radioButtons("display_mode", NULL,
                           choices = c("Scatter" = "scatter",
                                       "Pseudo" = "pseudocolor",
                                       "Contour" = "contour"),
                           selected = "pseudocolor", inline = TRUE),
              tags$div(style = "display:flex; align-items:center; gap:4px; min-width:140px;",
                tags$span("Opacity:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                tags$div(class = "opacity-slider-wrap", style = "width:150px;",
                  sliderInput("point_alpha", NULL,
                              min = 0.05, max = 1.0, value = 0.35, step = 0.05,
                              width = "100%")
                )
              ),
              tags$div(class = "gating-max-events",
                style = "display:flex; align-items:center; gap:4px; min-width:170px;",
                tags$span("Max events:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                numericInput("gating_max_events", NULL,
                             value = 50000, min = 0, step = 5000, width = "110px"),
                tags$span("0 = all", style = "font-size:10px; color:#888; white-space:nowrap;")
              ),
              conditionalPanel(
                "input.display_mode == 'contour'",
                tags$div(style = "display:flex; align-items:center; gap:4px;",
                  tags$span("Outer:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                  selectInput("contour_threshold", NULL,
                              choices = c("1%" = 1, "2%" = 2, "5%" = 5,
                                          "10%" = 10, "20%" = 20, "30%" = 30),
                              selected = 5, width = "80px")
                )
              )
            ),

            # Flow transform controls (conditional, directly below display row)
            uiOutput("flow_transform_controls_ui"),

            # Color by section
            tags$div(class = "section-header", style = "margin-top:6px;",
                     "Color by marker / metadata",
                     actionButton("clear_overlay_btn", "Clear", class = "btn-xs btn-default")),
            selectInput("overlay_coldata", NULL,
                        choices = c("(none)" = ""), selected = ""),
            uiOutput("overlay_checkboxes_ui")
          ),
          uiOutput("subset_stats_ui")
        ),

        # ── Tab 2: Gating Strategy ────────────────────────────────────────────
        tabPanel("Strategy",
          tags$div(class = "strategy-controls",
            fluidRow(
              column(6, selectInput("strategy_pop", "Population:", choices = NULL)),
              column(3, numericInput("strategy_max_events", "Max events:",
                                     value = 10000, min = 1000, max = 100000, step = 1000)),
              column(3, numericInput("strategy_plot_size", "Plot size (px):",
                                     value = 200, min = 150, max = 400, step = 25))
            ),
            fluidRow(
              column(4,
                radioButtons("strategy_display", NULL,
                             choices = c("Scatter" = "scatter",
                                         "Pseudo" = "pseudocolor"),
                             selected = "pseudocolor", inline = TRUE)
              ),
              column(4, checkboxInput("strategy_full_path", "Full path from root", FALSE)),
              column(4,
                actionButton("strategy_export_png", "Export PNG",
                             class = "btn-sm btn-default", icon = icon("download"))
              )
            )
          ),
          tags$div(id = "strategy-grid-container", class = "mini-plot-grid-container")
        ),

        # ── Tab 3: Illustration ───────────────────────────────────────────────
        tabPanel("Illustration",
          tags$div(class = "illustration-controls",
            fluidRow(
              column(4,
                radioButtons("illust_plot_type", "Plot type:",
                             choices = c("Biplot" = "biplot", "Histogram" = "histogram"),
                             selected = "biplot", inline = TRUE)
              ),
              column(4, selectInput("illust_y_channel", "Y channel:", choices = NULL)),
              column(4,
                radioButtons("illust_display", NULL,
                             choices = c("Scatter" = "scatter",
                                         "Pseudo" = "pseudocolor"),
                             selected = "pseudocolor", inline = TRUE)
              )
            ),
            fluidRow(
              column(4, numericInput("illust_max_events", "Max events:",
                                     value = 10000, min = 1000, max = 50000, step = 1000)),
              column(4, numericInput("illust_plot_size", "Plot size (px):",
                                     value = 200, min = 150, max = 400, step = 25)),
              column(4,
                actionButton("illust_export_png", "Export PNG",
                             class = "btn-sm btn-default", icon = icon("download"))
              )
            ),
            tags$div(class = "section-header", "X Channels"),
            uiOutput("illust_x_channels_ui"),
            tags$div(class = "section-header", "Populations"),
            uiOutput("illust_populations_ui"),
            actionButton("illust_render_btn", "Render Illustration",
                         class = "btn-sm btn-primary", style = "margin-top: 6px;")
          ),
          tags$div(id = "illustration-grid-container", class = "mini-plot-grid-container")
        )
      )
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # RIGHT COLUMN: gates + populations + color overlay
    # ═══════════════════════════════════════════════════════════════════════════
    column(4,
      tags$div(class = "panel-section",

        # ── Gate list ──
        tags$div(class = "section-header",
          "Gates",
          tags$span(
            actionButton("rename_gate_btn", "", icon = icon("pencil"),
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("undo_btn", "", icon = icon("undo"),
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("redo_btn", "", icon = icon("repeat"),
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("delete_gate_btn", "", icon = icon("trash"),
                         class = "btn-xs btn-danger", style = "padding: 1px 5px;")
          )
        ),
        uiOutput("gate_list_ui"),

        # ── Population tree ──
        tags$div(class = "section-header",
          "Populations",
          tags$span(class = "population-header-actions",
            actionButton("add_pop_btn", "", icon = icon("plus"),
                         class = "btn-xs btn-success", style = "padding: 1px 5px;"),
            actionButton("edit_pop_btn", "", icon = icon("pencil"),
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("delete_pop_btn", "", icon = icon("trash"),
                         class = "btn-xs btn-danger", style = "padding: 1px 5px;")
          )
        ),
        uiOutput("population_tree_ui"),

        # ── Workspace controls ──
        tags$div(class = "section-header", "Workspace"),

        # Row 1: in-memory workspace operations
        fluidRow(
          column(3, actionButton("save_workspace_btn", "Save WS",
                                 class = "btn-sm btn-primary", style = "width:100%")),
          column(3, actionButton("load_workspace_btn", "Load WS",
                                 class = "btn-sm btn-default", style = "width:100%")),
          column(3, actionButton("export_pop_btn", "→colData",
                                 class = "btn-sm btn-info", style = "width:100%")),
          column(3, actionButton("refresh_sce_btn", "Refresh",
                                 class = "btn-sm btn-default", style = "width:100%"))
        ),

        # Row 2: file persistence + FCS export
        tags$div(style = "margin-top: 4px;",
          fluidRow(
            column(6, downloadButton("save_rds_dl", "Save RDS",
                                     class = "btn-sm btn-success",
                                     style = "width:100%; padding: 5px 8px;")),
            column(6, actionButton("export_fcs_btn", "Export FCS",
                                   class = "btn-sm btn-warning", style = "width:100%"))
          )
        ),

        # Load RDS — standard file input
        fileInput("load_rds_upload", NULL,
                  accept = c(".rds", ".RDS"),
                  buttonLabel = "Load RDS...",
                  placeholder = "No file selected",
                  multiple = FALSE),

        # Import Cytobank Gating-ML
        fileInput("import_gatingml_upload", NULL,
                  accept = c(".xml", ".gatingml", ".Gating-ML"),
                  buttonLabel = "Import GatingML...",
                  placeholder = "No file selected",
                  multiple = FALSE),

        tags$div(class = "status-bar",
          textOutput("status_text", inline = TRUE)
        )

      )
    )
  )
)


# ══════════════════════════════════════════════════════════════════════════════
# SERVER
# ══════════════════════════════════════════════════════════════════════════════

server <- function(input, output, session) {

  rv <- reactiveValues(
    sce = NULL, sce_name = NULL, assay_name = "exprs",
    assay_data = NULL, channels = character(0), coldata_names = character(0),
    gates = list(), gate_order = character(0),
    populations = list(), root_population_id = NULL,
    selected_gate_id = NULL, active_population_id = NULL,
    gate_version = 0L,
    cache_version = -1L, pop_events_map = list(),
    current_plot_data = NULL, max_events = 50000L,
    undo_stack = list(), redo_stack = list(),
    overlay_factor = NULL, overlay_selected = NULL,
    sample_info = NULL, sample_mask = NULL,
    .gate_pop_name_manual = NULL,
    .pending_delete_gate_id = NULL,
    .pending_delete_pop_id = NULL,
    .pending_gatingml_import = NULL,
    flow_logicle_w = list(),
    flow_logicle_w_auto = list(),
    flow_scatter_cofactor = list(),
    flow_raw_data = NULL
  )

  runjs <- function(code) {
    session$sendCustomMessage(type = "runjs", message = code)
  }

  import_gatingml_via_subprocess <- function(file_path, session_channels, pnn_to_channel = NULL) {
    in_rds <- tempfile("gml_in_", fileext = ".rds")
    out_rds <- tempfile("gml_out_", fileext = ".rds")
    script_path <- tempfile("gml_import_", fileext = ".R")
    app_dir <- normalizePath(getwd(), winslash = "/", mustWork = TRUE)

    payload <- list(
      file_path = normalizePath(file_path, winslash = "/", mustWork = TRUE),
      session_channels = as.character(session_channels),
      pnn_to_channel = pnn_to_channel %||% list(),
      app_dir = app_dir
    )
    saveRDS(payload, in_rds)

    writeLines(c(
      "args <- commandArgs(trailingOnly = TRUE)",
      "inp <- args[[1]]",
      "outp <- args[[2]]",
      "x <- readRDS(inp)",
      "setwd(x$app_dir)",
      "source(file.path('R', 'models.R'))",
      "source(file.path('R', 'fcs_import.R'))",
      "source(file.path('R', 'gatingml_import.R'))",
      "res <- import_gatingml_from_cytobank(",
      "  file_path = x$file_path,",
      "  session_channels = x$session_channels,",
      "  pnn_to_channel = x$pnn_to_channel",
      ")",
      "saveRDS(res, outp)"
    ), con = script_path)

    on.exit(unlink(c(in_rds, out_rds, script_path), force = TRUE), add = TRUE)

    cmd_out <- tryCatch(
      system2("Rscript", args = c(script_path, in_rds, out_rds), stdout = TRUE, stderr = TRUE),
      error = function(e) stop("Failed to start Rscript fallback: ", e$message)
    )
    status <- attr(cmd_out, "status")
    if (is.null(status)) status <- 0L

    if (!identical(as.integer(status), 0L)) {
      tail_lines <- if (length(cmd_out) > 0) paste(utils::tail(cmd_out, 10), collapse = "\n") else "(no stderr)"
      stop("Rscript fallback import failed:\n", tail_lines)
    }
    if (!file.exists(out_rds)) {
      stop("Rscript fallback did not produce output.")
    }
    readRDS(out_rds)
  }

  build_gatingml_channel_map <- function(sce, session_channels) {
    md_map <- S4Vectors::metadata(sce)$pnn_to_channel
    if (is.null(md_map)) md_map <- list()
    md_map <- as.list(md_map)

    guessed <- .gml_guess_pnn_map_from_channels(session_channels)
    if (length(guessed) == 0) return(md_map)

    merged <- c(md_map, guessed)
    merged[!duplicated(names(merged))]
  }

  clamp_imported_time_rectangles <- function(parsed, assay_data) {
    if (is.null(parsed) || is.null(parsed$gates) || length(parsed$gates) == 0) return(parsed)
    if (is.null(assay_data) || nrow(assay_data) == 0) return(parsed)

    is_time_like <- function(ch) {
      !is.null(ch) && grepl("^(time|event_length|cell_length)$", ch, ignore.case = TRUE)
    }

    for (gid in names(parsed$gates)) {
      gate <- parsed$gates[[gid]]
      if (is.null(gate) || !identical(gate$gate_type, "rectangle") || length(gate$vertices) < 4) next

      adjust_axis <- function(channel_name, axis_idx) {
        if (!is_time_like(channel_name) || !channel_name %in% colnames(assay_data)) return(gate$vertices)

        vals <- as.numeric(assay_data[, channel_name])
        vals <- vals[is.finite(vals)]
        if (length(vals) < 20) return(gate$vertices)

        lo <- suppressWarnings(as.numeric(quantile(vals, 0.001, na.rm = TRUE)))
        hi <- suppressWarnings(as.numeric(quantile(vals, 0.999, na.rm = TRUE)))
        if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(gate$vertices)

        span <- hi - lo
        axis_vals <- vapply(gate$vertices, function(v) as.numeric(v[[axis_idx]]), numeric(1))
        g_lo <- min(axis_vals, na.rm = TRUE)
        g_hi <- max(axis_vals, na.rm = TRUE)

        # Clamp only when rectangle is wildly outside observed data range.
        if (g_hi <= hi + 4 * span && g_lo >= lo - 4 * span) return(gate$vertices)

        clamp_lo <- lo - 0.05 * span
        clamp_hi <- hi + 0.05 * span
        lapply(gate$vertices, function(v) {
          v2 <- as.numeric(v)
          v2[[axis_idx]] <- min(max(v2[[axis_idx]], clamp_lo), clamp_hi)
          v2
        })
      }

      gate$vertices <- adjust_axis(gate$x_channel, 1)
      gate$vertices <- adjust_axis(gate$y_channel, 2)
      parsed$gates[[gid]] <- gate
    }

    parsed
  }

  sort_population_tree_state <- function() {
    if (length(rv$populations) == 0 || is.null(rv$root_population_id)) return()
    rv$populations <- sort_population_tree(rv$populations, rv$root_population_id)
  }

  autosave <- function() {
    if (is.null(rv$sce) || is.null(rv$sce_name)) return()
    gate_value_space <- if (!is.null(rv$sce) && is_flow_session(rv$sce) &&
                            rv$assay_name == "exprs" && !is.null(rv$flow_raw_data)) {
      "raw"
    } else {
      "display"
    }
    rv$sce <- save_workspace(
      rv$sce, rv$gates, rv$gate_order, rv$populations, rv$root_population_id,
      gate_value_space = gate_value_space
    )
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
  }

  sanitize_mode_choice <- function(mode_choice) {
    if (is.null(mode_choice) || !mode_choice %in% c("auto", "cytof", "flow")) {
      return("auto")
    }
    mode_choice
  }

  pretty_instrument_label <- function(inst) {
    if (is.null(inst)) return("Unknown")
    if (inst == "cytof") return("CyTOF")
    if (inst == "flow") return("Flow")
    as.character(inst)
  }

  resolve_sce_instrument <- function(sce, mode_choice = "auto") {
    mode_choice <- sanitize_mode_choice(mode_choice)
    channels <- tryCatch(get_channel_names(sce), error = function(e) character(0))
    detected <- if (length(channels) > 0) {
      detect_instrument_type(channels)
    } else {
      S4Vectors::metadata(sce)$instrument_type %||% "flow"
    }
    chosen <- if (mode_choice == "auto") detected else mode_choice
    list(detected = detected, chosen = chosen, mode_choice = mode_choice)
  }

  sync_sce_instrument <- function(sce, mode_choice = "auto", recompute_exprs = FALSE,
                                  verbose = FALSE) {
    resolved <- resolve_sce_instrument(sce, mode_choice)
    md <- S4Vectors::metadata(sce)
    cofactor <- suppressWarnings(as.numeric(md$cofactor))
    if (length(cofactor) == 0 || is.na(cofactor) || cofactor <= 0) cofactor <- 5

    reprocessed <- FALSE
    if (recompute_exprs && "counts" %in% SummarizedExperiment::assayNames(sce)) {
      sce <- rebuild_sce_exprs_from_counts(
        sce,
        instrument_type = resolved$chosen,
        cofactor = cofactor,
        verbose = verbose
      )
      reprocessed <- TRUE
    }

    md <- S4Vectors::metadata(sce)
    md$instrument_type <- resolved$chosen
    md$instrument_type_detected <- resolved$detected
    md$instrument_type_source <-
      if (resolved$mode_choice == "auto") "auto_detected" else "manual_override"
    md$instrument_mode_choice <- resolved$mode_choice
    md$transform_type <- if (resolved$chosen == "cytof") "arcsinh" else "logicle"
    md$cofactor <- cofactor
    S4Vectors::metadata(sce) <- md

    list(
      sce = sce,
      detected = resolved$detected,
      chosen = resolved$chosen,
      mode_choice = resolved$mode_choice,
      reprocessed = reprocessed
    )
  }

  is_flow_session <- function(sce = rv$sce) {
    if (is.null(sce)) return(FALSE)
    identical(S4Vectors::metadata(sce)$instrument_type, "flow")
  }

  init_flow_transform_state <- function(sce) {
    rv$flow_logicle_w <- list()
    rv$flow_logicle_w_auto <- list()
    rv$flow_scatter_cofactor <- list()

    if (!is_flow_session(sce)) return()
    if (!"counts" %in% SummarizedExperiment::assayNames(sce)) return()

    counts_mat <- extract_assay_data(sce, "counts")
    channel_names <- colnames(counts_mat)

    auto_w <- as.list(estimate_logicle_w_params(counts_mat, channel_names))
    md <- S4Vectors::metadata(sce)
    saved_w <- md$logicle_w_params
    saved_cf <- md$scatter_cofactor_params

    rv$flow_logicle_w_auto <- auto_w
    rv$flow_logicle_w <- auto_w
    if (is.list(saved_w) && length(saved_w) > 0) {
      for (ch in intersect(names(saved_w), channel_names)) {
        wv <- as.numeric(saved_w[[ch]])
        if (is.finite(wv)) rv$flow_logicle_w[[ch]] <- max(0.1, min(wv, 2.0))
      }
    }

    scatter_chs <- channel_names[.is_scatter_channel(channel_names)]
    if (length(scatter_chs) > 0) {
      for (ch in scatter_chs) rv$flow_scatter_cofactor[[ch]] <- 150
      if (is.list(saved_cf) && length(saved_cf) > 0) {
        for (ch in intersect(names(saved_cf), scatter_chs)) {
          cfv <- as.numeric(saved_cf[[ch]])
          if (is.finite(cfv) && cfv > 0) rv$flow_scatter_cofactor[[ch]] <- cfv
        }
      }
    }
  }

  persist_flow_transform_state <- function() {
    if (is.null(rv$sce) || is.null(rv$sce_name) || !is_flow_session(rv$sce)) return()
    S4Vectors::metadata(rv$sce)$logicle_w_params <- rv$flow_logicle_w
    S4Vectors::metadata(rv$sce)$scatter_cofactor_params <- rv$flow_scatter_cofactor
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
  }

  refresh_assay_data <- function(reset_cache = TRUE, channels_to_update = NULL) {
    req(rv$sce)

    if (rv$assay_name == "counts") {
      raw_data <- extract_assay_data(rv$sce, "counts")
      rv$flow_raw_data <- NULL
      rv$assay_data <- asinh(raw_data / 5)
    } else if (is_flow_session(rv$sce) && rv$assay_name == "exprs" &&
               "counts" %in% SummarizedExperiment::assayNames(rv$sce)) {
      # Flow + exprs: use counts as raw data, logicle-transform for display
      # Re-use cached raw data if available to avoid redundant matrix transpose
      counts_mat <- rv$flow_raw_data
      if (is.null(counts_mat) || nrow(counts_mat) != ncol(rv$sce) || isTRUE(reset_cache)) {
        counts_mat <- extract_assay_data(rv$sce, "counts")
      }
      rv$flow_raw_data <- counts_mat

      can_partial_update <- !isTRUE(reset_cache) &&
        !is.null(channels_to_update) && length(channels_to_update) > 0 &&
        !is.null(rv$assay_data) &&
        nrow(rv$assay_data) == nrow(counts_mat) &&
        ncol(rv$assay_data) == ncol(counts_mat) &&
        identical(colnames(rv$assay_data), colnames(counts_mat))

      if (isTRUE(can_partial_update)) {
        update_chs <- unique(channels_to_update)
        update_chs <- update_chs[update_chs %in% colnames(counts_mat)]
        if (length(update_chs) == 0) {
          can_partial_update <- FALSE
        } else {
          for (ch in update_chs) {
            rv$assay_data[, ch] <- flow_transform_channel_values(
              raw_vals = counts_mat[, ch],
              channel_name = ch,
              raw_channel_vals = counts_mat[, ch],
              logicle_w_params = rv$flow_logicle_w,
              scatter_cofactor_params = rv$flow_scatter_cofactor
            )
          }
        }
      }

      if (!isTRUE(can_partial_update)) {
        rv$assay_data <- transform_matrix_by_instrument(
          raw_mat = counts_mat,
          channel_names = colnames(counts_mat),
          instrument_type = "flow",
          logicle_w_params = rv$flow_logicle_w,
          scatter_cofactor_params = rv$flow_scatter_cofactor,
          verbose = FALSE
        )
      }
    } else {
      rv$flow_raw_data <- NULL
      rv$assay_data <- extract_assay_data(rv$sce, rv$assay_name)
    }

    if (isTRUE(reset_cache)) {
      rv$cache_version <- -1L
      rv$pop_events_map <- list()
      rv$gate_version <- rv$gate_version + 1L
    }
  }

  # ── Instrument type badge ──────────────────────────────────────────────────
  output$instrument_badge_ui <- renderUI({
    req(rv$sce)
    md <- S4Vectors::metadata(rv$sce)
    inst <- md$instrument_type
    if (is.null(inst)) return(NULL)
    badge_color <- if (inst == "cytof") "#5b7dba" else "#4caf50"
    badge_label <- pretty_instrument_label(inst)
    cofactor <- md$cofactor
    detected <- md$instrument_type_detected %||% inst
    source <- md$instrument_type_source %||% "auto_detected"
    source_note <- if (source == "manual_override") {
      paste0("manual override (detected: ", pretty_instrument_label(detected), ")")
    } else {
      "auto-detected"
    }
    detail <- if (inst == "cytof") {
      paste0("arcsinh/", cofactor, " on metal channels")
    } else {
      "logicle on signal, arcsinh/150 on scatter"
    }
    tags$div(style = "margin: -6px 0 8px 0; display: flex; align-items: center; gap: 6px;",
      tags$span(badge_label,
        style = paste0("background:", badge_color, "; color:white; font-size:11px;",
                       "padding:1px 8px; border-radius:10px; font-weight:600;")),
      tags$span(paste0(detail, " | ", source_note), style = "font-size:10px; color:#888;")
    )
  })

  output$flow_transform_controls_ui <- renderUI({
    req(rv$sce, input$x_channel, input$y_channel)
    if (!is_flow_session(rv$sce)) return(NULL)
    if (rv$assay_name != "exprs") return(NULL)
    if (!"counts" %in% SummarizedExperiment::assayNames(rv$sce)) return(NULL)

    x_ch <- input$x_channel %||% ""
    y_ch <- input$y_channel %||% ""

    # isolate() prevents slider self-updates from re-triggering renderUI rebuild loops.
    x_w <- isolate(as.numeric(rv$flow_logicle_w[[x_ch]] %||% rv$flow_logicle_w_auto[[x_ch]] %||% 0.5))
    y_w <- isolate(as.numeric(rv$flow_logicle_w[[y_ch]] %||% rv$flow_logicle_w_auto[[y_ch]] %||% 0.5))

    tags$div(
      class = "flow-transform-controls",
      tags$div(style = "font-weight:600; font-size:11px; color:#555; margin-bottom:2px;",
               "Logicle W"),
      # X and Y sliders side-by-side
      tags$div(class = "flow-w-sidebyside",
        # X slider
        tags$div(class = "flow-w-col",
          tags$div(style = "font-size:10px; color:#666; margin-bottom:1px;", "X axis"),
          tags$div(style = "display:flex; align-items:center; gap:3px;",
            sliderInput("x_logicle_w", NULL,
                        min = 0.1, max = 2.0, step = 0.05,
                        value = x_w, width = "100%"),
            actionButton("auto_w_x_btn", "A", class = "btn-xs btn-default",
                         title = "Reset to auto-estimated W")
          )
        ),
        # Y slider
        tags$div(class = "flow-w-col",
          tags$div(style = "font-size:10px; color:#666; margin-bottom:1px;", "Y axis"),
          tags$div(style = "display:flex; align-items:center; gap:3px;",
            sliderInput("y_logicle_w", NULL,
                        min = 0.1, max = 2.0, step = 0.05,
                        value = y_w, width = "100%"),
            actionButton("auto_w_y_btn", "A", class = "btn-xs btn-default",
                         title = "Reset to auto-estimated W")
          )
        )
      ),
      tags$div(class = "flow-transform-note",
               "W: linear half-width near zero (lower = more linear region)")
    )
  })

  observeEvent(input$x_logicle_w, {
    req(rv$sce, input$x_channel)
    req(!is.null(input$x_logicle_w))
    if (!is_flow_session(rv$sce) || rv$assay_name != "exprs") return()
    ch <- input$x_channel
    new_w <- max(0.1, min(as.numeric(input$x_logicle_w), 2.0))
    if (!is.finite(new_w)) return()
    old_w <- rv$flow_logicle_w[[ch]]
    if (!is.null(old_w) && abs(new_w - as.numeric(old_w)) < 1e-6) return()
    rv$flow_logicle_w[[ch]] <- new_w
    persist_flow_transform_state()
    refresh_assay_data(reset_cache = FALSE,
                      channels_to_update = c(input$x_channel, input$y_channel))
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$y_logicle_w, {
    req(rv$sce, input$y_channel)
    req(!is.null(input$y_logicle_w))
    if (!is_flow_session(rv$sce) || rv$assay_name != "exprs") return()
    ch <- input$y_channel
    new_w <- max(0.1, min(as.numeric(input$y_logicle_w), 2.0))
    if (!is.finite(new_w)) return()
    old_w <- rv$flow_logicle_w[[ch]]
    if (!is.null(old_w) && abs(new_w - as.numeric(old_w)) < 1e-6) return()
    rv$flow_logicle_w[[ch]] <- new_w
    persist_flow_transform_state()
    refresh_assay_data(reset_cache = FALSE,
                      channels_to_update = c(input$x_channel, input$y_channel))
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$auto_w_x_btn, {
    req(input$x_channel)
    w_auto <- as.numeric(rv$flow_logicle_w_auto[[input$x_channel]] %||% 0.5)
    updateSliderInput(session, "x_logicle_w", value = w_auto)
  }, ignoreInit = TRUE)

  observeEvent(input$auto_w_y_btn, {
    req(input$y_channel)
    w_auto <- as.numeric(rv$flow_logicle_w_auto[[input$y_channel]] %||% 0.5)
    updateSliderInput(session, "y_logicle_w", value = w_auto)
  }, ignoreInit = TRUE)

  # ── SCE discovery ─────────────────────────────────────────────────────────
  observe({
    sce_names <- find_sce_objects()
    if (exists(".cytof_gate_env") && length(.cytof_gate_env$sce_names) > 0) {
      sce_names <- unique(c(.cytof_gate_env$sce_names, sce_names))
    }
    if (length(sce_names) == 0) {
      updateSelectInput(session, "sce_select", choices = c("(none)" = ""))
    } else {
      default <- NULL
      if (exists(".cytof_gate_env") && !is.null(.cytof_gate_env$default_sce))
        default <- .cytof_gate_env$default_sce
      updateSelectInput(session, "sce_select", choices = sce_names, selected = default)
    }
  })

  observeEvent(input$refresh_sce_btn, {
    sce_names <- find_sce_objects()
    updateSelectInput(session, "sce_select", choices = sce_names)
  })

  observeEvent(input$rename_sce_btn, {
    req(rv$sce, rv$sce_name)
    showModal(modalDialog(
      title = "Rename Loaded SCE",
      textInput("rename_sce_input", "New SCE object name:", value = rv$sce_name),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_rename_sce", "Rename", class = "btn-primary"))
    ))
    runjs("setTimeout(function(){var el=document.getElementById('rename_sce_input'); if(el){el.focus(); el.select();}}, 80);")
  })

  observeEvent(input$confirm_rename_sce, {
    removeModal()
    req(rv$sce, rv$sce_name)
    old_name <- rv$sce_name
    new_name <- trimws(input$rename_sce_input %||% "")

    if (nchar(new_name) == 0) {
      showNotification("SCE name cannot be empty.", type = "warning", duration = 3)
      return()
    }
    if (identical(new_name, old_name)) return()
    if (exists(new_name, envir = .GlobalEnv, inherits = FALSE)) {
      showNotification("An object with that name already exists.", type = "error", duration = 4)
      return()
    }

    assign(new_name, rv$sce, envir = .GlobalEnv)
    if (exists(old_name, envir = .GlobalEnv, inherits = FALSE)) {
      rm(list = old_name, envir = .GlobalEnv)
    }
    rv$sce_name <- new_name

    if (exists(".cytof_gate_env")) {
      if (!is.null(.cytof_gate_env$default_sce) && identical(.cytof_gate_env$default_sce, old_name)) {
        .cytof_gate_env$default_sce <- new_name
      }
      if (length(.cytof_gate_env$sce_names) > 0) {
        idx <- which(.cytof_gate_env$sce_names == old_name)
        if (length(idx) > 0) .cytof_gate_env$sce_names[idx] <- new_name
        .cytof_gate_env$sce_names <- unique(.cytof_gate_env$sce_names)
      }
    }

    sce_names <- find_sce_objects()
    updateSelectInput(session, "sce_select", choices = sce_names, selected = new_name)
    output$status_text <- renderText(paste("Renamed SCE", old_name, "to", new_name))
    showNotification(paste("Renamed", old_name, "to", new_name), type = "message", duration = 4)
  })

  # ── FCS upload ──────────────────────────────────────────────────────────────
  observeEvent(input$fcs_upload, {
    files <- input$fcs_upload
    req(files)

    tryCatch({
      file_paths <- files$datapath
      orig_names <- files$name
      mode_choice <- sanitize_mode_choice(input$instrument_mode)

      showNotification("Importing FCS files...", type = "message", duration = 2)

      sce <- import_fcs_files(file_paths,
                               sample_names = tools::file_path_sans_ext(orig_names),
                               instrument_mode = mode_choice)
      sce_name <- make_sce_name(orig_names)

      assign(sce_name, sce, envir = .GlobalEnv)

      # Refresh dropdown and select new SCE
      sce_names <- find_sce_objects()
      updateSelectInput(session, "sce_select", choices = sce_names,
                        selected = sce_name)

      showNotification(
        paste("Imported", length(orig_names), "FCS file(s) as", sce_name),
        type = "message", duration = 5
      )
    }, error = function(e) {
      showNotification(paste("FCS import error:", e$message),
                       type = "error", duration = 8)
    })
  })

  observeEvent(input$apply_instrument_mode_btn, {
    req(rv$sce, rv$sce_name)
    mode_choice <- sanitize_mode_choice(input$instrument_mode)

    tryCatch({
      synced <- sync_sce_instrument(
        rv$sce,
        mode_choice = mode_choice,
        recompute_exprs = TRUE,
        verbose = TRUE
      )
      rv$sce <- synced$sce
      assign(rv$sce_name, rv$sce, envir = .GlobalEnv)

      assays <- get_assay_names(rv$sce)
      if (!rv$assay_name %in% assays) {
        rv$assay_name <- if ("exprs" %in% assays) "exprs" else assays[1]
        updateSelectInput(session, "assay_select", choices = assays, selected = rv$assay_name)
      }
      init_flow_transform_state(rv$sce)
      refresh_assay_data(reset_cache = TRUE)

      if (!is.null(rv$assay_data) && length(rv$channels) >= 2) {
        send_full_plot(reset_view = TRUE)
      }

      rebuild_note <- if (synced$reprocessed) {
        "exprs assay recomputed from counts."
      } else {
        "counts assay missing; updated metadata only."
      }

      showNotification(
        paste0("Mode set to ", pretty_instrument_label(synced$chosen),
               " (detected ", pretty_instrument_label(synced$detected), "). ",
               rebuild_note),
        type = "message", duration = 6
      )
      output$status_text <- renderText(
        paste0("Mode: ", pretty_instrument_label(synced$chosen),
               " | ", rebuild_note)
      )
    }, error = function(e) {
      showNotification(paste("Instrument mode update error:", e$message),
                       type = "error", duration = 8)
    })
  })

  # ── SCE selection ───────────────────────────────────────────────────────────
  observeEvent(input$sce_select, {
    req(nchar(input$sce_select) > 0)
    sce_name <- input$sce_select
    sce <- tryCatch(get(sce_name, envir = .GlobalEnv), error = function(e) NULL)
    if (is.null(sce) || !methods::is(sce, "SingleCellExperiment")) {
      output$status_text <- renderText("Invalid SCE object selected")
      return()
    }

    mode_choice <- sanitize_mode_choice(S4Vectors::metadata(sce)$instrument_mode_choice)
    updateRadioButtons(session, "instrument_mode", selected = mode_choice)
    synced <- sync_sce_instrument(
      sce,
      mode_choice = mode_choice,
      recompute_exprs = FALSE,
      verbose = FALSE
    )
    sce <- synced$sce
    assign(sce_name, sce, envir = .GlobalEnv)

    rv$sce <- sce
    rv$sce_name <- sce_name
    init_flow_transform_state(sce)

    assays <- get_assay_names(sce)
    default_assay <- if ("exprs" %in% assays) "exprs" else assays[1]
    updateSelectInput(session, "assay_select", choices = assays, selected = default_assay)

    # Extract assay data immediately — the assay_select observer won't fire
    # if the assay name is unchanged between SCEs (e.g. both have "exprs")
    rv$assay_name <- default_assay
    refresh_assay_data(reset_cache = TRUE)

    channels <- get_channel_names(sce)
    rv$channels <- channels
    x_default <- if (length(channels) >= 1) channels[1] else NULL
    y_default <- if (length(channels) >= 2) channels[2] else NULL
    updateSelectInput(session, "x_channel", choices = channels, selected = x_default)
    updateSelectInput(session, "y_channel", choices = channels, selected = y_default)
    updateSelectInput(session, "illust_y_channel", choices = channels, selected = y_default)

    rv$sample_info <- build_sample_table(sce)
    rv$sample_mask <- NULL
    # Clear any DT row selections from the previous SCE
    proxy <- DT::dataTableProxy("sample_filter_table")
    DT::selectRows(proxy, NULL)

    cd_names <- get_coldata_names(sce)
    rv$coldata_names <- cd_names
    updateSelectInput(session, "overlay_coldata",
                      choices = c("(none)" = "", cd_names), selected = "")
    rv$overlay_factor <- NULL
    rv$overlay_selected <- NULL

    ws <- load_workspace(sce)
    if (!is.null(ws)) {
      invalid <- validate_workspace_channels(ws, channels)
      if (length(invalid) > 0) {
        showNotification(paste("Warning:", length(invalid), "gate(s) reference missing channels"),
                         type = "warning", duration = 5)
      }
      ws <- normalize_workspace_gate_space(ws)
      rv$gates <- ws$gates
      rv$gate_order <- ws$gate_order %||% names(ws$gates)
      rv$populations <- ws$populations
      rv$root_population_id <- ws$root_population_id
      sort_population_tree_state()
      rv$active_population_id <- ws$root_population_id
      rv$gate_version <- rv$gate_version + 1L
      output$status_text <- renderText(paste("Loaded workspace from", sce_name))
    } else {
      rv$gates <- list()
      rv$gate_order <- character(0)
      root <- new_root_population(ncol(sce))
      rv$populations <- setNames(list(root), root$population_id)
      rv$root_population_id <- root$population_id
      rv$active_population_id <- root$population_id
      rv$selected_gate_id <- NULL
      rv$gate_version <- 0L
      output$status_text <- renderText(paste("Loaded", sce_name, "-",
                                             ncol(sce), "events,",
                                             length(channels), "channels"))
    }

    rv$undo_stack <- list()
    rv$redo_stack <- list()
  }, ignoreInit = TRUE)

  # ── Append FCS files to the currently loaded SCE ───────────────────────────
  observeEvent(input$append_fcs_btn, {
    req(rv$sce, rv$sce_name)
    files <- input$fcs_append_upload
    req(files)

    tryCatch({
      autosave()
      file_paths <- files$datapath
      orig_names <- files$name
      mode_choice <- sanitize_mode_choice(input$instrument_mode)

      showNotification("Appending FCS files to current SCE...", type = "message", duration = 2)

      sce_updated <- append_fcs_to_sce(
        sce = rv$sce,
        file_paths = file_paths,
        sample_names = tools::file_path_sans_ext(orig_names),
        cofactor = suppressWarnings(as.numeric(S4Vectors::metadata(rv$sce)$cofactor)),
        instrument_mode = mode_choice
      )

      synced <- sync_sce_instrument(
        sce_updated,
        mode_choice = mode_choice,
        recompute_exprs = FALSE,
        verbose = FALSE
      )

      rv$sce <- synced$sce
      assign(rv$sce_name, rv$sce, envir = .GlobalEnv)

      assays <- get_assay_names(rv$sce)
      if (!rv$assay_name %in% assays) {
        rv$assay_name <- if ("exprs" %in% assays) "exprs" else assays[1]
      }
      updateSelectInput(session, "assay_select", choices = assays, selected = rv$assay_name)

      channels <- get_channel_names(rv$sce)
      rv$channels <- channels
      x_sel <- if (!is.null(input$x_channel) && input$x_channel %in% channels) input$x_channel else channels[1]
      y_sel <- if (!is.null(input$y_channel) && input$y_channel %in% channels) input$y_channel else channels[min(2, length(channels))]
      updateSelectInput(session, "x_channel", choices = channels, selected = x_sel)
      updateSelectInput(session, "y_channel", choices = channels, selected = y_sel)
      updateSelectInput(session, "illust_y_channel", choices = channels, selected = y_sel)

      rv$sample_info <- build_sample_table(rv$sce)
      rv$sample_mask <- NULL
      DT::selectRows(DT::dataTableProxy("sample_filter_table"), NULL)

      cd_names <- get_coldata_names(rv$sce)
      rv$coldata_names <- cd_names
      selected_overlay <- input$overlay_coldata %||% ""
      if (!selected_overlay %in% cd_names) {
        selected_overlay <- ""
        rv$overlay_factor <- NULL
        rv$overlay_selected <- NULL
      }
      updateSelectInput(session, "overlay_coldata",
                        choices = c("(none)" = "", cd_names),
                        selected = selected_overlay)

      init_flow_transform_state(rv$sce)
      refresh_assay_data(reset_cache = TRUE)
      sort_population_tree_state()

      if (!is.null(rv$assay_data) && length(rv$channels) >= 2) {
        send_full_plot(reset_view = TRUE)
      }

      showNotification(
        paste0("Appended ", length(file_paths), " FCS file(s). New event total: ",
               format(ncol(rv$sce), big.mark = ",")),
        type = "message", duration = 6
      )
      output$status_text <- renderText(
        paste0("Appended ", length(file_paths), " FCS file(s) into ", rv$sce_name,
               " at ", format(Sys.time(), "%H:%M:%S"))
      )
    }, error = function(e) {
      showNotification(paste("Append FCS error:", e$message),
                       type = "error", duration = 8)
    })
  })

  # ── Assay selection ─────────────────────────────────────────────────────────
  observeEvent(input$assay_select, {
    req(rv$sce)
    rv$assay_name <- input$assay_select
    refresh_assay_data(reset_cache = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$flip_axes, {
    x <- input$x_channel; y <- input$y_channel
    updateSelectInput(session, "x_channel", selected = y)
    updateSelectInput(session, "y_channel", selected = x)
  })

  observeEvent(input$point_alpha, {
    session$sendCustomMessage("setAlpha", input$point_alpha)
  }, ignoreInit = TRUE)

  # ══════════════════════════════════════════════════════════════════════════════
  # SAMPLE FILTER (DT)
  # ══════════════════════════════════════════════════════════════════════════════

  normalize_dt_rows <- function(rows, total_rows) {
    if (is.null(rows)) return(NULL)
    rows <- as.integer(rows)
    rows <- rows[!is.na(rows)]
    if (length(rows) == 0) return(integer(0))
    # DT may emit 0-based row indices depending on context; normalize to 1-based.
    if (min(rows) == 0L) rows <- rows + 1L
    rows <- unique(rows[rows >= 1L & rows <= total_rows])
    sort(rows)
  }

  sample_keys_from_table_filter <- function(info) {
    total_rows <- nrow(info$table)
    filtered_rows <- normalize_dt_rows(input$sample_filter_table_rows_all, total_rows)
    selected_rows <- normalize_dt_rows(input$sample_filter_table_rows_selected, total_rows)

    # If no column filtering is active, default to all rows.
    if (is.null(filtered_rows)) filtered_rows <- seq_len(total_rows)

    # Row selection is a direct sample-selection action on top of metadata filtering.
    if (!is.null(selected_rows) && length(selected_rows) > 0) {
      filtered_rows <- intersect(filtered_rows, selected_rows)
    }

    if (length(filtered_rows) == 0) return(character(0))
    as.character(info$keys[filtered_rows])
  }

  resolve_filtered_sample_keys <- function(info) {
    sample_keys_from_table_filter(info)
  }

  output$sample_filter_table <- DT::renderDataTable({
    req(rv$sample_info)
    DT::datatable(
      rv$sample_info$table, filter = "top", selection = "multiple",
      options = list(pageLength = 20, lengthMenu = c(20, 40, 80, 200),
                     scrollX = TRUE, scrollY = "420px", scrollCollapse = FALSE,
                     dom = "tip",
                     searchHighlight = TRUE, orderClasses = TRUE,
                     autoWidth = TRUE, deferRender = TRUE, stateSave = FALSE,
                     columnDefs = list(list(className = "dt-center", targets = "_all"))),
      style = "bootstrap", class = "compact stripe hover cell-border", rownames = FALSE
    )
  })

  output$sample_filter_summary <- renderText({
    info <- rv$sample_info
    if (is.null(info)) return("")
    total <- nrow(info$table)
    selected_keys <- resolve_filtered_sample_keys(info)
    paste0(length(selected_keys), " of ", total, " samples")
  })

  observe({
    info <- rv$sample_info
    if (is.null(info) || is.null(rv$assay_data)) {
      rv$sample_mask <- NULL
      return()
    }

    selected_keys <- resolve_filtered_sample_keys(info)
    if (length(selected_keys) == length(info$keys)) {
      if (!is.null(rv$sample_mask)) { rv$sample_mask <- NULL; send_full_plot() }
      return()
    }

    if (length(selected_keys) == 0) {
      rv$sample_mask <- rep(FALSE, nrow(rv$assay_data))
      send_full_plot()
      return()
    }

    event_indices <- unlist(info$group_map[selected_keys], use.names = FALSE)
    mask <- rep(FALSE, nrow(rv$assay_data))
    mask[event_indices] <- TRUE
    rv$sample_mask <- mask
    send_full_plot()
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # UNDO / REDO
  # ══════════════════════════════════════════════════════════════════════════════

  save_undo_snapshot <- function() {
    snap <- snapshot_state(rv$gates, rv$gate_order, rv$populations, rv$root_population_id)
    rv$undo_stack <- push_undo(rv$undo_stack, snap)
    rv$redo_stack <- list()
  }

  observeEvent(input$undo_btn, {
    current <- snapshot_state(rv$gates, rv$gate_order, rv$populations, rv$root_population_id)
    result <- undo_op(rv$undo_stack, rv$redo_stack, current)
    if (is.null(result)) { showNotification("Nothing to undo", type = "message", duration = 1); return() }
    rv$gates <- result$state$gates; rv$gate_order <- result$state$gate_order
    rv$populations <- result$state$populations; rv$root_population_id <- result$state$root_population_id
    rv$undo_stack <- result$undo_stack; rv$redo_stack <- result$redo_stack
    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    if (is.null(rv$populations[[rv$active_population_id]])) rv$active_population_id <- rv$root_population_id
    if (is.null(rv$gates[[rv$selected_gate_id]])) rv$selected_gate_id <- NULL
    autosave(); send_full_plot()
  })

  observeEvent(input$redo_btn, {
    current <- snapshot_state(rv$gates, rv$gate_order, rv$populations, rv$root_population_id)
    result <- redo_op(rv$undo_stack, rv$redo_stack, current)
    if (is.null(result)) { showNotification("Nothing to redo", type = "message", duration = 1); return() }
    rv$gates <- result$state$gates; rv$gate_order <- result$state$gate_order
    rv$populations <- result$state$populations; rv$root_population_id <- result$state$root_population_id
    rv$undo_stack <- result$undo_stack; rv$redo_stack <- result$redo_stack
    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    if (is.null(rv$populations[[rv$active_population_id]])) rv$active_population_id <- rv$root_population_id
    if (is.null(rv$gates[[rv$selected_gate_id]])) rv$selected_gate_id <- NULL
    autosave(); send_full_plot()
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # SAMPLE OVERLAY (Color by colData)
  # ══════════════════════════════════════════════════════════════════════════════

  observeEvent(input$overlay_coldata, {
    cd_col <- input$overlay_coldata
    if (is.null(cd_col) || cd_col == "") {
      rv$overlay_factor <- NULL; rv$overlay_selected <- NULL
      output$overlay_checkboxes_ui <- renderUI(NULL)
      if (!is.null(rv$assay_data)) send_full_plot()
      return()
    }
    req(rv$sce)
    cd <- SummarizedExperiment::colData(rv$sce)
    vals <- as.character(cd[[cd_col]])
    rv$overlay_factor <- vals
    all_levels <- sort(unique(vals))
    output$overlay_checkboxes_ui <- renderUI({
      checkboxGroupInput("overlay_levels", "Select levels:",
                         choices = all_levels,
                         selected = all_levels[1:min(3, length(all_levels))],
                         inline = FALSE)
    })
  }, ignoreInit = TRUE)

  observeEvent(input$overlay_levels, {
    rv$overlay_selected <- input$overlay_levels
    if (!is.null(rv$assay_data)) send_full_plot()
  }, ignoreNULL = FALSE, ignoreInit = TRUE)

  observeEvent(input$clear_overlay_btn, {
    updateSelectInput(session, "overlay_coldata", selected = "")
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # GATING STRATEGY HELPERS
  # ══════════════════════════════════════════════════════════════════════════════

  get_filtered_assay_data <- function() {
    if (is.null(rv$assay_data)) return(NULL)
    if (is.null(rv$sample_mask)) return(rv$assay_data)
    rv$assay_data[rv$sample_mask, , drop = FALSE]
  }

  is_flow_display_context <- function() {
    !is.null(rv$sce) && is_flow_session(rv$sce) && rv$assay_name == "exprs" &&
      !is.null(rv$flow_raw_data)
  }

  get_gating_data <- function() {
    if (is_flow_display_context()) return(rv$flow_raw_data)
    rv$assay_data
  }

  gate_to_display_space <- function(gate) {
    if (!is_flow_display_context()) return(gate)

    gate_disp <- gate
    gate_disp$vertices <- flow_forward_vertices(
      vertices = gate$vertices,
      x_channel = gate$x_channel,
      y_channel = gate$y_channel,
      raw_mat = rv$flow_raw_data,
      channel_names = colnames(rv$flow_raw_data),
      logicle_w_params = rv$flow_logicle_w,
      scatter_cofactor_params = rv$flow_scatter_cofactor
    )
    gate_disp
  }

  get_plot_gates <- function(x_channel = NULL, y_channel = NULL) {
    if (!is_flow_display_context()) return(rv$gates)

    # Fast path for gating-tab redraws: only transform gates that could be drawn
    # on the current axes (normal or flipped orientation).
    if (!is.null(x_channel) && !is.null(y_channel)) {
      out <- rv$gates
      for (gid in names(rv$gates)) {
        gate <- rv$gates[[gid]]
        if (is.null(gate)) next
        is_normal <- identical(gate$x_channel, x_channel) && identical(gate$y_channel, y_channel)
        is_flipped <- identical(gate$x_channel, y_channel) && identical(gate$y_channel, x_channel)
        if (is_normal || is_flipped) {
          out[[gid]] <- gate_to_display_space(gate)
        }
      }
      return(out)
    }

    # Full transform for downstream utilities that need all gates in display space.
    lapply(rv$gates, gate_to_display_space)
  }

  vertices_display_to_gating_space <- function(vertices, x_channel, y_channel) {
    if (!is_flow_display_context()) return(vertices)
    flow_inverse_vertices(
      vertices = vertices,
      x_channel = x_channel,
      y_channel = y_channel,
      raw_mat = rv$flow_raw_data,
      channel_names = colnames(rv$flow_raw_data),
      logicle_w_params = rv$flow_logicle_w,
      scatter_cofactor_params = rv$flow_scatter_cofactor
    )
  }

  infer_flow_gate_value_space <- function(gates) {
    if (!is_flow_display_context() || length(gates) == 0) return("display")

    score_display <- 0
    score_raw <- 0

    for (gate in gates) {
      if (is.null(gate) || is.null(gate$vertices) || length(gate$vertices) == 0) next
      x_ch <- gate$x_channel
      y_ch <- gate$y_channel
      if (is.null(x_ch) || is.null(y_ch)) next
      if (!x_ch %in% colnames(rv$assay_data) || !y_ch %in% colnames(rv$assay_data)) next

      x_vals <- rv$assay_data[, x_ch]
      y_vals <- rv$assay_data[, y_ch]
      x_rng <- compute_stable_range(x_ch)
      y_rng <- compute_stable_range(y_ch)

      verts_display_assumed <- gate$vertices
      verts_raw_assumed <- flow_forward_vertices(
        vertices = gate$vertices,
        x_channel = x_ch,
        y_channel = y_ch,
        raw_mat = rv$flow_raw_data,
        channel_names = colnames(rv$flow_raw_data),
        logicle_w_params = rv$flow_logicle_w,
        scatter_cofactor_params = rv$flow_scatter_cofactor
      )

      in_range_count <- function(vs) {
        if (is.null(vs) || length(vs) == 0) return(0L)
        sum(vapply(vs, function(v) {
          xv <- as.numeric(v[[1]])
          yv <- as.numeric(v[[2]])
          is.finite(xv) && is.finite(yv) &&
            xv >= x_rng[1] && xv <= x_rng[2] &&
            yv >= y_rng[1] && yv <= y_rng[2]
        }, logical(1)))
      }

      score_display <- score_display + in_range_count(verts_display_assumed)
      score_raw <- score_raw + in_range_count(verts_raw_assumed)
    }

    if (score_display > score_raw) "display" else "raw"
  }

  normalize_workspace_gate_space <- function(ws) {
    if (is.null(ws) || is.null(ws$gates)) return(ws)
    if (!is_flow_display_context()) return(ws)

    space <- ws$gate_value_space
    if (is.null(space) || !space %in% c("raw", "display")) {
      space <- infer_flow_gate_value_space(ws$gates)
    }

    if (identical(space, "raw")) {
      ws$gate_value_space <- "raw"
      return(ws)
    }

    ws$gates <- lapply(ws$gates, function(gate) {
      if (is.null(gate) || is.null(gate$vertices) || length(gate$vertices) == 0) return(gate)
      if (is.null(gate$x_channel) || is.null(gate$y_channel)) return(gate)
      if (!gate$x_channel %in% colnames(rv$flow_raw_data) || !gate$y_channel %in% colnames(rv$flow_raw_data)) {
        return(gate)
      }
      gate$vertices <- flow_inverse_vertices(
        vertices = gate$vertices,
        x_channel = gate$x_channel,
        y_channel = gate$y_channel,
        raw_mat = rv$flow_raw_data,
        channel_names = colnames(rv$flow_raw_data),
        logicle_w_params = rv$flow_logicle_w,
        scatter_cofactor_params = rv$flow_scatter_cofactor
      )
      gate
    })

    ws$gate_value_space <- "raw"
    showNotification("Converted legacy flow gate coordinates to raw domain.",
                     type = "message", duration = 4)
    ws
  }

  get_pop_mask <- function(pop_id = NULL) {
    gating_data <- get_gating_data()
    if (is.null(gating_data) || nrow(gating_data) == 0) return(NULL)
    pop_id <- pop_id %||% rv$active_population_id %||% rv$root_population_id
    if (rv$cache_version == rv$gate_version && !is.null(rv$pop_events_map[[pop_id]]))
      return(rv$pop_events_map[[pop_id]])
    result <- apply_gating_strategy(rv$gates, rv$populations, rv$root_population_id, gating_data)
    rv$pop_events_map <- result$masks
    rv$populations <- result$populations
    rv$cache_version <- rv$gate_version
    result$masks[[pop_id]]
  }

  get_combined_pop_mask <- function(pop_id = NULL) {
    pop_mask <- get_pop_mask(pop_id)
    if (!is.null(rv$sample_mask)) {
      pop_mask <- if (!is.null(pop_mask)) pop_mask & rv$sample_mask else rv$sample_mask
    }
    pop_mask
  }

  get_gate_counts <- function() {
    gating_data <- get_gating_data()
    if (is.null(gating_data) || length(rv$gates) == 0) return(list())
    pop_mask <- get_combined_pop_mask()
    # Cache gate counts keyed by gate_version + active population + sample mask hash
    sample_hash <- if (is.null(rv$sample_mask)) "all" else sum(rv$sample_mask)
    cache_key <- paste(rv$gate_version,
                       rv$active_population_id %||% "root",
                       sample_hash, sep = "|")
    if (!is.null(rv$.gate_counts_cache_key) &&
        identical(rv$.gate_counts_cache_key, cache_key) &&
        !is.null(rv$.gate_counts_cache)) {
      return(rv$.gate_counts_cache)
    }
    counts <- compute_gate_counts(rv$gates, pop_mask, gating_data)
    rv$.gate_counts_cache_key <- cache_key
    rv$.gate_counts_cache <- counts
    counts
  }

  compute_stable_range <- function(channel) {
    assay_for_range <- get_filtered_assay_data()
    if (is.null(assay_for_range) || nrow(assay_for_range) == 0 || !channel %in% colnames(assay_for_range)) {
      return(c(0, 1))
    }
    vals <- assay_for_range[, channel]
    p_high <- as.numeric(quantile(vals, 0.999, na.rm = TRUE))
    p_low <- as.numeric(quantile(vals, 0.001, na.rm = TRUE))
    low <- min(0, p_low)
    span <- p_high - low
    if (span < 1e-10) span <- 1
    padding <- span * 0.05
    c(low - padding, p_high + padding)
  }

  # ══════════════════════════════════════════════════════════════════════════════
  # PLOT RENDERING (Gating Tab)
  # ══════════════════════════════════════════════════════════════════════════════

  send_full_plot <- function(reset_view = FALSE) {
    req(rv$assay_data, input$x_channel, input$y_channel)
    x_ch <- input$x_channel; y_ch <- input$y_channel
    if (!x_ch %in% colnames(rv$assay_data) || !y_ch %in% colnames(rv$assay_data)) return()

    pop_mask <- get_pop_mask()
    combined_mask <- get_combined_pop_mask()
    gate_counts <- get_gate_counts()
    plot_gates <- get_plot_gates(x_ch, y_ch)
    alpha <- input$point_alpha %||% 0.35
    x_range <- compute_stable_range(x_ch)
    y_range <- compute_stable_range(y_ch)

    overlay_active <- !is.null(rv$overlay_factor) && !is.null(rv$overlay_selected) && length(rv$overlay_selected) > 0

    if (overlay_active) {
      factor_vals <- rv$overlay_factor
      selected <- rv$overlay_selected
      include_mask <- factor_vals %in% selected
      if (!is.null(combined_mask)) include_mask <- include_mask & combined_mask
      color_map <- setNames(seq_along(selected) - 1L, selected)
      all_color_indices <- rep(0L, length(factor_vals))
      for (lvl in selected) all_color_indices[factor_vals == lvl] <- color_map[[lvl]]
      palette <- SAMPLE_COLORS[seq_along(selected)]
      plot_data <- build_plot_data_overlay(
        assay_data = rv$assay_data[include_mask, , drop = FALSE],
        x_channel = x_ch, y_channel = y_ch, assay_name = rv$assay_name,
        gates = plot_gates, gate_order = rv$gate_order,
        selected_gate_id = rv$selected_gate_id,
        display_mode = input$display_mode %||% "pseudocolor",
        active_pop_id = rv$active_population_id, pop_mask = NULL,
        gate_counts = gate_counts,
        color_indices = all_color_indices[include_mask],
        color_palette = palette, color_labels = selected,
        max_events = rv$max_events, reset_view = reset_view,
        point_alpha = alpha, x_range_override = x_range, y_range_override = y_range
      )
    } else {
      plot_data <- build_plot_data(
        assay_data = rv$assay_data, x_channel = x_ch, y_channel = y_ch,
        assay_name = rv$assay_name,
        gates = plot_gates, gate_order = rv$gate_order,
        selected_gate_id = rv$selected_gate_id,
        display_mode = input$display_mode %||% "pseudocolor",
        active_pop_id = rv$active_population_id, pop_mask = combined_mask,
        gate_counts = gate_counts, max_events = rv$max_events,
        reset_view = reset_view, point_alpha = alpha,
        x_range_override = x_range, y_range_override = y_range
      )
    }

    # Attach channel list + contour threshold so JS can build axis pickers
    plot_data$channels          <- as.list(rv$channels)
    plot_data$contour_threshold <- as.numeric(input$contour_threshold %||% 5)
    if (!is.null(rv$sce) && is_flow_session(rv$sce) && rv$assay_name == "exprs") {
      x_is_scatter <- .is_scatter_channel(x_ch)
      y_is_scatter <- .is_scatter_channel(y_ch)
      plot_data$x_is_log <- isTRUE(x_is_scatter)
      plot_data$y_is_log <- isTRUE(y_is_scatter)
      plot_data$x_scatter_cofactor <- as.numeric(rv$flow_scatter_cofactor[[x_ch]] %||% 150)
      plot_data$y_scatter_cofactor <- as.numeric(rv$flow_scatter_cofactor[[y_ch]] %||% 150)
    }

    rv$current_plot_data <- plot_data
    session$sendCustomMessage("updatePlot", plot_data)
  }

  send_gates_only <- function() {
    req(rv$current_plot_data)
    gate_counts <- get_gate_counts()
    x_ch <- rv$current_plot_data$x_label
    y_ch <- rv$current_plot_data$y_label
    plot_gates <- get_plot_gates(x_ch, y_ch)
    plot_data <- build_gates_only_data(rv$current_plot_data, plot_gates, rv$gate_order,
                                        gate_counts, rv$selected_gate_id)
    rv$current_plot_data <- plot_data
    session$sendCustomMessage("updatePlot", plot_data)
  }

  observeEvent(input$gating_max_events, {
    val <- suppressWarnings(as.numeric(input$gating_max_events))
    current_for_ui <- if (is.finite(rv$max_events)) as.integer(rv$max_events) else 0L
    if (!is.finite(val) || val < 0) {
      updateNumericInput(session, "gating_max_events", value = current_for_ui)
      return()
    }

    new_max <- if (val <= 0) Inf else as.integer(round(val))
    same_value <- (is.infinite(new_max) && is.infinite(rv$max_events)) ||
      (!is.infinite(new_max) && !is.infinite(rv$max_events) &&
         as.integer(new_max) == as.integer(rv$max_events))
    if (isTRUE(same_value)) return()

    rv$max_events <- new_max
    if (!is.null(rv$assay_data) && !is.null(input$x_channel) && !is.null(input$y_channel)) {
      send_full_plot(reset_view = FALSE)
    }
  }, ignoreInit = TRUE)

  observeEvent(list(input$x_channel, input$y_channel), {
    req(rv$assay_data, input$x_channel, input$y_channel)
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$display_mode, { req(rv$assay_data); send_full_plot() }, ignoreInit = TRUE)
  observeEvent(input$contour_threshold, { req(rv$assay_data); send_full_plot() }, ignoreInit = TRUE)
  observeEvent(input$reset_view_btn, { req(rv$assay_data); send_full_plot(reset_view = TRUE) })

  # Axis-label clicks → update the hidden channel selects (which trigger send_full_plot)
  observeEvent(input$axis_label_click, {
    click <- input$axis_label_click
    req(click, click$axis, click$selected)
    if (click$selected %in% rv$channels) {
      if (click$axis == "x") {
        updateSelectInput(session, "x_channel", selected = click$selected)
      } else {
        updateSelectInput(session, "y_channel", selected = click$selected)
      }
    }
  })
  observeEvent(input$refresh_plot_btn, {
    req(rv$assay_data); rv$cache_version <- -1L; rv$pop_events_map <- list()
    rv$.gate_counts_cache_key <- NULL; rv$.gate_counts_cache <- NULL
    send_full_plot()
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # GATE DRAWING + CREATION + EDITING
  # ══════════════════════════════════════════════════════════════════════════════

  observeEvent(input$mode_navigate, { session$sendCustomMessage("setMode", "navigate"); update_mode_buttons("navigate") })
  observeEvent(input$mode_rect,     { session$sendCustomMessage("setMode", "draw-rect"); update_mode_buttons("draw-rect") })
  observeEvent(input$mode_poly,     { session$sendCustomMessage("setMode", "draw-poly"); update_mode_buttons("draw-poly") })
  observeEvent(input$mode_cancel,   { session$sendCustomMessage("setMode", "navigate"); update_mode_buttons("navigate") })

  update_mode_buttons <- function(active_mode) {
    modes <- list(mode_navigate = "navigate", mode_rect = "draw-rect", mode_poly = "draw-poly")
    for (btn_id in names(modes)) {
      if (modes[[btn_id]] == active_mode) runjs(sprintf("$('#%s').addClass('active-mode')", btn_id))
      else runjs(sprintf("$('#%s').removeClass('active-mode')", btn_id))
    }
  }

  observeEvent(input$new_gate, {
    gate_data <- input$new_gate; req(gate_data)
    rv$.pending_gate <- gate_data
    parent_choices <- setNames(names(rv$populations),
                               vapply(rv$populations, function(p) p$name, character(1)))
    default_parent <- rv$active_population_id %||% rv$root_population_id
    showModal(modalDialog(
      title = "Name this gate",
      textInput("gate_name_input", "Gate name:", value = ""),
      checkboxInput("create_pop_from_gate", "Also create a population from this gate", value = FALSE),
      textInput("gate_pop_name_input", "New population name:", value = ""),
      selectInput("gate_pop_parent", "Parent population:",
                  choices = parent_choices, selected = default_parent),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_gate_btn", "Create", class = "btn-success"))
    ))
    rv$.gate_pop_name_manual <- FALSE
    runjs("setTimeout(function(){var el=document.getElementById('gate_name_input'); if(el){el.focus(); el.select();}}, 80);")
  })

  observeEvent(input$gate_pop_name_input, {
    if (is.null(rv$.gate_pop_name_manual) || isTRUE(rv$.gate_pop_name_manual)) return()
    gate_name <- trimws(as.character(input$gate_name_input %||% ""))
    pop_name <- trimws(as.character(input$gate_pop_name_input %||% ""))
    if (!identical(pop_name, gate_name)) {
      rv$.gate_pop_name_manual <- TRUE
    }
  }, ignoreInit = TRUE)

  observeEvent(input$gate_name_input, {
    req(!is.null(rv$.gate_pop_name_manual))
    if (isTRUE(rv$.gate_pop_name_manual)) return()
    updateTextInput(session, "gate_pop_name_input", value = trimws(as.character(input$gate_name_input %||% "")))
  }, ignoreInit = TRUE)

  observeEvent(input$confirm_gate_btn, {
    removeModal(); gate_data <- rv$.pending_gate; req(gate_data); rv$.pending_gate <- NULL
    save_undo_snapshot()

    append_suffix <- function(x, suffix) {
      x <- trimws(as.character(x %||% ""))
      if (nchar(x) == 0) return(suffix)
      pattern <- paste0("\\\\s*", suffix, "$")
      if (grepl(pattern, x, ignore.case = TRUE)) return(x)
      paste(x, suffix)
    }

    create_pop <- isTRUE(input$create_pop_from_gate)
    gate_name <- input$gate_name_input
    if (is.null(gate_name) || nchar(trimws(gate_name)) == 0) gate_name <- paste0("Gate_", length(rv$gates) + 1)
    gate_name <- trimws(gate_name)
    if (create_pop) gate_name <- append_suffix(gate_name, "gate")

    color <- next_gate_color(length(rv$gates))
    gate_vertices <- gate_data$vertices
    if (is_flow_display_context()) {
      gate_vertices <- vertices_display_to_gating_space(
        vertices = gate_data$vertices,
        x_channel = gate_data$x_channel,
        y_channel = gate_data$y_channel
      )
    }
    gate <- new_gate(name = gate_name, gate_type = gate_data$gate_type,
                     x_channel = gate_data$x_channel, y_channel = gate_data$y_channel,
                     vertices = gate_vertices, color = color,
                     label_offset = gate_data$label_offset)
    rv$gates[[gate$gate_id]] <- gate
    rv$gate_order <- c(rv$gate_order, gate$gate_id)
    rv$selected_gate_id <- gate$gate_id

    if (create_pop) {
      pop_parent <- input$gate_pop_parent %||% rv$active_population_id %||% rv$root_population_id
      if (is.null(rv$populations[[pop_parent]])) pop_parent <- rv$root_population_id

      pop_name <- input$gate_pop_name_input
      if (is.null(pop_name) || nchar(trimws(pop_name)) == 0) {
        pop_name <- gate_name
      }
      pop_name <- append_suffix(pop_name, "pop")

      new_pop <- new_population(
        pop_name,
        gate_refs = list(new_gate_ref(gate$gate_id, include = TRUE)),
        parent_id = pop_parent
      )
      rv$populations[[new_pop$population_id]] <- new_pop
      rv$populations <- link_child_to_parent(rv$populations, new_pop$population_id, pop_parent)
      sort_population_tree_state()
      rv$active_population_id <- new_pop$population_id
    }

    rv$gate_version <- rv$gate_version + 1L
    session$sendCustomMessage("setMode", "navigate"); update_mode_buttons("navigate")
    autosave()
    if (create_pop) {
      send_full_plot()
    } else if (!is.null(rv$current_plot_data) && rv$current_plot_data$x_label == input$x_channel &&
               rv$current_plot_data$y_label == input$y_channel) {
      send_gates_only()
    } else {
      send_full_plot()
    }
  })

  observeEvent(input$gate_edit, {
    edit <- input$gate_edit; req(edit, edit$gate_id)
    if (!is.null(rv$gates[[edit$gate_id]])) {
      save_undo_snapshot()
      gate_vertices <- edit$vertices
      if (is_flow_display_context()) {
        gate_vertices <- vertices_display_to_gating_space(
          vertices = edit$vertices,
          x_channel = edit$x_channel,
          y_channel = edit$y_channel
        )
      }
      rv$gates[[edit$gate_id]]$vertices <- gate_vertices
      rv$gate_version <- rv$gate_version + 1L
      rv$cache_version <- -1L      # invalidate population cache
      rv$pop_events_map <- list()
      session$sendCustomMessage("clearPendingEdit", list(gate_id = edit$gate_id, seq = edit$seq))
      autosave(); send_full_plot()
    }
  })

  observeEvent(input$gate_label_move, {
    data <- input$gate_label_move; req(data, data$gate_id)
    if (!is.null(rv$gates[[data$gate_id]])) {
      rv$gates[[data$gate_id]]$label_offset <- as.numeric(data$label_offset)
      autosave()
    }
  })

  observeEvent(input$gate_select, { rv$selected_gate_id <- input$gate_select; send_gates_only() })

  delete_gate_by_id <- function(gate_id) {
    req(gate_id)
    if (is.null(rv$gates[[gate_id]])) return()
    save_undo_snapshot()
    rv$gates[[gate_id]] <- NULL
    rv$gate_order <- setdiff(rv$gate_order, gate_id)
    for (pid in names(rv$populations)) {
      pop <- rv$populations[[pid]]
      if (length(pop$gate_refs) > 0) {
        rv$populations[[pid]]$gate_refs <-
          Filter(function(ref) ref$gate_id != gate_id, pop$gate_refs)
      }
    }
    rv$selected_gate_id <- NULL
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

  observeEvent(input$delete_gate_btn, {
    req(rv$selected_gate_id)
    gate <- rv$gates[[rv$selected_gate_id]]
    req(gate)
    rv$.pending_delete_gate_id <- rv$selected_gate_id
    showModal(modalDialog(
      title = "Delete Gate",
      tags$p(sprintf("Are you sure you want to delete this gate: %s?", gate$name)),
      footer = tagList(
        modalButton("Cancel"),
        actionButton("confirm_delete_gate_btn", "OK", class = "btn-danger")
      ),
      easyClose = TRUE
    ))
  })

  observeEvent(input$confirm_delete_gate_btn, {
    removeModal()
    gate_id <- rv$.pending_delete_gate_id
    rv$.pending_delete_gate_id <- NULL
    req(gate_id)
    delete_gate_by_id(gate_id)
  })

  observeEvent(input$gate_list_click, {
    gate_id <- input$gate_list_click; gate <- rv$gates[[gate_id]]
    rv$selected_gate_id <- gate_id
    if (!is.null(gate)) {
      if (!identical(input$x_channel, gate$x_channel) || !identical(input$y_channel, gate$y_channel)) {
        updateSelectInput(session, "x_channel", selected = gate$x_channel)
        updateSelectInput(session, "y_channel", selected = gate$y_channel)
      } else send_gates_only()
    }
  })

  observeEvent(input$rename_gate_btn, {
    req(rv$selected_gate_id); gate <- rv$gates[[rv$selected_gate_id]]; req(gate)
    showModal(modalDialog(
      title = "Rename Gate",
      textInput("rename_gate_input", "New name:", value = gate$name),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_rename_gate", "Rename", class = "btn-primary"))
    ))
    runjs("setTimeout(function(){var el=document.getElementById('rename_gate_input'); if(el){el.focus(); el.select();}}, 80);")
  })

  observeEvent(input$confirm_rename_gate, {
    removeModal(); req(rv$selected_gate_id)
    new_name <- input$rename_gate_input
    if (!is.null(new_name) && nchar(trimws(new_name)) > 0) {
      save_undo_snapshot()
      rv$gates[[rv$selected_gate_id]]$name <- trimws(new_name)
      rv$gate_version <- rv$gate_version + 1L
      autosave(); send_gates_only()
    }
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # GATE LIST UI
  # ══════════════════════════════════════════════════════════════════════════════

  output$gate_list_ui <- renderUI({
    rv$gates; rv$gate_order; rv$selected_gate_id; rv$gate_version
    if (length(rv$gates) == 0) {
      return(tags$div(class = "gate-list-panel",
                      tags$em("No gates. Draw one using the toolbar.", style = "color:#999; font-size:12px;")))
    }
    gate_counts <- get_gate_counts()
    ordered_ids <- if (length(rv$gate_order) > 0) rv$gate_order else names(rv$gates)
    cards <- lapply(ordered_ids, function(gid) {
      gate <- rv$gates[[gid]]; if (is.null(gate)) return(NULL)
      is_sel <- identical(gid, rv$selected_gate_id)
      counts <- gate_counts[[gid]]
      count_text <- if (!is.null(counts)) paste0(format(counts$event_count, big.mark = ","),
                                                  " (", counts$percent_of_parent, "%)") else ""
      tags$div(
        class = paste("gate-card", if (is_sel) "selected" else ""),
        onclick = sprintf("Shiny.setInputValue('gate_list_click', '%s', {priority:'event'})", gid),
        tags$div(class = "gate-color-swatch", style = paste0("background:", gate$color)),
        tags$div(class = "gate-card-name", gate$name),
        tags$div(class = "gate-card-channels", paste0(gate$x_channel, " / ", gate$y_channel)),
        tags$div(class = "gate-card-info", count_text)
      )
    })
    tags$div(class = "gate-list-panel", cards)
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # POPULATION TREE
  # ══════════════════════════════════════════════════════════════════════════════

  observeEvent(input$add_pop_btn, {
    req(length(rv$gates) > 0)
    parent_choices <- setNames(names(rv$populations),
                                vapply(rv$populations, function(p) p$name, character(1)))
    gate_ref_ui <- lapply(names(rv$gates), function(gid) {
      gate <- rv$gates[[gid]]
      tags$div(style = "display:flex; align-items:center; gap:6px; margin:2px 0;",
        tags$span(class = "gate-color-swatch",
                  style = paste0("background:", gate$color,
                                 "; width:10px; height:10px; border-radius:2px; flex-shrink:0;")),
        tags$span(gate$name,
                  style = "font-size:12px; min-width:90px; flex-shrink:0;"),
        tags$div(class = "gate-ref-row",
          radioButtons(paste0("gate_ref_", gid), NULL,
                       choices = c("Off" = "off", "In" = "include", "Ex" = "exclude"),
                       selected = "off", inline = TRUE)
        )
      )
    })
    showModal(modalDialog(
      title = "Create Population",
      textInput("new_pop_name", "Population name:", value = ""),
      selectInput("new_pop_parent", "Parent population:", choices = parent_choices,
                  selected = rv$active_population_id %||% rv$root_population_id),
      tags$label("Gate references (AND logic):"),
      tags$div(id = "gate_ref_inputs", gate_ref_ui),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_pop_btn", "Create", class = "btn-success"))
    ))
    runjs("setTimeout(function(){var el=document.getElementById('new_pop_name'); if(el){el.focus();}}, 80);")
  })

  observeEvent(input$confirm_pop_btn, {
    removeModal(); save_undo_snapshot()
    pop_name <- input$new_pop_name
    if (is.null(pop_name) || nchar(trimws(pop_name)) == 0) pop_name <- paste0("Pop_", length(rv$populations))
    parent_id <- input$new_pop_parent %||% rv$root_population_id
    gate_refs <- list()
    for (gid in names(rv$gates)) {
      val <- input[[paste0("gate_ref_", gid)]]
      if (!is.null(val) && val != "off")
        gate_refs[[length(gate_refs) + 1L]] <- new_gate_ref(gid, include = (val == "include"))
    }
    pop <- new_population(pop_name, gate_refs = gate_refs, parent_id = parent_id)
    rv$populations[[pop$population_id]] <- pop
    rv$populations <- link_child_to_parent(rv$populations, pop$population_id, parent_id)
    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    rv$active_population_id <- pop$population_id
    autosave(); send_full_plot()
  })

  observeEvent(input$edit_pop_btn, {
    pop_id <- rv$active_population_id
    req(pop_id, !is.null(rv$populations[[pop_id]]))
    pop_name <- rv$populations[[pop_id]]$name %||% pop_id
    showModal(modalDialog(
      title = paste("Edit Population:", pop_name),
      uiOutput("population_editor_ui"),
      footer = modalButton("Close"),
      easyClose = TRUE,
      size = "l"
    ))
  })

  request_population_delete <- function(pop_id) {
    req(pop_id)
    if (identical(pop_id, rv$root_population_id)) {
      showNotification("Root population cannot be deleted.", type = "warning", duration = 3)
      return()
    }
    pop <- rv$populations[[pop_id]]
    req(pop)
    rv$.pending_delete_pop_id <- pop_id
    showModal(modalDialog(
      title = "Delete Population",
      tags$p(sprintf("Are you sure you want to delete this population: %s?", pop$name)),
      tags$p("All child populations will be removed too.", style = "color:#777;"),
      footer = tagList(
        modalButton("Cancel"),
        actionButton("confirm_delete_pop_btn", "OK", class = "btn-danger")
      ),
      easyClose = TRUE
    ))
  }

  delete_population_by_id <- function(pop_id) {
    req(pop_id, pop_id != rv$root_population_id)
    if (is.null(rv$populations[[pop_id]])) return()
    save_undo_snapshot()
    rv$populations <- remove_population_subtree(rv$populations, pop_id)
    sort_population_tree_state()
    if (identical(rv$active_population_id, pop_id) || is.null(rv$populations[[rv$active_population_id]])) {
      rv$active_population_id <- rv$root_population_id
    }
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

  observeEvent(input$delete_pop_btn, {
    request_population_delete(rv$active_population_id)
  })

  observeEvent(input$delete_pop_click, {
    request_population_delete(input$delete_pop_click)
  })

  observeEvent(input$confirm_delete_pop_btn, {
    removeModal()
    pop_id <- rv$.pending_delete_pop_id
    rv$.pending_delete_pop_id <- NULL
    req(pop_id)
    delete_population_by_id(pop_id)
  })

  observeEvent(input$pop_tree_click, { rv$active_population_id <- input$pop_tree_click; send_full_plot() })

  output$population_tree_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$active_population_id; rv$gate_version; rv$selected_gate_id
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) {
      return(tags$div(class = "population-tree-panel",
                      tags$em("No data loaded.", style = "color:#999; font-size:12px;")))
    }
    assay_for_counts <- get_gating_data()
    if (!is.null(assay_for_counts) && nrow(assay_for_counts) > 0) {
      if (!is.null(rv$sample_mask)) {
        assay_for_counts <- assay_for_counts[rv$sample_mask, , drop = FALSE]
      }
    }
    if (!is.null(assay_for_counts) && nrow(assay_for_counts) > 0) {
      result <- apply_gating_strategy(rv$gates, rv$populations, rv$root_population_id, assay_for_counts)
      rv$populations <- result$populations
    }
    rows <- list()
    visited <- character(0)

    append_tree_rows <- function(pop_id, depth) {
      if (pop_id %in% visited) return()
      visited <<- c(visited, pop_id)

      pop <- rv$populations[[pop_id]]
      if (is.null(pop)) return()

      is_active <- identical(pop_id, rv$active_population_id)
      is_root <- identical(pop_id, rv$root_population_id)
      count_text <- if (!is.null(pop$event_count)) format(pop$event_count, big.mark = ",") else "?"
      pct_text <- if (!is.null(pop$percent_of_parent) && !is_root) paste0("(", pop$percent_of_parent, "%)") else ""
      badges <- lapply(pop$gate_refs, function(ref) {
        gate <- rv$gates[[ref$gate_id]]
        if (is.null(gate)) return(NULL)
        is_selected_gate <- identical(ref$gate_id, rv$selected_gate_id)
        badge_classes <- c(
          "gate-ref-badge",
          "pop-tree-gate-badge",
          if (!ref$include) "exclude",
          if (is_selected_gate) "selected-gate"
        )
        tags$span(
          class = paste(badge_classes, collapse = " "),
          style = paste0("background:", gate$color),
          onclick = sprintf("event.stopPropagation(); Shiny.setInputValue('gate_list_click', '%s', {priority:'event'})", ref$gate_id),
          if (ref$include) gate$name else paste0("-", gate$name)
        )
      })

      indent_px <- depth * 16
      rows[[length(rows) + 1L]] <<- tags$div(
        class = paste("pop-row", if (is_active) "active" else ""),
        onclick = sprintf("Shiny.setInputValue('pop_tree_click', '%s', {priority:'event'})", pop_id),
        tags$span(
          class = "pop-row-name-col",
          tags$span(class = "pop-row-indent", style = paste0("width:", indent_px, "px")),
          tags$span(class = "pop-row-name", pop$name)
        ),
        tags$span(
          class = "pop-row-gates-col",
          tags$span(class = "pop-row-indent", style = paste0("width:", indent_px, "px")),
          tags$span(class = "pop-row-gates", badges)
        ),
        tags$span(class = "pop-row-count", count_text),
        tags$span(class = "pop-row-pct", pct_text)
      )

      child_ids <- unique(pop$children)
      child_ids <- child_ids[child_ids %in% names(rv$populations)]
      if (length(child_ids) > 1) {
        child_names <- vapply(child_ids, function(cid) rv$populations[[cid]]$name %||% cid, character(1))
        child_ids <- child_ids[order(tolower(child_names), child_ids)]
      }

      for (child_id in child_ids) append_tree_rows(child_id, depth + 1)
    }

    append_tree_rows(rv$root_population_id, 0)
    tags$div(class = "population-tree-panel", rows)
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # POPULATION EDITOR
  # ══════════════════════════════════════════════════════════════════════════════

  output$population_editor_ui <- renderUI({
    pop_id <- rv$active_population_id; rv$gate_version
    if (is.null(pop_id) || is.null(rv$populations[[pop_id]])) {
      return(tags$div(class = "pop-editor-panel",
                      tags$em("Select a population to edit.", style = "color:#999; font-size:12px;")))
    }
    pop <- rv$populations[[pop_id]]
    is_root <- identical(pop_id, rv$root_population_id)

    top_controls <- if (!is_root) {
      # Valid new parents: any population that is not the current pop, not a descendant of it
      all_ids <- names(rv$populations)
      valid_parents <- Filter(function(pid) {
        pid != pop_id && !would_create_cycle(rv$populations, pop_id, pid)
      }, all_ids)
      parent_choices <- setNames(
        valid_parents,
        vapply(valid_parents, function(pid) rv$populations[[pid]]$name %||% pid, character(1))
      )
      tags$div(class = "pop-editor-row pop-editor-top-row",
        tags$div(class = "pop-editor-top-block",
          tags$label("Name:", style = "font-weight:600; font-size:12px;"),
          tags$div(style = "display:flex; align-items:center; gap:4px; margin-top:2px;",
            textInput("edit_pop_name", NULL, value = pop$name, width = "180px"),
            actionButton("confirm_rename_pop", "Rename", class = "btn-xs btn-primary", style = "margin-top:0;"))
        ),
        tags$div(class = "pop-editor-top-block",
          tags$label("Parent:", style = "font-weight:600; font-size:12px;"),
          tags$div(style = "display:flex; align-items:center; gap:4px; margin-top:2px;",
            selectInput("edit_pop_parent_select", NULL,
                        choices = parent_choices,
                        selected = pop$parent_id %||% rv$root_population_id,
                        width = "170px"),
            actionButton("change_pop_parent_btn", "Move",
                         class = "btn-xs btn-warning", style = "margin-top:0;"))
        )
      )
    } else {
      tags$div(class = "pop-editor-row pop-editor-top-row",
        tags$div(class = "pop-editor-top-block",
          tags$label("Name:", style = "font-weight:600; font-size:12px;"),
          tags$span(pop$name, style = "margin-left: 6px; font-size:12px;")),
        tags$div(class = "pop-editor-top-block",
          tags$label("Parent:", style = "font-weight:600; font-size:12px;"),
          tags$span("(root)", style = "margin-left:6px; font-size:12px; color:#888;"))
      )
    }

    count_ui <- tags$div(class = "pop-editor-row", style = "margin-top: 4px;",
      tags$label("Events:", style = "font-weight:600; font-size:12px;"),
      tags$span(if (!is.null(pop$event_count)) format(pop$event_count, big.mark = ",") else "?",
                style = "margin-left: 6px; font-size:12px;"),
      if (!is.null(pop$percent_of_parent) && !is_root)
        tags$span(paste0(" (", pop$percent_of_parent, "% of parent)"), style = "color:#888; font-size:11px;"))

    # ── Collect inherited gate refs from ancestor chain ──────────────────────
    ancestor_refs <- list()
    if (!is_root) {
      walk_id <- pop$parent_id
      while (!is.null(walk_id) && !is.null(rv$populations[[walk_id]])) {
        ancestor_pop <- rv$populations[[walk_id]]
        for (ref in ancestor_pop$gate_refs) {
          ancestor_refs[[length(ancestor_refs) + 1L]] <- list(
            gate_id       = ref$gate_id,
            include       = ref$include,
            from_pop_name = ancestor_pop$name
          )
        }
        walk_id <- ancestor_pop$parent_id
      }
    }

    # ── Inherited gates section (greyed, locked) ──────────────────────────────
    inherited_ui <- if (length(ancestor_refs) > 0) {
      ibadges <- lapply(ancestor_refs, function(iref) {
        gate <- rv$gates[[iref$gate_id]]
        if (is.null(gate)) return(NULL)
        tags$span(
          class = paste("gate-ref-badge", if (!iref$include) "exclude"),
          style = paste0("background:", gate$color),
          paste0(if (iref$include) gate$name else paste0("-", gate$name), " \u2190 ", iref$from_pop_name)
        )
      })
      tagList(
        tags$div(style = paste0("font-size:10px; color:#999; font-weight:700;",
                                " text-transform:uppercase; letter-spacing:0.4px;",
                                " margin:6px 0 3px 0;"),
                 "\U1F512 Inherited from parent chain"),
        tags$div(class = "inherited-gates-inline", ibadges)
      )
    } else NULL

    # ── Own gate refs (editable) — exclude gates already in the ancestor chain ─
    inherited_gate_ids <- unique(vapply(ancestor_refs,
                                        function(r) r$gate_id, character(1)))
    gate_refs_ui <- NULL
    if (!is_root && length(rv$gates) > 0) {
      # Only gates NOT inherited from an ancestor are editable here
      editable_gids <- setdiff(names(rv$gates), inherited_gate_ids)
      current_refs <- list()
      for (ref in pop$gate_refs) current_refs[[ref$gate_id]] <- if (ref$include) "include" else "exclude"

      if (length(editable_gids) > 0) {
        ref_rows <- lapply(editable_gids, function(gid) {
          gate <- rv$gates[[gid]]; current_val <- current_refs[[gid]] %||% "off"
          tags$div(class = "gate-ref-edit-row",
                   style = "margin: 2px 0; display: flex; align-items: center; gap: 6px;",
            tags$span(class = "gate-color-swatch",
                      style = paste0("background:", gate$color,
                                     "; width:10px; height:10px; border-radius:2px; flex-shrink:0;")),
            tags$span(gate$name, style = "font-size:12px; min-width: 80px;"),
            radioButtons(paste0("edit_ref_", gid), NULL,
                         choices = c("Off" = "off", "Include" = "include", "Exclude" = "exclude"),
                         selected = current_val, inline = TRUE))
        })
        gate_refs_ui <- tagList(
          tags$div(class = "pop-editor-row",
            tags$div(style = paste0("font-size:10px; color:#555; font-weight:700;",
                                    " text-transform:uppercase; letter-spacing:0.4px;",
                                    " margin-bottom:3px;"),
                     "\u270F\uFE0F Gates for this population"),
            ref_rows,
            actionButton("apply_gate_refs_btn", "Apply",
                         class = "btn-xs btn-primary", style = "margin-top: 5px;"))
        )
      } else {
        gate_refs_ui <- tagList(
          tags$div(class = "pop-editor-row",
            tags$div(style = paste0("font-size:10px; color:#555; font-weight:700;",
                                    " text-transform:uppercase; letter-spacing:0.4px;",
                                    " margin-bottom:3px;"),
                     "\u270F\uFE0F Gates for this population"),
            tags$em("All gates are inherited from parents.",
                    style = "font-size:11px; color:#aaa;"),
            actionButton("apply_gate_refs_btn", "Apply",
                         class = "btn-xs btn-primary", style = "margin-top: 5px; display:none;"))
        )
      }
    }
    tags$div(class = "pop-editor-panel", top_controls, count_ui,
             inherited_ui, gate_refs_ui)
  })

  observeEvent(input$confirm_rename_pop, {
    req(rv$active_population_id, rv$active_population_id != rv$root_population_id)
    new_name <- input$edit_pop_name
    if (!is.null(new_name) && nchar(trimws(new_name)) > 0) {
      save_undo_snapshot()
      rv$populations[[rv$active_population_id]]$name <- trimws(new_name)
      sort_population_tree_state()
      rv$gate_version <- rv$gate_version + 1L; autosave()
    }
  })

  observeEvent(input$change_pop_parent_btn, {
    req(rv$active_population_id, rv$active_population_id != rv$root_population_id)
    new_parent_id <- input$edit_pop_parent_select
    req(new_parent_id, !is.null(rv$populations[[new_parent_id]]))
    if (would_create_cycle(rv$populations, rv$active_population_id, new_parent_id)) {
      showNotification("Cannot move: would create a cycle in the population tree.",
                       type = "warning", duration = 4)
      return()
    }
    pop_id <- rv$active_population_id
    old_parent_id <- rv$populations[[pop_id]]$parent_id
    if (identical(old_parent_id, new_parent_id)) return()
    save_undo_snapshot()
    # Remove from old parent's children list
    if (!is.null(old_parent_id) && !is.null(rv$populations[[old_parent_id]])) {
      rv$populations[[old_parent_id]]$children <-
        setdiff(rv$populations[[old_parent_id]]$children, pop_id)
    }
    # Add to new parent
    rv$populations <- link_child_to_parent(rv$populations, pop_id, new_parent_id)
    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    autosave(); send_full_plot()
  })

  observeEvent(input$apply_gate_refs_btn, {
    req(rv$active_population_id, rv$active_population_id != rv$root_population_id)
    save_undo_snapshot()
    pop_id_edit <- rv$active_population_id

    # Compute which gate IDs are inherited so we don't overwrite them
    inherited_ids_edit <- character(0)
    walk_id_edit <- rv$populations[[pop_id_edit]]$parent_id
    while (!is.null(walk_id_edit) && !is.null(rv$populations[[walk_id_edit]])) {
      for (ref in rv$populations[[walk_id_edit]]$gate_refs)
        inherited_ids_edit <- c(inherited_ids_edit, ref$gate_id)
      walk_id_edit <- rv$populations[[walk_id_edit]]$parent_id
    }
    editable_gate_ids <- setdiff(names(rv$gates), unique(inherited_ids_edit))

    new_refs <- list()
    for (gid in editable_gate_ids) {
      val <- input[[paste0("edit_ref_", gid)]]
      if (!is.null(val) && val != "off")
        new_refs[[length(new_refs) + 1L]] <- new_gate_ref(gid, include = (val == "include"))
    }
    rv$populations[[rv$active_population_id]]$gate_refs <- new_refs
    rv$gate_version <- rv$gate_version + 1L; autosave(); send_full_plot()
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # PER-SUBSET STATISTICS
  # ══════════════════════════════════════════════════════════════════════════════

  output$subset_stats_ui <- renderUI({
    req(rv$overlay_factor, rv$overlay_selected, length(rv$gates) > 0)
    rv$gate_version
    pop_mask <- get_combined_pop_mask()
    gating_data <- get_gating_data()
    req(gating_data)
    stats <- compute_subset_gate_stats(rv$gates, gating_data, rv$overlay_factor,
                                       rv$overlay_selected, pop_mask)
    if (nrow(stats) == 0) return(NULL)
    header <- tags$tr(
      tags$th("Sample", style = "padding: 2px 6px; font-size: 11px;"),
      tags$th("Gate", style = "padding: 2px 6px; font-size: 11px;"),
      tags$th("Count", style = "padding: 2px 6px; font-size: 11px; text-align:right;"),
      tags$th("%", style = "padding: 2px 6px; font-size: 11px; text-align:right;"))
    body_rows <- lapply(seq_len(nrow(stats)), function(i) {
      r <- stats[i, ]; gate <- rv$gates[[r$gate_id]]
      color <- if (!is.null(gate)) gate$color else "#999"
      tags$tr(
        tags$td(r$subset, style = "padding: 2px 6px; font-size: 11px;"),
        tags$td(tags$span(style = paste0("color:", color, "; font-weight:600;"), r$gate),
                style = "padding: 2px 6px; font-size: 11px;"),
        tags$td(format(r$count, big.mark = ","), style = "padding: 2px 6px; font-size: 11px; text-align:right;"),
        tags$td(paste0(r$pct, "%"), style = "padding: 2px 6px; font-size: 11px; text-align:right;"))
    })
    tagList(
      tags$div(class = "section-header", style = "margin-top: 10px;", "Per-Sample Gate Statistics"),
      tags$div(style = "max-height: 300px; overflow-y: auto; border: 1px solid #ddd;
                       border-radius: 4px; background: #fafafa; margin-bottom: 10px;",
        tags$table(style = "width: 100%; border-collapse: collapse;",
                   tags$thead(header), tags$tbody(body_rows))))
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # GATING STRATEGY TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Update strategy population dropdown whenever populations change
  observe({
    rv$populations; rv$root_population_id; rv$gate_version
    pops_with_gates <- list()
    for (pid in names(rv$populations)) {
      pop <- rv$populations[[pid]]
      if (pid != rv$root_population_id && length(pop$gate_refs) > 0)
        pops_with_gates[[pop$name]] <- pid
    }
    if (length(pops_with_gates) > 0) {
      updateSelectInput(session, "strategy_pop", choices = pops_with_gates)
    } else {
      updateSelectInput(session, "strategy_pop", choices = c("(no populations with gates)" = ""))
    }
  })

  # Render strategy when population/settings change
  observeEvent(list(input$strategy_pop, input$strategy_display,
                    input$strategy_max_events, input$strategy_plot_size,
                    input$strategy_full_path, rv$sample_mask), {
    pop_id <- input$strategy_pop
    assay_for_strategy <- get_filtered_assay_data()
    req(pop_id, nchar(pop_id) > 0, assay_for_strategy)

    if (nrow(assay_for_strategy) == 0) {
      session$sendCustomMessage("renderStrategyGrid", list(
        containerId = "strategy-grid-container",
        steps = list()
      ))
      return()
    }

    # Use display-space gate vertices so they match assay_data (display coords)
    display_gates <- get_plot_gates()
    steps <- compute_gating_strategy(
      display_gates, rv$populations, rv$root_population_id,
      assay_for_strategy, pop_id,
      full_path = input$strategy_full_path %||% FALSE,
      max_events = input$strategy_max_events %||% 10000L
    )

    if (length(steps) == 0) {
      session$sendCustomMessage("renderStrategyGrid", list(
        containerId = "strategy-grid-container",
        steps = list()
      ))
      return()
    }

    # Convert R lists to JSON-friendly format
    steps_json <- lapply(steps, function(s) {
      list(
        gate_id = s$gate_id,
        gate_name = s$gate_name,
        x_channel = s$x_channel,
        y_channel = s$y_channel,
        vertices = s$vertices,
        gate_type = s$gate_type,
        color = s$color,
        label_offset = s$label_offset,
        include = s$include,
        x = as.list(s$x),
        y = as.list(s$y),
        x_range = s$x_range,
        y_range = s$y_range,
        n_before = s$n_before,
        n_after = s$n_after,
        pct_pass = s$pct_pass
      )
    })

    session$sendCustomMessage("renderStrategyGrid", list(
      containerId = "strategy-grid-container",
      steps = steps_json,
      plot_size = input$strategy_plot_size %||% 200,
      display_mode = input$strategy_display %||% "pseudocolor",
      font_sizes = list(axis_label = 10, tick = 8, gate_label = 8, title = 10)
    ))
  }, ignoreInit = TRUE)

  observeEvent(input$strategy_export_png, {
    session$sendCustomMessage("exportMiniPlotPNG", list(
      gridId = "strategy-grid-container-grid",
      filename = "gating_strategy"
    ))
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # ILLUSTRATION TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Dynamic checkboxes for X channels
  output$illust_x_channels_ui <- renderUI({
    req(rv$channels)
    checkboxGroupInput("illust_x_channels", NULL,
                       choices = rv$channels,
                       selected = rv$channels[1:min(3, length(rv$channels))],
                       inline = TRUE)
  })

  # Dynamic checkboxes for populations
  output$illust_populations_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$gate_version
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) return(NULL)
    pop_choices <- setNames(names(rv$populations),
                            vapply(rv$populations, function(p) p$name, character(1)))
    checkboxGroupInput("illust_populations", NULL,
                       choices = pop_choices,
                       selected = rv$active_population_id %||% rv$root_population_id,
                       inline = FALSE)
  })

  render_illustration_tab <- function() {
    assay_for_illustration <- get_filtered_assay_data()
    req(assay_for_illustration)

    if (nrow(assay_for_illustration) == 0) {
      session$sendCustomMessage("renderIllustrationGrid", list(
        containerId = "illustration-grid-container",
        plots = list(),
        gate_overlays = list(),
        pop_ids = list(),
        pop_names = list(),
        pop_counts = list(),
        x_channels = list(),
        y_channel = NULL,
        plot_size = input$illust_plot_size %||% 200,
        display_mode = input$illust_display %||% "pseudocolor",
        font_sizes = list(axis_label = 10, tick = 8, gate_label = 8, title = 10)
      ))
      return()
    }

    pop_ids <- input$illust_populations
    x_channels <- input$illust_x_channels
    y_channel <- if (input$illust_plot_type == "biplot") input$illust_y_channel else NULL

    req(length(pop_ids) > 0, length(x_channels) > 0)

    # Use display-space gate vertices so they match assay_data (display coords)
    display_gates <- get_plot_gates()
    batch <- compute_illustration_batch(
      assay_for_illustration, display_gates, rv$gate_order,
      rv$populations, rv$root_population_id,
      pop_ids, x_channels, y_channel,
      plot_type = input$illust_plot_type,
      max_events = input$illust_max_events %||% 10000L
    )

    # Convert plot data to JSON-friendly lists
    plots_json <- list()
    gate_overlays_json <- list()
    for (key in names(batch$plots)) {
      pd <- batch$plots[[key]]
      plots_json[[key]] <- list(
        x = as.list(pd$x),
        y = if (!is.null(pd$y)) as.list(pd$y) else list(),
        x_range = pd$x_range,
        y_range = pd$y_range,
        n_events = pd$n_events,
        x_label = pd$x_label,
        y_label = pd$y_label
      )

      # Build gate overlays for this channel pair
      parts <- strsplit(key, "\\|")[[1]]
      pop_id <- parts[1]; x_ch <- parts[2]
      if (!is.null(y_channel) && input$illust_plot_type == "biplot") {
        pop_gc <- batch$gate_counts[[pop_id]] %||% list()
        gate_ovl <- build_gates_for_channels(display_gates, rv$gate_order, pop_gc, x_ch, y_channel)
        gate_overlays_json[[key]] <- gate_ovl
      }
    }

    pop_names <- list()
    pop_counts <- list()
    for (pid in pop_ids) {
      pop <- batch$populations[[pid]] %||% rv$populations[[pid]]
      pop_names[[pid]] <- if (!is.null(pop)) pop$name else "Unknown"
      pop_counts[[pid]] <- if (!is.null(pop) && !is.null(pop$event_count)) pop$event_count else 0L
    }

    session$sendCustomMessage("renderIllustrationGrid", list(
      containerId = "illustration-grid-container",
      plots = plots_json,
      gate_overlays = gate_overlays_json,
      pop_ids = as.list(pop_ids),
      pop_names = pop_names,
      pop_counts = pop_counts,
      x_channels = as.list(x_channels),
      y_channel = y_channel,
      plot_size = input$illust_plot_size %||% 200,
      display_mode = input$illust_display %||% "pseudocolor",
      font_sizes = list(axis_label = 10, tick = 8, gate_label = 8, title = 10)
    ))
  }

  # Render illustration on button click
  observeEvent(input$illust_render_btn, {
    render_illustration_tab()
  })

  # Keep illustration synchronized with sample filtering/settings after first render.
  observeEvent(list(rv$sample_mask,
                    input$illust_plot_type,
                    input$illust_y_channel,
                    input$illust_x_channels,
                    input$illust_populations,
                    input$illust_max_events,
                    input$illust_display,
                    input$illust_plot_size), {
    req(!is.null(input$illust_render_btn), input$illust_render_btn > 0)
    render_illustration_tab()
  })

  observeEvent(input$illust_export_png, {
    session$sendCustomMessage("exportMiniPlotPNG", list(
      gridId = "illustration-grid-container-grid",
      filename = "illustration"
    ))
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # WORKSPACE SAVE / LOAD / EXPORT
  # ══════════════════════════════════════════════════════════════════════════════

  observeEvent(input$save_workspace_btn, {
    req(rv$sce, rv$sce_name); autosave()
    showNotification(paste("Workspace saved to", rv$sce_name, "metadata"), type = "message", duration = 3)
    output$status_text <- renderText(paste("Saved workspace at", format(Sys.time(), "%H:%M:%S")))
  })

  observeEvent(input$load_workspace_btn, {
    req(rv$sce)
    sce_names <- find_sce_objects()
    sce_with_ws <- character(0)
    for (nm in sce_names) {
      tryCatch({
        obj <- get(nm, envir = .GlobalEnv)
        if (has_workspace(obj)) sce_with_ws <- c(sce_with_ws, nm)
      }, error = function(e) NULL)
    }
    if (length(sce_with_ws) == 0) {
      showNotification("No SCE objects with saved workspaces found.", type = "warning", duration = 3)
      return()
    }
    showModal(modalDialog(
      title = "Load Workspace",
      selectInput("load_ws_source", "Load workspace from:", choices = sce_with_ws),
      tags$p("This will replace the current gates and populations.", style = "color: #c00; font-size: 12px;"),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_load_ws", "Load", class = "btn-primary"))
    ))
  })

  observeEvent(input$confirm_load_ws, {
    removeModal(); source_name <- input$load_ws_source; req(source_name)
    source_sce <- tryCatch(get(source_name, envir = .GlobalEnv), error = function(e) NULL)
    if (is.null(source_sce)) { showNotification("Could not find SCE object", type = "error"); return() }
    ws <- load_workspace(source_sce)
    if (is.null(ws)) { showNotification("No workspace found in that SCE", type = "error"); return() }
    invalid <- validate_workspace_channels(ws, rv$channels)
    if (length(invalid) > 0) {
      showNotification(paste("Warning:", length(invalid), "gate(s) skipped"), type = "warning", duration = 5)
      for (gid in invalid) ws$gates[[gid]] <- NULL
      ws$gate_order <- setdiff(ws$gate_order, invalid)
    }
    ws <- normalize_workspace_gate_space(ws)
    save_undo_snapshot()
    rv$gates <- ws$gates; rv$gate_order <- ws$gate_order %||% names(ws$gates)
    rv$populations <- ws$populations; rv$root_population_id <- ws$root_population_id
    sort_population_tree_state()
    rv$active_population_id <- ws$root_population_id; rv$selected_gate_id <- NULL
    rv$gate_version <- rv$gate_version + 1L
    autosave(); send_full_plot()
    showNotification(paste("Loaded workspace from", source_name), type = "message", duration = 3)
  })

  observeEvent(input$export_pop_btn, {
    req(rv$sce, rv$active_population_id)
    pop_id <- rv$active_population_id
    pop <- rv$populations[[pop_id]]; req(pop)
    if (pop_id == rv$root_population_id) {
      showNotification("Cannot export root population (all events).", type = "warning", duration = 3)
      return()
    }
    tryCatch({
      rv$sce <- export_population_to_coldata(rv$sce, pop_id, pop$name,
                                              rv$gates, rv$populations, rv$root_population_id,
                                              rv$assay_name)
      assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
      cd_names <- get_coldata_names(rv$sce); rv$coldata_names <- cd_names
      updateSelectInput(session, "overlay_coldata", choices = c("(none)" = "", cd_names))
      showNotification(paste("Exported '", pop$name, "' to colData of", rv$sce_name),
                       type = "message", duration = 3)
    }, error = function(e) {
      showNotification(paste("Export error:", e$message), type = "error", duration = 5)
    })
  })

  # ── Save SCE + workspace to RDS ─────────────────────────────────────────────
  output$save_rds_dl <- downloadHandler(
    filename = function() {
      nm <- rv$sce_name %||% "workspace"
      paste0(nm, "_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".rds")
    },
    content = function(file) {
      req(rv$sce)
      autosave()             # embed current workspace into SCE metadata first
      saveRDS(rv$sce, file)
    }
  )

  # ── Load SCE from RDS ────────────────────────────────────────────────────────
  observeEvent(input$load_rds_upload, {
    req(input$load_rds_upload)
    f <- input$load_rds_upload
    tryCatch({
      showNotification("Loading RDS…", type = "message", duration = 2)
      sce <- readRDS(f$datapath)
      if (!methods::is(sce, "SingleCellExperiment")) {
        showNotification("File does not contain a SingleCellExperiment object.",
                         type = "error", duration = 6)
        return()
      }
      # Derive a clean R variable name from the filename
      sce_name <- tools::file_path_sans_ext(f$name)
      sce_name <- gsub("[^A-Za-z0-9_]", "_", sce_name)
      sce_name <- sub("^([0-9])", "sce_\\1", sce_name)
      if (nchar(sce_name) == 0) sce_name <- "sce_loaded"
      assign(sce_name, sce, envir = .GlobalEnv)
      sce_names <- find_sce_objects()
      updateSelectInput(session, "sce_select", choices = sce_names, selected = sce_name)
      showNotification(paste("Loaded RDS as", sce_name), type = "message", duration = 4)
    }, error = function(e) {
      showNotification(paste("RDS load error:", e$message), type = "error", duration = 8)
    })
  })

  observeEvent(input$import_gatingml_upload, {
    req(rv$sce, rv$channels)
    f <- input$import_gatingml_upload
    req(f$datapath)

    tryCatch({
      native_pnn_map <- S4Vectors::metadata(rv$sce)$pnn_to_channel
      has_native_pnn_map <- is.list(native_pnn_map) && length(native_pnn_map) > 0
      pnn_map <- build_gatingml_channel_map(rv$sce, rv$channels)
      parsed <- tryCatch(
        import_gatingml_from_cytobank(
          file_path = f$datapath,
          session_channels = rv$channels,
          pnn_to_channel = pnn_map
        ),
        error = function(e) {
          msg <- conditionMessage(e)
          is_xml2_corrupt <- grepl(
            "lazy-load database.*xml2|xml2\\.rdb.*corrupt|internal error -3 in R_decompress1",
            msg,
            ignore.case = TRUE
          )
          if (!is_xml2_corrupt) stop(e)

          showNotification(
            "xml2 appears corrupted in this app session; retrying GatingML import in a clean R subprocess...",
            type = "warning", duration = 5
          )

          import_gatingml_via_subprocess(
            file_path = f$datapath,
            session_channels = rv$channels,
            pnn_to_channel = pnn_map
          )
        }
      )

      parsed <- clamp_imported_time_rectangles(parsed, get_gating_data())

      if (length(parsed$gates) == 0) {
        showNotification("No compatible gates found in Gating-ML for current channels.",
                         type = "warning", duration = 5)
        return()
      }

      rv$.pending_gatingml_import <- parsed
      showModal(modalDialog(
        title = "Import GatingML from Cytobank",
        tags$p(sprintf("Parsed %d gates and %d populations.",
                       parsed$n_gates_imported, parsed$n_pops_imported)),
        if (isTRUE(parsed$n_gates_skipped > 0)) {
          tags$p(sprintf("%d gate(s) were skipped because their channels are not present in this SCE.",
                         parsed$n_gates_skipped), style = "color:#b26a00;")
        },
        if (isTRUE(parsed$n_gates_skipped > 0) && !has_native_pnn_map) {
          tags$p(
            "This SCE does not contain a saved $PnN->display channel map. If many metal gates are skipped, re-importing FCS in this updated app will retain that map and improve Cytobank channel matching.",
            style = "color:#8a6d3b; font-size:12px;"
          )
        },
        tags$p("Importing will replace the current gates and populations.",
               style = "color:#c00; font-size:12px;"),
        footer = tagList(
          modalButton("Cancel"),
          actionButton("confirm_import_gatingml_btn", "Import", class = "btn-primary")
        ),
        easyClose = TRUE
      ))
    }, error = function(e) {
      showNotification(paste("GatingML import error:", e$message),
                       type = "error", duration = 8)
    })
  })

  observeEvent(input$confirm_import_gatingml_btn, {
    removeModal()
    parsed <- rv$.pending_gatingml_import
    rv$.pending_gatingml_import <- NULL
    req(parsed)

    save_undo_snapshot()
    rv$gates <- parsed$gates
    rv$gate_order <- parsed$gate_order %||% names(parsed$gates)
    rv$populations <- parsed$populations
    rv$root_population_id <- parsed$root_population_id
    sort_population_tree_state()

    rv$active_population_id <- rv$root_population_id
    rv$selected_gate_id <- NULL
    rv$gate_version <- rv$gate_version + 1L

    autosave()
    send_full_plot(reset_view = TRUE)

    msg <- paste0("Imported ", parsed$n_gates_imported, " gates and ",
                  parsed$n_pops_imported, " populations from GatingML")
    if (isTRUE(parsed$n_gates_skipped > 0)) {
      msg <- paste0(msg, " (", parsed$n_gates_skipped, " skipped)")
    }
    showNotification(msg, type = "message", duration = 5)
    output$status_text <- renderText(msg)
  })

  # ── Export FCS — modal then download ────────────────────────────────────────
  observeEvent(input$export_fcs_btn, {
    req(rv$sce)
    pop_choices <- setNames(
      names(rv$populations),
      vapply(rv$populations, function(p) p$name, character(1))
    )
    available_assays <- SummarizedExperiment::assayNames(rv$sce)
    assay_choices <- setNames(
      available_assays,
      ifelse(available_assays == "exprs",   "Transformed – arcsinh (exprs)",
      ifelse(available_assays == "counts",  "Untransformed – raw (counts)",
                                             available_assays))
    )
    showModal(modalDialog(
      title = "Export FCS Files",
      selectInput("fcs_export_pop_id", "Population to export:",
                  choices  = pop_choices,
                  selected = rv$active_population_id %||% rv$root_population_id),
      radioButtons("fcs_export_assay", "Data to include:",
                   choices  = assay_choices,
                   selected = if ("exprs" %in% available_assays) "exprs" else available_assays[1]),
      radioButtons("fcs_export_split", "Output format:",
                   choices  = c("One FCS file per sample" = "per_sample",
                                "Single combined FCS file" = "combined"),
                   selected = "per_sample"),
      tags$p(tags$em("Gates are always evaluated in transformed (exprs) space.",
                     style = "color:#888; font-size:11px;")),
      footer = tagList(
        modalButton("Cancel"),
        downloadButton("do_export_fcs_dl", "Download FCS", class = "btn-primary")
      )
    ))
  })

  output$do_export_fcs_dl <- downloadHandler(
    filename = function() {
      pop_id   <- isolate(input$fcs_export_pop_id) %||% rv$root_population_id
      pop      <- rv$populations[[pop_id]]
      pop_name <- if (!is.null(pop)) gsub("[^A-Za-z0-9_]", "_", pop$name) else "population"
      paste0(pop_name, "_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".zip")
    },
    content = function(file) {
      req(rv$sce)
      pop_id     <- isolate(input$fcs_export_pop_id) %||% rv$root_population_id
      assay_nm   <- isolate(input$fcs_export_assay)  %||% "exprs"
      split_by   <- (isolate(input$fcs_export_split) %||% "per_sample") == "per_sample"

      tmp_dir <- tempfile("fcs_export_")
      dir.create(tmp_dir)
      on.exit(unlink(tmp_dir, recursive = TRUE), add = TRUE)

      written <- export_population_as_fcs(
        sce              = rv$sce,
        population_id    = pop_id,
        populations      = rv$populations,
        gates            = rv$gates,
        root_population_id = rv$root_population_id,
        assay_name       = assay_nm,
        split_by_sample  = split_by,
        output_dir       = tmp_dir
      )

      if (length(written) == 0) stop("No events found in selected population/samples.")

      # Zip all files, stripping directory paths
      owd <- setwd(tmp_dir)
      on.exit(setwd(owd), add = TRUE)
      utils::zip(file, files = basename(written), flags = "-9")
    }
  )

  output$status_text <- renderText("Select an SCE object to begin")
}

# ── Add custom JS handler for runjs ───────────────────────────────────────────
ui_with_runjs <- tagList(
  ui,
  tags$script(HTML("
    Shiny.addCustomMessageHandler('runjs', function(code) {
      eval(code);
    });

    $(document).ready(function() {
      var tips = {
        // Left column
        'save_workspace_btn': 'Save current gates & populations to SCE metadata (in memory)',
        'load_workspace_btn': 'Load a workspace from another SCE object currently in memory',
        'apply_instrument_mode_btn': 'Apply selected instrument mode to the loaded SCE (recomputes exprs from counts when available)',
        'export_pop_btn':     'Export the active population as a colData column on the SCE',
        'refresh_sce_btn':    'Re-scan the global environment for SCE objects',
        'save_rds_dl':        'Download the SCE with embedded workspace as an .rds file',
        'export_fcs_btn':     'Export gated population(s) as FCS files (zipped download)',
        'import_gatingml_upload': 'Import Cytobank Gating-ML XML and replace current gates/populations',
        // Mode toolbar
        'mode_navigate': 'Navigate mode — pan and zoom (no drawing)',
        'mode_rect':     'Draw a rectangle gate',
        'mode_poly':     'Draw a freehand polygon gate',
        'mode_cancel':   'Cancel the current drawing and return to navigate mode',
        'flip_axes':     'Swap the X and Y channels',
        'reset_view_btn':   'Reset zoom to the full data range',
        'refresh_plot_btn': 'Force a full re-render of the plot',
        'gating_max_events': 'Cap events rendered in the gating plot (0 = no downsampling)',
        // Right panel
        'rename_gate_btn':  'Rename the selected gate',
        'undo_btn':         'Undo the last gate or population change',
        'redo_btn':         'Redo the last undone change',
        'delete_gate_btn':  'Delete the selected gate',
        'add_pop_btn':      'Define a new population using gate references',
        'edit_pop_btn':     'Open the population editor for the selected population',
        'delete_pop_btn':   'Delete the selected population',
        // Strategy / Illustration
        'strategy_export_png': 'Export the gating strategy grid as a PNG',
        'illust_render_btn':   'Render the illustration mini-plot grid',
        'illust_export_png':   'Export the illustration grid as a PNG'
      };
      Object.entries(tips).forEach(function([id, tip]) {
        var el = $('#' + id);
        if (el.length) el.attr({ title: tip, 'data-toggle': 'tooltip', 'data-placement': 'top' });
      });
      $('[data-toggle=\"tooltip\"]').tooltip({ delay: { show: 500, hide: 100 } });
    });
  "))
)

shinyApp(ui = ui_with_runjs, server = server)
