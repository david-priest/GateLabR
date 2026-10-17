# gatingset_host.R -- the app served from a flowWorkspace GatingSet itself.
#
# A GatingSet keeps, per sample, a cytoframe on disk (one HDF5 file, opened lazily and read by
# column), each channel's transform with its parameters in C++, a compensation where one was
# applied, and a hierarchy of nodes, each a gate evaluated in the transformed space of its
# channels or a boolean of other nodes. Event data are not copied: the dataset the app sees
# is described from the object's own parts, each sample's values are read from its cytoframe one
# channel at a time when the app asks for them and put through the channel's inverse transform
# in R (gh_pop_get_data(inverse.transform = TRUE) would write a full temporary copy of the
# sample per call), the hierarchy reaches the app as JSON with every gate in the space it is
# evaluated in, and every write lands on the object's own parts: the record as a cytoframe
# keyword, populations as nodes, marker names as $PnS. The research the design rests on, and
# why the hierarchy is not sent as Gating-ML (CytoML cannot carry FlowJo's log or biexponential),
# is in the vault's `Coding/GateLab/GateLabR — GatingSet support (design, 2026-10-13).md`.

# 2 since tailored per-sample gates: a core reading 1 would give every sample the tree's gate.
.gatelabr_gatingset_hierarchy_contract_version <- 2L

# ── transforms ────────────────────────────────────────────────────────────────

# The raw transform parameters flowWorkspace keeps in C++ for each channel of a sample: by
# channel, a list with `type` and the parameters of that type (log: decade, offset, scale;
# logtGml2: t, m; fasinh: T, M, A, length; logicle: T, W, M, A; biexp: channelRange, maxValue,
# pos, neg, widthBasis; scale: scale_factor; lin and caltbl: none usable). This is what
# gh_get_transformations() builds its closures from; the closures hold the parameters for
# every kind but the biexponential, whose closure is a spline, which is why the raw list is read.
.gatelabr_gatingset_raw_transforms <- function(gs, sample = NULL) {
  if (is.null(sample)) sample <- flowWorkspace::sampleNames(gs)[[1]]
  reader <- tryCatch(
    get("cpp_getTransformations", envir = asNamespace("flowWorkspace")),
    error = function(...) NULL
  )
  if (!is.function(reader)) return(list())
  raw <- tryCatch(reader(gs@pointer, sample, inverse = FALSE), error = function(...) NULL)
  if (!is.list(raw) || is.null(names(raw))) return(list())
  raw <- raw[nzchar(names(raw))]
  scales <- .gatelabr_gatingset_logicle_scales(gs, sample, raw)
  for (channel in names(scales)) {
    if (is.character(scales[[channel]])) {
      raw[[channel]]$native_failure <- scales[[channel]]
    } else {
      raw[[channel]]$native_scale <- scales[[channel]]
    }
  }
  raw
}

# flowWorkspace 4.16 drops cytolib's isGml2 flag from its transform parameter accessor.
# Both logicle modes consequently return the same R forward/inverse closures, although
# native event and gate coordinates span M for legacy logicle and 1 for Gating-ML 2.
# Probe the stored C++ transforms on fresh one-event data. No original events, ranges,
# keywords or gates are written or inferred from their values. The temporary hierarchy does
# copy its membership indices; probe all logicle channels together once per sample, not
# separately for every channel or population.
#
# Returns, by logicle channel, its native scale (1 or M) or, where the probe cannot tell, the
# reason. A reason marks only that channel unsupported (.gatelabr_gatingset_axis): its nodes stay
# on the object, a gate the app draws on it is saved as its membership, and its values reach the
# app through flowWorkspace's own inverse, which reads the legacy scale.
.gatelabr_gatingset_logicle_scales <- function(gs, sample, raw) {
  channels <- names(raw)[vapply(raw, function(p) identical(p$type, "logicle"), logical(1))]
  if (!length(channels)) return(list())
  parameter <- function(name) vapply(raw[channels], function(p) {
    value <- suppressWarnings(as.numeric(p[[name]]))
    if (length(value) == 1L) value else NA_real_
  }, numeric(1))
  top <- parameter("T")
  decades <- parameter("M")
  valid <- is.finite(top) & top > 0 & is.finite(decades) & decades > 0
  result <- stats::setNames(as.list(rep("invalid logicle parameters", length(channels))), channels)
  if (!any(valid)) return(result)
  probed <- channels[valid]
  measured <- tryCatch(
    .gatelabr_gatingset_probe_logicle(gs, sample, probed, unname(top[valid])),
    error = function(cause) conditionMessage(cause)
  )
  if (is.character(measured)) {
    result[probed] <- measured
    return(result)
  }
  for (index in seq_along(probed)) {
    m <- unname(decades[valid][[index]])
    value <- measured[[index]]
    # cytolib stores event values as float32. Require one of the two documented native
    # conventions, which coincide when M is 1; do not accept arbitrary scaling or ambiguous
    # evidence.
    candidates <- unique(c(1, m))
    matches <- is.finite(value) & abs(value - candidates) <= 1e-6 * max(1, m)
    result[[probed[[index]]]] <- if (sum(matches) == 1L) candidates[matches] else {
      paste0("the native transform took T to ", format(value, digits = 7), ", neither 1 nor M")
    }
  }
  result
}

# The native transform's value at T for each channel, on a hierarchy cloned from the sample whose
# data are replaced by one event written to a directory of the probe's own, removed when the
# probe ends. The clone shares the object's data until they are replaced, and a native call on
# shared data would transform the object's own events, so the probe goes ahead only once the
# clone's cytoframe is that file. (Two reads of one cytoframe give different external pointers,
# so comparing pointers cannot tell.)
.gatelabr_gatingset_probe_logicle <- function(gs, sample, channels, top) {
  native_transform <- get0("gs_transform_data", envir = asNamespace("flowWorkspace"))
  if (!is.function(native_transform)) {
    stop("flowWorkspace's native transform accessor is unavailable", call. = FALSE)
  }
  directory <- tempfile("gatelabr-logicle-probe-")
  on.exit(unlink(directory, recursive = TRUE), add = TRUE)
  sentinel <- flowCore::flowSet(list(flowCore::flowFrame(
    matrix(top, nrow = 1L, dimnames = list(NULL, channels)))))
  flowCore::sampleNames(sentinel) <- sample
  data <- flowWorkspace::flowSet_to_cytoset(sentinel, path = directory, backend = "h5")
  probe <- flowWorkspace::gs_copy_tree_only(gs[sample])
  flowWorkspace::gs_cyto_data(probe) <- data
  frame <- flowWorkspace::gs_cyto_data(probe)[[sample]]
  uri <- flowWorkspace::cf_get_uri(frame)
  own <- length(uri) == 1L && !is.na(uri) && nzchar(uri) &&
    startsWith(normalizePath(uri, mustWork = FALSE),
               paste0(normalizePath(directory, mustWork = FALSE), .Platform$file.sep))
  if (!own || nrow(frame) != 1L || !identical(as.character(colnames(frame)), channels)) {
    stop("the probe's data were not isolated from the object's", call. = FALSE)
  }
  native_transform(probe@pointer)
  as.numeric(flowCore::exprs(flowWorkspace::gs_cyto_data(probe)[[sample]])[1L, ])
}

# How one channel's transformed values relate to a GateLab transform spec: the spec the app
# evaluates in, `forward` from the object's transformed values to that space and `backward` the
# other way (affine, the identity for most kinds), or `unsupported` with the reason. A channel
# the object does not transform is the linear value, with no spec.
#
# fasinh is `length * (asinh(x * sinh(M ln10) / T) + A ln10) / ((M + A) ln10)`, an affine
# function of GateLab's asinh at cofactor T / sinh(M ln10); FlowJo's log is GateLab's wsplog
# times its scale; native logicle is normalized or multiplied by M, depending on its mode.
# Gating-ML's logtGml2 (GateLab's standard flog) is the same function by parameters.
# So is the biexponential, provided the spec carries no
# `tableChannels` and says `spline`: GateLab then builds cytolib's own table at `channelRange`
# channels and evaluates it as R's natural cubic spline, which is the function flowWorkspace
# runs to the last digit (GateLab's biexSpline.test.ts checks it against R's coefficients);
# FlowJo's 4096-channel table, which `tableChannels` selects, differs by up to six channels in 256.
.gatelabr_gatingset_axis <- function(raw) {
  identity <- function(x) x
  linear <- list(spec = NULL, forward = identity, backward = identity)
  if (is.null(raw)) return(linear)
  if (!is.list(raw) || !is.character(raw$type) || length(raw$type) != 1L) {
    return(list(unsupported = "a transform of unknown kind"))
  }
  number <- function(name) {
    value <- suppressWarnings(as.numeric(raw[[name]]))
    if (length(value) == 1L && is.finite(value)) value else NULL
  }
  numbers <- function(...) {
    values <- lapply(c(...), number)
    names(values) <- c(...)
    if (any(vapply(values, is.null, logical(1)))) NULL else values
  }
  ln10 <- log(10)
  type <- raw$type
  malformed <- list(unsupported = paste0("a ", type, " transform with missing parameters"))
  if (identical(type, "logicle")) {
    if (is.character(raw$native_failure)) {
      return(list(unsupported = paste0(
        "a logicle transform whose native coordinate convention could not be determined (",
        raw$native_failure, ")")))
    }
    p <- numbers("T", "W", "M", "A")
    if (is.null(p) || p$M <= 0) return(malformed)
    scale <- number("native_scale")
    if (is.null(scale)) scale <- p$M
    legacy <- flowCore::logicleTransform(t = p$T, w = p$W, m = p$M, a = p$A)
    undo <- flowCore::inverseLogicleTransform(legacy)@.Data
    native <- legacy@.Data
    return(list(spec = list(kind = "logicle", T = p$T, W = p$W, M = p$M, A = p$A),
                forward = function(v) v / scale, backward = function(y) y * scale,
                transform = function(x) native(x) * scale / p$M,
                inverse = function(v) undo(v * p$M / scale)))
  }
  if (identical(type, "fasinh")) {
    p <- numbers("T", "M", "A", "length")
    if (is.null(p) || p$T <= 0 || p$M <= 0 || p$length <= 0 || p$M + p$A <= 0) return(malformed)
    k <- (p$M + p$A) * ln10 / p$length
    shift <- p$A * ln10
    return(list(spec = list(kind = "asinh", cofactor = p$T / sinh(p$M * ln10)),
                forward = function(v) v * k - shift,
                backward = function(y) (y + shift) / k))
  }
  if (identical(type, "log")) {
    p <- numbers("decade", "offset", "scale")
    if (is.null(p) || p$decade <= 0 || p$offset <= 0 || p$scale <= 0) return(malformed)
    return(list(spec = list(kind = "wsplog", offset = p$offset, decades = p$decade),
                forward = function(v) v / p$scale, backward = function(y) y * p$scale))
  }
  if (identical(type, "logtGml2")) {
    p <- numbers("t", "m")
    if (is.null(p) || p$t <= 0 || p$m <= 0) return(malformed)
    return(list(spec = list(kind = "flog", T = p$t, M = p$m, standard = TRUE),
                forward = identity, backward = identity))
  }
  if (identical(type, "biexp")) {
    p <- numbers("channelRange", "maxValue", "pos", "neg", "widthBasis")
    if (is.null(p)) return(malformed)
    return(list(spec = list(kind = "biex", maxValue = p$maxValue, pos = p$pos, neg = p$neg,
                            widthBasis = p$widthBasis, channelRange = p$channelRange, spline = TRUE),
                forward = identity, backward = identity))
  }
  if (identical(type, "scale")) {
    p <- numbers("scale_factor")
    if (is.null(p) || p$scale_factor == 0) return(malformed)
    return(list(spec = NULL, forward = function(v) v / p$scale_factor,
                backward = function(y) y * p$scale_factor))
  }
  if (identical(type, "lin")) return(linear)
  if (identical(type, "caltbl")) {
    return(list(unsupported = "a FlowJo calibration table, whose parameters the object does not hold"))
  }
  list(unsupported = paste0("a '", type, "' transform, which GateLabR does not map"))
}

# Every channel's axis (above), by channel name, with `transform`, the object's own function
# from linear values to its transformed values (NULL where it has none), which the write-back
# of a rectangle maps bounds through. Channels the object does not transform are linear. Read
# from one sample, the first unless `sample` names another: a GatingSet parsed from a FlowJo
# workspace keeps each sample's own transforms, so the hierarchy and the write-back read each
# sample's gates through that sample's axes, and the channel descriptors take the first's.
.gatelabr_gatingset_axes <- function(gs, channels, sample = NULL) {
  if (is.null(sample)) sample <- flowWorkspace::sampleNames(gs)[[1]]
  raw <- .gatelabr_gatingset_raw_transforms(gs, sample)
  transforms <- tryCatch(flowWorkspace::gh_get_transformations(gs[[sample]]), error = function(...) list())
  axes <- lapply(channels, function(channel) {
    axis <- .gatelabr_gatingset_axis(raw[[channel]])
    transform <- transforms[[channel]]
    if (!is.function(axis$transform)) axis$transform <- if (is.function(transform)) transform else NULL
    axis
  })
  names(axes) <- channels
  axes
}

# The channels of a GatingSet as its cytoframes name them: $PnN and, where set, $PnS.
.gatelabr_gatingset_channels <- function(gs) {
  frame <- flowWorkspace::gs_cyto_data(gs)[[1]]
  parameters <- flowCore::pData(flowCore::parameters(frame))
  # The columns come as AsIs; plain character, or identical() and names refuse them.
  pnn <- as.character(unclass(parameters$name))
  pns <- as.character(unclass(parameters$desc))
  pns[is.na(pns)] <- ""
  list(pnn = pnn, pns = pns)
}

# ── the dataset the app sees ──────────────────────────────────────────────────

# Per-launch state that is neither the object's nor the app's: the rowData revision the panel
# dialog guards its writes with. Keyed by the C++ object, which is what survives the R wrapper
# being copied.
.gatelabr_gatingset_states <- new.env(parent = emptyenv())

.gatelabr_gatingset_state <- function(gs) {
  key <- paste(utils::capture.output(print(gs@pointer)), collapse = "")
  state <- .gatelabr_gatingset_states[[key]]
  if (is.null(state)) {
    state <- new.env(parent = emptyenv())
    state$rowdata_revision <- 0
    .gatelabr_gatingset_states[[key]] <- state
  }
  state
}

.gatelabr_gatingset_event_counts <- function(gs) {
  samples <- flowWorkspace::sampleNames(gs)
  frames <- flowWorkspace::gs_cyto_data(gs)
  counts <- vapply(samples, function(sample) as.integer(nrow(frames[[sample]])), integer(1))
  names(counts) <- samples
  counts
}

# The samples as a partition of the events in sample order, in the form the SCE host's
# membership assembler takes: global event indices per sample, and a descriptor per sample.
.gatelabr_gatingset_partition <- function(gs, include_metadata = TRUE) {
  samples <- flowWorkspace::sampleNames(gs)
  counts <- .gatelabr_gatingset_event_counts(gs)
  channel_count <- length(.gatelabr_gatingset_channels(gs)$pnn)
  offsets <- cumsum(c(0L, counts[-length(counts)]))
  pd <- flowWorkspace::pData(gs)
  fields <- setdiff(colnames(pd), "name")
  descriptors <- lapply(seq_along(samples), function(index) {
    metadata <- list()
    if (include_metadata) {
      for (field in fields) {
        value <- pd[[field]][[match(samples[[index]], rownames(pd))]]
        if (length(value) != 1L || is.na(value)) next
        metadata[[field]] <- .gatelabr_host_scalar(value)
      }
    }
    list(
      id = samples[[index]],
      label = samples[[index]],
      eventCount = unname(counts[[index]]),
      metadata = metadata,
      assayByteLength = as.double(channel_count) * as.double(counts[[index]]) * 4,
      eventIndexEncoding = "uint32-le",
      eventIndexByteLength = as.double(counts[[index]]) * 4
    )
  })
  list(
    column = NULL,
    levels = samples,
    event_indices = lapply(seq_along(samples), function(index) {
      offsets[[index]] + seq_len(counts[[index]])
    }),
    samples = descriptors
  )
}

# flow unless the channels read as mass cytometry; an arcsinh at a small cofactor on most
# channels is the same evidence the SCE host takes from a CATALYST object's transform_type.
.gatelabr_gatingset_instrument <- function(channels, axes) {
  scores <- lapply(list(channels$pnn, channels$pns[nzchar(channels$pns)]),
                   .gatelabr_instrument_channel_evidence)
  cytof_score <- max(vapply(scores, `[[`, numeric(1), "cytof"), 0)
  flow_score <- max(vapply(scores, `[[`, numeric(1), "flow"), 0)
  specs <- Filter(Negate(is.null), lapply(axes, `[[`, "spec"))
  arcsinh_small <- vapply(specs, function(spec) {
    identical(spec$kind, "asinh") && spec$cofactor <= 10
  }, logical(1))
  if (length(specs) > 0L && mean(arcsinh_small) >= 0.5) cytof_score <- cytof_score + 3
  if (any(vapply(specs, function(spec) identical(spec$kind, "logicle"), logical(1)))) {
    flow_score <- flow_score + 3
  }
  if (cytof_score > flow_score && cytof_score >= 3) return("cytof")
  if (flow_score > cytof_score && flow_score >= 3) return("flow")
  "unknown"
}

# The matrix flowWorkspace applied, in the form the app's descriptor states one: rows the source
# channels, columns the receivers. NULL when none was applied. The launch note names it; the
# descriptor does not carry it (below).
.gatelabr_gatingset_compensation_matrix <- function(gs) {
  compensation <- tryCatch(flowWorkspace::gh_get_compensations(gs[[1]]), error = function(...) NULL)
  if (is.null(compensation)) return(NULL)
  spillover <- compensation@spillover
  if (!is.matrix(spillover) || nrow(spillover) == 0L || is.null(colnames(spillover))) return(NULL)
  receivers <- colnames(spillover)
  sources <- if (is.null(rownames(spillover))) receivers else rownames(spillover)
  list(
    kind = "flow-spillover",
    name = "the GatingSet's compensation (flowWorkspace::gh_get_compensations)",
    sourceChannels = I(sources),
    receiverChannels = I(receivers),
    matrix = lapply(seq_len(nrow(spillover)), function(row) I(unname(spillover[row, ])))
  )
}

.gatelabr_gatingset_compensated <- function(gs) {
  !is.null(tryCatch(flowWorkspace::gh_get_compensations(gs[[1]]), error = function(...) NULL))
}

# What the launch says of the object's compensation.
.gatelabr_gatingset_compensation_note <- function(gs) {
  if (!.gatelabr_gatingset_compensated(gs)) return("no compensation applied")
  matrix <- .gatelabr_gatingset_compensation_matrix(gs)
  channels <- if (is.null(matrix)) character() else as.character(matrix$sourceChannels)
  paste0(
    "compensated by flowWorkspace",
    if (length(channels)) paste0(" (", length(channels), " x ", length(channels), " spillover over ",
                                 paste(channels, collapse = ", "), ")") else "",
    "; the app is not given the matrix, which it would apply to these values a second time"
  )
}

# The dataset descriptor the SCE host sends, built from the object's parts. One assay: the
# values flowWorkspace holds, put back to linear, named for what they are.
.gatelabr_gatingset_dataset_descriptor <- function(
    gs,
    dataset_id = "gatelabr-gatingset",
    label = dataset_id,
    partition = NULL) {
  .gatelabr_require_gatingset_support()
  if (length(flowWorkspace::sampleNames(gs)) == 0L) {
    stop("The GatingSet holds no samples.", call. = FALSE)
  }
  channels <- .gatelabr_gatingset_channels(gs)
  axes <- .gatelabr_gatingset_axes(gs, channels$pnn)
  if (is.null(partition)) partition <- .gatelabr_gatingset_partition(gs)
  descriptors <- lapply(seq_along(channels$pnn), function(index) {
    pnn <- channels$pnn[[index]]
    pns <- channels$pns[[index]]
    descriptor <- list(id = pnn, label = if (nzchar(pns)) pns else pnn, pnn = pnn)
    if (nzchar(pns)) descriptor$pns <- pns
    spec <- axes[[pnn]]$spec
    if (!is.null(spec)) descriptor$transform <- spec
    descriptor
  })
  assay_id <- if (.gatelabr_gatingset_compensated(gs)) "compensated" else "counts"
  pd <- flowWorkspace::pData(gs)
  fields <- setdiff(colnames(pd), "name")
  categorical <- list()
  for (field in fields) {
    levels <- .gatelabr_categorical_levels(pd[[field]])
    if (is.null(levels)) next
    categorical[[length(categorical) + 1L]] <- list(name = field, levelCount = length(levels))
  }
  descriptor <- list(
    contractVersion = .gatelabr_dataset_contract_version,
    id = dataset_id,
    label = as.character(label),
    instrument = .gatelabr_gatingset_instrument(channels, axes),
    eventCount = sum(.gatelabr_gatingset_event_counts(gs)),
    channels = descriptors,
    assays = list(list(
      id = assay_id,
      label = assay_id,
      role = assay_id,
      coordinateSpace = "linear",
      # The compensated assay the app installs from an apply carries revision 1 (above).
      revision = if (identical(assay_id, "compensated")) 1L else 0L,
      encoding = "channel-major-float32-le"
    )),
    defaultAssayId = assay_id,
    samples = partition$samples,
    colDataColumns = I(fields),
    colDataCategorical = categorical,
    rowDataRevision = .gatelabr_gatingset_state(gs)$rowdata_revision
  )
  # The applied matrix is not sent as compensationMatrix. The app installs a hosted flow matrix as
  # each sample's own spillover (host/hostedSample.ts) and then applies it by itself to the values
  # served, which flowWorkspace has compensated already: the header's "Compensated · this session"
  # showed every event compensated twice, and Save to GatingSet wrote those memberships to the
  # hierarchy. The launch note states the matrix instead.
  descriptor
}

# ── the data, served on request ───────────────────────────────────────────────

# One sample's values for the app: each channel read from the cytoframe on its own and put
# through the channel's inverse transform, written as the channel-major float32 stream the
# SCE host writes. The sample is never held whole in R.
.gatelabr_write_gatingset_assay_payload <- function(gs, sample, channels, path) {
  frame <- flowWorkspace::gs_cyto_data(gs)[[sample]]
  inverse <- flowWorkspace::gh_get_transformations(gs[[sample]], inverse = TRUE)
  axes <- .gatelabr_gatingset_axes(gs, channels, sample)
  event_count <- nrow(frame)
  connection <- file(path, open = "wb")
  on.exit(close(connection), add = TRUE)
  for (channel in channels) {
    values <- as.numeric(flowCore::exprs(frame[, channel, drop = FALSE])[, 1L])
    undo <- axes[[channel]]$inverse
    if (!is.function(undo)) undo <- inverse[[channel]]
    if (is.function(undo)) values <- undo(values)
    writeBin(values, connection, size = 4L, endian = "little")
  }
  close(connection)
  on.exit(NULL, add = FALSE)
  expected_size <- as.double(length(channels)) * as.double(event_count) * 4
  actual_size <- as.double(file.info(path)$size)
  if (!identical(actual_size, expected_size)) {
    stop(sprintf("Assay payload has %.0f bytes; expected %.0f.", actual_size, expected_size),
         call. = FALSE)
  }
  invisible(path)
}

.gatelabr_register_gatingset_assay_resource <- function(session, resource_name, gs, sample, channels) {
  session$registerDataObj(
    resource_name,
    data = list(gs = gs, sample = sample, channels = channels),
    filterFunc = function(data, request) {
      if (!identical(request$REQUEST_METHOD, "GET")) {
        return(shiny::httpResponse(
          status = 405L, content_type = "text/plain", content = "Method not allowed",
          headers = list(Allow = "GET")
        ))
      }
      path <- tempfile(fileext = ".f32")
      tryCatch(
        {
          .gatelabr_write_gatingset_assay_payload(data$gs, data$sample, data$channels, path)
          .gatelabr_binary_file_response(path)
        },
        error = function(cause) {
          if (file.exists(path)) unlink(path)
          shiny::httpResponse(
            status = 500L, content_type = "text/plain", content = conditionMessage(cause),
            headers = list(`Cache-Control` = "no-store")
          )
        }
      )
    }
  )
}

# ── the hierarchy, for the app ────────────────────────────────────────────────

# A bound of a flowCore rectangle for the JSON: an infinite bound is no bound.
.gatelabr_gatingset_bound <- function(value) {
  if (length(value) != 1L || !is.finite(value)) NA_real_ else as.numeric(value)
}

# Map a bound through an affine axis map, keeping an open bound open.
.gatelabr_gatingset_map_bound <- function(value, map) {
  if (is.na(value)) return(NA_real_)
  map(value)
}

# The text of a booleanFilter, as flowWorkspace stores it: a single symbol such as
# `rect&!ell` over node names. Space beside an operator is layout and goes; space inside a term
# is part of a node's name ("T cells") and stays, where it used to be removed with the rest and
# the term then named no node.
.gatelabr_gatingset_boolean_text <- function(gate) {
  expr <- tryCatch(gate@expr, error = function(...) NULL)
  if (is.null(expr) || length(expr) == 0L) return("")
  text <- tryCatch(paste(deparse(expr[[1]]), collapse = ""), error = function(...) "")
  text <- gsub("`", "", text, fixed = TRUE)
  text <- gsub("[[:space:]]*([&|!()])[[:space:]]*", "\\1", text)
  trimws(text)
}

# A node flowWorkspace holds as fixed event indices (gs_pop_add() given logical vectors: what
# Save to GatingSet writes for a population no gate can carry, and what the colData export
# writes). Its gate reads as a booleanFilter whose expression is `rep(TRUE, ...)`.
.gatelabr_gatingset_is_indices_gate <- function(gate) {
  methods::is(gate, "booleanFilter") &&
    startsWith(.gatelabr_gatingset_boolean_text(gate), "rep(TRUE")
}

# The node a boolean term names, as a full path. cytolib stores a term as a path relative to
# the root without its leading slash (`debris`, `debris-/CD45/dead`), so that is tried first;
# then a path as written, a path under the boolean's own parent, the one node of that name,
# the one path ending in it; else NULL (unknown or ambiguous).
.gatelabr_gatingset_resolve_term <- function(term, paths, parent = "root") {
  term <- gsub("^[\"']|[\"']$", "", term)
  if (startsWith(term, "/")) return(if (term %in% paths) term else NULL)
  from_root <- paste0("/", term)
  if (from_root %in% paths) return(from_root)
  if (!identical(parent, "root")) {
    under_parent <- paste0(parent, "/", term)
    if (under_parent %in% paths) return(under_parent)
  }
  by_name <- paths[basename(paths) == term]
  if (length(by_name) == 1L) return(by_name)
  by_suffix <- paths[endsWith(paths, paste0("/", term))]
  if (length(by_suffix) == 1L) return(by_suffix)
  NULL
}

# A boolean node as the app's contract has it: an operator and references by path, or the
# reason it cannot be described.
.gatelabr_gatingset_boolean_node <- function(gate, paths, parent = "root") {
  text <- .gatelabr_gatingset_boolean_text(gate)
  if (!nzchar(text)) return(list(unsupported = "a boolean with no expression"))
  if (.gatelabr_gatingset_is_indices_gate(gate)) {
    return(list(unsupported = paste0("a node holding fixed event indices (a membership written ",
                                     "from GateLab or R), which GateLab cannot redraw as a gate")))
  }
  if (grepl("[()]", text)) {
    return(list(unsupported = paste0("a boolean with grouping (", text, "), which GateLab does not hold")))
  }
  has_and <- grepl("&", text, fixed = TRUE)
  has_or <- grepl("|", text, fixed = TRUE)
  if (has_and && has_or) {
    return(list(unsupported = paste0("a boolean mixing & and | (", text, ")")))
  }
  operator <- if (has_or) "or" else "and"
  terms <- strsplit(text, if (has_or) "|" else "&", fixed = TRUE)[[1]]
  refs <- list()
  for (term in terms) {
    include <- !startsWith(term, "!")
    name <- sub("^!+", "", term)
    if (!nzchar(name)) return(list(unsupported = paste0("a boolean with an empty term (", text, ")")))
    path <- .gatelabr_gatingset_resolve_term(name, paths, parent)
    if (is.null(path)) {
      return(list(unsupported = paste0("a boolean naming '", name, "', which is not one node of the hierarchy")))
    }
    refs[[length(refs) + 1L]] <- list(path = path, include = include)
  }
  list(operator = operator, refs = refs)
}

# A geometric gate as the app's contract has it, with its geometry mapped into the space of
# each axis's spec, or the reason it cannot be described.
.gatelabr_gatingset_gate_node <- function(gate, axes) {
  parameters <- as.character(flowCore::parameters(gate))
  if (length(parameters) < 1L || length(parameters) > 2L) {
    return(list(unsupported = paste0("a gate on ", length(parameters), " channels")))
  }
  # A channel the dataset lacks is one the app has no events on; it leaves the node out by that
  # reason, and so does the host, so that what the app holds is what the host says it sent.
  absent <- setdiff(parameters, names(axes))
  if (length(absent)) {
    return(list(unsupported = paste0("on channel '", absent[[1]], "', which the dataset does not have")))
  }
  axis_of <- lapply(parameters, function(channel) axes[[channel]])
  for (index in seq_along(parameters)) {
    if (!is.null(axis_of[[index]]$unsupported)) {
      return(list(unsupported = paste0(parameters[[index]], " is on ", axis_of[[index]]$unsupported)))
    }
  }
  axes_json <- lapply(seq_along(parameters), function(index) {
    spec <- axis_of[[index]]$spec
    list(channel = parameters[[index]], transform = if (is.null(spec)) NA else spec)
  })
  maps <- lapply(axis_of, `[[`, "forward")
  if (methods::is(gate, "rectangleGate")) {
    minimum <- vapply(seq_along(parameters), function(index) {
      .gatelabr_gatingset_map_bound(.gatelabr_gatingset_bound(gate@min[[index]]), maps[[index]])
    }, numeric(1))
    maximum <- vapply(seq_along(parameters), function(index) {
      .gatelabr_gatingset_map_bound(.gatelabr_gatingset_bound(gate@max[[index]]), maps[[index]])
    }, numeric(1))
    return(list(kind = "rectangle", axes = axes_json, min = I(minimum), max = I(maximum)))
  }
  if (length(parameters) != 2L) {
    return(list(unsupported = paste0("a ", class(gate)[[1]], " on one channel")))
  }
  if (methods::is(gate, "polygonGate")) {
    vertices <- gate@boundaries
    if (!is.matrix(vertices) || nrow(vertices) < 3L || any(!is.finite(vertices))) {
      return(list(unsupported = "a polygon with fewer than three finite vertices"))
    }
    vertices <- vertices[, parameters, drop = FALSE]
    mapped <- cbind(maps[[1]](vertices[, 1L]), maps[[2]](vertices[, 2L]))
    dimnames(mapped) <- NULL
    return(list(kind = "polygon", axes = axes_json, vertices = mapped))
  }
  if (methods::is(gate, "ellipsoidGate")) {
    mean <- as.numeric(gate@mean[parameters])
    covariance <- gate@cov[parameters, parameters]
    distance <- as.numeric(gate@distance)
    if (any(!is.finite(mean)) || any(!is.finite(covariance)) || !is.finite(distance) || distance <= 0) {
      return(list(unsupported = "an ellipse with non-finite parameters"))
    }
    # An affine map y = a v + b moves the mean through the map and scales the covariance by
    # the slopes.
    slopes <- vapply(maps, function(map) map(1) - map(0), numeric(1))
    scaled <- diag(slopes) %*% covariance %*% diag(slopes)
    dimnames(scaled) <- NULL
    return(list(
      kind = "ellipse", axes = axes_json,
      mean = I(c(maps[[1]](mean[[1]]), maps[[2]](mean[[2]]))),
      covariance = scaled, distance = distance
    ))
  }
  list(unsupported = paste0("a ", class(gate)[[1]], ", which GateLab has no gate for"))
}

# flowWorkspace holds a quadGate as four rectangle children with one finite bound per axis,
# sharing the two cuts. Among the children of one parent, the sets of four such siblings on
# the same channels and cuts are quadrant sets; each is one quadrant gate for the app, its
# members numbered as the app numbers quadrants (1 = x-/y+, 2 = x+/y+, 3 = x+/y-, 4 = x-/y-).
# A negated rectangle is no quadrant.
.gatelabr_gatingset_quadrant_sets <- function(nodes) {
  sets <- list()
  candidates <- Filter(function(node) {
    gate <- node$gate
    !isTRUE(node$negated) && methods::is(gate, "rectangleGate") && length(gate@min) == 2L &&
      all(xor(is.finite(gate@min), is.finite(gate@max)))
  }, nodes)
  for (node in candidates) {
    gate <- node$gate
    parameters <- as.character(flowCore::parameters(gate))
    cuts <- ifelse(is.finite(gate@min), gate@min, gate@max)
    key <- paste(node$parent, parameters[[1]], parameters[[2]], format(cuts[[1]], digits = 15),
                 format(cuts[[2]], digits = 15), sep = "\t")
    positive <- is.finite(gate@min)
    quadrant <- if (!positive[[1]] && positive[[2]]) 1L else if (positive[[1]] && positive[[2]]) 2L else
      if (positive[[1]] && !positive[[2]]) 3L else 4L
    entry <- sets[[key]]
    if (is.null(entry)) {
      entry <- list(parent = node$parent, channels = parameters, center = cuts, members = list())
    }
    entry$members[[length(entry$members) + 1L]] <- list(path = node$path, name = node$name, quadrant = quadrant)
    sets[[key]] <- entry
  }
  complete <- Filter(function(set) {
    quadrants <- vapply(set$members, `[[`, integer(1), "quadrant")
    length(quadrants) == 4L && setequal(quadrants, 1:4)
  }, sets)
  unname(complete)
}

# What a quadrant set is apart from where its cuts lie: its parent, channels and members.
.gatelabr_gatingset_quadrant_signature <- function(set) {
  members <- vapply(set$members, function(member) paste(member$path, member$quadrant), character(1))
  paste(c(set$parent, set$channels, sort(members)), collapse = "\t")
}

# Which of a node's per-sample descriptions the tree takes: the one most samples hold, the
# earliest sample's on a tie; and the samples whose own differs from it, which become their
# tailoring in the app.
.gatelabr_gatingset_reference <- function(bodies) {
  count <- length(bodies)
  group <- seq_len(count)
  for (index in seq_len(count)) {
    for (earlier in seq_len(index - 1L)) {
      if (group[[earlier]] == earlier && identical(bodies[[index]], bodies[[earlier]])) {
        group[[index]] <- earlier
        break
      }
    }
  }
  reference <- which.max(tabulate(group, count))
  list(index = reference, differing = which(group != reference))
}

# One reason for a node from its per-sample reasons (NA where the sample's is fine): the reason
# as it stands when every sample gives it, else the first, naming its sample.
.gatelabr_gatingset_sample_reason <- function(reasons, samples) {
  failing <- which(!is.na(reasons))
  if (length(failing) == 0L) return(NULL)
  if (length(failing) == length(reasons) && length(unique(reasons)) == 1L) return(reasons[[1]])
  paste0(reasons[[failing[[1]]]], " (on sample '", samples[[failing[[1]]]], "')")
}

# The hierarchy as the app's contract has it (hostedHierarchy.ts): nodes in the object's order
# with a gate in the space of its axes or a boolean over node paths, and what could not be
# described, each with its reason. NULL when the object has no node.
#
# Every node is read on every sample, since a FlowJo workspace tailors gates per sample and a
# GatingSet keeps each sample's own. The tree takes the gate most samples hold; a sample whose
# gate differs carries it as `tailored`, and the app gives that sample a tailored copy of the
# tree with it. A node no form can carry on some sample is left out with the sample named.
#
# The host leaves out by itself everything the app would drop (an OR, a boolean naming a node
# left out or a node without a gate of its own, a NOT of an AND of several nodes, a node under
# one left out), so that the nodes described are exactly the nodes the app holds: the paths
# are the result's "received" attribute, which the write-back uses to tell a node the user
# deleted in the app from one the app never had, which it keeps.
.gatelabr_gatingset_hierarchy_payload <- function(gs, axes = NULL) {
  paths <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  if (length(paths) == 0L) return(NULL)
  samples <- flowWorkspace::sampleNames(gs)
  channels <- .gatelabr_gatingset_channels(gs)$pnn
  axes_of <- lapply(samples, function(sample) {
    if (is.null(axes)) .gatelabr_gatingset_axes(gs, channels, sample) else axes
  })
  hierarchies <- lapply(samples, function(sample) gs[[sample]])
  read <- function(value) tryCatch(value, error = function(...) NULL)
  nodes <- lapply(paths, function(path) {
    parent <- flowWorkspace::gs_pop_get_parent(gs, path)
    list(
      path = path,
      name = basename(path),
      parent = if (identical(parent, "root") || !nzchar(parent)) "root" else parent,
      gates = lapply(hierarchies, function(gh) read(flowWorkspace::gh_pop_get_gate(gh, path))),
      negated = vapply(hierarchies, function(gh) isTRUE(read(flowWorkspace::gh_pop_is_negated(gh, path))), logical(1)),
      boolean = vapply(hierarchies, function(gh) isTRUE(read(flowWorkspace::gh_pop_is_bool_gate(gh, path))), logical(1))
    )
  })
  # A quadrant set is one where its four rectangles form one on every sample.
  sets_on <- lapply(seq_along(samples), function(index) {
    .gatelabr_gatingset_quadrant_sets(lapply(nodes, function(node) {
      list(path = node$path, name = node$name, parent = node$parent,
           gate = node$gates[[index]], negated = node$negated[[index]])
    }))
  })
  signatures_on <- lapply(sets_on, function(sets) vapply(sets, .gatelabr_gatingset_quadrant_signature, character(1)))
  quadrant_sets <- Filter(function(set) {
    signature <- .gatelabr_gatingset_quadrant_signature(set)
    all(vapply(signatures_on, function(signatures) signature %in% signatures, logical(1)))
  }, sets_on[[1]])
  member_paths <- unlist(lapply(quadrant_sets, function(set) vapply(set$members, `[[`, character(1), "path")))

  described <- list()
  left_out <- list()
  left <- character(0)
  with_gate <- character(0)
  received <- character(0)
  emitted_sets <- character(0)
  describe <- function(path, name, parent, body) {
    described[[length(described) + 1L]] <<- c(list(path = path, name = name, parent = parent), body)
  }
  leave <- function(path, reason) {
    left <<- c(left, path)
    left_out[[length(left_out) + 1L]] <<- list(path = path, reason = reason)
  }
  tailoring <- function(bodies, reference) {
    lapply(reference$differing, function(index) list(sample = samples[[index]], gate = bodies[[index]]))
  }
  for (node in nodes) {
    if (!identical(node$parent, "root") && node$parent %in% left) {
      leave(node$path, paste0("under '", node$parent, "', which was left out"))
      next
    }
    if (node$path %in% member_paths) {
      set <- Find(function(set) node$path %in% vapply(set$members, `[[`, character(1), "path"), quadrant_sets)
      set_name <- paste0(paste(set$channels, collapse = " x "), " quadrants")
      set_path <- if (identical(set$parent, "root")) paste0("/", set_name) else paste0(set$parent, "/", set_name)
      if (set_path %in% emitted_sets) next
      emitted_sets <- c(emitted_sets, set_path)
      signature <- .gatelabr_gatingset_quadrant_signature(set)
      bodies <- lapply(seq_along(samples), function(index) {
        own <- sets_on[[index]][[match(signature, signatures_on[[index]])]]
        body <- .gatelabr_gatingset_gate_node(node$gates[[index]], axes_of[[index]])
        if (!is.null(body$unsupported)) return(body)
        maps <- lapply(own$channels, function(channel) {
          axis <- axes_of[[index]][[channel]]
          if (is.null(axis) || is.null(axis$forward)) function(x) x else axis$forward
        })
        list(kind = "quadrant", axes = body$axes,
             center = I(c(maps[[1]](own$center[[1]]), maps[[2]](own$center[[2]]))),
             members = set$members)
      })
      reason <- .gatelabr_gatingset_sample_reason(
        vapply(bodies, function(body) if (is.null(body$unsupported)) NA_character_ else body$unsupported, character(1)),
        samples
      )
      if (!is.null(reason)) {
        for (member in set$members) leave(member$path, reason)
        next
      }
      reference <- .gatelabr_gatingset_reference(bodies)
      body <- list(gate = bodies[[reference$index]])
      if (length(reference$differing)) body$tailored <- tailoring(bodies, reference)
      describe(set_path, basename(set_path), set$parent, body)
      members <- vapply(set$members, `[[`, character(1), "path")
      with_gate <- c(with_gate, members)
      received <- c(received, members)
      next
    }
    if (any(node$boolean)) {
      if (!all(node$boolean)) {
        leave(node$path, "a boolean on some samples and a gate on others")
        next
      }
      bodies <- lapply(seq_along(samples), function(index) {
        .gatelabr_gatingset_boolean_node(node$gates[[index]], paths, node$parent)
      })
      reason <- .gatelabr_gatingset_sample_reason(
        vapply(bodies, function(body) if (is.null(body$unsupported)) NA_character_ else body$unsupported, character(1)),
        samples
      )
      if (!is.null(reason)) {
        leave(node$path, reason)
        next
      }
      if (length(unique(node$negated)) > 1L ||
          !all(vapply(bodies, identical, logical(1), bodies[[1]]))) {
        leave(node$path, "a boolean that differs between samples")
        next
      }
      body <- bodies[[1]]
      negated <- node$negated[[1]]
      if (identical(body$operator, "or")) {
        leave(node$path, "an OR of other nodes, which GateLab does not hold")
        next
      }
      # NOT (A AND B) is NOT A OR NOT B, an OR; a population of excluded gates is AND NOT each.
      if (negated && length(body$refs) > 1L) {
        leave(node$path, "a NOT of an AND of several nodes, which a GateLab population cannot hold")
        next
      }
      unresolved <- NULL
      for (ref in body$refs) {
        if (ref$path %in% left) {
          unresolved <- paste0("names '", ref$path, "', which was left out")
        } else if (!ref$path %in% with_gate) {
          unresolved <- paste0("names '", ref$path, "', which has no gate of its own")
        }
        if (!is.null(unresolved)) break
      }
      if (!is.null(unresolved)) {
        leave(node$path, unresolved)
        next
      }
      describe(node$path, node$name, node$parent, list(negated = negated, boolean = body))
      received <- c(received, node$path)
      next
    }
    unread <- vapply(node$gates, is.null, logical(1))
    if (any(unread)) {
      leave(node$path, .gatelabr_gatingset_sample_reason(
        ifelse(unread, "a node whose gate could not be read", NA_character_), samples))
      next
    }
    if (length(unique(node$negated)) > 1L) {
      leave(node$path, "negated on some samples and not on others")
      next
    }
    bodies <- lapply(seq_along(samples), function(index) {
      .gatelabr_gatingset_gate_node(node$gates[[index]], axes_of[[index]])
    })
    reason <- .gatelabr_gatingset_sample_reason(
      vapply(bodies, function(body) if (is.null(body$unsupported)) NA_character_ else body$unsupported, character(1)),
      samples
    )
    if (!is.null(reason)) {
      leave(node$path, reason)
      next
    }
    reference <- .gatelabr_gatingset_reference(bodies)
    body <- list(negated = node$negated[[1]], gate = bodies[[reference$index]])
    if (length(reference$differing)) body$tailored <- tailoring(bodies, reference)
    describe(node$path, node$name, node$parent, body)
    with_gate <- c(with_gate, node$path)
    received <- c(received, node$path)
  }
  payload <- list(
    contractVersion = .gatelabr_gatingset_hierarchy_contract_version,
    nodes = described,
    leftOut = left_out
  )
  attr(payload, "received") <- received
  payload
}

# The workspace envelope for a GatingSet: GateLab's own record when the object holds one,
# else the hierarchy for the app to translate, else nothing.
.gatelabr_gatingset_workspace_envelope <- function(gs, dataset_id) {
  record <- .gatelabr_gatingset_record(gs)
  if (!is.null(record)) {
    return(list(
      contractVersion = .gatelabr_workspace_contract_version,
      datasetId = dataset_id,
      sourceFormat = "gatelab-workspace",
      revision = as.integer(record$revision),
      workspaceJson = as.character(record$workspace_json)
    ))
  }
  payload <- .gatelabr_gatingset_hierarchy_payload(gs)
  if (is.null(payload)) return(NULL)
  # The nodes the app is given, which the first write keeps in the record (store_workspace):
  # a node among them the app's tree later lacks was deleted there; any other is kept.
  state <- .gatelabr_gatingset_state(gs)
  state$received <- attr(payload, "received")
  attr(payload, "received") <- NULL
  list(
    contractVersion = .gatelabr_workspace_contract_version,
    datasetId = dataset_id,
    sourceFormat = "gatingset-hierarchy",
    revision = 0L,
    workspaceJson = as.character(jsonlite::toJSON(
      payload, auto_unbox = TRUE, null = "null", na = "null", digits = NA, matrix = "rowmajor"
    ))
  )
}

# ── the manifest ──────────────────────────────────────────────────────────────

# What .gatelabr_register_host_manifest() does for a GatingSet: the descriptor from the
# object's parts, one lazy assay resource and one event-index resource per sample, the
# envelope above, and the application behind the compensated values when the app applied it.
.gatelabr_register_gatingset_manifest <- function(
    session,
    gs,
    dataset_id = "gatelabr-gatingset",
    label = dataset_id,
    message_type = "gatelabr-host-manifest") {
  partition <- .gatelabr_gatingset_partition(gs)
  descriptor <- .gatelabr_gatingset_dataset_descriptor(gs, dataset_id = dataset_id, label = label,
                                                       partition = partition)
  channels <- vapply(descriptor$channels, `[[`, character(1), "id")
  assay_id <- descriptor$defaultAssayId
  resources <- lapply(seq_along(descriptor$samples), function(index) {
    sample <- descriptor$samples[[index]]
    prefix <- paste0("gatelabr-gs-", index, "-", substr(gsub("[^A-Za-z0-9]", "", dataset_id), 1L, 24L))
    assay_url <- .gatelabr_register_gatingset_assay_resource(
      session, paste0(prefix, "-assay"), gs, sample$id, channels
    )
    event_url <- .gatelabr_register_event_index_resource(
      session, paste0(prefix, "-events"), partition$event_indices[[index]]
    )
    list(
      datasetId = dataset_id,
      sampleId = sample$id,
      eventIndexUrl = event_url,
      assayUrls = stats::setNames(list(assay_url), assay_id)
    )
  })
  manifest <- list(
    contractVersion = .gatelabr_dataset_contract_version,
    datasets = list(descriptor),
    resources = resources,
    workspace = .gatelabr_gatingset_workspace_envelope(gs, dataset_id),
    compensationApplications = .gatelabr_gatingset_compensation_applications(gs, dataset_id)
  )
  session$sendCustomMessage(message_type, manifest)
  invisible(manifest)
}

# ── requests ──────────────────────────────────────────────────────────────────

.gatelabr_gatingset_workspace_json_check <- function(workspace_json) {
  if (!is.character(workspace_json) || length(workspace_json) != 1L ||
      is.na(workspace_json) || !nzchar(workspace_json)) {
    stop("workspaceJson must be one non-empty JSON string.", call. = FALSE)
  }
  parsed <- tryCatch(
    jsonlite::fromJSON(workspace_json, simplifyVector = FALSE),
    error = function(cause) {
      stop("GateLab supplied unreadable workspace JSON: ", conditionMessage(cause), call. = FALSE)
    }
  )
  if (!is.list(parsed) || !identical(parsed$format, "gatelab-workspace")) {
    stop("GateLab supplied an unsupported workspace format.", call. = FALSE)
  }
  version <- parsed$version
  if (!is.numeric(version) || length(version) != 1L || is.na(version) || !version %in% c(2, 3, 4)) {
    stop("GateLabR can store GateLab workspace versions 2, 3 and 4 only.", call. = FALSE)
  }
  parsed
}

# Store the workspace as the object's record and, on an explicit save that brought
# memberships, write the active tree's populations to the hierarchy.
.gatelabr_gatingset_store_workspace <- function(
    gs,
    dataset_id,
    expected_revision,
    client_revision,
    reason,
    workspace_json,
    writer_id = NULL,
    memberships = NULL) {
  expected_revision <- suppressWarnings(as.integer(expected_revision))
  client_revision <- suppressWarnings(as.integer(client_revision))
  if (length(expected_revision) != 1L || is.na(expected_revision) || expected_revision < 0L) {
    stop("expectedRevision must be a non-negative integer.", call. = FALSE)
  }
  if (length(client_revision) != 1L || is.na(client_revision) || client_revision < 0L) {
    stop("clientRevision must be a non-negative integer.", call. = FALSE)
  }
  if (!identical(reason, "autosave") && !identical(reason, "explicit")) {
    stop("Workspace write reason must be 'autosave' or 'explicit'.", call. = FALSE)
  }
  writer_id <- as.character(writer_id)
  writer_id <- if (length(writer_id) == 1L && !is.na(writer_id) && nzchar(writer_id)) writer_id else NA_character_
  current <- .gatelabr_gatingset_record(gs)
  current_revision <- if (is.null(current)) 0L else as.integer(current$revision)
  if (!identical(expected_revision, current_revision)) {
    stored_writer <- if (is.list(current) && is.character(current$writer_id) &&
                         length(current$writer_id) == 1L) current$writer_id else NA_character_
    stop(.gatelabr_revision_conflict(expected_revision, current_revision, stored_writer))
  }
  parsed <- .gatelabr_gatingset_workspace_json_check(workspace_json)
  channels <- .gatelabr_gatingset_channels(gs)$pnn
  absent <- .gatelabr_gates_on_absent_channels(.gatelabr_workspace_gate_records(parsed), channels)
  revision <- current_revision + 1L
  saved_at <- format(Sys.time(), "%Y-%m-%dT%H:%M:%OS3%z", tz = "UTC")
  record <- list(
    format = "gatelab-gatingset-workspace",
    version = 1L,
    revision = revision,
    client_revision = client_revision,
    writer_id = writer_id,
    saved_at = saved_at,
    reason = reason,
    dataset_id = dataset_id,
    channel_ids = channels,
    event_count = sum(.gatelabr_gatingset_event_counts(gs)),
    workspace_json = workspace_json,
    hierarchy_written = isTRUE(current$hierarchy_written),
    hierarchy_revision = if (is.null(current$hierarchy_revision)) NA_integer_ else as.integer(current$hierarchy_revision),
    # Since the per-sample fix: the record's tree came from a hierarchy read on every sample.
    hierarchy_contract = .gatelabr_gatingset_hierarchy_contract_version
  )
  # Which nodes are the app's (gatingset.R, .gatelabr_gatingset_owned): those an earlier save
  # wrote, by population, and until a save has written them, those the app was given at opening.
  received <- if (is.null(current)) .gatelabr_gatingset_state(gs)$received else current$received_nodes
  if (!is.null(current$nodes)) record$nodes <- current$nodes
  if (!is.null(received) && is.null(current$nodes)) record$received_nodes <- I(as.character(unlist(received)))
  if (!is.null(current) && is.null(current$hierarchy_contract)) record$hierarchy_contract <- NULL
  .gatelabr_gatingset_store_record(gs, record)
  result <- list(revision = revision, clientRevision = client_revision, savedAt = saved_at)
  report <- NULL
  if (!is.null(memberships)) {
    report <- .gatelabr_gatingset_write_populations(
      gs, parsed, memberships, record = current,
      received = if (is.null(current)) .gatelabr_gatingset_state(gs)$received else NULL
    )
    record$hierarchy_written <- TRUE
    record$hierarchy_revision <- revision
    record$nodes <- report$nodes
    record$received_nodes <- NULL
    .gatelabr_gatingset_store_record(gs, record)
    result$memberships <- list(hierarchies = report$hierarchies, populations = report$populations)
    notes <- .gatelabr_gatingset_write_notes(report)
    if (length(notes)) result$notes <- I(notes)
  }
  if (nrow(absent)) {
    result$gatesOnAbsentChannels <- lapply(seq_len(nrow(absent)), function(index) {
      list(gateId = absent$gate_id[[index]], name = absent$name[[index]], channels = I(absent$channels[[index]]))
    })
  }
  list(sce = gs, result = result, absent_gates = absent, report = report)
}

# The colData export dialog, on a GatingSet: each chosen population becomes a node under the
# root named by the column name, holding the events GateLab computed. A GatingSet has no
# per-event column, and the app's text says so under this host.
.gatelabr_gatingset_write_columns <- function(gs, workspace_revision, columns, overwrite = FALSE) {
  current <- .gatelabr_gatingset_record(gs)
  current_revision <- if (is.null(current)) 0L else as.integer(current$revision)
  workspace_revision <- suppressWarnings(as.integer(workspace_revision))
  if (length(workspace_revision) != 1L || is.na(workspace_revision) ||
      !identical(workspace_revision, current_revision)) {
    stop("Population memberships do not match the workspace revision stored in the GatingSet.",
         call. = FALSE)
  }
  if (!is.list(columns) || length(columns) == 0L) {
    stop("Select at least one population to export.", call. = FALSE)
  }
  partition <- .gatelabr_gatingset_partition(gs, include_metadata = FALSE)
  samples <- partition$levels
  existing <- basename(flowWorkspace::gs_pop_get_children(gs, "root"))
  prepared <- lapply(columns, function(column) {
    if (!is.list(column)) stop("A colData export entry is malformed.", call. = FALSE)
    name <- gsub("/", "-", as.character(column$columnName), fixed = TRUE)
    population_id <- as.character(column$populationId)
    population_name <- as.character(column$populationName)
    if (length(name) != 1L || is.na(name) || !nzchar(trimws(name)) ||
        length(population_id) != 1L || length(population_name) != 1L) {
      stop("Population export names must be non-empty strings.", call. = FALSE)
    }
    if (name %in% existing && !isTRUE(overwrite)) {
      stop("The GatingSet's hierarchy already has a node '", name,
           "'. Enable overwrite or choose another name.", call. = FALSE)
    }
    membership <- .gatelabr_assemble_membership(column$sampleMasks, partition, samples, population_name)
    list(name = name, population_id = population_id,
         masks = lapply(partition$event_indices, function(rows) membership[rows] %in% TRUE))
  })
  names_written <- vapply(prepared, `[[`, character(1), "name")
  if (anyDuplicated(names_written)) {
    stop("Each exported population needs a unique node name.", call. = FALSE)
  }
  for (entry in prepared) {
    if (entry$name %in% existing) flowWorkspace::gs_pop_remove(gs, paste0("/", entry$name))
    masks <- stats::setNames(entry$masks, samples)
    flowWorkspace::gs_pop_add(gs, masks, parent = "root", name = entry$name)
  }
  flowWorkspace::recompute(gs)
  list(
    sce = gs,
    result = list(columns = lapply(prepared, function(entry) {
      list(columnName = entry$name, populationId = entry$population_id,
           memberCount = sum(vapply(entry$masks, sum, numeric(1))))
    }))
  )
}

# A pData column for "Colour by": one value per sample, so one constant code per sample. cytolib
# keeps pData as text, so every column is categorical, a number put there included.
.gatelabr_gatingset_read_categorical <- function(gs, column_name) {
  column_name <- as.character(column_name)
  if (length(column_name) != 1L || is.na(column_name) || !nzchar(column_name)) {
    stop("A pData column name is required.", call. = FALSE)
  }
  pd <- flowWorkspace::pData(gs)
  if (!column_name %in% colnames(pd) || identical(column_name, "name")) {
    stop("pData has no column '", column_name, "'.", call. = FALSE)
  }
  values <- pd[[column_name]]
  levels <- .gatelabr_categorical_levels(values)
  if (is.null(levels)) {
    stop("pData column '", column_name, "' cannot colour a plot: it must be a factor, ",
         "character or logical column with at most 254 levels.", call. = FALSE)
  }
  codes <- match(as.character(values), levels) - 1L
  codes[is.na(codes)] <- 255L
  samples <- flowWorkspace::sampleNames(gs)
  counts <- .gatelabr_gatingset_event_counts(gs)
  sample_values <- lapply(seq_along(samples), function(index) {
    list(
      sampleId = samples[[index]],
      eventCount = unname(counts[[index]]),
      constantCode = codes[[match(samples[[index]], rownames(pd))]]
    )
  })
  list(sce = gs, result = list(columnName = column_name, levels = I(levels), sampleValues = sample_values))
}

# The panel dialog, on a GatingSet: display names become the object's marker names ($PnS).
.gatelabr_gatingset_write_labels <- function(gs, expected_revision, changes) {
  state <- .gatelabr_gatingset_state(gs)
  current_revision <- state$rowdata_revision
  expected_revision <- suppressWarnings(as.numeric(expected_revision))
  if (length(expected_revision) != 1L || !is.finite(expected_revision) ||
      !identical(expected_revision, current_revision)) {
    stop("Panel labels do not match the GatingSet's current marker names; reopen the dialog.",
         call. = FALSE)
  }
  if (!is.list(changes) || length(changes) == 0L) {
    stop("Select at least one panel label to write.", call. = FALSE)
  }
  channels <- .gatelabr_gatingset_channels(gs)
  prepared <- lapply(changes, function(change) {
    if (!is.list(change) || !is.character(change$channelId) || length(change$channelId) != 1L ||
        is.na(change$channelId) || !is.character(change$label) || length(change$label) != 1L ||
        is.na(change$label)) {
      stop("A panel-label write entry is malformed.", call. = FALSE)
    }
    if (!change$channelId %in% channels$pnn) {
      stop("Panel label targets unknown channel '", change$channelId, "'.", call. = FALSE)
    }
    label <- trimws(change$label)
    if (nchar(label, type = "chars") > 1024L) {
      stop("Panel labels cannot exceed 1024 characters.", call. = FALSE)
    }
    if (!nzchar(label)) {
      stop("A GatingSet's marker name cannot be cleared from the app; use markernames<- in R.",
           call. = FALSE)
    }
    list(channel = change$channelId, label = label)
  })
  supplied <- vapply(prepared, `[[`, character(1), "channel")
  if (anyDuplicated(supplied)) stop("Each panel channel may be written only once.", call. = FALSE)
  current <- channels$pns[match(supplied, channels$pnn)]
  labels <- vapply(prepared, `[[`, character(1), "label")
  changed <- labels != current
  if (any(changed)) {
    names(labels) <- supplied
    flowWorkspace::markernames(gs) <- labels[changed]
    state$rowdata_revision <- current_revision + 1
  }
  list(
    sce = gs,
    result = list(revision = state$rowdata_revision, changedChannelIds = unname(supplied[changed]))
  )
}

# ── compensation, in place ────────────────────────────────────────────────────

.gatelabr_gatingset_compensation_keyword <- "GATELAB_COMPENSATION"

# Why a matrix cannot be applied to this GatingSet from the app, or NULL when it can. A
# GatingSet is compensated by flowWorkspace in place, before any transform, and cannot be
# uncompensated, so only an uncompensated, untransformed object takes one.
.gatelabr_gatingset_compensation_refusal <- function(gs) {
  if (.gatelabr_gatingset_compensated(gs)) {
    return(paste0(
      "The GatingSet is compensated already, and flowWorkspace cannot uncompensate it; the ",
      "values the app is served carry its matrix already."
    ))
  }
  if (length(flowWorkspace::gh_get_transformations(gs[[1]])) > 0L) {
    return(paste0(
      "The GatingSet is transformed, and compensation precedes transformation: compensate it ",
      "in R before transforming (flowWorkspace::compensate(gs, spillover), then transform())."
    ))
  }
  NULL
}

# The compensation applied or adopted from the app, kept as a keyword on every sample as the
# workspace is, so that save_gs() keeps it and a reopened object reports it to the app.
.gatelabr_gatingset_compensation_record <- function(gs) {
  frame <- flowWorkspace::gs_cyto_data(gs)[[1]]
  text <- flowWorkspace::keyword(frame)[[.gatelabr_gatingset_compensation_keyword]]
  if (!is.character(text) || length(text) != 1L || is.na(text) || !nzchar(text)) return(NULL)
  record <- tryCatch(jsonlite::fromJSON(text, simplifyVector = TRUE), error = function(...) NULL)
  if (!is.list(record) || !is.character(record$profile_json)) return(NULL)
  record
}

.gatelabr_gatingset_store_compensation_record <- function(gs, record) {
  text <- as.character(jsonlite::toJSON(record, auto_unbox = TRUE, null = "null", na = "null", digits = NA))
  frames <- flowWorkspace::gs_cyto_data(gs)
  for (index in seq_along(frames)) {
    frame <- frames[[index]]
    if (.gatelabr_gatingset_compensation_keyword %in% names(flowWorkspace::keyword(frame))) {
      flowWorkspace::cf_keyword_set(frame, .gatelabr_gatingset_compensation_keyword, text)
    } else {
      flowWorkspace::cf_keyword_insert(frame, .gatelabr_gatingset_compensation_keyword, text)
    }
  }
  invisible(gs)
}

# The application as the app's contract describes one (compensationContract.ts). The output
# assay is the object's one assay once it is compensated.
.gatelabr_gatingset_application_descriptor <- function(record, dataset_id, execution = record$execution) {
  list(
    contractVersion = .gatelabr_host_compensation_contract_version,
    datasetId = dataset_id,
    profileJson = record$profile_json,
    sourceAssayId = as.character(record$source_assay_id),
    execution = if (identical(execution, "computed")) "computed" else "adopted-existing-assay",
    outputAssay = list(
      id = "compensated", label = "compensated", role = "compensated",
      coordinateSpace = "linear", revision = 1L, encoding = "channel-major-float32-le"
    ),
    targetSampleIds = I(as.character(record$target_sample_ids)),
    activeSampleIds = I(as.character(record$active_sample_ids)),
    appliedAt = as.character(record$applied_at)
  )
}

# What the manifest reports: the application behind the object's compensated values, when the
# app applied or adopted it, so a reopened workspace restores its compensated layer from the
# object's own values. Nothing when the object was compensated in R only.
.gatelabr_gatingset_compensation_applications <- function(gs, dataset_id) {
  record <- .gatelabr_gatingset_compensation_record(gs)
  if (is.null(record) || !.gatelabr_gatingset_compensated(gs)) return(list())
  list(.gatelabr_gatingset_application_descriptor(record, dataset_id, execution = "adopted-existing-assay"))
}

# One lazy resource per sample serving the object's compensated values under the output assay.
.gatelabr_register_gatingset_compensation_targets <- function(session, gs, dataset_id) {
  if (is.null(session)) return(list())
  samples <- flowWorkspace::sampleNames(gs)
  counts <- .gatelabr_gatingset_event_counts(gs)
  channels <- .gatelabr_gatingset_channels(gs)$pnn
  lapply(seq_along(samples), function(index) {
    name <- paste0("gatelabr-gs-comp-", index, "-", substr(gsub("[^A-Za-z0-9]", "", dataset_id), 1L, 24L))
    list(
      sampleId = samples[[index]],
      eventCount = unname(counts[[index]]),
      assayUrl = .gatelabr_register_gatingset_assay_resource(session, name, gs, samples[[index]], channels)
    )
  })
}

# The samples a request names, checked against the object's. A GatingSet is compensated as
# one object, so every sample is a target whatever the request named; the active ones are the
# samples the app asked to show compensated.
.gatelabr_gatingset_compensation_targets <- function(gs, targets) {
  samples <- flowWorkspace::sampleNames(gs)
  if (!is.list(targets) || length(targets) == 0L) {
    stop("Compensation needs at least one sample.", call. = FALSE)
  }
  named <- vapply(targets, function(target) as.character(target$sampleId), character(1))
  unknown <- setdiff(named, samples)
  if (length(unknown)) {
    stop("A compensation target is not a sample of the GatingSet: ", paste(unknown, collapse = ", "), ".",
         call. = FALSE)
  }
  active <- unique(named[vapply(targets, function(target) identical(target$activeLayer, "compensated"), logical(1))])
  list(samples = samples, active = active)
}

# Apply a spillover matrix to the object in place, with flowWorkspace::compensate(), which is
# what a GatingSet user does in R. After it the object's one assay is `compensated`; the
# uncompensated values are gone from the object, as they are after compensate() at the prompt.
.gatelabr_gatingset_compensate <- function(gs, dataset_id, profile_json, targets, session = NULL) {
  validated <- .gatelabr_validate_host_compensation_profile(profile_json, purpose = "apply")
  scientific <- validated$profile$scientific
  if (!identical(scientific$kind, "flow-spillover")) {
    stop(
      "A GatingSet is compensated by flowWorkspace, which inverts a spillover matrix; the NNLS ",
      "solve the app uses for mass cytometry has no in-place form. Compensate the object in R ",
      "before launching.",
      call. = FALSE
    )
  }
  refusal <- .gatelabr_gatingset_compensation_refusal(gs)
  if (!is.null(refusal)) stop(refusal, call. = FALSE)
  spill <- validated$matrix$matrix
  channels <- .gatelabr_gatingset_channels(gs)$pnn
  missing <- setdiff(rownames(spill), channels)
  if (length(missing)) {
    stop("The matrix names channels the GatingSet does not have: ", paste(missing, collapse = ", "), ".",
         call. = FALSE)
  }
  # Square, in source order: flowCore's spillover has one name set on both axes.
  spill <- spill[, rownames(spill), drop = FALSE]
  chosen <- .gatelabr_gatingset_compensation_targets(gs, targets)
  tryCatch(
    {
      # flowWorkspace::compensate() records the matrix on the hierarchy before it writes the
      # values, so on a read-only object it fails with the matrix recorded and the values
      # unchanged, and the object then reads as compensated (and survives save_gs() so). One
      # value written back through a view of each sample meets the same read-only guard first.
      for (sample in flowWorkspace::sampleNames(gs)) {
        frame <- flowWorkspace::gs_cyto_data(gs)[[sample]]
        if (nrow(frame) == 0L) next
        probe <- frame[1, 1]
        flowCore::exprs(probe) <- flowCore::exprs(probe)
      }
      flowWorkspace::compensate(gs, spill)
    },
    error = function(cause) {
      message <- conditionMessage(cause)
      if (grepl("read-only", message, ignore.case = TRUE)) {
        stop(
          "The GatingSet's data are read-only, as load_gs() opens them, so the matrix cannot be ",
          "applied in place. Compensate in R before launching (flowWorkspace::compensate(gs, ",
          "spillover) on a GatingSet built from the files, or one opened with load_gs(path, ",
          "backend_readonly = FALSE)).",
          call. = FALSE
        )
      }
      stop(message, call. = FALSE)
    }
  )
  record <- list(
    format = "gatelab-gatingset-compensation",
    version = 1L,
    profile_json = validated$profile_json,
    source_assay_id = "counts",
    execution = "computed",
    applied_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%OS3%z", tz = "UTC"),
    target_sample_ids = chosen$samples,
    active_sample_ids = chosen$active
  )
  .gatelabr_gatingset_store_compensation_record(gs, record)
  list(
    sce = gs,
    result = list(
      application = .gatelabr_gatingset_application_descriptor(record, dataset_id, execution = "computed"),
      targets = .gatelabr_register_gatingset_compensation_targets(session, gs, dataset_id)
    )
  )
}

# Record the profile behind a GatingSet's existing compensation, as the SCE host adopts an
# existing assay: provenance only, no value changes.
.gatelabr_gatingset_adopt_compensation <- function(gs, dataset_id, profile_json, output_assay_id, targets, session = NULL) {
  validated <- .gatelabr_validate_host_compensation_profile(profile_json, purpose = "adopt")
  if (!.gatelabr_gatingset_compensated(gs)) {
    stop("The GatingSet carries no compensation to adopt a profile for.", call. = FALSE)
  }
  if (!identical(as.character(output_assay_id), "compensated")) {
    stop("A GatingSet's compensated values are its assay `compensated`.", call. = FALSE)
  }
  chosen <- .gatelabr_gatingset_compensation_targets(gs, targets)
  record <- list(
    format = "gatelab-gatingset-compensation",
    version = 1L,
    profile_json = validated$profile_json,
    source_assay_id = "compensated",
    execution = "adopted-existing-assay",
    applied_at = format(Sys.time(), "%Y-%m-%dT%H:%M:%OS3%z", tz = "UTC"),
    target_sample_ids = chosen$samples,
    active_sample_ids = chosen$active
  )
  .gatelabr_gatingset_store_compensation_record(gs, record)
  list(
    sce = gs,
    result = list(
      application = .gatelabr_gatingset_application_descriptor(record, dataset_id, execution = "adopted-existing-assay"),
      targets = .gatelabr_register_gatingset_compensation_targets(session, gs, dataset_id)
    )
  )
}

# What .gatelabr_handle_host_request() does for a GatingSet.
.gatelabr_handle_gatingset_request <- function(gs, request, dataset_id, session = NULL) {
  payload <- request$payload
  operation <- request$operation
  contract <- function(expected, what) {
    version <- suppressWarnings(as.integer(payload$contractVersion))
    if (length(version) != 1L || is.na(version) || !identical(version, expected)) {
      stop("GateLab supplied an incompatible ", what, " contract.", call. = FALSE)
    }
  }
  if (identical(operation, "write-workspace")) {
    return(.gatelabr_gatingset_store_workspace(
      gs, dataset_id = dataset_id,
      expected_revision = payload$expectedRevision, client_revision = payload$clientRevision,
      reason = payload$reason, workspace_json = payload$workspaceJson,
      writer_id = payload$writerId, memberships = payload$memberships
    ))
  }
  if (identical(operation, "write-coldata")) {
    contract(.gatelabr_coldata_contract_version, "colData")
    return(.gatelabr_gatingset_write_columns(
      gs, workspace_revision = payload$workspaceRevision, columns = payload$columns,
      overwrite = payload$overwrite
    ))
  }
  if (identical(operation, "read-categorical-coldata")) {
    contract(.gatelabr_coldata_contract_version, "colData")
    return(.gatelabr_gatingset_read_categorical(gs, payload$columnName))
  }
  if (identical(operation, "write-categorical-coldata")) {
    contract(.gatelabr_coldata_contract_version, "categorical colData")
    stop("A GatingSet holds no per-event columns; populations are written to its hierarchy ",
         "by Save to GatingSet.", call. = FALSE)
  }
  if (identical(operation, "write-rowdata-labels")) {
    contract(.gatelabr_rowdata_contract_version, "rowData")
    return(.gatelabr_gatingset_write_labels(gs, payload$expectedRevision, payload$changes))
  }
  if (identical(operation, "apply-compensation")) {
    contract(.gatelabr_host_compensation_contract_version, "compensation")
    return(.gatelabr_gatingset_compensate(
      gs, dataset_id = dataset_id, profile_json = payload$profileJson, targets = payload$targets,
      session = session
    ))
  }
  if (identical(operation, "adopt-compensated-assay")) {
    contract(.gatelabr_host_compensation_contract_version, "compensation")
    return(.gatelabr_gatingset_adopt_compensation(
      gs, dataset_id = dataset_id, profile_json = payload$profileJson,
      output_assay_id = payload$outputAssayId, targets = payload$targets, session = session
    ))
  }
  stop("Unsupported GateLab host operation '", operation, "'.", call. = FALSE)
}

# ── what the console is told ──────────────────────────────────────────────────

# What the launch says about the object: its samples and events, the transforms the app's
# axes take from it, the compensation it carries, and the nodes the app opens with.
.gatelabr_gatingset_launch_note <- function(gs) {
  counts <- .gatelabr_gatingset_event_counts(gs)
  channels <- .gatelabr_gatingset_channels(gs)
  axes <- .gatelabr_gatingset_axes(gs, channels$pnn)
  kinds <- vapply(axes, function(axis) {
    if (!is.null(axis$unsupported)) "unsupported" else if (is.null(axis$spec)) "linear" else axis$spec$kind
  }, character(1))
  transformed <- kinds[kinds != "linear"]
  # Each unmapped channel by its reason, which the hierarchy note's left-out nodes repeat.
  reasons <- vapply(axes[kinds == "unsupported"], `[[`, character(1), "unsupported")
  unmapped <- paste0(" (", paste(vapply(unique(reasons), function(reason) {
    paste0(paste(names(reasons)[reasons == reason], collapse = ", "), ": ", reason)
  }, character(1)), collapse = "; "), ")")
  transform_text <- if (length(transformed) == 0L) {
    "no transform (the app's axes are its own)"
  } else {
    paste(vapply(unique(transformed), function(kind) {
      paste0(sum(transformed == kind), " ", switch(kind,
        logicle = "logicle", asinh = "arcsinh", wsplog = "FlowJo log", flog = "Gating-ML log",
        biex = "biexponential", unsupported = paste0("unmapped", unmapped), kind))
    }, character(1)), collapse = ", ")
  }
  nodes <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  paste0(
    "  ", length(counts), " sample", if (length(counts) == 1L) "" else "s", ", ",
    format(sum(counts), big.mark = ","), " events, ", length(channels$pnn), " channels; ",
    "transforms: ", transform_text, "; ",
    .gatelabr_gatingset_compensation_note(gs),
    "; ", length(nodes), " node", if (length(nodes) == 1L) "" else "s", " in the hierarchy",
    if (length(nodes)) .gatelabr_gatingset_hierarchy_note(gs) else ""
  )
}

# What the launch says of the hierarchy: how the app opens it, which nodes carry a gate of their
# own on some samples (they open as those samples' tailoring), and which the app does not hold,
# which every save keeps as they are.
.gatelabr_gatingset_hierarchy_note <- function(gs) {
  payload <- tryCatch(.gatelabr_gatingset_hierarchy_payload(gs), error = function(...) NULL)
  if (is.null(payload)) return("")
  describe <- function(entries) {
    paste(vapply(entries, function(entry) paste0(entry$path, " (", entry$reason, ")"), character(1)), collapse = "; ")
  }
  tailored <- Filter(function(node) length(node$tailored) > 0L, payload$nodes)
  per_sample <- table(unlist(lapply(tailored, function(node) vapply(node$tailored, `[[`, character(1), "sample"))))
  tailoring <- if (length(tailored)) {
    paste0(
      " (", length(tailored), " with a gate of their own on some samples, opened as those samples' tailoring: ",
      paste(paste(names(per_sample), as.integer(per_sample)), collapse = ", "), ")"
    )
  } else {
    ""
  }
  record <- .gatelabr_gatingset_record(gs)
  if (is.null(record)) {
    return(paste0(
      ", opened as the app's gates", tailoring,
      if (length(payload$leftOut)) paste0("; not opened, and kept on the object at every save: ",
                                          describe(payload$leftOut)) else ""
    ))
  }
  parsed <- tryCatch(jsonlite::fromJSON(record$workspace_json, simplifyVector = FALSE), error = function(...) NULL)
  owned <- tryCatch(.gatelabr_gatingset_owned(gs, parsed, record), error = function(...) NULL)
  existing <- setdiff(flowWorkspace::gs_get_pop_paths(gs, path = "full"), "root")
  unowned <- if (is.null(owned)) character(0) else setdiff(existing, owned)
  roots <- unowned[!vapply(unowned, function(path) {
    parent <- flowWorkspace::gs_pop_get_parent(gs, path)
    parent %in% unowned
  }, logical(1))]
  reasons <- stats::setNames(vapply(payload$leftOut, `[[`, character(1), "reason"),
                             vapply(payload$leftOut, `[[`, character(1), "path"))
  kept <- lapply(roots, function(path) {
    list(path = path, reason = if (path %in% names(reasons)) reasons[[path]] else "not in the app's workspace")
  })
  paste0(
    "; the app opens the GateLab workspace kept on the object (revision ", record$revision, ")",
    if (length(kept)) paste0("; not in it, and kept on the object at every save: ", describe(kept)) else "",
    # A record GateLabR 1.6.1 wrote from the hierarchy gave every sample the first sample's gate.
    if (is.null(record$hierarchy_contract) && length(tailored)) {
      paste0(
        ". That workspace was saved by GateLabR 1.6.1, which opened every sample on the first ",
        "sample's gates; ", length(tailored), " node", if (length(tailored) == 1L) "" else "s",
        " carry other gates on some samples (", paste(vapply(tailored, `[[`, character(1), "path"), collapse = ", "),
        "), so the app's counts there are not the object's. flowWorkspace::gs_keyword_delete(gs, ",
        "\"GATELAB_WORKSPACE\") before launching reopens it from the object's own gates, without ",
        "the GateLab workspace"
      )
    } else {
      ""
    }
  )
}

# The nodes a save kept although the app does not hold them, and those it could not keep,
# each with its reason: what the console and the app's status line say after the save.
.gatelabr_gatingset_write_notes <- function(report) {
  describe <- function(entries) {
    paste(vapply(entries, function(entry) paste0(entry$path, " (", entry$reason, ")"), character(1)), collapse = "; ")
  }
  notes <- character(0)
  if (length(report$kept_nodes)) {
    count <- length(report$kept_nodes)
    notes <- c(notes, paste0(
      "Kept ", count, " node", if (count == 1L) "" else "s", " the app does not hold, with ",
      if (count == 1L) "its" else "their", " subtree", if (count == 1L) "" else "s", " as ",
      if (count == 1L) "it was" else "they were", ": ", describe(report$kept_nodes), "."
    ))
  }
  if (length(report$lost)) {
    count <- length(report$lost)
    notes <- c(notes, paste0(
      "Removed ", count, " node", if (count == 1L) "" else "s", " the app does not hold: ",
      describe(report$lost), "."
    ))
  }
  notes
}

# What the console is told after Save to GatingSet wrote the hierarchy.
.gatelabr_gatingset_write_report <- function(report, name) {
  written <- length(report$gates) + length(report$masks) + length(report$kept)
  count <- function(values, one, many) paste0(length(values), " ", if (length(values) == 1L) one else many)
  paste0(
    "GateLabR wrote ", written, " population", if (written == 1L) "" else "s",
    " to the hierarchy of `", name, "`: ",
    if (length(report$kept)) paste0(length(report$kept), " unchanged and left as ",
                                    if (length(report$kept) == 1L) "it was" else "they were", ", ") else "",
    length(report$gates), " as flowWorkspace gates, ", length(report$masks), " as exact memberships",
    if (length(report$replaced)) {
      paste0(" (", paste(report$replaced, collapse = ", "),
             " as memberships, since the gate written selected other events)")
    } else {
      ""
    },
    if (length(report$tailored)) paste0("; ", length(report$tailored), " hold", if (length(report$tailored) == 1L) "s" else "",
                                        " a gate of ", if (length(report$tailored) == 1L) "its" else "their",
                                        " own on some samples") else "",
    if (length(report$removed)) paste0("; removed ", count(report$removed, "node", "nodes"),
                                       " the app's tree no longer has (", paste(report$removed, collapse = ", "), ")") else "",
    ". ", paste(c(.gatelabr_gatingset_write_notes(report), "save_gs() keeps them."), collapse = " ")
  )
}
