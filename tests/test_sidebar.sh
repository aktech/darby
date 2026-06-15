#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"sidebar\"" "sidebar present"
assert_contains "$P" "Installation" "sidebar lists sibling page"
assert_contains "$P" "Configuration" "sidebar lists other section page"
assert_grep "$P" "sidebar-link[^\"]*active" "active page marked"
finish
