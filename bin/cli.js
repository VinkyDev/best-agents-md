#!/usr/bin/env node

import { readFileSync, statSync, writeFileSync } from "node:fs";

const FILE = "AGENTS.md";
const START = "<!-- best-agents-md:start -->";
const END = "<!-- best-agents-md:end -->";
const MARKER = new RegExp(`^(?:${START}|${END})$`, "gm");

const HELP = `Usage:
  npx best-agents-md

Add or update the English coding standard in AGENTS.md.

Options:
  -h, --help       Show this help message
  -v, --version    Show version
`;

function splice(text, from, to, insert) {
  return text.slice(0, from) + insert + text.slice(to);
}

function merge(existing, standard) {
  const newline = existing.match(/\r?\n/)?.[0] ?? "\n";
  const content = standard.replaceAll("\n", newline);
  const block = [START, "", content, "", END].join(newline);

  const markers = [...existing.matchAll(MARKER)];
  if (markers.length > 0) {
    const [start, end] = markers;
    if (markers.length !== 2 || start[0] !== START || end[0] !== END) {
      throw new Error("Malformed best-agents-md markers. Expected one start marker followed by one end marker.");
    }
    return { next: splice(existing, start.index, end.index + END.length, block), updated: true };
  }

  const copy = existing.indexOf(content);
  const copyEnd = copy + content.length;
  const isWholeLines =
    (copy === 0 || existing[copy - 1] === "\n") &&
    (copyEnd === existing.length || existing.startsWith(newline, copyEnd));
  if (copy >= 0 && isWholeLines) {
    return { next: splice(existing, copy, copyEnd, block), updated: false };
  }

  let gap = newline + newline;
  if (!existing || existing.endsWith(gap)) gap = "";
  else if (existing.endsWith(newline)) gap = newline;
  return { next: existing + gap + block + newline, updated: false };
}

function main([option, ...rest]) {
  if (rest.length === 0 && (option === "-h" || option === "--help")) {
    return HELP;
  }
  if (rest.length === 0 && (option === "-v" || option === "--version")) {
    return `${JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")).version}\n`;
  }
  if (option !== undefined) {
    throw new Error(`Unknown option: ${[option, ...rest].join(" ")}. Run with --help to see usage.`);
  }

  const file = statSync(FILE, { throwIfNoEntry: false });
  if (file && !file.isFile()) {
    throw new Error(`${FILE} must be a regular file.`);
  }

  const decoder = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });
  const existing = file ? decoder.decode(readFileSync(FILE)) : "";
  const bom = existing.startsWith("\uFEFF") ? "\uFEFF" : "";
  const standard = readFileSync(new URL(`../${FILE}`, import.meta.url), "utf8").replaceAll("\r\n", "\n").trimEnd();
  const { next, updated } = merge(existing.slice(bom.length), standard);
  if (bom + next === existing) {
    return `${FILE} is already up to date.\n`;
  }

  writeFileSync(FILE, bom + next);
  if (!file) return `Created ${FILE}.\n`;
  return updated ? `Updated ${FILE}.\n` : `Added best-agents-md to ${FILE}.\n`;
}

try {
  process.stdout.write(main(process.argv.slice(2)));
} catch (error) {
  process.stderr.write(`Error: ${error.message}\n`);
  process.exitCode = 1;
}
