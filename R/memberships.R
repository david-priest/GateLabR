# memberships.R -- every population's membership, stored beside the workspace and read back in R.
#
# The workspace JSON in metadata(sce)$gatelab_workspace holds gate geometry. Which events fall
# inside a population is decided in the browser, per gate space and transform, so R cannot
# reproduce it without a second gating engine that could silently disagree. An explicit
# "Save to SCE" therefore also sends every population's membership, for every hierarchy and every
# sample, and it is kept here as one packed bitset per population: an eighth of a byte per event,
# so a million events by forty populations is a few megabytes of metadata, not hundreds.

.gatelabr_pack_bits <- function(membership) {
  membership <- as.logical(membership)
  pad <- (8L - length(membership) %% 8L) %% 8L
  packBits(c(membership, logical(pad)), type = "raw")
}

.gatelabr_unpack_bits <- function(packed, event_count) {
  if (event_count == 0L) return(logical(0))
  as.logical(rawToBits(packed)[seq_len(event_count)])
}

.gatelabr_membership_scalar <- function(value, what) {
  value <- as.character(value)
  if (length(value) != 1L || is.na(value) || !nzchar(value)) {
    stop("Population memberships: ", what, " must be a non-empty string.", call. = FALSE)
  }
  value
}

.gatelabr_membership_gate_text <- function(gates, gate_logic) {
  if (!is.list(gates) || length(gates) == 0L) return("")
  labels <- vapply(gates, function(gate) {
    if (!is.list(gate)) stop("Population memberships: a gate reference is malformed.", call. = FALSE)
    label <- .gatelabr_membership_scalar(gate$gateName, "gate name")
    quadrant <- suppressWarnings(as.integer(gate$quadrant))
    if (length(quadrant) == 1L && !is.na(quadrant)) label <- paste0(label, " Q", quadrant)
    if (isTRUE(gate$include)) label else paste0("not ", label)
  }, character(1))
  paste(labels, collapse = if (identical(gate_logic, "or")) " or " else " and ")
}

# The bitsets are positional against the object as it was when saved. Positions do not survive
# a reorder, a subset or a cbind, and neither the column count nor a digest of column names and
# sample partition can tell: CATALYST::prepData() builds its SCE with no column names, so two
# events of one sample can swap places unseen. An explicit save therefore writes each event's own
# id to colData, where it travels with the event, and the read maps every event back to its saved
# position through it.
.gatelabr_event_id_column <- "gatelab_event_id"

# The ids of one save are offset + 1, offset + 3, ..., offset + 2N - 1. The offset is drawn per
# save, so events that reach one object from two separate saves (cbind) do not share ids. It comes
# from a hash of the moment, not from R's random number generator: pressing "Save to SCE" must not
# move the user's .Random.seed.
#
# Every id is an odd integer between 2^48 and 2^49, so a double holds it exactly and 15
# significant digits (as write.csv() writes a double) carry it in full. An id that loses precision
# lands on a coarser grid, and every such grid is even: through a 32-bit float (an FCS channel, a
# float32 array) it becomes a multiple of 2^25, and rounded to 14 significant digits or fewer a
# multiple of ten. Consecutive ids put such a rounded id on another event of the same save, which
# then lent it its membership with no error. No save writes an even id, so the read refuses one.
.gatelabr_event_id_stride <- 2

.gatelabr_event_id_offset <- function(saved_at, revision, event_count) {
  hex <- digest::digest(
    list(saved_at, revision, event_count, Sys.getpid(), as.numeric(Sys.time())),
    algo = "sha256"
  )
  # 48 bits of the hash, in two halves because strtoi() stops at 31 bits.
  draw <- strtoi(substr(hex, 1L, 6L), 16L) * 2^24 + strtoi(substr(hex, 7L, 12L), 16L)
  # Even, and low enough that the last id, offset + 2N - 1, stays below 2^49.
  2^48 + 2 * (draw %% (2^47 - event_count))
}

# The id of each event of the object being saved, in its order.
.gatelabr_event_ids <- function(event_ids, event_count) {
  event_ids$offset + event_ids$stride * seq_len(event_count) - (event_ids$stride - 1)
}

# Validate the payload an explicit save carries and pack it against this SCE's sample layout.
.gatelabr_pack_host_memberships <- function(
    sce,
    memberships,
    revision,
    saved_at,
    sample_column = NULL) {
  if (!is.list(memberships) || !is.list(memberships$hierarchies) ||
      !is.list(memberships$populations)) {
    stop("Population memberships payload is malformed.", call. = FALSE)
  }
  hierarchies <- do.call(rbind, lapply(memberships$hierarchies, function(hierarchy) {
    if (!is.list(hierarchy)) stop("Population memberships: a hierarchy is malformed.", call. = FALSE)
    data.frame(
      hierarchy_id = .gatelabr_membership_scalar(hierarchy$id, "hierarchy id"),
      hierarchy = .gatelabr_membership_scalar(hierarchy$name, "hierarchy name"),
      active = isTRUE(hierarchy$active),
      root_population_id = .gatelabr_membership_scalar(
        hierarchy$rootPopulationId, "root population id"
      ),
      stringsAsFactors = FALSE
    )
  }))
  if (is.null(hierarchies) || nrow(hierarchies) == 0L) {
    stop("Population memberships name no hierarchy.", call. = FALSE)
  }
  if (anyDuplicated(hierarchies$hierarchy_id)) {
    stop("Population memberships repeat a hierarchy id.", call. = FALSE)
  }
  if (length(memberships$populations) == 0L) {
    stop("Population memberships name no population.", call. = FALSE)
  }

  partition <- .gatelabr_sample_partition(sce, sample_column, include_metadata = FALSE)
  expected_sample_ids <- vapply(partition$samples, `[[`, character(1), "id")
  masks <- list()
  not_evaluated <- list()
  rows <- lapply(memberships$populations, function(population) {
    if (!is.list(population)) stop("Population memberships: a population is malformed.", call. = FALSE)
    hierarchy_id <- .gatelabr_membership_scalar(population$hierarchyId, "hierarchy id")
    if (!hierarchy_id %in% hierarchies$hierarchy_id) {
      stop("Population memberships: population refers to an unknown hierarchy.", call. = FALSE)
    }
    population_id <- .gatelabr_membership_scalar(population$populationId, "population id")
    name <- .gatelabr_membership_scalar(population$populationName, "population name")
    parent_id <- population$parentId
    parent_id <- if (is.null(parent_id) || length(parent_id) != 1L || is.na(parent_id) ||
                     !nzchar(as.character(parent_id))) NA_character_ else as.character(parent_id)
    gate_logic <- if (identical(population$gateLogic, "or")) "or" else "and"
    membership <- .gatelabr_assemble_membership(
      population$sampleMasks, partition, expected_sample_ids, name
    )
    key <- paste0(hierarchy_id, "/", population_id)
    if (!is.null(masks[[key]])) {
      stop("Population memberships repeat population '", name, "'.", call. = FALSE)
    }
    # An event the population was not evaluated for is kept in a second bitset, with the note
    # for each such sample, and read back as NA.
    masks[[key]] <<- .gatelabr_pack_bits(membership %in% TRUE)
    if (anyNA(membership)) {
      notes <- attr(membership, "not_evaluated")
      not_evaluated[[key]] <<- list(
        events = .gatelabr_pack_bits(is.na(membership)),
        samples = notes$samples,
        notes = notes$notes
      )
    }
    data.frame(
      hierarchy_id = hierarchy_id,
      hierarchy = hierarchies$hierarchy[match(hierarchy_id, hierarchies$hierarchy_id)],
      population_id = population_id,
      population = name,
      parent_id = parent_id,
      gate_logic = gate_logic,
      gates = .gatelabr_membership_gate_text(population$gates, gate_logic),
      event_count = sum(membership, na.rm = TRUE),
      stringsAsFactors = FALSE
    )
  })
  populations <- do.call(rbind, rows)
  rownames(populations) <- NULL

  # Depth and path from the parent links, per hierarchy. Parents precede children in the
  # payload, but nothing here relies on it.
  populations$parent <- NA_character_
  populations$depth <- NA_integer_
  populations$path <- NA_character_
  for (hierarchy_id in hierarchies$hierarchy_id) {
    rows_here <- which(populations$hierarchy_id == hierarchy_id)
    ids <- populations$population_id[rows_here]
    parents <- populations$parent_id[rows_here]
    names_here <- populations$population[rows_here]
    for (index in seq_along(rows_here)) {
      chain <- character(0)
      current <- index
      steps <- 0L
      repeat {
        chain <- c(names_here[[current]], chain)
        parent <- parents[[current]]
        if (is.na(parent)) break
        current <- match(parent, ids)
        steps <- steps + 1L
        if (is.na(current) || steps > length(ids)) {
          stop(
            "Population memberships: '", names_here[[index]],
            "' has a parent outside its hierarchy.",
            call. = FALSE
          )
        }
      }
      row <- rows_here[[index]]
      populations$depth[[row]] <- length(chain) - 1L
      populations$path[[row]] <- paste(chain, collapse = " > ")
      if (!is.na(parents[[index]])) {
        populations$parent[[row]] <- names_here[[match(parents[[index]], ids)]]
      }
    }
  }
  populations <- populations[, c(
    "hierarchy_id", "hierarchy", "population_id", "population", "parent_id", "parent",
    "depth", "path", "gate_logic", "gates", "event_count"
  )]

  record <- list(
    format = "gatelab-sce-memberships",
    # Version 2 carries event_ids; a version 1 record, from before they existed, has none.
    version = 2L,
    revision = as.integer(revision),
    saved_at = saved_at,
    event_count = ncol(sce),
    event_ids = list(
      column = .gatelabr_event_id_column,
      offset = .gatelabr_event_id_offset(saved_at, revision, ncol(sce)),
      stride = .gatelabr_event_id_stride
    ),
    hierarchies = hierarchies,
    populations = populations,
    masks = masks
  )
  # Present only when some population was not evaluated for some sample; a record without it has
  # every population evaluated for every event.
  if (length(not_evaluated) > 0L) record$not_evaluated <- not_evaluated
  record
}

# The stored record, checked against the object it is being read from.
.gatelabr_memberships_record <- function(sce, allow_stale = FALSE) {
  if (!methods::is(sce, "SingleCellExperiment")) {
    stop("sce must be a SingleCellExperiment.", call. = FALSE)
  }
  md <- S4Vectors::metadata(sce)
  # cbind() keeps every object's metadata, so a combined object carries one workspace record per
  # object, and `$` reaches only the first. The memberships can be stored in any of them.
  saves <- Filter(function(workspace) {
    is.list(workspace) && is.list(workspace$memberships) &&
      identical(workspace$memberships$format, "gatelab-sce-memberships")
  }, unname(md[names(md) %in% "gatelab_workspace"]))
  if (length(saves) == 0L) {
    workspace <- md$gatelab_workspace
    stale_core <- if (is.list(workspace)) workspace$explicit_without_memberships else NULL
    if (!is.null(stale_core)) {
      stop(
        "No population memberships are stored in this SCE. The last \"Save to SCE\" ",
        "(workspace revision ", stale_core, ") reached R without any, so the GateLab core ",
        "that served that session predates them. Restart GateLabR from the updated package ",
        "(devtools::load_all() or reinstall), open a fresh browser tab, and press ",
        "\"Save to SCE\" again: the status line should then end with ",
        "\"memberships for N populations\".",
        call. = FALSE
      )
    }
    stop(
      "No population memberships are stored in this SCE. In GateLabR press ",
      "\"Save to SCE\": an explicit save stores every population of every hierarchy ",
      "beside the workspace. Autosaves store gate geometry only.",
      call. = FALSE
    )
  }
  workspace <- .gatelabr_memberships_save(sce, saves)
  record <- workspace$memberships
  record$positions <- .gatelabr_membership_positions(sce, record)
  # Stale against the workspace the memberships were saved with, which on a combined object need
  # not be the first record.
  current_revision <- suppressWarnings(as.integer(workspace$revision))
  if (length(current_revision) != 1L || is.na(current_revision) || current_revision < 0L) {
    current_revision <- 0L
  }
  if (!identical(as.integer(record$revision), current_revision) && !isTRUE(allow_stale)) {
    stop(
      "Population memberships were saved at workspace revision ", record$revision,
      " but the workspace is now at revision ", current_revision,
      ": gates or populations changed since. Press \"Save to SCE\" in GateLabR to ",
      "refresh them, or pass allow_stale = TRUE to read them as they were.",
      call. = FALSE
    )
  }
  record
}

# Which of the stored saves this object's events are read from. A record without event ids (saved
# before ids existed) covers no event by id, so it is not a second save; where it is the only one,
# the read refuses it. Of several saves, the one that holds every event is read, as the object
# would have been before it was combined.
.gatelabr_memberships_save <- function(sce, saves) {
  offsets <- vapply(saves, function(workspace) {
    offset <- workspace$memberships$event_ids$offset
    if (is.numeric(offset) && length(offset) == 1L) offset else NA_real_
  }, numeric(1))
  distinct <- which(!is.na(offsets) & !duplicated(offsets))
  if (length(distinct) == 0L) return(saves[[1L]])
  if (length(distinct) == 1L) return(saves[[distinct]])
  for (index in distinct) {
    record <- saves[[index]]$memberships
    ids <- SummarizedExperiment::colData(sce)[[record$event_ids$column]]
    positions <- .gatelabr_saved_positions(ids, record$event_ids, as.numeric(record$event_count))
    if (!anyNA(positions)) return(saves[[index]])
  }
  stop(
    "This SCE combines events from objects whose population memberships were saved separately ",
    "(cbind() keeps each object's metadata), and no one save holds all of them. Subset it to ",
    "the events of one save, or press \"Save to SCE\" in GateLabR on this object to store ",
    "them again.",
    call. = FALSE
  )
}

# Each event's position in the object a save was made on, or NA where its id is none of that
# save's.
.gatelabr_saved_positions <- function(ids, key, saved_count) {
  if (!is.numeric(ids)) return(rep(NA_real_, length(ids)))
  stride <- .gatelabr_event_id_stride
  positions <- (ids - key$offset + stride - 1) / stride
  known <- !is.na(positions) & positions >= 1 & positions <= saved_count &
    positions == round(positions)
  positions[!known] <- NA_real_
  positions
}

# Each event's position in the object the memberships were saved on, found through its event id,
# so that a reordered, subset or combined object reads every event's own membership. Anything that
# cannot be traced to a saved event stops the read: a positional guess is what misassigned events.
.gatelabr_membership_positions <- function(sce, record) {
  resave <- "press \"Save to SCE\" in GateLabR on this object to store them again."
  key <- record$event_ids
  if (!is.list(key)) {
    stop(
      "These population memberships were saved by an earlier version of GateLabR, which kept ",
      "them by event position only, so they cannot be matched to this object's events: on a ",
      "reordered or subset object a positional read gives events each other's memberships. ",
      "To read them, ", resave,
      call. = FALSE
    )
  }
  if (!is.character(key$column) || length(key$column) != 1L ||
      !is.numeric(key$offset) || length(key$offset) != 1L || !is.finite(key$offset) ||
      !identical(key$stride, .gatelabr_event_id_stride)) {
    stop(
      "These population memberships carry event ids in a form this version of GateLabR does ",
      "not read, so they cannot be matched to this object's events. To read them, ", resave,
      call. = FALSE
    )
  }
  cd <- SummarizedExperiment::colData(sce)
  if (!key$column %in% colnames(cd)) {
    stop(
      "This SCE has no `", key$column, "` column in colData. \"Save to SCE\" writes it to tie ",
      "each stored population membership to its event, and without it the memberships cannot ",
      "be matched to this object's events. To read them, ", resave,
      call. = FALSE
    )
  }
  ids <- cd[[key$column]]
  saved_count <- as.numeric(record$event_count)
  positions <- .gatelabr_saved_positions(ids, key, saved_count)
  known <- !is.na(positions)
  # An id that lost precision is even, and no save writes one (see .gatelabr_event_id_offset).
  rounded <- if (is.numeric(ids)) {
    !known & is.finite(ids) & ids >= 2^48 & ids <= 2^49 & ids %% 2 == 0
  } else {
    FALSE
  }
  if (any(rounded)) {
    stop(
      sum(rounded), " of this SCE's ", length(known), " events have a `", key$column,
      "` that lost precision, as an id does when stored as a 32-bit float (an FCS channel, a ",
      "float32 array) or written with fewer than 15 significant digits, so it no longer names ",
      "its saved event and the event's memberships are unknown. Read them from an object whose ",
      "ids were kept in full, or ", resave,
      call. = FALSE
    )
  }
  if (!all(known)) {
    stop(
      sum(!known), " of this SCE's ", length(known), " events are not among the ",
      saved_count, " events the population memberships were saved on, so their memberships ",
      "are unknown: they came from another object, for example through cbind(). Subset this ",
      "SCE to the saved events, or ", resave,
      call. = FALSE
    )
  }
  as.integer(positions)
}

# One population's membership for every event of this object, in this object's order: NA for an
# event of a sample the population was not evaluated for.
.gatelabr_population_membership <- function(record, key) {
  event_count <- as.integer(record$event_count)
  saved <- .gatelabr_unpack_bits(record$masks[[key]], event_count)
  unevaluated <- record$not_evaluated[[key]]
  if (!is.null(unevaluated)) {
    saved[.gatelabr_unpack_bits(unevaluated$events, event_count)] <- NA
  }
  saved[record$positions]
}

# One warning for the populations read here that are NA for some of this object's events, naming
# each population, the samples it was not evaluated for, and the note GateLab sent for each.
# `na_counts` is the number of this object's events each row of `rows` is NA for; `lead` is a first
# line saying what the NA did to the result.
.gatelabr_warn_not_evaluated <- function(record, rows, na_counts, lead = NULL) {
  lines <- character(0)
  for (index in seq_len(nrow(rows))) {
    if (na_counts[[index]] == 0L) next
    key <- paste0(rows$hierarchy_id[[index]], "/", rows$population_id[[index]])
    unevaluated <- record$not_evaluated[[key]]
    lines <- c(
      lines,
      paste0(
        "Population '", rows$population[[index]], "' is NA for ", na_counts[[index]],
        " of this object's events, as it was not evaluated for:"
      ),
      paste0("  sample '", unevaluated$samples, "': ", unevaluated$notes)
    )
  }
  if (length(lines) > 0L) warning(paste(c(lead, lines), collapse = "\n"), call. = FALSE)
  invisible(NULL)
}

.gatelabr_resolve_hierarchy <- function(record, hierarchy = NULL) {
  hierarchies <- record$hierarchies
  if (is.null(hierarchy)) {
    active <- which(hierarchies$active)
    return(hierarchies$hierarchy_id[[if (length(active) >= 1L) active[[1]] else 1L]])
  }
  if (!is.character(hierarchy) || length(hierarchy) != 1L || is.na(hierarchy)) {
    stop("hierarchy must be one hierarchy name or id.", call. = FALSE)
  }
  by_name <- which(hierarchies$hierarchy == hierarchy)
  if (length(by_name) == 1L) return(hierarchies$hierarchy_id[[by_name]])
  by_id <- which(hierarchies$hierarchy_id == hierarchy)
  if (length(by_id) == 1L) return(hierarchies$hierarchy_id[[by_id]])
  stop(
    "No hierarchy called '", hierarchy, "'. Stored hierarchies: ",
    paste(hierarchies$hierarchy, collapse = ", "), ".",
    call. = FALSE
  )
}

#' Population hierarchies stored in a gated SingleCellExperiment
#'
#' An explicit \dQuote{Save to SCE} in GateLabR stores, beside the workspace, which events every
#' population holds, for every hierarchy. These functions read that back without re-gating in R.
#'
#' Memberships are tied to the workspace revision they were computed at. If gates or populations
#' changed since (an autosave moved the revision on), reading them is refused unless
#' \code{allow_stale = TRUE}; press \dQuote{Save to SCE} again to refresh them.
#'
#' Memberships follow the events, not their positions. The save writes each event's id to
#' \code{colData(sce)$gatelab_event_id}, which travels with the event, so a reordered or subset
#' SCE, or one that repeats saved events, reads every event's own membership. An event that was
#' not in the saved object, for example one added with \code{cbind()}, has no stored membership,
#' and reading is refused rather than guessed; so is reading after the id column was removed, or
#' memberships saved by an earlier version of GateLabR, which kept them by position only.
#' \code{cbind()} needs the column on both objects: give the object that lacks it the column as
#' \code{NA} (\code{other$gatelab_event_id <- NA_real_}) rather than dropping it from the saved
#' one, and the saved events read again once the combined object is subset back to them.
#'
#' A population can be \emph{not evaluated} for a sample. GateLab reads each sample's memberships
#' under the tree that sample is gated under, and when that tree has no counterpart for a
#' population (a copy whose structure was changed), it sends no membership for the sample's
#' events, with a note naming the file, the population and the file's tree. Those events are
#' \code{NA} in that population, never \code{FALSE}, and every read that returns such an
#' \code{NA} warns with the note.
#'
#' @param sce A \code{SingleCellExperiment} gated with GateLabR and saved with
#'   \dQuote{Save to SCE}.
#' @param hierarchy A hierarchy name or id. \code{NULL} means the hierarchy that was active when
#'   the memberships were saved.
#' @param populations Population names (or ids) to return; \code{NULL} means every population of
#'   the hierarchy, root included.
#' @param ungated Label for events that fall in no population below the root.
#' @param allow_stale Read memberships whose workspace revision is behind the stored workspace.
#'
#' @return \code{gatelabHierarchies}: a data frame with one row per hierarchy
#'   (\code{hierarchy_id}, \code{hierarchy}, \code{active}, \code{populations}).
#'
#'   \code{gatelabHierarchy}: a data frame with one row per population of one hierarchy, parents
#'   before children: \code{population_id}, \code{population}, \code{parent}, \code{depth},
#'   \code{path} (names from the root joined by \code{" > "}), \code{gates} (the gate names the
#'   population is defined by, \code{not} marking an excluded gate), and \code{event_count}, the
#'   number of this object's events the population holds; events it was not evaluated for are
#'   not counted.
#'
#'   \code{gatelabPopulations}: a logical matrix with one row per SCE column (event) and one
#'   column per population, named by population; a name shared by two populations of the
#'   hierarchy is suffixed with the population id. An event is \code{NA} in a population that was
#'   not evaluated for its sample.
#'
#'   \code{gatelabLeafPopulation}: a factor with one level per population of the hierarchy in tree
#'   order plus \code{ungated}, giving each event its deepest population. Where two populations of
#'   equal depth both hold an event, the one earlier in the tree wins. An event is \code{NA} where
#'   a population not evaluated for it could hold it (no ancestor is known not to) and would
#'   outrank the population found.
#'
#' @examples
#' \dontrun{
#' gatelabHierarchies(sce)
#' gatelabHierarchy(sce)
#' members <- gatelabPopulations(sce)
#' colSums(members)
#' sce$population <- gatelabLeafPopulation(sce)
#' table(sce$population, sce$sample_id)
#' }
#' @name gatelabMemberships
NULL

#' @rdname gatelabMemberships
#' @export
gatelabHierarchies <- function(sce, allow_stale = FALSE) {
  record <- .gatelabr_memberships_record(sce, allow_stale)
  out <- record$hierarchies[, c("hierarchy_id", "hierarchy", "active")]
  out$populations <- vapply(
    out$hierarchy_id,
    function(id) sum(record$populations$hierarchy_id == id),
    integer(1)
  )
  rownames(out) <- NULL
  out
}

#' @rdname gatelabMemberships
#' @export
gatelabHierarchy <- function(sce, hierarchy = NULL, allow_stale = FALSE) {
  record <- .gatelabr_memberships_record(sce, allow_stale)
  hierarchy_id <- .gatelabr_resolve_hierarchy(record, hierarchy)
  rows <- record$populations[record$populations$hierarchy_id == hierarchy_id, ]
  # The stored counts are the saved object's; a reordered object has the same ones.
  if (!identical(record$positions, seq_len(as.integer(record$event_count)))) {
    rows$event_count <- vapply(
      paste0(rows$hierarchy_id, "/", rows$population_id),
      function(key) sum(.gatelabr_population_membership(record, key), na.rm = TRUE),
      integer(1),
      USE.NAMES = FALSE
    )
  }
  out <- rows[, c(
    "population_id", "population", "parent", "depth", "path", "gates", "event_count"
  )]
  rownames(out) <- NULL
  out
}

#' @rdname gatelabMemberships
#' @export
gatelabPopulations <- function(sce, populations = NULL, hierarchy = NULL, allow_stale = FALSE) {
  record <- .gatelabr_memberships_record(sce, allow_stale)
  hierarchy_id <- .gatelabr_resolve_hierarchy(record, hierarchy)
  rows <- record$populations[record$populations$hierarchy_id == hierarchy_id, ]
  if (!is.null(populations)) {
    if (!is.character(populations) || length(populations) == 0L) {
      stop("populations must be a character vector of population names or ids.", call. = FALSE)
    }
    picked <- integer(0)
    for (wanted in populations) {
      by_name <- which(rows$population == wanted)
      by_id <- which(rows$population_id == wanted)
      hit <- if (length(by_name) == 1L) by_name else if (length(by_id) == 1L) by_id else NULL
      if (length(by_name) > 1L) {
        stop(
          "Population name '", wanted, "' is shared by ", length(by_name),
          " populations; pass a population id from gatelabHierarchy() instead.",
          call. = FALSE
        )
      }
      if (is.null(hit)) {
        stop(
          "No population called '", wanted, "' in hierarchy '",
          record$hierarchies$hierarchy[match(hierarchy_id, record$hierarchies$hierarchy_id)],
          "'. Populations: ", paste(rows$population, collapse = ", "), ".",
          call. = FALSE
        )
      }
      picked <- c(picked, hit)
    }
    rows <- rows[picked, ]
  }
  event_count <- ncol(sce)
  out <- matrix(
    FALSE,
    nrow = event_count,
    ncol = nrow(rows),
    dimnames = list(colnames(sce), NULL)
  )
  labels <- rows$population
  duplicated_names <- labels %in% labels[duplicated(labels)]
  labels[duplicated_names] <- paste0(labels[duplicated_names], " (", rows$population_id[duplicated_names], ")")
  colnames(out) <- labels
  na_counts <- integer(nrow(rows))
  for (index in seq_len(nrow(rows))) {
    key <- paste0(rows$hierarchy_id[[index]], "/", rows$population_id[[index]])
    membership <- .gatelabr_population_membership(record, key)
    na_counts[[index]] <- sum(is.na(membership))
    out[, index] <- membership
  }
  .gatelabr_warn_not_evaluated(record, rows, na_counts)
  out
}

#' @rdname gatelabMemberships
#' @export
gatelabLeafPopulation <- function(sce, hierarchy = NULL, ungated = "ungated", allow_stale = FALSE) {
  record <- .gatelabr_memberships_record(sce, allow_stale)
  hierarchy_id <- .gatelabr_resolve_hierarchy(record, hierarchy)
  rows <- record$populations[record$populations$hierarchy_id == hierarchy_id, ]
  event_count <- ncol(sce)
  below_root <- rows[rows$depth > 0L, ]
  levels <- below_root$population
  duplicated_names <- levels %in% levels[duplicated(levels)]
  levels[duplicated_names] <- paste0(
    levels[duplicated_names], " (", below_root$population_id[duplicated_names], ")"
  )
  if (ungated %in% levels) {
    stop("ungated must differ from every population name.", call. = FALSE)
  }
  leaf <- rep(NA_integer_, event_count)
  best_depth <- rep(0L, event_count)
  unevaluated <- list()
  for (index in seq_len(nrow(below_root))) {
    key <- paste0(below_root$hierarchy_id[[index]], "/", below_root$population_id[[index]])
    membership <- .gatelabr_population_membership(record, key)
    if (anyNA(membership)) unevaluated[[as.character(index)]] <- membership
    deeper <- membership %in% TRUE & below_root$depth[[index]] > best_depth
    leaf[deeper] <- index
    best_depth[deeper] <- below_root$depth[[index]]
  }
  codes <- ifelse(is.na(leaf), length(levels) + 1L, leaf)
  out <- factor(c(levels, ungated)[codes], levels = c(levels, ungated))
  if (length(unevaluated) == 0L) return(out)

  # A population that is NA for an event could hold it, unless an ancestor is known not to, as a
  # population holds only events of its parent. Where it could, and would outrank the population
  # found (deeper, or as deep and earlier in the tree), the event's deepest population is unknown.
  unknown <- logical(event_count)
  na_counts <- integer(nrow(below_root))
  rank <- ifelse(is.na(leaf), Inf, leaf)
  for (name in names(unevaluated)) {
    index <- as.integer(name)
    could_hold <- is.na(unevaluated[[name]])
    parent_id <- below_root$parent_id[[index]]
    repeat {
      parent <- match(parent_id, rows$population_id)
      if (is.na(parent)) break
      parent_membership <- .gatelabr_population_membership(
        record,
        paste0(rows$hierarchy_id[[parent]], "/", rows$population_id[[parent]])
      )
      could_hold <- could_hold & !(parent_membership %in% FALSE)
      parent_id <- rows$parent_id[[parent]]
    }
    depth <- below_root$depth[[index]]
    outranks <- depth > best_depth | (depth == best_depth & index < rank)
    if (any(could_hold & outranks)) {
      unknown <- unknown | (could_hold & outranks)
      na_counts[[index]] <- sum(is.na(unevaluated[[name]]))
    }
  }
  .gatelabr_warn_not_evaluated(
    record,
    below_root,
    na_counts,
    lead = paste0("The deepest population of ", sum(unknown), " of this object's events is NA.")
  )
  out[unknown] <- NA
  out
}
