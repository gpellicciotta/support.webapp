---
task: T0008
round: 1
verdict: rejected
reviewer: "@codex"
reviewed_at: 2026-11-12T15:00:10Z
reviewed_commit: "a201d4f"
base_commit: "81bed64"
branch: task/T0008-extract-the-field-checkbox-and-radio-components-with
---
# Review Findings: Task T0008 (Round 1)

## Summary
**[Decided]** Rejected because three reproduced defects affect the public field and form controllers.
The affected automated suites pass but omit these scenarios.
Reviewed the task, specification, execution log, validation evidence, commit history, and diff against main.

Review commands:
- `npx vitest run tests/unit/field.test.js tests/unit/form.test.js`: exit 0; 21 tests passed.
- `npx playwright test tests/e2e/field.spec.js tests/e2e/form.spec.js --reporter=line`: exit 0; 40 tests passed.
- `python scripts/devops.py check`: exit 1; Markdown passed, then Python reported `No module named ruff`.

The browser runner finished before this verdict was recorded.

## Defects
- D1, P1: Concurrent submissions bypass the busy guard in `src/js/form.js:123-135`.
  The guard precedes awaited validation, but the busy flag changes only afterward.
  Two submissions during asynchronous validation both reach `onSubmit`, potentially creating duplicate records.
  Reproduction: call `controller.submit()` twice before resolving a shared validator promise, then resolve it successfully.
  Observed: `onSubmit` ran twice.
- D2, P2: `createField` never creates `.field__status` in `src/js/field.js:267-321`.
  Consequently, `setPending('Checking.')` and `setValid('Available.')` silently omit their visible text and icons.
  Async validators cannot show the required pending and valid states on created fields.
  Reproduction: create a field, call each method, and query `.field__status`.
  Observed: both queries returned null.
- D3, P1: Editing during pending validation does not invalidate the old result in `src/js/field.js:216-221`.
  `setPending` clears the error, so input events skip validation and leave the generation counter unchanged.
  The old response then marks the new value valid or invalid without checking it.
  Reproduction: validate `old`, change the control to `new`, dispatch input, then resolve the old validator.
  Observed: the field displayed `Old value taken` for the current value `new`.
  A stale success can likewise permit submission of a value that was never validated.

The read-only reproduction used `node --input-type=module`, happy-dom, and the actual exported controllers.
It initialized the sprite URL and exited 0 with this output:

```text
Created pending status: null
Created valid status: null
Concurrent submit sends: 2
Error after editing pending value: Old value taken current value: new
```

## Process Gaps
- The recorded red and green evidence and screenshot artifacts exist.
- Existing tests cover stale results after a newer validation, but omit edits without a subsequent blur.
- Existing form tests prevent resubmission during sending, but omit resubmission during validation.
- Existing state tests use supplied markup, leaving created-field status support untested.
- Full-check reproduction remains blocked by missing local Ruff; this is an environment limitation, not an implementation defect.

## Required Rework
- Add failing regression tests for D1-D3 before changing production code.
- Guard the complete submit operation, including validation, and release the guard on every completion or failure path.
- Create the hidden status line before attaching created fields; verify pending and valid text, icons, and described-by wiring.
- Invalidate pending results when values change; prevent submission until the current values have passed validation.
- Rerun unit tests, affected browser tests, and the full check with required tooling available.
- Record exact commands, exit codes, and output in the validation evidence.
