# T0002 Validation Proof

## Walkthrough & Validation
Documentation-only task: the applicable checks are the markdown linter, a link check, and the task file validator.
No automated test applies, since the task changes no code.

### Markdown Lint
Command: `lint-markdown check docs CHANGELOG.md`, from support.python v2.0.0, exit code 0.

```text
All 14 markdown files passed linting.
```

### Link and Anchor Check
A scratch script resolved every local link in the changed docs and the task files T0002 to T0027.
It also checked every heading anchor against the target file's headings.
The comparison document was skipped, since its sibling line anchors were checked in T0001.
Output, exit code 0:

```text
125 local links, 0 problems
```

The five web sources were fetched on 2026-11-11 and their quotes confirmed verbatim.
The MDN `light-dark()` page returned HTTP 404, so no ADR cites it.

### Task File Validation
Command: `plan tasks validate .plan/tasks/T0002-plan-the-design-system-from-the-comparison-architecture.md`, exit code 0.

```text
All 1 task file passed validation.
```

Command: `plan tasks validate`, exit code 1; the only issue is the known T0001 screenshot rule.

```text
Task files with issues:
- **NOT OK** T0001

Found 1 lint issue across 27 task files.
```

### Adversarial Review
An independent agent on a different model reviewed the ADRs, roadmap, and tasks, and requested changes.
Its 22 findings were addressed as follows:
- Fixed: T0009 gained a shared `focus.js`, since todos.webapp's dialog imports a popover helper.
- Fixed: ADR-0001 gained the missing todos.webapp tokens, a rule for filling look gaps, and the todos renames.
- Fixed: T0016 moved to phase 1, and T0026 and T0027 were added, so todos.webapp can adopt in one pass.
- Fixed: T0004 now declares `deprecated.css`, the font license, the look page, and the `_template` skip rule.
- Fixed: ADR-0004 no longer claims existing `:has()` use, and gained a skip link and the floating button.
- Fixed: ADR-0005 states the Node.js requirement, the self-contained check, the `design.json` fields, and how DS-10 is met.
- Fixed: T0013 demos all four adopter settings; T0025 needs the meteo tasks; sentences over 20 words were shortened.
- Kept: family-portal's fixed footer and a sticky action bar both stay visible at the bottom, so no change is listed.
- Kept: sizing notes on tasks above the typical line; every task stays below the large line.
