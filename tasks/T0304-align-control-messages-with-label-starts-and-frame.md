---
id: T0304
owner: "@gemini"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-24T07:35:27Z"
ended_at: "2026-11-24T07:37:40Z"
preview: none
protocol: adhoc
review: none
completion-commit: dd4fb7da7e7ecb971a04854317143d611b2a0a9d
---
# T0304: Align control messages with label starts and frame gallery status bars

## Goals
Visually distinguish section-wide gallery status bars from single-control captions, especially in `#file-download`.
Align pertaining `.field__hint`, `.field__status`, and `.field__error` lines with the label text start of buttons, link buttons, checkboxes, radios, and switches.
See [technical-spec.md](T0304-align-control-messages-with-label-starts-and-frame/technical-spec.md) and [validation-proof.md](T0304-align-control-messages-with-label-starts-and-frame/validation-proof.md).

## Task Execution Steps
- [x] **[Implement]** Author failing unit and browser tests for `.demo-status` and control-message alignment.
- [x] **[Verify]**    Confirm red-phase test failures on gallery status and `#switch-error` offset.
- [x] **[Implement]** Add control-message alignment rules in `field.css` and `.demo-status` in the gallery.
- [x] **[Verify]**    Run `python scripts/devops.py check` and capture before/after gallery screenshots.
- [x] **[Doc]**       Update `visual-style-guide.md`, `components.md`, and `CHANGELOG.md`.

## Execution Log
- [2026-11-24] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-24] **[Review]**
  Review lowered from agent to none by @gpellicciotta: User explicitly requested adhoc protocol task.

- [2026-11-24] **[Verify]**
  Confirmed red-phase TDD failures: `gallery.test.js` (1 failed), `file-download.spec.js` (2 failed), and `field-polish.spec.js` (`#switch-error` offset 56px).

- [2026-11-24] **[Implement]**
  Updated `field.css` with control-text inset rules, added `.demo-status` to `gallery.css` and `visual-style-gallery.html`, and updated `gallery.js` and `tokens.test.js`.
  - Size note: 10 files (199 lines) couples stylesheet, gallery, specs, and tests.

- [2026-11-24] **[Doc]**
  Documented control-text alignment and area status bars in `visual-style-guide.md`, `components.md`, and `CHANGELOG.md`.

- [2026-11-24] **[Verify]**
  Full `python scripts/devops.py check` exited 0 and before/after screenshots verified 0 errors and 0 overflow.
  - Files touched: 10.
  - Lines touched: 199.
  - Reopenings: 0.

- [2026-11-24] **[Complete]**
  Task completed successfully.

