#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"pager\"" "pager present"
# Prove Installation is the Next link inside the pager (not just sidebar text):
# pager-next and the Installation title render on the same line, so a line-based
# regex confirms it is inside the pager-next block, not elsewhere on the page.
assert_grep "$P" "pager-next.*Installation" "next link points to next doc"
finish
