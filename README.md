# OTPKI Docs

This repository contains the documentation site for OTPKI. It is intended for documentation development, review, and publishing.

## Related Repositories

The main OTPKI product repository lives alongside this repo at `../otpki`.

- Code repository: `https://github.com/otpki`
- Documentation repository: `https://github.com/otpki-docs`

Use the product repo as the source of truth for:

- Product behavior and workflows
- Configuration details
- UI terminology and visuals
- Commands, setup steps, and environment assumptions

## Documentation Development

Install dependencies:

```bash
npm install
```

Start the local docs site:

```bash
npm run start
```

The local docs server defaults to `http://localhost:3001`.

Build the static site:

```bash
npm run build
```

Generate the pinned OpenAPI YAML without starting the site:

```bash
npm run openapi:generate
```

The docs build now generates OpenAPI from the pinned `external/otpki-protobuf` submodule automatically before `start` and `build`.

The current editable docs are labeled `0.0.2-dev`. The released `0.0.1` docs remain available as a frozen versioned snapshot.

## Versioning Workflow

Use `docs/` for the current editable documentation set.

When you are ready to release a new version:

1. Freeze the current docs and OpenAPI snapshot:

```bash
npm run freeze-version -- 0.0.2
```

This command:

- generates OpenAPI from the currently pinned `external/otpki-protobuf` revision
- snapshots it to `versioned_openapi/<version>/`
- creates the matching Docusaurus docs snapshot
- exits without modifying anything if the target version already exists

2. Commit the generated versioned content:

- `versioned_docs/version-0.0.2/`
- `versioned_sidebars/version-0.0.2-sidebars.json`
- `versioned_openapi/0.0.2/`
- `versions.json`

3. Update the current docs label in `docusaurus.config.ts` for the next development cycle. For example:

- from `0.0.2-dev`
- to `0.0.3-dev`

This keeps the released version frozen while the current docs continue to move forward.

To delete an old frozen version later, run:

```bash
npm run remove-version -- 0.0.1
```

This command removes:

- `versioned_docs/version-0.0.1/`
- `versioned_sidebars/version-0.0.1-sidebars.json`
- `versioned_openapi/0.0.1/`
- the `0.0.1` entry from `versions.json`

If the target version does not exist, `remove-version` exits without modifying anything.

## Submodules

Initialize the proto submodule after cloning:

```bash
git submodule update --init --recursive
```

## Important Paths

- `docs/`: primary documentation content
- `sidebars.ts`: sidebar structure
- `docusaurus.config.ts`: site configuration
- `external/otpki-protobuf/`: pinned proto source used for generated API specs
- `static/openapi/`: generated OpenAPI YAML published with the docs site
- `buf.gen.openapi.yaml`: local Buf template for OpenAPI generation
- `scripts/generate-openapi.mjs`: local OpenAPI generation entrypoint
- `src/`: homepage and theme-level components
- `static/`: images and static assets

## Working Notes

- Keep documentation aligned with the current OTPKI implementation in `https://github.com/otpki/otpki`
- Prefer product terminology already used in the UI and API
- When documenting setup or operational flows, verify details against the OTPKI server before publishing
