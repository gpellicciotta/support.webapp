---
task: T0274
round: 1
verdict: rejected
blocking: 3
reviewer: "@gemini"
reviewed_at: 2026-11-23T10:43:42Z
reviewed_commit: "be35518"
base_commit: "bc7c486"
branch: main
session: antigravity-20261123-812336
session_agent: antigravity
session_created_at: 2026-11-23T10:35:48Z
---
# Review Findings: Task T0274 (Round 1)

## Summary
Rejected in round 1 with 3 blocking defects in `src/js/pull-refresh.js`.
The CSS shell part, portal demo wiring, documentation updates (ADR-0003, ADR-0004, `components.md`, `visual-style-guide.md`, `CHANGELOG.md`), and visual captures are solid, and all existing and new linters, unit tests (2209 Vitest, 61 pytest), and browser tests (`pull-refresh.spec.js`: 16 passed; `shell.spec.js`: 158 passed, 22 skipped) pass.
However, `pull-refresh.js` introduces three touch-handling bugs—two of them regressions against Auth's `c7129b8` behavior—that drop valid pulls or leave the floating indicator stranded on screen.

## Defects
1. **[Blocking] Zero-delta vertical `touchmove` (`dragged === 0`) aborts the pull gesture (`src/js/pull-refresh.js:125-126`).**
   `onTouchMove` runs `if (dragged <= 0 || !atTop(start.target)) { start = null; ... }`, unconditionally setting `start = null` when `dragged === 0`.
   On touchscreens, a slight initial horizontal jitter (`Δx ≠ 0, Δy = 0`) or returning to the start Y before pulling down emits `dragged === 0` and silently cancels the entire pull.
   This regresses Auth's `c7129b8` implementation (`startY = dragged < 0 ? null : startY;`), which only abandons the pull on an actual upward move (`dragged < 0`), contradicting the task goal to keep Auth's behavior and the function's own doc comment.

2. **[Blocking] Second-finger touch mid-pull leaves `.app__pull-indicator` stuck visible (`src/js/pull-refresh.js:103-108`).**
   If a user drags the indicator down (`travel > 0`, `indicator.hidden === false`) and a second finger touches the screen, `onTouchStart` sets `start = null` and returns early because `event.touches.length !== 1`, without resetting `travel` or calling `render()`.
   Subsequent `touchmove` and `touchend` events bail out because `start === null`, leaving the indicator frozen on screen indefinitely until a new pull begins.

3. **[Blocking] Touching a `Text` node silently ignores pull-to-refresh (`src/js/pull-refresh.js:105-106`).**
   `onTouchStart` returns early on `!target?.closest`.
   Because `Text` nodes lack `.closest()`, any touch whose `event.target` is a `Text` node (a known WebKit / iOS Safari quirk when touching text directly—and iOS installed apps are the primary target of this module) fails to start a pull.
   Auth's `event.target.closest?.(...)` did not reject `Text` nodes; normalizing non-element targets via `parentElement` restores that behavior while keeping `atTop()` and `inOverlay()` accurate.

## Process Gaps
- **Non-blocking:** `docs/specs/visual-style-guide.md` under `## Verification` lists `app-nav.test.js` but does not list the new `pull-refresh.test.js` and `pull-refresh.spec.js`.
- **Non-blocking:** `src/js/pull-refresh.js:172` wires `touchcancel` to `onTouchEnd` (matching Auth `c7129b8`), which means an OS-interrupted armed pull triggers `onRefresh` instead of cancelling cleanly; worth keeping in mind or clarifying if unintended.

## Required Rework
1. In `src/js/pull-refresh.js` (`onTouchMove`), preserve `start` when `dragged === 0` and still `atTop(start.target)`; clear `start = null` only when `dragged < 0 || !atTop(start.target)`.
2. In `src/js/pull-refresh.js` (`onTouchStart`), reset `travel = 0` and call `render()` when aborting an in-progress non-refreshing pull (such as when a second finger touches down mid-pull).
3. In `src/js/pull-refresh.js` (`onTouchStart`), normalize non-element touch targets to their enclosing element (`const target = event.target?.closest ? event.target : event.target?.parentElement;`) before running the `!target?.closest`, `atTop(target)`, and `inOverlay(target)` checks.
4. Add unit tests in `tests/unit/pull-refresh.test.js` covering all three cases (a `dragged === 0` move followed by a downward pull, a second-finger `touchstart` mid-pull hiding the indicator, and a pull started on a `Text` node) and re-run `python scripts/devops.py check`.
