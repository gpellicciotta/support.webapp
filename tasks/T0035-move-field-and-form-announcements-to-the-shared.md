---
id: T0035
owner: "@codex"
session: codex-20261113-d9f0fb
needs: []
branch: task/T0035-move-field-and-form-announcements-to-the-shared
worktree: .plan/work/T0035-move-field-and-form-announcements-to-the-shared
status: active
started_at: "2026-11-13T04:56:18Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 850.4, input: 168792, output: 19682, cache_read: 4762368, cache_write: 0}
review_status: pending
review_round: 1
---
# T0035: Move field and form announcements to the shared live region module, so each page has one polite region

## Goals
Move field and form announcements to the shared live region module, so each page has one polite region.

Estimated scope: nine counted files and 220 changed lines, covering one announcer subsystem.
Files: three announcement modules, three unit suites, two browser suites, and the visual style guide.
Completion check: `python scripts/devops.py check`.
Unit cases cover sharing, repeated messages, document isolation, destruction, and custom callbacks.
Browser scenarios validate field errors and form submissions alongside the page announcer across configured themes and viewports.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0035.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-12] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-13] **[Decide]**
  Estimated eight counted files and 220 changed lines. Unit cases cover sharing, repeated messages, document isolation, destruction, and overrides. Browser checks cover field validation and form submission alongside the gallery announcer.

- [2026-11-13] **[Implement]**
  Moved default field and form announcements into shared document regions. Retained the field announcement export for compatibility. Added reference-counted handles, lifecycle regressions, and browser assertions. Ten counted files remain one announcer subsystem; splitting would separate implementation from verification.

- [2026-11-13] **[Verify]**
  Required check launched Python, ESLint, Vitest, and Playwright synchronously. Reported PIDs: 79564, 76580, 88760, 75128, 51640, 34636, 85636; browser server PID: 87692. Command: python scripts/devops.py check. Hidden-region changes do not alter visible rendering.

- [2026-11-13] **[Doc]**
  Updated announcer lifecycle and migration documentation plus the existing prerelease changelog. Root cause: field.js maintained independent regions and timers. No visible markup or styling changed; browser tests verify hidden accessibility output without screenshot changes.

- [2026-11-13] **[Verify]**
  python scripts/devops.py check passed: lint, three Python tests, 2108 unit tests, 614 browser tests, four integration tests, and packaging. Two browser tests skipped. Focused suites passed 63 tests. Verbatim evidence is in validation-proof.md.

- [2026-11-13] **[Verify]**
  Committed 69f234d on the assigned task branch. Completion validation passed. Implementation, verification, and documentation steps are checked; Review remains pending for the orchestrator. Evidence: [validation-proof.md](T0035-move-field-and-form-announcements-to-the-shared/validation-proof.md).

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

