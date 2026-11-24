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
- [x] **[Implement]** Add a unit check asserting source and test comments contain no sibling-app references.
- [x] **[Verify]**    Run the new check and confirm it fails on the existing mentions.
- [x] **[Implement]** Rewrite comments in `src/js/` and `tests/` in clean, app-neutral language.
- [x] **[Verify]**    Run `python scripts/devops.py check` and confirm zero remaining sibling-app comment matches.
- [x] **[Doc]**       Update `CHANGELOG.md` without removing provenance notes from `docs/`.
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

- [2026-11-24] **[Implement]**
  Added comment-neutrality.test.js checking src/js/, src/css/, tests/unit/, and tests/e2e/ comments and test titles.
  - Red-phase Vitest run failed with 65 violations across 36 files.

- [2026-11-24] **[Implement]**
  Rewrote sibling-app mentions across 19 src/js/, 15 tests/unit/, and 2 tests/e2e/ files into app-neutral descriptions.
  - Preserved all runtime code, exported aliases, and public APIs unchanged.
  - Verified comment-neutrality.test.js passes with zero remaining sibling-app matches.

- [2026-11-24] **[Doc]**
  Added v0.4.1-pre entry to CHANGELOG.md while preserving provenance history under docs/.

- [2026-11-24] **[Verify]**
  Verified all linters, pytest (61 passed), Vitest (2622 passed), Playwright (1158 passed), and integration (7 passed) with zero sibling-app comment matches.
  - Installed worktree node_modules via npm ci so generate-app integration tests pass.
  - Recorded verbatim terminal evidence in validation-proof.md.

- [2026-11-24] **[Verify]**
  Recorded task outcomes.
  - Files touched: 36.
  - Lines touched: 142.
  - Reopenings: 0.

