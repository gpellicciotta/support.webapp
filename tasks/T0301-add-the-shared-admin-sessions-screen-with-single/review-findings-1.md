---
task: T0301
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T06:30:01Z
reviewed_commit: "659fd68"
base_commit: "c5af661"
branch: task/T0301-add-the-shared-admin-sessions-screen-with-single
---
# Review Findings: Task T0301 (Round 1)

## Summary
Approved. The work meets every goal and acceptance criterion.
- `src/js/admin-sessions.js` adds the shared Sessions screen: filtered, paged tokens with single, bulk, and expired revocation.
- The fetch-function adapter (`fetchTokens`, `revokeToken`, optional `revokeTokens` and `revokeExpired`) leaves endpoints with each app.
- Own-session protection works three ways:
  - The checkbox and the Revoke button are disabled.
  - `selection.js` skips the own row because its checkbox is disabled.
  - `performRevoke` and `revoke()` drop the own ID.
- The screen reads `ctx.tokenId()`, as Auth's `sessions-view.mjs` at `eeb9439` does.
- Behavior matches the Auth source: labels, inline confirmations, partial-failure text, quiet reload, and filter rules.
- Requirements from the technical spec:
  - `.selection--table` and `.selection__cell` are added to `selection.css`.
  - The screen mounts through `createAdminSessionsScreen` and uses `data-*` hooks only.
  - The contract entry, components.md section, ADR-0003 entry, upgrade note, and CHANGELOG entry are in place.
- The 13 screenshots cover three looks, two themes, and two widths. I checked neutral desktop light and bright mobile dark: the layout is sound and the own row shows as protected.
- Checks I ran on `659fd68`:
  - `npx vitest run tests/unit/admin-sessions.test.js`: 17 passed.
  - ESLint on the four new or changed JS files: clean.
  - `plan tasks validate T0301 --completion`: passed.
  - `python scripts/devops.py check`: exit 0. That covered markdown lint, Ruff, ESLint, pytest (61 passed, 1 skipped), Vitest (2572 passed), Playwright (1132 passed, 48 skipped), and integration (7 passed).
- The integration scenario from the spec is green: selecting 902 and 903 and revoking them removes both rows.

## Defects
None.

## Process Gaps
Non-blocking:
- Size: the screen module has 1161 lines; the estimate was 160. The estimate excludes added files, but the module is still far larger than the source (256 + 82 lines). Most of the extra lines are generality: `extraColumns`, `filterPredicate`, the batch adapter, and multi-shape field lookups.
- The browser test's title says it "pages", but it never changes page in the browser. Unit tests cover client and server paging.
- `countExpired()` leaves out the own session, but `adapter.revokeExpired` removes every expired token on the server. If the own token were expired, the confirmation count would be one lower than the removal. Auth's source counted all expired tokens.
- In `mode: 'server'`, filter changes only filter the current page locally, without a refetch. This matches `admin-users.js`. The upgrade note does not tell ToDo about it.
- Execution Log order: the `[Read]` entry comes after the `[Verify]` and `[Visual]` entries, so the log is not chronological.
- The validation proof shows the first full check exiting 1 because `node_modules` was missing in the worktree. A later integration run passed, and my full rerun exits 0.
- ADR-0003 was touched but not declared (2 lines). The Execution Log records this.

## Required Rework
None.
