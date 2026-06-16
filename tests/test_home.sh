#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/index.html"
assert_grep "$P" "class=\"lp-hero\"" "hero present"
assert_contains "$P" "Get started" "hero CTA present"
assert_grep "$P" "class=\"bento\"" "feature showcase present"
# Showcase is driven by [[features]] front matter, not hardcoded copy.
assert_contains "$P" "Built for documentation" "featuresTitle comes from front matter"
assert_contains "$P" "Gorgeous code blocks" "feature title comes from front matter"
# Each feature's `demo` selects a built-in rich visual.
assert_grep "$P" "class=\"mini-code\"" "feature demo visual renders"
assert_grep "$P" "class=\"mini-search\"" "second feature demo visual renders"
# Hero code window is driven by heroCodeHTML front matter.
assert_contains "$P" "github.com/aktech/darby" "hero code comes from front matter"
finish
