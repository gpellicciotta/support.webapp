## Walkthrough & Validation

### Red phase

Command: `npx playwright test tests/e2e/field-polish.spec.js --reporter=list` (before the CSS and gallery changes). Exit code: 1.

```text
  ✘   3 [desktop-light] › tests\e2e\field-polish.spec.js:109:1 › field group content is indented from its legend (1.8s)
  ✘   2 [desktop-light] › tests\e2e\field-polish.spec.js:62:1 › status and error lines sit one small step below the control (2.1s)
  ✘   1 [desktop-light] › tests\e2e\field-polish.spec.js:73:1 › hint, counter, status, and error text align with the text inside the control (2.0s)
  ✘   4 [desktop-light] › tests\e2e\field-polish.spec.js:50:1 › read-only fields drop their border but keep the focus border (1.9s)
  ✘   8 [desktop-dark] › tests\e2e\field-polish.spec.js:62:1 › status and error lines sit one small step below the control (1.6s)
  ✘   7 [desktop-dark] › tests\e2e\field-polish.spec.js:50:1 › read-only fields drop their border but keep the focus border (1.6s)
  ✘  10 [desktop-dark] › tests\e2e\field-polish.spec.js:109:1 › field group content is indented from its legend (1.2s)
  ✘   9 [desktop-dark] › tests\e2e\field-polish.spec.js:73:1 › hint, counter, status, and error text align with the text inside the control (1.3s)
  ✘   6 [desktop-light] › tests\e2e\field-polish.spec.js:154:1 › the select section shows every select state (6.4s)
  ✘  13 [mobile-light] › tests\e2e\field-polish.spec.js:50:1 › read-only fields drop their border but keep the focus border (1.2s)
  ✓  14 [mobile-light] › tests\e2e\field-polish.spec.js:62:1 › status and error lines sit one small step below the control (1.0s)
  ✘  11 [desktop-dark] › tests\e2e\field-polish.spec.js:154:1 › the select section shows every select state (6.0s)
  ✘  15 [mobile-light] › tests\e2e\field-polish.spec.js:73:1 › hint, counter, status, and error text align with the text inside the control (1.1s)
  ✘  16 [mobile-light] › tests\e2e\field-polish.spec.js:109:1 › field group content is indented from its legend (1.2s)
  ✘  18 [mobile-light] › tests\e2e\field-polish.spec.js:154:1 › the select section shows every select state (6.0s)
  ✘  19 [mobile-dark] › tests\e2e\field-polish.spec.js:50:1 › read-only fields drop their border but keep the focus border (1.2s)
  ✓  20 [mobile-dark] › tests\e2e\field-polish.spec.js:62:1 › status and error lines sit one small step below the control (1.1s)
  ✘  21 [mobile-dark] › tests\e2e\field-polish.spec.js:73:1 › hint, counter, status, and error text align with the text inside the control (1.0s)
  ✘  22 [mobile-dark] › tests\e2e\field-polish.spec.js:109:1 › field group content is indented from its legend (1.2s)
  ✘   5 [desktop-light] › tests\e2e\field-polish.spec.js:127:1 › the select chevron sits as far from the edge as the collapsible chevron (2.0m)
  ✘  12 [desktop-dark] › tests\e2e\field-polish.spec.js:127:1 › the select chevron sits as far from the edge as the collapsible chevron (2.0m)
  ✘  24 [mobile-dark] › tests\e2e\field-polish.spec.js:154:1 › the select section shows every select state (6.1s)
  ✘  17 [mobile-light] › tests\e2e\field-polish.spec.js:127:1 › the select chevron sits as far from the edge as the collapsible chevron (2.0m)
  ✘  23 [mobile-dark] › tests\e2e\field-polish.spec.js:127:1 › the select chevron sits as far from the edge as the collapsible chevron (2.0m)
    Error: radio

    expect(received).toBeCloseTo(expected, precision)

    Expected: 16
    Received: 0

    Expected precision:    0
    Expected difference: < 0.5
    Received difference:   16
[... failure details for the other tests omitted ...]
  22 failed
  2 passed (2.6m)
```

The two passes are the gap test on mobile, where rows were not stretched. The chevron tests timed out on the missing section.

### Green phase: affected tests

Command: `npx playwright test tests/e2e/field-polish.spec.js tests/e2e/field.spec.js --reporter=list`. Exit code: 0.

```text
  ✓   1 [desktop-light] › tests\e2e\field-polish.spec.js:50:1 › read-only fields drop their border but keep the focus border (2.4s)
  ✓   2 [desktop-light] › tests\e2e\field-polish.spec.js:62:1 › status and error lines sit one small step below the control (2.3s)
  ✓   4 [desktop-light] › tests\e2e\field-polish.spec.js:73:1 › hint, counter, status, and error text align with the text inside the control (2.1s)
  ✓   3 [desktop-light] › tests\e2e\field-polish.spec.js:110:1 › field group content is indented from its legend (2.4s)
  ✓   6 [desktop-light] › tests\e2e\field-polish.spec.js:157:1 › the select section shows every select state (1.3s)
  ✓   8 [desktop-light] › tests\e2e\field.spec.js:41:1 › the help toggle works by keyboard and keeps the help text described (1.3s)
  ✓   7 [desktop-light] › tests\e2e\field.spec.js:7:1 › the field section shows every field state with its icon, text, and color (1.5s)
  ✓   5 [desktop-light] › tests\e2e\field-polish.spec.js:130:1 › the select chevron sits as far from the edge as the collapsible chevron (1.8s)
  ✓   9 [desktop-light] › tests\e2e\field.spec.js:60:1 › a live field announces its error on blur and clears it once fixed (1.3s)
  ✓  11 [desktop-light] › tests\e2e\field.spec.js:103:1 › field groups are fieldsets with legends, and the field sections never overflow (1.2s)
  ✓  10 [desktop-light] › tests\e2e\field.spec.js:81:1 › checkboxes and radios use the primary accent, show focus, and keep 44 px rows (1.3s)
[... 33 lines for the other three projects omitted ...]
  44 passed (23.3s)
```

### Full check

Command: `python scripts/devops.py check`. Exit code: 0.

```text
All 26 markdown files passed linting.
All checks passed!
======================== 41 passed, 1 skipped in 2.96s ========================
 Test Files  33 passed (33)
      Tests  2163 passed (2163)
 Test Files  3 passed (3)
      Tests  7 passed (7)
  32 skipped
  768 passed (5.4m)
[... npm pack --dry-run file list omitted ...]
gpellicciotta-support.webapp-0.1.1-pre.tgz
```

Command: `python scripts/devops.py lint` after the docs and changelog edits. Exit code: 0.

```text
All 26 markdown files passed linting.
All checks passed!
6 files already formatted
```

### Visual verification

Screenshots come from the gallery at 1440 px and 390 px, light and dark, with no console or HTTP errors.

| Section     | Before                                                           | After                                                          |
| :---------- | :--------------------------------------------------------------- | :------------------------------------------------------------- |
| Field       | [desktop light](before-field-desktop-light.png)                  | [desktop light](after-field-desktop-light.png)                 |
| Field       | [mobile dark](before-field-mobile-dark.png)                      | [mobile dark](after-field-mobile-dark.png)                     |
| Field group | [desktop light](before-field-group-desktop-light.png)            | [desktop light](after-field-group-desktop-light.png)           |
| Field group | [mobile light](before-field-group-mobile-light.png)              | [mobile light](after-field-group-mobile-light.png)             |
| Select      | none (new section)                                               | [desktop dark](after-select-desktop-dark.png)                  |
| Select      | none (new section)                                               | [mobile light](after-select-mobile-light.png)                  |

Measured on desktop: the status gap fell from 10.67 px to 4 px; field group items moved 16 px in.
