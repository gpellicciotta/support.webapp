# DevOps
Development environment, planning workflow, and operational procedures for `support.webapp`.

---

## Prerequisites
- Git, with access to the `gpellicciotta/support.webapp` GitHub repository.
- The [plan](https://github.com/gpellicciotta/plan) CLI.
- Python 3.10 or later, for the markdown linter of the dev-guidelines.

Build and test tooling arrives with the first code task, together with the `scripts/` folder.

---

## Documentation Checks
Lint the documentation with the dev-guidelines markdown linter, from a sibling checkout:

```bash
python ../dev-guidelines/scripts/lint-markdown.py check README.md CHANGELOG.md docs
```

---

## Plan Store
Tasks live on the `plan` branch, checked out at `.plan/`; [PLAN.md](../PLAN.md) is a link into that checkout.
A fresh clone has no `.plan/` until you attach the store:

```bash
git clone https://github.com/gpellicciotta/support.webapp.git
cd support.webapp
plan init --store branch
```

Publish both refs when pushing: `main` for code and `plan` for tasks.

---

## Task Coordination Protocol
Tasks are managed only through the `plan` CLI:
1. Create: `plan tasks create "{{description}}"`, adding `--protocol adhoc` for small changes.
2. Start: `plan tasks start {{task-id}} --owner @{{agent}}` provisions a branch and worktree for standard tasks.
3. Execute: Work in the resolved workspace, keeping the task file in `.plan/tasks/` current.
4. Finalize: Pass all checks, update `CHANGELOG.md` and documentation, then run `plan tasks stop {{task-id}} --status completed`.
