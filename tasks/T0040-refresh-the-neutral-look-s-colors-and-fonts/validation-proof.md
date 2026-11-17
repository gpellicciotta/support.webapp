## Walkthrough & Validation

### Summary
- Slate grays and blue primitives replace the violet-tinted grays and navy in the neutral look.
- The private `--navy-*` primitives are renamed `--blue-*` in the neutral look only.
- Shadow and backdrop tints use slate 900 in light; Inter is unchanged.

### Failing test before the change
Command: `npx vitest run tests/unit/tokens.test.js -t "slate and blue"`, exit code 1.

```text

 RUN  v5.1.0 C:/Dev-Projects/support.webapp

 ❯ tests/unit/tokens.test.js (1848 tests | 1 failed | 1847 skipped) 29ms
   ❯ token contract (1730)
     × uses the chosen slate and blue neutral palette without navy primitives 25ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/unit/tokens.test.js > token contract > uses the chosen slate and blue neutral palette without navy primitives
AssertionError: expected { '--gray-0': '#ffffff', …(20) } to deeply equal { '--gray-0': '#ffffff', …(20) }

- Expected
+ Received

  {
-   "--blue-200": "#c3d5fb",
-   "--blue-300": "#a3bdf8",
-   "--blue-400": "#7ea2f6",
-   "--blue-50": "#eff6ff",
-   "--blue-600": "#2563eb",
-   "--blue-700": "#1d4ed8",
[... 50 lines omitted ...]
   Start at  10:33:14
   Duration  491ms (import 68%, tests 17%, transform 9%, worker 6%)

exit 1
```

### Completion check after the change
Command: `python scripts/devops.py check`, exit code 0.

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
Process ID: 40312
All 26 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
Process ID: 10716
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
Process ID: 54376
[... 19 lines omitted ...]
======================== 41 passed, 1 skipped in 3.00s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
Process ID: 42732
> @gpellicciotta/support.webapp@0.1.1-pre test
> vitest run
 RUN  v5.1.0 C:/Dev-Projects/support.webapp
 Test Files  33 passed (33)
      Tests  2131 passed (2131)
   Start at  10:34:44
[... 980 lines omitted ...]
  28 skipped
  724 passed (5.6m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 132 lines omitted ...]
npm notice
gpellicciotta-support.webapp-0.1.1-pre.tgz
exit 0
```

### Screenshots
Gallery button and field sections, light and dark, at 390 and 1440 px.

- [after-button-dark-1440.png](after-button-dark-1440.png)
- [after-button-dark-390.png](after-button-dark-390.png)
- [after-button-light-1440.png](after-button-light-1440.png)
- [after-button-light-390.png](after-button-light-390.png)
- [after-field-dark-1440.png](after-field-dark-1440.png)
- [after-field-dark-390.png](after-field-dark-390.png)
- [after-field-light-1440.png](after-field-light-1440.png)
- [after-field-light-390.png](after-field-light-390.png)
- [before-button-dark-1440.png](before-button-dark-1440.png)
- [before-button-dark-390.png](before-button-dark-390.png)
- [before-button-light-1440.png](before-button-light-1440.png)
- [before-button-light-390.png](before-button-light-390.png)
- [before-field-dark-1440.png](before-field-dark-1440.png)
- [before-field-dark-390.png](before-field-dark-390.png)
- [before-field-light-1440.png](before-field-light-1440.png)
- [before-field-light-390.png](before-field-light-390.png)
