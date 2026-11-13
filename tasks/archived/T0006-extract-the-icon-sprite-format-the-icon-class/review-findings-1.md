---
task: T0006
round: 1
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T11:02:42Z
reviewed_commit: "f0b0087"
base_commit: "7e2f5b7"
branch: task/T0006-extract-the-icon-sprite-format-the-icon-class
---
# Review Findings: Task T0006 (Round 1)

## Summary
The work meets every goal in the task.
- `.icon` with sm, md, and lg sizes, `currentColor` strokes, and a thin-stroke fallback on lg.
- `createIcon`, `setSpriteUrl`, and the deprecated `spriteIcon` alias in `src/js/icon.js`.
- The neutral sprite, its provenance and license note, the core id list, the gallery Icon section, and the verifier sprite checks.

Verification I ran myself:
- `python scripts/devops.py check` exited with code 0.
  - Vitest: 521 tests passed.
  - Playwright: 20 tests passed, with 33 sprite references and no problems at 390 and 1440 px.
  - Lint, Ruff, pytest, the integration tests, and `npm pack --dry-run` all passed.
- Provenance: `sed -E 's/<symbol id="/<symbol id="icon-/'` on todos.webapp `0cf4981:src/img/icons.svg` matches the new sprite.
  - The only differences are the header comment, one section comment, and the added `icon-help` glyph.
- todos.webapp `LICENSE.md` at `0cf4981` is MIT, so the license note in `neutral.md` is correct.
- `spriteIcon(doc, 'plus')` keeps todos.webapp call sites working, since the alias adds the `icon-` prefix.
- I checked the `after-dark-390.png` and `after-light-1440.png` captures.
  - All 30 glyphs and the three sizes render, and the grid does not overflow.
- `validation-proof.md` records the failing tests from before the implementation.

## Defects
None blocking. Non-blocking observations:
- The `fab` skeleton in `docs/specs/components.md` references `icons.svg#icon-add`, but the neutral sprite names that glyph `icon-plus`.
  - The new style guide line says components reference only core ids.
  - The FAB glyph is app content, so this is acceptable for now.
  - The FAB task should align the id or add it to the core list.
- `collectSprites` in `tests/e2e/verify-ui.spec.js` fetches and parses every `<use>` target as an external SVG.
  - A same-document reference such as `href="#icon-x"` would be falsely reported as unresolved.
  - The gallery uses only external sprites, so nothing fails today.

## Process Gaps
- The commit message has 22 words; the global limit is 20.
  - This is minor and does not need a rewrite of history.

## Required Rework
None.
