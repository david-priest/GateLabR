cross_language_cytof_oracle <- function() {
  path <- testthat::test_path(
    "fixtures",
    "cytof_nnls_oracle.json"
  )
  list(
    path = path,
    value = jsonlite::fromJSON(path, simplifyVector = FALSE)
  )
}

oracle_numeric_matrix <- function(rows) {
  do.call(rbind, lapply(rows, function(row) {
    as.double(unlist(row, use.names = FALSE))
  }))
}

oracle_numeric_events <- function(events) {
  do.call(rbind, lapply(events, function(event) {
    as.double(unlist(event, use.names = FALSE))
  }))
}

oracle_canonical_matrix <- function(matrix_input) {
  sources <- unlist(matrix_input$sourceChannels, use.names = FALSE)
  receivers <- unlist(matrix_input$receiverChannels, use.names = FALSE)
  values <- oracle_numeric_matrix(matrix_input$matrix)
  source_order <- GateLabR:::.gatelabr_comp_codepoint_order(sources)
  receiver_order <- GateLabR:::.gatelabr_comp_codepoint_order(receivers)
  list(
    sourceChannels = sources[source_order],
    receiverChannels = receivers[receiver_order],
    matrix = values[source_order, receiver_order, drop = FALSE]
  )
}

test_that("the shared CyTOF oracle bytes and scientific contract are frozen", {
  oracle <- cross_language_cytof_oracle()

  expect_identical(
    digest::digest(
      file = oracle$path,
      algo = "sha256",
      serialize = FALSE
    ),
    "1c8ecd9cad71e342eb7d43542d66bb6eb61eb2c35b25c9f0b2ba190f8d359a64"
  )
  expect_identical(
    oracle$value$schema,
    "gatelab.cytof-nnls-oracle.v1"
  )
  expect_identical(
    oracle$value$orientation,
    "source-rows-receiver-columns"
  )
  expect_identical(
    oracle$value$generation,
    "nnls::nnls(t(identity_backed_S), measured)$x"
  )
  expect_identical(oracle$value$generatedBy$nnls, "1.6")
  expect_identical(
    oracle$value$publicSource$doi,
    "10.1038/nbt.2317"
  )
  expect_identical(
    oracle$value$solverContract$solverVersion,
    "coordinate-descent-qr-v1"
  )
})

test_that("GateLabR reproduces the shared R and TypeScript CyTOF oracle", {
  oracle <- cross_language_cytof_oracle()$value
  solver_settings <- oracle$solverContract$solverSettings
  setting_keys <- names(solver_settings)
  setting_keys <- setting_keys[
    GateLabR:::.gatelabr_comp_codepoint_order(setting_keys)
  ]
  solver_settings <- lapply(setting_keys, function(key) {
    list(key = key, value = solver_settings[[key]])
  })

  for (fixture in oracle$cases) {
    matrix_input <- fixture$matrixInput
    canonical_matrix <- oracle_canonical_matrix(matrix_input)
    scientific <- list(
      schema = "gatelab.compensation-profile.v1",
      kind = "cytof-spillover",
      method = "nnls",
      solverVersion = oracle$solverContract$solverVersion,
      solverSettings = solver_settings,
      matrix = list(
        schema = "gatelab.compensation-matrix.v1",
        orientation = oracle$orientation,
        sourceChannels = canonical_matrix$sourceChannels,
        receiverChannels = canonical_matrix$receiverChannels,
        matrix = lapply(seq_len(nrow(canonical_matrix$matrix)), function(row) {
          unname(canonical_matrix$matrix[row, ])
        })
      ),
      includedChannels = unlist(
        fixture$includedChannels,
        use.names = FALSE
      )
    )
    matrix_record <- GateLabR:::.gatelabr_comp_matrix_record(scientific)
    matrix_hash <- GateLabR:::.gatelabr_comp_matrix_hash(matrix_record)

    expect_identical(
      matrix_hash,
      fixture$expected$matrixHash,
      info = fixture$name
    )
    expect_identical(
      GateLabR:::.gatelabr_comp_profile_hash(
        scientific,
        matrix_hash
      ),
      fixture$expected$profileHash,
      info = fixture$name
    )

    included <- scientific$includedChannels
    adapted <- GateLabR:::.gatelabr_adapt_cytof_matrix(
      matrix_record,
      included
    )
    expect_equal(
      unname(adapted),
      oracle_numeric_matrix(fixture$expected$adaptedMatrix),
      tolerance = 0,
      info = fixture$name
    )

    input_channels <- unlist(
      fixture$inputChannels,
      use.names = FALSE
    )
    input_positions <- match(included, input_channels)
    expect_false(anyNA(input_positions), info = fixture$name)

    measured_events <- oracle_numeric_events(fixture$measuredEvents)
    measured <- t(measured_events[, input_positions, drop = FALSE])
    solved <- GateLabR:::.gatelabr_solve_cytof_events(
      measured,
      t(adapted),
      worker_count = 1L
    )
    actual_events <- measured_events
    actual_events[, input_positions] <- t(solved)
    expected_events <- oracle_numeric_events(
      fixture$expected$compensatedEvents
    )

    tolerance <- 1e-9 + 2e-12 * pmax(
      abs(actual_events),
      abs(expected_events)
    )
    expect_true(
      all(abs(actual_events - expected_events) <= tolerance),
      info = fixture$name
    )

    excluded_positions <- setdiff(
      seq_along(input_channels),
      input_positions
    )
    expect_identical(
      actual_events[, excluded_positions, drop = FALSE],
      measured_events[, excluded_positions, drop = FALSE],
      info = fixture$name
    )

    gate <- fixture$gateCheck
    x <- asinh(
      actual_events[, match(gate$xChannel, input_channels)] /
        gate$cofactor
    )
    y <- asinh(
      actual_events[, match(gate$yChannel, input_channels)] /
        gate$cofactor
    )
    vertices <- oracle_numeric_matrix(gate$vertices)
    members <- which(
      x >= min(vertices[, 1]) &
        x <= max(vertices[, 1]) &
        y >= min(vertices[, 2]) &
        y <= max(vertices[, 2])
    )
    expect_identical(
      members,
      as.integer(unlist(gate$memberRowsOneBased, use.names = FALSE)),
      info = fixture$name
    )
  }
})
