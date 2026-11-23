---
task: T0280
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T17:23:14Z
reviewed_commit: "cd51e5f"
base_commit: "7cf3f4a"
branch: task/T0280-add-a-theme-boot-script-and-account-theme
---
# Review Findings: Task T0280 (Round 1)

## Summary
The work meets the goals and the technical specification.
- `src/js/theme-boot.js` is a classic, never-throwing script.
  It applies `{{app-name}}.theme` before first paint and migrates a legacy key once.
  It matches Auth's `index.html` logic at `eeb9439`.
- `themeBootScript` emits an inlineable equivalent for server templates.
- `themeOfSettings` reads `theme` and `style-settings` from lists, objects, and strings.
  It maps `default` to `system` and ignores unknown values.
- `syncAccountTheme` and `attachThemeSwitch({ sync: { load, save, onError } })` keep account APIs in app callbacks.
  Sync never echoes `save`; stale loads are dropped; cross-tab `storage` events realign the switch.
- Hooks follow naming.md: `data-theme-switch-app`, `data-theme-switch-legacy-key`, no style classes.
- The template, gallery demo, components.md, ADR-0003, and CHANGELOG.md are updated.

Verification run by the reviewer on `cd51e5f`:
- `npx vitest run tests/unit/theme-boot.test.js tests/unit/theme-switch.test.js`: 19 passed.
- `npx playwright test tests/e2e/theme-boot.spec.js`: 12 passed across the 4 projects.
- `python scripts/devops.py check`: exit 0.
  Markdown lint, Ruff, ESLint, 61 pytest, 2296 vitest, 910 Playwright, 7 integration, and pack all green.
  The pack lists `src/js/theme-boot.js`, so vendored apps receive it.
- The browser test aborts `gallery.js`, so it proves `data-theme="dark"` comes from the boot script alone.

## Defects
None.

## Process Gaps
Non-blocking:
- `template/src/demo/visual-style-gallery.html` and the `src/demo/shell-*.html` pages lack the boot script and `color-scheme` meta.
  They still flash the system theme on reload for a stored Light or Dark choice.
- `themeBootScript` embeds keys with `JSON.stringify`, which leaves `<` unescaped.
  A key containing `</script>` would break an inline script; escape `<` as `<` for hardening.
- Object-form settings prefer `theme` over `style-settings.theme`; Auth's `themeOfSettings` prefers `style-settings`.
  The order is documented, but the upgrade note could mention it for Auth.
- In the gallery section, the status line sits flush under the demo buttons with no gap.
- `docs/specs/visual-style-guide.md` (theme switch usage, line 459) does not mention the boot script or account sync.

## Required Rework
None.
