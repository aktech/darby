import { test } from "node:test";
import assert from "node:assert/strict";
import { buildAnswerMessages, buildFollowupMessages, parseFollowups, cleanAnswer, suggestFromChunks } from "./prompt.mjs";

const CHUNKS = [
  { heading: "Install", url: "/d/#install", text: "Quickstart > Install\n\nRun brew install hugo." },
  { heading: "Accent", url: "/c/#accent", text: "Config > Accent\n\nSet params.accent to a hex color." },
];

test("answer system prompt enforces grounding: only context, admit when absent", () => {
  const [sys] = buildAnswerMessages("how do I install?", CHUNKS);
  assert.equal(sys.role, "system");
  const s = sys.content.toLowerCase();
  assert.ok(s.includes("only") && s.includes("context"));
  assert.ok(s.includes("don't know") || s.includes("not in the"));
});

test("answer system prompt does NOT ask for follow-ups inline (kept as a separate call)", () => {
  const [sys] = buildAnswerMessages("q", CHUNKS);
  assert.ok(!/follow.?up/i.test(sys.content));
});

test("answer user message numbers the sources so the model can cite them", () => {
  const msgs = buildAnswerMessages("how do I install?", CHUNKS);
  const user = msgs[msgs.length - 1];
  assert.equal(user.role, "user");
  assert.ok(user.content.includes("[1]"));
  assert.ok(user.content.includes("[2]"));
  assert.ok(user.content.includes("brew install hugo"));
  assert.ok(user.content.includes("how do I install?"));
});

test("follow-up messages include the question and the given answer", () => {
  const msgs = buildFollowupMessages("how do I install?", "Run brew install hugo [1].");
  const joined = msgs.map((m) => m.content).join("\n").toLowerCase();
  assert.ok(joined.includes("how do i install?"));
  assert.ok(joined.includes("brew install hugo"));
  assert.ok(/follow.?up|next/.test(joined));
});

test("parseFollowups extracts question lines, strips bullets/numbering, caps at 3", () => {
  const raw = "Here are some:\n1. How do I set the accent color?\n- How do I deploy?\n* Can I use a custom font?\nHow about a fourth one?";
  const fus = parseFollowups(raw);
  assert.deepEqual(fus, [
    "How do I set the accent color?",
    "How do I deploy?",
    "Can I use a custom font?",
  ]);
});

test("parseFollowups drops preamble/non-question noise and over-long lines", () => {
  const raw = "Sure! Here you go:\nthis is not a question\nWhat is the theme name?";
  assert.deepEqual(parseFollowups(raw), ["What is the theme name?"]);
});

test("parseFollowups returns [] for empty / junk", () => {
  assert.deepEqual(parseFollowups(""), []);
  assert.deepEqual(parseFollowups("\n\n"), []);
});

test("suggestFromChunks derives distinct topic chips from the other retrieved sources", () => {
  const chunks = [
    { heading: "Accent color" }, // the answered source, skipped
    { heading: "Parameter reference" },
    { heading: "Parameter reference" }, // dup
    { heading: "Fonts" },
    { heading: "Deploying" },
  ];
  assert.deepEqual(suggestFromChunks(chunks), ["Parameter reference", "Fonts", "Deploying"]);
});

test("suggestFromChunks returns [] when there are no other sources", () => {
  assert.deepEqual(suggestFromChunks([{ heading: "Only one" }]), []);
  assert.deepEqual(suggestFromChunks([]), []);
});

test("cleanAnswer trims and removes a stray follow-up marker if a model emits one", () => {
  assert.equal(cleanAnswer("  The answer is X.  "), "The answer is X.");
  assert.equal(cleanAnswer("The answer is X.\n===FOLLOWUPS===\nignored"), "The answer is X.");
});
