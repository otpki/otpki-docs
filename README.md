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

Build the static site:

```bash
npm run build
```

Local UI base URL for linked API reference:

```bash
OTPKI_UI_BASE_URL=https://localhost:5173/ui
```

## Important Paths

- `docs/`: primary documentation content
- `sidebars.ts`: sidebar structure
- `docusaurus.config.ts`: site configuration
- `src/`: homepage and theme-level components
- `static/`: images and static assets

## Working Notes

- Keep documentation aligned with the current OTPKI implementation in `../otpki`
- Prefer product terminology already used in the UI and API
- When documenting setup or operational flows, verify details against the sibling repo before publishing
