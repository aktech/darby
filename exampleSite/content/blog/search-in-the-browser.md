+++
title = "Search that runs in your browser"
date = 2026-06-04
image = "/blog/cover-search.svg"
author = "aktech"
authorGithub = "aktech"
tags = ["search", "javascript"]
summary = "Darby ships a command-palette style search whose default backend runs entirely in the browser, with no server to host and no API key to manage. The theme emits a JSON index of your pages at build time, and the browser matches queries against it locally as you type."
+++

Good documentation is only useful if readers can find things. Darby includes a
command-palette style search out of the box, opened with a click or a keyboard
shortcut.

The default backend is Fuse, a small fuzzy-search library that runs entirely in
the browser. At build time the theme emits a JSON index of your pages; the
browser loads it and matches queries locally. There is no search server to run
and no API key to manage.

If your site grows large enough that a prebuilt index is preferable, you can
switch the backend to Pagefind with a single config value. Either way, the
search modal, the keyboard shortcut, and the result styling stay the same.
