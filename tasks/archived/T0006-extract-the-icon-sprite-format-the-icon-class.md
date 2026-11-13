---
id: T0006
owner: "@claude"
session: claude-20261112-6cbc6f
needs: []
branch: task/T0006-extract-the-icon-sprite-format-the-icon-class
worktree: .plan/work/T0006-extract-the-icon-sprite-format-the-icon-class
status: completed
started_at: "2026-11-12T10:49:45Z"
ended_at: "2026-11-12T11:02:47Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1187.2, input: 220, output: 73660, cache_read: 11516618, cache_write: 280216}
  review: {turns: 2, duration_s: 327.0, input: 64, output: 15642, cache_read: 1729768, cache_write: 113170}
review_status: approved
review_round: 1
reviewed_by: "@claude-2"
work_duration: 781.2
completion-commit: 73aaa9d7365afca920822f743e60431f2bcdcfdb
---
# T0006: Extract the icon sprite format, the icon class, and the createIcon builder, with the neutral glyph set.

## Goals
Extract the icon system of todos.webapp, as [ADR-0002](../../../docs/adrs/ADR-0002-looks.md) and [ADR-0003](../../../docs/adrs/ADR-0003-components-and-patterns.md) define it.
Fix the core icon id list that every look sprite must provide.
Add the `.icon` class, the `createIcon` builder module, and the `neutral` look sprite.
Show every glyph in the gallery and check every sprite reference in the browser.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0002, ADR-0003, and the todos.webapp sprite and builder at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the icon class, builder module, todos sprite, core id list, and gallery section.
- [x] **[Verify]**    Run the icon tests and the verifier until both pass.
- [x] **[Visual]**    Capture the gallery icon section per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0002, ADR-0003, and todos.webapp sprite and spriteIcon at commit 0cf4981; todos ids lack the icon- prefix and no help glyph exists.

- [2026-11-12] **[Verify]**
  Recorded failing icon unit tests, the gallery sprite swap test, and the verifier sprite checks in validation-proof.md.

- [2026-11-12] **[Implement]**
  Added the icon class, createIcon with setSpriteUrl and the spriteIcon alias, the neutral sprite with icon-help, icon-chevron-down as a core id, and the gallery Icon section.

- [2026-11-12] **[Decided]**
  createIcon throws until setSpriteUrl runs, since a default path renders blank or wrong-look icons silently; the core list adds icon-chevron-down for disclosure toggles.

- [2026-11-12] **[Verify]**
  Icon unit tests, the verifier, and python scripts/devops.py check pass; output is in validation-proof.md.

- [2026-11-12] **[Visual]**
  Captured the gallery before and after per theme at 390 and 1440 px; see validation-proof.md.

- [2026-11-12] **[Doc]**
  Size note: 9 counted files and 189 lines cross the typical line by one file; technical-spec.md records why the task stays whole.

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 9.
  - Lines touched: 189.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 approved by @claude-2: The work meets every goal in the task.
  - Findings: [review-findings-1.md](T0006-extract-the-icon-sprite-format-the-icon-class/review-findings-1.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

