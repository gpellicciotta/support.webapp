---
id: T0039
owner: "@codex"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-13T17:57:56Z"
ended_at: "2026-11-13T22:00:24Z"
review: agent
preview: none
protocol: standard
review_status: approved
review_round: 2
review_requested_at: "2026-11-13T21:54:52Z"
review_session: claude-20261113-634d85
reviewed_by: "@claude-code"
completion-commit: bd9a22941d994701e68b84f90b16af0729d39575
---
# T0039: Rename the per-app shell demo pages to generic examples, updating the gallery links and browser specs.

## Goals
Rename `shell-todos.html`, `shell-family-portal.html`, `shell-meteo.html`, and `shell-counters.html` after the layouts they show.
Use names such as `shell-list-editor.html`, `shell-portal.html`, `shell-single-screen.html`, and `shell-toolbar.html`.
Keep every shell, verifier, and floating action button check passing against the renamed pages.
Start once meteo runs on the system, since ADR-0004 proves each adopter's fit with its own demo page.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0004 and list every reference to the four demo pages.
- [x] **[Implement]** Write or update the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Rename the pages with git mv and update the gallery links and specs.
- [x] **[Verify]**    Run the shell, verifier, and floating action button specs, then the completion check.
- [x] **[Doc]**       Update the style guide links and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.

- [2026-11-13] **[Decided]**
  User requested T0039 before meteo adoption. Selected list-editor, toolbar, single-screen, and portal names; preserve layout behavior. Preview command node scripts/serve.mjs --port 4173 runs as PID 66992, tool session 38253.

- [2026-11-13] **[Verify]**
  Gallery-link regression failed as expected: shell-list-editor.html had zero links. Captured and inspected 20 before and 20 after views, with HTTP 200 and no runtime/network errors. Temporary test server PID 54560 required processes kill --yes --force.

- [2026-11-13] **[Verify]**
  Launched python scripts/devops.py check with elevated subprocess cleanup permissions, tool session 99947. Markdown lint PID 51236 and Ruff checks passed; ESLint PID 88452 was running at first return.

- [2026-11-13] **[Verify]**
  Fast suites passed: 3 Python tests and 2108 JavaScript tests. Source, tests, and docs contain no old demo filenames. git diff --check reported no whitespace defects; browser checks remain running.

- [2026-11-13] **[Verify]**
  Recorded outcomes using git diff HEAD --numstat -M, counting rename edits rather than full file moves.
  - Files touched: 10.
  - Lines touched: 76.
  - Reopenings: 0.

- [2026-11-13] **[Verify]**
  Initial full check exited 1: two verifier screenshot timeouts and one unloaded-CSS failure; 611 browser tests passed, 2 skipped. All six focused desktop cases passed serially without code changes. Repeating full check; retained failure evidence.

- [2026-11-13] **[Verify]**
  Repeated python scripts/devops.py check as tool session 74235. Markdown lint PID 64712 passed; Ruff PID 72424 was running at first return. No product files changed after the initial full check.

- [2026-11-13] **[Verify]**
  Marked the initial screenshot and stylesheet-load failures as intermittent observations tracked by backlog T0044. No retries, skips, timeout changes, or verifier assertions were added to hide them; the serial diagnostic passed unchanged.

- [2026-11-13] **[Verify]**
  Repeated full check exited 0: lint, 3 Python tests, 2108 JavaScript tests, 614 browser tests, 4 packaging integration tests, and package dry run passed; 2 browser tests skipped. Recorded both full runs and the serial diagnostic.

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-13] **[Review]**
  Launched plan agents run --agent claude-code --task-id T0039 --sandbox --timeout 300 with the review prompt recorded in chat. Reviewer session claude-20261113-b1ad70, PID 76796, tool session 50268. Product edits are complete; all checks passed.

- [2026-11-13] **[Review]**
  Round 1 rejected by @claude-code: Generic labels incomplete: shell-single-screen.html still uses Forecast label, heading, and data-screen values. See review-findings-1.md.

- [2026-11-13] **[Review]**
  Round 1 required generic Details labels and matching screen IDs instead of Forecast. Added a dedicated screen-switch regression before changing markup. Non-blocking documentation sample cleanup remains outside this task's declared files.

- [2026-11-13] **[Implement]**
  Replaced Forecast with Details in visible labels and screen identifiers; generalized sample place and settings copy. Added a screen-switch regression that failed before the markup change. Refreshing screenshots before final verification.

- [2026-11-13] **[Verify]**
  Refreshed and inspected all 20 after screenshots following review corrections; HTTP 200 and no runtime/network errors. Final python scripts/devops.py check runs as tool session 52771; Markdown PID 16312, Ruff, ESLint, and 3 Python tests passed.

- [2026-11-13] **[Verify]**
  Review rework raised the measured diff to 100 changed lines across the same 10 files. The screen-switch regression verifies exactly one visible section while selecting Details, Settings, and Start.

- [2026-11-13] **[Verify]**
  Controlled delayed-import regression failed: verifier reported ready while warm/look.css remained held. Reused selectGalleryLook's load-event wait instead of checking only entry CSS rules. This confirms the stylesheet-readiness race; original screenshot timeout causes remain tracked by T0044.

- [2026-11-13] **[Verify]**
  Delayed-import regression passed after reusing selectGalleryLook. The next full check stopped at four brace-style lint errors in the new test; corrected those callback blocks before rerunning checks.

- [2026-11-13] **[Verify]**
  Final full check after the readiness fix runs as tool session 72859. Markdown lint PID 72884, Ruff, and ESLint passed. The delayed-import regression also settles theme transitions before checking computed styles.

- [2026-11-13] **[Verify]**
  The full run after readiness correction passed 621 browser tests, with 2 skipped; only the new regression failed on contrast during its forced light-mode transition. Changed that loading-only regression to retain the project system theme.

- [2026-11-13] **[Verify]**
  The final all-suite check runs as tool session 2156 after the readiness regression passed across all four projects. Markdown lint PID 85644, Ruff, and ESLint passed at startup. No further product edits are planned.

- [2026-11-13] **[Verify]**
  Final full check exited 0 after all corrections: lint, 3 Python tests, 2108 JavaScript tests, 622 browser tests, 4 integration tests, and packaging passed; 2 browser tests skipped. Recorded final verbatim output.

- [2026-11-13] **[Verify]**
  Recorded final outcomes against HEAD with rename detection; verifier readiness correction remains within the original size estimate.
  - Files touched: 10.
  - Lines touched: 144.
  - Reopenings: 0.

- [2026-11-13] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-13] **[Review]**
  Resumed claude-code session claude-20261113-b1ad70 for round 2, PID 16412, tool session 16498, using the exact plan agents run command recorded in chat. Requested review of final passing evidence and proper findings metadata.

- [2026-11-13] **[Review]**
  Round-2 reviewer approved content, but Plan requires a session created after that round's request. Launched fresh claude-code session claude-20261113-634d85, PID 7560, tool session 45889, using the exact command recorded in chat.

- [2026-11-13] **[Review]**
  Round 2 approved by @claude-code: Approved round 2 after independent fresh-session review of the diff and final proof.
  - F1 resolved; generic Details labels with screen-switch regression.
  - Final full check exited 0; outcomes log needs 144 lines.
  - Findings: [review-findings-2.md](T0039-rename-the-per-app-shell-demos-and-source/review-findings-2.md).

- [2026-11-13] **[Verify]**
  Confirmed existing log entries already record the Details relabel, verifier readiness correction, and final outcomes: 10 files, 144 lines, 0 reopenings. The review's non-blocking log suggestions are already satisfied.

- [2026-11-13] **[Complete]**
  Task completed successfully.

