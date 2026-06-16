#!/usr/bin/env node
// Darby Ask Assistant: build the static retrieval index (CI / one-off, Node).
//
// Reads the ALREADY-RENDERED Hugo site (so shortcodes are expanded and URLs are
// real), chunks each page, embeds every chunk with the shared embedding model,
// and writes a single static JSON index that ships with the site. The browser
// only ever embeds the user's query against this prebuilt index.
//
// Usage:
//   node scripts/build-index.mjs \
//     --source exampleSite/public \
//     --base   https://aktech.github.io/darby/ \
//     --out    exampleSite/static/assistant-index.json
//
// Model id, dtype, pooling, prefixes and chunk sizes all come from the shared
// config module that the browser imports too, so the two sides cannot drift.
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pipeline, env } from "@huggingface/transformers";
import { EMBED } from "../assets/js/assistant/config.mjs";
import { extractPage } from "../assets/js/assistant/html-extract.mjs";
import { chunkPage } from "../assets/js/assistant/chunk.mjs";
import { embedTexts } from "../assets/js/assistant/embed.mjs";
import { serializeIndex } from "../assets/js/assistant/index-io.mjs";

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const SOURCE = arg("source", "exampleSite/public");
const BASE = arg("base", "https://example.org/");
const OUT = arg("out", "exampleSite/static/assistant-index.json");
// Pages we never want in the answer space: taxonomy lists and archived docs.
const SKIP = /\/(tags|categories|v1)\//;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

function pageUrl(file, sourceRoot) {
  const rel = path.relative(sourceRoot, file).replace(/index\.html$/, "");
  const normalized = "/" + rel.split(path.sep).join("/");
  // root-relative pathname against the site base (matches Hugo's own links)
  return new URL(normalized.replace(/^\//, ""), BASE).pathname;
}

async function main() {
  env.allowRemoteModels = true; // download model weights once (HF hub)
  console.log(`[index] embedding model: ${EMBED.modelId} (${EMBED.dtype})`);
  const extractor = await pipeline("feature-extraction", EMBED.modelId, {
    dtype: EMBED.dtype,
  });

  const files = (await htmlFiles(SOURCE)).filter((f) => !SKIP.test(f));
  const isHome = (f) => path.relative(SOURCE, f) === "index.html";

  const allChunks = [];
  for (const file of files) {
    if (isHome(file)) continue; // landing page is marketing, not docs
    const html = await readFile(file, "utf8");
    const { title, sections } = extractPage(html);
    if (!title || sections.length === 0) continue;
    const url = pageUrl(file, SOURCE);
    const chunks = chunkPage(title, url, sections);
    if (chunks.length) {
      allChunks.push(...chunks);
      console.log(`[index] ${url}  (${chunks.length} chunks)`);
    }
  }

  if (allChunks.length === 0) {
    throw new Error(`No content chunks found under ${SOURCE}. Did you run hugo first?`);
  }

  console.log(`[index] embedding ${allChunks.length} chunks...`);
  const vectors = await embedTexts(
    extractor,
    allChunks.map((c) => c.text),
    { isQuery: false }
  );
  const records = allChunks.map((c, i) => ({ ...c, vector: vectors[i] }));

  const blob = serializeIndex(records);
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, blob);

  const bytes = Buffer.byteLength(blob);
  const perChunk = Math.round(bytes / records.length);
  console.log(
    `[index] wrote ${OUT}: ${records.length} chunks, ` +
      `${(bytes / 1024).toFixed(1)} KiB total, ~${perChunk} bytes/chunk`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
