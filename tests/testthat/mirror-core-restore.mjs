// Restore GateLabR workspace envelopes through the embedded GateLab core, as the app does when it
// opens an SCE: loadHostedDataset, readHostedWorkspace, then convertHostedGateSpace against the
// first sample. Prints, as JSON, the gates the core would gate with, or the error it stopped on.
// Usage: node mirror-core-restore.mjs <gatelab-embed.js> <fixture dir> <envelope file>...
// The fixture directory holds dataset.json and, per sample, <sampleId>-counts.bin and
// <sampleId>-index.bin, as GateLabR's host serves them (test-mirror-core.R writes it).
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const [bundle, dir, ...envelopes] = process.argv.slice(2);
const core = await import(pathToFileURL(bundle).href);
const bytes = (file) => {
  const buffer = readFileSync(join(dir, file));
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
};
const dataset = JSON.parse(readFileSync(join(dir, "dataset.json"), "utf8"));
const port = {
  async listDatasets() { return [dataset]; },
  async readAssay(_datasetId, sampleId) { return bytes(`${sampleId}-counts.bin`); },
  async readEventIndex(_datasetId, sampleId) { return bytes(`${sampleId}-index.bin`); },
};
const entries = await core.loadHostedDataset(port, dataset);
const samples = entries.map((entry) => entry.sample);
const out = {};
for (const file of envelopes) {
  const envelope = JSON.parse(readFileSync(join(dir, file), "utf8"));
  try {
    const restored = await core.readHostedWorkspace(envelope, dataset, samples);
    const workspace = core.convertHostedGateSpace(
      restored.workspace,
      samples[0],
      restored.sourceGateSpace,
    );
    out[file] = {
      gatingSpace: samples[0].gatingSpace,
      sourceGateSpace: restored.sourceGateSpace,
      gates: workspace.gating.gates,
    };
  } catch (error) {
    out[file] = { error: String(error?.message ?? error) };
  }
}
process.stdout.write(JSON.stringify(out));
