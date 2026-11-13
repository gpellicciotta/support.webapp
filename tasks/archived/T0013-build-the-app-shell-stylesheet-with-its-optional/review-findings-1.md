---
task: T0013
round: 1
verdict: rejected
reviewer: "@claude-2"
reviewed_at: 2026-11-12T18:30:04Z
reviewed_commit: "6b81431"
base_commit: "964b203"
branch: task/T0013-build-the-app-shell-stylesheet-with-its-optional
---
# Review Findings: Task T0013 (Round 1)

## Summary
The work is mostly solid and matches ADR-0004 closely.
- `shell.css` drops absent tracks through `:has()` and uses one 64rem breakpoint.
- The bars pad with safe-area insets, a skip link targets `#main`, and only `shell.css` sets fixed or sticky positions.
- The four demo pages follow the components.md skeletons, and the gallery links to them.
- The style guide, components.md, and CHANGELOG.md are updated; undeclared files are listed in the Execution Log.

Verification run by the reviewer on commit 6b81431:
- `npx playwright test tests/e2e/shell.spec.js --reporter=line`: exit code 0, 100 passed.
- `python scripts/devops.py check`: exit code 0.
  - Markdown lint, Ruff, and pytest (3) passed.
  - Vitest passed 2013 tests, Playwright 452, and the integration suite 4.
- A scratch probe toggled options on `shell-todos.html` at 1440 and 390 px:
  - The width options give main content widths of 760, 880, and 1120 px at 1440 px, as expected.
  - The page scroll mode with a bottom bar at 390 px keeps the action bar above the bottom bar.
  - The page scroll mode with a sidebar or side panel at 1440 px breaks; see Defects.

Rejected for one layout defect in a combination the goals require, which no test covers.

## Defects
1. **Sidebar and side panel collapse to their content height in the page scroll mode on wide screens.**
   - Location: `src/css/shell.css`, the `.app--scroll-page > :is(.app__sidebar, .app__side-panel:not([hidden]))` rule in the 64rem media query.
   - `align-self: start` with only `max-block-size: 100dvh` shrinks both columns to their content.
   - Repro: open `shell-todos.html` at 1440x900, swap `app--scroll-main` for `app--scroll-page`, open the side panel.
   - Result: the sidebar box is 140 px tall and the side panel 181 px tall.
     Their surface color and their inline border stop there; the page background shows below them.
   - The goals require every optional area in both scroll modes, and ADR-0004 lets any navigation pair with either scroll mode.
   - No adopter demo uses this pair, so `shell.spec.js` misses it.
2. Minor: the action bar ignores `env(safe-area-inset-right)`.
   - `padding-inline: max(var(--gutter), …, env(safe-area-inset-left))` applies the left inset to both sides.
   - A phone in landscape with the notch on the right puts action bar content under the notch.
   - The top bar, bottom bar, and side panel handle both sides correctly.
3. Minor: the counters demo menu button declares `aria-haspopup="menu"` and `aria-expanded="false"` but opens nothing.
   - A screen reader announces a menu that never appears.
   - Wire a small sample menu with the existing menu module, or drop the popup attributes in the demo.

## Process Gaps
1. The counters wide-screen move of actions into the top bar is listed under counters in ADR-0004's adopter settings.
   - The work marks it **[Decided]** as app-local in the style guide, without user feedback.
   - The reasoning is sound, since ADR-0004 defines no option for it.
   - A deviation from an accepted ADR's adopter settings still deserves a **[Feedback Needed]** question.
   - Not blocking on its own; confirm it with the user during rework.
2. The "Recorded task outcomes" entry reports 8 files and 92 lines; the commit touches 16 files and 1074 lines.
   - The figures match the modified tracked files only, so the recorder likely skipped new untracked files.
   - This looks like a plan tool limitation rather than an author error; noted for the record.

## Required Rework
1. Fix defect 1 so the sidebar and side panel fill the viewport height in the page scroll mode on wide screens.
   - For example, set `block-size: 100dvh` on the sticky columns, keeping `overflow-y: auto`.
2. Add a `shell.spec.js` check for the page scroll mode with a sidebar and an open side panel at 1440 px.
   - Assert that both columns span the viewport height after the document scrolls.
   - Record the failing run before the fix in validation-proof.md.
3. Fix defect 2: pad the action bar's end side with `env(safe-area-inset-right)`.
4. Fix defect 3 in the counters demo page.
5. Ask the user to confirm the counters top-bar decision (process gap 1), and record the answer.
6. Re-run `npx playwright test tests/e2e/shell.spec.js` and `python scripts/devops.py check`, and record both exit codes.
