---
task: T0288
round: 2
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T01:41:30Z
reviewed_commit: "120481d"
base_commit: "67d1749"
branch: task/T0288-add-paged-and-filtered-table-state-kept-in
session: claude-20261124-aa39e9
session_agent: claude-code
session_created_at: 2026-11-24T01:37:21Z
---
# Review Findings: Task T0288 (Round 2)

## Summary
Commit `120481d` resolves both round 1 blocking defects, and no blocking regressions were found.

Round 1 rework verification:
1. `applyEnvelope` now computes `serverParams(direction)` before it replaces `state.envelope`.
   A `current` replay now repeats the request that loaded the page.
2. Server mode now defaults `pageKey` to `null`.
   The page number no longer reaches the hash, and a reload with `#?page=2` labels the first page "Page 1".
   Client mode still persists and restores `page`.

Checks run in the worktree at `120481d`:
- `npx vitest run tests/unit/table-state.test.js`: 20 passed, including the two new regression tests.
- `npx vitest run`: 53 files, 2458 tests passed.
- `npx eslint .`: exit 0.
- `lint-markdown check --offline`: 28 files passed.
- `plan tasks validate T0288 --completion`: passed.
- `npx playwright test tests/e2e/table-state.spec.js`: 2 passed, 2 skipped (mobile).
- `npx playwright test` on the `shell`, `shell-additions`, and `verify-ui` specs: 296 passed, 32 skipped.

The round 1 probe script, rerun against the new module, prints:

```text
replay current after next: page=next&page-size=20&page-bookmark=b1
hash after next: #/users
reload state: {"page":1,"pageNumber":1} params current: page=first&page-size=20
client reload page: 2
```

I did not rerun the full `python scripts/devops.py check`.
The commands above cover what changed in this round.

## Defects
None.

## Process Gaps
- Non-blocking: `setSize` now clears `state.params`, but `setFilter`, `setFilters`, and `resetFilters` do not.
  They reset `pageNumber` to 1, but `serverParams('current')` still replays the old page's bookmark.
  Apps that load `first` after a filter change, as ToDo does, are unaffected.
- Non-blocking: the default `pageKey: null` applies to all server mode, including offset paging, where pages are addressable.
  The JSDoc and `components.md` call it the "bookmark mode" default.
  Offset users must pass `pageKey: 'page'` explicitly, which no doc says.
- Non-blocking: without `params`, the saved replay omits filter `extra` values.
  Apps that send filters must pass `params` to `applyEnvelope`, but the docs never say so.
- Carried from round 1: the module is much larger than the 120-line estimate, and no demo or browser test covers server mode.

## Required Rework
None.
