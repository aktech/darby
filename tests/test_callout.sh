#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "callout callout-warning" "warning callout via shortcode"
assert_grep "$P" "callout callout-note" "note callout via GitHub alert"
finish
