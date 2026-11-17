## Technical Specifications

### Root Cause
- The gallery's name check waits 600 ms on a real timer.
- The test had to blur, see `aria-busy`, press two keys, and see the status hidden inside that window.
- Under full-suite load the old check could settle first.
- The edit then turned the error or pending state into a fresh visible check, so `toBeHidden` failed.

### Fix
- Install Playwright's page clock, open the gallery, then pause the clock.
- Advance the clock with `runFor(600)` once for the overtaken check and once for the new check.
- Assert the new check's pending line, then its valid line.

### Declared Files
- tests/e2e/form.spec.js

### Tests
- Unit: none (the fix changes only an end-to-end test; field unit tests already cover overtaken checks)
- Integration: the form spec's pending-check edit test passes with a 700 ms delay injected before the edit, and 200 repeats at 12 workers.

Completion check: `python scripts/devops.py check`

Size estimate: 2 files, 30 lines
