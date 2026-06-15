#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/reference/shortcodes/index.html"
assert_grep "$P" "class=\"tabs\"" "tabs render"
assert_grep "$P" "data-tab-btn" "tab buttons render"
assert_grep "$P" "class=\"cards\"" "cards grid renders"
assert_grep "$P" "class=\"steps\"" "steps render"
finish
