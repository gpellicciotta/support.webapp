---
task: T0286
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T21:23:15Z
reviewed_commit: "62b6006"
base_commit: "6a930d9"
branch: task/T0286-add-a-screen-action-bar-renderer-for-the
session: claude-20261123-b3c9cd
session_agent: claude-code
session_created_at: 2026-11-23T21:13:31Z
---
# Review Findings: Task T0286 (Round 1)

## Summary
Approved. The work meets every goal and acceptance criterion.
- `src/js/screen-action-bar.js` keeps the behavior of Auth's `setScreenActions` and `renderActionBar` (`app-shell.mjs` at `eeb9439`):
  - Links get `aria-disabled`; buttons get native `disabled`.
  - Disabled reasons show as hints, and an empty bar is removed.
  - The bar redraws on `action-state-changed`.
- It builds DOM nodes instead of `innerHTML`, so all text and attributes are escaped.
  This also fixes Auth's unescaped `data-action="${action.id}"`.
- It finds its elements through `data-*` hooks only.
- Disabled-link clicks are blocked. Enabled clicks go to `onAction`.
- The `screen-action-bar` contract entry, the components.md row and upgrade note, the ADR-0003 and ADR-0004 entries, and CHANGELOG are present.
- Unit tests cover buttons, links, disabled state, hints, removal when empty, redraw, escaping, destroy, and RoutedView attach and detach.
- The browser test drives the portal demo through attach, state change, and detach.
- I reran `python scripts/devops.py check` on `62b6006`. It exited 0:
  - All 28 Markdown files passed lint; Ruff and ESLint were clean.
  - pytest: 61 passed, 1 skipped.
  - Vitest: 2346 tests passed in 46 files.
  - Playwright: 974 passed, 42 skipped.
  - Integration: 7 passed. Pack dry run: OK.
- `plan tasks validate T0286 --completion` passes.
- I inspected two of the screenshots: neutral light desktop and bright dark mobile.
  Both show the bar with Export enabled and Publish and Calendar disabled.

## Defects
None.

## Process Gaps
- Execution Log order is wrong: the `[Read]` and red-phase `[Verify]` entries come after the `[Implement]` and green `[Verify]` entries.
  The red-phase output in validation-proof.md is consistent with TDD, but the log reads as if it was written afterward.
- The `[Visual]` log entry links six screenshots and leaves out `after-warm-light-desktop.png` and `after-bright-light-desktop.png`.
  validation-proof.md lists all seven.
- The first green `devops.py check` exited 1 because `node_modules` was missing.
  The proof then shows only the suites rerun one by one, not a single full rerun that exits 0.
  My rerun closes this gap.
- Six files were touched against four declared; the extra three are ADR-0003, ADR-0004, and CHANGELOG.
  132 lines were touched against an estimate of 70. The log records the extra ADR edits.
- `shell-portal.html` turned `<footer class="app__action-bar">` into a `<div>`, so the portal demo loses its `contentinfo` landmark.
  Its placeholder footer text is replaced on the first render.
  The Sample calendar text still says "the footer moves from a fixed position into the action bar".
- The `data-action` item attribute is inherited from Auth for delegated handling, but it does not follow naming.md's `data-{key}-{name}` hook rule.
  `data-screen-action-bar-item` is the conforming hook. A short note in components.md on why `data-action` is kept would help.
- When the focused button becomes disabled during a redraw, focus falls back to `body`.
  The redraw only restores focus to enabled matches.
- The module is 221 lines against the 34-line source, adding options for `getAction`, `events`, `eventType`, `before`, `document`, and `onAction`.
  These options are documented and tested but widen the public API beyond the spec.

## Required Rework
None.
