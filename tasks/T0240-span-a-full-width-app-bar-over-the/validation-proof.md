## Walkthrough & Validation

### Key Changes
- `shell.css`: wide grid puts the top bar and action bar on full-width rows; the sidebar and side panel sit between them.
- `app-nav.js`: `attachAppNav` cycles open, rail, and hidden from 64rem, and drives the drawer below it.
- Admin console: nav toggle and brand in the bar; page title as the main heading. List editor: nav toggle added.
- `icon-nav-menu` joins the core icon ids and every look sprite.

### Screenshots
- Before: [admin console 1440](before-admin-console-1440.png), [list editor 1440](before-list-editor-1440.png), [list editor 390](before-list-editor-390.png).
- After: [admin console 1440](after-admin-console-1440.png), [admin console 390 drawer](after-admin-console-390-drawer.png).
- After: [list editor 1440](after-list-editor-1440.png), [list editor 1440 rail](after-list-editor-1440-rail.png), [list editor 390](after-list-editor-390.png).

### Red: new unit tests before the implementation
`npx vitest run tests/unit/app-nav.test.js tests/unit/icon.test.js` exited 1:

```text
     × lists unique icon-prefixed kebab-case ids, validation icons included 15ms
       × draws icon-nav-menu as three horizontal lines of one length 2ms
       × draws icon-nav-menu as three horizontal lines of one length 1ms
       × draws icon-nav-menu as three horizontal lines of one length 1ms
       × draws icon-nav-menu as three horizontal lines of one length 1ms
 FAIL  tests/unit/app-nav.test.js [ tests/unit/app-nav.test.js ]
Error: Failed to resolve import "../../src/js/app-nav.js" from "tests/unit/app-nav.test.js". Does the file exist?
 Test Files  2 failed (2)
      Tests  5 failed | 43 passed (48)
```

### Red: shell browser spec before the implementation
`npx playwright test tests/e2e/shell.spec.js --reporter=line` exited 1:

```text
  1) [desktop-light] › tests\e2e\shell.spec.js:109:9 › list-editor shell demo › renders its areas and drops the absent ones
  2) [desktop-light] › tests\e2e\shell.spec.js:239:9 › list-editor shell demo › aligns the top bar edge text and glyphs with the content column
  3) [desktop-light] › tests\e2e\shell.spec.js:109:9 › admin-console shell demo › renders its areas and drops the absent ones
  4) [desktop-light] › tests\e2e\shell.spec.js:286:1 › list-editor opens its side panel beside the main column or as a full-window sheet
  5) [desktop-light] › tests\e2e\shell.spec.js:239:9 › admin-console shell demo › aligns the top bar edge text and glyphs with the content column
  6) [desktop-light] › tests\e2e\shell.spec.js:339:1 › the page scroll mode keeps the sidebar and side panel in view between the bars on wide screens
  8) [desktop-light] › tests\e2e\shell.spec.js:362:5 › list-editor cycles its sidebar through open, rail, and hidden from the nav toggle
  9) [desktop-light] › tests\e2e\shell.spec.js:362:5 › admin-console cycles its sidebar through open, rail, and hidden from the nav toggle
  17) [mobile-light] › tests\e2e\shell.spec.js:416:1 › admin-console opens its navigation as a drawer under the bar below 64rem
  18) [mobile-dark] › tests\e2e\shell.spec.js:416:1 › admin-console opens its navigation as a drawer under the bar below 64rem
[... 8 lines omitted: the desktop-dark repeats of failures 1 to 9 ...]
  18 failed
  22 skipped
  140 passed (53.2s)
```

### Green: shell browser spec
`npx playwright test tests/e2e/shell.spec.js --reporter=line` exited 0:

```text
[180/180] [mobile-dark] › tests\e2e\shell.spec.js:524:1 › only shell.css sets fixed or sticky positions and pads bars with safe-area insets
  22 skipped
  158 passed (40.0s)
```

### Full check, run step by step
The first `python scripts/devops.py check` run failed only in `tests/integration/generate-app.test.js`.
The worktree lacked the declared `@stylistic/eslint-plugin` package; `npm install` restored it.
A rerun of the whole check was cut off with the previous session, so its steps ran one by one on commit `379b0bc`.

`python scripts/devops.py lint` exited 0:

```text
All 27 markdown files passed linting.
All checks passed!
8 files already formatted
> eslint .
```

`python scripts/devops.py test` exited 0:

```text
======================== 56 passed, 1 skipped in 5.00s ========================
 Test Files  34 passed (34)
      Tests  2184 passed (2184)
```

`npx playwright test --reporter=line` exited 0:

```text
[bright light 390px] 48 stylesheets, 17 texts, 13 targets, 13 focus records, 2 sprite references, overflow 0px, errors 0

  42 skipped
  806 passed (6.9m)
```

`npx vitest run --config vitest.integration.config.js` exited 0, on the same sources:

```text
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Duration  114.73s (tests 100%)
```

`python scripts/devops.py build` exited 0:

```text
npm notice total files: 107
gpellicciotta-support.webapp-0.1.1-pre.tgz
```
