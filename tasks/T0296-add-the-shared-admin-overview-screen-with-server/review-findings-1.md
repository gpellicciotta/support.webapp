---
task: T0296
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T03:30:38Z
reviewed_commit: "921bedd"
base_commit: "8bdc619"
branch: task/T0296-add-the-shared-admin-overview-screen-with-server
---
# Review Findings: Task T0296 (Round 1)

## Summary
Approved. The work meets every goal and technical-specification item.

- `src/js/admin-overview.js` reads server state through `adapter.fetchStatus`, so apps keep their own endpoints.
- The reload interval is an option, `30_000` ms by default, and pauses while the page is hidden via `auto-refresh.js`.
- `createAdminOverviewScreen` mounts in the T0293 frame, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- The screen builds with T0294 builders and loads through `data-loader.js` for Retry and Sign in states.
- Hooks are `data-admin-overview-*` and `data-fact`, with ARIA state only, per naming.md.
- Auth's nested `extra-info` and ToDo's flat payloads both normalize; behavior matches Auth's `overview-view.mjs`.
- The contract entry, components.md section with upgrade note, ADR-0003 decision, and CHANGELOG entry are present.
- Unit tests cover facts, visible reload, hidden pause, failures, 401, frame mounting, and the contract.
- The demo test shows Overview facts from a fake adapter, with disconnected, failure, and 401 recovery.

Reviewer verification on commit `921bedd`:
- `npx vitest run`: 56 files, 2492 tests passed.
- `npm run lint`: ESLint clean.
- `npx playwright test` on the 9 specs touching the admin console demo: 356 passed, 44 skipped, 0 failed.
- Screenshots exist for 3 looks, 2 themes, and 2 widths; the inspected warm mobile dark capture renders correctly.

The full `python scripts/devops.py check` was not rerun; the worker's proof records it green after `npm ci`.

## Defects
None.

## Process Gaps
Non-blocking:
- ADR-0003 changed but was undeclared; the declared `shell-admin-console.html` stayed unchanged. The log records the 4-file, 170-line count against a 50-line estimate.
- The body `div` and Server `section` reuse the `.loading` component class as a grid wrapper. Auth used `section-block`; a layout class would read better.
- The Server `section` lacks Auth's `aria-labelledby` heading link, so it has no accessible name.
- The repository version suffix lost Auth's muted styling.
- The default `changelogHref` of `#/changelog` points to no screen in the demo, so the link falls back to Overview.
- The `role="alert"` repository banner re-renders on each quiet poll and can re-announce every 30 seconds. Auth behaves the same way.
- The Execution Log lists the `[Read]` entry after `[Verify]`, out of chronological order.

## Required Rework
None.
