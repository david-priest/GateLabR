import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import test from "node:test";
import { retainedPngDataUrls, maskRetainedPngPayloads } from "./retained-png-data-urls.mjs";
import { addedFilePath } from "./git-diff-path.mjs";

const checker = fileURLToPath(new URL("./check-identifiers.mjs", import.meta.url));
const magicPattern = "iVBORw0KGgo";
const textPattern = "FixtureSensitive";

function chunk(type, bytes) {
  const name = Buffer.from(type);
  let crc = 0xffffffff;
  for (const byte of Buffer.concat([name, bytes])) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  const size = Buffer.alloc(4);
  size.writeUInt32BE(bytes.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
  return Buffer.concat([size, name, bytes, checksum]);
}

function image(pixel = 0, compressed = deflateSync(Buffer.from([0, pixel, 2, 3, 255])), headerType = "IHDR", extraChunks = []) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(1, 0);
  header.writeUInt32BE(1, 4);
  header[8] = 8;
  header[9] = 6;
  return `data:image/png;base64,${Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk(headerType, header), ...extraChunks, chunk("IDAT", compressed), chunk("IEND", Buffer.alloc(0)),
  ]).toString("base64")}`;
}

const png = image();
const stable = Array.from({ length: 40 }, (_, i) => `// synthetic stable line ${i}`).join("\n");
const content = (url = png, label = "before", extra = "") => `const image = "${url}"; const label = "${label}"; ${extra}\n${stable}\n`;

function fixture(before = content(), filename = "asset.js") {
  const cwd = mkdtempSync(join(tmpdir(), "gatelabr-identifiers-"));
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" });
  const write = (name, value) => writeFileSync(join(cwd, name), value);
  git("init", "-q");
  git("config", "user.name", "Synthetic Fixture");
  git("config", "user.email", "fixture@example.invalid");
  write("patterns.txt", `${magicPattern}\n${textPattern}\n`);
  write(filename, before);
  git("add", filename);
  git("commit", "-qm", "Synthetic baseline");
  const check = (...args) => spawnSync(process.execPath, [checker, ...args, "--require-list"], {
    cwd, encoding: "utf8", env: { ...process.env, IDENTIFIER_DENYLIST: join(cwd, "patterns.txt") },
  });
  return { cwd, git, write, check };
}

function expectCheck(f, expected, ...args) {
  const result = f.check(...args);
  assert.equal(result.status, expected, result.stderr || result.stdout);
  return result;
}

test("staged same-file rebuild retains an identical valid PNG", () => {
  const f = fixture();
  f.write("asset.js", content(png, "after"));
  f.git("add", "asset.js");
  expectCheck(f, 0, "--staged");
});

test("staged Git rename pair retains an identical valid PNG", () => {
  const f = fixture();
  f.git("mv", "asset.js", "renamed.js");
  f.write("renamed.js", content(png, "after"));
  f.git("add", "renamed.js");
  assert.match(f.git("diff", "--cached", "--name-status", "--find-renames"), /^R\d+\s+asset\.js\s+renamed\.js/m);
  expectCheck(f, 0, "--staged");
});

for (const [name, source, destination, quotePath] of [
  ["same-file spaces", "space name.js", "space name.js", true],
  ["rename destination spaces", "asset.js", "renamed file.js", true],
  ["same-file C-quoted UTF-8", "caf\u00e9.js", "caf\u00e9.js", true],
  ["rename C-quoted UTF-8", "asset.js", "caf\u00e9.js", true],
  ["same-file literal UTF-8", "caf\u00e9.js", "caf\u00e9.js", false],
  ["same-file C escapes", 'quote"tab\tback\\.js', 'quote"tab\tback\\.js', true],
]) {
  test(`retained PNG matches Git paths with ${name}`, () => {
    const f = fixture(content(), source);
    f.git("config", "core.quotePath", String(quotePath));
    if (source !== destination) f.git("mv", source, destination);
    f.write(destination, content(png, "after"));
    f.git("add", destination);
    expectCheck(f, 0, "--staged");
    f.write(destination, content(png, "after", `const note = '${textPattern}';`));
    f.git("add", destination);
    expectCheck(f, 1, "--staged");
  });
}

test("undecodable and malformed Git path fields cannot establish a file pair", () => {
  for (const header of ['"b/\\377.js"', '"b/\\q.js"', '"b/unclosed.js', "b/\uFFFD.js", "/dev/null"]) {
    assert.equal(addedFilePath(header), null, header);
  }
  assert.equal(addedFilePath("b/space name.js\t"), "space name.js");
  assert.equal(addedFilePath('"b/caf\\303\\251.js"\t'), "caf\u00e9.js");
});

test("changed PNG payload is still scanned", () => {
  const f = fixture();
  f.write("asset.js", content(image(1), "after"));
  f.git("add", "asset.js");
  expectCheck(f, 1, "--staged");
});

test("a new PNG is still scanned even if another file already holds it", () => {
  const f = fixture();
  f.write("new.js", content(png, "after"));
  f.git("add", "new.js");
  expectCheck(f, 1, "--staged");
});

test("new text surrounding a retained PNG is still scanned", () => {
  const f = fixture();
  f.write("asset.js", content(png, "after", `const note = "${textPattern}";`));
  f.git("add", "asset.js");
  const result = expectCheck(f, 1, "--staged");
  assert.match(result.stderr, /asset\.js:1/);
});

test("plain identifiers remain checked", () => {
  const f = fixture("const label = 'before';\n");
  f.write("asset.js", `const label = '${textPattern}';\n`);
  f.git("add", "asset.js");
  expectCheck(f, 1, "--staged");
});

test("retained malformed data URLs and invalid PNGs remain checked", () => {
  const bytes = Buffer.from(png.split(",")[1], "base64");
  bytes[bytes.length - 1] ^= 1;
  for (const invalid of [
    `${png}!`, `${png}=`, `data:image/png;base64,${magicPattern}`,
    `data:image/png;base64,${bytes.toString("base64")}`,
    image(0, Buffer.from("not a zlib stream")),
  ]) {
    const f = fixture(content(invalid));
    f.write("asset.js", content(invalid, "after"));
    f.git("add", "asset.js");
    expectCheck(f, 1, "--staged");
  }
});

test("CRC-correct invalid PNG chunk-name bytes remain checked", () => {
  for (const invalid of [
    image(0, undefined, Buffer.from([0xc9, 0x48, 0x44, 0x52])),
    image(0, undefined, "IHDR", [chunk("tExt", Buffer.from("key\0value"))]),
  ]) {
    const f = fixture(content(invalid));
    f.write("asset.js", content(invalid, "after"));
    f.git("add", "asset.js");
    expectCheck(f, 1, "--staged");
  }
});

test("unpaired deletion and addition do not establish retained content", () => {
  const f = fixture(content(png) + stable.repeat(10));
  f.git("mv", "asset.js", "unrelated.js");
  f.write("unrelated.js", `const image = "${png}";\n`);
  f.git("add", "unrelated.js");
  assert.doesNotMatch(f.git("diff", "--cached", "--name-status", "--find-renames"), /^R/m);
  expectCheck(f, 1, "--staged");
});

test("duplicating a retained PNG does not exempt the new occurrence", () => {
  const f = fixture();
  f.write("asset.js", content(png, "after", `const duplicate = '${png}';`));
  f.git("add", "asset.js");
  expectCheck(f, 1, "--staged");
});

test("staged content is compared with HEAD, independently of the working tree", () => {
  const f = fixture();
  f.write("asset.js", content(image(1), "after"));
  f.git("add", "asset.js");
  f.write("asset.js", content(png, "after"));
  expectCheck(f, 1, "--staged");
});

test("range checks keep scanning retained payloads", () => {
  const f = fixture();
  f.write("asset.js", content(png, "after"));
  f.git("add", "asset.js");
  f.git("commit", "-qm", "Synthetic rebuild");
  expectCheck(f, 1, "--range", "HEAD~1..HEAD");
  expectCheck(f, 1, "--staged", "--range", "HEAD~1..HEAD");
});

test("masking preserves URL metadata, quotes, surrounding text and line length", () => {
  const line = `before '${png}' after`;
  const masked = maskRetainedPngPayloads(line, retainedPngDataUrls(line, line));
  assert.equal(masked, `before 'data:image/png;base64,${" ".repeat(png.split(",")[1].length)}' after`);
  assert.equal(masked.length, line.length);
});
