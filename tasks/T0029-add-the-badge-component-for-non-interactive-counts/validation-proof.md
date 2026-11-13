# Validation Proof

## Walkthrough & Validation
Command: `python scripts/devops.py check`. Exit code: 0.
Full verbatim output: [check-output.txt](check-output.txt).

```text
[... 2 lines omitted ...]
All 25 markdown files passed linting.
[... 2 lines omitted ...]
All checks passed!
[... 2 lines omitted ...]
4 files already formatted
[... 18 lines omitted ...]
============================== 3 passed in 3.59s ==============================
[... 5 lines omitted ...]
 Test Files  25 passed (25)
      Tests  2071 passed (2071)
[... 1 lines omitted ...]
   Duration  8.69s (environment 54%, import 30%, tests 12%, worker 2%, transform 2%)
[... 8 lines omitted ...]
Running 572 tests using 4 workers
[... 836 lines omitted ...]
  2 skipped
  570 passed (4.5m)
[... 5 lines omitted ...]
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... 1 lines omitted ...]
   Duration  7.40s (tests 98%, import 1%, transform 1%)
[... 112 lines omitted ...]
npm notice total files: 95
[... 1 lines omitted ...]
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

Command: `plan tasks validate T0029 --completion`. Exit code: 0.

```text
All 1 task file passed validation.
```


Inspected all eight captures below. Before captures show the neighboring chip section because badge did not exist.
After captures show labeled badges, clean wrapping, and readable tones at both viewports.

- Desktop light: [before](before-desktop-light.png), [after](after-desktop-light.png).
- Desktop dark: [before](before-desktop-dark.png), [after](after-desktop-dark.png).
- Mobile light: [before](before-mobile-light.png), [after](after-mobile-light.png).
- Mobile dark: [before](before-mobile-dark.png), [after](after-mobile-dark.png).

Command: `npx playwright test tests/e2e/badge.spec.js`. Exit code: 0.
Evidence directory supplied through `BADGE_EVIDENCE_DIR`.

```text
  ok 1 [mobile-light] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops (3.6s)
  ok 3 [desktop-dark] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops (3.6s)
  ok 2 [desktop-light] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops (3.7s)
  ok 4 [mobile-dark] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops (3.7s)

  4 passed (5.6s)
```

Command: `npx playwright test tests/e2e/badge.spec.js`. Exit code: 1.
Evidence directory supplied through `BADGE_EVIDENCE_DIR`.

```text
  1) [desktop-light] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops 

    Error: expect(locator).toHaveCount(expected) failed

    Locator:  locator('#badge')
    Expected: 1
    Received: 0
    Timeout:  5000ms

    Call log:
      - Expect "toHaveCount" locator('#badge') with timeout 5000ms
      - waiting for locator('#badge')
        14 × locator resolved to 0 elements
           - unexpected value "0"


      14 |         });
      15 |     }
    > 16 |     await expect(section).toHaveCount(1);
[... repeated failure details omitted ...]

  4 failed
    [desktop-light] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops 
    [desktop-dark] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops 
    [mobile-light] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops 
    [mobile-dark] › tests\e2e\badge.spec.js:5:1 › badges show labeled tones without adding keyboard stops 

```

