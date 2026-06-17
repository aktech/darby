#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

# Scope assertions to the rendered <footer> block only, so matches in the
# top bar / page content cannot produce false passes.
F="$(mktemp)"
sed -n '/<footer class="site-footer"/,/<\/footer>/p' "$PUB/docs/quickstart/index.html" > "$F"

# Customizable link columns
assert_grep "$F" "class=\"footer-columns\"" "footer columns container present"
assert_contains "$F" "Resources" "configured column title rendered"
assert_grep "$F" "href=\"/guides/\"" "configured column link rendered"

# Social icons rendered as SVGs (not plain text), keyed by platform name
assert_grep "$F" "class=\"footer-social-link\"" "social icon link present"
assert_grep "$F" "aria-label=\"linkedin\"" "social link labelled by platform"
assert_grep "$F" "<svg" "social link renders an svg icon"

# Bottom bar: customizable copyright + powered-by credit
assert_grep "$F" "class=\"footer-bottom\"" "bottom bar present"
assert_contains "$F" "© 2026 Darby. MIT Licensed." "configured copyright rendered"
assert_grep "$F" "class=\"footer-powered\"" "powered-by credit present"

finish
