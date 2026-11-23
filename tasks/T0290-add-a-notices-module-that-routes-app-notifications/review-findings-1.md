---
task: T0290
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T22:29:12Z
reviewed_commit: "f18904d"
base_commit: "f63ac17"
branch: task/T0290-add-a-notices-module-that-routes-app-notifications
---
# Review Findings: Task T0290 (Round 1)

## Summary
Approved. `src/js/notices.js` ports Auth's `app-notices.mjs` (commit `eeb9439`) and adds its notification store.
I compared it line by line with the Auth source, and it keeps all the listed behavior:
- Errors and warnings show as app banners, at most three, and other notices become toasts through `toast.js`.
- The inbox banner is the most severe, then newest, live sticky notice, with "View all N alerts".
- Dismissing an app banner or toast deletes the notice, and inbox discard goes through `onDiscardInbox`.
- `safeUrl` uses the same rule as Auth: same-origin paths or `http(s)` links only.
- A toast pushed out by a newer one never shows twice: the placeholder guard is kept, with a `has` check added.
- Hooks are `data-notices-*` only, and all text is built with DOM APIs instead of `innerHTML`.

Also delivered: the contract entry, a portal demo section, components.md with an upgrade note, ADR-0003, ADR-0004, and CHANGELOG.md.

Reviewer verification on `f18904d`:
- `npx vitest run tests/unit`: 48 files, 2375 tests passed, including 15 in `notices.test.js`.
- `python scripts/devops.py lint`: exit 0.
- `npx playwright test` on notices, shell, shell-additions, and verify-ui, filtered by `notices|portal`: 56 passed.
- `plan tasks validate T0290 --completion`: passed.
- Screenshots: checked `after-neutral-light-desktop.png`. It shows the inbox banner with both links, warning and error banners, and two toasts.
- I did not re-run the full `devops.py check`. Its exit-0 output is recorded in validation-proof.md.

## Defects
None.

## Process Gaps
These are non-blocking. Most are inherited unchanged from Auth's source.
- `safeUrl` accepts `/\evil.com` and paths with tabs, such as `"/\t/evil.com"`.
  Browsers resolve both to another host, so `onNavigate` can receive a path that leaves the origin.
  The impact is low because any `http(s)` link is allowed anyway. Consider also rejecting `/\` and control characters.
- `update()` rebuilds every banner on each store change, including adding or removing a toast.
  So existing `role="alert"` error banners are inserted again, and screen readers may announce them again.
  Auth's `innerHTML` version behaves the same way. Updating banners in place by key would fix it.
- `detach()` leaves the rendered banners in `.app__banners`, but their dismiss buttons no longer respond.
  The unit test "store creation before attach" asserts this stale DOM.
- Focus restore always moves focus to the dismiss button of the same banner, even when the user was on its action link.

## Required Rework
None.
