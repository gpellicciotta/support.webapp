---
id: T0283
owner: "@gemini"
session: antigravity-20261123-e0c6c8
needs: []
branch: task/T0283-add-auth-s-shell-additions-to-shell-css
worktree: .plan/work/T0283-add-auth-s-shell-additions-to-shell-css
status: active
started_at: "2026-11-23T18:39:39Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1828.3, input: 414128, output: 68556, cache_read: 21007671}
work_duration: 1812.3
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T19:10:44Z"
---
# T0283: Add Auth's shell additions to shell.css: sidebar end group, entry badges, hidden top bar parts, and banner dismiss

## Goals
Add to `shell.css` what Auth and ToDo add locally: a sidebar list pinned to the sidebar end, and badges at the end of nav entries.
Also hide `hidden` top bar parts despite their display, size the brand logo, and end shell banners with their dismiss button.
Follow naming.md, so `nav-end` becomes a modifier of the nav list.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shell Additions", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 70 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the class names and load order, following naming.md.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the shell additions, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the shell additions across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Read]**
  Reviewed technical-spec.md, the T0277 audit section, Auth app.css and admin.css at eeb9439, ToDo admin console, and shell.css.

- [2026-11-23] **[Decided]**
  Chose BEM shell class names in shell.css using existing public tokens only.
  - Sidebar end group: .app__nav-list--end replacing .nav-end.
  - Brand logo: .app__brand-logo sized with --space-7; .app__brand gap --space-2.
  - Hidden top bar parts, nav entry .badge, and banner .icon-button in shell.css.

- [2026-11-23] **[Implement]**
  Authored failing unit and browser tests, then added the shell additions to shell.css and updated the admin console and portal demos.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures in new unit and browser tests before editing shell styles.
  - Vitest shell.test.js: 2 failed on missing CSS rules and demo markup.
  - Playwright shell-additions.spec.js: all 4 scenarios failed before edits.

- [2026-11-23] **[Visual]**
  Captured before and after screenshots across neutral, warm, and bright looks in light and dark themes at 390 and 1440 px.
  - Before: [admin](T0283-add-auth-s-shell-additions-to-shell-css/before-admin-console-desktop-light.png), [portal](T0283-add-auth-s-shell-additions-to-shell-css/before-portal-desktop-light.png).
  - After: [admin](T0283-add-auth-s-shell-additions-to-shell-css/after-admin-console-neutral-desktop-light.png), [portal](T0283-add-auth-s-shell-additions-to-shell-css/after-portal-bright-mobile-light.png).

- [2026-11-23] **[Doc]**
  Updated components.md with upgrade note, CHANGELOG.md, and undeclared docs/adrs/ADR-0004-app-shell.md (5 counted files, 73 lines).

- [2026-11-23] **[Verify]**
  Verified linters, 61 Python tests, 2317 unit tests, 946 browser tests, 7 integration tests, and package dry-run.
  - Files touched: 5.
  - Lines touched: 73.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

