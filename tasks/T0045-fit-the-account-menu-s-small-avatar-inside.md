---
id: T0045
owner: "@claude"
session: claude-20261117-7aedf4
needs: []
branch: task/T0045-fit-the-account-menu-s-small-avatar-inside
worktree: .plan/work/T0045-fit-the-account-menu-s-small-avatar-inside
status: active
started_at: "2026-11-17T02:59:20Z"
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
- [x] **[Implement]** Add a failing e2e assertion that each account button's avatar stays within the button box.
- [x] **[Verify]**    Run the account menu spec and confirm the 2 px overhang failure.
- [x] **[Implement]** Size the avatar inside the account button in `src/css/components/account-menu.css`.
- [x] **[Verify]**    Run the account menu spec, the gallery specs, and the unit suite.
- [x] **[Doc]**       Update the account menu docs if they state the face size, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-15] **[Doc]**
  Found in todos.webapp CI: a 48 px face in a 44 px button; workaround shipped there in commit 77d0fc3.

- [2026-11-17] **[Doc]**
  Added face-inside-button e2e assertion, sized .avatar--sm in .account-menu__button, allowed avatar companion in purity unit test, updated CHANGELOG. generate-app integration test fails on environment issue; see validation-proof.md.

- [2026-11-17] **[Verify]**
  Account menu spec failed before the fix with a 4 px width overhang and passed after it.

- [2026-11-17] **[Verify]**
  Full check passed except generate-app integration, which lacks @stylistic/eslint-plugin in its temp app.

