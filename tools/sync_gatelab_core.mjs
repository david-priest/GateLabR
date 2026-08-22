#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");

function usage() {
  process.stdout.write(
    [
      "Usage: node tools/sync_gatelab_core.mjs [options]",
      "",
      "Options:",
      "  --source PATH            GateLab source checkout (default: ../GateLab)",
      "  --source-commit SHA      Require this exact GateLab commit",
      "  --skip-build             Use an existing dist-embed after validating source",
      "  --help                   Show this help",
      "",
      "The source checkout must be clean. Unless --skip-build is supplied, the",
      "script runs GateLab's complete test suite and embeddable production build.",
      "The existing GateLabR bundle is moved to a recoverable temporary backup.",
      "",
    ].join("\n"),
  );
}

function parseArgs(argv) {
  const result = {
    source: resolve(repoRoot, "..", "GateLab"),
    sourceCommit: null,
    skipBuild: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help") {
      usage();
      process.exit(0);
    }
    if (argument === "--skip-build") {
      result.skipBuild = true;
      continue;
    }
    if (argument === "--source" || argument === "--source-commit") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value.`);
      index += 1;
      if (argument === "--source") result.source = resolve(value);
      else result.sourceCommit = value;
      continue;
    }
    throw new Error(`Unknown option '${argument}'. Use --help for usage.`);
  }
  return result;
}

function run(command, args, cwd, capture = false) {
  const output = execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });
  return typeof output === "string" ? output.trim() : "";
}

function readContractVersion(sourceRoot, relativePath, constantName) {
  const source = readFileSync(join(sourceRoot, relativePath), "utf8");
  const match = source.match(
    new RegExp(`${constantName}\\s*=\\s*(\\d+)\\s+as\\s+const`),
  );
  if (!match) {
    throw new Error(`Could not read ${constantName} from ${relativePath}.`);
  }
  return Number(match[1]);
}

function normalizedRepository(remoteUrl) {
  const github = remoteUrl.match(
    /github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?$/,
  );
  return github ? `${github[1]}/${github[2]}` : remoteUrl;
}

function artifactFiles(root, current = root) {
  return readdirSync(current, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(current, entry.name);
      if (entry.isDirectory()) return artifactFiles(root, path);
      if (!entry.isFile() || entry.name === "CORE_PROVENANCE.json") return [];
      return [relative(root, path).split(sep).join("/")];
    })
    .sort();
}

function md5(path) {
  return createHash("md5").update(readFileSync(path)).digest("hex");
}

function validateBuild(buildDir) {
  for (const required of [
    "gatelab-embed.js",
    "gatelab-embed.css",
    "manifest.json",
  ]) {
    const path = join(buildDir, required);
    if (!existsSync(path) || !statSync(path).isFile()) {
      throw new Error(`GateLab embed build is missing ${required}.`);
    }
  }
}

const options = parseArgs(process.argv.slice(2));
if (!existsSync(join(options.source, "package.json"))) {
  throw new Error(`GateLab source checkout not found at ${options.source}.`);
}

const dirty = run(
  "git",
  ["status", "--porcelain", "--untracked-files=no"],
  options.source,
  true,
);
if (dirty.length > 0) {
  throw new Error(
    "GateLab source has tracked modifications. Commit or restore them before syncing.",
  );
}
const sourceCommit = run("git", ["rev-parse", "HEAD"], options.source, true);
if (
  options.sourceCommit &&
  sourceCommit !== run(
    "git",
    ["rev-parse", options.sourceCommit],
    options.source,
    true,
  )
) {
  throw new Error(
    `GateLab source is ${sourceCommit}, not requested commit ${options.sourceCommit}.`,
  );
}

if (!options.skipBuild) {
  run("npm", ["test"], options.source);
  run("npm", ["run", "build:embed"], options.source);
}
const buildDir = join(options.source, "dist-embed");
validateBuild(buildDir);

const staging = join(repoRoot, "inst", `.react-app-sync-${process.pid}`);
if (existsSync(staging)) {
  throw new Error(
    `Sync staging path already exists: ${staging}. Move it aside and retry.`,
  );
}
mkdirSync(dirname(staging), { recursive: true });

// Vite copies everything in GateLab's publicDir into the build verbatim, and that directory is
// LOCAL DEV DATA: GateLab gitignores it as "local dev sample data (not committed)". The previous
// sync therefore carried real FCS files and a Gating-ML export of the lab's own panel into this
// repository, which is public. The .fcs never reached git (a *.FCS ignore rule caught them), so
// CORE_PROVENANCE.json listed two files nobody else could ever have — making the manifest
// unverifiable on any other clone.
//
// Excluded on the path RELATIVE to the build root, not on basename, so nested build output such
// as assets/compensation.worker-*.js — which the bundle genuinely loads — is untouched.
const publicDir = join(options.source, "public");
const passthrough = existsSync(publicDir)
  ? new Set(
      readdirSync(publicDir, { withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name),
    )
  : new Set();
const excluded = [];
cpSync(buildDir, staging, {
  recursive: true,
  errorOnExist: true,
  force: false,
  filter: (src) => {
    const rel = relative(buildDir, src).split(sep).join("/");
    if (!passthrough.has(rel)) return true;
    excluded.push(rel);
    return false;
  },
});
if (excluded.length > 0) {
  console.log(
    `Excluded ${excluded.length} publicDir passthrough file(s) from the bundle: ${excluded.join(", ")}`,
  );
}

const files = Object.fromEntries(
  artifactFiles(staging).map((file) => [file, md5(join(staging, file))]),
);
const provenance = {
  schemaVersion: 1,
  sourceRepository: normalizedRepository(
    run("git", ["remote", "get-url", "origin"], options.source, true),
  ),
  sourceCommit,
  buildCommand: "npm run build:embed",
  hostContractVersion: readContractVersion(
    options.source,
    "src/host/contracts.ts",
    "GATELAB_HOST_CONTRACT_VERSION",
  ),
  datasetContractVersion: readContractVersion(
    options.source,
    "src/host/datasetContract.ts",
    "GATELAB_DATASET_CONTRACT_VERSION",
  ),
  workspaceContractVersion: readContractVersion(
    options.source,
    "src/host/workspaceContract.ts",
    "GATELAB_HOST_WORKSPACE_CONTRACT_VERSION",
  ),
  colDataContractVersion: readContractVersion(
    options.source,
    "src/host/colDataContract.ts",
    "GATELAB_HOST_COLDATA_CONTRACT_VERSION",
  ),
  compensationContractVersion: readContractVersion(
    options.source,
    "src/host/compensationContract.ts",
    "GATELAB_HOST_COMPENSATION_CONTRACT_VERSION",
  ),
  files,
};
writeFileSync(
  join(staging, "CORE_PROVENANCE.json"),
  `${JSON.stringify(provenance, null, 2)}\n`,
  "utf8",
);

const target = join(repoRoot, "inst", "react-app");
const backup = join(
  tmpdir(),
  `GateLabR-react-app-${sourceCommit.slice(0, 12)}-${Date.now()}`,
);
let movedExisting = false;
if (existsSync(target)) {
  renameSync(target, backup);
  movedExisting = true;
}
try {
  renameSync(staging, target);
} catch (cause) {
  if (movedExisting && !existsSync(target)) renameSync(backup, target);
  throw cause;
}

process.stdout.write(
  [
    `Synced GateLab ${sourceCommit} into ${target}.`,
    `Artifacts: ${Object.keys(files).length}`,
    movedExisting
      ? `Previous bundle: ${backup}`
      : "No previous bundle was present.",
    "",
  ].join("\n"),
);
