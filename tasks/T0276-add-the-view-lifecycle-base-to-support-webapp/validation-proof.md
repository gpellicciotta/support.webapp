# Validation Proof: T0276

## Red phase

`npx vitest run tests/unit/view.test.js` before `src/js/view.js` existed (failed to load the module). `npx playwright test tests/e2e/view.spec.js --project=desktop-light` before the shell.css rule:

```
x  1 [desktop-light] › view.spec.js:36:5 › sample view › draws the error page with the look icon and no wait status for a fast load
    Error: expect(locator).toBeHidden() failed
    Expected: hidden
    Received: visible
```

## Green phase

`python scripts/devops.py check` (exit 0):

```
All 27 markdown files passed linting.
All checks passed!
======================== 61 passed, 1 skipped in 3.65s ========================
 Test Files  37 passed (37)
      Tests  2241 passed (2241)
  866 passed (8.0m)
 Test Files  3 passed (3)
      Tests  7 passed (7)
```

## Visual
Portal shell demo at 390 px, neutral look, light theme: [before](before-portal.png) and [after](after-portal.png).
The error and ready states of the sample view, per look, theme, and width, are linked here:
- [view-error-bright-desktop-dark.png](view-error-bright-desktop-dark.png)
- [view-error-bright-desktop-light.png](view-error-bright-desktop-light.png)
- [view-error-bright-mobile-dark.png](view-error-bright-mobile-dark.png)
- [view-error-bright-mobile-light.png](view-error-bright-mobile-light.png)
- [view-error-neutral-desktop-dark.png](view-error-neutral-desktop-dark.png)
- [view-error-neutral-desktop-light.png](view-error-neutral-desktop-light.png)
- [view-error-neutral-mobile-dark.png](view-error-neutral-mobile-dark.png)
- [view-error-neutral-mobile-light.png](view-error-neutral-mobile-light.png)
- [view-error-warm-desktop-dark.png](view-error-warm-desktop-dark.png)
- [view-error-warm-desktop-light.png](view-error-warm-desktop-light.png)
- [view-error-warm-mobile-dark.png](view-error-warm-mobile-dark.png)
- [view-error-warm-mobile-light.png](view-error-warm-mobile-light.png)
- [view-ready-bright-desktop-dark.png](view-ready-bright-desktop-dark.png)
- [view-ready-bright-desktop-light.png](view-ready-bright-desktop-light.png)
- [view-ready-bright-mobile-dark.png](view-ready-bright-mobile-dark.png)
- [view-ready-bright-mobile-light.png](view-ready-bright-mobile-light.png)
- [view-ready-neutral-desktop-dark.png](view-ready-neutral-desktop-dark.png)
- [view-ready-neutral-desktop-light.png](view-ready-neutral-desktop-light.png)
- [view-ready-neutral-mobile-dark.png](view-ready-neutral-mobile-dark.png)
- [view-ready-neutral-mobile-light.png](view-ready-neutral-mobile-light.png)
- [view-ready-warm-desktop-dark.png](view-ready-warm-desktop-dark.png)
- [view-ready-warm-desktop-light.png](view-ready-warm-desktop-light.png)
- [view-ready-warm-mobile-dark.png](view-ready-warm-mobile-dark.png)
- [view-ready-warm-mobile-light.png](view-ready-warm-mobile-light.png)

The first captures showed an empty bordered button beside Try again, the hidden back link.
A browser test and a shell.css rule fix it.
