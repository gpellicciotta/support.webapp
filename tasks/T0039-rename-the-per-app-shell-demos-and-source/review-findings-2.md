---
task: T0039
round: 2
verdict: approved
reviewer: "@claude-code"
reviewed_at: 2026-11-13T21:58:28Z
reviewer_session: claude-20261113-634d85
reviewed_commit: 6cd1671
session: claude-20261113-634d85
session_agent: claude-code
session_created_at: 2026-11-13T21:56:45Z
---
# T0039 Review Findings, Round 2

Verdict: **approved**

Confirmed independently in fresh session `claude-20261113-634d85`.
Reviewed: `git diff HEAD -M` (working tree on 6cd1671), validation-proof.md, the refreshed after-overview, and `after/single-screen-light-390.png`.
No tests were rerun, per instructions.

## Round 1 findings
- **F1 resolved:** `shell-single-screen.html` now uses `Details` for the heading, button, `data-screen`, and `data-demo-screen`. No `forecast` remains in any `src/demo/shell-*.html`. The refreshed screenshots show Start, Details, Settings in the bottom bar.
- **F2 unchanged and non-blocking:** `docs/specs/components.md` still shows "Family" and `forecast` in its shell skeleton. It is outside the declared files and the task log records it. Open a follow-up task if the skeleton should match the demo.

## New work checked
- **Screen-switch regression:** `shell.spec.js` adds a test that selects Details, Settings, and Start and expects exactly one visible section with the matching heading. The proof records its red run (exit 1) before the markup fix.
- **Verifier readiness fix:** `open()` in `verify-ui.spec.js` now calls the existing `selectGalleryLook` helper, which waits for the stylesheet `load` event and fonts. `gallery-helpers.js` is unchanged. The removed `cssRules` wait is covered by the load event and by the remaining "stylesheet not loaded" verifier checks.
- **Delayed-import regression:** It holds `warm/look.css`, asserts the page is still loading, then releases it. The proof shows it failing before the fix (`Received: "ready"`) and passing after.
- **Weakening check:** No verifier assertion, skip, retry, or timeout was added or relaxed. The regression keeps the project system theme, which narrows only its own test.

## Evidence
- The final full check exited 0: lint, 3 Python tests, 2108 JS tests, 622 browser tests (2 skipped), 4 packaging tests, and package dry run.
- The proof also keeps the failed runs: theme isolation, ESLint brace style, and the portal readiness race.
- The earlier intermittent failures remain tracked by T0044. The race fix may explain some of them, but the proof does not claim so.

## Scope
- 10 files, the same as declared. Lines touched are 144 (97 added, 47 deleted), within the 180-line estimate.
- No product file outside the declared list changed.

## Non-blocking notes
- **Stale outcomes:** The Execution Log outcomes entry still records 76 lines touched. Record 10 files, 144 lines, and 0 reopenings before `plan tasks stop`.
- **Unlogged rework:** The log has no entries for the Details relabel or the verifier readiness fix. Add a short entry for each before completion.
- **Combined concern:** The verifier readiness fix is a DevEx change inside a rename task. It stays within declared files and was needed for a reliable completion check, so no split is required.
- **Timeline:** `verify-ui.spec.js` last changed about 10 minutes before the final proof was written. That window fits one 7-minute full check, consistent with the final run covering the current source.
