---
task: T0019
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T19:14:22Z
reviewed_commit: "2a46ccf"
base_commit: "eb7645d"
branch: task/T0019-design-and-add-an-accessible-switch-component
---
# Review Findings: Task T0019 (Round 1)

## Summary
The switch follows the catalog skeleton: a native checkbox with `role="switch"`, no duplicated `aria-checked`, and 44 px label targets.
It covers all requested states. Thumb position, not only color, conveys the state, and the eight screenshots render correctly.
The unit suite passed with 2049 tests and exit 0 (`npx vitest run`).
The switch browser spec passed 12 of 12 (`npx playwright test tests/e2e/switch.spec.js --workers=2`).
Rejected for one accessibility defect, two documentation and gallery placement defects, and tests too weak to catch the defect.

## Defects
1. **Forced colors: the focus ring ignores the user's palette.**
   `forced-color-adjust: none` on `.switch__control` (`src/css/components/switch.css:82`) also stops the system from recoloring the outline.
   The focus ring and the invalid outline therefore keep the author tokens `--color-focus` and `--color-danger`.
   Probe: Chromium with `emulateMedia({ forcedColors: 'active' })`, focusing the gallery controls.
   - Switch, forced light: `rgb(30, 64, 175) solid 2px`, the same as without forced colors.
   - Switch, forced dark: `rgb(143, 168, 240) solid 2px`, the author's dark token.
   - Checkbox, same page: system colors `rgb(55, 0, 110)` and `rgb(26, 235, 255)`.
   This breaks the style guide's claim that "forced colors preserve the track, thumb, and focus outline", as well as the Focus principle.
   A user's high-contrast theme may give an author color poor contrast.
2. **Gallery section order disagrees with the table of contents.**
   The TOC and `style.css` list Checkbox, then Switch, then Radio.
   In the page, `<section id="switch">` (line 591) comes before `<section id="checkbox">` (line 606).
   The inserted block also adds a stray blank line before the checkbox section. The neighboring sections have none.
3. **Style guide placement.** `## Switch` is a new top-level section between `## Shell` and `## Gallery`.
   It sits outside `## Components`, where `### Controls` and `### Fields and forms` document sibling controls.
   It also lacks the `---` separator that ends the guide's other top-level sections.
   The switch should be a `###` under Components, or a row in the Controls table with its notes.
4. **Catalog drift (minor).** The implementation adds an invalid state with `aria-invalid` and `aria-describedby`.
   The `switch` row in `docs/specs/components.md` still lists only "off, on, disabled".

## Process Gaps
- Weak assertions in `tests/e2e/switch.spec.js` let Defect 1 through:
  - The forced-colors check asserts `borderTopStyle === 'solid'`, which holds in any mode. It never checks the focus outline color.
  - The RTL check compares `::before` `margin-inline-start` (`auto` against `0px`). That value does not depend on `dir`, so it cannot detect an RTL layout fault.
    Compare the thumb's bounding box with the track's edges instead.
- The `switch visual evidence` test scaffolds evidence capture inside the permanent suite. It is the only spec that does so.
  It writes to a directory read from `SWITCH_SCREENSHOTS`, and with `SWITCH_BASELINE` set it captures `#checkbox`.
  Its one assertion repeats the gallery verifier's zero-problems check.
- `validation-proof.md` shows red-phase output only for the unit tests.
  The Execution Log says the new browser tests also failed first, but the proof records no browser output for that run.

## Required Rework
1. Under `@media (forced-colors: active)`, give the focus outline a system color, such as `Highlight`.
   Give the invalid outline a distinct system color or style as well.
   Alternatively, drop `forced-color-adjust: none` and style the track and thumb with system colors.
2. Add a browser assertion that the focused switch's outline color changes under forced colors and is a system color.
   It should fail on the current code.
3. Fix the RTL assertion so it checks where the thumb actually sits in RTL.
4. Move the gallery `#switch` section after `#checkbox`, matching the TOC and import order. Remove the stray blank line.
5. Move the switch guidance under `## Components` in `docs/specs/visual-style-guide.md`, and add the switch to the Controls table.
6. Add the invalid state to the catalog's `switch` row in `docs/specs/components.md`.
7. Remove the environment-driven screenshot test from the suite, or document why it stays.
