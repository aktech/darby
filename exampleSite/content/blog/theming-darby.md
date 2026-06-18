+++
title = "Theming Darby in one config block"
date = 2026-06-10
image = "/sample-image.png"
author = "aktech"
authorGithub = "aktech"
tags = ["theming", "config"]
summary = "Set your accent color and the body, heading, and monospace fonts from the [params] block, and every component on the site follows automatically. There is no SCSS to compile, no rebuild step, and no template to edit. Dark mode even derives its own accent for contrast."
+++

Darby is built so that adopters never touch a template. The accent color and
the body, heading, and monospace fonts are plain CSS custom properties that the
theme reads from your site config and injects into a `:root` block.

```toml
[params]
  accent = "#331c74"
  [params.fonts]
    body = "Inter"
    heading = "Space Grotesk"
    mono = "Fira Code"
```

Change the accent and the buttons, links, active states, callouts, and card
covers all shift with it. Because it is just a CSS variable, dark mode gets its
own lifted accent for contrast without any extra work on your side.

The same idea extends to the blog: the post summary color and the card cover
color are their own tokens, overridable from config when you want them to differ
from the global accent.
