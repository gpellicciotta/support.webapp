---
task: T0276
round: 1
verdict: rejected
blocking: 4
reviewer: "@gemini"
reviewed_at: 2026-11-23T11:08:11Z
reviewed_commit: "2a630c0"
base_commit: "be35518"
branch: main
---
# Review Findings: Task T0276 (Round 1)

## Summary
Reviewed commit `3b6b720` on worktree branch `task/T0276-add-the-view-lifecycle-base-to-support-webapp` (base `be35518`). All lint checks (`lint-markdown`, `ruff`, `eslint`), 61 Python tests, 2241 Vitest unit tests, 7 integration tests, and 8 Playwright `view.spec.js` browser tests pass.

The core `View` and `RoutedView` structure, docs, ADR-0003 exception, and sample demo are clean and well-tested, but four blocking defects prevent approval: `showMainUI()` without arguments crashes consumers that expect `updateMainUI` to be skipped when `info` is omitted; `view.js` uses CSS style classes as JavaScript hooks for error title and description; `aria-busy="true"` wraps `[data-view-wait]`'s `role="status"` live region; and the wait overlay was neither styled with spacing nor visually captured across looks, themes, and widths as required by the Visual step.

## Defects
1. **[Blocking] `showMainUI()` calls `updateMainUI(undefined)` when invoked without arguments (`src/js/view.js:227-233`).**
   - `showMainUI(info)` invokes `this.updateMainUI(info)` unconditionally, even when `info === undefined`.
   - Both Auth's `component.mjs` (`c7129b8:webapp/js/utils/component.mjs:120`) and `support.js v3.1.0` (`v3.1.0:src/component.mjs:206`) guard `updateMainUI` so calling `this.showMainUI()` with no argument only hides overlays and reveals the main UI.
   - Auth's `AccountView` (`account-view.mjs` lines 715, 761, 830, 859, 927), `SignInView`, `CreateAccountView`, and `counters.server` views call `this.showMainUI()` with no arguments; in `AccountView`, `updateMainUI(userInfo)` dereferences `userInfo.name` and assigns `this.userAccount = userInfo`, which crashes with `TypeError` when `info` is `undefined`.

2. **[Blocking] `createOverlays()` selects error title and description by CSS style classes instead of `data-view-*` hooks (`src/js/view.js:112-113, 178-179`).**
   - Lines 112–113 query `.empty-state__title` and `.empty-state__text`.
   - This violates the explicit task goal ("Follow the naming rules: `data-*` hooks and ARIA state, no style classes as hooks"), `docs/specs/naming.md`, and `src/js/view.js:8` ("no class is a hook").

3. **[Blocking] `setState('updating')` places `aria-busy="true"` on the view root, enclosing `[data-view-wait]`'s `role="status"` (`src/js/view.js:174-188, 213-221`).**
   - Setting `aria-busy="true"` on `this.componentUIEl` wraps `<div data-view-wait><span class="spinner"></span><span role="status"></span></div>` inside a busy subtree.
   - `docs/specs/components.md` (`loading` and `spinner` contracts) explicitly requires keeping `role="status"` outside the `aria-busy="true"` content region so assistive technologies do not defer loading announcements until completion.

4. **[Blocking] Wait overlay was not visually captured as required and renders with zero spacing between the spinner and status text (`src/js/view.js:186-188`, `src/css/shell.css:567-570`, `validation-proof.md:31`).**
   - The `[Visual]` execution step requires capturing both the error and wait overlays across looks, themes, and mobile/desktop widths, and is marked `[x]`, but the companion directory contains only `view-error-*.png` and `view-ready-*.png` (zero wait overlay captures).
   - `createComponentUIHtml()` emits `<span class="spinner" aria-hidden="true"></span><span role="status"></span>` with no whitespace between elements and no layout/gap CSS rule for `[data-view-wait]` in `shell.css`, causing the spinner ring to sit flush against the status text with 0 px gap and no spacing from `[data-view-main]`.

## Process Gaps
- `docs/adrs/ADR-0004-app-shell.md:22` still says "Two optional modules enhance the shell" above a bullet list that now contains three modules (`app-nav.js`, `pull-refresh.js`, `view.js`).
- `technical-spec.md:24` mentions translation keys per `i18n.md`, whereas `view.js` uses `options.labels` (consistent with `app-nav.js` and `pull-refresh.js`); `refreshComponentUI()` also hardcodes `'Updating data'` instead of using a label from `this.labels`, and `showBackLink(link)` checks `link === null` rather than `!link` (throws if an override returns `undefined`).
- `detach()` does not cancel pending `startLongRunningOperation` wait timers, so detaching a view mid-request can still call `app.startProgress()` after navigation; additionally, `counters.server` (`admin-view.mjs`) uses `support.js v3.1.0`'s two-argument `startLongRunningOperation(title, asyncFn)` overload, which is not supported here (acceptable against `technical-spec.md`, but worth noting before counters migrates).
- Because the worktree was created manually without updating task frontmatter (`branch: —`, `worktree: —`), the review frontmatter recorded `main` / `2a630c0` while the actual task commit is `3b6b720` on `task/T0276-add-the-view-lifecycle-base-to-support-webapp`.

## Required Rework
1. Guard `this.updateMainUI(info)` in `View.prototype.showMainUI(info)` so calling `showMainUI()` without arguments (`info === undefined`) hides overlays and reveals `mainUIEl` without invoking `updateMainUI`; add a unit test covering `showMainUI()` with no argument.
2. Add `data-view-*` hooks (e.g., `data-view-error-title` and `data-view-error-text`) in `createComponentUIHtml()` and query those attributes instead of `.empty-state__title` and `.empty-state__text` in `createOverlays()`.
3. Move `aria-busy="true"` from `this.componentUIEl` to `this.mainUIEl` in `setState()` so `[data-view-wait]` and its `role="status"` element remain outside the busy region; update the unit tests to assert `aria-busy` on `mainUIEl` and its absence on `componentUIEl`.
4. Add tokenized layout and spacing for visible `[data-view-wait]` (e.g., flex alignment with `--space-2` gap and spacing from the main content, preserving `[hidden] { display: none; }`), verify the wait overlay in browser tests, and capture the wait overlay across all looks (`neutral`, `warm`, `bright`), themes (`light`, `dark`), and widths (`mobile`, `desktop`) in the companion folder.
5. Re-run `python scripts/devops.py check` after the fixes and record the updated verification output in `validation-proof.md`.
