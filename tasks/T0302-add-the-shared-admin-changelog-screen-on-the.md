---
id: T0302
owner: "@gemini"
session: antigravity-20261124-f89609
needs: []
branch: task/T0302-add-the-shared-admin-changelog-screen-on-the
worktree: .plan/work/T0302-add-the-shared-admin-changelog-screen-on-the
status: active
started_at: "2026-11-24T06:40:29Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0302: Add the shared admin Changelog screen on the release notes renderer, promoted from Auth's and ToDo's consoles

## Goals
Add the shared Changelog screen: the releases from an app loader, drawn by the T0279 renderer, paged ten at a time.
The screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shared Admin Screens", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 40 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the Changelog screen, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the Changelog screen across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit after the user decided on 2026-11-23 to ship the shared admin screens.

- [2026-11-24] **[Read]**
  Read technical-spec.md, auth-webapp-ui-audit.md, Auth and ToDo changelog-view.mjs, release-notes.js, data-loader.js, dom-builders.js, admin-console.js, and sibling admin screens.

- [2026-11-24] **[Decided]**
  Chose key admin-changelog and src/js/admin-changelog.js exporting attachAdminChangelog, createAdminChangelog, createAdminChangelogScreen, normalizeReleasesResult, and DEFAULT_PAGE_SIZE=10 on release-notes.js, data-loader.js, and dom-builders.js.

- [2026-11-24] **[Verify]**
  Confirmed red-phase failures for admin-changelog unit and browser tests and captured baseline screenshot.
  - Unit test failed: missing src/js/admin-changelog.js.
  - Browser test failed: missing [data-admin-changelog].

- [2026-11-24] **[Implement]**
  Implemented src/js/admin-changelog.js, registered admin-changelog in src/contract.json, and wired the Changelog screen into the admin console demo.
  - Undeclared file touched: docs/adrs/ADR-0003-components-and-patterns.md (2 lines).

- [2026-11-24] **[Visual]**
  Captured before and 12 after screenshots across neutral, warm, and bright looks in light/dark themes at mobile and desktop widths.
  - Before: before-admin-changelog-neutral-desktop-light.png.
  - After: after-admin-changelog-{neutral,warm,bright}-{desktop,mobile}-{light,dark}.png.

- [2026-11-24] **[Doc]**
  Updated docs/specs/components.md with catalog entry and upgrade notes, docs/adrs/ADR-0003-components-and-patterns.md, and CHANGELOG.md.

- [2026-11-24] **[Verify]**
  Verified linters, 61 pytest, 2584 Vitest unit tests, 1148 Playwright browser tests, 7 integration tests, and package dry-run.
  - Files touched: 5.
  - Lines touched: 131.
  - Reopenings: 0.

