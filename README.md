# JIHOON

A bilingual static portfolio focused on backend systems, security boundaries,
and AI-assisted development. English is the default. Korean pages live under
`ko/`, and every language switch retains the corresponding project or page.

## Development

Requires Node.js 24 or later. Production pages have no package dependencies.

```sh
npm ci
npm run build
npm run dev
```

The preview listens on `http://127.0.0.1:4173`. Build before starting the server
and after editing content. The server serves only `dist/` on localhost.

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

On this machine, the Homebrew Node executable currently has a missing library.
The verified bundled runtime can be selected without changing system settings:

```sh
export PATH="/Users/ijihun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js test
node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js run lint
node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js run typecheck
node /opt/homebrew/lib/node_modules/npm/bin/npm-cli.js run build
```

## Editing

- `content/site.mjs`: English and Korean interface copy.
- `content/projects.mjs`: Six project descriptions and case studies.
- `scripts/render.mjs`: Shared layouts and relative route generation.
- `style.css`: Responsive theme, keyboard focus, and reduced-motion behavior.
- `script.js`: Progressively enhanced navigation and copyright year.

The build writes complete HTML to the existing source routes and to `dist/`.
Edit the content and renderer rather than generated HTML. Existing `index.html`,
`projects/index.html`, and `contact/index.html` entry points remain available.
All content and language links work without JavaScript. Local file viewing also
uses relative links; use the HTTP preview for consistent security behavior.

## Content evidence

Case studies use project code, tests, and development checkpoints reviewed on
September 5, 2026. They distinguish recorded validation from production release.
AI assistance is disclosed. No employment history, user metrics, commercial
outcomes, or unrecorded personal experience is asserted.

- Placia: identity/session checkpoint at commit `159b25c`, transaction migration,
  and email-exchange concurrency regression tests.
- Whiskory: mobile stage 0 checkpoint dated September 5, 2026; route allowlist,
  deployment-environment validation, and HTTP boundary checks.
- Resol Routine: local completion and vocabulary synchronization documents;
  synchronization schema and account/parent-report integration tests.
- Quant Research: v10.66 research-repair archive, repair report, Linux test log,
  and mutation results. Recorded tests are not investment outcomes.
- PACK JOB: design V8.1 and the recorded first-person/item-handling decisions.
- Resol App — Math: recorded retirement and archive integrity checks.

Private source material, conversation exports, credentials, and internal project
documents are not included in the public build. `dist/` contains only rendered
pages, a stylesheet, a small script, a favicon, and static hosting headers.
