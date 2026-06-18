#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

# --- Blog post: article OG + Twitter card + BlogPosting JSON-LD ---
A="$PUB/blog/introducing-darby/index.html"
assert_grep "$A" "rel=\"canonical\" href=\"https://example.org/blog/introducing-darby/\"" "canonical URL on post"
assert_grep "$A" "property=\"og:title\"" "og:title present"
assert_grep "$A" "property=\"og:type\" content=\"article\"" "post is og:type article"
assert_grep "$A" "property=\"og:image\" content=\"https://example.org/og/og-base_hu_[0-9a-f]*\.png\"" "post og:image is an auto-generated raster"
assert_grep "$A" "property=\"article:published_time\"" "article published time present"
assert_grep "$A" "name=\"twitter:card\" content=\"summary_large_image\"" "twitter large-image card"
assert_grep "$A" "name=\"twitter:site\" content=\"@iaktech\"" "twitter site handle"
assert_grep "$A" "application/ld\+json" "JSON-LD present on post"
assert_grep "$A" "\"@type\":\"BlogPosting\"" "BlogPosting structured data"

# --- Home: website OG + WebSite JSON-LD ---
H="$PUB/index.html"
assert_grep "$H" "property=\"og:type\" content=\"website\"" "home is og:type website"
assert_grep "$H" "\"@type\":\"WebSite\"" "WebSite structured data on home"
assert_grep "$H" "name=\"description\"" "meta description present"

# --- Docs page: canonical + og:image falls back to site default ---
D="$PUB/docs/quickstart/index.html"
assert_grep "$D" "rel=\"canonical\"" "canonical on docs page"
assert_grep "$D" "property=\"og:image\" content=\"https://example.org/sample-image.png\"" "default og:image on docs"
finish
