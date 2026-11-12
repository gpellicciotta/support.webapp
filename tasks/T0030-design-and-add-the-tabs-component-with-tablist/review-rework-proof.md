# Review Rework Evidence

## Investigation
Review P1 requested a successful required check and investigation of two prior browser failures.
Neither failure reproduced during the baseline experiments described below.
The baseline tests and gallery source came from pre-task commit `884af86`.
The task's previous evidence must not be interpreted as proving baseline flakes.

Both failing tests read computed styles immediately after replacing the gallery stylesheet.
The bright test relied on the navigation's `networkidle` state.
The card test also inspected the root stylesheet's CSSOM before reading dimensions.
Neither test explicitly awaited the replacement stylesheet's load event.
Those observations leave an asynchronous loading boundary unguarded.
They do not prove the precise cause of the earlier failures.

The rework adds `selectGalleryLook` to await stylesheet loading and font readiness before measurements.
The helper registers listeners before dispatching the select's change event.
Existing card geometry and accent-color assertions remain intact.
Held-import tests verify that readiness remains pending until imported CSS is released.
The tests also verify same-look selection without waiting for a nonexistent replacement load.
No tests are skipped or retried by this change.

## Baseline Experiments
The initial diagnostic served pre-task Git blobs through browser routes and delayed imported CSS by 1500 milliseconds.
Both cases passed, so that experiment did not establish a root cause.
The temporary probe was removed after recording its negative result.

The normal-cache baseline used this isolated source snapshot:

```powershell
New-Item -ItemType Directory -Force work/baseline | Out-Null
git archive --output work/baseline.zip 884af86 src scripts/serve.mjs
Expand-Archive -LiteralPath work/baseline.zip -DestinationPath work/baseline
```

The temporary Playwright config inherited the current config and changed only these paths:

```javascript
import config from '../playwright.config.js';
export default {
    ...config,
    testDir: '../tests/e2e',
    testIgnore: ['**/tabs.spec.js'],
    outputDir: '../test-results',
    webServer: {
        ...config.webServer,
        cwd: new URL('../', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'),
        command: config.webServer.command.replace('scripts/serve.mjs', 'work/baseline/scripts/serve.mjs')
    }
};
```

The tested existing browser files were unchanged from `884af86` during both baseline runs.
To repeat after this rework, include `tests` in the archive and point `testDir` at `./baseline/tests/e2e`.
This preserves the original test code instead of using the hardened current tests.

Focused baseline command:
`npx playwright test tests/e2e/card.spec.js tests/e2e/bright.spec.js --config=work/playwright.baseline.config.js --project=desktop-dark --grep "warm cards|bright accents" --repeat-each=20 --workers=4`.
Exit code: 0. Full output: [baseline-reproduction.log](baseline-reproduction.log).

```text
  40 passed (45.7s)
```

Complete baseline command: `npx playwright test --config=work/playwright.baseline.config.js`.
Exit code: 0. Full output: [baseline-full.log](baseline-full.log).

```text
  2 skipped
  506 passed (4.3m)
```

## Failing First
Command: `npx playwright test tests/e2e/look-loading.spec.js --project=desktop-dark --workers=1`.
Exit code: 1, before implementing the readiness helper.

```text
[WebServer] (node:77908) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
SyntaxError: The requested module './gallery-helpers.js' does not provide an export named 'selectGalleryLook'
Error: No tests found.
Make sure that arguments are regular expressions matching test files.
You may need to escape symbols like "$" or "*" and quote the arguments.
```

## Required Verification
The first rework check was intentionally stopped after identifying an unchanged bright-test path.
Its partial output remains in [review-rework-check.log](review-rework-check.log).
The corrected final check output is retained in [review-rework-final-check.log](review-rework-final-check.log).


## Successful Required Check
Command: `python scripts/devops.py check *> 'C:/Dev-Projects/support.webapp/.plan/tasks/T0030-design-and-add-the-tabs-component-with-tablist/review-rework-final-check.log'; exit $LASTEXITCODE`.
Exit code: 0. Full output: [review-rework-final-check.log](review-rework-final-check.log).

Browser-phase excerpt:

```text
[... 834 lines omitted ...]
  2 skipped
  522 passed (3.6m)
[... 120 lines omitted ...]
```

Final packaging excerpt:

```text
[... 944 lines omitted ...]
npm notice 2.4kB src/looks/warm/primitives.css
npm notice Tarball Details
npm notice name: @gpellicciotta/support.webapp
npm notice version: 0.1.0-pre
npm notice filename: gpellicciotta-support.webapp-0.1.0-pre.tgz
npm notice package size: 930.6 kB
npm notice unpacked size: 1.1 MB
npm notice shasum: 07a2a741ce6c8338f0690d33005813c585e2e839
npm notice integrity: sha512-fXQXrBHKcD050[...]dTxwudVFYftzg==
npm notice total files: 91
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

