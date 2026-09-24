#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

P="$PUB/reference/architecture/index.html"
assert_grep "$P" "class=\"doodle-wrap\"" "diagram wrapper rendered"
assert_grep "$P" "data-doodle-source" "showSource fence opts into the source panel"
assert_grep "$P" "<pre class=\"mermaid\">" "diagram source emitted as a mermaid pre"
assert_grep "$P" "mermaid-doodle[.a-z0-9]*\.js" "plugin bundle loaded"
assert_grep "$P" "mermaid[.a-z0-9]*\.min[.a-z0-9]*\.js" "vendored mermaid loaded"
assert_not_contains "$P" "mermaid-init" "old init script no longer referenced"

# A fence with no showSource attribute must not opt into the source panel.
# code-blocks/ carries the only plain (no showSource) fence in the example
# site, so a page-wide assert_not_contains is unambiguous here: there is no
# other diagram on the page whose data-doodle-source could cause a false pass.
N="$PUB/reference/code-blocks/index.html"
assert_grep "$N" "class=\"doodle-wrap\"" "plain fence still gets a wrapper"
assert_not_contains "$N" "data-doodle-source" "plain fence omits the source-panel attribute"

# The mermaid payload is 3.3MB, so it must stay off pages with no diagrams.
Q="$PUB/docs/quickstart/index.html"
assert_not_contains "$Q" "mermaid-doodle" "plugin not loaded on pages without diagrams"
assert_not_contains "$Q" "mermaid.min" "mermaid not loaded on pages without diagrams"

# Integrity check for the vendored diagram bundle: does the committed file
# still match the sha256 recorded alongside it, so a corrupted, truncated,
# or hand-edited bundle fails here instead of being discovered months later.
# This proves nothing about whether the bundle matches the latest upstream
# build; that needs the source package installable, which it is not yet
# (unpublished, private repo). Re-vendor with scripts/vendor-mermaid-doodle.sh.
BUNDLE="$ROOT/assets/js/lib/mermaid-doodle.iife.js"
RECORD="$BUNDLE.provenance"
assert_file "$RECORD" "vendored diagram bundle has a provenance record"
if command -v sha256sum >/dev/null 2>&1; then
  BUNDLE_SHA="$(sha256sum "$BUNDLE" | cut -d' ' -f1)"
else
  BUNDLE_SHA="$(shasum -a 256 "$BUNDLE" | cut -d' ' -f1)"
fi
assert_contains "$RECORD" "SHA256=$BUNDLE_SHA" "vendored diagram bundle matches its recorded sha256"

finish
