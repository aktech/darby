import { test } from "node:test";
import assert from "node:assert/strict";
import { topK } from "./rank.mjs";

// L2-normalized vectors so dot product == cosine similarity.
function norm(v) {
  const len = Math.hypot(...v);
  return v.map((x) => x / len);
}

test("ranks items by descending dot product and returns at most k", () => {
  const q = norm([1, 0]);
  const items = [
    { id: "a", vector: norm([0, 1]) }, // orthogonal -> ~0
    { id: "b", vector: norm([1, 0.05]) }, // nearly aligned -> highest
    { id: "c", vector: norm([1, 1]) }, // 45deg -> middle
  ];
  const top = topK(q, items, 2);
  assert.equal(top.length, 2);
  assert.deepEqual(top.map((t) => t.id), ["b", "c"]);
  assert.ok(top[0].score > top[1].score);
});

test("k larger than the pool returns the whole pool ranked", () => {
  const q = norm([1, 0]);
  const items = [{ id: "a", vector: norm([1, 0]) }];
  assert.equal(topK(q, items, 10).length, 1);
});

test("returns the original item plus a numeric score", () => {
  const q = norm([1, 0]);
  const items = [{ id: "a", heading: "H", vector: norm([1, 0]) }];
  const [hit] = topK(q, items, 1);
  assert.equal(hit.heading, "H");
  assert.equal(typeof hit.score, "number");
  assert.ok(Math.abs(hit.score - 1) < 1e-6, "identical vectors score ~1");
});
