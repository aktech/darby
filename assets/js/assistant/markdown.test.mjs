import { test } from "node:test";
import assert from "node:assert/strict";
import { renderMarkdown, escapeHtml } from "./markdown.mjs";

const HITS = [{ url: "/docs/#a" }, { url: "/docs/#b" }];

test("renders paragraphs, bold and inline code", () => {
  const html = renderMarkdown("Set **accent** to a `hex` value.", HITS);
  assert.ok(html.includes("<p>"));
  assert.ok(html.includes("<strong>accent</strong>"));
  assert.ok(html.includes("<code>hex</code>"));
});

test("renders bullet and numbered lists", () => {
  assert.ok(renderMarkdown("- one\n- two", HITS).includes("<ul><li>one</li><li>two</li></ul>"));
  assert.ok(renderMarkdown("1. one\n2. two", HITS).includes("<ol><li>one</li><li>two</li></ol>"));
});

test("[n] citations link to the matching source", () => {
  const html = renderMarkdown("Use the accent param [1].", HITS);
  assert.ok(html.includes('<a class="asst-cite" href="/docs/#a">[1]</a>'));
});

test("fenced code block renders as a highlighted chroma <pre>, not paragraphs", () => {
  const md = "Try this:\n```js\nconst x = 1;\n```";
  const html = renderMarkdown(md, HITS);
  assert.ok(html.includes('<pre class="chroma"><code>'));
  assert.ok(html.includes('<span class="k">const</span>'));
  assert.ok(html.includes('<span class="mi">1</span>'));
});

test("markdown inside a code block is NOT interpreted (kept literal)", () => {
  const html = renderMarkdown("```\n**bold?** and `tick` [1]\n```", HITS);
  assert.ok(!html.includes("<strong>"), "** not turned into bold in code");
  assert.ok(!html.includes("asst-cite"), "[1] not turned into a citation in code");
  assert.ok(html.includes("**"), "asterisks kept literal");
});

test("code content is HTML-escaped", () => {
  const html = renderMarkdown("```html\n<div>&amp;</div>\n```", HITS);
  assert.ok(!html.includes("<div>"), "raw tag escaped");
  assert.ok(html.includes("&lt;div&gt;"));
});

test("an unterminated fence (mid-stream) still renders as a code block", () => {
  const html = renderMarkdown("```js\nconst x = 1;", HITS);
  assert.ok(html.includes('<pre class="chroma">'));
  assert.ok(html.includes('<span class="k">const</span>'));
});

test("escapeHtml is exported and escapes the dangerous chars", () => {
  assert.equal(escapeHtml('<a>&"'), "&lt;a&gt;&amp;&quot;");
});
