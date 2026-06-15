+++
title = "Shortcodes"
weight = 2
description = "Every shortcode the Darby Docs theme ships with, each shown with a short description followed by a live, rendered demonstration."
+++

Shortcodes let you drop rich, interactive components into plain Markdown without writing any HTML. The Darby Docs theme ships with a small, focused set: callouts, tabs, code groups, cards, and steps. This page documents each one and renders it live, so the example you read is the example you can copy.

Every demonstration below is real. The source is written in Markdown, processed by Hugo, and styled by the theme exactly as it would be on any of your own pages.

## Callouts

The `callout` shortcode wraps a short, important message in a colored box with an icon. Pass a `type` of `note`, `tip`, `info`, `warning`, or `caution`. You can also pass a custom `title`.

Source:

```text
{{</* callout type="tip" title="Pro tip" */>}}
Keep callouts short. One or two sentences read best.
{{</* /callout */>}}
```

Rendered, with one of each type:

{{< callout type="note" >}}
Use a note for neutral, supporting information that does not require action.
{{< /callout >}}

{{< callout type="tip" title="Pro tip" >}}
Keep callouts short. One or two sentences read best inside a colored box.
{{< /callout >}}

{{< callout type="info" >}}
Use an info callout to surface related context, such as a version requirement.
{{< /callout >}}

{{< callout type="warning" >}}
Use a warning when an action can go wrong, like overwriting an existing file.
{{< /callout >}}

{{< callout type="caution" >}}
Use a caution for the highest-stakes actions, such as deleting production data.
{{< /callout >}}

## Tabs

The `tabs` shortcode groups related content into switchable panels. Wrap the whole group in `tabs`, then add one `tab` per panel with a `title`. Only the active panel is visible, and clicking a button swaps panels without reloading the page.

Source:

```text
{{</* tabs */>}}
{{</* tab title="macOS" */>}}
Install with Homebrew: `brew install hugo`.
{{</* /tab */>}}
{{</* tab title="Linux" */>}}
Install with your package manager or the official tarball.
{{</* /tab */>}}
{{</* /tabs */>}}
```

Rendered:

{{< tabs >}}
{{< tab title="macOS" >}}
Install with Homebrew by running `brew install hugo`. This is the quickest path on a Mac and keeps Hugo up to date with `brew upgrade hugo`.
{{< /tab >}}
{{< tab title="Linux" >}}
Install with your distribution's package manager, or download the official tarball from the Hugo releases page and place the binary on your `PATH`.
{{< /tab >}}
{{< tab title="Windows" >}}
Install with `winget install Hugo.Hugo.Extended`, or use Chocolatey with `choco install hugo-extended`.
{{< /tab >}}
{{< /tabs >}}

## Code groups

The `code-group` shortcode is a tabbed container built specifically for code. It works like `tabs`, but each `tab` holds a fenced code block. This is the cleanest way to show the same task in several languages without stacking blocks vertically.

Source:

```text
{{</* code-group */>}}
{{</* tab title="curl" */>}}
... fenced bash block ...
{{</* /tab */>}}
{{</* tab title="JavaScript" */>}}
... fenced js block ...
{{</* /tab */>}}
{{</* /code-group */>}}
```

Rendered, showing the same API request three ways:

{{< code-group >}}
{{< tab title="curl" >}}
```bash
curl -X POST https://api.example.com/v1/pages \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "slug": "hello"}'
```
{{< /tab >}}
{{< tab title="JavaScript" >}}
```javascript
const res = await fetch("https://api.example.com/v1/pages", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ title: "Hello", slug: "hello" }),
});
const page = await res.json();
```
{{< /tab >}}
{{< tab title="Python" >}}
```python
import requests

res = requests.post(
    "https://api.example.com/v1/pages",
    headers={"Authorization": f"Bearer {token}"},
    json={"title": "Hello", "slug": "hello"},
)
page = res.json()
```
{{< /tab >}}
{{< /code-group >}}

## Cards

The `cards` shortcode lays out a responsive grid of linked cards. Wrap the grid in `cards`, then add one `card` per item. Each card takes a `title` and an optional `href`; the body is the card's description. Cards are ideal for landing pages and section indexes.

Source:

```text
{{</* cards */>}}
{{</* card title="Quickstart" href="/docs/quickstart/" */>}}
Get running in five minutes.
{{</* /card */>}}
{{</* /cards */>}}
```

Rendered:

{{< cards >}}
{{< card title="Markdown Reference" href="/reference/markdown/" >}}
Every supported Markdown feature rendered on a single page.
{{< /card >}}
{{< card title="Code Blocks" href="/reference/code-blocks/" >}}
Idiomatic code samples in eight languages, with copy buttons and line highlighting.
{{< /card >}}
{{< card title="Hugo Docs" href="https://gohugo.io/documentation/" >}}
The official Hugo documentation, opened in the same window.
{{< /card >}}
{{< /cards >}}

## Steps

The `steps` shortcode turns an ordered Markdown list into a vertical, numbered walkthrough with connecting markers. Write a normal `1.`, `2.`, `3.` list inside the shortcode and the theme handles the visual treatment.

Source:

```text
{{</* steps */>}}
1. Install Hugo.
2. Add the theme.
3. Run the server.
{{</* /steps */>}}
```

Rendered:

{{< steps >}}
1. **Install Hugo.** Download the extended edition and confirm it is on your `PATH` with `hugo version`.
2. **Create a site.** Run `hugo new site darby-docs` to scaffold the directory structure.
3. **Add the theme.** Reference the theme in your configuration and pull it with `hugo mod get`.
4. **Write a page.** Create `content/_index.md`, add front matter, and start writing Markdown.
5. **Preview locally.** Run `hugo server -D` and open the printed URL to see live reloads as you edit.
{{< /steps >}}

## Putting it together

These five shortcodes cover the vast majority of documentation needs. Reach for a callout to flag something, tabs or a code group to present alternatives side by side, cards to build an index, and steps to lay out a procedure. Everything else is plain Markdown, which keeps your source files portable and easy to review.
