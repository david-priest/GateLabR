source_app_r_dir <- file.path(getwd(), "inst", "app", "R")
app_r_dir <- if (dir.exists(source_app_r_dir)) {
  source_app_r_dir
} else {
  system.file("app", "R", package = "GateLabR", mustWork = TRUE)
}
for (file in c("models.R", "fcs_import.R", "gate_engine.R", "gatingml_import.R")) {
  sys.source(file.path(app_r_dir, file), envir = globalenv())
}

write_gml <- function(text) {
  path <- tempfile(fileext = ".xml")
  writeLines(text, path, useBytes = TRUE)
  path
}

not_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <gating:RectangleGate gating:id="range-1" gating:name="Inside">
    <gating:dimension gating:min="0" gating:max="1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:BooleanGate gating:id="not-1" gating:name="Outside">
    <gating:not><gating:gateReference gating:ref="range-1"/></gating:not>
  </gating:BooleanGate>
</gating:Gating-ML>'

parsed <- import_gatingml_from_cytobank(write_gml(not_xml), "X")
stopifnot(length(parsed$gates) == 1L)
range_gate <- parsed$gates[[1]]
stopifnot(identical(range_gate$gate_type, "rectangle"))
stopifnot(identical(range_gate$x_channel, "X"))
stopifnot(identical(range_gate$y_channel, "X"))

outside_id <- names(Filter(function(pop) identical(pop$name, "Outside"), parsed$populations))[[1]]
outside <- parsed$populations[[outside_id]]
stopifnot(length(outside$gate_refs) == 1L)
stopifnot(identical(outside$gate_refs[[1]]$include, FALSE))

mat <- matrix(c(-1, 0.5, 2), ncol = 1, dimnames = list(NULL, "X"))
masks <- apply_gating_strategy(
  parsed$gates, parsed$populations, parsed$root_population_id, mat
)$masks
stopifnot(identical(unname(masks[[outside_id]]), c(TRUE, FALSE, TRUE)))

hierarchy_not_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <gating:RectangleGate gating:id="range-1" gating:name="Inside">
    <gating:dimension gating:min="0" gating:max="1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:BooleanGate gating:id="not-1" gating:name="Outside">
    <gating:not><gating:gateReference gating:ref="range-1"/></gating:not>
  </gating:BooleanGate>
  <gating:GatingHierarchy>
    <gating:PopulationGatePair gating:gate-ref="not-1" gating:complement="true">
      <gating:name>Inside again</gating:name>
    </gating:PopulationGatePair>
  </gating:GatingHierarchy>
</gating:Gating-ML>'

hierarchy_parsed <- import_gatingml_from_cytobank(write_gml(hierarchy_not_xml), "X")
inside_id <- names(Filter(
  function(pop) identical(pop$name, "Inside again"),
  hierarchy_parsed$populations
))[[1]]
inside_ref <- hierarchy_parsed$populations[[inside_id]]$gate_refs[[1]]
stopifnot(identical(inside_ref$include, TRUE))

unsupported_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:transforms="http://www.isac-net.org/std/Gating-ML/v2.0/transformations"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <transforms:transformation transforms:id="linear-1"><transforms:linear transforms:T="100" transforms:A="0"/></transforms:transformation>
  <gating:PolygonGate gating:id="poly-1">
    <gating:dimension gating:transformation-ref="linear-1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
    <gating:dimension gating:transformation-ref="linear-1"><data-type:fcs-dimension data-type:name="Y"/></gating:dimension>
    <gating:vertex><gating:coordinate data-type:value="0"/><gating:coordinate data-type:value="0"/></gating:vertex>
    <gating:vertex><gating:coordinate data-type:value="1"/><gating:coordinate data-type:value="0"/></gating:vertex>
    <gating:vertex><gating:coordinate data-type:value="1"/><gating:coordinate data-type:value="1"/></gating:vertex>
  </gating:PolygonGate>
  <gating:EllipsoidGate gating:id="ellipse-1"/>
</gating:Gating-ML>'

problem <- tryCatch(
  {
    import_gatingml_from_cytobank(write_gml(unsupported_xml), c("X", "Y"))
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl("EllipsoidGate ellipse-1 is not supported", problem, fixed = TRUE))
stopifnot(grepl("transformation linear-1", problem, fixed = TRUE))
