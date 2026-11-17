## Walkthrough & Validation
Paths are trimmed to the repository root; omission markers replace unrelated lines.

### Red: new tests before the lockfile steps
Command: `python -m pytest tests/test_release_lockfile.py -q -n 0 --tb=line` (exit code 1).
The pipeline class and lockfile function were empty placeholders; the CLI test already passed.

```text
E   AssertionError: assert ('0.3.0-pre', '0.3.0-pre') == ('0.3.0', '0.3.0')
tests\test_release_lockfile.py:118: AssertionError: assert ('0.3.0-pre', '0.3.0-pre') == ('0.3.0', '0.3.0')
E   assert '{\r\n  "name...n  }\r\n}\r\n' == '{\r\n  "name...n  }\r\n}\r\n'
tests\test_release_lockfile.py:130: assert '{\r\n  "name...n  }\r\n}\r\n' == '{\r\n  "name...n  }\r\n}\r\n'
E   Failed: DID NOT RAISE ValueError
tests\test_release_lockfile.py:135: Failed: DID NOT RAISE ValueError
E   AssertionError: assert [] == ['[dry-run] e...ns 0.3.1-pre']
tests\test_release_lockfile.py:144: AssertionError: assert [] == ['[dry-run] e...ns 0.3.1-pre']
FAILED tests/test_release_lockfile.py::test_release_freezes_and_reopens_lockfile_versions
FAILED tests/test_release_lockfile.py::test_lockfile_edit_keeps_dependency_versions_and_line_endings
FAILED tests/test_release_lockfile.py::test_lockfile_edit_rejects_a_lockfile_without_root_versions
FAILED tests/test_release_lockfile.py::test_dry_run_lists_the_lockfile_in_both_version_steps
4 failed, 1 passed in 0.16s
```

### Green: new tests after the change
Command: `python -m pytest tests/test_release_lockfile.py -q -n 0 --tb=short` (exit code 0).

```text
.....                                                                    [100%]
5 passed in 0.28s
```

### Full check
Command: `python scripts/devops.py check` (exit code 1).
Lint, pytest, Vitest, and Playwright passed; the integration suite failed in its generated apps.

```text
All 27 markdown files passed linting.
All checks passed!
9 files already formatted
======================== 61 passed, 1 skipped in 2.58s ========================
 Test Files  34 passed (34)
      Tests  2184 passed (2184)
  42 skipped
  830 passed (9.8m)
All 8 markdown files passed linting.
[... 1100 lines omitted ...]
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from {{temp}}/design-generate-WkBlQn\sample-neutral\eslint.config.js
[... 100 lines omitted ...]
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
   Start at  20:56:49
   Duration  41.04s (tests 99%)
**[ERROR]** Finished devops check in 661.7s with status: failed
```

The worktree `node_modules` lacked `@stylistic/eslint-plugin`; its own ESLint resolved it from the main checkout.
Generated apps link only the worktree `node_modules`, so `npm ci` repaired the install.
Command: `npm ci`, then `npm run test:integration` (exit code 0).

```text
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Duration  60.95s (tests 100%)
```

### Release dry run
Run in a temporary clone of the task branch, checked out as `main`, since releases require `main`.
Command: `python scripts/devops.py release --dry-run` (exit code 0).

```text
Release version: v0.2.2
Next version: v0.2.3-pre
Dry run: True
[dry-run] Skipping the quality check.
[dry-run] edit CHANGELOG.md: ## v0.2.2 [released: 2026-11-17]
[dry-run] edit package.json: "version": "0.2.2"
[dry-run] edit package-lock.json: root versions 0.2.2
[dry-run] git add CHANGELOG.md package.json package-lock.json
[dry-run] git commit -m "Released version 0.2.2."
[dry-run] build release assets from the frozen version
[dry-run] git tag v0.2.2
[dry-run] git push origin main
[dry-run] git push origin v0.2.2
[dry-run] gh release create v0.2.2 --title v0.2.2 --notes-file <notes-file> <built-assets>
[dry-run] edit CHANGELOG.md: ## v0.2.3-pre
[dry-run] edit package.json: "version": "0.2.3-pre"
[dry-run] edit package-lock.json: root versions 0.2.3-pre
[dry-run] git add CHANGELOG.md package.json package-lock.json
[dry-run] git commit -m "Started version 0.2.3-pre after the 0.2.2 release."
[dry-run] git push origin main
[dry-run] No changes were made.
```
