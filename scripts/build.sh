#!/usr/bin/env bash
# Build the site. Runs Pagefind only when search.backend = pagefind.
set -euo pipefail
SITE="${1:-.}"
hugo --gc --minify -s "$SITE"
# Detect the search backend in either the single-file (hugo.*) or config/_default/ layout.
if grep -REq 'backend\s*=\s*"pagefind"' "$SITE"/hugo.* "$SITE"/config 2>/dev/null; then
  npx -y pagefind --site "$SITE/public"
fi
