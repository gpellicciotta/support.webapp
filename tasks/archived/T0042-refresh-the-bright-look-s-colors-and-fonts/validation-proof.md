# T0042 Validation Proof

## Walkthrough & Validation
The bright look now uses the Ocean and raspberry palette and self-hosted Lexend.
Every new primitive keeps the earlier step's WCAG luminance, so the token test's AA pairs still pass.
Lexend loads from `fonts/lexend/` by relative URLs; the screenshot run saw no external request.

### Red phase
Command: `npx vitest run tests/unit/bright.test.js tests/unit/tokens.test.js -t "bright|font and license"`, exit code 1.

```text
[... 10 lines omitted ...]
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯
[... 1 lines omitted ...]
 FAIL  tests/unit/bright.test.js > registers bright with three bare accent variants and self-hosted Lexend
AssertionError: expected '/* Import exactly one look entry from…' to contain '@import url(\'fonts.css\');'
[... 21 lines omitted ...]
 FAIL  tests/unit/tokens.test.js > token contract > preserves the copied font and license bytes
Error: ENOENT: no such file or directory, open 'C:\Dev-Projects\support.webapp\src\looks\bright\fonts\lexend\lexend-latin-wght-normal.woff2'
[... 10 lines omitted ...]
 FAIL  tests/unit/tokens.test.js > token contract > uses the chosen sea slate, cerulean, and raspberry bright palette
AssertionError: expected { '--slate-50': '#f8fafc', …(21) } to deeply equal { '--slate-50': '#f8fafc', …(21) }
[... 8 lines omitted ...]
-   "--blue-600": "#006796",
[... 13 lines omitted ...]
+   "--blue-600": "#1a56db",
[... 38 lines omitted ...]
 Test Files  2 failed (2)
      Tests  3 failed | 443 passed | 1437 skipped (1883)
[... 3 lines omitted ...]
exit code: 1
```

Command: `npx vitest run tests/unit/bright.test.js`, exit code 1.

```text
[... 7 lines omitted ...]
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 2 ⎯⎯⎯⎯⎯⎯⎯
[... 1 lines omitted ...]
 FAIL  tests/unit/bright.test.js > registers bright with three bare accent variants and self-hosted Lexend
AssertionError: expected '/* Import exactly one look entry from…' to contain '@import url(\'fonts.css\');'
[... 21 lines omitted ...]
 FAIL  tests/unit/bright.test.js > loads every font by a relative URL, so the look never contacts a remote server
Error: ENOENT: no such file or directory, open 'C:\Dev-Projects\support.webapp\src\looks\bright\fonts.css'
[... 12 lines omitted ...]
 Test Files  1 failed (1)
      Tests  2 failed (2)
[... 3 lines omitted ...]
exit code: 1
```

Command: `npx playwright test tests/e2e/bright.spec.js --project desktop-light`, exit code 1.

```text
[... 3 lines omitted ...]
  ok 1 [desktop-light] › tests\e2e\bright.spec.js:21:1 › forced fallback preserves root accents and every contrast pair (2.3s)
  ok 3 [desktop-light] › tests\e2e\bright.spec.js:5:1 › look selection waits for pending color transitions (2.2s)
  x  2 [desktop-light] › tests\e2e\bright.spec.js:62:1 › bright accents work on roots and wrappers and reset when switching looks (6.8s)
[... 4 lines omitted ...]
    Error: expect(locator).toHaveCSS(expected) failed
[... 2 lines omitted ...]
    Expected pattern: /^"Lexend Variable", "Lexend", system-ui,/
    Received string:  "system-ui, -apple-system, \"Segoe UI\", Roboto, sans-serif"
[... 20 lines omitted ...]
  1 failed
[... 1 lines omitted ...]
  2 passed (8.4s)
exit code: 1
```

### Green phase
Command: `python scripts/devops.py check`, exit code 0.
The full log is in [check.log](check.log).

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
[... 1 lines omitted ...]
All 27 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
[... 1 lines omitted ...]
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
[... 1 lines omitted ...]
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
[... 3 lines omitted ...]
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
[... 13 lines omitted ...]
======================== 61 passed, 1 skipped in 1.97s ========================
Command: "C:\Program Files\nodejs\npm.CMD" test
[... 4 lines omitted ...]
 Test Files  34 passed (34)
      Tests  2186 passed (2186)
[... 4 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
[... 1096 lines omitted ...]
  42 skipped
  830 passed (5.7m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
[... 4 lines omitted ...]
 Test Files  3 passed (3)
      Tests  7 passed (7)
[... 2 lines omitted ...]
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
[... 90 lines omitted ...]
npm notice 1.2kB src/looks/bright/fonts.css
npm notice 34.5kB src/looks/bright/fonts/lexend/lexend-latin-ext-wght-normal.woff2
npm notice 39.7kB src/looks/bright/fonts/lexend/lexend-latin-wght-normal.woff2
npm notice 4.4kB src/looks/bright/fonts/lexend/OFL.txt
[... 36 lines omitted ...]
exit code: 0
```

### Screenshots
Command: `node work/t0042-shots.mjs after .plan/tasks/T0042-refresh-the-bright-look-s-colors-and-fonts`, exit code 0.

```text
light 390: body font "Lexend Variable", Lexend, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; Lexend loaded true
light 1440: body font "Lexend Variable", Lexend, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; Lexend loaded true
dark 390: body font "Lexend Variable", Lexend, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; Lexend loaded true
dark 1440: body font "Lexend Variable", Lexend, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; Lexend loaded true
no console errors, failed requests, or external requests
```

| Section | Theme | Width | Before | After |
| :------ | :---- | :---- | :----- | :---- |
| button | light | 390 | [before](before-button-light-390.png) | [after](after-button-light-390.png) |
| button | light | 1440 | [before](before-button-light-1440.png) | [after](after-button-light-1440.png) |
| button | dark | 390 | [before](before-button-dark-390.png) | [after](after-button-dark-390.png) |
| button | dark | 1440 | [before](before-button-dark-1440.png) | [after](after-button-dark-1440.png) |
| field | light | 390 | [before](before-field-light-390.png) | [after](after-field-light-390.png) |
| field | light | 1440 | [before](before-field-light-1440.png) | [after](after-field-light-1440.png) |
| field | dark | 390 | [before](before-field-dark-390.png) | [after](after-field-dark-390.png) |
| field | dark | 1440 | [before](before-field-dark-1440.png) | [after](after-field-dark-1440.png) |

Lexend is wider than the system stack, so the field hint "Up to 40 characters." now wraps beside its counter at 1440 px.
The field layout keeps the counter aligned; the verifier reports no overflow at either width.
