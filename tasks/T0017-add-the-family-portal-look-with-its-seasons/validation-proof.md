# T0017 Validation Proof

## Walkthrough & Validation
Command: `npx vitest run tests/unit/warm.test.js --no-color`
Exit code: 1, before implementation.

```text
 ❯ tests/unit/warm.test.js (3 tests | 3 failed) 19ms
   × registers the warm look in the gallery 9ms
   × maps all four seasons through bare accent selectors with light fallbacks 3ms
   × ships a complete copyable look template with documented instructions 5ms
```

Command: `npx playwright test tests/e2e/warm.spec.js --project desktop-light --workers 1`
Exit code: 1, before gallery implementation.

```text
    Test timeout of 120000ms exceeded.

    Error: locator.selectOption: Test timeout of 120000ms exceeded.
[... browser launch diagnostics omitted ...]
      - waiting for locator('#look-select')
        - locator resolved to <select name="look" id="look-select">…</select>
      - attempting select option action
        2 × waiting for element to be visible and enabled
          - did not find some options
```

Command: `npx playwright test tests/e2e/verify-ui.spec.js --workers 2`
Exit code: 0, unchanged baseline.

```text
  12 passed (16.9s)
```

Command: `npx vitest run tests/unit/warm.test.js tests/unit/tokens.test.js tests/unit/gallery.test.js tests/unit/icon.test.js --no-color`
Exit code: 0.

```text
 Test Files  4 passed (4)
      Tests  973 passed (973)
   Start at  14:40:06
   Duration  499ms (tests 40%, import 30%, transform 23%, worker 7%)
```

Command: `npx playwright test tests/e2e/verify-ui.spec.js tests/e2e/warm.spec.js --workers 2`
Exit code: 0.

```text
  20 passed (34.6s)
```

## Visual Verification
Command: `python scripts/devops.py check`
Exit code: 0. Selected verbatim output follows.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 87748
All 24 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 84180
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 14436
4 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
============================== 3 passed in 1.70s ==============================
 Test Files  8 passed (8)
      Tests  1003 passed (1003)
  164 passed (51.8s)
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... intervening browser and package detail output omitted ...]
npm notice package size: 897.4 kB
npm notice unpacked size: 1.0 MB
npm notice shasum: 76a35d583b367687d3cd01d28f2f6c8db09fa168
npm notice integrity: sha512-DJh5EkFIqhwSO[...]Oj1I9g/Y5BzdA==
npm notice total files: 53
npm notice
gpellicciotta-support.webapp-0.1.0-pre.tgz

```

## Screenshot Inspection
Command: `plan tasks validate T0017 --completion`
Exit code: 0.

```text
All 1 task file passed validation.
```

Command: `git diff --check`
Exit code: 0, no output.

### Captures
The verifier confirmed HTTP 200, loaded stylesheets and fonts, resolved sprites, contrast, focus rings, targets, and zero overflow.
The season test checked each source accent in both themes, wrapper scoping, root switching, and cleanup when returning to neutral.
Before and after images show actual gallery content with the intended typography, shapes, palette, and seasonal specimens.
- [Before light desktop](before-gallery-neutral-light-1440-system.png)
- [Before dark desktop](before-gallery-neutral-dark-1440-system.png)
- [Before light phone](before-gallery-neutral-light-390-system.png)
- [Before dark phone](before-gallery-neutral-dark-390-system.png)
- [After light desktop](after-gallery-warm-light-1440-system.png)
- [After dark desktop](after-gallery-warm-dark-1440-system.png)
- [After light phone](after-gallery-warm-light-390-system.png)
- [After dark phone](after-gallery-warm-dark-390-system.png)

The Playwright runner supervised its temporary servers and shut them down after each run.
Observed server PIDs: baseline 78712, red 86756, affected 79964, full check 82812.
Commands used the dynamic port selected by `playwright.config.js`: `node scripts/serve.mjs --port {{selected-port}}`.
