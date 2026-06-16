import { test } from "node:test";
import assert from "node:assert/strict";
import { extractPage } from "./html-extract.mjs";

// Mirrors Hugo's minified output: unquoted attrs, <article class=doc>, a
// breadcrumb nav to discard, h1 title, h2 with id anchors, callout chrome,
// svg icons and a code block whose text we want to keep.
const HTML = `<!doctype html><html><head><title>Quickstart | Darby</title></head>
<body><header class=topbar><nav>site nav junk</nav></header><main><article class=doc>
<nav class=breadcrumbs aria-label=Breadcrumb><a href=/darby/docs/>Documentation</a></nav>
<h1>Quickstart</h1>
<p>Get a site running in five minutes.</p>
<div class="callout callout-note"><div class=callout-head><span class=callout-icon><svg width=17><path d="M12 16"/></svg></span><span class=callout-title>Before you start</span></div><div class=callout-body><p>You need Hugo Extended.</p></div></div>
<h2 id=install>Install<a class=heading-anchor href=#install>#</a></h2>
<p>First, install Hugo Extended.</p>
<pre class=chroma><code>brew install hugo</code></pre>
<h2 id=configure>Configure</h2>
<p>Set the accent color in your config.</p>
</article></main>
<footer>footer junk</footer><script>console.log('nope')</script></body></html>`;

test("extractPage pulls the page title from <title>, trimming the site suffix", () => {
  const page = extractPage(HTML);
  assert.equal(page.title, "Quickstart");
});

test("extractPage segments article content by h2/h3 into sections", () => {
  const { sections } = extractPage(HTML);
  const headings = sections.map((s) => s.heading);
  // intro (under the h1) + the two h2 sections
  assert.deepEqual(headings, ["Quickstart", "Install", "Configure"]);
});

test("extractPage keeps the heading id as the section anchor", () => {
  const { sections } = extractPage(HTML);
  const install = sections.find((s) => s.heading === "Install");
  assert.equal(install.anchor, "install");
  const intro = sections.find((s) => s.heading === "Quickstart");
  assert.equal(intro.anchor, ""); // h1 has no anchor
});

test("extractPage strips chrome (nav, svg, footer, script, anchor links) but keeps prose + code", () => {
  const { sections } = extractPage(HTML);
  const all = sections.map((s) => s.text).join("\n");
  assert.ok(all.includes("Get a site running in five minutes."));
  assert.ok(all.includes("brew install hugo"), "code text retained");
  assert.ok(all.includes("You need Hugo Extended."), "callout body retained");
  assert.ok(!all.includes("site nav junk"));
  assert.ok(!all.includes("footer junk"));
  assert.ok(!all.includes("console.log"));
  assert.ok(!all.includes("Breadcrumb"));
  assert.ok(!/M12 16/.test(all), "svg path data stripped");
  assert.ok(!all.includes("#install"));
});

test("rendered code blocks become fenced markdown (lang preserved, chrome dropped)", () => {
  const html = `<title>T</title><article class=doc><h1>H</h1>
  <div class="code-block" data-lang="toml"><div class="code-head"><span class="code-filename">hugo.toml</span><span class="code-lang">toml</span><button class="code-copy"><svg></svg></button></div>
  <div class="highlight"><pre tabindex="0" class="chroma"><code class="language-toml" data-lang="toml"><span class="line"><span class="cl"><span class="p">[</span><span class="nx">params</span><span class="p">]</span>
</span></span><span class="line"><span class="cl">  <span class="nx">accent</span> <span class="p">=</span> <span class="s2">&#34;#6366f1&#34;</span>
</span></span></code></pre></div></div>
  <p>Trailing prose.</p></article>`;
  const { sections } = extractPage(html);
  const text = sections[0].text;
  // a real fence with the language
  assert.ok(text.includes("```toml"), "opening fence with language");
  assert.ok(/```\s*$|```\n/.test(text) || text.includes("```\n") || text.trimEnd().endsWith("```"), "closing fence");
  // the code itself, with quotes decoded and indentation kept
  assert.ok(text.includes('[params]'));
  assert.ok(text.includes('  accent = "#6366f1"'), "indentation + decoded quotes preserved");
  // chrome must NOT leak as text
  assert.ok(!text.includes("hugo.toml"), "filename chrome dropped");
  assert.ok(!/\btoml\b\s*\n/.test(text.replace("```toml", "")), "bare lang label dropped");
  // surrounding prose still there
  assert.ok(text.includes("Trailing prose."));
});

test("code-block extraction works on MINIFIED html (unquoted attributes)", () => {
  // Hugo's --minify (used in CI) drops attribute quotes: class=chroma, not class="chroma".
  const html = `<title>T</title><article class=doc><h1>H</h1>` +
    `<div class=code-block data-lang=bash><div class=code-head><span class=code-filename>run.sh</span><span class=code-lang>bash</span><button class=code-copy></button></div>` +
    `<div class=highlight><pre tabindex=0 class=chroma><code class=language-bash data-lang=bash><span class=line><span class=cl>npm install</span></span></code></pre></div></div></article>`;
  const text = extractPage(html).sections[0].text;
  assert.ok(text.includes("```bash"), "fence + language from minified markup");
  assert.ok(text.includes("npm install"));
  assert.ok(!text.includes("run.sh"), "filename chrome dropped");
});

test("extractPage decodes HTML entities", () => {
  const page = extractPage(`<title>T</title><article class=doc><h1>H</h1><p>a &amp; b &lt; c &#34;d&#34;</p></article>`);
  assert.ok(page.sections[0].text.includes('a & b < c "d"'));
});
