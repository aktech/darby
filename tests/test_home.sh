#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/index.html"
assert_grep "$P" "class=\"hero\"" "hero present"
assert_contains "$P" "Get started" "hero CTA present"
assert_grep "$P" "class=\"home-features\"" "feature grid present"
finish
