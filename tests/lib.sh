#!/usr/bin/env bash
# Shared test helpers. Build the example site once, then assert on rendered HTML.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUB="$ROOT/exampleSite/public"
PASS=0; FAIL=0

# Build the example site with extra theme params injected via HUGO_PARAMS_*
# env vars, into a throwaway dir. Lets feature-injection be asserted without
# baking demo values into the shared exampleSite config. Echoes the dir.
build_site_with() { # KEY=value ...  (KEY is the lowercased param name)
  local out; out="$(mktemp -d)"
  local env_args=(); for kv in "$@"; do env_args+=("HUGO_PARAMS_${kv%%=*}=${kv#*=}"); done
  ( cd "$ROOT/exampleSite" && env "${env_args[@]}" hugo --quiet --gc -d "$out" ) || { echo "VARIANT BUILD FAILED"; exit 1; }
  echo "$out"
}

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
