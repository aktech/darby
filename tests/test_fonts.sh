#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

# The blog uses a serif pairing (Merriweather body, Lora titles). The font link
# must load on every page that renders post prose or post summaries: the blog
# feed, individual posts, taxonomy/term pages (they reuse the post feed), and
# the home page (adopters commonly make home a "latest posts" feed). Docs pages
# never use the serif, so they must NOT pull the extra font payload.

assert_grep "$PUB/blog/index.html" "Merriweather" "blog feed loads the serif fonts"
assert_grep "$PUB/blog/introducing-darby/index.html" "Merriweather" "blog post loads the serif fonts"
assert_grep "$PUB/tags/announcement/index.html" "Merriweather" "tag feed (post-summary) loads the serif fonts"
assert_grep "$PUB/index.html" "Merriweather" "home loads the serif fonts (home-as-feed adopters)"

assert_not_contains "$PUB/docs/installation/index.html" "Merriweather" "docs pages stay serif-free"

finish
