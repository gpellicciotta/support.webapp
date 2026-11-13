# T0006 Validation Proof

## Walkthrough & Validation

### Failing tests before the implementation
Command: `npx vitest run tests/unit/icon.test.js tests/unit/gallery.test.js`, exit code 1.

```text
 FAIL  tests/unit/icon.test.js [ tests/unit/icon.test.js ]
Error: Cannot find module '../../src/js/icon.js' imported from .../tests/unit/icon.test.js
 ❯ tests/unit/icon.test.js:5:1
 FAIL  tests/unit/gallery.test.js > look switcher > points every gallery icon at the neutral sprite
TypeError: spriteHref is not a function
 ❯ tests/unit/gallery.test.js:84:16
 Test Files  2 failed (2)
      Tests  1 failed | 17 passed (18)
```

Command: `npx playwright test tests/e2e/verify-ui.spec.js --reporter=line`, exit code 1.

```text
  1) [desktop-light] › tests\e2e\verify-ui.spec.js:372:1 › reports unresolved sprite references ────
    Error: expect(received).toEqual(expected) // deep equality
    -   "unresolved sprite reference: ../looks/neutral/icons.svg#icon-missing",
    +   "sprite file not loaded: ../looks/neutral/icons.svg#icon-missing",
        "sprite file not loaded: ../looks/missing/icons.svg#icon-close",
[neutral system 1440px] 9 stylesheets, 298 texts, 22 targets, 22 focus records, 0 sprite references, overflow 0px, errors 0
  2) [desktop-dark] › tests\e2e\verify-ui.spec.js:319:9 › gallery passes every verifier check in the neutral look › system theme at 1440 px
    Error: expect(received).toBeGreaterThan(expected)
    Received:   0
    > 340 |                     expect(sprites.references).toBeGreaterThan(0);
```

### Passing tests after the implementation
Completion check: `npx vitest run tests/unit/icon.test.js`, exit code 0.

```text
 Test Files  1 passed (1)
      Tests  31 passed (31)
```

Command: `npx playwright test tests/e2e/verify-ui.spec.js --reporter=line`, exit code 0.

```text
[2/12] [desktop-light] › tests\e2e\verify-ui.spec.js:372:1 › reports unresolved sprite references
[neutral system 1440px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[neutral system 1440px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[6/12] [desktop-dark] › tests\e2e\verify-ui.spec.js:372:1 › reports unresolved sprite references
[neutral light 1440px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[neutral dark 1440px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[9/12] [mobile-light] › tests\e2e\verify-ui.spec.js:372:1 › reports unresolved sprite references
[neutral system 390px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[neutral system 390px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[12/12] [mobile-dark] › tests\e2e\verify-ui.spec.js:372:1 › reports unresolved sprite references
[neutral dark 390px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
[neutral light 390px] 10 stylesheets, 337 texts, 23 targets, 23 focus records, 33 sprite references, overflow 0px, errors 0
  12 passed (11.1s)
```

Command: `python scripts/devops.py check`, exit code 0.

```text
Command: C:\Dev-Projects\plan\.venv\Scripts\lint-markdown.EXE check --offline
Process ID: 42612
All 22 markdown files passed linting.
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff check scripts tests
Process ID: 58668
All checks passed!
Command: C:\Dev-Projects\plan\.venv\Scripts\python.exe -m ruff format --check scripts tests
Process ID: 86476
4 files already formatted
[... lint and pytest lines omitted ...]
============================== 3 passed in 2.50s ==============================
 Test Files  7 passed (7)
      Tests  521 passed (521)
[... browser test lines omitted ...]
  20 passed (47.3s)
 Test Files  2 passed (2)
      Tests  4 passed (4)
[... npm pack lines omitted ...]
```

### Visual verification
Command: `node capture.mjs {{web-root}} {{task-dir}} {{label}} {{selector}}`, a one-off script outside the repository.
It serves `src/` in process, opens the gallery per theme at 390 and 1440 px, and fails on console errors or HTTP 400+.
The before captures show the last gallery section at base commit `7e2f5b7`, which had no icon section.
Each output line below drops its trailing ` -> {{absolute-png-path}}` part.

```text
before light 390px HTTP 200
before dark 390px HTTP 200
before light 1440px HTTP 200
before dark 1440px HTTP 200
problems: 0
after light 390px HTTP 200
after dark 390px HTTP 200
after light 1440px HTTP 200
after dark 1440px HTTP 200
problems: 0
```

| Theme | Width   | Before                                         | After                                        |
| :---- | :------ | :--------------------------------------------- | :------------------------------------------- |
| Light | 390 px  | [before-light-390.png](before-light-390.png)   | [after-light-390.png](after-light-390.png)   |
| Dark  | 390 px  | [before-dark-390.png](before-dark-390.png)     | [after-dark-390.png](after-dark-390.png)     |
| Light | 1440 px | [before-light-1440.png](before-light-1440.png) | [after-light-1440.png](after-light-1440.png) |
| Dark  | 1440 px | [before-dark-1440.png](before-dark-1440.png)   | [after-dark-1440.png](after-dark-1440.png)   |

Inspected captures: all 30 glyphs and the three sizes render in both themes, with no blank cards.
