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
{{full-check}}

### Screenshots
Gallery sections at 1440 px, before and after, in light and dark:

| Section | Before                                                                         | After                                                                        |
| :------ | :----------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| Menu    | [light](before-menu-desktop-light.png), [dark](before-menu-desktop-dark.png)       | [light](after-menu-desktop-light.png), [dark](after-menu-desktop-dark.png)       |
| Button  | [light](before-button-desktop-light.png), [dark](before-button-desktop-dark.png)   | [light](after-button-desktop-light.png), [dark](after-button-desktop-dark.png)   |
| Field   | [light](before-field-desktop-light.png), [dark](before-field-desktop-dark.png)     | [light](after-field-desktop-light.png), [dark](after-field-desktop-dark.png)     |
