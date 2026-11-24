---
id: T0280
owner: "@gemini"
session: antigravity-20261123-56e788
needs: []
branch: task/T0280-add-a-theme-boot-script-and-account-theme
worktree: .plan/work/T0280-add-a-theme-boot-script-and-account-theme
status: completed
started_at: "2026-11-23T16:50:23Z"
ended_at: "2026-11-23T17:32:42Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1935.1, input: 89829, output: 9465, cache_read: 572213}
  review: {turns: 1, duration_s: 561.7, input: 10, output: 2513, cache_read: 308800, cache_write: 4368}
work_duration: 2538.8
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T17:23:13Z"
reviewed_by: "@claude"
review_session: claude-20261123-b5b03a
completion-commit: ccb845e0d9b636dc18dad4e924ff65fe1a6fab69
---
# T0280: Add a theme boot script and account theme sync to the theme switch, promoted from Auth

## Goals
Give apps a theme boot script that applies the stored `{{app-name}}.theme` before the first paint, with an optional legacy key migration.
Add account sync: read a `theme` or `style-settings` setting, apply it at sign-in, and save switch changes back through app callbacks.
Auth, counters, and meteo each hand-write the boot script today.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Theme Boot Script and Account Theme Sync", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 100 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the theme boot script and account sync, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Kept module key theme-switch, adding classic src/js/theme-boot.js with data-theme-switch-app/legacy-key hooks plus normalizeTheme, themeOfSettings, themeBootScript, syncAccountTheme, and attachThemeSwitch sync callbacks.

- [2026-11-23] **[Verify]**
  Red-phase TDD confirmed: 13 unit tests and 3 browser tests failed as expected before implementation.
  - vitest theme-boot.test.js: 13 failed.
  - playwright theme-boot.spec.js: 3 failed.

- [2026-11-23] **[Implement]**
  Added src/js/theme-boot.js, account theme sync in src/js/theme-switch.js, template boot tag, and gallery demo section. Contract already listed theme-switch.
  - Undeclared modified: src/demo/visual-style-gallery.html, src/demo/gallery.js, docs/adrs/ADR-0003-components-and-patterns.md.
  - Counted diff: 6 files, 321 lines (within typical line).

- [2026-11-23] **[Doc]**
  Updated components.md with boot script, account sync API, and upgrade note, recorded decision in ADR-0003, and updated CHANGELOG.md.

- [2026-11-23] **[Verify]**
  Full devops check passed (exit 0) and visual gallery screenshots verified in light and dark modes.
  - Linters, 61 pytest, 2296 vitest, 910 playwright, 7 integration, pack dry-run green.
  - Screenshots linked in validation-proof.md (before/after/section light and dark).

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 6.
  - Lines touched: 321.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 approved by @claude: The work meets the goals and the technical specification.
  - Findings: [review-findings-1.md](T0280-add-a-theme-boot-script-and-account-theme/review-findings-1.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

