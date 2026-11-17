## Technical Specifications

### Declared Files
- tests/e2e/form.spec.js

### Design
- The gallery's name check waits 600 ms on a page timer; the demo save waits 800 ms.
- Two tests still assert transient states on the real clock:
  - `an async check shows the pending state, then its error` asserts `aria-busy` during the 600 ms check.
  - `a valid submit sets the busy state, then confirms the save` asserts the form's busy state during the 800 ms save.
- A slow run can settle either wait before the assertion polls, as T0242 and T0244 saw in the edit test.
- Fix: install and pause the page clock, assert each transient state, then advance it with `page.clock.runFor`.
- **[Decided]** Share one `openPausedGallery` helper across all four async-check tests.
  It keeps the T0244 pause pattern, which pauses 60 s ahead of the page clock.

### Tests
- Unit test: none (the change touches only a Playwright spec; no unit-testable code changes)
- Integration: run `npx playwright test tests/e2e/form.spec.js` in all four projects.
  A temporary stall of 1.5 s before each transient assertion fails the old tests and passes the new ones.

Completion check: `python scripts/devops.py check`, plus `npx playwright test tests/e2e/form.spec.js --repeat-each 10`.
Size estimate: 1 files, 60 lines
