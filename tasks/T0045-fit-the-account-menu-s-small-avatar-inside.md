---
id: T0045
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0045: Fit the account menu's small avatar inside its round button, which it overhangs by 2 px on each side

## Goals
`.account-menu__button` is `--target-min` (2.75rem) square, but its `.avatar--sm` face is `--space-9` (3rem).
The face overhangs the round target by 2 px on each side, and pushed a todos.webapp gallery section past 390 px in CI.
Size the face inside the button, such as `calc(var(--target-min) - var(--space-1))`, keeping `.avatar--sm` elsewhere unchanged.
todos.webapp 0.5.1-pre works around it in `src/css/app-chrome.css`; drop that rule after it vendors the fix.
Completion check: `npx playwright test tests/e2e/account-menu.spec.js` passes with a new face-inside-button assertion.
Size estimate: 3 files, 30 lines.

## Task Execution Steps
- [ ] **[Implement]** Add a failing e2e assertion that each account button's avatar stays within the button box.
- [ ] **[Verify]**    Run the account menu spec and confirm the 2 px overhang failure.
- [ ] **[Implement]** Size the avatar inside the account button in `src/css/components/account-menu.css`.
- [ ] **[Verify]**    Run the account menu spec, the gallery specs, and the unit suite.
- [ ] **[Doc]**       Update the account menu docs if they state the face size, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-15] **[Doc]**
  Found in todos.webapp CI: a 48 px face in a 44 px button; workaround shipped there in commit 77d0fc3.
