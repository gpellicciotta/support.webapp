---
task: T0014
round: 1
verdict: rejected
reviewer: "@claude-2"
reviewed_at: 2026-11-12T10:12:02Z
reviewed_commit: "9782b96"
base_commit: "0e205ea"
branch: task/T0014-add-the-vendor-and-check-commands-of-the
---
# Review Findings: Task T0014 (Round 1)

## Summary
The work covers the ADR-0005 and ADR-0007 scope: `vendor`, `check`, the hashed manifest, the pin, and re-vendoring.
Reviewer reruns passed:
- `python scripts/devops.py check`: exit 0, with 469 unit, 3 pytest, 8 browser, and 1 integration tests.
- `npx vitest run --config vitest.integration.config.js`: exit 0, the completion check.
- The worktree stayed clean afterwards, and `postpack` removed `manifest.json`.

Rejected for one blocking defect.
The vendored checker exits 0 without checking anything when its path runs through a symbolic link or junction.
A CI gate that passes silently defeats the DS-10 drift check.
A second defect gives false conformance failures when a `styles` folder contains the vendored copy.

## Defects
1. **Blocking: the vendored `check.mjs` passes silently through a symlinked or junction path** (`bin/check.mjs:169`).
   - The main guard compares `resolve(process.argv[1])` with `fileURLToPath(import.meta.url)`.
   - Node resolves the main module URL with its real path, while `argv[1]` keeps the link path.
   - The guard fails, nothing runs, and the process exits 0 with no output.
   - Reproduced on Windows with a junction to an app whose `src/css/app.css` holds `color: red`:
     ```text
     node {{app}}\src\vendor\design\bin\check.mjs       -> conformance: FAIL, exit 1
     node {{app}}-link\src\vendor\design\bin\check.mjs  -> no output, exit 0
     node {{app}}-link\...\check.mjs --format json      -> no output, exit 0
     ```
   - The same happens on macOS, where `/tmp` links to `/private/tmp`, and in CI with symlinked workspaces.
   - `bin/manifest.mjs:298` has the same guard, so `prepack` through a linked checkout would skip writing the manifest.
2. **Conformance scans the vendored copy when a `styles` folder contains the target** (`bin/check.mjs:139-148`).
   - An app that serves `src/` and vendors into `src/vendor/design` may list `src` in `styles`.
   - `check` then scans the package's own files and fails on its primitives:
     ```text
     src/vendor/design/looks/neutral/look.css: package internal token --gray-50
     ```
   - The conformance walk should skip the vendored target folder, since integrity already covers it.

Non-blocking observations:
- `vendor --styles nope` accepts a missing folder; `check` then fails with a raw `ENOENT ... scandir` message.
- The token scan matches `--[\w-]+` in selectors too, so a BEM class like `.card--gray-50` reports a primitive.
- `package.json` lacks `"engines": { "node": ">=22" }`, although ADR-0005 states that requirement.
- `docs/devops.md:378` still says `check` runs "both test suites"; it now runs the integration suite too.

## Process Gaps
- The Execution Log's outcome reports "Files touched: 4" and "Lines touched: 44".
  The commit touches 14 files with 548 insertions and 3 deletions.
- `package-lock.json` changed but is not in the declared files.
- Red-phase evidence came after the implementation existed, covering only the tests added in the last turn.
  The log states this honestly, but most tests never showed red output.
- No test covers running the vendored checker by its own path, so defect 1 escaped the integration test.

## Required Rework
1. Make the main-module guards of `bin/check.mjs` and `bin/manifest.mjs` robust to symlinks and junctions.
   For example, compare `realpathSync(process.argv[1])` with the module's real path.
   Add a test that runs the vendored checker through a linked path and expects a failing exit code.
2. Skip the vendored target folder in the conformance walk.
   Add a unit test whose `styles` folder contains the target and expects no package-file findings.
3. Correct the outcome counts in the Execution Log, and declare `package-lock.json`.
