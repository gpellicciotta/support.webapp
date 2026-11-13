## Walkthrough & Validation

### Failing Tests Before Implementation
The completion check of the specification finds no file, because the default config includes only unit tests:

```text
$ npx vitest run tests/integration/pack.test.js
exit code 1
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0015-add-the-github-packages-publish-workflow-and-document
No test files found, exiting with code 1
filter: tests/integration/pack.test.js
include: tests/unit/**/*.test.js
exclude:  **/*.slow.test.*
```

The integration config runs the new test, which fails for all three missing pieces:

```text
$ npx vitest run --config vitest.integration.config.js tests/integration/pack.test.js
exit code 1
 ❯ tests/integration/pack.test.js (3 tests | 3 failed) 1090ms
   × packs the source layout of ADR-0008 without the gallery or repository tooling 1083ms
   × publishes to GitHub Packages from a published GitHub Release only 2ms
   × declares the changelog areas of ADR-0005 in the changelog header 4ms
 FAIL  tests/integration/pack.test.js > packs the source layout of ADR-0008 without the gallery or repository tooling
AssertionError: expected [ 'src/contract.json', …(12) ] to deeply equal [ 'src/contract.json', …(11) ]
[... 6 lines omitted ...]
    "src/css/style.css",
+   "src/index.html",
    "src/js/i18n.js",
[... 12 lines omitted ...]
 FAIL  tests/integration/pack.test.js > publishes to GitHub Packages from a published GitHub Release only
AssertionError: expected undefined to deeply equal { Object (registry) }
- Expected:
{
  "registry": "https://npm.pkg.github.com",
}
+ Received:
undefined
[... 8 lines omitted ...]
 FAIL  tests/integration/pack.test.js > declares the changelog areas of ADR-0005 in the changelog header
AssertionError: expected '# Changelog\r\nAll notable changes to…' to contain '`Tokens`'
[... 15 lines omitted ...]
 Test Files  1 failed (1)
      Tests  3 failed (3)
```

### Passing Tests After Implementation

```text
$ npx vitest run --config vitest.integration.config.js tests/integration/pack.test.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0015-add-the-github-packages-publish-workflow-and-document
 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  11:25:58
exit code 0
```

### Full Project Check
The check lints Markdown offline, including the changed `docs/devops.md` and `README.md`.

```text
$ python scripts/devops.py check
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 55792
All 21 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 71380
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
[... 20 lines omitted ...]
============================== 3 passed in 2.83s ==============================
 Test Files  5 passed (5)
      Tests  472 passed (472)
  8 passed (4.8s)
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 15 lines omitted ...]
npm notice Tarball Contents
npm notice 165B src/css/style.css
npm notice 184B src/looks/neutral/index.css
npm notice total files: 21
[... npm notice lines omitted ...]
exit code 0
```
