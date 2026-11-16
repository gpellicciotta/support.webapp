---
id: T0049
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0049: Make the switch track and thumb rounded rectangles, since the 50% round radius turns the track into an ellipse

## Goals
Make the switch read as a crisp control instead of an egg shape, as reported from ToDo's Settings.
- Cause: `.switch__control` is 2.5rem by 1.5rem with `--radius-round`, which is 50% in every look, so the track is an ellipse.
- Give the track `--radius-control` and the thumb a radius that stays concentric inside it.
- Keep sizes, colors, states, forced-colors rules, and the 44 px label target unchanged.
- Check every look in light and dark, and release so ToDo's can vendor the change.
- Tests: [technical-spec.md](T0049-make-the-switch-track-and-thumb-rounded-rectangles/technical-spec.md).

Completion check: `python scripts/devops.py check` passes.

### Declared Files
- src/css/components/switch.css
- tests/unit/switch.test.js
- tests/e2e/switch.spec.js

Size estimate: 3 files, 60 lines.

## Task Execution Steps
- [ ] **[Implement]** Author a failing test that the track and thumb use the control radius, not 50%.
- [ ] **[Verify]**    Run the switch tests and confirm the new test fails for the right reason.
- [ ] **[Implement]** Change the track and thumb radii in switch.css.
- [ ] **[Verify]**    Run `python scripts/devops.py check` and confirm it passes.
- [ ] **[Visual]**    Capture the switch gallery sample, off and on, in every look, light and dark.
- [ ] **[Doc]**       Update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-16] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-16] **[Doc]**
  Filed from ToDo's, whose Settings switch looks egg-shaped; the cause is the 50% round radius.
