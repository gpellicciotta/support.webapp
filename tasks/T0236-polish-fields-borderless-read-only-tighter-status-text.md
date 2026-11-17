---
id: T0236
owner: "@claude"
session: claude-20261117-dbf424
needs: []
branch: task/T0236-polish-fields-borderless-read-only-tighter-status-text
worktree: .plan/work/T0236-polish-fields-borderless-read-only-tighter-status-text
status: active
started_at: "2026-11-17T11:52:11Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1588.6, input: 120, output: 42854, cache_read: 6006721, cache_write: 128977}
  review: {turns: 1, duration_s: 98.9, input: 43734, output: 2270, cache_read: 376192, cache_write: 0}
review_status: rejected
review_round: 1
review_requested_at: "2026-11-17T12:18:54Z"
reviewed_by: "@codex"
review_session: codex-20261117-8bb7d3
work_duration: 1706.3
---
# T0236: Polish fields: borderless read-only, tighter status text, aligned hint padding, indented groups, and select chevron spacing with a gallery section

## Goals
Remove the border from read-only fields.
Move valid and invalid status text closer to the control, reducing the vertical gap.
Pad hint, status, error, and counter text so their start and end align with the text inside the control, as the help icon already does.
Indent field group content so it reads as part of the group.
Move the select chevron away from the border, reusing the collapsible's chevron spacing.
Add a select (drop-down) section to the gallery with its states.
The user requested this after reviewing the gallery on 2026-11-17.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0236.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Fixed field rows stretching in grids, removed the read-only border, inset messages, indented field groups, and drew an inset select chevron.
  - Select section added to the gallery with seven states.
  - Chevron uses token gradients; markup wrapper and data URL rejected.

- [2026-11-17] **[Verify]**
  Red phase failed 22 of 24 new tests; affected tests and the full devops check now pass.
  - Proof: validation-proof.md.
  - Screenshots: before-*.png and after-*.png in the companion directory.

- [2026-11-17] **[Doc]**
  Updated the visual style guide field rules and decisions, and added four CHANGELOG bullets.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 5.
  - Lines touched: 155.
  - Reopenings: 0.

- [2026-11-17] **[Visual]**
  Inspected gallery screenshots in both themes at both widths; validation-proof.md links every pair.
  - [Field before](T0236-polish-fields-borderless-read-only-tighter-status-text/before-field-desktop-light.png), [after](T0236-polish-fields-borderless-read-only-tighter-status-text/after-field-desktop-light.png).
  - [Field group before](T0236-polish-fields-borderless-read-only-tighter-status-text/before-field-group-mobile-light.png), [after](T0236-polish-fields-borderless-read-only-tighter-status-text/after-field-group-mobile-light.png).
  - [Select after](T0236-polish-fields-borderless-read-only-tighter-status-text/after-select-desktop-dark.png).

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-17] **[Review]**
  Round 1 rejected by @codex: [Decided]** Rejected for one select rendering regression in forced-colors mode.
  - Findings: [review-findings-1.md](T0236-polish-fields-borderless-read-only-tighter-status-text/review-findings-1.md).

- [2026-11-17] **[Implement]**
  Addressed review round 1: forced colors now restore the native select arrow, since Chromium drops gradient backgrounds there.
  - Added a forced-colors regression test; red, then green in all projects.

- [2026-11-17] **[Verify]**
  Affected tests passed 48 of 48, and the full devops check passed after the rework.
  - Proof appended to validation-proof.md.

- [2026-11-17] **[Verify]**
  Recorded task outcomes; counts exclude the added spec and CHANGELOG.md per the sizing rules.
  - Files touched: 5.
  - Lines touched: 152.
  - Reopenings: 0.

