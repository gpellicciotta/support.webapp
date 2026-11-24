## Walkthrough & Validation
Added [page.css](../../../../src/css/page.css) after `reset.css` in `src/css/style.css` for default body ground and typography, headings (`h1`–`h6`), underlined links, inline `code`, and the `[hidden]:not([hidden='until-found' i])` guard.
Element rules use zero-specificity `:where(:root:not([data-page-base='off']) ...)` selectors so component classes and app stylesheets win, and `data-page-base="off"` on `<html>` opts a page out while keeping the `[hidden]` guard.
Added a `#page` section in `src/demo/visual-style-gallery.html`, removed duplicated `body`/`a`/`code` rules from `src/demo/gallery.css`, updated `ADR-0003`, `docs/specs/components.md` (with upgrade notes), and `CHANGELOG.md`.

### Red-Phase Proof
Command: `npx.cmd vitest run tests/unit/page.test.js` (exit code 1)

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0278-add-a-page-base-stylesheet-for-body-text

 ❯ tests/unit/page.test.js (4 tests | 4 failed) 17ms
   ❯ page base stylesheet (4)
     × is imported by style.css after reset.css and before components and shell 8ms
     × uses only public contract tokens and no raw colors 3ms
     × keeps element rules at zero specificity with a root opt-out and guards [hidden] without breaking until-found 1ms
     × has a page base section in the visual style gallery 4ms
[... 48 lines omitted ...]
 Test Files  1 failed (1)
      Tests  4 failed (4)
   Start at  16:42:06
   Duration  444ms (transform 44%, import 29%, tests 18%, worker 9%)
```

Command: `npx.cmd playwright test tests/e2e/page.spec.js --project desktop-light -g "neutral look"` (exit code 1)

```text
Running 2 tests using 2 workers

  ✘  1 [desktop-light] › tests\e2e\page.spec.js:83:9 › neutral look (dark) applies page base tokens, component precedence, hidden guard, and opt-out (1.8s)
  ✘  2 [desktop-light] › tests\e2e\page.spec.js:83:9 › neutral look (light) applies page base tokens, component precedence, hidden guard, and opt-out (1.8s)

  1) [desktop-light] › tests\e2e\page.spec.js:83:9 › neutral look (light) applies page base tokens, component precedence, hidden guard, and opt-out

    Error: expect(received).toEqual(expected) // deep equality

    - Expected  - 3
    + Received  + 3

      Object {
    -   "background-color": "rgb(248, 250, 252)",
    -   "color": "rgb(2, 6, 23)",
    -   "font-family": "Inter, ui-sans-serif, system-ui, -apple-system, \"Segoe UI\", sans-serif",
    +   "background-color": "rgba(0, 0, 0, 0)",
    +   "color": "rgb(0, 0, 0)",
    +   "font-family": "\"Times New Roman\"",
        "font-size": "16px",
        "font-weight": "400",
      }
[... 30 lines omitted ...]
  2 failed
```

### Green-Phase Proof
Command: `python scripts/devops.py lint` (exit code 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 5820
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 23948
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 7156
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 18524
> @gpellicciotta/support.webapp@0.4.1-pre lint
> eslint .
```

Command: `python scripts/devops.py tests` (exit code 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 3728
============================= test session starts =============================
platform win32 -- Python 3.15.2, pytest-9.2.0, pluggy-1.7.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0278-add-a-page-base-stylesheet-for-body-text
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [62 items]
.........................s....................................           [100%]
======================= 61 passed, 1 skipped in 15.43s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 9684
> @gpellicciotta/support.webapp@0.4.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0278-add-a-page-base-stylesheet-for-body-text
[... 43 lines omitted ...]
 ✓ tests/unit/page.test.js (4 tests) 19ms
[... 24 lines omitted ...]
 Test Files  39 passed (39)
      Tests  2266 passed (2266)
   Start at  16:59:53
   Duration  15.57s (environment 44%, import 35%, tests 14%, transform 4%, worker 2%)
```

Command: `python scripts/devops.py check` — Playwright slow suite portion (exit code 0 for `npm run test:slow`)

```text
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 29720
> @gpellicciotta/support.webapp@0.4.1-pre test:slow
> playwright test
[... 1160 lines omitted ...]
  894 passed (8.9m)
```

Note: In that `python scripts/devops.py check` run, `generate-app.test.js` failed because the fresh worktree lacked `node_modules` for its junction link. After running `npm ci` in the worktree (zero source edits), the full integration suite and packaging dry-run both passed:

Command: `npm.cmd run test:integration` (exit code 0)

```text
> @gpellicciotta/support.webapp@0.4.1-pre test:integration
> vitest run --config vitest.integration.config.js

 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0278-add-a-page-base-stylesheet-for-body-text

 ✓ tests/integration/vendor.test.js (1 test) 7080ms
   ✓ packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments 7077ms
 ✓ tests/integration/pack.test.js (3 tests) 3717ms
   ✓ packs the source layout of ADR-0008 without the gallery, app icons, or repository tooling 3710ms
 ✓ tests/integration/generate-app.test.js (3 tests) 79323ms
   ✓ generates a neutral app that passes its own checks and the conformance check 39527ms
   ✓ generates a warm app that passes its own checks and the conformance check 25176ms
   ✓ generates a bright app that passes its own checks and the conformance check 14615ms

 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  16:57:31
   Duration  91.48s (tests 100%)
```

Command: `npm.cmd pack --dry-run` (exit code 0)

```text
> @gpellicciotta/support.webapp@0.4.1-pre prepack
> node bin/manifest.mjs

> @gpellicciotta/support.webapp@0.4.1-pre postpack
> node bin/manifest.mjs --remove

npm notice 📦  @gpellicciotta/support.webapp@0.4.1-pre
[... 54 lines omitted ...]
npm notice 1.7kB src/css/page.css
[... 67 lines omitted ...]
npm notice total files: 116
gpellicciotta-support.webapp-0.4.1-pre.tgz
```

### Visual Verification
Before captures (gallery before adding `#page` and `page.css`):
- [before-gallery-desktop-light.png](before-gallery-desktop-light.png)
- [before-gallery-desktop-dark.png](before-gallery-desktop-dark.png)
- [before-gallery-mobile-light.png](before-gallery-mobile-light.png)
- [before-gallery-mobile-dark.png](before-gallery-mobile-dark.png)

After captures (`#page` across neutral, warm, and bright looks in light and dark themes at 390 px and 1440 px):
- [after-page-neutral-desktop-light.png](after-page-neutral-desktop-light.png), [after-page-neutral-desktop-dark.png](after-page-neutral-desktop-dark.png), [after-page-neutral-mobile-light.png](after-page-neutral-mobile-light.png), [after-page-neutral-mobile-dark.png](after-page-neutral-mobile-dark.png)
- [after-page-warm-desktop-light.png](after-page-warm-desktop-light.png), [after-page-warm-desktop-dark.png](after-page-warm-desktop-dark.png), [after-page-warm-mobile-light.png](after-page-warm-mobile-light.png), [after-page-warm-mobile-dark.png](after-page-warm-mobile-dark.png)
- [after-page-bright-desktop-light.png](after-page-bright-desktop-light.png), [after-page-bright-desktop-dark.png](after-page-bright-desktop-dark.png), [after-page-bright-mobile-light.png](after-page-bright-mobile-light.png), [after-page-bright-mobile-dark.png](after-page-bright-mobile-dark.png)
