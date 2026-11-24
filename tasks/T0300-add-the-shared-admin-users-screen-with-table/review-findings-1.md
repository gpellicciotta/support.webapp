---
task: T0300
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T05:50:20Z
reviewed_commit: "f290e65"
base_commit: "f6ee255"
branch: task/T0300-add-the-shared-admin-users-screen-with-table
---
# Review Findings: Task T0300 (Round 1)

## Summary
Approved.
The work meets every goal and acceptance criterion.
`admin-users.js` promotes Auth's and ToDo's `users-view.mjs` into a shared screen.
It covers the filtered, paged table, the detail and New user panels, and inline-confirmed deletion.
Mark for deletion pairs with restore, which provides the undo.
The screen takes a data adapter of fetch functions.
It exposes `extraColumns`, `extraFacts`, and `extraSections` hooks, so Auth's credential sections stay app-local.
It mounts in the T0293 frame via `createAdminUsersScreen`, builds with the T0294 builders, and uses only `data-admin-users-*` hooks and ARIA state.
Its danger zone matches Auth's source (`../auth/webapp/admin/js/users-view.mjs`, lines 450-476).

Reviewer verification on `f290e65`:
- `python scripts/devops.py check` exited 0.
- Results: 28 markdown files, ruff, eslint, 61 pytest, 2555 Vitest, 1116 Playwright (48 skipped), and 7 integration tests.
- `plan tasks validate T0300 --completion` passed.
- The unit tests cover filters, client and server paging, panel content, extension hooks, creation, deletion, restore, and stale-fetch races.
- The browser test covers selecting a user, opening the panel, and New user adding a row, plus look, theme, and width checks.
- The 13 screenshots show the screen and panel across looks, themes, and widths, consistent with the sibling screens.

## Defects
None.

## Process Gaps
Non-blocking findings:
1. Scope accounting is inaccurate.
   The diff touches 6 non-added files with 214 lines.
   The log records 5 files and 213 lines.
   `CHANGELOG.md` and the ADR-0003 entry fall outside the Declared Files.
   The log mentions only the ADR.
2. The browser test title says "pages", but the test never clicks the pager.
   The unit tests cover paging, and the spec's integration scenario does not require it.
3. The demo exercises only `extraFacts`.
   Only the unit tests exercise `extraColumns` and `extraSections`.
4. `Restore account` is disabled on the signed-in account (`admin-users.js:1276`).
   Auth's source never disabled it.
   The guard rarely matters, because marking one's own account is already disabled.
5. The restore confirm comment promises primary styling (`admin-users.js:1290`).
   The code only removes `button--danger`.
6. Permanent deletion focuses the `New user` button after closing the panel.
   ToDo's configuration omits `adapter.createUser`, so focus falls to the document body there.
7. At desktop width, the `Last active` column wraps timestamps across three lines (neutral desktop screenshot).
   This is cosmetic.
8. The validation proof logs a first `devops.py check` run that exited 1.
   `node_modules` was missing in the worktree at that point.
   The reviewer's rerun exited 0.

## Required Rework
None.
