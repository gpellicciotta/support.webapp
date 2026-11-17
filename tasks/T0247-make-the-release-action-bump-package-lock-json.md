---
id: T0247
owner: "@claude"
session: claude-20261117-98ef05
needs: []
branch: task/T0247-make-the-release-action-bump-package-lock-json
worktree: .plan/work/T0247-make-the-release-action-bump-package-lock-json
status: active
started_at: "2026-11-17T19:40:31Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1202.8, input: 90, output: 22172, cache_read: 3548696, cache_write: 86946}
review_status: pending
review_round: 1
review_requested_at: "2026-11-17T20:00:46Z"
---
# T0247: Make the release action bump package-lock.json with package.json, which v0.1.0 and v0.2.0 both left one version behind

## Goals
Make `python scripts/devops.py release` set the `package-lock.json` root versions with every `package.json` version change.
Both v0.1.0 and v0.2.0 left the lockfile at the previous `-pre` version; commits fixed it by hand afterwards.
Cover the frozen release version and the next development version, and check the dry run lists the lockfile.

## Task Execution Steps
- [x] **[Read]**      Read how devops.py and the support.python release pipeline edit version files.
- [x] **[Implement]** Author a failing test showing the release and next-version steps leave the lockfile behind.
- [x] **[Verify]**    Run the new test and confirm it fails for the expected reason.
- [x] **[Implement]** Update both lockfile root versions in the release and next-version steps.
- [x] **[Verify]**    Run `python scripts/devops.py check` and `python scripts/devops.py release --dry-run`.
- [x] **[Doc]**       Update CHANGELOG.md and the release section of docs/devops.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Found while releasing v0.2.0; commit after the release synced the lockfile to 0.2.1-pre by hand.

- [2026-11-17] **[Implement]**
  Added LockfileReleasePipeline to devops.py; pinned support.python v3.1.0 writes only package.json.
  - Each package.json version edit now edits package-lock.json.
  - Both git add steps stage the lockfile.

- [2026-11-17] **[Verify]**
  Check exited 1 only in generated-app integration tests from a stale worktree install; npm ci fixed it, and the suite passed.
  - Lint, pytest, Vitest, and Playwright passed in the full check.
  - Release dry run lists both lockfile edits.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 2.
  - Lines touched: 94.
  - Reopenings: 0.

- [2026-11-17] **[Read]**
  ReleasePipeline v3.1.0 edits only the first version file; later versions add only a next-version hook, so devops.py overrides the plan.

- [2026-11-17] **[Verify]**
  New tests failed on assertions: lockfile stayed at 0.3.0-pre, dry run listed no lockfile edits.

- [2026-11-17] **[Doc]**
  Added a CHANGELOG.md DevEx entry and described the lockfile edits under Making a Release in docs/devops.md.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

