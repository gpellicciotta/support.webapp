# DevOps
Development environment, checks, design system upgrades, and releases of {{app-title}}.

---

## Development Environment
### Prerequisites
- Git.
- Python 3.15 or later, to install the tools below.
- Node.js 22.13 or later, with npm.
- The [plan](https://github.com/gpellicciotta/plan) CLI, for tasks.
- [support.python](https://github.com/gpellicciotta/support.python) v3.1.0, installed by the bootstrap script.

### Setup
Create the repository and the plan store once, then bootstrap the checkout:

```bash
git init
plan init
python scripts/bootstrap-dev-environment.py
```

The script creates `.venv`, installs the Python tools and npm packages, installs Chromium, and runs all checks.
The first run writes `package-lock.json`; commit it, since CI installs with `npm ci`.
Linux hosts also need `npx playwright install --with-deps chromium` for browser system libraries.

Run fast tests, browser tests, all checks, or the local server:

```bash
python scripts/devops.py tests
python scripts/devops.py tests --slow
python scripts/devops.py check
python scripts/devops.py serve --port 4173
```

- `tests` runs Vitest: the token test and the precache test.
- `tests --slow` runs the Playwright smoke test at 390 and 1440 px, in light and dark themes.
- `check` runs Markdown lint, Ruff, ESLint, the design conformance check, and both test suites.
- The server binds to localhost and serves `src/`; no build step exists.
- The [visual style gallery](../src/demo/visual-style-gallery.html) shows the app's local components.

---

## Design System
The app vendors support.webapp v{{design-version}} with the `{{look}}` look into `src/vendor/design/`.
[design.json](../design.json) pins the version, the look, the target folder, and the app's style folders.
Check the vendored copy and the app styles:

```bash
npm run check:design
```

Upgrade to a newer release from the app root, then compare screenshots and bump `VERSION` in the service worker:

```bash
npx @gpellicciotta/support.webapp@\{{version}} vendor --look {{look}} --to src/vendor/design
```

Installing from GitHub Packages needs a token with `read:packages` in the user `.npmrc`.

---

## Versioning and Releasing
### Updating Versions
- [package.json](../package.json) owns the version, which must match the top heading in [CHANGELOG.md](../CHANGELOG.md).
- Run `python scripts/devops.py versions` to check agreement.
- Bump `VERSION` in [service-worker.js](../src/service-worker.js) with every change to a precached file.

### Making a Release
Release from a clean, up-to-date `main`; preview first, then release:

```bash
python scripts/devops.py release --dry-run
python scripts/devops.py release --yes
```

The support.python release pipeline runs all checks, freezes the version, tags, and publishes a GitHub release.

---

## Task Coordination Protocol
Tasks are managed only through the `plan` CLI:
1. Create: `plan tasks create "\{{description}}"`.
2. Start: `plan tasks start \{{task-id}} --owner @\{{agent}}`.
3. Finalize: pass all checks, update `CHANGELOG.md`, then run `plan tasks stop \{{task-id}} --status completed`.
