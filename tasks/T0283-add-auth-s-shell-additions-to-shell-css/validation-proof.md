## Walkthrough & Validation
Added Auth's shell additions to [shell.css](../../../src/css/shell.css) following `docs/specs/naming.md`:
- `.app__sidebar > .app__nav-list--end` pins an end navigation list to the sidebar bottom across wide open, icon rail, and narrow drawer states (with `gap: var(--space-2)` in the drawer to match the wide sidebar).
- `.app__nav-item .badge` aligns entry badges to the inline end while keeping badge text in the link's accessible name.
- `.app__brand` adds `gap: var(--space-2)` and `.app__brand-logo` sizes the brand logo to `--space-7` (`2rem`).
- `.app__top-bar [hidden]:not([hidden='until-found' i])` hides hidden top bar parts despite shell or component display rules while sparing `hidden="until-found"`.
- `.app__banners .banner > .icon-button` keeps a shell banner's dismiss button at the end edge, while `.app__banners .banner:has(> .icon-button) > .banner__text + :not(.icon-button)` aligns a sibling action to the start on wrapped narrow lines instead of centering it.

Demonstrated the additions in [shell-admin-console.html](../../../src/demo/shell-admin-console.html) and [shell-portal.html](../../../src/demo/shell-portal.html), and updated [components.md](../../../docs/specs/components.md), [ADR-0004-app-shell.md](../../../docs/adrs/ADR-0004-app-shell.md), and [CHANGELOG.md](../../../CHANGELOG.md).

### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/shell.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0283-add-auth-s-shell-additions-to-shell-css

 ❯ tests/unit/shell.test.js (6 tests | 2 failed) 78ms
   ❯ shell stylesheet additions (6)
     ✓ is imported last by style.css, after page.css and every component partial 6ms
     ✓ uses only public contract tokens and its own --_app-* private tokens, with no raw colors 5ms
     ✓ follows naming.md for shell parts and modifiers and drops the legacy .nav-end class 2ms
     × defines sidebar end group, nav entry badges, brand logo sizing, hidden top bar parts, and banner dismiss 27ms
     ✓ passes the conformance checker when app CSS references the new shell modifier and logo part 7ms
     × demonstrates the shell additions in the admin console and portal demos without .nav-end 27ms
[... 720 lines omitted ...]
 Test Files  1 failed (1)
      Tests  2 failed | 4 passed (6)
   Start at  19:47:27
   Duration  679ms (transform 37%, tests 33%, import 23%, worker 6%)
```

Command: `npx.cmd playwright test tests/e2e/shell-additions.spec.js --project=desktop-light -g "hidden top bar parts"` (exit code 1)

```text
Running 1 test using 1 worker

  ✘  1 [desktop-light] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules (1.1s)


  1) [desktop-light] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules 

    Error: expect(received).toBe(expected) // Object.is equality

    Expected: "none"
    Received: "flex"

      137 |         };
      138 |     });
    > 139 |     expect(results.brand).toBe('none');
          |                           ^
      140 |     expect(results.actions).toBe('none');
      141 |     expect(results.toggle).toBe('none');
      142 |     expect(results.untilFound).not.toBe('none');
[... 5 lines omitted ...]
  1 failed
    [desktop-light] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules 
```

### Green-Phase Proof
Command: `npx.cmd playwright test tests/e2e/shell-additions.spec.js` (exit code 0)

```text
Running 16 tests using 4 workers

  ✓   1 [desktop-light] › tests\e2e\shell-additions.spec.js:80:1 › nav entry badge sits at the entry end and stays in the entry accessible name (1.5s)
  ✓   2 [desktop-light] › tests\e2e\shell-additions.spec.js:50:1 › admin-console pins its end list to the sidebar bottom in open, icon rail, and drawer states (1.6s)
  ✓   4 [desktop-light] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules (1.3s)
  ✓   3 [desktop-light] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.5s)
  ✓   5 [desktop-dark] › tests\e2e\shell-additions.spec.js:50:1 › admin-console pins its end list to the sidebar bottom in open, icon rail, and drawer states (1.3s)
  ✓   6 [desktop-dark] › tests\e2e\shell-additions.spec.js:80:1 › nav entry badge sits at the entry end and stays in the entry accessible name (1.4s)
  ✓   7 [desktop-dark] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.2s)
  ✓   8 [desktop-dark] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules (1.1s)
  ✓   9 [mobile-light] › tests\e2e\shell-additions.spec.js:50:1 › admin-console pins its end list to the sidebar bottom in open, icon rail, and drawer states (1.3s)
  ✓  11 [mobile-light] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules (1.1s)
  ✓  10 [mobile-light] › tests\e2e\shell-additions.spec.js:80:1 › nav entry badge sits at the entry end and stays in the entry accessible name (1.4s)
  ✓  12 [mobile-light] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.2s)
  ✓  13 [mobile-dark] › tests\e2e\shell-additions.spec.js:50:1 › admin-console pins its end list to the sidebar bottom in open, icon rail, and drawer states (1.3s)
  ✓  15 [mobile-dark] › tests\e2e\shell-additions.spec.js:117:1 › hidden top bar parts are not displayed despite their shell display rules (1.1s)
  ✓  14 [mobile-dark] › tests\e2e\shell-additions.spec.js:80:1 › nav entry badge sits at the entry end and stays in the entry accessible name (1.5s)
  ✓  16 [mobile-dark] › tests\e2e\shell-additions.spec.js:146:1 › portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end (1.1s)

  16 passed (15.1s)
```

Command: `python scripts/devops.py lint` (exit code 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 17280
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 7052
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 31244
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 26068
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests` (exit code 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 23736
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0283-add-auth-s-shell-additions-to-shell-css
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [62 items]
.............................................s................           [100%]
======================== 61 passed, 1 skipped in 4.19s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 27508
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0283-add-auth-s-shell-additions-to-shell-css
[... 21 lines omitted ...]
 ✓ tests/unit/shell.test.js (6 tests) 39ms
[... 30 lines omitted ...]
 Test Files  43 passed (43)
      Tests  2317 passed (2317)
   Start at  20:07:36
   Duration  13.64s (environment 45%, import 37%, tests 14%, transform 3%, worker 2%)
```

Command: `python scripts/devops.py check` (Playwright slow suite stage; full suite exited 1 only on integration tests before `npm ci` in worktree, then integration and build passed below)

```text
[... 1300 lines omitted ...]
  ✓  976 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look blue (3.0s)
[bright light 390px] 52 stylesheets, 26 texts, 16 targets, 16 focus records, 6 sprite references, overflow 0px, errors 0
  ✓  977 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look yellow (3.0s)
[bright light 390px] 52 stylesheets, 26 texts, 16 targets, 16 focus records, 6 sprite references, overflow 0px, errors 0
  ✓  978 [mobile-dark] › tests\e2e\verify-ui.spec.js:390:9 › shell-portal passes every verifier check in the bright look red (3.0s)
  ✓  985 [mobile-dark] › tests\e2e\verify-ui.spec.js:458:1 › reports unresolved sprite references (1.3s)
  ✓  986 [mobile-dark] › tests\e2e\view.spec.js:20:5 › sample view › shows the error page after a failed load, and Try again loads the data (1.2s)
  ✓  987 [mobile-dark] › tests\e2e\view.spec.js:36:5 › sample view › draws the error page with the look icon and no wait status for a fast load (989ms)
  ✓  984 [mobile-dark] › tests\e2e\verify-ui.spec.js:427:1 › reports injected overflow, contrast, target, and focus violations (2.3s)
  ✓  988 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (3.5s)
  42 skipped
  946 passed (8.3m)
```

Command: `npm.cmd run test:integration` (exit code 0, after `npm ci` in worktree)

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0283-add-auth-s-shell-additions-to-shell-css

 ✓ tests/integration/vendor.test.js (1 test) 7724ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7721ms
 ✓ tests/integration/pack.test.js (3 tests) 2862ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 2856ms
 ✓ tests/integration/generate-app.test.js (3 tests) 67459ms
   ✓ generates a neutral app that passes its own checks and the conformance check 24200ms
   ✓ generates a warm app that passes its own checks and the conformance check 22271ms
   ✓ generates a bright app that passes its own checks and the conformance check 20984ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  20:05:35
   Duration  79.30s (tests 100%)
```

Command: `python scripts/devops.py build` (exit code 0)

```text
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 28164
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs
> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove
[... 118 lines omitted ...]
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.4.1-pre
npm notice filename: gpellicciotta-support.webapp-0.4.1-pre.tgz
npm notice package size: 1.0 MB
npm notice unpacked size: 1.4 MB
npm notice shasum: 636e92c598673455c27a5247507b7050d6517a68
npm notice integrity: sha512-1gpM4LtnIQB3u[...]hRBXqvbJ0Q/pA==
npm notice total files: 120
npm notice
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification
Captured before and after screenshots of `shell-admin-console.html` and `shell-portal.html` across neutral, warm, and bright looks in light and dark themes at 390 px and 1440 px with zero console, page, or HTTP errors:
- Before: [before-admin-console-desktop-light.png](before-admin-console-desktop-light.png), [before-admin-console-mobile-dark.png](before-admin-console-mobile-dark.png), [before-portal-desktop-light.png](before-portal-desktop-light.png), [before-portal-mobile-light.png](before-portal-mobile-light.png)
- After: [after-admin-console-neutral-desktop-light.png](after-admin-console-neutral-desktop-light.png), [after-admin-console-warm-mobile-dark.png](after-admin-console-warm-mobile-dark.png), [after-admin-console-bright-desktop-dark.png](after-admin-console-bright-desktop-dark.png), [after-portal-neutral-desktop-light.png](after-portal-neutral-desktop-light.png), [after-portal-warm-desktop-dark.png](after-portal-warm-desktop-dark.png), [after-portal-bright-mobile-light.png](after-portal-bright-mobile-light.png)
