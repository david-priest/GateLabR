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
library(png)
library(gridSVG)

if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b

source("R/data_utils.R")
source("R/models.R")
source("R/gate_engine.R")
source("R/workspace.R")
source("R/fcs_import.R")
source("R/gatingml_import.R")
source("R/gatingml_export.R")
source("R/fcs_export.R")
source("R/strategy_utils.R")
source("R/stats_utils.R")
source("R/pdf_export.R")

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
    tags$script(src = "cytof_plot.js?v=20260414e"),
    tags$script(src = "mini_plot.js?v=20260415b"),
    tags$link(rel = "stylesheet", href = "custom.css?v=20260414a")
  ),

  titlePanel("GateLabR"),

  fluidRow(
    # ═══════════════════════════════════════════════════════════════════════════
    # LEFT COLUMN: SCE/FCS + sample filter
    # ═══════════════════════════════════════════════════════════════════════════
    column(3,
      tags$div(class = "panel-section",

        # ── SCE + Assay on one row (plain CSS grid – avoids Bootstrap float issues) ──
        tags$div(style = "display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:4px;",
          tags$div(
            tags$label("SCE:", class = "control-label", style = "font-size:12px; margin-bottom:2px;"),
            selectInput("sce_select", NULL, choices = NULL, width = "100%")
          ),
          tags$div(
            tags$label("Assay:", class = "control-label", style = "font-size:12px; margin-bottom:2px;"),
            selectInput("assay_select", NULL, choices = NULL, width = "100%")
          )
        ),
        tags$div(style = "display:flex; gap:6px; align-items:center; margin-bottom:6px;",
          actionButton("rename_sce_btn", "Rename Loaded SCE",
                       class = "btn-xs btn-default"),
          actionButton("refresh_sce_btn", "\u21ba Refresh SCEs",
                       class = "btn-xs btn-default",
                       title = "Re-scan global environment for SCE objects")
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
        ),

        # ── Workspace controls ──
        tags$div(class = "workspace-panel",
          tags$div(class = "section-header", "Workspace"),

          # ── In-memory ops ──
          tags$div(class = "workspace-block",
            tags$div(class = "workspace-block-title", "SCE workspace"),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr;gap:4px;",
              actionButton("save_workspace_btn","💾 Save WS",class="btn-sm btn-primary",style="width:100%"),
              actionButton("load_workspace_btn","📂 Load WS",class="btn-sm btn-default",style="width:100%"),
              actionButton("export_pop_btn","→ colData",class="btn-sm btn-info",style="width:100%")
            )
          ),

          # ── File persistence ──
          tags$div(class = "workspace-block",style="margin-top:6px;",
            tags$div(class = "workspace-block-title", "File"),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px;",
              downloadButton("save_rds_dl","⬇ Save RDS",class="btn-sm btn-success",style="width:100%;padding:5px 8px;"),
              actionButton("export_fcs_btn","⬆ Export FCS",class="btn-sm btn-warning",style="width:100%")
            ),
            fileInput("load_rds_upload",NULL,accept=c(".rds",".RDS"),
                      buttonLabel="Load RDS...",placeholder="No file selected",multiple=FALSE)
          ),

          # ── GatingML ──
          tags$div(class="workspace-block",style="margin-top:6px;",
            tags$div(class="workspace-block-title","GatingML"),
            fileInput("import_gatingml_upload",NULL,
                      accept=c(".xml",".gatingml",".Gating-ML"),
                      buttonLabel="Import GatingML...",placeholder="No file selected",multiple=FALSE),
            downloadButton("export_gatingml_dl","Export GatingML...",
                           class="btn-default btn-block",style="margin-bottom:4px;text-align:left;")
          ),

          tags$div(class="status-bar", textOutput("status_text",inline=TRUE)),
          tags$hr(style="margin:8px 0;"),
          actionButton("close_app_btn","⏻ Close App",class="btn-sm btn-danger btn-block",icon=icon("power-off"))
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
              tags$span("Gating:", style="font-size:11px;color:#555;font-weight:600;margin-right:2px;"),
              actionButton("mode_rect",
                HTML('<svg width="14" height="10" viewBox="0 0 14 10"><rect x="1" y="1" width="12" height="8" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> Rect'),
                class = "btn-sm btn-default", title = "Draw rectangle gate",
                onclick = "window.CytofD3 && window.CytofD3.setMode('draw-rect')"),
              actionButton("mode_poly",
                HTML('<svg width="14" height="14" viewBox="0 0 14 14"><polygon points="7,1 13,5 11,12 3,12 1,5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg> Poly'),
                class = "btn-sm btn-default", title = "Draw polygon gate",
                onclick = "window.CytofD3 && window.CytofD3.setMode('draw-poly')"),
              actionButton("mode_cancel", "✕ Cancel", class = "btn-sm btn-warning",
                           onclick = "window.CytofD3 && window.CytofD3.setMode('navigate')")
            ),
            tags$div(style = "display:flex; gap:4px; margin-left: auto;",
              actionButton("flip_axes", "", icon = icon("arrows-h"),
                           class = "btn-xs btn-default"),
              actionButton("refresh_plot_btn", "Refresh", class = "btn-xs btn-default")
            )
          ),
          tags$div(id = "cytof-plot-container",
                   style = "width: 100%;"),

          # Current-channel scale controls (min/max + logicle)
          uiOutput("flow_transform_controls_ui"),

          # Hidden X/Y selects: axis-label clicks update these; UI is on the plot
          tags$div(style = "display:none;",
            selectInput("x_channel", NULL, choices = NULL),
            selectInput("y_channel", NULL, choices = NULL)
          ),

          tags$div(class = "below-plot-controls",

            # ── Gating controls panel (Strategy-style card) ─────────────────
            tags$div(class = "strategy-controls",

              # Top row: display mode + opacity (like strategy-top-actions)
              tags$div(class = "strategy-top-actions",
                tags$div(style = "display:flex; align-items:center; gap:10px; flex-wrap:wrap;",
                  radioButtons("display_mode", NULL,
                               choices = c("Scatter"="scatter","Pseudo"="pseudocolor","Contour"="contour"),
                               selected = "pseudocolor", inline = TRUE),
                  tags$div(style = "display:flex; align-items:center; gap:4px;",
                    tags$span("Opacity:", style = "font-size:11px; color:#555;"),
                    tags$div(class = "opacity-slider-wrap", style = "width:130px;",
                      sliderInput("point_alpha", NULL, min=0.05, max=1.0, value=0.35, step=0.05, width="100%")
                    )
                  ),
                  conditionalPanel("input.display_mode == 'contour'",
                    tags$div(style = "display:flex; align-items:center; gap:4px;",
                      tags$span("Outer:", style = "font-size:11px; color:#555;"),
                      selectInput("contour_threshold", NULL,
                                  choices = c("1%"=1,"2%"=2,"5%"=5,"10%"=10,"20%"=20,"30%"=30),
                                  selected = 5, width = "80px")
                    )
                  )
                )
              ),

              # Parameter grid: 2-column, strategy-block cards
              tags$div(class = "strategy-control-grid",

                # Card 1: Sampling
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title", "Sampling"),
                  numericInput("gating_max_events", "Max events (0 = all):",
                               value = 50000, min = 0, step = 5000),
                  selectInput("plot_data_scope", "Data scope:",
                              choices = c("Selected samples" = "subset", "All data" = "full"),
                              selected = "subset")
                ),

                # Card 2: Gate Counts
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title", "Gate Counts"),
                  tags$div(style = "display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:4px;",
                    selectInput("count_compute_mode", "Mode:",
                                choices = c("Fast (sampled)" = "subset", "Exact (full data)" = "full"),
                                selected = "subset", width = "150px"),
                    tags$div(style = "display:flex; align-items:center; gap:3px;",
                      tags$span("Cap:", style = "font-size:11px; color:#555;"),
                      numericInput("subset_count_events", NULL, value = 30000,
                                   min = 1000, step = 5000, width = "80px")
                    ),
                    actionButton("recompute_full_counts_btn", "Run Full", class = "btn-xs btn-default"),
                    tags$span("Fast: approx counts", style = "font-size:10px; color:#999;")
                  )
                )
              )
            ),

              # Color by marker / metadata
            tags$div(class = "section-header", style = "margin-top:6px;",
                     "Color by marker / metadata",
                     actionButton("clear_overlay_btn", "Clear", class = "btn-xs btn-default")),
            selectInput("overlay_coldata", NULL, choices = c("(none)" = ""), selected = ""),
            uiOutput("overlay_checkboxes_ui")
          ),
          uiOutput("subset_stats_ui")
        ),

        # ── Tab 2: Gating Strategy ────────────────────────────────────────────
        tabPanel("Strategy",
          tags$div(class = "strategy-controls",
            tags$div(class = "strategy-top-actions",
              selectInput("strategy_mode", NULL,
                          choices = c("Single population" = "single",
                                      "Multiple populations" = "multi"),
                          selected = "single", width = "200px"),
              actionButton("strategy_render_btn", "Render",
                           class = "btn-sm btn-primary"),
              tags$div(class = "strategy-top-export-actions",
                actionButton("strategy_export_png", "PNG",
                             class = "btn-sm btn-default", icon = icon("download")),
                downloadButton("strategy_export_pdf_dl", "SVG",
                               class = "btn-sm btn-default")
              )
            ),

            conditionalPanel("input.strategy_mode === 'single'",
              tags$div(class = "strategy-control-grid",
                tags$div(class = "strategy-block strategy-pop-block",
                  selectInput("strategy_pop", "Population:", choices = NULL),
                  checkboxInput("strategy_full_path", "Use full path from root", FALSE)
                ),
                tags$div(class = "strategy-block",
                  checkboxGroupInput("strategy_gate_view", "Gate view:",
                                     choices = c("Forward gated" = "forward",
                                                 "Back-gated" = "back"),
                                     selected = "forward", inline = TRUE)
                )
              )
            ),

            conditionalPanel("input.strategy_mode === 'multi'",
              tags$div(class = "strategy-multi-hint-row",
                style = "font-size:11px; color:#555; padding:4px 2px 2px 2px; display:flex; align-items:center; gap:6px;",
                icon("info-circle"),
                tags$span("Select populations to trace their full gating hierarchy. Shared parent gates are shown once."),
                tags$span(style = "margin-left:6px; font-weight:600; color:#3182ce;",
                          textOutput("strategy_multi_pop_hint", inline = TRUE))
              ),
              selectizeInput("strategy_multi_pop_select", NULL,
                choices = NULL, multiple = TRUE,
                options = list(placeholder = "Select populations...", plugins = list("remove_button")),
                width = "100%")
            ),

            tags$div(class = "strategy-control-grid",
              tags$div(class = "strategy-block",
                radioButtons("strategy_display", "Display mode:",
                             choices = c("Scatter" = "scatter",
                                         "Pseudo" = "pseudocolor",
                                         "Contour" = "contour"),
                             selected = "pseudocolor", inline = TRUE)
              )
            ),

            tags$div(class = "strategy-params-grid",
              style = "display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;",
              tags$div(class = "strategy-param-card",
                numericInput("strategy_max_events", "Max events / panel (0 = all):",
                             value = 10000, min = 0, max = 100000, step = 1000),
                checkboxInput("strategy_all_events", "Plot all events", value = FALSE)
              ),
              tags$div(class = "strategy-param-card",
                numericInput("strategy_plot_size", "Plot size (px):",
                             value = 200, min = 150, max = 500, step = 25),
                conditionalPanel("input.strategy_mode === 'single'",
                  numericInput("strategy_n_columns", "Columns:",
                               value = 4, min = 1, max = 12, step = 1),
                  checkboxInput("strategy_fit_to_columns", "Fit panels to columns", value = TRUE)
                )
              ),
              tags$div(class = "strategy-param-card strategy-font-card",
                tags$div(class = "strategy-font-grid",
                  style = "display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px 8px;",
                  numericInput("strategy_tick_font_size", "Tick labels (px):",
                               value = 8, min = 6, max = 24, step = 1),
                  numericInput("strategy_axis_label_font_size", "Axis labels (px):",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("strategy_title_font_size", "Titles (px):",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("strategy_gate_label_font_size", "Gate labels (px):",
                               value = 8, min = 6, max = 24, step = 1)
                )
              ),
              tags$div(class = "strategy-param-card",
                numericInput("strategy_pdf_dpi", "SVG raster DPI:",
                             value = 300, min = 72, max = 1200, step = 50),
                numericInput("strategy_point_size", "Point size (px):",
                             value = 1.2, min = 0.1, max = 5, step = 0.1),
                sliderInput("strategy_point_alpha", "Point opacity:",
                            min = 0.05, max = 1.0, value = 0.35, step = 0.05, width = "100%")
              ),
              tags$div(class = "strategy-param-card",
                checkboxInput("strategy_pub_style",
                              "Publication style (black gates, no label background)",
                              value = FALSE),
                numericInput("strategy_gate_line_width", "Gate line width:",
                             value = 1.5, min = 0.5, max = 5, step = 0.25)
              )
            ),

            conditionalPanel(
              "input.strategy_display == 'contour'",
              tags$div(class = "strategy-contour-controls",
                tags$span("Outer:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                selectInput("strategy_contour_threshold", NULL,
                            choices = c("1%" = 1, "2%" = 2, "5%" = 5,
                                        "10%" = 10, "20%" = 20, "30%" = 30),
                            selected = 5, width = "90px"),
                tags$span("Contour smoothing:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                tags$div(style = "width:220px;",
                  sliderInput("strategy_kde_bandwidth", NULL,
                              min = 0, max = 14, value = 0, step = 0.2, width = "100%")
                ),
                tags$span("0 = auto", style = "font-size:10px; color:#888; white-space:nowrap;")
              )
            ),

            tags$div(style = "font-size:11px; color:#666; margin:4px 0 6px 2px;",
                     textOutput("strategy_sample_contrib", inline = TRUE))
          ),
          tags$div(id = "strategy-grid-container", class = "mini-plot-grid-container")
        ),

        # ── Tab 3: Illustration ───────────────────────────────────────────────
        tabPanel("Illustration",
          tags$div(class = "illustration-controls",
            tags$div(class = "illust-top-actions",
              actionButton("illust_render_btn", "Render Illustration",
                           class = "btn-sm btn-primary"),
              tags$div(class = "illust-top-export-actions",
                actionButton("illust_export_png", "PNG",
                             class = "btn-sm btn-default", icon = icon("download")),
                downloadButton("illust_export_pdf_dl", "SVG",
                               class = "btn-sm btn-default")
              )
            ),

            tags$div(class = "illust-control-grid",
              tags$div(class = "illust-block",
                radioButtons("illust_plot_type", "Plot type:",
                             choices = c("Biplot" = "biplot", "Histogram" = "histogram"),
                             selected = "biplot", inline = TRUE),
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  selectInput("illust_y_channel", "Y channel:", choices = NULL)
                )
              ),
              tags$div(class = "illust-block",
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  radioButtons("illust_display", "Display mode:",
                               choices = c("Scatter" = "scatter",
                                           "Pseudo" = "pseudocolor",
                                           "Contour" = "contour"),
                               selected = "pseudocolor", inline = TRUE)
                ),
                checkboxInput("illust_color_by_pop", "Color each population differently",
                              value = FALSE),
                checkboxInput("illust_overlay_pops",
                              "Overlay all populations per channel (one panel per channel)",
                              value = FALSE)
              ),
              tags$div(class = "illust-block",
                tags$div(style = "font-size:11px; color:#555; margin-top:2px;",
                  "Global channel scales from the Scales tab are always used."
                )
              )
            ),

            tags$div(class = "illust-params-grid",
              tags$div(class = "illust-param-card",
                numericInput("illust_max_events", "Max events / panel (0 = all):",
                             value = 10000, min = 0, max = 50000, step = 1000),
                checkboxInput("illust_all_events", "Plot all events", value = FALSE)
              ),
              tags$div(class = "illust-param-card",
                numericInput("illust_plot_size", "Plot size (px):",
                             value = 200, min = 150, max = 400, step = 25),
                numericInput("illust_n_columns", "Columns:",
                             value = 4, min = 1, max = 12, step = 1),
                checkboxInput("illust_fit_to_columns", "Fit panels to columns", value = TRUE)
              ),
              tags$div(class = "illust-param-card illust-font-card",
                tags$div(class = "illust-font-grid",
                  numericInput("illust_tick_font_size", "Tick labels (px):",
                               value = 8, min = 6, max = 24, step = 1),
                  numericInput("illust_axis_label_font_size", "Axis labels (px):",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("illust_title_font_size", "Titles (px):",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("illust_gate_label_font_size", "Gate labels (px):",
                               value = 8, min = 6, max = 24, step = 1)
                )
              ),
              tags$div(class = "illust-param-card",
                numericInput("illust_pdf_dpi", "SVG raster DPI:",
                             value = 300, min = 72, max = 1200, step = 50),
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  numericInput("illust_point_size", "Point size (px):",
                               value = 1.2, min = 0.1, max = 5, step = 0.1),
                  sliderInput("illust_point_alpha", "Point opacity:",
                              min = 0.05, max = 1.0, value = 0.35, step = 0.05, width = "100%")
                ),
                conditionalPanel(
                  "input.illust_plot_type == 'histogram'",
                  numericInput("illust_hist_line_width", "Histogram line width:",
                               value = 1.8, min = 0.5, max = 6, step = 0.1),
                  checkboxInput("illust_hist_fill", "Fill histogram area", value = FALSE),
                  sliderInput("illust_hist_fill_alpha", "Histogram fill opacity:",
                              min = 0, max = 1.0, value = 0.22, step = 0.05, width = "100%"),
                  selectInput("illust_hist_overlay_mode", "Overlay fill behavior:",
                              choices = c("Blend fills" = "blend",
                                          "Front histogram opaque" = "front_opaque"),
                              selected = "front_opaque")
                )
              ),
              conditionalPanel(
                "input.illust_plot_type == 'biplot'",
                tags$div(class = "illust-param-card",
                  checkboxInput("illust_pub_style",
                                "Publication style (black gates, no label background)",
                                value = FALSE),
                  numericInput("illust_gate_line_width", "Gate line width:",
                               value = 1.5, min = 0.5, max = 5, step = 0.25)
                )
              )
            ),

            conditionalPanel(
              "input.illust_plot_type == 'biplot' && input.illust_display == 'contour'",
              tags$div(class = "illust-contour-controls",
                tags$span("Contour smoothing:", style = "font-size:11px; color:#555; white-space:nowrap;"),
                tags$div(style = "width:220px;",
                  sliderInput("illust_kde_bandwidth", NULL,
                              min = 0, max = 14, value = 0, step = 0.2, width = "100%")
                ),
                tags$span("0 = auto", style = "font-size:10px; color:#888; white-space:nowrap;")
              )
            ),
            tags$div(style = "font-size:11px; color:#666; margin:4px 0 0 2px;",
                     "Max events applies to each population x channel panel."),
            tags$div(class = "section-header", "X Channels"),
            uiOutput("illust_x_channels_ui"),
            tags$div(class = "illust-channel-group",
              tags$div(class = "illust-channel-group-header",
                tags$span("Populations"),
                tags$span(class = "illust-channel-group-actions",
                  actionButton("illust_pops_select_all_btn", "All",
                               class = "btn-xs btn-default", style = "padding:1px 6px;"),
                  actionButton("illust_pops_clear_btn", "Clear",
                               class = "btn-xs btn-default", style = "padding:1px 6px;"),
                  actionButton(
                    "illust_toggle_pops_btn", "", icon = icon("chevron-down"),
                    class = "btn-xs btn-default", style = "padding:1px 6px;",
                    onclick = "(function(btn){var body=$('#illust_pops_body');if(!body.length)return;body.stop(true,true).slideToggle(120,function(){var open=body.is(':visible');var ic=$(btn).find('i.fa');ic.toggleClass('fa-chevron-down',open);ic.toggleClass('fa-chevron-right',!open);});})(this);"
                  )
                )
              ),
              tags$div(id = "illust_pops_body", class = "illust-channel-group-body",
                uiOutput("illust_populations_ui")
              )
            )
          ),
          tags$div(id = "illustration-grid-container", class = "mini-plot-grid-container")
        ),

        # ── Tab 4: Statistics ────────────────────────────────────────────────
        tabPanel("Statistics",
          tags$div(class = "stats-controls",
            tags$div(class = "stats-top-actions",
              actionButton("stats_compute_btn", "Compute Statistics",
                           class = "btn-sm btn-primary"),
              downloadButton("stats_export_csv", "Export CSV",
                             class = "btn-sm btn-default")
            ),

            tags$div(class = "stats-options-grid",
              tags$div(class = "stats-block",
                tags$div(class = "section-header", "Statistics"),
                checkboxGroupInput("stats_stat_types", NULL,
                  choices = c("Count" = "count",
                              "% of Parent" = "pct_parent",
                              "% of Total"  = "pct_total",
                              "Median MFI"  = "median",
                              "Mean MFI"    = "mean",
                              "Geometric Mean" = "geomean",
                              "Std Dev"     = "sd",
                              "CV%"         = "cv"),
                  selected = c("count", "pct_parent", "pct_total", "median"),
                  inline = FALSE)
              ),
              tags$div(class = "stats-block",
                tags$div(class = "section-header", "Value Space (MFI)"),
                radioButtons("stats_value_space", NULL,
                  choices = c("Raw (linear)" = "raw",
                              "Transformed (display)" = "transformed"),
                  selected = "raw", inline = FALSE),
                tags$div(style = "font-size:10px; color:#888; margin-top:4px;",
                  "Raw = untransformed fluorescence/mass values.",
                  tags$br(),
                  "Transformed = arcsinh (CyTOF) or logicle (flow).")
              )
            ),

            tags$div(class = "section-header", "Channels",
              tags$span(
                actionButton("stats_channels_all_btn",  "All",  class = "btn-xs btn-default"),
                actionButton("stats_channels_none_btn", "None", class = "btn-xs btn-default")
              )
            ),
            uiOutput("stats_channels_ui"),
            tags$div(class = "section-header", "Populations"),
            uiOutput("stats_populations_ui")
          ),
          tags$div(class = "stats-table-container",
            DT::dataTableOutput("stats_table")
          )
        ),

        # ── Tab 5: Scales ─────────────────────────────────────────────────────
        tabPanel("Scales",
          tags$div(class = "scales-controls",
            tags$div(class = "section-header", "Global Channel Scales"),
            tags$div(style = "font-size:11px; color:#666; margin-bottom:8px;",
              "Define per-channel axis ranges used across Gating, Strategy, and Illustration.",
              " These global scales keep axes uniform across all panels for figure export."
            ),
            uiOutput("scales_channels_ui")
          )
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
            actionButton("toggle_gate_list_btn", "", icon = icon("chevron-up"),
                         title = "Collapse gates list",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("sort_gates_alpha_btn", "", icon = icon("sort-alpha-asc"),
                         title = "Sort gates alphabetically",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
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
        tags$div(id = "gate_list_container", uiOutput("gate_list_ui")),

        # ── Population tree ──
        tags$div(class = "section-header",
          "Populations",
          tags$span(class = "population-header-actions",
            actionButton("add_pop_btn", "", icon = icon("plus"),
                         class = "btn-xs btn-success", style = "padding: 1px 5px;"),
            actionButton("edit_pop_btn", "", icon = icon("pencil"),
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("duplicate_selected_pops_btn", "", icon = icon("clone"),
                         title = "Duplicate selected populations",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("delete_selected_pops_btn", "", icon = icon("trash"),
                         title = "Delete selected populations",
                         class = "btn-xs btn-danger", style = "padding: 1px 5px;")
          )
        ),
        tags$div(id = "population_tree_container", uiOutput("population_tree_ui")),

        tags$div(class = "section-header", "Bulk Rename Populations"),
        tags$div(class = "fcs-inline-controls",
          tags$div(class = "fcs-inline-item",
            fileInput("bulk_pop_rename_upload", NULL,
                      accept = c(".csv", ".xlsx", ".xls"),
                      buttonLabel = "Choose .csv/.xlsx...",
                      placeholder = "No file selected",
                      multiple = FALSE)
          ),
          tags$div(class = "fcs-inline-action",
            actionButton("apply_bulk_pop_rename_btn", "Apply Bulk Rename",
                         class = "btn-sm btn-default"),
            downloadButton("bulk_rename_template_dl", "Download Template",
                           class = "btn-sm btn-default")
          )
        ),
        tags$div(style = "font-size:11px; color:#888; margin-top:4px;",
                 "Required columns: old_population, new_population")

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
    assay_version = 0L,
    current_plot_data = NULL, max_events = 50000L,
    undo_stack = list(), redo_stack = list(),
    overlay_factor = NULL, overlay_selected = NULL,
    sample_info = NULL, sample_mask = NULL, sample_filter_key = "all",
    .range_cache = list(),
    .gate_counts_cache_key = NULL, .gate_counts_cache = NULL,
    .population_tree_cache_key = NULL, .population_tree_cache = NULL,
    .illustration_cache_key = NULL, .illustration_cache_payload = NULL,
    .last_combined_pop_mask = NULL,
    .plot_range_override = NULL,
    strategy_axis_mode = "default",
    strategy_axis_override = NULL,
    illustration_axis_mode = "default",
    illustration_axis_override = NULL,
    .last_gate_edit_seq = list(),
    .plot_msg_seq = 0L,
    .gate_pop_name_manual = NULL,
    .pending_delete_gate_id = NULL,
    .pending_delete_pop_id = NULL,
    .pending_bulk_delete_pop_ids = character(0),
    .selected_pop_ids = character(0),
    .pending_gatingml_import = NULL,
    flow_logicle_w = list(),
    flow_logicle_w_auto = list(),
    flow_scatter_cofactor = list(),
    flow_raw_data = NULL,
    cytof_axis_range = list(),
    global_scale_ranges = list(),
    .scales_ui_version = 0L,
    .strategy_stale = FALSE,
    .illust_stale = FALSE,
    .flow_transform_version = 0L,
    illust_pop_palette = list(),
    illust_pop_selected = NULL,
    .illust_palette_ui_version = 0L
  )
    valid_global_scale_range <- function(channel) {
      gs <- rv$global_scale_ranges[[channel]]
      if (is.null(gs)) return(NULL)
      lo <- suppressWarnings(as.numeric(gs$lo %||% NA))
      hi <- suppressWarnings(as.numeric(gs$hi %||% NA))
      if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)
      c(lo, hi)
    }

    initialize_missing_global_scales <- function(channels = rv$channels) {
      if (is.null(rv$sce) || is.null(rv$assay_data) || length(channels %||% character(0)) == 0) return(FALSE)
      changed <- FALSE
      for (ch in channels) {
        if (!is.null(valid_global_scale_range(ch))) next
        vals <- tryCatch(get_filtered_channel_values(ch, for_plot = FALSE), error = function(e) numeric(0))
        rng <- if (sum(is.finite(vals)) >= 2) {
          compute_range_from_values(vals, channel = ch, span_scale = 1.2)
        } else if (!is_flow_session(rv$sce)) {
          get_cytof_axis_range(ch)
        } else {
          NULL
        }
        if (!is.null(rng) && length(rng) == 2 && all(is.finite(rng)) && rng[2] > rng[1]) {
          rv$global_scale_ranges[[ch]] <- list(lo = rng[1], hi = rng[2])
          changed <- TRUE
        }
      }
      if (changed) rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
      changed
    }

  # Mark Strategy and Illustration Render buttons as needing a refresh.
  # Called whenever the user explicitly changes any scale value.
  mark_renders_stale <- function() {
    rv$.strategy_stale <- TRUE
    rv$.illust_stale   <- TRUE
  }

  # Reactively toggle a CSS class on each Render button to signal staleness.
  observe({
    stale <- isTRUE(rv$.strategy_stale)
    runjs(if (stale)
      "document.getElementById('strategy_render_btn').classList.add('btn-scales-stale');"
    else
      "document.getElementById('strategy_render_btn').classList.remove('btn-scales-stale');")
  })
  observe({
    stale <- isTRUE(rv$.illust_stale)
    runjs(if (stale)
      "document.getElementById('illust_render_btn').classList.add('btn-scales-stale');"
    else
      "document.getElementById('illust_render_btn').classList.remove('btn-scales-stale');")
  })

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
    # Flush latest logicle W / scatter cofactor into SCE metadata before saving
    persist_flow_transform_state()
    gate_value_space <- if (!is.null(rv$sce) && is_flow_session(rv$sce) &&
                            rv$assay_name == "exprs" && !is.null(rv$flow_raw_data)) {
      "raw"
    } else {
      "display"
    }
    rv$sce <- save_workspace(
      rv$sce, rv$gates, rv$gate_order, rv$populations, rv$root_population_id,
      gate_value_space = gate_value_space,
      cytof_axis_range = rv$cytof_axis_range %||% list(),
      global_scale_ranges = rv$global_scale_ranges %||% list(),
      plot_range_override = rv$.plot_range_override,
      illust_pop_palette = rv$illust_pop_palette %||% list(),
      illust_pop_selected = rv$illust_pop_selected
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

  # Generate display-space ticks for a single channel/axis.
  # Dispatches: flow signal → logicle;  flow/cytof scatter → asinh(cofactor);
  # cytof signal → asinh(cofactor=5).  QC channels → NULL (linear default).
  # Returns list(ticks = ..., is_logicle = TRUE/FALSE) or NULL.
  generate_channel_ticks <- function(channel, axis_range) {
    if (is.null(rv$sce)) return(NULL)
    if (!identical(rv$assay_name, "exprs")) return(NULL)
    if (!nzchar(channel %||% "")) return(NULL)
    if (is.null(axis_range) || length(axis_range) != 2) return(NULL)
    if (.is_qc_channel(channel)) return(NULL)
    # Scatter channels (FSC/SSC) use regular log-style intervals in raw space.
    if (.is_scatter_channel(channel)) {
      cf <- suppressWarnings(as.numeric(rv$flow_scatter_cofactor[[channel]] %||% 150))
      if (!is.finite(cf) || cf <= 0) cf <- 150
      return(generate_scatter_ticks(axis_range, cofactor = cf))
    }

    if (is_flow_session(rv$sce)) {
      raw_mat <- rv$flow_raw_data
      raw_vals <- if (!is.null(raw_mat) && channel %in% colnames(raw_mat)) raw_mat[, channel] else NULL
      ticks <- generate_logicle_ticks(channel, axis_range, raw_vals, rv$flow_logicle_w)
      if (is.null(ticks)) return(NULL)
      return(ticks)
    }

    # CyTOF — metal channels use asinh(cofactor = 5)
    generate_asinh_ticks(axis_range, cofactor = 5)
  }

  get_cytof_axis_range <- function(channel) {
    stored <- rv$cytof_axis_range[[channel]]
    lo <- suppressWarnings(as.numeric(stored$lo %||% -0.5))
    hi <- suppressWarnings(as.numeric(stored$hi %||% 7.0))
    if (!is.finite(lo)) lo <- -0.5
    if (!is.finite(hi) || hi <= lo) hi <- 7.0
    c(lo, hi)
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
      rv$.gate_counts_cache_key <- NULL
      rv$.gate_counts_cache <- NULL
      rv$.population_tree_cache_key <- NULL
      rv$.population_tree_cache <- NULL
      rv$.last_combined_pop_mask <- NULL
    }

    rv$assay_version <- rv$assay_version + 1L
    rv$.range_cache <- list()
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
      paste0("arcsinh/", cofactor, " on metal + Gaussian channels")
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

  observeEvent(list(input$cytof_x_lo, input$cytof_x_hi,
                    input$cytof_y_lo, input$cytof_y_hi), {
    req(rv$sce, input$x_channel, input$y_channel)
    x_ch <- input$x_channel %||% ""
    y_ch <- input$y_channel %||% ""
    if (!nzchar(x_ch) || !nzchar(y_ch)) return()

    x_lo <- suppressWarnings(as.numeric(input$cytof_x_lo))
    x_hi <- suppressWarnings(as.numeric(input$cytof_x_hi))
    y_lo <- suppressWarnings(as.numeric(input$cytof_y_lo))
    y_hi <- suppressWarnings(as.numeric(input$cytof_y_hi))
    .same_num <- function(a, b) is.finite(a) && is.finite(b) && abs(a - b) < 1e-9
    x_ok <- is.finite(x_lo) && is.finite(x_hi) && x_hi > x_lo
    y_ok <- is.finite(y_lo) && is.finite(y_hi) && y_hi > y_lo
    if (!x_ok && !y_ok) return()

    changed_plot_range <- FALSE
    changed_global <- FALSE

    if (is_flow_session(rv$sce)) {
      # Flow/QC gating axes are driven by temporary range overrides.
      if (!(x_ok && y_ok)) return()
      current_ov <- get_active_plot_range_override(x_ch, y_ch)
      same_override <- !is.null(current_ov) &&
        .same_num(current_ov$x_range[1], x_lo) && .same_num(current_ov$x_range[2], x_hi) &&
        .same_num(current_ov$y_range[1], y_lo) && .same_num(current_ov$y_range[2], y_hi)
      if (!same_override) {
        rv$.plot_range_override <- list(
          x_channel = x_ch, y_channel = y_ch,
          x_range = c(x_lo, x_hi), y_range = c(y_lo, y_hi)
        )
        changed_plot_range <- TRUE
      }
    } else {
      if (x_ok) {
        old_x <- rv$cytof_axis_range[[x_ch]]
        old_x_lo <- suppressWarnings(as.numeric(old_x$lo %||% NA))
        old_x_hi <- suppressWarnings(as.numeric(old_x$hi %||% NA))
        if (!(.same_num(old_x_lo, x_lo) && .same_num(old_x_hi, x_hi))) {
          rv$cytof_axis_range[[x_ch]] <- list(lo = x_lo, hi = x_hi)
          changed_plot_range <- TRUE
        }
      }
      if (y_ok) {
        old_y <- rv$cytof_axis_range[[y_ch]]
        old_y_lo <- suppressWarnings(as.numeric(old_y$lo %||% NA))
        old_y_hi <- suppressWarnings(as.numeric(old_y$hi %||% NA))
        if (!(.same_num(old_y_lo, y_lo) && .same_num(old_y_hi, y_hi))) {
          rv$cytof_axis_range[[y_ch]] <- list(lo = y_lo, hi = y_hi)
          changed_plot_range <- TRUE
        }
      }
      rv$.plot_range_override <- NULL
    }

    # Keep Scales tab in sync when min/max are edited from Gating tab.
    if (x_ok) {
      old_gx <- rv$global_scale_ranges[[x_ch]]
      old_gx_lo <- suppressWarnings(as.numeric(old_gx$lo %||% NA))
      old_gx_hi <- suppressWarnings(as.numeric(old_gx$hi %||% NA))
      if (!(.same_num(old_gx_lo, x_lo) && .same_num(old_gx_hi, x_hi))) {
        rv$global_scale_ranges[[x_ch]] <- list(lo = x_lo, hi = x_hi)
        changed_global <- TRUE
      }
    }
    if (y_ok) {
      old_gy <- rv$global_scale_ranges[[y_ch]]
      old_gy_lo <- suppressWarnings(as.numeric(old_gy$lo %||% NA))
      old_gy_hi <- suppressWarnings(as.numeric(old_gy$hi %||% NA))
      if (!(.same_num(old_gy_lo, y_lo) && .same_num(old_gy_hi, y_hi))) {
        rv$global_scale_ranges[[y_ch]] <- list(lo = y_lo, hi = y_hi)
        changed_global <- TRUE
      }
    }
    if (changed_global) {
      rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
      # Keep Scales-tab inputs synchronized immediately with latest Gating edits.
      x_safe <- gsub("[^A-Za-z0-9]", "_", x_ch)
      y_safe <- gsub("[^A-Za-z0-9]", "_", y_ch)
      if (x_ok) {
        updateNumericInput(session, paste0("scales_lo_", x_safe), value = x_lo)
        updateNumericInput(session, paste0("scales_hi_", x_safe), value = x_hi)
      }
      if (y_ok) {
        updateNumericInput(session, paste0("scales_lo_", y_safe), value = y_lo)
        updateNumericInput(session, paste0("scales_hi_", y_safe), value = y_hi)
      }
      mark_renders_stale()
    }

    if (!changed_plot_range && !changed_global) return()

    rv$.range_cache <- list()
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  output$flow_transform_controls_ui <- renderUI({
    # rv$.flow_transform_version is the ONLY explicit refresh trigger for value changes.
    # All rv$global_scale_ranges and rv$.plot_range_override reads are wrapped in
    # isolate() below so that scale edits do NOT cause a UI rebuild (which would
    # re-fire the cytof_x/y_lo/hi observer and create an infinite loop). The same
    # pattern is already used for rv$flow_logicle_w on the W sliders.
    rv$.flow_transform_version
    req(rv$sce, input$x_channel, input$y_channel)  # channel/SCE changes still auto-refresh
    x_ch <- input$x_channel %||% ""
    y_ch <- input$y_channel %||% ""
    if (!nzchar(x_ch) || !nzchar(y_ch)) return(NULL)

    is_flow <- isolate(is_flow_session(rv$sce))
    has_logicle <- is_flow && rv$assay_name == "exprs" &&
      "counts" %in% SummarizedExperiment::assayNames(isolate(rv$sce))

    if (is_flow) {
      active_override <- isolate(get_active_plot_range_override(x_ch, y_ch))
      if (!is.null(active_override)) {
        x_rng <- active_override$x_range
        y_rng <- active_override$y_range
      } else {
        x_gs <- isolate(rv$global_scale_ranges[[x_ch]])
        y_gs <- isolate(rv$global_scale_ranges[[y_ch]])
        x_lo <- suppressWarnings(as.numeric(x_gs$lo %||% NA))
        x_hi <- suppressWarnings(as.numeric(x_gs$hi %||% NA))
        y_lo <- suppressWarnings(as.numeric(y_gs$lo %||% NA))
        y_hi <- suppressWarnings(as.numeric(y_gs$hi %||% NA))
        if (is.finite(x_lo) && is.finite(x_hi) && x_hi > x_lo) {
          x_rng <- c(x_lo, x_hi)
        } else {
          x_rng <- compute_stable_range(x_ch, for_plot = TRUE)
        }
        if (is.finite(y_lo) && is.finite(y_hi) && y_hi > y_lo) {
          y_rng <- c(y_lo, y_hi)
        } else {
          y_rng <- compute_stable_range(y_ch, for_plot = TRUE)
        }
      }
    } else {
      x_gs <- isolate(rv$global_scale_ranges[[x_ch]])
      y_gs <- isolate(rv$global_scale_ranges[[y_ch]])
      x_lo <- suppressWarnings(as.numeric(x_gs$lo %||% NA))
      x_hi <- suppressWarnings(as.numeric(x_gs$hi %||% NA))
      y_lo <- suppressWarnings(as.numeric(y_gs$lo %||% NA))
      y_hi <- suppressWarnings(as.numeric(y_gs$hi %||% NA))
      x_rng <- if (is.finite(x_lo) && is.finite(x_hi) && x_hi > x_lo) c(x_lo, x_hi) else get_cytof_axis_range(x_ch)
      y_rng <- if (is.finite(y_lo) && is.finite(y_hi) && y_hi > y_lo) c(y_lo, y_hi) else get_cytof_axis_range(y_ch)
    }

    if (has_logicle) {
      # isolate() prevents slider self-updates from re-triggering renderUI rebuild loops.
      x_w <- isolate(as.numeric(rv$flow_logicle_w[[x_ch]] %||% rv$flow_logicle_w_auto[[x_ch]] %||% 0.5))
      y_w <- isolate(as.numeric(rv$flow_logicle_w[[y_ch]] %||% rv$flow_logicle_w_auto[[y_ch]] %||% 0.5))
    }

    tags$div(
      class = "flow-transform-controls",
      tags$div(style = "font-weight:600; font-size:11px; color:#555; margin-bottom:2px;",
               "Current Channel Scales"),
      tags$div(class = "flow-transform-note", style = "margin:2px 0 4px 0;",
               "Edit Min/Max for current X/Y channels directly from Gating."),

      tags$div(class = "cytof-axis-row gating-scale-row",
        tags$span(paste0("X (", x_ch, ")"), class = "gating-scale-axis-label"),
        numericInput("cytof_x_lo", NULL, value = round(as.numeric(x_rng[1]), 3), step = 0.4, width = "78px"),
        tags$span("to", style = "font-size:11px;color:#888;"),
        numericInput("cytof_x_hi", NULL, value = round(as.numeric(x_rng[2]), 3), step = 0.4, width = "78px"),
        if (has_logicle) tags$div(class = "flow-w-inline",
          sliderInput("x_logicle_w", NULL,
                      min = 0.1, max = 2.0, step = 0.05,
                      value = x_w, width = "100%"),
          actionButton("auto_w_x_btn", "A", class = "btn-xs btn-default",
                       title = "Reset to auto-estimated W")
        ) else NULL
      ),

      tags$div(class = "cytof-axis-row gating-scale-row",
        tags$span(paste0("Y (", y_ch, ")"), class = "gating-scale-axis-label"),
        numericInput("cytof_y_lo", NULL, value = round(as.numeric(y_rng[1]), 3), step = 0.4, width = "78px"),
        tags$span("to", style = "font-size:11px;color:#888;"),
        numericInput("cytof_y_hi", NULL, value = round(as.numeric(y_rng[2]), 3), step = 0.4, width = "78px"),
        if (has_logicle) tags$div(class = "flow-w-inline",
          sliderInput("y_logicle_w", NULL,
                      min = 0.1, max = 2.0, step = 0.05,
                      value = y_w, width = "100%"),
          actionButton("auto_w_y_btn", "A", class = "btn-xs btn-default",
                       title = "Reset to auto-estimated W")
        ) else NULL
      ),

      if (has_logicle) tags$div(class = "flow-transform-note",
               "W: linear half-width near zero (lower = more linear region)") else NULL
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
    # Sync W to Scales tab numeric input
    updateNumericInput(session, paste0("scales_w_", gsub("[^A-Za-z0-9]", "_", ch)), value = new_w)
    mark_renders_stale()
    # Do NOT call persist_flow_transform_state() here — it mutates rv$sce, which
    # triggers the renderUI that recreates these sliders, which re-fires this
    # observer mid-drag, causing back-and-forth oscillation. Persistence happens
    # in the channel-change observer (low-frequency, safe checkpoint).
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
    # Sync W to Scales tab numeric input
    updateNumericInput(session, paste0("scales_w_", gsub("[^A-Za-z0-9]", "_", ch)), value = new_w)
    mark_renders_stale()
    # Do NOT call persist_flow_transform_state() here — see comment in x_logicle_w observer.
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
    rv$sample_filter_key <- "all"
    rv$.last_combined_pop_mask <- NULL
    # Clear any DT row selections from the previous SCE
    proxy <- DT::dataTableProxy("sample_filter_table")
    DT::selectRows(proxy, NULL)

    cd_names <- get_coldata_names(sce)
    rv$coldata_names <- cd_names
    updateSelectInput(session, "overlay_coldata",
                      choices = c("(none)" = "", cd_names), selected = "")
    rv$overlay_factor <- NULL
    rv$overlay_selected <- NULL

    # Reset scales observer tracking so the correct observers (incl. logicle W)
    # are created for this SCE's instrument type (CyTOF vs flow).
    session$userData$scales_obs_created <- character(0)

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
      if (!is.null(ws$cytof_axis_range)) rv$cytof_axis_range <- ws$cytof_axis_range
      rv$global_scale_ranges <- ws$global_scale_ranges %||% list()
      initialize_missing_global_scales(channels)
      rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
      rv$.plot_range_override <- ws$plot_range_override %||% NULL
      rv$illust_pop_palette <- ws$illust_pop_palette %||% list()
      rv$illust_pop_selected <- if (!is.null(ws$illust_pop_selected)) as.character(ws$illust_pop_selected) else NULL
      if (isTRUE(sync_illust_palette_state())) {
        rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
      }
      rv$.strategy_stale <- FALSE; rv$.illust_stale <- FALSE
      update_rescale_btn(!is.null(rv$.plot_range_override))
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
      rv$cytof_axis_range <- list()
      rv$global_scale_ranges <- list()
      initialize_missing_global_scales(channels)
      rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
      rv$.plot_range_override <- NULL
      rv$illust_pop_palette <- list()
      rv$illust_pop_selected <- NULL
      if (isTRUE(sync_illust_palette_state())) {
        rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
      }
      rv$.strategy_stale <- FALSE; rv$.illust_stale <- FALSE
      update_rescale_btn(FALSE)
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
      rv$sample_filter_key <- "all"
      rv$.last_combined_pop_mask <- NULL
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
      initialize_missing_global_scales(channels)
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
    # Reset cytof axis range — different assay means a completely different scale
    rv$cytof_axis_range <- list()
    rv$.plot_range_override <- NULL
    update_rescale_btn(FALSE)
    refresh_assay_data(reset_cache = TRUE)
    req(rv$assay_data)
    send_full_plot(reset_view = TRUE)
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

  sample_filter_signature <- function(selected_keys, all_keys) {
    if (length(selected_keys) == 0) return("none")
    if (length(selected_keys) == length(all_keys)) return("all")

    keys <- sort(unique(as.character(selected_keys)))
    key_lengths <- nchar(keys, type = "bytes")
    checksum <- sum(vapply(keys, function(k) sum(utf8ToInt(k)), numeric(1)))
    paste0(
      "subset:", length(keys), ":", sum(key_lengths), ":", checksum,
      ":", keys[[1]], ":", keys[[length(keys)]]
    )
  }

  current_sample_filter_key <- function() {
    key <- rv$sample_filter_key
    if (!is.null(key) && nzchar(key)) return(key)
    if (is.null(rv$sample_mask)) return("all")
    paste0("mask:", sum(rv$sample_mask), ":", length(rv$sample_mask))
  }

  is_full_plot_mode <- function() {
    identical(input$plot_data_scope %||% "subset", "full")
  }

  get_effective_sample_mask <- function(for_plot = FALSE) {
    if (!for_plot) return(rv$sample_mask)
    if (is_full_plot_mode()) return(NULL)
    rv$sample_mask
  }

  current_plot_scope_key <- function() {
    if (is_full_plot_mode()) return("full")
    paste0("subset:", current_sample_filter_key())
  }

  axis_span_scale <- function() {
    1.2
  }

  axis_span_scale_from_input <- function(value, default_percent = 120) {
    as.numeric(default_percent) / 100
  }

  is_gaussian_qc_channel <- function(channel) {
    if (is.null(channel) || !nzchar(channel)) return(FALSE)
    # Keep Gaussian/QC channels on their legacy robust axis behavior.
    # These channels are not metal-marker signal dimensions.
    pattern_hit <- grepl(
      "gaussian|amplitude|beaddist|^width$|^center$|^offset$|^residual$|^time$|event_length|cell_length",
      channel,
      ignore.case = TRUE
    )
    if (isTRUE(pattern_hit)) return(TRUE)

    qc_fn <- get0(".is_qc_channel", mode = "function")
    if (is.function(qc_fn)) {
      return(isTRUE(qc_fn(channel)))
    }
    FALSE
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
      rv$sample_filter_key <- "all"
      return()
    }

    selected_keys <- resolve_filtered_sample_keys(info)
    new_key <- sample_filter_signature(selected_keys, info$keys)
    if (identical(new_key, "all")) {
      if (is.null(rv$sample_mask) && identical(rv$sample_filter_key, "all")) return()
      rv$sample_mask <- NULL
      rv$sample_filter_key <- "all"
      rv$.gate_counts_cache_key <- NULL
      rv$.gate_counts_cache <- NULL
      rv$.population_tree_cache_key <- NULL
      rv$.population_tree_cache <- NULL
      rv$.range_cache <- list()
      rv$.last_combined_pop_mask <- NULL
      send_full_plot()
      return()
    }

    if (identical(new_key, "none")) {
      if (identical(rv$sample_filter_key, "none") && !is.null(rv$sample_mask) &&
          length(rv$sample_mask) == nrow(rv$assay_data) && !any(rv$sample_mask)) return()
      rv$sample_mask <- rep(FALSE, nrow(rv$assay_data))
      rv$sample_filter_key <- "none"
      rv$.gate_counts_cache_key <- NULL
      rv$.gate_counts_cache <- NULL
      rv$.population_tree_cache_key <- NULL
      rv$.population_tree_cache <- NULL
      rv$.range_cache <- list()
      rv$.last_combined_pop_mask <- rv$sample_mask
      send_full_plot()
      return()
    }

    if (identical(rv$sample_filter_key, new_key)) return()

    event_indices <- unlist(info$group_map[selected_keys], use.names = FALSE)
    mask <- rep(FALSE, nrow(rv$assay_data))
    mask[event_indices] <- TRUE
    rv$sample_mask <- mask
    rv$sample_filter_key <- new_key
    rv$.gate_counts_cache_key <- NULL
    rv$.gate_counts_cache <- NULL
    rv$.population_tree_cache_key <- NULL
    rv$.population_tree_cache <- NULL
    rv$.range_cache <- list()
    rv$.last_combined_pop_mask <- mask
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

    level_defaults <- all_levels
    if (!is.null(rv$sample_mask) && length(rv$sample_mask) == length(vals)) {
      level_defaults <- sort(unique(vals[rv$sample_mask]))
      level_defaults <- level_defaults[is.finite(match(level_defaults, all_levels))]
      if (length(level_defaults) == 0) level_defaults <- all_levels
    }

    output$overlay_checkboxes_ui <- renderUI({
      checkboxGroupInput("overlay_levels", "Select levels:",
                         choices = all_levels,
                         selected = level_defaults,
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

  get_filtered_channel_values <- function(channel, for_plot = FALSE) {
    if (is.null(rv$assay_data) || !channel %in% colnames(rv$assay_data)) return(numeric(0))
    vals <- rv$assay_data[, channel]
    mask <- get_effective_sample_mask(for_plot = for_plot)
    if (is.null(mask)) return(vals)
    if (length(mask) != length(vals)) return(vals)
    vals[mask]
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
    sample_mask <- get_effective_sample_mask(for_plot = FALSE)
    if (!is.null(sample_mask)) {
      pop_mask <- if (!is.null(pop_mask)) pop_mask & sample_mask else sample_mask
    }
    rv$.last_combined_pop_mask <- pop_mask
    pop_mask
  }

  is_subset_count_mode <- function() {
    identical(input$count_compute_mode %||% "subset", "subset")
  }

  subset_count_cap <- function() {
    cap <- suppressWarnings(as.numeric(input$subset_count_events %||% 30000))
    if (!is.finite(cap) || cap <= 0) return(Inf)
    as.integer(round(cap))
  }

  get_gate_counts <- function(force_full = FALSE) {
    gating_data <- get_gating_data()
    if (is.null(gating_data) || length(rv$gates) == 0) return(list())
    use_subset <- is_subset_count_mode() && !isTRUE(force_full)
    pop_mask <- if (use_subset) {
      rv$.last_combined_pop_mask %||% rv$sample_mask
    } else {
      get_combined_pop_mask()
    }

    if (!is.null(pop_mask) && length(pop_mask) != nrow(gating_data)) {
      pop_mask <- NULL
    }

    cap <- if (use_subset) subset_count_cap() else Inf

    if (is.finite(cap) && cap > 0) {
      idx <- if (!is.null(pop_mask)) which(pop_mask) else seq_len(nrow(gating_data))
      if (length(idx) > cap) {
        keep <- idx[round(seq(1, length(idx), length.out = cap))]
        gating_data <- gating_data[keep, , drop = FALSE]
        pop_mask <- rep(TRUE, length(keep))
      } else if (!is.null(pop_mask)) {
        gating_data <- gating_data[idx, , drop = FALSE]
        pop_mask <- rep(TRUE, length(idx))
      }
    }

    # Cache gate counts keyed by gate state + assay state + sample filter signature.
    cache_key <- paste(rv$gate_version,
                       rv$assay_version,
                       rv$active_population_id %||% "root",
                       current_sample_filter_key(),
                       if (use_subset) "subset" else "full",
                       if (is.finite(cap)) as.integer(cap) else "all",
                       if (is.null(pop_mask)) "nomask" else "masked",
                       sep = "|")
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

  compute_stable_range <- function(channel, for_plot = FALSE) {
    filter_key <- if (for_plot) current_plot_scope_key() else current_sample_filter_key()
    span_scale <- axis_span_scale()
    cache_key <- paste(rv$assay_version, channel, filter_key, span_scale, sep = "|")
    if (!is.null(rv$.range_cache[[cache_key]])) return(rv$.range_cache[[cache_key]])

    vals <- get_filtered_channel_values(channel, for_plot = for_plot)
    vals <- vals[is.finite(vals)]
    if (length(vals) == 0) {
      rv$.range_cache[[cache_key]] <- c(0, 1)
      return(c(0, 1))
    }

    if (is_gaussian_qc_channel(channel)) {
      out <- compute_axis_range(vals)
      rv$.range_cache[[cache_key]] <- out
      return(out)
    }

    low <- min(vals, na.rm = TRUE)
    high <- max(vals, na.rm = TRUE)
    span <- high - low
    if (span < 1e-10) span <- 1

    # Keep a consistent default padding of 120% of data range.
    lower_pad <- span * 0.05
    upper_pad <- span * max(0, span_scale - 1)
    out <- c(low - lower_pad, high + upper_pad)
    if (low >= 0) out[1] <- min(0, out[1])

    rv$.range_cache[[cache_key]] <- out
    out
  }

  compute_range_from_values <- function(vals, channel = NULL, span_scale = axis_span_scale()) {
    vals <- as.numeric(vals)
    vals <- vals[is.finite(vals)]
    if (length(vals) == 0) return(c(0, 1))

    if (!is.null(channel) && is_gaussian_qc_channel(channel)) {
      return(compute_axis_range(vals))
    }

    low <- min(vals, na.rm = TRUE)
    high <- max(vals, na.rm = TRUE)
    span <- high - low
    if (!is.finite(span) || span < 1e-10) span <- 1

    lower_pad <- span * 0.05
    upper_pad <- span * max(0, span_scale - 1)
    out <- c(low - lower_pad, high + upper_pad)
    if (low >= 0) out[1] <- min(0, out[1])
    out
  }

  # Expand a [lo, hi] range to also cover the supplied vertex coordinate values.
  # Used to ensure gate boundaries are always visible in strategy/illustration plots.
  expand_range_for_vertices <- function(range_vals, vertex_coords) {
    if (length(range_vals) != 2) return(range_vals)
    coords <- as.numeric(vertex_coords)
    coords <- coords[is.finite(coords)]
    if (length(coords) == 0) return(range_vals)
    c(min(range_vals[1], min(coords)), max(range_vals[2], max(coords)))
  }

  # Extract x (idx=1) or y (idx=2) scalar from a vertex [[x,y]] list element.
  .vertex_coord <- function(v, idx) {
    tryCatch({ val <- as.numeric(v[[idx]]); if (length(val) == 1L) val else NA_real_ },
             error = function(e) NA_real_)
  }

  current_overlay_signature <- function() {
    overlay_active <- !is.null(rv$overlay_factor) && !is.null(rv$overlay_selected) && length(rv$overlay_selected) > 0
    if (!isTRUE(overlay_active)) return("none")
    paste(sort(as.character(rv$overlay_selected)), collapse = "|")
  }

  get_active_plot_range_override <- function(x_ch, y_ch) {
    ov <- rv$.plot_range_override
    if (is.null(ov)) return(NULL)

    if (!identical(ov$x_channel, x_ch) || !identical(ov$y_channel, y_ch)) return(NULL)

    x_range <- suppressWarnings(as.numeric(ov$x_range %||% numeric(0)))
    y_range <- suppressWarnings(as.numeric(ov$y_range %||% numeric(0)))
    if (length(x_range) != 2 || length(y_range) != 2 || !all(is.finite(c(x_range, y_range)))) return(NULL)

    list(x_range = x_range, y_range = y_range)
  }

  compute_rescaled_plot_ranges <- function(x_ch, y_ch, pop_mask = NULL, plot_sample_mask = NULL) {
    req(rv$assay_data)
    if (!x_ch %in% colnames(rv$assay_data) || !y_ch %in% colnames(rv$assay_data)) return(NULL)

    n <- nrow(rv$assay_data)
    if (n <= 0) return(NULL)

    include_mask <- rep(TRUE, n)
    if (!is.null(pop_mask) && length(pop_mask) == n) include_mask <- include_mask & as.logical(pop_mask)
    if (!is.null(plot_sample_mask) && length(plot_sample_mask) == n) include_mask <- include_mask & as.logical(plot_sample_mask)

    overlay_active <- !is.null(rv$overlay_factor) && !is.null(rv$overlay_selected) && length(rv$overlay_selected) > 0
    if (isTRUE(overlay_active) && length(rv$overlay_factor) == n) {
      include_mask <- include_mask & (rv$overlay_factor %in% rv$overlay_selected)
    }

    if (!any(include_mask, na.rm = TRUE)) return(NULL)

    span_scale <- axis_span_scale()
    xv <- rv$assay_data[include_mask, x_ch]
    yv <- rv$assay_data[include_mask, y_ch]

    list(
      x_range = compute_range_from_values(xv, channel = x_ch, span_scale = span_scale),
      y_range = compute_range_from_values(yv, channel = y_ch, span_scale = span_scale),
      n_events = sum(include_mask, na.rm = TRUE)
    )
  }

  get_population_tree_stats <- function() {
    if (length(rv$populations) == 0 || is.null(rv$root_population_id)) {
      return(list(event_count = list(), percent_of_parent = list(), percent_of_total = list()))
    }

    # With no sample filter, reuse counts computed during full-data strategy apply.
    if (is.null(rv$sample_mask)) {
      event_count <- lapply(rv$populations, function(pop) pop$event_count)
      percent_of_parent <- lapply(rv$populations, function(pop) pop$percent_of_parent)
      root_count <- as.numeric(event_count[[rv$root_population_id]] %||% 0)
      percent_of_total <- lapply(names(rv$populations), function(pid) {
        if (identical(pid, rv$root_population_id)) return(100)
        child_count <- as.numeric(event_count[[pid]] %||% 0)
        if (root_count > 0) round(child_count / root_count * 100, 2) else 0
      })
      names(percent_of_total) <- names(rv$populations)
      return(list(event_count = event_count, percent_of_parent = percent_of_parent,
                  percent_of_total = percent_of_total))
    }

    root_mask <- get_pop_mask(rv$root_population_id)
    if (is.null(root_mask) || length(rv$pop_events_map) == 0) {
      return(list(event_count = list(), percent_of_parent = list(), percent_of_total = list()))
    }

    cache_key <- paste(
      rv$gate_version,
      rv$assay_version,
      current_sample_filter_key(),
      sep = "|"
    )
    if (!is.null(rv$.population_tree_cache_key) &&
        identical(rv$.population_tree_cache_key, cache_key) &&
        !is.null(rv$.population_tree_cache)) {
      return(rv$.population_tree_cache)
    }

    event_count <- list()
    for (pid in names(rv$populations)) {
      pop_mask <- rv$pop_events_map[[pid]]
      if (is.null(pop_mask)) next
      event_count[[pid]] <- sum(pop_mask & rv$sample_mask)
    }

    percent_of_parent <- list()
    for (pid in names(rv$populations)) {
      pop <- rv$populations[[pid]]
      if (is.null(pop)) next
      if (identical(pid, rv$root_population_id)) {
        percent_of_parent[[pid]] <- 100
      } else {
        parent_count <- as.numeric(event_count[[pop$parent_id]] %||% 0)
        child_count <- as.numeric(event_count[[pid]] %||% 0)
        percent_of_parent[[pid]] <- if (parent_count > 0) round(child_count / parent_count * 100, 2) else 0
      }
    }

    root_count <- as.numeric(event_count[[rv$root_population_id]] %||% 0)
    percent_of_total <- list()
    for (pid in names(rv$populations)) {
      if (is.null(rv$populations[[pid]])) next
      if (identical(pid, rv$root_population_id)) {
        percent_of_total[[pid]] <- 100
      } else {
        child_count <- as.numeric(event_count[[pid]] %||% 0)
        percent_of_total[[pid]] <- if (root_count > 0) round(child_count / root_count * 100, 2) else 0
      }
    }

    out <- list(event_count = event_count, percent_of_parent = percent_of_parent,
                percent_of_total = percent_of_total)
    rv$.population_tree_cache_key <- cache_key
    rv$.population_tree_cache <- out
    out
  }

  # ══════════════════════════════════════════════════════════════════════════════
  # PLOT RENDERING (Gating Tab)
  # ══════════════════════════════════════════════════════════════════════════════

  send_full_plot <- function(reset_view = FALSE, refresh_pop_masks = TRUE) {
    req(rv$assay_data, input$x_channel, input$y_channel)
    x_ch <- input$x_channel; y_ch <- input$y_channel
    if (!x_ch %in% colnames(rv$assay_data) || !y_ch %in% colnames(rv$assay_data)) return()

    pop_mask <- if (isTRUE(refresh_pop_masks)) {
      get_pop_mask()
    } else {
      pid <- rv$active_population_id %||% rv$root_population_id
      rv$pop_events_map[[pid]] %||% rv$.last_combined_pop_mask
    }
    plot_sample_mask <- get_effective_sample_mask(for_plot = TRUE)
    combined_mask <- if (!is.null(plot_sample_mask)) {
      if (!is.null(pop_mask)) pop_mask & plot_sample_mask else plot_sample_mask
    } else {
      pop_mask
    }
    rv$.last_combined_pop_mask <- combined_mask
    gate_counts <- get_gate_counts()
    plot_gates <- get_plot_gates(x_ch, y_ch)
    alpha <- input$point_alpha %||% 0.35
    active_override <- get_active_plot_range_override(x_ch, y_ch)
    .global_range <- function(ch) {
      gs <- rv$global_scale_ranges[[ch]]
      lo <- suppressWarnings(as.numeric(gs$lo %||% NA))
      hi <- suppressWarnings(as.numeric(gs$hi %||% NA))
      if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)
      c(lo, hi)
    }
    if (!is.null(active_override)) {
      x_range <- active_override$x_range
      y_range <- active_override$y_range
    } else {
      x_range <- .global_range(x_ch)
      y_range <- .global_range(y_ch)
      if (is.null(x_range)) x_range <- compute_stable_range(x_ch, for_plot = TRUE)
      if (is.null(y_range)) y_range <- compute_stable_range(y_ch, for_plot = TRUE)
    }

    # When no user-locked override is active, expand axis ranges so that
    # all gate boundaries on the current channel pair remain in view.
    if (is.null(active_override)) {
      for (gid in rv$gate_order) {
        gate <- plot_gates[[gid]]
        if (is.null(gate)) next
        verts <- gate$vertices %||% list()
        if (length(verts) == 0) next
        if (identical(gate$x_channel, x_ch) && identical(gate$y_channel, y_ch)) {
          # Normal orientation — vertex[1]=x, vertex[2]=y
          gvx <- vapply(verts, .vertex_coord, numeric(1), idx = 1L)
          gvy <- vapply(verts, .vertex_coord, numeric(1), idx = 2L)
          x_range <- expand_range_for_vertices(x_range, gvx)
          y_range <- expand_range_for_vertices(y_range, gvy)
        } else if (identical(gate$x_channel, y_ch) && identical(gate$y_channel, x_ch)) {
          # Flipped gate: gate's x-coords map to plot y-axis and vice versa
          gvx <- vapply(verts, .vertex_coord, numeric(1), idx = 1L)
          gvy <- vapply(verts, .vertex_coord, numeric(1), idx = 2L)
          x_range <- expand_range_for_vertices(x_range, gvy)
          y_range <- expand_range_for_vertices(y_range, gvx)
        }
      }
    }

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
    if (!is.null(rv$sce) && rv$assay_name == "exprs") {
      if (is_flow_session(rv$sce)) {
        plot_data$x_is_log <- isTRUE(.is_scatter_channel(x_ch))
        plot_data$y_is_log <- isTRUE(.is_scatter_channel(y_ch))
        plot_data$x_scatter_cofactor <- as.numeric(rv$flow_scatter_cofactor[[x_ch]] %||% 150)
        plot_data$y_scatter_cofactor <- as.numeric(rv$flow_scatter_cofactor[[y_ch]] %||% 150)
      }
      xt <- generate_channel_ticks(x_ch, plot_data$x_range)
      if (!is.null(xt)) {
        plot_data$x_logicle_ticks <- xt
        plot_data$x_is_logicle <- TRUE
      }
      yt <- generate_channel_ticks(y_ch, plot_data$y_range)
      if (!is.null(yt)) {
        plot_data$y_logicle_ticks <- yt
        plot_data$y_is_logicle <- TRUE
      }
    }

    rv$.plot_msg_seq <- as.integer(rv$.plot_msg_seq %||% 0L) + 1L
    plot_data$`_plot_seq` <- rv$.plot_msg_seq

    rv$current_plot_data <- plot_data
    session$sendCustomMessage("updatePlot", plot_data)
  }

  send_gates_only <- function(force_full_counts = FALSE) {
    req(rv$current_plot_data)
    gate_counts <- get_gate_counts(force_full = force_full_counts)
    x_ch <- rv$current_plot_data$x_label
    y_ch <- rv$current_plot_data$y_label
    plot_gates <- get_plot_gates(x_ch, y_ch)
    plot_data <- build_gates_only_data(rv$current_plot_data, plot_gates, rv$gate_order,
                                        gate_counts, rv$selected_gate_id)
    rv$.plot_msg_seq <- as.integer(rv$.plot_msg_seq %||% 0L) + 1L
    plot_data$`_plot_seq` <- rv$.plot_msg_seq
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
    # Persist logicle W params when the user navigates to a new channel pair.
    # This is the safe low-frequency checkpoint (replaces per-tick persist in
    # the slider observers, which caused renderUI → slider recreation → loop).
    persist_flow_transform_state()
    rv$.plot_range_override <- NULL
    update_rescale_btn(FALSE)
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$display_mode, { req(rv$assay_data); send_full_plot() }, ignoreInit = TRUE)
  observeEvent(input$plot_data_scope, {
    req(rv$assay_data)
    rv$.range_cache <- list()
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)
  observeEvent(input$contour_threshold, { req(rv$assay_data); send_full_plot() }, ignoreInit = TRUE)

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
    rv$.population_tree_cache_key <- NULL; rv$.population_tree_cache <- NULL
    rv$.range_cache <- list()
    rv$.last_combined_pop_mask <- NULL
    send_full_plot()
  })

  observeEvent(input$recompute_full_counts_btn, {
    req(rv$assay_data)
    updateSelectInput(session, "count_compute_mode", selected = "full")
    rv$cache_version <- -1L
    rv$pop_events_map <- list()
    rv$.last_combined_pop_mask <- NULL
    rv$.gate_counts_cache_key <- NULL
    rv$.gate_counts_cache <- NULL
    rv$.population_tree_cache_key <- NULL
    rv$.population_tree_cache <- NULL
    send_full_plot(reset_view = FALSE, refresh_pop_masks = TRUE)
    showNotification("Full-data gate/population recompute complete.", type = "message", duration = 3)
  }, ignoreInit = TRUE)

  observeEvent(input$count_compute_mode, {
    req(rv$assay_data)
    rv$.gate_counts_cache_key <- NULL
    rv$.gate_counts_cache <- NULL
    if (is_subset_count_mode()) {
      if (!is.null(rv$current_plot_data)) send_gates_only(force_full_counts = FALSE)
    } else {
      send_full_plot(reset_view = FALSE, refresh_pop_masks = TRUE)
    }
  }, ignoreInit = TRUE)

  observeEvent(input$subset_count_events, {
    req(rv$assay_data)
    if (!is_subset_count_mode()) return()
    rv$.gate_counts_cache_key <- NULL
    rv$.gate_counts_cache <- NULL
    if (!is.null(rv$current_plot_data)) send_gates_only(force_full_counts = FALSE)
  }, ignoreInit = TRUE)

  # ══════════════════════════════════════════════════════════════════════════════
  # GATE DRAWING + CREATION + EDITING
  # ══════════════════════════════════════════════════════════════════════════════

  observeEvent(input$mode_rect,   { session$sendCustomMessage("setMode", "draw-rect"); update_mode_buttons("draw-rect") })
  observeEvent(input$mode_poly,   { session$sendCustomMessage("setMode", "draw-poly"); update_mode_buttons("draw-poly") })
  observeEvent(input$mode_cancel, { session$sendCustomMessage("setMode", "navigate");  update_mode_buttons("navigate")   })

  update_mode_buttons <- function(active_mode) {
    modes <- list(mode_rect = "draw-rect", mode_poly = "draw-poly")
    for (btn_id in names(modes)) {
      if (modes[[btn_id]] == active_mode) runjs(sprintf("$('#%s').addClass('active-mode')", btn_id))
      else runjs(sprintf("$('#%s').removeClass('active-mode')", btn_id))
    }
  }

  update_rescale_btn <- function(active) {
    invisible(active)
  }

  observeEvent(input$toggle_gate_list_btn, {
    runjs(
      "(function(){
        var panel = $('#gate_list_container');
        var btn = $('#toggle_gate_list_btn');
        var icon = btn.find('i.fa');
        if(!panel.length) return;
        if(panel.is(':visible')) {
          panel.slideUp(120);
          icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
          btn.attr('title', 'Expand gates list');
        } else {
          panel.slideDown(120);
          icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
          btn.attr('title', 'Collapse gates list');
        }
      })();"
    )
  }, ignoreInit = TRUE)

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
      pop_name <- trimws(pop_name)

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
      seq_in <- suppressWarnings(as.integer(edit$seq %||% 0L))
      seq_last <- suppressWarnings(as.integer(rv$.last_gate_edit_seq[[edit$gate_id]] %||% 0L))
      if (is.finite(seq_in) && is.finite(seq_last) && seq_in <= seq_last) {
        session$sendCustomMessage("clearPendingEdit", list(gate_id = edit$gate_id, seq = edit$seq))
        return()
      }
      rv$.last_gate_edit_seq[[edit$gate_id]] <- seq_in

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
      autosave()

      if (is_subset_count_mode() && !is.null(rv$current_plot_data) &&
          identical(rv$current_plot_data$x_label, input$x_channel) &&
          identical(rv$current_plot_data$y_label, input$y_channel)) {
        send_gates_only(force_full_counts = FALSE)
      } else {
        send_full_plot(reset_view = FALSE, refresh_pop_masks = TRUE)
      }
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

  observeEvent(input$sort_gates_alpha_btn, {
    if (length(rv$gates) == 0) return()

    ordered_ids <- if (length(rv$gate_order) > 0) rv$gate_order else names(rv$gates)
    ordered_ids <- ordered_ids[ordered_ids %in% names(rv$gates)]
    if (length(ordered_ids) == 0) return()

    gate_names <- vapply(ordered_ids, function(gid) {
      nm <- as.character(rv$gates[[gid]]$name %||% "")
      if (!nzchar(nm)) gid else nm
    }, character(1))

    new_order <- ordered_ids[order(tolower(gate_names), gate_names, ordered_ids)]
    if (identical(new_order, rv$gate_order)) {
      showNotification("Gate list already sorted alphabetically.", type = "message", duration = 2)
      return()
    }

    save_undo_snapshot()
    rv$gate_order <- new_order
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_gates_only(force_full_counts = FALSE)
  }, ignoreInit = TRUE)

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
    showModal(modalDialog(
      title = "Edit Population",
      uiOutput("population_editor_ui"),
      footer = modalButton("Close"),
      easyClose = TRUE,
      size = "l"
    ))
  })

  observeEvent(input$edit_pop_selector, {
    req(input$edit_pop_selector)
    if (!is.null(rv$populations[[input$edit_pop_selector]])) {
      rv$active_population_id <- input$edit_pop_selector
    }
  }, ignoreInit = TRUE)

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
      tags$p("Child populations will be kept and moved up to this population's parent.",
             style = "color:#777;"),
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
    rv$populations <- remove_population_reparent_children(rv$populations, pop_id)
    sort_population_tree_state()
    if (identical(rv$active_population_id, pop_id) || is.null(rv$populations[[rv$active_population_id]])) {
      rv$active_population_id <- rv$root_population_id
    }
    rv$.selected_pop_ids <- setdiff(rv$.selected_pop_ids, pop_id)
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

  delete_populations_by_ids <- function(pop_ids) {
    pop_ids <- unique(as.character(pop_ids %||% character(0)))
    pop_ids <- pop_ids[pop_ids %in% names(rv$populations)]
    pop_ids <- setdiff(pop_ids, rv$root_population_id)
    if (length(pop_ids) == 0) return()

    save_undo_snapshot()
    for (pid in pop_ids) {
      if (!is.null(rv$populations[[pid]])) {
        rv$populations <- remove_population_reparent_children(rv$populations, pid)
      }
    }
    sort_population_tree_state()
    if (is.null(rv$populations[[rv$active_population_id]])) {
      rv$active_population_id <- rv$root_population_id
    }
    rv$.selected_pop_ids <- intersect(rv$.selected_pop_ids, names(rv$populations))
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

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

  observeEvent(input$pop_tree_toggle_select, {
    evt <- input$pop_tree_toggle_select
    req(evt, evt$pop_id)
    pid <- as.character(evt$pop_id)
    if (!pid %in% names(rv$populations) || identical(pid, rv$root_population_id)) return()
    checked <- isTRUE(evt$checked)
    if (checked) {
      rv$.selected_pop_ids <- unique(c(rv$.selected_pop_ids, pid))
    } else {
      rv$.selected_pop_ids <- setdiff(rv$.selected_pop_ids, pid)
    }
  })

  observeEvent(input$delete_selected_pops_btn, {
    selected <- setdiff(intersect(rv$.selected_pop_ids, names(rv$populations)), rv$root_population_id)
    if (length(selected) == 0) {
      showNotification("No populations selected.", type = "message", duration = 2)
      return()
    }
    rv$.pending_bulk_delete_pop_ids <- selected
    showModal(modalDialog(
      title = "Delete Selected Populations",
      tags$p(sprintf("Delete %d selected population(s)?", length(selected))),
      tags$p("Children of deleted populations will be kept and reparented upward.",
             style = "color:#777;"),
      footer = tagList(
        modalButton("Cancel"),
        actionButton("confirm_delete_selected_pops_btn", "OK", class = "btn-danger")
      ),
      easyClose = TRUE
    ))
  })

  observeEvent(input$duplicate_selected_pops_btn, {
    selected <- setdiff(intersect(rv$.selected_pop_ids, names(rv$populations)), rv$root_population_id)
    if (length(selected) == 0) {
      showNotification("No populations selected.", type = "message", duration = 2)
      return()
    }

    make_copy_name <- function(base_name, taken_names) {
      candidate <- paste0(base_name, " copy")
      if (!candidate %in% taken_names) return(candidate)
      i <- 2L
      while (paste0(candidate, " ", i) %in% taken_names) i <- i + 1L
      paste0(candidate, " ", i)
    }

    save_undo_snapshot()
    existing_names <- vapply(names(rv$populations), function(pid) {
      as.character(rv$populations[[pid]]$name %||% "")
    }, character(1))

    created_ids <- character(0)
    for (pid in selected) {
      pop <- rv$populations[[pid]]
      if (is.null(pop)) next

      base_name <- as.character(pop$name %||% pid)
      new_name <- make_copy_name(base_name, existing_names)
      gate_refs_copy <- lapply(pop$gate_refs %||% list(), function(ref) {
        new_gate_ref(ref$gate_id, include = isTRUE(ref$include))
      })

      dup_pop <- new_population(
        name = new_name,
        gate_refs = gate_refs_copy,
        parent_id = pop$parent_id,
        gate_logic = pop$gate_logic %||% "and"
      )

      rv$populations[[dup_pop$population_id]] <- dup_pop
      if (!is.null(pop$parent_id) && !is.null(rv$populations[[pop$parent_id]])) {
        rv$populations <- link_child_to_parent(rv$populations, dup_pop$population_id, pop$parent_id)
      }

      existing_names <- c(existing_names, new_name)
      created_ids <- c(created_ids, dup_pop$population_id)
    }

    if (length(created_ids) == 0) {
      showNotification("No populations duplicated.", type = "warning", duration = 3)
      return()
    }

    rv$.selected_pop_ids <- unique(c(rv$.selected_pop_ids, created_ids))
    sort_population_tree_state()
    rv$active_population_id <- created_ids[[1]]
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
    showNotification(sprintf("Duplicated %d population(s).", length(created_ids)),
                     type = "message", duration = 3)
  }, ignoreInit = TRUE)

  observeEvent(input$confirm_delete_selected_pops_btn, {
    removeModal()
    selected <- rv$.pending_bulk_delete_pop_ids
    rv$.pending_bulk_delete_pop_ids <- character(0)
    delete_populations_by_ids(selected)
  })

  observeEvent(input$apply_bulk_pop_rename_btn, {
    req(rv$populations, input$bulk_pop_rename_upload)

    upload <- input$bulk_pop_rename_upload
    ext <- tolower(tools::file_ext(upload$name %||% ""))

    rename_tbl <- tryCatch({
      if (ext == "csv") {
        utils::read.csv(upload$datapath, stringsAsFactors = FALSE, check.names = FALSE)
      } else if (ext %in% c("xlsx", "xls")) {
        if (!requireNamespace("readxl", quietly = TRUE)) {
          stop("Package 'readxl' is required for Excel uploads. Please install it or use CSV.")
        }
        as.data.frame(readxl::read_excel(upload$datapath), stringsAsFactors = FALSE)
      } else {
        stop("Unsupported file type. Please upload a .csv or .xlsx file.")
      }
    }, error = function(e) {
      showNotification(paste("Could not read rename file:", conditionMessage(e)),
                       type = "error", duration = 6)
      NULL
    })
    if (is.null(rename_tbl)) return()

    col_keys <- tolower(trimws(colnames(rename_tbl)))
    old_idx <- match("old_population", col_keys)
    new_idx <- match("new_population", col_keys)
    if (is.na(old_idx) || is.na(new_idx)) {
      showNotification("Rename file must contain headers: old_population and new_population.",
                       type = "error", duration = 6)
      return()
    }

    old_vals <- trimws(as.character(rename_tbl[[old_idx]]))
    new_vals <- trimws(as.character(rename_tbl[[new_idx]]))

    keep <- !is.na(old_vals) & nzchar(old_vals)
    old_vals <- old_vals[keep]
    new_vals <- new_vals[keep]

    if (length(old_vals) == 0) {
      showNotification("No valid old_population values found.", type = "warning", duration = 4)
      return()
    }

    if (any(is.na(new_vals) | !nzchar(new_vals))) {
      showNotification("new_population cannot be empty for rows with old_population.",
                       type = "error", duration = 6)
      return()
    }

    dup_old <- unique(old_vals[duplicated(old_vals)])
    if (length(dup_old) > 0) {
      conflict <- vapply(dup_old, function(o) {
        length(unique(new_vals[old_vals == o])) > 1
      }, logical(1))
      if (any(conflict)) {
        bad <- dup_old[conflict]
        showNotification(
          paste0("Conflicting new_population values for: ", paste(utils::head(bad, 5), collapse = ", ")),
          type = "error", duration = 7
        )
        return()
      }
      keep_first <- !duplicated(old_vals)
      old_vals <- old_vals[keep_first]
      new_vals <- new_vals[keep_first]
    }

    rename_map <- setNames(new_vals, old_vals)
    pop_ids <- names(rv$populations)
    current_names <- vapply(pop_ids, function(pid) {
      as.character(rv$populations[[pid]]$name %||% "")
    }, character(1))

    hits <- current_names %in% names(rename_map)
    if (!any(hits)) {
      showNotification("No matching population names found in the uploaded file.",
                       type = "warning", duration = 5)
      return()
    }

    save_undo_snapshot()
    changed_ids <- pop_ids[hits]
    changed_old <- current_names[hits]
    for (k in seq_along(changed_ids)) {
      pid <- changed_ids[[k]]
      rv$populations[[pid]]$name <- rename_map[[changed_old[[k]]]]
    }

    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    autosave()

    if (!is.null(rv$current_plot_data)) send_gates_only(force_full_counts = FALSE)

    not_found <- setdiff(names(rename_map), current_names)
    msg <- paste0("Renamed ", length(changed_ids), " population(s).")
    if (length(not_found) > 0) {
      msg <- paste0(msg, " Not found: ", length(not_found), ".")
    }
    output$status_text <- renderText(msg)
    showNotification(msg, type = "message", duration = 5)
  })

  output$bulk_rename_template_dl <- downloadHandler(
    filename = function() "population_rename_template.csv",
    content = function(file) {
      req(rv$populations)
      pop_ids <- if (!is.null(rv$root_population_id) &&
                     exists("sort_pop_ids_tree", mode = "function")) {
        tryCatch(
          sort_pop_ids_tree(rv$populations, rv$root_population_id),
          error = function(e) names(rv$populations)
        )
      } else {
        names(rv$populations)
      }
      pop_names <- vapply(pop_ids, function(pid) {
        as.character(rv$populations[[pid]]$name %||% pid)
      }, character(1))
      tpl <- data.frame(
        old_population = pop_names,
        new_population = pop_names,
        stringsAsFactors = FALSE
      )
      utils::write.csv(tpl, file, row.names = FALSE)
    }
  )

  observeEvent(input$pop_tree_click, { rv$active_population_id <- input$pop_tree_click; send_full_plot() })

  output$population_tree_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$active_population_id
    rv$gate_version; rv$selected_gate_id; rv$sample_filter_key; rv$assay_version; rv$.selected_pop_ids
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) {
      return(tags$div(class = "population-tree-panel",
                      tags$em("No data loaded.", style = "color:#999; font-size:12px;")))
    }
    pop_stats <- get_population_tree_stats()
    rows <- list()
    visited <- character(0)

    # ── Tree-line connector SVG ───────────────────────────────────────────────
    # Returns a single SVG exactly depth*16 px wide — the same footprint as the
    # old pop-row-indent blank spacer — with tree lines drawn inside it.
    # is_last_path: logical[depth] where [i]=TRUE means the ancestor at depth i
    #   was the last child of its parent (draw blank at that column, not a │).
    make_tree_connectors <- function(depth, is_last_path) {
      if (depth == 0L) return(NULL)

      seg   <- 16L          # px per depth level
      total <- depth * seg  # total SVG width == old indent width
      h     <- 20L          # SVG height (matches typical row height)
      mid   <- h %/% 2L
      col   <- "#bfc5cf"
      ls    <- sprintf('stroke="%s" stroke-width="1.5" stroke-linecap="square"', col)

      ln <- function(x1, y1, x2, y2)
        sprintf('<line x1="%d" y1="%d" x2="%d" y2="%d" %s/>', x1, y1, x2, y2, ls)

      paths <- character(0)
      for (i in seq_len(depth)) {
        cx      <- (i - 1L) * seg + seg %/% 2L   # horizontal centre of column i
        is_last <- isTRUE(is_last_path[[i]])
        is_leaf <- (i == depth)

        if (is_leaf) {
          # draw the elbow that connects to this node's name
          # horizontal arm runs from cx all the way to the right edge (total)
          if (is_last) {
            paths <- c(paths,
              ln(cx, 0L, cx, mid),        # vertical top → mid  (└)
              ln(cx, mid, total, mid))    # horizontal mid → right edge
          } else {
            paths <- c(paths,
              ln(cx, 0L, cx, h),          # vertical full height  (├)
              ln(cx, mid, total, mid))    # horizontal mid → right edge
          }
        } else {
          # ancestor column: draw │ if more siblings remain, blank if last child
          if (!is_last)
            paths <- c(paths, ln(cx, 0L, cx, h))
        }
      }

      HTML(sprintf(
        '<svg width="%d" height="%d" viewBox="0 0 %d %d" style="flex-shrink:0;overflow:visible;">%s</svg>',
        total, h, total, h, paste(paths, collapse = "")
      ))
    }

    append_tree_rows <- function(pop_id, depth, is_last_path = logical(0)) {
      if (pop_id %in% visited) return()
      visited <<- c(visited, pop_id)

      pop <- rv$populations[[pop_id]]
      if (is.null(pop)) return()

      is_active <- identical(pop_id, rv$active_population_id)
      is_root <- identical(pop_id, rv$root_population_id)
      is_checked <- pop_id %in% rv$.selected_pop_ids
      count_val      <- pop_stats$event_count[[pop_id]] %||% pop$event_count
      pct_parent_val <- pop_stats$percent_of_parent[[pop_id]] %||% pop$percent_of_parent
      pct_total_val  <- pop_stats$percent_of_total[[pop_id]]
      count_text <- if (!is.null(count_val)) format(count_val, big.mark = ",") else "?"
      pct_text <- if (!is_root) {
        parts <- character(0)
        if (!is.null(pct_parent_val)) parts <- c(parts, paste0(pct_parent_val, "% pnt"))
        if (!is.null(pct_total_val))  parts <- c(parts, paste0(pct_total_val,  "% tot"))
        if (length(parts) > 0) paste0("(", paste(parts, collapse = ", "), ")") else ""
      } else ""
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

      tree_svg  <- make_tree_connectors(depth, is_last_path)
      indent_px <- depth * 16L   # kept for the gates column spacer

      rows[[length(rows) + 1L]] <<- tags$div(
        class = paste("pop-row", if (is_active) "active" else ""),
        onclick = sprintf("Shiny.setInputValue('pop_tree_click', '%s', {priority:'event'})", pop_id),
        tags$span(
          class = "pop-row-select-col",
          tags$input(
            type = "checkbox",
            class = "pop-row-select",
            checked = if (is_checked) "checked" else NULL,
            onclick = sprintf(
              "event.stopPropagation(); Shiny.setInputValue('pop_tree_toggle_select', {pop_id:'%s', checked:this.checked, nonce:Date.now()}, {priority:'event'})",
              pop_id
            )
          )
        ),
        tags$span(
          class = "pop-row-name-col",
          tree_svg,
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

      for (i in seq_along(child_ids)) {
        is_last <- (i == length(child_ids))
        append_tree_rows(child_ids[[i]], depth + 1L, c(is_last_path, is_last))
      }
    }

    append_tree_rows(rv$root_population_id, 0L)
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

    # ── Population selector at top of dialog ─────────────────────────────────
    pop_choices <- setNames(
      names(rv$populations),
      vapply(rv$populations, function(p) p$name %||% p$id, character(1))
    )
    selector_ui <- tags$div(
      class = "pop-editor-selector-row",
      selectInput("edit_pop_selector", "Population to edit:",
                  choices = pop_choices, selected = pop_id, width = "100%")
    )

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
            tags$span(class = "gate-color-swatch",
                      style = paste0("background:", gate$color,
                                     "; width:10px; height:10px; border-radius:2px;")),
            tags$span(class = "gate-ref-name", gate$name),
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
    tags$div(class = "pop-editor-panel", selector_ui, top_controls, count_ui,
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

  output$strategy_sample_contrib <- renderText({
    info <- rv$sample_info
    if (is.null(info) || is.null(info$table)) return("Contributing samples: all loaded samples")

    selected_keys <- resolve_filtered_sample_keys(info)
    all_keys <- as.character(info$keys %||% character(0))
    if (length(all_keys) == 0) return("Contributing samples: all loaded samples")

    selected_keys <- as.character(selected_keys %||% character(0))
    if (length(selected_keys) == 0) return("Contributing samples: none (current filter excludes all samples)")

    tbl <- info$table
    pick_col <- function(df, choices) {
      cn <- tolower(colnames(df))
      for (nm in choices) {
        idx <- match(tolower(nm), cn)
        if (!is.na(idx)) return(colnames(df)[idx])
      }
      NULL
    }

    label_col <- pick_col(tbl, c("file_name", "filename", "sample_name", "sample_id"))
    key_col <- pick_col(tbl, c("sample_id"))

    labels <- selected_keys
    if (!is.null(label_col) && !is.null(key_col) && key_col %in% colnames(tbl)) {
      key_vals <- as.character(tbl[[key_col]])
      label_vals <- as.character(tbl[[label_col]])
      lut <- setNames(label_vals, key_vals)
      mapped <- unname(lut[selected_keys])
      keep_mapped <- !is.na(mapped) & nzchar(mapped)
      labels <- ifelse(keep_mapped, mapped, selected_keys)
    }

    labels <- unique(as.character(labels))
    show_n <- min(6L, length(labels))
    preview <- paste(utils::head(labels, show_n), collapse = ", ")
    suffix <- if (length(labels) > show_n) paste0(" +", length(labels) - show_n, " more") else ""

    paste0("Contributing samples (", length(selected_keys), "/", length(all_keys), "): ", preview, suffix)
  })

  # Build a compact one-line context title for strategy renders.
  build_strategy_sample_scope <- function(max_names = 4L) {
    info <- rv$sample_info
    if (is.null(info) || is.null(info$table)) return("Samples: all loaded")

    selected_keys <- as.character(resolve_filtered_sample_keys(info) %||% character(0))
    all_keys <- as.character(info$keys %||% character(0))
    if (length(all_keys) == 0) return("Samples: all loaded")
    if (length(selected_keys) == 0) return("Samples: none")

    tbl <- info$table
    pick_col <- function(df, choices) {
      cn <- tolower(colnames(df))
      for (nm in choices) {
        idx <- match(tolower(nm), cn)
        if (!is.na(idx)) return(colnames(df)[idx])
      }
      NULL
    }

    label_col <- pick_col(tbl, c("file_name", "filename", "sample_name", "sample_id"))
    key_col <- pick_col(tbl, c("sample_id"))

    labels <- selected_keys
    if (!is.null(label_col) && !is.null(key_col) && key_col %in% colnames(tbl)) {
      key_vals <- as.character(tbl[[key_col]])
      label_vals <- as.character(tbl[[label_col]])
      lut <- setNames(label_vals, key_vals)
      mapped <- unname(lut[selected_keys])
      keep_mapped <- !is.na(mapped) & nzchar(mapped)
      labels <- ifelse(keep_mapped, mapped, selected_keys)
    }

    labels <- unique(as.character(labels))
    if (length(selected_keys) == length(all_keys)) {
      return(paste0("Samples: all (", length(all_keys), ")"))
    }

    show_n <- min(max_names, length(labels))
    preview <- paste(utils::head(labels, show_n), collapse = ", ")
    suffix <- if (length(labels) > show_n) paste0(" +", length(labels) - show_n) else ""
    paste0("Samples: ", preview, suffix)
  }

  build_strategy_population_scope <- function(pop_names, max_names = 4L) {
    pop_names <- unique(as.character(pop_names %||% character(0)))
    pop_names <- pop_names[nzchar(pop_names)]
    if (length(pop_names) == 0) return("Populations: none")
    label <- if (length(pop_names) == 1L) "Population" else "Populations"
    show_n <- min(max_names, length(pop_names))
    preview <- paste(utils::head(pop_names, show_n), collapse = ", ")
    suffix <- if (length(pop_names) > show_n) paste0(" +", length(pop_names) - show_n) else ""
    paste0(label, ": ", preview, suffix)
  }

  build_strategy_context_title <- function(pop_names) {
    paste0(
      build_strategy_sample_scope(max_names = 4L),
      " | ",
      build_strategy_population_scope(pop_names, max_names = 4L)
    )
  }

  .clamp_int <- function(value, default, lo, hi) {
    out <- suppressWarnings(as.integer(value))
    if (is.na(out)) out <- as.integer(default)
    max(as.integer(lo), min(as.integer(hi), out))
  }

  .clamp_num <- function(value, default, lo, hi) {
    out <- suppressWarnings(as.numeric(value))
    if (!is.finite(out)) out <- as.numeric(default)
    max(as.numeric(lo), min(as.numeric(hi), out))
  }

  .normalize_display_mode <- function(mode_raw) {
    mode_chr <- tolower(as.character(mode_raw %||% "pseudocolor"))
    switch(
      mode_chr,
      pseudo = "pseudocolor",
      pseudocolour = "pseudocolor",
      pseudocolor = "pseudocolor",
      contour = "contour",
      scatter = "scatter",
      "scatter"
    )
  }

  collect_plot_style_params <- function(scope = c("strategy", "illustration"),
                                        plot_type = "biplot",
                                        gate_view = NULL) {
    scope <- match.arg(scope)
    is_strategy <- identical(scope, "strategy")

    if (!is_strategy && !plot_type %in% c("biplot", "histogram")) {
      plot_type <- "biplot"
    }

    mode <- .normalize_display_mode(if (is_strategy) input$strategy_display else input$illust_display)
    if (!is_strategy && identical(plot_type, "histogram")) {
      mode <- "scatter"
    }
    if (is_strategy) {
      gv <- as.character(gate_view %||% input$strategy_gate_view %||% "forward")
      show_forward <- "forward" %in% gv
      show_back <- "back" %in% gv
      if (!show_forward && !show_back) show_forward <- TRUE
      if (show_forward && show_back && identical(mode, "pseudocolor")) mode <- "scatter"
    }

    tick_font <- .clamp_int(
      if (is_strategy) input$strategy_tick_font_size else input$illust_tick_font_size,
      default = 8L, lo = 6L, hi = 24L
    )
    axis_font <- .clamp_int(
      if (is_strategy) input$strategy_axis_label_font_size else input$illust_axis_label_font_size,
      default = 10L, lo = 6L, hi = 28L
    )
    title_font <- .clamp_int(
      if (is_strategy) input$strategy_title_font_size else input$illust_title_font_size,
      default = 10L, lo = 6L, hi = 28L
    )
    gate_label_font <- .clamp_int(
      if (is_strategy) input$strategy_gate_label_font_size else input$illust_gate_label_font_size,
      default = 8L, lo = 6L, hi = 24L
    )

    contour_threshold <- .clamp_num(
      if (is_strategy) input$strategy_contour_threshold else input$contour_threshold,
      default = 5, lo = 0, hi = 100
    )
    point_alpha <- .clamp_num(
      if (is_strategy) input$strategy_point_alpha else input$illust_point_alpha,
      default = 0.35, lo = 0.05, hi = 1
    )
    point_size <- .clamp_num(
      if (is_strategy) input$strategy_point_size else input$illust_point_size,
      default = 1.2, lo = 0.1, hi = 5
    )
    kde_bandwidth <- .clamp_num(
      if (is_strategy) input$strategy_kde_bandwidth else input$illust_kde_bandwidth,
      default = 0, lo = 0, hi = 20
    )

    gate_line_width <- .clamp_num(
      if (is_strategy) input$strategy_gate_line_width else input$illust_gate_line_width,
      default = 1.5, lo = 0.5, hi = 5
    )

    hist_line_width <- if (is_strategy) {
      1.8
    } else {
      .clamp_num(input$illust_hist_line_width, default = 1.8, lo = 0.5, hi = 6)
    }
    hist_fill <- if (is_strategy) FALSE else isTRUE(input$illust_hist_fill)
    hist_fill_alpha <- if (is_strategy) {
      0.22
    } else {
      .clamp_num(input$illust_hist_fill_alpha, default = 0.22, lo = 0, hi = 1)
    }
    hist_overlay_mode <- if (is_strategy) {
      "front_opaque"
    } else {
      hm <- as.character(input$illust_hist_overlay_mode %||% "front_opaque")
      if (hm %in% c("blend", "front_opaque")) hm else "front_opaque"
    }

    list(
      display_mode = mode,
      contour_threshold = contour_threshold,
      point_alpha = point_alpha,
      point_size = point_size,
      kde_bandwidth = kde_bandwidth,
      font_sizes = list(
        axis_label = axis_font,
        tick = tick_font,
        gate_label = gate_label_font,
        title = title_font
      ),
      gate_style = list(
        pub_style = if (is_strategy) isTRUE(input$strategy_pub_style) else isTRUE(input$illust_pub_style),
        line_width = gate_line_width
      ),
      hist_line_width = hist_line_width,
      hist_fill = hist_fill,
      hist_fill_alpha = hist_fill_alpha,
      hist_overlay_mode = hist_overlay_mode
    )
  }

  collect_layout_params <- function(scope = c("strategy", "illustration")) {
    scope <- match.arg(scope)
    is_strategy <- identical(scope, "strategy")

    fit_to_columns <- if (is_strategy) isTRUE(input$strategy_fit_to_columns) else isTRUE(input$illust_fit_to_columns)
    effective_plot_size <- suppressWarnings(as.integer(
      if (is_strategy) input$strategy_effective_plot_size else input$illustration_effective_plot_size
    ))
    if (is.na(effective_plot_size) || effective_plot_size < 60L || effective_plot_size > 4000L) {
      effective_plot_size <- NA_integer_
    }
    control_plot_size <- .clamp_int(
      if (is_strategy) input$strategy_plot_size else input$illust_plot_size,
      default = 200L, lo = 120L, hi = 800L
    )
    export_plot_size <- if (fit_to_columns && !is.na(effective_plot_size)) {
      max(120L, min(800L, effective_plot_size))
    } else {
      control_plot_size
    }

    list(
      plot_size = control_plot_size,
      n_columns = .clamp_int(
        if (is_strategy) input$strategy_n_columns else input$illust_n_columns,
        default = 4L, lo = 1L, hi = 12L
      ),
      fit_to_columns = fit_to_columns,
      effective_plot_size = effective_plot_size,
      export_plot_size = export_plot_size,
      pdf_dpi = .clamp_int(
        if (is_strategy) input$strategy_pdf_dpi else input$illust_pdf_dpi,
        default = 300L, lo = 72L, hi = 1200L
      )
    )
  }

  observeEvent(input$strategy_gate_view, {
    vals <- as.character(input$strategy_gate_view %||% character(0))
    show_forward <- "forward" %in% vals
    show_back <- "back" %in% vals
    if (!show_forward && !show_back) {
      updateCheckboxGroupInput(session, "strategy_gate_view", selected = "forward")
      vals <- "forward"
      show_forward <- TRUE
      show_back <- FALSE
    }

    if (show_forward && show_back) {
      choices <- c("Scatter" = "scatter", "Contour" = "contour")
      selected <- input$strategy_display %||% "scatter"
      if (!selected %in% unname(choices)) selected <- "scatter"
      updateRadioButtons(session, "strategy_display", choices = choices, selected = selected)
    } else {
      choices <- c("Scatter" = "scatter", "Pseudo" = "pseudocolor", "Contour" = "contour")
      selected <- input$strategy_display %||% "pseudocolor"
      if (!selected %in% unname(choices)) selected <- "scatter"
      updateRadioButtons(session, "strategy_display", choices = choices, selected = selected)
    }
  }, ignoreInit = TRUE)

  render_strategy_tab <- function() {
    pop_id <- input$strategy_pop
    assay_for_strategy <- get_filtered_assay_data()
    req(pop_id, nchar(pop_id) > 0, assay_for_strategy)

    strategy_max_events <- suppressWarnings(as.integer(input$strategy_max_events %||% 10000L))
    if (is.na(strategy_max_events)) strategy_max_events <- 10000L
    if (isTRUE(input$strategy_all_events) || strategy_max_events <= 0L) {
      strategy_max_events <- Inf
    }

    layout <- collect_layout_params("strategy")
    strategy_plot_size <- layout$plot_size
    strategy_n_columns <- layout$n_columns
    strategy_fit_to_columns <- layout$fit_to_columns
    strategy_span_scale <- 1.2
    strategy_axis_mode <- "default"

    strategy_gate_view <- as.character(input$strategy_gate_view %||% "forward")
    show_forward <- "forward" %in% strategy_gate_view
    show_back <- "back" %in% strategy_gate_view
    if (!show_forward && !show_back) {
      show_forward <- TRUE
      strategy_gate_view <- "forward"
    }

    style <- collect_plot_style_params("strategy", gate_view = strategy_gate_view)
    strategy_mode <- style$display_mode
    strategy_font_sizes <- style$font_sizes
    strategy_context_title <- build_strategy_context_title(as.character(rv$populations[[pop_id]]$name %||% pop_id))
    strategy_context_title_font <- max(8L, min(24L, as.integer(strategy_font_sizes$title %||% 10L) + 1L))

    if (nrow(assay_for_strategy) == 0) {
      session$sendCustomMessage("renderStrategyGrid", list(
        containerId = "strategy-grid-container",
        steps = list(),
        strategy_context_title = strategy_context_title,
        strategy_context_title_font = strategy_context_title_font,
        plot_size = strategy_plot_size,
        n_columns = strategy_n_columns,
        fit_to_columns = strategy_fit_to_columns,
        display_mode = strategy_mode,
        contour_threshold = style$contour_threshold,
        point_alpha = style$point_alpha,
        point_size = style$point_size,
        kde_bandwidth = style$kde_bandwidth,
        hist_line_width = style$hist_line_width,
        hist_fill = style$hist_fill,
        hist_fill_alpha = style$hist_fill_alpha,
        hist_overlay_mode = style$hist_overlay_mode,
        font_sizes = strategy_font_sizes,
        gate_style = style$gate_style
      ))
      return()
    }

    # Use display-space gate vertices so they match assay_data (display coords)
    display_gates <- get_plot_gates()
    steps <- compute_gating_strategy(
      display_gates, rv$populations, rv$root_population_id,
      assay_for_strategy, pop_id,
      full_path = input$strategy_full_path %||% FALSE,
      max_events = strategy_max_events
    )

    back_events <- NULL
    if (show_back) {
      strategy_result <- apply_gating_strategy(display_gates, rv$populations, rv$root_population_id, assay_for_strategy)
      back_mask <- strategy_result$masks[[pop_id]]
      if (!is.null(back_mask) && length(back_mask) == nrow(assay_for_strategy) && any(back_mask)) {
        back_events <- assay_for_strategy[back_mask, , drop = FALSE]
      }
    }

    if (length(steps) == 0) {
      session$sendCustomMessage("renderStrategyGrid", list(
        containerId = "strategy-grid-container",
        steps = list(),
        strategy_context_title = strategy_context_title,
        strategy_context_title_font = strategy_context_title_font,
        plot_size = strategy_plot_size,
        n_columns = strategy_n_columns,
        fit_to_columns = strategy_fit_to_columns,
        display_mode = strategy_mode,
        contour_threshold = style$contour_threshold,
        point_alpha = style$point_alpha,
        point_size = style$point_size,
        kde_bandwidth = style$kde_bandwidth,
        hist_line_width = style$hist_line_width,
        hist_fill = style$hist_fill,
        hist_fill_alpha = style$hist_fill_alpha,
        hist_overlay_mode = style$hist_overlay_mode,
        font_sizes = strategy_font_sizes,
        gate_style = style$gate_style
      ))
      return()
    }

    strategy_channels <- unique(c(
      vapply(steps, function(s) as.character(s$x_channel %||% ""), character(1)),
      vapply(steps, function(s) as.character(s$y_channel %||% ""), character(1))
    ))
    strategy_channels <- strategy_channels[nzchar(strategy_channels)]
    .strategy_global_range <- function(ch) {
      gs <- rv$global_scale_ranges[[ch]]
      if (is.null(gs)) return(NULL)
      lo <- suppressWarnings(as.numeric(gs$lo %||% NA))
      hi <- suppressWarnings(as.numeric(gs$hi %||% NA))
      if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)
      c(lo, hi)
    }
    stable_range_by_channel <- setNames(lapply(strategy_channels, function(ch) {
      gs_rng <- .strategy_global_range(ch)
      if (!is.null(gs_rng)) return(gs_rng)
      compute_range_from_values(
        get_filtered_channel_values(ch, for_plot = TRUE),
        channel = ch,
        span_scale = strategy_span_scale
      )
    }), strategy_channels)

    # Convert R lists to JSON-friendly format
    steps_json <- lapply(steps, function(s) {
      x_forward <- unname(as.numeric(s$x))
      y_forward <- unname(as.numeric(s$y))

      x_back <- numeric(0)
      y_back <- numeric(0)
      if (show_back && !is.null(back_events) && nrow(back_events) > 0) {
        x_back <- as.numeric(back_events[, s$x_channel])
        y_back <- as.numeric(back_events[, s$y_channel])
        if (is.finite(strategy_max_events) && length(x_back) > strategy_max_events) {
          idx <- unique(as.integer(round(seq.int(1L, length(x_back), length.out = as.integer(strategy_max_events)))))
          idx <- idx[idx >= 1L & idx <= length(x_back)]
          if (length(idx) > 0) {
            x_back <- x_back[idx]
            y_back <- y_back[idx]
          }
        }
      }

      x_main <- if (show_forward) x_forward else unname(as.numeric(x_back))
      y_main <- if (show_forward) y_forward else unname(as.numeric(y_back))

      x_range_step <- stable_range_by_channel[[as.character(s$x_channel)]] %||% s$x_range
      y_range_step <- stable_range_by_channel[[as.character(s$y_channel)]] %||% s$y_range

      # Expand to include gate vertices + label position so everything stays in view
      step_verts <- s$vertices %||% list()
      if (length(step_verts) > 0) {
        vx_s <- vapply(step_verts, .vertex_coord, numeric(1), idx = 1L)
        vy_s <- vapply(step_verts, .vertex_coord, numeric(1), idx = 2L)
        x_range_step <- expand_range_for_vertices(x_range_step, vx_s)
        y_range_step <- expand_range_for_vertices(y_range_step, vy_s)
        # Include label position (centroid + offset) with padding
        lo <- s$label_offset
        if (!is.null(lo)) {
          cx <- mean(vx_s, na.rm = TRUE); cy <- mean(vy_s, na.rm = TRUE)
          ox <- if (is.list(lo)) as.numeric(lo[[1]] %||% 0) else as.numeric(lo[1])
          oy <- if (is.list(lo)) as.numeric(lo[[2]] %||% 0) else as.numeric(lo[2])
          if (is.finite(ox) && is.finite(cx)) x_range_step <- expand_range_for_vertices(x_range_step, cx + ox)
          if (is.finite(oy) && is.finite(cy)) y_range_step <- expand_range_for_vertices(y_range_step, cy + oy)
        }
      }

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
        x = x_main,
        y = y_main,
        x_back = if (show_forward && show_back) unname(as.numeric(x_back)) else numeric(0),
        y_back = if (show_forward && show_back) unname(as.numeric(y_back)) else numeric(0),
        x_range = x_range_step,
        y_range = y_range_step,
        n_before = s$n_before,
        n_after = s$n_after,
        pct_pass = s$pct_pass,
        pct_total = s$pct_total
      )
    })

    if (identical(strategy_axis_mode, "rescaled") && length(steps_json) > 0) {
      existing_override <- rv$strategy_axis_override
      override_ranges <- if (is.list(existing_override$ranges)) existing_override$ranges else (existing_override %||% list())
      updated_ranges <- list()
      override_changed <- FALSE

      for (i in seq_along(steps_json)) {
        st <- steps_json[[i]]
        step_key <- paste0(as.character(st$gate_id %||% ""), "|",
                           as.character(st$x_channel %||% ""), "|",
                           as.character(st$y_channel %||% ""))
        ov <- override_ranges[[step_key]]

        has_ov <- is.list(ov) &&
          length(ov$x_range %||% numeric(0)) == 2 &&
          length(ov$y_range %||% numeric(0)) == 2 &&
          all(is.finite(as.numeric(ov$x_range))) &&
          all(is.finite(as.numeric(ov$y_range)))

        if (isTRUE(has_ov)) {
          st$x_range <- unname(as.numeric(ov$x_range))
          st$y_range <- unname(as.numeric(ov$y_range))
        } else {
          x_for_range <- as.numeric(st$x %||% numeric(0))
          y_for_range <- as.numeric(st$y %||% numeric(0))
          if (show_forward && show_back) {
            x_for_range <- c(x_for_range, as.numeric(st$x_back %||% numeric(0)))
            y_for_range <- c(y_for_range, as.numeric(st$y_back %||% numeric(0)))
          }

          if (sum(is.finite(x_for_range)) > 0) {
            st$x_range <- compute_range_from_values(
              x_for_range,
              channel = st$x_channel,
              span_scale = strategy_span_scale
            )
          }
          if (sum(is.finite(y_for_range)) > 0) {
            st$y_range <- compute_range_from_values(
              y_for_range,
              channel = st$y_channel,
              span_scale = strategy_span_scale
            )
          }
          # Expand for gate vertices in rescaled initial computation too
          ov_verts <- st$vertices %||% list()
          if (length(ov_verts) > 0) {
            vx_ov <- vapply(ov_verts, .vertex_coord, numeric(1), idx = 1L)
            vy_ov <- vapply(ov_verts, .vertex_coord, numeric(1), idx = 2L)
            st$x_range <- expand_range_for_vertices(st$x_range, vx_ov)
            st$y_range <- expand_range_for_vertices(st$y_range, vy_ov)
          }
          override_changed <- TRUE
        }

        updated_ranges[[step_key]] <- list(
          x_range = unname(as.numeric(st$x_range)),
          y_range = unname(as.numeric(st$y_range))
        )
        steps_json[[i]] <- st
      }

      if (isTRUE(override_changed) || length(updated_ranges) != length(override_ranges)) {
        rv$strategy_axis_override <- list(ranges = updated_ranges)
      }
    }

    # Attach log-style decade ticks (logicle for flow, asinh for CyTOF)
    if (!is.null(rv$sce) && rv$assay_name == "exprs" && length(steps_json) > 0) {
      steps_json <- lapply(steps_json, function(st) {
        for (axis in c("x", "y")) {
          ch <- as.character(st[[paste0(axis, "_channel")]] %||% "")
          ax_range <- st[[paste0(axis, "_range")]]
          ticks <- generate_channel_ticks(ch, ax_range)
          if (!is.null(ticks)) {
            st[[paste0(axis, "_logicle_ticks")]] <- ticks
            st[[paste0(axis, "_is_logicle")]] <- TRUE
          }
        }
        st
      })
    }

    # Cache payload for server-side PDF export
    rv$.strategy_pdf_payload <- list(
      mode = "single",
      strategy_context_title = strategy_context_title,
      strategy_context_title_font = strategy_context_title_font,
      steps = steps_json,
      plot_size = strategy_plot_size,
      n_columns = strategy_n_columns,
      fit_to_columns = strategy_fit_to_columns,
      gate_view = strategy_gate_view,
      display_mode = strategy_mode,
      contour_threshold = style$contour_threshold,
      point_alpha = style$point_alpha,
      point_size = style$point_size,
      kde_bandwidth = style$kde_bandwidth,
      hist_line_width = style$hist_line_width,
      hist_fill = style$hist_fill,
      hist_fill_alpha = style$hist_fill_alpha,
      hist_overlay_mode = style$hist_overlay_mode,
      font_sizes = strategy_font_sizes,
      gate_style = style$gate_style
    )

    session$sendCustomMessage("renderStrategyGrid", list(
      containerId = "strategy-grid-container",
      steps = steps_json,
      strategy_context_title = strategy_context_title,
      strategy_context_title_font = strategy_context_title_font,
      plot_size = strategy_plot_size,
      n_columns = strategy_n_columns,
      fit_to_columns = strategy_fit_to_columns,
      gate_view = strategy_gate_view,
      display_mode = strategy_mode,
      contour_threshold = style$contour_threshold,
      point_alpha = style$point_alpha,
      point_size = style$point_size,
      kde_bandwidth = style$kde_bandwidth,
      hist_line_width = style$hist_line_width,
      hist_fill = style$hist_fill,
      hist_fill_alpha = style$hist_fill_alpha,
      hist_overlay_mode = style$hist_overlay_mode,
      font_sizes = strategy_font_sizes,
      gate_style = style$gate_style
    ))
  }

  # ── Multi-population strategy hint ────────────────────────────────────────
  output$strategy_multi_pop_hint <- renderText({
    # Count combined selection from selectizeInput + checkboxes
    sel_ids <- unique(c(
      as.character(input$strategy_multi_pop_select %||% character(0)),
      rv$.selected_pop_ids %||% character(0)
    ))
    sel_ids <- intersect(sel_ids, setdiff(names(rv$populations %||% list()), rv$root_population_id %||% character(0)))
    n <- length(sel_ids)
    if (n == 0) "None selected." else paste0(n, " population", if (n != 1) "s" else "", " selected.")
  })

  # ── Update multi-pop selectize choices when populations change ────────────
  observe({
    # Depend on populations reactively WITHOUT req() so the observer still runs
    # (and clears choices) when populations become empty.
    pops <- rv$populations
    root <- rv$root_population_id
    rv$gate_version  # retrigger when gates/populations mutate
    pop_ids <- setdiff(names(pops %||% list()), root %||% character(0))
    if (length(pop_ids) == 0) {
      updateSelectizeInput(session, "strategy_multi_pop_select",
                           choices = character(0), selected = character(0))
      return()
    }
    pop_names <- vapply(pop_ids, function(id) pops[[id]]$name %||% id, character(1))
    pop_choices <- setNames(pop_ids, pop_names)
    pop_choices <- pop_choices[order(tolower(pop_names))]
    # Preserve any existing selection that is still valid
    current_sel <- isolate(as.character(input$strategy_multi_pop_select %||% character(0)))
    valid_sel <- intersect(current_sel, pop_ids)
    updateSelectizeInput(session, "strategy_multi_pop_select",
                         choices = pop_choices, selected = valid_sel)
  })

  # Sync selectizeInput with checkbox selections (when user checks boxes on Gating tab)
  observe({
    ids <- rv$.selected_pop_ids %||% character(0)
    cur <- as.character(input$strategy_multi_pop_select %||% character(0))
    combined <- unique(c(cur, ids))
    combined <- intersect(combined, setdiff(names(rv$populations %||% list()), rv$root_population_id %||% character(0)))
    if (!setequal(combined, cur)) {
      updateSelectizeInput(session, "strategy_multi_pop_select", selected = combined)
    }
  })

  # ── Multi-population strategy computation ─────────────────────────────────
  # Builds a merged strategy tree for multiple populations.
  # Returns a named list of nodes: each node = one scatter plot panel,
  # covering a unique (parent_pop × x_channel × y_channel) combination.
  compute_multi_pop_strategy <- function(gates, populations, root_pop_id,
                                          assay_data, selected_pop_ids,
                                          max_events = 10000L,
                                          span_scale = 1.2) {
    if (length(selected_pop_ids) == 0 || nrow(assay_data) == 0) return(list())
    max_events_int <- suppressWarnings(as.integer(max_events))
    use_all <- is.na(max_events_int) || !is.finite(max_events) || max_events_int <= 0L

    gating_result <- apply_gating_strategy(gates, populations, root_pop_id, assay_data)

    # Collect all relevant population IDs (selected pops + all their ancestors)
    relevant_ids <- character(0)
    for (sel_id in selected_pop_ids) {
      if (!sel_id %in% names(populations)) next
      current <- sel_id
      repeat {
        relevant_ids <- c(relevant_ids, current)
        if (identical(current, root_pop_id)) break
        parent <- populations[[current]]$parent_id
        if (is.null(parent)) break
        current <- parent
      }
    }
    relevant_ids <- unique(relevant_ids)

    # Build raw node map: key = "parent_id|x_ch|y_ch"
    # Each node collects gate overlays from all relevant child populations
    nodes_raw <- list()
    for (pop_id in relevant_ids) {
      if (identical(pop_id, root_pop_id)) next
      pop <- populations[[pop_id]]
      if (is.null(pop)) next
      parent_id <- pop$parent_id
      if (is.null(parent_id)) next
      if (!parent_id %in% relevant_ids && !identical(parent_id, root_pop_id)) next
      for (ref in (pop$gate_refs %||% list())) {
        gate <- gates[[ref$gate_id]]
        if (is.null(gate)) next
        node_key <- paste0(parent_id, "|", gate$x_channel, "|", gate$y_channel)
        if (is.null(nodes_raw[[node_key]])) {
          nodes_raw[[node_key]] <- list(
            parent_id = parent_id,
            x_channel = gate$x_channel,
            y_channel = gate$y_channel,
            gate_entries = list()
          )
        }
        existing_ids <- vapply(nodes_raw[[node_key]]$gate_entries,
                               function(g) g$gate_id, character(1))
        if (!ref$gate_id %in% existing_ids) {
          nodes_raw[[node_key]]$gate_entries <- c(
            nodes_raw[[node_key]]$gate_entries,
            list(list(
              gate_id = ref$gate_id,
              name    = pop$name %||% pop_id,
              gate_type   = gate$gate_type,
              vertices    = gate$vertices,
              color       = gate$color,
              label_offset = gate$label_offset,
              include     = ref$include
            ))
          )
        }
      }
    }
    if (length(nodes_raw) == 0) return(list())

    # Column = total gates applied from root to reach parent_id's events
    get_gate_depth <- function(pop_id) {
      if (identical(pop_id, root_pop_id)) return(0L)
      depth <- 0L
      current <- pop_id
      while (!is.null(current) && !identical(current, root_pop_id)) {
        pp <- populations[[current]]
        if (is.null(pp)) break
        depth <- depth + length(pp$gate_refs %||% list())
        current <- pp$parent_id
      }
      depth
    }

    # Row = DFS order of selected populations in the tree
    ordered_selected <- character(0)
    visit_pop <- function(pid) {
      if (pid %in% selected_pop_ids) ordered_selected <<- c(ordered_selected, pid)
      children <- names(populations)[vapply(populations, function(p)
        identical(p$parent_id %||% "", pid), logical(1))]
      if (length(children) > 1) {
        cn <- vapply(children, function(cid) populations[[cid]]$name %||% cid, character(1))
        children <- children[order(tolower(cn))]
      }
      for (child in children) if (child %in% relevant_ids) visit_pop(child)
    }
    visit_pop(root_pop_id)
    if (length(ordered_selected) == 0) ordered_selected <- selected_pop_ids

    sel_row <- setNames(seq_along(ordered_selected) - 1L, ordered_selected)

    get_pop_row <- function(pop_id) {
      if (pop_id %in% names(sel_row)) return(sel_row[[pop_id]])
      desc_rows <- integer(0)
      for (sid in names(sel_row)) {
        cur <- sid
        while (!is.null(cur)) {
          if (identical(cur, pop_id)) { desc_rows <- c(desc_rows, sel_row[[sid]]); break }
          cur <- populations[[cur]]$parent_id
        }
      }
      if (length(desc_rows) > 0) min(desc_rows) else 0L
    }

    # Compact rows (remove gaps)
    all_raw_rows <- vapply(names(nodes_raw),
                           function(k) get_pop_row(nodes_raw[[k]]$parent_id), integer(1))
    unique_rows  <- sort(unique(all_raw_rows))
    row_map      <- setNames(seq_along(unique_rows) - 1L, as.character(unique_rows))

    # Build result nodes with event data
    result_nodes <- list()
    for (node_key in names(nodes_raw)) {
      nr        <- nodes_raw[[node_key]]
      parent_id <- nr$parent_id
      parent_pop <- populations[[parent_id]] %||% list(name = parent_id)

      parent_mask <- if (identical(parent_id, root_pop_id)) {
        rep(TRUE, nrow(assay_data))
      } else {
        gating_result$masks[[parent_id]]
      }
      if (is.null(parent_mask) || !any(parent_mask, na.rm = TRUE)) next
      n_total <- sum(parent_mask, na.rm = TRUE)

      pidx <- which(parent_mask)
      if (!use_all && length(pidx) > max_events_int) {
        pidx <- pidx[round(seq(1, length(pidx), length.out = max_events_int))]
      }
      x_ch <- nr$x_channel; y_ch <- nr$y_channel
      if (!x_ch %in% colnames(assay_data) || !y_ch %in% colnames(assay_data)) next

      pd     <- assay_data[pidx, , drop = FALSE]
      x_vals <- as.numeric(pd[, x_ch])
      y_vals <- as.numeric(pd[, y_ch])

      x_range <- compute_range_from_values(x_vals, channel = x_ch, span_scale = span_scale)
      y_range <- compute_range_from_values(y_vals, channel = y_ch, span_scale = span_scale)
      # Compute percent_of_parent for each gate entry and expand axis range for gate vertices
      for (gi in seq_along(nr$gate_entries)) {
        ge <- nr$gate_entries[[gi]]
        # Compute gate percentage on parent events
        gate_def <- gates[[ge$gate_id]]
        if (!is.null(gate_def) && n_total > 0) {
          gate_mask <- get_gate_mask(gate_def, assay_data)
          if (isTRUE(ge$include)) {
            child_mask <- parent_mask & gate_mask
          } else {
            child_mask <- parent_mask & !gate_mask
          }
          pct <- round(sum(child_mask, na.rm = TRUE) / n_total * 100, 1)
          nr$gate_entries[[gi]]$percent_of_parent <- pct
        }
        verts <- ge$vertices %||% list()
        if (length(verts) > 0) {
          gvx <- vapply(verts, .vertex_coord, numeric(1), idx = 1L)
          gvy <- vapply(verts, .vertex_coord, numeric(1), idx = 2L)
          x_range <- expand_range_for_vertices(x_range, gvx)
          y_range <- expand_range_for_vertices(y_range, gvy)
          # Include label position (centroid + offset)
          lo <- ge$label_offset
          if (!is.null(lo)) {
            cx <- mean(gvx, na.rm = TRUE); cy <- mean(gvy, na.rm = TRUE)
            ox <- if (is.list(lo)) as.numeric(lo[[1]] %||% 0) else as.numeric(lo[1])
            oy <- if (is.list(lo)) as.numeric(lo[[2]] %||% 0) else as.numeric(lo[2])
            if (is.finite(ox) && is.finite(cx)) x_range <- expand_range_for_vertices(x_range, cx + ox)
            if (is.finite(oy) && is.finite(cy)) y_range <- expand_range_for_vertices(y_range, cy + oy)
          }
        }
      }

      raw_row     <- get_pop_row(parent_id)
      compact_row <- row_map[[as.character(raw_row)]] %||% raw_row

      result_nodes[[node_key]] <- list(
        node_id         = node_key,
        parent_pop_id   = parent_id,
        parent_pop_name = parent_pop$name %||% parent_id,
        x_channel       = x_ch,
        y_channel       = y_ch,
        x               = x_vals,
        y               = y_vals,
        x_range         = x_range,
        y_range         = y_range,
        gates           = nr$gate_entries,
        col             = get_gate_depth(parent_id),
        row             = compact_row,
        n_events        = n_total
      )
    }

    # ── Resolve (row, col) collisions ─────────────────────────────────────
    # When a parent population has children gated on different channel pairs,
    # all those nodes get identical (row, col) because both coordinates depend
    # solely on parent_id.  Fix by walking each row in col order and bumping
    # any duplicate col to the next free slot — preserving relative ordering
    # (deterministic tie-break: sort by node_key so the result is stable).
    if (length(result_nodes) > 1) {
      row_vals <- vapply(result_nodes, function(n) n$row, integer(1))
      for (row_val in unique(row_vals)) {
        nks_in_row <- names(result_nodes)[row_vals == row_val]
        if (length(nks_in_row) < 2) next
        cols_in_row <- vapply(nks_in_row, function(k) result_nodes[[k]]$col, integer(1))
        # Sort: primary = col, secondary = node_key (deterministic tie-break)
        ord         <- order(cols_in_row, nks_in_row)
        nks_in_row  <- nks_in_row[ord]
        cols_in_row <- cols_in_row[ord]
        prev_col    <- -1L
        for (j in seq_along(nks_in_row)) {
          new_col <- max(cols_in_row[j], prev_col + 1L)
          result_nodes[[nks_in_row[j]]]$col <- new_col
          prev_col <- new_col
        }
      }
    }

    result_nodes
  }

  render_multi_strategy_tab <- function() {
    # Combine selectizeInput selection with checkbox-based selection from Gating tab
    selectize_sel <- as.character(input$strategy_multi_pop_select %||% character(0))
    checkbox_sel  <- as.character(rv$.selected_pop_ids %||% character(0))
    selected_pop_ids <- unique(c(selectize_sel, checkbox_sel))
    selected_pop_ids <- intersect(selected_pop_ids, names(rv$populations %||% list()))
    selected_pop_ids <- setdiff(selected_pop_ids, rv$root_population_id %||% character(0))
    selected_pop_names <- if (length(selected_pop_ids) > 0) {
      vapply(selected_pop_ids, function(pid) as.character(rv$populations[[pid]]$name %||% pid), character(1))
    } else {
      character(0)
    }
    strategy_gate_view_m <- as.character(input$strategy_gate_view %||% "forward")
    style <- collect_plot_style_params("strategy", gate_view = strategy_gate_view_m)
    layout <- collect_layout_params("strategy")
    strategy_context_title <- build_strategy_context_title(selected_pop_names)
    strategy_context_title_font <- max(8L, min(24L, as.integer(style$font_sizes$title %||% 10L) + 1L))

    message("[strategy multi] selectize=", length(selectize_sel),
            " checkbox=", length(checkbox_sel),
            " combined=", length(selected_pop_ids))

    assay_data <- get_filtered_assay_data()

    if (is.null(assay_data) || nrow(assay_data) == 0) {
      message("[strategy multi] no assay data available")
      session$sendCustomMessage("renderMultiStrategyGrid", list(
        containerId = "strategy-grid-container",
        strategy_context_title = strategy_context_title,
        strategy_context_title_font = strategy_context_title_font,
        nodes = list(), plot_size = layout$plot_size, display_mode = style$display_mode,
        contour_threshold = style$contour_threshold,
        point_alpha = style$point_alpha,
        point_size = style$point_size,
        kde_bandwidth = style$kde_bandwidth,
        hist_line_width = style$hist_line_width,
        hist_fill = style$hist_fill,
        hist_fill_alpha = style$hist_fill_alpha,
        hist_overlay_mode = style$hist_overlay_mode,
        font_sizes = style$font_sizes,
        gate_style = style$gate_style,
        error_msg = "No data available. Load a dataset first."
      ))
      return()
    }

    if (length(selected_pop_ids) == 0) {
      message("[strategy multi] no populations selected")
      session$sendCustomMessage("renderMultiStrategyGrid", list(
        containerId = "strategy-grid-container",
        strategy_context_title = strategy_context_title,
        strategy_context_title_font = strategy_context_title_font,
        nodes = list(), plot_size = layout$plot_size, display_mode = style$display_mode,
        contour_threshold = style$contour_threshold,
        point_alpha = style$point_alpha,
        point_size = style$point_size,
        kde_bandwidth = style$kde_bandwidth,
        hist_line_width = style$hist_line_width,
        hist_fill = style$hist_fill,
        hist_fill_alpha = style$hist_fill_alpha,
        hist_overlay_mode = style$hist_overlay_mode,
        font_sizes = style$font_sizes,
        gate_style = style$gate_style,
        error_msg = "No populations selected. Choose one or more populations from the dropdown above, or tick checkboxes in the Populations panel on the Gating tab, then click Render."
      ))
      return()
    }

    strategy_max_events <- suppressWarnings(as.integer(input$strategy_max_events %||% 10000L))
    if (is.na(strategy_max_events)) strategy_max_events <- 10000L
    if (isTRUE(input$strategy_all_events) || strategy_max_events <= 0L) strategy_max_events <- Inf

    strategy_plot_size <- layout$plot_size

    strategy_span_scale <- 1.2
    use_global_scales_strategy <- TRUE
    strategy_mode <- style$display_mode
    strategy_font_sizes <- style$font_sizes

    display_gates <- get_plot_gates()

    nodes_list <- compute_multi_pop_strategy(
      display_gates, rv$populations, rv$root_population_id,
      assay_data, selected_pop_ids,
      max_events  = strategy_max_events,
      span_scale  = strategy_span_scale
    )

    if (length(nodes_list) == 0) {
      message("[strategy multi] compute_multi_pop_strategy returned 0 nodes")
      session$sendCustomMessage("renderMultiStrategyGrid", list(
        containerId = "strategy-grid-container",
        strategy_context_title = strategy_context_title,
        strategy_context_title_font = strategy_context_title_font,
        nodes = list(),
        plot_size = strategy_plot_size,
        display_mode = strategy_mode,
        font_sizes = strategy_font_sizes,
        contour_threshold = style$contour_threshold,
        point_alpha = style$point_alpha,
        point_size = style$point_size,
        kde_bandwidth = style$kde_bandwidth,
        hist_line_width = style$hist_line_width,
        hist_fill = style$hist_fill,
        hist_fill_alpha = style$hist_fill_alpha,
        hist_overlay_mode = style$hist_overlay_mode,
        gate_style = style$gate_style,
        error_msg = paste0(
          "Could not build a strategy tree for the selected populations (",
          paste(selected_pop_ids, collapse = ", "),
          "). Ensure each population has at least one gate and a valid parent chain back to root."
        )
      ))
      return()
    }

    if (use_global_scales_strategy) {
      .valid_gs <- function(ch) {
        gs <- rv$global_scale_ranges[[ch]]
        if (is.null(gs)) return(NULL)
        lo <- suppressWarnings(as.numeric(gs$lo %||% NA))
        hi <- suppressWarnings(as.numeric(gs$hi %||% NA))
        if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return(NULL)
        c(lo, hi)
      }

      nodes_list <- lapply(nodes_list, function(nd) {
        xr <- .valid_gs(as.character(nd$x_channel %||% ""))
        yr <- .valid_gs(as.character(nd$y_channel %||% ""))
        if (!is.null(xr)) nd$x_range <- xr
        if (!is.null(yr)) nd$y_range <- yr
        nd
      })
    }

    message("[strategy multi] rendering ", length(nodes_list), " nodes")

    nodes_json <- lapply(nodes_list, function(nd) {
      list(
        node_id         = nd$node_id,
        parent_pop_name = nd$parent_pop_name,
        x_channel       = nd$x_channel,
        y_channel       = nd$y_channel,
        x               = unname(as.numeric(nd$x)),
        y               = unname(as.numeric(nd$y)),
        x_range         = nd$x_range,
        y_range         = nd$y_range,
        gates           = nd$gates,
        col             = nd$col,
        row             = nd$row,
        n_events        = nd$n_events
      )
    })

    # Log-style decade ticks (logicle for flow, asinh for CyTOF)
    if (!is.null(rv$sce) && rv$assay_name == "exprs" && length(nodes_json) > 0) {
      nodes_json <- lapply(nodes_json, function(nd) {
        for (axis in c("x", "y")) {
          ch <- as.character(nd[[paste0(axis, "_channel")]] %||% "")
          ax_range <- nd[[paste0(axis, "_range")]]
          ticks <- generate_channel_ticks(ch, ax_range)
          if (!is.null(ticks)) {
            nd[[paste0(axis, "_logicle_ticks")]] <- ticks
            nd[[paste0(axis, "_is_logicle")]] <- TRUE
          }
        }
        nd
      })
    }

    # CRITICAL: strip names so jsonlite serializes as a JSON array [...],
    # not an object {...}.  Named R lists become JS objects, which break
    # `nodes.forEach(...)` in renderMultiStrategyGrid and cause a silent
    # "nothing happens" failure in the browser.
    nodes_json <- unname(nodes_json)

    # Cache payload for server-side PDF export
    rv$.strategy_pdf_payload <- list(
      mode = "multi",
      strategy_context_title = strategy_context_title,
      strategy_context_title_font = strategy_context_title_font,
      nodes = nodes_json,
      plot_size = strategy_plot_size,
      gate_view = strategy_gate_view_m,
      display_mode = strategy_mode,
      contour_threshold = style$contour_threshold,
      point_alpha = style$point_alpha,
      point_size = style$point_size,
      kde_bandwidth = style$kde_bandwidth,
      hist_line_width = style$hist_line_width,
      hist_fill = style$hist_fill,
      hist_fill_alpha = style$hist_fill_alpha,
      hist_overlay_mode = style$hist_overlay_mode,
      font_sizes = strategy_font_sizes,
      gate_style = style$gate_style
    )

    session$sendCustomMessage("renderMultiStrategyGrid", list(
      containerId     = "strategy-grid-container",
      strategy_context_title = strategy_context_title,
      strategy_context_title_font = strategy_context_title_font,
      nodes           = nodes_json,
      plot_size       = strategy_plot_size,
      display_mode    = strategy_mode,
      contour_threshold = style$contour_threshold,
      point_alpha     = style$point_alpha,
      point_size      = style$point_size,
      kde_bandwidth   = style$kde_bandwidth,
      hist_line_width = style$hist_line_width,
      hist_fill       = style$hist_fill,
      hist_fill_alpha = style$hist_fill_alpha,
      hist_overlay_mode = style$hist_overlay_mode,
      font_sizes      = strategy_font_sizes,
      gate_style      = style$gate_style
    ))
  }

  observeEvent(input$strategy_all_events, {
    if (isTRUE(input$strategy_all_events)) {
      updateNumericInput(session, "strategy_max_events", value = 0)
    }
  }, ignoreInit = TRUE)

  observeEvent(input$strategy_render_btn, {
    rv$.strategy_stale <- FALSE
    mode <- as.character(input$strategy_mode %||% "single")
    message("[strategy] Render clicked — mode='", mode, "' sel_size=",
            length(input$strategy_multi_pop_select %||% character(0)),
            " checkbox_sel=", length(rv$.selected_pop_ids %||% character(0)))
    showNotification(paste0("Rendering strategy (", mode, ")…"),
                     duration = 2, type = "message")
    tryCatch({
      if (identical(mode, "multi")) {
        render_multi_strategy_tab()
      } else {
        render_strategy_tab()
      }
    }, error = function(e) {
      message("[strategy] render error: ", conditionMessage(e))
      showNotification(paste0("Strategy render failed: ", conditionMessage(e)),
                       duration = 10, type = "error")
    })
  }, ignoreInit = TRUE)

  observeEvent(input$strategy_export_png, {
    data <- rv$.strategy_pdf_payload
    req(data)

    latest_style <- collect_plot_style_params("strategy", gate_view = data$gate_view %||% input$strategy_gate_view)
    latest_layout <- collect_layout_params("strategy")

    render_base <- list(
      containerId = "strategy-grid-container",
      render_family = "strategy",
      mode = data$mode %||% "single",
      strategy_context_title = data$strategy_context_title,
      strategy_context_title_font = max(8L, min(24L, as.integer(latest_style$font_sizes$title %||% 10L) + 1L)),
      plot_size = latest_layout$export_plot_size,
      display_mode = latest_style$display_mode,
      contour_threshold = latest_style$contour_threshold,
      point_alpha = latest_style$point_alpha,
      point_size = latest_style$point_size,
      kde_bandwidth = latest_style$kde_bandwidth,
      hist_line_width = latest_style$hist_line_width,
      hist_fill = latest_style$hist_fill,
      hist_fill_alpha = latest_style$hist_fill_alpha,
      hist_overlay_mode = latest_style$hist_overlay_mode,
      font_sizes = latest_style$font_sizes,
      gate_style = latest_style$gate_style
    )

    render_data <- if (identical(data$mode, "multi")) {
      c(render_base, list(nodes = data$nodes %||% list()))
    } else {
      c(render_base, list(
        steps = data$steps %||% list(),
        n_columns = latest_layout$n_columns,
        fit_to_columns = latest_layout$fit_to_columns,
        gate_view = data$gate_view %||% input$strategy_gate_view
      ))
    }

    session$sendCustomMessage("exportMiniPlotPNG", list(
      gridId = "strategy-grid-container-grid",
      filename = "gating_strategy",
      render_data = render_data
    ))
  })

  output$strategy_export_pdf_dl <- downloadHandler(
    filename = function() {
      paste0("gating_strategy_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".svg")
    },
    content = function(file) {
      data <- rv$.strategy_pdf_payload
      req(data)
      latest_style <- collect_plot_style_params("strategy", gate_view = data$gate_view %||% input$strategy_gate_view)
      latest_layout <- collect_layout_params("strategy")
      for (nm in names(latest_style)) data[[nm]] <- latest_style[[nm]]
      data$strategy_context_title_font <- max(8L, min(24L, as.integer(latest_style$font_sizes$title %||% 10L) + 1L))
      data$plot_size <- latest_layout$export_plot_size
      data$n_columns <- latest_layout$n_columns
      data$fit_to_columns <- latest_layout$fit_to_columns
      data$pdf_dpi <- latest_layout$pdf_dpi
      data$pdf_point_size <- max(0.1, min(5, as.numeric(data$point_size %||% 1.2) / 2))
      data$pdf_point_alpha <- max(0.05, min(1, as.numeric(data$point_alpha %||% 0.35)))
      showNotification("Generating SVG\u2026", duration = 2, type = "message")
      if (identical(data$mode, "multi")) {
        export_multi_strategy_pdf(file, data$nodes, data)
      } else {
        export_strategy_pdf(file, data$steps, data)
      }
    }
  )

  # ══════════════════════════════════════════════════════════════════════════════
  # ILLUSTRATION TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Dynamic checkboxes for X channels
  output$illust_x_channels_ui <- renderUI({
    req(rv$channels)

    chs <- as.character(rv$channels)
    marker_assigned <- grepl("_", chs)
    simple_channels <- chs[!marker_assigned]
    marker_channels <- chs[marker_assigned]

    current_simple <- isolate(as.character(input$illust_x_channels_simple %||% character(0)))
    current_marker <- isolate(as.character(input$illust_x_channels_marker %||% character(0)))
    default_sel <- character(0)
    default_simple <- if (length(current_simple) > 0) {
      intersect(current_simple, simple_channels)
    } else {
      character(0)
    }
    default_marker <- if (length(current_marker) > 0) {
      intersect(current_marker, marker_channels)
    } else {
      character(0)
    }

    tagList(
      if (length(simple_channels) > 0) {
        tags$div(class = "illust-channel-group",
          tags$div(class = "illust-channel-group-header",
            tags$span("Simple / isotope channels"),
            tags$span(class = "illust-channel-group-actions",
              actionButton("illust_simple_select_all_btn", "All",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton("illust_simple_clear_btn", "Clear",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton(
                "illust_toggle_simple_btn", "", icon = icon("chevron-right"),
                class = "btn-xs btn-default", style = "padding:1px 6px;",
                onclick = "(function(btn){var body=$('#illust_simple_body');if(!body.length)return;body.stop(true,true).slideToggle(120,function(){var open=body.is(':visible');var ic=$(btn).find('i.fa');ic.toggleClass('fa-chevron-down',open);ic.toggleClass('fa-chevron-right',!open);});})(this);"
              )
            )
          ),
          tags$div(id = "illust_simple_body", class = "illust-channel-group-body", style = "display:none;",
            checkboxGroupInput("illust_x_channels_simple", NULL,
                               choices = setNames(simple_channels, simple_channels),
                               selected = default_simple,
                               inline = FALSE)
          )
        )
      },
      if (length(marker_channels) > 0) {
        tags$div(class = "illust-channel-group",
          tags$div(class = "illust-channel-group-header",
            tags$span("Marker-assigned channels"),
            tags$span(class = "illust-channel-group-actions",
              actionButton("illust_marker_select_all_btn", "All",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton("illust_marker_clear_btn", "Clear",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton(
                "illust_toggle_marker_btn", "", icon = icon("chevron-right"),
                class = "btn-xs btn-default", style = "padding:1px 6px;",
                onclick = "(function(btn){var body=$('#illust_marker_body');if(!body.length)return;body.stop(true,true).slideToggle(120,function(){var open=body.is(':visible');var ic=$(btn).find('i.fa');ic.toggleClass('fa-chevron-down',open);ic.toggleClass('fa-chevron-right',!open);});})(this);"
              )
            )
          ),
          tags$div(id = "illust_marker_body", class = "illust-channel-group-body", style = "display:none;",
            checkboxGroupInput("illust_x_channels_marker", NULL,
                               choices = setNames(marker_channels, marker_channels),
                               selected = default_marker,
                               inline = FALSE)
          )
        )
      },
      if (length(simple_channels) == 0 && length(marker_channels) == 0) {
        checkboxGroupInput("illust_x_channels_simple", NULL,
                           choices = setNames(chs, chs),
                           selected = default_sel,
                           inline = FALSE)
      }
    )
  })

  observeEvent(input$illust_simple_select_all_btn, {
    req(rv$channels)
    chs <- as.character(rv$channels)
    simple_channels <- chs[!grepl("_", chs)]
    updateCheckboxGroupInput(session, "illust_x_channels_simple", selected = simple_channels)
  }, ignoreInit = TRUE)

  observeEvent(input$illust_simple_clear_btn, {
    updateCheckboxGroupInput(session, "illust_x_channels_simple", selected = character(0))
  }, ignoreInit = TRUE)

  observeEvent(input$illust_marker_select_all_btn, {
    req(rv$channels)
    chs <- as.character(rv$channels)
    marker_channels <- chs[grepl("_", chs)]
    updateCheckboxGroupInput(session, "illust_x_channels_marker", selected = marker_channels)
  }, ignoreInit = TRUE)

  observeEvent(input$illust_marker_clear_btn, {
    updateCheckboxGroupInput(session, "illust_x_channels_marker", selected = character(0))
  }, ignoreInit = TRUE)

  .illust_safe_id <- function(id) gsub("[^A-Za-z0-9]", "_", id)

  .normalize_hex_color <- function(x, fallback = "#444444") {
    raw <- toupper(trimws(as.character(x %||% "")))
    if (!nzchar(raw)) return(fallback)
    if (grepl("^#[0-9A-F]{3}$", raw)) {
      raw <- paste0("#", paste(rep(substr(raw, 2, 4), each = 2), collapse = ""))
    }
    if (grepl("^#[0-9A-F]{6}$", raw)) return(raw)
    if (grepl("^[0-9A-F]{6}$", raw)) return(paste0("#", raw))
    fallback
  }

  .illust_default_palette <- c(
    "#1F77B4", "#FF7F0E", "#2CA02C", "#D62728", "#9467BD",
    "#8C564B", "#E377C2", "#7F7F7F", "#BCBD22", "#17BECF"
  )

  .default_pop_color <- function(pop_id, pop_ids) {
    idx <- match(pop_id, pop_ids)
    if (is.na(idx) || idx <= 0) idx <- 1L
    .illust_default_palette[((idx - 1L) %% length(.illust_default_palette)) + 1L]
  }

  update_illust_pop_color_ui <- function(pop_id, color_hex) {
    safe <- .illust_safe_id(pop_id)
    hex_id <- paste0("illust_pop_hex_", safe)
    pick_id <- paste0("illust_pop_picker_", safe)
    sw_id <- paste0("illust_pop_swatch_", safe)
    col <- .normalize_hex_color(color_hex, "#444444")
    js <- sprintf(
      "(function(){var h=document.getElementById('%s');if(h&&h.value!=='%s')h.value='%s';var p=document.getElementById('%s');if(p&&String(p.value||'').toUpperCase()!=='%s')p.value='%s';var s=document.getElementById('%s');if(s)s.style.background='%s';})();",
      hex_id, col, col, pick_id, col, col, sw_id, col
    )
    runjs(js)
  }

  sync_illust_palette_state <- function() {
    pop_ids <- names(rv$populations %||% list())
    if (length(pop_ids) == 0) {
      rv$illust_pop_palette <- list()
      if (is.null(rv$illust_pop_selected)) rv$illust_pop_selected <- character(0)
      return(FALSE)
    }

    old_palette <- rv$illust_pop_palette %||% list()
    new_palette <- setNames(lapply(pop_ids, function(pid) {
      .normalize_hex_color(old_palette[[pid]], .default_pop_color(pid, pop_ids))
    }), pop_ids)

    old_sel <- as.character(rv$illust_pop_selected %||% character(0))
    if (is.null(rv$illust_pop_selected)) {
      init_sel <- as.character(rv$active_population_id %||% rv$root_population_id %||% character(0))
      old_sel <- intersect(init_sel, pop_ids)
    }
    new_sel <- intersect(old_sel, pop_ids)

    palette_changed <- !identical(old_palette, new_palette)
    sel_changed <- !identical(as.character(rv$illust_pop_selected %||% character(0)), new_sel)

    rv$illust_pop_palette <- new_palette
    rv$illust_pop_selected <- new_sel

    palette_changed || sel_changed
  }

  get_selected_illust_pop_ids <- function(pop_ids = names(rv$populations %||% list())) {
    pop_ids <- as.character(pop_ids %||% character(0))
    if (length(pop_ids) == 0) return(character(0))
    picked <- character(0)
    for (pid in pop_ids) {
      sid <- paste0("illust_pop_sel_", .illust_safe_id(pid))
      val <- input[[sid]]
      if (isTRUE(val)) picked <- c(picked, pid)
    }
    unique(picked)
  }

  observe({
    rv$populations
    rv$root_population_id
    rv$active_population_id
    if (isTRUE(sync_illust_palette_state())) {
      rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
    }
  })

  observe({
    pop_ids <- names(rv$populations %||% list())
    if (length(pop_ids) == 0) return()
    vals <- lapply(pop_ids, function(pid) input[[paste0("illust_pop_sel_", .illust_safe_id(pid))]])
    if (!any(vapply(vals, function(v) !is.null(v), logical(1)))) return()
    selected <- get_selected_illust_pop_ids(pop_ids)
    if (!identical(selected, as.character(rv$illust_pop_selected %||% character(0)))) {
      rv$illust_pop_selected <- selected
    }
  })

  observe({
    pop_ids <- names(rv$populations %||% list())
    created <- session$userData$illust_palette_obs_created %||% character(0)
    new_ids <- setdiff(pop_ids, created)
    if (length(new_ids) == 0) return()
    session$userData$illust_palette_obs_created <- c(created, new_ids)

    for (pid in new_ids) {
      local({
        .pid <- pid
        .safe <- .illust_safe_id(.pid)
        .hex_id <- paste0("illust_pop_hex_", .safe)
        .pick_id <- paste0("illust_pop_picker_", .safe)

        observeEvent(input[[.hex_id]], {
          fallback <- rv$illust_pop_palette[[.pid]] %||% .default_pop_color(.pid, names(rv$populations %||% list()))
          new_col <- .normalize_hex_color(input[[.hex_id]], fallback)
          old_col <- rv$illust_pop_palette[[.pid]] %||% fallback
          if (!identical(new_col, old_col)) {
            rv$illust_pop_palette[[.pid]] <- new_col
            update_illust_pop_color_ui(.pid, new_col)
            mark_renders_stale()
            autosave()
          }
        }, ignoreInit = TRUE, ignoreNULL = TRUE)

        observeEvent(input[[.pick_id]], {
          fallback <- rv$illust_pop_palette[[.pid]] %||% .default_pop_color(.pid, names(rv$populations %||% list()))
          new_col <- .normalize_hex_color(input[[.pick_id]], fallback)
          old_col <- rv$illust_pop_palette[[.pid]] %||% fallback
          if (!identical(new_col, old_col)) {
            rv$illust_pop_palette[[.pid]] <- new_col
            update_illust_pop_color_ui(.pid, new_col)
            mark_renders_stale()
            autosave()
          }
        }, ignoreInit = TRUE, ignoreNULL = TRUE)
      })
    }
  })

  observeEvent(input$illust_pops_select_all_btn, {
    req(rv$populations)
    all_pops <- names(rv$populations %||% list())
    rv$illust_pop_selected <- all_pops
    for (pid in all_pops) {
      updateCheckboxInput(session, paste0("illust_pop_sel_", .illust_safe_id(pid)), value = TRUE)
    }
  }, ignoreInit = TRUE)

  observeEvent(input$illust_pops_clear_btn, {
    pop_ids <- names(rv$populations %||% list())
    rv$illust_pop_selected <- character(0)
    for (pid in pop_ids) {
      updateCheckboxInput(session, paste0("illust_pop_sel_", .illust_safe_id(pid)), value = FALSE)
    }
  }, ignoreInit = TRUE)

  # Dynamic population selector + editable color palette
  output$illust_populations_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$gate_version; rv$.illust_palette_ui_version
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) return(NULL)
    pop_ids <- names(rv$populations)
    pop_names <- vapply(rv$populations, function(p) as.character(p$name %||% ""), character(1))
    selected <- as.character(rv$illust_pop_selected %||% character(0))

    tagList(
      tags$div(class = "illust-pop-palette-header",
        tags$span("Use", class = "illust-pop-head-use"),
        tags$span("Population", class = "illust-pop-head-name"),
        tags$span("Color", class = "illust-pop-head-color")
      ),
      lapply(pop_ids, function(pid) {
        safe <- .illust_safe_id(pid)
        col <- rv$illust_pop_palette[[pid]] %||% .default_pop_color(pid, pop_ids)
        nm <- pop_names[[pid]]
        if (!nzchar(nm)) nm <- pid

        tags$div(class = "illust-pop-palette-row",
          tags$div(class = "illust-pop-select-cell",
            checkboxInput(paste0("illust_pop_sel_", safe), NULL, value = pid %in% selected)
          ),
          tags$div(class = "illust-pop-name-cell", title = nm, nm),
          tags$div(class = "illust-pop-color-cell",
            tags$span(id = paste0("illust_pop_swatch_", safe), class = "illust-pop-color-swatch", style = paste0("background:", col, ";")),
            tags$input(
              id = paste0("illust_pop_hex_", safe),
              type = "text",
              value = col,
              class = "form-control input-sm illust-pop-hex",
              spellcheck = "false",
              autocomplete = "off"
            ),
            tags$input(
              id = paste0("illust_pop_picker_", safe),
              type = "color",
              value = col,
              class = "illust-pop-picker",
              onchange = sprintf("Shiny.setInputValue('%s', this.value, {priority:'event'});", paste0("illust_pop_picker_", safe))
            )
          )
        )
      })
    )
  })

  render_illustration_tab <- function() {
    illust_plot_type <- as.character(input$illust_plot_type %||% "biplot")
    if (!illust_plot_type %in% c("biplot", "histogram")) illust_plot_type <- "biplot"

    style <- collect_plot_style_params("illustration", plot_type = illust_plot_type)
    layout <- collect_layout_params("illustration")
    illust_mode <- style$display_mode
    illust_plot_size <- layout$plot_size
    illust_font_sizes <- style$font_sizes
    illust_gate_style <- style$gate_style
    illust_n_columns <- layout$n_columns
    illust_fit_to_columns <- layout$fit_to_columns
    illust_span_scale <- 1.2
    illust_axis_mode <- "default"
    use_global_scales_illust <- TRUE

    illust_max_events <- suppressWarnings(as.integer(input$illust_max_events %||% 10000L))
    if (is.na(illust_max_events)) illust_max_events <- 10000L
    if (isTRUE(input$illust_all_events) || illust_max_events <= 0L) {
      illust_max_events <- Inf
    }

    pop_ids <- as.character(rv$illust_pop_selected %||% character(0))
    pop_ids <- intersect(pop_ids, names(rv$populations %||% list()))
    illust_population_colors <- setNames(lapply(pop_ids, function(pid) {
      .normalize_hex_color(
        rv$illust_pop_palette[[pid]],
        .default_pop_color(pid, names(rv$populations %||% list()))
      )
    }), pop_ids)
    x_channels <- unique(c(
      as.character(input$illust_x_channels_simple %||% character(0)),
      as.character(input$illust_x_channels_marker %||% character(0))
    ))
    x_channels <- x_channels[x_channels %in% rv$channels]
    y_channel <- if (illust_plot_type == "biplot") input$illust_y_channel else NULL

    max_events_key <- if (is.finite(illust_max_events)) as.integer(illust_max_events) else "all"
    mask_sig <- if (is.null(rv$sample_mask)) {
      "none"
    } else {
      paste0(length(rv$sample_mask), ":", sum(rv$sample_mask, na.rm = TRUE))
    }
    # Include global-scales fingerprint so changed scale values invalidate cache.
    illust_global_scales_sig <- {
      chs_for_sig <- sort(intersect(c(x_channels, y_channel %||% character(0)),
                                    names(rv$global_scale_ranges)))
      paste(vapply(chs_for_sig, function(ch) {
        gs <- rv$global_scale_ranges[[ch]]
        paste0(ch, ":", gs$lo %||% "NA", "-", gs$hi %||% "NA")
      }, character(1)), collapse = "|")
    }
    illustration_cache_key <- jsonlite::toJSON(list(
      assay_version = rv$assay_version %||% 0L,
      gate_version = rv$gate_version %||% 0L,
      sample_filter_key = rv$sample_filter_key %||% "all",
      sample_mask_sig = mask_sig,
      axis_mode = illust_axis_mode,
      axis_span_scale = illust_span_scale,
      global_scales_sig = illust_global_scales_sig,
      pop_ids = sort(as.character(pop_ids %||% character(0))),
      x_channels = sort(as.character(x_channels)),
      y_channel = y_channel %||% "",
      plot_type = input$illust_plot_type %||% "biplot",
      max_events = max_events_key
    ), auto_unbox = TRUE, null = "null")

    base_payload <- NULL
    cache_hit <- identical(rv$.illustration_cache_key, illustration_cache_key) &&
      !is.null(rv$.illustration_cache_payload)

    if (cache_hit) {
      base_payload <- rv$.illustration_cache_payload
    } else {
      assay_for_illustration <- get_filtered_assay_data()
      req(assay_for_illustration)

      if (nrow(assay_for_illustration) == 0) {
        base_payload <- list(
          plots = list(),
          gate_overlays = list(),
          pop_ids = character(0),
          pop_names = list(),
          pop_counts = list(),
          x_channels = character(0),
          y_channel = NULL
        )
      } else {
        req(length(pop_ids) > 0, length(x_channels) > 0)

        # Use display-space gate vertices so they match assay_data (display coords)
        display_gates <- get_plot_gates()
        batch <- compute_illustration_batch(
          assay_for_illustration, display_gates, rv$gate_order,
          rv$populations, rv$root_population_id,
          pop_ids, x_channels, y_channel,
          plot_type = illust_plot_type,
          max_events = illust_max_events
        )

        .gs_range <- function(ch, span_scale) {
          gs <- rv$global_scale_ranges[[ch]]
          if (!is.null(gs) && is.finite(as.numeric(gs$lo %||% NA)) &&
              is.finite(as.numeric(gs$hi %||% NA)) &&
              as.numeric(gs$hi) > as.numeric(gs$lo)) {
            return(c(as.numeric(gs$lo), as.numeric(gs$hi)))
          }
          compute_range_from_values(
            get_filtered_channel_values(ch, for_plot = TRUE),
            channel = ch,
            span_scale = span_scale
          )
        }
        x_range_by_channel <- setNames(lapply(x_channels, function(ch) {
          .gs_range(ch, illust_span_scale)
        }), x_channels)
        y_range_fixed <- if (!is.null(y_channel) && y_channel %in% rv$channels) {
          .gs_range(y_channel, illust_span_scale)
        } else {
          NULL
        }

        # Expand x_range_by_channel / y_range_fixed to include all gate boundaries,
        # so gates drawn outside the current data cloud remain visible.
        for (gid in rv$gate_order) {
          gdef <- display_gates[[gid]]
          if (is.null(gdef)) next
          iverts <- gdef$vertices %||% list()
          if (length(iverts) == 0) next
          gvx <- vapply(iverts, .vertex_coord, numeric(1), idx = 1L)
          gvy <- vapply(iverts, .vertex_coord, numeric(1), idx = 2L)
          # x_channel of this gate → expands the x range for that channel panel
          if (!is.null(gdef$x_channel) && gdef$x_channel %in% x_channels) {
            x_range_by_channel[[gdef$x_channel]] <- expand_range_for_vertices(
              x_range_by_channel[[gdef$x_channel]], gvx)
          }
          # y_channel of this gate → expands x range if that channel is an x panel
          if (!is.null(gdef$y_channel) && gdef$y_channel %in% x_channels) {
            x_range_by_channel[[gdef$y_channel]] <- expand_range_for_vertices(
              x_range_by_channel[[gdef$y_channel]], gvy)
          }
          # y_channel of this gate → expands y_range_fixed if it matches y_channel
          if (!is.null(y_range_fixed) && !is.null(y_channel)) {
            if (!is.null(gdef$y_channel) && gdef$y_channel == y_channel)
              y_range_fixed <- expand_range_for_vertices(y_range_fixed, gvy)
            if (!is.null(gdef$x_channel) && gdef$x_channel == y_channel)
              y_range_fixed <- expand_range_for_vertices(y_range_fixed, gvx)
          }
        }

        # Convert plot data to JSON-friendly lists
        plots_json <- list()
        gate_overlays_json <- list()
        for (key in names(batch$plots)) {
          pd <- batch$plots[[key]]
          x_range_panel <- x_range_by_channel[[pd$x_label]] %||% pd$x_range
          y_range_panel <- if (!is.null(pd$y_label)) y_range_fixed %||% pd$y_range else NULL

          plots_json[[key]] <- list(
            x = unname(as.numeric(pd$x)),
            y = if (!is.null(pd$y)) unname(as.numeric(pd$y)) else numeric(0),
            x_range = x_range_panel,
            y_range = y_range_panel,
            n_events = pd$n_events,
            x_label = pd$x_label,
            y_label = pd$y_label
          )

          # Build gate overlays for this channel pair
          parts <- strsplit(key, "\\|")[[1]]
          pop_id <- parts[1]; x_ch <- parts[2]
          if (!is.null(y_channel) && illust_plot_type == "biplot") {
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

        base_payload <- list(
          plots = plots_json,
          gate_overlays = gate_overlays_json,
          pop_ids = as.character(pop_ids),
          pop_names = pop_names,
          pop_counts = pop_counts,
          x_channels = as.character(x_channels),
          y_channel = y_channel
        )
      }

      rv$.illustration_cache_key <- illustration_cache_key
      rv$.illustration_cache_payload <- base_payload
    }

    if (identical(illust_axis_mode, "rescaled") && length(base_payload$plots %||% list()) > 0) {
      existing_override <- rv$illustration_axis_override
      override_ranges <- if (is.list(existing_override$ranges)) existing_override$ranges else (existing_override %||% list())
      updated_ranges <- list()
      override_changed <- FALSE

      for (key in names(base_payload$plots)) {
        pd <- base_payload$plots[[key]]
        ov <- override_ranges[[key]]

        has_ov <- is.list(ov) &&
          length(ov$x_range %||% numeric(0)) == 2 &&
          all(is.finite(as.numeric(ov$x_range))) &&
          (is.null(pd$y_range) || (
            length(ov$y_range %||% numeric(0)) == 2 &&
              all(is.finite(as.numeric(ov$y_range)))
          ))

        if (isTRUE(has_ov)) {
          pd$x_range <- unname(as.numeric(ov$x_range))
          if (!is.null(pd$y_range)) pd$y_range <- unname(as.numeric(ov$y_range))
        } else {
          x_vals <- as.numeric(pd$x %||% numeric(0))
          if (sum(is.finite(x_vals)) > 0) {
            pd$x_range <- compute_range_from_values(
              x_vals,
              channel = pd$x_label,
              span_scale = illust_span_scale
            )
          }
          if (!is.null(pd$y_label) && !is.null(pd$y) && !is.null(pd$y_range)) {
            y_vals <- as.numeric(pd$y %||% numeric(0))
            if (sum(is.finite(y_vals)) > 0) {
              pd$y_range <- compute_range_from_values(
                y_vals,
                channel = pd$y_label,
                span_scale = illust_span_scale
              )
            }
          }
          override_changed <- TRUE
        }

        updated_ranges[[key]] <- list(
          x_range = unname(as.numeric(pd$x_range)),
          y_range = if (!is.null(pd$y_range)) unname(as.numeric(pd$y_range)) else NULL
        )
        base_payload$plots[[key]] <- pd
      }

      if (isTRUE(override_changed) || length(updated_ranges) != length(override_ranges)) {
        rv$illustration_axis_override <- list(ranges = updated_ranges)
      }
    }

    # Log-style decade ticks (logicle for flow, asinh for CyTOF), applied to
    # both biplots and histograms.  Re-computed each render to match final ranges.
    if (!is.null(rv$sce) && rv$assay_name == "exprs" &&
        length(base_payload$plots %||% list()) > 0) {
      base_payload$plots <- lapply(base_payload$plots, function(pd) {
        for (axis in c("x", "y")) {
          ch <- as.character(pd[[paste0(axis, "_label")]] %||% "")
          ax_range <- pd[[paste0(axis, "_range")]]
          ticks <- generate_channel_ticks(ch, ax_range)
          if (!is.null(ticks)) {
            pd[[paste0(axis, "_logicle_ticks")]] <- ticks
            pd[[paste0(axis, "_is_logicle")]] <- TRUE
          }
        }
        pd
      })
    }

    # Cache payload for server-side PDF export
    rv$.illustration_pdf_payload <- list(
      payload = base_payload,
      population_colors = illust_population_colors,
      plot_size = illust_plot_size,
      n_columns = illust_n_columns,
      fit_to_columns = illust_fit_to_columns,
      display_mode = illust_mode,
      contour_threshold = style$contour_threshold,
      point_alpha = style$point_alpha,
      point_size = style$point_size,
      hist_line_width = style$hist_line_width,
      hist_fill = style$hist_fill,
      hist_fill_alpha = style$hist_fill_alpha,
      hist_overlay_mode = style$hist_overlay_mode,
      kde_bandwidth = style$kde_bandwidth,
      font_sizes = illust_font_sizes,
      gate_style = illust_gate_style,
      overlay_populations = isTRUE(input$illust_overlay_pops),
      color_by_population = isTRUE(input$illust_color_by_pop)
    )

    session$sendCustomMessage("renderIllustrationGrid", c(
      list(
        containerId          = "illustration-grid-container",
        plot_size            = illust_plot_size,
        n_columns            = illust_n_columns,
        fit_to_columns       = illust_fit_to_columns,
        display_mode         = illust_mode,
        contour_threshold    = style$contour_threshold,
        point_alpha          = style$point_alpha,
        point_size           = style$point_size,
        hist_line_width      = style$hist_line_width,
        hist_fill            = style$hist_fill,
        hist_fill_alpha      = style$hist_fill_alpha,
        hist_overlay_mode    = style$hist_overlay_mode,
        kde_bandwidth        = style$kde_bandwidth,
        font_sizes           = illust_font_sizes,
        gate_style           = illust_gate_style,
        color_by_population  = isTRUE(input$illust_color_by_pop),
        overlay_populations  = isTRUE(input$illust_overlay_pops),
        population_colors    = illust_population_colors
      ),
      base_payload
    ))
  }

  observeEvent(input$illust_all_events, {
    if (isTRUE(input$illust_all_events)) {
      updateNumericInput(session, "illust_max_events", value = 0)
    }
  }, ignoreInit = TRUE)

  # Render illustration on button click
  observeEvent(input$illust_render_btn, {
    rv$.illust_stale <- FALSE
    render_illustration_tab()
  })

  observeEvent(input$illust_export_png, {
    data <- rv$.illustration_pdf_payload
    req(data, data$payload)
    illust_plot_type <- as.character(input$illust_plot_type %||% "biplot")
    latest_style <- collect_plot_style_params("illustration", plot_type = illust_plot_type)
    latest_layout <- collect_layout_params("illustration")
    latest_overlay <- isTRUE(input$illust_overlay_pops)
    latest_color_by <- isTRUE(input$illust_color_by_pop)

    pop_ids <- as.character(data$payload$pop_ids %||% character(0))
    current_pop_colors <- setNames(lapply(pop_ids, function(pid) {
      .normalize_hex_color(
        rv$illust_pop_palette[[pid]],
        .default_pop_color(pid, names(rv$populations %||% list()))
      )
    }), pop_ids)

    render_data <- c(
      list(
        containerId         = "illustration-grid-container",
        render_family       = "illustration",
        plot_size           = latest_layout$export_plot_size,
        n_columns           = latest_layout$n_columns,
        fit_to_columns      = latest_layout$fit_to_columns,
        display_mode        = latest_style$display_mode,
        contour_threshold   = latest_style$contour_threshold,
        point_alpha         = latest_style$point_alpha,
        point_size          = latest_style$point_size,
        hist_line_width     = latest_style$hist_line_width,
        hist_fill           = latest_style$hist_fill,
        hist_fill_alpha     = latest_style$hist_fill_alpha,
        hist_overlay_mode   = latest_style$hist_overlay_mode,
        kde_bandwidth       = latest_style$kde_bandwidth,
        font_sizes          = latest_style$font_sizes,
        gate_style          = latest_style$gate_style,
        color_by_population = latest_color_by,
        overlay_populations = latest_overlay,
        population_colors   = current_pop_colors
      ),
      data$payload
    )

    session$sendCustomMessage("exportMiniPlotPNG", list(
      gridId = "illustration-grid-container-grid",
      filename = "illustration",
      render_data = render_data
    ))
  })

  output$illust_export_pdf_dl <- downloadHandler(
    filename = function() {
      paste0("illustration_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".svg")
    },
    content = function(file) {
      data <- rv$.illustration_pdf_payload
      req(data)
      illust_plot_type <- as.character(input$illust_plot_type %||% "biplot")
      latest_style <- collect_plot_style_params("illustration", plot_type = illust_plot_type)
      latest_layout <- collect_layout_params("illustration")
      for (nm in names(latest_style)) data[[nm]] <- latest_style[[nm]]
      data$plot_size <- latest_layout$export_plot_size
      data$n_columns <- latest_layout$n_columns
      data$fit_to_columns <- latest_layout$fit_to_columns
      data$overlay_populations <- isTRUE(input$illust_overlay_pops)
      data$color_by_population <- isTRUE(input$illust_color_by_pop)
      pop_ids <- as.character(data$payload$pop_ids %||% character(0))
      data$population_colors <- setNames(lapply(pop_ids, function(pid) {
        .normalize_hex_color(
          rv$illust_pop_palette[[pid]],
          .default_pop_color(pid, names(rv$populations %||% list()))
        )
      }), pop_ids)
      data$pdf_dpi <- latest_layout$pdf_dpi
      data$pdf_point_size <- max(0.1, min(5, as.numeric(data$point_size %||% 1.2) / 2))
      data$pdf_point_alpha <- max(0.05, min(1, as.numeric(data$point_alpha %||% 0.35)))
      showNotification("Generating SVG\u2026", duration = 2, type = "message")
      export_illustration_pdf(file, data$payload, data)
    }
  )

  # ══════════════════════════════════════════════════════════════════════════════
  # SCALES TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Helper: sanitise a channel name to a valid Shiny input ID suffix
  .scales_safe_id <- function(ch) gsub("[^A-Za-z0-9]", "_", ch)

  # Render the per-channel table of scale controls (2-column compact layout)
  output$scales_channels_ui <- renderUI({
    rv$.scales_ui_version   # forced-refresh trigger
    req(rv$sce, length(rv$channels) > 0)
    is_flow <- isolate(is_flow_session(rv$sce))
    channels <- isolate(rv$channels)

    # Column template strings — kept narrow so two columns fit side by side
    col_tpl <- if (is_flow) "124px 66px 66px 56px" else "138px 72px 72px"

    make_header <- function() {
      tags$div(
        class = "scales-col-header",
        style = paste0("display:grid; grid-template-columns:", col_tpl,
                       "; gap:3px; align-items:center;"),
        tags$span("Channel"),
        tags$span("Min"),
        tags$span("Max"),
        if (is_flow) tags$span("W") else NULL
      )
    }

    make_row <- function(ch) {
      safe_id    <- .scales_safe_id(ch)
      stored     <- isolate(rv$global_scale_ranges[[ch]])
      is_scatter <- .is_scatter_channel(ch)
      is_qc      <- .is_qc_channel(ch)

      if (is_flow) {
        if (is_scatter) {
          lo_val <- stored$lo %||% -2;  hi_val <- stored$hi %||% 10
          w_cell <- tags$span("")
        } else if (is_qc) {
          lo_val <- stored$lo %||% 0;   hi_val <- stored$hi %||% 100
          w_cell <- tags$span("")
        } else {
          lo_val <- stored$lo %||% -0.5; hi_val <- stored$hi %||% 4.5
          w_raw  <- isolate(as.numeric(
            rv$flow_logicle_w[[ch]] %||% rv$flow_logicle_w_auto[[ch]] %||% 0.5))
          w_cell <- numericInput(paste0("scales_w_", safe_id), NULL,
                                 value = round(w_raw, 3),
                                 min = 0.1, max = 2.0, step = 0.05, width = "50px")
        }
      } else {
        rng    <- isolate(get_cytof_axis_range(ch))
        lo_val <- stored$lo %||% rng[1]; hi_val <- stored$hi %||% rng[2]
        w_cell <- NULL
      }

      tags$div(
        class = "scales-ch-row",
        style = paste0("display:grid; grid-template-columns:", col_tpl,
                       "; gap:3px; align-items:center;"),
        tags$span(ch, class = "scales-ch-name", title = ch),
        numericInput(paste0("scales_lo_", safe_id), NULL,
                     value = round(lo_val, 3), step = 0.4, width = "64px"),
        numericInput(paste0("scales_hi_", safe_id), NULL,
                     value = round(hi_val, 3), step = 0.4, width = "64px"),
        if (is_flow) w_cell else NULL
      )
    }

    # Split into two balanced columns
    n      <- length(channels)
    half   <- ceiling(n / 2)
    col1   <- channels[seq_len(half)]
    col2   <- if (n > half) channels[seq(half + 1L, n)] else character(0)

    make_col <- function(chs) {
      tags$div(
        class = "scales-col",
        make_header(),
        lapply(chs, make_row)
      )
    }

    tags$div(
      class = "scales-channel-table",
      tags$div(
        class = "scales-two-col",
        make_col(col1),
        if (length(col2) > 0) make_col(col2) else NULL
      )
    )
  })

  # Create per-channel input observers once per channel set (deduplicated via session$userData)
  observe({
    req(rv$sce, length(rv$channels) > 0)
    chs      <- isolate(rv$channels)
    is_flow  <- isolate(is_flow_session(rv$sce))
    created  <- session$userData$scales_obs_created %||% character(0)
    new_chs  <- setdiff(chs, created)
    if (length(new_chs) == 0) return()
    session$userData$scales_obs_created <- c(created, new_chs)

    for (ch in new_chs) {
      local({
        .ch      <- ch
        .safe    <- .scales_safe_id(.ch)
        .lo_id   <- paste0("scales_lo_", .safe)
        .hi_id   <- paste0("scales_hi_", .safe)
        .w_id    <- paste0("scales_w_",  .safe)

        observeEvent(input[[.lo_id]], {
          val <- suppressWarnings(as.numeric(input[[.lo_id]]))
          if (is.finite(val)) {
            if (is.null(rv$global_scale_ranges[[.ch]])) rv$global_scale_ranges[[.ch]] <- list()
            old_val <- suppressWarnings(as.numeric(rv$global_scale_ranges[[.ch]]$lo %||% NA))
            if (!is.finite(old_val) || abs(old_val - val) >= 1e-9) {
              rv$global_scale_ranges[[.ch]]$lo <- val
              mark_renders_stale()
              # Push the new value directly into the gating inputs for the current channel.
              # This fires the cytof_x/y_lo/hi observer → updates axis range → send_full_plot().
              # Do NOT clear rv$.plot_range_override here: flow_transform_controls_ui now
              # isolates that read, so clearing it no longer triggers a UI rebuild.
              x_ch <- isolate(input$x_channel %||% ""); y_ch <- isolate(input$y_channel %||% "")
              if (.ch == x_ch) updateNumericInput(session, "cytof_x_lo", value = val)
              if (.ch == y_ch) updateNumericInput(session, "cytof_y_lo", value = val)
            }
          }
        }, ignoreInit = TRUE, ignoreNULL = TRUE)

        observeEvent(input[[.hi_id]], {
          val <- suppressWarnings(as.numeric(input[[.hi_id]]))
          if (is.finite(val)) {
            if (is.null(rv$global_scale_ranges[[.ch]])) rv$global_scale_ranges[[.ch]] <- list()
            old_val <- suppressWarnings(as.numeric(rv$global_scale_ranges[[.ch]]$hi %||% NA))
            if (!is.finite(old_val) || abs(old_val - val) >= 1e-9) {
              rv$global_scale_ranges[[.ch]]$hi <- val
              mark_renders_stale()
              # Push the new value directly into the gating inputs for the current channel.
              x_ch <- isolate(input$x_channel %||% ""); y_ch <- isolate(input$y_channel %||% "")
              if (.ch == x_ch) updateNumericInput(session, "cytof_x_hi", value = val)
              if (.ch == y_ch) updateNumericInput(session, "cytof_y_hi", value = val)
            }
          }
        }, ignoreInit = TRUE, ignoreNULL = TRUE)

        if (is_flow && !.is_scatter_channel(.ch) && !.is_qc_channel(.ch)) {
          observeEvent(input[[.w_id]], {
            val <- suppressWarnings(as.numeric(input[[.w_id]]))
            if (is.finite(val)) {
              new_w <- max(0.1, min(2.0, val))
              if (!identical(rv$flow_logicle_w[[.ch]], new_w)) {
                rv$flow_logicle_w[[.ch]] <- new_w
                refresh_assay_data(reset_cache = FALSE, channels_to_update = .ch)
                # Sync gating tab logicle sliders and mark render buttons stale
                x_ch <- isolate(input$x_channel %||% ""); y_ch <- isolate(input$y_channel %||% "")
                if (.ch == x_ch) updateSliderInput(session, "x_logicle_w", value = new_w)
                if (.ch == y_ch) updateSliderInput(session, "y_logicle_w", value = new_w)
                if (.ch %in% c(x_ch, y_ch)) send_full_plot(reset_view = TRUE)
                mark_renders_stale()
              }
            }
          }, ignoreInit = TRUE, ignoreNULL = TRUE)
        }
      })
    }
  })

  # ══════════════════════════════════════════════════════════════════════════════
  # STATISTICS TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Dynamic channel checkboxes (exclude QC channels by default)
  output$stats_channels_ui <- renderUI({
    rv$channels
    if (is.null(rv$channels) || length(rv$channels) == 0) return(NULL)
    all_chs <- rv$channels
    # Pre-select signal channels (not QC, not scatter for flow)
    default_selected <- all_chs[!.is_qc_channel(all_chs)]
    checkboxGroupInput("stats_channels", NULL,
                       choices = all_chs,
                       selected = default_selected,
                       inline = FALSE)
  })

  observeEvent(input$stats_channels_all_btn, {
    req(rv$channels)
    updateCheckboxGroupInput(session, "stats_channels", selected = rv$channels)
  })
  observeEvent(input$stats_channels_none_btn, {
    updateCheckboxGroupInput(session, "stats_channels", selected = character(0))
  })

  # Dynamic population checkboxes
  output$stats_populations_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$gate_version
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) return(NULL)
    pop_choices <- setNames(names(rv$populations),
                            vapply(rv$populations, function(p) p$name, character(1)))
    checkboxGroupInput("stats_populations", NULL,
                       choices = pop_choices,
                       selected = names(rv$populations),
                       inline = FALSE)
  })

  # Reactive: computed statistics data.frame (computed on button press)
  rv_stats_df <- reactiveVal(NULL)

  observeEvent(input$stats_compute_btn, {
    req(rv$sce, rv$assay_data, rv$populations, rv$root_population_id)
    req(input$stats_channels, input$stats_populations, input$stats_stat_types)

    # Ensure gating strategy is up to date
    get_pop_mask(rv$root_population_id)

    # Choose value space for MFI calculations
    use_raw <- identical(input$stats_value_space, "raw")
    has_channel_stats <- any(c("median", "mean", "geomean", "sd", "cv") %in% input$stats_stat_types)

    raw_data <- NULL
    if (use_raw && has_channel_stats) {
      if (is_flow_session() && !is.null(rv$flow_raw_data)) {
        raw_data <- rv$flow_raw_data
      } else if ("counts" %in% SummarizedExperiment::assayNames(rv$sce)) {
        raw_data <- extract_assay_data(rv$sce, "counts")
      }
    }
    # Fall back to display-space data
    if (is.null(raw_data)) raw_data <- rv$assay_data

    # Filter populations to selected only
    selected_pops <- rv$populations[intersect(input$stats_populations, names(rv$populations))]
    if (length(selected_pops) == 0) {
      showNotification("No populations selected", type = "warning")
      return()
    }

    df <- tryCatch(
      compute_population_stats(
        assay_data  = rv$assay_data,
        raw_data    = raw_data,
        populations = selected_pops,
        root_pop_id = rv$root_population_id,
        pop_masks   = rv$pop_events_map,
        channels    = input$stats_channels,
        stat_types  = input$stats_stat_types,
        sample_mask = rv$sample_mask
      ),
      error = function(e) {
        showNotification(paste("Error computing stats:", e$message), type = "error")
        NULL
      }
    )

    if (!is.null(df) && nrow(df) > 0) {
      rv_stats_df(df)
    } else {
      rv_stats_df(NULL)
      if (is.null(df)) return()
      showNotification("No data to display", type = "warning")
    }
  })

  # Render DT table
  output$stats_table <- DT::renderDataTable({
    df <- rv_stats_df()
    if (is.null(df) || nrow(df) == 0) return(NULL)

    # Format numeric columns with commas for counts
    DT::datatable(df,
      options = list(
        pageLength = 50,
        scrollX = TRUE,
        scrollY = "500px",
        dom = "tip",
        autoWidth = FALSE
      ),
      rownames = FALSE,
      class = "compact stripe hover"
    ) |>
      DT::formatRound(
        columns = intersect(c("Count"), colnames(df)),
        digits = 0, mark = ","
      ) |>
      DT::formatRound(
        columns = grep("Median|Mean|GeoMean|SD", colnames(df), value = TRUE),
        digits = 1, mark = ","
      ) |>
      DT::formatRound(
        columns = grep("% Parent|% Total|CV%", colnames(df), value = TRUE),
        digits = 2
      )
  })

  # CSV export
  output$stats_export_csv <- downloadHandler(
    filename = function() {
      sce_name <- rv$sce_name %||% "data"
      paste0(sce_name, "_statistics_", format(Sys.Date(), "%Y%m%d"), ".csv")
    },
    content = function(file) {
      df <- rv_stats_df()
      if (is.null(df) || nrow(df) == 0) {
        showNotification("No statistics computed yet. Click 'Compute Statistics' first.",
                        type = "warning")
        write.csv(data.frame(Message = "No data"), file, row.names = FALSE)
        return()
      }
      write.csv(df, file, row.names = FALSE)
    }
  )

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
    if (!is.null(ws$cytof_axis_range)) rv$cytof_axis_range <- ws$cytof_axis_range
    rv$global_scale_ranges <- ws$global_scale_ranges %||% list()
    initialize_missing_global_scales(rv$channels)
    rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
    rv$.plot_range_override <- ws$plot_range_override %||% NULL
    rv$illust_pop_palette <- ws$illust_pop_palette %||% list()
    rv$illust_pop_selected <- if (!is.null(ws$illust_pop_selected)) as.character(ws$illust_pop_selected) else NULL
    if (isTRUE(sync_illust_palette_state())) {
      rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
    }
    # Channels don't change on workspace load, so force the scale controls to
    # re-render with the just-loaded override / global scale values.
    rv$.flow_transform_version <- isolate(rv$.flow_transform_version) + 1L
    update_rescale_btn(!is.null(rv$.plot_range_override))
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

  # ── Export GatingML ──────────────────────────────────────────────────────────
  output$export_gatingml_dl <- downloadHandler(
    filename = function() {
      sce_nm <- isolate(rv$sce_name) %||% "workspace"
      paste0(gsub("[^A-Za-z0-9_.-]", "_", sce_nm), "_gates_",
             format(Sys.time(), "%Y%m%d_%H%M%S"), ".xml")
    },
    content = function(file) {
      req(rv$sce, rv$gates)
      if (length(rv$gates) == 0) {
        showNotification("No gates to export.", type = "warning", duration = 4)
        return()
      }
      tryCatch({
        export_gatingml_to_cytobank(
          gates                   = isolate(rv$gates),
          gate_order              = isolate(rv$gate_order),
          populations             = isolate(rv$populations),
          root_population_id      = isolate(rv$root_population_id),
          sce                     = isolate(rv$sce),
          file_path               = file,
          logicle_w_params        = isolate(rv$flow_logicle_w),
          scatter_cofactor_params = isolate(rv$flow_scatter_cofactor),
          counts_mat              = isolate(rv$flow_raw_data)
        )
      }, error = function(e) {
        showNotification(paste("GatingML export error:", e$message),
                         type = "error", duration = 8)
      })
    }
  )

  # ── Export FCS — modal then download ────────────────────────────────────────
  observeEvent(input$export_fcs_btn, {
    req(rv$sce)
    pop_choices <- setNames(
      names(rv$populations),
      vapply(rv$populations, function(p) p$name, character(1))
    )
    default_pop_ids <- intersect(rv$.selected_pop_ids, names(rv$populations))
    if (length(default_pop_ids) == 0) {
      default_pop_ids <- rv$root_population_id
    }
    available_assays <- SummarizedExperiment::assayNames(rv$sce)
    assay_choices <- setNames(
      available_assays,
      ifelse(available_assays == "exprs",   "Transformed – arcsinh (exprs)",
      ifelse(available_assays == "counts",  "Untransformed – raw (counts)",
                                             available_assays))
    )
    showModal(modalDialog(
      title = "Export FCS Files",
      checkboxGroupInput("fcs_export_pop_ids", "Populations to export:",
                         choices = pop_choices,
                         selected = default_pop_ids,
                         inline = FALSE),
      tags$p(tags$em("Checked populations in the tree are preselected here. If none are checked, export defaults to All Events.",
                     style = "color:#888; font-size:11px; margin-top:-4px;")),
      radioButtons("fcs_export_assay", "Data to include:",
                   choices  = assay_choices,
                   selected = if ("exprs" %in% available_assays) "exprs" else available_assays[1]),
      radioButtons("fcs_export_split", "Output format:",
                   choices  = c("One FCS file per sample" = "per_sample",
                                "Single combined FCS file" = "combined"),
                   selected = "per_sample"),
      radioButtons("fcs_zip_mode", "Zip compression:",
                   choices = c("Fast (no compression, larger zip)" = "fast",
                               "Smaller file (slower)" = "small"),
                   selected = "fast"),
      textInput("fcs_filename_suffix", "Filename suffix (optional):", value = ""),
      tags$p(tags$em("Gates are always evaluated in transformed (exprs) space.",
                     style = "color:#888; font-size:11px;")),
      footer = tagList(
        modalButton("Cancel"),
        downloadButton("do_export_fcs_dl", "Download FCS", class = "btn-primary",
                       onclick = "setTimeout(function(){ if(window.jQuery){ $('.modal').modal('hide'); } }, 50);")
      )
    ))
  })

  output$do_export_fcs_dl <- downloadHandler(
    filename = function() {
      pop_ids <- isolate(input$fcs_export_pop_ids)
      pop_ids <- as.character(pop_ids %||% character(0))
      pop_ids <- intersect(pop_ids, names(rv$populations))
      if (length(pop_ids) == 0) pop_ids <- rv$root_population_id
      suffix_raw <- trimws(as.character(isolate(input$fcs_filename_suffix) %||% ""))
      suffix <- gsub("[^A-Za-z0-9._-]", "_", suffix_raw)
      if (nchar(suffix) > 0) suffix <- paste0("_", suffix)

      ts <- format(Sys.time(), "%Y%m%d_%H%M%S")
      if (length(pop_ids) == 1) {
        pop <- rv$populations[[pop_ids[[1]]]]
        pop_name <- if (!is.null(pop)) gsub("[^A-Za-z0-9_]", "_", pop$name) else "population"
        paste0(pop_name, suffix, "_", ts, ".zip")
      } else {
        paste0("populations_", length(pop_ids), suffix, "_", ts, ".zip")
      }
    },
    content = function(file) {
      req(rv$sce)
      tryCatch({
        pop_ids    <- isolate(input$fcs_export_pop_ids)
        pop_ids    <- as.character(pop_ids %||% character(0))
        pop_ids    <- intersect(pop_ids, names(rv$populations))
        if (length(pop_ids) == 0) pop_ids <- rv$root_population_id
        assay_nm   <- isolate(input$fcs_export_assay)  %||% "exprs"
        split_by   <- (isolate(input$fcs_export_split) %||% "per_sample") == "per_sample"
        zip_mode   <- isolate(input$fcs_zip_mode) %||% "fast"
        zip_flags  <- if (identical(zip_mode, "small")) "-9" else "-0"
        suffix_raw <- trimws(as.character(isolate(input$fcs_filename_suffix) %||% ""))
        file_suffix <- gsub("[^A-Za-z0-9._-]", "_", suffix_raw)

        tmp_dir <- tempfile("fcs_export_")
        dir.create(tmp_dir)
        on.exit(unlink(tmp_dir, recursive = TRUE), add = TRUE)
        zip_folder_name <- "FCS"
        zip_staging_dir <- file.path(tmp_dir, zip_folder_name)
        dir.create(zip_staging_dir, showWarnings = FALSE, recursive = TRUE)

        written <- character(0)
        precomputed_masks <- NULL
        if (length(rv$populations) > 0 && !is.null(rv$root_population_id)) {
          # Reuse the display-context mask cache when it is still valid (same gate
          # version and covers the full SCE — no sample filter applied).  This avoids
          # re-running apply_gating_strategy on the full dataset at export time.
          cache_valid <- rv$cache_version == rv$gate_version &&
                         length(rv$pop_events_map) > 0 &&
                         is.null(rv$sample_mask)
          if (cache_valid) {
            precomputed_masks <- rv$pop_events_map
          } else {
            available_assays <- SummarizedExperiment::assayNames(rv$sce)
            gate_assay <- if ("exprs" %in% available_assays) "exprs" else available_assays[1]
            gate_mat <- t(SummarizedExperiment::assay(rv$sce, gate_assay))
            gate_result <- apply_gating_strategy(
              gates = rv$gates,
              populations = rv$populations,
              root_population_id = rv$root_population_id,
              assay_data = gate_mat
            )
            precomputed_masks <- gate_result$masks
          }
        }

        withProgress(message = "Exporting FCS files", value = 0, {
          n_steps <- length(pop_ids) + 1
          step <- 0

          for (pid in pop_ids) {
            step <- step + 1
            pop <- rv$populations[[pid]]
            pop_label <- if (!is.null(pop)) pop$name else as.character(pid)
            incProgress(1 / n_steps, detail = paste0("Population ", step, "/", length(pop_ids), ": ", pop_label))

            file_prefix <- ""

            pop_written <- export_population_as_fcs(
              sce                = rv$sce,
              population_id      = pid,
              populations        = rv$populations,
              gates              = rv$gates,
              root_population_id = rv$root_population_id,
              assay_name         = assay_nm,
              split_by_sample    = split_by,
              output_dir         = zip_staging_dir,
              filename_prefix    = file_prefix,
              filename_suffix    = file_suffix,
              precomputed_masks  = precomputed_masks
            )
            if (length(pop_written) > 0) written <- c(written, pop_written)
          }

          if (length(written) == 0) stop("No events found in selected population/samples.")

          step <- step + 1
          incProgress(1 / n_steps,
                      detail = if (identical(zip_mode, "small")) {
                        "Creating zip archive (smaller, slower)"
                      } else {
                        "Creating zip archive (fast, no compression)"
                      })

          # Zip all files into a single folder inside the archive.
          norm_tmp <- normalizePath(tmp_dir, winslash = "/", mustWork = FALSE)
          norm_written <- normalizePath(written, winslash = "/", mustWork = FALSE)
          tmp_prefix <- paste0(norm_tmp, "/")
          rel_written <- ifelse(
            startsWith(norm_written, tmp_prefix),
            substring(norm_written, nchar(tmp_prefix) + 1L),
            basename(norm_written)
          )
          file_path <- as.character(file)
          if (!grepl("^(/|[A-Za-z]:[/\\\\])", file_path)) {
            file_path <- file.path(getwd(), file_path)
          }
          zip_target <- normalizePath(file_path, winslash = "/", mustWork = FALSE)
          owd <- setwd(tmp_dir)
          on.exit(setwd(owd), add = TRUE)
          utils::zip(zip_target, files = rel_written, flags = paste(zip_flags, "-q"))
          if (!file.exists(zip_target)) {
            stop("Failed to create zip archive.")
          }
        })
      }, error = function(e) {
        showNotification(paste("FCS export failed:", conditionMessage(e)),
                         type = "error", duration = 8)
        stop(conditionMessage(e))
      })
    }
  )

  output$status_text <- renderText("Select an SCE object to begin")

  # ── Close app ─────────────────────────────────────────────────────────────
  observeEvent(input$close_app_btn, {
    shiny::stopApp()
  })
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
        'export_gatingml_dl':     'Export current gates and populations as Cytobank Gating-ML 2.0 XML',
        // Mode toolbar
        'mode_rect':     'Draw a rectangle gate',
        'mode_poly':     'Draw a freehand polygon gate',
        'mode_cancel':   'Cancel the current drawing and return to navigate mode',
        'flip_axes':     'Swap the X and Y channels',
        'refresh_plot_btn': 'Force a full re-render of the plot',
        'gating_max_events': 'Cap events rendered in the gating plot (0 = no downsampling)',
        // Right panel
        'rename_gate_btn':  'Rename the selected gate',
        'undo_btn':         'Undo the last gate or population change',
        'redo_btn':         'Redo the last undone change',
        'delete_gate_btn':  'Delete the selected gate',
        'sort_gates_alpha_btn': 'Sort the gate list alphabetically',
        'add_pop_btn':      'Define a new population using gate references',
        'edit_pop_btn':     'Open the population editor for the selected population',
        'duplicate_selected_pops_btn': 'Duplicate checked populations',
        'delete_selected_pops_btn': 'Delete checked populations',
        // Strategy / Illustration
        'strategy_gate_view': 'Choose whether to display forward-gated events, back-gated events, or both overlays',
        'strategy_max_events': 'Maximum events per strategy panel (0 = all events)',
        'strategy_all_events': 'When checked, render all events in each strategy panel',
        'strategy_tick_font_size': 'Font size for axis tick labels in Strategy plots',
        'strategy_axis_label_font_size': 'Font size for axis labels in Strategy plots',
        'strategy_title_font_size': 'Font size for the panel title text in Strategy plots',
        'strategy_gate_label_font_size': 'Font size for gate labels in Strategy plots',
        'strategy_contour_threshold': 'Outer contour level as a percentage of peak density',
        'strategy_kde_bandwidth': 'Contour smoothing bandwidth for Strategy contour mode (0 = auto)',
        'strategy_n_columns': 'Number of plot columns in the Strategy grid',
        'strategy_fit_to_columns': 'Scale strategy panels to fit the chosen number of columns',
        'strategy_render_btn':   'Render the strategy mini-plot grid',
        'illust_max_events':   'Maximum events per panel (0 = all events)',
        'illust_all_events':   'When checked, render all events in each panel',
        'illust_tick_font_size': 'Font size for axis tick labels in Illustration plots',
        'illust_axis_label_font_size': 'Font size for axis labels in Illustration plots',
        'illust_title_font_size': 'Font size for the panel title text in Illustration plots',
        'illust_gate_label_font_size': 'Font size for gate labels in Illustration plots',
        'illust_kde_bandwidth': 'Contour smoothing bandwidth for Illustration contour mode (0 = auto)',
        'illust_n_columns': 'Number of plot columns per population row in Illustration grid',
        'illust_fit_to_columns': 'Scale panel size to fit the chosen number of columns',
        'strategy_export_png': 'Export the gating strategy grid as a PNG',
        'strategy_export_pdf_dl': 'Export the gating strategy grid as a vector SVG with grouped elements for Illustrator',
        'illust_render_btn':   'Render the illustration mini-plot grid',
        'illust_export_png':   'Export the illustration grid as a PNG',
        'illust_export_pdf_dl':   'Export the illustration grid as a vector SVG with grouped elements for Illustrator'
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
