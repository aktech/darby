#!/usr/bin/env bash
# Shared test helpers. Build the example site once, then assert on rendered HTML.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUB="$ROOT/exampleSite/public"
PASS=0; FAIL=0

build_site() {
  if [ -z "${_BUILT:-}" ]; then
    ( cd "$ROOT/exampleSite" && hugo --quiet --gc --cleanDestinationDir --enableGitInfo ) || { echo "BUILD FAILED"; exit 1; }
    _BUILT=1
  fi
}

assert_contains() { # file pattern message
  if grep -qF -- "$2" "$1" 2>/dev/null; then echo "PASS: $3"; PASS=$((PASS+1));
  else echo "FAIL: $3 (missing '$2' in $1)"; FAIL=$((FAIL+1)); fi
}
assert_grep() { # file regex message  (extended regex)
  if grep -qE -- "$2" "$1" 2>/dev/null; then echo "PASS: $3"; PASS=$((PASS+1));
  else echo "FAIL: $3 (regex '$2' not in $1)"; FAIL=$((FAIL+1)); fi
}
assert_not_contains() { # file pattern message
  if grep -qF -- "$2" "$1" 2>/dev/null; then echo "FAIL: $3 (unexpected '$2' in $1)"; FAIL=$((FAIL+1));
  else echo "PASS: $3"; PASS=$((PASS+1)); fi
}
assert_file() { # path message
  if [ -f "$1" ]; then echo "PASS: $2"; PASS=$((PASS+1));
  else echo "FAIL: $2 (no file $1)"; FAIL=$((FAIL+1)); fi
}
finish() { echo "---"; echo "$PASS passed, $FAIL failed"; [ "$FAIL" -eq 0 ]; }
