import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');
const protobufRoot = resolve(repoRoot, 'external/otpki-protobuf');
const outputDir = resolve(repoRoot, 'static/openapi');
const versionedOpenApiRoot = resolve(repoRoot, 'versioned_openapi');
const currentOutputDir = resolve(outputDir, 'current');
const generatedCurrentRoot = resolve(currentOutputDir, 'otpki/public');

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    ...options,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

if (!existsSync(protobufRoot)) {
  console.error('Missing external/otpki-protobuf submodule. Run `git submodule update --init --recursive` first.');
  process.exit(1);
}

rmSync(outputDir, { force: true, recursive: true });
mkdirSync(outputDir, { recursive: true });
run('buf', ['generate', '--template', 'buf.gen.openapi.yaml']);

if (!existsSync(generatedCurrentRoot)) {
  console.error(`Expected generated OpenAPI specs at ${generatedCurrentRoot}, but they were not found.`);
  process.exit(1);
}

for (const entry of readdirSync(generatedCurrentRoot, {withFileTypes: true})) {
  cpSync(
    resolve(generatedCurrentRoot, entry.name),
    resolve(currentOutputDir, entry.name),
    {recursive: true},
  );
}

rmSync(resolve(currentOutputDir, 'otpki'), {force: true, recursive: true});

if (existsSync(versionedOpenApiRoot)) {
  for (const entry of readdirSync(versionedOpenApiRoot, {withFileTypes: true})) {
    if (!entry.isDirectory()) {
      continue;
    }
    cpSync(
      resolve(versionedOpenApiRoot, entry.name),
      resolve(outputDir, entry.name),
      {recursive: true},
    );
  }
}
