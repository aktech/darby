#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "data-theme-toggle" "toggle button present"
assert_grep "$P" "theme.*\.js" "theme.js loaded"
finish
