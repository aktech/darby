#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"

# Opt-in trigger + panel render when [params.assistant] enable = true.
assert_grep "$P" "data-assistant-trigger" "ask-assistant trigger present"
assert_grep "$P" "id=\"?assistant-panel\"?" "assistant panel present"
assert_grep "$P" "data-assistant-input" "question input present"

# Config is injected for the browser runtime, defaulting to the no-backend mode.
assert_grep "$P" "darby-assistant-config" "assistant config script present"
assert_contains "$P" "\"backend\":\"browser\"" "client-side backend by default"

# Modules are published (not fingerprinted) so native ESM imports resolve.
assert_grep "$P" "js/assistant/ui.mjs" "ui module loaded"
assert_file "$PUB/js/assistant/worker.mjs" "worker module published"
assert_file "$PUB/js/assistant/config.mjs" "shared config module published"

# The prebuilt retrieval index ships with the site (generated; present when built).
assert_file "$PUB/assistant-index.json" "retrieval index shipped"

finish
