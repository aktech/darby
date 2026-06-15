+++
title = "Guides"
weight = 2
description = "Task-focused guides for authoring and shipping documentation with the Darby Docs theme."
+++

The guides section collects the longer, task-focused walkthroughs for working with Darby Docs. Where the reference pages under Docs explain individual options in isolation, these guides take you end to end through a complete job: writing a page from a blank file, or building and deploying the finished site to a host.

Each guide assumes you already have a working Darby Docs project. If you do not, start with the Quickstart in the Docs section and come back here once `hugo server` is rendering a local preview.

{{< callout type="tip" title="Where to start" >}}
If you are brand new, read **Writing Content** first so the shortcodes and front matter make sense, then come back to **Deploying** when you are ready to publish.
{{< /callout >}}

## In this section

{{< cards >}}
{{< card title="Writing Content" href="/guides/writing-content/" icon="✍️" >}}
Author pages with front matter, callouts, tabs, cards, steps, GitHub-style alerts, and code blocks with filenames and line highlighting.
{{< /card >}}
{{< card title="Deploying" href="/guides/deploying/" icon="🚀" >}}
Build the site, choose a search backend (Fuse or Pagefind), and ship to Netlify, Vercel, or GitHub Pages with ready-to-paste config.
{{< /card >}}
{{< /cards >}}

## How these guides are organized

Every guide follows the same shape so you always know where to look. A short intro frames the task, then numbered or sectioned steps walk through it, and inline callouts flag the parts that trip people up. Code samples are real and complete: you can copy a whole block into your project without filling in blanks.

If you find a gap or something that no longer matches the theme, open an issue at `github.com/darby/darby-docs-theme` and we will fold the fix into the next release.
