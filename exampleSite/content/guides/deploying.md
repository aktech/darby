+++
title = "Deploying"
weight = 3
description = "Build an Acme Docs site, choose a search backend, and deploy to Netlify, Vercel, or GitHub Pages."
+++

Once your content reads well in local preview, the next step is to build the static site and push it to a host. This guide covers the build command, the two search backends the theme supports, and ready-to-paste configuration for three common hosts.

A deployed Acme Docs site is just static files: HTML, CSS, JavaScript, and a search index. There is no server-side runtime, so any static host will serve it. The only host-specific work is telling the platform how to run Hugo and where the output lives.

## Building the site

The build command is the same everywhere. From the project root:

```bash
hugo --gc --minify
```

This writes the finished site into `public/`. The flags are worth knowing:

- `--gc` runs garbage collection on the cache, removing stale files so old assets do not linger between builds.
- `--minify` strips whitespace from HTML, CSS, JavaScript, JSON, and XML output, which meaningfully reduces transfer size.

{{< callout type="caution" title="Set baseURL for production" >}}
Hugo bakes `baseURL` into canonical links, the sitemap, and absolute asset URLs at build time. If it is wrong, search engines and social cards point at the wrong domain. Either set it in your config or override it at build time with `hugo --baseURL "https://docs.example.com/"`. The trailing slash matters.
{{< /callout >}}

## Choosing a search backend

Acme Docs ships with client-side search built in. There are two backends, and which one you want depends on how large your site is.

### Fuse (default)

Fuse is the default and needs no extra steps. At build time the theme generates a JSON index of your pages, and a small amount of JavaScript performs fuzzy matching in the browser. It is fast to set up and works on any host with zero configuration. The tradeoff is that the whole index is downloaded by the visitor's browser, so it is best suited to small and medium sites (up to a few hundred pages).

```yaml {filename="config/_default/hugo.yaml"}
params:
  search:
    backend: "fuse"
```

### Pagefind (opt-in)

[Pagefind](https://pagefind.app/) builds a chunked, on-demand index after Hugo finishes. The browser only downloads the fragments it needs for a given query, so it scales to thousands of pages without bloating the initial page load. The cost is one extra build step: Pagefind reads the generated `public/` directory and writes its index back into it.

```yaml {filename="config/_default/hugo.yaml"}
params:
  search:
    backend: "pagefind"
```

With Pagefind enabled, your build becomes two commands instead of one:

```bash {hl_lines=["2"]}
hugo --gc --minify
npx -y pagefind --site public
```

> [!TIP]
> Start on Fuse. It is the simplest path and is plenty for most documentation sites. Switch to Pagefind only when your index grows large enough that the initial download becomes noticeable, and remember to add the second build command to your host's pipeline at the same time.

## Host configuration

The configs below assume Pagefind so the search step is visible. If you stay on Fuse, simply drop the `pagefind` line from each build command. Every example pins the Hugo version so local and CI builds match.

{{< code-group >}}
{{< tab title="Netlify" >}}
```toml {filename="netlify.toml"}
[build]
  publish = "public"
  command = "hugo --gc --minify && npx -y pagefind --site public"

[build.environment]
  HUGO_VERSION = "0.153.1"
  HUGO_ENV     = "production"
  NODE_VERSION = "20"

[context.production.environment]
  HUGO_BASEURL = "https://docs.example.com/"

[context.deploy-preview]
  command = "hugo --gc --minify -b $DEPLOY_PRIME_URL && npx -y pagefind --site public"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options       = "DENY"
    X-Content-Type-Options = "nosniff"
```
{{< /tab >}}
{{< tab title="Vercel" >}}
```json {filename="vercel.json"}
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "hugo --gc --minify && npx -y pagefind --site public",
  "outputDirectory": "public",
  "framework": "hugo",
  "build": {
    "env": {
      "HUGO_VERSION": "0.153.1",
      "HUGO_ENV": "production"
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```
{{< /tab >}}
{{< tab title="GitHub Actions" >}}
```yaml {filename=".github/workflows/deploy.yml"}
name: Deploy docs

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.153.1
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - name: Install Hugo
        run: |
          curl -sSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" \
            | sudo tar -xz -C /usr/local/bin hugo
      - name: Build site
        run: hugo --gc --minify --baseURL "https://docs.example.com/"
      - name: Build Pagefind index
        run: npx -y pagefind --site public
      - uses: actions/upload-pages-artifact@v3
        with:
          path: public

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```
{{< /tab >}}
{{< /code-group >}}

## Verifying a deploy

After the first deploy, click through the live site and confirm three things: internal links resolve (a wrong `baseURL` usually breaks these), the search box returns results, and the dark and light toggle persists across page loads. If search returns nothing, the index step did not run; check that the Pagefind command is present in your build pipeline and that it ran after Hugo, not before.

{{< callout type="info" title="Next steps" >}}
Want to tune fonts, the accent color, or navigation? Those live in the configuration reference under the Docs section. This guide stops at getting the built site online.
{{< /callout >}}
