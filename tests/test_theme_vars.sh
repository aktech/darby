#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_contains "$P" "--accent:#331c74" "configured accent injected into :root"
assert_contains "$P" "--brand-logo-height:2rem" "configured logo height injected into :root"
assert_contains "$P" "--post-title-size:2.6rem" "configured blog post title size injected into :root"
assert_contains "$P" "--post-title-font:Playfair Display, serif" "configured blog post title font injected into :root"
BUNDLE="$(ls "$PUB"/css/main.bundle*.css 2>/dev/null | head -1)"
assert_grep "$BUNDLE" "--font-heading" "heading font variable present in CSS bundle"
assert_grep "$P" "stylesheet.*main.*css" "main.css linked"
assert_grep "$P" "data-theme" "no-flash theme script sets data-theme"

# The param :root override must be emitted AFTER the CSS bundle link. Otherwise
# tokens.css (loaded via the later <link>) wins at equal specificity and the
# configured values never take effect (injected-but-ignored).
LINK_LINE="$(grep -n "main.bundle" "$P" | head -1 | cut -d: -f1)"
ROOT_LINE="$(grep -n ":root{" "$P" | head -1 | cut -d: -f1)"
if [ -n "$LINK_LINE" ] && [ -n "$ROOT_LINE" ] && [ "$ROOT_LINE" -gt "$LINK_LINE" ]; then
  echo "PASS: param :root override emitted after the CSS bundle"; PASS=$((PASS+1))
else
  echo "FAIL: param :root override must come after the bundle link (link=$LINK_LINE root=$ROOT_LINE)"; FAIL=$((FAIL+1))
fi
finish
