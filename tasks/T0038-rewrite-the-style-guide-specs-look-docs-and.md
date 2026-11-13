---
id: T0038
owner: "@codex"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-13T17:14:23Z"
ended_at: "2026-11-13T17:38:18Z"
review: agent
preview: none
protocol: standard
review_status: approved
review_round: 1
review_requested_at: "2026-11-13T17:22:46Z"
reviewed_by: "@claude-code"
review_session: claude-20261113-f672e3
completion-commit: 5f4237a47298fd2a3ea8cfc0cda9fb3a5987931e
---
# T0038: Rewrite the style guide, specs, look docs, and README for readers who do not know the sibling apps

## Goals
Make the user-facing docs readable without knowing todos.webapp, family-portal, meteo, auth, or counters.
Replace "taken from {{app}}" notes with the reason behind each choice; keep links to ADRs for provenance.
Leave the ADRs, `docs/analysis/`, and `docs/roadmap.md` unchanged, since they record decisions and run adoptions.
Start once todos.webapp and family-portal run on the system; T0022 waits for this task.
Completion check: `lint-markdown check --offline` passes, and a search of the declared files finds no sibling app names.
### Declared Files
- README.md
- docs/specs/visual-style-guide.md
- docs/specs/components.md
- docs/specs/naming.md
- docs/specs/i18n.md
- docs/specs/looks/neutral.md
- docs/specs/looks/warm.md
- docs/specs/looks/bright.md
Size estimate: 8 files, 350 lines

## Task Execution Steps
- [x] **[Read]**      List every sibling app mention in the declared files and the fact each one carries.
- [x] **[Doc]**       Rewrite each mention as a generic rationale, keeping ADR links for provenance.
- [x] **[Verify]**    Run the Markdown linter and the app-name search, recording output in validation-proof.md.
- [x] **[Doc]**       Update CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request to make the docs usable by readers who do not know the sibling apps.

- [2026-11-13] **[Decided]**
  User requested T0038 before completing family-portal adoption. Replaced provenance-dependent descriptions with component purposes, generic shell layouts, and look rationale; retained ADR and license references. No runtime or UI changes require automated regression tests.

- [2026-11-13] **[Verify]**
  Launched python scripts/devops.py check, tool session 12988. Markdown lint process 15880 and Ruff checks passed; JavaScript lint process 75808 was running at first return.

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-13] **[Verify]**
  Final Markdown lint passed; the eight-document app-name search found no matches. Review corrections clarified field methods, account-menu initials/icon behavior, and app-local accessibility responsibilities. Full check fast suites passed; browser suite remains running.

- [2026-11-13] **[Verify]**
  Recorded outcomes before completion; CHANGELOG.md is the additional touched file beyond the eight declared documents.
  - Files touched: 9.
  - Lines touched: 326.
  - Reopenings: 0.

- [2026-11-13] **[Review]**
  Chat reviewer approved corrected content, but plan requires a registered reviewer session. Launched plan agents review T0038 --sandbox --timeout 10m, tool session 23724, to record the formal verdict.

- [2026-11-13] **[Verify]**
  python scripts/devops.py check exited 0: lint, 3 Python tests, 2108 JavaScript tests, 614 browser tests, packaging integration, and package dry run passed; 2 browser tests skipped. Saved verbatim evidence in validation-proof.md.

- [2026-11-13] **[Review]**
  Managed reviewer registered session antigravity-20261113-6b89c6, PID 75736, for plan agents review T0038 --sandbox --timeout 10m; output is in .plan/sessions/processes/T0038-75736.log.

- [2026-11-13] **[Verify]**
  Normalized all nine edited Markdown files to UTF-8 with LF line endings after the reviewer's inspection. Full repository check previously passed; only line endings changed afterward.

- [2026-11-13] **[Review]**
  Managed reviewer timed out without a verdict; its closed session could not resume. Started a fresh claude-code review using existing evidence, tool session 55649, with a 300-second limit and no test reruns.

- [2026-11-13] **[Review]**
  Fresh reviewer PID 17400 uses session claude-20261113-f672e3. The exact plan agents run command is recorded in this chat; its task-bound session stores review identity.

- [2026-11-13] **[Review]**
  Round 1 approved by @claude-code.
  - Findings: [review-findings-1.md](T0038-rewrite-the-style-guide-specs-look-docs-and/review-findings-1.md).

- [2026-11-13] **[Complete]**
  Task completed successfully.

