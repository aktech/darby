import { test } from "node:test";
import assert from "node:assert/strict";
import { serializeIndex, deserializeIndex } from "./index-io.mjs";

const RECORDS = [
  { id: "a#0", title: "Quickstart", heading: "Install", url: "/d/#install", text: "body a", vector: [0.1, 0.2, 0.3] },
  { id: "b#0", title: "Config", heading: "Accent", url: "/c/#accent", text: "body b", vector: [0.4, 0.5, 0.6] },
];

test("round-trips chunk metadata and vectors through serialize/deserialize", () => {
  const blob = serializeIndex(RECORDS);
  const back = deserializeIndex(blob);
  assert.equal(back.records.length, 2);
  assert.equal(back.records[0].heading, "Install");
  assert.equal(back.records[0].url, "/d/#install");
  // vectors are stored as Float32 (compact), so compare with tolerance
  const close = (a, b) => a.every((x, i) => Math.abs(x - b[i]) < 1e-6);
  assert.ok(close(Array.from(back.records[0].vector), [0.1, 0.2, 0.3]));
  assert.ok(close(Array.from(back.records[1].vector), [0.4, 0.5, 0.6]));
});

test("serialized blob is JSON carrying model id, dim and format version (provenance)", () => {
  const obj = JSON.parse(serializeIndex(RECORDS));
  assert.equal(obj.dim, 3);
  assert.ok(obj.version >= 1);
  assert.ok(obj.model.includes("bge-small"));
  assert.equal(obj.count, 2);
});

test("deserialize accepts either a JSON string or a parsed object", () => {
  const str = serializeIndex(RECORDS);
  const fromStr = deserializeIndex(str);
  const fromObj = deserializeIndex(JSON.parse(str));
  assert.equal(fromStr.records.length, fromObj.records.length);
  assert.equal(fromObj.meta.dim, 3);
});
