#!/usr/bin/env bash
# Subpath deploy safety: when the site is hosted under a path
# (example.org/sub/), every internal URL must carry the /sub/ prefix.
# Author-written root-absolute links in Markdown ([x](/docs/...)) are the
# easy thing to get wrong: the render-link hook must rewrite them, not emit
# them verbatim (which would resolve to the domain root and 404).
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

OUT="$(mktemp -d)"
( cd "$ROOT/exampleSite" && hugo --quiet --gc -d "$OUT" --baseURL "https://example.org/sub/" ) \
  || { echo "SUBPATH BUILD FAILED"; exit 1; }

Q="$OUT/docs/quickstart/index.html"

# Content link authored as [x](/docs/configuration/) must gain the subpath.
assert_grep "$Q" 'href="/sub/docs/configuration/"' "root-absolute content link is subpath-prefixed"
assert_not_contains "$Q" 'href="/docs/configuration/"' "no bare root-absolute content link survives"

# Root-absolute image in Markdown ([x](/sample-image.png)) too.
M="$OUT/reference/markdown/index.html"
assert_grep "$M" 'src="/sub/sample-image.png"' "root-absolute content image is subpath-prefixed"
assert_not_contains "$M" 'src="/sample-image.png"' "no bare root-absolute content image survives"

# In-page anchors and external links must pass through untouched.
assert_not_contains "$Q" 'href="/sub/#' "in-page anchors are not rewritten"

finish
