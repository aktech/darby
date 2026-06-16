+++
title = "Introducing Darby"
date = 2026-06-16
author = "aktech"
authorGithub = "aktech"
tags = ["announcement", "hugo", "documentation"]
summary = "Darby is a fast, beautiful Hugo documentation theme you drop in with a single config block and a folder of Markdown. It gives you dark and light modes, search, callouts, and gorgeous code blocks out of the box, with no Node build, no CSS framework, and accessibility on by default."
+++

Most Hugo documentation themes ask you to pick a side. Either you get something
polished but heavy, dragging in a Node build, a CSS framework, and a pile of
JavaScript, or you get something light that you then have to make presentable
yourself. Darby is an attempt to refuse that trade. It gives you a finished
documentation site, dark and light modes, search, callouts, gorgeous code
blocks, automatic navigation, from a single config block and a folder of
Markdown. There is no Node build step for the defaults and no CSS framework
anywhere.

## What you get out of the box

You write Markdown. The theme does the rest: typography, the navigation
sidebar, the on-page table of contents, responsiveness, and the dark and light
toggle are all automatic.

- **Dark and light modes** that switch with no flash on load and remember your
  choice.
- **Search** built in, with a command-palette style modal. The default backend
  runs entirely in the browser.
- **Code blocks** with copy buttons, filename tabs, and a syntax theme that
  reads well in both modes.
- **Callouts** for notes, tips, warnings, and more, including GitHub-style
  `> [!NOTE]` alerts.
- **Diagrams** from a plain ` ```mermaid ` fence, rendered with a hand-drawn
  look and themed to your accent color.
- **Ask Assistant**, an optional in-browser question box that answers from your
  own docs with no server and no API key.
- **A landing page** driven entirely from front matter, so your home page is as
  easy to edit as any other page.

## Config over code

Darby is built so that adopters never have to touch a template or rebuild the
theme. The accent color and the body, heading, and monospace fonts are CSS
custom properties you override from `[params]`. Set them once and every
component follows.

```toml
[params]
  accent = "#331c74"
  [params.fonts]
    body = "Inter"
    heading = "Space Grotesk"
    mono = "Fira Code"
```

## Accessible by design

Accessibility is not a setting you turn on. Every interactive element has a
visible focus outline and a pointer cursor, and the colors are checked for
WCAG AA contrast in both light and dark modes. The theme is also
self-sufficient: it renders correctly even when you set no params at all.

## Get started

The fastest way in is the [quickstart](/docs/quickstart/): install Hugo, add
the theme, drop in a Markdown file, and run the dev server. From there the
[installation guide](/docs/installation/) covers Hugo Modules and Git submodule
setups in full.

We are just getting started. Follow along here for releases and notes as Darby
grows.
