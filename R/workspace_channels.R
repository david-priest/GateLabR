# A gate names its channels by the SCE's channel ids, which are its rownames made unique
# (.gatelabr_channel_descriptors). A row renamed after a save, as `rownames(sce)[i] <- "..."`
# renames one, leaves every gate on that row naming a channel the object no longer has. The core
# gates such a gate as matching no event. GateLabR refused every later save of the workspace,
# naming only the gate's id, so nothing drawn in that session reached the object.
#
# A save is now never refused over a gate's channels: the workspace is stored, and the gates on
# channels the object lacks are named. At launch, a row renamed since the save is recognised from
# the channel list the save recorded (`channel_ids`), when that list differs from the current one
# only by renames, and the gates that named it are restated under its new name, as the core
# restates a channel key a file is now read under. A list that differs in length or order, or a
# rename onto a name the saved list already held, is not taken for a rename, and those gates are
# only named.

# Every gate of a parsed canonical workspace: the active tree's and each stored tree's. A gate
# stored in two trees under one id is listed once.
.gatelabr_workspace_gate_records <- function(parsed) {
  gating <- if (is.list(parsed)) parsed$gating else NULL
  if (!is.list(gating)) return(list())
  gates <- if (is.list(gating$gates)) unname(gating$gates) else list()
  stored <- gating$stored_hierarchies
  if (is.list(stored)) {
    for (tree in stored) {
      if (is.list(tree) && is.list(tree$gates)) gates <- c(gates, unname(tree$gates))
    }
  }
  gates <- Filter(is.list, gates)
  ids <- vapply(gates, function(gate) {
    id <- gate$gate_id
    if (is.character(id) && length(id) == 1L && !is.na(id)) id else ""
  }, character(1))
  gates[!(duplicated(ids) & nzchar(ids))]
}

# The gates among `gates` that name a channel outside `channel_ids`: one row per gate, with the
# channels it lacks in the list column `channels`.
.gatelabr_gates_on_absent_channels <- function(gates, channel_ids) {
  text <- function(value) {
    if (is.character(value) && length(value) == 1L && !is.na(value)) value else ""
  }
  gate_id <- character(0)
  name <- character(0)
  channels <- list()
  for (gate in gates) {
    named <- unique(c(text(gate$x_channel), text(gate$y_channel)))
    missing <- named[!named %in% channel_ids]
    if (length(missing) == 0L) next
    gate_id <- c(gate_id, text(gate$gate_id))
    name <- c(name, text(gate$name))
    channels <- c(channels, list(missing))
  }
  absent <- data.frame(gate_id = gate_id, name = name, stringsAsFactors = FALSE)
  absent$channels <- channels
  absent
}

# One sentence naming each gate on channels the SCE lacks, and those channels.
.gatelabr_absent_channel_gates_text <- function(absent) {
  count <- nrow(absent)
  labels <- ifelse(nzchar(absent$name), absent$name, absent$gate_id)
  lacking <- vapply(absent$channels, paste, character(1), collapse = ", ")
  paste0(
    count, if (count == 1L) " gate names" else " gates name",
    " channels this SCE does not have, and ",
    if (count == 1L) "selects" else "select",
    " no events until they are restored or the ",
    if (count == 1L) "gate is" else "gates are",
    " redrawn: ",
    paste0("'", labels, "' (", lacking, ")", collapse = ", "),
    "."
  )
}

# Old channel id -> new for each row renamed since the save, where the saved list differs from
# the current one only by renames. Empty otherwise: a list of another length, a name on both
# sides (a row moved rather than renamed) and a repeated name are not renames.
.gatelabr_channel_rename_map <- function(saved, current) {
  empty <- stats::setNames(character(0), character(0))
  saved <- unlist(saved, use.names = FALSE)
  if (!is.character(saved) || length(saved) == 0L ||
      length(saved) != length(current) || anyNA(saved)) {
    return(empty)
  }
  renamed <- saved != current
  if (!any(renamed)) return(empty)
  old <- saved[renamed]
  new <- current[renamed]
  if (any(old %in% current) || any(new %in% saved) ||
      anyDuplicated(old) || anyDuplicated(new)) {
    return(empty)
  }
  stats::setNames(new, old)
}

# A record keyed by channel, with each key `map` renames restated. A key whose new name the
# record already holds is left as it is.
.gatelabr_rename_channel_keys <- function(record, map) {
  keys <- names(record)
  if (!is.list(record) || is.null(keys) || length(keys) == 0L) return(record)
  target <- unname(map[keys])
  rename <- !is.na(target) & !target %in% keys
  if (!any(rename)) return(record)
  keys[rename] <- target[rename]
  names(record) <- keys
  record
}

# A list of channel ids with each one `map` renames restated, unless its new name is listed too.
.gatelabr_rename_channel_values <- function(values, map) {
  if (!is.list(values) || length(values) == 0L) return(values)
  present <- vapply(values, function(value) {
    if (is.character(value) && length(value) == 1L) value else NA_character_
  }, character(1))
  for (index in seq_along(values)) {
    old <- present[[index]]
    if (is.na(old) || !old %in% names(map)) next
    if (map[[old]] %in% present) next
    values[[index]] <- map[[old]]
  }
  values
}

.gatelabr_rename_gate_channels <- function(gate, map) {
  if (!is.list(gate)) return(gate)
  for (field in c("x_channel", "y_channel")) {
    value <- gate[[field]]
    if (is.character(value) && length(value) == 1L && value %in% names(map)) {
      gate[[field]] <- map[[value]]
    }
  }
  if (is.list(gate$transforms)) {
    gate$transforms <- .gatelabr_rename_channel_keys(gate$transforms, map)
  }
  gate
}

# The parsed canonical workspace with every channel id `map` renames restated where the core's
# open path restates one (App.tsx, workspaceChannelKeys.ts): each tree's gates, the display
# channels and each file's channel settings. The axis ranges are restated too, which the core
# leaves to fall back to their defaults.
.gatelabr_rename_workspace_channels <- function(parsed, map) {
  gating <- parsed$gating
  if (is.list(gating$gates)) {
    gating$gates <- lapply(gating$gates, .gatelabr_rename_gate_channels, map = map)
  }
  if (is.list(gating$stored_hierarchies)) {
    gating$stored_hierarchies <- lapply(gating$stored_hierarchies, function(tree) {
      if (is.list(tree) && is.list(tree$gates)) {
        tree$gates <- lapply(tree$gates, .gatelabr_rename_gate_channels, map = map)
      }
      tree
    })
  }
  parsed$gating <- gating
  if (is.list(parsed$display)) {
    for (field in c("xChannel", "yChannel")) {
      value <- parsed$display[[field]]
      if (is.character(value) && length(value) == 1L && value %in% names(map)) {
        parsed$display[[field]] <- map[[value]]
      }
    }
  }
  if (is.list(parsed$samples)) {
    parsed$samples <- lapply(parsed$samples, function(sample) {
      if (!is.list(sample)) return(sample)
      for (field in c("logicleW", "scatterCofactor", "labels")) {
        if (is.list(sample[[field]])) {
          sample[[field]] <- .gatelabr_rename_channel_keys(sample[[field]], map)
        }
      }
      for (field in c("scatterLinear", "fluorArcsinh")) {
        if (is.list(sample[[field]])) {
          sample[[field]] <- .gatelabr_rename_channel_values(sample[[field]], map)
        }
      }
      sample
    })
  }
  if (is.list(parsed$scales) && is.list(parsed$scales$globalScales)) {
    parsed$scales$globalScales <-
      .gatelabr_rename_channel_keys(parsed$scales$globalScales, map)
  }
  parsed
}

# The SCE with the gates of its saved workspace restated under the rows renamed since the save,
# and what was done. `renamed` holds the renames the gates used; `restated` the gates restated;
# `absent` the gates still naming channels the SCE lacks. The JSON is written again only when a
# gate is restated, and only if it reads back as the restated workspace; otherwise the workspace
# is left as it was saved and its gates are named in `absent`.
.gatelabr_reconcile_workspace_channels <- function(sce) {
  channel_ids <- vapply(
    .gatelabr_channel_descriptors(sce),
    `[[`,
    character(1),
    "id"
  )
  unchanged <- function(gates) {
    list(
      sce = sce,
      renamed = stats::setNames(character(0), character(0)),
      restated = character(0),
      absent = .gatelabr_gates_on_absent_channels(gates, channel_ids)
    )
  }
  md <- S4Vectors::metadata(sce)
  record <- md$gatelab_workspace
  canonical <- .gatelabr_canonical_workspace_record(sce)
  if (is.null(canonical)) {
    legacy <- md$gating_workspace
    gates <- if (is.list(legacy) && is.list(legacy$gates)) unname(legacy$gates) else list()
    return(unchanged(Filter(is.list, gates)))
  }
  parsed <- jsonlite::fromJSON(canonical$workspace_json, simplifyVector = FALSE)
  gates <- .gatelabr_workspace_gate_records(parsed)
  absent <- .gatelabr_gates_on_absent_channels(gates, channel_ids)
  if (nrow(absent) == 0L) return(unchanged(gates))

  saved <- if (is.list(record)) record$channel_ids else NULL
  map <- .gatelabr_channel_rename_map(saved, channel_ids)
  gate_channels <- unlist(lapply(gates, function(gate) {
    c(gate$x_channel, gate$y_channel, names(gate$transforms))
  }), use.names = FALSE)
  if (!any(names(map) %in% gate_channels)) return(unchanged(gates))

  restated <- .gatelabr_rename_workspace_channels(parsed, map)
  json <- as.character(jsonlite::toJSON(
    restated,
    auto_unbox = TRUE,
    null = "null",
    na = "null",
    digits = .gatelabr_workspace_json_digits
  ))
  reread <- jsonlite::fromJSON(json, simplifyVector = FALSE)
  if (!isTRUE(all.equal(reread, restated, tolerance = 0))) return(unchanged(gates))

  md$gatelab_workspace$workspace_json <- json
  # The gates now name the current rows, and so does the list the save recorded; left as it
  # was, a later rename would be read against names the gates no longer use.
  md$gatelab_workspace$channel_ids <- channel_ids
  legacy <- md$gating_workspace
  if (is.list(legacy) && is.list(legacy$gates)) {
    legacy$gates <- lapply(legacy$gates, .gatelabr_rename_gate_channels, map = map)
    if (is.list(legacy$global_scale_ranges)) {
      legacy$global_scale_ranges <-
        .gatelabr_rename_channel_keys(legacy$global_scale_ranges, map)
    }
    md$gating_workspace <- legacy
  }
  S4Vectors::metadata(sce) <- md
  after <- .gatelabr_gates_on_absent_channels(
    .gatelabr_workspace_gate_records(restated),
    channel_ids
  )
  fixed <- absent[!absent$gate_id %in% after$gate_id, , drop = FALSE]
  list(
    sce = sce,
    renamed = map,
    restated = ifelse(nzchar(fixed$name), fixed$name, fixed$gate_id),
    absent = after
  )
}

# What the launch says about the saved workspace's channels, or NULL when there is nothing to say.
.gatelabr_workspace_channel_report <- function(reconciled, sce_name) {
  lines <- character(0)
  if (length(reconciled$renamed)) {
    count <- length(reconciled$renamed)
    one_gate <- length(reconciled$restated) == 1L
    lines <- c(lines, paste0(
      "GateLabR: ", count, if (count == 1L) " row was" else " rows were",
      " renamed after the GateLab workspace in `", sce_name, "` was saved (",
      paste(names(reconciled$renamed), reconciled$renamed, sep = " -> ", collapse = ", "),
      "), recognised from the channel list the save recorded.",
      if (length(reconciled$restated)) paste0(
        if (one_gate) " The gate " else " The gates ",
        paste0("'", reconciled$restated, "'", collapse = ", "),
        if (one_gate) " now names" else " now name",
        " the renamed channels."
      ),
      " The change reaches `", sce_name, "` with the app's next save."
    ))
  }
  if (nrow(reconciled$absent)) {
    lines <- c(lines, paste0(
      "GateLabR: ",
      .gatelabr_absent_channel_gates_text(reconciled$absent),
      " Saving is not affected."
    ))
  }
  if (length(lines) == 0L) NULL else paste(lines, collapse = "\n")
}

# A key for the set of gates on absent channels, so that the console names them again only when
# the set changes rather than at every autosave.
.gatelabr_absent_channel_signature <- function(absent) {
  if (is.null(absent) || nrow(absent) == 0L) return("")
  lacking <- vapply(absent$channels, paste, character(1), collapse = "\t")
  paste(sort(paste(absent$gate_id, lacking, sep = "\t")), collapse = "\n")
}
