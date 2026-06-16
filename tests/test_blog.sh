#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site

# Blog index: vertical feed of posts, no docs nav-tree sidebar.
BL="$PUB/blog/index.html"
assert_file "$BL" "blog index renders"
assert_contains "$BL" "Introducing Darby" "intro post listed on the index"
assert_grep "$BL" "min read" "reading time shown in the feed"
assert_not_contains "$BL" "class=\"sidebar\"" "blog index has no docs sidebar"

# Topbar exposes the Blog section.
assert_grep "$BL" ">Blog<" "Blog tab present in the top bar"

# Single post: standalone prose with byline, tags, and no docs sidebar.
P="$PUB/blog/introducing-darby/index.html"
assert_file "$P" "intro post renders"
assert_grep "$P" "min read" "byline shows reading time"
assert_contains "$P" "The Darby Team" "byline shows the author"
assert_grep "$P" "post-tag" "tag chips rendered"
assert_not_contains "$P" "class=\"sidebar\"" "blog post has no docs sidebar"

# RSS feed is emitted for the section.
assert_file "$PUB/blog/index.xml" "blog RSS feed emitted"

finish
