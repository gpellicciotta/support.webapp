---
task: T0276
round: 1
verdict: rejected
blocking: 5
reviewer: "@gemini"
reviewed_at: 2026-11-23T11:40:39Z
reviewed_commit: "8da1935"
base_commit: "be35518"
branch: main
---
# Review Findings: Task T0276 (Round 1)

## Summary
Rejected with 5 blocking defects.
The task's implementation commit (`3b6b720`) sits on an untracked branch `task/T0276-add-the-view-lifecycle-base-to-support-webapp` (in `.plan/work/T0276-add-the-view-lifecycle-base-to-support-webapp`) while `reviewed_commit` (`8da1935` on `main`) holds unrelated T0275 commits (`241dca0`, `8da1935`) and does not include `src/js/view.js`.
In the worktree commit `3b6b720`, unit tests (2241 passed), Python tests (61 passed, 1 skipped), package integration tests (7 passed), Playwright `tests/e2e/view.spec.js` (8 passed), and all linters pass, but four implementation/verification defects remain: `showMainUI()` breaks Auth views when called without arguments, `aria-busy="true"` wraps the wait `role="status"` region, `createOverlays()` still queries CSS style classes as hooks, and the wait overlay lacks both layout spacing and the required visual captures.

## Defects
1. **[Blocking] Task commit is not on the reviewed branch and conflicts with `main`.**
   - Task frontmatter leaves `branch: —` and `worktree: —`, so review targeted `main` (`8da1935`, commits `241dca0` and `8da1935` from T0275), where none of T0276's changes exist.
   - Commit `3b6b720` on `task/T0276-add-the-view-lifecycle-base-to-support-webapp` is based on `be35518` and has a merge conflict in `src/demo/shell-demo.js` against `main` (`git merge-tree --write-tree main 3b6b720`).
   - Approving `8da1935` would complete T0276 without `src/js/view.js` on `main`.

2. **[Blocking] `View.showMainUI(info)` calls `updateMainUI(undefined)` when invoked with no arguments (`src/js/view.js:227-233`).**
   - Both `support.js` v3.1.0 (`src/component.mjs`) and Auth (`webapp/js/utils/component.mjs` at `c7129b8`) guard `updateMainUI(info)` so parameterless `showMainUI()` only reveals the main UI and hides overlays.
   - Auth's `account-view.mjs` calls `this.showMainUI()` five times without arguments (and `create-account-view.mjs` and `sign-in-view.mjs` do the same), while `account-view.mjs`'s `updateMainUI(userInfo)` dereferences `userInfo.name` and `userInfo.email`. Unconditionally calling `this.updateMainUI(info)` throws a `TypeError` and overwrites `this.userAccount` with `undefined`.

3. **[Blocking] `aria-busy="true"` wraps `<span role="status">` inside the busy region (`src/js/view.js:213-221`).**
   - `setState('updating')` sets `aria-busy="true"` on `this.componentUIEl`, which encloses `[data-view-wait]` (holding `<span role="status">`) as well as `[data-view-main]`.
   - This violates `docs/specs/components.md` (lines 613 and 644): status text must stay outside any `aria-busy="true"` region so screen readers do not defer announcements until completion.

4. **[Blocking] `createOverlays()` uses CSS style classes as JavaScript hooks (`src/js/view.js:112-113`).**
   - `this.errorTitleEl` and `this.errorDescriptionEl` are queried with `.empty-state__title` and `.empty-state__text`.
   - The task Goals, `technical-spec.md`, and `docs/specs/naming.md` explicitly require `data-view-*` hooks and forbid selecting by style classes.

5. **[Blocking] Wait overlay lacks visual captures required by `[Visual]` and renders spinner and status text with no gap (`src/js/view.js:186-188`, `src/css/shell.css:567-570`).**
   - The `[Visual]` task step is checked `[x]` for capturing both error and wait overlays across looks, themes, and widths, but the companion folder contains only `view-error-*.png` and `view-ready-*.png` (0 wait-overlay captures).
   - `[data-view-wait]` renders `<span class="spinner" aria-hidden="true"></span><span role="status"></span>` with no whitespace between spans and no CSS flex/gap/spacing rule in `shell.css` or `spinner.css`, so the spinner ring butts directly against the status text.

## Process Gaps
- `docs/adrs/ADR-0004-app-shell.md:22` still says "Two optional modules enhance the shell" above a three-item list (`app-nav.js`, `pull-refresh.js`, `view.js`).
- `View.detach()` does not cancel an in-flight `waitTimer` from `startLongRunningOperation()`, and a synchronous throw inside `op.start()` leaves `waitTimer` running, which can later call `this.app.startProgress()` and `showWaitOverlay()` on a detached or failed view.
- Releasing the package version containing `view.js` (noted in Goals so Auth T0251 can proceed) remains to be executed after approval and landing on `main`.

## Required Rework
1. Rebase `task/T0276-add-the-view-lifecycle-base-to-support-webapp` onto `main` (`8da1935`) and resolve the merge conflict in `src/demo/shell-demo.js`; register the branch/worktree in the task metadata (or land the changes where `plan` tracks the task) so the next review round points at T0276's actual commits.
2. Guard `updateMainUI` in `View.showMainUI(info)` so it runs only when `info !== undefined`, and add unit tests covering `showMainUI()` with no arguments and with falsy/defined values.
3. Move `aria-busy="true"` from `this.componentUIEl` to `this.mainUIEl` (`[data-view-main]`) so `[data-view-wait]` and its `<span role="status">` remain outside the busy region; update unit tests and `docs/specs/components.md`.
4. Add `data-view-*` hooks (for example `data-view-error-title` and `data-view-error-text`) to the error heading and paragraph in `createComponentUIHtml()` and query those hooks in `createOverlays()` instead of `.empty-state__title` and `.empty-state__text`.
5. Style `.app__view [data-view-wait]` in `src/css/shell.css` (preserving `[hidden] { display: none; }`) so the spinner and status text align with token spacing, capture the wait overlay across all looks, themes, and desktop/mobile widths in the companion folder, and re-run `python scripts/devops.py check`.
