<p align="center">
  <img src="exampleSite/static/darby-logo.png" alt="Darby" width="96" height="96">
</p>

<h1 align="center">Darby</h1>

Darby is a minimal, beautiful Hugo documentation theme. Dark and light modes, customizable
fonts and accent color, code blocks with copy buttons and filename labels, callouts,
an auto-generated sidebar, an on-page table of contents, and pluggable search.

## Install (Hugo Modules)

Requires Hugo 0.128+ (standard or extended edition). From your site root:

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

## Ask Assistant (AI docs Q&A)

An opt-in "Ask AI" panel that answers questions about your docs. It is fully
client-side by default: a small embedding model and a small instruct model run
in the visitor's browser. There is no server and no API key. Indexing runs once
in CI; the browser only embeds the question, ranks the prebuilt chunks, and
writes a grounded answer that cites the sources it used.

Models (loaded from the Hugging Face hub, then cached in the browser so they
download only once):

- Embedding: `bge-small-en-v1.5` (q8 ONNX, 384-dim). Used in both CI and the
  browser, so document and query vectors share one space.
- Generation: `Llama-3.2-1B-Instruct`. WebGPU loads the dedicated q4f16 build;
  browsers without WebGPU use the q8 build on the wasm/CPU backend. (This is the
  model the transformers.js WebGPU chat demo ships, so it runs correctly in the
  browser ONNX runtime; larger models such as Qwen2.5-1.5B produce degenerate
  output there.)

Enable it:

```toml
[params.assistant]
  enable = true
  backend = "browser"            # default; fully client-side, no server
  indexPath = "assistant-index.json"
  suggestions = [
    "How do I change the accent color?",
    "How do I deploy the site?",
  ]
```

Build the index (a Node step, only needed when the assistant is enabled). It
reads the rendered site, so run `hugo` first:

```bash
npm install
hugo --source exampleSite
npm run build-index -- --source exampleSite/public --base "https://your.site/" --out exampleSite/static/assistant-index.json
```

For the demo's ~108 chunks the index is about 925 KiB (roughly 8.8 KiB per
chunk, most of it the 384-float vector). The GitHub Pages workflow builds it
automatically on deploy.

Optional hosted backend: instead of the in-browser model you can point at any
OpenAI-compatible chat endpoint (OpenAI, OpenRouter, a local Ollama or
llama.cpp server). Retrieval is identical; only the final answer call changes.

```toml
[params.assistant]
  enable = true
  backend = "hosted"
  [params.assistant.hosted]
    baseURL = "http://localhost:11434/v1"   # e.g. a local Ollama server
    model = "llama3.1"
    apiKey = ""   # sent from the browser, so only use keyless/local/proxied servers
```

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
