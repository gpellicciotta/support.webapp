## Walkthrough & Validation

### Summary of Changes
- Added [help-page.js](../../../../src/js/help-page.js) exporting `attachHelpPage`, `createHelpPage`, `buildFeedbackMailto`, `parseHelpQuery`, and `formatHelpQuery`, reusing `collapsible.js`, `release-notes.js`, and `icon.js` via `data-help-page-*` hooks and ARIA states.
- Added [help-page.css](../../../../src/css/components/help-page.css) imported in [style.css](../../../../src/css/style.css) and registered `help-page` in [contract.json](../../../../src/contract.json).
- Added the standalone [help-page.html](../../../../src/demo/help-page.html) and [help-page-demo.js](../../../../src/demo/help-page-demo.js) demo page, plus the `#help-page` specimen in [visual-style-gallery.html](../../../../src/demo/visual-style-gallery.html) wired in [gallery.js](../../../../src/demo/gallery.js).
- Added unit tests in [help-page.test.js](../../../../tests/unit/help-page.test.js) and Playwright browser tests in [help-page.spec.js](../../../../tests/e2e/help-page.spec.js).
- Updated [components.md](../../../../docs/specs/components.md), [ADR-0003-components-and-patterns.md](../../../../docs/adrs/ADR-0003-components-and-patterns.md), and [CHANGELOG.md](../../../../CHANGELOG.md).

### Red-Phase Proof (Before Implementation)

Command: `npx.cmd vitest run tests/unit/help-page.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0292-add-a-help-page-pattern-with-search-topic

 ❯ tests/unit/help-page.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/help-page.test.js [ tests/unit/help-page.test.js ]
Error: Failed to resolve import "../../src/js/help-page.js" from "tests/unit/help-page.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0292-add-a-help-page-pattern-with-search-topic/tests/unit/help-page.test.js:10:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
```

Command: `npx.cmd playwright test tests/e2e/help-page.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 3 tests using 3 workers

  ✘  3 [desktop-light] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks (845ms)
  ✘  2 [desktop-light] › tests\e2e\help-page.spec.js:125:5 › help page pattern › applies ?topic= and ?q= query parameters on load (3.0s)
  ✘  1 [desktop-light] › tests\e2e\help-page.spec.js:141:5 › help page pattern › renders the help-page gallery section cleanly without overflow (6.4s)


  1) [desktop-light] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: 200
    Received: 404
[... 54 lines omitted ...]
  3 failed
```

### Green-Phase Verification

Command: `npx.cmd vitest run tests/unit/help-page.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0292-add-a-help-page-pattern-with-search-topic

 ✓ tests/unit/help-page.test.js (14 tests) 98ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  00:35:22
   Duration  1.11s (environment 79%, tests 11%, transform 6%, import 3%, worker 1%)
```

Command: `$env:HELP_PAGE_PROOF='C:\Dev-Projects\support.webapp\.plan\tasks\T0292-add-a-help-page-pattern-with-search-topic'; npx.cmd playwright test tests/e2e/help-page.spec.js`
Exit code: `0`

```text
Running 12 tests using 4 workers

  ✓   3 [desktop-light] › tests\e2e\help-page.spec.js:125:5 › help page pattern › applies ?topic= and ?q= query parameters on load (1.3s)
  ✓   1 [desktop-light] › tests\e2e\help-page.spec.js:141:5 › help page pattern › renders the help-page gallery section cleanly without overflow (1.8s)
  ✓   4 [desktop-light] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks (2.6s)
  ✓   2 [desktop-dark] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks (2.6s)
  ✓   5 [desktop-dark] › tests\e2e\help-page.spec.js:125:5 › help page pattern › applies ?topic= and ?q= query parameters on load (1.1s)
  ✓   6 [desktop-dark] › tests\e2e\help-page.spec.js:141:5 › help page pattern › renders the help-page gallery section cleanly without overflow (1.4s)
  ✓   8 [mobile-light] › tests\e2e\help-page.spec.js:125:5 › help page pattern › applies ?topic= and ?q= query parameters on load (1.1s)
  ✓   7 [mobile-light] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks (2.1s)
  ✓   9 [mobile-light] › tests\e2e\help-page.spec.js:141:5 › help page pattern › renders the help-page gallery section cleanly without overflow (1.3s)
  ✓  11 [mobile-dark] › tests\e2e\help-page.spec.js:125:5 › help page pattern › applies ?topic= and ?q= query parameters on load (964ms)
  ✓  10 [mobile-dark] › tests\e2e\help-page.spec.js:28:5 › help page pattern › narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks (2.1s)
  ✓  12 [mobile-dark] › tests\e2e\help-page.spec.js:141:5 › help page pattern › renders the help-page gallery section cleanly without overflow (1.2s)

  12 passed (10.8s)
```

Command: `python scripts/devops.py check` (lint, pytest, full unit suite, full Playwright suite; `generate-app.test.js` required installing worktree `node_modules` below)
Exit code: `1` (re-verified `test:integration` and `npm pack --dry-run` after `npm.cmd ci --prefer-offline` below)

```text
All 28 markdown files passed linting.
All checks passed!
9 files already formatted
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
======================== 61 passed, 1 skipped in 2.65s ========================
 ✓ tests/unit/tokens.test.js (1896 tests) 1084ms
 ✓ tests/unit/help-page.test.js (14 tests) 225ms
[... 1340 lines omitted ...]
  1006 passed (9.6m)
 ✓ tests/integration/vendor.test.js (1 test) 10050ms
 ✓ tests/integration/pack.test.js (3 tests) 2884ms
```

Command: `npm.cmd run test:integration` (after `npm.cmd ci --prefer-offline` in worktree)
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0292-add-a-help-page-pattern-with-search-topic

 ✓ tests/integration/vendor.test.js (1 test) 4249ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 4247ms
 ✓ tests/integration/pack.test.js (3 tests) 1823ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1817ms
 ✓ tests/integration/generate-app.test.js (3 tests) 52143ms
   ✓ generates a neutral app that passes its own checks and the conformance check 20583ms
   ✓ generates a warm app that passes its own checks and the conformance check 15541ms
   ✓ generates a bright app that passes its own checks and the conformance check 16016ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  00:48:49
   Duration  59.16s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
[... 27 lines omitted ...]
npm notice 1.7kB src/css/components/help-page.css
[... 40 lines omitted ...]
npm notice 39.9kB src/js/help-page.js
[... 57 lines omitted ...]
npm notice total files: 129
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification Screenshots
- Before gallery (desktop / mobile, light / dark): [before-gallery-desktop-light.png](before-gallery-desktop-light.png), [before-gallery-desktop-dark.png](before-gallery-desktop-dark.png), [before-gallery-mobile-light.png](before-gallery-mobile-light.png), [before-gallery-mobile-dark.png](before-gallery-mobile-dark.png)
- After neutral (desktop / mobile, light / dark): [after-help-page-neutral-desktop-light.png](after-help-page-neutral-desktop-light.png), [after-help-page-neutral-desktop-dark.png](after-help-page-neutral-desktop-dark.png), [after-help-page-neutral-mobile-light.png](after-help-page-neutral-mobile-light.png), [after-help-page-neutral-mobile-dark.png](after-help-page-neutral-mobile-dark.png)
- After warm (desktop / mobile, light / dark): [after-help-page-warm-desktop-light.png](after-help-page-warm-desktop-light.png), [after-help-page-warm-desktop-dark.png](after-help-page-warm-desktop-dark.png), [after-help-page-warm-mobile-light.png](after-help-page-warm-mobile-light.png), [after-help-page-warm-mobile-dark.png](after-help-page-warm-mobile-dark.png)
- After bright (desktop / mobile, light / dark): [after-help-page-bright-desktop-light.png](after-help-page-bright-desktop-light.png), [after-help-page-bright-desktop-dark.png](after-help-page-bright-desktop-dark.png), [after-help-page-bright-mobile-light.png](after-help-page-bright-mobile-light.png), [after-help-page-bright-mobile-dark.png](after-help-page-bright-mobile-dark.png)
