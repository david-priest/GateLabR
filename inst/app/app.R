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
    tags$script(src = "cytof_plot.js?v=20260623b"),
    tags$script(src = "mini_plot.js?v=20260623b"),
    tags$script(src = "division_plot.js?v=20260626f"),
    tags$script(src = "pop_tree_scroll.js?v=20260623b"),
    tags$link(rel = "stylesheet", href = "custom.css?v=20260623b")
  ),

  titlePanel("GateLabR"),

  fluidRow(
    # ═══════════════════════════════════════════════════════════════════════════
    # LEFT COLUMN: SCE/FCS + sample filter
    # ═══════════════════════════════════════════════════════════════════════════
    column(3,
      tags$div(class = "panel-section",

        # ── Data selection card ──────────────────────────────────────────────
        tags$div(class = "workspace-block", style = "margin-bottom:6px;",
          tags$div(class = "workspace-block-title", "Data"),
          tags$div(style = "display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-bottom:4px;",
            tags$div(
              tags$label("SCE:", class = "control-label"),
              selectInput("sce_select", NULL, choices = NULL, width = "100%")
            ),
            tags$div(
              tags$label("Assay:", class = "control-label"),
              selectInput("assay_select", NULL, choices = NULL, width = "100%")
            )
          ),
          tags$div(style = "display:flex; gap:4px;",
            actionButton("rename_sce_btn", "Rename SCE",
                         class = "btn-xs btn-default"),
            actionButton("refresh_sce_btn", "\u21ba Refresh",
                         class = "btn-xs btn-default",
                         title = "Re-scan global environment for SCE objects")
          )
        ),

        # ── FCS import card ──────────────────────────────────────────────────
        tags$div(class = "workspace-block", style = "margin-bottom:6px;",
          tags$div(class = "workspace-block-title", "Import FCS"),
          tags$div(class = "fcs-inline-controls",
            tags$div(class = "fcs-inline-item",
              fileInput("fcs_upload", NULL,
                        multiple = TRUE, accept = ".fcs",
                        buttonLabel = "New FCS...",
                        placeholder = "No files selected")
            ),
            tags$div(class = "fcs-inline-item",
              fileInput("fcs_append_upload", NULL,
                        multiple = TRUE, accept = ".fcs",
                        buttonLabel = "Append FCS...",
                        placeholder = "No files selected")
            ),
            tags$div(class = "fcs-inline-action",
              actionButton("append_fcs_btn", "Append",
                           class = "btn-sm btn-default")
            )
          )
        ),

        # ── Instrument mode card ─────────────────────────────────────────────
        tags$div(class = "workspace-block", style = "margin-bottom:6px;",
          tags$div(class = "workspace-block-title", "Instrument Mode"),
          radioButtons("instrument_mode", NULL,
                 choices = c("Auto-detect" = "auto",
                 "Force CyTOF" = "cytof",
                 "Force Flow" = "flow"),
                 selected = "auto", inline = TRUE),
          tags$div(style = "display:flex; align-items:center; gap:8px; margin-top:2px;",
            actionButton("apply_instrument_mode_btn", "Apply to Loaded SCE",
                         class = "btn-xs btn-default"),
            uiOutput("instrument_badge_ui")
          )
        ),

        # ── Sample filter ──
        tags$div(class = "section-header",
          "Sample Filter",
          tags$span(
            textOutput("sample_filter_summary", inline = TRUE),
            style = "font-weight: normal; font-size: 11px; color: #888; text-transform:none; letter-spacing:0;"
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

          # ── Gates & populations (auto-saved to SCE metadata) ──
          tags$div(class = "workspace-block",
            tags$div(class = "workspace-block-title",
                     "Gates & populations",
                     tags$span(" — auto-saved to SCE",
                       style = "font-weight:normal;color:#7a8493;font-size:10px;")),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;",
              actionButton("load_workspace_btn","📂 From SCE",class="btn-xs btn-default",style="width:100%"),
              actionButton("export_pop_btn","→ colData",class="btn-xs btn-info",style="width:100%"),
              actionButton("reset_workspace_btn","🗑 Reset",class="btn-xs btn-danger",style="width:100%")
            ),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:4px;",
              downloadButton("save_workspace_rds_dl","⬇ Save .rds",class="btn-xs btn-primary",style="width:100%;"),
              tags$div(style="position:relative;",
                fileInput("load_workspace_rds_upload",NULL,accept=c(".rds",".RDS"),
                          buttonLabel="📂 Load .rds...",placeholder="",multiple=FALSE,width="100%")
              )
            )
          ),

          # ── Full SCE file persistence ──
          tags$div(class = "workspace-block",style="margin-top:4px;",
            tags$div(class = "workspace-block-title", "SCE file"),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:4px;",
              downloadButton("save_rds_dl","⬇ Save SCE",class="btn-xs btn-success",style="width:100%;"),
              actionButton("export_fcs_btn","⬆ Export FCS",class="btn-xs btn-warning",style="width:100%")
            ),
            fileInput("load_rds_upload",NULL,accept=c(".rds",".RDS"),
                      buttonLabel="Load SCE...",placeholder="No file selected",multiple=FALSE)
          ),

          # ── GatingML ──
          tags$div(class="workspace-block",style="margin-top:4px;",
            tags$div(class="workspace-block-title","GatingML"),
            fileInput("import_gatingml_upload",NULL,
                      accept=c(".xml",".gatingml",".Gating-ML"),
                      buttonLabel="Import GatingML...",placeholder="No file selected",multiple=FALSE),
            tags$div(style="display:grid;grid-template-columns:1fr 1fr;gap:4px;",
              downloadButton("export_gatingml_dl","Export (Cytobank)",
                             class="btn-xs btn-default",style="width:100%;text-align:left;"),
              downloadButton("export_gatingml_standard_dl","Export (Standard)",
                             class="btn-xs btn-default",style="width:100%;text-align:left;")
            )
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
              actionButton("mode_quadrant",
                HTML('<svg width="14" height="14" viewBox="0 0 14 14"><line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" stroke-width="1.8"/><line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.8"/></svg> Quad'),
                class = "btn-sm btn-default", title = "Place quadrant gate (click the crosshair centre)",
                onclick = "window.CytofD3 && window.CytofD3.setMode('draw-quadrant')"),
              actionButton("mode_cancel", "✕ Cancel", class = "btn-sm btn-warning",
                           onclick = "window.CytofD3 && window.CytofD3.setMode('navigate')")
            ),
            tags$div(style = "display:flex; gap:4px; margin-left: auto;",
              actionButton("flip_axes", "", icon = icon("arrows-h"),
                           class = "btn-xs btn-default"),
              actionButton("refresh_plot_btn", "Refresh", class = "btn-xs btn-default")
            )
          ),
          uiOutput("gating_display_pops_ui"),
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

              # Parameter grid: 3-column, strategy-block cards
              tags$div(class = "strategy-control-grid",

                # Card 0: Display mode
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title", "Display"),
                  radioButtons("display_mode", NULL,
                               choices = c("Scatter"="scatter","Pseudo"="pseudocolor","Contour"="contour"),
                               selected = "pseudocolor", inline = FALSE),
                  tags$div(style = "margin-top:4px;",
                    sliderInput("point_alpha", "Opacity:", min=0.05, max=1.0, value=0.35, step=0.05, width="100%", ticks=FALSE)
                  ),
                  conditionalPanel("input.display_mode == 'contour'",
                    tags$div(style = "display:flex; align-items:center; gap:4px; margin-top:4px;",
                      tags$span("Outer:", style = "font-size:11px; color:#555;"),
                      selectInput("contour_threshold", NULL,
                                  choices = c("1%"=1,"2%"=2,"5%"=5,"10%"=10,"20%"=20,"30%"=30),
                                  selected = 5, width = "80px")
                    )
                  )
                ),

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
                ),

                # Card 3: Color by marker / metadata
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title",
                    "Color by marker / metadata",
                    tags$span(style = "float:right; margin-top:-2px;",
                      actionButton("clear_overlay_btn", "Clear", class = "btn-xs btn-default"))
                  ),
                  selectInput("overlay_coldata", NULL,
                              choices = c("(none)" = ""), selected = "", width = "100%"),
                  selectInput("overlay_palette", "Palette",
                              choices = OVERLAY_PALETTES, selected = "paired", width = "100%"),
                  uiOutput("overlay_checkboxes_ui")
                )
              )
            )
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
                  tags$div(class = "gating-control-box-title", "Population"),
                  selectInput("strategy_pop", NULL, choices = NULL),
                  checkboxInput("strategy_full_path", "Use full path from root", FALSE)
                ),
                tags$div(class = "strategy-block", style = "align-self:start;",
                  tags$div(class = "gating-control-box-title", "Gate view"),
                  checkboxGroupInput("strategy_gate_view", NULL,
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
              tags$div(class = "strategy-block", style = "align-self:start;",
                tags$div(class = "gating-control-box-title", "Display mode"),
                radioButtons("strategy_display", NULL,
                             choices = c("Scatter" = "scatter",
                                         "Pseudo" = "pseudocolor",
                                         "Contour" = "contour"),
                             selected = "pseudocolor", inline = TRUE)
              )
            ),

            tags$div(class = "strategy-params-grid",
              style = "display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;",
              tags$div(class = "strategy-param-card",
                tags$div(class = "gating-control-box-title", "Sampling"),
                tags$div(style = "display:flex; align-items:center; gap:6px; flex-wrap:wrap;",
                  tags$div(
                    tags$label("Max events / panel:", style = "font-size:11px; color:#555; margin-bottom:2px; display:block;"),
                    numericInput("strategy_max_events", NULL,
                                 value = 10000, min = 0, max = 100000, step = 1000, width = "100px")
                  )
                ),
                checkboxInput("strategy_all_events", "Plot all events", value = FALSE)
              ),
              tags$div(class = "strategy-param-card",
                tags$div(class = "gating-control-box-title", "Layout"),
                tags$div(style = "display:flex; gap:8px; flex-wrap:wrap; align-items:flex-end;",
                  tags$div(
                    tags$label("Plot size (px):", style = "font-size:11px; color:#555; margin-bottom:2px; display:block;"),
                    numericInput("strategy_plot_size", NULL,
                                 value = 200, min = 150, max = 500, step = 25, width = "80px")
                  ),
                  conditionalPanel("input.strategy_mode === 'single'",
                    tags$div(
                      tags$label("Columns:", style = "font-size:11px; color:#555; margin-bottom:2px; display:block;"),
                      numericInput("strategy_n_columns", NULL,
                                   value = 4, min = 1, max = 12, step = 1, width = "70px")
                    )
                  )
                ),
                conditionalPanel("input.strategy_mode === 'single'",
                  checkboxInput("strategy_fit_to_columns", "Fit panels to columns", value = TRUE)
                )
              ),
              tags$div(class = "strategy-param-card strategy-font-card",
                tags$div(class = "gating-control-box-title", "Font sizes (px)"),
                tags$div(style = "display:grid; grid-template-columns:repeat(2, auto); gap:4px 12px; align-items:center;",
                  tags$label("Tick labels:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_tick_font_size", NULL,
                               value = 8, min = 6, max = 24, step = 1, width = "70px"),
                  tags$label("Axis labels:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_axis_label_font_size", NULL,
                               value = 10, min = 6, max = 28, step = 1, width = "70px"),
                  tags$label("Titles:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_title_font_size", NULL,
                               value = 10, min = 6, max = 28, step = 1, width = "70px"),
                  tags$label("Gate labels:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_gate_label_font_size", NULL,
                               value = 8, min = 6, max = 24, step = 1, width = "70px")
                )
              ),
              tags$div(class = "strategy-param-card",
                tags$div(class = "gating-control-box-title", "Points & export"),
                tags$div(style = "display:grid; grid-template-columns:repeat(2, auto); gap:4px 12px; align-items:center; margin-bottom:6px;",
                  tags$label("Point size:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_point_size", NULL,
                               value = 1.2, min = 0.1, max = 5, step = 0.1, width = "70px"),
                  tags$label("SVG raster DPI:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_pdf_dpi", NULL,
                               value = 300, min = 72, max = 1200, step = 50, width = "70px")
                ),
                sliderInput("strategy_point_alpha", "Point opacity:",
                            min = 0.05, max = 1.0, value = 0.35, step = 0.05, width = "100%", ticks = FALSE)
              ),
              tags$div(class = "strategy-param-card",
                tags$div(class = "gating-control-box-title", "Style"),
                checkboxInput("strategy_pub_style",
                              "Publication style (black gates, no label background)",
                              value = FALSE),
                tags$div(style = "display:flex; align-items:center; gap:8px; margin-top:4px;",
                  tags$label("Gate line width:", style = "font-size:11px; color:#555; margin:0;"),
                  numericInput("strategy_gate_line_width", NULL,
                               value = 1.5, min = 0.5, max = 5, step = 0.25, width = "70px")
                )
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
                              min = 0, max = 14, value = 0, step = 0.2, width = "100%", ticks = FALSE)
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

            # ── Illustration Presets ────────────────────────────────────────────
            tags$details(id = "illust_presets_section", style = "margin-bottom:6px;",
              tags$summary(
                tags$span(class = "umap-run-toggle",
                  icon("bookmark"),
                  tags$span(class = "umap-run-chev-closed", HTML("&nbsp;▸&nbsp;Illustration Presets")),
                  tags$span(class = "umap-run-chev-open",   HTML("&nbsp;▾&nbsp;Illustration Presets"))
                )
              ),
              tags$div(class = "illust-presets-body",
                       style = "padding:8px; border:1px solid #7892c7; border-radius:4px; margin-top:2px; background:#fbfcff;",
                tags$div(style = "display:flex; align-items:center; gap:6px; margin-bottom:6px;",
                  tags$span("Name:", style = "font-size:11px; white-space:nowrap; color:#555;"),
                  textInput("illust_preset_name", NULL, value = "",
                            placeholder = "Preset name…", width = "160px"),
                  actionButton("illust_preset_save_btn", "Save",
                               class = "btn-xs btn-primary",
                               title = "Save current illustration settings as a named preset")
                ),
                tags$div(style = "display:flex; align-items:center; gap:6px;",
                  uiOutput("illust_preset_select_ui"),
                  actionButton("illust_preset_load_btn", "Load",
                               class = "btn-xs btn-default",
                               title = "Restore this preset"),
                  actionButton("illust_preset_delete_btn", "Delete",
                               class = "btn-xs btn-danger",
                               title = "Delete this preset")
                )
              )
            ),

            tags$div(class = "illust-control-grid",
              tags$div(class = "illust-block",
                tags$div(class = "gating-control-box-title", "Plot Type"),
                radioButtons("illust_plot_type", NULL,
                             choices = c("Biplot" = "biplot", "Histogram" = "histogram"),
                             selected = "biplot", inline = TRUE),
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  selectInput("illust_y_channel", "Y channel:", choices = NULL)
                )
              ),
              tags$div(class = "illust-block",
                tags$div(class = "gating-control-box-title", "Display"),
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  radioButtons("illust_display", NULL,
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
                tags$div(class = "gating-control-box-title", "Notes"),
                tags$div(style = "font-size:11px; color:#555; margin-top:2px;",
                  "Global channel scales from the Scales tab are always used."
                )
              )
            ),

            tags$div(class = "illust-params-grid",
              tags$div(class = "illust-param-card",
                tags$div(class = "gating-control-box-title", "Sampling"),
                numericInput("illust_max_events", "Max events / panel (0 = all):",
                             value = 10000, min = 0, max = 50000, step = 1000),
                checkboxInput("illust_all_events", "Plot all events", value = FALSE)
              ),
              tags$div(class = "illust-param-card",
                tags$div(class = "gating-control-box-title", "Layout"),
                numericInput("illust_plot_size", "Plot size (px):",
                             value = 200, min = 150, max = 400, step = 25),
                numericInput("illust_n_columns", "Columns:",
                             value = 4, min = 1, max = 12, step = 1),
                checkboxInput("illust_fit_to_columns", "Fit panels to columns", value = TRUE)
              ),
              tags$div(class = "illust-param-card illust-font-card",
                tags$div(class = "gating-control-box-title", "Font Sizes (px)"),
                tags$div(class = "illust-font-grid",
                  numericInput("illust_tick_font_size", "Tick labels:",
                               value = 8, min = 6, max = 24, step = 1),
                  numericInput("illust_axis_label_font_size", "Axis labels:",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("illust_title_font_size", "Titles:",
                               value = 10, min = 6, max = 28, step = 1),
                  numericInput("illust_gate_label_font_size", "Gate labels:",
                               value = 8, min = 6, max = 24, step = 1)
                )
              ),
              tags$div(class = "illust-param-card",
                tags$div(class = "gating-control-box-title", "Points & Export"),
                numericInput("illust_pdf_dpi", "SVG raster DPI:",
                             value = 300, min = 72, max = 1200, step = 50),
                conditionalPanel(
                  "input.illust_plot_type == 'biplot'",
                  numericInput("illust_point_size", "Point size (px):",
                               value = 1.2, min = 0.1, max = 5, step = 0.1),
                  sliderInput("illust_point_alpha", "Point opacity:",
                              min = 0.05, max = 1.0, value = 0.35, step = 0.05, width = "100%", ticks = FALSE)
                ),
                conditionalPanel(
                  "input.illust_plot_type == 'histogram'",
                  numericInput("illust_hist_line_width", "Histogram line width:",
                               value = 1.8, min = 0.5, max = 6, step = 0.1),
                  checkboxInput("illust_hist_fill", "Fill histogram area", value = FALSE),
                  sliderInput("illust_hist_fill_alpha", "Histogram fill opacity:",
                              min = 0, max = 1.0, value = 0.22, step = 0.05, width = "100%", ticks = FALSE),
                  selectInput("illust_hist_overlay_mode", "Overlay fill behavior:",
                              choices = c("Blend fills" = "blend",
                                          "Front histogram opaque" = "front_opaque"),
                              selected = "front_opaque"),
                  selectInput("illust_hist_layout", "Layout:",
                              choices = c("Grid (one panel per population)" = "grid",
                                          "Ridgeline (stacked populations)" = "ridgeline"),
                              selected = "grid"),
                  conditionalPanel(
                    "input.illust_hist_layout == 'ridgeline'",
                    sliderInput("illust_ridge_overlap", "Ridge overlap (compactness):",
                                min = 0, max = 0.95, value = 0.7, step = 0.05,
                                width = "100%", ticks = FALSE),
                    sliderInput("illust_ridge_col_gap", "Column spacing (px):",
                                min = 0, max = 60, value = 8, step = 2,
                                width = "100%", ticks = FALSE),
                    checkboxInput("illust_ridge_gradient",
                                  "Heat gradient fill (black→yellow by signal)",
                                  value = TRUE)
                  )
                )
              ),
              conditionalPanel(
                "input.illust_plot_type == 'biplot'",
                tags$div(class = "illust-param-card",
                  tags$div(class = "gating-control-box-title", "Style"),
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
                              min = 0, max = 14, value = 0, step = 0.2, width = "100%", ticks = FALSE)
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

        # ── Tab 4: UMAP ───────────────────────────────────────────────────────
        tabPanel("UMAP",
          tags$style(HTML("
            .umap-controls { max-width: 100%; box-sizing: border-box; }
            .umap-compact .form-group { margin-bottom: 4px; }
            .umap-compact label { font-size: 11px; margin-bottom: 1px; font-weight: 500; display: block; }
            .umap-compact .shiny-input-container:not(.shiny-input-container-inline) {
              width: auto !important; min-width: 0; margin: 0;
            }
            .umap-compact input[type='number'],
            .umap-compact input[type='text'] {
              width: 70px; min-width: 55px; max-width: 100%;
              padding: 2px 4px; font-size: 11px;
            }
            .umap-compact .selectize-control,
            .umap-compact select { width: 150px; min-width: 120px; }
            .umap-compact .selectize-input { font-size: 11px; min-height: 28px; padding: 3px 6px; }
            .umap-compact .irs { margin-bottom: 2px; }
            .umap-compact .irs-grid-text { font-size: 9px; }
            .umap-flex-row {
              display: flex; flex-wrap: wrap; gap: 8px 12px; align-items: flex-end;
              margin-bottom: 6px;
            }
            .umap-field { display: flex; flex-direction: column; }
            .umap-field-wide { flex: 1 1 200px; min-width: 160px; max-width: 100%; }
            .umap-field-color input[type='color'] {
              width: 48px !important; height: 28px; padding: 1px; border: 1px solid #bbb;
              border-radius: 3px; cursor: pointer;
            }
            .umap-run-toggle {
              display: inline-block; background: #eaf1ff; border: 1px solid #7892c7;
              border-radius: 4px; padding: 4px 12px; font-weight: 600;
              color: #1e3a7a; cursor: pointer; user-select: none;
              font-size: 12px; margin: 4px 0;
            }
            .umap-run-toggle:hover { background: #d7e3f9; }
            details > summary { list-style: none; }
            details > summary::-webkit-details-marker,
            details > summary::marker { display: none; }
            details[open] .umap-run-chev-closed { display: none; }
            details:not([open]) .umap-run-chev-open { display: none; }
            .umap-features-used {
              font-size: 10px; color: #444; line-height: 1.3;
              background: #f7f7fa; border: 1px solid #e0e0e8;
              padding: 3px 6px; border-radius: 3px; margin-top: 2px;
              max-height: 48px; overflow-y: auto;
            }
          ")),
          tags$div(class = "umap-controls", style = "padding:6px 4px;",

            tags$div(class = "umap-top-actions",
                     style = "display:flex; gap:8px; align-items:center; margin-bottom:6px;",
              actionButton("umap_render_btn", "Render UMAP",
                           class = "btn-sm btn-primary"),
              downloadButton("umap_export_svg_dl", "SVG",
                             class = "btn-sm btn-default"),
              downloadButton("umap_export_pdf_dl", "PDF",
                             class = "btn-sm btn-default"),
              tags$span(textOutput("umap_status", inline = TRUE),
                        style = "font-size:11px; color:#666;")
            ),

            # ── Controls grid: Populations | Reduction + Appearance ───────────
            tags$div(class = "strategy-control-grid umap-compact",
                     style = "grid-template-columns: minmax(180px, 1.2fr) minmax(180px, 1fr);",

              # ── Block 1: Color / Populations ────────────────────────────────
              tags$div(class = "strategy-block",
                tags$div(class = "gating-control-box-title", "Color / Populations"),
                selectInput("umap_color_mode", "Color by:",
                            choices = c("Populations" = "populations",
                                        "colData column" = "coldata",
                                        "Marker expression" = "marker"),
                            selected = "populations"),
                conditionalPanel(
                  "input.umap_color_mode == 'coldata'",
                  selectInput("umap_color_coldata", "colData column:", choices = NULL)
                ),
                conditionalPanel(
                  "input.umap_color_mode == 'marker'",
                  selectInput("umap_color_marker", "Marker:", choices = NULL)
                ),
                conditionalPanel(
                  "input.umap_color_mode == 'populations'",
                  tags$div(style = "font-size:11px; color:#666; margin-bottom:2px;",
                    "Show populations (rest → Ungated):"),
                  tags$div(style = "display:flex; gap:4px; margin-bottom:4px;",
                    actionButton("umap_display_pops_all",   "All",
                                 class = "btn-xs btn-default", style = "padding:1px 6px; font-size:10px;"),
                    actionButton("umap_display_pops_clear", "None",
                                 class = "btn-xs btn-default", style = "padding:1px 6px; font-size:10px;")
                  ),
                  tags$div(style = "max-height:130px; overflow-y:auto; border:1px solid #eee; padding:2px 4px; border-radius:3px; font-size:11px;",
                    checkboxGroupInput("umap_display_pops", NULL, choices = NULL, selected = NULL)
                  )
                ),
                tags$div(style = "display:flex; align-items:center; gap:6px; margin-top:6px;",
                  tags$label("Ungated colour:", style = "font-size:11px; margin:0; color:#555;"),
                  tags$input(id = "umap_ungated_color",
                             type = "color", value = "#BBBBBB",
                             style = "width:36px; height:24px; padding:1px; border:1px solid #bbb; border-radius:3px; cursor:pointer;",
                             onchange = "Shiny.setInputValue('umap_ungated_color', this.value, {priority:'event'});")
                )
              ),

              # ── Block 2: Reduction + Appearance (stacked) ───────────────────
              tags$div(style = "display:flex; flex-direction:column; gap:8px;",

                # Reduction sub-block
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title", "Reduction"),
                  selectInput("umap_dr_name", NULL, choices = NULL, selected = NULL),
                  tags$div(style = "font-size:11px; color:#666; margin-bottom:2px;",
                           textOutput("umap_dr_info", inline = TRUE)),
                  tags$div(style = "display:flex; gap:4px; align-items:center; margin-top:3px;",
                    tags$span("Markers used:", style = "font-size:10px; color:#444;"),
                    actionButton("umap_reuse_features", "Reselect",
                                 class = "btn-xs btn-default",
                                 style = "padding:1px 6px; font-size:10px;",
                                 title = "Tick these markers as the Run-UMAP feature set")
                  ),
                  tags$div(class = "umap-features-used",
                           textOutput("umap_features_used", inline = FALSE))
                ),

                # Appearance sub-block
                tags$div(class = "strategy-block",
                  tags$div(class = "gating-control-box-title", "Appearance"),
                  tags$div(style = "display:flex; flex-wrap:wrap; gap:6px 12px; align-items:flex-end; margin-bottom:6px;",
                    tags$div(numericInput("umap_point_size",  "Pt size:", value = 0.6, min = 0.1, max = 5,  step = 0.1)),
                    tags$div(style = "min-width:140px; flex:1;",
                      sliderInput("umap_point_alpha", "Opacity:", min = 0.05, max = 1, value = 0.8, step = 0.05, ticks = FALSE, width = "100%")),
                    tags$div(numericInput("umap_text_size",   "Font (pt):", value = 14, min = 6,  max = 36, step = 1)),
                    tags$div(numericInput("umap_plot_width",  "W (in):",    value = 7,  min = 3,  max = 20, step = 0.5)),
                    tags$div(numericInput("umap_plot_height", "H (in):",    value = 7,  min = 3,  max = 20, step = 0.5))
                  ),
                  tags$div(style = "display:flex; flex-wrap:wrap; gap:0 12px; font-size:11px;",
                    checkboxInput("umap_rasterize",   "Rasterize",  value = TRUE),
                    checkboxInput("umap_hide_axis",   "Hide axes",  value = TRUE),
                    checkboxInput("umap_show_legend", "Legend",     value = TRUE),
                    checkboxInput("umap_label_pops",  "Label pops", value = FALSE)
                  )
                )
              )
            ),

            # ── Run-UMAP collapsible section ──────────────────────────────────
            tags$details(id = "umap_run_section",
              tags$summary(
                tags$span(class = "umap-run-toggle",
                  icon("cogs"),
                  tags$span(class = "umap-run-chev-closed", HTML("&nbsp;▸&nbsp;Run / Re-run UMAP")),
                  tags$span(class = "umap-run-chev-open",   HTML("&nbsp;▾&nbsp;Run / Re-run UMAP"))
                )
              ),
              tags$div(class = "umap-run-body umap-compact",
                       style = "padding:8px 8px; border:1px solid #7892c7; border-radius:4px; margin-top:2px; background:#fbfcff;",
                tags$div(class = "umap-flex-row",
                  tags$div(class = "umap-field",
                    numericInput("umap_run_cells",       "Cells/samp:", value = 1000, min = 100, max = 50000, step = 100)),
                  tags$div(class = "umap-field",
                    numericInput("umap_run_n_neighbors", "n_neigh:",    value = 15,   min = 2,   max = 200,   step = 1)),
                  tags$div(class = "umap-field",
                    numericInput("umap_run_min_dist",    "min_dist:",   value = 0.01, min = 0,   max = 1,     step = 0.01)),
                  tags$div(class = "umap-field",
                    numericInput("umap_run_seed",        "Seed:",       value = 1234, min = 0,   max = 99999, step = 1)),
                  tags$div(class = "umap-field",
                    textInput(   "umap_run_name",        "Red. name:",  value = "UMAP"))
                ),
                tags$div(class = "umap-flex-row",
                  tags$div(class = "umap-field umap-field-wide",
                    selectInput("umap_run_on_population", "Run on population:",
                                choices  = c("All cells" = "__all__"),
                                selected = "__all__"),
                    tags$div(style = "font-size:10px; color:#888;",
                      "Restrict to events in a gated population (e.g. live cells).")
                  ),
                  tags$div(class = "umap-field umap-field-wide",
                    tags$label("Samples to include:", style = "font-size:11px; margin-bottom:2px;"),
                    tags$div(style = "display:flex; gap:4px; margin-bottom:2px; flex-wrap:wrap;",
                      actionButton("umap_run_samples_all",   "All",
                                   class = "btn-xs btn-default", style = "padding:1px 6px; font-size:10px;"),
                      actionButton("umap_run_samples_clear", "None",
                                   class = "btn-xs btn-default", style = "padding:1px 6px; font-size:10px;"),
                      actionButton("umap_run_samples_sync",  "Use left filter",
                                   class = "btn-xs btn-default", style = "padding:1px 6px; font-size:10px;",
                                   title = "Copy the current left-panel sample filter selection")
                    ),
                    tags$div(style = "max-height:100px; overflow-y:auto; border:1px solid #e0e0e8; padding:2px 4px; border-radius:3px; font-size:11px; background:white;",
                      checkboxGroupInput("umap_run_samples", NULL, choices = NULL, selected = NULL)
                    )
                  )
                ),
                tags$div(class = "section-header", "Type markers (features)"),
                uiOutput("umap_feature_channels_ui"),
                tags$div(style = "margin-top:8px;",
                  actionButton("umap_run_btn", "Run UMAP",
                               class = "btn-sm btn-primary", icon = icon("play"))
                )
              )
            )
          ),
          tags$div(id = "umap-plot-container",
                   style = "padding:8px 4px; overflow:auto; min-height:400px;",
            plotOutput("umap_plot", width = "auto", height = "700px")
          )
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
                tags$div(class = "gating-control-box-title",
                  "Statistics",
                  tags$span(style = "float:right; margin-top:-2px;",
                    actionButton("stats_types_all_btn",  "All",  class = "btn-xs btn-default"),
                    actionButton("stats_types_none_btn", "None", class = "btn-xs btn-default")
                  )
                ),
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
                tags$div(class = "gating-control-box-title", "Value Space (MFI)"),
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

            tags$div(class = "gating-control-box-title", style = "margin-top:8px;",
              "Channels",
              tags$span(style = "float:right; margin-top:-2px;",
                actionButton("stats_channels_all_btn",  "All",  class = "btn-xs btn-default"),
                actionButton("stats_channels_none_btn", "None", class = "btn-xs btn-default")
              )
            ),
            uiOutput("stats_channels_ui"),
            tags$div(class = "gating-control-box-title", style = "margin-top:8px;",
              "Populations",
              tags$span(style = "float:right; margin-top:-2px;",
                actionButton("stats_pops_all_btn",  "All",  class = "btn-xs btn-default"),
                actionButton("stats_pops_none_btn", "None", class = "btn-xs btn-default")
              )
            ),
            uiOutput("stats_populations_ui")
          ),
          tags$div(class = "stats-table-container",
            DT::dataTableOutput("stats_table")
          )
        ),

        # ── Tab 5: Panel (marker rename) ─────────────────────────────────────
        tabPanel("Panel",
          tags$div(class = "scales-controls",
            tags$div(class = "gating-control-box-title", "Channel / Marker Names"),
            tags$div(style = "font-size:11px; color:#666; margin-bottom:8px;",
              "Edit the display name (marker) for each channel.",
              " The FCS channel ID (e.g. metal or detector name) is shown for reference and",
              " cannot be changed. Scatter channels (FSC/SSC) are locked as their names",
              " drive axis scaling."
            ),
            tags$div(style = "margin-bottom:8px; display:flex; gap:6px; align-items:center;",
              actionButton("apply_panel_rename_btn", "Apply Renames",
                           class = "btn-sm btn-primary"),
              actionButton("reset_panel_rename_btn", "Reset",
                           class = "btn-sm btn-default",
                           title = "Revert all edits to current names")
            ),
            uiOutput("panel_rename_ui"),

            # ── Bulk rename via CSV ──────────────────────────────────────────
            tags$hr(style = "margin: 12px 0;"),
            tags$div(class = "gating-control-box-title", "Bulk Rename (CSV / Excel)"),
            tags$div(style = "font-size:11px; color:#666; margin-bottom:6px;",
              "Upload a CSV with columns ", tags$code("fcs_channel"), " and ",
              tags$code("new_marker"), " to rename multiple markers at once."
            ),
            tags$div(style = "display:flex; gap:6px; align-items:center; flex-wrap:wrap;",
              fileInput("panel_bulk_rename_upload", NULL,
                        accept = c(".csv", ".xlsx", ".xls"),
                        width = "260px",
                        placeholder = "No file selected"),
              actionButton("apply_panel_bulk_rename_btn", "Apply Bulk Rename",
                           class = "btn-sm btn-default"),
              downloadButton("panel_bulk_rename_template_dl", "Download Template",
                             class = "btn-sm btn-default")
            )
          )
        ),

        # ── Tab 6: Scales ─────────────────────────────────────────────────────
        tabPanel("Scales",
          tags$div(class = "scales-controls",
            uiOutput("compensation_ui"),
            tags$div(class = "section-header", "Global Channel Scales"),
            tags$div(style = "font-size:11px; color:#666; margin-bottom:8px;",
              "Define per-channel axis ranges used across Gating, Strategy, and Illustration.",
              " These global scales keep axes uniform across all panels for figure export."
            ),
            uiOutput("scales_channels_ui")
          )
        ),

        # ── Tab 7: Division profiling ─────────────────────────────────────────
        tabPanel("Division",
          tags$div(class = "division-controls", style = "padding:6px 4px;",
            tags$div(style = "display:flex; gap:8px; align-items:center; margin-bottom:6px; flex-wrap:wrap;",
              actionButton("division_render_btn", "Render", class = "btn-sm btn-primary"),
              actionButton("division_space_evenly_btn", "Space evenly", class = "btn-sm btn-default",
                           title = "Re-seed boundaries from the displayed data (even spacing)"),
              actionButton("division_load_btn", "Load saved", class = "btn-sm btn-default",
                           title = "Load the selected sample's previously-applied boundaries (one sample selected)"),
              actionButton("division_write_btn", "Apply to selected", class = "btn-sm btn-info",
                           title = "Apply the current boundaries to every selected sample: store per-sample, write Div0..DivN into colData$div for the WHOLE sample (ignores the population filter), and persist to metadata"),
              tags$span(textOutput("division_status", inline = TRUE),
                        style = "font-size:11px; color:#666;")
            ),
            tags$div(style = "display:flex; gap:10px; align-items:flex-end; flex-wrap:wrap; margin-bottom:6px;",
              tags$div(selectInput("division_channel", "Dye channel:", choices = NULL, width = "170px")),
              tags$div(numericInput("division_n", "# divisions (N):", value = 6, min = 1, max = 11,
                                    step = 1, width = "120px")),
              tags$div(style = "display:flex; flex-direction:column; gap:3px;",
                tags$label("Adjust N", style = "font-size:11px; color:#555; margin:0; font-weight:normal;"),
                tags$div(style = "display:flex; gap:4px;",
                  actionButton("division_remove_btn", "−", class = "btn-sm btn-default",
                               style = "width:42px; font-weight:bold; font-size:16px; line-height:1; padding:4px 0;"),
                  actionButton("division_add_btn", "+", class = "btn-sm btn-default",
                               style = "width:42px; font-weight:bold; font-size:16px; line-height:1; padding:4px 0;")
                )
              ),
              tags$div(style = "display:flex; flex-direction:column; gap:3px;",
                tags$label("Shift all", style = "font-size:11px; color:#555; margin:0; font-weight:normal;"),
                tags$div(style = "display:flex; gap:4px;",
                  actionButton("division_shift_down_btn", "←", class = "btn-sm btn-default",
                               style = "width:42px; font-weight:bold; font-size:16px; line-height:1; padding:4px 0;",
                               title = "Nudge all gates toward lower dye (left)"),
                  actionButton("division_shift_up_btn", "→", class = "btn-sm btn-default",
                               style = "width:42px; font-weight:bold; font-size:16px; line-height:1; padding:4px 0;",
                               title = "Nudge all gates toward higher dye (right)")
                )
              ),
              tags$div(numericInput("division_spacing", "Spacing (even):", value = NA, min = 0,
                                    step = 0.05, width = "110px")),
              tags$div(numericInput("division_xmin", "X min:", value = NA, step = 0.2, width = "92px")),
              tags$div(numericInput("division_xmax", "X max:", value = NA, step = 0.2, width = "92px")),
              tags$div(numericInput("division_bins", "Bins:", value = 120, min = 10, max = 400,
                                    step = 10, width = "90px")),
              tags$div(numericInput("division_subsample", "Subsample:", value = 50000, min = 1000,
                                    step = 1000, width = "110px")),
              tags$div(selectInput("division_ymarker", "Y marker (biplot):",
                                   choices = c("(none)" = ""), width = "170px")),
              tags$div(numericInput("division_point_alpha", "Biplot opacity:", value = 0.4,
                                    min = 0.02, max = 1, step = 0.05, width = "120px")),
              tags$div(style = "font-size:11px; color:#888; max-width:320px;",
                "Drag any line to fit. Div0 = brightest. Display follows the sample + population filters; ",
                tags$b("Apply writes the WHOLE sample"), " (ignores the population filter).")
            ),
            tags$div(id = "division-plot-container",
                     style = "padding:8px 4px; min-height:430px; position:relative; width:75%; min-width:560px;")
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
            actionButton("clear_selected_gates_btn", "", icon = icon("times"),
                         title = "Clear gate selection",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("delete_gate_btn", "", icon = icon("trash"),
                         title = "Delete checked gates (or selected gate if none checked)",
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
            actionButton("move_selected_pops_btn", "", icon = icon("share"),
                         title = "Move selected populations to a different parent",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("clear_selected_pops_btn", "", icon = icon("times"),
                         title = "Clear selection",
                         class = "btn-xs btn-default", style = "padding: 1px 5px;"),
            actionButton("delete_selected_pops_btn", "", icon = icon("trash"),
                         title = "Delete selected populations",
                         class = "btn-xs btn-danger", style = "padding: 1px 5px;")
          )
        ),
        tags$div(id = "population_tree_container", tabindex = "0",
                 uiOutput("population_tree_ui")),

        tags$div(class = "section-header", "Bulk Rename Populations"),
        tags$div(class = "bulk-rename-controls",
          tags$div(class = "bulk-rename-file",
            fileInput("bulk_pop_rename_upload", NULL,
                      accept = c(".csv", ".xlsx", ".xls"),
                      buttonLabel = "Choose .csv/.xlsx…",
                      placeholder = "No file selected",
                      multiple = FALSE)
          ),
          tags$div(class = "bulk-rename-actions",
            actionButton("apply_bulk_pop_rename_btn", "Apply Rename",
                         class = "btn-sm btn-default"),
            downloadButton("bulk_rename_template_dl", "Download Template",
                           class = "btn-sm btn-default")
          )
        ),
        tags$div(class = "bulk-rename-hint",
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
    overlay_factor = NULL, overlay_selected = NULL, overlay_palette = "paired",
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
    .pending_bulk_delete_gate_ids = character(0),
    .selected_pop_ids = character(0),
    .last_display_pop_mask = NULL,   # union mask of populations shown in the biplot
    .selected_gate_ids = character(0),
    .pending_gatingml_import = NULL,
    flow_logicle_w = list(),
    flow_logicle_w_auto = list(),
    flow_scatter_cofactor = list(),
    flow_raw_data = NULL,
    spillover_matrix = NULL,   # embedded $SPILLOVER (display-named), flow only
    comp_on = FALSE,           # apply compensation to the linear data (pre-gating)
    cytof_axis_range = list(),
    global_scale_ranges = list(),
    .scales_ui_version = 0L,
    .panel_ui_version  = 0L,
    .strategy_stale = FALSE,
    .illust_stale = FALSE,
    .flow_transform_version = 0L,
    illust_pop_palette = list(),
    illust_pop_selected = NULL,
    .illust_palette_ui_version = 0L,
    .illust_settings_pending = NULL,   # saved settings waiting for channel UI to render
    .illust_ui_restore_version = 0L,   # bumped to trigger deferred restore observer
    illust_presets = list(),           # named illustration presets stored in workspace
    # ── Division profiling tab (isolated from rv$gates) ──
    division_channel = NULL, division_ymarker = NULL, division_point_alpha = 0.4, division_n = 6L,
    division_boundaries = numeric(0),          # the single WORKING boundary set (stable across sample selection)
    division_by_sample = list(),               # APPLIED profiles: sample_id -> list(boundaries, n, channel)
    division_selected_samples = character(0),  # sample_id(s) currently selected in the left pane
    division_pop_label = NULL,                  # active population filter label (display only)
    division_spacing = NA_real_,               # last even-spacing gap (display hint + override)
    division_xrange = NULL,                     # user-fixed x-axis [min, max] (no autoscale)
    division_bins = 120L,                       # histogram bin count
    division_subsample = 50000L,                # events drawn in the histogram (stride)
    division_plot_data = NULL, .division_msg_seq = 0L,
    .last_division_drag_seq = 0L
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

  # ── Capture / apply illustration settings ─────────────────────────────────
  # capture_illust_settings() snapshots every illustration input + pop selection.
  # apply_illust_settings() restores them via the deferred UI restore mechanism.

  capture_illust_settings <- function(input, rv) {
    list(
      x_channels_simple    = as.character(isolate(input$illust_x_channels_simple)   %||% character(0)),
      x_channels_marker    = as.character(isolate(input$illust_x_channels_marker)   %||% character(0)),
      y_channel            = as.character(isolate(input$illust_y_channel)            %||% ""),
      plot_type            = as.character(isolate(input$illust_plot_type)            %||% "biplot"),
      display              = as.character(isolate(input$illust_display)              %||% "pseudocolor"),
      color_by_pop         = isTRUE(isolate(input$illust_color_by_pop)),
      overlay_pops         = isTRUE(isolate(input$illust_overlay_pops)),
      max_events           = isolate(input$illust_max_events)                        %||% 10000L,
      all_events           = isTRUE(isolate(input$illust_all_events)),
      plot_size            = isolate(input$illust_plot_size)                         %||% 200L,
      n_columns            = isolate(input$illust_n_columns)                         %||% 4L,
      fit_to_columns       = isTRUE(isolate(input$illust_fit_to_columns)),
      tick_font_size       = isolate(input$illust_tick_font_size)                    %||% 8L,
      axis_label_font_size = isolate(input$illust_axis_label_font_size)              %||% 10L,
      title_font_size      = isolate(input$illust_title_font_size)                   %||% 10L,
      gate_label_font_size = isolate(input$illust_gate_label_font_size)              %||% 8L,
      pdf_dpi              = isolate(input$illust_pdf_dpi)                           %||% 300L,
      point_size           = isolate(input$illust_point_size)                        %||% 1.2,
      point_alpha          = isolate(input$illust_point_alpha)                       %||% 0.35,
      hist_line_width      = isolate(input$illust_hist_line_width)                   %||% 1.8,
      hist_fill            = isTRUE(isolate(input$illust_hist_fill)),
      hist_fill_alpha      = isolate(input$illust_hist_fill_alpha)                   %||% 0.22,
      hist_overlay_mode    = as.character(isolate(input$illust_hist_overlay_mode)    %||% "front_opaque"),
      hist_layout          = as.character(isolate(input$illust_hist_layout)          %||% "grid"),
      ridge_overlap        = isolate(input$illust_ridge_overlap)                     %||% 0.7,
      ridge_col_gap        = isolate(input$illust_ridge_col_gap)                     %||% 8,
      ridge_gradient       = isTRUE(isolate(input$illust_ridge_gradient) %||% TRUE),
      pub_style            = isTRUE(isolate(input$illust_pub_style)),
      gate_line_width      = isolate(input$illust_gate_line_width)                   %||% 1.5,
      kde_bandwidth        = isolate(input$illust_kde_bandwidth)                     %||% 0,
      pop_selected         = rv$illust_pop_selected
    )
  }

  # Queue a settings snapshot for deferred UI restore (works across renderUI boundaries)
  apply_illust_settings <- function(s) {
    rv$.illust_settings_pending  <- s
    rv$.illust_ui_restore_version <- isolate(rv$.illust_ui_restore_version) + 1L
  }

  autosave <- function() {
    if (is.null(rv$sce) || is.null(rv$sce_name)) return()
    # Flush latest logicle W / scatter cofactor into SCE metadata before saving
    persist_flow_transform_state()
    persist_compensation_state()   # flush comp matrix + comp_on flag
    gate_value_space <- if (!is.null(rv$sce) && is_flow_session(rv$sce) &&
                            rv$assay_name == "exprs" && !is.null(rv$flow_raw_data)) {
      "raw"
    } else {
      "display"
    }
    illust_settings <- capture_illust_settings(input, rv)
    rv$sce <- save_workspace(
      rv$sce, rv$gates, rv$gate_order, rv$populations, rv$root_population_id,
      gate_value_space = gate_value_space,
      cytof_axis_range = rv$cytof_axis_range %||% list(),
      global_scale_ranges = rv$global_scale_ranges %||% list(),
      plot_range_override = rv$.plot_range_override,
      illust_pop_palette = rv$illust_pop_palette %||% list(),
      illust_pop_selected = rv$illust_pop_selected,
      illust_settings = illust_settings,
      illust_presets = rv$illust_presets %||% list(),
      division_profiles = rv$division_by_sample %||% list(),
      division_channel = rv$division_channel,
      division_xrange = rv$division_xrange,
      division_bins = rv$division_bins,
      division_subsample = rv$division_subsample,
      division_ymarker = rv$division_ymarker,
      division_point_alpha = rv$division_point_alpha
    )
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
  }

  # Build a portable workspace payload (same shape as save_workspace embeds
  # into SCE metadata, plus diagnostic fields for cross-SCE .rds transfer).
  build_workspace_payload <- function() {
    persist_flow_transform_state()
    persist_compensation_state()
    gate_value_space <- if (!is.null(rv$sce) && is_flow_session(rv$sce) &&
                            rv$assay_name == "exprs" && !is.null(rv$flow_raw_data)) {
      "raw"
    } else {
      "display"
    }
    illust_settings <- capture_illust_settings(input, rv)
    inst <- if (!is.null(rv$sce)) S4Vectors::metadata(rv$sce)$instrument_type else NA_character_
    list(
      gates                = rv$gates,
      gate_order           = rv$gate_order,
      populations          = rv$populations,
      root_population_id   = rv$root_population_id,
      gate_value_space     = gate_value_space,
      cytof_axis_range     = rv$cytof_axis_range %||% list(),
      global_scale_ranges  = rv$global_scale_ranges %||% list(),
      plot_range_override  = rv$.plot_range_override,
      illust_pop_palette   = rv$illust_pop_palette %||% list(),
      illust_pop_selected  = rv$illust_pop_selected,
      illust_settings      = illust_settings,
      illust_presets       = rv$illust_presets %||% list(),
      division_profiles    = rv$division_by_sample %||% list(),
      division_channel     = rv$division_channel,
      division_xrange      = rv$division_xrange,
      division_bins        = rv$division_bins,
      division_subsample   = rv$division_subsample,
      division_ymarker     = rv$division_ymarker,
      division_point_alpha = rv$division_point_alpha,
      comp_on              = isTRUE(rv$comp_on),
      version              = 2L,
      saved_at             = as.character(Sys.time()),
      # Diagnostic header for portable .rds files
      file_format            = "GateLabR-workspace-v2",
      source_instrument_type = if (is.null(inst)) NA_character_ else as.character(inst),
      source_channels        = as.character(rv$channels %||% character(0)),
      source_sce_name        = if (is.null(rv$sce_name)) NA_character_ else as.character(rv$sce_name)
    )
  }

  # Apply a workspace list (from another SCE or a .rds file) to the current
  # session.  Skips gates whose channels are absent in the current SCE and
  # prunes any population that ends up with zero gate references as a result.
  apply_workspace <- function(ws, source_label = "workspace") {
    if (is.null(ws)) {
      showNotification("No workspace to load.", type = "error", duration = 4)
      return(invisible(FALSE))
    }
    ws <- normalize_workspace_gate_space(ws)

    # Channel-mismatch handling: drop gates whose x/y channels are missing.
    invalid <- validate_workspace_channels(ws, rv$channels)
    n_skipped <- length(invalid)
    if (n_skipped > 0) {
      for (gid in invalid) ws$gates[[gid]] <- NULL
      ws$gate_order <- setdiff(ws$gate_order %||% names(ws$gates), invalid)
      # Prune gate_refs in populations to drop refs to missing gates, then
      # drop populations that no longer reference any gate (except root).
      valid_ids <- names(ws$gates)
      root_id   <- ws$root_population_id
      if (!is.null(ws$populations)) {
        ws$populations <- lapply(ws$populations, function(pop) {
          if (is.null(pop) || is.null(pop$gate_refs)) return(pop)
          pop$gate_refs <- Filter(function(r) r$gate_id %in% valid_ids, pop$gate_refs)
          pop
        })
        ws$populations <- Filter(function(pop) {
          if (is.null(pop)) return(FALSE)
          identical(pop$population_id, root_id) ||
            (length(pop$gate_refs %||% list()) > 0)
        }, ws$populations)
      }
    }

    # Cross-instrument warning (non-blocking).
    src_inst <- ws$source_instrument_type %||% NA_character_
    cur_inst <- if (!is.null(rv$sce)) S4Vectors::metadata(rv$sce)$instrument_type else NA_character_
    if (!is.na(src_inst) && !is.na(cur_inst) && nzchar(src_inst) && nzchar(cur_inst) &&
        !identical(as.character(src_inst), as.character(cur_inst))) {
      showNotification(
        sprintf("Workspace was saved from a %s SCE but the current SCE is %s. Gates may not render correctly.",
                src_inst, cur_inst),
        type = "warning", duration = 6
      )
    }

    save_undo_snapshot()
    rv$gates              <- ws$gates %||% list()
    rv$gate_order         <- ws$gate_order %||% names(rv$gates)
    rv$populations        <- ws$populations
    rv$root_population_id <- ws$root_population_id
    sort_population_tree_state()
    rv$active_population_id <- ws$root_population_id
    rv$selected_gate_id     <- NULL
    rv$.selected_gate_ids   <- character(0)
    rv$gate_version         <- rv$gate_version + 1L
    if (!is.null(ws$cytof_axis_range)) rv$cytof_axis_range <- ws$cytof_axis_range
    rv$global_scale_ranges <- ws$global_scale_ranges %||% list()
    initialize_missing_global_scales(rv$channels)
    rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
    rv$.plot_range_override <- ws$plot_range_override %||% NULL
    rv$illust_pop_palette   <- ws$illust_pop_palette %||% list()
    rv$illust_pop_selected  <- if (!is.null(ws$illust_pop_selected)) {
      as.character(ws$illust_pop_selected)
    } else NULL
    if (!is.null(ws$illust_presets)) rv$illust_presets <- ws$illust_presets
    if (!is.null(ws$division_profiles)) rv$division_by_sample <- ws$division_profiles
    if (!is.null(ws$division_channel))  rv$division_channel  <- ws$division_channel
    if (!is.null(ws$division_xrange))   rv$division_xrange    <- ws$division_xrange
    if (!is.null(ws$division_bins)) {
      rv$division_bins <- ws$division_bins
      updateNumericInput(session, "division_bins", value = ws$division_bins)
    }
    if (!is.null(ws$division_subsample)) {
      rv$division_subsample <- ws$division_subsample
      updateNumericInput(session, "division_subsample", value = ws$division_subsample)
    }
    if (!is.null(ws$division_ymarker)) rv$division_ymarker <- ws$division_ymarker
    if (!is.null(ws$division_point_alpha)) {
      rv$division_point_alpha <- ws$division_point_alpha
      updateNumericInput(session, "division_point_alpha", value = ws$division_point_alpha)
    }
    if (!is.null(ws$illust_settings)) {
      rv$.illust_settings_pending     <- ws$illust_settings
      rv$.illust_ui_restore_version   <- isolate(rv$.illust_ui_restore_version) + 1L
    }
    if (isTRUE(sync_illust_palette_state())) {
      rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
    }
    # Channels don't change on workspace load → force the scale controls to
    # rebuild with the just-loaded override / global scale values.
    rv$.flow_transform_version <- isolate(rv$.flow_transform_version) + 1L
    # Restore compensation toggle (only meaningful if this SCE carries a matrix).
    if (has_compensation() && !is.null(ws$comp_on)) {
      want_comp <- isTRUE(ws$comp_on)
      if (!identical(want_comp, isTRUE(rv$comp_on))) {
        rv$comp_on <- want_comp
        refresh_assay_data(reset_cache = TRUE)
        rv$.scales_ui_version <- isolate(rv$.scales_ui_version) + 1L
      }
    }
    update_rescale_btn(!is.null(rv$.plot_range_override))
    autosave(); send_full_plot()

    msg <- if (n_skipped > 0) {
      sprintf("Loaded %s (%d gate(s) skipped due to missing channels)",
              source_label, n_skipped)
    } else {
      paste("Loaded", source_label)
    }
    showNotification(msg, type = "message", duration = 4)
    output$status_text <- renderText(msg)
    invisible(TRUE)
  }

  # Clear all gates and populations back to a fresh root-only state.
  reset_gating_state <- function() {
    if (is.null(rv$sce)) return(invisible(FALSE))
    save_undo_snapshot()
    rv$gates              <- list()
    rv$gate_order         <- character(0)
    root                  <- new_root_population(ncol(rv$sce))
    rv$populations        <- setNames(list(root), root$population_id)
    rv$root_population_id <- root$population_id
    rv$active_population_id <- root$population_id
    rv$selected_gate_id     <- NULL
    rv$.selected_gate_ids   <- character(0)
    rv$gate_version         <- rv$gate_version + 1L
    rv$pop_events_map        <- list()
    rv$.gate_counts_cache_key <- NULL
    rv$.gate_counts_cache     <- NULL
    rv$.population_tree_cache_key <- NULL
    rv$.population_tree_cache     <- NULL
    rv$.last_combined_pop_mask    <- NULL
    rv$.strategy_stale <- FALSE
    rv$.illust_stale   <- FALSE
    autosave()
    send_full_plot(reset_view = FALSE)
    showNotification("Reset: all gates and populations cleared.",
                     type = "message", duration = 3)
    output$status_text <- renderText(
      paste("Reset workspace at", format(Sys.time(), "%H:%M:%S")))
    invisible(TRUE)
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
  # Dispatches:
  #   flow scatter (FSC/SSC) → generate_scatter_ticks  (log-decade labels in raw units)
  #   flow signal            → generate_logicle_ticks  (logicle-space decade labels)
  #   CyTOF metal            → NULL  (D3 linear default: simple 0-8 labels in display space)
  #   QC / non-exprs         → NULL  (linear default)
  # Returns a tick list or NULL (NULL → JS uses D3's built-in linear axis formatter).
  generate_channel_ticks <- function(channel, axis_range) {
    if (is.null(rv$sce)) return(NULL)
    if (!identical(rv$assay_name, "exprs")) return(NULL)
    if (!nzchar(channel %||% "")) return(NULL)
    if (is.null(axis_range) || length(axis_range) != 2) return(NULL)
    if (.is_qc_channel(channel)) return(NULL)

    # FSC/SSC scatter channels: log-decade labels showing raw values (e.g. 1K, 10K, 100K).
    # Scatter channels only exist in flow sessions; CyTOF never has FSC/SSC.
    # The is_flow_session() guard is belt-and-suspenders: .is_scatter_channel() should
    # never fire for CyTOF metal names, but this makes the invariant explicit so that
    # a mistakenly renamed channel cannot silently pull in scatter cofactor logic.
    if (is_flow_session(rv$sce) && .is_scatter_channel(channel)) {
      cf <- suppressWarnings(as.numeric(rv$flow_scatter_cofactor[[channel]] %||% 150))
      if (!is.finite(cf) || cf <= 0) cf <- 150
      return(generate_scatter_ticks(axis_range, cofactor = cf))
    }

    # Flow signal channels: logicle-space ticks with decade raw-value labels.
    if (is_flow_session(rv$sce)) {
      raw_mat <- rv$flow_raw_data
      raw_vals <- if (!is.null(raw_mat) && channel %in% colnames(raw_mat)) raw_mat[, channel] else NULL
      ticks <- generate_logicle_ticks(channel, axis_range, raw_vals, rv$flow_logicle_w)
      if (is.null(ticks)) return(NULL)
      return(ticks)
    }

    # CyTOF metal channels: return NULL so the JS uses D3's default linear
    # tick formatter.  The display (exprs) space runs ~0–8 for metal channels,
    # so D3 generates clean integer labels (0, 2, 4, 6, 8) automatically.
    # DO NOT call generate_asinh_ticks here — that function produces FlowJo-
    # style decade labels in raw units (0, 10, 100, 1K) which look like a log
    # scale and are confusing in the CyTOF asinh-display context.
    NULL
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

  # Compensation state mirrors the flow-transform state pattern above.
  # The matrix rides in metadata(sce)$spillover_matrix (written at import); the
  # comp_on flag is persisted alongside it so it round-trips on SCE reload.
  init_compensation_state <- function(sce) {
    rv$spillover_matrix <- NULL
    rv$comp_on <- FALSE
    if (!is_flow_session(sce)) return()
    md <- S4Vectors::metadata(sce)
    m <- md$spillover_matrix
    if (is.null(m) || !is.matrix(m) || nrow(m) < 2) return()
    rv$spillover_matrix <- m
    rv$comp_on <- isTRUE(md$comp_on)
  }

  persist_compensation_state <- function() {
    if (is.null(rv$sce) || is.null(rv$sce_name) || !is_flow_session(rv$sce)) return()
    if (!is.null(rv$spillover_matrix)) {
      S4Vectors::metadata(rv$sce)$spillover_matrix <- rv$spillover_matrix
    }
    S4Vectors::metadata(rv$sce)$comp_on <- isTRUE(rv$comp_on)
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
  }

  # TRUE when a usable (non-NULL) compensation matrix exists for this session.
  has_compensation <- function() {
    is_flow_session(rv$sce) && !is.null(rv$spillover_matrix) &&
      is.matrix(rv$spillover_matrix) && nrow(rv$spillover_matrix) >= 2
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
        # Apply compensation to the LINEAR data before any transform, so display,
        # gating and rv$flow_raw_data all share one compensated coordinate space.
        # Only on a fresh fetch — a cached rv$flow_raw_data is already compensated.
        if (isTRUE(rv$comp_on) && !is.null(rv$spillover_matrix)) {
          counts_mat <- compensate_matrix(counts_mat, rv$spillover_matrix)
        }
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

  # Debounce the four CyTOF axis range inputs.  Without this, rapid arrow-
  # button clicks or fast typing on Min/Max queues up one send_full_plot per
  # keystroke; each render can take 100–500 ms with large datasets, so the
  # app appears to "hang" until the queue drains.  A 250 ms debounce coalesces
  # bursts into a single render with the latest values.
  .cytof_x_lo_d <- shiny::debounce(reactive(input$cytof_x_lo), 250)
  .cytof_x_hi_d <- shiny::debounce(reactive(input$cytof_x_hi), 250)
  .cytof_y_lo_d <- shiny::debounce(reactive(input$cytof_y_lo), 250)
  .cytof_y_hi_d <- shiny::debounce(reactive(input$cytof_y_hi), 250)

  observeEvent(list(.cytof_x_lo_d(), .cytof_x_hi_d(),
                    .cytof_y_lo_d(), .cytof_y_hi_d()), {
    req(rv$sce, input$x_channel, input$y_channel)
    x_ch <- input$x_channel %||% ""
    y_ch <- input$y_channel %||% ""
    if (!nzchar(x_ch) || !nzchar(y_ch)) return()

    # Read the (already debounced) latest values via isolate to avoid setting
    # up extra reactive dependencies — the observer is already retriggered by
    # the four .cytof_*_d reactives above.
    x_lo <- suppressWarnings(as.numeric(isolate(input$cytof_x_lo)))
    x_hi <- suppressWarnings(as.numeric(isolate(input$cytof_x_hi)))
    y_lo <- suppressWarnings(as.numeric(isolate(input$cytof_y_lo)))
    y_hi <- suppressWarnings(as.numeric(isolate(input$cytof_y_hi)))
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
    send_full_plot(reset_view = TRUE, force = TRUE)
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
      class = "flow-transform-controls strategy-block",
      style = "margin-top:6px;",
      tags$div(class = "gating-control-box-title", "Channel Scales"),
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
                      value = x_w, width = "100%", ticks = FALSE),
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
                      value = y_w, width = "100%", ticks = FALSE),
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
    send_full_plot(reset_view = TRUE, force = TRUE)
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
    send_full_plot(reset_view = TRUE, force = TRUE)
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
    init_compensation_state(sce)   # set comp matrix + comp_on before refresh_assay_data

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
    # Discard the previous SCE's illustration cache so a render on the new SCE
    # never serves a stale payload (cache is now also keyed by SCE name).
    rv$.illustration_cache_key <- NULL
    rv$.illustration_cache_payload <- NULL
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
      rv$illust_presets <- ws$illust_presets %||% list()
      rv$division_by_sample <- ws$division_profiles %||% list()
      rv$division_channel <- ws$division_channel %||% NULL
      rv$division_xrange <- ws$division_xrange %||% NULL
      rv$division_bins <- ws$division_bins %||% 120L
      rv$division_subsample <- ws$division_subsample %||% 50000L
      rv$division_ymarker <- ws$division_ymarker %||% NULL
      rv$division_point_alpha <- ws$division_point_alpha %||% 0.4
      updateNumericInput(session, "division_bins", value = rv$division_bins)
      updateNumericInput(session, "division_subsample", value = rv$division_subsample)
      updateNumericInput(session, "division_point_alpha", value = rv$division_point_alpha)
      if (isTRUE(sync_illust_palette_state())) {
        rv$.illust_palette_ui_version <- isolate(rv$.illust_palette_ui_version) + 1L
      }
      # Stash illustration settings; the channel renderUI must render first before
      # we can call updateCheckboxGroupInput, so we defer via a version counter.
      if (!is.null(ws$illust_settings)) {
        rv$.illust_settings_pending <- ws$illust_settings
        rv$.illust_ui_restore_version <- isolate(rv$.illust_ui_restore_version) + 1L
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
      rv$illust_presets <- list()
      rv$division_by_sample <- list()
      rv$division_channel <- NULL
      rv$division_xrange <- NULL
      rv$division_bins <- 120L
      rv$division_subsample <- 50000L
      rv$division_ymarker <- NULL
      rv$division_point_alpha <- 0.4
      updateNumericInput(session, "division_bins", value = 120L)
      updateNumericInput(session, "division_subsample", value = 50000L)
      updateNumericInput(session, "division_point_alpha", value = 0.4)
      rv$.illust_settings_pending <- NULL
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
    raw <- cd[[cd_col]]
    vals <- as.character(raw)
    rv$overlay_factor <- vals
    # respect the factor's own level order (so e.g. div = Div0..DivN lines up with
    # the Division tab's palette); otherwise fall back to a sorted unique set.
    all_levels <- if (is.factor(raw)) levels(raw)[levels(raw) %in% vals] else sort(unique(vals))

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

  # Overlay palette change — re-render with the new colours.
  observeEvent(input$overlay_palette, {
    if (identical(rv$overlay_palette, input$overlay_palette)) return()
    rv$overlay_palette <- input$overlay_palette
    if (!is.null(rv$assay_data) &&
        !is.null(rv$overlay_factor) && length(rv$overlay_selected %||% character(0))) {
      send_full_plot()
    }
  }, ignoreInit = TRUE)

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
    if (identical(gate$gate_type, "quadrant")) {
      # Forward-transform the crosshair centre (treat as a single vertex).
      ctr <- flow_forward_vertices(
        vertices = list(as.numeric(gate$center)),
        x_channel = gate$x_channel, y_channel = gate$y_channel,
        raw_mat = rv$flow_raw_data, channel_names = colnames(rv$flow_raw_data),
        logicle_w_params = rv$flow_logicle_w,
        scatter_cofactor_params = rv$flow_scatter_cofactor
      )
      gate_disp$center <- as.numeric(ctr[[1]])
      return(gate_disp)
    }
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

  # ── Gate-mask cache ─────────────────────────────────────────────────────────
  # The costly part of apply_gating_strategy is testing every event against each
  # gate (polygon point-in-polygon in particular). Cache each gate's full-data
  # mask keyed by a fingerprint of its geometry, so editing one gate recomputes
  # only that gate's mask; every other gate is a cache hit and the strategy is
  # left with cheap per-population logical-AND intersections. Self-managing and
  # fail-safe: any geometry change flips the fingerprint, an assay or row-count
  # change clears the whole cache, and a missing/wrong-length mask is simply not
  # cached (apply_gating_strategy then recomputes it itself). Stored in a plain
  # env so updating it never triggers Shiny reactivity.
  .gate_mask_cache <- new.env(parent = emptyenv())
  .gate_mask_cache$assay_version <- NULL
  .gate_mask_cache$nrow          <- NULL
  .gate_mask_cache$masks         <- list()

  .gate_fingerprint <- function(gate) {
    paste(gate$gate_type %||% "", gate$x_channel %||% "", gate$y_channel %||% "",
          paste(unlist(gate$vertices), collapse = ","), sep = "|")
  }

  get_cached_gate_masks <- function(gating_data) {
    n  <- nrow(gating_data)
    av <- rv$assay_version %||% 0L
    if (!identical(.gate_mask_cache$assay_version, av) ||
        !identical(.gate_mask_cache$nrow, n)) {
      .gate_mask_cache$masks         <- list()
      .gate_mask_cache$assay_version <- av
      .gate_mask_cache$nrow          <- n
    }
    # Drop entries for gates that no longer exist (keeps memory bounded).
    keep <- intersect(names(.gate_mask_cache$masks), names(rv$gates))
    if (length(keep) != length(.gate_mask_cache$masks)) {
      .gate_mask_cache$masks <- .gate_mask_cache$masks[keep]
    }
    out <- list()
    for (gid in names(rv$gates)) {
      gate <- rv$gates[[gid]]
      if (is.null(gate)) next
      # Quadrant gates are cheap per-quadrant comparisons, computed on demand
      # (the cache keys by gate_id only, which can't hold 4 masks) — skip them.
      if (identical(gate$gate_type, "quadrant")) next
      fp  <- .gate_fingerprint(gate)
      ent <- .gate_mask_cache$masks[[gid]]
      if (!is.null(ent) && identical(ent$fp, fp) && length(ent$mask) == n) {
        out[[gid]] <- ent$mask
      } else {
        m <- tryCatch(get_gate_mask(gate, gating_data), error = function(e) NULL)
        if (!is.null(m) && length(m) == n) {
          .gate_mask_cache$masks[[gid]] <- list(fp = fp, mask = m)
          out[[gid]] <- m
        }
        # else: leave unset — apply_gating_strategy recomputes it (fail-safe).
      }
    }
    out
  }

  get_pop_mask <- function(pop_id = NULL) {
    gating_data <- get_gating_data()
    if (is.null(gating_data) || nrow(gating_data) == 0) return(NULL)
    pop_id <- pop_id %||% rv$active_population_id %||% rv$root_population_id
    if (rv$cache_version == rv$gate_version && !is.null(rv$pop_events_map[[pop_id]]))
      return(rv$pop_events_map[[pop_id]])
    result <- apply_gating_strategy(rv$gates, rv$populations, rv$root_population_id, gating_data,
                                    gate_masks = get_cached_gate_masks(gating_data))
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

  # Populations whose events are shown in the biplot: the checked populations in
  # the tree (left-column checkboxes), or — when none are checked — the active
  # (blue-highlighted) population, preserving the original single-population view.
  get_display_pop_ids <- function() {
    checked <- intersect(as.character(rv$.selected_pop_ids %||% character(0)),
                         names(rv$populations %||% list()))
    if (length(checked) > 0) return(checked)
    aid <- rv$active_population_id %||% rv$root_population_id
    if (!is.null(aid)) aid else character(0)
  }

  # Union mask of all displayed populations (so an arbitrary number can be shown
  # at once). Cached in rv$.last_display_pop_mask for the gates-only fast path.
  get_display_pop_mask <- function() {
    ids <- get_display_pop_ids()
    if (length(ids) == 0) { rv$.last_display_pop_mask <- NULL; return(NULL) }
    masks <- lapply(ids, get_pop_mask)
    masks <- masks[!vapply(masks, is.null, logical(1))]
    if (length(masks) == 0) { rv$.last_display_pop_mask <- NULL; return(NULL) }
    m <- Reduce(`|`, masks)
    rv$.last_display_pop_mask <- m
    m
  }

  # Text indicator above the biplot: which populations' data is being shown.
  output$gating_display_pops_ui <- renderUI({
    rv$populations; rv$active_population_id; rv$.selected_pop_ids
    ids <- get_display_pop_ids()
    if (length(ids) == 0) return(NULL)
    nm <- function(pid) rv$populations[[pid]]$name %||% pid
    names_vec <- vapply(ids, nm, character(1))
    multi <- length(intersect(as.character(rv$.selected_pop_ids %||% character(0)),
                              names(rv$populations %||% list()))) > 0
    show_names <- names_vec; extra <- 0L
    if (length(show_names) > 10L) { extra <- length(show_names) - 10L; show_names <- show_names[seq_len(10L)] }
    label_txt <- paste(show_names, collapse = ", ")
    if (extra > 0L) label_txt <- paste0(label_txt, " (+", extra, " more)")
    tags$div(
      style = paste0(
        "font-size:11px; color:#23354d; border-radius:4px; padding:3px 8px; margin:0 0 6px 0;",
        if (multi) " background:#e8f1fe; border:1px solid #b9d4fb;"
        else       " background:#f3f4f6; border:1px solid #e3e3e3;"),
      tags$strong(if (multi) sprintf("Displaying %d populations: ", length(ids)) else "Displaying: "),
      label_txt,
      if (multi) tags$span(
        "  — from checked rows; uncheck all to return to the active population.",
        style = "color:#6b7a90;") else NULL
    )
  })

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

  send_full_plot <- function(reset_view = FALSE, refresh_pop_masks = TRUE, force = FALSE) {
    req(rv$assay_data, input$x_channel, input$y_channel)
    x_ch <- input$x_channel; y_ch <- input$y_channel
    if (!x_ch %in% colnames(rv$assay_data) || !y_ch %in% colnames(rv$assay_data)) return()

    pop_mask <- if (isTRUE(refresh_pop_masks)) {
      get_display_pop_mask()
    } else {
      rv$.last_display_pop_mask %||% {
        pid <- rv$active_population_id %||% rv$root_population_id
        rv$pop_events_map[[pid]] %||% rv$.last_combined_pop_mask
      }
    }
    plot_sample_mask <- get_effective_sample_mask(for_plot = TRUE)
    # combined_mask = the events DISPLAYED in the biplot (union of shown
    # populations, intersected with the sample filter).
    combined_mask <- if (!is.null(plot_sample_mask)) {
      if (!is.null(pop_mask)) pop_mask & plot_sample_mask else plot_sample_mask
    } else {
      pop_mask
    }
    # Gate counts/percentages stay relative to the ACTIVE population (the gating
    # context), independent of how many populations are displayed — so ticking
    # display checkboxes never changes the gate statistics.
    active_mask <- get_pop_mask(rv$active_population_id %||% rv$root_population_id)
    rv$.last_combined_pop_mask <- if (!is.null(plot_sample_mask)) {
      if (!is.null(active_mask)) active_mask & plot_sample_mask else plot_sample_mask
    } else {
      active_mask
    }
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

    # Pre-compute scatter-channel flags for the gating plot (flow sessions only).
    # These are passed into build_plot_data* so scatter-axis logic is self-contained.
    is_flow_exprs <- !is.null(rv$sce) && is_flow_session(rv$sce) && rv$assay_name == "exprs"
    x_is_sc <- is_flow_exprs && isTRUE(.is_scatter_channel(x_ch))
    y_is_sc <- is_flow_exprs && isTRUE(.is_scatter_channel(y_ch))
    x_sc_cf <- if (is_flow_exprs) as.numeric(rv$flow_scatter_cofactor[[x_ch]] %||% 150) else 150
    y_sc_cf <- if (is_flow_exprs) as.numeric(rv$flow_scatter_cofactor[[y_ch]] %||% 150) else 150

    if (overlay_active) {
      factor_vals <- rv$overlay_factor
      selected <- rv$overlay_selected
      include_mask <- factor_vals %in% selected
      if (!is.null(combined_mask)) include_mask <- include_mask & combined_mask
      color_map <- setNames(seq_along(selected) - 1L, selected)
      all_color_indices <- rep(0L, length(factor_vals))
      for (lvl in selected) all_color_indices[factor_vals == lvl] <- color_map[[lvl]]
      palette <- overlay_color_palette(rv$overlay_palette %||% "paired", length(selected))
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
        point_alpha = alpha, x_range_override = x_range, y_range_override = y_range,
        x_is_scatter_log = x_is_sc, y_is_scatter_log = y_is_sc,
        x_scatter_cofactor = x_sc_cf, y_scatter_cofactor = y_sc_cf
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
        x_range_override = x_range, y_range_override = y_range,
        x_is_scatter_log = x_is_sc, y_is_scatter_log = y_is_sc,
        x_scatter_cofactor = x_sc_cf, y_scatter_cofactor = y_sc_cf
      )
    }

    # Attach channel list, contour threshold, and logicle/custom ticks.
    plot_data$channels          <- as.list(rv$channels)
    plot_data$contour_threshold <- as.numeric(input$contour_threshold %||% 5)
    if (!is.null(rv$sce) && rv$assay_name == "exprs") {
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
    # force_full = TRUE makes the client bypass its stale-seq guard and gates-only
    # fast path, guaranteeing a full canvas+gate redraw. Set for explicit user
    # scale edits and the Refresh button so a scale change always takes effect.
    plot_data$force_full <- isTRUE(force)

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

  # ════════════════════════════════════════════════════════════════════════════
  # DIVISION PROFILING TAB  (fully isolated: own message "updateDivisionPlot",
  # own input "division_gates", own rv$division_* state; never touches rv$gates)
  # ════════════════════════════════════════════════════════════════════════════
  division_palette <- function(k) {
    paired <- c("#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c",
                "#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928")
    k <- max(1L, as.integer(k))
    if (k <= length(paired)) return(paired[seq_len(k)])
    grDevices::colorRampPalette(paired)(k)
  }

  # keep the dye-channel + biplot Y-marker dropdowns populated; guess defaults
  observeEvent(rv$channels, {
    chs <- rv$channels
    if (!length(chs)) return()
    guess <- chs[grep("CFSE|CTV|CellTrace|Violet|Tag", chs, ignore.case = TRUE)][1]
    if (is.na(guess)) guess <- chs[1]
    updateSelectInput(session, "division_channel", choices = chs,
                      selected = rv$division_channel %||% guess)
    yguess <- chs[grep("Ki.?67|MKI67|PCNA", chs, ignore.case = TRUE)][1]
    if (is.na(yguess)) yguess <- ""
    updateSelectInput(session, "division_ymarker", choices = c("(none)" = "", chs),
                      selected = rv$division_ymarker %||% yguess)
  }, ignoreInit = FALSE)

  observeEvent(input$division_channel, {
    if (identical(rv$division_channel, input$division_channel)) return()
    rv$division_channel <- input$division_channel
    rv$division_xrange <- NULL          # new channel -> reseed the x-axis from its data
    rv$division_boundaries <- numeric(0) # ...and reseed the working ladder for its scale
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # Biplot Y marker — pure display; "(none)" hides the biplot.
  observeEvent(input$division_ymarker, {
    ym <- input$division_ymarker %||% ""
    if (identical(rv$division_ymarker %||% "", ym)) return()
    rv$division_ymarker <- if (nzchar(ym)) ym else NULL
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # Biplot point opacity — pure display, re-render only.
  observeEvent(input$division_point_alpha, {
    a <- suppressWarnings(as.numeric(input$division_point_alpha))
    if (!is.finite(a)) return()
    a <- max(0.02, min(1, a))
    if (is.finite(rv$division_point_alpha) && abs(rv$division_point_alpha - a) < 1e-6) return()
    rv$division_point_alpha <- a
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # A typical inter-gate gap for the current working ladder (falls back to a
  # fraction of the x-range when there are <2 gates).
  division_typical_gap <- function(b) {
    b <- sort(as.numeric(b))
    g <- if (length(b) >= 2L) stats::median(diff(b)) else NA_real_
    if (!is.finite(g) || g <= 0) {
      xr <- suppressWarnings(as.numeric(rv$division_xrange))
      span <- if (length(xr) == 2L) diff(xr) else if (length(b)) max(abs(b)) else 8
      g <- span / (as.integer(rv$division_n %||% 6L) + 2L)
    }
    g
  }

  # Changing N (typed, or via +Div / -Div) adjusts the WORKING ladder to N gates
  # WITHOUT disturbing the existing ones: add/remove gates at the dim end, keeping
  # the brighter gates exactly in place. Only a full reseed when there are none.
  observeEvent(input$division_n, {
    n <- suppressWarnings(as.integer(input$division_n))
    if (is.na(n) || n < 1L) return()
    n <- min(11L, n)                                   # N+1 <= 12 Paired colours
    if (identical(as.integer(rv$division_n), n)) return()
    rv$division_n <- n
    b <- sort(as.numeric(rv$division_boundaries))
    if (length(b)) {
      gap <- division_typical_gap(b)
      while (length(b) < n) b <- c(min(b) - gap, b)    # extend at the dim end
      while (length(b) > n) b <- b[-1]                 # drop the dimmest
      rv$division_boundaries <- sort(b)
    } else {
      rv$division_boundaries <- numeric(0)             # nothing yet -> seed on render
    }
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  observeEvent(input$division_add_btn, {
    updateNumericInput(session, "division_n",
                       value = min(11L, as.integer(rv$division_n %||% 6L) + 1L))
  })
  observeEvent(input$division_remove_btn, {
    updateNumericInput(session, "division_n",
                       value = max(1L, as.integer(rv$division_n %||% 6L) - 1L))
  })

  # "Space evenly" tidies the CURRENT gates to a uniform gap WITHOUT throwing them
  # away: anchor the brightest cut (Div0/Div1, rightmost) and re-lay the rest at
  # the current median gap. Only reseed from the data when there are no gates yet.
  observeEvent(input$division_space_evenly_btn, {
    b <- sort(as.numeric(rv$division_boundaries))
    if (length(b) >= 2L) {
      anchor <- max(b)
      sp <- stats::median(diff(b))
      if (!is.finite(sp) || sp <= 0) sp <- (max(b) - min(b)) / (length(b) - 1L)
      rv$division_boundaries <- sort(anchor - sp * (seq_along(b) - 1L))
    } else {
      rv$division_boundaries <- numeric(0)
    }
    send_division_plot()
  })

  # Nudge ALL gates along the dye axis together (preserves relative spacing).
  shift_division_gates <- function(dir) {
    b <- sort(as.numeric(rv$division_boundaries))
    if (!length(b)) return()
    xr <- suppressWarnings(as.numeric(rv$division_xrange))
    span <- if (length(xr) == 2L) diff(xr) else diff(range(b))
    if (!is.finite(span) || span <= 0) span <- 8
    rv$division_boundaries <- sort(b + dir * 0.01 * span)
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }
  observeEvent(input$division_shift_down_btn, { shift_division_gates(-1) })
  observeEvent(input$division_shift_up_btn,   { shift_division_gates(+1) })

  # User-fixed x-axis (min/max). Re-render when edited; echo-guarded so the
  # seeding updateNumericInput() above doesn't loop.
  observeEvent(list(input$division_xmin, input$division_xmax), {
    lo <- suppressWarnings(as.numeric(input$division_xmin))
    hi <- suppressWarnings(as.numeric(input$division_xmax))
    if (!is.finite(lo) || !is.finite(hi) || hi <= lo) return()
    cur <- suppressWarnings(as.numeric(rv$division_xrange))
    if (length(cur) == 2L && abs(cur[1] - lo) < 1e-9 && abs(cur[2] - hi) < 1e-9) return()
    rv$division_xrange <- c(lo, hi)
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # Histogram bin count — pure display, re-render only (boundaries untouched).
  observeEvent(input$division_bins, {
    b <- suppressWarnings(as.integer(input$division_bins))
    if (is.na(b) || b < 2L) return()
    if (identical(as.integer(rv$division_bins), b)) return()
    rv$division_bins <- b
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # Subsampling depth for the drawn histogram — pure display, re-render only.
  observeEvent(input$division_subsample, {
    s <- suppressWarnings(as.integer(input$division_subsample))
    if (is.na(s) || s < 1L) return()
    if (identical(as.integer(rv$division_subsample), s)) return()
    rv$division_subsample <- s
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # Gate spacing override: typing a value (or using the arrows) re-lays ALL gates
  # at that even spacing, anchored at the brightest cut (rightmost boundary), and
  # snaps them to evenly-spaced. Echo-guarded against the value send_division_plot
  # writes back (the current median gap).
  observeEvent(input$division_spacing, {
    sp <- suppressWarnings(as.numeric(input$division_spacing))
    if (!is.finite(sp) || sp <= 0) return()
    if (is.finite(rv$division_spacing) && abs(rv$division_spacing - sp) < 1e-6) return()
    b <- sort(as.numeric(rv$division_boundaries))
    if (length(b) < 2L) { rv$division_spacing <- sp; return() }  # nothing to space
    anchor <- max(b)                                  # keep Div0/Div1 cut fixed
    rv$division_boundaries <- sort(anchor - sp * (seq_along(b) - 1L))
    rv$division_spacing <- sp
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # The left-pane sample selector drives BOTH what the histogram shows and which
  # samples "Apply to selected" writes to. selected_division_samples() returns the
  # selected sample_id(s), or "__all__" when the SCE has no sample_id column.
  # Crucially, the WORKING boundaries (rv$division_boundaries) are independent of
  # this selection — toggling samples re-renders the histogram data but never
  # moves the gates (that was the old "gates jump around" bug).
  selected_division_samples <- function() {
    if (is.null(rv$sce)) return(character(0))
    cd <- SummarizedExperiment::colData(rv$sce)
    if (!"sample_id" %in% colnames(cd)) return("__all__")
    sid <- as.character(cd$sample_id)
    mask <- get_effective_sample_mask(for_plot = FALSE)
    sort(if (is.null(mask)) unique(sid) else unique(sid[which(mask)]))
  }

  # Union mask of the displayed populations (checked tree boxes, else the active
  # population), WITHOUT touching the gating tab's display-mask cache. NULL = all.
  division_pop_mask <- function() {
    ids <- get_display_pop_ids()
    if (!length(ids)) return(NULL)
    masks <- lapply(ids, get_pop_mask)
    masks <- masks[!vapply(masks, is.null, logical(1))]
    if (!length(masks)) return(NULL)
    Reduce(`|`, masks)
  }

  # Cell indices DISPLAYED in the histogram/biplot: the selected samples AND the
  # population filter from the tree (so gating the right-hand population narrows
  # what you see). NOTE: this is display only — "Apply to selected" deliberately
  # writes the WHOLE sample (see division_cell_idx), not this filtered subset.
  division_display_idx <- function() {
    n <- nrow(rv$assay_data)
    smp <- get_effective_sample_mask(for_plot = FALSE)
    pop <- division_pop_mask()
    if (is.null(smp) && is.null(pop)) return(seq_len(n))
    m <- if (is.null(smp)) rep(TRUE, n) else smp
    if (!is.null(pop) && length(pop) == n) m <- m & pop
    which(m)
  }

  # Cell indices belonging to one APPLIED sample profile (used by Apply's write).
  # WHOLE sample — independent of the population filter on the display.
  division_cell_idx <- function(smp) {
    if (is.null(smp) || identical(smp, "__all__")) return(seq_len(nrow(rv$assay_data)))
    which(as.character(SummarizedExperiment::colData(rv$sce)$sample_id) == smp)
  }

  send_division_plot <- function() {
    if (is.null(rv$assay_data)) return()
    # rv$division_channel is authoritative (set before every call in the normal
    # path); fall back to the dropdown only for the very first render.
    ch <- rv$division_channel %||% input$division_channel
    if (is.null(ch) || !ch %in% colnames(rv$assay_data)) return()
    rv$division_channel <- ch
    rv$division_selected_samples <- selected_division_samples()
    # population filter label (display only) for the status line
    pids <- get_display_pop_ids()
    rv$division_pop_label <- if (!length(pids) ||
        (length(pids) == 1L && identical(pids[1], rv$root_population_id))) {
      NULL
    } else {
      paste(vapply(pids, function(i) rv$populations[[i]]$name %||% i, character(1)),
            collapse = ", ")
    }
    idx <- division_display_idx()
    vals <- as.numeric(rv$assay_data[idx, ch]); vals <- vals[is.finite(vals)]
    if (!length(vals)) {
      # nothing selected (or empty) — clear the plot but keep the working gates
      session$sendCustomMessage("updateDivisionPlot", list(boundaries = numeric(0)))
      rv$division_plot_data <- NULL
      return()
    }
    n <- as.integer(rv$division_n %||% 6L)
    # WORKING boundaries: seed once from the displayed data if empty, otherwise
    # keep them exactly as-is so selection changes never move the gates.
    if (!length(rv$division_boundaries)) {
      rv$division_boundaries <- sort(seed_division_boundaries(vals, n = n))
    }
    # User-fixed x-axis: use the stored range; seed it from the data only when
    # unset (e.g. first render or after a channel change). Never autoscale on
    # sample/N changes — the axis stays put so peaks are comparable.
    xr <- suppressWarnings(as.numeric(rv$division_xrange))
    if (length(xr) != 2L || !all(is.finite(xr)) || xr[2] <= xr[1]) {
      xr <- compute_axis_range(vals)
      rv$division_xrange <- xr
      updateNumericInput(session, "division_xmin", value = round(xr[1], 3))
      updateNumericInput(session, "division_xmax", value = round(xr[2], 3))
    }
    x_range <- xr
    ticks <- generate_channel_ticks(ch, x_range)
    sub <- suppressWarnings(as.integer(rv$division_subsample %||% 50000L))
    if (is.na(sub) || sub < 1L) sub <- length(vals)
    vp <- vals
    if (length(vp) > sub) vp <- vp[round(seq(1, length(vp), length.out = sub))]
    bins <- suppressWarnings(as.integer(rv$division_bins %||% 120L))
    if (is.na(bins) || bins < 2L) bins <- 120L
    # reflect the current (median) gap in the Spacing box as a live hint
    bsrt <- sort(as.numeric(rv$division_boundaries))
    if (length(bsrt) >= 2L) {
      cur_sp <- stats::median(diff(bsrt))
      if (is.finite(cur_sp) &&
          (!is.finite(rv$division_spacing) || abs(rv$division_spacing - cur_sp) > 1e-6)) {
        rv$division_spacing <- cur_sp
        updateNumericInput(session, "division_spacing", value = round(cur_sp, 3))
      }
    }
    # palette / labels follow the ACTUAL working-boundary count (N divisions = N
    # boundaries -> Div0..DivN), independent of the N input which may lag a Load.
    nb <- length(rv$division_boundaries)
    payload <- list(
      x_b64 = encode_float32_base64(vp), n_events = length(vals),
      n_drawn = length(vp),
      x_range = x_range, x_label = ch, bins = bins,
      x_is_logicle = !is.null(ticks), x_logicle_ticks = ticks,
      boundaries = sort(as.numeric(rv$division_boundaries)),
      palette = division_palette(nb + 1L),
      bin_labels = paste0("Div", seq_len(nb + 1L) - 1L),
      point_alpha = max(0.02, min(1, as.numeric(rv$division_point_alpha %||% 0.4)))
    )
    # Biplot data: dye (x, shared scale + division lines) vs a picked Y marker,
    # paired on the SAME displayed cells (both finite), capped for canvas perf.
    ym <- rv$division_ymarker %||% input$division_ymarker
    if (!is.null(ym) && nzchar(ym) && ym %in% colnames(rv$assay_data)) {
      xraw <- as.numeric(rv$assay_data[idx, ch])
      yraw <- as.numeric(rv$assay_data[idx, ym])
      ok <- is.finite(xraw) & is.finite(yraw)
      bx <- xraw[ok]; by <- yraw[ok]
      bsub <- min(sub, 30000L)
      if (length(bx) > bsub) {
        keep <- round(seq(1, length(bx), length.out = bsub))
        bx <- bx[keep]; by <- by[keep]
      }
      if (length(bx)) {
        yrng <- compute_axis_range(by)
        payload$bx_b64 <- encode_float32_base64(bx)
        payload$y_b64 <- encode_float32_base64(by)
        payload$y_label <- ym
        payload$y_range <- yrng
        # 2D KDE contour overlay (mirrors DivisionProfiler's stat_density_2d):
        # black contour lines over the division-coloured scatter.
        if (requireNamespace("MASS", quietly = TRUE) && length(bx) >= 20L) {
          kd <- tryCatch(
            MASS::kde2d(bx, by, n = 60, lims = c(x_range, yrng)),
            error = function(e) NULL)
          if (!is.null(kd)) {
            lev <- pretty(range(kd$z, finite = TRUE), 8)
            lev <- lev[lev > max(kd$z) * 0.02]
            cl <- tryCatch(grDevices::contourLines(kd$x, kd$y, kd$z, levels = lev),
                           error = function(e) list())
            if (length(cl)) {
              payload$contours <- lapply(cl, function(p)
                list(x = round(p$x, 3), y = round(p$y, 3)))
            }
          }
        }
      }
    }
    rv$.division_msg_seq <- as.integer(rv$.division_msg_seq %||% 0L) + 1L
    payload$`_div_seq` <- rv$.division_msg_seq
    rv$division_plot_data <- payload
    session$sendCustomMessage("updateDivisionPlot", payload)
  }

  observeEvent(input$division_render_btn, { send_division_plot() })

  # auto-render when entering the Division tab or switching the selected sample
  observeEvent(input$main_tabs, {
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)
  observeEvent(rv$sample_filter_key, {
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)
  # also re-render when the population selection / gates change, so the display
  # follows the right-hand population filter (write target is unaffected).
  observeEvent(list(rv$active_population_id, rv$.selected_pop_ids, rv$gate_version), {
    if (identical(input$main_tabs, "Division")) send_division_plot()
  }, ignoreInit = TRUE)

  # drag round-trip: update the WORKING boundaries only. Applying to samples is a
  # deliberate step ("Apply to selected"), so a drag never silently rewrites a
  # sample's stored profile. Do NOT re-render here (it would fight the drag); the
  # seq guard drops stale echoes.
  observeEvent(input$division_gates, {
    edit <- input$division_gates
    req(edit, edit$boundaries)
    seq <- as.integer(edit$seq %||% 0L)
    if (seq <= as.integer(rv$.last_division_drag_seq %||% 0L)) return()
    rv$.last_division_drag_seq <- seq
    rv$division_boundaries <- sort(as.numeric(unlist(edit$boundaries)))
  })

  # ── Load a selected sample's previously-applied boundaries into the working set
  observeEvent(input$division_load_btn, {
    sel <- selected_division_samples()
    if (length(sel) != 1L) {
      showNotification("Select exactly one sample to load its saved gates.",
                       type = "warning", duration = 4)
      return()
    }
    prof <- rv$division_by_sample[[sel[1]]]
    if (is.null(prof) || !length(prof$boundaries %||% numeric(0))) {
      showNotification(sprintf("No applied gates saved for sample '%s'.", sel[1]),
                       type = "warning", duration = 4)
      return()
    }
    rv$division_boundaries <- sort(as.numeric(prof$boundaries))
    nb <- length(rv$division_boundaries)
    rv$division_n <- nb
    updateNumericInput(session, "division_n", value = nb)
    if (!is.null(prof$channel) && !identical(prof$channel, rv$division_channel) &&
        prof$channel %in% (rv$channels %||% character(0))) {
      rv$division_channel <- prof$channel
      updateSelectInput(session, "division_channel", selected = prof$channel)
    }
    send_division_plot()
    showNotification(sprintf("Loaded %d gate(s) from sample '%s'.", nb, sel[1]),
                     type = "message", duration = 3)
  })

  # ── Apply: write the WORKING boundaries to every SELECTED sample ─────────────
  # Stores each selected sample's profile (boundaries + channel), then writes
  # colData$div for ALL applied samples cumulatively — each sample's own cells get
  # its own boundaries, computed in rv$assay_data DISPLAY space (NOT by
  # re-transforming the assay) so flow + logicle stays correct. autosave() then
  # persists every applied profile into the SCE metadata so it reloads cleanly.
  observeEvent(input$division_write_btn, {
    if (is.null(rv$sce) || is.null(rv$assay_data)) return()
    ch <- rv$division_channel %||% input$division_channel
    if (is.null(ch) || !ch %in% colnames(rv$assay_data)) {
      showNotification("Pick a dye channel and Render first.", type = "warning", duration = 4)
      return()
    }
    b <- sort(as.numeric(rv$division_boundaries))
    if (!length(b)) {
      showNotification("Set the division gates first (drag the lines / Space evenly).",
                       type = "warning", duration = 4)
      return()
    }
    sel <- selected_division_samples()
    if (!length(sel)) {
      showNotification("Select at least one sample (left pane) to apply to.",
                       type = "warning", duration = 4)
      return()
    }
    n <- as.integer(rv$division_n %||% length(b))
    # Store the working boundaries as the applied profile for every selected sample.
    for (s in sel) rv$division_by_sample[[s]] <- list(boundaries = b, n = n, channel = ch)
    # Write colData$div for ALL applied samples (cumulative), each with its own
    # boundaries + channel, so applying sample B never wipes sample A.
    ncell <- nrow(rv$assay_data)
    lev <- rep(NA_integer_, ncell)
    maxn <- 0L
    for (smp in names(rv$division_by_sample)) {
      prof <- rv$division_by_sample[[smp]]
      bs <- sort(as.numeric(prof$boundaries %||% numeric(0)))
      if (!length(bs)) next
      chs <- prof$channel %||% ch
      if (!chs %in% colnames(rv$assay_data)) chs <- ch
      idx <- division_cell_idx(smp)
      idx <- idx[is.finite(idx) & idx >= 1L & idx <= ncell]
      if (!length(idx)) next
      lev[idx] <- assign_division_levels(rv$assay_data[idx, chs], bs)
      maxn <- max(maxn, length(bs))
    }
    rv$sce <- write_division_coldata(rv$sce, lev, n_levels = maxn, col_name = "div")
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
    autosave()   # persists every applied profile into metadata alongside the write
    # refresh the Gating tab's "Color by marker / metadata" dropdown so the new
    # `div` column is immediately selectable (mirrors export_population_to_coldata).
    cd_names <- get_coldata_names(rv$sce); rv$coldata_names <- cd_names
    updateSelectInput(session, "overlay_coldata",
                      choices = c("(none)" = "", cd_names),
                      selected = input$overlay_coldata %||% "")
    n_assigned <- sum(!is.na(lev))
    showNotification(
      sprintf("Applied to %d sample%s (%s). colData$div: %s of %s cells (Div0..Div%d).",
              length(sel), if (length(sel) == 1L) "" else "s",
              paste(utils::head(sel, 4), collapse = ", "),
              format(n_assigned, big.mark = ","), format(ncell, big.mark = ","), maxn),
      type = "message", duration = 5)
  })

  output$division_status <- renderText({
    sel <- rv$division_selected_samples %||% character(0)
    sel_txt <- if (!length(sel)) "⚠ no samples selected"
               else if (identical(sel, "__all__")) "all cells"
               else paste0(length(sel), " selected: ",
                           paste(utils::head(sel, 5), collapse = ", "),
                           if (length(sel) > 5L) " …" else "")
    applied <- names(Filter(function(p) length(p$boundaries %||% numeric(0)) > 0,
                            rv$division_by_sample))
    applied_txt <- if (!length(applied)) "none applied yet"
                   else if (identical(applied, "__all__")) "applied: all cells"
                   else paste0("applied: ", length(applied), " (",
                               paste(utils::head(applied, 5), collapse = ", "),
                               if (length(applied) > 5L) " …" else "", ")")
    nb <- length(rv$division_boundaries)
    ev <- if (!is.null(rv$division_plot_data)) {
      pd <- rv$division_plot_data
      paste0(format(pd$n_drawn %||% pd$n_events, big.mark = ","), "/",
             format(pd$n_events, big.mark = ","), " events  |  ")
    } else ""
    pop_txt <- if (!is.null(rv$division_pop_label)) {
      paste0("  |  display filtered to pop: ", rv$division_pop_label,
             " (Apply still writes whole sample)")
    } else ""
    paste0(sel_txt, "  |  ", ev, nb, " gates (Div0..Div", nb, ")  |  ", applied_txt, pop_txt)
  })

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
    # reset_view = TRUE discards any pending client zoom transform; force = TRUE
    # makes the client bypass its stale-seq guard and gates-only fast path so the
    # Refresh button always forces a full canvas+gate redraw (previously it could
    # be a no-op if the message was deduped against an already-recorded seq).
    send_full_plot(reset_view = TRUE, force = TRUE)
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

  observeEvent(input$mode_rect,     { session$sendCustomMessage("setMode", "draw-rect");     update_mode_buttons("draw-rect")     })
  observeEvent(input$mode_poly,     { session$sendCustomMessage("setMode", "draw-poly");     update_mode_buttons("draw-poly")     })
  observeEvent(input$mode_quadrant, { session$sendCustomMessage("setMode", "draw-quadrant"); update_mode_buttons("draw-quadrant") })
  observeEvent(input$mode_cancel,   { session$sendCustomMessage("setMode", "navigate");      update_mode_buttons("navigate")      })

  update_mode_buttons <- function(active_mode) {
    modes <- list(mode_rect = "draw-rect", mode_poly = "draw-poly", mode_quadrant = "draw-quadrant")
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

    # Quadrant gates create four populations at once — use a dedicated dialog.
    if (identical(gate_data$gate_type, "quadrant")) {
      showModal(modalDialog(
        title = "Create quadrant gate",
        tags$p(sprintf("Splits %s × %s into four quadrant populations at the crosshair.",
                       gate_data$x_channel, gate_data$y_channel),
               style = "font-size:12px; color:#666;"),
        textInput("quadrant_name_input", "Name prefix (optional):", value = ""),
        selectInput("quadrant_parent", "Parent population:",
                    choices = parent_choices, selected = default_parent),
        footer = tagList(modalButton("Cancel"),
                         actionButton("confirm_quadrant_btn", "Create 4 populations",
                                      class = "btn-success"))
      ))
      return()
    }

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
    runjs("
      (function(){
        var focusInput = function(){
          var el = document.getElementById('gate_name_input');
          if (el) { el.focus(); el.select(); }
        };
        var bindEnter = function(){
          var nameEl = document.getElementById('gate_name_input');
          var popEl  = document.getElementById('gate_pop_name_input');
          var submit = function(e){
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
              e.preventDefault();
              var btn = document.getElementById('confirm_gate_btn');
              if (btn) btn.click();
            }
          };
          if (nameEl) nameEl.addEventListener('keydown', submit);
          if (popEl)  popEl.addEventListener('keydown', submit);
        };
        // Prefer the Bootstrap shown event so focus lands after the fade-in.
        // Fall back to a delayed call in case the event already fired.
        var $modal = (typeof $ !== 'undefined') ? $('.modal').last() : null;
        if ($modal && $modal.length) {
          $modal.one('shown.bs.modal', function(){ focusInput(); bindEnter(); });
        }
        setTimeout(function(){ focusInput(); bindEnter(); }, 250);
      })();
    ")
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

  observeEvent(input$confirm_quadrant_btn, {
    removeModal(); gate_data <- rv$.pending_gate; req(gate_data); rv$.pending_gate <- NULL
    if (!identical(gate_data$gate_type, "quadrant")) return()
    save_undo_snapshot()

    x_ch <- gate_data$x_channel; y_ch <- gate_data$y_channel
    # The drawn point (display space) is the crosshair centre.
    ctr_disp <- as.numeric(gate_data$vertices[[1]])
    center <- ctr_disp
    if (is_flow_display_context()) {
      v <- vertices_display_to_gating_space(list(ctr_disp), x_ch, y_ch)
      center <- as.numeric(v[[1]])
    }

    prefix <- trimws(as.character(input$quadrant_name_input %||% ""))
    base_name <- if (nzchar(prefix)) prefix else paste0(x_ch, "/", y_ch)
    qgate <- new_quadrant_gate(name = paste(base_name, "quadrant"),
                               x_channel = x_ch, y_channel = y_ch,
                               center = center, color = next_gate_color(length(rv$gates)))
    rv$gates[[qgate$gate_id]] <- qgate
    rv$gate_order <- c(rv$gate_order, qgate$gate_id)
    rv$selected_gate_id <- qgate$gate_id

    pop_parent <- input$quadrant_parent %||% rv$active_population_id %||% rv$root_population_id
    if (is.null(rv$populations[[pop_parent]])) pop_parent <- rv$root_population_id

    # Quadrant 1=x-/y+, 2=x+/y+, 3=x+/y-, 4=x-/y- ; name each by channel signs.
    sgn <- list(c("-", "+"), c("+", "+"), c("+", "-"), c("-", "-"))
    last_pop <- NULL
    for (q in 1:4) {
      qn <- paste0(x_ch, sgn[[q]][1], " ", y_ch, sgn[[q]][2])
      if (nzchar(prefix)) qn <- paste0(prefix, ": ", qn)
      np <- new_population(qn,
                           gate_refs = list(new_gate_ref(qgate$gate_id, include = TRUE, quadrant = q)),
                           parent_id = pop_parent)
      rv$populations[[np$population_id]] <- np
      rv$populations <- link_child_to_parent(rv$populations, np$population_id, pop_parent)
      last_pop <- np$population_id
    }
    sort_population_tree_state()
    rv$active_population_id <- last_pop
    rv$gate_version <- rv$gate_version + 1L
    rv$cache_version <- -1L; rv$pop_events_map <- list()
    session$sendCustomMessage("setMode", "navigate"); update_mode_buttons("navigate")
    autosave()
    send_full_plot(reset_view = FALSE)
    showNotification(sprintf("Created quadrant gate with 4 populations under %s.",
                             rv$populations[[pop_parent]]$name %||% "parent"),
                     type = "message", duration = 4)
  })

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

  observeEvent(input$gate_quadrant_move, {
    edit <- input$gate_quadrant_move; req(edit, edit$gate_id, edit$center)
    g <- rv$gates[[edit$gate_id]]
    if (is.null(g) || !identical(g$gate_type, "quadrant")) return()
    seq_in <- suppressWarnings(as.integer(edit$seq %||% 0L))
    seq_last <- suppressWarnings(as.integer(rv$.last_gate_edit_seq[[edit$gate_id]] %||% 0L))
    if (is.finite(seq_in) && is.finite(seq_last) && seq_in <= seq_last) return()
    rv$.last_gate_edit_seq[[edit$gate_id]] <- seq_in
    save_undo_snapshot()
    center <- as.numeric(edit$center)
    if (is_flow_display_context()) {
      v <- vertices_display_to_gating_space(list(center), g$x_channel, g$y_channel)
      center <- as.numeric(v[[1]])
    }
    rv$gates[[edit$gate_id]]$center <- center
    rv$gate_version <- rv$gate_version + 1L
    rv$cache_version <- -1L; rv$pop_events_map <- list()
    autosave()
    send_full_plot(reset_view = FALSE, refresh_pop_masks = TRUE)
  })

  observeEvent(input$gate_label_move, {
    data <- input$gate_label_move; req(data, data$gate_id)
    if (!is.null(rv$gates[[data$gate_id]])) {
      rv$gates[[data$gate_id]]$label_offset <- as.numeric(data$label_offset)
      autosave()
    }
  })

  observeEvent(input$gate_select, { rv$selected_gate_id <- input$gate_select; send_gates_only() })

  # Population ids that are quadrant children of a given gate (refs carry a
  # `quadrant` index). Used so a quadrant gate and its 4 populations stay in sync.
  .quadrant_pops_for_gate <- function(gate_id) {
    Filter(function(pid) {
      refs <- rv$populations[[pid]]$gate_refs %||% list()
      any(vapply(refs, function(r) identical(r$gate_id, gate_id) && !is.null(r$quadrant),
                 logical(1)))
    }, names(rv$populations %||% list()))
  }

  # Remove any quadrant gate left with no populations referencing it (e.g. after
  # the user deletes all four quadrant populations).
  .prune_orphaned_quadrant_gates <- function() {
    for (gid in names(rv$gates %||% list())) {
      g <- rv$gates[[gid]]
      if (is.null(g) || !identical(g$gate_type, "quadrant")) next
      if (length(.quadrant_pops_for_gate(gid)) == 0) {
        rv$gates[[gid]] <- NULL
        rv$gate_order <- setdiff(rv$gate_order, gid)
        if (identical(rv$selected_gate_id, gid)) rv$selected_gate_id <- NULL
        rv$.selected_gate_ids <- setdiff(rv$.selected_gate_ids, gid)
      }
    }
  }

  delete_gate_by_id <- function(gate_id) {
    req(gate_id)
    g <- rv$gates[[gate_id]]
    if (is.null(g)) return()
    save_undo_snapshot()
    # Cascade: deleting a quadrant gate also removes its four populations.
    if (identical(g$gate_type, "quadrant")) {
      for (pid in .quadrant_pops_for_gate(gate_id)) {
        if (!is.null(rv$populations[[pid]])) {
          rv$populations <- remove_population_reparent_children(rv$populations, pid)
        }
      }
      sort_population_tree_state()
      if (is.null(rv$populations[[rv$active_population_id %||% ""]])) {
        rv$active_population_id <- rv$root_population_id
      }
      rv$.selected_pop_ids <- intersect(rv$.selected_pop_ids, names(rv$populations))
    }
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
    rv$.selected_gate_ids <- setdiff(rv$.selected_gate_ids, gate_id)
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

  delete_gates_by_ids <- function(gate_ids) {
    gate_ids <- intersect(gate_ids, names(rv$gates))
    if (length(gate_ids) == 0) return()
    save_undo_snapshot()
    # Cascade: quadrant gates take their four populations with them.
    quad_ids <- Filter(function(gid) identical(rv$gates[[gid]]$gate_type, "quadrant"), gate_ids)
    for (gid in quad_ids) {
      for (pid in .quadrant_pops_for_gate(gid)) {
        if (!is.null(rv$populations[[pid]])) {
          rv$populations <- remove_population_reparent_children(rv$populations, pid)
        }
      }
    }
    if (length(quad_ids) > 0) {
      sort_population_tree_state()
      if (is.null(rv$populations[[rv$active_population_id %||% ""]])) {
        rv$active_population_id <- rv$root_population_id
      }
      rv$.selected_pop_ids <- intersect(rv$.selected_pop_ids, names(rv$populations))
    }
    for (gid in gate_ids) {
      rv$gates[[gid]] <- NULL
    }
    rv$gate_order <- setdiff(rv$gate_order, gate_ids)
    for (pid in names(rv$populations)) {
      pop <- rv$populations[[pid]]
      if (length(pop$gate_refs) > 0) {
        rv$populations[[pid]]$gate_refs <-
          Filter(function(ref) !ref$gate_id %in% gate_ids, pop$gate_refs)
      }
    }
    if (!is.null(rv$selected_gate_id) && rv$selected_gate_id %in% gate_ids) {
      rv$selected_gate_id <- NULL
    }
    rv$.selected_gate_ids <- setdiff(rv$.selected_gate_ids, gate_ids)
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
  }

  observeEvent(input$gate_list_toggle_select, {
    evt <- input$gate_list_toggle_select
    req(evt, evt$gate_id)
    gid <- as.character(evt$gate_id)
    if (!gid %in% names(rv$gates)) return()
    checked <- isTRUE(evt$checked)
    if (checked) {
      rv$.selected_gate_ids <- unique(c(rv$.selected_gate_ids, gid))
    } else {
      rv$.selected_gate_ids <- setdiff(rv$.selected_gate_ids, gid)
    }
  })

  observeEvent(input$clear_selected_gates_btn, {
    rv$.selected_gate_ids <- character(0)
    # Visually uncheck without forcing a renderUI (preserves scroll position).
    runjs("document.querySelectorAll('.gate-card-select').forEach(function(cb){ cb.checked = false; });")
  }, ignoreInit = TRUE)

  observeEvent(input$delete_gate_btn, {
    checked <- intersect(rv$.selected_gate_ids %||% character(0), names(rv$gates))

    # Bulk delete path: any gates checked → delete all of them
    if (length(checked) > 0) {
      rv$.pending_bulk_delete_gate_ids <- checked
      gate_names <- vapply(checked, function(gid) rv$gates[[gid]]$name %||% gid, character(1))
      preview <- if (length(gate_names) <= 8) {
        paste(gate_names, collapse = ", ")
      } else {
        paste0(paste(gate_names[1:8], collapse = ", "), ", …")
      }
      showModal(modalDialog(
        title = "Delete Selected Gates",
        tags$p(sprintf("Delete %d checked gate(s)?", length(checked))),
        tags$p(preview, style = "color:#777; font-size:12px;"),
        tags$p("Any populations referencing these gates will lose those references.",
               style = "color:#777;"),
        footer = tagList(
          modalButton("Cancel"),
          actionButton("confirm_bulk_delete_gates_btn", "OK", class = "btn-danger")
        ),
        easyClose = TRUE
      ))
      return()
    }

    # Single-delete path: fall back to highlighted gate
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

  observeEvent(input$confirm_bulk_delete_gates_btn, {
    removeModal()
    ids <- rv$.pending_bulk_delete_gate_ids
    rv$.pending_bulk_delete_gate_ids <- character(0)
    if (length(ids) == 0) return()
    delete_gates_by_ids(ids)
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
    # Read once via isolate so toggling a checkbox does NOT re-render the whole
    # list (which would reset scroll position).  The DOM keeps the user's click
    # state; the server tracks rv$.selected_gate_ids for bulk-delete.
    checked_ids <- isolate(rv$.selected_gate_ids)
    if (length(rv$gates) == 0) {
      return(tags$div(class = "gate-list-panel",
                      tags$em("No gates. Draw one using the toolbar.", style = "color:#999; font-size:12px;")))
    }
    gate_counts <- get_gate_counts()
    ordered_ids <- if (length(rv$gate_order) > 0) rv$gate_order else names(rv$gates)
    cards <- lapply(ordered_ids, function(gid) {
      gate <- rv$gates[[gid]]; if (is.null(gate)) return(NULL)
      is_sel <- identical(gid, rv$selected_gate_id)
      is_checked <- gid %in% checked_ids
      counts <- gate_counts[[gid]]
      is_quad <- identical(gate$gate_type, "quadrant")
      count_text <- if (is_quad) {
        "4 populations"
      } else if (!is.null(counts)) {
        paste0(format(counts$event_count, big.mark = ","), " (", counts$percent_of_parent, "%)")
      } else ""
      ch_text <- paste0(gate$x_channel, " / ", gate$y_channel,
                        if (is_quad) "  · quadrant" else "")
      tags$div(
        class = paste("gate-card", if (is_sel) "selected" else ""),
        onclick = sprintf("Shiny.setInputValue('gate_list_click', '%s', {priority:'event'})", gid),
        tags$span(
          class = "gate-card-select-col",
          tags$input(
            type = "checkbox",
            class = "gate-card-select",
            checked = if (is_checked) "checked" else NULL,
            onclick = sprintf(
              "event.stopPropagation(); Shiny.setInputValue('gate_list_toggle_select', {gate_id:'%s', checked:this.checked, nonce:Date.now()}, {priority:'event'})",
              gid
            )
          )
        ),
        tags$div(class = "gate-color-swatch", style = paste0("background:", gate$color)),
        tags$div(class = "gate-card-name", gate$name),
        tags$div(class = "gate-card-channels", ch_text),
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
          checkboxInput(paste0("gate_ref_", gid), "Include", value = FALSE)
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
      if (isTRUE(input[[paste0("gate_ref_", gid)]])) {
        gate_refs[[length(gate_refs) + 1L]] <- new_gate_ref(gid, include = TRUE)
      }
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
    .prune_orphaned_quadrant_gates()   # drop a quadrant gate once all its quadrants are gone
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
    .prune_orphaned_quadrant_gates()   # drop a quadrant gate once all its quadrants are gone
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
    # Checked populations drive what the biplot displays (union of their events).
    send_full_plot()
  })

  observeEvent(input$clear_selected_pops_btn, {
    rv$.selected_pop_ids <- character(0)
    send_full_plot()
  }, ignoreInit = TRUE)

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

  observeEvent(input$move_selected_pops_btn, {
    selected <- setdiff(intersect(rv$.selected_pop_ids, names(rv$populations)), rv$root_population_id)
    if (length(selected) == 0) {
      showNotification("No populations selected.", type = "message", duration = 2)
      return()
    }
    # Valid new parents: not one of the selected pops, not a descendant of any
    # selected pop (would create a cycle), not root excluded — root IS valid.
    all_ids <- names(rv$populations)
    valid_parent_ids <- Filter(function(pid) {
      if (pid %in% selected) return(FALSE)
      # Would moving any selected pop under this candidate create a cycle?
      any_cycle <- any(vapply(selected, function(sid) {
        would_create_cycle(rv$populations, sid, pid)
      }, logical(1)))
      !any_cycle
    }, all_ids)
    parent_choices <- setNames(
      valid_parent_ids,
      vapply(valid_parent_ids, function(pid) rv$populations[[pid]]$name, character(1))
    )
    pop_names <- paste(vapply(selected, function(pid) {
      as.character(rv$populations[[pid]]$name %||% pid)
    }, character(1)), collapse = ", ")
    showModal(modalDialog(
      title = "Move Selected Populations",
      tags$p(sprintf("Move %d population(s) to a new parent:", length(selected))),
      tags$p(pop_names, style = "font-style:italic; color:#555; font-size:12px;"),
      selectInput("bulk_move_parent_select", "New parent:",
                  choices = parent_choices,
                  selected = rv$root_population_id),
      footer = tagList(
        modalButton("Cancel"),
        actionButton("confirm_move_selected_pops_btn", "Move", class = "btn-primary")
      ),
      easyClose = TRUE
    ))
  }, ignoreInit = TRUE)

  observeEvent(input$confirm_move_selected_pops_btn, {
    removeModal()
    new_parent_id <- input$bulk_move_parent_select
    req(!is.null(new_parent_id), !is.null(rv$populations[[new_parent_id]]))
    selected <- setdiff(intersect(rv$.selected_pop_ids, names(rv$populations)), rv$root_population_id)
    if (length(selected) == 0) return()

    # Re-validate: drop any that would now cycle (defensive)
    to_move <- Filter(function(sid) {
      !would_create_cycle(rv$populations, sid, new_parent_id) && !identical(sid, new_parent_id)
    }, selected)
    if (length(to_move) == 0) {
      showNotification("Move would create a cycle — no populations moved.", type = "warning", duration = 4)
      return()
    }

    save_undo_snapshot()
    for (sid in to_move) {
      old_parent_id <- rv$populations[[sid]]$parent_id
      if (identical(old_parent_id, new_parent_id)) next
      # Detach from old parent's children list
      if (!is.null(old_parent_id) && !is.null(rv$populations[[old_parent_id]])) {
        rv$populations[[old_parent_id]]$children <-
          setdiff(rv$populations[[old_parent_id]]$children, sid)
      }
      # Attach to new parent
      rv$populations <- link_child_to_parent(rv$populations, sid, new_parent_id)
    }
    sort_population_tree_state()
    rv$gate_version <- rv$gate_version + 1L
    autosave()
    send_full_plot()
    showNotification(sprintf("Moved %d population(s) to \"%s\".",
                             length(to_move),
                             rv$populations[[new_parent_id]]$name),
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
        `data-pop-id` = pop_id,
        onclick = sprintf("Shiny.setInputValue('pop_tree_click', '%s', {priority:'event'}); (function(){var c=document.getElementById('population_tree_container'); if(c) c.focus({preventScroll:true});})();", pop_id),
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

    # ── Own gate refs (editable) — all gates available in gate_order ─────────
    gate_refs_ui <- NULL
    if (!is_root && length(rv$gates) > 0) {
      # All gates are editable; applying a gate already filtered by a parent is
      # a logical no-op (the parent mask already excludes those events).
      all_gids <- if (length(rv$gate_order) > 0) rv$gate_order else names(rv$gates)
      # Any existing gate_ref (include or legacy exclude) shows up as checked.
      # Applying the editor normalises checked refs to include = TRUE.
      current_refs <- list()
      for (ref in pop$gate_refs) current_refs[[ref$gate_id]] <- TRUE

      ref_rows <- lapply(all_gids, function(gid) {
        gate <- rv$gates[[gid]]; is_checked <- isTRUE(current_refs[[gid]])
        tags$div(class = "gate-ref-edit-row",
          tags$span(class = "gate-color-swatch",
                    style = paste0("background:", gate$color,
                                   "; width:10px; height:10px; border-radius:2px;")),
          tags$span(class = "gate-ref-name", gate$name),
          checkboxInput(paste0("edit_ref_", gid), "Include", value = is_checked))
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

    # All gates are editable; use gate_order for consistent ordering
    all_gate_ids <- if (length(rv$gate_order) > 0) rv$gate_order else names(rv$gates)

    new_refs <- list()
    for (gid in all_gate_ids) {
      if (isTRUE(input[[paste0("edit_ref_", gid)]])) {
        new_refs[[length(new_refs) + 1L]] <- new_gate_ref(gid, include = TRUE)
      }
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
      hist_overlay_mode = hist_overlay_mode,
      hist_layout = if (is_strategy) "grid" else {
        hl <- as.character(input$illust_hist_layout %||% "grid")
        if (hl %in% c("grid", "ridgeline")) hl else "grid"
      },
      ridge_overlap = if (is_strategy) 0.7 else
        .clamp_num(input$illust_ridge_overlap, default = 0.7, lo = 0, hi = 0.95),
      ridge_col_gap = if (is_strategy) 8 else
        .clamp_num(input$illust_ridge_col_gap, default = 8, lo = 0, hi = 60),
      ridge_gradient = if (is_strategy) FALSE else isTRUE(input$illust_ridge_gradient %||% TRUE)
    )
  }

  collect_layout_params <- function(scope = c("strategy", "illustration")) {
    scope <- match.arg(scope)
    is_strategy <- identical(scope, "strategy")

    fit_to_columns <- if (is_strategy) isTRUE(input$strategy_fit_to_columns) else isTRUE(input$illust_fit_to_columns)
    effective_plot_size_raw <- if (is_strategy) input$strategy_effective_plot_size else input$illustration_effective_plot_size
    effective_plot_size <- suppressWarnings(as.integer(effective_plot_size_raw))
    if (length(effective_plot_size) < 1L) {
      effective_plot_size <- NA_integer_
    } else {
      effective_plot_size <- effective_plot_size[[1L]]
    }
    if (!is.finite(effective_plot_size) || effective_plot_size < 60L || effective_plot_size > 4000L) {
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

  # ── Deferred illustration settings restore ───────────────────────────────────
  # Triggered after workspace load. The channel checkboxes live inside a
  # renderUI, so updateCheckboxGroupInput must run *after* that UI has rendered.
  # We invalidate .illust_ui_restore_version on load; this observer fires once
  # the renderUI output exists (it depends on rv$channels which drives the UI).
  observeEvent(rv$.illust_ui_restore_version, {
    s <- rv$.illust_settings_pending
    if (is.null(s)) return()
    rv$.illust_settings_pending <- NULL   # consume

    chs <- as.character(rv$channels %||% character(0))
    simple_chs <- chs[!grepl("_", chs)]
    marker_chs <- chs[grepl("_", chs)]

    updateCheckboxGroupInput(session, "illust_x_channels_simple",
      selected = intersect(as.character(s$x_channels_simple %||% character(0)), simple_chs))
    updateCheckboxGroupInput(session, "illust_x_channels_marker",
      selected = intersect(as.character(s$x_channels_marker %||% character(0)), marker_chs))

    if (nzchar(s$y_channel %||% ""))
      updateSelectInput(session, "illust_y_channel",   selected = s$y_channel)
    if (nzchar(s$plot_type %||% ""))
      updateRadioButtons(session, "illust_plot_type",   selected = s$plot_type)
    if (nzchar(s$display %||% ""))
      updateRadioButtons(session, "illust_display",     selected = s$display)
    updateCheckboxInput(session, "illust_color_by_pop",  value = isTRUE(s$color_by_pop))
    updateCheckboxInput(session, "illust_overlay_pops",  value = isTRUE(s$overlay_pops))
    if (!is.null(s$all_events))          updateCheckboxInput(session,  "illust_all_events",          value = isTRUE(s$all_events))
    if (!is.null(s$max_events))          updateNumericInput(session,   "illust_max_events",          value = s$max_events)
    if (!is.null(s$plot_size))           updateNumericInput(session,   "illust_plot_size",           value = s$plot_size)
    # n_columns — handle old key "n_cols" for backward compat
    n_cols_val <- s$n_columns %||% s$n_cols
    if (!is.null(n_cols_val))            updateNumericInput(session,   "illust_n_columns",           value = n_cols_val)
    if (!is.null(s$fit_to_columns))      updateCheckboxInput(session,  "illust_fit_to_columns",      value = isTRUE(s$fit_to_columns))
    if (!is.null(s$tick_font_size))      updateNumericInput(session,   "illust_tick_font_size",      value = s$tick_font_size)
    # axis_label_font_size — handle old key "label_font_size" for backward compat
    axis_lbl_val <- s$axis_label_font_size %||% s$label_font_size
    if (!is.null(axis_lbl_val))          updateNumericInput(session,   "illust_axis_label_font_size", value = axis_lbl_val)
    if (!is.null(s$title_font_size))     updateNumericInput(session,   "illust_title_font_size",     value = s$title_font_size)
    if (!is.null(s$gate_label_font_size))updateNumericInput(session,   "illust_gate_label_font_size",value = s$gate_label_font_size)
    if (!is.null(s$pdf_dpi))             updateNumericInput(session,   "illust_pdf_dpi",             value = s$pdf_dpi)
    if (!is.null(s$point_size))          updateNumericInput(session,   "illust_point_size",          value = s$point_size)
    if (!is.null(s$point_alpha))         updateSliderInput(session,    "illust_point_alpha",         value = s$point_alpha)
    if (!is.null(s$hist_line_width))     updateNumericInput(session,   "illust_hist_line_width",     value = s$hist_line_width)
    if (!is.null(s$hist_fill))           updateCheckboxInput(session,  "illust_hist_fill",           value = isTRUE(s$hist_fill))
    if (!is.null(s$hist_fill_alpha))     updateSliderInput(session,    "illust_hist_fill_alpha",     value = s$hist_fill_alpha)
    if (!is.null(s$hist_overlay_mode))   updateSelectInput(session,    "illust_hist_overlay_mode",   selected = s$hist_overlay_mode)
    if (!is.null(s$hist_layout))         updateSelectInput(session,    "illust_hist_layout",         selected = s$hist_layout)
    if (!is.null(s$ridge_overlap))       updateSliderInput(session,    "illust_ridge_overlap",       value = s$ridge_overlap)
    if (!is.null(s$ridge_col_gap))       updateSliderInput(session,    "illust_ridge_col_gap",       value = s$ridge_col_gap)
    if (!is.null(s$ridge_gradient))      updateCheckboxInput(session,  "illust_ridge_gradient",      value = isTRUE(s$ridge_gradient))
    if (!is.null(s$pub_style))           updateCheckboxInput(session,  "illust_pub_style",           value = isTRUE(s$pub_style))
    if (!is.null(s$gate_line_width))     updateNumericInput(session,   "illust_gate_line_width",     value = s$gate_line_width)
    if (!is.null(s$kde_bandwidth))       updateSliderInput(session,    "illust_kde_bandwidth",       value = s$kde_bandwidth)
    # Restore population selection
    if (!is.null(s$pop_selected))        rv$illust_pop_selected <- as.character(s$pop_selected)
  }, ignoreInit = TRUE)

  # ── Illustration preset renderUI ────────────────────────────────────────────
  output$illust_preset_select_ui <- renderUI({
    presets <- rv$illust_presets
    if (length(presets) == 0) {
      tags$span("No presets saved yet.", style = "font-size:11px; color:#888;")
    } else {
      selectInput("illust_preset_select", NULL,
                  choices  = names(presets),
                  selected = names(presets)[[length(presets)]],
                  width    = "180px")
    }
  })

  # ── Sync name box → selected preset ─────────────────────────────────────────
  # When the user picks a different preset from the dropdown, auto-fill the
  # name box with that preset's name.  This makes overwriting intuitive:
  # select a preset, tweak settings, click Save — done.
  observeEvent(input$illust_preset_select, {
    nm <- input$illust_preset_select
    if (!is.null(nm) && nzchar(nm))
      updateTextInput(session, "illust_preset_name", value = nm)
  }, ignoreInit = TRUE, ignoreNULL = TRUE)

  # ── Save preset ─────────────────────────────────────────────────────────────
  observeEvent(input$illust_preset_save_btn, {
    nm <- trimws(input$illust_preset_name %||% "")
    if (!nzchar(nm)) {
      showNotification("Please enter a name for the preset.", type = "warning", duration = 3)
      return()
    }
    is_overwrite <- nm %in% names(rv$illust_presets %||% list())
    s <- capture_illust_settings(input, rv)
    presets <- rv$illust_presets %||% list()
    presets[[nm]] <- s
    rv$illust_presets <- presets
    autosave()
    msg <- if (is_overwrite)
      paste0("Preset \u2018", nm, "\u2019 updated.")
    else
      paste0("Preset \u2018", nm, "\u2019 saved.")
    showNotification(msg, type = "message", duration = 2)
    # Keep the name in the box so it's clear which preset is active / ready to overwrite again.
  }, ignoreInit = TRUE)

  # ── Load preset ─────────────────────────────────────────────────────────────
  observeEvent(input$illust_preset_load_btn, {
    nm <- input$illust_preset_select
    if (is.null(nm) || !nm %in% names(rv$illust_presets)) {
      showNotification("No preset selected.", type = "warning", duration = 3)
      return()
    }
    s <- rv$illust_presets[[nm]]
    apply_illust_settings(s)
    showNotification(paste0("Preset \u2018", nm, "\u2019 loaded."), type = "message", duration = 2)
  }, ignoreInit = TRUE)

  # ── Delete preset ───────────────────────────────────────────────────────────
  observeEvent(input$illust_preset_delete_btn, {
    nm <- input$illust_preset_select
    if (is.null(nm) || !nm %in% names(rv$illust_presets)) {
      showNotification("No preset selected.", type = "warning", duration = 3)
      return()
    }
    presets <- rv$illust_presets
    presets[[nm]] <- NULL
    rv$illust_presets <- presets
    autosave()
    showNotification(paste0("Preset \u2018", nm, "\u2019 deleted."), type = "message", duration = 2)
    updateTextInput(session, "illust_preset_name", value = "")
  }, ignoreInit = TRUE)

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

  # Rebuild full-resolution point arrays for export. The interactive grid is fed
  # a capped preview payload (see render_illustration_tab); this re-computes the
  # batch at the user's full event setting and splices the full x/y arrays back
  # into the preview payload. Axis ranges, ticks, gate overlays and population
  # names/counts are independent of the display subsample, so they are reused
  # unchanged — only the plotted points are upgraded to full resolution.
  .illustration_full_res_payload <- function(preview_payload, full_max_events, plot_type) {
    if (is.null(preview_payload) || length(preview_payload$plots %||% list()) == 0) {
      return(preview_payload)
    }
    assay <- get_filtered_assay_data()
    if (is.null(assay) || nrow(assay) == 0) return(preview_payload)
    pop_ids    <- as.character(preview_payload$pop_ids %||% character(0))
    x_channels <- as.character(preview_payload$x_channels %||% character(0))
    y_channel  <- preview_payload$y_channel
    if (length(pop_ids) == 0 || length(x_channels) == 0) return(preview_payload)
    display_gates <- get_plot_gates()
    batch <- compute_illustration_batch(
      assay, display_gates, rv$gate_order,
      rv$populations, rv$root_population_id,
      pop_ids, x_channels, y_channel,
      plot_type = plot_type, max_events = full_max_events
    )
    out <- preview_payload
    for (key in names(out$plots)) {
      pd_full <- batch$plots[[key]]
      if (is.null(pd_full)) next
      out$plots[[key]]$x <- unname(as.numeric(pd_full$x))
      out$plots[[key]]$y <- if (!is.null(pd_full$y)) unname(as.numeric(pd_full$y)) else out$plots[[key]]$y
      out$plots[[key]]$n_events <- pd_full$n_events
    }
    out
  }

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
    y_channel <- if (illust_plot_type == "biplot") {
      ch <- input$illust_y_channel
      if (!is.null(ch) && length(ch) == 1L && !is.na(ch) && nzchar(ch)) ch else NULL
    } else NULL

    # Explicit feedback instead of a silent req() abort: after switching between
    # SCEs the previous population / channel selections may not carry over, which
    # otherwise makes the Render button appear to do nothing.
    if (length(pop_ids) == 0 || length(x_channels) == 0) {
      msg <- if (length(pop_ids) == 0 && length(x_channels) == 0) {
        "Nothing to render: select at least one population and one X-channel."
      } else if (length(pop_ids) == 0) {
        "Nothing to render: no populations selected (check the Populations list — selections don't carry over between SCEs)."
      } else {
        "Nothing to render: no X-channels selected (check the Channels list)."
      }
      showNotification(msg, type = "warning", duration = 6)
      return(invisible(NULL))
    }

    # ── Interactive-preview event cap ─────────────────────────────────────────
    # Drawing every event (e.g. "all events" on ~1M-event CyTOF data) across many
    # marker panels serialises tens of millions of points to the browser and
    # locks it up. The on-screen grid is only a preview, so bound the points it
    # receives by a total budget; preview_max_events is the per-population-row
    # cap (each row's marker panels share the same subsampled events). The SVG
    # export rebuilds at the user's full setting (full_max_events) on download.
    full_max_events <- illust_max_events  # user setting; Inf = all events
    n_panels_est <- max(1L, length(pop_ids) * length(x_channels))
    ILLUST_PREVIEW_POINT_BUDGET <- 2000000L
    preview_cap <- max(2000L, min(100000L, ILLUST_PREVIEW_POINT_BUDGET %/% n_panels_est))
    preview_max_events <- if (is.finite(full_max_events)) {
      min(as.integer(full_max_events), preview_cap)
    } else {
      preview_cap
    }
    preview_capped <- !is.finite(full_max_events) ||
      as.integer(full_max_events) > preview_max_events

    max_events_key <- as.integer(preview_max_events)
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
      sce_name = rv$sce_name %||% "",
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
          max_events = preview_max_events
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
          # Resolve the user-facing name from rv$populations (authoritative) and
          # the event count from the freshly-computed batch (apply_gating_strategy
          # sets it). Guard every branch so we never assign NULL into the list —
          # a NULL silently drops the key, which the client renders as "Unknown".
          pop <- rv$populations[[pid]] %||% batch$populations[[pid]]
          nm  <- pop$name
          if (is.null(nm) || is.na(nm) || !nzchar(nm)) nm <- "Unknown"
          ec  <- batch$populations[[pid]]$event_count %||% pop$event_count %||% 0L
          pop_names[[pid]]  <- nm
          pop_counts[[pid]] <- as.integer(ec)
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

    # Cache payload for server-side PDF export. `payload` is the capped preview
    # (also reused by the raster PNG export); the SVG export rebuilds full-res
    # point arrays from full_max_events at download time.
    rv$.illustration_pdf_payload <- list(
      payload = base_payload,
      full_max_events = full_max_events,
      plot_type = illust_plot_type,
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
      hist_layout = style$hist_layout,
      ridge_overlap = style$ridge_overlap,
      ridge_col_gap = style$ridge_col_gap,
      ridge_gradient = style$ridge_gradient,
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
        hist_layout          = style$hist_layout,
        ridge_overlap        = style$ridge_overlap,
        ridge_col_gap        = style$ridge_col_gap,
        ridge_gradient       = style$ridge_gradient,
        kde_bandwidth        = style$kde_bandwidth,
        font_sizes           = illust_font_sizes,
        gate_style           = illust_gate_style,
        color_by_population  = isTRUE(input$illust_color_by_pop),
        overlay_populations  = isTRUE(input$illust_overlay_pops),
        population_colors    = illust_population_colors
      ),
      base_payload
    ))

    if (isTRUE(preview_capped) && length(base_payload$plots %||% list()) > 0) {
      showNotification(
        sprintf(paste0("Preview limited to ~%s events/panel for responsiveness. ",
                       "The SVG export uses full resolution."),
                format(preview_max_events, big.mark = ",")),
        type = "message", duration = 5
      )
    }
  }

  observeEvent(input$illust_all_events, {
    if (isTRUE(input$illust_all_events)) {
      updateNumericInput(session, "illust_max_events", value = 0)
    }
  }, ignoreInit = TRUE)

  # Autosave when illustration inputs change (debounced — no need to save on
  # every keystroke; the render button press is the natural checkpoint).
  observeEvent(list(
    input$illust_x_channels_simple, input$illust_x_channels_marker,
    input$illust_y_channel, input$illust_plot_type, input$illust_display,
    input$illust_color_by_pop, input$illust_overlay_pops,
    input$illust_all_events, input$illust_max_events,
    input$illust_plot_size, input$illust_n_columns, input$illust_fit_to_columns,
    input$illust_tick_font_size, input$illust_axis_label_font_size,
    input$illust_title_font_size, input$illust_gate_label_font_size,
    input$illust_pdf_dpi,
    input$illust_point_size, input$illust_point_alpha,
    input$illust_hist_line_width, input$illust_hist_fill,
    input$illust_hist_fill_alpha, input$illust_hist_overlay_mode,
    input$illust_hist_layout, input$illust_ridge_overlap, input$illust_ridge_col_gap,
    input$illust_ridge_gradient,
    input$illust_pub_style, input$illust_gate_line_width,
    input$illust_kde_bandwidth
  ), {
    autosave()
  }, ignoreInit = TRUE, ignoreNULL = FALSE)

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
        hist_layout         = latest_style$hist_layout,
        ridge_overlap       = latest_style$ridge_overlap,
        ridge_col_gap       = latest_style$ridge_col_gap,
        ridge_gradient      = latest_style$ridge_gradient,
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
      # The cached payload is the capped on-screen preview; rebuild full-resolution
      # point arrays so the exported figure is not limited by the preview cap.
      full_payload <- .illustration_full_res_payload(
        data$payload, data$full_max_events %||% Inf, illust_plot_type
      )
      is_ridgeline <- identical(illust_plot_type, "histogram") &&
        identical(as.character(data$hist_layout %||% "grid"), "ridgeline")
      if (is_ridgeline) {
        export_ridgeline_svg(file, full_payload, data)
      } else {
        export_illustration_pdf(file, full_payload, data)
      }
    }
  )

  # ══════════════════════════════════════════════════════════════════════════════
  # PANEL TAB  (marker / display-name rename)
  # ══════════════════════════════════════════════════════════════════════════════

  # Helper: sanitise channel name → valid Shiny input ID
  .panel_safe_id <- function(ch) gsub("[^A-Za-z0-9]", "_", ch)

  output$panel_rename_ui <- renderUI({
    rv$.panel_ui_version   # refresh trigger
    req(rv$sce, length(rv$channels) > 0)

    channels   <- isolate(rv$channels)
    is_flow    <- isolate(is_flow_session(rv$sce))
    sce_local  <- isolate(rv$sce)
    ch_to_pnn  <- S4Vectors::metadata(sce_local)$channel_to_pnn  # may be NULL

    # Fallback: CATALYST-prepped SCEs store the channel (PnN / metal) name in
    # rowData(sce)$channel_name. Use it when channel_to_pnn metadata is absent
    # so the Panel tab always shows channel alongside marker.
    rd_channel_map <- NULL
    if (is.null(ch_to_pnn)) {
      rd <- tryCatch(SummarizedExperiment::rowData(sce_local),
                     error = function(e) NULL)
      if (!is.null(rd) && "channel_name" %in% colnames(rd)) {
        rn <- rownames(sce_local)
        cn <- as.character(rd$channel_name)
        if (length(cn) == length(rn)) {
          rd_channel_map <- setNames(as.list(cn), rn)
        }
      }
    }

    lookup_channel <- function(ch) {
      if (!is.null(ch_to_pnn)) {
        return(as.character(ch_to_pnn[[ch]] %||% "\u2014"))
      }
      if (!is.null(rd_channel_map)) {
        return(as.character(rd_channel_map[[ch]] %||% "\u2014"))
      }
      "\u2014"
    }

    # Always show [channel] [editable marker] — channel column populated from
    # metadata$channel_to_pnn or rowData$channel_name (whichever is available),
    # or a "—" placeholder so the layout stays consistent.
    col_tpl <- "120px 1fr"
    show_channel_col <- !is.null(ch_to_pnn) || !is.null(rd_channel_map)

    header <- tags$div(
      class = "scales-col-header",
      style = paste0("display:grid; grid-template-columns:", col_tpl,
                     "; gap:6px; align-items:center; margin-bottom:2px;"),
      tags$span(if (show_channel_col) "FCS Channel" else "Channel"),
      tags$span("Marker (editable)")
    )

    rows <- lapply(channels, function(ch) {
      safe_id   <- .panel_safe_id(ch)
      pnn       <- lookup_channel(ch)
      is_scatter <- isTRUE(.is_scatter_channel(ch))
      is_qc      <- isTRUE(.is_qc_channel(ch))
      locked     <- is_scatter   # QC channels are renameable; scatter are not

      name_cell <- if (locked) {
        tags$span(
          ch,
          style = "font-size:11px; color:#888; font-style:italic;",
          title = "Scatter channels are locked — renaming would break axis scaling"
        )
      } else {
        textInput(
          paste0("panel_name_", safe_id), NULL,
          value = ch, width = "100%"
        )
      }

      tags$div(
        class = "scales-ch-row",
        style = paste0("display:grid; grid-template-columns:", col_tpl,
                       "; gap:6px; align-items:center;"),
        tags$span(
          pnn,
          class = "scales-ch-name",
          title = paste0("FCS $PnN: ", pnn),
          style = if (locked) "color:#999;" else ""
        ),
        name_cell
      )
    })

    # Split into two side-by-side columns (same layout as Scales tab)
    mid  <- ceiling(length(rows) / 2)
    col1 <- rows[seq_len(mid)]
    col2 <- if (mid < length(rows)) rows[(mid + 1):length(rows)] else list()

    tags$div(
      header,
      tags$div(
        style = "display:grid; grid-template-columns:1fr 1fr; gap:0 12px;",
        tags$div(col1),
        tags$div(col2)
      )
    )
  })

  # ── Apply renames ──────────────────────────────────────────────────────────
  observeEvent(input$apply_panel_rename_btn, {
    req(rv$sce, length(rv$channels) > 0)

    old_channels <- rv$channels
    rename_map   <- list()  # old_name → new_name

    for (ch in old_channels) {
      if (isTRUE(.is_scatter_channel(ch))) next  # locked
      safe_id  <- .panel_safe_id(ch)
      new_name <- trimws(input[[paste0("panel_name_", safe_id)]] %||% "")
      if (!nzchar(new_name) || identical(new_name, ch)) next
      rename_map[[ch]] <- new_name
    }

    if (length(rename_map) == 0) {
      showNotification("No names changed.", type = "message", duration = 2)
      return()
    }

    # Validate: no empty names, no duplicates among proposed new names
    new_names_all <- vapply(old_channels, function(ch) {
      rename_map[[ch]] %||% ch
    }, character(1))

    if (anyDuplicated(new_names_all)) {
      dups <- new_names_all[duplicated(new_names_all)]
      showNotification(
        paste0("Duplicate name(s): ", paste(unique(dups), collapse = ", ")),
        type = "error", duration = 5
      )
      return()
    }

    # ── Apply to SCE rownames ──────────────────────────────────────────────
    new_rownames <- rownames(rv$sce)
    for (old in names(rename_map)) {
      idx <- match(old, new_rownames)
      if (!is.na(idx)) new_rownames[idx] <- rename_map[[old]]
    }
    rownames(rv$sce) <- new_rownames

    # ── Update pnn_to_channel / channel_to_pnn metadata ───────────────────
    md <- S4Vectors::metadata(rv$sce)
    if (!is.null(md$pnn_to_channel)) {
      for (old in names(rename_map)) {
        hits <- names(md$pnn_to_channel)[vapply(md$pnn_to_channel, identical, logical(1), old)]
        for (pnn in hits) md$pnn_to_channel[[pnn]] <- rename_map[[old]]
      }
    }
    if (!is.null(md$channel_to_pnn)) {
      for (old in names(rename_map)) {
        if (!is.null(md$channel_to_pnn[[old]])) {
          md$channel_to_pnn[[rename_map[[old]]]] <- md$channel_to_pnn[[old]]
          md$channel_to_pnn[[old]] <- NULL
        }
      }
    }
    S4Vectors::metadata(rv$sce) <- md

    # ── Update rv$channels ────────────────────────────────────────────────
    rv$channels <- get_channel_names(rv$sce)

    # ── Rename keys in per-channel rv lists ───────────────────────────────
    rename_list_keys <- function(lst, rmap) {
      if (is.null(lst) || length(lst) == 0 || length(rmap) == 0) return(lst)
      for (old in names(rmap)) {
        if (!is.null(lst[[old]])) {
          lst[[rmap[[old]]]] <- lst[[old]]
          lst[[old]] <- NULL
        }
      }
      lst
    }

    rv$cytof_axis_range      <- rename_list_keys(rv$cytof_axis_range,      rename_map)
    rv$global_scale_ranges   <- rename_list_keys(rv$global_scale_ranges,   rename_map)
    rv$flow_logicle_w        <- rename_list_keys(rv$flow_logicle_w,        rename_map)
    rv$flow_logicle_w_auto   <- rename_list_keys(rv$flow_logicle_w_auto,   rename_map)
    rv$flow_scatter_cofactor <- rename_list_keys(rv$flow_scatter_cofactor, rename_map)

    # ── Update plot range override ────────────────────────────────────────
    if (!is.null(rv$.plot_range_override)) {
      ov <- rv$.plot_range_override
      if (!is.null(rename_map[[ov$x_channel]])) ov$x_channel <- rename_map[[ov$x_channel]]
      if (!is.null(rename_map[[ov$y_channel]])) ov$y_channel <- rename_map[[ov$y_channel]]
      rv$.plot_range_override <- ov
    }

    # ── Update gate channel references ────────────────────────────────────
    for (gid in names(rv$gates)) {
      g <- rv$gates[[gid]]
      changed <- FALSE
      if (!is.null(rename_map[[g$x_channel]])) { g$x_channel <- rename_map[[g$x_channel]]; changed <- TRUE }
      if (!is.null(rename_map[[g$y_channel]])) { g$y_channel <- rename_map[[g$y_channel]]; changed <- TRUE }
      if (changed) rv$gates[[gid]] <- g
    }

    # ── Refresh UI channel dropdowns ──────────────────────────────────────
    new_chs    <- rv$channels
    cur_x      <- input$x_channel
    cur_y      <- input$y_channel
    cur_iy     <- input$illust_y_channel
    new_x      <- rename_map[[cur_x]] %||% cur_x
    new_y      <- rename_map[[cur_y]] %||% cur_y
    new_iy     <- rename_map[[cur_iy]] %||% cur_iy
    updateSelectInput(session, "x_channel",       choices = new_chs, selected = new_x)
    updateSelectInput(session, "y_channel",       choices = new_chs, selected = new_y)
    updateSelectInput(session, "illust_y_channel",choices = new_chs, selected = new_iy)

    # Force Scales tab and panel tab to re-render with new names
    rv$.scales_ui_version  <- isolate(rv$.scales_ui_version) + 1L
    rv$.panel_ui_version   <- isolate(rv$.panel_ui_version)  + 1L

    autosave()

    n <- length(rename_map)
    showNotification(
      paste0(n, " channel", if (n != 1) "s" else "", " renamed."),
      type = "message", duration = 3
    )
    send_full_plot()
  }, ignoreInit = TRUE)

  # ── Reset button: just re-render the UI from current names ────────────────
  observeEvent(input$reset_panel_rename_btn, {
    rv$.panel_ui_version <- isolate(rv$.panel_ui_version) + 1L
  }, ignoreInit = TRUE)

  # ── Panel bulk rename (CSV/Excel) ─────────────────────────────────────────
  observeEvent(input$apply_panel_bulk_rename_btn, {
    req(rv$sce, input$panel_bulk_rename_upload)
    upload <- input$panel_bulk_rename_upload
    ext <- tolower(tools::file_ext(upload$name %||% ""))
    tbl <- tryCatch({
      if (ext == "csv") {
        utils::read.csv(upload$datapath, stringsAsFactors = FALSE, check.names = FALSE)
      } else if (ext %in% c("xlsx", "xls")) {
        if (!requireNamespace("readxl", quietly = TRUE))
          stop("Package 'readxl' is needed for Excel uploads.")
        as.data.frame(readxl::read_excel(upload$datapath), stringsAsFactors = FALSE)
      } else {
        stop("Unsupported file type. Use .csv or .xlsx.")
      }
    }, error = function(e) {
      showNotification(paste("Could not read file:", conditionMessage(e)), type = "error", duration = 6)
      NULL
    })
    if (is.null(tbl)) return()

    col_keys <- tolower(trimws(colnames(tbl)))
    ch_idx  <- match("fcs_channel",  col_keys)
    new_idx <- match("new_marker",   col_keys)
    if (is.na(ch_idx) || is.na(new_idx)) {
      showNotification("File must have columns: fcs_channel, new_marker", type = "error", duration = 6)
      return()
    }
    channels <- trimws(as.character(tbl[[ch_idx]]))
    markers  <- trimws(as.character(tbl[[new_idx]]))
    keep <- !is.na(channels) & nzchar(channels) & !is.na(markers) & nzchar(markers)
    channels <- channels[keep]; markers <- markers[keep]
    if (length(channels) == 0) {
      showNotification("No valid rows found.", type = "warning", duration = 4); return()
    }

    # Apply renames via the same mechanism as manual renames
    n_renamed <- 0L
    for (i in seq_along(channels)) {
      ch <- channels[i]
      if (!ch %in% rv$channels) next
      input_id <- paste0("panel_marker_", gsub("[^A-Za-z0-9]", "_", ch))
      updateTextInput(session, input_id, value = markers[i])
      n_renamed <- n_renamed + 1L
    }
    showNotification(
      sprintf("Bulk rename: %d marker(s) updated. Click 'Apply Renames' to confirm.", n_renamed),
      type = "message", duration = 5
    )
  })

  output$panel_bulk_rename_template_dl <- downloadHandler(
    filename = function() "marker_rename_template.csv",
    content = function(file) {
      req(rv$sce, length(rv$channels) > 0)
      chs <- rv$channels
      current_markers <- vapply(chs, function(ch) {
        m <- rv$marker_names[[ch]]
        if (!is.null(m) && nzchar(m)) m else ch
      }, character(1))
      tpl <- data.frame(fcs_channel = chs, new_marker = current_markers,
                        stringsAsFactors = FALSE)
      utils::write.csv(tpl, file, row.names = FALSE)
    }
  )

  # ══════════════════════════════════════════════════════════════════════════════
  # SCALES TAB
  # ══════════════════════════════════════════════════════════════════════════════

  # Helper: sanitise a channel name to a valid Shiny input ID suffix
  .scales_safe_id <- function(ch) gsub("[^A-Za-z0-9]", "_", ch)

  # Render the per-channel table of scale controls (2-column compact layout)
  # ── Compensation (embedded $SPILLOVER) ──────────────────────────────────────
  # Only shown for flow sessions that carry a usable spillover matrix; CyTOF and
  # spectral / already-compensated files (no/identity matrix) get nothing.
  output$compensation_ui <- renderUI({
    rv$.scales_ui_version          # re-render on SCE / workspace load
    rv$comp_on                     # re-render checkbox state on toggle
    req(rv$sce)
    if (!has_compensation()) return(NULL)
    n <- nrow(isolate(rv$spillover_matrix))
    tags$div(
      style = "margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #e0e0e0;",
      tags$div(class = "section-header", "Compensation"),
      tags$div(style = "font-size:11px; color:#666; margin-bottom:6px;",
        sprintf("Embedded spillover matrix found (%d fluorochrome channels). ", n),
        "Apply it to the raw data before gating (do this before drawing gates)."),
      checkboxInput("comp_apply", "Apply compensation",
                    value = isolate(isTRUE(rv$comp_on))),
      tags$div(style = "font-size:11px; color:#666; margin:4px 0 2px;", "Spillover matrix"),
      tags$div(style = "max-height:200px; overflow:auto; font-size:10px;",
               tableOutput("comp_matrix_display"))
    )
  })

  output$comp_matrix_display <- renderTable({
    req(has_compensation())
    m <- rv$spillover_matrix
    df <- as.data.frame(round(m, 4))
    cbind(` ` = colnames(m), df)
  }, rownames = FALSE, digits = 4, spacing = "xs", width = "100%")

  # Toggle: comp is a pre-gating decision. Flipping it changes the linear
  # coordinate space, so we warn if gates exist, re-estimate auto logicle-W and
  # reset cached ranges, then force a full reset_cache refresh + replot.
  observeEvent(input$comp_apply, {
    req(rv$sce, has_compensation())
    new_on <- isTRUE(input$comp_apply)
    if (identical(new_on, isTRUE(rv$comp_on))) return()

    if (length(rv$gates) > 0) {
      showNotification(
        "Compensation changes the linear data beneath existing gates — re-check gate positions after toggling.",
        type = "warning", duration = 7)
    }

    rv$comp_on <- new_on

    # Re-estimate auto logicle-W from the new linear space; the cached W/ranges
    # were derived from the other space and are now stale.
    counts_mat <- extract_assay_data(rv$sce, "counts")
    if (new_on && !is.null(rv$spillover_matrix)) {
      counts_mat <- compensate_matrix(counts_mat, rv$spillover_matrix)
    }
    auto_w <- as.list(estimate_logicle_w_params(counts_mat, colnames(counts_mat)))
    rv$flow_logicle_w_auto <- auto_w
    rv$flow_logicle_w      <- auto_w
    rv$global_scale_ranges <- list()
    initialize_missing_global_scales(rv$channels)
    rv$cytof_axis_range    <- list()
    rv$.range_cache        <- list()
    rv$.scales_ui_version  <- isolate(rv$.scales_ui_version) + 1L

    refresh_assay_data(reset_cache = TRUE)   # bumps assay_version, clears caches
    persist_compensation_state()
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

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
                if (.ch %in% c(x_ch, y_ch)) send_full_plot(reset_view = TRUE, force = TRUE)
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

  observeEvent(input$stats_types_all_btn, {
    updateCheckboxGroupInput(session, "stats_stat_types",
      selected = c("count","pct_parent","pct_total","median","mean","geomean","sd","cv"))
  })
  observeEvent(input$stats_types_none_btn, {
    updateCheckboxGroupInput(session, "stats_stat_types", selected = character(0))
  })

  observeEvent(input$stats_pops_all_btn, {
    req(rv$populations)
    updateCheckboxGroupInput(session, "stats_populations", selected = names(rv$populations))
  })
  observeEvent(input$stats_pops_none_btn, {
    updateCheckboxGroupInput(session, "stats_populations", selected = character(0))
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

  # NOTE: there is no longer an explicit "Save WS" button — autosave() runs on
  # every gate / population / scale change, so the SCE's workspace metadata is
  # always up to date.  The downloadHandler `save_workspace_rds_dl` (below)
  # writes a portable .rds for cross-SCE / cross-session use.

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
      title = "Load workspace from another SCE",
      selectInput("load_ws_source", "Source SCE:", choices = sce_with_ws),
      tags$p("Gates whose channels are not present in this SCE will be skipped.",
             style = "color: #555; font-size: 12px;"),
      tags$p("This will replace the current gates and populations.",
             style = "color: #c00; font-size: 12px;"),
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
    # Annotate the source's instrument_type so apply_workspace can warn on
    # cross-instrument loads (the embedded ws list doesn't carry this field).
    if (is.null(ws$source_instrument_type)) {
      src_inst <- tryCatch(S4Vectors::metadata(source_sce)$instrument_type,
                            error = function(e) NULL)
      ws$source_instrument_type <- if (!is.null(src_inst)) as.character(src_inst) else NA_character_
    }
    apply_workspace(ws, source_label = paste("workspace from", source_name))
  })

  # ── Reset all gates and populations ───────────────────────────────────────
  observeEvent(input$reset_workspace_btn, {
    req(rv$sce)
    n_gates <- length(rv$gates %||% list())
    n_pops  <- max(0L, length(rv$populations %||% list()) - 1L)  # minus root
    if (n_gates == 0 && n_pops == 0) {
      showNotification("Workspace is already empty.", type = "message", duration = 2)
      return()
    }
    showModal(modalDialog(
      title = "Reset workspace?",
      tags$p(sprintf("This will delete all %d gate(s) and %d population(s) from this SCE.",
                     n_gates, n_pops)),
      tags$p("This action can be undone via the Undo button.",
             style = "color:#555; font-size:12px;"),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_reset_workspace_btn", "Reset", class = "btn-danger"))
    ))
  })

  observeEvent(input$confirm_reset_workspace_btn, {
    removeModal()
    reset_gating_state()
  })

  # ── Save / load workspace as portable .rds ────────────────────────────────
  output$save_workspace_rds_dl <- downloadHandler(
    filename = function() {
      nm <- rv$sce_name %||% "workspace"
      paste0(nm, "_workspace_", format(Sys.time(), "%Y%m%d_%H%M%S"), ".rds")
    },
    content = function(file) {
      req(rv$sce)
      ws <- build_workspace_payload()
      saveRDS(ws, file)
    }
  )

  observeEvent(input$load_workspace_rds_upload, {
    req(rv$sce)
    f <- input$load_workspace_rds_upload
    req(f$datapath)
    ws <- tryCatch(readRDS(f$datapath), error = function(e) {
      showNotification(paste("Could not read .rds:", e$message),
                       type = "error", duration = 6)
      NULL
    })
    if (is.null(ws)) return()
    if (!is.list(ws)) {
      showNotification("File does not contain a workspace list.",
                       type = "error", duration = 5)
      return()
    }
    # Accept either: (a) a standalone workspace list, or (b) an entire SCE
    # object — in case the user picks the SCE .rds by mistake.
    if (methods::is(ws, "SingleCellExperiment")) {
      ws <- load_workspace(ws)
      if (is.null(ws)) {
        showNotification("That SCE does not contain a saved workspace.",
                         type = "error", duration = 5)
        return()
      }
    }
    required <- c("gates", "populations", "root_population_id")
    if (!all(required %in% names(ws))) {
      showNotification(".rds file is not a GateLabR workspace.",
                       type = "error", duration = 5)
      return()
    }
    apply_workspace(ws, source_label = paste("workspace from", f$name))
  })

  observeEvent(input$export_pop_btn, {
    req(rv$sce, rv$active_population_id)
    pop_id <- rv$active_population_id
    pop <- rv$populations[[pop_id]]; req(pop)
    if (pop_id == rv$root_population_id) {
      showNotification("Cannot export root population (all events).", type = "warning", duration = 3)
      return()
    }
    # Derive default column name (no spaces / special chars)
    default_col <- gsub("[^A-Za-z0-9_]", "_", trimws(pop$name))
    default_col <- gsub("_+", "_", default_col)
    default_col <- sub("^_|_$", "", default_col)
    if (!nzchar(default_col)) default_col <- "population"

    showModal(modalDialog(
      title = "Export population to colData",
      tags$p(style = "color:#555; font-size:12px; margin-bottom:10px;",
             paste0("Exporting: '", pop$name, "'  \u2014  ", rv$sce_name)),
      textInput("export_col_name",  "Column name:",           value = default_col),
      textInput("export_in_label",  "Label for gated cells:", value = "TRUE"),
      textInput("export_out_label", "Label for other cells:", value = "FALSE"),
      footer = tagList(
        modalButton("Cancel"),
        actionButton("confirm_export_pop_btn", "Export", class = "btn-success")
      )
    ))
  })

  observeEvent(input$confirm_export_pop_btn, {
    removeModal()
    req(rv$sce, rv$active_population_id)
    pop_id <- rv$active_population_id
    pop <- rv$populations[[pop_id]]; req(pop)

    col_name  <- trimws(input$export_col_name  %||% "")
    in_label  <- trimws(input$export_in_label  %||% "TRUE")
    out_label <- trimws(input$export_out_label %||% "FALSE")
    if (!nzchar(col_name)) col_name <- gsub("[^A-Za-z0-9_]", "_", pop$name)

    tryCatch({
      rv$sce <- export_population_to_coldata(
        rv$sce, pop_id, pop$name,
        rv$gates, rv$populations, rv$root_population_id,
        rv$assay_name,
        col_name  = col_name,
        in_label  = in_label,
        out_label = out_label
      )
      assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
      cd_names <- get_coldata_names(rv$sce); rv$coldata_names <- cd_names
      updateSelectInput(session, "overlay_coldata", choices = c("(none)" = "", cd_names))
      showNotification(
        paste0("Exported '", pop$name, "' \u2192 colData$", col_name,
               "  (", in_label, " / ", out_label, ")"),
        type = "message", duration = 4
      )
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

    # Restore per-channel scales saved in the GatingML custom_info (if present).
    # Only channels in the current SCE are touched; W/cofactor apply to flow.
    n_scales <- 0L
    sc <- parsed$scales
    if (is.list(sc) && length(sc) > 0) {
      sess_ch <- rv$channels %||% character(0)
      changed_range <- FALSE; changed_transform <- FALSE
      for (ch in intersect(names(sc), sess_ch)) {
        e  <- sc[[ch]]
        lo <- suppressWarnings(as.numeric(e$lo %||% NA))
        hi <- suppressWarnings(as.numeric(e$hi %||% NA))
        if (is.finite(lo) && is.finite(hi) && hi > lo) {
          rv$global_scale_ranges[[ch]] <- list(lo = lo, hi = hi)
          changed_range <- TRUE; n_scales <- n_scales + 1L
        }
        w <- suppressWarnings(as.numeric(e$w %||% NA))
        if (is.finite(w)) {
          rv$flow_logicle_w[[ch]] <- max(0.1, min(w, 2.0)); changed_transform <- TRUE
        }
        cofac <- suppressWarnings(as.numeric(e$cofactor %||% NA))
        if (is.finite(cofac) && cofac > 0) {
          rv$flow_scatter_cofactor[[ch]] <- cofac; changed_transform <- TRUE
        }
      }
      if (changed_range || changed_transform) {
        rv$.range_cache <- list()
        rv$.scales_ui_version      <- isolate(rv$.scales_ui_version) + 1L
        rv$.flow_transform_version <- isolate(rv$.flow_transform_version) + 1L
      }
      # W / cofactor feed the display transform, so re-transform for flow sessions.
      if (changed_transform && is_flow_session(rv$sce) && rv$assay_name == "exprs") {
        refresh_assay_data(reset_cache = TRUE)
      }
    }

    autosave()
    send_full_plot(reset_view = TRUE)

    msg <- paste0("Imported ", parsed$n_gates_imported, " gates and ",
                  parsed$n_pops_imported, " populations from GatingML")
    if (n_scales > 0) msg <- paste0(msg, "; restored scales for ", n_scales, " channel(s)")
    if (isTRUE(parsed$n_gates_skipped > 0)) {
      msg <- paste0(msg, " (", parsed$n_gates_skipped, " skipped)")
    }
    showNotification(msg, type = "message", duration = 5)
    output$status_text <- renderText(msg)
  })

  # ── Export GatingML ──────────────────────────────────────────────────────────
  .gatingml_export_content <- function(file, fmt) {
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
        format                  = fmt,
        logicle_w_params        = isolate(rv$flow_logicle_w),
        scatter_cofactor_params = isolate(rv$flow_scatter_cofactor),
        counts_mat              = isolate(rv$flow_raw_data),
        global_scale_ranges     = isolate(rv$global_scale_ranges)
      )
    }, error = function(e) {
      showNotification(paste("GatingML export error:", e$message),
                       type = "error", duration = 8)
    })
  }

  output$export_gatingml_dl <- downloadHandler(
    filename = function() {
      sce_nm <- isolate(rv$sce_name) %||% "workspace"
      paste0(gsub("[^A-Za-z0-9_.-]", "_", sce_nm), "_gates_cytobank_",
             format(Sys.time(), "%Y%m%d_%H%M%S"), ".xml")
    },
    content = function(file) .gatingml_export_content(file, "cytobank")
  )

  output$export_gatingml_standard_dl <- downloadHandler(
    filename = function() {
      sce_nm <- isolate(rv$sce_name) %||% "workspace"
      paste0(gsub("[^A-Za-z0-9_.-]", "_", sce_nm), "_gates_standard_",
             format(Sys.time(), "%Y%m%d_%H%M%S"), ".xml")
    },
    content = function(file) .gatingml_export_content(file, "standard")
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
      tags$label("Populations to export:", style = "font-weight:700;"),
      tags$div(style = "margin-bottom:4px;",
        actionButton("fcs_export_pops_all_btn", "Select all",
                     class = "btn-xs btn-default", style = "padding:1px 8px;"),
        actionButton("fcs_export_pops_none_btn", "None",
                     class = "btn-xs btn-default", style = "padding:1px 8px; margin-left:4px;")
      ),
      checkboxGroupInput("fcs_export_pop_ids", NULL,
                         choices = pop_choices,
                         selected = default_pop_ids,
                         inline = FALSE),
      tags$p(tags$em("Checked populations in the tree are preselected here. If none are checked, export defaults to All Events.",
                     style = "color:#888; font-size:11px; margin-top:-4px;")),
      radioButtons("fcs_export_assay", "Data to include:",
                   choices  = assay_choices,
                   selected = if ("counts" %in% available_assays) "counts" else available_assays[1]),
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

  observeEvent(input$fcs_export_pops_all_btn, {
    req(rv$populations)
    updateCheckboxGroupInput(session, "fcs_export_pop_ids", selected = names(rv$populations))
  })
  observeEvent(input$fcs_export_pops_none_btn, {
    updateCheckboxGroupInput(session, "fcs_export_pop_ids", selected = character(0))
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

  # ════════════════════════════════════════════════════════════════════════════
  # UMAP tab
  # ════════════════════════════════════════════════════════════════════════════

  rv$umap_last_render_ver <- 0L
  rv$umap_status_text     <- ""
  # Type markers used for each computed reduction, keyed by reduction name.
  # Also mirrored to metadata(sce)$umap_features for persistence.
  rv$umap_run_features    <- list()

  output$umap_status <- renderText({ rv$umap_status_text })

  # Helper: combined population assignments → character vector (one entry per
  # event). Events belonging to multiple populations pick the first-matching
  # pop in the display order of rv$populations. Events in none become "Ungated".
  # Only populations selected via `input$umap_display_pops` are considered —
  # this lets the user untangle nested gates (e.g. show only terminal pops).
  .umap_pop_assignment <- function() {
    pops <- rv$populations %||% list()
    root_id <- rv$root_population_id
    if (length(pops) == 0 || is.null(root_id)) return(NULL)
    pop_ids <- setdiff(names(pops), root_id)
    selected <- input$umap_display_pops
    if (!is.null(selected)) {
      pop_ids <- pop_ids[pop_ids %in% selected]
    }
    n_cells <- ncol(rv$sce)
    if (length(pop_ids) == 0) return(rep("Ungated", n_cells))
    masks <- rv$pop_events_map %||% list()
    assignment <- rep(NA_character_, n_cells)
    for (pid in pop_ids) {
      m <- masks[[pid]]
      if (is.null(m) || length(m) != n_cells) next
      nm <- pops[[pid]]$name %||% pid
      assignment[is.na(assignment) & m] <- nm
    }
    assignment[is.na(assignment)] <- "Ungated"
    assignment
  }

  # Keep the population dropdowns (display filter + run-on-population) in sync
  # with the current set of user-defined populations.
  observe({
    pops <- rv$populations %||% list()
    root_id <- rv$root_population_id
    pop_ids <- setdiff(names(pops), root_id %||% "")
    labels <- vapply(pop_ids, function(pid)
      as.character(pops[[pid]]$name %||% pid), character(1))

    # Display-filter checkboxes (value = pop_id, label = name)
    display_choices <- if (length(pop_ids) == 0) character(0)
                       else setNames(pop_ids, unname(labels))
    prev_display <- isolate(input$umap_display_pops)
    new_display <- if (is.null(prev_display) || length(prev_display) == 0)
                     pop_ids
                   else intersect(prev_display, pop_ids)
    # If no prior selection existed, select all on first sync
    if (length(new_display) == 0 && length(pop_ids) > 0 &&
        (is.null(prev_display) || length(prev_display) == 0)) {
      new_display <- pop_ids
    }
    updateCheckboxGroupInput(session, "umap_display_pops",
                             choices = display_choices, selected = new_display)

    # Run-on-population dropdown
    run_choices <- c("All cells" = "__all__",
                     if (length(pop_ids) > 0) setNames(pop_ids, unname(labels)))
    prev_run <- isolate(input$umap_run_on_population)
    new_run <- if (!is.null(prev_run) && prev_run %in% run_choices) prev_run else "__all__"
    updateSelectInput(session, "umap_run_on_population",
                      choices = run_choices, selected = new_run)
  })

  observeEvent(input$umap_display_pops_all, {
    pops <- rv$populations %||% list()
    pop_ids <- setdiff(names(pops), rv$root_population_id %||% "")
    updateCheckboxGroupInput(session, "umap_display_pops", selected = pop_ids)
  })
  observeEvent(input$umap_display_pops_clear, {
    updateCheckboxGroupInput(session, "umap_display_pops", selected = character(0))
  })

  # ── Sample selector (for Run-UMAP input) ─────────────────────────────────
  .umap_sample_ids <- function() {
    if (is.null(rv$sce)) return(character(0))
    cd <- tryCatch(SummarizedExperiment::colData(rv$sce), error = function(e) NULL)
    if (is.null(cd) || !("sample_id" %in% colnames(cd))) return(character(0))
    lv <- cd[["sample_id"]]
    if (is.factor(lv)) levels(lv) else sort(unique(as.character(lv)))
  }

  observe({
    req(rv$sce)
    ids <- .umap_sample_ids()
    prev <- isolate(input$umap_run_samples)
    sel <- if (is.null(prev) || length(prev) == 0) ids
           else intersect(prev, ids)
    if (length(sel) == 0 && length(ids) > 0 &&
        (is.null(prev) || length(prev) == 0)) sel <- ids
    updateCheckboxGroupInput(session, "umap_run_samples",
                             choices = if (length(ids) == 0) character(0) else ids,
                             selected = sel)
  })

  observeEvent(input$umap_run_samples_all, {
    updateCheckboxGroupInput(session, "umap_run_samples",
                             selected = .umap_sample_ids())
  })
  observeEvent(input$umap_run_samples_clear, {
    updateCheckboxGroupInput(session, "umap_run_samples", selected = character(0))
  })
  observeEvent(input$umap_run_samples_sync, {
    req(rv$sce)
    cd <- tryCatch(SummarizedExperiment::colData(rv$sce), error = function(e) NULL)
    if (is.null(cd) || !("sample_id" %in% colnames(cd))) return()
    mask <- rv$sample_mask
    sids <- as.character(cd[["sample_id"]])
    if (is.null(mask) || length(mask) != length(sids)) {
      # No active left filter → select all
      updateCheckboxGroupInput(session, "umap_run_samples",
                               selected = .umap_sample_ids())
    } else {
      chosen <- unique(sids[mask])
      updateCheckboxGroupInput(session, "umap_run_samples", selected = chosen)
    }
  })

  # ── "Markers used" display + reselect button ─────────────────────────────
  .umap_current_features <- reactive({
    rv$umap_last_render_ver
    req(rv$sce)
    nm <- input$umap_dr_name
    if (is.null(nm) || !nzchar(nm)) return(character(0))
    # Prefer in-session record; fall back to persisted metadata
    f <- rv$umap_run_features[[nm]]
    if (is.null(f)) {
      md <- tryCatch(S4Vectors::metadata(rv$sce)$umap_features,
                     error = function(e) NULL)
      if (is.list(md)) f <- md[[nm]]
    }
    as.character(f %||% character(0))
  })

  output$umap_features_used <- renderText({
    f <- .umap_current_features()
    if (length(f) == 0) return("(Not recorded — run UMAP from this app to log its feature set.)")
    paste(f, collapse = ", ")
  })

  observeEvent(input$umap_reuse_features, {
    f <- .umap_current_features()
    if (length(f) == 0) {
      showNotification("No recorded markers for this reduction.",
                       type = "warning", duration = 3)
      return()
    }
    chs <- as.character(rv$channels %||% character(0))
    simple <- intersect(f, chs[!grepl("_", chs)])
    marker <- intersect(f, chs[ grepl("_", chs)])
    # Anything not matching either bucket: just put in whichever group exists
    leftover <- setdiff(f, c(simple, marker))
    if (length(leftover) > 0) {
      marker <- c(marker, intersect(leftover, chs))
    }
    updateCheckboxGroupInput(session, "umap_features_simple", selected = simple)
    updateCheckboxGroupInput(session, "umap_features_marker", selected = marker)
    showNotification(sprintf("Reselected %d markers from '%s'.",
                             length(f), input$umap_dr_name),
                     type = "message", duration = 3)
  })

  # Sync reduction dropdown to whatever is stored on the active SCE
  observe({
    req(rv$sce)
    drs <- tryCatch(SingleCellExperiment::reducedDimNames(rv$sce),
                    error = function(e) character(0))
    cur <- isolate(input$umap_dr_name)
    sel <- if (length(drs) == 0) character(0)
           else if (!is.null(cur) && cur %in% drs) cur
           else drs[1]
    updateSelectInput(session, "umap_dr_name",
                      choices = if (length(drs) == 0) character(0) else drs,
                      selected = sel)
  })

  # Sync colData / marker dropdowns
  observe({
    req(rv$sce)
    cd_names <- tryCatch(get_coldata_names(rv$sce),
                         error = function(e) character(0))
    updateSelectInput(session, "umap_color_coldata",
                      choices  = if (length(cd_names) == 0) character(0) else cd_names,
                      selected = isolate(input$umap_color_coldata))

    mk <- tryCatch(get_channel_names(rv$sce),
                   error = function(e) character(0))
    updateSelectInput(session, "umap_color_marker",
                      choices  = if (length(mk) == 0) character(0) else mk,
                      selected = isolate(input$umap_color_marker))
  })

  output$umap_dr_info <- renderText({
    req(rv$sce)
    drs <- tryCatch(SingleCellExperiment::reducedDimNames(rv$sce),
                    error = function(e) character(0))
    nm <- input$umap_dr_name
    if (length(drs) == 0 || is.null(nm) || !nzchar(nm) || !(nm %in% drs)) {
      return("No reduction stored — use 'Run UMAP' below.")
    }
    dm <- tryCatch(SingleCellExperiment::reducedDim(rv$sce, nm),
                   error = function(e) NULL)
    if (is.null(dm)) return("")
    sprintf("%s: %d cells x %d dims", nm, nrow(dm), ncol(dm))
  })

  # ── Feature (type-marker) checkbox UI ──────────────────────────────────────
  output$umap_feature_channels_ui <- renderUI({
    req(rv$channels)
    chs <- as.character(rv$channels)
    marker_assigned <- grepl("_", chs)
    simple <- chs[!marker_assigned]
    marker <- chs[marker_assigned]

    current_simple <- isolate(as.character(input$umap_features_simple %||% character(0)))
    current_marker <- isolate(as.character(input$umap_features_marker %||% character(0)))

    tagList(
      if (length(simple) > 0) {
        tags$div(class = "illust-channel-group",
          tags$div(class = "illust-channel-group-header",
            tags$span("Simple / isotope channels"),
            tags$span(class = "illust-channel-group-actions",
              actionButton("umap_feat_simple_all",   "All",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton("umap_feat_simple_clear", "Clear",
                           class = "btn-xs btn-default", style = "padding:1px 6px;")
            )
          ),
          tags$div(class = "illust-channel-group-body",
            checkboxGroupInput("umap_features_simple", NULL,
              choices  = setNames(simple, simple),
              selected = intersect(current_simple, simple),
              inline   = FALSE)
          )
        )
      },
      if (length(marker) > 0) {
        tags$div(class = "illust-channel-group",
          tags$div(class = "illust-channel-group-header",
            tags$span("Marker-assigned channels"),
            tags$span(class = "illust-channel-group-actions",
              actionButton("umap_feat_marker_all",   "All",
                           class = "btn-xs btn-default", style = "padding:1px 6px;"),
              actionButton("umap_feat_marker_clear", "Clear",
                           class = "btn-xs btn-default", style = "padding:1px 6px;")
            )
          ),
          tags$div(class = "illust-channel-group-body",
            checkboxGroupInput("umap_features_marker", NULL,
              choices  = setNames(marker, marker),
              selected = intersect(current_marker, marker),
              inline   = FALSE)
          )
        )
      }
    )
  })

  observeEvent(input$umap_feat_simple_all, {
    chs <- as.character(rv$channels)
    simple <- chs[!grepl("_", chs)]
    updateCheckboxGroupInput(session, "umap_features_simple", selected = simple)
  })
  observeEvent(input$umap_feat_simple_clear, {
    updateCheckboxGroupInput(session, "umap_features_simple", selected = character(0))
  })
  observeEvent(input$umap_feat_marker_all, {
    chs <- as.character(rv$channels)
    marker <- chs[grepl("_", chs)]
    updateCheckboxGroupInput(session, "umap_features_marker", selected = marker)
  })
  observeEvent(input$umap_feat_marker_clear, {
    updateCheckboxGroupInput(session, "umap_features_marker", selected = character(0))
  })

  # ── Run UMAP ───────────────────────────────────────────────────────────────
  observeEvent(input$umap_run_btn, {
    req(rv$sce, rv$sce_name)
    if (!requireNamespace("CATALYST", quietly = TRUE)) {
      showNotification("Package 'CATALYST' is required to run UMAP.", type = "error", duration = 6)
      return()
    }
    feats <- unique(c(as.character(input$umap_features_simple %||% character(0)),
                      as.character(input$umap_features_marker %||% character(0))))
    if (length(feats) < 2) {
      showNotification("Select at least 2 type markers to run UMAP.",
                       type = "warning", duration = 4)
      return()
    }
    run_name  <- trimws(input$umap_run_name %||% "UMAP")
    if (!nzchar(run_name)) run_name <- "UMAP"
    cells     <- as.integer(input$umap_run_cells %||% 1000)
    n_neigh   <- as.integer(input$umap_run_n_neighbors %||% 15)
    min_dist  <- as.numeric(input$umap_run_min_dist %||% 0.01)
    seed_val  <- as.integer(input$umap_run_seed %||% 1234)
    run_pop   <- input$umap_run_on_population %||% "__all__"
    use_pop   <- nzchar(run_pop) && !identical(run_pop, "__all__")

    # Build the combined input mask: population ∩ samples.
    n_cells <- ncol(rv$sce)
    combined_mask <- rep(TRUE, n_cells)
    if (use_pop) {
      pop_mask <- tryCatch(get_pop_mask(run_pop), error = function(e) NULL)
      if (is.null(pop_mask) || length(pop_mask) != n_cells) {
        showNotification("No event mask available for the selected population. ",
                         "Visit the Populations tab first.",
                         type = "error", duration = 6); return()
      }
      combined_mask <- combined_mask & pop_mask
    }
    selected_samples <- as.character(input$umap_run_samples %||% character(0))
    cd <- tryCatch(SummarizedExperiment::colData(rv$sce), error = function(e) NULL)
    has_sample_col <- !is.null(cd) && ("sample_id" %in% colnames(cd))
    use_sample_subset <- has_sample_col &&
      length(selected_samples) > 0 &&
      length(selected_samples) < length(unique(as.character(cd[["sample_id"]])))
    if (has_sample_col && length(selected_samples) == 0) {
      showNotification("Select at least one sample for UMAP input.",
                       type = "warning", duration = 4); return()
    }
    if (use_sample_subset) {
      samp_mask <- as.character(cd[["sample_id"]]) %in% selected_samples
      combined_mask <- combined_mask & samp_mask
    }
    use_subset <- use_pop || use_sample_subset
    if (use_subset && !any(combined_mask)) {
      showNotification("Population × sample selection has no cells.",
                       type = "error", duration = 6); return()
    }

    withProgress(message = paste("Running", run_name, "..."), value = 0.1, {
      rv$umap_status_text <- "Running UMAP..."
      tryCatch({
        if (use_subset) {
          sub_sce <- rv$sce[, combined_mask]
          set.seed(seed_val)
          sub_sce <- CATALYST::runDR(
            sub_sce, dr = "UMAP",
            cells       = cells,
            features    = feats,
            n_neighbors = n_neigh,
            min_dist    = min_dist
          )
          set.seed(seed_val)
          sub_dr <- SingleCellExperiment::reducedDim(sub_sce, "UMAP")
          full_dr <- matrix(NA_real_, nrow = n_cells, ncol = ncol(sub_dr))
          colnames(full_dr) <- colnames(sub_dr)
          full_dr[combined_mask, ] <- sub_dr
          new_sce <- rv$sce
          SingleCellExperiment::reducedDim(new_sce, run_name) <- full_dr
        } else {
          set.seed(seed_val)
          new_sce <- CATALYST::runDR(
            rv$sce, dr = "UMAP",
            cells       = cells,
            features    = feats,
            n_neighbors = n_neigh,
            min_dist    = min_dist
          )
          set.seed(seed_val)
          if (!identical(run_name, "UMAP") &&
              "UMAP" %in% SingleCellExperiment::reducedDimNames(new_sce)) {
            rd_names <- SingleCellExperiment::reducedDimNames(new_sce)
            rd_names[rd_names == "UMAP"] <- run_name
            SingleCellExperiment::reducedDimNames(new_sce) <- rd_names
          }
        }

        # Record the feature set for this reduction (session + SCE metadata)
        rv$umap_run_features[[run_name]] <- feats
        md_feat <- tryCatch(S4Vectors::metadata(new_sce)$umap_features,
                            error = function(e) NULL)
        if (!is.list(md_feat)) md_feat <- list()
        md_feat[[run_name]] <- feats
        S4Vectors::metadata(new_sce)$umap_features <- md_feat

        rv$sce <- new_sce
        assign(rv$sce_name, new_sce, envir = .GlobalEnv)

        drs <- SingleCellExperiment::reducedDimNames(new_sce)
        updateSelectInput(session, "umap_dr_name",
                          choices  = drs,
                          selected = run_name)

        pop_desc <- if (use_pop) {
          nm <- rv$populations[[run_pop]]$name %||% run_pop
          sprintf(" on '%s'", nm)
        } else ""
        samp_desc <- if (use_sample_subset)
          sprintf(" across %d samples", length(selected_samples)) else ""
        rv$umap_status_text <- sprintf(
          "Computed %s%s%s (%d input cells, cells/sample=%s, %d markers)",
          run_name, pop_desc, samp_desc,
          sum(combined_mask), cells, length(feats))
        rv$umap_last_render_ver <- rv$umap_last_render_ver + 1L
        showNotification(paste("UMAP complete:", run_name),
                         type = "message", duration = 4)
      }, error = function(e) {
        rv$umap_status_text <- paste("UMAP error:", conditionMessage(e))
        showNotification(paste("UMAP error:", conditionMessage(e)),
                         type = "error", duration = 8)
      })
    })
  })

  observeEvent(input$umap_render_btn, {
    rv$umap_last_render_ver <- rv$umap_last_render_ver + 1L
  })

  # ── Build the UMAP data frame for plotting ────────────────────────────────
  umap_plot_df <- reactive({
    rv$umap_last_render_ver
    req(rv$sce)
    drs <- tryCatch(SingleCellExperiment::reducedDimNames(rv$sce),
                    error = function(e) character(0))
    if (length(drs) == 0) return(NULL)

    # Fall back to first available reduction if the dropdown hasn't been
    # updated yet (e.g. immediately after runDR queues an updateSelectInput
    # that hasn't round-tripped back to the client).
    dr_name <- input$umap_dr_name
    if (is.null(dr_name) || !nzchar(dr_name) || !(dr_name %in% drs)) {
      dr_name <- drs[1]
    }
    xy <- SingleCellExperiment::reducedDim(rv$sce, dr_name)
    if (is.null(xy) || ncol(xy) < 2) return(NULL)
    df <- data.frame(x = xy[, 1], y = xy[, 2])

    mode <- input$umap_color_mode %||% "populations"
    if (mode == "populations") {
      assignment <- .umap_pop_assignment()
      if (is.null(assignment) || length(assignment) != nrow(df)) {
        df$color_val <- "Ungated"
      } else {
        df$color_val <- assignment
      }
      # Ordered factor: populations first (in palette order), then Ungated last
      pop_ids <- setdiff(names(rv$populations %||% list()), rv$root_population_id)
      pop_names <- vapply(pop_ids, function(pid) as.character(rv$populations[[pid]]$name %||% pid),
                          character(1))
      levs <- c(pop_names, "Ungated")
      levs <- intersect(levs, unique(df$color_val))
      if (!"Ungated" %in% levs && any(df$color_val == "Ungated")) levs <- c(levs, "Ungated")
      df$color_val <- factor(df$color_val, levels = levs)
    } else if (mode == "coldata") {
      cd_col <- input$umap_color_coldata
      if (is.null(cd_col) || !nzchar(cd_col)) return(NULL)
      cd <- SummarizedExperiment::colData(rv$sce)
      if (!(cd_col %in% colnames(cd))) return(NULL)
      vals <- cd[[cd_col]]
      if (length(vals) != nrow(df)) return(NULL)
      df$color_val <- vals
    } else if (mode == "marker") {
      mk <- input$umap_color_marker
      if (is.null(mk) || !nzchar(mk)) return(NULL)
      if (!(mk %in% rownames(rv$sce))) return(NULL)
      assay_name <- rv$assay_name %||% "exprs"
      vals <- as.numeric(SummarizedExperiment::assay(rv$sce, assay_name)[mk, ])
      df$color_val <- vals
    }

    df <- df[!is.na(df$x) & !is.na(df$y), , drop = FALSE]
    df
  })

  # ── Render UMAP plot (ggplot2, aspect.ratio = 1) ──────────────────────────
  .umap_empty_plot <- function(msg) {
    if (!requireNamespace("ggplot2", quietly = TRUE)) {
      plot.new(); title(msg); return(invisible(NULL))
    }
    library(ggplot2)
    ggplot() +
      annotate("text", x = 0, y = 0, label = msg, size = 5, colour = "#666") +
      theme_void()
  }

  output$umap_plot <- renderPlot({
    df <- umap_plot_df()

    if (is.null(rv$sce)) return(.umap_empty_plot("Load an SCE first."))
    drs <- tryCatch(SingleCellExperiment::reducedDimNames(rv$sce),
                    error = function(e) character(0))
    if (length(drs) == 0) {
      return(.umap_empty_plot("No reduction stored.\nOpen 'Run UMAP' and compute one."))
    }
    if (is.null(df) || nrow(df) == 0) {
      return(.umap_empty_plot(
        paste0("No cells to plot for '", input$umap_dr_name %||% drs[1],
               "'.\nCheck that the reduction has non-NA coordinates.")))
    }

    if (!requireNamespace("ggplot2", quietly = TRUE)) {
      stop("Package 'ggplot2' is required.")
    }
    library(ggplot2)

    mode        <- input$umap_color_mode %||% "populations"
    point_size  <- as.numeric(input$umap_point_size  %||% 0.6)
    point_alpha <- as.numeric(input$umap_point_alpha %||% 0.8)
    text_size   <- as.numeric(input$umap_text_size   %||% 14)
    rast        <- isTRUE(input$umap_rasterize)
    hide_axis   <- isTRUE(input$umap_hide_axis)
    show_legend <- isTRUE(input$umap_show_legend)
    label_pops  <- isTRUE(input$umap_label_pops)
    ungated_col <- input$umap_ungated_color %||% "#BBBBBB"

    p <- ggplot(df, aes(x = x, y = y, colour = color_val))

    if (rast && requireNamespace("ggrastr", quietly = TRUE)) {
      p <- p + ggrastr::geom_point_rast(size = point_size, alpha = point_alpha,
                                        shape = 16, raster.dpi = 300)
    } else {
      p <- p + geom_point(size = point_size, alpha = point_alpha, shape = 16)
    }

    # Scale / palette
    if (mode == "populations") {
      pal <- rv$illust_pop_palette %||% list()
      levs <- levels(df$color_val)
      cols <- vapply(levs, function(lv) {
        if (identical(lv, "Ungated")) return(ungated_col)
        # Look up via pop_id whose name == lv
        pop_ids <- names(rv$populations %||% list())
        match_idx <- which(vapply(pop_ids, function(pid)
          identical(as.character(rv$populations[[pid]]$name %||% pid), lv),
          logical(1)))
        if (length(match_idx) > 0) {
          pid <- pop_ids[[match_idx[1]]]
          return(as.character(pal[[pid]] %||% "#444444"))
        }
        "#444444"
      }, character(1))
      names(cols) <- levs
      p <- p + scale_colour_manual(values = cols, drop = FALSE,
                                   name = "Population")
    } else if (mode == "marker" || (mode == "coldata" && is.numeric(df$color_val))) {
      p <- p + scale_colour_gradientn(colours = hcl.colors(10, "Viridis"),
                                      name = if (mode == "marker") input$umap_color_marker
                                             else input$umap_color_coldata)
    } else {
      # Discrete colData: use CATALYST cluster palette if available, else hue
      if (requireNamespace("CATALYST", quietly = TRUE) &&
          exists(".cluster_cols", envir = asNamespace("CATALYST"))) {
        k_pal <- CATALYST:::.cluster_cols
        n <- length(unique(df$color_val))
        if (length(k_pal) < n) k_pal <- colorRampPalette(k_pal)(n)
        p <- p + scale_colour_manual(values = k_pal[seq_len(n)],
                                     name = input$umap_color_coldata)
      }
    }

    # Labels
    if (label_pops && mode == "populations") {
      lbl_df <- aggregate(cbind(x, y) ~ color_val, data = df, FUN = mean)
      if (requireNamespace("ggrepel", quietly = TRUE)) {
        p <- p + ggrepel::geom_label_repel(
          data = lbl_df, aes(x = x, y = y, label = color_val),
          inherit.aes = FALSE, size = text_size * 0.32,
          alpha = 0.8, show.legend = FALSE)
      } else {
        p <- p + geom_label(
          data = lbl_df, aes(x = x, y = y, label = color_val),
          inherit.aes = FALSE, size = text_size * 0.32,
          alpha = 0.8, show.legend = FALSE)
      }
    }

    dr_label <- input$umap_dr_name %||% "UMAP"
    p <- p +
      labs(x = paste(dr_label, "dim. 1"), y = paste(dr_label, "dim. 2")) +
      theme_minimal() +
      theme(text           = element_text(size = text_size),
            panel.grid.minor = element_blank(),
            panel.grid.major = element_blank(),
            axis.text      = element_text(colour = "black"),
            panel.border   = element_rect(colour = "black", fill = NA, linewidth = 1),
            aspect.ratio   = 1,
            legend.key.height = unit(0.9, "lines"))

    if (hide_axis) {
      p <- p + theme(axis.text.x = element_blank(),
                     axis.text.y = element_blank(),
                     axis.ticks.x = element_blank(),
                     axis.ticks.y = element_blank())
    }
    if (!show_legend) p <- p + theme(legend.position = "none")
    else {
      n_lev <- if (is.factor(df$color_val)) nlevels(df$color_val)
               else length(unique(df$color_val))
      p <- p + guides(colour = guide_legend(
        ncol = if (isTRUE(n_lev > 12)) 2 else 1,
        override.aes = list(alpha = 1, size = 3)))
    }
    p
  }, res = 96)

  # ── Downloads ──────────────────────────────────────────────────────────────
  .umap_save <- function(file, device = c("svg", "pdf")) {
    device <- match.arg(device)
    df <- umap_plot_df()
    req(df)
    isolate({
      w <- as.numeric(input$umap_plot_width  %||% 7)
      h <- as.numeric(input$umap_plot_height %||% 7)
    })
    ggplot2::ggsave(filename = file, plot = last_umap_plot(),
                    device = device, width = w, height = h, units = "in")
  }

  # Capture the ggplot separately so downloads don't re-invoke renderPlot.
  last_umap_plot <- reactive({
    # Re-build the plot outside renderPlot (same code path).
    df <- umap_plot_df()
    req(df)
    mode        <- input$umap_color_mode %||% "populations"
    point_size  <- as.numeric(input$umap_point_size  %||% 0.6)
    point_alpha <- as.numeric(input$umap_point_alpha %||% 0.8)
    text_size   <- as.numeric(input$umap_text_size   %||% 14)
    rast        <- isTRUE(input$umap_rasterize)
    hide_axis   <- isTRUE(input$umap_hide_axis)
    show_legend <- isTRUE(input$umap_show_legend)
    label_pops  <- isTRUE(input$umap_label_pops)
    ungated_col <- input$umap_ungated_color %||% "#BBBBBB"

    library(ggplot2)
    p <- ggplot(df, aes(x = x, y = y, colour = color_val))
    if (rast && requireNamespace("ggrastr", quietly = TRUE)) {
      p <- p + ggrastr::geom_point_rast(size = point_size, alpha = point_alpha,
                                        shape = 16, raster.dpi = 600)
    } else {
      p <- p + geom_point(size = point_size, alpha = point_alpha, shape = 16)
    }
    if (mode == "populations") {
      pal <- rv$illust_pop_palette %||% list()
      levs <- levels(df$color_val)
      cols <- vapply(levs, function(lv) {
        if (identical(lv, "Ungated")) return(ungated_col)
        pop_ids <- names(rv$populations %||% list())
        m <- which(vapply(pop_ids, function(pid)
          identical(as.character(rv$populations[[pid]]$name %||% pid), lv),
          logical(1)))
        if (length(m) > 0) {
          pid <- pop_ids[[m[1]]]
          return(as.character(pal[[pid]] %||% "#444444"))
        }
        "#444444"
      }, character(1))
      names(cols) <- levs
      p <- p + scale_colour_manual(values = cols, drop = FALSE, name = "Population")
    } else if (mode == "marker" || (mode == "coldata" && is.numeric(df$color_val))) {
      p <- p + scale_colour_gradientn(colours = hcl.colors(10, "Viridis"),
                                      name = if (mode == "marker") input$umap_color_marker
                                             else input$umap_color_coldata)
    }
    if (label_pops && mode == "populations") {
      lbl_df <- aggregate(cbind(x, y) ~ color_val, data = df, FUN = mean)
      if (requireNamespace("ggrepel", quietly = TRUE)) {
        p <- p + ggrepel::geom_label_repel(
          data = lbl_df, aes(x = x, y = y, label = color_val),
          inherit.aes = FALSE, size = text_size * 0.32, alpha = 0.8, show.legend = FALSE)
      } else {
        p <- p + geom_label(
          data = lbl_df, aes(x = x, y = y, label = color_val),
          inherit.aes = FALSE, size = text_size * 0.32, alpha = 0.8, show.legend = FALSE)
      }
    }
    dr_label <- input$umap_dr_name %||% "UMAP"
    p <- p +
      labs(x = paste(dr_label, "dim. 1"), y = paste(dr_label, "dim. 2")) +
      theme_minimal() +
      theme(text = element_text(size = text_size),
            panel.grid.minor = element_blank(),
            panel.grid.major = element_blank(),
            axis.text = element_text(colour = "black"),
            panel.border = element_rect(colour = "black", fill = NA, linewidth = 1),
            aspect.ratio = 1,
            legend.key.height = unit(0.9, "lines"))
    if (hide_axis)
      p <- p + theme(axis.text.x = element_blank(), axis.text.y = element_blank(),
                     axis.ticks.x = element_blank(), axis.ticks.y = element_blank())
    if (!show_legend) p <- p + theme(legend.position = "none")
    p
  })

  output$umap_export_svg_dl <- downloadHandler(
    filename = function() paste0(rv$sce_name %||% "umap", "_",
                                 format(Sys.time(), "%Y%m%d_%H%M%S"), ".svg"),
    content  = function(file) .umap_save(file, device = "svg")
  )
  output$umap_export_pdf_dl <- downloadHandler(
    filename = function() paste0(rv$sce_name %||% "umap", "_",
                                 format(Sys.time(), "%Y%m%d_%H%M%S"), ".pdf"),
    content  = function(file) .umap_save(file, device = "pdf")
  )

  # Make the UMAP plot render even when the tab is not currently visible.
  # Without this, Shiny suspends the output; the plot then stays blank until
  # the user navigates back to the tab and something else triggers a refresh.
  outputOptions(output, "umap_plot", suspendWhenHidden = FALSE)

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
        'load_workspace_btn':   'Load gates & populations from another SCE object currently in memory (channels are matched by name; missing ones are skipped)',
        'reset_workspace_btn':  'Delete all gates and populations from this SCE (undoable)',
        'save_workspace_rds_dl': 'Download the current gates, populations, scales and illustration settings as a portable workspace .rds file',
        'load_workspace_rds_upload': 'Load a workspace .rds file (channels are matched by name; missing ones are skipped)',
        'apply_instrument_mode_btn': 'Apply selected instrument mode to the loaded SCE (recomputes exprs from counts when available)',
        'export_pop_btn':     'Export the active population as a colData column on the SCE',
        'refresh_sce_btn':    'Re-scan the global environment for SCE objects',
        'save_rds_dl':        'Download the SCE (with embedded workspace) as an .rds file',
        'export_fcs_btn':     'Export gated population(s) as FCS files (zipped download)',
        'import_gatingml_upload': 'Import Cytobank Gating-ML XML and replace current gates/populations',
        'export_gatingml_dl':          'Export gates as Cytobank-compatible Gating-ML 2.0 XML (uses FCS $PnN channel names, BooleanGate definitions)',
        'export_gatingml_standard_dl': 'Export gates as standard Gating-ML 2.0 XML with GatingHierarchy (re-importable into GateLabR)',
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
        'duplicate_selected_pops_btn': 'Duplicate checked populations under the same parent',
        'move_selected_pops_btn':      'Move checked populations to a different parent',
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
