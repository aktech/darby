<p align="center">
  <img src="exampleSite/static/darby-logo.jpg" alt="Darby" width="96" height="96">
</p>

<h1 align="center">Darby</h1>

Darby is a minimal, beautiful Hugo documentation theme. Dark and light modes, customizable
fonts and accent color, code blocks with copy buttons and filename labels, callouts,
an auto-generated sidebar, an on-page table of contents, and pluggable search.

## Install (Hugo Modules)

Requires Hugo extended. From your site root:

```bash
hugo mod init github.com/you/your-docs
```

Add the theme as a module import and enable the JSON output the default search index
needs:

```toml
[module]
  [[module.imports]]
    path = "github.com/aktech/darby"

[outputs]
  home = ["HTML", "RSS", "JSON"]
```

## Required markup config

Hugo does NOT merge a theme's `[markup]` settings into your site. That config key is
marked `_merge: none`, so whatever the theme ships is ignored unless you copy it into
your own `hugo.toml`. Without this block, code-fence filename attributes and Markdown
block attributes will not work, and code highlighting will not match the theme.

Copy this block verbatim into your site config:

```toml
[markup]
  [markup.highlight]
    noClasses = false
    lineNos = false
    codeFences = true
    guessSyntax = true
  [markup.goldmark.parser.attribute]
    block = true
    title = true
  [markup.goldmark.renderer]
    unsafe = true
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
```

## Configure

All theme options live under `[params]`:

```toml
[params]
  accent = "#331c74"          # brand color (light mode)
  accentDark = "#331c74"      # brand color (dark mode), optional
  logo = "/logo.svg"          # shown in the top bar; put the file in static/
  logoDark = "/logo-dark.svg" # optional separate logo for dark mode
  repo = "https://github.com/you/your-docs"  # shows a GitHub icon in the top bar
  editURL = "https://github.com/you/your-docs/edit/main/content/"
  showLastUpdated = true

  [params.fonts]
    body = "Inter"
    heading = "Space Grotesk"
    mono = "Fira Code"

  [params.search]
    enable = true
    backend = "fuse"          # "fuse" (default, vendored) or "pagefind"
```

Other params:

- `[[params.tabs]]` with `name` and `url`: top-bar section tabs.
- `[[params.versions]]` with `name`, `url`, and optional `current = true`: version switcher.
- `[params.footer]` with `text`: footer line.
- `[[params.social]]`: social links.
- `logo` / `logoDark`: path to a logo image shown in the top bar (place the file in `static/`). Set only `logo` to use one image in both modes, or both for a separate dark-mode logo.
- `favicon`: path to a favicon image (place it in `static/`); used for the browser tab icon and apple-touch-icon.

## Authoring

Front matter per page:

```yaml
---
title: "Getting Started"
weight: 10            # sidebar order
icon: "rocket"        # optional sidebar icon
toc: true             # show on-page table of contents
description: "A short summary used for SEO and search."
sidebarLabel: "Start" # override the sidebar text
---
```

Shortcodes:

```text
{{< callout type="note" >}} ... {{< /callout >}}
{{< tabs >}}{{< tab name="npm" >}} ... {{< /tab >}}{{< /tabs >}}
{{< code-group >}} ... {{< /code-group >}}
{{< cards >}}{{< card title="..." >}} ... {{< /card >}}{{< /cards >}}
{{< steps >}} ... {{< /steps >}}
```

GitHub-style alerts work in plain Markdown:

```markdown
> [!NOTE]
> This renders as a styled callout.
```

Code fences accept a filename attribute:

````markdown
```js {filename="app.js"}
console.log("hello")
```
````

## Build

For the default setup (Fuse.js search), a single command builds everything:

```bash
hugo
```

The wrapper script does the same and also runs Pagefind when
`search.backend = "pagefind"`:

```bash
./scripts/build.sh .
```

## Develop the theme

```bash
cd exampleSite && hugo server
```

Run the test suite (builds the example site and asserts on the rendered HTML):

```bash
bash tests/run.sh
```
