// Extract clean, section-segmented prose from a rendered Hugo page.
// Used by the CI indexer. We index the RENDERED HTML (not raw Markdown) so
// Hugo shortcodes are already expanded and we get real published URLs/anchors.
//
// Zero dependencies: a focused scanner over Darby's own predictable output
// (<article class="doc">, h1 title, h2/h3 with id anchors), not a full DOM.

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

function decodeEntities(s) {
  return s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, body) => {
    if (body[0] === "#") {
      const code =
        body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16)
          : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const key = body.toLowerCase();
    return key in ENTITIES ? ENTITIES[key] : m;
  });
}

// Strip whole subtrees we never want as text (chrome, icons, scripts).
function stripChrome(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, " ")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, " ")
    // heading anchor links the render-heading hook injects (the "#" symbol)
    .replace(/<a\b[^>]*class=["']?heading-anchor[^>]*>[\s\S]*?<\/a>/gi, " ");
}

function htmlToText(html) {
  const withBreaks = stripChrome(html)
    // turn block boundaries into newlines so paragraphs/list items/code stay apart
    .replace(/<\/(p|div|li|h[1-6]|pre|tr|section|blockquote)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, ""); // drop remaining tags
  return decodeEntities(withBreaks)
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tagText(openTagInner) {
  // inner HTML of a heading -> plain heading text
  return htmlToText(openTagInner).replace(/\s+/g, " ").trim();
}

function attr(openTag, name) {
  const m = openTag.match(new RegExp(`\\b${name}=("?)([^"\\s>]+)\\1`, "i"));
  return m ? m[2] : "";
}

export function extractPage(html) {
  // Title: <title>Foo | Darby</title> -> "Foo"; fall back to the h1.
  const titleTag = html.match(/<title>([\s\S]*?)<\/title>/i);
  let title = titleTag ? decodeEntities(titleTag[1]).split(/\s+[|·]\s+/)[0].trim() : "";

  // Isolate the documentation article body.
  const artOpen = html.search(/<article\b/i);
  let body = html;
  if (artOpen !== -1) {
    const afterOpen = html.indexOf(">", artOpen) + 1;
    const artClose = html.indexOf("</article>", afterOpen);
    body = html.slice(afterOpen, artClose === -1 ? undefined : artClose);
  }
  body = stripChrome(body);

  // Split on headings (h1-h3), keeping each heading with the body that follows.
  const headingRe = /<(h[1-3])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  const marks = [];
  let m;
  while ((m = headingRe.exec(body))) {
    marks.push({
      start: m.index,
      end: headingRe.lastIndex,
      level: Number(m[1][1]),
      anchor: attr(m[2], "id"),
      heading: tagText(m[3]),
    });
  }

  const sections = [];
  if (marks.length === 0) {
    const text = htmlToText(body);
    if (text) sections.push({ heading: title, level: 1, anchor: "", text });
  } else {
    // any prose before the first heading belongs to the intro
    for (let i = 0; i < marks.length; i++) {
      const cur = marks[i];
      const next = marks[i + 1];
      const bodyHtml = body.slice(cur.end, next ? next.start : undefined);
      const text = htmlToText(bodyHtml);
      sections.push({
        heading: cur.heading,
        level: cur.level,
        anchor: cur.anchor,
        text,
      });
    }
  }

  if (!title && sections.length) title = sections[0].heading;
  return { title, sections };
}
