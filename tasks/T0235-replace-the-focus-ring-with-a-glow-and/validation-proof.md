## Walkthrough & Validation

### Failing tests before the CSS change
Command:
`npx playwright test tests/e2e/menu.spec.js tests/e2e/button.spec.js tests/e2e/verify-ui.spec.js tests/e2e/fab.spec.js -g "glow|menu focus|injected|focus" --project desktop-light --reporter=line`

Exit code: 1

```text
    Error: default: outline color
    Expected: "rgba(0, 0, 0, 0)"
    Received: "rgb(37, 99, 235)"
    Error: neutral item specimen: outline color
    Expected: "rgba(0, 0, 0, 0)"
    Received: "rgb(37, 99, 235)"
    Error: fab: outline color
    Expected: "rgba(0, 0, 0, 0)"
    Received: "rgb(37, 99, 235)"
    Error: expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
  4 failed
  1 passed (7.2s)
```

### Halo contrast tuning
With a 25% halo, the verifier reported the neutral dark active ground below 3:1:

```text
      4     +   "input.switch__control: focus contour contrast 2.80 < 3",
      4     +   "button.menu__item.is-active: focus contour contrast 2.80 < 3",
      4     +   "button.collapsible__toggle.is-active: focus contour contrast 2.80 < 3",
```

At 20%, `npx playwright test tests/e2e/verify-ui.spec.js -g "neutral|injected" --reporter=list` exited 0:

```text
  2 skipped
  26 passed (59.1s)
```

### Full check
Command: `python scripts/devops.py check`

Exit code: 0 (second run on the final sources)

```text
All 26 markdown files passed linting.
All checks passed!
======================== 41 passed, 1 skipped in 2.92s ========================
 Test Files  33 passed (33)
      Tests  2163 passed (2163)
  28 skipped
  728 passed (8.3m)
 Test Files  3 passed (3)
      Tests  7 passed (7)
gpellicciotta-support.webapp-0.1.1-pre.tgz
```

The first run on the same sources exited 1 on one test in two of four projects:

```text
  ✘   54 [desktop-light] › tests\e2e\form.spec.js:102:1 › clearing the address while the name check runs during submit blocks the send (8.8s)
  ✘  621 [mobile-dark] › tests\e2e\form.spec.js:102:1 › clearing the address while the name check runs during submit blocks the send (12.4s)
  2 failed
  28 skipped
  726 passed (11.7m)
```

The error summary never opened, a JavaScript timing race under load, not a style change.
`npx playwright test tests/e2e/form.spec.js -g "clearing the address" --repeat-each 5 --reporter=line` exited 0:

```text
  20 passed (21.6s)
```

### Screenshots
Gallery sections at 1440 px, before and after, in light and dark:

| Section | Before                                                                         | After                                                                        |
| :------ | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| Menu    | [light](before-menu-desktop-light.png), [dark](before-menu-desktop-dark.png)       | [light](after-menu-desktop-light.png), [dark](after-menu-desktop-dark.png)       |
| Button  | [light](before-button-desktop-light.png), [dark](before-button-desktop-dark.png)   | [light](after-button-desktop-light.png), [dark](after-button-desktop-dark.png)   |
| Field   | [light](before-field-desktop-light.png), [dark](before-field-desktop-dark.png)     | [light](after-field-desktop-light.png), [dark](after-field-desktop-dark.png)     |
