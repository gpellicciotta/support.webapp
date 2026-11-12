---
task: T0023
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T15:28:13Z
reviewed_commit: "f6b935d"
base_commit: "c39b0d9"
branch: task/T0023-add-the-meteo-look-with-its-accent-variant
---
# Review Findings: Task T0023 (Round 1)

## Summary
The bright look is mostly complete. It is registered in the gallery and has blue, yellow, and red accents, system fonts, a sprite, docs, and tests.
I re-ran `python scripts/devops.py check` (worktree `.venv` Python) on `f6b935d` and it exited 0.
Results: lint clean, 3 Python, 1915 unit, 236 browser, and 4 integration tests passed, and the pack dry run succeeded.
The worker wrote the failing test first and kept before/after evidence.
Palette, font stack, radii, and glyphs match meteo `8937c32`, which I checked directly in the meteo repository.

Rejected for these reasons:
- The light-dark fallback path breaks root accents.
- One fallback ground falls below the 3:1 icon contrast the task claims for every accent.
- The ADR and roadmap no longer match the palette changes.
- The primitive names are misleading.
- The glyph origin is recorded incompletely.

## Defects
1. **Fallback cascade ignores root accents.** In `src/looks/bright/look.css:98`, the fallback block selects `:root, :root[data-theme]`, which has specificity (0,2,0).
   The fallback accent rules at lines 120-143 are bare `[data-accent="…"]`, which has specificity (0,1,0).
   Browsers without `light-dark()` therefore keep blue `--color-primary*` and `--color-on-primary` when `<html data-theme="light|dark" data-accent="yellow|red">` is set.
   Warm avoids this because its fallback root block never sets accent tokens. Bright's accents redefine root-block tokens, so it does not.
   `docs/specs/looks/bright.md` says that "Browsers without `light-dark()` receive explicit light values for every accent." That is false for root accents with an explicit theme.
   The static test in `tests/unit/tokens.test.js` compares declared values only, not cascade outcome, so it misses this.
2. **Fallback surface-active differs from the modern path and fails 3:1.** The modern path sets `--color-surface-active: var(--color-surface-sunken)`, which is `#f8fafc` in light (line 8).
   The fallback sets `--gray-200`, which is `#e2e8f0` (line 105).
   Yellow `#b88000` on `#e2e8f0` is 2.78:1, below the contract's 3:1 `primary` on `surface-active` icon pair. I computed this with the WCAG formula.
   Scenario: a fallback browser shows a pressed `.icon-button` in its active state (`icon-button.css:43-45`) under the yellow accent.
   The fallback comparison test misses this because `surface-active` is an alias in the modern path.
3. **ADR-0002 and the roadmap are now stale.** ADR-0002 Consequences records a user decision about yellow labels only. It says meteo keeps its look through one override, the yellow `--color-on-primary`.
   The roadmap (line 115) repeats the single-override expectation.
   The implementation changes more than that:
   - Light yellow fill: `#ca8a04` to `#b88000`.
   - Dark blue: `#2563eb` to `#60a5fa`, with dark labels.
   - Dark red: `#dc2626` to `#f87171`, with dark labels.

   meteo will now need several overrides for a lossless switch. These changes have AA reasons, but they were not decided with the user and are not recorded in the ADR.
4. **Primitive names misdescribe their values.** `src/looks/bright/primitives.css` reuses the template's names with unrelated values:
   - `--orange-*` holds reds (`#b91c1c`, `#f87171`).
   - `--navy-50` is a gray (`#f8fafc`).
   - `--gray-100` (`#f8fafc`) is lighter than `--gray-50` (`#f5f7fa`).
   - `--gray-850` (`#141f33`) is darker than `--gray-900` (`#1e293b`).
   - `--navy-700` equals `--navy-800`.
   - `--sky-600` and `--sky-400` are unused.

   Warm uses names that describe its palette. Bright's names will mislead maintainers and meteo's adoption work.
5. **Glyph provenance is incomplete.** The imported meteo glyphs are Feather Icons drawings, MIT, copyright Cole Bemis:
   - `check`: `polyline 20 6 9 17 4 12`.
   - `close`: two lines.
   - `help`: `M9.09 9a3 3 0 0 1 5.83 1…`.
   - The `settings` gear path, verbatim.

   ADR-0002 Evidence says each extraction task records glyph origin and license. `bright.md` gives only meteo's MIT notice and says no third-party attribution exists. MIT requires keeping the original copyright notice.
6. **Style guide entry is misplaced.** `docs/specs/visual-style-guide.md:2` adds bright as a stray first sentence, above the guide's intro.
   The list of looks at line 8 (`- Looks: [neutral]…, [warm]…`) still leaves bright out.

Minor, non-blocking:
- The `#accents` gallery section is written as unindented single-line markup, unlike the surrounding HTML.
- `configureAccents` sits between `looks` and `themes` with no blank line. It also hard-codes accent lists.
- Test names for non-bright looks end with a trailing space (`verify-ui.spec.js:321`).
- Hover and active fills are identical for blue (`navy-700` = `navy-800`) and red, and that is undocumented. Yellow's identical states are documented.

## Process Gaps
- The spec promised to "validate fallbacks", but verification only compares declared values. Nothing checks cascade outcome or alias-resolved fallback grounds against the contrast matrix.
- The worker made design decisions beyond the ADR's recorded user decision without updating the ADR or flagging them for feedback. These were the dark blue and red label flips and the light yellow fill change.
- The contract change in `tests/unit/contract.js` removes `primary` from the 4.5:1 text pairs for every look.
  It is justified, because components use `primary` only for icons, borders, and fills, and the 3:1 icon pairs remain.
  But this shared-contract relaxation is not recorded in ADR-0001, ADR-0007, or the style guide.

## Required Rework
1. Make fallback accents win on the root. For example, select `[data-accent="…"], :root[data-theme][data-accent="…"]`, or move the primary tokens out of the `:root[data-theme]` fallback rule.
   Add a test that fails on the current cascade, such as a selector-specificity assertion or a fallback-forced browser check.
2. Make the fallback `--color-surface-active` match the modern light value. Then extend the per-accent fallback test to resolve aliases and check `contrastPairs` against fallback values.
3. Record the extra palette deviations and their AA reasons in ADR-0002 Consequences.
   Update the roadmap's meteo override expectations, or mark them **[Feedback Needed]** for the user.
4. Rename bright's primitives to names that match their values, such as `slate`, `blue`, and `red`, in correct lightness order. Drop the unused primitives.
5. Record the Feather Icons origin, MIT, copyright Cole Bemis, in `bright.md` and the sprite comment.
6. Move the style guide entry into the line-8 list of looks.
7. Record the shared `primary` contrast-pair change in the relevant ADR or style guide section.
