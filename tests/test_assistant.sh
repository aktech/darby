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

# Import-closure: every ./*.mjs imported by a published runtime module must
# itself be published, or native ESM imports 404 and the panel never boots.
# (Build-only modules like chunk/html-extract are intentionally not published.)
missing=""
for f in "$PUB"/js/assistant/*.mjs; do
  for imp in $(grep -ohE 'from "\./[A-Za-z0-9_-]+\.mjs"' "$f" | grep -oE '[A-Za-z0-9_-]+\.mjs'); do
    [ -f "$PUB/js/assistant/$imp" ] || missing="$missing $imp(<-$(basename "$f"))"
  done
done
if [ -z "$missing" ]; then echo "PASS: all imported runtime modules are published"; PASS=$((PASS+1));
else echo "FAIL: unpublished imported modules:$missing"; FAIL=$((FAIL+1)); fi

finish
