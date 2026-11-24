## Walkthrough & Validation

Command: `python scripts/devops.py check` (exit code: 0)

```text
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\Scripts\lint-markdown.EXE check --offline
All 28 markdown files passed linting.
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff check scripts tests
All checks passed!
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m ruff format --check scripts tests
9 files already formatted
Command: "C:\Program Files\nodejs\npm.CMD" run lint
> eslint .
Command: C:\Users\giova\AppData\Local\Programs\Python\Python315\python.exe -m pytest
61 passed, 1 skipped in 30.68s
Command: "C:\Program Files\nodejs\npm.CMD" test
 Test Files  62 passed (62)
      Tests  2585 passed (2585)
Command: "C:\Program Files\nodejs\npm.CMD" run test:slow
  48 skipped
  1152 passed (10.3m)
Command: "C:\Program Files\nodejs\npm.CMD" run test:integration
 Test Files  3 passed (3)
      Tests  7 passed (7)
Command: "C:\Program Files\nodejs\npm.CMD" pack --dry-run
npm notice total files: 141
```

### Visual Evidence
- File download: [before](before-file-download-desktop-light.png), [after desktop light](after-file-download-desktop-light.png), [after mobile dark](after-file-download-mobile-dark.png)
- Switch: [before](before-switch-desktop-light.png), [after](after-switch-desktop-light.png)
- Checkbox: [before](before-checkbox-desktop-light.png), [after](after-checkbox-desktop-light.png)
- Button: [before](before-button-desktop-light.png), [after desktop light](after-button-desktop-light.png), [after mobile dark](after-button-mobile-dark.png)
