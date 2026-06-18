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

# Index offers a list/cards view toggle; the feed carries the view state.
assert_grep "$BL" "data-blog-view" "view toggle control present"
assert_grep "$BL" "data-view-set=\"list\"" "list view option present"
assert_grep "$BL" "data-view-set=\"cards\"" "cards view option present"
assert_grep "$BL" "data-post-view=\"cards\"" "feed uses the configured default view (blogView)"
# Each card has an auto-generated cover (per-post gradient hue) with the title below it.
assert_grep "$BL" "post-cover" "card cover present"
assert_grep "$BL" "post-list-title" "post title rendered below the cover"
assert_grep "$BL" "\-\-cover-angle:" "per-post cover gradient generated"

# Single post: standalone prose with byline, tags, and no docs sidebar.
P="$PUB/blog/introducing-darby/index.html"
assert_file "$P" "intro post renders"
assert_grep "$P" "min read" "byline shows reading time"
assert_contains "$P" "aktech" "byline shows the author"
assert_grep "$P" "post-tag" "tag chips rendered"
assert_not_contains "$P" "class=\"sidebar\"" "blog post has no docs sidebar"

# Author avatar: derived from the GitHub username when authorGithub is set.
assert_grep "$P" "post-avatar" "author avatar rendered in byline"
assert_grep "$P" "github.com/aktech.png" "github username drives the avatar URL"
assert_grep "$P" "post-author-link\" href=\"https://github.com/aktech\"" "author name links to the github profile"
# The feed shares the byline partial, so the avatar shows there too.
assert_grep "$BL" "post-avatar" "author avatar rendered in the feed"

# RSS feed is emitted for the section.
assert_file "$PUB/blog/index.xml" "blog RSS feed emitted"

# Tag pages list the posts that carry the tag.
TAG="$PUB/tags/announcement/index.html"
assert_file "$TAG" "tag term page renders"
assert_contains "$TAG" "Introducing Darby" "tagged post listed on its tag page"
assert_grep "$TAG" "post-list" "tag page uses the post feed layout"

finish
