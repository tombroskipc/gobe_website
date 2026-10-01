#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const distributeBlockEmphasis = (markdown, marker) => {
  const pattern = new RegExp(`${escapeRegExp(marker)}([\\s\\S]+?)${escapeRegExp(marker)}`, "g");

  return markdown.replace(pattern, (match, inner) => {
    if (!inner.includes("\n")) {
      return match;
    }

    return inner
      .split("\n")
      .map((line) => {
        if (!line.trim()) {
          return line;
        }

        const listItem = line.match(/^(\s*(?:[-*+]|\d+[.)])\s+)([\s\S]*)$/);

        if (listItem) {
          return `${listItem[1]}${marker}${listItem[2]}${marker}`;
        }

        return `${marker}${line}${marker}`;
      })
      .join("\n");
  });
};

const renderInline = (text) => {
  const store = [];
  const stash = (html) => {
    store.push(html);
    return `\u0000${store.length - 1}\u0000`;
  };

  let out = escapeHtml(text);

  out = out.replace(/`([^`]+)`/g, (_match, code) => stash(`<code>${code}</code>`));
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_match, label, url) => stash(`<a href="${url}">${label}</a>`));
  out = out.replace(/(^|[\s(])((?:https?:\/\/|www\.)[^\s<]+)/g, (_match, prefix, url) => {
    const href = url.startsWith("www.") ? `https://${url}` : url;
    return `${prefix}${stash(`<a href="${href}">${url}</a>`)}`;
  });

  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*\w])\*(?!\s)([^*\n]*?[^\s*])\*(?!\*)/g, "$1<em>$2</em>");
  out = out.replace(/(^|[^\w_])_(?!\s)([^_\n]*?[^\s_])_(?![\w_])/g, "$1<em>$2</em>");

  return out.replace(/\u0000(\d+)\u0000/g, (_match, index) => store[Number(index)]);
};

const isBlockStart = (line) =>
  /^\s*```/.test(line) ||
  /^\s*#{1,6}\s+/.test(line) ||
  /^\s*>\s?/.test(line) ||
  /^\s*[-*+]\s+/.test(line) ||
  /^\s*\d+[.)]\s+/.test(line) ||
  /^\s*(?:---|\*\*\*|___)\s*$/.test(line);

const renderParagraph = (lines) => `<p>${renderInline(lines.join("\n")).replace(/\n/g, "<br>")}</p>`;

export function markdownToChatwootHtml(markdown) {
  const source = distributeBlockEmphasis(String(markdown ?? "").replace(/\r\n?/g, "\n"), "**");
  const lines = source.split("\n");
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (/^\s*```/.test(line)) {
      const codeLines = [];
      index += 1;
      while (index < lines.length && !/^\s*```/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\s*(?:---|\*\*\*|___)\s*$/.test(line)) {
      blocks.push("<hr>");
      index += 1;
      continue;
    }

    const heading = line.match(/^\s*(#{1,6})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      blocks.push(`<h${level}>${renderInline(heading[2].trim())}</h${level}>`);
      index += 1;
      continue;
    }

    if (/^\s*>\s?/.test(line)) {
      const quoteLines = [];
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, ""));
        index += 1;
      }
      blocks.push(`<blockquote>${renderInline(quoteLines.join("\n")).replace(/\n/g, "<br>")}</blockquote>`);
      continue;
    }

    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*[-*+]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*[-*+]\s+/, "").trim());
        index += 1;
      }
      blocks.push(`<ul>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+[.)]\s+/.test(line)) {
      const items = [];
      while (index < lines.length && /^\s*\d+[.)]\s+/.test(lines[index])) {
        items.push(lines[index].replace(/^\s*\d+[.)]\s+/, "").trim());
        index += 1;
      }
      blocks.push(`<ol>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</ol>`);
      continue;
    }

    const paragraphLines = [];
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }
    blocks.push(renderParagraph(paragraphLines));
  }

  return blocks.join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const fileFlag = args.indexOf("--file");
  const input = fileFlag >= 0 ? readFileSync(args[fileFlag + 1], "utf8") : readFileSync(0, "utf8");
  process.stdout.write(`${markdownToChatwootHtml(input)}\n`);
}
