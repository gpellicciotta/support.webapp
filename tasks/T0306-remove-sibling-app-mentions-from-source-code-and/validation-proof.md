## Walkthrough & Validation

### Summary of Changes
- Added `tests/unit/comment-neutrality.test.js` asserting that `src/js/`, `src/css/`, `tests/unit/`, and `tests/e2e/` contain no sibling-application names in comments or test titles.
- Rewrote 65 sibling-app comment and test-title occurrences across 36 files (19 in `src/js/`, 15 in `tests/unit/`, 2 in `tests/e2e/`) into direct, app-neutral descriptions without altering runtime code or public APIs.
- Added an entry under `v0.4.1-pre` in `CHANGELOG.md` and left `docs/` provenance history untouched.

### Red-Phase Test Run
Command: `npx vitest run tests/unit/comment-neutrality.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0306-remove-sibling-app-mentions-from-source-code-and

 ❯ tests/unit/comment-neutrality.test.js (1 test | 1 failed) 470ms
   ❯ comment neutrality across source and tests (1)
     × contains no sibling-application references in source or test comments and test titles 467ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/comment-neutrality.test.js > comment neutrality across source and tests > contains no sibling-application references in source or test comments and test titles
AssertionError: expected [ …(65) ] to deeply equal []

- Expected
+ Received

- []
+ [
+   "src/js/action-registry.js:1 [comment] matched \"Auth\"",
+   "src/js/action-registry.js:369 [comment] matched \"Auth\"",
[... 61 lines omitted ...]
+   "tests/e2e/verify-ui.spec.js:1 [comment] matched \"family-portal\"",
+   "tests/e2e/verify-ui.spec.js:409 [comment] matched \"family-portal\"",
+ ]

 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  10:08:58
   Duration  1.00s (tests 79%, transform 11%, import 7%, worker 2%)
```

### Green-Phase Comment Neutrality Verification
Command: `npx vitest run tests/unit/comment-neutrality.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0306-remove-sibling-app-mentions-from-source-code-and

 ✓ tests/unit/comment-neutrality.test.js (1 test) 509ms
   ✓ comment neutrality across source and tests (1)
     ✓ contains no sibling-application references in source or test comments and test titles 505ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  10:14:58
   Duration  999ms (tests 88%, import 7%, transform 3%, worker 2%)
```

Command: `python -c "import pathlib, re; pat = re.compile(r'\b(auth|counters|todo|todos\.webapp|meteo|family-portal|support\.js)\b', re.I); dirs = ['src/js', 'src/css', 'tests/unit', 'tests/e2e']; root = pathlib.Path('.'); hits = [f'{f.as_posix()}:{i}: {l.strip()}' for d in dirs for f in sorted((root/d).rglob('*')) if f.is_file() for i, l in enumerate(f.read_text(encoding='utf-8').splitlines(), 1) if (l.strip().startswith('//') or l.strip().startswith('*') or l.strip().startswith('/*')) and pat.search(l)]; print(f'Remaining comment matches: {len(hits)}'); [print(h) for h in hits]"`
Exit code: `0`

```text
Remaining comment matches: 0
```

### Full Check Suite
Command: `python scripts/devops.py check`
Exit code: `1` (lint-markdown, ruff, eslint, pytest, vitest, and all 1158 Playwright tests passed; `generate-app.test.js` failed before `npm ci` because the worktree `node_modules/` contained only Vitest caches)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 12248
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 27140
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 8976
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 12152
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
[... 12 lines omitted ...]
8 workers [62 items]
..................................s...........................           [100%]
======================== 61 passed, 1 skipped in 7.26s ========================
[... 87 lines omitted ...]
 Test Files  63 passed (63)
      Tests  2622 passed (2622)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 9604
> @gpellicciotta/support.webapp@0.4.1-pre test:slow
> playwright test
Running 1208 tests using 4 workers
[... 1428 lines omitted ...]
  50 skipped
  1158 passed (11.7m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 28604
[... 132 lines omitted ...]
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
   Start at  10:28:09
   Duration  29.74s (tests 99%)
**[ERROR]** Finished devops check in 777.1s with status: failed
```

### Integration Suite After `npm ci` in Worktree
Command: `npm run test:integration`
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0306-remove-sibling-app-mentions-from-source-code-and

 ✓ tests/integration/vendor.test.js (1 test) 9494ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 9490ms
 ✓ tests/integration/pack.test.js (3 tests) 3371ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 3364ms
 ✓ tests/integration/generate-app.test.js (3 tests) 91334ms
   ✓ generates a neutral app that passes its own checks and the conformance check 31698ms
   ✓ generates a warm app that passes its own checks and the conformance check 35954ms
   ✓ generates a bright app that passes its own checks and the conformance check 23677ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  10:31:07
   Duration  105.65s (tests 100%)
```
