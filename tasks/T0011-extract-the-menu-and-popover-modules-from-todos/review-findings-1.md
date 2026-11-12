---
task: T0011
round: 1
verdict: rejected
reviewer: "@claude-2"
reviewed_at: 2026-11-12T16:14:21Z
reviewed_commit: "574cd31"
base_commit: "cb19d61"
branch: task/T0011-extract-the-menu-and-popover-modules-from-todos
---
# Review Findings: Task T0011 (Round 1)

## Summary
The module extraction is faithful.
`menu.js`, `popover.js`, and `anchor.js` match todos.webapp `0cf4981` line for line, apart from indentation.
The only change is the move of `tabbableIn` to the shared `focus.js`, which the spec requires.
CSS token mapping resolves to contract tokens, and the unit tests port the todos cases plus anchor, blur, and destroy cases.

Verification I ran in the worktree:
- `python scripts/devops.py check`: exit 0.
- Markdown lint, Ruff, and ESLint all pass.
- 3 pytest, 1975 Vitest, 252 Playwright, and 4 integration tests pass, and `npm pack --dry-run` succeeds.
- All 8 `menu.spec.js` and `popover.spec.js` runs pass.

The gallery section still renders the working menu incorrectly, and the implementer's own evidence shows it.
That needs a fix before approval.

## Defects
1. **Working menu hidden behind the static popover specimen (desktop).**
   In `after-menu-bright-desktop-light.png`, the open `#menu-demo` opens downward.
   Its "Move down" and "Delete" items are hidden under the static `.popover` specimen of the next section.
   Cause: `.card-specimens` is a grid (`src/demo/gallery.css:2`), so `z-index: var(--layer-popover)` applies to the static `.menu` and `.popover` specimens.
   Each specimen then forms its own stacking context at the same layer as the fixed, anchored panel.
   The specimen comes later in the DOM, so it paints on top.
   The `[Visual]` log entry says the menus anchor correctly, but it does not mention this overlap.
   `expectAnchored` checks only geometry, so the e2e tests cannot catch it.
2. **Static menu specimens stretch at desktop width (cosmetic).**
   At 1440 px, the four-item "Status" specimen stretches to the height of the seven-item specimen beside it.
   This is the default grid `align-items: stretch`; because `.menu` is itself a grid, each item grows to about 70 px.
   See `after-menu-neutral-desktop-light.png` and `after-menu-bright-desktop-light.png`.
   The specimens then misrepresent the real item height (`--target-min`).

## Process Gaps
- The `[Visual]` step accepted screenshots without inspecting each one; defect 1 shows in the stored evidence.

## Required Rework
1. Stop static gallery specimens from painting over open anchored panels.
   For example, give the gallery's static `.menu` and `.popover` specimens `z-index: auto`, scoped to the gallery so the component CSS stays unchanged.
2. Add an e2e assertion that the open menu and popover are on top, not only inside the viewport.
   For example, use `document.elementFromPoint` at the center of the last enabled item or of the Clear button.
   Run it at the scroll position that reproduced defect 1.
3. Keep the static menu specimens at their natural height.
   For example, set `align-items: start` on the menu section's specimen grid.
4. Recapture the affected screenshots and update `validation-proof.md`.
