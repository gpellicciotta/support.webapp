---
id: T0281
owner: "@gemini"
session: antigravity-20261123-504b38
needs: []
branch: task/T0281-add-an-install-prompt-module-for-installable-apps
worktree: .plan/work/T0281-add-an-install-prompt-module-for-installable-apps
status: completed
started_at: "2026-11-23T17:33:05Z"
ended_at: "2026-11-23T18:00:32Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1497.0, input: 296674, output: 47919, cache_read: 11631957}
  review: {turns: 1, duration_s: 133.6, input: 24, output: 4796, cache_read: 578392, cache_write: 46572}
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T17:58:11Z"
reviewed_by: "@claude"
review_session: claude-20261123-8a705f
work_duration: 1647.6
completion-commit: 11250b72f593f5efbff367dd485168bbb73c65a4
---
# T0281: Add an install prompt module for installable apps, promoted from Auth, counters, and meteo

## Goals
Add an install prompt module: keep the `beforeinstallprompt` event, report installable and installed state, and prompt on a user gesture.
Detect a running installed app through the `standalone` display mode and `appinstalled`.
Auth, counters, and meteo each carry their own copy; the package covers worker updates only.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Install Prompt Module", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 3 files, 60 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the install prompt module, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Read]**
  Read technical-spec.md, auth-webapp-ui-audit.md, naming.md, ADR-0003, and sibling install code in auth, counters.server, and meteo.

- [2026-11-23] **[Decided]**
  Chose key install-prompt in contract.json with attachInstallPrompt({ window, matchMedia, onChange }) in src/js/install-prompt.js.
  - Controller exposes getState, isInstallable, isInstalled, prompt, and destroy.
  - Shell portal demo wires data-install-prompt-action using hidden and aria-disabled.

- [2026-11-23] **[Implement]**
  Authored failing unit tests in tests/unit/install-prompt.test.js and browser tests in tests/e2e/install-prompt.spec.js.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures for the new unit and browser tests before implementation.
  - Vitest failed: missing src/js/install-prompt.js (exit 1).
  - Playwright failed: missing demo install hook and listener (exit 1).

- [2026-11-23] **[Implement]**
  Added src/js/install-prompt.js, registered install-prompt in src/contract.json, and wired the portal shell demo.
  - Undeclared file touched: src/demo/shell-portal.html (1 line).

- [2026-11-23] **[Doc]**
  Updated docs/specs/components.md with the install-prompt catalog entry and upgrade notes, ADR-0003, and CHANGELOG.md.
  - Undeclared file touched: docs/adrs/ADR-0003-components-and-patterns.md (2 lines).

- [2026-11-23] **[Verify]**
  Verified all linters, 61 pytest, 2308 vitest, 926 Playwright, 7 integration tests, and npm pack dry-run green.
  - Files touched: 5.
  - Lines touched: 70.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 approved by @claude: Approved.
  - Findings: [review-findings-1.md](T0281-add-an-install-prompt-module-for-installable-apps/review-findings-1.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

