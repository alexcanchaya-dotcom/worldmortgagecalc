import { spawnSync } from "node:child_process";

const major = Number(process.versions.node.split(".")[0]);
if (major < 22) {
  console.log(`Skipping TypeScript unit tests on Node ${process.version} (needs 22+ type stripping).`);
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  [
    "--experimental-strip-types",
    "--test",
    "lib/mortgage.test.ts",
    "lib/countryPresets.test.ts",
    "lib/site.test.ts",
  ],
  { stdio: "inherit" },
);

process.exit(result.status ?? 1);
