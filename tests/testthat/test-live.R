# The console's side of a running app: stopping it and handing it the console's object.

make_live_sce <- function(cells = 3L) {
  counts <- matrix(seq_len(2L * cells), nrow = 2, dimnames = list(c("CD3", "CD19"), paste0("event", seq_len(cells))))
  SingleCellExperiment::SingleCellExperiment(
    assays = list(counts = counts, exprs = asinh(counts / 5)),
    colData = S4Vectors::DataFrame(sample_id = rep("D1", cells))
  )
}

test_that("gatelabStop and gatelabSync say so when no app is running", {
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  expect_message(stopped <- GateLabR::gatelabStop(), "no app is running")
  expect_false(stopped)
  expect_error(GateLabR::gatelabSync("x"), "no app is running")
})

test_that("gatelabStop stops the running app through its handle", {
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  stopped <- 0L
  live$handle <- list(stop = function() stopped <<- stopped + 1L)
  live$sce_name <- "sce"
  expect_true(GateLabR::gatelabStop())
  expect_identical(stopped, 1L)
})

test_that("gatelabSync hands the console's object to the app, and refuses the wrong one", {
  sce_name <- ".gatelabr_live_sync_test_sce"
  on.exit(
    if (exists(sce_name, envir = .GlobalEnv, inherits = FALSE)) rm(list = sce_name, envir = .GlobalEnv),
    add = TRUE
  )
  live <- GateLabR:::.gatelabr_live
  on.exit(rm(list = ls(live, all.names = TRUE), envir = live), add = TRUE)
  launched <- make_live_sce()
  held <- launched
  live$sce_name <- sce_name
  live$set_sce <- function(object) held <<- object
  live$get_sce <- function() held
  live$written <- launched
  live$address <- GateLabR:::.gatelabr_object_address(launched)

  # The name must be the one the app was launched on, and must hold an SCE.
  expect_error(GateLabR::gatelabSync("other"), "launched on `.gatelabr_live_sync_test_sce`")
  assign(sce_name, "not an object", envir = .GlobalEnv)
  expect_error(GateLabR::gatelabSync(sce_name), "not a SingleCellExperiment")

  # The browser keeps the cells it loaded, so a different set of cells needs a relaunch.
  assign(sce_name, make_live_sce(cells = 4L), envir = .GlobalEnv)
  expect_error(GateLabR::gatelabSync(sce_name), "holds 4 cells and the app was launched with 3")
  expect_identical(held, launched)

  # The same cells with a console change go across; the app now writes to that object.
  changed <- launched
  changed$cluster <- c("c1", "c2", "c1")
  assign(sce_name, changed, envir = .GlobalEnv)
  expect_message(GateLabR::gatelabSync(sce_name), "now works on")
  expect_identical(held, changed)
  expect_identical(live$address, GateLabR:::.gatelabr_object_address(changed))
  expect_false(GateLabR:::.gatelabr_object_replaced(sce_name, live$address))
  # The name defaults to the running app's.
  expect_message(GateLabR::gatelabSync(), "now works on")
})

test_that("a replaced binding is told from the object the app last wrote", {
  sce_name <- ".gatelabr_live_replaced_test_sce"
  on.exit(
    if (exists(sce_name, envir = .GlobalEnv, inherits = FALSE)) rm(list = sce_name, envir = .GlobalEnv),
    add = TRUE
  )
  object <- make_live_sce()
  assign(sce_name, object, envir = .GlobalEnv)
  address <- GateLabR:::.gatelabr_object_address(object)
  replaced <- GateLabR:::.gatelabr_object_replaced
  expect_false(replaced(sce_name, address))
  # Nothing written yet: nothing is ever reported replaced.
  expect_false(replaced(sce_name, NA_character_))
  expect_false(replaced(sce_name, NULL))
  # A rebinding to a modified copy, and a removed binding, both count.
  copy <- object
  copy$cluster <- c("c1", "c2", "c1")
  assign(sce_name, copy, envir = .GlobalEnv)
  expect_true(replaced(sce_name, address))
  rm(list = sce_name, envir = .GlobalEnv)
  expect_true(replaced(sce_name, address))

  # The check says the refusal once per replacement at the console.
  live <- new.env(parent = emptyenv())
  live$address <- address
  assign(sce_name, copy, envir = .GlobalEnv)
  expect_message(text <- GateLabR:::.gatelabr_check_write_back(live, sce_name), "gatelabSync")
  expect_match(text, "was replaced after GateLabR last wrote to it")
  expect_silent(GateLabR:::.gatelabr_check_write_back(live, sce_name))
  # Writing back adopts the object and clears the refusal.
  GateLabR:::.gatelabr_write_back(live, sce_name, copy)
  expect_null(GateLabR:::.gatelabr_check_write_back(live, sce_name))
  expect_identical(live$written, copy)
})

test_that("the background start is used only when Shiny exports it", {
  start <- GateLabR:::.gatelabr_start_app_fn()
  if ("startApp" %in% getNamespaceExports("shiny")) {
    expect_true(is.function(start))
  } else {
    # Older Shiny has an internal startApp with another job; that one must not be picked up.
    expect_null(start)
  }
})
