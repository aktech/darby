#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/index.html"
assert_grep "$P" "class=\"lp-hero\"" "hero present"
assert_contains "$P" "Get started" "hero CTA present"
assert_grep "$P" "class=\"bento\"" "feature showcase present"
assert_grep "$P" "class=\"lp-stats\"" "stats strip present"
finish
