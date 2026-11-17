---
id: T0238
owner: "@claude"
session: claude-20261117-19c8ee
needs: []
branch: task/T0238-align-buttons-in-banners-rows-forms-and-cards
worktree: .plan/work/T0238-align-buttons-in-banners-rows-forms-and-cards
status: active
started_at: "2026-11-17T12:31:51Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 2798.4, input: 154, output: 55176, cache_read: 9203712, cache_write: 156349}
  review: {turns: 1, duration_s: 85.4, input: 38217, output: 1749, cache_read: 312448, cache_write: 0}
review_status: pending
review_round: 2
review_requested_at: "2026-11-17T13:21:21Z"
review_session: codex-20261117-bf455a
work_duration: 1571.8
---
# T0238: Align buttons in banners, rows, forms, and cards, and recolor the error summary title and links

## Goals
In banners with a button, make the button's top and bottom space match its end space to the banner border.
In rows with buttons, put the button label on the row text's baseline, by lowering the button or raising the row.
Align row-end buttons to the row's end edge.
Make buttons in forms and cards flow to the end edge instead of the start.
Color the error summary title with the danger color, and keep its links in the text color, as error banners do.
The user requested this after reviewing the gallery on 2026-11-17.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0238.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Wrote button-alignment.spec.js and proved 24 failures, then aligned banner, row, card, and error summary styles.
  - Banner end padding matches block padding; wrapped actions move end.
  - Rows top-align; text pads its first line to the target.
  - Added .card__actions; forms already flowed to the end edge.

- [2026-11-17] **[Verify]**
  New spec passes in four projects; the full check passed apart from generate-app, fixed by npm install.
  - Proof and screenshots: validation-proof.md and screenshots/.
  - npm install synced the lockfile version to 0.1.1-pre.

- [2026-11-17] **[Doc]**
  Updated the visual style guide, components spec, and CHANGELOG for banners, rows, cards, and the error summary.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 8.
  - Lines touched: 87.
  - Reopenings: 0.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-17] **[Review]**
  Round 1 rejected by @codex: [Decided]** Rejected for one unmet banner spacing goal.
  - Findings: [review-findings-1.md](T0238-align-buttons-in-banners-rows-forms-and-cards/review-findings-1.md).

- [2026-11-17] **[Implement]**
  Addressed review round 1: banner actions wrap below text that would need a second line, so all three spaces match.
  - Text starts at its one-line width, capped beside the icon.
  - Banner test now checks five widths, inline and wrapped.

- [2026-11-17] **[Verify]**
  Stricter banner test failed first, then passed in four projects; lint, unit, browser, and integration suites passed.
  - One intermittent form test passed on rerun; tracked in T0244.
  - Main's unformatted icon script fails Ruff; tracked in T0243.

- [2026-11-17] **[Doc]**
  Documented that banner actions wrap below multiline text, in the style guide and CHANGELOG.

- [2026-11-17] **[Verify]**
  Recorded task outcomes after review rework.
  - Files touched: 8.
  - Lines touched: 81.
  - Reopenings: 0.

- [2026-11-17] **[Review]**
  Round 2 requested (mode: agent).

