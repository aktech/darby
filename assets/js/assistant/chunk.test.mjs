import { test } from "node:test";
import assert from "node:assert/strict";
import { chunkPage } from "./chunk.mjs";

const PAGE = { title: "Quickstart", url: "/darby/docs/quickstart/" };

test("each chunk is self-contained: page title + heading prepended to the body", () => {
  const sections = [{ heading: "Install", level: 2, anchor: "install", text: "Run brew install hugo." }];
  const [c] = chunkPage(PAGE.title, PAGE.url, sections);
  assert.ok(c.text.startsWith("Quickstart"), "page title leads the chunk");
  assert.ok(c.text.includes("Install"), "heading attached to its body");
  assert.ok(c.text.includes("Run brew install hugo."));
});

test("chunk url carries the section anchor", () => {
  const sections = [{ heading: "Install", level: 2, anchor: "install", text: "x" }];
  const [c] = chunkPage(PAGE.title, PAGE.url, sections);
  assert.equal(c.url, "/darby/docs/quickstart/#install");
});

test("intro section (no anchor) links to the bare page url", () => {
  const sections = [{ heading: "Quickstart", level: 1, anchor: "", text: "Intro prose here." }];
  const [c] = chunkPage(PAGE.title, PAGE.url, sections);
  assert.equal(c.url, "/darby/docs/quickstart/");
});

test("a long section splits at paragraph boundaries, not mid-sentence", () => {
  const para = "Sentence here that is reasonably long. ".repeat(8).trim(); // ~310 chars
  const text = [para, para, para, para, para].join("\n\n"); // ~1550 chars > maxChars
  const sections = [{ heading: "Big", level: 2, anchor: "big", text }];
  const chunks = chunkPage(PAGE.title, PAGE.url, sections);
  assert.ok(chunks.length >= 2, "splits into multiple chunks");
  for (const c of chunks) {
    // no chunk grossly exceeds the max (allowing the prepended heading context)
    assert.ok(c.text.length <= 1500 + 60, `chunk within bound: ${c.text.length}`);
    assert.ok(c.heading === "Big");
    assert.ok(c.url === "/darby/docs/quickstart/#big");
  }
  // paragraphs are kept whole (a paragraph is never cut in half)
  assert.ok(chunks.every((c) => !/\bSentence here that is\b[^.]*$/.test(c.text.trim())));
});

test("tiny trailing piece merges back rather than becoming its own chunk", () => {
  const big = "word ".repeat(220).trim(); // ~1100 chars
  const tiny = "Just a short tail.";
  const sections = [{ heading: "S", level: 2, anchor: "s", text: big + "\n\n" + tiny }];
  const chunks = chunkPage(PAGE.title, PAGE.url, sections);
  assert.equal(chunks.length, 1, "short tail does not become its own chunk");
  assert.ok(chunks[0].text.includes("Just a short tail."));
});

test("empty sections are dropped", () => {
  const sections = [
    { heading: "Empty", level: 2, anchor: "e", text: "   " },
    { heading: "Real", level: 2, anchor: "r", text: "Has content." },
  ];
  const chunks = chunkPage(PAGE.title, PAGE.url, sections);
  assert.equal(chunks.length, 1);
  assert.equal(chunks[0].heading, "Real");
});

test("chunk ids are stable and unique within a page", () => {
  const sections = [
    { heading: "A", level: 2, anchor: "a", text: "x ".repeat(600) },
    { heading: "B", level: 2, anchor: "b", text: "y" },
  ];
  const ids = chunkPage(PAGE.title, PAGE.url, sections).map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length, "ids unique");
});
