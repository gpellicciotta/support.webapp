---
task: T0306
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T09:38:16Z
reviewed_commit: "7e849c3"
base_commit: "67c8d4d"
branch: task/T0306-remove-sibling-app-mentions-from-source-code-and
session: claude-20261124-c59fa1
session_agent: claude-code
session_created_at: 2026-11-24T09:36:33Z
---
# Review Findings: Task T0306 (Round 1)

## Summary
The work meets the goals and technical specification.
- All 36 declared files had their sibling-app mentions rewritten in app-neutral terms.
- The rewrites describe payload shapes and signatures directly, for example nested `extra-info` versus flat kebab-case status, and `token.user.email` versus `user-email`.
- `src/` and `tests/e2e/` diffs touch comment lines only. Test diffs change titles and comments only. No runtime code or public API changed.
- `docs/` and app-icon files are untouched.
- `comment-neutrality.test.js` covers `src/js/`, `src/css/`, `tests/unit/`, and `tests/e2e/`. The proof records its red phase with 65 violations.

Reviewer verification on `7e849c3`:
- `npx vitest run tests/unit/comment-neutrality.test.js`: 1 passed.
- `python scripts/devops.py tests`: pytest 61 passed, 1 skipped; Vitest 63 files, 2622 tests passed.
- `python scripts/devops.py lint`: lint-markdown, Ruff, Ruff format, and ESLint passed.
- `plan tasks validate T0306 --completion`: passed.
- A grep of `src/js` and `src/css` finds no sibling-app names anywhere.
- I did not rerun Playwright or integration suites. The diff changes only comments and titles there, and the proof records both suites passing.

## Defects
None.

## Process Gaps
Non-blocking:
1. `SIBLING_APP_PATTERN` in `tests/unit/comment-neutrality.test.js` matches case-insensitive `\btodo\b` and `\bauth\b`. Any future `// TODO:` comment, or generic "auth" wording such as "auth header", will fail the test. A case-sensitive `ToDo`/`Auth` match or an allowlist would avoid these false positives.
2. Test fixture identifiers and sample data still use sibling names: `makeAuthReleases`, `authStatus`, `fromAuth`, and `authRows`. Sample strings include `'ToDo notice'`, `'Back to Auth'`, `appName: 'Auth'`/`'Counters'`, and `auth.example.test`. These are outside the comment-and-title scope, and rule 3 makes sample-label changes optional. A follow-up could neutralize them.
3. The completion check `python scripts/devops.py check` failed once because the worktree lacked `node_modules`. Integration passed after `npm ci`, and the proof states this openly. The full check was not rerun end to end after that.

## Required Rework
None.
