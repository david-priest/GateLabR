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

not_problem <- tryCatch(
  {
    import_gatingml_from_cytobank(write_gml(not_xml), "X")
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl(
  'Population "Outside" uses NOT logic; GateLabR currently imports positive AND populations only',
  not_problem,
  fixed = TRUE
))
stopifnot(grepl(
  "No gates or populations were imported; the current workspace was not changed",
  not_problem,
  fixed = TRUE
))

and_complement_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <gating:RectangleGate gating:id="range-1" gating:name="Inside">
    <gating:dimension gating:min="0" gating:max="1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:BooleanGate gating:id="and-not-1" gating:name="Outside">
    <gating:and>
      <gating:gateReference gating:ref="range-1" gating:complement="true"/>
    </gating:and>
  </gating:BooleanGate>
</gating:Gating-ML>'

and_complement_problem <- tryCatch(
  {
    import_gatingml_from_cytobank(write_gml(and_complement_xml), "X")
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl('Population "Outside" uses NOT logic', and_complement_problem, fixed = TRUE))

hierarchy_not_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <gating:RectangleGate gating:id="range-1" gating:name="Inside">
    <gating:dimension gating:min="0" gating:max="1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:GatingHierarchy>
    <gating:PopulationGatePair gating:gate-ref="range-1" gating:complement="true">
      <gating:name>Outside</gating:name>
    </gating:PopulationGatePair>
  </gating:GatingHierarchy>
</gating:Gating-ML>'

hierarchy_problem <- tryCatch(
  {
    import_gatingml_from_cytobank(write_gml(hierarchy_not_xml), "X")
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl('Population "Outside" uses NOT logic', hierarchy_problem, fixed = TRUE))

or_xml <- '<?xml version="1.0"?>
<gating:Gating-ML xmlns:gating="http://www.isac-net.org/std/Gating-ML/v2.0/gating"
  xmlns:data-type="http://www.isac-net.org/std/Gating-ML/v2.0/datatypes">
  <gating:RectangleGate gating:id="range-1" gating:name="Low">
    <gating:dimension gating:min="0" gating:max="1"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:RectangleGate gating:id="range-2" gating:name="High">
    <gating:dimension gating:min="2" gating:max="3"><data-type:fcs-dimension data-type:name="X"/></gating:dimension>
  </gating:RectangleGate>
  <gating:BooleanGate gating:id="or-1" gating:name="Low or high">
    <gating:or>
      <gating:gateReference gating:ref="range-1"/>
      <gating:gateReference gating:ref="range-2"/>
    </gating:or>
  </gating:BooleanGate>
</gating:Gating-ML>'

or_problem <- tryCatch(
  {
    import_gatingml_from_cytobank(write_gml(or_xml), "X")
    ""
  },
  error = function(e) conditionMessage(e)
)
stopifnot(grepl('Population "Low or high" uses OR logic', or_problem, fixed = TRUE))

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
