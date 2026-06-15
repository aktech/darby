#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"code-block\"" "code block wrapper present"
assert_grep "$P" "data-copy" "copy button present"
assert_contains "$P" "app.js" "filename label rendered"
assert_grep "$P" "class=\"chroma\"" "chroma highlight applied"
finish
