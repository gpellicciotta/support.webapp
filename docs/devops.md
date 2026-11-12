# DevOps
Development environment, versioning, planning workflow, and operational procedures for `support.webapp`.

---

## Development Environment
### Prerequisites
- Git, with access to the `gpellicciotta/support.webapp` GitHub repository.
- Python 3.15 or later, to install the tools below.
- Node.js 22.13 or later, with npm.
- The [plan](https://github.com/gpellicciotta/plan) CLI, for tasks and the plan store.
- [support.python](https://github.com/gpellicciotta/support.python) v3.1.0, installed by the bootstrap script.

### Setup
Bootstrap the checkout:

```bash
python scripts/bootstrap-dev-environment.py
```

The script creates `.venv`, installs Python tools, runs `npm ci`, installs Chromium, and runs all checks.
Linux hosts also need `npx playwright install --with-deps chromium` for browser system libraries.
The support.python pin lives in [requirements.txt](../scripts/requirements.txt); npm versions live in [package.json](../package.json).
The devops runner automatically uses `.venv` when present.

Run fast tests, all checks, or the local server:

```bash
python scripts/devops.py tests
python scripts/devops.py check
python scripts/devops.py serve --port 4173
```

`tests` runs pytest and Vitest; `test --slow` runs Playwright in desktop/mobile viewports and light/dark modes.
Without a selection, `test --slow` also runs the pack-and-vendor integration test, `npm run test:integration`.
`check` runs Markdown lint, Ruff, ESLint, the unit, browser, and integration tests, and `npm pack --dry-run`.
The package ships source files directly; no compilation or copy step runs.
The server binds to localhost and serves `src/` with explicit JavaScript and CSS media types.
Playwright starts and stops its own server; CI runs `tests` and `check` on pushes and pull requests.
Each Playwright run allocates a free localhost port, allowing checks while the developer server runs on port 4173.

Markdown lint runs offline because private repository links require credentials.
The `SW001` plugin replaces `MD014`, preserving internal links while treating sibling paths and ignored plan artifacts as external evidence.
Those artifacts are optional in source-only checkouts and CI.
[.lint-markdown.json](../.lint-markdown.json) excludes `CHANGELOG.md`, which is never linted.
Run `python scripts/devops.py format` to repair formatting, and `lint-markdown help --verbose` for the rule list.

---

## Command Line Tool
[cli.mjs](../bin/cli.mjs) vendors the package into an app and checks the copy, as [ADR-0005](adrs/ADR-0005-distribution-and-versioning.md) defines.
It runs on Node.js without dependencies; run it from the app root:

```bash
npx @gpellicciotta/support.webapp@{{version}} vendor --look {{look}} --to {{web-root}}/vendor/design --styles {{styles-folder}}
node {{support-webapp-checkout}}/bin/cli.mjs vendor --look {{look}} --to {{web-root}}/vendor/design --dry-run
node {{web-root}}/vendor/design/bin/check.mjs --format json
```

- `vendor` copies the look-neutral files, one look, `contract.json`, `manifest.json`, and `bin/check.mjs`.
- It writes the pin, `design.json`, with `version`, `look`, `target`, and `styles`.
- Rerun `vendor` to upgrade or repair a copy; it replaces only folders whose files its manifest lists.
- `--styles` repeats once per app stylesheet folder; a rerun without it keeps the pinned folders.
- `check` reports two jobs: integrity of the copy against its manifest and pin, and conformance of app styles.
- Conformance fails on raw colors outside token files and on primitive or `--_` private package tokens.
- It warns on deprecated tokens and on fixed or sticky positions outside shell styles.
- It skips the vendored copy inside a `styles` folder, and fails on a missing `styles` folder.
- Exit codes: 0 success, 1 operational or check failure, 2 invalid arguments.

The `prepack` script writes `manifest.json` with each file's look and SHA-256 hash; `postpack` removes it.
`vendor` refuses a package whose files differ from its `manifest.json`.

---

## Versioning and Releasing
### Updating Versions
- [package.json](../package.json) owns the version, which must match the top heading in [CHANGELOG.md](../CHANGELOG.md).
- Run `python scripts/devops.py versions` to check agreement.
- `plan tasks stop {{task-id}} --status completed` raises the patch number for every completed task.
- Never edit the patch number yourself.
- Rename the heading to bump the minor or major version, as the change management guidelines require.

### Making a Release
Release from a clean, up-to-date `main` with [devops.py](../scripts/devops.py).
Preview first, then release:

```bash
python scripts/devops.py release --dry-run
python scripts/devops.py release --yes
```

Without `--yes`, the script asks you to type `release v{{version}}`.
The shared support.python release pipeline checks repository state, runs the full check, freezes versions, tags, and publishes a GitHub release.
It then opens the next development version.
Review `python scripts/devops.py help --verbose` before releasing; publishing requires explicit authorization.

Publishing the package arrives with the publish workflow task.

---

## Plan Store
Tasks live on the `plan` branch, checked out at `.plan/`; [PLAN.md](../PLAN.md) is a link into that checkout.
A fresh clone has no `.plan/` until you attach the store:

```bash
git clone https://github.com/gpellicciotta/support.webapp.git
cd support.webapp
plan init --store branch
```

Publish both refs when pushing: `main` for code and `plan` for tasks.

---

## Task Coordination Protocol
Tasks are managed only through the `plan` CLI:
1. Create: `plan tasks create "{{description}}"`, adding `--protocol adhoc` for small changes.
2. Start: `plan tasks start {{task-id}} --owner @{{agent}}` provisions a branch and worktree for standard tasks.
3. Execute: Work in the resolved workspace, keeping the task file in `.plan/tasks/` current.
4. Finalize: Pass all checks, update `CHANGELOG.md` and documentation, then run `plan tasks stop {{task-id}} --status completed`.
