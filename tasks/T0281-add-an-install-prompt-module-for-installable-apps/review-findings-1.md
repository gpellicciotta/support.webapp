---
task: T0281
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T17:58:12Z
reviewed_commit: "5382be8"
base_commit: "ccb845e"
branch: task/T0281-add-an-install-prompt-module-for-installable-apps
---
# Review Findings: Task T0281 (Round 1)

## Summary
Approved.
The work meets every goal and technical specification item.
- `src/js/install-prompt.js` keeps `beforeinstallprompt`, reports `{ installable, installed }` through `onChange`, and owns no button.
- It detects installs through `(display-mode: standalone)`, `navigator.standalone`, and `appinstalled`.
- `prompt()` clears the single-use event before awaiting and resolves to the user's choice.
- Injected `window` and `matchMedia` keep it testable; `destroy()` removes every listener.
- The contract registers `install-prompt`; the portal shell demo uses a `data-install-prompt-action` hook with `hidden` and `aria-disabled`.
- components.md, ADR-0003, and CHANGELOG.md document the module and the app upgrade path.

Reviewer verification on commit `5382be8`:
- `npx vitest run`: 42 files, 2308 tests passed, including 12 new install prompt tests.
- `npx playwright test tests/e2e/install-prompt.spec.js tests/e2e/shell`: 174 passed, 22 skipped, across all projects.
- `npm run lint` and `lint-markdown check --offline`: clean.
- `plan tasks validate T0281 --completion`: passed.

## Defects
None.

## Process Gaps
Non-blocking:
1. `prompt()` drops the kept event when `event.prompt()` rejects, for example `NotAllowedError` outside a user gesture.
   The app action then stays hidden until the browser fires a new `beforeinstallprompt`.
   The unit tests pin this behavior and the docs say to call `prompt()` in a click handler, so it is a deliberate choice.
2. The module listens with `MediaQueryList.addEventListener` only, without the legacy `addListener` fallback.
   Safari before 14 would miss live standalone transitions; initial detection still works.
3. The proof's full `python scripts/devops.py check` run exited 1 on `generate-app.test.js` for a missing worktree `node_modules`.
   The worker reran `npm run test:integration` green after `npm ci`, and reported both runs transparently.
4. Scope overran the estimate: 5 files and 70 lines against 3 files and 60 lines.
   The Execution Log records both undeclared files, `src/demo/shell-portal.html` and ADR-0003.

## Required Rework
None.
