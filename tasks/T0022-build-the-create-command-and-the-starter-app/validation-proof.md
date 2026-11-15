## Walkthrough & Validation
Sources: todos.webapp `v0.5.0` at `d6e46d5`, family-portal `v0.6.0` at `46af159`, and the shell skeletons of components.md.

Key changes:
- `scripts/generate_app.py` and the `generate-app` action of `scripts/devops.py`.
- `template/`: the starter app with shell areas, service worker, offline page, gallery, docs, scripts, CI, and tests.
- `tests/test_generate_app.py` and `tests/integration/generate-app.test.js`.

The 2026-11-13 prerequisite inspection was superseded: both adoptions are released and their tasks are completed.

### Red Phase
Command: `python -m pytest tests/test_generate_app.py -q`, exit code 1.

```text
E   FileNotFoundError: [Errno 2] No such file or directory: 'C:\\Dev-Projects\\support.webapp\\scripts\\generate_app.py'
=========================== short test summary info ===========================
ERROR tests/test_generate_app.py - FileNotFoundError: [Errno 2] No such file ...
[... 6 identical lines omitted ...]
8 errors in 1.69s
```

Command: `npx vitest run --config vitest.integration.config.js tests/integration/generate-app.test.js`, exit code 1.

```text
 FAIL  tests/integration/generate-app.test.js > generates a neutral app that passes its own checks and the conformance check
 FAIL  tests/integration/generate-app.test.js > generates a warm app that passes its own checks and the conformance check
 FAIL  tests/integration/generate-app.test.js > generates a bright app that passes its own checks and the conformance check
AssertionError: **[ERROR]** Unknown subcommand: 'generate-app'
            Usage: devops {help|version|lint|format|test|build|check|clean|versions|release|tests|serve} [options]
: expected 2 to be +0 // Object.is equality
[... 14 lines omitted ...]
 Test Files  1 failed (1)
      Tests  3 failed (3)
```

### Green Phase
Command: `python -m pytest tests/test_generate_app.py -q`, exit code 0.

```text
.............................                                            [100%]
29 passed in 2.51s
```

Command: `npx vitest run --config vitest.integration.config.js tests/integration/generate-app.test.js`, exit code 0.

```text
 RUN  v5.1.0 C:/Dev-Projects/support.webapp

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Duration  42.85s (tests 100%)
```

### Generated App Check
Commands, run in the scratchpad with a `node_modules` junction to this repository, exit code 0 each:

```text
python scripts/devops.py generate-app sample-todos --look neutral --nav sidebar --nav bottom --action-bar --side-panel -o {{scratchpad}}/sample-todos
python scripts/devops.py check
```

Excerpt of the generated app's check output:

```text
**[WARN]**  Version 0.1.1-pre is a pre-release; generate production apps from a release tag checkout.
All 8 markdown files passed linting.
All checks passed!
> eslint .
> node src/vendor/design/bin/check.mjs
integrity: PASS
conformance: PASS
 Test Files  2 passed (2)
      Tests  3 passed (3)
Running 20 tests using 4 workers
  20 passed (9.6s)
No build step: src/ is the web root.
```

### Completion Check
Command: `python scripts/devops.py check`, exit code 0.

```text
All 25 markdown files passed linting.
All checks passed!
6 files already formatted
============================= 32 passed in 1.83s ==============================
 Test Files  29 passed (29)
      Tests  2108 passed (2108)
Running 624 tests using 4 workers
  2 skipped
  622 passed (4.0m)
> vitest run --config vitest.integration.config.js
 Test Files  3 passed (3)
      Tests  7 passed (7)
   Duration  44.92s (tests 100%)
npm notice filename: gpellicciotta-support.webapp-0.1.1-pre.tgz
npm notice total files: 103
```

The two skips are the existing wide-layout-only shell checks at 390 px.

### Visual Verification
The generated apps' smoke test captured these screenshots with zero console errors and failed requests.
The template is new, so the before images are the source shell demos it copies, linked from the task log.

| Setup                                     | Desktop light                                       | Desktop dark                                      | Mobile light                                       | Mobile dark                                      |
| :---------------------------------------- | :-------------------------------------------------- | :------------------------------------------------ | :------------------------------------------------- | :----------------------------------------------- |
| Neutral, sidebar and bottom, side panel   | [png](generated-todos-desktop-light.png)            | [png](generated-todos-desktop-dark.png)           | [png](generated-todos-mobile-light.png)            | [png](generated-todos-mobile-dark.png)           |
| Warm, breadcrumb, footer                  | [png](generated-portal-desktop-light.png)           | [png](generated-portal-desktop-dark.png)          | [png](generated-portal-mobile-light.png)           | [png](generated-portal-mobile-dark.png)          |
| Bright, menu, narrow width                | [png](generated-toolbar-desktop-light.png)          | [png](generated-toolbar-desktop-dark.png)         | [png](generated-toolbar-mobile-light.png)          | [png](generated-toolbar-mobile-dark.png)         |

### Review Round 1 Fixes
The agent review approved and reported non-blocking findings; these were fixed:
- Titles and owners with quotes, backslashes, `<`, `>`, `&`, braces, or control characters now exit 2.
- Misspelled placeholders with capitals, such as `{{App-name}}`, now fail the generation.
- The template menu carries `role="menu"` and `popover`, as the menu skeleton requires.
- The app folder gets mode 0755 before the rename; the docs no longer claim created parent folders vanish.

Command: `python -m pytest tests/test_generate_app.py -q`, before the fixes, exit code 1.

```text
FAILED tests/test_generate_app.py::test_rejects_title_and_owner_characters_that_break_json_html_or_python[overrides1]
FAILED tests/test_generate_app.py::test_fill_rejects_misspelled_placeholders
FAILED tests/test_generate_app.py::test_rejects_title_and_owner_characters_that_break_json_html_or_python[overrides0]
FAILED tests/test_generate_app.py::test_rejects_title_and_owner_characters_that_break_json_html_or_python[overrides4]
FAILED tests/test_generate_app.py::test_menu_markup_follows_the_menu_skeleton_before_scripts_run
FAILED tests/test_generate_app.py::test_rejects_title_and_owner_characters_that_break_json_html_or_python[overrides2]
FAILED tests/test_generate_app.py::test_rejects_title_and_owner_characters_that_break_json_html_or_python[overrides3]
7 failed, 31 passed, 1 skipped, 1 warning in 1.91s
```

Command: `python scripts/devops.py check`, after the fixes, exit code 0.

```text
All 25 markdown files passed linting.
All checks passed!
6 files already formatted
======================== 41 passed, 1 skipped in 1.94s ========================
 Test Files  29 passed (29)
      Tests  2108 passed (2108)
  2 skipped
  622 passed (4.0m)
 Test Files  3 passed (3)
      Tests  7 passed (7)
npm notice total files: 103
```

The pytest skip is the POSIX-only folder mode test on Windows.

Open, non-blocking:
- One-sided navigation, such as `--nav sidebar` alone, is allowed by ADR-0004 and stays without a warning.
- The generated CI needs the committed `package-lock.json` that bootstrap writes, as the generated devops.md states.
- Template files are UTF-8 text; a binary template file would need a byte copy.
