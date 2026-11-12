---
task: T0008
round: 2
verdict: rejected
reviewer: "@codex"
reviewed_at: 2026-11-12T15:08:31Z
reviewed_commit: "dd5e9db"
base_commit: "81bed64"
branch: task/T0008-extract-the-field-checkbox-and-radio-components-with
---
# Review Findings: Task T0008 (Round 2)

## Summary
**[Decided]** Rejected because submission can still send values that changed after their validation completed.
The round 1 duplicate-submit guard and created status line fixes pass their regression tests.
Reviewed the task, technical specification, execution log, evidence, history, and implementation against main.

Review commands:
- `npx vitest run tests/unit/field.test.js tests/unit/form.test.js`: exit 0; 26 tests passed.
- `npx playwright test tests/e2e/field.spec.js tests/e2e/form.spec.js --reporter=line`: exit 0; 44 tests passed.
- `python scripts/devops.py check`: exit 1; Markdown passed, then Python reported `No module named ruff`.

The browser runner, identifier 89917, finished before recording this verdict; its managed server PID was 40584.
Recorded implementation evidence also shows a successful full check using the plan environment interpreter.

## Defects
- D1, P1: Form validation results become stale before submission in `src/js/form.js:130-143`.
  `Promise.all` retains each completed result while other fields validate; `FormData` later reads the current controls.
  Editing an already checked field does not invalidate that stored result.
  Reproduction: submit two valid fields, with required field A checked synchronously and field B awaiting a deferred validator.
  Clear A and dispatch `input`, then resolve B successfully.
  Observed: `submit()` resolves true and `onSubmit` receives an empty A although A fails native required validation.
  The same problem affects completed asynchronous checks while another field remains pending.
  Consequently, the round 1 requirement to prevent sending unchecked current values remains incomplete.

Read-only reproduction used `node --input-type=module`, happy-dom, and the actual exported controller; exit code 0:

```text
{"result":true,"sent":{"a":"","b":"ok"},"valid":false}
```

## Process Gaps
- Regression evidence exists for the previous findings, including failing-first output and passing browser checks.
- Current tests cover editing the pending field, but omit editing another field whose validation already completed.
- Full-check reproduction remains limited by missing Ruff in the default interpreter; this is an environment limitation.

## Required Rework
- Add a failing regression test using two fields, with an edit after one passes while the other remains pending.
- Add a browser scenario clearing the required address while the name check runs during submission.
- Ensure submitted values match successfully validated values across the entire form, including completed checks.
- Cancel or restart validation when relevant values change before data capture; never send an unchecked value.
- Rerun affected unit and browser checks and record exact commands, exit codes, and output.
