+++
title = "Architecture"
weight = 4
description = "How Darby turns your Markdown and config into a finished documentation site."
+++

Darby is a Hugo theme, so there is no separate build tool or server. Your Markdown
and a small `[params]` block flow through Hugo, and Darby's render hooks, shortcodes,
and asset pipeline turn them into a static site that runs entirely in the browser.

## How it fits together

The diagram below renders from a plain ` ```mermaid ` code fence: you write the
fence, the theme draws it (hand-drawn style, themed to your accent color, and it
re-draws when you toggle dark and light).

```mermaid
flowchart TB
  MD["Markdown content"] --> D
  CFG["hugo.toml params"] --> D

  subgraph D["Hugo + Darby theme"]
    direction LR
    RH["Render hooks"]
    SC["Shortcodes"]
    AP["Asset pipeline"]
    IDX["Search indexer"]
  end

  D --> HTML["HTML pages"]
  D --> ASSETS["CSS + JS bundles"]
  D --> JSON["index.json"]

  HTML --> B
  ASSETS --> B
  JSON --> B

  subgraph B["In the browser"]
    direction LR
    THEME["Dark / light toggle"]
    SEARCH["Instant search"]
    NAV["Sidebar, TOC, prev / next"]
  end
```

## The pieces

- **Render hooks** turn fenced code into highlighted blocks (with copy buttons and
  filenames), headings into anchored links, and GitHub-style alerts into callouts.
- **Shortcodes** give you callouts, tabs, cards, steps, and accordions.
- **Asset pipeline** compiles the design tokens and your configured accent and fonts
  into one CSS bundle, and concatenates the small scripts into one JS bundle.
- **Search indexer** emits `index.json` so client-side search works with no server.

## A sequence, end to end

```mermaid
sequenceDiagram
  participant You
  participant Hugo
  participant Browser
  You->>Hugo: write Markdown + set accent / fonts
  Hugo->>Hugo: run render hooks + shortcodes
  Hugo->>Browser: ship HTML, CSS, JS, index.json
  Browser->>Browser: apply theme, build search, wire nav
  Browser-->>You: a fast, beautiful docs site
```
