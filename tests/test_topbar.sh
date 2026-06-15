#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"nav-tabs\"" "top-bar tabs present"
assert_contains "$P" "Guides" "configured tab label present"
assert_grep "$P" "class=\"version-switcher\"" "version switcher present"
assert_contains "$P" "v2.0" "current version shown"
finish
