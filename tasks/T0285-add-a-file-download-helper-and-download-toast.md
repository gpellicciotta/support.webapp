---
id: T0285
owner: "@gemini"
session: antigravity-20261123-c45dfa
needs: []
branch: task/T0285-add-a-file-download-helper-and-download-toast
worktree: .plan/work/T0285-add-a-file-download-helper-and-download-toast
status: active
started_at: "2026-11-23T20:00:55Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1750.6, input: 369186, output: 69577, cache_read: 17005138}
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T20:30:15Z"
---
# T0285: Add a file download helper and download toast actions, promoted from Auth's account export

## Goals
Add a file download helper that hands the viewer a JSON value or blob as a named file.
Let a persistent toast offer the file as its action, and revoke the object URL when the toast goes.
Auth's account export and admin console, and counters' account export, need it.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "File Download Helper", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 80 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the file download helper, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose key file-download with createFileDownload, downloadFile, downloadJson, downloadBlob, downloadUrl, plus settings.download in createToast.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures for unit (missing file-download.js) and browser tests (missing #file-download section).

- [2026-11-23] **[Implement]**
  Added file-download.js, toast.js download actions, contract entry, and gallery #file-download demo. Also touched undeclared src/demo/gallery.js and docs/adrs/ADR-0003-components-and-patterns.md (6 files, 124 lines; below typical line).

- [2026-11-23] **[Verify]**
  Verified lint, fast tests, integration suite, pack check, and Playwright tests; inspected before and after gallery screenshots.
  - Before: [before-gallery.png](T0285-add-a-file-download-helper-and-download-toast/before-gallery.png).
  - After: [after-gallery-light.png](T0285-add-a-file-download-helper-and-download-toast/after-gallery-light.png) and [after-gallery-dark.png](T0285-add-a-file-download-helper-and-download-toast/after-gallery-dark.png).
  - Files touched: 6.
  - Lines touched: 124.
  - Reopenings: 0.

- [2026-11-23] **[Read]**
  Reviewed technical-spec.md, the Auth audit section, ui.mjs saveJson, account-view.mjs export, and app-notices.mjs.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

