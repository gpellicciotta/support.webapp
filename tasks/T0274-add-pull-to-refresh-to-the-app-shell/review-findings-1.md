---
task: T0274
round: 1
verdict: rejected
blocking: 3
reviewer: "@gemini"
reviewed_at: 2026-11-23T10:29:29Z
reviewed_commit: "be35518"
base_commit: "bc7c486"
branch: main
---
# Review Findings: Task T0274 (Round 1)

## Summary
The port of pull-to-refresh into `src/js/pull-refresh.js`, `src/css/shell.css`, the portal demo, tests, and documentation (ADR-0003, ADR-0004, `components.md`, `visual-style-guide.md`, `CHANGELOG.md`) is clean, well-documented, and passes all existing linters, unit tests (2209 Vitest, 61 pytest), Playwright shell/pull-refresh tests (174 passed, 22 skipped), integration tests (7 passed), and `npm pack --dry-run`. Visual captures confirm the indicator renders cleanly across neutral, warm, and bright looks in light and dark themes.

However, three behavioral defects in touch event handling in `src/js/pull-refresh.js` block approval: touches starting on `Text` nodes are silently dropped (breaking iOS Safari pulls on text and regressing Auth's behavior), adding a second finger mid-pull leaves the fixed indicator permanently stuck visible, and `touchcancel` while armed triggers a refresh instead of cancelling the gesture.

## Defects
1. **[Blocking] Touching a `Text` node aborts the pull (`src/js/pull-refresh.js:105-108`)**
   `onTouchStart` reads `const target = event.target;` and returns early when `!target?.closest`. In WebKit / iOS Safari — the primary platform motivating this feature (ADR-0004) — touching text directly inside an element can dispatch `touchstart` with a `Text` node (`nodeType === 3`) as `event.target`. Because `Text` nodes lack `.closest()`, pulls starting on text silently fail. This also regresses Auth's original `pull-to-refresh.mjs`, where `event.target.closest?.(...)` did not reject `Text` targets.
   Normalize `event.target` to an element (e.g., `const target = event.target?.closest ? event.target : event.target?.parentElement;`) before running `atTop(target)` and `inOverlay(target)`.

2. **[Blocking] A second finger mid-pull leaves `.app__pull-indicator` stuck visible (`src/js/pull-refresh.js:104-114`)**
   When a user pulls down (`travel > 0`, making `.app__pull-indicator` visible) and a second finger touches the screen (`touchstart` with `event.touches.length !== 1`), `onTouchStart` sets `start = null` and returns early without resetting `travel = 0` or calling `render()`. Subsequent `touchend` sees `start === null` and returns immediately, leaving the fixed indicator frozen on screen over the app content until another valid pull finishes.
   Reset `travel = 0` and call `render()` whenever an active pull is abandoned in `onTouchStart` (and similarly if `applyMode` observes `query.matches` turning `false` mid-pull).

3. **[Blocking] `touchcancel` while armed triggers `onRefresh` (`src/js/pull-refresh.js:172`)**
   `root.addEventListener('touchcancel', onTouchEnd)` routes cancelled gestures through `onTouchEnd`, which checks `travel >= THRESHOLD` and calls `onRefresh()`. A browser- or OS-cancelled touch (e.g., incoming alert or system gesture) is not a user release and should cancel the pull (`start = null; travel = 0; render();`) without triggering a refresh.

## Process Gaps
- **Non-blocking**: The Execution Log in `T0274-add-pull-to-refresh-to-the-app-shell.md` refers to `visual-style-guide.md` as "undeclared", even though it is listed under Declared Files in `technical-spec.md`. No deliverable is affected.

## Required Rework
1. In `src/js/pull-refresh.js`:
   - Normalize `event.target` in `onTouchStart` to its `parentElement` when it is not an `Element` (e.g. a `Text` node) so `atTop` and `inOverlay` work on text touches in iOS Safari.
   - Reset `travel = 0` and call `render()` when abandoning an active pull on a multi-touch/rejected `touchstart` (and if `applyMode` disables the feature mid-pull).
   - Handle `touchcancel` with a dedicated cancel handler that clears `start` and `travel` and hides the indicator without calling `onRefresh`.
2. In `tests/unit/pull-refresh.test.js`:
   - Add unit tests covering: (a) a pull whose `touchstart` targets a `Text` node succeeds at the top and is still ignored inside a scrolled ancestor or open dialog, (b) adding a second finger mid-pull hides the indicator and does not call `onRefresh` on release, and (c) `touchcancel` while armed hides the indicator without calling `onRefresh`.
3. Re-run `python scripts/devops.py check` and record the updated verification results.
