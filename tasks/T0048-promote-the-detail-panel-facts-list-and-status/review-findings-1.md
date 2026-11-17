---
task: T0048
round: 1
verdict: rejected
blocking: 1
reviewer: "@codex"
reviewed_at: 2026-11-17T01:46:27Z
reviewed_commit: "7c96fc4"
base_commit: "0d50110"
branch: task/T0048-promote-the-detail-panel-facts-list-and-status
session: codex-20261117-c288f3
session_agent: codex
session_created_at: 2026-11-17T01:44:06Z
---
# Review Findings: Task T0048 (Round 1)

## Summary
**[Decided]** Rejected for one incorrect selection behavior in the admin console example.
The promoted CSS, catalog registration, and shell composition otherwise satisfy the reviewed requirements.
Inspected the commit, full diff, specifications, execution log, validation proof, and neutral light screenshot.
Independent checks passed:
- Detail-panel unit tests: 4 passed, exit 0.
- Token unit tests: 1847 passed, exit 0.
- Affected desktop light/dark Playwright suite: 120 passed, exit 0.
- Focused ESLint and Git diff whitespace checks: exit 0.

The recorded full check passed; this review reran affected checks rather than the entire suite.
Release remains subsequent to review and requires the user's publishing approval.

## Defects
- Blocking D1: Selecting another account retains Samira's facts and permanent-deletion confirmation.
  In `src/demo/shell-admin-console.js:57-63`, selection updates only the title, name, and email.
  `src/demo/shell-admin-console.html:179-181` retains ID 34, owner role, and Active status.
  Its line 196 permanently names Samira Patel in the deletion question.
  Click Inspect Alex North, then Delete permanently: the heading identifies Alex, but the confirmation identifies Samira.
  Alex's displayed facts also contradict his table row, which identifies ID 1 and the admin role.
  Selecting Jordan or Morgan likewise retains the incorrect Active status.
  This source-confirmed behavior breaks the example's selected-record details and in-place confirmation.
  Existing browser assertions verify the changed title and focus, but omit facts and confirmation identity.

## Process Gaps
- Non-blocking: The final full-check evidence block contains selected output without omission markers or the final browser summary.
  The testing skill requires explicit omission markers when truncating output.
  This evidence-format issue does not determine the verdict.

## Required Rework
- Update all account-specific panel content and confirmation text together when selection changes.
- Reset or dismiss an open confirmation before changing the selected account.
- Add browser regression coverage for facts and confirmation identity after selecting a different account.
- Verify switching accounts while confirmation is open cannot retain the previous account's deletion question.
- Rerun affected checks and record their actual output.
