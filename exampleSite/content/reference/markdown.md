+++
title = "Markdown Reference"
weight = 1
description = "A single page that exercises every Markdown feature the Darby Docs theme renders: headings, text styles, lists, tables, blockquotes, callouts, GitHub alerts, and multi-language code blocks."
+++

This page is a deliberate stress test. It puts every supported Markdown feature on a single page so you can see how the theme handles a dense, real-world document: how headings flow into the table of contents, how code blocks sit next to prose, and how callouts break up long passages. Read it top to bottom, or jump to a section using the table of contents.

## Headings

Headings define the structure of a page and feed the table of contents on the right. The page title comes from the front matter, so your content should start at the second level.

## A second-level heading

Second-level headings (`##`) are the main sections of a page. They are the entries that show up in the table of contents.

### A third-level heading

Third-level headings (`###`) are subsections. They nest under the nearest second-level heading in the table of contents.

#### A fourth-level heading

Fourth-level headings (`####`) are the deepest level the theme styles distinctly. Use them sparingly, for fine-grained breakdowns inside a subsection.

## Text formatting

Inline formatting is the bread and butter of technical writing. The theme supports the full set of common inline styles.

You can make text **bold** for strong emphasis, *italic* for light emphasis, and ***bold italic*** when you need both at once. You can strike through outdated information with ~~strikethrough~~, and you can mark commands or identifiers with `inline code` so they stand out from the surrounding prose.

Links come in two flavors. An [internal link to the Shortcodes page](/reference/shortcodes/) stays on the site and renders as a plain link. An [external link to the Hugo website](https://gohugo.io) points off-site, so the theme appends a small external-link icon to signal that the reader is leaving the docs.

Keyboard shortcuts read best when they look like keys. Press <kbd>Cmd</kbd> + <kbd>K</kbd> to open search, or <kbd>Esc</kbd> to close it. If you prefer plain Markdown, you can also write a shortcut with backticks like `Ctrl` + `C`, though the `<kbd>` element gives you the raised-key styling.

## Lists

Lists organize related items. The theme indents nested items so the hierarchy stays obvious.

An unordered list with two levels of nesting:

- Core building blocks
  - Layouts and partials
  - Shortcodes for callouts and tabs
- Configuration
  - Site parameters
    - Accent color
    - Default fonts
  - Menu and navigation
- Content
  - Markdown pages
  - Front matter metadata

An ordered list, also nested, describing a typical setup flow:

1. Install Hugo and create a new site.
   1. Verify the version with `hugo version`.
   2. Initialize the module with `hugo mod init`.
2. Add the theme.
   1. Reference it in your configuration.
   2. Pull the module with `hugo mod get`.
3. Write your first page and run the local server.

## Blockquotes

Blockquotes set apart quoted material or asides. They span as many lines as you need.

> Documentation is a love letter that you write to your future self.
> When you come back to a project after six months, the notes you left
> are often the only thing standing between you and an afternoon of
> rediscovery. Write them as if a stranger will read them, because in a
> sense, one will.

## Tables

Tables are ideal for comparing options or listing parameters. The theme styles them with subtle row separators so wide tables stay readable.

| Parameter        | Type    | Default     | Required | Description                                        |
| ---------------- | ------- | ----------- | -------- | -------------------------------------------------- |
| `accentColor`    | string  | `#3b82f6`   | No       | The single accent color used across the theme.     |
| `defaultTheme`   | string  | `system`    | No       | Initial color mode: `light`, `dark`, or `system`.  |
| `bodyFont`       | string  | `Inter`     | No       | Font family used for body text.                    |
| `codeFont`       | string  | `Fira Code` | No       | Monospace font for inline and block code.          |
| `enableSearch`   | boolean | `true`      | No       | Toggles the client-side search modal.              |
| `editBaseURL`    | string  | `""`        | No       | Base URL for the per-page "edit this page" link.   |

## Horizontal rules

A horizontal rule draws a clean dividing line between two ideas that do not otherwise need a heading to separate them.

The paragraph above belongs to one train of thought.

---

The paragraph below starts a fresh one, and the rule above makes the break feel intentional rather than abrupt.

## Images

Insert an image with standard Markdown. Put the file in your site's `static/` folder and reference it with an absolute path, then add descriptive alt text for accessibility:

```markdown
![A Darby banner](/sample-image.png "Optional title shown on hover")
```

It renders responsively, capped to the content width with rounded corners:

![A Darby banner](/sample-image.png "Darby, a beautiful Hugo docs theme")

For an external image, use its full URL instead of a local path. Always include alt text describing the image.

## Callouts

Callouts are the theme's shortcode-based admonitions. There are five types, each with its own icon and color. Use them to pull a single important sentence out of the flow.

{{< callout type="note" >}}
A note carries neutral information that supports the surrounding text without demanding immediate action.
{{< /callout >}}

{{< callout type="tip" >}}
A tip offers a shortcut or a better way to accomplish the task you are reading about.
{{< /callout >}}

{{< callout type="info" >}}
An info callout highlights useful context, such as a related setting or a version requirement.
{{< /callout >}}

{{< callout type="warning" >}}
A warning flags something that can go wrong if you are not careful, such as an irreversible command.
{{< /callout >}}

{{< callout type="caution" >}}
A caution is the strongest signal, reserved for actions that risk data loss or break a production system.
{{< /callout >}}

## GitHub-style alerts

If you prefer to write admonitions in plain Markdown, the theme also understands GitHub's blockquote alert syntax. They render with the same visual weight as the callout shortcodes.

> [!NOTE]
> Useful information that users should know, even when skimming the page.

> [!TIP]
> Helpful advice for doing things more easily or effectively.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent information that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

## Code blocks

Code is where a docs theme earns its keep. The theme highlights syntax, shows an optional filename header, labels the language, and adds a copy button. Here are three substantial examples in different languages.

The first is a Python training loop. The `{filename="train.py"}` attribute puts a filename header above the block.

```python {filename="train.py"}
import torch
import torch.nn as nn
from torch.utils.data import DataLoader


def train(model: nn.Module, loader: DataLoader, epochs: int, lr: float) -> nn.Module:
    """Run a minimal supervised training loop and return the trained model."""
    device = "cuda" if torch.cuda.is_available() else "cpu"
    model = model.to(device)
    optimizer = torch.optim.AdamW(model.parameters(), lr=lr)
    loss_fn = nn.CrossEntropyLoss()

    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        for batch, (inputs, targets) in enumerate(loader):
            inputs, targets = inputs.to(device), targets.to(device)
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = loss_fn(outputs, targets)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()
        avg = running_loss / len(loader)
        print(f"epoch {epoch + 1:>3}/{epochs}  loss={avg:.4f}")

    return model
```

The second is a Go HTTP handler. The `{hl_lines=["3-5"]}` attribute highlights specific lines so you can draw the reader's eye to the part that matters.

```go {hl_lines=["3-5"]}
func handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := db.Ping(); err != nil {
		w.WriteHeader(http.StatusServiceUnavailable)
		_, _ = w.Write([]byte(`{"status":"unhealthy"}`))
		return
	}
	w.WriteHeader(http.StatusOK)
	_, _ = w.Write([]byte(`{"status":"ok"}`))
}

func main() {
	http.HandleFunc("/healthz", handleHealth)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
```

The third is a Bash deployment snippet, the kind of thing you might paste into a quickstart.

```bash
#!/usr/bin/env bash
set -euo pipefail

SITE_DIR="${1:-public}"
BUCKET="darby-docs-prod"

echo "Building site..."
hugo --minify --gc

echo "Syncing ${SITE_DIR} to s3://${BUCKET}..."
aws s3 sync "${SITE_DIR}" "s3://${BUCKET}" --delete

echo "Deploy complete."
```

For short fragments, inline code is enough: run `hugo server -D` to preview drafts, then `hugo --minify` to build for production. Mixing inline code with block code keeps the prose readable while still giving every command a copyable form.
