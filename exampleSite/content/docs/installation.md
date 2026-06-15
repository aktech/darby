+++
title = "Installation"
weight = 3
description = "Install the theme as a Hugo Module or a Git submodule and wire up the required markup config."
+++

There are two supported ways to install the theme: as a Hugo Module (recommended) or as a Git submodule. Both end with the same required `[markup]` configuration, which the theme needs in order to render its shortcodes correctly.

## Prerequisites

Before installing, make sure you have the following:

- **Hugo Extended**, version 0.128 or newer. The Extended edition is required because the theme compiles SCSS. Run `hugo version` and confirm the output contains the word `extended`.
- **Go**, version 1.20 or newer, but only if you install via Hugo Modules. The module system uses Go's tooling to fetch and pin dependencies.
- **Git**, for either installation method.

{{< callout type="info" title="Which method should I pick?" >}}
Use **Hugo Modules** if you want clean version pinning, easy upgrades, and the ability to override individual theme files. Use a **Git submodule** if your team avoids Go tooling or works fully offline after the initial clone.
{{< /callout >}}

## Install the theme

Pick one of the two methods below. They are mutually exclusive: do not mix a module import with a submodule in the same site.

{{< code-group >}}
{{< tab title="Hugo Modules" >}}
```bash
# From the root of your Hugo site
# 1. Initialize a module if you have not already
hugo mod init github.com/darby/docs

# 2. Pull the theme as a versioned dependency
hugo mod get github.com/darby/hugo-docs-theme@latest

# 3. Tidy the module graph
hugo mod tidy
```
{{< /tab >}}
{{< tab title="Git Submodule" >}}
```bash
# From the root of your Hugo site
# 1. Add the theme as a submodule under themes/
git submodule add https://github.com/darby/hugo-docs-theme themes/hugo-docs-theme

# 2. Pin the theme in hugo.toml instead of importing a module:
#    theme = "hugo-docs-theme"

# 3. When cloning the site later, pull the submodule too
git submodule update --init --recursive
```
{{< /tab >}}
{{< /code-group >}}

If you used the module method, add the import to `hugo.toml`:

```toml {filename="hugo.toml"}
[module]
  [[module.imports]]
    path = "github.com/darby/hugo-docs-theme"
```

If you used the submodule method, set the theme by name instead:

```toml {filename="hugo.toml"}
theme = "hugo-docs-theme"
```

## Required markup config

This is the step that trips up most people. Hugo does **not** merge a theme's `[markup]` configuration into your site, because the markup key is marked `_merge: none`. That means you must copy the theme's markup block into your own `hugo.toml` by hand. Without it, callouts and other shortcodes render as raw, escaped HTML.

```toml {filename="hugo.toml"}
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

{{< callout type="caution" title="Do not skip this block" >}}
If you omit `markup.goldmark.renderer.unsafe = true`, every callout, tab, and card on your site will render as plain escaped text. If you omit the `markup.highlight` settings, code blocks lose syntax highlighting. Copy the whole block exactly as shown.
{{< /callout >}}

## Verify the install

Build the site once to confirm everything resolves:

```bash
# A clean build should finish with no ERROR lines
hugo --quiet

# Or run the live server and open a page
hugo server
```

Open any docs page and check three things: the sidebar navigation appears, a callout renders as a styled box (not escaped text), and the dark/light toggle works.

## Troubleshooting

### "this feature is not available in your current Hugo version"

You are running the standard edition of Hugo, not Extended. Reinstall Hugo Extended and confirm with `hugo version` that the output contains `extended`.

### Shortcodes show up as escaped text

You are missing `markup.goldmark.renderer.unsafe = true`. Add the full `[markup]` block from the section above and rebuild.

### "module not found" when running `hugo mod get`

Either Go is not installed or your module path is wrong. Confirm `go version` reports 1.20 or newer, then re-run `hugo mod init` with your correct repository path before fetching the theme.

### Code blocks have no colors

Your `markup.highlight` settings are missing or `noClasses` is set incorrectly. Use `noClasses = false` so the theme's stylesheet can color the tokens, then rebuild.
