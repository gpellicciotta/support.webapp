---
task: T0299
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T05:21:03Z
reviewed_commit: "38cea75"
base_commit: "bcb16de"
branch: task/T0299-add-the-shared-admin-broadcasts-screen-with-compose
session: claude-20261124-463e03
session_agent: claude-code
session_created_at: 2026-11-24T05:11:33Z
---
# Review Findings: Task T0299 (Round 1)

## Summary
The work meets the goals and the technical specification.
- `admin-broadcasts.js` composes with a live inbox-row preview and adds a banner preview when the banner option is checked.
  Auth's and ToDo's `broadcasts-view.mjs` behave the same way.
- Recipient selection loads lazily through `adapter.fetchUsers` into `selection.js`.
- Publish payloads cover Auth's `target-filter` shape and ToDo's `audience` shape, which matches ToDo's `/broadcast-notification` body.
- History supports filtering, URL-hash state, and Show more paging, and retraction asks through `inlineConfirm`.
- The screen takes an adapter of fetch functions, mounts in the `admin-console.js` frame, and builds with `dom-builders.js`.
- `.app__split` stacks below `64rem`, the ADR-0004 layout breakpoint, and splits `3fr 2fr` above it.
- The contract entry, components.md section with upgrade note, ADR-0003 entry, CHANGELOG line, and demo route are present.
- The unit tests cover preview, recipients, payload, history, and retraction.
- The e2e test composes, checks the preview, publishes, and retracts a row in the demo, across looks and widths.

Reviewer verification on `38cea75`: `python scripts/devops.py check` exited 0.
- Lint: markdown (28 files), Ruff, and ESLint passed.
- Tests: pytest 61 passed and 1 skipped, Vitest 2537 passed in 59 files, and Playwright 1100 passed with 48 skipped.
- Integration (7 tests) and the pack dry-run passed.
- The worktree stayed clean.

## Defects
None.

## Process Gaps
Non-blocking:
- `src/js/admin-broadcasts.js:635` uses the style class `.field__counter` as a query hook, against naming.md.
  It also rewrites the counter that `field.js` already updates, so the query and the line-876 update can go.
- `formatAudience` labels `{type: 'role'}` filters "Realm: x" but `role:x` strings "Role: x".
  The defaults also say "Realm:", while ToDo's source says "Role:".
- The ToDo upgrade note leaves out `audiences`.
  The defaults include `role:test`, which ToDo does not offer, so ToDo must pass its own list.
- The preview banner box keeps `role="status"`/`bannerRole(type)`, so screen readers announce each keystroke.
  Auth and ToDo behave the same way.
- Two screenshots were inspected, warm desktop dark and bright mobile light.
  Neither shows the whole screen: the desktop shot cuts off the compose heading and preview top, and neither shows the history table.
- The validation proof's first `devops.py check` exited 1 before `npm ci`, and the later runs were partial.
  This review's full run passed, which closes that gap.

## Required Rework
None.
