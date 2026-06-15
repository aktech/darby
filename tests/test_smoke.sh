#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
assert_file "$PUB/index.html" "home page builds"
assert_file "$PUB/docs/quickstart/index.html" "doc page builds"
assert_grep "$PUB/docs/quickstart/index.html" "<h1>Quickstart</h1>" "doc renders its title in h1"
finish
