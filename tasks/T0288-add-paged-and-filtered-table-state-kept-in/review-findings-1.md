---
task: T0288
round: 1
verdict: rejected
blocking: 2
reviewer: "@claude"
reviewed_at: 2026-11-24T01:25:37Z
reviewed_commit: "7535d9c"
base_commit: "67d1749"
branch: task/T0288-add-paged-and-filtered-table-state-kept-in
---
# Review Findings: Task T0288 (Round 1)

## Summary
Client paging, hash persistence, clamping, and the admin console demo work and are well tested.
Server paging has two behavior defects that ToDo's source does not have, so the server half of the goal fails.

Checks I ran in the worktree at `7535d9c`:
- `npx vitest run`: 53 files, 2456 tests passed.
- `npx eslint .`: exit 0.
- `lint-markdown check --offline`: 28 files passed.
- `npx playwright test tests/e2e/table-state.spec.js`: 2 passed (desktop light and dark), 2 skipped (mobile).
- The `data-loader`, `detail-panel`, `dom-builders`, `shell`, `shell-additions`, and `verify-ui` specs: 318 passed, 42 skipped.

I did not rerun the full `python scripts/devops.py check`.
The evidence shows `generate-app.test.js` failed in the worktree from a missing `node_modules`, and that is disclosed.

To confirm both defects, I ran a probe script against `src/js/table-state.js` with an injected location and history:

```text
replay current after next (no params): page=next&page-size=20&page-bookmark=b2
hash after next: #?page=2
reload state: {"page":2,"pageNumber":2} params current: page=first&page-size=20
```

## Defects
1. **Blocking: `applyEnvelope` saves the wrong replay parameters.**
   - Location: `src/js/table-state.js:736-739`.
   - `state.envelope` is replaced before `serverParams(direction)` runs, so the saved params use the new page's bookmarks.
   - Scenario: call `applyEnvelope('next', env2)` without `params`. `serverParams('current')` then returns `page-bookmark=<env2 end-bookmark>`, which is the following page.
   - Impact: a refresh that replays `current` (ToDo's `go('current')`, used after edits) loads page N+1 instead of page N.
   - ToDo's `mountPagedTable` saves the params that produced the page. The docs make `params` optional, so the default path is the broken one.
   - The unit tests never check `serverParams('current')` after `applyEnvelope`.
2. **Blocking: server bookmark mode writes a page number that a reload cannot restore.**
   - Location: `src/js/table-state.js:752-753` and `loadFromUrl`.
   - `applyEnvelope` writes `page=N` into the hash, but bookmarks are not persisted.
   - After a reload, `pageNumber` is N while `serverParams('current')` falls back to `first`.
   - Impact: the server pager shows "Page N" over page 1's rows. This breaks "a reload or shared link restores the table".
   - ToDo persists only `q`, `extra`, and `size`, never the server page.

## Process Gaps
- Non-blocking: the size estimate was 120 lines, but the module alone is 1094 lines.
  It adds scope the task did not ask for: debounce, checkbox filters, `hashchange` sync, and a headless API plus an attach API.
  The log's "Lines touched: 145" counts only the declared files, so it is consistent with the spec's counting rule.
- Non-blocking: the demo still labels the text filter "Filter this page", but it now filters every loaded row across pages.
- Non-blocking: the demo uses a `data-table-state` hook on the section, but `components.md` does not list it among the supported hooks.
- Non-blocking: no demo or browser test covers server mode. The spec only requires unit coverage of the server parameters.

## Required Rework
1. Make `applyEnvelope` save the params that produced the envelope.
   For example, compute the default from the previous envelope before replacing it, or require `params`.
   Add a unit test: after `applyEnvelope('next', env)`, `serverParams('current')` must replay the request that loaded `env`.
2. Stop writing the page number to the hash in server bookmark mode, matching ToDo.
   Alternatively, restore a page `pageParams` can address, and never label a page that was not loaded.
   Add a unit test that reloads with `#?page=2` in server mode and checks the pager label matches the loaded page.
