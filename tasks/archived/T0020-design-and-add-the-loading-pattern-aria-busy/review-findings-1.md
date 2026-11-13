---
task: T0020
round: 1
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T19:00:34Z
reviewed_commit: "4b65515"
base_commit: "48e2ed5"
branch: task/T0020-design-and-add-the-loading-pattern-aria-busy
---
# Review Findings: Task T0020 (Round 1)

## Summary
Approved. The work meets the goals and follows ADR-0003's loading decision.
- The polite `role="status"` line sits outside the `aria-busy` region, so busy state cannot defer announcements.
- Skeletons appear only in the slow-list specimen, are `aria-hidden`, hold no focusable content, and never animate.
- `loading.css` uses existing tokens only and is imported in `style.css`; the token and catalog tests pass.
- The normative markup in `components.md`, the style guide section, and the CHANGELOG entry agree with the CSS and gallery.
- Declared files match the diff exactly; the red phase is recorded for both new tests.

Reviewer verification:
- Ran `python scripts/devops.py check` on 4b65515: exit 0.
  Results: Markdown lint, Ruff, ESLint, 3 pytest, 2044 Vitest, 300 Playwright, 4 integration, and pack dry run all passed.
- Inspected the before capture and the neutral mobile dark and bright desktop light after captures.
  Status text is readable; the placeholders render without clipping or horizontal overflow.

## Defects
None blocking. Non-blocking observations:
- Bright light placeholders are faint, because `--color-surface-sunken` (slate-50) is lighter than `--color-bg` (slate-75).
  They stay decorative and visible through the border. This comes from the bright look's tokens, not from this task.
- `visual-style-guide.md` writes `aria-busy=true` without code formatting, unlike the rest of that section.
- The `animation-name: none` assertions in `loading.spec.js` hold trivially today. They only guard against regressions.

## Process Gaps
- The first full check also failed two existing `form.spec.js` async checks on mobile-dark.
  The log records them, but no follow-up task tracks this flakiness. Consider filing one.

## Required Rework
None
