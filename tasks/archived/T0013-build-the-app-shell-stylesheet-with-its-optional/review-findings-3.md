---
task: T0013
round: 3
verdict: rejected
reviewer: "@codex"
reviewed_at: 2026-11-12T19:42:26Z
reviewed_commit: "f4f3993"
base_commit: "eb7645d"
branch: task/T0013-build-the-app-shell-stylesheet-with-its-optional
---
# Review Findings: Task T0013 (Round 3)

## Summary
**[Decided]** Rejected for the missing default scroll behavior required by ADR-0004.
The rebase is complete, and the previous layout, inset, and menu defects are fixed.
The counters decision is recorded in the Execution Log and style guide.

Reviewer verification on `f4f3993`:
- `git log main..HEAD` and `git diff main...HEAD`: inspected all three commits and the complete diff.
- `git diff --check main...HEAD`: exit 0, no output.
- `git ls-files -u` and `git status --short`: exit 0, no output.
- `python scripts/devops.py lint`: exit 0; Markdown, Ruff, formatting, and ESLint passed.
- `python scripts/devops.py tests`: exit 0; three Python tests and 2,044 JavaScript tests passed.
- `npx playwright test tests/e2e/shell.spec.js tests/e2e/verify-ui.spec.js --reporter=line`: exit 0; 218 passed, two skipped.
- Inspected the recorded mobile dark todos screenshot; it shows the expected rendered shell.
- Ran an additional Chromium probe against the test server; its default-scroll result appears below.

All launched verification commands finished before this verdict.
Playwright stopped its server; `processes list --descendants-of 6620 --format json` returned `[]` afterward.
No implementation files were changed.

## Defects
1. Medium: the unmodified `.app` shell does not implement the specified default main scroll mode.
   Location: [shell.css](../../work/T0013-build-the-app-shell-stylesheet-with-its-optional/src/css/shell.css), lines 12–40 and 257–260.
   ADR-0004's Options table defines `app--scroll-main` as the default.
   However, viewport height, constrained grid rows, and main overflow apply only when that modifier is explicitly present.
   Reproduce at 390 × 844 with the todos demo:
   - Remove `app--scroll-main` from the body, leaving `class="app"`.
   - Append a 3,000 px tall element inside the main area.
   - The document scrolls, and the top, action, and navigation bars no longer stay in place.
   The actual Chromium probe returned:

   ```text
   default {
     bodyHeight: 4110,
     viewport: 844,
     mainOverflow: 'visible',
     documentScrolls: true
   }
   ```

   Expected: an 844 px shell with an independently scrolling main area and stationary bars.
   This also affects consumers following the style guide's `<body class="app">` description without adding a scroll modifier.

## Process Gaps
- All four demo fixtures specify a scroll modifier, so the browser suite cannot detect the missing default.
- The outcome log still reports eight files and 92 lines; the branch diff reports 16 files and 1,140 changed lines.
  This discrepancy was already noted in round one and does not independently block approval.
- The recorded post-rebase full checks failed on gallery timing tests, tracked by T0036.
  Recorded isolated and full-browser reruns passed; this reviewer also obtained a clean affected-suite run.
  The reviewer did not rerun the entire completion check.

## Required Rework
1. Apply main-scroll behavior when no scroll modifier is supplied, preserving explicit page-scroll behavior.
2. Add failing-first browser coverage for `.app` without a scroll modifier at desktop and mobile widths.
3. Assert the scroll owner, viewport height, and stationary bars after scrolling tall content.
4. Record red and green evidence, then rerun the affected shell/verifier tests and the project completion check.
5. Correct the recorded outcome counts using the complete branch diff.
