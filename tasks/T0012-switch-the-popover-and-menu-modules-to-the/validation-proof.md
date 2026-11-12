# T0012 Validation Proof

## Walkthrough & Validation

### Failing tests before the implementation
Command: `npx vitest run tests/unit/popover.test.js tests/unit/menu.test.js`, exit code 1.

```text
     × marks up the trigger and the menu and starts closed 20ms
     × opens on "Enter" and focuses the first item 7ms
     × opens on " " and focuses the first item 3ms
     × opens on "ArrowDown" and focuses the first item 2ms
     × follows a light dismiss of the platform and returns focus to the trigger 3ms
     × turns the panel into a closed auto popover invoked by the trigger 17ms
     × opens on a trigger click and focuses the first control 14ms
     × stays open on clicks inside the panel 4ms
     × follows a light dismiss of the platform and returns focus to the trigger 3ms
     × ignores the toggle events of its own changes 10ms
     × anchors the open popover at its trigger 7ms
     × removes its attributes and listeners on destroy, leaving the panel a closed popover 2ms
     × places the panel below the trigger, or above it when it lacks room below 2ms
⎯⎯⎯⎯⎯⎯ Failed Tests 13 ⎯⎯⎯⎯⎯⎯⎯
 Test Files  2 failed (2)
      Tests  13 failed | 23 passed (36)
```

Command: `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js --reporter=line`, exit code 1.
All 6 tests fail in each of the 4 projects; the desktop-light failures show each cause.

```text
  1) [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring ────────────────────
    Error: expect(received).toBe(expected) // Object.is equality
    Expected: true
    Received: false
    > 21 |         expect(await menu.evaluate((element) => element.matches(':popover-open'))).toBe(true);
  3) [desktop-light] › tests\e2e\menu.spec.js:52:1 › menu light dismiss and top layer ──────────────
    Error: expect(locator).toHaveAttribute(expected) failed
    Locator:  locator('#menu-demo')
    Expected: "auto"
    Received: ""
  4) [desktop-light] › tests\e2e\menu.spec.js:77:5 › without JavaScript › menu opens through popovertarget
    Error: expect(locator).toBeVisible() failed
    Locator:  locator('#menu-demo')
    Expected: visible
    Received: hidden
[... the popover.spec.js failures repeat these three causes on #popover-demo ...]
  24 failed
```

### Passing tests after the implementation
Command: `npx vitest run tests/unit/popover.test.js tests/unit/menu.test.js`, exit code 0.

```text
 Test Files  2 passed (2)
      Tests  36 passed (36)
```

Completion check: `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js --reporter=list`, exit code 0.

```text
  ok  1 [desktop-light] › tests\e2e\menu.spec.js:77:5 › without JavaScript › menu opens through popovertarget
  ok  4 [desktop-light] › tests\e2e\menu.spec.js:52:1 › menu light dismiss and top layer
  ok  3 [desktop-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
  ok  5 [desktop-light] › tests\e2e\popover.spec.js:48:1 › popover light dismiss and top layer
  ok  2 [desktop-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
  ok  6 [desktop-light] › tests\e2e\popover.spec.js:73:5 › without JavaScript › popover opens through popovertarget
  ok  9 [desktop-dark] › tests\e2e\menu.spec.js:77:5 › without JavaScript › menu opens through popovertarget
  ok  8 [desktop-dark] › tests\e2e\menu.spec.js:52:1 › menu light dismiss and top layer
  ok  7 [desktop-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
  ok 10 [desktop-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
  ok 12 [desktop-dark] › tests\e2e\popover.spec.js:73:5 › without JavaScript › popover opens through popovertarget
  ok 11 [desktop-dark] › tests\e2e\popover.spec.js:48:1 › popover light dismiss and top layer
  ok 14 [mobile-light] › tests\e2e\menu.spec.js:77:5 › without JavaScript › menu opens through popovertarget
  ok 13 [mobile-light] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
  ok 15 [mobile-light] › tests\e2e\menu.spec.js:52:1 › menu light dismiss and top layer
  ok 16 [mobile-light] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
  ok 17 [mobile-light] › tests\e2e\popover.spec.js:48:1 › popover light dismiss and top layer
  ok 18 [mobile-light] › tests\e2e\popover.spec.js:73:5 › without JavaScript › popover opens through popovertarget
  ok 19 [mobile-dark] › tests\e2e\menu.spec.js:7:1 › menu keyboard and anchoring
  ok 20 [mobile-dark] › tests\e2e\menu.spec.js:52:1 › menu light dismiss and top layer
  ok 22 [mobile-dark] › tests\e2e\menu.spec.js:77:5 › without JavaScript › menu opens through popovertarget
  ok 23 [mobile-dark] › tests\e2e\popover.spec.js:48:1 › popover light dismiss and top layer
  ok 21 [mobile-dark] › tests\e2e\popover.spec.js:7:1 › popover focus and anchoring
  ok 24 [mobile-dark] › tests\e2e\popover.spec.js:73:5 › without JavaScript › popover opens through popovertarget
  24 passed
```

Command: `python scripts/devops.py check`, exit code 0.
It ran before the documentation commit; `lint-markdown check --offline` and the link test passed after it.

```text
All 25 markdown files passed linting.
All checks passed!
 Test Files  20 passed (20)
      Tests  2013 passed (2013)
  272 passed (2.6m)
 Test Files  2 passed (2)
      Tests  4 passed (4)
gpellicciotta-support.webapp-0.1.0-pre.tgz
```

Command: `lint-markdown check --offline` and `python -m pytest -q tests/test_markdown_links.py`, exit code 0.

```text
All 25 markdown files passed linting.
3 passed in 2.45s
```

### Visual evidence
`MENU_EVIDENCE={{companion-dir}} npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js` stored 24 screenshots here.
They cover menus and popovers in each look, light and dark, at 1440 and 390 px.
Before captures come from the same specs on the sources of commit `6cdeeaa`, restored with `git checkout HEAD` afterwards.
- The bright 390 px light popover is byte-identical before and after.
- The neutral 1440 px light menu differs in 21 pixels, inside the focus ring of the open menu's focused item.
Open panels anchor at the trigger and paint on top in every inspected capture.
- [Before: menu, neutral, 1440 px, light](before-menu-neutral-desktop-light.png)
- [Before: popover, bright, 390 px, light](before-popover-bright-mobile-light.png)
- [Menu, neutral, 1440 px, light](after-menu-neutral-desktop-light.png)
- [Menu, warm, 390 px, dark](after-menu-warm-mobile-dark.png)
- [Popover, bright, 390 px, light](after-popover-bright-mobile-light.png)
- [Popover, neutral, 1440 px, dark](after-popover-neutral-desktop-dark.png)
