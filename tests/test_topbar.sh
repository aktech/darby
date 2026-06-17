#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"nav-tabs\"" "top-bar tabs present"
assert_contains "$P" "Guides" "configured tab label present"
assert_grep "$P" "class=\"version-switcher\"" "version switcher present"
assert_contains "$P" "v2.0" "current version shown"

# Customizable extra nav links in the top bar
assert_grep "$P" "class=\"nav-links\"" "nav-links container present"
assert_grep "$P" "nav-link\"[^>]*>Community<" "configured plain nav link rendered"
assert_grep "$P" "href=\"https://discourse.gohugo.io/\"[^>]*target=\"_blank\"" "external nav link opens in new tab"

# Nested dropdown nav link (parent with child links + per-child icons)
assert_grep "$P" "class=\"nav-dropdown\"" "nested nav dropdown present"
assert_grep "$P" "nav-dropdown-btn[^>]*>Resources" "dropdown trigger shows parent name"
assert_grep "$P" "class=\"nav-dropdown-menu\"" "dropdown menu present"
assert_grep "$P" "nav-dropdown-link\"[^>]*href=\"/docs/quickstart/\"" "child link rendered"
assert_grep "$P" "nav-dropdown-icon\"><svg" "child link has an icon"

finish
