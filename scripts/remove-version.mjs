import {existsSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, '..');

const version = process.argv[2]?.trim();

if (!version) {
  console.error('Usage: npm run remove-version -- <version>');
  process.exit(1);
}

const versionsFile = resolve(repoRoot, 'versions.json');
const versionedDocsDir = resolve(repoRoot, 'versioned_docs', `version-${version}`);
const versionedSidebarsFile = resolve(
  repoRoot,
  'versioned_sidebars',
  `version-${version}-sidebars.json`,
);
const versionedOpenApiDir = resolve(repoRoot, 'versioned_openapi', version);

if (!existsSync(versionsFile)) {
  console.error(`Missing ${versionsFile}.`);
  process.exit(1);
}

const versions = JSON.parse(readFileSync(versionsFile, 'utf8'));

if (!Array.isArray(versions) || !versions.includes(version)) {
  console.error(`Version ${version} does not exist in versions.json.`);
  process.exit(1);
}

rmSync(versionedDocsDir, {force: true, recursive: true});
rmSync(versionedSidebarsFile, {force: true});
rmSync(versionedOpenApiDir, {force: true, recursive: true});

writeFileSync(
  versionsFile,
  `${JSON.stringify(versions.filter((entry) => entry !== version), null, 2)}\n`,
);
