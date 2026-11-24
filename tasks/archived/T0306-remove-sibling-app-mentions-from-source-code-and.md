---
id: T0306
owner: "@gemini"
session: antigravity-20261124-8ba8c9
needs: []
branch: task/T0306-remove-sibling-app-mentions-from-source-code-and
worktree: .plan/work/T0306-remove-sibling-app-mentions-from-source-code-and
status: completed
started_at: "2026-11-24T09:07:07Z"
ended_at: "2026-11-24T09:38:18Z"
review: agent
preview: none
protocol: standard
size_status: approved
size_estimate: 36 files, 160 lines
usage:
  worker: {turns: 2, duration_s: 2075.0, input: 798685, output: 45799, cache_read: 6953276}
  review: {turns: 1, duration_s: 99.7, input: 20, output: 3919, cache_read: 488755, cache_write: 50902}
work_duration: 2174.7
size_approved: 36 files, 160 lines
size_approved_by: "@giova"
size_approved_at: "2026-11-24T09:06:50Z"
review_status: approved
review_round: 1
review_requested_at: "2026-11-24T09:36:32Z"
reviewed_by: "@claude"
review_session: claude-20261124-c59fa1
completion-commit: 70efc2e2a14b5cd6ff9236c9b09b63ec87a6dc18
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
- [x] **[Review]**    Obtain review approval of the finished work before completion.

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

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-24] **[Review]**
  Round 1 approved by @claude: The work meets the goals and technical specification.
  - Findings: [review-findings-1.md](T0306-remove-sibling-app-mentions-from-source-code-and/review-findings-1.md).

- [2026-11-24] **[Complete]**
  Task completed successfully.

