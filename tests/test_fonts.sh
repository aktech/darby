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

# Custom font stacks: the FIRST family of each stack is fetched from Google
# Fonts; generic / system families in the stack are NOT requested (they are not
# Google families and would break the request).
D="$PUB/docs/quickstart/index.html"
assert_grep "$D" "family=Inter:wght" "first family of body stack fetched from Google"
assert_grep "$D" "family=Space.*Grotesk:wght" "heading family fetched from Google"
assert_grep "$D" "family=Fira.*Code:wght" "mono family fetched from Google"
assert_not_contains "$D" "family=sans-serif" "generic family not requested from Google"
assert_not_contains "$D" "family=system-ui" "system font not requested from Google"
assert_not_contains "$D" "family=ui-monospace" "ui-monospace not requested from Google"

# postTitleFont is fetched from Google on blog post pages (where the title
# renders) and NOT on docs pages.
assert_grep "$PUB/blog/introducing-darby/index.html" "family=Lora:wght" "postTitleFont fetched from Google on blog posts"
assert_not_contains "$D" "family=Lora" "postTitleFont not fetched on docs pages"

finish
