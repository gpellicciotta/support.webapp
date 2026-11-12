---
id: T0028
owner: "@codex"
session: codex-20261112-8121f7
needs: []
branch: task/T0028-extract-the-floating-action-button-from-todos-webapp
worktree: .plan/work/T0028-extract-the-floating-action-button-from-todos-webapp
status: active
started_at: "2026-11-12T21:18:06Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 4, duration_s: 1370.4, input: 234686, output: 29044, cache_read: 10331392, cache_write: 0}
work_duration: 239.4
review_status: pending
review_round: 1
---
# T0028: Extract the floating action button from todos.webapp into the overlay layer of the shell

## Goals
Extract todos.webapp's floating action button as the `fab` component, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
It is the one fixed control, placed in the overlay layer of the shell of ADR-0004.
todos.webapp needs it for a lossless switch, so it lands before the todos.webapp adoption.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, components.md, naming.md, and the source app at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the fab partial, its shell placement, and its gallery section.
- [x] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [x] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Visual Verification
Before captures show the adjacent icon-button section; the fab section did not exist.
- desktop-light: [before](T0028-extract-the-floating-action-button-from-todos-webapp/before-desktop-light.png), [after](T0028-extract-the-floating-action-button-from-todos-webapp/after-desktop-light.png).
- desktop-dark: [before](T0028-extract-the-floating-action-button-from-todos-webapp/before-desktop-dark.png), [after](T0028-extract-the-floating-action-button-from-todos-webapp/after-desktop-dark.png).
- mobile-light: [before](T0028-extract-the-floating-action-button-from-todos-webapp/before-mobile-light.png), [after](T0028-extract-the-floating-action-button-from-todos-webapp/after-mobile-light.png).
- mobile-dark: [before](T0028-extract-the-floating-action-button-from-todos-webapp/before-mobile-dark.png), [after](T0028-extract-the-floating-action-button-from-todos-webapp/after-mobile-dark.png).

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.

- [2026-11-12] **[Read]**
  Read ADR-0003, ADR-0004, naming, catalog, and todos.webapp at 0cf4981f2fa235a4d48d143b83db24e1f46bd48a. Added shell-todos.html and components.md to declared scope for placement evidence and catalog documentation.

- [2026-11-12] **[Verify]**
  All eight browser cases failed because the fab gallery section and shell overlay control were absent. Captured before screenshots at both widths in both themes.

- [2026-11-12] **[Implement]**
  Added the fab partial, shell placement, gallery states, catalog documentation, and changelog. Browser runs used npx playwright test tests/e2e/fab.spec.js --workers 2; sessions 97258 and 62617 reported server PIDs 23656 and 16864.

- [2026-11-13] **[Verify]**
  Visual inspection found unresolved icon-add references; corrected them to icon-plus. Stopped affected verification trees with processes kill 57320 68588 --yes --force after graceful termination failed.

- [2026-11-13] **[Verify]**
  Final verification: python scripts/devops.py check, session 84601. Markdown, Ruff, ESLint, and three Python tests passed. Previous verification was interrupted after visual inspection found missing icon symbols.

- [2026-11-13] **[Verify]**
  Final browser suite launched through python scripts/devops.py check; npm run test:slow reported PID 16248, server PID 78956. Unit tests passed: 25 files and 2062 tests.

- [2026-11-13] **[Visual]**
  Before captures show the neighboring icon-button section because fab did not exist. After captures show the new fab states; corrected missing sprite references during inspection.

- [2026-11-13] **[Decided]**
  Kept fixed placement in shell.css and mapped source signal colors to shared primary roles. Size remained below the typical line: six counted files and 52 changed lines; nine total files including additions and changelog.

- [2026-11-13] **[Verify]**
  Desktop themes and mobile light passed the full gallery verifier across looks and accents, including contrast, touch targets, focus outlines, stylesheet loading, sprite references, and zero horizontal overflow.

- [2026-11-13] **[Visual]**
  Inspected all four corrected fab captures: 390 and 1440 pixels, light and dark. Plus icons, distinct states, focus outlines, wrapping, and disabled presentation render correctly; screenshot links appear above.

- [2026-11-13] **[Verify]**
  python scripts/devops.py check passed: 2062 unit tests, 530 browser tests, two conditional skips, integration tests, lint, and packaging. Recorded verbatim summaries in validation-proof.md. All execution steps are complete; agent review remains orchestrator-owned.

- [2026-11-13] **[Verify]**
  Counted outcome: Files touched: 6; Lines touched: 52; Reopenings: 0. Added files and CHANGELOG.md are excluded. Total staged scope is nine files and 145 changed lines. Completion validation passed.

- [2026-11-13] **[Review]**
  Committed implementation as 1e4ced8. All non-review steps are checked, completion validation passed, and no test servers remain. Awaiting orchestrator-managed agent review.

- [2026-11-13] **[Review]**
  Round 1 requested (mode: agent).

