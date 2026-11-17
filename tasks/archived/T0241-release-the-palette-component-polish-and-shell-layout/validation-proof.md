## Walkthrough & Validation
Commit `17ad214` renamed the `v0.1.1-pre` heading to `v0.2.0-pre`.
It set `package.json` and `package-lock.json` to `0.2.0-pre`.
The release pipeline freezes the heading with the release date when `release --yes` runs on `main`.

### Full check
Command: `python scripts/devops.py check`. Exit code: 0.

```text
Command: lint-markdown.EXE check --offline
All 27 markdown files passed linting.
Command: python.exe -m ruff check scripts tests
All checks passed!
Command: python.exe -m ruff format --check scripts tests
8 files already formatted
Command: npm.CMD run lint
> @gpellicciotta/support.webapp@0.2.0-pre lint
> eslint .
Command: python.exe -m pytest
======================== 56 passed, 1 skipped in 2.40s ========================
Command: npm.CMD test
 Test Files  34 passed (34)
      Tests  2184 passed (2184)
Command: npm.CMD run test:slow
  42 skipped
  830 passed (6.0m)
Command: npm.CMD run test:integration
 Test Files  3 passed (3)
      Tests  7 passed (7)
Command: npm.CMD pack --dry-run
npm notice 📦  @gpellicciotta/support.webapp@0.2.0-pre
npm notice total files: 107
gpellicciotta-support.webapp-0.2.0-pre.tgz
```

### Worktree environment note
The first check run failed 3 `generate-app.test.js` integration tests with exit code 1.
The test junctions the checkout's own `node_modules`, which the fresh worktree lacked.
`npm ci` installed it; the rerun above passed unchanged code.

```text
 ❯ tests/integration/generate-app.test.js (3 tests | 3 failed) 6330ms
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@stylistic/eslint-plugin' imported from ...\design-generate-NUvBdE\sample-neutral\eslint.config.js
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
```
