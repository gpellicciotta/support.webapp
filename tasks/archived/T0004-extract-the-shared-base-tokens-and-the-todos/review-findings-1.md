---
task: T0004
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T09:36:26Z
reviewed_commit: "0312db4"
base_commit: "083e9a5"
branch: task/T0004-extract-the-shared-base-tokens-and-the-todos
---
# Review Findings: Task T0004 (Round 1)

## Summary
Rejected. Most of the extraction is correct and verified, but three ADR-0001 conformance defects block approval.

Verified by the reviewer:
- `python scripts/devops.py check` exits 0 at `0312db4` (vitest 8/8, Playwright 4/4, ESLint, Ruff, Markdown lint, npm pack).
- Every todos.webapp `0cf4981` primitive and semantic value matches `primitives.css` and `look.css`, renamed only as ADR-0001 lists.
- family-portal `1953f75` values for `--space-8` to `--space-12`, widths, `--gutter`, and offsets match `base.css`.
- The Inter woff2 and OFL.txt SHA-256 hashes match todos.webapp `0cf4981` byte for byte.
- The ported test keeps every original contrast pair, the status checks, the blue-distance check, and the fallback check.
- It also adds import-chain resolution, base and look ownership checks, `_` folder skipping, and the raw-color ban.

## Defects
1. **`--color-on-success` and `--color-on-warning` break the ADR-0001 meaning of `on-`, and fail contrast on their filled roles.**
   - ADR-0001 says: "Text on a filled role adds `on-` before the role: `on-primary`, `on-danger`, `on-success`, `on-warning`".
   - `look.css` sets both to `var(--color-text)`, matching `-bg` grounds (sunken gray), not the filled role.
   - `tests/unit/contract.js` codifies this: it pairs `on-success` with `success-bg`, not with `success`.
   - Measured with the test's own WCAG formula, text on the filled role:
     - `on-success` on `success`: 3.73:1 light, 1.63:1 dark.
     - `on-warning` on `warning`: 3.14:1 light, 2.12:1 dark.
   - A future filled success or warning control would ship unreadable text while the token test passes.
   - `on-primary` and `on-danger` follow the ADR and are tested against the filled role in every state.
2. **Contract `category` values do not follow ADR-0001.**
   - ADR-0001 defines a category as a heading for people, such as "Grounds", "Text", or "Main action".
   - Its sketch shows `"category": "Main action"`, and its Contract categories section lists the headings.
   - `src/contract.json` uses the lowercase group name as category for most tokens (`space`, `width`, `text`, `focus`).
   - It lumps 25 tokens into "Colors": text, lines, focus, main action, danger, success, warning, and overlay.
   - The gallery and style guide group by this field (ADR-0001, ADR-0007), so every later task inherits the mismatch.
3. **`look.css` ships public semantic tokens absent from the contract and undocumented.**
   - Tokens: `--focus-ring`, `--icon-stroke-thin`, `--color-status-in-progress`, `--color-status-completed`, `--color-status-cancelled`.
   - todos.webapp `0cf4981` uses all of them in `src/`, so the app would depend on unlisted names after the switch.
   - ADR-0001 makes `contract.json` the single list, and says apps reference only contract names.
   - The token test works around this with a hard-coded `look.name === 'neutral'` branch for the status checks.
   - A shared test that special-cases one look name will not scale to the next look.

## Process Gaps
- The neutral look page does not say where the six todos.webapp app-only tokens go.
  - Tokens: `--row-height`, `--group-header-height`, `--width-chip-max`, `--width-text-min`, `--width-segment-min`, `--height-textarea-min`.
  - Dropping them from the look is reasonable, but the adoption task needs an explicit note to keep them locally.
- The token test packs the whole contract and contrast suite into one `it` block.
  - The first failed assertion hides all later ones; the todos.webapp original reported each pair as its own test.
  - Not blocking, but per-look, per-theme, per-pair tests would make contract changes far easier to read.
- Declared files listed 13 entries; the commit touches 24.
  - The Execution Log explains the link-only doc edits, the font assets, and `.gitattributes`, so this is recorded, not hidden.
- Minor ordering: `base.css` declares `--space-8` after `--ease-standard`, and `contract.json` lists `--space-9` before `--space-8`.

Items for the user's attention in review (not defects; ADR-0001 allows aliasing existing roles):
- `--text-md` equals `--text-lg` (1.125rem), so the type scale has two names for one step.
- `--color-danger-bg`, `--color-success-bg`, and `--color-warning-bg` all equal `--color-surface-sunken`.
- `--color-warning` equals `--color-danger`, so warnings and errors share one color.

## Required Rework
1. Redefine `--color-on-success` and `--color-on-warning` as text on the filled role, like `on-primary` and `on-danger`.
   - In `tests/unit/contract.js`, pair `on-success` with `success` and `on-warning` with `warning` at 4.5:1.
   - For `-bg` grounds, pair the role or `text` color with `success-bg` and `warning-bg` instead.
   - Update the neutral look page's gap list and its usage note.
2. Replace contract `category` values with the ADR-0001 headings.
   - Use: Grounds, Text, Lines and focus, Main action, Danger, Success and warning, Overlay, Optional per look.
   - Continue with: Fonts, Type, Space, Radius roles, Lines, Elevation, Layers, Motion, Sizes, Widths.
   - Add a test assertion that each category belongs to that allowed list.
3. Resolve the five non-contract tokens in `look.css`.
   - Either add each to `contract.json` (required or optional) and document it on the look page.
   - Or move it out of the look and record that todos.webapp keeps it locally.
   - Then drive the status checks from the contract, and remove the `look.name === 'neutral'` branch.
4. Note on the neutral look page that the six app-only todos.webapp tokens stay in the app.
5. Re-run `python scripts/devops.py check` and record the new evidence in `validation-proof.md`.
