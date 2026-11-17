# Validation proof

- Search `todos.webapp|family-portal|meteo|8937c32|0cf4981` in src/: no matches. Feather MIT notice kept.
- `python scripts/devops.py check` in worktree: unit, e2e, and look checks passed; 3 generate-app integration tests failed with ERR_MODULE_NOT_FOUND for @stylistic/eslint-plugin, because the worktree node_modules lacks it.
- `npx vitest run --config vitest.integration.config.js` in main checkout: 3 files, 7 tests passed.

## Output

```text
$ grep -rniE "todos\.webapp|family-?portal|meteo|8937c32|0cf4981" src
(no matches)
$ npx vitest run --config vitest.integration.config.js   (main checkout)
 Test Files  3 passed (3)
      Tests  7 passed (7)
```

## Round 2 verification

Repair: worktree node_modules held only caches; replaced with a junction to the main checkout node_modules.

```text
$ python scripts/devops.py check
exit code: 0
All 26 markdown files passed linting.
All checks passed!
======================== 41 passed, 1 skipped in 2.25s ========================
 Test Files  33 passed (33)
      Tests  2130 passed (2130)
  ✓   48 [desktop-light] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.1s)
  ✓  236 [desktop-dark] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.0s)
  ✓  424 [mobile-light] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (2.2s)
  ✓  612 [mobile-dark] › tests\e2e\form.spec.js:4:1 › a failed submit by Enter fills the error summary, announces it, and focuses it (1.9s)
  724 passed (7.6m)
 Test Files  3 passed (3)
      Tests  7 passed (7)
```
