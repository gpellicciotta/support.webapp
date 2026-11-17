---
id: T0247
owner: "@claude"
needs: []
branch: task/T0247-make-the-release-action-bump-package-lock-json
worktree: .plan/work/T0247-make-the-release-action-bump-package-lock-json
status: active
started_at: "2026-11-17T19:40:31Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0247: Make the release action bump package-lock.json with package.json, which v0.1.0 and v0.2.0 both left one version behind

## Goals
Make `python scripts/devops.py release` set the `package-lock.json` root versions with every `package.json` version change.
Both v0.1.0 and v0.2.0 left the lockfile at the previous `-pre` version; commits fixed it by hand afterwards.
Cover the frozen release version and the next development version, and check the dry run lists the lockfile.

## Task Execution Steps
- [ ] **[Read]**      Read how devops.py and the support.python release pipeline edit version files.
- [ ] **[Implement]** Author a failing test showing the release and next-version steps leave the lockfile behind.
- [ ] **[Verify]**    Run the new test and confirm it fails for the expected reason.
- [ ] **[Implement]** Update both lockfile root versions in the release and next-version steps.
- [ ] **[Verify]**    Run `python scripts/devops.py check` and `python scripts/devops.py release --dry-run`.
- [ ] **[Doc]**       Update CHANGELOG.md and the release section of docs/devops.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Found while releasing v0.2.0; commit after the release synced the lockfile to 0.2.1-pre by hand.
