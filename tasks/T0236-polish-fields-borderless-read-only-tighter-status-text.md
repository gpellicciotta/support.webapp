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

