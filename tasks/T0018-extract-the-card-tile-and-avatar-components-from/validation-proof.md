## Walkthrough & Validation

### Review rework: final verification
Command: `plan tasks validate T0018 --completion`
Exit code: 0

```text
All 1 task file passed validation.
```

Command: `python scripts/devops.py check`
Exit code: 0
Full verbatim output: [review2-check.log](review2-check.log).

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 78780
All 24 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 78676
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 78520
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 85048
> @gpellicciotta/support.webapp@0.1.0-pre lint
> eslint .
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m pytest
Process ID: 76964
============================= test session starts =============================
platform win32 -- Python 3.12.8, pytest-9.1.1, pluggy-1.6.0
rootdir: C:\Dev-Projects\support.webapp\.plan\work\T0018-extract-the-card-tile-and-avatar-components-from
configfile: pyproject.toml
testpaths: tests
plugins: timeout-2.4.0, xdist-3.8.0
timeout: 30.0s
timeout method: thread
timeout func_only: False
created: 8/8 workers
8 workers [3 items]
...                                                                      [100%]
============================== 3 passed in 2.13s ==============================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 25344
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0018-extract-the-card-tile-and-avatar-components-from
 Test Files  11 passed (11)
      Tests  1458 passed (1458)
   Start at  15:07:54
   Duration  988ms (tests 45%, import 39%, worker 8%, transform 8%)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 87000
> @gpellicciotta/support.webapp@0.1.0-pre test:slow
[... 256 lines omitted ...]
```

```text
  172 passed (58.5s)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 69864
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0018-extract-the-card-tile-and-avatar-components-from
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  15:08:56
   Duration  4.78s (tests 98%, import 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
[... 63 lines omitted ...]
```

```text
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 899.5 kB
npm notice unpacked size: 1.0 MB
npm notice shasum: 41cec77fe06ea71866ae038d66f88a59ff27872b
npm notice integrity: sha512-sm0ylrwrfRAOH[...]5+OphRmHnLSCw==
npm notice total files: 56
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

### Review rework: visual comparison and failing regressions
The first visual inspection missed duplicate tile dimensions and low-visibility dark portraits.
Round-one `after-*` captures remain the before evidence for this rework.
Revised `review2-*` captures show distinct tile sizes and gray portraits on light and dark surfaces.

- [Before tiles](after-card-neutral-cards-tiles-and-avatars-desktop-dark-neutral-icon-tile.png)
- [Revised tiles](review2-card-neutral-cards-tiles-and-avatars-desktop-dark-neutral-icon-tile.png)
- [Before portrait](after-card-warm-cards-tiles-and-avatars-desktop-dark-warm-avatar.png)
- [Revised portrait](review2-card-warm-cards-tiles-and-avatars-desktop-dark-warm-avatar.png)

Command: `npx playwright test tests/e2e/card.spec.js --project desktop-light`
Exit code: 1

```text
✘  2 [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars (6.8s)


  1) [desktop-light] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars ──────────────

    Error: expect(received).toBeLessThan(expected)

    Expected: < 44
    Received:   44

      12 |             tileWidths.push(box.width);
      13 |         }
    > 14 |         expect(tileWidths[0]).toBeLessThan(tileWidths[1]);
         |                               ^
      15 |         expect(tileWidths[1]).toBeLessThan(tileWidths[2]);
      16 |         const card = page.locator('#card a.card').first();
      17 |         await expect(card).toBeVisible();
        at C:\Dev-Projects\support.webapp\.plan\work\T0018-extract-the-card-tile-and-avatar-components-from\tests\e2e\card.spec.js:14:31

    Error Context: test-results\card-neutral-cards-tiles-and-avatars-desktop-light\error-context.md

  2) [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ─────────────────

    Error: expect(locator).toHaveCSS(expected) failed

    Locator:  locator('.avatar-stack .avatar').first()
    Expected: "48px"
    Received: "104px"
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCSS" locator('.avatar-stack .avatar').first() with timeout 5000ms
      - waiting for locator('.avatar-stack .avatar').first()
        14 × locator resolved to <img src="avatar.svg" alt="Sample portrait" class="avatar avatar--sm"/>
           - unexpected value "104px"
```

```text


      38 |                 element.className = `avatar avatar--${modifier}`;
      39 |             }, size);
    > 40 |             await expect(stack.nth(0)).toHaveCSS('width', `${pixels}px`);
         |                                        ^
      41 |         }
      42 |         await page.locator('style').last().evaluate(element => element.remove());
      43 |         await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
        at C:\Dev-Projects\support.webapp\.plan\work\T0018-extract-the-card-tile-and-avatar-components-from\tests\e2e\card.spec.js:40:40

    Error Context: test-results\card-warm-cards-tiles-and-avatars-desktop-light\error-context.md

  2 failed
    [desktop-light] › tests\e2e\card.spec.js:5:5 › neutral cards, tiles, and avatars ───────────────
    [desktop-light] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars ──────────────────
```


Command: `python scripts/devops.py check`
Exit code: 0

```text
  ✓  171 [mobile-dark] › tests\e2e\verify-ui.spec.js:377:1 › reports unresolved sprite references (871ms)
  ✓  170 [mobile-dark] › tests\e2e\verify-ui.spec.js:351:1 › reports injected overflow, contrast, target, and focus violations (1.2s)
[neutral system 390px] 21 stylesheets, 573 texts, 99 targets, 99 focus records, 88 sprite references, overflow 0px, errors 0
[warm system 390px] 21 stylesheets, 574 texts, 100 targets, 100 focus records, 88 sprite references, overflow 0px, errors 0
  ✓  172 [mobile-dark] › tests\e2e\warm.spec.js:4:1 › warm seasons preserve source accents on roots and specimen wrappers (1.8s)
[neutral light 390px] 21 stylesheets, 573 texts, 99 targets, 99 focus records, 88 sprite references, overflow 0px, errors 0
  ✓  169 [mobile-dark] › tests\e2e\verify-ui.spec.js:320:9 › gallery passes every verifier check in the neutral look (3.6s)
[warm light 390px] 21 stylesheets, 574 texts, 100 targets, 100 focus records, 88 sprite references, overflow 0px, errors 0
  ✓  168 [mobile-dark] › tests\e2e\verify-ui.spec.js:320:9 › gallery passes every verifier check in the warm look (4.0s)
  172 passed (59.0s)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 84584
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0018-extract-the-card-tile-and-avatar-components-from
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  15:00:52
   Duration  4.36s (tests 98%, import 1%, transform 1%)
[... 61 lines omitted ...]
npm notice 7.6kB src/looks/warm/icons.svg
npm notice 184B src/looks/warm/index.css
npm notice 7.2kB src/looks/warm/look.css
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 899.4 kB
npm notice unpacked size: 1.0 MB
npm notice shasum: 9b37288a19d2ae98212b6e334a5c6deb16066815
npm notice integrity: sha512-QUAEYmr7IAB96[...]kOzRJwIlP+j4g==
npm notice total files: 56
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```


## Visual inspection
Command: `plan tasks validate T0018 --completion`
Exit code: 0

```text
All 1 task file passed validation.
```

The before captures show the existing gallery before component extraction.
After captures show real specimens, readable wrapping, source avatar sizes, decorative tones, and overlapping stacks.
Both looks passed the verifier in system and explicit themes at 390 and 1440 pixels.
No console, request, contrast, target, focus, or overflow failures occurred.
Playwright stopped its managed server; process inspection confirmed no development server remained.

- [Before, warm mobile dark](before-warm-mobile-dark.png)
- [After cards, warm mobile light](after-card-warm-cards-tiles-and-avatars-mobile-light-warm-card.png)
- [After avatars, warm desktop dark](after-card-warm-cards-tiles-and-avatars-desktop-dark-warm-avatar.png)
- [After tiles, neutral desktop dark](after-card-neutral-cards-tiles-and-avatars-desktop-dark-neutral-icon-tile.png)

Command: `npm test -- tests/unit/card.test.js tests/unit/icon-tile.test.js tests/unit/avatar.test.js`
Exit code: 1

```text
> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run tests/unit/card.test.js tests/unit/icon-tile.test.js tests/unit/avatar.test.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0018-extract-the-card-tile-and-avatar-components-from

 ❯ tests/unit/icon-tile.test.js (1 test | 1 failed) 7ms
   × offers three sizes and four optional tones with neutral fallbacks 6ms
 ❯ tests/unit/avatar.test.js (1 test | 1 failed) 7ms
   × offers source sizes, image cropping, initials, icon fallback, and overlapping stacks 5ms
 ❯ tests/unit/card.test.js (1 test | 1 failed) 6ms
   × ships static and interactive card parts without coupling nested controls 5ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/avatar.test.js > offers source sizes, image cropping, initials, icon fallback, and overlapping stacks
Error: ENOENT: no such file or directory, open 'C:\Dev-Projects\support.webapp\.plan\work\T0018-extract-the-card-tile-and-avatar-components-from\src\css\components\avatar.css'
 ❯ tests/unit/avatar.test.js:5:17
[... 18 lines omitted ...]

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  tests/unit/icon-tile.test.js > offers three sizes and four optional tones with neutral fallbacks
Error: ENOENT: no such file or directory, open 'C:\Dev-Projects\support.webapp\.plan\work\T0018-extract-the-card-tile-and-avatar-components-from\src\css\components\icon-tile.css'
 ❯ tests/unit/icon-tile.test.js:5:17
      3|
      4| it('offers three sizes and four optional tones with neutral fallbacks'…
      5|     const css = readFileSync('src/css/components/icon-tile.css', 'utf8…
       |                 ^
      6|     for (const size of ['sm', 'md', 'lg']) {
      7|         expect(css).toContain(`.icon-tile--${size}`);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯


 Test Files  3 failed (3)
      Tests  3 failed (3)
   Start at  14:57:35
   Duration  294ms (transform 42%, import 34%, worker 12%, tests 11%)
```
