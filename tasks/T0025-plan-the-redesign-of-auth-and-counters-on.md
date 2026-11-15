---
id: T0025
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-15T20:48:30Z"
ended_at: "2026-11-15T21:20:22Z"
review: agent
preview: none
protocol: standard
review_status: approved
review_round: 1
review_requested_at: "2026-11-15T20:59:34Z"
reviewed_by: "@claude"
review_session: claude-20261115-bc542f
completion-commit: 9794f21ccee4d316814790e02ac73678eb29f50d
---
# T0025: Plan the redesign of auth on the design system, with the neutral look and a console like ToDo's

## Goals
Plan the redesign of auth on the `neutral` look and the shell, retiring its support.js styles.
Rebuild its Admin Console after ToDo's console in todos.server's `admin/` folder.
Follow [ADR-0004](../../docs/adrs/ADR-0004-app-shell.md), [ADR-0002](../../docs/adrs/ADR-0002-looks.md), and the roadmap.
The user restricted this task to auth on 2026-11-15; T0046 plans counters.

## Task Execution Steps
- [x] **[Read]**      Read the roadmap, ADR-0002, ADR-0004, auth's interface, and ToDo's Admin Console.
- [x] **[Decide]**    Agree the console's placement, widths, dropped extras, and scope with the user.
- [x] **[Doc]**       Write the redesign plan, its look, and the sibling backlog tasks to propose.
- [x] **[Verify]**    Run the Markdown lint and the full check suite.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-15] **[Decided]**
  User restricted the task to auth and chose the neutral look and a separate desktop console.
  - Recycle Bin, Workbench, and PWA controls dropped.
  - Every other auth screen moves to the look and shell.

- [2026-11-15] **[Doc]**
  Wrote the auth redesign plan and linked it from the roadmap, ADR-0004, and the index.

- [2026-11-15] **[Verify]**
  Offline Markdown lint and the full check suite passed.

- [2026-11-15] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-15] **[Review]**
  In-session reviewer rejected round 1; all 13 verified findings were fixed in the plan.
  - Findings in in-session-review.md.
  - Gate verdict needs plan agents review.

- [2026-11-15] **[Verify]**
  Recorded task outcomes.
  - Files touched: 3.
  - Lines touched: 24.
  - Reopenings: 0.

- [2026-11-15] **[Review]**
  Round 1 approved by @claude: Approved.
  - Findings: [review-findings-1.md](T0025-plan-the-redesign-of-auth-and-counters-on/review-findings-1.md).

- [2026-11-15] **[Complete]**
  Task completed successfully.

