# CyTOF Gate App — Main Shiny Application
# 3-column layout: sample filter | tabbed plot | gates + populations
# Tabs: Gating | Strategy | Illustration

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

  titlePanel("CyTOF Gating"),

  fluidRow(
    # ═══════════════════════════════════════════════════════════════════════════
    # LEFT COLUMN: SCE/FCS + sample filter + workspace
    # ═══════════════════════════════════════════════════════════════════════════
    column(4,
      tags$div(class = "panel-section",

        # ── SCE + Assay on one row ──
        fluidRow(
          column(6, selectInput("sce_select", "SCE:", choices = NULL)),
          column(6, selectInput("assay_select", "Assay:", choices = NULL))
        ),

        # ── FCS import ──
        tags$div(class = "section-header", "Import FCS"),
        fileInput("fcs_upload", NULL,
                  multiple = TRUE, accept = ".fcs",
                  buttonLabel = "Choose FCS...",
                  placeholder = "No files selected"),

        # ── Sample filter ──
        tags$div(class = "section-header",
          "Sample Filter",
          tags$span(
            textOutput("sample_filter_summary", inline = TRUE),
            style = "font-weight: normal; font-size: 11px; color: #888;"
          )
        ),
        tags$div(class = "sample-filter-panel",
          DT::dataTableOutput("sample_filter_table")
        ),

        hr(),

        # ── Workspace controls ──
        fluidRow(
          column(3, actionButton("save_workspace_btn", "Save",
                                 class = "btn-sm btn-primary", style = "width:100%")),
          column(3, actionButton("load_workspace_btn", "Load",
                                 class = "btn-sm btn-default", style = "width:100%")),
          column(3, actionButton("export_pop_btn", "Export",
                                 class = "btn-sm btn-info", style = "width:100%")),
          column(3, actionButton("refresh_sce_btn", "Refresh",
                                 class = "btn-sm btn-default", style = "width:100%"))
        ),
        tags$div(class = "status-bar", style = "margin-top: 8px;",
          textOutput("status_text", inline = TRUE)
        )
      )
    ),

    # ═══════════════════════════════════════════════════════════════════════════
    # CENTER COLUMN: tabbed (Gating | Strategy | Illustration)
    # ═══════════════════════════════════════════════════════════════════════════
    column(4,
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
              actionButton("reset_view_btn", "Reset", class = "btn-xs btn-default"),
              actionButton("refresh_plot_btn", "Refresh", class = "btn-xs btn-default")
            )
          ),
          tags$div(id = "cytof-plot-container",
                   style = "width: 460px; height: 460px;"),
          tags$div(class = "below-plot-controls",
            fluidRow(
              column(4, selectInput("x_channel", "X:", choices = NULL)),
              column(4, selectInput("y_channel", "Y:", choices = NULL)),
              column(1, actionButton("flip_axes", "", icon = icon("arrows-h"),
                                     style = "margin-top: 25px;", class = "btn-sm")),
              column(3,
                radioButtons("display_mode", NULL,
                             choices = c("Scatter" = "scatter",
                                         "Pseudo" = "pseudocolor",
                                         "Contour" = "contour"),
                             selected = "pseudocolor", inline = TRUE)
              )
            ),
            sliderInput("point_alpha", "Point opacity:",
                        min = 0.05, max = 1.0, value = 0.35, step = 0.05,
                        width = "100%")
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
          actionButton("add_pop_btn", "", icon = icon("plus"),
                       class = "btn-xs btn-success", style = "padding: 1px 5px;")
        ),
        uiOutput("population_tree_ui"),

        hr(),

        # ── Population editor ──
        tags$div(class = "section-header", "Population Editor"),
        uiOutput("population_editor_ui"),

        hr(),

        # ── Color by colData ──
        tags$div(class = "section-header", "Color by colData"),
        selectInput("overlay_coldata", NULL,
                    choices = c("(none)" = ""), selected = ""),
        uiOutput("overlay_checkboxes_ui")
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
    sample_info = NULL, sample_mask = NULL
  )

  runjs <- function(code) {
    session$sendCustomMessage(type = "runjs", message = code)
  }

  autosave <- function() {
    if (is.null(rv$sce) || is.null(rv$sce_name)) return()
    rv$sce <- save_workspace(
      rv$sce, rv$gates, rv$gate_order, rv$populations, rv$root_population_id
    )
    assign(rv$sce_name, rv$sce, envir = .GlobalEnv)
  }

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

  # ── FCS upload ──────────────────────────────────────────────────────────────
  observeEvent(input$fcs_upload, {
    files <- input$fcs_upload
    req(files)

    tryCatch({
      file_paths <- files$datapath
      orig_names <- files$name

      showNotification("Importing FCS files...", type = "message", duration = 2)

      sce <- import_fcs_files(file_paths,
                               sample_names = tools::file_path_sans_ext(orig_names))
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

  # ── SCE selection ───────────────────────────────────────────────────────────
  observeEvent(input$sce_select, {
    req(nchar(input$sce_select) > 0)
    sce_name <- input$sce_select
    sce <- tryCatch(get(sce_name, envir = .GlobalEnv), error = function(e) NULL)
    if (is.null(sce) || !methods::is(sce, "SingleCellExperiment")) {
      output$status_text <- renderText("Invalid SCE object selected")
      return()
    }

    rv$sce <- sce
    rv$sce_name <- sce_name

    assays <- get_assay_names(sce)
    default_assay <- if ("exprs" %in% assays) "exprs" else assays[1]
    updateSelectInput(session, "assay_select", choices = assays, selected = default_assay)

    channels <- get_channel_names(sce)
    rv$channels <- channels
    x_default <- if (length(channels) >= 1) channels[1] else NULL
    y_default <- if (length(channels) >= 2) channels[2] else NULL
    updateSelectInput(session, "x_channel", choices = channels, selected = x_default)
    updateSelectInput(session, "y_channel", choices = channels, selected = y_default)
    updateSelectInput(session, "illust_y_channel", choices = channels, selected = y_default)

    rv$sample_info <- build_sample_table(sce)
    rv$sample_mask <- NULL

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
      rv$gates <- ws$gates
      rv$gate_order <- ws$gate_order %||% names(ws$gates)
      rv$populations <- ws$populations
      rv$root_population_id <- ws$root_population_id
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

  # ── Assay selection ─────────────────────────────────────────────────────────
  observeEvent(input$assay_select, {
    req(rv$sce)
    rv$assay_name <- input$assay_select
    raw_data <- extract_assay_data(rv$sce, rv$assay_name)
    if (rv$assay_name == "counts") {
      rv$assay_data <- asinh(raw_data / 5)
    } else {
      rv$assay_data <- raw_data
    }
    rv$cache_version <- -1L
    rv$pop_events_map <- list()
    rv$gate_version <- rv$gate_version + 1L
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

  output$sample_filter_table <- DT::renderDataTable({
    req(rv$sample_info)
    DT::datatable(
      rv$sample_info$table, filter = "top", selection = "none",
      options = list(pageLength = 20, scrollX = TRUE, dom = "tip",
                     autoWidth = FALSE,
                     columnDefs = list(list(className = "dt-center", targets = "_all"))),
      style = "bootstrap", class = "compact stripe hover", rownames = FALSE
    )
  })

  output$sample_filter_summary <- renderText({
    info <- rv$sample_info
    if (is.null(info)) return("")
    filtered <- input$sample_filter_table_rows_all
    total <- nrow(info$table)
    if (is.null(filtered)) return(paste0(total, " of ", total, " samples"))
    paste0(length(filtered), " of ", total, " samples")
  })

  observe({
    info <- rv$sample_info
    if (is.null(info) || is.null(rv$assay_data)) {
      rv$sample_mask <- NULL
      return()
    }
    filtered_rows <- input$sample_filter_table_rows_all
    total_rows <- nrow(info$table)
    if (is.null(filtered_rows) || length(filtered_rows) == total_rows) {
      if (!is.null(rv$sample_mask)) { rv$sample_mask <- NULL; send_full_plot() }
      return()
    }
    keys <- info$keys[filtered_rows]
    event_indices <- unlist(info$group_map[keys], use.names = FALSE)
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

  # ══════════════════════════════════════════════════════════════════════════════
  # GATING STRATEGY HELPERS
  # ══════════════════════════════════════════════════════════════════════════════

  get_pop_mask <- function(pop_id = NULL) {
    if (is.null(rv$assay_data) || nrow(rv$assay_data) == 0) return(NULL)
    pop_id <- pop_id %||% rv$active_population_id %||% rv$root_population_id
    if (rv$cache_version == rv$gate_version && !is.null(rv$pop_events_map[[pop_id]]))
      return(rv$pop_events_map[[pop_id]])
    result <- apply_gating_strategy(rv$gates, rv$populations, rv$root_population_id, rv$assay_data)
    rv$pop_events_map <- result$masks
    rv$populations <- result$populations
    rv$cache_version <- rv$gate_version
    result$masks[[pop_id]]
  }

  get_gate_counts <- function() {
    if (is.null(rv$assay_data) || length(rv$gates) == 0) return(list())
    pop_mask <- get_pop_mask()
    compute_gate_counts(rv$gates, pop_mask, rv$assay_data)
  }

  compute_stable_range <- function(channel) {
    if (is.null(rv$assay_data) || !channel %in% colnames(rv$assay_data)) return(c(0, 1))
    vals <- rv$assay_data[, channel]
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
    gate_counts <- get_gate_counts()
    alpha <- input$point_alpha %||% 0.35
    x_range <- compute_stable_range(x_ch)
    y_range <- compute_stable_range(y_ch)

    combined_mask <- pop_mask
    if (!is.null(rv$sample_mask)) {
      combined_mask <- if (!is.null(combined_mask)) combined_mask & rv$sample_mask else rv$sample_mask
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
        gates = rv$gates, gate_order = rv$gate_order,
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
        gates = rv$gates, gate_order = rv$gate_order,
        selected_gate_id = rv$selected_gate_id,
        display_mode = input$display_mode %||% "pseudocolor",
        active_pop_id = rv$active_population_id, pop_mask = combined_mask,
        gate_counts = gate_counts, max_events = rv$max_events,
        reset_view = reset_view, point_alpha = alpha,
        x_range_override = x_range, y_range_override = y_range
      )
    }

    rv$current_plot_data <- plot_data
    session$sendCustomMessage("updatePlot", plot_data)
  }

  send_gates_only <- function() {
    req(rv$current_plot_data)
    gate_counts <- get_gate_counts()
    plot_data <- build_gates_only_data(rv$current_plot_data, rv$gates, rv$gate_order,
                                        gate_counts, rv$selected_gate_id)
    rv$current_plot_data <- plot_data
    session$sendCustomMessage("updatePlot", plot_data)
  }

  observeEvent(list(input$x_channel, input$y_channel), {
    req(rv$assay_data, input$x_channel, input$y_channel)
    send_full_plot(reset_view = TRUE)
  }, ignoreInit = TRUE)

  observeEvent(input$display_mode, { req(rv$assay_data); send_full_plot() }, ignoreInit = TRUE)
  observeEvent(input$reset_view_btn, { req(rv$assay_data); send_full_plot(reset_view = TRUE) })
  observeEvent(input$refresh_plot_btn, {
    req(rv$assay_data); rv$cache_version <- -1L; rv$pop_events_map <- list(); send_full_plot()
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
    showModal(modalDialog(
      title = "Name this gate",
      textInput("gate_name_input", "Gate name:", value = ""),
      footer = tagList(modalButton("Cancel"),
                       actionButton("confirm_gate_btn", "Create", class = "btn-success"))
    ))
  })

  observeEvent(input$confirm_gate_btn, {
    removeModal(); gate_data <- rv$.pending_gate; req(gate_data); rv$.pending_gate <- NULL
    save_undo_snapshot()
    gate_name <- input$gate_name_input
    if (is.null(gate_name) || nchar(trimws(gate_name)) == 0) gate_name <- paste0("Gate_", length(rv$gates) + 1)
    color <- next_gate_color(length(rv$gates))
    gate <- new_gate(name = gate_name, gate_type = gate_data$gate_type,
                     x_channel = gate_data$x_channel, y_channel = gate_data$y_channel,
                     vertices = gate_data$vertices, color = color,
                     label_offset = gate_data$label_offset)
    rv$gates[[gate$gate_id]] <- gate
    rv$gate_order <- c(rv$gate_order, gate$gate_id)
    rv$selected_gate_id <- gate$gate_id
    rv$gate_version <- rv$gate_version + 1L
    session$sendCustomMessage("setMode", "navigate"); update_mode_buttons("navigate")
    autosave()
    if (!is.null(rv$current_plot_data) && rv$current_plot_data$x_label == input$x_channel &&
        rv$current_plot_data$y_label == input$y_channel) send_gates_only()
    else send_full_plot()
  })

  observeEvent(input$gate_edit, {
    edit <- input$gate_edit; req(edit, edit$gate_id)
    if (!is.null(rv$gates[[edit$gate_id]])) {
      save_undo_snapshot()
      rv$gates[[edit$gate_id]]$vertices <- edit$vertices
      rv$gate_version <- rv$gate_version + 1L
      session$sendCustomMessage("clearPendingEdit", list(gate_id = edit$gate_id, seq = edit$seq))
      autosave(); send_gates_only()
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

  observeEvent(input$delete_gate_btn, {
    req(rv$selected_gate_id); save_undo_snapshot()
    gate_id <- rv$selected_gate_id
    rv$gates[[gate_id]] <- NULL
    rv$gate_order <- setdiff(rv$gate_order, gate_id)
    for (pid in names(rv$populations)) {
      pop <- rv$populations[[pid]]
      if (length(pop$gate_refs) > 0)
        rv$populations[[pid]]$gate_refs <- Filter(function(ref) ref$gate_id != gate_id, pop$gate_refs)
    }
    rv$selected_gate_id <- NULL; rv$gate_version <- rv$gate_version + 1L
    autosave(); send_full_plot()
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
      tags$div(class = "gate-ref-row", style = "margin: 3px 0;",
        tags$label(style = "font-weight: normal; margin-right: 8px;", gate$name),
        radioButtons(paste0("gate_ref_", gid), NULL,
                     choices = c("Off" = "off", "Include" = "include", "Exclude" = "exclude"),
                     selected = "off", inline = TRUE)
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
    rv$gate_version <- rv$gate_version + 1L
    rv$active_population_id <- pop$population_id
    autosave(); send_full_plot()
  })

  observeEvent(input$delete_pop_click, {
    pop_id <- input$delete_pop_click; req(pop_id, pop_id != rv$root_population_id)
    save_undo_snapshot()
    rv$populations <- remove_population_subtree(rv$populations, pop_id)
    if (identical(rv$active_population_id, pop_id) || is.null(rv$populations[[rv$active_population_id]]))
      rv$active_population_id <- rv$root_population_id
    rv$gate_version <- rv$gate_version + 1L; autosave(); send_full_plot()
  })

  observeEvent(input$pop_tree_click, { rv$active_population_id <- input$pop_tree_click; send_full_plot() })

  output$population_tree_ui <- renderUI({
    rv$populations; rv$root_population_id; rv$active_population_id; rv$gate_version
    if (is.null(rv$root_population_id) || length(rv$populations) == 0) {
      return(tags$div(class = "population-tree-panel",
                      tags$em("No data loaded.", style = "color:#999; font-size:12px;")))
    }
    if (!is.null(rv$assay_data) && nrow(rv$assay_data) > 0) {
      result <- apply_gating_strategy(rv$gates, rv$populations, rv$root_population_id, rv$assay_data)
      rv$populations <- result$populations
    }
    rows <- list()
    queue <- list(list(id = rv$root_population_id, depth = 0))
    while (length(queue) > 0) {
      item <- queue[[1]]; queue <- queue[-1]
      pop <- rv$populations[[item$id]]; if (is.null(pop)) next
      is_active <- identical(item$id, rv$active_population_id)
      is_root <- identical(item$id, rv$root_population_id)
      count_text <- if (!is.null(pop$event_count)) format(pop$event_count, big.mark = ",") else "?"
      pct_text <- if (!is.null(pop$percent_of_parent) && !is_root) paste0("(", pop$percent_of_parent, "%)") else ""
      badges <- lapply(pop$gate_refs, function(ref) {
        gate <- rv$gates[[ref$gate_id]]; if (is.null(gate)) return(NULL)
        tags$span(class = paste("gate-ref-badge", if (!ref$include) "exclude"),
                  style = paste0("background:", gate$color),
                  if (ref$include) gate$name else paste0("-", gate$name))
      })
      indent_px <- item$depth * 16
      row <- tags$div(
        class = paste("pop-row", if (is_active) "active" else ""),
        onclick = sprintf("Shiny.setInputValue('pop_tree_click', '%s', {priority:'event'})", item$id),
        tags$span(class = "pop-row-indent", style = paste0("width:", indent_px, "px")),
        tags$span(class = "pop-row-name", pop$name),
        tags$span(badges),
        tags$span(class = "pop-row-count", count_text),
        tags$span(class = "pop-row-pct", pct_text),
        if (!is_root) tags$span(class = "pop-row-delete",
          onclick = sprintf("event.stopPropagation(); Shiny.setInputValue('delete_pop_click', '%s', {priority:'event'})", item$id),
          "\u00D7")
      )
      rows[[length(rows) + 1L]] <- row
      for (child_id in pop$children) queue <- c(queue, list(list(id = child_id, depth = item$depth + 1)))
    }
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

    name_ui <- if (!is_root) {
      tags$div(class = "pop-editor-row",
        tags$label("Name:", style = "font-weight:600; font-size:12px;"),
        tags$div(style = "display: flex; gap: 4px; margin-top: 2px;",
          textInput("edit_pop_name", NULL, value = pop$name, width = "200px"),
          actionButton("confirm_rename_pop", "Rename", class = "btn-xs btn-primary", style = "margin-top: 5px;"))
      )
    } else {
      tags$div(class = "pop-editor-row",
        tags$label("Name:", style = "font-weight:600; font-size:12px;"),
        tags$span(pop$name, style = "margin-left: 6px;"))
    }

    parent_text <- if (!is.null(pop$parent_id) && !is.null(rv$populations[[pop$parent_id]])) {
      rv$populations[[pop$parent_id]]$name
    } else if (is_root) "(root)" else "Unknown"

    parent_ui <- tags$div(class = "pop-editor-row",
      tags$label("Parent:", style = "font-weight:600; font-size:12px;"),
      tags$span(parent_text, style = "margin-left: 6px; font-size:12px;"))

    count_ui <- tags$div(class = "pop-editor-row", style = "margin-top: 4px;",
      tags$label("Events:", style = "font-weight:600; font-size:12px;"),
      tags$span(if (!is.null(pop$event_count)) format(pop$event_count, big.mark = ",") else "?",
                style = "margin-left: 6px; font-size:12px;"),
      if (!is.null(pop$percent_of_parent) && !is_root)
        tags$span(paste0(" (", pop$percent_of_parent, "% of parent)"), style = "color:#888; font-size:11px;"))

    gate_refs_ui <- NULL
    if (!is_root && length(rv$gates) > 0) {
      current_refs <- list()
      for (ref in pop$gate_refs) current_refs[[ref$gate_id]] <- if (ref$include) "include" else "exclude"
      ref_rows <- lapply(names(rv$gates), function(gid) {
        gate <- rv$gates[[gid]]; current_val <- current_refs[[gid]] %||% "off"
        tags$div(class = "gate-ref-edit-row",
                 style = "margin: 3px 0; display: flex; align-items: center; gap: 6px;",
          tags$span(class = "gate-color-swatch",
                    style = paste0("background:", gate$color, "; width:10px; height:10px; border-radius:2px; flex-shrink:0;")),
          tags$span(gate$name, style = "font-size:12px; min-width: 80px;"),
          radioButtons(paste0("edit_ref_", gid), NULL,
                       choices = c("Off" = "off", "Inc" = "include", "Exc" = "exclude"),
                       selected = current_val, inline = TRUE))
      })
      gate_refs_ui <- tagList(
        tags$div(class = "pop-editor-row",
          tags$label("Gate references (AND logic):", style = "font-weight:600; font-size:12px;"),
          tags$div(style = "margin-top: 4px;", ref_rows),
          actionButton("apply_gate_refs_btn", "Apply Changes", class = "btn-sm btn-primary", style = "margin-top: 6px;"))
      )
    }
    tags$div(class = "pop-editor-panel", name_ui, parent_ui, count_ui, gate_refs_ui)
  })

  observeEvent(input$confirm_rename_pop, {
    req(rv$active_population_id, rv$active_population_id != rv$root_population_id)
    new_name <- input$edit_pop_name
    if (!is.null(new_name) && nchar(trimws(new_name)) > 0) {
      save_undo_snapshot()
      rv$populations[[rv$active_population_id]]$name <- trimws(new_name)
      rv$gate_version <- rv$gate_version + 1L; autosave()
    }
  })

  observeEvent(input$apply_gate_refs_btn, {
    req(rv$active_population_id, rv$active_population_id != rv$root_population_id)
    save_undo_snapshot()
    new_refs <- list()
    for (gid in names(rv$gates)) {
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
    pop_mask <- get_pop_mask()
    stats <- compute_subset_gate_stats(rv$gates, rv$assay_data, rv$overlay_factor,
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
                    input$strategy_full_path), {
    pop_id <- input$strategy_pop
    req(pop_id, nchar(pop_id) > 0, rv$assay_data)

    steps <- compute_gating_strategy(
      rv$gates, rv$populations, rv$root_population_id,
      rv$assay_data, pop_id,
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

  # Render illustration on button click
  observeEvent(input$illust_render_btn, {
    req(rv$assay_data)
    pop_ids <- input$illust_populations
    x_channels <- input$illust_x_channels
    y_channel <- if (input$illust_plot_type == "biplot") input$illust_y_channel else NULL

    req(length(pop_ids) > 0, length(x_channels) > 0)

    batch <- compute_illustration_batch(
      rv$assay_data, rv$gates, rv$gate_order,
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
        gate_ovl <- build_gates_for_channels(rv$gates, rv$gate_order, pop_gc, x_ch, y_channel)
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
    save_undo_snapshot()
    rv$gates <- ws$gates; rv$gate_order <- ws$gate_order %||% names(ws$gates)
    rv$populations <- ws$populations; rv$root_population_id <- ws$root_population_id
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

  output$status_text <- renderText("Select an SCE object to begin")
}

# ── Add custom JS handler for runjs ───────────────────────────────────────────
ui_with_runjs <- tagList(
  ui,
  tags$script(HTML("
    Shiny.addCustomMessageHandler('runjs', function(code) {
      eval(code);
    });
  "))
)

shinyApp(ui = ui_with_runjs, server = server)
