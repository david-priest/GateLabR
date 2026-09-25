# gatingml_import.R — Cytobank Gating-ML 2.0 import for gates + populations

if (!exists("%||%")) `%||%` <- function(a, b) if (!is.null(a)) a else b

.gml_local_name <- function(node) {
  nm <- xml2::xml_name(node)
  sub("^.*[}:]", "", nm)
}

.gml_attr_local <- function(node, local_name) {
  attrs <- xml2::xml_attrs(node)
  if (length(attrs) == 0) return(NULL)
  nm <- names(attrs)
  base <- sub("^.*[}:]", "", nm)
  idx <- which(base == local_name)
  if (length(idx) == 0) return(NULL)
  unname(attrs[[idx[1]]])
}

.gml_children_local <- function(node, local_name) {
  kids <- xml2::xml_children(node)
  keep <- vapply(kids, function(k) identical(.gml_local_name(k), local_name), logical(1))
  kids[keep]
}

.gml_first_child_local <- function(node, local_name) {
  kids <- .gml_children_local(node, local_name)
  if (length(kids) == 0) return(NULL)
  kids[[1]]
}

# The value a gateReference or a PopulationGatePair gives for excluding its gate, or NULL when it
# gives none. Gating-ML 2.0 spells it use-as-complement; GateLab and GateLabR wrote `complement`
# until 2026-09, which is read the same way.
.gml_complement_value <- function(node) {
  .gml_attr_local(node, "use-as-complement") %||% .gml_attr_local(node, "complement")
}

# A complement value read as an xs:boolean: "true" or "1" with any surrounding space is TRUE and
# "false" or "0" is FALSE (read without regard to case); NA when it is none of these.
.gml_xs_boolean <- function(value) {
  value <- tolower(trimws(value))
  if (value %in% c("true", "1")) TRUE else if (value %in% c("false", "0")) FALSE else NA
}

# Why GateLabR cannot tell whether a gateReference or a PopulationGatePair excludes its gate, or
# NULL when it can: a value that is not an xs:boolean, or both spellings with values that disagree.
# Read by use-as-complement alone, a pair written use-as-complement="false" complement="true" was
# an inclusion, where the older spelling says the population excludes the gate.
.gml_complement_problem <- function(node) {
  use_as <- .gml_attr_local(node, "use-as-complement")
  older <- .gml_attr_local(node, "complement")
  for (value in c(use_as, older)) {
    if (is.na(.gml_xs_boolean(value))) {
      return(paste0(
        "the complement value ", encodeString(value, quote = '"'),
        ", which is not an xs:boolean (true, false, 1 or 0)"
      ))
    }
  }
  if (!is.null(use_as) && !is.null(older) && .gml_xs_boolean(use_as) != .gml_xs_boolean(older)) {
    return(paste0(
      "use-as-complement=", encodeString(use_as, quote = '"'), " and complement=",
      encodeString(older, quote = '"'), ", which disagree"
    ))
  }
  NULL
}

# Whether a gateReference or a PopulationGatePair excludes its gate; NA when its complement value
# cannot be read (.gml_complement_problem says why, and .gml_positive_and_logic_problems refuses
# the file for it).
.gml_is_complement <- function(node) {
  if (!is.null(.gml_complement_problem(node))) return(NA)
  value <- .gml_complement_value(node)
  if (is.null(value)) FALSE else .gml_xs_boolean(value)
}

# Detect who wrote this Gating-ML so the importer can match channels + advise
# correctly: "gatelabr" (channels are display/marker names — a skip means a truly
# missing channel), "cytobank" (channels are FCS $PnN / metal — need the metal
# bridge), or "generic".
.gml_detect_source <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  if (!is.null(ci) && !is.null(.gml_first_child_local(ci, "gatelabr_scales"))) {
    return("gatelabr")
  }
  cb <- tryCatch(xml2::xml_find_first(root, ".//*[local-name()='cytobank']"),
                 error = function(e) NULL)
  if (!is.null(cb) && !inherits(cb, "xml_missing")) return("cytobank")
  "generic"
}

# Whether a file without a gatelab_format mark was written by GateLab or GateLabR. Any one of
# three things marks it, and no other tool writes any of them: the root custom_info's
# cytobank/about text "Gating-ML 2.0 export from GateLab (...)" or "... from GateLabR (...)",
# which every GateLab and GateLabR export carries; a root custom_info gatelabr_scales element;
# or a GatingHierarchy element, which is not a Gating-ML 2.0 element and which GateLabR, and
# GateLab until 2026-09, write for the standard format. GateLab applies the same rule.
.gml_written_by_gatelab <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  if (!is.null(ci)) {
    if (!is.null(.gml_first_child_local(ci, "gatelabr_scales"))) return(TRUE)
    about <- .gml_first_child_local(.gml_first_child_local(ci, "cytobank") %||% ci, "about")
    if (!is.null(about) &&
        grepl("^\\s*Gating-ML 2\\.0 export from GateLab", xml2::xml_text(about))) {
      return(TRUE)
    }
  }
  any(vapply(xml2::xml_children(root), function(el) {
    identical(.gml_local_name(el), "GatingHierarchy")
  }, logical(1)))
}

# The words that end the about text of GateLab's standard format since its logicle coordinates
# moved to Gating-ML's own scale: "...; logicle on the Gating-ML 2.0 scale, T at 1". The about text
# sits in Cytobank's custom_info, which a program that drops the format mark and gatelabr_scales
# can keep, so a file carrying these words is on that scale whatever else it has lost. GateLabR
# writes flowCore's scale and never writes them.
.GML_ABOUT_LOGICLE_SCALE <- "logicle on the Gating-ML 2.0 scale, T at 1"

# The root custom_info's cytobank/about text, or "".
.gml_about_text <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  if (is.null(ci)) return("")
  about <- .gml_first_child_local(.gml_first_child_local(ci, "cytobank") %||% ci, "about")
  if (is.null(about)) "" else xml2::xml_text(about)
}

# The version the root custom_info's gatelabr_scales states, or 0 when it states none. GateLab
# writes version 4 since its logicle coordinates are on Gating-ML's scale; GateLabR writes 3.
.gml_gatelabr_scales_version <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  gs <- if (!is.null(ci)) .gml_first_child_local(ci, "gatelabr_scales") else NULL
  def <- if (!is.null(gs)) .gml_first_child_local(gs, "definition") else NULL
  if (is.null(def)) return(0)
  parsed <- tryCatch(jsonlite::fromJSON(xml2::xml_text(def), simplifyVector = FALSE),
                     error = function(e) NULL)
  version <- if (is.list(parsed)) parsed$version else NULL
  if (is.numeric(version) && length(version) == 1L && is.finite(version)) version else 0
}

# Whether GateLabR wrote the file: the root custom_info's cytobank/about text, which every
# GateLabR export carries ("Gating-ML 2.0 export from GateLabR ..."; GateLab writes "from GateLab
# (...)").
.gml_written_by_gatelabr <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  if (is.null(ci)) return(FALSE)
  about <- .gml_first_child_local(.gml_first_child_local(ci, "cytobank") %||% ci, "about")
  !is.null(about) &&
    grepl("^\\s*Gating-ML 2\\.0 export from GateLabR", xml2::xml_text(about))
}

# The tree a GateLab Cytobank-format file lists in its format mark: each population's BooleanGate
# id with its parent's (NULL at the root). NULL unless every entry is an object with a non-empty
# string id and a parent that is null or a non-empty string.
.gml_parse_format_tree <- function(value) {
  if (!is.list(value) || !is.null(names(value))) return(NULL)
  out <- vector("list", length(value))
  for (i in seq_along(value)) {
    entry <- value[[i]]
    if (!is.list(entry) || is.null(names(entry)) || !"parent" %in% names(entry)) return(NULL)
    id <- entry[["id"]]
    parent <- entry[["parent"]]
    if (!is.character(id) || length(id) != 1L || is.na(id) || !nzchar(id)) return(NULL)
    if (!is.null(parent) &&
        (!is.character(parent) || length(parent) != 1L || is.na(parent) || !nzchar(parent))) {
      return(NULL)
    }
    out[[i]] <- list(id = id, parent = parent)
  }
  out
}

# The first key that one object of a parsed JSON value (jsonlite, simplifyVector = FALSE) names
# more than once, looking at each object before the values inside it; NULL when there is none.
.gml_json_repeated_key <- function(value) {
  if (!is.list(value)) return(NULL)
  keys <- names(value)
  if (!is.null(keys) && anyDuplicated(keys) > 0L) return(keys[[anyDuplicated(keys)]])
  for (item in value) {
    repeated <- .gml_json_repeated_key(item)
    if (!is.null(repeated)) return(repeated)
  }
  NULL
}

# How a file asks to be read where Gating-ML alone leaves room, from the gatelab_format element
# GateLab writes in the root custom_info: a JSON object {"version": 2, "logicle": ..., "hierarchy":
# ...}, with "tree" when the hierarchy is "tree". A mark that is present but cannot be read in full
# (empty, not JSON, JSON to jsonlite only, such as with a comment, behind a byte order mark, not an
# object, a key named twice in one object, another version, or a field GateLabR does not know) is
# recorded in `problems`, which refuse the file: read as no mark, it would put the file's logicle
# coordinates on the wrong scale and its populations in the wrong places. JSON leaves a repeated
# key to the reader, and jsonlite keeps the first value where GateLab's JSON.parse keeps the last,
# so a mark with one could be read two ways.
#
# marked: whether the file carries the element at all.
#
# logicle_unit: whether logicle coordinates are on Gating-ML 2.0's own scale, where the top of
# scale T maps to 1 (specification section 6.4.1). flowCore's logicleTransform, which GateLabR
# inverts with, maps T to M instead: its value is the Gating-ML value times M. GateLabR, and
# GateLab until 2026-09, wrote logicle coordinates on flowCore's scale. So a mark saying
# "gating-ml" or "flowcore" decides; otherwise a file GateLab or GateLabR wrote is on flowCore's
# scale and any other file is on the standard's.
#
# parent_id_hierarchy: GateLab's standard format, where every BooleanGate not marked
# gatelab_operand is a population placed by its gating:parent_id.
#
# tree: GateLab's Cytobank format, whose BooleanGates each AND their whole ancestor chain; the
# list gives each population's parent.
.gml_parse_gatelab_format <- function(root) {
  ci <- .gml_first_child_local(root, "custom_info")
  tag <- if (!is.null(ci)) .gml_first_child_local(ci, "gatelab_format") else NULL
  marked <- !is.null(tag)
  parsed <- list()
  problems <- character(0)
  unreadable <- function(what) {
    paste0(
      "The file's GateLab format mark (gatelab_format) ", what, ", so GateLabR cannot tell how ",
      "the file places its populations or scales its logicle coordinates."
    )
  }
  if (marked) {
    text <- trimws(xml2::xml_text(tag))
    # jsonlite reads JSON behind a byte order mark with a warning, where GateLab's JSON.parse
    # refuses it, so the two would read the file by different rules; any other warning is taken as
    # a text jsonlite could not read in full.
    bom <- startsWith(text, "\ufeff")
    value <- if (nzchar(text) && !bom) {
      tryCatch(jsonlite::fromJSON(text, simplifyVector = FALSE),
               warning = function(w) NULL, error = function(e) NULL)
    } else {
      NULL
    }
    # jsonlite::fromJSON also reads past a /* */ or // comment, before, inside or after the object,
    # which JSON does not allow and GateLab's JSON.parse refuses; jsonlite::validate holds to JSON.
    strict <- if (nzchar(text) && !bom) jsonlite::validate(text) else TRUE
    repeated <- .gml_json_repeated_key(value)
    if (!nzchar(text)) {
      problems <- unreadable("is empty")
    } else if (bom) {
      problems <- unreadable("begins with a byte order mark (U+FEFF), which GateLab does not read as JSON")
    } else if (!isTRUE(strict) && !is.null(value)) {
      reason <- sub("\\.$", "", trimws(sub("\n.*", "", attr(strict, "err") %||% "")))
      problems <- unreadable(paste0(
        "is not valid JSON", if (nzchar(reason)) paste0(" (", reason, ")"),
        "; jsonlite reads it, but GateLab's JSON.parse does not"
      ))
    } else if (!(is.list(value) && !is.null(names(value)))) {
      problems <- unreadable("is not a JSON object")
    } else if (!is.null(repeated)) {
      problems <- unreadable(paste("names the key", encodeString(repeated, quote = '"'), "more than once"))
    } else {
      parsed <- value
    }
  }
  # GateLab writes version 3, and wrote version 2 before it; version 3 adds `time`, says the
  # file's flog is Gating-ML's own, and may carry `gain`. Another version may place populations or
  # scale coordinates by rules GateLabR does not know, so it is refused rather than read as these.
  version <- parsed[["version"]]
  logicle <- parsed[["logicle"]]
  hierarchy <- parsed[["hierarchy"]]
  time <- parsed[["time"]]
  gain <- parsed[["gain"]]
  tree <- if (identical(hierarchy, "tree")) .gml_parse_format_tree(parsed[["tree"]]) else NULL
  if (marked && length(problems) == 0L) {
    if (!(is.numeric(version) && length(version) == 1L && isTRUE(version %in% c(2, 3)))) {
      problems <- paste0(
        "The file's GateLab format mark has ",
        if (is.null(version)) "no version" else paste("version", jsonlite::toJSON(version, auto_unbox = TRUE)),
        "; GateLabR reads versions 2 and 3 only, so it cannot tell how the file places its populations ",
        "or scales its coordinates."
      )
    } else if (!(identical(logicle, "gating-ml") || identical(logicle, "flowcore"))) {
      problems <- unreadable('gives no logicle scale GateLabR knows ("gating-ml" or "flowcore")')
    } else if (!(identical(hierarchy, "parent_id") || identical(hierarchy, "tree"))) {
      problems <- unreadable('gives no hierarchy GateLabR knows ("parent_id" or "tree")')
    } else if (identical(hierarchy, "tree") && is.null(tree)) {
      problems <- unreadable("lists a tree that is not a list of populations, each with an id and a parent")
    } else if (!is.null(time) && !(identical(time, "seconds") || identical(time, "ticks"))) {
      problems <- unreadable('gives no Time unit GateLabR knows ("seconds" or "ticks")')
    } else if (!is.null(gain) && !(identical(gain, "gating-ml") || identical(gain, "stored"))) {
      problems <- unreadable('gives no gain convention GateLabR knows ("gating-ml" or "stored")')
    }
  }
  readable <- marked && length(problems) == 0L
  list(
    problems = problems,
    marked = marked,
    # Without a mark saying which: a file GateLab or GateLabR wrote is on flowCore's scale, unless
    # its gatelabr_scales is version 4 or later or its about text carries the words above, which
    # only GateLab's files on Gating-ML's scale do; any other file is on the standard's scale.
    logicle_unit = if (identical(logicle, "gating-ml")) {
      TRUE
    } else if (identical(logicle, "flowcore")) {
      FALSE
    } else {
      !.gml_written_by_gatelab(root) || .gml_gatelabr_scales_version(root) >= 4 ||
        grepl(.GML_ABOUT_LOGICLE_SCALE, .gml_about_text(root), fixed = TRUE)
    },
    parent_id_hierarchy = identical(hierarchy, "parent_id"),
    tree = tree,
    # The unit of a Time dimension's coordinates: "seconds", the stored ticks times $TIMESTEP,
    # which GateLab's standard format writes, or "ticks", as stored. Only GateLab's mark says
    # seconds; every other file GateLabR reads in ticks, as it always has.
    time_unit = if (readable && identical(time, "seconds")) "seconds" else "ticks",
    # Whether coordinates are Gating-ML scale values, stored value / $PnG, which GateLab's standard
    # format writes (its mark says "gating-ml"). Every other file is read on stored values.
    scale_values = readable && identical(gain, "gating-ml"),
    # Whether a flog is Gating-ML's own, undefined at or below zero: in GateLab's files from mark
    # version 3 and in files from other writers. GateLab's files before then were written for its
    # older flog, which holds every value below T 10^-M at 0.
    flog_standard = if (marked) readable && isTRUE(version >= 3) else !.gml_written_by_gatelab(root)
  )
}

# GateLab has written its format mark into every file since it stopped writing a GatingHierarchy
# for the standard format (2026-09). A file GateLab or GateLabR wrote that has neither, but
# carries what only the marked format writes, has lost its mark; read by the older rules it would
# have logicle coordinates on flowCore's scale and inferred parents, which is not how it was
# written. What only the marked format writes: gating:parent_id, a gatelab_operand NOT gate,
# gating:use-as-complement, a dimension compensated by a spectrumMatrix of the file, or BooleanGates
# in the standard format with no GatingHierarchy (GateLab's standard format wrote one whenever it
# had a population).
.gml_lost_mark_problems <- function(root, raw_gates, spectra, hierarchy_node, gatelab_format) {
  if (isTRUE(gatelab_format$marked) || !is.null(hierarchy_node) || !.gml_written_by_gatelab(root)) {
    return(character(0))
  }
  ci <- .gml_first_child_local(root, "custom_info")
  about <- if (!is.null(ci)) .gml_first_child_local(.gml_first_child_local(ci, "cytobank") %||% ci, "about") else NULL
  standard <- !is.null(about) && grepl("\\(standard", xml2::xml_text(about))
  found <- character(0)
  if (any(vapply(raw_gates, function(g) !is.null(g$parent_id), logical(1)))) {
    found <- c(found, "gating:parent_id")
  }
  if (any(vapply(raw_gates, function(g) isTRUE(g$operand_helper), logical(1)))) {
    found <- c(found, "a gatelab_operand NOT gate")
  }
  complement_refs <- xml2::xml_find_all(
    root, ".//*[local-name()='gateReference'][@*[local-name()='use-as-complement']]"
  )
  if (length(complement_refs) > 0L) found <- c(found, "gating:use-as-complement")
  spectrum_refs <- unlist(lapply(raw_gates, function(g) {
    vapply(g$dims %||% list(), function(d) trimws(d$compensation_ref %||% ""), character(1))
  }))
  if (any(spectrum_refs %in% names(spectra))) {
    found <- c(found, "dimensions compensated by a spectrumMatrix of the file")
  }
  if (standard && any(vapply(raw_gates, function(g) identical(g$gate_type, "boolean"), logical(1)))) {
    found <- c(found, "standard-format BooleanGates without a GatingHierarchy")
  }
  # GateLab's files on Gating-ML's logicle scale (gatelabr_scales version 4, or the about text's
  # words) are the files whose mark states the Time unit, and its standard format writes Time in
  # seconds, so without the mark a gate on Time could be in either unit.
  about_text <- .gml_about_text(root)
  new_format <- .gml_gatelabr_scales_version(root) >= 4 ||
    grepl(.GML_ABOUT_LOGICLE_SCALE, about_text, fixed = TRUE)
  on_time <- any(unlist(lapply(raw_gates, function(g) {
    vapply(g$dims %||% list(), function(d) .gml_is_time(d$channel), logical(1))
  })))
  if (new_format && on_time && !grepl("Cytobank-compatible", about_text, fixed = TRUE)) {
    found <- c(found, "a gate on Time, whose unit, seconds or ticks, only the mark states")
  }
  if (length(found) == 0L) return(character(0))
  paste0(
    "The file was written by GateLab and carries its marked format's structures (",
    paste(found, collapse = ", "), ") but no GateLab format mark (gatelab_format), so GateLabR ",
    "cannot tell how it places its populations or scales its logicle coordinates."
  )
}

# Numbers as the file writes them, read to the double they name. GateLab writes each number as the
# shortest decimal that reads back as the same double, and R's own reader (as.numeric, scan) does
# not always read such a decimal back: "-10.920000076293945", a float32 event's own value, which
# GateLab writes as a rectangle's edge on it, comes back one unit in the last place below, and the
# event falls outside (57 events of one public file, 2% of 17-digit decimals). A number in
# xs:double's decimal form is read by jsonlite's C parser instead, which rounds correctly; anything
# else (INF, NaN, or text that is no number) is left to as.numeric, as before.
.gml_num <- function(x) {
  if (is.null(x) || length(x) == 0L) return(suppressWarnings(as.numeric(x)))
  x <- as.character(x)
  out <- suppressWarnings(as.numeric(x))
  text <- trimws(x)
  decimal <- !is.na(text) & grepl("^[+-]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)([eE][+-]?[0-9]+)?$", text)
  if (any(decimal)) {
    t <- text[decimal]
    negative <- startsWith(t, "-")
    t <- sub("^[+-]", "", t)
    # JSON's form of the same number: a digit before and after the point, no leading zeros.
    t <- sub("^\\.", "0.", t)
    t <- sub("\\.([eE]|$)", ".0\\1", t)
    t <- sub("^0+([0-9])", "\\1", t)
    t <- ifelse(negative, paste0("-", t), t)
    exact <- tryCatch(
      as.numeric(jsonlite::parse_json(paste0("[", paste(t, collapse = ","), "]"), simplifyVector = TRUE)),
      error = function(e) NULL
    )
    if (length(exact) == length(t)) out[decimal] <- exact
  }
  out
}

.gml_has_num <- function(x) {
  length(x) == 1L && !is.na(x) && is.finite(x)
}

.gml_parse_cytobank_name <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(NULL)
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(NULL)
  nm <- .gml_first_child_local(cb, "name")
  if (is.null(nm)) return(NULL)
  txt <- trimws(xml2::xml_text(nm))
  if (nchar(txt) == 0) NULL else txt
}

.gml_parse_cytobank_definition <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(NULL)
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(NULL)
  def <- .gml_first_child_local(cb, "definition")
  if (is.null(def)) return(NULL)
  txt <- trimws(xml2::xml_text(def))
  if (nchar(txt) == 0) return(NULL)
  tryCatch(jsonlite::fromJSON(txt), error = function(e) NULL)
}

#' Parse GateLab/GateLabR scale and compensation state from custom_info.
.gml_parse_gatelabr_state <- function(root_node) {
  empty <- list(scales = NULL, cytof_cofactor = NULL, compensation = NULL)
  ci <- .gml_first_child_local(root_node, "custom_info")
  if (is.null(ci)) return(empty)
  gs <- .gml_first_child_local(ci, "gatelabr_scales")
  if (is.null(gs)) return(empty)
  def <- .gml_first_child_local(gs, "definition")
  if (is.null(def)) return(empty)
  txt <- trimws(xml2::xml_text(def))
  if (nchar(txt) == 0) return(empty)
  parsed <- tryCatch(
    jsonlite::fromJSON(txt, simplifyVector = FALSE),
    error = function(e) stop("Invalid embedded GateLab scale or compensation metadata.")
  )
  if (!is.list(parsed)) stop("Invalid embedded GateLab scale or compensation metadata.")
  scales <- parsed$channels %||% NULL
  if (!is.null(scales)) {
    if (!is.list(scales)) stop("Invalid embedded GateLab scale state: channel settings are malformed.")
    if (length(scales) > 0L && (is.null(names(scales)) || any(!nzchar(names(scales))))) {
      stop("Invalid embedded GateLab scale state: channel names are malformed.")
    }
    numeric_fields <- c("w", "cofactor", "lo", "hi", "raw_lo", "raw_hi")
    for (ch in names(scales)) {
      entry <- scales[[ch]]
      if (!nzchar(ch) || !is.list(entry)) {
        stop("Invalid embedded GateLab scale state: a channel entry is malformed.")
      }
      for (field in intersect(names(entry), numeric_fields)) {
        value <- suppressWarnings(as.numeric(entry[[field]]))
        if (length(value) != 1L || !is.finite(value)) {
          stop("Invalid embedded GateLab scale state for ", ch, ": ", field, " is not finite.")
        }
        entry[[field]] <- value
      }
      if (!is.null(entry$cofactor) && entry$cofactor <= 0) {
        stop("Invalid embedded GateLab scale state for ", ch, ": cofactor must be positive.")
      }
      if (xor(is.null(entry$raw_lo), is.null(entry$raw_hi)) ||
          (!is.null(entry$raw_lo) && entry$raw_hi <= entry$raw_lo)) {
        stop("Invalid embedded GateLab scale state for ", ch, ": raw range is malformed.")
      }
      scales[[ch]] <- entry
    }
  }
  cytof_cofactor <- parsed$cytof_cofactor %||% NULL
  if (!is.null(cytof_cofactor)) {
    cytof_cofactor <- suppressWarnings(as.numeric(cytof_cofactor))
    if (length(cytof_cofactor) != 1L || !is.finite(cytof_cofactor) || cytof_cofactor <= 0) {
      stop("Invalid embedded GateLab scale state: CyTOF cofactor must be positive.")
    }
  }
  raw <- parsed$compensation
  if (is.null(raw)) {
    return(list(scales = scales, cytof_cofactor = cytof_cofactor, compensation = NULL))
  }
  if (!is.list(raw) || length(raw$enabled) != 1L || !is.logical(raw$enabled) ||
      is.na(raw$enabled)) {
    stop("Invalid embedded GateLab compensation state: enabled must be true or false.")
  }
  reference <- as.character(raw$reference %||% "")
  # From version 4 GateLab writes the reference "dimensions": the matrix is the one the gates were
  # drawn under, as the gates' dimensions reference it, and the record says only whether they were
  # drawn on compensated values. It reads as "FCS" when compensation is enabled, as the record's
  # matrix is then checked against the loaded data's own, and as "uncompensated" when it is not.
  scales_version <- parsed$version
  if (identical(reference, "dimensions") && is.numeric(scales_version) &&
      length(scales_version) == 1L && isTRUE(scales_version >= 4) &&
      length(raw$enabled) == 1L && is.logical(raw$enabled) && !is.na(raw$enabled)) {
    reference <- if (isTRUE(raw$enabled)) "FCS" else "uncompensated"
  }
  if (length(reference) != 1L || !reference %in% c("FCS", "uncompensated")) {
    stop("Invalid embedded GateLab compensation state: unsupported matrix reference.")
  }
  raw_channels <- raw$channels %||% list()
  channels <- if (length(raw_channels) == 0L) character(0) else
    unlist(raw_channels, use.names = FALSE)
  if (!is.character(channels) || anyNA(channels) || any(!nzchar(channels)) ||
      anyDuplicated(channels)) {
    stop("Invalid embedded GateLab compensation state: channel list is malformed.")
  }
  matrix <- NULL
  if (!is.null(raw$matrix)) {
    if (!is.list(raw$matrix) || length(raw$matrix) != length(channels)) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    rows <- lapply(raw$matrix, function(row) suppressWarnings(as.numeric(unlist(row, use.names = FALSE))))
    if (any(vapply(rows, length, integer(1)) != length(channels))) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    matrix <- do.call(rbind, rows)
    if (!is.matrix(matrix) || any(!is.finite(matrix))) {
      stop("Invalid embedded GateLab compensation state: spillover matrix is malformed.")
    }
    dimnames(matrix) <- list(channels, channels)
  }
  enabled <- isTRUE(raw$enabled)
  if (enabled && (!identical(reference, "FCS") || length(channels) < 2L || is.null(matrix))) {
    stop("Invalid embedded GateLab compensation state: enabled compensation requires an FCS spillover matrix.")
  }
  list(
    scales = scales,
    cytof_cofactor = cytof_cofactor,
    compensation = list(
      enabled = enabled,
      reference = reference,
      channels = channels,
      matrix = matrix
    )
  )
}

# Convert a stored scale entry to the current app's display coordinates. Version
# 3 raw endpoints are authoritative; legacy files without them retain the prior
# direct lo/hi behaviour for backwards compatibility within GateLabR.
.gml_scale_range_to_display <- function(entry, channel, is_flow,
                                        raw_channel_vals = NULL,
                                        logicle_w_params = NULL,
                                        scatter_cofactor_params = NULL,
                                        cytof_cofactor = 5) {
  raw_lo <- suppressWarnings(as.numeric(entry$raw_lo %||% NA))
  raw_hi <- suppressWarnings(as.numeric(entry$raw_hi %||% NA))
  if (is.finite(raw_lo) && is.finite(raw_hi) && raw_hi > raw_lo) {
    display <- tryCatch({
      if (isTRUE(is_flow)) {
        flow_transform_channel_values(
          raw_vals = c(raw_lo, raw_hi),
          channel_name = channel,
          raw_channel_vals = raw_channel_vals,
          logicle_w_params = logicle_w_params,
          scatter_cofactor_params = scatter_cofactor_params
        )
      } else if (.is_cytof_raw_channel(channel)) {
        c(raw_lo, raw_hi)
      } else {
        asinh(c(raw_lo, raw_hi) / cytof_cofactor)
      }
    }, error = function(e) c(NA_real_, NA_real_))
    if (length(display) == 2L && all(is.finite(display)) && display[2] > display[1]) {
      return(as.numeric(display))
    }
    return(NULL)
  }

  lo <- suppressWarnings(as.numeric(entry$lo %||% NA))
  hi <- suppressWarnings(as.numeric(entry$hi %||% NA))
  if (is.finite(lo) && is.finite(hi) && hi > lo) c(lo, hi) else NULL
}

.gml_parse_gatelabr_scales <- function(root_node) {
  .gml_parse_gatelabr_state(root_node)$scales
}

#' Extract Cytobank gate_id (primitive gates) or gate_set_id (boolean gates)
.gml_parse_cytobank_ids <- function(node) {
  ci <- .gml_first_child_local(node, "custom_info")
  if (is.null(ci)) return(list())
  cb <- .gml_first_child_local(ci, "cytobank")
  if (is.null(cb)) return(list())
  out <- list()
  gid_el <- .gml_first_child_local(cb, "gate_id")
  if (!is.null(gid_el)) {
    v <- suppressWarnings(as.integer(trimws(xml2::xml_text(gid_el))))
    if (length(v) == 1 && !is.na(v)) out$gate_id <- v
  }
  gsid_el <- .gml_first_child_local(cb, "gate_set_id")
  if (!is.null(gsid_el)) {
    v <- suppressWarnings(as.integer(trimws(xml2::xml_text(gsid_el))))
    if (length(v) == 1 && !is.na(v)) out$gate_set_id <- v
  }
  cid_el <- .gml_first_child_local(cb, "compensation_id")
  if (!is.null(cid_el)) {
    v <- suppressWarnings(as.integer(trimws(xml2::xml_text(cid_el))))
    if (length(v) == 1 && !is.na(v)) out$compensation_id <- v
  }
  out
}

.gml_parse_pop_parent_indices <- function(node) {
  defn <- .gml_parse_cytobank_definition(node)
  if (is.null(defn) || is.null(defn$booleanExpression)) return(integer(0))
  expr <- as.character(defn$booleanExpression)
  if (length(expr) == 0 || !nzchar(expr)) return(integer(0))
  hits <- regmatches(expr, gregexpr("\\bpop_([0-9]+)\\b", expr, perl = TRUE))[[1]]
  if (length(hits) == 0) return(integer(0))
  suppressWarnings(as.integer(sub("^pop_", "", hits)))
}

# A transformation parameter as the file writes it: NULL when absent, NA when it is not a finite
# number as xs:double spells one (R's as.numeric also reads "0x10", " " and "Inf"), else the number.
.GML_XS_DOUBLE_FINITE <- "^\\s*[+-]?([0-9]+(\\.[0-9]*)?|\\.[0-9]+)([eE][+-]?[0-9]+)?\\s*$"
.gml_parameter <- function(node, name) {
  text <- .gml_attr_local(node, name)
  if (is.null(text)) return(NULL)
  value <- if (grepl(.GML_XS_DOUBLE_FINITE, text)) .gml_num(text) else NA_real_
  if (.gml_has_num(value)) value else structure(NA_real_, text = text)
}

# Why a transformation's parameters, as the file writes them, cannot be read: the first one that
# is present but not a finite number, or one required and absent. NULL when all can be read.
.gml_unreadable_parameters <- function(values, required) {
  for (name in names(values)) {
    value <- values[[name]]
    if (is.null(value)) {
      if (name %in% required) return(paste0("gives no ", name))
    } else if (is.na(value)) {
      return(paste0("whose ", name, " is ", encodeString(attr(value, "text"), quote = '"'),
                    ", which is not a finite number"))
    }
  }
  NULL
}

# Every transformation the file declares, by id: list(type, parameters..., bound_min, bound_max).
# A transformation whose parameters or bounds cannot be read is recorded as type "unreadable" with
# `why`, and .gml_transform_problem refuses every gate on it by name: a parameter left at its
# default because the file wrote something else for it, "abc" or "", describes another scale.
# A parameter the file leaves out takes its default (logicle M 4.5 and A 0, fasinh M log10(e) and
# A 0, flin A 0), as GateLab gives it.
.gml_parse_transforms <- function(root_node) {
  out <- list()
  for (el in xml2::xml_children(root_node)) {
    if (!identical(.gml_local_name(el), "transformation")) next
    tr_id <- .gml_attr_local(el, "id")
    if (is.null(tr_id) || !nzchar(tr_id)) next
    unreadable <- function(what, why) list(type = "unreadable", why = paste0(what, " ", why))

    # boundMin and boundMax (Transformations.v2.0.xsd): a value the transformation gives beyond
    # one is held at it before the gate is tested. INF and -INF, as xs:double spells them, are no
    # bound.
    bound <- function(name) {
      text <- .gml_attr_local(el, name)
      if (is.null(text)) return(NULL)
      trimmed <- trimws(text)
      if (trimmed %in% c("INF", "+INF", "-INF")) return(NULL)
      value <- if (grepl(.GML_XS_DOUBLE_FINITE, text)) .gml_num(text) else NA_real_
      if (.gml_has_num(value)) value else structure(NA_real_, text = text)
    }
    bound_min <- bound("boundMin")
    bound_max <- bound("boundMax")
    bound_why <- NULL
    for (b in list(list("boundMin", bound_min), list("boundMax", bound_max))) {
      if (!is.null(b[[2]]) && is.na(b[[2]])) {
        bound_why <- paste0("whose ", b[[1]], " is ", encodeString(attr(b[[2]], "text"), quote = '"'),
                            ", which is not a number")
        break
      }
    }
    if (is.null(bound_why) && !is.null(bound_min) && !is.null(bound_max) && bound_min > bound_max) {
      bound_why <- paste0("whose boundMin ", bound_min, " is above its boundMax ", bound_max)
    }
    with_bounds <- function(def) {
      def$bound_min <- bound_min
      def$bound_max <- bound_max
      def
    }

    # logicle (GateLab's standard format, GateLabR's flow export, FlowJo and FlowKit exports).
    logicle_el <- .gml_first_child_local(el, "logicle")
    if (!is.null(logicle_el)) {
      p <- lapply(stats::setNames(nm = c("T", "W", "M", "A")), function(n) .gml_parameter(logicle_el, n))
      why <- .gml_unreadable_parameters(p, c("T", "W")) %||% bound_why
      out[[tr_id]] <- if (!is.null(why)) unreadable("a logicle", why) else with_bounds(list(
        type = "logicle", T = p$T, W = p$W, M = p$M %||% 4.5, A = p$A %||% 0
      ))
      next
    }

    # fasinh (Gating-ML 2.0 section 6.3), and the arcsinh older exports wrote:
    #   f(x) = (arcsinh(x sinh(M ln 10) / T) + A ln 10) / ((M + A) ln 10)
    fasinh_el <- .gml_first_child_local(el, "fasinh") %||% .gml_first_child_local(el, "arcsinh")
    if (!is.null(fasinh_el)) {
      p <- lapply(stats::setNames(nm = c("T", "M", "A")), function(n) .gml_parameter(fasinh_el, n))
      why <- .gml_unreadable_parameters(p, "T") %||% bound_why
      out[[tr_id]] <- if (!is.null(why)) unreadable("an arcsinh (fasinh)", why) else with_bounds(list(
        type = "fasinh", T = p$T, M = p$M %||% log10(exp(1)), A = p$A %||% 0
      ))
      next
    }

    # flog (section 6.2): f(x) = log10(x / T) / M + 1, undefined at and below zero. Cytobank
    # writes it for a Log scale, and GateLab for a FlowJo log axis and a log axis of its own.
    flog_el <- .gml_first_child_local(el, "flog") %||% .gml_first_child_local(el, "log")
    if (!is.null(flog_el)) {
      p <- lapply(stats::setNames(nm = c("T", "M")), function(n) .gml_parameter(flog_el, n))
      why <- .gml_unreadable_parameters(p, c("T", "M")) %||% bound_why
      out[[tr_id]] <- if (!is.null(why)) unreadable("a flog", why) else with_bounds(list(
        type = "flog", T = p$T, M = p$M
      ))
      next
    }

    # flin, Gating-ML 2.0's linear scale (section 6.1): f(x) = (x + A) / (T + A). Its inverse is
    # affine, so a gate on it is the same shape in raw values.
    flin_el <- .gml_first_child_local(el, "flin")
    if (!is.null(flin_el)) {
      p <- lapply(stats::setNames(nm = c("T", "A")), function(n) .gml_parameter(flin_el, n))
      why <- .gml_unreadable_parameters(p, "T") %||% bound_why
      out[[tr_id]] <- if (!is.null(why)) unreadable("a flin", why) else with_bounds(list(
        type = "flin", T = p$T, A = p$A %||% 0
      ))
    }
  }
  out
}

# Why a transformation (.gml_parse_transforms) has no map GateLabR can take its coordinates
# through, or NULL when it has one. .gml_declared_map read such a logicle as the identity, since
# flowCore refuses to build it, and such a fasinh as the identity or, when M + A is not positive,
# as a map that is constant or decreasing, so a gate on it selected other events than the file
# defines.
#   logicle: T > 0, M > 0, 0 <= W <= M / 2 and -W <= A <= M - 2W (Gating-ML 2.0 section 6.4.3, and
#     what flowCore's logicle accepts; it evaluates a negative A down to -W exactly).
#   fasinh: T > 0, M > 0 and M + A > 0, which make its inverse, T / sinh(M ln 10) sinh(y (M + A)
#     ln 10 - A ln 10), increasing, and sinh(M ln 10), (M + A) ln 10 and T / sinh(M ln 10) finite
#     and not zero in double precision, without which the inverse is 0 or undefined everywhere.
#   flog: T > 0 and M > 0. flin: T > 0 and 0 <= A <= T.
.gml_transform_problem <- function(tr_def) {
  if (!is.list(tr_def)) return(NULL)
  if (identical(tr_def$type, "unreadable")) return(tr_def$why)
  t_v <- tr_def$T
  m_v <- tr_def$M
  a_v <- tr_def$A
  if (identical(tr_def$type, "logicle")) {
    w_v <- tr_def$W
    why <- if (!(t_v > 0)) "T is not positive"
      else if (!(m_v > 0)) "M is not positive"
      else if (!(w_v >= 0)) "W is negative"
      else if (w_v > m_v / 2) "W is greater than M / 2"
      else if (a_v < -w_v) "A is less than -W"
      else if (a_v > m_v - 2 * w_v) "A is greater than M - 2W"
    if (is.null(why)) return(NULL)
    return(paste0("a logicle with T = ", t_v, ", W = ", w_v, ", M = ", m_v, " and A = ", a_v, ", whose ", why))
  }
  if (identical(tr_def$type, "fasinh")) {
    why <- if (!(t_v > 0)) "T is not positive"
      else if (!(m_v > 0)) "M is not positive"
      else if (!(m_v + a_v > 0)) "M + A is not positive"
      else if (!is.finite(sinh(m_v * log(10)))) "sinh(M ln 10) overflows double precision"
      else if (!is.finite((m_v + a_v) * log(10))) "(M + A) ln 10 overflows double precision"
      else if (!(t_v / sinh(m_v * log(10)) > 0)) "T / sinh(M ln 10) is zero in double precision"
    if (is.null(why)) return(NULL)
    return(paste0("an arcsinh (fasinh) with T = ", t_v, ", M = ", m_v, " and A = ", a_v, ", whose ", why))
  }
  if (identical(tr_def$type, "flog")) {
    why <- if (!(t_v > 0)) "T is not positive" else if (!(m_v > 0)) "M is not positive"
    if (is.null(why)) return(NULL)
    return(paste0("a flog with T = ", t_v, " and M = ", m_v, ", whose ", why))
  }
  if (identical(tr_def$type, "flin")) {
    why <- if (!(t_v > 0)) "T is not positive" else if (!(a_v >= 0 && a_v <= t_v)) "A is not between 0 and T"
    if (is.null(why)) return(NULL)
    return(paste0("a flin with T = ", t_v, " and A = ", a_v, ", whose ", why))
  }
  NULL
}

# Whether a dimension is FCS Time: the parameter FlowKit, FlowJo and GateLab scale by $TIMESTEP,
# found by its $PnN, "Time" in any case.
.gml_is_time <- function(channel) {
  !is.null(channel) && length(channel) == 1L && grepl("^time$", trimws(channel), ignore.case = TRUE)
}

.gml_parse_dimensions <- function(gate_node) {
  dims <- list()
  for (dim in .gml_children_local(gate_node, "dimension")) {
    param <- .gml_first_child_local(dim, "fcs-dimension")
    if (is.null(param)) param <- .gml_first_child_local(dim, "parameter")
    if (is.null(param)) next
    ch <- .gml_attr_local(param, "name")
    if (is.null(ch) || !nzchar(ch)) next
    d <- list(channel = ch)

    tr_ref <- .gml_attr_local(dim, "transformation-ref")
    if (!is.null(tr_ref) && nzchar(tr_ref)) d$transformation_ref <- tr_ref
    comp_ref <- .gml_attr_local(dim, "compensation-ref")
    if (!is.null(comp_ref) && nzchar(comp_ref)) d$compensation_ref <- comp_ref

    mn <- .gml_num(.gml_attr_local(dim, "min"))
    mx <- .gml_num(.gml_attr_local(dim, "max"))
    if (.gml_has_num(mn)) d$min <- mn
    if (.gml_has_num(mx)) d$max <- mx

    if (is.null(d$min) || is.null(d$max)) {
      for (sub_el in xml2::xml_children(dim)) {
        tag <- .gml_local_name(sub_el)
        if (!tag %in% c("min", "max")) next
        val <- .gml_num(.gml_attr_local(sub_el, "value"))
        if (!.gml_has_num(val)) next
        if (identical(tag, "min") && is.null(d$min)) d$min <- val
        if (identical(tag, "max") && is.null(d$max)) d$max <- val
      }
    }
    dims[[length(dims) + 1L]] <- d
  }
  dims
}

# Every Gating-ML 2.0 spectrumMatrix at the top level of the file (specification section 7), by
# id. A matrix is n fluorochromes (rows) by m detectors (columns), and GateLabR compensates with a
# square spillover matrix whose i-th fluorochrome is the i-th detector compensated, as GateLab and
# FlowKit read one. An unmixing matrix, an incomplete one, or one marked as already inverted that
# cannot be inverted back is recorded as a problem, which stops the import only when a dimension
# references that matrix: GateLab's Cytobank format carries a matrix no dimension references.
.gml_parse_spectrum_matrices <- function(root_node) {
  out <- list()
  for (el in xml2::xml_children(root_node)) {
    if (!identical(.gml_local_name(el), "spectrumMatrix")) next
    id <- .gml_attr_local(el, "id")
    if (is.null(id) || !nzchar(id)) next
    names_in <- function(group) {
      g <- .gml_first_child_local(el, group)
      if (is.null(g)) return(character(0))
      vapply(as.list(.gml_children_local(g, "fcs-dimension")), function(d) {
        .gml_attr_local(d, "name") %||% ""
      }, character(1))
    }
    fluorochromes <- names_in("fluorochromes")
    detectors <- names_in("detectors")
    rows <- lapply(as.list(.gml_children_local(el, "spectrum")), function(row) {
      vapply(as.list(.gml_children_local(row, "coefficient")), function(coef) {
        value <- .gml_num(.gml_attr_local(coef, "value"))
        if (length(value) == 1L) value else NA_real_
      }, numeric(1))
    })
    label <- ""
    ci <- .gml_first_child_local(el, "custom_info")
    cb <- if (!is.null(ci)) .gml_first_child_local(ci, "cytobank") else NULL
    label_node <- if (!is.null(cb)) .gml_first_child_local(cb, "cytobank_compensation_name") else NULL
    if (!is.null(label_node)) label <- trimws(xml2::xml_text(label_node))
    # The id Cytobank's gates name this matrix by, in their custom_info compensation_id.
    id_node <- if (!is.null(cb)) .gml_first_child_local(cb, "cytobank_compensation_id") else NULL
    cytobank_id <- if (!is.null(id_node)) suppressWarnings(as.integer(trimws(xml2::xml_text(id_node)))) else NA_integer_

    n <- length(detectors)
    matrix <- NULL
    problem <- NULL
    if (any(!nzchar(detectors))) {
      problem <- paste0("Spillover matrix ", id, " has an unnamed detector.")
    } else if (length(fluorochromes) != n) {
      problem <- paste0(
        "Spillover matrix ", id, " unmixes ", length(fluorochromes), " fluorochromes from ",
        n, " detectors; GateLabR compensates with a square spillover matrix only."
      )
    } else if (n < 2L || length(rows) != n ||
               any(vapply(rows, function(r) length(r) != n || any(!is.finite(r)), logical(1)))) {
      problem <- paste0(
        "Spillover matrix ", id, " is not a complete ", n, " by ", n, " matrix of numbers."
      )
    } else {
      matrix <- do.call(rbind, rows)
      inverted <- tolower(trimws(.gml_attr_local(el, "matrix-inverted-already") %||% "false"))
      if (identical(inverted, "true")) {
        # The file gives the compensation matrix itself; GateLabR holds the spillover.
        matrix <- tryCatch(solve(matrix), error = function(e) NULL)
        if (is.null(matrix) || any(!is.finite(matrix))) {
          matrix <- NULL
          problem <- paste0(
            "Spillover matrix ", id,
            " is marked as already inverted but cannot be inverted back."
          )
        }
      }
      if (!is.null(matrix)) dimnames(matrix) <- list(detectors, detectors)
    }
    out[[id]] <- list(
      id = id,
      name = if (nzchar(label)) label else id,
      detectors = detectors,
      fluorochromes = fluorochromes,
      matrix = matrix,
      problem = problem,
      cytobank_id = if (length(cytobank_id) == 1L) cytobank_id else NA_integer_
    )
  }
  out
}

# Name each dimension compensated by a matrix the file defines by its detector ($PnN), the name
# GateLabR's channels answer to. Gating-ML names such a dimension by the matrix's fluorochrome
# (section 4.2.2), and fluorochrome i is detector i compensated; GateLab writes them as
# "Comp_<$PnN>". A detector name is taken as it is, as GateLab and FlowKit take it.
.gml_resolve_spectrum_dimensions <- function(raw_gates, spectra) {
  for (id in names(raw_gates)) {
    g <- raw_gates[[id]]
    if (identical(g$gate_type, "boolean") || length(g$dims %||% list()) == 0L) next
    for (i in seq_along(g$dims)) {
      d <- g$dims[[i]]
      sp <- spectra[[trimws(d$compensation_ref %||% "")]]
      if (is.null(sp) || !is.null(sp$problem) || d$channel %in% sp$detectors) next
      hit <- match(d$channel, sp$fluorochromes)
      if (!is.na(hit)) g$dims[[i]]$channel <- sp$detectors[[hit]]
    }
    g$x_channel <- g$dims[[1]]$channel
    g$y_channel <- (if (length(g$dims) >= 2L) g$dims[[2]] else g$dims[[1]])$channel
    g$channels <- c(g$x_channel, g$y_channel)
    raw_gates[[id]] <- g
  }
  raw_gates
}

# Take a Cytobank gate's named compensation as its dimensions' matrix. Cytobank writes
# compensation-ref="FCS" on every compensated dimension, whatever matrix the gate was drawn under,
# and says which in the gate's custom_info compensation_id: -2 uncompensated, 0 the FCS file's own
# matrix, and a positive id a named compensation, which the export carries as a spectrumMatrix
# with that cytobank_compensation_id. GateLab's Cytobank format does the same for gates drawn under
# a matrix that is not the FCS file's own. Read as "FCS", such a gate was evaluated with the FCS
# file's matrix. A positive id with no such spectrumMatrix names a matrix the file does not carry,
# and a gate on it is refused by name: the FCS file's matrix is never applied in its place.
# Returns list(raw_gates, problems).
.gml_adopt_cytobank_compensation_ids <- function(raw_gates, spectra) {
  by_id <- list()
  for (sp in spectra) {
    if (!is.na(sp$cytobank_id) && sp$cytobank_id > 0L) by_id[[as.character(sp$cytobank_id)]] <- sp$id
  }
  problems <- character(0)
  for (id in names(raw_gates)) {
    g <- raw_gates[[id]]
    cid <- g$compensation_id
    if (identical(g$gate_type, "boolean") || is.null(cid) || cid <= 0L) next
    matrix_id <- by_id[[as.character(cid)]]
    compensated <- FALSE
    for (i in seq_along(g$dims)) {
      if (!identical(tolower(trimws(g$dims[[i]]$compensation_ref %||% "")), "fcs")) next
      compensated <- TRUE
      if (!is.null(matrix_id)) g$dims[[i]]$compensation_ref <- matrix_id
    }
    if (compensated && is.null(matrix_id)) {
      problems <- c(problems, paste0(
        "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") was drawn under Cytobank compensation ",
        cid, ", which the file does not carry as a spectrumMatrix; GateLabR does not apply the ",
        "FCS file's own matrix in its place."
      ))
    }
    raw_gates[[id]] <- g
  }
  list(raw_gates = raw_gates, problems = problems)
}

# What the gates' dimensions compensate with: "FCS", "uncompensated", or "matrix" for a
# spectrumMatrix the file defines, which is returned as `spectrum`. GateLabR applies one matrix,
# so dimensions that reference two matrices, or the FCS file's and one of the file's own, are
# refused, as GateLab and FlowKit refuse them.
.gml_dimension_compensation <- function(raw_gates, spectra = list()) {
  refs <- character(0)
  unsupported <- character(0)
  used <- character(0)
  for (g in raw_gates) {
    if (identical(g$gate_type, "boolean")) next
    for (d in g$dims %||% list()) {
      value <- trimws(as.character(d$compensation_ref %||% ""))
      if (!nzchar(value)) next
      lower <- tolower(value)
      if (identical(lower, "fcs")) refs <- c(refs, "FCS")
      else if (identical(lower, "uncompensated")) refs <- c(refs, "uncompensated")
      else if (!is.null(spectra[[value]])) {
        refs <- c(refs, "matrix")
        used <- c(used, value)
      }
      else unsupported <- c(unsupported, value)
    }
  }
  unsupported <- unique(unsupported)
  if (length(unsupported) > 0L) {
    stop(
      "This Gating-ML file references unsupported compensation matrix ",
      paste(sprintf('"%s"', unsupported), collapse = ", "),
      ". GateLabR can safely import FCS or uncompensated dimensions, or dimensions compensated ",
      "by a spillover matrix the file defines."
    )
  }
  used <- unique(used)
  for (id in used) {
    if (!is.null(spectra[[id]]$problem)) stop(spectra[[id]]$problem)
  }
  refs <- unique(refs)
  if (length(used) > 1L || (length(used) == 1L && "FCS" %in% refs)) {
    stop(
      "This Gating-ML file compensates its gates with more than one spillover matrix (",
      paste(c(if ("FCS" %in% refs) "FCS", used), collapse = ", "),
      "); GateLabR applies one matrix."
    )
  }
  list(refs = refs, spectrum = if (length(used) == 1L) spectra[[used]] else NULL)
}

.gml_parse_compensation_refs <- function(raw_gates, spectra = list()) {
  .gml_dimension_compensation(raw_gates, spectra)$refs
}

.gml_compensation_matrices_match <- function(expected, actual, tolerance = 1e-8) {
  if (is.null(expected$matrix) || !is.matrix(expected$matrix) || !is.matrix(actual)) return(FALSE)
  channels <- as.character(expected$channels %||% character(0))
  actual_channels <- colnames(actual)
  actual_rows <- rownames(actual)
  if (length(channels) != ncol(actual) || is.null(actual_channels) || is.null(actual_rows) ||
      !setequal(channels, actual_channels) || !setequal(channels, actual_rows)) return(FALSE)
  aligned <- actual[channels, channels, drop = FALSE]
  if (!identical(dim(aligned), dim(expected$matrix)) || any(!is.finite(aligned))) return(FALSE)
  delta <- abs(expected$matrix - aligned)
  scale <- pmax(1, abs(expected$matrix), abs(aligned))
  all(delta <= tolerance * scale)
}

# Whether the loaded data's spillover matrix is exactly the one a file's compensated dimensions
# reference (spectrum_matrix as import_gatingml_from_cytobank returns it, over display channels).
.gml_spectrum_matches_session <- function(spectrum_matrix, spillover_matrix) {
  if (is.null(spectrum_matrix) || is.null(spillover_matrix)) return(FALSE)
  channels <- spectrum_matrix$channels
  if (anyNA(channels) || anyDuplicated(channels)) return(FALSE)
  .gml_compensation_matrices_match(
    list(channels = channels, matrix = spectrum_matrix$matrix),
    spillover_matrix
  )
}

.gml_stop_spectrum_mismatch <- function(spectrum_matrix, spillover_matrix) {
  label <- spectrum_matrix$name %||% spectrum_matrix$id %||% "a spillover matrix"
  missing <- spectrum_matrix$detectors[is.na(spectrum_matrix$channels)]
  stop(
    "This Gating-ML file compensates its gates with the spillover matrix it defines (",
    .gml_quote_name(label), "), ",
    if (length(missing) > 0L) {
      paste0(
        "whose detector(s) ", paste(vapply(missing, .gml_quote_name, character(1)), collapse = ", "),
        " are not channels of the loaded data"
      )
    } else if (is.null(spillover_matrix)) {
      "but the loaded data have no spillover matrix"
    } else {
      "which is not the loaded FCS file's spillover matrix"
    },
    ". GateLabR compensates with the FCS file's own matrix only, so import was stopped to ",
    "prevent changed population membership.",
    call. = FALSE
  )
}

#' Resolve the compensation state required to preserve imported gate membership.
#'
#' `spectrum_matrix` is the matrix the file defines and its compensated dimensions reference
#' (import_gatingml_from_cytobank()$spectrum_matrix). GateLabR can evaluate such gates only
#' when the loaded data's own matrix is exactly that one.
resolve_gatingml_compensation <- function(compensation, dimension_refs,
                                          is_flow, spillover_matrix = NULL,
                                          spectrum_matrix = NULL) {
  none <- list(target = NULL, source = "none", requires_confirmation = FALSE)
  if (!isTRUE(is_flow)) return(none)

  if (!is.null(compensation)) {
    if (!isTRUE(compensation$enabled)) {
      if ("FCS" %in% dimension_refs || "matrix" %in% dimension_refs) {
        stop("The embedded GateLab compensation state contradicts the Gating-ML dimension references.")
      }
      return(list(target = FALSE, source = "embedded", requires_confirmation = FALSE))
    }
    if (is.null(spillover_matrix)) {
      stop("This gating strategy was created with FCS spillover compensation enabled, but the loaded FCS has no usable spillover matrix.")
    }
    if (!.gml_compensation_matrices_match(compensation, spillover_matrix)) {
      stop("This gating strategy was created with a different FCS spillover matrix. Import was stopped to prevent changed population membership.")
    }
    if ("matrix" %in% dimension_refs &&
        !.gml_spectrum_matches_session(spectrum_matrix, spillover_matrix)) {
      .gml_stop_spectrum_mismatch(spectrum_matrix, spillover_matrix)
    }
    return(list(target = TRUE, source = "embedded", requires_confirmation = FALSE))
  }

  if ("matrix" %in% dimension_refs) {
    if (!.gml_spectrum_matches_session(spectrum_matrix, spillover_matrix)) {
      .gml_stop_spectrum_mismatch(spectrum_matrix, spillover_matrix)
    }
    return(list(target = TRUE, source = "matrix", requires_confirmation = FALSE))
  }

  if ("FCS" %in% dimension_refs) {
    if (is.null(spillover_matrix)) {
      stop("This Gating-ML file requires FCS spillover compensation, but the loaded FCS has no usable spillover matrix.")
    }
    return(list(target = TRUE, source = "dimensions", requires_confirmation = TRUE))
  }
  if ("uncompensated" %in% dimension_refs) {
    return(list(target = FALSE, source = "dimensions", requires_confirmation = FALSE))
  }
  none
}

.gml_normalize_channel <- function(ch) {
  s <- trimws(ch)
  s <- gsub("[()]", "", s)
  s <- gsub("Di", "", s, ignore.case = TRUE)

  # Prefer isotope-like tokens found anywhere in the label, e.g.
  # "CD3 (Y89Di)" -> y89, "140Ce_Beads" -> ce140.
  all_hits <- unlist(regmatches(s, gregexpr("[A-Za-z]{1,3}[0-9]{2,3}|[0-9]{2,3}[A-Za-z]{1,3}", s, perl = TRUE)))
  if (length(all_hits) > 0) {
    for (tok in all_hits) {
      if (grepl("^[A-Za-z]{1,3}[0-9]{2,3}$", tok, perl = TRUE)) {
        parts <- regmatches(tok, regexec("^([A-Za-z]{1,3})([0-9]{2,3})$", tok, perl = TRUE))[[1]]
        if (length(parts) >= 3) return(paste0(tolower(parts[2]), parts[3]))
      }
      if (grepl("^[0-9]{2,3}[A-Za-z]{1,3}$", tok, perl = TRUE)) {
        parts <- regmatches(tok, regexec("^([0-9]{2,3})([A-Za-z]{1,3})$", tok, perl = TRUE))[[1]]
        if (length(parts) >= 3) return(paste0(tolower(parts[3]), parts[2]))
      }
    }
  }

  compact <- gsub("[^A-Za-z0-9]", "", s)
  m1 <- regexec("^([A-Za-z]{1,3})([0-9]{2,3})$", compact, perl = TRUE)
  p1 <- regmatches(compact, m1)[[1]]
  if (length(p1) >= 3) return(paste0(tolower(p1[2]), p1[3]))

  m2 <- regexec("^([0-9]{2,3})([A-Za-z]{1,3})$", compact, perl = TRUE)
  p2 <- regmatches(compact, m2)[[1]]
  if (length(p2) >= 3) return(paste0(tolower(p2[3]), p2[2]))

  tolower(gsub("[^a-z0-9]", "", ch))
}

.gml_guess_pnn_map_from_channels <- function(session_channels) {
  if (is.null(session_channels) || length(session_channels) == 0) return(list())
  out <- list()

  for (ch in session_channels) {
    text <- as.character(ch)
    hits <- unlist(regmatches(text, gregexpr("[A-Za-z]{1,3}[0-9]{2,3}Di|[0-9]{2,3}[A-Za-z]{1,3}Di|[A-Za-z]{1,3}[0-9]{2,3}|[0-9]{2,3}[A-Za-z]{1,3}", text, perl = TRUE)))
    if (length(hits) == 0) next
    for (tok in hits) {
      tok_clean <- gsub("[^A-Za-z0-9]", "", tok)
      if (!nzchar(tok_clean)) next
      out[[tok_clean]] <- text
      out[[gsub("Di$", "", tok_clean, ignore.case = TRUE)]] <- text
    }
  }

  if (length(out) == 0) return(list())
  out[!duplicated(names(out))]
}

.gml_resolve_channel <- function(ch, session_channels, pnn_to_channel = NULL) {
  if (ch %in% session_channels) return(ch)

  if ((is.list(pnn_to_channel) || is.vector(pnn_to_channel)) && length(pnn_to_channel)) {
    # exact $PnN key match
    if (!is.null(names(pnn_to_channel)) && ch %in% names(pnn_to_channel)) {
      mapped <- unname(pnn_to_channel[[ch]])
      if (!is.null(mapped) && mapped %in% session_channels) return(mapped)
    }
    # normalized key match: tolerate metal-name format variants between the
    # GatingML $PnN (e.g. "Pr141Di") and the map keys (e.g. "141Pr").
    nn_ch <- .gml_normalize_channel(ch)
    if (nzchar(nn_ch) && !is.null(names(pnn_to_channel))) {
      knorm <- vapply(names(pnn_to_channel), .gml_normalize_channel, character(1))
      hit <- which(knorm == nn_ch)
      for (h in hit) {
        mapped <- unname(pnn_to_channel[[h]])
        if (!is.null(mapped) && mapped %in% session_channels) return(mapped)
      }
    }
  }

  low_map <- setNames(session_channels, tolower(session_channels))
  key_ci <- tolower(ch)
  ci <- if (key_ci %in% names(low_map)) unname(low_map[[key_ci]]) else NULL
  if (!is.null(ci) && nzchar(ci)) return(ci)

  norm_map <- setNames(session_channels, vapply(session_channels, .gml_normalize_channel, character(1)))
  nn <- .gml_normalize_channel(ch)
  nm <- if (nn %in% names(norm_map)) unname(norm_map[[nn]]) else NULL
  if (!is.null(nm) && nzchar(nm)) return(nm)

  NULL
}

# The inverter for a coordinate GateLabR takes as it is. .gml_axis_map returns this one function
# whenever it inverts nothing.
.gml_identity_inverter <- function(v) v

.gml_identity_map <- function() {
  list(inverse = .gml_identity_inverter, forward = .gml_identity_inverter, kind = "identity",
       lower = -Inf, upper = Inf)
}

# A transformation's own map between the coordinates it declares and raw values:
#   inverse: declared coordinate -> raw value; forward: raw value -> declared coordinate;
#   kind:    "identity", "affine" (a x + b, so a straight edge stays straight), or "curved" (a
#            straight edge in the declared space is a curve in raw values);
#   lower, upper: the raw values an edge with no bound reaches, below and above: -Inf and Inf,
#            except flog's lower, 0, the least value flog is defined at (it gives -Inf there).
# No transformation (NULL) is raw values already.
.gml_declared_map <- function(tr_def, logicle_unit = FALSE) {
  identity_map <- .gml_identity_map()
  if (is.null(tr_def)) return(identity_map)

  # flin: x = y (T + A) - A.
  if (is.list(tr_def) && identical(tr_def$type, "flin")) {
    span <- tr_def$T + tr_def$A
    offset <- tr_def$A
    return(list(
      inverse = function(v) as.numeric(v) * span - offset,
      forward = function(v) (as.numeric(v) + offset) / span,
      kind = "affine", lower = -Inf, upper = Inf
    ))
  }

  # flog, Gating-ML 2.0's log scale (section 6.2): f(x) = log10(x / T) / M + 1, so x = T
  # 10^((y - 1) M). It is undefined at and below zero: FlowKit and flowCore give -Inf at 0 and NaN
  # below, so an event below zero is in no gate, and one at zero only in a range with no lower
  # bound, which is not tested.
  if (is.list(tr_def) && identical(tr_def$type, "flog")) {
    t_v <- tr_def$T
    m_v <- tr_def$M
    return(list(
      inverse = function(v) t_v * 10^((as.numeric(v) - 1) * m_v),
      forward = function(v) suppressWarnings(log10(as.numeric(v) / t_v)) / m_v + 1,
      kind = "curved", lower = 0, upper = Inf
    ))
  }

  # Logicle transform (from GateLabR flow export or FlowJo): apply logicle inverse
  # to convert vertices from logicle display space to raw space for evaluation.
  # flowCore's logicle maps the top of scale T to M, and Gating-ML's maps it to 1: a flowCore
  # value is the Gating-ML value times M, whatever A is. A file on Gating-ML's scale is
  # rescaled before flowCore inverts it.
  if (is.list(tr_def) && identical(tr_def$type, "logicle")) {
    t_v <- tr_def$T;  w_v <- tr_def$W
    m_v <- tr_def$M %||% 4.5;  a_v <- tr_def$A %||% 0.0
    if (!is.finite(t_v) || !is.finite(w_v) || t_v <= 0 || w_v < 0) return(identity_map)
    if (!requireNamespace("flowCore", quietly = TRUE)) return(identity_map)
    to_flowcore <- if (isTRUE(logicle_unit)) m_v else 1
    lg <- tryCatch(
      flowCore::logicleTransform("lg_fwd", w = w_v, t = t_v, m = m_v, a = a_v),
      error = function(e) NULL
    )
    if (is.null(lg)) return(identity_map)
    inv_lg <- flowCore::inverseLogicleTransform(lg, transformationId = "lg_inv")
    return(list(
      inverse = function(v) {
        tryCatch(as.numeric(inv_lg(as.numeric(v) * to_flowcore)), error = function(e) as.numeric(v))
      },
      forward = function(v) as.numeric(lg(as.numeric(v))) / to_flowcore,
      kind = "curved", lower = -Inf, upper = Inf
    ))
  }

  # Gating-ML 2.0 fasinh (section 6.3; flowutils and FlowKit compute the same):
  #     f(x) = (arcsinh(x*sinh(M*ln10)/T) + A*ln10) / ((M+A)*ln10)
  # Inverse:
  #     f^-1(y) = T/sinh(M*ln10) * sinh(y*(M+A)*ln10 - A*ln10)
  if (is.list(tr_def) && identical(tr_def$type, "fasinh")) {
    t_v <- suppressWarnings(as.numeric(tr_def$T))
    m_v <- suppressWarnings(as.numeric(tr_def$M %||% log10(exp(1))))
    a_v <- suppressWarnings(as.numeric(tr_def$A %||% 0))
    if (!is.finite(t_v) || t_v <= 0 || !is.finite(m_v) || m_v <= 0) {
      return(identity_map)
    }
    if (!is.finite(a_v)) a_v <- 0
    ln10  <- log(10)
    denom <- sinh(m_v * ln10)
    if (!is.finite(denom) || denom == 0) return(identity_map)
    cf_eff <- t_v / denom
    k1 <- (m_v + a_v) * ln10
    k0 <- a_v * ln10
    return(list(
      inverse = function(v) cf_eff * sinh(as.numeric(v) * k1 - k0),
      forward = function(v) (asinh(as.numeric(v) / cf_eff) + k0) / k1,
      kind = "curved", lower = -Inf, upper = Inf
    ))
  }

  # Legacy fallback: plain numeric T (old saved state or unknown format).
  # Compute the proper Gating-ML 2.0 inverse just in case.
  cf <- suppressWarnings(as.numeric(if (is.list(tr_def)) tr_def$T else tr_def))
  if (.gml_has_num(cf) && cf > 0) {
    # For legacy data where Gaussian channels might still be raw in exprs,
    # compute the effective cofactor = T / sinh(M * ln(10)) and invert.
    return(list(
      inverse = function(v) cf * sinh(as.numeric(v)),
      forward = function(v) asinh(as.numeric(v) / cf),
      kind = "curved", lower = -Inf, upper = Inf
    ))
  }
  identity_map
}

# A map whose raw values are the file's, taken to the values GateLabR stores by `scale`: NULL for
# none, or list(to_stored, to_file), each increasing. GateLab's standard format writes Time in
# seconds, stored ticks times $TIMESTEP, and every other coordinate as a Gating-ML scale value,
# stored value / $PnG; a declared transform is then of those values, so the stored value is the
# transform's inverse taken back by the same factor.
.gml_scaled_map <- function(map, scale) {
  if (is.null(scale)) return(map)
  list(
    inverse = function(v) scale$to_stored(map$inverse(v)),
    forward = function(v) map$forward(scale$to_file(as.numeric(v))),
    kind = if (identical(map$kind, "identity")) "affine" else map$kind,
    lower = scale$to_stored(map$lower),
    upper = scale$to_stored(map$upper)
  )
}

# Whether a transformation is arcsinh(x / cofactor) exactly: fasinh with A = 0, (M + A) ln 10 = 1
# and T / sinh(M ln 10) = cofactor, as GateLab, GateLabR and Cytobank write a mass cytometry
# arcsinh.
.gml_is_data_arcsinh <- function(tr_def, cofactor) {
  if (!is.list(tr_def) || !identical(tr_def$type, "fasinh")) return(FALSE)
  if (!is.null(tr_def$bound_min) || !is.null(tr_def$bound_max)) return(FALSE)
  t_v <- suppressWarnings(as.numeric(tr_def$T))
  m_v <- suppressWarnings(as.numeric(tr_def$M %||% log10(exp(1))))
  a_v <- suppressWarnings(as.numeric(tr_def$A %||% 0))
  if (!all(is.finite(c(t_v, m_v, a_v, cofactor))) || cofactor <= 0) return(FALSE)
  abs(a_v) <= 1e-12 && abs(m_v * log(10) - 1) <= 1e-9 &&
    abs(t_v / sinh(m_v * log(10)) / cofactor - 1) <= 1e-9
}

# Mass cytometry: GateLabR gates every channel on arcsinh(x / cofactor) except Time,
# Event_length, Cell_length and file_number, which stay raw (transform_matrix_by_instrument).
# A coordinate is taken from the space its dimension declares to raw values, then to the data's
# arcsinh. A dimension already on the data's arcsinh is taken as it is; any other (raw values, an
# arcsinh of another cofactor, logicle, flin) is curved, since arcsinh is.
.gml_cytof_axis_map <- function(channel, tr_def, logicle_unit, cofactor, scale = NULL) {
  raw_channel <- if (exists(".is_cytof_raw_channel", mode = "function")) {
    isTRUE(.is_cytof_raw_channel(channel))
  } else {
    grepl("^(time|event_length|cell_length|file_number)$", channel, ignore.case = TRUE)
  }
  declared <- .gml_scaled_map(.gml_declared_map(tr_def, logicle_unit), scale)
  if (raw_channel) return(declared)
  if (is.null(scale) && .gml_is_data_arcsinh(tr_def, cofactor)) return(.gml_identity_map())
  list(
    inverse = function(v) asinh(declared$inverse(v) / cofactor),
    forward = function(v) declared$forward(cofactor * sinh(as.numeric(v))),
    kind = "curved",
    lower = asinh(declared$lower / cofactor),
    upper = asinh(declared$upper / cofactor)
  )
}

# How one dimension's coordinates, in the space the file declares for it, become the values
# GateLabR stores for its channel, and back: a list(inverse, forward, kind) as .gml_declared_map
# gives, where "raw" is instead the values GateLabR gates on.
#
# logicle_unit: whether the file's logicle coordinates are on Gating-ML's [0, 1] scale rather than
# flowCore's (see .gml_parse_gatelab_format). instrument: "flow" when the gates will be evaluated
# on flow data, whose gates GateLabR stores in raw values; "cytof" when they will be evaluated on
# mass cytometry data held as arcsinh(x / cytof_cofactor) (.gml_cytof_axis_map); NULL keeps the
# behaviour this function had before it was given one. scale: how the file's raw values become
# the stored ones, for Time in seconds and scale values (.gml_scaled_map); NULL for none.
.gml_axis_map <- function(resolved_channel, trans_ref, transforms_map,
                          logicle_unit = FALSE, instrument = NULL, cytof_cofactor = 5,
                          scale = NULL) {
  identity_map <- .gml_identity_map()
  if (is.null(resolved_channel) || !nzchar(resolved_channel)) return(identity_map)

  # A barcode channel is read like any other: mass cytometry data hold it as arcsinh(x / cofactor)
  # and flow data in raw values, like the channels around it.
  tr_def <- if (!is.null(trans_ref) && nzchar(trans_ref)) transforms_map[[trans_ref]] else NULL
  if (identical(instrument, "cytof")) {
    return(.gml_cytof_axis_map(resolved_channel, tr_def, logicle_unit, cytof_cofactor, scale))
  }
  if (is.null(tr_def)) return(.gml_scaled_map(identity_map, scale))

  # fasinh / arcsinh on flow data, or when the caller does not say which data:
  #
  #   • FLOW scatter (FSC/SSC/...) channels: rv$gates stores vertices in RAW
  #     counts space, but the GatingML export forward-transformed them to
  #     arcsinh display space (so files are portable to Cytobank / FlowJo).
  #     We must apply the fasinh inverse here to put vertices BACK into raw
  #     counts space — otherwise an export+import roundtrip squashes flow
  #     scatter gates down to a tiny region near zero (raw≈display values get
  #     forward-transformed again at render time → asinh(raw/cf) ≈ 0).
  #   • FLOW fluorescence and QC channels under fasinh: stored raw like scatter, so inverted
  #     too. GateLab's Cytobank format writes flow fluorescence gates this way, because Cytobank
  #     has no logicle, and so do Cytobank's own flow exports. Only when the caller says the data
  #     are flow (instrument = "flow").
  #   • Time, Event_length, Cell_length and file_number are raw in every dataset GateLabR loads,
  #     flow or mass cytometry, so a transformation declared on them is inverted whatever the
  #     caller says; taken as raw values, a gate on arcsinh, logicle or flin Time selected other
  #     events.
  #   • Otherwise (instrument NULL) the coordinates are taken as they are, as for CyTOF metal
  #     channels before the caller could say which data they are.
  if (is.list(tr_def) && identical(tr_def$type, "fasinh")) {
    is_scatter <- exists(".is_scatter_channel", mode = "function") &&
                  isTRUE(.is_scatter_channel(resolved_channel))
    always_raw <- grepl("^(time|event_length|cell_length|file_number)$", resolved_channel,
                        ignore.case = TRUE)
    if (!is_scatter && !always_raw && !identical(instrument, "flow")) return(identity_map)
  }
  .gml_scaled_map(.gml_declared_map(tr_def, logicle_unit), scale)
}

# The double next to x, towards +Inf (dir = 1) or -Inf (dir = -1), read off its bits.
.gml_next_double <- function(x, dir) {
  if (!is.finite(x)) return(x)
  if (x == 0) return(dir * 4.9406564584124654e-324)
  words <- readBin(writeBin(x, raw(), endian = "little"), "integer", n = 2L, endian = "little")
  if (anyNA(words)) return(x + dir * abs(x) * .Machine$double.eps)
  low <- as.numeric(words[[1]]) %% 4294967296
  high <- words[[2]]
  # Away from zero the magnitude's bits count up, towards it they count down.
  step <- if ((x > 0) == (dir > 0)) 1 else -1
  low <- low + step
  if (low >= 4294967296) {
    low <- 0
    high <- high + 1L
  } else if (low < 0) {
    low <- 4294967295
    high <- high - 1L
  }
  low <- if (low >= 2147483648) as.integer(low - 4294967296) else as.integer(low)
  readBin(writeBin(c(low, high), raw(), endian = "little"), "double", n = 1L, endian = "little")
}

# A rectangle edge on an axis that maps straight edges to straight ones (raw values, flin, Time in
# seconds, scale values), placed on the stored values exactly: the least stored x whose declared
# value, as a reader computes it with `forward`, is at or above a lower edge, or the greatest at
# or below an upper one. Taking the edge back through the inverse rounds, and can land one step
# past a stored value that lies on the edge (Time at 10.052100219726563 s with $TIMESTEP 0.01 is
# the tick 1005.2100219726562, which the edge divided by 0.01 rounds past). `guess` is the inverse;
# the search moves from it one double at a time, and gives the guess back if that does not settle.
.gml_exact_edge <- function(value, guess, forward, side) {
  if (!is.finite(guess)) return(guess)
  inside <- if (identical(side, "lower")) function(x) isTRUE(forward(x) >= value)
            else function(x) isTRUE(forward(x) <= value)
  outward <- if (identical(side, "lower")) -1 else 1
  x <- guess
  for (i in seq_len(64L)) {
    if (inside(x)) break
    x <- .gml_next_double(x, -outward)
  }
  if (!inside(x)) return(guess)
  for (i in seq_len(64L)) {
    beyond <- .gml_next_double(x, outward)
    if (!inside(beyond)) return(x)
    x <- beyond
  }
  guess
}

# The declared-coordinate -> stored-value half of .gml_axis_map.
.gml_make_inverter <- function(resolved_channel, trans_ref, transforms_map,
                               logicle_unit = FALSE, instrument = NULL, cytof_cofactor = 5) {
  .gml_axis_map(resolved_channel, trans_ref, transforms_map, logicle_unit, instrument,
                cytof_cofactor)$inverse
}

# How finely a polygon's slanted edges are followed when an axis is curved (.gml_polygon_vertices):
# the largest distance between the declared straight edge and GateLabR's stored edge, measured both
# in the declared space, as a fraction of the polygon's extent there on each axis, and in the
# stored values, as a fraction of its extent there. One of the two spaces is compressed (logicle
# or arcsinh) and the other is not, and a vertex far beyond the data stretches the polygon's
# extent in the uncompressed one, where a fraction of it can be wide on the data's scale: a raw
# wedge out to 1e7 on mass cytometry data, measured in raw values only, was followed in chords
# about 10 raw units long where arcsinh(x / 5) bends. Measured on the 40 polygons with slanted
# edges on logicle or arcsinh axes in GateLab's exports over four public flow files and in its
# example strategy for the public 17-colour PBMC demo (15,000 to 121,000 events), against an exact
# evaluation of each declared polygon on its own axes, in the declared space alone: 15 events
# differed at 1e-5, 3 at 1e-6 and none at 1e-7 or 1e-8.
.GML_DENSIFY_TOLERANCE <- 1e-7
# The most vertices a polygon may have after densifying; a polygon that needs more is refused.
.GML_DENSIFY_MAX_VERTICES <- 200000L

# The parameters (in [0, 1), from the edge's start) at which one slanted edge from (x0, y0) to
# (x1, y1) is split so that GateLabR's straight pieces between the stored images of those points
# stay within `tolerance` of the declared edge. Starting from the whole edge, pieces are halved
# until every chord, mapped back into the declared space at each eighth of its length, is within
# the tolerance of the declared edge as a fraction of span_x and span_y, and the declared edge,
# mapped into stored values at each eighth of the piece, is within the tolerance of the chord as a
# fraction of stored_span_x and stored_span_y; so a short edge on a gently curved stretch stays one
# piece. NULL when that takes more than `max_pieces`, or when a point cannot be mapped.
.gml_edge_params <- function(x0, y0, x1, y1, map_x, map_y, span_x, span_y,
                             stored_span_x, stored_span_y, tolerance, max_pieces) {
  ex <- (x1 - x0) / span_x
  ey <- (y1 - y0) / span_y
  norm <- sqrt(ex * ex + ey * ey)
  t <- c(0, 1)
  repeat {
    sx <- map_x$inverse(x0 + t * (x1 - x0))
    sy <- map_y$inverse(y0 + t * (y1 - y0))
    if (any(!is.finite(sx)) || any(!is.finite(sy))) return(NULL)
    k <- length(t) - 1L
    deviation <- numeric(k)
    for (u in (1:7) / 8) {
      qx <- map_x$forward(sx[-(k + 1L)] + u * diff(sx))
      qy <- map_y$forward(sy[-(k + 1L)] + u * diff(sy))
      d <- abs(ex * (qy - y0) / span_y - ey * (qx - x0) / span_x) / norm
      d[!is.finite(d)] <- Inf
      deviation <- pmax(deviation, d)
    }
    # The same distance in stored values: the declared edge's points against each chord.
    cx <- diff(sx) / stored_span_x
    cy <- diff(sy) / stored_span_y
    chord <- sqrt(cx * cx + cy * cy)
    start <- t[-(k + 1L)]
    for (u in (1:7) / 8) {
      at <- start + u * diff(t)
      px <- (map_x$inverse(x0 + at * (x1 - x0)) - sx[-(k + 1L)]) / stored_span_x
      py <- (map_y$inverse(y0 + at * (y1 - y0)) - sy[-(k + 1L)]) / stored_span_y
      d <- abs(cx * py - cy * px) / chord
      d[!is.finite(d)] <- Inf
      deviation <- pmax(deviation, d)
    }
    split <- which(deviation > tolerance)
    if (length(split) == 0L) return(t[-(k + 1L)])
    if (length(t) + length(split) > max_pieces) return(NULL)
    t <- sort(c(t, (t[split] + t[split + 1L]) / 2))
  }
}

# One dimension of a RectangleGate in the values GateLabR stores: list(range = c(lower, upper)),
# or list(empty) saying why it holds no event.
#
# An edge with no bound (absent, or at the largest double) reaches the map's own limit, -Inf and
# Inf except at flog's zero, and is stored at the largest double, beyond every value. A
# transformation's boundMin and boundMax hold the values beyond them at the bound: a lower edge at
# or below boundMin then holds every value below it too, and is no bound, as is an upper edge at
# or above boundMax; a range wholly beyond one holds nothing. On an axis that keeps straight edges
# straight (raw values, flin, Time in seconds, scale values), an edge is placed on the stored
# values exactly (.gml_exact_edge); on a curved one, through the inverse.
.gml_rectangle_range <- function(dim, map, tr_def = NULL) {
  big <- .Machine$double.xmax
  lo <- dim$min
  hi <- dim$max
  if (!is.null(lo) && lo <= -big) lo <- NULL
  if (!is.null(hi) && hi >= big) hi <- NULL
  b_min <- tr_def$bound_min
  b_max <- tr_def$bound_max
  if (!is.null(lo) && !is.null(b_max) && lo > b_max) {
    return(list(empty = paste0("on ", dim$channel, " starts at ", lo, ", above the transformation's boundMax ", b_max)))
  }
  if (!is.null(hi) && !is.null(b_min) && hi < b_min) {
    return(list(empty = paste0("on ", dim$channel, " ends at ", hi, ", below the transformation's boundMin ", b_min)))
  }
  if (!is.null(lo) && !is.null(b_min) && lo <= b_min) lo <- NULL
  if (!is.null(hi) && !is.null(b_max) && hi >= b_max) hi <- NULL
  place <- function(value, side) {
    limit <- if (identical(side, "lower")) map$lower %||% -Inf else map$upper %||% Inf
    if (is.null(value)) return(max(-big, min(big, limit)))
    guess <- map$inverse(value)
    if (!identical(map$kind, "curved")) {
      guess <- .gml_exact_edge(value, guess, map$forward, side)
    } else if (identical(side, "lower") && is.finite(limit) && isTRUE(guess <= limit)) {
      # A finite lower edge on flog below every positive value's image still leaves out zero,
      # whose flog is -Inf.
      guess <- .gml_next_double(limit, 1)
    }
    max(-big, min(big, guess))
  }
  list(range = c(place(lo, "lower"), place(hi, "upper")))
}

# Which transformation bound a polygon's vertices reach, on their declared axes, or NULL.
.gml_polygon_at_bound <- function(vertices, tr_x, tr_y) {
  for (axis in 1:2) {
    tr_def <- if (axis == 1L) tr_x else tr_y
    if (is.null(tr_def$bound_min) && is.null(tr_def$bound_max)) next
    values <- vapply(vertices, function(v) as.numeric(v[axis]), numeric(1))
    if (!is.null(tr_def$bound_min) && any(values <= tr_def$bound_min)) {
      return(paste0("its transformation's boundMin ", tr_def$bound_min))
    }
    if (!is.null(tr_def$bound_max) && any(values >= tr_def$bound_max)) {
      return(paste0("its transformation's boundMax ", tr_def$bound_max))
    }
  }
  NULL
}

# A Gating-ML polygon's vertices in the values GateLabR stores. Gating-ML makes a gate's transforms
# part of the gate (section 4.2.3): a polygon's edges are straight in the space its dimensions
# declare, which is where GateLab and FlowKit evaluate it. GateLabR joins stored vertices with
# straight edges. The maps act on each axis separately, so an edge parallel to an axis stays the
# same edge, and so does every edge when both axes are identity or affine; those vertices are only
# mapped. A slanted edge on a curved axis (logicle, or arcsinh on flow data) is a curve in stored
# values, so it is split in the declared space finely enough (.gml_edge_params) that the stored
# pieces follow the curve, and each point is mapped.
#
# densify = FALSE maps the vertices only: a file GateLabR wrote, whose polygons are straight in raw
# values and whose vertices it writes transformed.
#
# Returns list(vertices, problem): problem names why the polygon cannot be reproduced (a vertex
# that cannot be mapped, or more than max_vertices), else NULL.
.gml_polygon_vertices <- function(vertices, map_x, map_y, densify = TRUE,
                                  tolerance = .GML_DENSIFY_TOLERANCE,
                                  max_vertices = .GML_DENSIFY_MAX_VERTICES) {
  xs <- vapply(vertices, function(v) as.numeric(v[1]), numeric(1))
  ys <- vapply(vertices, function(v) as.numeric(v[2]), numeric(1))
  n <- length(xs)
  # A polygon of one point, given three times, holds nothing: GateLab writes a gate with nothing
  # inside its axes' clamps but a point that way, and no reader counts an event in it. GateLabR's
  # polygon test counts an event lying on a vertex, so it is kept at the largest double, which no
  # event reaches.
  if (n > 0L && all(xs == xs[[1]]) && all(ys == ys[[1]])) {
    return(list(vertices = rep(list(rep(.Machine$double.xmax, 2L)), 3L), problem = NULL))
  }
  # The declared vertices are mapped before any edge is followed, so a polygon with a vertex that
  # cannot be mapped is refused for that vertex, not for the slanted edges that end at it, which
  # .gml_edge_params cannot follow either.
  unmappable <- "a vertex lies where its axis's transformation cannot be inverted"
  if (any(!is.finite(map_x$inverse(xs))) || any(!is.finite(map_y$inverse(ys)))) {
    return(list(vertices = NULL, problem = unmappable))
  }
  curved <- identical(map_x$kind, "curved") || identical(map_y$kind, "curved")
  if (densify && curved) {
    span_x <- diff(range(xs))
    span_y <- diff(range(ys))
    stored_span_x <- diff(range(map_x$inverse(xs)))
    stored_span_y <- diff(range(map_y$inverse(ys)))
    px <- numeric(0)
    py <- numeric(0)
    for (i in seq_len(n)) {
      j <- if (i == n) 1L else i + 1L
      t <- 0
      if (xs[j] != xs[i] && ys[j] != ys[i]) {
        t <- .gml_edge_params(xs[i], ys[i], xs[j], ys[j], map_x, map_y, span_x, span_y,
                              stored_span_x, stored_span_y, tolerance, max_vertices - length(px))
        if (is.null(t)) {
          return(list(vertices = NULL, problem = paste0(
            "an edge cannot be followed on its declared axes within ", max_vertices, " vertices"
          )))
        }
      }
      px <- c(px, xs[i] + t * (xs[j] - xs[i]))
      py <- c(py, ys[i] + t * (ys[j] - ys[i]))
    }
    xs <- px
    ys <- py
  }
  sx <- map_x$inverse(xs)
  sy <- map_y$inverse(ys)
  if (any(!is.finite(sx)) || any(!is.finite(sy))) {
    return(list(vertices = NULL, problem = unmappable))
  }
  list(vertices = Map(c, sx, sy, USE.NAMES = FALSE), problem = NULL)
}

# A Gating-ML EllipsoidGate in two dimensions (section 5.3.3): its mean, covariance matrix and
# distanceSquare, the events x with (x - mean)' inverse(covariance) (x - mean) <= distanceSquare in
# the declared space. NULL, with `problem` saying why, unless the mean has two numbers, the
# covariance is a symmetric positive-definite 2 by 2 matrix and distanceSquare is positive.
.gml_parse_ellipse <- function(node) {
  numbers <- function(el, child) {
    if (is.null(el)) return(numeric(0))
    vapply(as.list(.gml_children_local(el, child)), function(k) {
      value <- .gml_num(.gml_attr_local(k, "value"))
      if (length(value) == 1L) value else NA_real_
    }, numeric(1))
  }
  mean <- numbers(.gml_first_child_local(node, "mean"), "coordinate")
  cov_el <- .gml_first_child_local(node, "covarianceMatrix")
  rows <- if (is.null(cov_el)) list() else lapply(as.list(.gml_children_local(cov_el, "row")), numbers, child = "entry")
  d2_el <- .gml_first_child_local(node, "distanceSquare")
  d2 <- if (is.null(d2_el)) NA_real_ else .gml_num(.gml_attr_local(d2_el, "value"))
  fail <- function(why) list(problem = why)
  if (length(mean) != 2L || any(!is.finite(mean))) return(fail("its mean is not two numbers"))
  if (length(rows) != 2L || any(vapply(rows, length, integer(1)) != 2L) ||
      any(!is.finite(unlist(rows)))) {
    return(fail("its covariance matrix is not 2 by 2 numbers"))
  }
  cov <- do.call(rbind, rows)
  if (abs(cov[1, 2] - cov[2, 1]) > 1e-12 * max(abs(cov))) return(fail("its covariance matrix is not symmetric"))
  if (!(cov[1, 1] > 0 && det(cov) > 0)) return(fail("its covariance matrix is not positive definite"))
  if (length(d2) != 1L || !is.finite(d2) || d2 <= 0) return(fail("its distanceSquare is not a positive number"))
  list(mean = mean, covariance = cov, distance_square = d2, problem = NULL)
}

# The boundary of an ellipse (.gml_parse_ellipse) as a polygon in its declared space, with enough
# vertices that every edge lies within `tolerance` of the ellipse as a fraction of its extent on
# each axis, the same measure .gml_polygon_vertices follows edges to.
.gml_ellipse_boundary <- function(ellipse, tolerance = .GML_DENSIFY_TOLERANCE) {
  a <- sqrt(ellipse$distance_square) * t(chol(ellipse$covariance))
  extent <- 2 * sqrt(ellipse$distance_square * diag(ellipse$covariance))
  stretch <- max(svd(diag(1 / extent) %*% a)$d)
  step <- 2 * acos(1 - min(1, tolerance / stretch))
  n <- max(16L, as.integer(ceiling(2 * pi / step)))
  theta <- (seq_len(n) - 1L) * 2 * pi / n
  points <- a %*% rbind(cos(theta), sin(theta)) + ellipse$mean
  Map(c, points[1, ], points[2, ], USE.NAMES = FALSE)
}

.gml_parse_gate_node <- function(node) {
  loc <- .gml_local_name(node)
  gml_id <- .gml_attr_local(node, "id")
  nm <- .gml_attr_local(node, "name")
  if (is.null(nm) || !nzchar(nm)) nm <- .gml_parse_cytobank_name(node)
  if (is.null(nm) || !nzchar(nm)) nm <- gml_id %||% uuid::UUIDgenerate()

  if (identical(loc, "RectangleGate")) {
    dims <- .gml_parse_dimensions(node)
    if (length(dims) < 1 || length(dims) > 2) return(NULL)
    x <- dims[[1]]
    # A one-dimensional Gating-ML RectangleGate is a range gate. Repeating
    # the same channel on both axes preserves its interval membership exactly
    # in GateLabR's two-dimensional rectangle mask.
    y <- if (length(dims) >= 2) dims[[2]] else dims[[1]]

    # An absent bound is no bound; so is one at or beyond the largest double, which GateLab
    # writes on a dimension unbounded on both sides, since Gating-ML requires one of the two, and
    # which Cytobank's definition gives for an unbounded edge. It was held at -1e9 or 1e9, which
    # real raw values pass.
    xlo <- if (!is.null(x$min) && x$min > -.Machine$double.xmax) x$min else -Inf
    xhi <- if (!is.null(x$max) && x$max < .Machine$double.xmax) x$max else Inf
    ylo <- if (!is.null(y$min) && y$min > -.Machine$double.xmax) y$min else -Inf
    yhi <- if (!is.null(y$max) && y$max < .Machine$double.xmax) y$max else Inf

    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "rectangle",
      x_channel = x$channel,
      y_channel = y$channel,
      vertices = list(c(xlo, ylo), c(xhi, ylo), c(xhi, yhi), c(xlo, yhi)),
      channels = c(x$channel, y$channel),
      dims = list(x, y),
      compensation_id = .gml_parse_cytobank_ids(node)$compensation_id
    ))
  }

  if (identical(loc, "PolygonGate")) {
    dims <- .gml_parse_dimensions(node)
    if (length(dims) < 2) return(NULL)

    # Every vertex's first two coordinates, read in one pass (.gml_num): a polygon GateLab
    # writes can carry thousands of vertices.
    pairs <- lapply(.gml_children_local(node, "vertex"), function(v) {
      coords <- .gml_children_local(v, "coordinate")
      if (length(coords) < 2) return(NULL)
      c(.gml_attr_local(coords[[1]], "value") %||% NA_character_,
        .gml_attr_local(coords[[2]], "value") %||% NA_character_)
    })
    pairs <- Filter(Negate(is.null), pairs)
    values <- .gml_num(unlist(pairs))
    verts <- list()
    for (i in seq_along(pairs)) {
      xv <- values[[2L * i - 1L]]
      yv <- values[[2L * i]]
      if (.gml_has_num(xv) && .gml_has_num(yv)) {
        verts[[length(verts) + 1L]] <- c(xv, yv)
      }
    }
    if (length(verts) < 3) return(NULL)

    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "polygon",
      x_channel = dims[[1]]$channel,
      y_channel = dims[[2]]$channel,
      vertices = verts,
      channels = c(dims[[1]]$channel, dims[[2]]$channel),
      dims = dims,
      compensation_id = .gml_parse_cytobank_ids(node)$compensation_id
    ))
  }

  # An ellipse becomes its boundary, a polygon in the declared space, and is followed onto
  # GateLabR's values like any other polygon.
  if (identical(loc, "EllipsoidGate")) {
    dims <- .gml_parse_dimensions(node)
    ellipse <- .gml_parse_ellipse(node)
    if (length(dims) != 2 || !is.null(ellipse$problem)) return(NULL)
    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "polygon",
      x_channel = dims[[1]]$channel,
      y_channel = dims[[2]]$channel,
      vertices = .gml_ellipse_boundary(ellipse),
      channels = c(dims[[1]]$channel, dims[[2]]$channel),
      dims = dims,
      compensation_id = .gml_parse_cytobank_ids(node)$compensation_id
    ))
  }

  if (identical(loc, "BooleanGate")) {
    op_el <- NULL
    op <- NULL
    for (kid in xml2::xml_children(node)) {
      kid_loc <- .gml_local_name(kid)
      if (kid_loc %in% c("and", "or", "not")) {
        op_el <- kid
        op <- kid_loc
        break
      }
    }
    if (is.null(op_el) || is.null(op)) return(NULL)

    refs <- list()
    for (r in .gml_children_local(op_el, "gateReference")) {
      rid <- .gml_attr_local(r, "ref")
      if (is.null(rid) || !nzchar(rid)) next
      refs[[length(refs) + 1L]] <- list(gate_id = rid, complement = .gml_is_complement(r),
                                        complement_problem = .gml_complement_problem(r))
    }

    cb_ids <- .gml_parse_cytobank_ids(node)
    ci <- .gml_first_child_local(node, "custom_info")
    return(list(
      gml_id = gml_id,
      name = nm,
      gate_type = "boolean",
      operation = op,
      refs = refs,
      channels = character(0),
      pop_parent_indices = .gml_parse_pop_parent_indices(node),
      gate_set_id = cb_ids$gate_set_id,
      # GateLab's standard format writes an excluded reference among several as a reference to
      # a BooleanGate of its own, the NOT of that gate, marked gatelab_operand. It is an
      # operand, not a population.
      operand_helper = !is.null(ci) && !is.null(.gml_first_child_local(ci, "gatelab_operand"))
    ))
  }

  NULL
}

.gml_gate_label <- function(node) {
  gate_id <- .gml_attr_local(node, "id")
  gate_name <- .gml_attr_local(node, "name") %||% .gml_parse_cytobank_name(node)
  suffix <- if (!is.null(gate_name) && nzchar(gate_name) && !identical(gate_name, gate_id)) {
    paste0(" (", gate_name, ")")
  } else {
    ""
  }
  paste0(.gml_local_name(node), if (!is.null(gate_id) && nzchar(gate_id)) paste0(" ", gate_id) else "", suffix)
}

.gml_stop_import_problems <- function(problems) {
  problems <- unique(problems)
  stop(
    paste0(
      "Gating-ML import cancelled because unsupported or invalid features were found:\n- ",
      paste(problems, collapse = "\n- "),
      "\nNo gates or populations were imported; the current workspace was not changed."
    ),
    call. = FALSE
  )
}

.gml_pair_population_name <- function(pair, raw_gates) {
  name_node <- .gml_first_child_local(pair, "name")
  explicit_name <- if (!is.null(name_node)) trimws(xml2::xml_text(name_node)) else ""
  if (nzchar(explicit_name)) return(explicit_name)

  gate_ref <- .gml_attr_local(pair, "gate-ref")
  if (!is.null(gate_ref) && nzchar(gate_ref) && !is.null(raw_gates[[gate_ref]]$name)) {
    return(raw_gates[[gate_ref]]$name)
  }
  if (!is.null(gate_ref) && nzchar(gate_ref)) gate_ref else "Unnamed population"
}

.gml_quote_name <- function(name) {
  encodeString(as.character(name), quote = '"')
}

# GateLabR deliberately authors and imports positive intersections only. Detect
# unsupported Boolean semantics before any parsed state can replace the active
# workspace, and name the affected populations instead of silently dropping an
# operator and changing membership.
.gml_positive_and_logic_problems <- function(raw_gates, hierarchy_node) {
  problems <- character(0)
  names_by_gate <- list()
  pairs <- if (!is.null(hierarchy_node)) {
    as.list(xml2::xml_find_all(hierarchy_node, ".//*[local-name()='PopulationGatePair']"))
  } else {
    list()
  }

  for (pair in pairs) {
    gate_ref <- .gml_attr_local(pair, "gate-ref")
    if (is.null(gate_ref) || !nzchar(gate_ref)) next
    names_by_gate[[gate_ref]] <- unique(c(
      names_by_gate[[gate_ref]] %||% character(0),
      .gml_pair_population_name(pair, raw_gates)
    ))
  }

  add_problem <- function(name, operation, through = NULL) {
    problems <<- c(
      problems,
      paste0(
        "Population ", .gml_quote_name(name), " uses ", operation, " logic",
        if (!is.null(through)) paste0(" through ", .gml_quote_name(through)), "; ",
        "GateLabR currently imports positive AND populations only."
      )
    )
  }
  # The OR and NOT logic a BooleanGate applies, itself or through a BooleanGate it references (in
  # Gating-ML's own model an operand is a population with logic of its own). A GateLab NOT operand
  # counts as the NOT it is.
  logic_seen <- new.env(parent = emptyenv())
  applied_logic <- function(id, visiting = character(0)) {
    if (!is.null(logic_seen[[id]])) return(logic_seen[[id]])
    gate <- raw_gates[[id]]
    logic <- c(or = FALSE, not = FALSE)
    if (is.null(gate) || !identical(gate$gate_type, "boolean") || id %in% visiting) return(logic)
    refs <- gate$refs %||% list()
    logic[["or"]] <- identical(gate$operation, "or")
    logic[["not"]] <- identical(gate$operation, "not") || isTRUE(gate$operand_helper) ||
      any(vapply(refs, function(ref) isTRUE(ref$complement), logical(1)))
    for (ref in refs) logic <- logic | applied_logic(ref$gate_id, c(visiting, id))
    logic_seen[[id]] <- logic
    logic
  }
  # A complement value that is not an xs:boolean ("yes", or empty), or use-as-complement and
  # complement with values that disagree, says neither that the gate is excluded nor that it is
  # included (.gml_complement_problem).
  add_unreadable_complement <- function(name, problem) {
    problems <<- c(problems, paste0(
      "Population ", .gml_quote_name(name), " gives its gate ", problem, ", so ",
      "GateLabR cannot tell whether the population excludes that gate."
    ))
  }

  for (gate in raw_gates) {
    if (!identical(gate$gate_type, "boolean")) next
    # A GateLab NOT operand is reported through the population that references it.
    if (isTRUE(gate$operand_helper)) next
    pop_names <- names_by_gate[[gate$gml_id]] %||% gate$name
    for (ref in gate$refs %||% list()) {
      if (is.na(ref$complement)) for (name in pop_names) add_unreadable_complement(name, ref$complement_problem)
    }
    if (identical(gate$operation, "or")) {
      for (name in pop_names) add_problem(name, "OR")
    }
    refs <- gate$refs %||% list()
    has_complement <- length(refs) > 0L && any(vapply(
      refs, function(ref) isTRUE(ref$complement), logical(1)
    ))
    excludes_through_operand <- length(refs) > 0L && any(vapply(
      refs, function(ref) isTRUE(raw_gates[[ref$gate_id]]$operand_helper), logical(1)
    ))
    if (identical(gate$operation, "not") || has_complement || excludes_through_operand) {
      for (name in pop_names) add_problem(name, "NOT")
    }
    # A population that ANDs one that uses OR or NOT uses it too, and is named with it.
    for (ref in refs) {
      target <- raw_gates[[ref$gate_id]]
      if (is.null(target) || !identical(target$gate_type, "boolean") || isTRUE(target$operand_helper)) next
      through <- applied_logic(ref$gate_id)
      target_name <- (names_by_gate[[ref$gate_id]] %||% target$name)[[1]]
      if (through[["or"]]) for (name in pop_names) add_problem(name, "OR", target_name)
      if (through[["not"]]) for (name in pop_names) add_problem(name, "NOT", target_name)
    }
  }

  for (pair in pairs) {
    complement <- .gml_is_complement(pair)
    if (is.na(complement)) {
      add_unreadable_complement(.gml_pair_population_name(pair, raw_gates), .gml_complement_problem(pair))
    } else if (complement) {
      add_problem(.gml_pair_population_name(pair, raw_gates), "NOT")
    }
  }

  unique(problems)
}

.gml_missing_channel_problems <- function(raw_gates, session_channels, pnn_to_channel) {
  problems <- character(0)
  for (gate in raw_gates) {
    if (identical(gate$gate_type, "boolean")) next
    channels <- unique(gate$channels %||% character(0))
    missing <- channels[vapply(
      channels,
      function(channel) is.null(.gml_resolve_channel(channel, session_channels, pnn_to_channel)),
      logical(1)
    )]
    if (length(missing) > 0L) {
      problems <- c(
        problems,
        paste0(
          "Gate ", .gml_quote_name(gate$name), " (", gate$gml_id,
          ") references channel(s) not present in the loaded data: ",
          paste(vapply(missing, .gml_quote_name, character(1)), collapse = ", "),
          "."
        )
      )
    }
  }
  if (length(problems) > 0L) {
    problems <- c(
      problems,
      "Partial Gating-ML imports are not allowed because dropping a gate can change population membership."
    )
  }
  problems
}

.gml_default_label_offset <- function(vertices) {
  if (is.null(vertices) || length(vertices) == 0) return(c(0, 0))
  ys <- suppressWarnings(vapply(vertices, function(v) as.numeric(v[[2]]), numeric(1)))
  ys <- ys[is.finite(ys)]
  if (length(ys) == 0) return(c(0, 0))

  y_centroid <- mean(ys)
  y_max <- max(ys)
  y_min <- min(ys)
  gate_height <- max(0, y_max - y_min)
  # Place label just above the gate at horizontal center.
  c(0, (y_max - y_centroid) + max(0.15, gate_height * 0.08))
}

.gml_is_population_gate <- function(gate) {
  !is.null(gate) && identical(gate$gate_type, "boolean") && !isTRUE(gate$operand_helper)
}

# A BooleanGate marked gatelab_operand must be what GateLab writes: the NOT of one geometric gate.
.gml_operand_problems <- function(gate, raw_gates) {
  refs <- gate$refs %||% list()
  target <- if (length(refs) == 1L) raw_gates[[refs[[1]]$gate_id]] else NULL
  if (identical(gate$operation, "not") && !is.null(target) &&
      !identical(target$gate_type, "boolean")) {
    return(character(0))
  }
  paste0(gate$gml_id, " is marked as an operand but is not the NOT of one gate.")
}

# A gate whose gating:parent_id chain returns to itself cannot be placed in a tree.
.gml_parent_cycle_problems <- function(raw_gates) {
  problems <- character(0)
  for (gate in raw_gates) {
    seen <- gate$gml_id
    p <- gate$parent_id
    while (!is.null(p) && !is.null(raw_gates[[p]])) {
      if (p %in% seen) {
        problems <- c(problems, paste0(gate$gml_id, " is its own ancestor through parent_id."))
        break
      }
      seen <- c(seen, p)
      p <- raw_gates[[p]]$parent_id
    }
  }
  problems
}

# What a file placed by gating:parent_id must satisfy for GateLabR to reproduce it exactly. A
# Gating-ML reader applies a gate only to its parent's events, so anything GateLabR would read
# differently is refused, not guessed:
#   - only a Boolean population carries parent_id, and its parent is another population. On a
#     geometric gate, parent_id restricts that gate to its parent's events wherever it is used,
#     which a GateLabR gate reference cannot express;
#   - a population references geometric gates, or GateLab's operand NOT of one geometric gate
#     (which GateLabR then refuses as NOT logic), never another population.
# GateLab refuses the same files.
.gml_parent_id_problems <- function(gate, raw_gates) {
  problems <- character(0)
  parent <- gate$parent_id
  if (!is.null(parent) && !is.null(raw_gates[[parent]])) {
    if (!.gml_is_population_gate(gate)) {
      problems <- c(problems, paste0(
        gate$gml_id, " has a parent_id; GateLabR places only Boolean populations by parent_id ",
        "and cannot restrict a gate used in a population to another gate's events."
      ))
    } else if (!.gml_is_population_gate(raw_gates[[parent]])) {
      problems <- c(problems, paste0(
        gate$gml_id, " names ", parent, " as its parent, which is not a population."
      ))
    }
  }
  if (!identical(gate$gate_type, "boolean")) return(problems)
  if (isTRUE(gate$operand_helper)) return(c(problems, .gml_operand_problems(gate, raw_gates)))
  for (ref in gate$refs %||% list()) {
    if (.gml_is_population_gate(raw_gates[[ref$gate_id]])) {
      problems <- c(problems, paste0(
        gate$gml_id, " contains a nested Boolean reference to ", ref$gate_id,
        " that cannot be represented safely."
      ))
    }
  }
  problems
}

# Whether any gate carries Cytobank's own custom_info (custom_info/cytobank), as every gate in a
# file Cytobank exports does, and GateLab's and GateLabR's Cytobank format imitate.
.gml_has_cytobank_gate_info <- function(root) {
  any(vapply(xml2::xml_children(root), function(el) {
    if (!endsWith(.gml_local_name(el), "Gate")) return(FALSE)
    ci <- .gml_first_child_local(el, "custom_info")
    !is.null(ci) && !is.null(.gml_first_child_local(ci, "cytobank"))
  }, logical(1)))
}

# Gating-ML 2.0's own model of a gating hierarchy: every gate is a population, applied only to the
# events of the population its gating:parent_id names, and a BooleanGate combines the populations
# of the gates it references, each with its own parents. With AND and positive references only,
# which is all GateLabR's model holds, each population is the intersection of a set of geometric
# gates: a geometric gate's set is its parent's and itself, a BooleanGate's its parent's and each
# operand's. Returns each gate's set (NA for a gate whose population GateLabR cannot hold: NOT, OR
# or a complemented reference, which .gml_positive_and_logic_problems names, or a gate reached
# again through its own parents and operands) and the problems found.
.gml_standard_chains <- function(raw_gates) {
  chains <- list()
  problems <- character(0)
  visiting <- character(0)
  resolve <- function(id) {
    if (!is.null(chains[[id]])) return(chains[[id]])
    g <- raw_gates[[id]]
    if (is.null(g)) return(NA_character_) # a missing gate is refused elsewhere
    if (id %in% visiting) {
      problems <<- c(problems, paste0(
        id, " is its own ancestor or operand through parent_id and BooleanGate references."
      ))
      return(NA_character_)
    }
    visiting <<- c(visiting, id)
    chain <- if (!is.null(g$parent_id)) resolve(g$parent_id) else character(0)
    if (identical(g$gate_type, "boolean")) {
      holdable <- identical(g$operation, "and") &&
        !any(vapply(g$refs %||% list(), function(r) isTRUE(r$complement), logical(1)))
      if (!holdable) chain <- NA_character_
      for (r in g$refs %||% list()) {
        if (anyNA(chain)) break
        operand <- resolve(r$gate_id)
        chain <- if (anyNA(operand)) NA_character_ else union(chain, operand)
      }
    } else if (!anyNA(chain)) {
      chain <- union(chain, id)
    }
    visiting <<- setdiff(visiting, id)
    chains[[id]] <<- chain
    chain
  }
  for (id in names(raw_gates)) resolve(id)
  list(chains = chains, problems = unique(problems))
}

# What a GateLab Cytobank-format tree must satisfy to be taken as the file's tree: it lists every
# BooleanGate in the file once, each parent is a population listed before it, and each
# population's BooleanGate includes every gate of its parent's, as a BooleanGate that ANDs its
# whole ancestor chain does. GateLabR reads a population within the parent the tree names, so a
# tree that names a parent whose gates the population's BooleanGate does not all include would
# change its events. One that fails describes some other file, so the import is refused rather
# than half-applied.
.gml_tree_problems <- function(tree, raw_gates, bool_order) {
  problems <- character(0)
  listed <- character(0)
  ref_keys <- function(id) {
    unique(vapply(raw_gates[[id]]$refs %||% list(), function(ref) {
      paste0(if (isTRUE(ref$complement)) "!" else "", ref$gate_id)
    }, character(1)))
  }
  for (entry in tree) {
    id <- entry$id
    if (id %in% listed) {
      problems <- c(problems, paste0("The file's GateLab tree lists ", id, " twice."))
    } else if (!identical(raw_gates[[id]]$gate_type, "boolean")) {
      problems <- c(problems, paste0(
        "The file's GateLab tree lists ", id, ", which is not a Boolean gate in the file."
      ))
    }
    if (!is.null(entry$parent) && !entry$parent %in% listed) {
      problems <- c(problems, paste0(
        "The file's GateLab tree places ", id, " under ", entry$parent,
        ", which is not a population listed before it."
      ))
    } else if (!is.null(entry$parent) && identical(raw_gates[[id]]$gate_type, "boolean") &&
               length(setdiff(ref_keys(entry$parent), ref_keys(id))) > 0L) {
      problems <- c(problems, paste0(
        "The file's GateLab tree places the population ", .gml_quote_name(raw_gates[[id]]$name),
        " (", id, ") under ", .gml_quote_name(raw_gates[[entry$parent]]$name), " (",
        entry$parent, "), but its BooleanGate does not include every gate of that population's; ",
        "the tree contradicts the file."
      ))
    }
    listed <- c(listed, id)
  }
  for (bid in setdiff(bool_order, listed)) {
    problems <- c(problems, paste0("The file's GateLab tree does not list the population ", bid, "."))
  }
  problems
}

#' Import Cytobank Gating-ML 2.0 into GateLabR gate/population structures
#'
#' @param file_path Path to Gating-ML XML file
#' @param session_channels Character vector of available channel names in current SCE
#' @param pnn_to_channel Optional named mapping of FCS $PnN -> display channel name
#' @param instrument "flow" or "cytof": how the loaded data store gates. With "flow", gate
#'   coordinates declared under arcsinh are inverted to raw values on every channel, not only
#'   scatter. With "cytof", every coordinate is converted to the data's arcsinh(x / cofactor)
#'   except on the channels the data keep raw (Time, Event_length, Cell_length, file_number),
#'   where it is inverted to raw values. NULL inverts arcsinh on scatter, Time, Event_length,
#'   Cell_length and file_number only. With "flow" or NULL, logicle and flin are inverted on every
#'   channel.
#' @param cytof_cofactor The loaded mass cytometry data's arcsinh cofactor (with instrument
#'   "cytof"). A file that records GateLab's own cofactor (gatelabr_scales) is read on that one
#'   instead, since importing it re-transforms the data to it. Default 5.
#' @param timestep The loaded data's $TIMESTEP, in seconds per stored Time tick: 1 when the FCS
#'   file states none. Needed only for a file whose GateLab format mark says its Time coordinates
#'   are in seconds (GateLab's standard format); a gate on Time in such a file is refused when it
#'   is not given. Every other file's Time is read as stored ticks.
#' @param gains The loaded data's $PnG, a named numeric vector by channel (session channel names),
#'   for the channels whose Gating-ML scale value is the stored value divided by the gain (GateLab
#'   leaves out Time, QC channels and logarithmically amplified channels). Applied only where the
#'   file's GateLab format mark says its coordinates are scale values (GateLab's standard format);
#'   NULL, or a channel not named, is a gain of 1.
#' @return List with gates, gate_order, populations, root_population_id and import stats
import_gatingml_from_cytobank <- function(file_path,
                                          session_channels,
                                          pnn_to_channel = NULL,
                                          instrument = NULL,
                                          cytof_cofactor = NULL,
                                          timestep = NULL,
                                          gains = NULL) {
  if (!requireNamespace("xml2", quietly = TRUE)) {
    stop("Package 'xml2' is required for Gating-ML import. Install with: install.packages('xml2')")
  }
  if (is.null(file_path) || !file.exists(file_path)) {
    stop("Gating-ML file not found.")
  }
  if (is.null(session_channels) || length(session_channels) == 0) {
    stop("No session channels available; load an SCE first.")
  }
  if (!is.null(timestep) &&
      !(is.numeric(timestep) && length(timestep) == 1L && is.finite(timestep) && timestep > 0)) {
    stop("timestep must be one positive number.")
  }
  if (!is.null(gains)) {
    gains <- unlist(gains)
    if (!is.numeric(gains) || is.null(names(gains)) || any(!nzchar(names(gains))) ||
        anyDuplicated(names(gains)) || any(!is.finite(gains)) || any(gains <= 0)) {
      stop("gains must be positive numbers named by channel.")
    }
  }

  doc <- xml2::read_xml(file_path)
  root <- xml2::xml_root(doc)
  top_nodes <- xml2::xml_children(root)

  transforms_map <- .gml_parse_transforms(root)
  gatelab_format <- .gml_parse_gatelab_format(root)

  raw_gates <- list()
  bool_order <- character(0)
  hierarchy_node <- NULL
  import_problems <- character(0)
  supported_gate_types <- c("RectangleGate", "PolygonGate", "EllipsoidGate", "BooleanGate")

  for (el in top_nodes) {
    loc <- .gml_local_name(el)
    if (identical(loc, "GatingHierarchy") && is.null(hierarchy_node)) {
      hierarchy_node <- el
      next
    }

    if (endsWith(loc, "Gate") && !loc %in% supported_gate_types) {
      import_problems <- c(import_problems, paste0(.gml_gate_label(el), " is not supported."))
      next
    }
    if (!loc %in% supported_gate_types) next

    gate_id <- .gml_attr_local(el, "id")
    if (is.null(gate_id) || !nzchar(gate_id)) {
      import_problems <- c(import_problems, paste0(loc, " is missing its required id."))
      next
    }
    if (!is.null(raw_gates[[gate_id]])) {
      import_problems <- c(import_problems, paste0(loc, " has duplicate id ", gate_id, "."))
      next
    }

    # A dimension that is not an FCS parameter (a ratio of two, or another derived new-dimension)
    # is not read, and dropping it would leave a gate on its other dimensions only.
    underived <- vapply(as.list(.gml_children_local(el, "dimension")), function(dim) {
      !is.null(.gml_first_child_local(dim, "fcs-dimension")) ||
        !is.null(.gml_first_child_local(dim, "parameter"))
    }, logical(1))
    if (!all(underived)) {
      import_problems <- c(import_problems, paste0(
        .gml_gate_label(el), " has a dimension that is not an FCS parameter (a ratio or another ",
        "derived dimension), which GateLabR cannot gate on."
      ))
      next
    }

    if (identical(loc, "RectangleGate")) {
      n_dims <- length(.gml_parse_dimensions(el))
      if (n_dims < 1 || n_dims > 2) {
        import_problems <- c(
          import_problems,
          sprintf("%s has %d dimensions; only 1D ranges and 2D rectangles are supported.",
                  .gml_gate_label(el), n_dims)
        )
        next
      }
    } else if (identical(loc, "PolygonGate")) {
      n_dims <- length(.gml_parse_dimensions(el))
      n_vertices <- length(.gml_children_local(el, "vertex"))
      if (n_dims != 2 || n_vertices < 3) {
        import_problems <- c(
          import_problems,
          paste0(.gml_gate_label(el), " must contain exactly 2 dimensions and at least 3 vertices.")
        )
        next
      }
    } else if (identical(loc, "EllipsoidGate")) {
      n_dims <- length(.gml_parse_dimensions(el))
      ellipse <- .gml_parse_ellipse(el)
      if (n_dims != 2 || !is.null(ellipse$problem)) {
        import_problems <- c(import_problems, paste0(
          .gml_gate_label(el), " is not an ellipse GateLabR can read: ",
          if (n_dims != 2) sprintf("it has %d dimensions, and GateLabR reads two", n_dims) else ellipse$problem,
          "."
        ))
        next
      }
    } else if (identical(loc, "BooleanGate")) {
      operations <- Filter(
        function(child) .gml_local_name(child) %in% c("and", "or", "not"),
        as.list(xml2::xml_children(el))
      )
      refs <- if (length(operations) == 1) .gml_children_local(operations[[1]], "gateReference") else list()
      if (length(operations) != 1 || length(refs) == 0) {
        import_problems <- c(
          import_problems,
          paste0(.gml_gate_label(el), " must contain one non-empty Boolean operation.")
        )
        next
      }
      if (identical(.gml_local_name(operations[[1]]), "not") && length(refs) != 1) {
        import_problems <- c(
          import_problems,
          sprintf("%s uses NOT with %d references; unary NOT requires exactly one.",
                  .gml_gate_label(el), length(refs))
        )
        next
      }
      # A gateReference names its gate with ref, which Gating-ML requires. One without, or with an
      # empty ref, was passed over, and the BooleanGate combined its other operands alone. The gate
      # is still read, so that the gates that reference it are not reported as missing.
      unnamed <- vapply(as.list(refs), function(r) !nzchar(.gml_attr_local(r, "ref") %||% ""), logical(1))
      if (any(unnamed)) {
        import_problems <- c(import_problems, paste0(
          .gml_gate_label(el), " has a gateReference that names no gate (its ref is missing or ",
          "empty), so GateLabR cannot tell which gate it combines."
        ))
      }
    }

    g <- .gml_parse_gate_node(el)
    if (is.null(g) || is.null(g$gml_id) || !nzchar(g$gml_id)) {
      import_problems <- c(import_problems, paste0(.gml_gate_label(el), " could not be parsed."))
      next
    }
    parent_ref <- .gml_attr_local(el, "parent_id")
    if (!is.null(parent_ref) && nzchar(parent_ref)) g$parent_id <- parent_ref
    raw_gates[[g$gml_id]] <- g
    if (identical(g$gate_type, "boolean")) bool_order <- c(bool_order, g$gml_id)
  }
  spectra <- .gml_parse_spectrum_matrices(root)
  # Whether the file has lost GateLab's mark is judged on the dimensions as written: a Cytobank
  # gate's compensation_id makes its "FCS" dimensions reference a spectrumMatrix only below.
  lost_mark_problems <- .gml_lost_mark_problems(root, raw_gates, spectra, hierarchy_node, gatelab_format)
  adopted <- .gml_adopt_cytobank_compensation_ids(raw_gates, spectra)
  raw_gates <- .gml_resolve_spectrum_dimensions(adopted$raw_gates, spectra)
  import_problems <- c(
    import_problems,
    gatelab_format$problems,
    lost_mark_problems,
    adopted$problems,
    .gml_positive_and_logic_problems(raw_gates, hierarchy_node),
    .gml_missing_channel_problems(raw_gates, session_channels, pnn_to_channel)
  )
  gatelabr_state <- .gml_parse_gatelabr_state(root)
  dimension_compensation <- .gml_dimension_compensation(raw_gates, spectra)
  compensation_refs <- dimension_compensation$refs

  # How the file places its populations. A GatingHierarchy (GateLabR, and GateLab until 2026-09)
  # takes precedence, as before. GateLab's mark says how its own formats place them: by
  # gating:parent_id, every BooleanGate a population (standard format), or by the tree in the mark
  # (Cytobank format). A file without the mark whose gates carry Cytobank's custom_info, or that
  # GateLab or GateLabR wrote (their Cytobank format before the mark), and that has no parent_id,
  # follows Cytobank's flat convention, whose parents are inferred as before. Any other file is
  # read by Gating-ML's own model (.gml_standard_chains).
  population_gates <- Filter(.gml_is_population_gate, raw_gates)
  has_parent_ids <- any(vapply(raw_gates, function(g) !is.null(g$parent_id), logical(1)))
  use_parent_ids <- is.null(hierarchy_node) && isTRUE(gatelab_format$parent_id_hierarchy)
  use_tree <- is.null(hierarchy_node) && !use_parent_ids && !is.null(gatelab_format$tree)
  use_standard <- is.null(hierarchy_node) && !isTRUE(gatelab_format$marked) && (
    has_parent_ids || !(.gml_written_by_gatelab(root) || .gml_has_cytobank_gate_info(root))
  )
  parent_cycle_problems <- .gml_parent_cycle_problems(raw_gates)
  standard <- if (use_standard) .gml_standard_chains(raw_gates) else NULL
  if (use_standard && length(parent_cycle_problems) == 0L) {
    import_problems <- c(import_problems, standard$problems)
  }
  import_problems <- c(import_problems, parent_cycle_problems)
  if (use_tree) {
    import_problems <- c(import_problems, .gml_tree_problems(gatelab_format$tree, raw_gates, bool_order))
  }
  if (is.null(hierarchy_node) && !use_parent_ids && !use_standard) {
    # Left: GateLab's Cytobank format, which places populations by its tree and writes no
    # parent_id, and Cytobank's flat convention.
    for (g in raw_gates) {
      if (is.null(g$parent_id) || is.null(raw_gates[[g$parent_id]])) next
      if (use_tree) {
        import_problems <- c(import_problems, paste0(
          g$gml_id, " has a parent_id, which GateLab's Cytobank format does not use; ",
          "its tree places the populations."
        ))
      } else if (identical(g$gate_type, "boolean") ||
                 identical(raw_gates[[g$parent_id]]$gate_type, "boolean")) {
        import_problems <- c(import_problems, paste0(
          g$gml_id, " names ", g$parent_id, " as its parent; GateLabR places a gate only under ",
          "another geometric gate here."
        ))
      }
    }
  }

  for (g in raw_gates) {
    for (dim in g$dims %||% list()) {
      ref <- dim$transformation_ref %||% NULL
      if (!is.null(ref) && nzchar(ref) && is.null(transforms_map[[ref]])) {
        import_problems <- c(
          import_problems,
          paste0(g$gml_id, " references unsupported or missing transformation ", ref, ".")
        )
      } else if (!is.null(ref) && nzchar(ref)) {
        why <- .gml_transform_problem(transforms_map[[ref]])
        if (!is.null(why)) {
          import_problems <- c(import_problems, paste0(
            "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") is on transformation ", ref, ", ",
            why, ", so GateLabR cannot take the gate's coordinates to the values it gates on."
          ))
        } else if (identical(transforms_map[[ref]]$type, "flog") && !isTRUE(gatelab_format$flog_standard)) {
          # GateLab wrote its files for its older flog until its mark reached version 3: every
          # value below T 10^-M is held at 0, so a gate reaching 0 holds every event below it,
          # where Gating-ML's flog, which GateLabR reads, holds none at or below zero.
          import_problems <- c(import_problems, paste0(
            "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") is on transformation ", ref,
            ", a flog GateLab wrote before its format mark reached version 3, which holds every ",
            "value below T 10^-M at 0; GateLabR reads Gating-ML's own flog only."
          ))
        }
      }
    }
    if (!is.null(g$parent_id) && is.null(raw_gates[[g$parent_id]])) {
      import_problems <- c(
        import_problems,
        paste0(g$gml_id, " references missing parent gate ", g$parent_id, ".")
      )
    }
    if (use_parent_ids) {
      import_problems <- c(import_problems, .gml_parent_id_problems(g, raw_gates))
    } else if (isTRUE(g$operand_helper)) {
      import_problems <- c(import_problems, .gml_operand_problems(g, raw_gates))
    }
    if (identical(g$gate_type, "boolean")) {
      for (ref in g$refs %||% list()) {
        target <- raw_gates[[ref$gate_id]]
        if (is.null(target)) {
          import_problems <- c(
            import_problems,
            paste0(g$gml_id, " references missing gate ", ref$gate_id, ".")
          )
        } else if (use_parent_ids || use_standard || isTRUE(target$operand_helper)) {
          # .gml_parent_id_problems checks references between populations, and Gating-ML's own
          # model combines them (.gml_standard_chains); a reference to a GateLab NOT operand is
          # refused as NOT logic.
        } else if (identical(target$gate_type, "boolean")) {
          # Cytobank/GateLab flat exports encode ancestry as a Boolean reference
          # plus a matching pop_X parent in custom_info. That pattern maps safely
          # to a parent population followed by incremental primitive gates.
          parent_indices <- g$pop_parent_indices %||% integer(0)
          target_position <- match(ref$gate_id, bool_order)
          target_gate_set_id <- target$gate_set_id %||% NA_integer_
          is_flat_parent_reference <- is.null(hierarchy_node) && any(
            parent_indices == target_position |
              (!is.na(target_gate_set_id) & parent_indices == target_gate_set_id),
            na.rm = TRUE
          )
          if (!isTRUE(is_flat_parent_reference)) {
            import_problems <- c(
              import_problems,
              paste0(g$gml_id, " contains a nested Boolean reference to ", ref$gate_id,
                     " that cannot be represented safely.")
            )
          }
        }
      }
    }
  }

  if (!is.null(hierarchy_node)) {
    pairs <- xml2::xml_find_all(hierarchy_node, ".//*[local-name()='PopulationGatePair']")
    for (pair in pairs) {
      ref <- .gml_attr_local(pair, "gate-ref")
      if (is.null(ref) || !nzchar(ref)) {
        import_problems <- c(import_problems, "A PopulationGatePair is missing gate-ref.")
      } else if (is.null(raw_gates[[ref]])) {
        import_problems <- c(
          import_problems,
          paste0("A PopulationGatePair references missing gate ", ref, ".")
        )
      }
    }
  }

  if (length(import_problems) > 0) .gml_stop_import_problems(import_problems)

  gml_to_app <- list()
  app_gates <- list()
  gate_order <- character(0)
  n_skipped <- 0L
  unresolved_channels <- character(0)
  polygon_problems <- character(0)
  # GateLabR's own polygons are straight in raw values, and it writes their vertices transformed.
  densify_polygons <- !.gml_written_by_gatelabr(root)
  # The cofactor mass cytometry data will be on once the file is imported: the file's own when it
  # records one (the app re-transforms the data to it), else the loaded data's.
  data_cofactor <- gatelabr_state$cytof_cofactor %||% cytof_cofactor %||% 5
  if (!is.numeric(data_cofactor) || length(data_cofactor) != 1L || !is.finite(data_cofactor) ||
      data_cofactor <= 0) {
    stop("cytof_cofactor must be one positive number.")
  }
  # How a dimension's raw coordinates become the stored values (.gml_scaled_map): Time in seconds
  # divided by $TIMESTEP, where GateLab's mark says the file writes seconds, and a scale value
  # times its channel's $PnG, where the mark says the file writes scale values. list(scale) or
  # list(problem).
  axis_scale <- function(file_channel, resolved_channel) {
    if (.gml_is_time(file_channel) || .gml_is_time(resolved_channel)) {
      if (!identical(gatelab_format$time_unit, "seconds")) return(list(scale = NULL))
      if (is.null(timestep)) {
        return(list(problem = paste0(
          "is on Time, which the file's GateLab format mark says is in seconds, and the loaded ",
          "data's $TIMESTEP was not given (timestep), so GateLabR cannot take its coordinates to ",
          "the stored ticks."
        )))
      }
      if (timestep == 1) return(list(scale = NULL))
      return(list(scale = list(to_stored = function(v) v / timestep,
                               to_file = function(x) x * timestep)))
    }
    gain <- if (isTRUE(gatelab_format$scale_values) && !is.null(gains) &&
                resolved_channel %in% names(gains)) gains[[resolved_channel]] else 1
    if (gain == 1) return(list(scale = NULL))
    list(scale = list(to_stored = function(v) v * gain, to_file = function(x) x / gain))
  }

  for (gml_id in names(raw_gates)) {
    g <- raw_gates[[gml_id]]
    if (identical(g$gate_type, "boolean")) next

    channels <- unique(g$channels)
    resolved <- lapply(channels, function(ch) .gml_resolve_channel(ch, session_channels, pnn_to_channel))
    names(resolved) <- channels
    if (any(vapply(resolved, is.null, logical(1)))) {
      unresolved_channels <- c(unresolved_channels,
                               channels[vapply(resolved, is.null, logical(1))])
      n_skipped <- n_skipped + 1L
      next
    }

    x_ch <- unname(resolved[[g$x_channel]])
    y_ch <- unname(resolved[[g$y_channel]])
    if (is.null(x_ch) || is.null(y_ch)) {
      n_skipped <- n_skipped + 1L
      next
    }

    x_tr <- if (length(g$dims) >= 1) g$dims[[1]]$transformation_ref %||% NULL else NULL
    y_tr <- if (length(g$dims) >= 2) g$dims[[2]]$transformation_ref %||% NULL else NULL
    x_scale <- axis_scale(g$dims[[1]]$channel, x_ch)
    y_scale <- axis_scale(g$dims[[min(2L, length(g$dims))]]$channel, y_ch)
    unscaled <- Filter(Negate(is.null), list(x_scale$problem, y_scale$problem))
    if (length(unscaled) > 0L) {
      polygon_problems <- c(polygon_problems, paste0(
        "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") ", unscaled[[1]]
      ))
      next
    }
    map_x <- .gml_axis_map(x_ch, x_tr, transforms_map, gatelab_format$logicle_unit, instrument,
                           data_cofactor, x_scale$scale)
    map_y <- .gml_axis_map(y_ch, y_tr, transforms_map, gatelab_format$logicle_unit, instrument,
                           data_cofactor, y_scale$scale)
    tr_x <- if (!is.null(x_tr) && nzchar(x_tr)) transforms_map[[x_tr]] else NULL
    tr_y <- if (!is.null(y_tr) && nzchar(y_tr)) transforms_map[[y_tr]] else NULL

    if (identical(g$gate_type, "polygon")) {
      # A transformation's boundMin and boundMax hold the values beyond them at the bound before
      # the gate is tested, which moves the events beyond onto a line of the declared space. A
      # polygon inside the bounds holds none of them, and reads as if there were no bounds; one
      # reaching a bound would hold them, which GateLabR's polygons cannot state.
      at_bound <- .gml_polygon_at_bound(g$vertices, tr_x, tr_y)
      if (!is.null(at_bound)) {
        polygon_problems <- c(polygon_problems, paste0(
          "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") is a polygon that reaches ", at_bound,
          ", where the transformation holds every value beyond it; GateLabR's polygons cannot ",
          "hold those events."
        ))
        next
      }
      mapped <- .gml_polygon_vertices(g$vertices, map_x, map_y, densify = densify_polygons)
      if (!is.null(mapped$problem)) {
        polygon_problems <- c(polygon_problems, paste0(
          "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") is a polygon GateLabR cannot ",
          "reproduce in the values it gates on: ", mapped$problem, "."
        ))
        next
      }
      verts <- mapped$vertices
    } else {
      # Each axis's map is increasing, so a rectangle's bounds map to the stored rectangle's
      # (.gml_rectangle_range).
      range_x <- .gml_rectangle_range(g$dims[[1]], map_x, tr_x)
      range_y <- .gml_rectangle_range(g$dims[[min(2L, length(g$dims))]], map_y, tr_y)
      empty <- Filter(Negate(is.null), list(range_x$empty, range_y$empty))
      if (length(empty) > 0L) {
        polygon_problems <- c(polygon_problems, paste0(
          "Gate ", .gml_quote_name(g$name), " (", g$gml_id, ") holds no event: its range ",
          empty[[1]], ", which GateLabR's rectangles cannot state."
        ))
        next
      }
      verts <- list(
        c(range_x$range[[1]], range_y$range[[1]]), c(range_x$range[[2]], range_y$range[[1]]),
        c(range_x$range[[2]], range_y$range[[2]]), c(range_x$range[[1]], range_y$range[[2]])
      )
    }
    if (length(verts) < 3 && identical(g$gate_type, "polygon")) {
      n_skipped <- n_skipped + 1L
      next
    }

    app_id <- uuid::UUIDgenerate()
    gate <- list(
      gate_id = app_id,
      name = g$name,
      gate_type = g$gate_type,
      x_channel = x_ch,
      y_channel = y_ch,
      vertices = verts,
      color = next_gate_color(length(app_gates)),
      label_offset = .gml_default_label_offset(verts)
    )

    app_gates[[app_id]] <- gate
    gate_order <- c(gate_order, app_id)
    gml_to_app[[gml_id]] <- app_id
  }
  if (length(polygon_problems) > 0L) .gml_stop_import_problems(polygon_problems)

  bool_ids <- names(raw_gates)[vapply(raw_gates, function(g) identical(g$gate_type, "boolean"), logical(1))]
  if (length(bool_ids) > 0) {
    for (iter in seq_len(12)) {
      changed <- FALSE
      for (bid in bool_ids) {
        if (!is.null(gml_to_app[[bid]])) next
        refs <- raw_gates[[bid]]$refs %||% list()
        if (length(refs) == 0) next
        ok <- all(vapply(refs, function(r) {
          rid <- r$gate_id
          !is.null(gml_to_app[[rid]]) || rid %in% bool_ids
        }, logical(1)))
        if (ok) {
          gml_to_app[[bid]] <- bid
          changed <- TRUE
        }
      }
      if (!changed) break
    }
  }

  root_pop <- new_root_population()
  root_pop_id <- root_pop$population_id
  populations <- setNames(list(root_pop), root_pop_id)

  if (!is.null(hierarchy_node)) {
    process_pair <- function(pair_node, parent_id) {
      gate_ref_gml <- .gml_attr_local(pair_node, "gate-ref")
      complement <- .gml_is_complement(pair_node)

      name_node <- .gml_first_child_local(pair_node, "name")
      pop_name <- if (!is.null(name_node)) trimws(xml2::xml_text(name_node)) else ""
      if (!nzchar(pop_name) && !is.null(gate_ref_gml) && !is.null(raw_gates[[gate_ref_gml]])) {
        pop_name <- raw_gates[[gate_ref_gml]]$name
      }
      if (!nzchar(pop_name)) pop_name <- "Population"

      gate_refs <- list()
      gate_logic <- "and"
      if (!is.null(gate_ref_gml) && !is.null(gml_to_app[[gate_ref_gml]])) {
        ref_gate <- raw_gates[[gate_ref_gml]]
        if (!is.null(ref_gate) && identical(ref_gate$gate_type, "boolean")) {
          if (identical(ref_gate$operation, "or")) gate_logic <- "or"
          seen <- character(0)
          refs <- ref_gate$refs %||% list()
          for (r in refs) {
            rid <- r$gate_id
            aid <- gml_to_app[[rid]]
            if (is.null(aid) || identical(aid, rid) || aid %in% seen) next
            seen <- c(seen, aid)
            include <- if (identical(ref_gate$operation, "not")) {
              isTRUE(r$complement)
            } else {
              !isTRUE(r$complement)
            }
            gate_refs[[length(gate_refs) + 1L]] <- new_gate_ref(aid, include = include)
          }
          if (isTRUE(complement)) {
            gate_refs <- lapply(gate_refs, function(ref) {
              new_gate_ref(ref$gate_id, include = !isTRUE(ref$include), quadrant = ref$quadrant)
            })
            if (!identical(ref_gate$operation, "not")) {
              gate_logic <- if (identical(gate_logic, "and")) "or" else "and"
            }
          }
        } else {
          aid <- gml_to_app[[gate_ref_gml]]
          gate_refs[[1]] <- new_gate_ref(aid, include = !complement)
        }
      }

      if (length(gate_refs) == 0) return(NULL)

      pop <- new_population(pop_name, gate_refs = gate_refs, parent_id = parent_id,
                            gate_logic = gate_logic)
      pid <- pop$population_id
      populations[[pid]] <<- pop
      populations <<- link_child_to_parent(populations, pid, parent_id)

      for (child_pair in .gml_children_local(pair_node, "PopulationGatePair")) {
        process_pair(child_pair, pid)
      }
      pid
    }

    for (top_pair in .gml_children_local(hierarchy_node, "PopulationGatePair")) {
      process_pair(top_pair, root_pop_id)
    }
  } else if (use_standard) {
    # Every gate is a population, under the population its parent_id names (All Events when it has
    # none), with the geometric gates its set adds to its parent's (.gml_standard_chains); one that
    # adds none takes its parent's events. Parents are placed first; siblings keep the file's
    # order.
    pop_ids <- list()
    waiting <- names(raw_gates)
    while (length(waiting) > 0L) {
      still_waiting <- character(0)
      for (gid in waiting) {
        g <- raw_gates[[gid]]
        parent_pid <- if (is.null(g$parent_id)) root_pop_id else pop_ids[[g$parent_id]]
        if (is.null(parent_pid)) {
          still_waiting <- c(still_waiting, gid)
          next
        }
        parent_chain <- if (is.null(g$parent_id)) character(0) else standard$chains[[g$parent_id]]
        refs <- lapply(setdiff(standard$chains[[gid]], parent_chain), function(geometric) {
          new_gate_ref(gml_to_app[[geometric]], include = TRUE)
        })
        pop <- new_population(g$name, gate_refs = refs, parent_id = parent_pid)
        populations[[pop$population_id]] <- pop
        populations <- link_child_to_parent(populations, pop$population_id, parent_pid)
        pop_ids[[gid]] <- pop$population_id
      }
      # The problems checked above leave every parent placeable.
      if (length(still_waiting) == length(waiting)) break
      waiting <- still_waiting
    }
  } else if (use_parent_ids) {
    # One population per BooleanGate that is not an operand, under the population its parent_id
    # names (All Events when it has none), with the gates it references; a reference repeated to
    # give and/or two operands is one reference. NOT and OR were refused above. GateLab lists
    # parents before children, and each population is placed once its parent is, so siblings
    # keep the file's order either way.
    pop_ids <- list()
    waiting <- Filter(function(bid) .gml_is_population_gate(raw_gates[[bid]]), bool_order)
    while (length(waiting) > 0L) {
      still_waiting <- character(0)
      for (bid in waiting) {
        g <- raw_gates[[bid]]
        parent_pid <- if (is.null(g$parent_id)) root_pop_id else pop_ids[[g$parent_id]]
        if (is.null(parent_pid)) {
          still_waiting <- c(still_waiting, bid)
          next
        }
        refs <- list()
        seen <- character(0)
        for (r in g$refs %||% list()) {
          app_id <- gml_to_app[[r$gate_id]]
          if (is.null(app_id) || identical(app_id, r$gate_id) || app_id %in% seen) next
          seen <- c(seen, app_id)
          refs[[length(refs) + 1L]] <- new_gate_ref(app_id, include = !isTRUE(r$complement))
        }
        pop <- new_population(g$name, gate_refs = refs, parent_id = parent_pid,
                              gate_logic = if (identical(g$operation, "or")) "or" else "and")
        populations[[pop$population_id]] <- pop
        populations <- link_child_to_parent(populations, pop$population_id, parent_pid)
        pop_ids[[bid]] <- pop$population_id
      }
      # .gml_parent_id_problems and .gml_parent_cycle_problems leave every parent placeable.
      if (length(still_waiting) == length(waiting)) break
      waiting <- still_waiting
    }
  } else {
    bool_names <- list()
    bool_prim <- list()
    bool_include <- list()
    bool_pop_indices <- list()

    # Build a robust gate_set_id → GML ID mapping for parent resolution.
    # Cytobank boolean expressions use "pop_X" where X = gate_set_id.
    gsid_to_gml <- list()
    for (bid in bool_order) {
      g <- raw_gates[[bid]]
      if (is.null(g) || !identical(g$gate_type, "boolean")) next
      gsid <- g$gate_set_id
      if (!is.null(gsid) && is.finite(gsid)) {
        gsid_to_gml[[as.character(gsid)]] <- bid
      }
    }

    for (bid in bool_order) {
      g <- raw_gates[[bid]]
      if (!.gml_is_population_gate(g)) next
      refs <- g$refs %||% list()

      prim <- character(0)
      inc <- list()
      seen <- character(0)
      for (r in refs) {
        rid <- r$gate_id
        if (rid %in% seen) next
        seen <- c(seen, rid)
        rg <- raw_gates[[rid]]
        if (!is.null(rg) && identical(rg$gate_type, "boolean")) next
        if (is.null(gml_to_app[[rid]])) next
        prim <- c(prim, rid)
        inc[[rid]] <- if (identical(g$operation, "not")) {
          isTRUE(r$complement)
        } else {
          !isTRUE(r$complement)
        }
      }

      bool_names[[bid]] <- g$name
      bool_prim[[bid]] <- unique(prim)
      bool_include[[bid]] <- inc
      bool_pop_indices[[bid]] <- g$pop_parent_indices %||% integer(0)
    }

    if (length(bool_names) == 0) {
      # Every gate is a population. Standard Gating-ML places a gate under another with
      # gating:parent_id, and a gate is applied only to its parent's events, so a gate is placed
      # under its parent's population once that exists; one without a parent_id sits under All
      # Events, as every gate did before parent_id was read.
      app_to_gml <- setNames(names(gml_to_app), vapply(gml_to_app, as.character, character(1)))
      gate_pids <- list()
      waiting <- gate_order
      while (length(waiting) > 0L) {
        still_waiting <- character(0)
        for (gid in waiting) {
          parent_gml <- raw_gates[[app_to_gml[[gid]]]]$parent_id
          parent_app <- if (is.null(parent_gml)) NULL else gml_to_app[[parent_gml]]
          parent_pid <- if (is.null(parent_gml)) {
            root_pop_id
          } else if (!is.null(parent_app)) {
            gate_pids[[parent_app]]
          }
          if (is.null(parent_pid)) {
            still_waiting <- c(still_waiting, gid)
            next
          }
          g <- app_gates[[gid]]
          pop <- new_population(g$name, gate_refs = list(new_gate_ref(gid, include = TRUE)), parent_id = parent_pid)
          pid <- pop$population_id
          populations[[pid]] <- pop
          populations <- link_child_to_parent(populations, pid, parent_pid)
          gate_pids[[gid]] <- pid
        }
        if (length(still_waiting) == length(waiting)) break
        waiting <- still_waiting
      }
    } else {
      # ── Resolve parent for each boolean gate ────────────────────────────
      # GateLab's Cytobank format lists each population's parent in its mark (validated by
      # .gml_tree_problems); Cytobank's own files carry none, so their parents are inferred.
      parents <- list()
      if (use_tree) {
        for (entry in gatelab_format$tree) parents[[entry$id]] <- entry$parent
      }
      for (bid in if (use_tree) character(0) else names(bool_names)) {
        pidx <- bool_pop_indices[[bid]] %||% integer(0)
        parent_bid <- NULL

        # Primary: resolve pop_X via explicit gate_set_id mapping (robust)
        if (length(pidx) > 0) {
          for (idx in pidx) {
            if (is.na(idx) || idx < 1) next
            cand <- gsid_to_gml[[as.character(idx)]]
            if (!is.null(cand) && !identical(cand, bid)) {
              parent_bid <- cand
              break
            }
          }
        }

        # Fallback 1: positional lookup in bool_order (for GatingML files
        # that lack gate_set_id but have boolean gates in order)
        if (is.null(parent_bid) && length(pidx) > 0) {
          for (idx in pidx) {
            if (is.na(idx) || idx < 1 || idx > length(bool_order)) next
            cand <- bool_order[[idx]]
            if (!identical(cand, bid)) {
              parent_bid <- cand
              break
            }
          }
        }

        # Fallback 2: heuristic — find the boolean gate whose primitive
        # gate set is the largest proper subset of this gate's set
        if (is.null(parent_bid)) {
          my_set <- bool_prim[[bid]] %||% character(0)
          best <- NULL
          best_size <- -1L
          for (oid in names(bool_names)) {
            if (identical(oid, bid)) next
            oset <- bool_prim[[oid]] %||% character(0)
            if (length(oset) == 0) next
            if (all(oset %in% my_set) && length(oset) < length(my_set) && length(oset) > best_size) {
              best <- oid
              best_size <- length(oset)
            }
          }
          parent_bid <- best
        }
        parents[[bid]] <- parent_bid
      }

      get_depth <- function(bid) {
        d <- 0L
        cur <- bid
        seen <- character(0)
        while (!is.null(parents[[cur]]) && !is.null(cur) && !cur %in% seen) {
          seen <- c(seen, cur)
          cur <- parents[[cur]]
          d <- d + 1L
        }
        d
      }

      ordered_bids <- names(bool_names)
      if (use_tree) {
        # The tree lists parents first and siblings in GateLab's order.
        tree_ids <- vapply(gatelab_format$tree, function(entry) entry$id, character(1))
        ordered_bids <- tree_ids[tree_ids %in% ordered_bids]
      } else if (length(ordered_bids) > 1) {
        ordered_bids <- ordered_bids[order(vapply(ordered_bids, get_depth, integer(1)))]
      }

      bid_to_pid <- setNames(vapply(ordered_bids, function(x) uuid::UUIDgenerate(), character(1)), ordered_bids)

      for (bid in ordered_bids) {
        pid <- bid_to_pid[[bid]]
        parent_bid <- parents[[bid]]
        parent_pid <- if (is.null(parent_bid)) root_pop_id else (bid_to_pid[[parent_bid]] %||% root_pop_id)

        my_prim <- bool_prim[[bid]] %||% character(0)
        parent_prim <- if (!is.null(parent_bid)) bool_prim[[parent_bid]] %||% character(0) else character(0)
        incr <- setdiff(my_prim, parent_prim)
        # A population whose gates are all in its parent's chain (one that gates on its parent's
        # gate again, say) selects exactly its parent's events. It keeps its own gates, which
        # those events all pass, and its place in the tree; one with no gates of its own takes
        # its parent's events. Dropping it left its children under an entry that was never made.
        if (length(incr) == 0L) incr <- my_prim

        refs <- list()
        include_map <- bool_include[[bid]] %||% list()
        for (rid in names(include_map)) {
          if (!rid %in% incr) next
          app_id <- gml_to_app[[rid]]
          if (is.null(app_id) || identical(app_id, rid)) next
          refs[[length(refs) + 1L]] <- new_gate_ref(app_id, include = isTRUE(include_map[[rid]]))
        }

        pop_name <- bool_names[[bid]] %||% "Population"
        pop <- list(
          population_id = pid,
          name = pop_name,
          gate_refs = refs,
          gate_logic = if (!is.null(raw_gates[[bid]]) &&
                          identical(raw_gates[[bid]]$operation, "or")) "or" else "and",
          parent_id = parent_pid,
          children = character(0),
          event_count = NULL,
          percent_of_parent = NULL
        )
        populations[[pid]] <- pop
        populations <- link_child_to_parent(populations, pid, parent_pid)
      }
    }
  }

  # The matrix the compensated dimensions reference, over the loaded data's channels (NA where a
  # detector is not one of them). resolve_gatingml_compensation() compares it with the data's own.
  spectrum <- dimension_compensation$spectrum
  spectrum_matrix <- NULL
  if (!is.null(spectrum)) {
    channels <- unname(vapply(spectrum$detectors, function(detector) {
      .gml_resolve_channel(detector, session_channels, pnn_to_channel) %||% NA_character_
    }, character(1)))
    matrix <- spectrum$matrix
    if (!anyNA(channels)) dimnames(matrix) <- list(channels, channels)
    spectrum_matrix <- list(
      id = spectrum$id,
      name = spectrum$name,
      detectors = spectrum$detectors,
      channels = channels,
      matrix = matrix
    )
  }

  list(
    gates = app_gates,
    gate_order = gate_order,
    populations = populations,
    root_population_id = root_pop_id,
    n_gates_imported = length(app_gates),
    n_gates_skipped = as.integer(n_skipped),
    skipped_channels = sort(unique(unresolved_channels)),
    source = .gml_detect_source(root),
    n_pops_imported = max(0L, length(populations) - 1L),
    scales = gatelabr_state$scales,
    cytof_cofactor = gatelabr_state$cytof_cofactor,
    compensation = gatelabr_state$compensation,
    compensation_refs = compensation_refs,
    spectrum_matrix = spectrum_matrix
  )
}
