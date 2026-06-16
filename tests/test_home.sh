#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/index.html"
assert_grep "$P" "class=\"lp-hero\"" "hero present"
assert_contains "$P" "Get started" "hero CTA present"
assert_grep "$P" "class=\"bento\"" "feature showcase present"
# Showcase is driven by [[features]] front matter, not hardcoded copy.
assert_contains "$P" "Dark &amp; light modes" "feature title comes from front matter"
assert_contains "$P" "Batteries included" "featuresSubtitle comes from front matter"
# Hero code window is driven by heroCode front matter.
assert_contains "$P" "hugo new site" "hero code comes from front matter"
finish
