#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
assert_file "$ROOT/scripts/build.sh" "build wrapper exists"
assert_file "$ROOT/README.md" "README exists"
if command -v htmltest >/dev/null 2>&1; then
  ( cd "$ROOT/exampleSite" && htmltest -s public ) && { echo "PASS: htmltest clean"; PASS=$((PASS+1)); } || { echo "FAIL: htmltest"; FAIL=$((FAIL+1)); }
else
  echo "SKIP: htmltest not installed"
fi
finish
