+++
title = "Quickstart"
weight = 2
description = "Get a documentation site running with the theme in about five minutes."
+++

This quickstart takes you from nothing to a running documentation site in about five minutes. You will install Hugo, create a new site, add the theme, write your first page, and start the live preview server.

{{< callout type="note" title="Before you start" >}}
You need [Hugo](https://gohugo.io/installation/) version 0.128 or newer and a recent version of Go (1.20+) if you plan to use Hugo Modules. The theme is plain CSS with no build step, so either the standard or Extended edition works.
{{< /callout >}}

## Steps at a glance

{{< steps >}}
1. Install Hugo and verify the version.
2. Create a new Hugo site and initialize a module.
3. Add the theme and the required markup config.
4. Write your first documentation page.
5. Start the development server and open the browser.
{{< /steps >}}

## Install

First, install Hugo. Pick the tab that matches your platform.

{{< tabs >}}
{{< tab title="macOS" >}}
```bash
# Install with Homebrew
brew install hugo

# Confirm you have the Extended edition
hugo version
# hugo v0.163.2+extended darwin/arm64
```
{{< /tab >}}
{{< tab title="Linux" >}}
```bash
# Download the Extended tarball from GitHub releases, then:
sudo install -m 0755 hugo /usr/local/bin/hugo

# Confirm the version and that it says "extended"
hugo version
# hugo v0.163.2+extended linux/amd64
```
{{< /tab >}}
{{< tab title="Windows" >}}
```bash
# Install with winget
winget install Hugo.Hugo.Extended

# Confirm the version
hugo version
```
{{< /tab >}}
{{< /tabs >}}

Once Hugo is installed, create a new site and initialize it as a Hugo Module so you can pull the theme in:

```bash
# Create a new site and move into it
hugo new site darby-docs
cd darby-docs

# Initialize a module (replace with your own module path)
hugo mod init github.com/darby/docs

# Add the theme as a module dependency
hugo mod get github.com/aktech/darby
```

## Configure

Open `hugo.toml` and tell Hugo to import the theme module. The theme needs a small `[markup]` block because Hugo does not merge a theme's markup settings into your site automatically.

```toml {filename="hugo.toml"}
baseURL = "https://docs.example.com/"
languageCode = "en-us"
title = "Darby Docs"

[module]
  [[module.imports]]
    path = "github.com/aktech/darby"

[params]
  accent = "#6366f1"
  showLastUpdated = true

  [params.search]
    enable = true
    backend = "fuse"

[markup]
  [markup.goldmark.renderer]
    unsafe = true
  [markup.goldmark.parser.attribute]
    block = true
    title = true
  [markup.highlight]
    noClasses = false
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 3
```

> [!NOTE]
> The `markup.goldmark.renderer.unsafe = true` setting is what lets the theme's shortcodes emit the HTML they need for callouts, tabs, and cards. Without it, those blocks render as escaped text instead of styled components.

If you keep a small JavaScript helper alongside your docs (for example a tiny redirect map or an analytics shim), the theme picks up custom assets without any extra wiring. A minimal example:

```js {filename="app.js"}
// Optional client-side helper loaded by the theme.
// Reads the saved theme preference and applies it before paint
// so visitors never see a flash of the wrong color scheme.
const STORAGE_KEY = "darby-docs-theme";

function applyTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.dataset.theme = theme;
  return theme;
}

document.addEventListener("DOMContentLoaded", () => {
  const current = applyTheme();
  console.log(`Darby Docs loaded with the ${current} theme`);
});
```

## Write your first page

Create your first documentation page. Content files live under `content/docs/` and use TOML front matter:

```bash
# Create a getting-started page
hugo new docs/getting-started.md
```

Then open `content/docs/getting-started.md` and replace the body:

```markdown {filename="content/docs/getting-started.md"}
+++
title = "Getting started"
weight = 1
description = "Your very first page built with the theme."
+++

## Hello, docs

Welcome to your new documentation site. This page is plain Markdown,
and the theme takes care of the layout, navigation, and styling.

{{</* callout type="tip" */>}}
You can use callouts, tabs, cards, and steps anywhere in your content.
{{</* /callout */>}}
```

## Run the development server

Start Hugo's live preview server. It rebuilds on every save and reloads the browser for you:

```bash
# Serve the site locally with drafts enabled
hugo server --buildDrafts --disableFastRender

# Hugo prints the local URL, usually:
# Web Server is available at http://localhost:1313/
```

Open `http://localhost:1313/docs/getting-started/` and you should see your page styled by the theme, complete with the sidebar navigation, the right-hand table of contents, and the dark/light toggle.

{{< callout type="tip" title="Next steps" >}}
Ready to make it yours? Head to [Configuration](/docs/configuration/) to set your accent color, fonts, and footer, or read the [Markdown reference](/reference/markdown/) to see every shortcode in action.
{{< /callout >}}
