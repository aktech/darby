import { test } from "node:test";
import assert from "node:assert/strict";
import { createAnswerer } from "./answerer.mjs";

// Build a fake fetch returning an OpenAI-compatible SSE stream. Splits the
// payload across arbitrary byte boundaries to exercise the line-buffering.
function fakeFetch(sseText, captureRef) {
  const enc = new TextEncoder();
  const bytes = enc.encode(sseText);
  return async (url, opts) => {
    captureRef.url = url;
    captureRef.body = JSON.parse(opts.body);
    captureRef.auth = opts.headers.Authorization;
    let i = 0;
    const stream = new ReadableStream({
      pull(controller) {
        if (i >= bytes.length) return controller.close();
        const end = Math.min(i + 7, bytes.length); // tiny chunks, mid-line splits
        controller.enqueue(bytes.slice(i, end));
        i = end;
      },
    });
    return { ok: true, status: 200, statusText: "OK", body: stream };
  };
}

const SSE =
  `data: {"choices":[{"delta":{"content":"You set "}}]}\n\n` +
  `data: {"choices":[{"delta":{"content":"params.accent"}}]}\n\n` +
  `data: {"choices":[{"delta":{"content":" [1]."}}]}\n\n` +
  `data: [DONE]\n\n`;

test("hosted backend streams deltas and returns the full concatenated answer", async () => {
  const cap = {};
  const orig = globalThis.fetch;
  globalThis.fetch = fakeFetch(SSE, cap);
  try {
    const a = createAnswerer(
      { backend: "hosted", baseURL: "https://api.example.com/v1/", model: "m", apiKey: "sk-x" },
      null
    );
    const tokens = [];
    const full = await a.generate([{ role: "user", content: "hi" }], (t) => tokens.push(t));

    assert.equal(full, "You set params.accent [1].");
    assert.equal(tokens.join(""), "You set params.accent [1].");
    assert.ok(tokens.length >= 3, "streamed in multiple deltas");
    // request shape
    assert.equal(cap.url, "https://api.example.com/v1/chat/completions");
    assert.equal(cap.body.model, "m");
    assert.equal(cap.body.stream, true);
    assert.equal(cap.auth, "Bearer sk-x");
  } finally {
    globalThis.fetch = orig;
  }
});

test("createAnswerer selects the in-browser backend by default", () => {
  const client = { generate: async () => "ok" };
  const a = createAnswerer({ backend: "browser" }, client);
  assert.equal(a.label, "in-browser");
});

test("hosted backend omits Authorization when no api key is set (local servers)", async () => {
  const cap = {};
  const orig = globalThis.fetch;
  globalThis.fetch = fakeFetch(`data: [DONE]\n\n`, cap);
  try {
    const a = createAnswerer({ backend: "hosted", baseURL: "http://localhost:11434/v1", model: "llama" }, null);
    await a.generate([], () => {});
    assert.equal(cap.auth, undefined);
  } finally {
    globalThis.fetch = orig;
  }
});
