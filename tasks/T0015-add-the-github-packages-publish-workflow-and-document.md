---
id: T0015
owner: ~
needs: [T0014]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0015: Add the GitHub Packages publish workflow and document the release flow of the package

## Goals
Publish the package to GitHub Packages on each GitHub Release, as [ADR-0005](../../docs/adrs/ADR-0005-distribution-and-versioning.md) decides.
Declare the changelog areas of ADR-0005 in the changelog header.
Document the release flow, including the backlog task per consuming app.
Publishing a release stays a manual, user-approved step.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0005 and the support.js publish workflow and devops guide.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the publish workflow and the package registry settings.
- [ ] **[Verify]**    Run the pack test and lint the changed markdown files.
- [ ] **[Doc]**       Document the release flow in devops.md and update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
