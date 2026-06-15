#!/usr/bin/env bash
# Build the site. Runs Pagefind only when search.backend = pagefind.
set -euo pipefail
SITE="${1:-.}"
hugo --gc --minify -s "$SITE"
if grep -Eq 'backend\s*=\s*"pagefind"' "$SITE"/hugo.* 2>/dev/null; then
  npx -y pagefind --site "$SITE/public"
fi
