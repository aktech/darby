#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "data-sidebar-toggle" "hamburger button present"
assert_grep "$P" "theme\.bundle.*\.js" "sidebar js bundled"
finish
