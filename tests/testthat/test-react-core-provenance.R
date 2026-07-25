test_that("bundled GateLab core has pinned, internally consistent provenance", {
  assets <- GateLabR:::.gatelabr_react_asset_dir()
  provenance_path <- file.path(assets, "CORE_PROVENANCE.json")
  expect_true(file.exists(provenance_path))
  provenance <- jsonlite::fromJSON(provenance_path, simplifyVector = TRUE)

  expect_identical(provenance$schemaVersion, 1L)
  expect_identical(provenance$sourceRepository, "david-priest/GateLab-dev")
  expect_match(provenance$sourceCommit, "^[0-9a-f]{40}$")
  expect_identical(provenance$buildCommand, "npm run build:embed")
  expect_identical(provenance$hostContractVersion, 1L)
  expect_identical(provenance$datasetContractVersion, 1L)
  expect_identical(provenance$workspaceContractVersion, 1L)
  expect_identical(provenance$colDataContractVersion, 1L)

  files <- unlist(provenance$files, use.names = TRUE)
  expect_true(is.character(files))
  expect_true(length(files) >= 3L)
  expect_identical(anyDuplicated(names(files)), 0L)
  for (path in names(files)) {
    full_path <- file.path(assets, path)
    expect_true(file.exists(full_path), info = path)
    expect_identical(
      unname(tools::md5sum(full_path)),
      unname(files[[path]]),
      info = path
    )
  }
})

test_that("Vite manifest references only bundled GateLab core artifacts", {
  assets <- GateLabR:::.gatelabr_react_asset_dir()
  manifest <- jsonlite::fromJSON(
    file.path(assets, "manifest.json"),
    simplifyVector = FALSE
  )
  referenced <- unique(unlist(lapply(manifest, function(entry) {
    c(entry$file, entry$css, entry$assets)
  }), use.names = FALSE))
  referenced <- referenced[!is.na(referenced) & nzchar(referenced)]
  expect_true(length(referenced) >= 2L)
  for (path in referenced) {
    expect_true(file.exists(file.path(assets, path)), info = path)
  }
})
