---
task: T0279
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T16:40:32Z
reviewed_commit: "07104e7"
base_commit: "4d939ee"
branch: task/T0279-add-a-release-notes-renderer-for-parsed-changelogs
---
# Review Findings: Task T0279 (Round 1)

## Summary
Approved. The work meets every goal in the task and the technical specification.
- `release-notes.js` renders plain release objects without importing support.js.
  It handles the `parseChangelog` shape from support.js `src/changelog-parser.mjs` (`rawText`, `text`, `category`, `isUserFacing`, `isBreaking`, `tag`, `isLatest`, `isPreRelease`).
- `describeRelease` keeps Auth's status rules (`in-development`, `broken`, `frozen`, `released`), its date extraction, and its area grouping.
- Each release gets one collapsible built on `collapsible.js`, with the newest open and older panels `hidden="until-found"`.
  The component also has Latest, category, and Breaking badges, User Highlights and All Changes filter chips, area groups, status chips, and `pageSize` paging.
- Text goes into the DOM as text nodes only. Backtick spans become `code`, and links become their label.
- Hooks are `data-release-notes-*` attributes plus `aria-pressed` and `aria-expanded`.
  Badges, chips, and buttons reuse the catalog variants.
- The contract entry, the `style.css` import, the gallery section, components.md (row, skeleton, upgrade note), ADR-0003, and CHANGELOG.md are all updated.
- The Execution Log counts (6 files, 133 lines) match the diff of the declared and undeclared modified files.

Verification I ran in the worktree:
- `python scripts/devops.py lint`: exit 0.
- `npx vitest run`: 40 files, 2283 tests passed, including the 14 in `release-notes.test.js`.
- `npx playwright test tests/e2e/release-notes.spec.js`: 4 passed (desktop and mobile, light and dark).
- `python scripts/devops.py check`: exit 0. Results: pytest 61 passed and 1 skipped, unit 2283 passed, Playwright 898 passed and 42 skipped, integration 7 passed.
- `plan tasks validate T0279 --completion`: passed.
- I looked at the screenshots `after-release-notes-warm-mobile-dark.png` and `after-release-notes-neutral-desktop-light.png`.
  Rows wrap cleanly, chips and badges are legible, and nothing overflows.

## Defects
None.

## Process Gaps
Non-blocking:
1. Clicking Show older (or calling `showMore`) rebuilds every release, so releases the user expanded fold back to "newest open only".
   `render()` in `src/js/release-notes.js` destroys and recreates all collapsibles on each paging step.
   Consider keeping the current open state or appending only the new page.
2. Heading levels are fixed: `h2` for versions in open mode and `h3` for area headings.
   Containers like `empty-state` let the app set the heading level. A `headingLevel` option would fit pages with a different outline.
   The gallery shows the mismatch: area `h3`s sit under a gallery `h3` subheading.
3. Every after screenshot was taken after the test clicked Show older, so no capture shows the paging button.

## Required Rework
None.
