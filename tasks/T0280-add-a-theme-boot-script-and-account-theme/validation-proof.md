## Walkthrough & Validation

### Summary of Changes
- Added classic pre-paint boot script `src/js/theme-boot.js` reading `data-theme-switch-app` and optional `data-theme-switch-legacy-key` from `document.currentScript` without throwing.
- Extended `src/js/theme-switch.js` with `normalizeTheme`, `themeOfSettings`, `themeBootScript`, `syncAccountTheme`, `meta[name="color-scheme"]` synchronization, cross-tab `storage` sync, and `attachThemeSwitch` account sync callbacks (`sync: { load, save, onError }` and `controller.sync(settings?)`).
- Updated `template/src/index.html` and `src/demo/visual-style-gallery.html` to include `<meta name="color-scheme" content="light dark">` and `theme-boot.js`, and added the `#theme-switch` account sync demo section to the gallery.
- Updated `docs/specs/components.md` (catalog, boot script, account sync API, and upgrade note), `docs/adrs/ADR-0003-components-and-patterns.md`, and `CHANGELOG.md`.

### Visual Verification
- Before: [before-desktop-light.png](before-desktop-light.png), [before-desktop-dark.png](before-desktop-dark.png)
- After: [after-desktop-light.png](after-desktop-light.png), [after-desktop-dark.png](after-desktop-dark.png)
- New gallery section: [section-desktop-light.png](section-desktop-light.png), [section-desktop-dark.png](section-desktop-dark.png)

### Red-Phase Verification (Before Implementation)

Command: `npx.cmd vitest run tests/unit/theme-boot.test.js`
Exit code: `1`

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0280-add-a-theme-boot-script-and-account-theme

 ❯ tests/unit/theme-boot.test.js (13 tests | 13 failed) 52ms
   ❯ normalizeTheme and themeOfSettings (3)
     × normalizes known themes, maps default to system, and ignores unknown values 7ms
     × reads theme and style-settings from lists, objects, JSON strings, and bare strings 1ms
     × returns null when settings hold no known theme 1ms
   ❯ theme boot script (4)
     × applies stored light and dark themes and updates color-scheme metadata 2ms
     × migrates a legacy key once without overwriting an existing value 1ms
     × never throws when storage is blocked or attributes are missing 5ms
     × generates an inlineable classic script via themeBootScript 1ms
   ❯ applyTheme color-scheme metadata (1)
     × syncs meta[name="color-scheme"] when present 14ms
   ❯ account theme sync (5)
     × applies preloaded or fetched account settings via syncAccountTheme 5ms
     × reports load failures through onError and leaves the current theme alone 3ms
     × syncs account settings on attachThemeSwitch without echoing save back 5ms
     × forwards save errors to sync.onError and ignores stale in-flight loads 3ms
     × migrates legacyKey on attach and reacts to cross-tab storage events 4ms

[... 194 lines omitted ...]

 Test Files  1 failed (1)
      Tests  13 failed (13)
   Start at  17:58:28
   Duration  1.13s (import 88%, tests 6%, transform 5%, worker 1%)
```

Command: `npx.cmd playwright test tests/e2e/theme-boot.spec.js --project=desktop-light`
Exit code: `1`

```text
Running 3 tests using 3 workers

  ✘  1 [desktop-light] › tests\e2e\theme-boot.spec.js:23:1 › boot script migrates a legacy key once before any module runs (5.3s)
  ✘  3 [desktop-light] › tests\e2e\theme-boot.spec.js:4:1 › boot script applies a stored dark theme before any ES module runs (5.7s)
  ✘  2 [desktop-light] › tests\e2e\theme-boot.spec.js:62:1 › gallery demonstrates account theme sync at sign-in and saves manual changes (6.2s)

[... 67 lines omitted ...]

  3 failed
    [desktop-light] › tests\e2e\theme-boot.spec.js:4:1 › boot script applies a stored dark theme before any ES module runs
    [desktop-light] › tests\e2e\theme-boot.spec.js:23:1 › boot script migrates a legacy key once before any module runs
    [desktop-light] › tests\e2e\theme-boot.spec.js:62:1 › gallery demonstrates account theme sync at sign-in and saves manual changes
```

### Green-Phase Verification (Final)

Command: `python scripts/devops.py check`
Exit code: `0`

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 31280
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 34676
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 21988
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 30968
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
[... 15 lines omitted ...]
======================== 61 passed, 1 skipped in 2.20s ========================
[... 58 lines omitted ...]
 Test Files  41 passed (41)
      Tests  2296 passed (2296)
[... 1178 lines omitted ...]
  42 skipped
  910 passed (6.6m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 12020
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0280-add-a-theme-boot-script-and-account-theme
 ✓ tests/integration/generate-app.test.js (3 tests) 61063ms
   ✓ generates a neutral app that passes its own checks and the conformance check 18272ms
   ✓ generates a warm app that passes its own checks and the conformance check 24289ms
   ✓ generates a bright app that passes its own checks and the conformance check 18497ms
 ✓ tests/integration/vendor.test.js (1 test) 4548ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 4546ms
 ✓ tests/integration/pack.test.js (3 tests) 1573ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 1566ms
 Test Files  3 passed (3)
      Tests  7 passed (7)
[... 129 lines omitted ...]
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice total files: 119
gpellicciotta-support.webapp-0.4.1-pre.tgz
```
