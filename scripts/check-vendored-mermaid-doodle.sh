#!/usr/bin/env bash
# Verify the vendored diagram bundle still matches the mermaid-doodle
# version pinned in package.json. The committed bundle can drift from the
# published package (a version bump nobody re-vendored), and the render
# tests alone cannot catch that: they only check the bundle against its own
# recorded hash, which passes even when both are stale together.
#
# Downloads only the pinned version's tarball via `npm pack`, so this stays
# fast without installing the full dependency tree (this theme's other
# dependency, @huggingface/transformers, is large).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUNDLE="$ROOT/assets/js/lib/mermaid-doodle.iife.js"

PINNED_VERSION="$(grep -m1 '"mermaid-doodle"' "$ROOT/package.json" | sed -E 's/.*"mermaid-doodle": *"([^"]+)".*/\1/')"
if [ -z "$PINNED_VERSION" ]; then
  echo "error: no mermaid-doodle version pinned in package.json" >&2
  exit 1
fi

sha256_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

if ! ( cd "$WORK" && npm pack "mermaid-doodle@$PINNED_VERSION" --loglevel=warn >/dev/null ); then
  echo "error: npm pack could not fetch mermaid-doodle@$PINNED_VERSION from the registry" >&2
  echo "fix: check that the version pinned in package.json's devDependencies is actually published" >&2
  exit 1
fi
TARBALL="$WORK/mermaid-doodle-$PINNED_VERSION.tgz"
if [ ! -f "$TARBALL" ]; then
  echo "error: npm pack did not produce a tarball for mermaid-doodle@$PINNED_VERSION" >&2
  exit 1
fi

tar -xzf "$TARBALL" -C "$WORK"
PUBLISHED_FILE="$WORK/package/dist/auto.iife.js"
if [ ! -f "$PUBLISHED_FILE" ]; then
  echo "error: mermaid-doodle@$PINNED_VERSION has no dist/auto.iife.js" >&2
  exit 1
fi

BUNDLE_SHA="$(sha256_of "$BUNDLE")"
PUBLISHED_SHA="$(sha256_of "$PUBLISHED_FILE")"

if [ "$BUNDLE_SHA" != "$PUBLISHED_SHA" ]; then
  echo "error: assets/js/lib/mermaid-doodle.iife.js does not match mermaid-doodle@$PINNED_VERSION on npm" >&2
  echo "  committed sha256: $BUNDLE_SHA" >&2
  echo "  published sha256: $PUBLISHED_SHA" >&2
  echo "fix: run 'npm install && bash scripts/vendor-mermaid-doodle.sh', then commit the result" >&2
  exit 1
fi

echo "vendored bundle matches mermaid-doodle@$PINNED_VERSION (sha256 $BUNDLE_SHA)"
