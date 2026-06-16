// Turn extracted page sections into self-contained retrieval chunks.
//
// Chunking is the single biggest lever on retrieval quality, so:
//  - chunks follow semantic boundaries (sections, then paragraphs);
//  - the page title + heading are prepended to every chunk so it reads as a
//    complete, standalone passage (and embeds with that context);
//  - chunks are sized so one usually holds a complete answer;
//  - a paragraph is never cut in half; tiny tails merge back.
import { CHUNK } from "./config.mjs";

function chunkUrl(pageUrl, anchor) {
  return anchor ? `${pageUrl}#${anchor}` : pageUrl;
}

// Greedily pack paragraphs into pieces of ~targetChars, never exceeding maxChars
// unless a single paragraph is itself larger than maxChars.
function packParagraphs(text, { targetChars, maxChars, minChars }) {
  const paras = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const pieces = [];
  let cur = "";
  for (const p of paras) {
    if (!cur) {
      cur = p;
    } else if (cur.length + 2 + p.length <= maxChars && cur.length < targetChars) {
      cur += "\n\n" + p;
    } else {
      pieces.push(cur);
      cur = p;
    }
  }
  if (cur) pieces.push(cur);

  // Merge a too-small trailing piece back into its predecessor when there's room.
  if (pieces.length >= 2) {
    const last = pieces[pieces.length - 1];
    const prev = pieces[pieces.length - 2];
    if (last.length < minChars && prev.length + 2 + last.length <= maxChars) {
      pieces.splice(pieces.length - 2, 2, prev + "\n\n" + last);
    }
  }
  return pieces;
}

export function chunkPage(pageTitle, pageUrl, sections, opts = CHUNK) {
  const chunks = [];
  let n = 0;
  for (const section of sections) {
    const body = (section.text || "").trim();
    if (!body) continue;

    const context =
      section.heading && section.heading !== pageTitle
        ? `${pageTitle} > ${section.heading}`
        : pageTitle;

    const pieces = packParagraphs(body, opts);
    for (const piece of pieces) {
      const id = `${pageUrl}#${section.anchor || "_"}~${n++}`;
      chunks.push({
        id,
        title: pageTitle,
        heading: section.heading,
        url: chunkUrl(pageUrl, section.anchor),
        text: `${context}\n\n${piece}`,
      });
    }
  }
  return chunks;
}
