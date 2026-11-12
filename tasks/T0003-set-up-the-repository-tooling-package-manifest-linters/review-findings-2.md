---
task: T0003
round: 2
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T09:21:25Z
reviewed_commit: "89a7e69"
base_commit: "324603b"
branch: task/T0003-set-up-the-repository-tooling-package-manifest-linters
---
# Review Findings: Task T0003 (Round 2)

## Summary
Approved. Commit 89a7e69 fixes the blocking port collision from round 1.
It also applies the optional cleanups that round 1 recommended.
- `playwright.config.js` probes a free localhost port in the runner process.
  - It exports the port through `SUPPORT_WEBAPP_PLAYWRIGHT_PORT`.
  - Workers detect `TEST_WORKER_INDEX` and reuse the runner's port.
- The redundant `WebProject.check` override is gone, and the base `check` still runs Playwright.
- The `tests` summary and the CLI description now mention `--slow` and `serve`.
- The task log records the `build` and release-asset follow-up for the publish task.
- `devops.md` and `CHANGELOG.md` describe the automatic port.

I verified on commit 89a7e69 (Windows, Python 3.15.2), with a clean worktree:
- I started `python scripts/devops.py serve --port 4173`; `GET /` returned 200.
- With that server running, `python scripts/devops.py check` exited 0.
  - It ran Markdown lint (19 files), Ruff check and format, ESLint, pytest (3), Vitest (3), Playwright (4), and `npm pack --dry-run`.
- Two concurrent `npx playwright test --output=...` runs, with the server still running, each passed 4 cases (exit 0).
- `python scripts/devops.py help` shows the new description and the `tests` summary.
- I stopped the server tree with `processes kill --yes --force`; port 4173 no longer answered afterwards.

`validation-proof.md` records the failing run (`... 4173 is already used ...`, exit 1).
It also records the passing run, both concurrent runs, and the full check, all with the server holding 4173.

## Defects
None blocking. The remaining non-blocking notes:
1. **Port probe race (minor).** The config closes its probe socket before `serve.mjs` binds the port.
   Another process could take the port in between. The chance is negligible, and the failure would be loud.
2. **Carried over from round 1, still open, all non-blocking:**
   - `src/index.html` ships in the npm tarball, since only `src/demo/` is excluded.
   - `serve` and `tests` use the private support.python APIs `project._npm` and `cli._test`.
   - `serve` and `tests` print `[options]` in usage without describing the options.
   - The ESLint config enables no base rule set (`js.configs.recommended`).

## Process Gaps
- The worker states that the red-phase evidence for the original Vitest and Playwright smoke tests was not captured.
  This round does record failing-first evidence for the port fix.
- `validation-proof.md` now nests `## Walkthrough & Validation` under an H1, which resolves the round 1 heading gap.

## Required Rework
None. Later tasks can pick up the non-blocking notes above, starting with the publish task's tarball scope.
