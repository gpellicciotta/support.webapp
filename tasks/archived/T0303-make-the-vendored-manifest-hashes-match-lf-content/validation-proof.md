## Walkthrough & Validation
- Added `fileHash(path)` to [check.mjs](../../../../bin/check.mjs) to normalize `\r\n` to `\n` for `css`, `js`, `mjs`, `json`, `svg`, `html`, `md`, and `txt` files while leaving lone `\r` bytes unchanged and hashing all other files as raw bytes.
- Updated `buildManifest()` in [manifest.mjs](../../../../bin/manifest.mjs) to import and use `fileHash`.
- Added unit and integration tests for LF, CRLF, lone CR, text edits, and binary `\r\n` bytes across [check.test.js](../../../../tests/unit/check.test.js), [manifest.test.js](../../../../tests/unit/manifest.test.js), and [vendor.test.js](../../../../tests/integration/vendor.test.js).
- Updated [ADR-0005-distribution-and-versioning.md](../../../../docs/adrs/ADR-0005-distribution-and-versioning.md), [devops.md](../../../../docs/devops.md), and [CHANGELOG.md](../../../../CHANGELOG.md).

### Red-Phase Unit Verification
Command: `npx vitest run tests/unit/check.test.js tests/unit/manifest.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0303-make-the-vendored-manifest-hashes-match-lf-content

 ❯ tests/unit/manifest.test.js (3 tests | 2 failed) 102ms
   ❯ package manifest (3)
     × hashes shipped bytes and classifies look files without demo files or app icons 51ms
     ✓ uses the shipped manifest only while it matches the package files 16ms
     × builds equal hashes from LF and CRLF text trees and raw hashes for binaries 33ms
 ❯ tests/unit/check.test.js (19 tests | 1 failed) 186ms
[... 18 lines omitted ...]
     × passes a vendored copy rewritten to CRLF and back to LF 28ms
     ✓ fails a changed character or lone carriage return in a text file 16ms
     ✓ fails a binary file whose CRLF bytes become LF 21ms
     ✓ resolves relative roots and rejects paths that leave them 1ms
[... 11 lines omitted ...]
  {
    "integrity": {
-     "errors": [],
+     "errors": [
+       "Changed file: css/style.css",
+       "Changed file: js/app.js",
+     ],
    },
-   "ok": true,
+   "ok": false,
  }
[... 41 lines omitted ...]
 Test Files  2 failed (2)
      Tests  3 failed | 19 passed (22)
   Start at  16:07:36
   Duration  494ms (tests 65%, transform 19%, import 13%, worker 4%)
```

### Red-Phase Integration Verification
Command: `npm run test:integration -- tests/integration/vendor.test.js`
Exit code: `1`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js tests/integration/vendor.test.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0303-make-the-vendored-manifest-hashes-match-lf-content

 ❯ tests/integration/vendor.test.js (1 test | 1 failed) 2441ms
   × packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 2440ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/integration/vendor.test.js > packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments
AssertionError: Changed file: looks/neutral/fonts/OFL.txt
: expected 1 to be +0 // Object.is equality

- Expected
+ Received

- 0
+ 1

 ❯ tests/integration/vendor.test.js:42:44
[... 8 lines omitted ...]
 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  16:07:43
   Duration  2.69s (tests 98%, transform 1%, import 1%)
```

### Green-Phase Full Verification
Command: `python scripts/devops.py check`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 19300
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 27244
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 32360
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 20752
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
[... 13 lines omitted ...]
======================= 61 passed, 1 skipped in 17.12s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 57 lines omitted ...]
 Test Files  38 passed (38)
      Tests  2262 passed (2262)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 3 lines omitted ...]
Running 908 tests using 4 workers
[... 1128 lines omitted ...]
  42 skipped
  866 passed (8.6m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 4 lines omitted ...]
 ✓ tests/integration/generate-app.test.js (3 tests) 77811ms
[... 3 lines omitted ...]
 ✓ tests/integration/vendor.test.js (1 test) 8698ms
[... 1 line omitted ...]
 ✓ tests/integration/pack.test.js (3 tests) 2918ms
[... 1 line omitted ...]
 Test Files  3 passed (3)
      Tests  7 passed (7)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
[... 131 lines omitted ...]
npm notice total files: 115
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
