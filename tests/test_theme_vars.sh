#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_contains "$P" "--accent:#6366f1" "configured accent injected into :root"
assert_contains "$P" "--font-heading" "heading font variable present"
assert_grep "$P" "stylesheet.*main.*css" "main.css linked"
assert_grep "$P" "data-theme" "no-flash theme script sets data-theme"
finish
