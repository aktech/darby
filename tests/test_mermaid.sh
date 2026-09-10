#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

P="$PUB/reference/architecture/index.html"
assert_grep "$P" "class=\"doodle-wrap\"" "diagram wrapper rendered"
assert_grep "$P" "data-doodle-source" "showSource fence opts into the source panel"
assert_grep "$P" "<pre class=\"mermaid\">" "diagram source emitted as a mermaid pre"
assert_grep "$P" "mermaid-doodle[.a-z0-9]*\.js" "plugin bundle loaded"
assert_grep "$P" "mermaid[.a-z0-9]*\.min[.a-z0-9]*\.js" "vendored mermaid loaded"
assert_not_contains "$P" "mermaid-init" "old init script no longer referenced"

# The mermaid payload is 3.3MB, so it must stay off pages with no diagrams.
Q="$PUB/docs/quickstart/index.html"
assert_not_contains "$Q" "mermaid-doodle" "plugin not loaded on pages without diagrams"
assert_not_contains "$Q" "mermaid.min" "mermaid not loaded on pages without diagrams"

finish
