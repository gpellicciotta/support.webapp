---
id: T0015
owner: "@claude"
session: claude-20261112-8931cc
needs: []
branch: task/T0015-add-the-github-packages-publish-workflow-and-document
worktree: .plan/work/T0015-add-the-github-packages-publish-workflow-and-document
status: completed
started_at: "2026-11-12T10:21:31Z"
ended_at: "2026-11-12T10:30:38Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 722.8, input: 196, output: 41588, cache_read: 7552786, cache_write: 164200}
  review: {turns: 2, duration_s: 323.0, input: 56, output: 14760, cache_read: 1346744, cache_write: 89578}
review_status: approved
review_round: 1
reviewed_by: "@claude-2"
work_duration: 546.4
completion-commit: 10f2d7391e91145d437a7afea6ae236c2af5694e
---
# T0015: Add the GitHub Packages publish workflow and document the release flow of the package

## Goals
Publish the package to GitHub Packages on each GitHub Release, as [ADR-0005](../../../docs/adrs/ADR-0005-distribution-and-versioning.md) decides.
Declare the changelog areas of ADR-0005 in the changelog header.
Document the release flow, including the backlog task per consuming app.
Publishing a release stays a manual, user-approved step.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0005 and the support.js publish workflow and devops guide.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the publish workflow and the package registry settings.
- [x] **[Verify]**    Run the pack test and lint the changed markdown files.
- [x] **[Doc]**       Document the release flow in devops.md and update CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Decided]**
  Manual workflow runs only rehearse with --dry-run; only a published release publishes, after a tag-version match.

- [2026-11-12] **[Decided]**
  Excluded src/index.html from the package; it is the development server landing page and the manifest already skips it.

- [2026-11-12] **[Implement]**
  Touched undeclared vitest.integration.config.js to run packing tests serially; updated the completion check to name the integration config.

- [2026-11-12] **[Verify]**
  Recorded task outcomes; pack test and full check pass.
  - Files touched: 4.
  - Lines touched: 65.
  - Reopenings: 0.

- [2026-11-12] **[Read]**
  Read ADR-0005, ADR-0008, the support.js publish workflow and devops guide, and the support.python release pipeline tagging.

- [2026-11-12] **[Verify]**
  Recorded the failing pack test in validation-proof.md: shipped src/index.html, no publishConfig, and no changelog areas.

- [2026-11-12] **[Doc]**
  Documented publishing, registry token setup, and per-app backlog tasks in devops.md; updated README.md and CHANGELOG.md.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 approved by @claude-2: Approved.
  - Findings: [review-findings-1.md](T0015-add-the-github-packages-publish-workflow-and-document/review-findings-1.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

