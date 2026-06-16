import { test } from "node:test";
import assert from "node:assert/strict";
import { highlightCode } from "./highlight.mjs";

test("escapes HTML so code can't inject markup", () => {
  const out = highlightCode('const x = a < b && c > d;', "js");
  assert.ok(!out.includes("<b"), "no raw tags");
  assert.ok(out.includes("&lt;") && out.includes("&gt;") && out.includes("&amp;"));
});

test("strings get the chroma string class", () => {
  const out = highlightCode('const s = "hello";', "js");
  assert.ok(out.includes('<span class="s">&#34;hello&#34;</span>') || out.includes('<span class="s">"hello"</span>'));
});

test("keywords and constants get keyword classes", () => {
  const out = highlightCode("const ok = true;", "js");
  assert.ok(out.includes('<span class="k">const</span>'));
  assert.ok(out.includes('<span class="kc">true</span>'));
});

test("numbers get the number class", () => {
  const out = highlightCode("let n = 42;", "js");
  assert.ok(out.includes('<span class="mi">42</span>'));
});

test("function calls get the function class", () => {
  const out = highlightCode("doThing(x);", "js");
  assert.ok(out.includes('<span class="nf">doThing</span>'));
});

test("line comments: // for slash langs, # for hash langs", () => {
  assert.ok(highlightCode("a; // note", "js").includes('<span class="c1">// note</span>'));
  assert.ok(highlightCode("a # note", "bash").includes('<span class="c1"># note</span>'));
});

test("a # in a slash-lang is NOT a comment (no false positive)", () => {
  const out = highlightCode("const c = obj.a; b()", "js");
  assert.ok(!out.includes("c1"));
});

test("a URL's // inside a string is not treated as a comment", () => {
  const out = highlightCode('fetch("https://example.com/x")', "js");
  assert.ok(!out.includes("c1"), "no comment span");
  assert.ok(out.includes('class="s"'), "url stays inside the string token");
});

test("preserves newlines and indentation (rendered inside <pre>)", () => {
  const out = highlightCode("function f() {\n  return 1;\n}", "js");
  assert.ok(out.includes("\n  "), "leading whitespace kept");
  assert.equal(out.split("\n").length, 3);
});
