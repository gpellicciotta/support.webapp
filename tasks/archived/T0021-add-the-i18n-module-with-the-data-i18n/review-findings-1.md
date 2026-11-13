---
task: T0021
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T09:50:58Z
reviewed_commit: "1d1ee2d"
base_commit: "c84a2f4"
branch: task/T0021-add-the-i18n-module-with-the-data-i18n
---
# Review Findings: Task T0021 (Round 1)

## Summary
The module meets the ADR-0003 contract and is correct.
It exports `t` and `applyTranslations`, plus a necessary `setCatalog`, since shells own loading.
All four meteo attribute mappings and single-brace interpolation are preserved.
Lookups are restricted to own properties, catalogs are copied and validated atomically, and text stays plain.
Dropping meteo's `data-i18n-html` is a recorded **[Decided]** item.
That attribute is outside the task's four attributes, and meteo markup at 8937c32 never uses it.

Reviewer verification on 1d1ee2d:
- `python scripts/devops.py check`: exit 0.
- Markdown lint, Ruff, and ESLint passed.
- pytest: 3 passed; Vitest: 454 passed; Playwright: 8 passed, including 4 i18n runs.
- The validation proof records the red run (missing module) before the green run.

Two documentation gaps block approval.
Both are small and violate explicit project rules.

## Defects
1. `docs/index.md` does not link the new `docs/specs/i18n.md`.
   The project-setup guideline requires the index to link all guide documents.
   The index already lists sibling specs (`components.md`, `naming.md`, `neutral.md`).
2. The Utility Modules table in `docs/specs/naming.md` lists `i18n.js` exports as `applyTranslations`, `t`.
   The module also exports `setCatalog`, which every shell must call.
   The table documents each utility module's exports, so it is now stale.
   The added cross-reference line below Global Hooks does not correct the table.

## Process Gaps
- Execution Log entries are out of chronological order.
  **[Decided]** and **[Size]** precede **[Read]** and **[Implement]**, which obscures the TDD sequence.
  The validation proof still establishes the red-then-green order, so this is not blocking.

## Required Rework
1. Add `docs/specs/i18n.md` to the Core Documentation list in `docs/index.md` with a one-line description.
2. Add `setCatalog` to the `i18n.js` exports cell in the Utility Modules table of `docs/specs/naming.md`.
3. Re-run `python scripts/devops.py check` and record the result.
