---
task: T0003
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T09:12:20Z
reviewed_commit: "0148064"
base_commit: "324603b"
branch: task/T0003-set-up-the-repository-tooling-package-manifest-linters
---
# Review Findings: Task T0003 (Round 1)

## Summary
The work meets nearly every goal and is well built; one test-isolation defect blocks approval.
The manifest, linters, Vitest, Playwright, devops actions, bootstrap, server, and CI all exist as specified.
The `files` list matches ADR-0008: `src/` without `demo/`, plus `bin/`.

Reviewer verification on commit 0148064, Windows, Python 3.15.2:
- `python scripts/devops.py check` exited 0: Markdown lint, Ruff, ESLint, pytest (3), Vitest (3), Playwright (4), and `npm pack --dry-run`.
- `python scripts/devops.py versions` exited 0; `help` lists `tests` and `serve`; `tests --slow` passed 4 browser cases.
- `python scripts/devops.py serve --port 4173` served `/` as 200 `text/html; charset=utf-8`.
  - `/../package.json`, `/%2e%2e/package.json`, `/..%5cpackage.json`, and `/%ZZ` returned 403.
  - `/missing.js` returned 404 and `POST /` returned 405 with `Allow: GET, HEAD`.
  - I stopped the server with `processes kill --yes --force` afterwards.
- I inspected the mobile-dark screenshot: the page renders, using browser defaults as the proof says.
- CI has not run on GitHub, since pushing needs authorization.

## Defects
1. **Fixed Playwright port collides with the documented server (blocking).**
   `playwright.config.js` binds the web server to fixed port 4173 with `reuseExistingServer: false`.
   The same port is the default of `devops.py serve`, which AGENTS.md and devops.md promote.
   I reproduced the failure: with `devops.py serve --port 4173` running, `npm run test:slow` failed with:
   `Error: http://127.0.0.1:4173 is already used, make sure that nothing is running on the port/url or set reuseExistingServer:true in config.webServer.`
   So `devops.py check` fails while a developer runs the local server.
   Parallel worktree checks on one machine collide the same way.
   This breaks the testing-guidelines rule that each test gets its own free port.
2. **Minor: `build` no longer produces release assets (non-blocking).**
   `WebProject.build` runs `npm pack --dry-run`, so `release_assets()` (`dist/*.tgz`) is always empty.
   The shared `release` would then publish a GitHub release without the tarball.
   The `build` summary still reads "build the distributable outputs from scratch", and `.gitignore` now lists an unused `dist/`.
   This is acceptable until the publish task, but the follow-up should be recorded.
3. **Minor: redundant or misleading CLI surface (non-blocking).**
   - `WebProject.check` repeats the base `Project.check` word for word.
   - `tests` duplicates the standard `test` action, yet its summary says "run the fast unit tests" while it accepts `--slow`.
   - The CLI description omits `serve`, and `serve`/`tests` print `[options]` with no option help.
   - `serve` and `tests` rely on the private `project._npm` and `cli._test` APIs of support.python.
4. **Minor: `src/index.html` ships in the npm tarball (non-blocking).**
   The landing page is a demo surface, not an ADR-0005 entry point.
   It ships because only `src/demo/` is excluded.
5. **Note: ESLint 9.39.5 is unsupported upstream.**
   The spec justifies this with an advisory against ESLint 10.14.0, but the proof cites no advisory ID.
   The ESLint config also enables no base rule set (`js.configs.recommended`), so `no-undef` and similar rules are off.

## Process Gaps
- The red-phase proof is partial.
  The failing Vitest run already passed 2 of 3 tests, so `vitest.config.js` and `resolveRequest` existed before the red run.
  The spec says the smoke test "fails until the Vitest configuration exists"; the evidence does not show that.
  The Playwright smoke test has no recorded failing run.
- `validation-proof.md` uses `# Walkthrough & Validation` as an H1, not the required `##` section.
- The bootstrap output's first block runs past 40 lines.
  Its later blocks split one run into several fences without `[... n lines omitted ...]` markers.
- The `tests` action duplicates the standard `test` action, which the cli-guidelines say to rely on.
  The task spec requested `tests`, so this is a spec-versus-guideline tension, not a worker fault.

## Required Rework
1. Isolate the Playwright web server port from the developer server.
   - Option A: choose a free port at config load time, or read a `PLAYWRIGHT_PORT` override.
   - Option B: use a dedicated test port distinct from the `serve` default.
   - Either way, `devops.py check` must pass while `devops.py serve --port 4173` runs.
   - Record that run, with its exit code, in `validation-proof.md`.
2. Record failing-first evidence for the port fix: run `test:slow` with `serve` holding 4173 before the change.
3. Optional, recommended in the same round:
   - Drop the redundant `check` override.
   - Fix the `tests` summary and the CLI description.
   - Log the `build`/release-asset follow-up for the publish task.
