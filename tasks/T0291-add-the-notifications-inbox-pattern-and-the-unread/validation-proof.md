## Walkthrough & Validation

### Summary of Changes
- Added [inbox.js](../../../src/js/inbox.js) with `createInbox`, `attachInbox`, `createUnreadButton`, `attachUnreadButton`, pure helpers (`isUnread`, `inboxTypeBadge`, `formatUnreadCount`, `formatUnreadLabel`, `formatInboxSummary`), and bubbling `inbox:action` / `inbox:navigate` events integrated with `selection.js`, `notices.js`, and `icon.js`.
- Added [inbox.css](../../../src/css/components/inbox.css) imported in [style.css](../../../src/css/style.css), added top-bar `.app__notifications-button` and `.app__notifications-count` rules to [shell.css](../../../src/css/shell.css), and registered `inbox` in [contract.json](../../../src/contract.json).
- Added the interactive inbox and top-bar unread count button to [shell-portal.html](../../../src/demo/shell-portal.html) and [shell-demo.js](../../../src/demo/shell-demo.js), plus static specimens in [visual-style-gallery.html](../../../src/demo/visual-style-gallery.html).
- Updated [components.md](../../../docs/specs/components.md) (removing `Inbox panel` from `Not in the Package`), [ADR-0003-components-and-patterns.md](../../../docs/adrs/ADR-0003-components-and-patterns.md), [ADR-0004-app-shell.md](../../../docs/adrs/ADR-0004-app-shell.md), [visual-style-guide.md](../../../docs/specs/visual-style-guide.md), and [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof (Before Implementation)

Command: `npx.cmd vitest run tests/unit/inbox.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0291-add-the-notifications-inbox-pattern-and-the-unread

 ❯ tests/unit/inbox.test.js (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/inbox.test.js [ tests/unit/inbox.test.js ]
Error: Failed to resolve import "../../src/js/inbox.js" from "tests/unit/inbox.test.js". Does the file exist?
  Plugin: vite:import-analysis
  File: C:/Dev-Projects/support.webapp/.plan/work/T0291-add-the-notifications-inbox-pattern-and-the-unread/tests/unit/inbox.test.js:21:8
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  no tests
```

Command: `npx.cmd playwright test tests/e2e/inbox.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 2 tests using 2 workers

  ✘  1 [desktop-light] › tests\e2e\inbox.spec.js:20:5 › notifications inbox and unread button › selecting two rows and choosing Mark Read updates the inbox summary and top-bar unread count (6.1s)
  ✘  2 [desktop-light] › tests\e2e\inbox.spec.js:58:5 › notifications inbox and unread button › row Discard and Discard All empty the inbox and hide the unread count badge (2.0m)

  1) [desktop-light] › tests\e2e\inbox.spec.js:20:5 › notifications inbox and unread button › selecting two rows and choosing Mark Read updates the inbox summary and top-bar unread count

    Error: expect(locator).toBeVisible() failed

    Locator: locator('[data-inbox-button]')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found
[... 24 lines omitted ...]
  2 failed
```

### Green-Phase Verification

Command: `npx.cmd vitest run tests/unit/inbox.test.js tests/unit/shell.test.js tests/unit/notices.test.js tests/unit/gallery.test.js`
Exit code: `0`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0291-add-the-notifications-inbox-pattern-and-the-unread

 ✓ tests/unit/shell.test.js (6 tests) 24ms
 ✓ tests/unit/gallery.test.js (25 tests) 40ms
 ✓ tests/unit/notices.test.js (15 tests) 67ms
 ✓ tests/unit/inbox.test.js (13 tests) 107ms

 Test Files  4 passed (4)
      Tests  59 passed (59)
   Start at  23:44:17
   Duration  1.89s (environment 71%, transform 16%, tests 6%, import 6%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/inbox.spec.js tests/e2e/notices.spec.js`
Exit code: `0`

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\inbox.spec.js:58:5 › notifications inbox and unread button › row Discard and Discard All empty the inbox and hide the unread count badge (1.6s)
  ✓   2 [desktop-light] › tests\e2e\inbox.spec.js:20:5 › notifications inbox and unread button › selecting two rows and choosing Mark Read updates the inbox summary and top-bar unread count (1.6s)
  ✓   4 [desktop-light] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both (1.8s)
  ✓   3 [desktop-light] › tests\e2e\notices.spec.js:65:5 › notices › caps visible app banners at three and reveals waiting banners on dismissal (2.2s)
[... 10 lines omitted ...]
  ✓  15 [mobile-dark] › tests\e2e\notices.spec.js:20:5 › notices › routes an error notice to a banner and an info notice to a toast, and dismissal removes both (1.6s)
  ✓  16 [mobile-dark] › tests\e2e\notices.spec.js:65:5 › notices › caps visible app banners at three and reveals waiting banners on dismissal (1.4s)

  16 passed (16.5s)
```

Command: `python scripts/devops.py check` (lint, pytest, unit tests, and full Playwright browser suite; `generate-app.test.js` required worktree `node_modules` installed below)
Exit code: `1` (worktree lacked installed `node_modules` for `generate-app.test.js`; re-verified after `npm ci --prefer-offline` below)

```text
All 28 markdown files passed linting.
All checks passed!
9 files already formatted
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
======================== 61 passed, 1 skipped in 3.37s ========================
 ✓ tests/unit/tokens.test.js (1893 tests) 974ms
 ✓ tests/unit/inbox.test.js (13 tests) 158ms
[... 1280 lines omitted ...]
  42 skipped
  994 passed (9.3m)
 ✓ tests/integration/vendor.test.js (1 test) 7918ms
 ✓ tests/integration/pack.test.js (3 tests) 3579ms
```

Command: `npm.cmd run test:integration` (after `npm.cmd ci --prefer-offline` in worktree)
Exit code: `0`

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0291-add-the-notifications-inbox-pattern-and-the-unread

 ✓ tests/integration/vendor.test.js (1 test) 10216ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 10212ms
 ✓ tests/integration/pack.test.js (3 tests) 2650ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2643ms
 ✓ tests/integration/generate-app.test.js (3 tests) 60021ms
   ✓ generates a neutral app that passes its own checks and the conformance check 24999ms
   ✓ generates a warm app that passes its own checks and the conformance check 19680ms
   ✓ generates a bright app that passes its own checks and the conformance check 15338ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  23:59:21
   Duration  74.26s (tests 100%)
```

Command: `npm.cmd pack --dry-run`
Exit code: `0`

```text
npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
[... 24 lines omitted ...]
npm notice 2.4kB src/css/components/inbox.css
[... 36 lines omitted ...]
npm notice 36.6kB src/js/inbox.js
[... 54 lines omitted ...]
npm notice total files: 127
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

Command: `npx.cmd playwright test tests/e2e/verify-ui.spec.js --grep "shell-portal"` and `--grep "gallery passes"`
Exit code: `0` (both runs)

```text
[neutral system 1440px] 54 stylesheets, 77 texts, 39 targets, 39 focus records, 12 sprite references, overflow 0px, errors 0
[warm light 390px] 54 stylesheets, 78 texts, 40 targets, 40 focus records, 12 sprite references, overflow 0px, errors 0
  20 passed (2.8m)

[neutral system 1440px] 54 stylesheets, 1156 texts, 290 targets, 290 focus records, 172 sprite references, overflow 0px, errors 0
[bright light 390px] 54 stylesheets, 1157 texts, 291 targets, 291 focus records, 172 sprite references, overflow 0px, errors 0
  20 passed (2.9m)
```

### Visual Verification Screenshots
- Before (desktop light): [before-portal-desktop-light.png](before-portal-desktop-light.png)
- Before (mobile light): [before-portal-mobile-light.png](before-portal-mobile-light.png)
- After neutral (desktop / mobile, light / dark): [after-portal-neutral-light-desktop.png](after-portal-neutral-light-desktop.png), [after-portal-neutral-light-mobile.png](after-portal-neutral-light-mobile.png), [after-portal-neutral-dark-desktop.png](after-portal-neutral-dark-desktop.png), [after-portal-neutral-dark-mobile.png](after-portal-neutral-dark-mobile.png)
- After warm (desktop / mobile, light / dark): [after-portal-warm-light-desktop.png](after-portal-warm-light-desktop.png), [after-portal-warm-light-mobile.png](after-portal-warm-light-mobile.png), [after-portal-warm-dark-desktop.png](after-portal-warm-dark-desktop.png), [after-portal-warm-dark-mobile.png](after-portal-warm-dark-mobile.png)
- After bright (desktop / mobile, light / dark): [after-portal-bright-light-desktop.png](after-portal-bright-light-desktop.png), [after-portal-bright-light-mobile.png](after-portal-bright-light-mobile.png), [after-portal-bright-dark-desktop.png](after-portal-bright-dark-desktop.png), [after-portal-bright-dark-mobile.png](after-portal-bright-dark-mobile.png)
