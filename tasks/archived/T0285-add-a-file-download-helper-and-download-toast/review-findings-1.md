---
task: T0285
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T20:40:27Z
reviewed_commit: "c6021eb"
base_commit: "d5d4837"
branch: task/T0285-add-a-file-download-helper-and-download-toast
session: claude-20261123-081379
session_agent: claude-code
session_created_at: 2026-11-23T20:30:16Z
---
# Review Findings: Task T0285 (Round 1)

## Summary
Approved. The work meets every goal and acceptance criterion in the technical specification.
- `downloadJson` matches Auth's `saveJson`: two-space JSON, a trailing newline, a hidden temporary `a[download]`, and revocation after 1000 ms.
- `createToast().show(message, { download })` makes the toast persistent and labels its button `data-toast-action="download"`.
  The action ignores Ctrl+Z and keeps the URL until dismissal.
  Dismissal revokes immediately; an action click revokes after the delay; `destroy()` flushes pending revocations.
- Unit tests cover create, click, revoke, idempotent revoke, and anchor removal on a throwing click.
  They also cover dismissal by action, `dismiss()`, Escape, overflow, timeout, `destroy()`, and a toast held behind a modal.
- Browser tests confirm both gallery buttons download the named file in all four projects.
- The contract entry, components.md section and upgrade note, ADR-0003 decision, and CHANGELOG entry are present.
- Reviewer rerun of `python scripts/devops.py check` on `c6021eb` exited 0.
  - Lint passed: Markdown (28 files), Ruff, and ESLint.
  - pytest: 61 passed, 1 skipped.
  - Vitest: 45 files, 2334 tests passed.
  - Playwright: 970 passed, 42 skipped.
  - Integration: 7 passed. `npm pack --dry-run` succeeded.

## Defects
None.

## Process Gaps
Non-blocking:
1. The gallery's download toast region sits in `.card-specimens`, not `.toast-frame`.
   So the fixed region is not contained, and the toast floats at the viewport bottom over the Avatar section.
   `after-gallery-light.png` shows this, and the `.card-specimens` wrapper renders as an empty grid.
   The Toast section's working demo uses `.toast-frame` to keep toasts inside the section.
2. `createFileDownload` and the toast `download` setting read source objects with `url`, `json`, `blob`, or `filename` keys as descriptors.
   Example: `createFileDownload({ url: 'https://x', id: 1 }, 'a.json')` downloads the URL instead of serializing the object.
   `downloadJson` and `downloadFile` are not affected because they wrap the value first.
   Either document that raw values must be wrapped as `{ json }`, or accept only descriptors.
3. The toast revokes caller-supplied `blob:` URLs by default, unless the descriptor passes `revoke: false`.
   Only the tests and code show this; components.md never states it.
4. `downloadUrl` is exported and described in components.md's bullets, but the "Identity and Foundations" table row leaves it out.
5. The work grew past the estimate: `file-download.js` is 235 lines against a 66-line source and an 80-line estimate.
   It also touched 2 undeclared files, which the Execution Log records.

## Required Rework
None.
