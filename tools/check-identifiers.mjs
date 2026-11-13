#!/usr/bin/env node
// check-identifiers.mjs — refuse to add a line naming an unpublished experiment.
//
// This repository IS the public one -- `origin` here is david-priest/GateLabR, so a push publishes
// immediately, with no release step in between to catch anything. The leak has never been a memory
// failure: fixtures
// and code comments get written from whatever workspace is in front of whoever is writing them,
// and the only realistic data to hand is unpublished. A rule against it only works if someone
// notices while typing, which is the step that fails. So the check is mechanical.
//
// It reads ADDED lines only. Terms that are already public sit in older files and would otherwise
// fire on every commit; the question is always "does this change publish something new".
//
// The pattern list is NOT in this repository. A file naming the sensitive strings is itself a
// disclosure, so it lives outside every repo -- see IDENTIFIER_DENYLIST below.
//
//   node tools/check-identifiers.mjs --staged          # what a commit is about to add
//   node tools/check-identifiers.mjs --range origin/main..HEAD   # what a push is about to publish
//
// `--require-list` turns a missing pattern file into a failure rather than a warning. The hook
// warns, so a fresh clone is not bricked; the release gate requires it, because "the list was
// missing" is not an acceptable reason to have published something.

import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { retainedPngDataUrls, maskRetainedPngPayloads } from "./retained-png-data-urls.mjs";
import { addedFilePath } from "./git-diff-path.mjs";

const LIST = process.env.IDENTIFIER_DENYLIST ?? join(homedir(), ".claude", "private-identifiers.txt");

const args = process.argv.slice(2);
const requireList = args.includes("--require-list");
const rangeIdx = args.indexOf("--range");
const range = rangeIdx === -1 ? null : args[rangeIdx + 1];

if (!existsSync(LIST)) {
  const message = `check-identifiers: no pattern list at ${LIST}`;
  if (requireList) {
    console.error(`${message}\nRefusing to certify this diff without it.`);
    process.exit(2);
  }
  console.error(`${message} — skipping the check. Restore it from the private harness repo.`);
  process.exit(0);
}

const patterns = readFileSync(LIST, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line.length > 0 && !line.startsWith("#"))
  .map((source) => ({ source, re: new RegExp(source, "i") }));

if (patterns.length === 0) {
  console.error(`check-identifiers: ${LIST} defines no patterns.`);
  process.exit(requireList ? 2 : 0);
}

const diffArgs = range
  ? ["diff", "-U0", "--no-color", range]
  : ["diff", "-U0", "--no-color", "--cached", "--find-renames"];
const diff = execFileSync("git", diffArgs, { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });

// Staged checks may retain PNG bytes only from the same file or Git's rename pair.
// Range checks deliberately keep scanning every added byte.
const retainedByFile = new Map();
if (!range && args.includes("--staged")) {
  const records = execFileSync("git", ["diff", "--cached", "--raw", "-z", "--no-abbrev", "--find-renames"], { encoding: "utf8" }).split("\0");
  for (let i = 0; i < records.length - 1;) {
    const [oldMode, newMode, oldBlob, newBlob, status] = records[i++].slice(1).split(" ");
    const previous = records[i++];
    const file = /^[RC]/.test(status) ? records[i++] : previous;
    if (!["100644", "100755"].includes(oldMode) || !["100644", "100755"].includes(newMode)) continue;
    if (!file.includes("\uFFFD") && (status === "M" || /^R\d+$/.test(status))) retainedByFile.set(file, { oldBlob, newBlob });
  }
}

function scanText(file, added) {
  const pair = retainedByFile.get(file);
  if (!pair || !added.includes("data:image/png;base64,")) return added;
  if (!pair.urls) {
    const blob = (id) => execFileSync("git", ["cat-file", "blob", id], { encoding: "utf8", maxBuffer: 512 * 1024 * 1024 });
    pair.urls = retainedPngDataUrls(blob(pair.oldBlob), blob(pair.newBlob));
  }
  return maskRetainedPngPayloads(added, pair.urls);
}

// Walk the unified diff so a hit can name the file and line it would land on.
const hits = [];
let file = null;
let displayFile = null;
let line = 0;
for (const text of diff.split("\n")) {
  if (text.startsWith("+++ ")) {
    file = addedFilePath(text.slice(4));
    displayFile = file ?? text.slice(4);
    continue;
  }
  if (text.startsWith("@@")) {
    const match = /\+(\d+)/.exec(text);
    line = match ? Number(match[1]) : 0;
    continue;
  }
  if (!text.startsWith("+") || text.startsWith("+++")) continue;
  const added = text.slice(1);
  const scanned = scanText(file, added);
  for (const { source, re } of patterns) {
    if (re.test(scanned)) {
      hits.push({ file: displayFile, line, source, excerpt: added.trim().slice(0, 110) });
      break;
    }
  }
  line += 1;
}

if (hits.length === 0) process.exit(0);

console.error(`\ncheck-identifiers: ${hits.length} added line(s) name an unpublished experiment.\n`);
for (const hit of hits.slice(0, 40)) {
  console.error(`  ${hit.file}:${hit.line}  [${hit.source}]`);
  console.error(`    ${hit.excerpt}`);
}
if (hits.length > 40) console.error(`  … and ${hits.length - 40} more.`);
console.error(`
Use synthetic values instead: donors D1/D2/D3, treated/control, batches B1/B2, CD4_positive.
A fixture does not need to be real to be realistic, and this repository is released publicly.

If a match is genuinely fine, commit with --no-verify and say why in the message.
`);
process.exit(1);
