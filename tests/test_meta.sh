#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "edit-link" "edit-on-GitHub link present"
assert_grep "$P" "github.com/acme/docs" "edit URL built from config"
assert_grep "$P" "class=\"site-footer\"" "footer present"
finish
