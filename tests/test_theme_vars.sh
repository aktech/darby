#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_contains "$P" "--accent:#7c3aed" "configured accent injected into :root"
BUNDLE="$(ls "$PUB"/css/main.bundle*.css 2>/dev/null | head -1)"
assert_grep "$BUNDLE" "--font-heading" "heading font variable present in CSS bundle"
assert_grep "$P" "stylesheet.*main.*css" "main.css linked"
assert_grep "$P" "data-theme" "no-flash theme script sets data-theme"
finish
