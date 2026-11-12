---
id: T0010
owner: "@claude"
session: claude-20261112-50bdda
needs: []
branch: task/T0010-extract-the-toast-and-live-region-modules-from
worktree: .plan/work/T0010-extract-the-toast-and-live-region-modules-from
status: active
started_at: "2026-11-12T16:27:41Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 2255.6, input: 352, output: 100358, cache_read: 24967712, cache_write: 330366}
review_status: pending
review_round: 1
---
# T0010: Extract the toast and live region modules from todos.webapp, including Undo and modal holding

## Goals
Extract the toaster as `createToast`, with `createToaster` as a deprecated alias, and the live region of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep Undo actions, persistent toasts, Ctrl+Z, and holding toasts while a modal is open.
Apply the notification tier rules of the counters ADR to the documentation.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, the todos.webapp toast and live region modules, and the counters notification ADR.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the toast partial, the toaster and live region modules, and the gallery section.
- [x] **[Verify]**    Run the toast tests and the verifier until both pass.
- [x] **[Visual]**    Capture the gallery toast section per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Decided]**
  Kept todos.webapp defaults of 8 seconds and three toasts; added role status and alert to live regions and data-toast-action hooks.

- [2026-11-12] **[Implement]**
  Touched undeclared files for the utility class, gallery wiring, and two tests that the shared page now needed.
  - reset.css: visually-hidden utility.
  - gallery.css and gallery.js: toast demo frame and toaster.
  - tokens.test.js: toast-region companion block.
  - field.spec.js: targets field__live beside the new region.

- [2026-11-12] **[Verify]**
  Unit, toast e2e, verifier, and full devops check passed; follow-up T0035 moves field announcements to live-region.js.

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 8.
  - Lines touched: 134.
  - Reopenings: 0.

- [2026-11-12] **[Read]**
  Read ADR-0003, ADR-0004, the components catalog, todos.webapp toast and live region at 0cf4981, and the counters notification ADR.

- [2026-11-12] **[Verify]**
  Both new unit suites failed on missing modules and all four toast.spec.js projects failed on the missing gallery region.

- [2026-11-12] **[Visual]**
  Toasts stay inside the demo frame in every look, theme, and width. Evidence: [before](T0010-extract-the-toast-and-live-region-modules-from/before-desktop-light.png), [after](T0010-extract-the-toast-and-live-region-modules-from/after-toast-neutral-mobile-light.png), [after dark](T0010-extract-the-toast-and-live-region-modules-from/after-toast-warm-desktop-dark.png).

- [2026-11-12] **[Doc]**
  Added the notification tiers, toast, and live region guidance to the style guide, plus CHANGELOG.md bullets.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

