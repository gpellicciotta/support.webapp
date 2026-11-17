## Walkthrough & Validation

### Red phase: new spec against the original sources
`npx playwright test tests/e2e/button-alignment.spec.js --reporter=line` exited with code 1.
The CSS and gallery files were temporarily restored from `HEAD`, then put back.
This run predates widening the baseline tolerance to 1 px; its row failures were off by 6 to 7.6 px.

```text
  1) [desktop-light] › tests\e2e\button-alignment.spec.js:114:1 › row actions end at the row end edge 
  2) [desktop-light] › tests\e2e\button-alignment.spec.js:50:1 › banner buttons keep the same space above, below, and after them 
  3) [desktop-light] › tests\e2e\button-alignment.spec.js:87:5 › neutral row button labels sit on the row text's first baseline 
  4) [desktop-light] › tests\e2e\button-alignment.spec.js:87:5 › warm row button labels sit on the row text's first baseline 
  5) [desktop-light] › tests\e2e\button-alignment.spec.js:126:1 › form and card buttons flow to the end edge 
  6) [desktop-dark] › tests\e2e\button-alignment.spec.js:50:1 › banner buttons keep the same space above, below, and after them 
  7) [desktop-dark] › tests\e2e\button-alignment.spec.js:87:5 › neutral row button labels sit on the row text's first baseline 
  8) [desktop-dark] › tests\e2e\button-alignment.spec.js:114:1 › row actions end at the row end edge 
  9) [desktop-dark] › tests\e2e\button-alignment.spec.js:87:5 › warm row button labels sit on the row text's first baseline 
  10) [desktop-dark] › tests\e2e\button-alignment.spec.js:126:1 › form and card buttons flow to the end edge 
  11) [desktop-light] › tests\e2e\button-alignment.spec.js:145:1 › the error summary title takes the danger color and its links the text color 
  12) [mobile-light] › tests\e2e\button-alignment.spec.js:50:1 › banner buttons keep the same space above, below, and after them 
  13) [mobile-light] › tests\e2e\button-alignment.spec.js:87:5 › neutral row button labels sit on the row text's first baseline 
  14) [mobile-light] › tests\e2e\button-alignment.spec.js:87:5 › warm row button labels sit on the row text's first baseline 
  15) [mobile-light] › tests\e2e\button-alignment.spec.js:114:1 › row actions end at the row end edge 
  16) [mobile-light] › tests\e2e\button-alignment.spec.js:126:1 › form and card buttons flow to the end edge 
  17) [desktop-dark] › tests\e2e\button-alignment.spec.js:145:1 › the error summary title takes the danger color and its links the text color 
  18) [mobile-dark] › tests\e2e\button-alignment.spec.js:50:1 › banner buttons keep the same space above, below, and after them 
  19) [mobile-dark] › tests\e2e\button-alignment.spec.js:87:5 › neutral row button labels sit on the row text's first baseline 
  20) [mobile-dark] › tests\e2e\button-alignment.spec.js:87:5 › warm row button labels sit on the row text's first baseline 
  21) [mobile-dark] › tests\e2e\button-alignment.spec.js:114:1 › row actions end at the row end edge 
  22) [mobile-dark] › tests\e2e\button-alignment.spec.js:126:1 › form and card buttons flow to the end edge 
  23) [mobile-light] › tests\e2e\button-alignment.spec.js:145:1 › the error summary title takes the danger color and its links the text color 
  24) [mobile-dark] › tests\e2e\button-alignment.spec.js:145:1 › the error summary title takes the danger color and its links the text color 
  24 failed
```

### Green phase: new spec after the change
`npx playwright test tests/e2e/button-alignment.spec.js --reporter=line` exited with code 0.

```text
[... 25 lines omitted ...]
[23/24] [mobile-dark] › tests\e2e\button-alignment.spec.js:128:1 › form and card buttons flow to the end edge
[24/24] [mobile-dark] › tests\e2e\button-alignment.spec.js:147:1 › the error summary title takes the danger color and its links the text color
  24 passed (15.0s)
```

### Full check
`python scripts/devops.py check` exited with code 1, failing only `tests/integration/generate-app.test.js`.
The worktree's stale `node_modules` lacked `@stylistic/eslint-plugin`, which generated apps link and lint with.
All other stages passed, including 796 browser tests.

```text
All 26 markdown files passed linting.
All checks passed!
6 files already formatted
======================== 41 passed, 1 skipped in 2.24s ========================
 Test Files  33 passed (33)
      Tests  2163 passed (2163)
  796 passed (6.6m)
   × generates a neutral app that passes its own checks and the conformance check 6540ms
   × generates a warm app that passes its own checks and the conformance check 3349ms
   × generates a bright app that passes its own checks and the conformance check 2030ms
 FAIL  tests/integration/generate-app.test.js > generates a neutral app that passes its own checks and the conformance check
All 8 markdown files passed linting.
All checks passed!
2 files already formatted
 FAIL  tests/integration/generate-app.test.js > generates a warm app that passes its own checks and the conformance check
All 8 markdown files passed linting.
All checks passed!
2 files already formatted
 FAIL  tests/integration/generate-app.test.js > generates a bright app that passes its own checks and the conformance check
All 8 markdown files passed linting.
All checks passed!
2 files already formatted
 Test Files  1 failed | 2 passed (3)
      Tests  3 failed | 4 passed (7)
```

### Integration suite after `npm install`
`npm run test:integration` exited with code 0.

```text
> vitest run --config vitest.integration.config.js
 RUN  v5.1.0 C:/Dev-Projects/support.webapp/.plan/work/T0238-align-buttons-in-banners-rows-forms-and-cards
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Start at  13:53:31
   Duration  58.23s (tests 100%)
```

### Screenshots
Neutral look, desktop light and mobile dark, before and after:

- Banner: [before](screenshots/before-desktop-light-banner.png), [after](screenshots/after-desktop-light-banner.png), [mobile before](screenshots/before-mobile-dark-banner.png), [mobile after](screenshots/after-mobile-dark-banner.png).
- Row at 40rem with a wrapped name: [before](screenshots/before-desktop-light-row-wrapped.png), [after](screenshots/after-desktop-light-row-wrapped.png).
- Rows: [before](screenshots/before-desktop-light-row.png), [after](screenshots/after-desktop-light-row.png), [list before](screenshots/before-mobile-dark-list.png), [list after](screenshots/after-mobile-dark-list.png).
- Card: [before](screenshots/before-desktop-light-card.png), [after](screenshots/after-desktop-light-card.png).
- Error summary: [before](screenshots/before-desktop-light-error-summary.png), [after](screenshots/after-desktop-light-error-summary.png).
- Form, unchanged: [before](screenshots/before-mobile-dark-form.png), [after](screenshots/after-mobile-dark-form.png).
