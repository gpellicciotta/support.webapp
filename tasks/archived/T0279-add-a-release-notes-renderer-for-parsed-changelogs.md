---
id: T0279
owner: "@gemini"
session: antigravity-20261123-ac51e3
needs: []
branch: task/T0279-add-a-release-notes-renderer-for-parsed-changelogs
worktree: .plan/work/T0279-add-a-release-notes-renderer-for-parsed-changelogs
status: completed
started_at: "2026-11-23T16:14:29Z"
ended_at: "2026-11-23T16:50:01Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1553.4, input: 363864, output: 67950, cache_read: 15242474}
  review: {turns: 1, duration_s: 562.5, input: 44, output: 9575, cache_read: 1338410, cache_write: 77504}
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T16:40:31Z"
reviewed_by: "@claude"
review_session: claude-20261123-51a0a7
work_duration: 2132.0
completion-commit: 7cf3f4aafa5f60b8b2ebbc1616efac910a9af23d
---
# T0279: Add a release notes renderer for parsed changelogs, promoted from Auth's Help view and admin console

## Goals
Add a release notes renderer that draws the releases parsed by support.js `changelog-parser.mjs`.
One collapsible per release, newest open, with Latest, category, and Breaking badges, and inline code.
Offer a User Highlights or All Changes filter, area groups, release status chips, and paging.
Auth's Help view and admin console, ToDo's admin console, and counters' Help view all render release notes.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Release Notes Renderer", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 120 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the release notes renderer, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the release notes renderer across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose key release-notes with createReleaseNotes, attachReleaseNotes, describeRelease, and parseInlineMarkdown.
  - CSS partial src/css/components/release-notes.css, module src/js/release-notes.js.
  - Reuses collapsible.js, badge, chip, button, and core sprite icons.

- [2026-11-23] **[Visual]**
  Captured before and after screenshots across neutral, warm, and bright looks at 390 px and 1440 px in light and dark themes.
  - Before: before-gallery-{desktop,mobile}-{light,dark}.png.
  - After: after-release-notes-{neutral,warm,bright}-{desktop,mobile}-{light,dark}.png.

- [2026-11-23] **[Doc]**
  Updated components.md with release-notes skeleton and upgrade note, ADR-0003, and CHANGELOG.md; logged undeclared edits.
  - Undeclared modified files: src/demo/gallery.js, docs/adrs/ADR-0003-components-and-patterns.md.

- [2026-11-23] **[Verify]**
  Verified lint, 61 Python tests, 2283 unit tests, 898 Playwright checks, 7 integration tests, and pack dry-run.
  - Files touched: 6.
  - Lines touched: 133.
  - Reopenings: 0.

- [2026-11-23] **[Read]**
  Read technical-spec.md, the Auth audit section, Auth help-view.mjs and changelog-view.mjs, naming.md, and ADR-0003.

- [2026-11-23] **[Implement]**
  Authored failing unit and browser tests, then added release-notes.js, release-notes.css, contract entry, and gallery specimens.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 approved by @claude: Approved.
  - Findings: [review-findings-1.md](T0279-add-a-release-notes-renderer-for-parsed-changelogs/review-findings-1.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

