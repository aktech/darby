#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "class=\"toc\"" "toc present on page with headings"
assert_contains "$P" "#install" "toc links to heading anchor"
finish
