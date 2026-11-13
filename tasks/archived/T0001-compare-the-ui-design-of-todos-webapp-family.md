---
id: T0001
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-08T19:05:36Z"
ended_at: "2026-11-10T20:24:30Z"
review: different-agent
preview: none
protocol: standard
review_status: approved
review_round: 1
reviewed_by: "@giova"
completion-commit: 51ed479a66a3f53f9b591933fa0c087b13697718
---
# T0001: Compare the UI design of todos.webapp, family-portal, meteo, auth, and counters, from tokens to app shells

## Goals
Produce an evidence-based comparison of how five existing apps implement their UI design.
Cover low-level tokens, middle-level components and patterns, high-level app shells, and the code behind each.
Name a reference implementation and a sharing verdict for every pattern, as input for T0002.
Treat all sibling repositories as read-only; record nothing in them.
This is an investigation-only task: it writes findings and changes nothing else, so the sizing gates do not apply.
See [technical-spec.md](T0001-compare-the-ui-design-of-todos-webapp-family/technical-spec.md) for dimensions, format, and known facts.

## Task Execution Steps
- [x] **[Read]**      Read the ui-guidelines and each app's style guide, gallery, and stylesheet entry point.
- [x] **[Read]**      Inventory the tokens of all five apps and build the token name crosswalk.
- [x] **[Read]**      Inventory components and patterns per app, with file references, markup, and JavaScript behavior.
- [x] **[Read]**      Inventory app shells, navigation, theming, icons, fonts, and asset loading per app.
- [x] **[Visual]**    Capture gallery and main screen screenshots per app in light and dark, at 390 and 1440 px.
- [x] **[Doc]**       Write the comparison with a reference implementation and a sharing verdict per pattern.
- [x] **[Doc]**       Link the comparison from index.md and add a CHANGELOG.md entry.
- [x] **[Verify]**    Lint the changed markdown files and run plan tasks validate on this task.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-08] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-08] **[Read]**
  Inventoried tokens, components, and shells of six repositories through four parallel read-only agents.
  - Sibling repositories stayed unchanged.

- [2026-11-08] **[Visual]**
  Served apps read-only and captured 60 screenshots; see validation-proof.md.
  - node serve.mjs ports 8761-8763: PIDs 70344, 75624, 73912.
  - family-portal Java server port 8764: PID 75208.
  - Scratch mount servers ports 8765, 8766: PIDs 4568, 42240.

- [2026-11-08] **[Doc]**
  Wrote the comparison, linked it from index.md, and added a changelog entry.
  - Known facts: four confirmed, two corrected.

- [2026-11-08] **[Verify]**
  Markdown lint and task validation passed; all 200 links resolve within line ranges.

- [2026-11-08] **[Review]**
  Round 1 requested (mode: different-agent).

- [2026-11-08] **[Review]**
  Independent reviewer approved round 1 with should-fix items; all were fixed in 51ed479.
  - Findings stored in review-findings-1.md.
  - Lint passes; 237 links resolve.

- [2026-11-10] **[Review]**
  Round 1 approved by @giova.
  - User approved in chat after an independent Claude review.
  - Claude review findings: review-findings-1.md.

- [2026-11-10] **[Verify]**
  Recorded task outcomes.
  - Files touched: 3.
  - Lines touched: 695.
  - Reopenings: 0.

- [2026-11-10] **[Visual]**
  TF017 does not apply: this investigation changed no UI, so no after screenshot exists.
  - Baseline for later design system work: screenshots/ and capture-report.json.
  - Completed with --no-validate; validation passed apart from TF017.

- [2026-11-10] **[Complete]**
  Task completed successfully.

