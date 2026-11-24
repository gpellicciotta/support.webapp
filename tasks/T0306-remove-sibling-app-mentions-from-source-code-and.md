---
id: T0306
owner: "@gemini"
session: antigravity-20261124-8ba8c9
needs: []
branch: task/T0306-remove-sibling-app-mentions-from-source-code-and
worktree: .plan/work/T0306-remove-sibling-app-mentions-from-source-code-and
status: active
started_at: "2026-11-24T09:07:07Z"
ended_at: —
review: agent
preview: none
protocol: standard
size_status: approved
size_estimate: 36 files, 160 lines
usage:
  worker: {turns: 1, duration_s: 321.7, input: 90075, output: 11069, cache_read: 823341}
work_duration: 334.1
size_approved: 36 files, 160 lines
size_approved_by: "@giova"
size_approved_at: "2026-11-24T09:06:50Z"
---
# T0306: Remove sibling app mentions from source code and test comments

## Goals
Remove all mentions of sibling or legacy apps (`Auth`, `Counters`, `ToDo`, `todos.webapp`, `meteo`, `family-portal`, `support.js`) from comments in `src/` and `tests/`.
Rewrite comments and test descriptions to explain payload shapes, signatures, and behavior directly so readers need no knowledge of other apps.
Keep provenance history in `docs/` (such as `components.md` and ADRs) untouched, and preserve all runtime code and public APIs.
See [technical-spec.md](T0306-remove-sibling-app-mentions-from-source-code-and/technical-spec.md).

## Task Execution Steps
- [x] **[Read]**      Scan `src/` and `tests/` for all sibling-app mentions in comments and test descriptions.
- [ ] **[Implement]** Add a unit check asserting source and test comments contain no sibling-app references.
- [ ] **[Verify]**    Run the new check and confirm it fails on the existing mentions.
- [ ] **[Implement]** Rewrite comments in `src/js/` and `tests/` in clean, app-neutral language.
- [ ] **[Verify]**    Run `python scripts/devops.py check` and confirm zero remaining sibling-app comment matches.
- [ ] **[Doc]**       Update `CHANGELOG.md` without removing provenance notes from `docs/`.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-24] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-24] **[Read]**
  Scanned src/ and tests/; confirmed 36 counted files (~160 lines) match the declared scope, exceeding the 18-file large line.
  - 19 files in src/js/, 15 in tests/unit/, 2 in tests/e2e/, 0 in src/css/.
  - Requesting human size approval before editing, or confirmation to split by folder.

- [2026-11-24] **[Size]**
  Size approval requested for 36 files, 160 lines.

- [2026-11-24] **[Size]**
  Size approved by @giova for 36 files, 160 lines.

