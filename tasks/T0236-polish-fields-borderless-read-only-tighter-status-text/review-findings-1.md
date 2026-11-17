---
task: T0236
round: 1
verdict: rejected
blocking: 1
reviewer: "@codex"
reviewed_at: 2026-11-17T12:18:55Z
reviewed_commit: "0ed959e"
base_commit: "643efb6"
branch: task/T0236-polish-fields-borderless-read-only-tighter-status-text
---
# Review Findings: Task T0236 (Round 1)

## Summary

**[Decided]** Rejected for one select rendering regression in forced-colors mode.
The remaining changes meet the goals in the inspected screenshots and affected browser tests.

Reviewer verification:

- `npx playwright test tests/e2e/field-polish.spec.js tests/e2e/field.spec.js --reporter=list`: exit 0; 44 passed (21.0s).
- `python scripts/devops.py lint`: exit 0; Markdown, Ruff, formatting, and ESLint passed.
- Inspected the recorded full-check evidence and supplied desktop/mobile screenshots.
- A separate Chromium probe loaded the actual field stylesheet and emulated forced colors; the browser closed after completion.

## Defects

1. **Blocking:** Forced-colors mode removes the select arrow.
   Location: `src/css/components/field.css:130-148` and `src/css/components/field.css:256-263`.
   The replacement uses linear gradients, which Chromium suppresses in forced-colors mode.
   Setting their color to `CanvasText` does not preserve these background images.
   Because `appearance: none` also suppresses the native arrow, selects lose their dropdown affordance.
   This regresses the previous native select rendering for high-contrast users.

   Reproduction: load the field stylesheet around a single `.field__control` select in Playwright Chromium.
   Read computed styles, call `page.emulateMedia({ forcedColors: 'active' })`, and read them again.
   Actual probe output, exit 0:

   ```text
   normal: appearance = none; backgroundImage = linear-gradient(...), linear-gradient(...)
   forced-colors: appearance = none; backgroundImage = none, none
   ```

   The normal gradient value above is abbreviated; the forced-colors values are verbatim.

## Process Gaps

- **Non-blocking:** The outcomes log reports five files and 155 lines; the reviewed diff contains seven files and 332 insertions/deletions.

## Required Rework

1. Preserve a visible dropdown arrow in forced-colors mode, for example by restoring native appearance in that media query.
2. Add a forced-colors regression test that verifies the arrow survives through native appearance or a rendered replacement.
3. Rerun the affected browser tests and lint checks, recording the results.
