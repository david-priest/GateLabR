# Reconstruct saved display and gate coordinates without evaluating population membership.
# TransformSpec is the shared app contract (engine/sample.ts, biex.ts and flowjoGrid.ts).

.gatelabr_strategy_transform <- function(spec) {
  if (!is.list(spec) || !is.character(spec$kind) || length(spec$kind) != 1L || is.na(spec$kind))
    stop("Cannot reconstruct a saved transform without its kind.", call. = FALSE)
  kind <- spec$kind
  number <- function(name, positive = FALSE) {
    value <- suppressWarnings(as.numeric(spec[[name]]))
    if (length(value) != 1L || !is.finite(value) || (positive && value <= 0))
      stop("Saved ", kind, " transform has an invalid '", name, "'.", call. = FALSE)
    value
  }
  built <- switch(kind,
    identity = list(forward = identity, inverse = identity),
    asinh = {
      cofactor <- number("cofactor", TRUE)
      list(forward = function(x) asinh(x / cofactor), inverse = function(y) cofactor * sinh(y))
    },
    hyperlog = .gatelabr_hyperlog_transform(spec),
    logicle = {
      M <- number("M", TRUE)
      trans <- flowCore::logicleTransform(t = number("T", TRUE), w = number("W"),
                                          m = M, a = number("A"))
      to_decades <- trans@.Data
      from_decades <- flowCore::inverseLogicleTransform(trans)@.Data
      # flowCore returns M * the normalized Gating-ML coordinate, including when A != 0.
      # This is the conversion used by flowWorkspace::logicleGml2_trans, via public APIs.
      list(forward = function(x) to_decades(x) / M, inverse = function(y) from_decades(y * M))
    },
    wsplog = {
      offset <- number("offset", TRUE); decades <- number("decades", TRUE)
      list(forward = function(x) (log10(pmax(x, offset)) - log10(offset)) / decades,
           inverse = function(y) 10^(y * decades + log10(offset)))
    },
    flog = {
      T <- number("T", TRUE); M <- number("M", TRUE)
      standard <- isTRUE(spec$standard)
      list(forward = function(x) suppressWarnings(log10((if (standard) x else pmax(x, T * 10^-M)) / T) / M + 1),
           inverse = function(y) T * 10^((y - 1) * M))
    },
    biex = {
      lut <- .gatelabr_strategy_biex_table(spec)
      interpolate <- if (isTRUE(spec$spline)) function(x, y) stats::splinefun(x, y, method = "natural") else
        function(x, y) {
          fun <- stats::approxfun(x, y, rule = 2)
          function(v) { out <- fun(v); out[!is.finite(v)] <- NA_real_; out }
        }
      list(forward = interpolate(lut$x, lut$y), inverse = interpolate(lut$y, lut$x))
    },
    flowjoChannels = .gatelabr_strategy_grid_transform(spec),
    stop("Cannot reconstruct saved transform kind '", kind, "'.", call. = FALSE))
  bounds <- spec$bounds
  if (is.list(bounds) && (!is.null(bounds$min) || !is.null(bounds$max))) {
    forward <- built$forward
    low <- if (is.null(bounds$min)) -Inf else as.numeric(bounds$min)
    high <- if (is.null(bounds$max)) Inf else as.numeric(bounds$max)
    if (length(low) != 1L || length(high) != 1L || is.na(low) || is.na(high) || low > high)
      stop("Saved transform has invalid bounds.", call. = FALSE)
    built$forward <- function(x) pmin(high, pmax(low, forward(x)))
  }
  built
}

# The table is the biex transform. Preserve the legacy integer-truncated root, the 4096-channel
# FlowJo table, and cytolib's natural spline as three distinct saved choices.
.gatelabr_strategy_biex_table <- function(spec) {
  fields <- c("maxValue", "pos", "neg", "widthBasis", "channelRange")
  p <- vapply(fields, function(field) {
    value <- suppressWarnings(as.numeric(spec[[field]]))
    if (length(value) != 1L || !is.finite(value)) stop("Invalid saved biex parameter: ", field, call. = FALSE)
    value
  }, numeric(1))
  channels <- if (is.null(spec$tableChannels)) p[["channelRange"]] else as.numeric(spec$tableChannels)
  if (length(channels) != 1L || !is.finite(channels) || channels != trunc(channels) || channels < 2 ||
      channels > 65536 || p[["channelRange"]] <= 0 || p[["maxValue"]] <= 0 || p[["widthBasis"]] >= 0)
    stop("Invalid saved biex calibration table.", call. = FALSE)
  strict <- !is.null(spec$tableChannels)
  width <- log10(-p[["widthBasis"]])
  if (width < 0.5 || width > 3) width <- 0.5
  decades <- p[["pos"]] - width / 2
  extra <- max(0, p[["neg"]]) + width / 2
  zero <- min(trunc(extra * channels / (extra + decades)), trunc(channels / 2))
  if (!is.finite(zero) || zero < 0 || zero > channels) stop("Invalid saved biex zero channel.", call. = FALSE)
  if (zero > 0) decades <- extra * channels / zero
  width <- width / (2 * decades)
  positive_range <- log(10) * decades
  if (!is.finite(positive_range) || positive_range <= 0) stop("Invalid saved biex positive range.", call. = FALSE)
  root <- function(b, w) {
    if (w == 0) return(b)
    lo <- 0; hi <- b; d <- b / 2
    magnitude <- if (strict) abs else function(x) abs(trunc(x))
    step <- previous <- magnitude(lo - hi)
    fb <- -2 * log(b) + w * b
    f <- 2 * log(d) + w * b + fb
    df <- 2 / d + w
    for (i in seq_len(100)) {
      if (((d - hi) * df - f) * ((d - lo) * df - f) >= 0 || magnitude(2 * f) > magnitude(previous * df)) {
        step <- (hi - lo) / 2; d <- lo + step
        if (d == lo) return(d)
      } else {
        step <- f / df; old <- d; d <- d - step
        if (d == old) return(d)
      }
      if (magnitude(step) < 1e-12) return(d)
      previous <- step; f <- 2 * log(d) + w * d + fb; df <- 2 / d + w
      if (f < 0) lo <- d else hi <- d
    }
    d
  }
  negative_range <- root(positive_range, width)
  j <- 0:channels
  positive <- exp(j / (channels + 1) * positive_range)
  negative <- exp(j / (channels + 1) * -negative_range) *
    exp((positive_range + negative_range) * (width + extra / decades))
  s <- positive[zero + 1] - negative[zero + 1]
  at <- (zero:channels) + 1
  positive[at] <- p[["maxValue"]] / exp(positive_range) * (positive[at] - negative[at] - s)
  if (zero > 0) positive[seq_len(zero)] <- -positive[2 * zero - (0:(zero - 1)) + 1]
  if (any(!is.finite(positive)) || any(diff(positive) <= 0)) stop("Invalid saved biex calibration table.", call. = FALSE)
  list(x = positive, y = j * p[["channelRange"]] / channels)
}

.gatelabr_strategy_grid_transform <- function(spec) {
  N <- as.numeric(spec$channels); axis <- spec$axis
  if (length(N) != 1L || !is.finite(N) || N < 2 || N > 65536 || N != trunc(N) || !is.list(axis))
    stop("Invalid saved FlowJo channel grid.", call. = FALSE)
  clamp <- function(x) pmin(N - 1, pmax(0, floor(x + 0.5)))
  if (identical(axis$kind, "linear")) {
    low <- as.numeric(axis$minRange); span <- as.numeric(axis$maxRange) - low
    if (length(span) != 1L || !is.finite(span) || span <= 0) stop("Invalid saved linear grid.", call. = FALSE)
    return(list(forward = function(x) clamp(((x - low) * N) / span), inverse = function(y) low + y * span / N))
  }
  if (identical(axis$kind, "wsplog")) {
    .gatelabr_strategy_transform(axis) # validate the recorded parameters
    offset <- as.numeric(axis$offset); decades <- as.numeric(axis$decades)
    return(list(forward = function(x) clamp((log10(pmax(x, 1e-300)) - log10(offset)) / decades * N),
                inverse = function(y) offset * 10^(y * decades / N)))
  }
  if (!identical(axis$kind, "biex")) stop("Invalid saved FlowJo grid axis.", call. = FALSE)
  axis$tableChannels <- 4096
  x <- .gatelabr_strategy_biex_table(axis)$x
  last <- length(x) - 1; per_cell <- last / N
  raw <- stats::approxfun(0:last, x, rule = 2)
  list(forward = function(v) {
    index <- findInterval(v, x, all.inside = FALSE) - 1
    index[is.na(index)] <- 0
    floor(pmin(last, pmax(0, index)) / per_cell)
  }, inverse = function(y) ifelse(y >= N, x[[last + 1]], raw((pmax(y, 0) + 0.5) * per_cell)))
}

# A sample's active layer is saved in the workspace. The application's active_sample_ids
# records the earlier apply/adopt operation and can be stale after a header toggle.
.gatelabr_strategy_compensated_layers <- function(sce, workspace, assay, sample_of, pooled) {
  entries <- workspace$samples
  active <- function(entry) isTRUE(entry$compensationOn) || identical(entry$assay$activeLayer, "compensated")
  if (!length(entries) || !any(vapply(entries, active, logical(1)))) return(list())
  if (length(sample_of) != ncol(sce))
    stop("Saved compensated layers require one sample identity per event.", call. = FALSE)
  samples <- sort(unique(as.character(sample_of[pooled])))
  state <- .gatelabr_compensation_state(sce)
  dataset <- S4Vectors::metadata(sce)$gatelab_workspace$dataset_id
  layers <- list()
  for (sample in samples) {
    fail <- function() stop("Cannot reconstruct saved compensated layer for sample '", sample,
                            "'. Save its current assay and compensation binding in GateLabR again.", call. = FALSE)
    hits <- which(vapply(entries, function(entry) {
      id <- .gatelabr_scalar_or(entry$sampleId, "")
      identical(.gatelabr_scalar_or(entry$fileName, ""), sample) || identical(id, sample) || endsWith(id, paste0(":", sample))
    }, logical(1)))
    if (length(hits) != 1L) fail()
    entry <- entries[[hits]]
    if (!active(entry)) next
    binding <- entry$assay$compensatedLayer
    if (!identical(entry$assay$schema, "gatelab.sample-assay-binding.v1") ||
        is.null(entry$sampleId) || is.null(binding$profileId) || is.null(binding$profileHash) || is.null(binding$matrixHash)) fail()
    application <- Filter(function(candidate) {
      targets <- as.character(unlist(candidate$target_sample_ids))
      matched <- entry$sampleId %in% targets || (!is.null(dataset) && entry$sampleId %in% paste0(dataset, ":", targets))
      identical(candidate$profile_id, binding$profileId) && identical(candidate$source_assay_id, assay) &&
        matched && !is.null(candidate$output_assay_id) && candidate$output_assay_id %in% SummarizedExperiment::assayNames(sce)
    }, state$applications)
    if (length(application) != 1L) fail()
    application <- application[[1]]
    profile <- tryCatch(jsonlite::fromJSON(application$profile_json, simplifyVector = FALSE), error = function(...) NULL)
    if (!identical(profile$profileHash, binding$profileHash) || !identical(profile$matrixHash, binding$matrixHash) ||
        !identical(.gatelabr_assay_coordinate_space(sce, application$output_assay_id), "linear")) fail()
    layers[[length(layers) + 1L]] <- list(assay = application$output_assay_id,
      events = which(as.character(sample_of) %in% sample & pooled))
  }
  layers
}

.gatelabr_strategy_coordinates <- function(sce, gating, assay,
    sample_of = SummarizedExperiment::colData(sce)$sample_id, pooled = rep(TRUE, ncol(sce)), use_saved_layers = TRUE) {
  values <- SummarizedExperiment::assay(sce, assay)
  channels <- .gatelabr_channel_descriptors(sce)
  ids <- vapply(channels, `[[`, character(1), "id")
  display_assay <- identical(.gatelabr_assay_coordinate_space(sce, assay), "display")
  # Display assays are drawn directly; the browser can retain a parked linear-assay binding
  # while exprs is selected. An explicit assay argument likewise selects that assay itself.
  layers <- if (use_saved_layers && !display_assay)
    .gatelabr_strategy_compensated_layers(sce, gating$workspace, assay, sample_of, pooled) else list()
  cofactor <- .gatelabr_display_cofactor(sce)$cofactor
  specs <- gating$workspace$hostedChannelTransforms
  row_specs <- .gatelabr_rowdata_transforms(sce)
  names(row_specs) <- ids
  cache <- new.env(parent = emptyenv())
  spec <- function(channel) {
    stated <- specs[[channel]]
    if (is.null(stated)) stated <- row_specs[[channel]]
    if (is.null(stated) && display_assay) stated <- list(kind = "asinh", cofactor = cofactor)
    if (is.null(stated)) stop("No saved display transform for channel '", channel,
                              "' on linear assay '", assay, "'. Save the workspace in GateLabR again.", call. = FALSE)
    stated
  }
  transform <- function(channel) {
    if (is.null(cache[[channel]])) cache[[channel]] <- .gatelabr_strategy_transform(spec(channel))
    cache[[channel]]
  }
  raw <- function(channel) {
    index <- match(channel, ids)
    if (is.na(index)) stop("Channel '", channel, "' is not a row of assay '", assay, "'.", call. = FALSE)
    v <- as.numeric(values[index, ])
    for (layer in layers)
      v[layer$events] <- as.numeric(SummarizedExperiment::assay(sce, layer$assay)[index, layer$events])
    if (display_assay) cofactor * sinh(v) else v
  }
  list(raw = raw, display = function(channel) transform(channel)$forward(raw(channel)),
       spec = spec, transform = transform, display_assay = display_assay)
}

.gatelabr_strategy_gate_spec <- function(gate, channel, coordinates, instrument = NULL) {
  space <- gate$space
  if (is.null(space)) space <- if (coordinates$display_assay || identical(instrument, "cytof")) "display" else "raw"
  if (identical(space, "raw")) return(list(kind = "identity"))
  own <- gate$transforms[[channel]]
  if (is.null(own)) coordinates$spec(channel) else own
}

# A polygon bows when its saved straight edges are viewed through different transforms. Use
# the embedded core's polygonOutline tolerance and depth cap (plots/gatePayload.ts: 0.2% per
# axis, depth 15) for drawing only. An edge spanning raw values to R on arcsinh(x / c) takes
# about log2(R / c) + 3 halvings to trace: depth 9 left raw triangles over mass cytometry's
# ranges tens of times the tolerance off, and 15 reaches 100,000 at cofactor 5.
.gatelabr_strategy_polygon_outline <- function(vertices, mapped, to_display) {
  if (nrow(vertices) < 3L || any(colSums(is.finite(mapped)) < 3L)) return(mapped)
  spans <- apply(mapped, 2, function(x) diff(range(x[is.finite(x)])))
  if (all(spans <= 0)) return(mapped)
  spans[spans <= 0] <- Inf
  out <- list(mapped[1, ])
  edge <- function(a, b, t0 = 0, t1 = 1, depth = 0L) {
    at <- function(t) to_display(a + (b - a) * t)
    p0 <- at(t0); p1 <- at(t1); tm <- (t0 + t1) / 2
    # An inflection can put the midpoint on the chord while both halves bow away.
    off <- max(vapply(c(0.25, 0.5, 0.75), function(fraction) {
      point <- at(t0 + (t1 - t0) * fraction)
      sqrt(sum(((point - (p0 + (p1 - p0) * fraction)) / spans)^2))
    }, numeric(1)))
    if (depth >= 15L || !is.finite(off) || off <= 0.002) {
      out[[length(out) + 1L]] <<- p1
    } else {
      edge(a, b, t0, tm, depth + 1L)
      edge(a, b, tm, t1, depth + 1L)
    }
  }
  for (i in seq_len(nrow(vertices))) edge(vertices[i, ], vertices[if (i == nrow(vertices)) 1L else i + 1L, ])
  if (length(out) > nrow(vertices) + 1L) do.call(rbind, out) else mapped
}

# Map an outline without changing its saved geometry or the persisted population masks.
.gatelabr_strategy_gate_display <- function(gate, coordinates, instrument = NULL) {
  channels <- c(gate$x_channel, gate$y_channel)
  specs <- lapply(channels, function(ch) .gatelabr_strategy_gate_spec(gate, ch, coordinates, instrument))
  same <- vapply(1:2, function(i) isTRUE(all.equal(specs[[i]], coordinates$spec(channels[[i]]))), logical(1))
  maps <- lapply(1:2, function(i) {
    inverse <- .gatelabr_strategy_transform(specs[[i]])$inverse
    forward <- coordinates$transform(channels[[i]])$forward
    function(v) {
      raw <- inverse(v)
      # GateLab's unbounded sentinel is the largest finite double, not a table endpoint.
      unbounded <- !is.na(v) & abs(v) >= .Machine$double.xmax
      raw[unbounded] <- v[unbounded]
      beyond <- !is.na(raw) & abs(raw) >= .Machine$double.xmax
      raw[beyond] <- sign(raw[beyond]) * 1e12
      forward(raw)
    }
  })
  map_pair <- function(v) c(maps[[1]](v[[1]]), maps[[2]](v[[2]]))
  out <- gate
  if (!is.null(gate$center)) out$center <- map_pair(gate$center)
  if (!is.null(gate$vertices)) {
    vertices <- gate$vertices
    out$vertices <- cbind(maps[[1]](vertices[, 1]), maps[[2]](vertices[, 2]))
    if (gate$type %in% c("polygon", "ellipse") && !all(same))
      out$vertices <- .gatelabr_strategy_polygon_outline(vertices, out$vertices, map_pair)
    # Label offsets are already deltas in display units (engine/strategy.ts), not gate units.
  }
  out
}

.gatelabr_strategy_gate_membership <- function(gate, coordinates, instrument = NULL, quadrant = NA_integer_) {
  value <- function(channel) {
    transform <- .gatelabr_strategy_transform(.gatelabr_strategy_gate_spec(gate, channel, coordinates, instrument))
    transform$forward(coordinates$raw(channel))
  }
  out <- .gatelabr_strategy_in_gate(gate, value(gate$x_channel), value(gate$y_channel), quadrant)
  out[is.na(out)] <- FALSE
  out
}

# Return every distinct outline for an active-tree entry, with the events of the samples that
# use it. Population correspondence follows the same provenance as GatingSet write-back; gate
# correspondence follows source_gate_ids, so reordered references cannot select another gate.
.gatelabr_strategy_sample_gates <- function(sce, gating, coordinates, sample_of, pooled) {
  ws <- gating$workspace
  trees <- .gatelabr_workspace_trees(ws)
  samples <- sort(unique(as.character(sample_of[pooled])))
  entries <- if (is.list(ws$samples)) ws$samples else list()
  match_sample <- function(sample) {
    hit <- which(vapply(entries, function(entry) {
      id <- .gatelabr_scalar_or(entry$sampleId, "")
      identical(.gatelabr_scalar_or(entry$fileName, ""), sample) || identical(id, sample) || endsWith(id, paste0(":", sample))
    }, logical(1)))
    if (length(hit) == 1L) hit else NA_integer_
  }
  matched <- vapply(samples, match_sample, integer(1))
  if (isTRUE(ws$gating$perFileHierarchies) && anyNA(matched)) {
    stop("Cannot match saved sample-specific gates to: ", paste(samples[is.na(matched)], collapse = ", "),
         ". Use the sample names recorded by the workspace.", call. = FALSE)
  }
  sample_trees <- .gatelabr_workspace_sample_trees(ws, trees, samples)
  refs <- c(ws$gating$hierarchies, ws$gating$stored_hierarchies)
  source_gates <- function(tree) {
    for (ref in refs) if (identical(ref$id, tree) && !is.null(ref$source_gate_ids)) return(ref$source_gate_ids)
    list()
  }
  lineage <- function(tree, gate) {
    keys <- character(0)
    repeat {
      key <- paste(tree, gate, sep = "\r")
      if (key %in% keys || is.null(trees$trees[[tree]])) break
      keys <- c(keys, key)
      source <- trees$trees[[tree]]$source
      next_gate <- source_gates(tree)[[gate]]
      if (is.null(source) || is.null(next_gate)) break
      tree <- source; gate <- as.character(next_gate)
    }
    keys
  }
  population_source <- function(index, id) {
    source <- .gatelabr_workspace_sample_source(trees, sample_trees, index, id)
    if (is.null(source) || is.null(trees$trees[[source$tree]]$populations[[source$population]]))
      stop("No saved gate counterpart for population '", id, "' on sample '", samples[[index]],
           "'. Select samples whose trees contain this population.", call. = FALSE)
    population <- trees$trees[[source$tree]]$populations[[source$population]]
    parent <- trees$trees[[trees$active]]$populations[[id]]$parent_id
    if (!is.null(parent)) {
      own_parent <- .gatelabr_workspace_sample_source(trees, sample_trees, index, parent)
      if (is.null(own_parent) || !identical(population$parent_id, own_parent$population))
        stop("Sample-specific population '", id, "' on sample '", samples[[index]],
             "' has another parent; it cannot share this strategy panel.", call. = FALSE)
    }
    list(tree = source$tree, population = population)
  }
  reference <- function(ref) list(include = !identical(ref$include, FALSE),
                                  quadrant = if (is.null(ref$quadrant)) NA_integer_ else as.integer(ref$quadrant))
  function(entry) {
    groups <- list()
    signatures <- character(0)
    original <- lineage(trees$active, entry$gate$gate_id)
    for (index in seq_along(samples)) {
      source <- population_source(index, entry$population)
      tree <- trees$trees[[source$tree]]
      population <- source$population
      candidate_ids <- vapply(population$gate_refs, function(ref) as.character(ref$gate_id), character(1))
      matches <- candidate_ids[vapply(candidate_ids, function(id) any(lineage(source$tree, id) %in% original), logical(1))]
      matches <- unique(matches)
      if (length(matches) != 1L || is.null(tree$gates[[matches[[1]]]]))
        stop("Cannot match gate '", entry$gate$name, "' to sample '", samples[[index]], "' by its saved provenance.", call. = FALSE)
      gate <- .gatelabr_strategy_gate(tree$gates[[matches[[1]]]])
      own_refs <- Filter(function(ref) identical(ref$gate_id, matches[[1]]), population$gate_refs)
      own_reference <- lapply(own_refs, reference)
      single <- length(population$gate_refs) == 1L
      quadrants <- list()
      if (identical(gate$type, "quadrant")) {
        active <- trees$trees[[trees$active]]$populations
        siblings <- Filter(function(pop) identical(pop$parent_id, active[[entry$population]]$parent_id) &&
                             any(vapply(pop$gate_refs, function(ref) identical(ref$gate_id, entry$gate$gate_id), logical(1))), active)
        for (sibling in siblings) {
          own <- population_source(index, sibling$population_id)$population
          refs <- Filter(function(ref) identical(ref$gate_id, matches[[1]]), own$gate_refs)
          if (!length(refs))
            stop("Cannot match quadrant references for population '", sibling$population_id,
                 "' on sample '", samples[[index]], "'.", call. = FALSE)
          for (ref in refs) quadrants[[length(quadrants) + 1L]] <- c(reference(ref), list(
            population = sibling$population_id, name = sibling$name, single = length(own$gate_refs) == 1L))
        }
      }
      if (!identical(c(gate$x_channel, gate$y_channel), c(entry$gate$x_channel, entry$gate$y_channel)))
        stop("Sample-specific gate '", gate$name, "' uses another channel pair.", call. = FALSE)
      instrument <- if (!is.na(matched[[index]])) entries[[matched[[index]]]]$instrumentMode else NULL
      if (is.null(instrument)) instrument <- S4Vectors::metadata(sce)$instrument_type
      # Resolve legacy defaults once, on the sample that owns the gate. Downstream geometry
      # always has a stated space and both axis transforms.
      axes <- c(gate$x_channel, gate$y_channel)
      resolved <- lapply(axes, function(ch) .gatelabr_strategy_gate_spec(gate, ch, coordinates, instrument))
      names(resolved) <- axes
      gate$space <- "display"; gate$transforms <- resolved
      signature <- as.character(jsonlite::toJSON(list(
        gate = gate[setdiff(names(gate), c("gate_id", "name"))], references = own_reference,
        single = single, quadrants = quadrants),
                                                auto_unbox = TRUE, null = "null", digits = I(17)))
      at <- match(signature, signatures)
      if (is.na(at)) {
        at <- length(groups) + 1L
        groups[[at]] <- list(gate = gate, include = own_reference[[1]]$include, single = single,
                             quadrants = quadrants, samples = character(0), events = rep(FALSE, length(sample_of)))
        signatures <- c(signatures, signature)
      }
      groups[[at]]$samples <- c(groups[[at]]$samples, samples[[index]])
      groups[[at]]$events <- groups[[at]]$events | (as.character(sample_of) %in% samples[[index]] & pooled)
    }
    groups
  }
}
