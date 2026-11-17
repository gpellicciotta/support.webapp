## Walkthrough & Validation

### Summary of Changes
- Replaced `--radius-round` (`50%`) on `.switch__control` with `--radius-control` so the 40×24 px switch track renders as a rounded rectangle instead of an ellipse.
- Replaced `--radius-round` on `.switch__control::before` with `max(0px, calc(var(--radius-control) - 2 * var(--border-width)))` so the 20×20 px thumb stays concentric inside the track's border and padding across every look.
- Added unit and Playwright tests verifying track and thumb radii across `neutral`, `warm`, and `bright` while confirming dimensions, 44 px targets, forced-colors rules, and states remain unchanged.

### Visual Verification Screenshots
- Neutral: [before light](before-neutral-light.png), [after light](after-neutral-light.png), [before dark](before-neutral-dark.png), [after dark](after-neutral-dark.png)
- Warm: [before light](before-warm-light.png), [after light](after-warm-light.png), [before dark](before-warm-dark.png), [after dark](after-warm-dark.png)
- Bright: [before light](before-bright-light.png), [after light](after-bright-light.png), [before dark](before-bright-dark.png), [after dark](after-bright-dark.png)

### Red-Phase Unit Test Failure
Command: `npx.cmd vitest run tests/unit/switch.test.js`
Exit code: `1`
```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0049-make-the-switch-track-and-thumb-rounded-rectangles

 ❯ tests/unit/switch.test.js (3 tests | 1 failed) 234ms
   ❯ switch markup contract (3)
     ✓ imports its component stylesheet 4ms
     ✓ shows native labeled switches and every state without duplicated checked ARIA 214ms
     × gives the track the control radius and the thumb a concentric inner radius, never 50% 13ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/switch.test.js > switch markup contract > gives the track the control radius and the thumb a concentric inner radius, never 50%
AssertionError: expected '\r\n  appearance: none;\r\n  display:…' to match /border-radius:\s*var\(--radius-contro…/

- Expected:
/border-radius:\s*var\(--radius-control\)\s*;/

+ Received:
"
[... 9 lines omitted ...]
  border-radius: var(--radius-round);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  cursor: inherit;
"

 ❯ tests/unit/switch.test.js:41:44
     39|             .replace(/\/\*[\s\S]*?\*\//g, '');
     40|         const rule = selector => css.match(new RegExp(`${selector}\\s*…
     41|         expect(rule('\\.switch__control')).toMatch(/border-radius:\s*v…
       |                                            ^
     42|         expect(rule('\\.switch__control::before')).toMatch(
     43|             /border-radius:\s*max\(0px,\s*calc\(var\(--radius-control\…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  00:12:07
   Duration  2.15s (import 84%, tests 13%, transform 3%, worker 1%)
```

### Red-Phase Playwright Test Failure
Command: `npx.cmd playwright test tests/e2e/switch.spec.js --project=desktop-light`
Exit code: `1`
```text
Running 4 tests using 4 workers

  ✓  3 [desktop-light] › tests\e2e\switch.spec.js:68:1 › forced colors use the system palette for focus and a distinct invalid outline (2.3s)
  ✓  1 [desktop-light] › tests\e2e\switch.spec.js:5:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (2.3s)
  ✓  2 [desktop-light] › tests\e2e\switch.spec.js:37:1 › switch targets, thumb position, invalid state, and RTL remain visible (2.3s)
  ✘  4 [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states (2.2s)


  1) [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states 

    Error: neutral

    expect(received).not.toBe(expected) // Object.is equality

    Expected: not "50%"

      113 |                 return { trackRadius: track.borderTopLeftRadius, thumbRadius: thumb.borderTopLeftRadius, size: `${thumb.width}x${thumb.height}` };
      114 |             });
    > 115 |             expect(actual.trackRadius, look).not.toBe('50%');
          |                                                  ^
      116 |             expect(actual.trackRadius, look).not.toContain(' ');
      117 |             expect(actual, look).toEqual({ ...expected, size: `${expected.size}x${expected.size}` });
      118 |         }
        at C:\Dev-Projects\support.webapp\.plan\work\T0049-make-the-switch-track-and-thumb-rounded-rectangles\tests\e2e\switch.spec.js:115:50

    Error Context: test-results\switch-switch-uses-concent-8a9fa-preserving-sizes-and-states-desktop-light\error-context.md

  1 failed
    [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states 
  3 passed (5.2s)
```

### Green-Phase Switch Browser Suite
Command: `npx.cmd playwright test tests/e2e/switch.spec.js`
Exit code: `0`
```text
Running 16 tests using 4 workers

  ✓   3 [desktop-light] › tests\e2e\switch.spec.js:37:1 › switch targets, thumb position, invalid state, and RTL remain visible (1.9s)
  ✓   2 [desktop-light] › tests\e2e\switch.spec.js:68:1 › forced colors use the system palette for focus and a distinct invalid outline (2.1s)
  ✓   4 [desktop-light] › tests\e2e\switch.spec.js:5:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (1.9s)
  ✓   1 [desktop-light] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states (4.0s)
  ✓   5 [desktop-dark] › tests\e2e\switch.spec.js:5:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (1.8s)
  ✓   6 [desktop-dark] › tests\e2e\switch.spec.js:68:1 › forced colors use the system palette for focus and a distinct invalid outline (1.7s)
  ✓   7 [desktop-dark] › tests\e2e\switch.spec.js:37:1 › switch targets, thumb position, invalid state, and RTL remain visible (1.7s)
  ✓  10 [mobile-light] › tests\e2e\switch.spec.js:5:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (2.0s)
  ✓  11 [mobile-light] › tests\e2e\switch.spec.js:68:1 › forced colors use the system palette for focus and a distinct invalid outline (1.9s)
  ✓   9 [mobile-light] › tests\e2e\switch.spec.js:37:1 › switch targets, thumb position, invalid state, and RTL remain visible (2.5s)
  ✓   8 [desktop-dark] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states (7.0s)
  ✓  12 [mobile-light] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states (4.5s)
  ✓  13 [mobile-dark] › tests\e2e\switch.spec.js:37:1 › switch targets, thumb position, invalid state, and RTL remain visible (1.9s)
  ✓  14 [mobile-dark] › tests\e2e\switch.spec.js:68:1 › forced colors use the system palette for focus and a distinct invalid outline (2.0s)
  ✓  15 [mobile-dark] › tests\e2e\switch.spec.js:5:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (1.9s)
  ✓  16 [mobile-dark] › tests\e2e\switch.spec.js:95:1 › switch uses concentric control radii in every look while preserving sizes and states (3.3s)

  16 passed (24.1s)
```

### Full Repository Check
Command: `python scripts/devops.py check`
Exit code: `0`
```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 51456
All 26 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 51400
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 35676
6 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
Process ID: 21276
> @gpellicciotta/support.webapp@0.1.1-pre lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
Process ID: 29064
[... 12 lines omitted ...]
======================== 41 passed, 1 skipped in 3.10s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 31 lines omitted ...]
 ✓ tests/unit/switch.test.js (3 tests) 243ms
 ✓ tests/unit/loading.test.js (1 test) 189ms
 Test Files  29 passed (29)
      Tests  2109 passed (2109)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
Process ID: 38496
> @gpellicciotta/support.webapp@0.1.1-pre test:slow
> playwright test
Running 628 tests using 4 workers
[... 828 lines omitted ...]
  2 skipped
  626 passed (5.2m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 32196
[... 11 lines omitted ...]
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  00:39:54
   Duration  69.41s (tests 100%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 2364
[... 118 lines omitted ...]
npm notice total files: 103
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
```
