test_that("polygon and rectangle masks include their boundaries", {
  square <- list(c(0, 0), c(0, 2), c(2, 2), c(2, 0))
  polygon_mask <- gate_mask_polygon(
    x_vals = c(1, 3, 0, 2, 1),
    y_vals = c(1, 1, 1, 2, 0),
    vertices = square
  )
  expect_identical(polygon_mask, c(TRUE, FALSE, TRUE, TRUE, TRUE))

  rectangle_mask <- gate_mask_rectangle(
    x_vals = c(0, -1, 2, 2.5, -2),
    y_vals = c(0, -1, 3, 1, 1),
    vertices = list(c(2, 3), c(-1, -1))
  )
  expect_identical(rectangle_mask, c(TRUE, TRUE, TRUE, FALSE, FALSE))
})

test_that("nested and positive-AND populations use identical intersections", {
  data <- cbind(
    X = c(-1, 0, 1, 2, 3),
    Y = c(-1, 0, 1, 2, 3)
  )
  gates <- list(
    rect = list(
      gate_id = "rect", name = "Rectangle", gate_type = "rectangle",
      x_channel = "X", y_channel = "Y", vertices = list(c(0, 0), c(2, 2))
    ),
    poly = list(
      gate_id = "poly", name = "Polygon", gate_type = "polygon",
      x_channel = "X", y_channel = "Y",
      vertices = list(c(0, 0), c(2, 0), c(2, 2), c(0, 2))
    )
  )
  populations <- list(
    root = list(
      population_id = "root", name = "All Events", parent_id = NULL,
      children = c("rect_pop", "and_pop"), gate_refs = list(), gate_logic = "and"
    ),
    rect_pop = list(
      population_id = "rect_pop", name = "Rectangle", parent_id = "root",
      children = "nested", gate_refs = list(list(gate_id = "rect", include = TRUE)),
      gate_logic = "and"
    ),
    nested = list(
      population_id = "nested", name = "Nested", parent_id = "rect_pop",
      children = character(0), gate_refs = list(list(gate_id = "poly", include = TRUE)),
      gate_logic = "and"
    ),
    and_pop = list(
      population_id = "and_pop", name = "AND", parent_id = "root",
      children = character(0),
      gate_refs = list(
        list(gate_id = "rect", include = TRUE),
        list(gate_id = "poly", include = TRUE)
      ),
      gate_logic = "and"
    )
  )

  result <- apply_gating_strategy(gates, populations, "root", data)
  expect_identical(result$masks$nested, result$masks$and_pop)
  expect_identical(result$masks$nested, c(FALSE, TRUE, TRUE, TRUE, FALSE))
})
