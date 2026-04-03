import {cpSync, existsSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

const version = process.argv[2]?.trim();

if (!version) {
  console.error('Usage: npm run freeze-version -- <version>');
  process.exit(1);
}

const versionedDocsDir = resolve(repoRoot, 'versioned_docs', `version-${version}`);
const versionedOpenApiDir = resolve(repoRoot, 'versioned_openapi', version);
const currentOpenApiDir = resolve(repoRoot, 'static', 'openapi', 'current');

if (existsSync(versionedDocsDir) || existsSync(versionedOpenApiDir)) {
  console.error(
    `Version ${version} already exists in versioned docs or versioned OpenAPI assets.`,
  );
  process.exit(1);
}

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

run('npm', ['run', 'openapi:generate']);

if (!existsSync(currentOpenApiDir)) {
  console.error(
    `Expected generated OpenAPI specs at ${currentOpenApiDir}, but they were not found.`,
  );
  process.exit(1);
}

mkdirSync(versionedOpenApiDir, {recursive: true});
cpSync(currentOpenApiDir, versionedOpenApiDir, {recursive: true});

run('npx', ['docusaurus', 'docs:version', version]);
