#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
assert_file "$PUB/index.json" "search index emitted"
assert_grep "$PUB/index.json" "Quickstart" "index contains a doc title"
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "data-search-trigger" "search trigger present"
assert_grep "$P" "id=\"search-modal\"" "search modal present"
finish
