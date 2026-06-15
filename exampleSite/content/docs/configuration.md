+++
title = "Configuration"
weight = 4
description = "Every parameter the theme reads: accent color, fonts, search, edit links, version switcher, footer, social links, and logo."
+++

All theme settings live under `[params]` in your `hugo.toml`. Every parameter is optional and falls back to a sensible default, so you can start with an empty `[params]` block and add only what you need. This page documents each setting and finishes with a full, copy-ready example.

## Accent color

The theme uses a single accent color that flows through links, buttons, the active sidebar item, and focus rings. You can set one accent for light mode and a brighter variant for dark mode.

```toml
[params]
  accent = "#6366f1"      # used in light mode
  accentDark = "#818cf8"  # used in dark mode (optional, falls back to accent)
```

{{< callout type="tip" title="Picking an accent" >}}
Choose an accent with enough contrast against white text for buttons. If your light-mode accent looks muddy on a dark background, set `accentDark` to a lighter shade of the same hue. A good rule of thumb is to lift the lightness by about 15 percent for the dark variant.
{{< /callout >}}

## Fonts

You can override the body, heading, and monospace fonts independently. The monospace font defaults to **Fira Code**, which includes programming ligatures for code blocks. Each value is a CSS `font-family` stack.

```toml
[params.fonts]
  body = "Inter, system-ui, sans-serif"
  heading = "Inter, system-ui, sans-serif"
  mono = "Fira Code, ui-monospace, monospace"  # defaults to Fira Code
```

## Search

Search is client-side and needs no external service. The default backend, `fuse`, builds a fuzzy index from your content at build time and loads it in the browser.

```toml
[params.search]
  enable = true
  backend = "fuse"
```

For the index to be generated, your site must emit the JSON output format on the home page:

```toml
[outputs]
  home = ["HTML", "RSS", "JSON"]
```

## Edit links and last updated

Set `editURL` to add an "Edit this page" link to every page, pointing at your repository. Set `showLastUpdated` to display the last modified date, which the theme reads from Git history.

```toml
[params]
  editURL = "https://github.com/darby/docs/edit/main/content/"
  showLastUpdated = true
```

## Tabs and versions

Top-level **tabs** appear in the header and group large documentation sets. The **version switcher** lets readers jump between releases of your docs.

```toml
[[params.tabs]]
  name = "Docs"
  url = "/docs/"
[[params.tabs]]
  name = "Guides"
  url = "/guides/"

[[params.versions]]
  name = "v2.0"
  url = "/"
  current = true
[[params.versions]]
  name = "v1.0"
  url = "/v1/"
```

## Footer, social, and logo

Configure the footer text, social links shown in the footer, and an optional logo for the header.

```toml
[params]
  logo = "/images/logo.svg"

[params.footer]
  text = "Copyright Darby, Inc."

[[params.social]]
  name = "github"
  url = "https://github.com/darby"
[[params.social]]
  name = "x"
  url = "https://x.com/darby"
```

## Full example

Here is a complete `[params]` block that exercises every setting at once. Copy it into your `hugo.toml` and trim what you do not need.

```toml {filename="hugo.toml"}
[params]
  # Branding
  accent = "#6366f1"
  accentDark = "#818cf8"
  logo = "/images/logo.svg"

  # Behavior
  editURL = "https://github.com/darby/docs/edit/main/content/"
  showLastUpdated = true

  [params.fonts]
    body = "Inter, system-ui, sans-serif"
    heading = "Inter, system-ui, sans-serif"
    mono = "Fira Code, ui-monospace, monospace"

  [params.search]
    enable = true
    backend = "fuse"

  [params.footer]
    text = "Copyright Darby, Inc."

  [[params.tabs]]
    name = "Docs"
    url = "/docs/"
  [[params.tabs]]
    name = "Guides"
    url = "/guides/"

  [[params.versions]]
    name = "v2.0"
    url = "/"
    current = true
  [[params.versions]]
    name = "v1.0"
    url = "/v1/"

  [[params.social]]
    name = "github"
    url = "https://github.com/darby"
  [[params.social]]
    name = "x"
    url = "https://x.com/darby"
```

## Parameter reference

| Parameter | Type | Description |
| --- | --- | --- |
| `accent` | string | Accent color used in light mode, applied to links, buttons, and the active nav item. |
| `accentDark` | string | Accent color used in dark mode. Falls back to `accent` if unset. |
| `fonts.body` | string | CSS font stack for body text. |
| `fonts.heading` | string | CSS font stack for headings. |
| `fonts.mono` | string | CSS font stack for code and monospace text. Defaults to Fira Code. |
| `search.enable` | boolean | Turns client-side search on or off. |
| `search.backend` | string | Search engine to use. Default is `fuse` for fuzzy client-side search. |
| `editURL` | string | Base URL for the "Edit this page" link. The page's path is appended. |
| `showLastUpdated` | boolean | Shows the last modified date, read from Git history. |
| `tabs` | array of tables | Top-level header tabs, each with `name` and `url`. |
| `versions` | array of tables | Version switcher entries, each with `name`, `url`, and optional `current`. |
| `footer.text` | string | Text shown in the site footer. |
| `social` | array of tables | Social links in the footer, each with `name` and `url`. |
| `logo` | string | Path to a logo image shown in the header. |
