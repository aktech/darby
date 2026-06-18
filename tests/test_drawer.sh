#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
build_site
P="$PUB/docs/quickstart/index.html"
assert_grep "$P" "data-drawer-toggle" "drawer toggle button present"
assert_grep "$P" "theme\.bundle.*\.js" "drawer js bundled"

# Two mobile drawers: left burger -> docs section tree (#sidebar), right
# three-dots -> top-bar nav items (#mobilenav). The nav menu exists on every
# page so navigation always works on mobile.
assert_grep "$P" "class=\"hamburger\"[^>]*aria-controls=\"mobile-sidebar\"" "left burger controls the section-tree drawer"
assert_grep "$P" "class=\"menu-toggle\"[^>]*aria-controls=\"mobilenav\"" "right three-dots controls the nav menu"

# Both drawers exist on EVERY page (incl. home/blog) so the burger and the
# three-dots always work on mobile.
for F in "$PUB/index.html" "$PUB/docs/quickstart/index.html" "$PUB/blog/index.html" "$PUB/blog/introducing-darby/index.html"; do
  S="$(mktemp)"; sed -n '/id="mobile-sidebar"/,/<\/aside>/p' "$F" > "$S"
  M="$(mktemp)"; sed -n '/id="mobilenav"/,/<\/aside>/p' "$F" > "$M"
  assert_grep "$F" "id=\"mobile-sidebar\"" "section-tree drawer present on $F"
  assert_grep "$S" "sidebar-link" "section drawer has links on $F"
  assert_grep "$F" "id=\"mobilenav\"" "nav menu present on $F"
  assert_grep "$M" "sidebar-link" "nav menu has links on $F"
  assert_grep "$M" "theme-toggle" "nav menu has the theme toggle on $F"
done
finish
