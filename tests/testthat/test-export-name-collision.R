# Population names in immunology are built from + and -, and the app renders the minus as
# U+2212. Both were mapped to "_", so sibling gates collided on one file name and
# flowCore::write.FCS replaced the earlier file with no error: exporting a whole strategy
# wrote fewer files than there were populations, and nothing in an exported FCS records which
# population it holds, so the loss was undetectable afterwards.

test_that("sibling populations get distinct file names", {
  minus <- rawToChar(as.raw(c(0xe2, 0x88, 0x92)))
  Encoding(minus) <- "UTF-8"
  m <- function(...) paste0(...)
  pops <- c("Scatter", "SSC Singlets", m("CD19+CD3", minus),
            "CD45RB+IgD+", m("CD45RB+IgD", minus), m("CD45RB", minus, "IgD+"),
            "EarlyMem CD27+", m("EarlyMem CD27", minus),
            "csMem CD27+", m("csMem CD27", minus), "Naive", "FSC Singlets")
  safe <- vapply(pops, .safe_file_part, character(1))
  expect_equal(length(unique(safe)), length(pops))
})

test_that("the signs survive, with the Unicode minus normalised to ASCII", {
  # Built from bytes rather than a source literal, so the test means the same thing whatever
  # locale R was started in — a literal is re-encoded on parse and stops being U+2212 under C.
  minus <- rawToChar(as.raw(c(0xe2, 0x88, 0x92)))
  Encoding(minus) <- "UTF-8"
  expect_equal(.safe_file_part(paste0("CD45RB+IgD", minus)), "CD45RB+IgD-")
  expect_equal(.safe_file_part(paste0("CD45RB", minus, "IgD+")), "CD45RB-IgD+")
})

test_that("characters a filesystem should not carry are still removed", {
  expect_equal(.safe_file_part("a/b:c*d?e"), "a_b_c_d_e")
})

test_that("an existing file is never written over", {
  dir <- tempfile("gatelabr-collide-"); dir.create(dir); on.exit(unlink(dir, recursive = TRUE))
  first <- file.path(dir, "pop.fcs")
  writeLines("x", first)
  second <- .unique_export_path(first)
  expect_false(identical(second, first))
  expect_equal(basename(second), "pop_2.fcs")

  writeLines("y", second)
  third <- .unique_export_path(first)
  expect_equal(basename(third), "pop_3.fcs")
})

test_that("an unused path is returned unchanged", {
  dir <- tempfile("gatelabr-fresh-"); dir.create(dir); on.exit(unlink(dir, recursive = TRUE))
  path <- file.path(dir, "fresh.fcs")
  expect_equal(.unique_export_path(path), path)
})
