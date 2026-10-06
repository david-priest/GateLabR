# agent.R -- opening the tab connected to an agent's relay.
#
# GateLab's Agent menu lets a tab connect to a relay on this computer (GateLab's
# tools/agent-mcp/server.mjs, an MCP server), through which an agent reads the gating and proposes
# gates that appear in the tab at once. The relay keeps its address in ~/.gatelab/agent-relay.json
# so that a launcher can find it: launchGatingApp(sce, agent = TRUE) reads the file and opens the
# tab with ?agent=<address>, and the core connects on load. Nothing here touches the object or the
# gating; the agent's writes go through the same browser session as the user's.

.gatelabr_agent_relay_file <- function() {
  getOption("gatelabr.agent_relay_file", path.expand("~/.gatelab/agent-relay.json"))
}

#' The relay address a launch should hand the tab, or NULL for none.
#'
#' @param agent \code{NULL} or \code{FALSE} for no agent; \code{TRUE} to read the address the
#'   relay recorded in \code{~/.gatelab/agent-relay.json}; or the \code{ws://} address itself.
#' @noRd
.gatelabr_agent_relay_url <- function(agent) {
  if (is.null(agent) || isFALSE(agent)) return(NULL)
  if (isTRUE(agent)) {
    file <- .gatelabr_agent_relay_file()
    if (!file.exists(file)) {
      stop(
        "agent = TRUE, but no relay has recorded its address at ", file, ". Start the relay ",
        "first (an MCP client such as Claude Code starts GateLab's tools/agent-mcp/server.mjs), ",
        "or pass its ws:// address as `agent`.",
        call. = FALSE
      )
    }
    saved <- tryCatch(jsonlite::fromJSON(file, simplifyVector = TRUE), error = function(cause) {
      stop("The relay file ", file, " could not be read: ", conditionMessage(cause), call. = FALSE)
    })
    agent <- saved$url
    if (!is.character(agent) || length(agent) != 1L || is.na(agent) || !nzchar(agent)) {
      stop("The relay file ", file, " records no address.", call. = FALSE)
    }
  }
  if (!is.character(agent) || length(agent) != 1L || is.na(agent) || !grepl("^wss?://", agent)) {
    stop(
      "`agent` must be TRUE, FALSE or the relay's ws:// address (ws://127.0.0.1:48123/?token=...).",
      call. = FALSE
    )
  }
  agent
}

#' The page URL with the relay address on it, as the core expects it (?agent=<encoded address>).
#' @noRd
.gatelabr_agent_page_url <- function(app_url, relay_url) {
  paste0(sub("/+$", "", app_url), "/?agent=", utils::URLencode(relay_url, reserved = TRUE))
}

#' What to pass Shiny as launch.browser so the tab opens connected.
#'
#' Shiny calls \code{launch.browser(url)} with the app's own address; the function opens the page
#' with the relay on it instead, and says what it opened, so the address can be pasted into the
#' Agent menu by hand if the browser does not come up.
#' @noRd
.gatelabr_agent_browser <- function(relay_url) {
  force(relay_url)
  function(url) {
    page <- .gatelabr_agent_page_url(url, relay_url)
    message("GateLabR: opening ", page, "\n  (the tab connects to the agent relay at ", relay_url, ")")
    utils::browseURL(page)
  }
}
