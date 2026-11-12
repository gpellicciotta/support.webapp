# Switch Validation Proof

## Walkthrough & Validation
Command: `python scripts/devops.py check`; exit code 0. Unit stage excerpt:

```text
 Test Files  24 passed (24)
      Tests  2049 passed (2049)
   Start at  20:07:50
   Duration  5.32s (environment 53%, import 30%, tests 12%, transform 3%, worker 1%)
    Isolate  24 workers spawned · ~902ms startup each (spawn + environment, per file)
             at least ~2.19s faster with isolate: false — reuses workers across files instead of one per file
```


### Switch Browser Checks
Command: `$env:SWITCH_SCREENSHOTS='C:/Dev-Projects/support.webapp/.plan/tasks/T0019-design-and-add-an-accessible-switch-component'; npx playwright test tests/e2e/switch.spec.js --workers=2`; exit code 0.

```text
(node:61932) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok  9 [mobile-light] › tests\e2e\switch.spec.js:49:1 › switch targets, thumb position, invalid state, RTL, and forced colors remain visible (1.3s)
(node:61932) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:82744) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
(node:82744) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
  ok 10 [mobile-dark] › tests\e2e\switch.spec.js:5:1 › switch visual evidence (1.2s)
  ok 11 [mobile-dark] › tests\e2e\switch.spec.js:17:1 › native switch supports pointer, keyboard, forms, reset, and disabled states (1.4s)
  ok 12 [mobile-dark] › tests\e2e\switch.spec.js:49:1 › switch targets, thumb position, invalid state, RTL, and forced colors remain visible (1.3s)

  12 passed (12.5s)
```

### Visual Inspection
Baseline captures show the existing checkbox section before the new switch section existed.
Inspected all eight captures; targets, labels, thumb positions, focus outlines, and errors render correctly.
Playwright confirmed HTTP 200; browser checks and the full verifier monitor console, exceptions, and network failures.

- [Before desktop light](before-desktop-light.png), [after desktop light](after-desktop-light.png).
- [Before desktop dark](before-desktop-dark.png), [after desktop dark](after-desktop-dark.png).
- [Before mobile light](before-mobile-light.png), [after mobile light](after-mobile-light.png).
- [Before mobile dark](before-mobile-dark.png), [after mobile dark](after-mobile-dark.png).


### Completion Check
Command: `python scripts/devops.py check`; exit code 0. Final output excerpt:

```text
  312 passed (2.5m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
Process ID: 76908
> @gpellicciotta/support.webapp@0.1.0-pre test:integration
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0019-design-and-add-an-accessible-switch-component
 Test Files  2 passed (2)
      Tests  4 passed (4)
   Start at  20:10:26
   Duration  4.57s (tests 98%, import 1%, transform 1%)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
Process ID: 78160
> @gpellicciotta/support.webapp@0.1.0-pre prepack
[... 92 lines omitted ...]
npm notice 7.2kB src/looks/warm/look.css
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 926.8 kB
npm notice unpacked size: 1.1 MB
npm notice shasum: 3c80da8f0a79fe726b0ab321436ef93ae304ecf5
npm notice integrity: sha512-uQCY9qpQm1jF2[...]+Jfh8AUrA7t+A==
npm notice total files: 88
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz

```

### Failing Tests
Command: `npm test -- tests/unit/switch.test.js --reporter=dot --no-color`; exit code 1.

```text

> @gpellicciotta/support.webapp@0.1.0-pre test
> vitest run tests/unit/switch.test.js


 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0019-design-and-add-an-accessible-switch-component

 ❯ tests/unit/switch.test.js (2 tests | 2 failed) 294ms
   ❯ switch markup contract (2)
     × imports its component stylesheet 24ms
     × shows native labeled switches and every state without duplicated checked ARIA 267ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/switch.test.js > switch markup contract > imports its component stylesheet
AssertionError: expected '/* Look-neutral package entry; apps i…' to contain '@import url(\'components/switch.css\'…'

- Expected
+ Received

- @import url('components/switch.css');
[... 42 lines omitted ...]
 FAIL  tests/unit/switch.test.js > switch markup contract > shows native labeled switches and every state without duplicated checked ARIA
AssertionError: expected null not to be null
 ❯ tests/unit/switch.test.js:16:33
     14|             window.document.body.innerHTML = readFileSync(new URL('../…
     15|             const section = window.document.querySelector('#switch');
     16|             expect(section).not.toBeNull();
       |                                 ^
     17|             const inputs = [...section.querySelectorAll('.switch__cont…
     18|             expect(inputs.length).toBeGreaterThanOrEqual(8);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/2]⎯


 Test Files  1 failed (1)
      Tests  2 failed (2)
   Start at  20:04:19
   Duration  2.30s (import 83%, tests 15%, transform 1%, worker 1%)


```

