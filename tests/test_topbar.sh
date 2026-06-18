#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"nav-tabs\"" "top-bar tabs present"
assert_contains "$P" "Guides" "configured tab label present"
assert_grep "$P" "class=\"nav-tab-indicator\"" "sliding hover indicator element present"
assert_grep "$P" "class=\"version-switcher\"" "version switcher present"
assert_contains "$P" "v2.0" "current version shown"

# Custom top-bar background (params.topbarBg): the bar becomes a dark surface.
TBP="$(build_site_with topbarbg=#0b1020)/docs/quickstart/index.html"
assert_grep "$TBP" "class=\"topbar\" data-solid" "topbar marked as a solid surface"
assert_contains "$TBP" "--topbar-bg:#0b1020" "configured topbar background injected into :root"

# Customizable extra nav links in the top bar
assert_grep "$P" "class=\"nav-links\"" "nav-links container present"
assert_grep "$P" "href=\"https://discourse.gohugo.io/\"[^>]*target=\"_blank\"" "external nav link opens in new tab"

# Mega-menu: shared morphing panel with section columns, items + descriptions
assert_grep "$P" "data-megamenu" "mega-menu container present"
assert_grep "$P" "nav-dd-trigger[^>]*>Resources" "mega-menu trigger shows parent name"
assert_grep "$P" "data-mm-panel=\"resources\"" "per-trigger panel present"
assert_grep "$P" "class=\"mm-bg\"" "morphing background element present"
assert_grep "$P" "mm-col-title\">Explore<" "column section title rendered"
assert_grep "$P" "mm-item-desc\">Up and running in minutes<" "item description rendered"
assert_grep "$P" "mm-item-title\">Quickstart<" "item title rendered"
assert_grep "$P" "class=\"lucide lucide-rocket" "item icon is a real (Lucide) icon"

finish
