"use strict";
var mermaidDoodle = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/auto.ts
  var auto_exports = {};

  // src/palette.ts
  var VAR_NAMES = {
    bg: "--doodle-bg",
    accent: "--doodle-accent",
    nodeBg: "--doodle-node-bg",
    nodeText: "--doodle-node-text",
    altBg: "--doodle-alt-bg",
    altBorder: "--doodle-alt-border",
    clusterBg: "--doodle-cluster-bg",
    clusterBorder: "--doodle-cluster-border",
    tertiaryBg: "--doodle-tertiary-bg",
    tertiaryText: "--doodle-tertiary-text",
    noteBg: "--doodle-note-bg",
    text: "--doodle-text",
    edgeLabelBg: "--doodle-edge-label-bg",
    font: "--doodle-font"
  };
  var DEFAULT_PALETTE = {
    bg: "transparent",
    accent: "#4f46e5",
    nodeBg: "#eef2ff",
    nodeText: "#1e1b4b",
    altBg: "#f5f3ff",
    altBorder: "#a5b4fc",
    clusterBg: "#fafafa",
    clusterBorder: "#d4d4d8",
    tertiaryBg: "#fafafa",
    tertiaryText: "#27272a",
    noteBg: "#f5f3ff",
    text: "#27272a",
    edgeLabelBg: "#ffffff",
    font: '"Segoe Print", "Comic Sans MS", cursive'
  };
  function paletteFromVars(read) {
    const get = (key) => read(VAR_NAMES[key]).trim() || DEFAULT_PALETTE[key];
    const clusterBg = get("clusterBg");
    const text = get("text");
    return {
      bg: get("bg"),
      accent: get("accent"),
      nodeBg: get("nodeBg"),
      nodeText: get("nodeText"),
      altBg: get("altBg"),
      altBorder: get("altBorder"),
      clusterBg,
      clusterBorder: get("clusterBorder"),
      // Tertiary is a refinement: sites that do not care get the cluster and
      // body values, sites that do can split them.
      tertiaryBg: read(VAR_NAMES.tertiaryBg).trim() || clusterBg,
      tertiaryText: read(VAR_NAMES.tertiaryText).trim() || text,
      noteBg: get("noteBg"),
      text,
      edgeLabelBg: get("edgeLabelBg"),
      font: get("font")
    };
  }
  function toThemeVariables(p) {
    return {
      background: p.bg,
      primaryColor: p.nodeBg,
      primaryBorderColor: p.accent,
      primaryTextColor: p.nodeText,
      secondaryColor: p.altBg,
      secondaryBorderColor: p.altBorder,
      secondaryTextColor: p.nodeText,
      tertiaryColor: p.tertiaryBg,
      tertiaryBorderColor: p.clusterBorder,
      tertiaryTextColor: p.tertiaryText,
      lineColor: p.accent,
      textColor: p.text,
      clusterBkg: p.clusterBg,
      clusterBorder: p.clusterBorder,
      nodeBorder: p.accent,
      edgeLabelBackground: p.edgeLabelBg,
      noteBkgColor: p.noteBg,
      noteBorderColor: p.accent,
      noteTextColor: p.nodeText
    };
  }

  // src/sources.ts
  var DEFAULT_SELECTOR = 'pre.mermaid, div.mermaid, [data-language="mermaid"], code.language-mermaid';
  var STASH_ATTR = "data-doodle-src";
  var CLAIMED_SELECTOR = `[${STASH_ATTR}]`;
  function extractSource(el) {
    const lines = el.querySelectorAll(".ec-line, .line");
    if (lines.length > 1) {
      return Array.from(lines, lineText).join("\n").replace(/\s+$/, "");
    }
    return (el.textContent ?? "").replace(/\s+$/, "");
  }
  function lineText(line) {
    const code = line.querySelector(":scope > .code");
    const text = (code ?? line).textContent ?? "";
    return text.replace(/\n/g, "");
  }
  function containerFor(el) {
    const node = el.tagName === "CODE" && el.parentElement?.tagName === "PRE" ? el.parentElement : el;
    return node instanceof HTMLElement ? node : null;
  }
  function collectSources(root = document, selector = DEFAULT_SELECTOR) {
    const seen = /* @__PURE__ */ new Set();
    const found = [];
    for (const match of root.querySelectorAll(selector)) {
      const container = containerFor(match);
      if (!container || seen.has(container)) continue;
      seen.add(container);
      const stashed = container.getAttribute(STASH_ATTR);
      const source = stashed ?? extractSource(container);
      if (stashed === null) container.setAttribute(STASH_ATTR, source);
      found.push({ container, source });
    }
    return found;
  }

  // src/highlight.ts
  var KEYWORDS = /\b(?<!%%[^\n]*)(flowchart|graph|subgraph|end|direction|sequenceDiagram|participant|actor|loop|alt|opt|else|par|note|over|activate|deactivate|classDiagram|classDef|class|stateDiagram-v2|stateDiagram|state|erDiagram|gantt|pie|journey|gitGraph|TB|TD|BT|RL|LR)\b/g;
  var COMMENT = /(^|\n)(%%[^\n]*)/g;
  var STRING = /(&#34;[^&]*?&#34;)/g;
  var OPERATOR = /(--?(?:&gt;){1,2}|-\.-(?:&gt;)|={2,3}(?:&gt;)|--[xo]|:::|\|)/g;
  function escapeHtml(source) {
    return source.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&#34;");
  }
  function highlight(source) {
    let html = escapeHtml(source);
    html = html.replace(KEYWORDS, '<span class="doodle-hl-k">$1</span>');
    html = html.replace(COMMENT, '$1<span class="doodle-hl-c">$2</span>');
    html = html.replace(STRING, '<span class="doodle-hl-s">$1</span>');
    html = html.replace(OPERATOR, '<span class="doodle-hl-o">$1</span>');
    return html;
  }

  // src/source-view.ts
  var COPY_ICON = '<svg class="doodle-copy__copy" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  var CHECK_ICON = '<svg class="doodle-copy__check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m20 6-11 11-5-5"/></svg>';
  var COPIED_MS = 1500;
  function buildSourceView(source, label = "mermaid") {
    const panel = document.createElement("div");
    panel.className = "doodle-source";
    const head = document.createElement("div");
    head.className = "doodle-source__head";
    const lang = document.createElement("span");
    lang.className = "doodle-source__lang";
    lang.textContent = label;
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "doodle-copy";
    copy.setAttribute("aria-label", "Copy diagram source");
    copy.innerHTML = COPY_ICON + CHECK_ICON;
    let timer;
    copy.addEventListener("click", () => {
      const clipboard = navigator.clipboard;
      if (!clipboard || typeof clipboard.writeText !== "function") return;
      void clipboard.writeText(source).then(() => {
        copy.classList.add("is-copied");
        clearTimeout(timer);
        timer = setTimeout(() => copy.classList.remove("is-copied"), COPIED_MS);
      }).catch(() => {
      });
    });
    head.append(lang, copy);
    const pre = document.createElement("pre");
    pre.className = "doodle-source__pre";
    const code = document.createElement("code");
    code.innerHTML = highlight(source);
    pre.append(code);
    panel.append(head, pre);
    return panel;
  }

  // src/theme.ts
  var DARK_QUERY = "(prefers-color-scheme: dark)";
  function currentTheme(doc = document) {
    const root = doc.documentElement;
    const attr = root.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
    if (root.classList.contains("dark")) return "dark";
    const view = doc.defaultView;
    if (view?.matchMedia(DARK_QUERY).matches) return "dark";
    return "light";
  }
  function watchTheme(onChange, doc = document) {
    let last = currentTheme(doc);
    const check = () => {
      const next = currentTheme(doc);
      if (next === last) return;
      last = next;
      onChange(next);
    };
    const observer = new MutationObserver(check);
    observer.observe(doc.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"]
    });
    const media = doc.defaultView?.matchMedia(DARK_QUERY);
    media?.addEventListener("change", check);
    return () => {
      observer.disconnect();
      media?.removeEventListener("change", check);
    };
  }

  // src/mermaid-loader.ts
  var DEFAULT_CDN_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.17.2/dist/mermaid.esm.min.mjs";
  function unwrap(mod) {
    const candidate = mod?.default ?? mod;
    return candidate && typeof candidate.run === "function" ? candidate : null;
  }
  function importAtRuntime(specifier) {
    const dynamicImport = new Function("specifier", "return import(specifier)");
    return dynamicImport(specifier);
  }
  async function resolveMermaid(provided, cdnUrl = DEFAULT_CDN_URL) {
    if (provided) return provided;
    const global = unwrap(globalThis.mermaid);
    if (global) return global;
    if (false) {
      try {
        return unwrap(await null);
      } catch {
      }
    }
    if (cdnUrl) {
      try {
        return unwrap(await importAtRuntime(cdnUrl));
      } catch {
      }
    }
    return null;
  }

  // src/colour.ts
  var COLOUR_FIELDS = Object.keys(VAR_NAMES).filter(
    (key) => key !== "font"
  );
  function normalisePaletteColours(palette, convert) {
    const result = { ...palette };
    for (const key of COLOUR_FIELDS) {
      const value = palette[key];
      if (value.trim().toLowerCase() === "transparent") continue;
      try {
        result[key] = convert(value);
      } catch {
      }
    }
    return result;
  }

  // src/colour-canvas.ts
  var INVALID_SENTINEL = "#010203";
  function createCanvasColourConverter() {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d");
    if (!ctx) return (value) => value;
    return (value) => {
      ctx.fillStyle = INVALID_SENTINEL;
      ctx.fillStyle = value;
      if (ctx.fillStyle === INVALID_SENTINEL) return value;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return a === 255 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${+(a / 255).toFixed(3)})`;
    };
  }

  // src/renderer.ts
  var WRAP_CLASS = "doodle-wrap";
  var SOURCE_ATTR = "data-doodle-source";
  var DIAGRAM_CLASS = "doodle-diagram";
  var GENERIC_FONT_FAMILIES = /* @__PURE__ */ new Set([
    "serif",
    "sans-serif",
    "cursive",
    "fantasy",
    "monospace",
    "system-ui",
    "ui-serif",
    "ui-sans-serif",
    "ui-monospace",
    "ui-rounded",
    "emoji",
    "math",
    "fangsong"
  ]);
  function firstFontFamily(fontStack) {
    const first = (fontStack.split(",")[0] ?? "").trim();
    const unquoted = first.replace(/^["']|["']$/g, "").trim();
    if (!unquoted || GENERIC_FONT_FAMILIES.has(unquoted.toLowerCase())) return null;
    return unquoted;
  }
  function createRenderer(options = {}) {
    const {
      root = document,
      selector = DEFAULT_SELECTOR,
      mermaid: provided,
      cdnUrl = DEFAULT_CDN_URL,
      look = "handDrawn",
      handDrawnSeed = 4,
      securityLevel = "strict",
      showSource = false,
      mermaidConfig = {}
    } = options;
    const collectSelector = `${selector}, ${CLAIMED_SELECTOR}`;
    let instance = null;
    let inFlight = null;
    let rerunRequested = false;
    let stopWatching = null;
    let fontsReady = false;
    let colourConverter = null;
    async function ensureFontsReady(fontStack) {
      if (fontsReady) return;
      fontsReady = true;
      if (typeof document === "undefined" || !document.fonts) return;
      const family = firstFontFamily(fontStack);
      if (family) {
        try {
          await document.fonts.load(`1em "${family}"`);
        } catch {
        }
      }
      try {
        await document.fonts.ready;
      } catch {
      }
    }
    function wrap(container) {
      const parent = container.parentElement;
      if (parent?.classList.contains(WRAP_CLASS)) return parent;
      const wrapper = document.createElement("div");
      wrapper.className = WRAP_CLASS;
      container.replaceWith(wrapper);
      wrapper.append(container);
      return wrapper;
    }
    async function renderOnce() {
      const found = collectSources(root, collectSelector);
      if (found.length === 0) return;
      instance ??= await resolveMermaid(provided, cdnUrl);
      if (!instance) {
        console.warn("[mermaid-doodle] no mermaid instance available, diagrams left as text");
        return;
      }
      const nodes = [];
      for (const { container, source } of found) {
        container.classList.add(DIAGRAM_CLASS);
        const wrapper = wrap(container);
        const wants = showSource || wrapper.hasAttribute(SOURCE_ATTR) || container.hasAttribute(SOURCE_ATTR);
        if (wants && !wrapper.querySelector(":scope > .doodle-source")) {
          wrapper.insertBefore(buildSourceView(source), container);
        }
        container.textContent = source;
        container.removeAttribute("data-processed");
        nodes.push(container);
      }
      const rootStyle = getComputedStyle(document.documentElement);
      const palette = paletteFromVars((name) => rootStyle.getPropertyValue(name));
      await ensureFontsReady(palette.font);
      colourConverter ??= createCanvasColourConverter();
      const colours = normalisePaletteColours(palette, colourConverter);
      instance.initialize({
        startOnLoad: false,
        securityLevel,
        look,
        handDrawnSeed,
        theme: "base",
        fontFamily: palette.font,
        themeVariables: toThemeVariables(colours),
        flowchart: { curve: "basis", padding: 16, htmlLabels: true },
        ...mermaidConfig
      });
      await instance.run({ nodes, suppressErrors: true });
    }
    function render() {
      if (inFlight) {
        rerunRequested = true;
        return inFlight;
      }
      inFlight = (async () => {
        try {
          do {
            rerunRequested = false;
            try {
              await renderOnce();
            } catch (error) {
              console.warn("[mermaid-doodle] render failed", error);
            }
          } while (rerunRequested);
        } finally {
          inFlight = null;
        }
      })();
      return inFlight;
    }
    return {
      render,
      async mount() {
        await render();
        stopWatching ??= watchTheme(() => {
          void render();
        });
      },
      destroy() {
        stopWatching?.();
        stopWatching = null;
      }
    };
  }

  // src/auto.ts
  function start() {
    void createRenderer(window.mermaidDoodleConfig ?? {}).mount();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
  return __toCommonJS(auto_exports);
})();
