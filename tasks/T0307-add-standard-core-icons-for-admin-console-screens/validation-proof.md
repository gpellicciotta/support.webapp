## Walkthrough & Validation
Promoted the seven Auth admin console screen icons (`icon-overview`, `icon-people`, `icon-sessions`, `icon-events`, `icon-logs`, `icon-broadcast`, `icon-note`) to `src/contract.json` and all four look sprites.
Updated default icons in the five admin screen modules, gallery `#icon`, `shell-admin-console.html`, documentation, and `CHANGELOG.md`.

### Red-Phase Proof
Command: `npx vitest run tests/unit/icon.test.js tests/unit/admin-console.test.js` (exit code: 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0307-add-standard-core-icons-for-admin-console-screens

 ❯ tests/unit/icon.test.js (68 tests | 5 failed) 96ms
[... 180 lines omitted ...]
 FAIL  tests/unit/icon.test.js > core icon ids > lists unique icon-prefixed kebab-case ids, validation and admin console icons included
 FAIL  tests/unit/icon.test.js > core icon ids > bright sprite > provides the seven standard admin console screen glyphs
 FAIL  tests/unit/icon.test.js > core icon ids > neutral sprite > provides the seven standard admin console screen glyphs
 FAIL  tests/unit/icon.test.js > core icon ids > warm sprite > provides the seven standard admin console screen glyphs
 FAIL  tests/unit/icon.test.js > core icon ids > _template sprite > provides the seven standard admin console screen glyphs
[... 40 lines omitted ...]
 Test Files  2 failed (2)
      Tests  7 failed | 76 passed (83)
   Start at  09:23:02
   Duration  3.04s (environment 55%, transform 23%, tests 13%, import 8%, worker 1%)
```

### Green-Phase Affected Unit Tests
Command: `npx vitest run tests/unit/icon.test.js tests/unit/admin-console.test.js` (exit code: 0)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0307-add-standard-core-icons-for-admin-console-screens

 ✓ tests/unit/icon.test.js (68 tests) 69ms
 ✓ tests/unit/admin-console.test.js (15 tests) 323ms

 Test Files  2 passed (2)
      Tests  83 passed (83)
   Start at  09:24:49
   Duration  2.81s (environment 60%, tests 16%, transform 14%, import 8%, worker 2%)
```

### Full Repository Check and Follow-Up Integration Verification
Command: `python scripts/devops.py check` (exit code: 1 — failed only on `generate-app.test.js` before installing worktree `node_modules`)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 36688
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 25340
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 21320
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 10816
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 31932
[... 12 lines omitted ...]
======================== 61 passed, 1 skipped in 5.28s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 35368
[... 80 lines omitted ...]
 Test Files  62 passed (62)
      Tests  2621 passed (2621)
   Start at  09:26:37
   Duration  24.03s (environment 57%, import 24%, tests 13%, transform 4%, worker 2%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 38992
[... 1425 lines omitted ...]
  50 skipped
  1158 passed (10.1m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 18024
[... 130 lines omitted ...]
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
**[ERROR]** Finished devops check in 679.0s with status: failed
```

After running `npm ci` in the worktree (exit code: 0), verified `npm run test:integration`, `python scripts/devops.py build`, and `python scripts/devops.py lint`:

Command: `npm run test:integration` (exit code: 0)

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0307-add-standard-core-icons-for-admin-console-screens

 ✓ tests/integration/vendor.test.js (1 test) 10883ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 10879ms
 ✓ tests/integration/pack.test.js (3 tests) 3218ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 3209ms
 ✓ tests/integration/generate-app.test.js (3 tests) 63551ms
   ✓ generates a neutral app that passes its own checks and the conformance check 27751ms
   ✓ generates a warm app that passes its own checks and the conformance check 20922ms
   ✓ generates a bright app that passes its own checks and the conformance check 14874ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  09:39:16
   Duration  79.32s (tests 99%)
```

Command: `python scripts/devops.py build` (exit code: 0)

```text
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 22256
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 140 lines omitted ...]
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.2 MB
npm notice unpacked size: 2.0 MB
npm notice total files: 141
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

Command: `python scripts/devops.py lint` (exit code: 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 10420
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 38776
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 35880
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 28980
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

### Visual Verification Screenshots
Verified HTTP 200 and zero browser console, page, or network errors in light and dark themes.
- Gallery `#icon` before (light): [gallery-icon-before-light.png](gallery-icon-before-light.png)
- Gallery `#icon` after (light): [gallery-icon-after-light.png](gallery-icon-after-light.png)
- Gallery `#icon` before (dark): [gallery-icon-before-dark.png](gallery-icon-before-dark.png)
- Gallery `#icon` after (dark): [gallery-icon-after-dark.png](gallery-icon-after-dark.png)
- Admin console before (light): [admin-console-before-light.png](admin-console-before-light.png)
- Admin console after (light): [admin-console-after-light.png](admin-console-after-light.png)
- Admin console before (dark): [admin-console-before-dark.png](admin-console-before-dark.png)
- Admin console after (dark): [admin-console-after-dark.png](admin-console-after-dark.png)
