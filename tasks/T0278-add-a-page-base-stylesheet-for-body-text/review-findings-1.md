---
task: T0278
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T16:14:03Z
reviewed_commit: "88741c0"
base_commit: "7801487"
branch: task/T0278-add-a-page-base-stylesheet-for-body-text
session: claude-20261123-fa301c
session_agent: claude-code
session_created_at: 2026-11-23T16:02:28Z
---
# Review Findings: Task T0278 (Round 1)

## Summary
The work meets the goals and the technical specification.
`src/css/page.css` styles body, headings, links, and code from public tokens only.
It loads after `reset.css` and before components.
Element rules use zero-specificity `:where()` selectors, so component classes win.
The e2e test proves this with `.button` on an anchor.
The `[hidden]` guard spares `hidden="until-found"`, which the e2e test checks via `content-visibility: hidden`.
ADR-0003, components.md (with the upgrade note), CHANGELOG.md, and the gallery `#page` section are updated.

The reviewer re-ran the checks on commit `88741c0`:
- `npx vitest run tests/unit/page.test.js tests/unit/gallery.test.js`: 29 passed.
- `python scripts/devops.py check`: exit 0.
  - 28 Markdown files linted, Ruff and ESLint clean.
  - 61 Python tests passed, 1 skipped.
  - 2266 unit tests, 894 browser tests, and 7 integration tests passed.
  - Package dry-run included `src/css/page.css`.
- `plan tasks validate T0278 --completion`: passed.

The screenshots match the gallery section across looks, themes, and widths.

## Defects
None.

## Process Gaps
Non-blocking:
1. The generator template still repeats the base rules that the upgrade note tells apps to remove.
   `template/src/css/style.css` lines 14 to 36 keep `body`, `h1`, and `h2` rules.
   They now duplicate page.css, so generated apps start with the redundancy this task removes.
2. The `[Implement]` step promised a contract entry, but `src/contract.json` is unchanged.
   No `[Decided]` entry explains the omission.
   Page base is not a component key, so skipping it is defensible, but say so in the log.
   The components.md row uses the key `none, base`.
   ADR-0003's "Naming link" expects one kebab-case key per component, such as `page`.
3. ADR-0008's layout tree under `src/css/` does not list `page.css`.
4. Scoping the gallery rules changed specimens outside `#page`, and no capture covers them:
   - `#accents` plain `h3` headings drop from `--text-lg` to `--text-base` and take default UA margins.
   - Plain `p` elements in the collapsible, dialog, inline-confirm, and toast specimens lose `margin: 0 0 var(--space-4)`.
     They now take default UA margins.
   The gallery is not packaged, so no shipped output changes.
5. page.css goes beyond the Auth source in two ways.
   It adds `h1` to `h3` font sizes, and it adds a `--color-link-hover` hover color.
   The docs record both, but the log has no `[Decided]` entry for them.

## Required Rework
None.
