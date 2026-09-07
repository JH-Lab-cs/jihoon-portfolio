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
- `content/products.mjs`: Product-first introductions and three-step user journeys
  for the six projects; used in both listings and project-detail introductions.
- `content/walkthroughs.mjs`: Four engineering execution sequences, invariants,
  scenario tables, and verification scope statements for the main case studies.
- `content/evidence.mjs`: Source and test references for the four main cases.
  These are review notes, not links to the private implementation repositories.
- `content/media.mjs`: Reviewed screenshots, bilingual captions, and the explicit
  asset list used by the build and route checks.
- `content/engineering.mjs`: Six technical focus areas and nine additional
  implementation notes linked to the corresponding case studies.
- `scripts/render.mjs`: Shared layouts and relative route generation.
- `style.css`: Responsive theme, keyboard focus, and reduced-motion behavior.
- `script.js`: Progressively enhanced navigation and copyright year.

The build writes complete HTML to the existing source routes and to `dist/`.
Edit the content and renderer rather than generated HTML. Existing `index.html`,
`projects/index.html`, and `contact/index.html` entry points remain available.
All content and language links work without JavaScript. Local file viewing also
uses relative links; use the HTTP preview for consistent security behavior.

Project lists explain the product and its user-facing features. Detail pages start
with the product experience, followed by the main engineering case, processing
sequence, failure scenarios, verification, and related implementation notes.
Product design, archived prototypes, local verification, and release status are
identified separately in the content.

## Publishing and future updates

The public portfolio is hosted at
<https://jh-lab-cs.github.io/jihoon-portfolio/>. English is the default; Korean is
available at <https://jh-lab-cs.github.io/jihoon-portfolio/ko/>.

The `Verify and deploy portfolio` GitHub Actions workflow tests, lints, checks
types, and builds changes to `main` before deploying only the contents of `dist/`.
Pull requests run the same checks without publishing. The repository's Pages
publishing source must be set to **GitHub Actions**. Actions use pinned commits,
and deployment permissions are limited to the deployment job.

To update a project's completion status, edit both languages in
`content/projects.mjs` and keep its product description, implementation status,
and recorded verification in agreement. For a new project, add the matching slug
to `content/projects.mjs` and `content/products.mjs`; add engineering notes and
walkthroughs when evidence is available. The build generates its routes and
language links. Update the collection tests when the intended project set changes.
Run the checks above, then commit and push to `main` to publish the update.

The GitHub build uses a deployment prefix so 404 navigation and assets remain
inside this repository's site, even at an unknown nested URL:

```sh
SITE_BASE_PATH=/jihoon-portfolio/ npm run build
```

Without `SITE_BASE_PATH`, builds target `/` for the local server and Sites.
Generated source HTML retains this root configuration; only `dist/` receives
the deployment prefix. Pages serves the root English 404 for unknown routes;
its Korean language link remains available. GitHub Pages does not interpret
`_headers`; the HTML meta CSP and referrer policy remain present, while the
additional HTTP response headers are provided by the local server and compatible
hosts. The source repository is public; only website assets enter the Pages build.

## Product evidence

The portfolio uses one design at `/` and `/ko/`. Project-detail pages show
reviewed app screenshots after the product introduction and before the technical
case. A header link and page navigation lead directly to the gallery when images
are available. Captions explain the capture context, and each image opens at its
original resolution. Both languages share the same media and source references.

Three original screenshots were inspected and copied without alteration:

- `assets/screens/placia-atlas.webp` and `placia-capsules.webp`: real iOS simulator
  captures from Placia's screenshot fixtures, using fixed Tokyo, Jeju, and Taipei
  sample data. Provenance: the Placia release screenshot README and
  `Placia/App/StoreScreenshotFixture.swift`; the originals are the English WebP
  exports used by its product site. They show an in-development app, not a release.
- `assets/screens/whiskory-collection.png`: signed-out local web capture from the
  September 5, 2026 verification. The empty collection and development badge are
  retained. It contains no private collection or account information.

No authentic Resol Routine UI capture or suitable public demo recording was found
in the reviewed artifacts. Illustrative marketing dashboards were not substituted
for app evidence. The additional source references were reviewed September 7, 2026;
historical test results retain their original environment and checkpoint scope.

## Content evidence

Case studies use project code, tests, and development checkpoints reviewed on
September 5–6, 2026. They distinguish recorded validation from production release.
AI assistance is disclosed. No employment history, user metrics, commercial
outcomes, or unrecorded personal experience is asserted.

- Placia: identity/session checkpoint at commit `159b25c`, transaction migration,
  email-exchange concurrency regression tests, and the September 6 device-recovery
  checkpoint. Additional notes cover refresh-token replay, authenticated encrypted
  retries, and recovery-root succession. The newer checkpoint records 241 unit/HTTP
  tests and 113 PostgreSQL tests for the full backend suite.
- Whiskory: mobile stage 0 checkpoint dated September 5, 2026; route allowlist,
  deployment-environment validation, and HTTP boundary checks. Additional evidence
  comes from recommendation quota transactions and their recorded staging checks,
  canonical visibility validation in moderation transactions, and malformed-name
  recovery tests for existing moderation records.
- Resol Routine: local completion and vocabulary synchronization documents;
  synchronization schema and account/parent-report integration tests. Event keys
  are scoped to student, device, and idempotency key. Related notes cover aggregation
  after commit, relationship-plus-entitlement authorization, and account deletion.
- Quant Research: v10.66 research-repair archive, repair report, Linux test log,
  and mutation results. Recorded tests are not investment outcomes.
- PACK JOB: design V8.1 and the recorded first-person/item-handling decisions.
- Resol App — Math: recorded retirement and archive integrity checks.
  Its reuse catalog preserves six feature collections, dependency maps, tests,
  source hashes, and remaining Flutter dependencies. The archived snapshot records
  25 passing tests and an analyzer exit code of 1 with 91 informational findings.
  A Dart import-boundary CLI elsewhere in the archive includes usage examples
  and self-tests. Cross-project adoption has not been established.

The contact email is defined once in `content/site.mjs` as `dev.wlgns@gmail.com`.

Private source material, conversation exports, credentials, and internal project
documents are not included in the public build. `dist/` contains only rendered
pages, a stylesheet, a small script, a favicon, and static hosting headers.
