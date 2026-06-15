#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
assert_file "$PUB/index.html" "home page builds"
assert_file "$PUB/docs/quickstart/index.html" "doc page builds"
assert_grep "$PUB/docs/quickstart/index.html" "Quickstart" "doc renders its title"
finish
