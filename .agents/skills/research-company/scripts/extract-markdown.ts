#!/usr/bin/env tsx

/**
 * Extracts readable content from an HTML file and converts it to clean markdown.
 * Uses Mozilla's Readability for content extraction and Turndown for HTML→Markdown.
 *
 * Usage: tsx extract-markdown.ts <input.html> <output.md> [--url=<source-url>]
 */

import { readFileSync, writeFileSync } from "fs";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import TurndownService from "turndown";

const [inputPath, outputPath, ...flags] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: tsx extract-markdown.ts <input.html> <output.md> [--url=<source-url>]");
  process.exit(1);
}

const url =
  flags.find((f) => f.startsWith("--url="))?.split("=").slice(1).join("=") || "https://example.com";

const html = readFileSync(inputPath, "utf-8");
const dom = new JSDOM(html, { url });
const article = new Readability(dom.window.document).parse();

if (!article) {
  console.error("Readability could not extract content from:", inputPath);
  process.exit(1);
}

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

turndown.remove(["script", "style", "nav", "footer", "iframe"]);

const markdown = [
  `# ${article.title}`,
  "",
  `> Source: ${url}`,
  `> Extracted: ${new Date().toISOString().split("T")[0]}`,
  "",
  "---",
  "",
  turndown.turndown(article.content),
].join("\n");

writeFileSync(outputPath, markdown, "utf-8");
console.log(`✔ Extracted: ${article.title} → ${outputPath}`);
