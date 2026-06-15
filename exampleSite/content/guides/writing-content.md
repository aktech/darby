+++
title = "Writing Content"
weight = 1
description = "Author documentation pages with front matter, callouts, tabs, cards, steps, GitHub-style alerts, and rich code blocks."
+++

This guide covers everything you need to write a documentation page with Darby Docs. Pages are plain Markdown files under `content/`, with a small block of front matter at the top that controls how the page appears in the sidebar and the table of contents. Beyond that, the theme ships a set of shortcodes for the elements that plain Markdown cannot express on its own: callouts, tabbed panels, card grids, and step lists.

Throughout this page you will see the **source** of each shortcode shown in a code block, followed immediately by the **rendered** result so you can compare the two.

## Page front matter

Every page starts with a front matter block. Darby Docs supports TOML (delimited by `+++`), YAML (`---`), and JSON. The examples here use TOML. The fields below are the ones the theme reads; any other keys you add are available to your own templates but are ignored by the default layouts.

```toml {filename="content/guides/writing-content.md"}
+++
title = "Writing Content"
weight = 1
description = "Author documentation pages with front matter and shortcodes."
icon = "pencil"
toc = true
sidebarLabel = "Writing"
draft = false
+++
```

### Front matter fields

| Field          | Type    | Default        | What it does                                                              |
| -------------- | ------- | -------------- | ------------------------------------------------------------------------- |
| `title`        | string  | (required)     | The page heading and the default sidebar entry.                           |
| `weight`       | integer | `0`            | Sort order within a section. Lower numbers appear first.                  |
| `description`  | string  | empty          | Used for the meta description tag and search result snippets.             |
| `icon`         | string  | none           | Name of the icon shown next to the sidebar entry.                         |
| `toc`          | boolean | `true`         | Set to `false` to hide the right-hand table of contents on this page.     |
| `sidebarLabel` | string  | value of title | Overrides the sidebar text when you want it shorter than the title.       |
| `draft`        | boolean | `false`        | When `true`, the page is skipped on a normal build.                       |

{{< callout type="info" title="Sidebar ordering" >}}
The sidebar is sorted by `weight` first and then alphabetically by title. Leave gaps (10, 20, 30) so you can insert pages later without renumbering everything.
{{< /callout >}}

## Callouts

Callouts draw the eye to a single important sentence. Use them sparingly: a page where everything is a callout has nothing highlighted at all. The theme provides five types, each with its own color and icon.

The source for a callout looks like this:

```go-html-template
{{</* callout type="note" title="A short heading" */>}}
Body text goes here. You can use **Markdown** inside a callout, including links and inline `code`.
{{</* /callout */>}}
```

All five types, rendered live:

{{< callout type="note" title="Note" >}}
A neutral aside. Use this for context that is good to know but not critical.
{{< /callout >}}

{{< callout type="tip" title="Tip" >}}
A helpful shortcut or best practice. For example: run `hugo server -D` to preview draft pages locally.
{{< /callout >}}

{{< callout type="info" title="Info" >}}
Supporting detail or a pointer to related material, such as a link to the [Deploying](/guides/deploying/) guide.
{{< /callout >}}

{{< callout type="warning" title="Warning" >}}
Something that can go wrong if you are not careful. Double-check your `baseURL` before a production build.
{{< /callout >}}

{{< callout type="caution" title="Caution" >}}
A destructive or irreversible action. Deleting the `public/` directory removes the entire generated site.
{{< /callout >}}

### Omitting the title

If you leave the `title` off, the theme uses the capitalized type name as the heading. This is the most common form for short notes:

```go-html-template
{{</* callout type="tip" */>}}
You do not need a title for every callout.
{{</* /callout */>}}
```

{{< callout type="tip" >}}
You do not need a title for every callout.
{{< /callout >}}

## GitHub-style alerts

If you already write in GitHub-flavored Markdown, you can use alert blockquotes instead of the callout shortcode. They render the same way. Start a blockquote with `[!TYPE]` on its own line:

```markdown
> [!NOTE]
> Highlights information that users should take into account.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.
```

Rendered:

> [!NOTE]
> Highlights information that users should take into account.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Tabs

Tabs let a reader switch between alternative content in place, for example showing the same instructions for macOS, Linux, and Windows. Wrap the panels in a `tabs` shortcode and give each child `tab` a `title`:

```go-html-template
{{</* tabs */>}}
{{</* tab title="macOS" */>}}
Install with Homebrew: `brew install hugo`.
{{</* /tab */>}}
{{</* tab title="Linux" */>}}
Install with the package manager: `sudo apt install hugo`.
{{</* /tab */>}}
{{</* tab title="Windows" */>}}
Install with Winget: `winget install Hugo.Hugo.Extended`.
{{</* /tab */>}}
{{</* /tabs */>}}
```

Rendered:

{{< tabs >}}
{{< tab title="macOS" >}}
Install with Homebrew: `brew install hugo`.
{{< /tab >}}
{{< tab title="Linux" >}}
Install with the package manager: `sudo apt install hugo`.
{{< /tab >}}
{{< tab title="Windows" >}}
Install with Winget: `winget install Hugo.Hugo.Extended`.
{{< /tab >}}
{{< /tabs >}}

{{< callout type="note" >}}
The first tab is shown by default. The order of the rendered buttons matches the order of the `tab` children in your source.
{{< /callout >}}

## Cards

Cards turn a list of links into a visual grid, which works well for section landing pages and "what next" footers. Each `card` takes a `title`, an optional `href`, and an optional `icon`. The body of the card is the short description.

```go-html-template
{{</* cards */>}}
{{</* card title="Writing Content" href="/guides/writing-content/" icon="✍️" */>}}
Front matter, shortcodes, alerts, and code blocks.
{{</* /card */>}}
{{</* card title="Deploying" href="/guides/deploying/" icon="🚀" */>}}
Build the site and ship it to your host of choice.
{{</* /card */>}}
{{</* /cards */>}}
```

Rendered:

{{< cards >}}
{{< card title="Writing Content" href="/guides/writing-content/" icon="✍️" >}}
Front matter, shortcodes, alerts, and code blocks.
{{< /card >}}
{{< card title="Deploying" href="/guides/deploying/" icon="🚀" >}}
Build the site and ship it to your host of choice.
{{< /card >}}
{{< /cards >}}

## Steps

The `steps` shortcode renders an ordered Markdown list as a numbered, visually connected sequence. It is ideal for installation and setup procedures where the order matters. Write a normal ordered list between the opening and closing tags:

```go-html-template
{{</* steps */>}}
1. **Create a project.** Run `hugo new site darby-docs && cd darby-docs`.
2. **Add the theme.** Install Darby Docs as a Hugo module or git submodule.
3. **Write a page.** Add `content/docs/_index.md` with the front matter shown above.
4. **Preview.** Run `hugo server` and open `http://localhost:1313`.
{{</* /steps */>}}
```

Rendered:

{{< steps >}}
1. **Create a project.** Run `hugo new site darby-docs && cd darby-docs`.
2. **Add the theme.** Install Darby Docs as a Hugo module or git submodule.
3. **Write a page.** Add `content/docs/_index.md` with the front matter shown above.
4. **Preview.** Run `hugo server` and open `http://localhost:1313`.
{{< /steps >}}

## Code blocks

Code is the heart of most documentation, so the theme gives fenced code blocks two extra features on top of standard syntax highlighting: a filename label and line highlighting.

### Filenames

Add a `filename` attribute after the language to print a small header above the block. This is useful when a snippet belongs in a specific file:

````markdown
```yaml {filename="config/_default/hugo.yaml"}
baseURL: "https://docs.example.com/"
languageCode: "en-us"
title: "Darby Docs"
theme: "darby-docs"
params:
  accent: "#6d5efc"
  font: "Inter"
  search:
    backend: "fuse"
```
````

Rendered:

```yaml {filename="config/_default/hugo.yaml"}
baseURL: "https://docs.example.com/"
languageCode: "en-us"
title: "Darby Docs"
theme: "darby-docs"
params:
  accent: "#6d5efc"
  font: "Inter"
  search:
    backend: "fuse"
```

### Highlighting lines

To draw attention to specific lines, pass `hl_lines` with the line numbers (or ranges) to emphasize. Here lines 2 and 5 are highlighted to show the two values a reader most needs to change:

````markdown
```bash {hl_lines=["2","5"]}
#!/usr/bin/env bash
export HUGO_VERSION="0.163.2"
set -euo pipefail

hugo --gc --minify --baseURL "https://docs.example.com/"
echo "Build complete. Output is in ./public"
```
````

Rendered:

```bash {hl_lines=["2","5"]}
#!/usr/bin/env bash
export HUGO_VERSION="0.163.2"
set -euo pipefail

hugo --gc --minify --baseURL "https://docs.example.com/"
echo "Build complete. Output is in ./public"
```

## Putting it together

A good page mixes these elements rather than leaning on any single one. Lead with a paragraph that says what the reader will achieve, use `steps` for the procedure, drop a `callout` where people get stuck, and show a complete code block they can copy. When you are happy with how the page reads locally, head to the [Deploying](/guides/deploying/) guide to publish it.
