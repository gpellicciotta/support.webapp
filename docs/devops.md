# DevOps
Development environment, versioning, planning workflow, and operational procedures for `support.webapp`.

---

## Development Environment
### Prerequisites
- Git, with access to the `gpellicciotta/support.webapp` GitHub repository.
- Python 3.15 or later, to install the tools below.
- The [plan](https://github.com/gpellicciotta/plan) CLI, for tasks and the plan store.
- [support.python](https://github.com/gpellicciotta/support.python) v3.1.0 or later, which provides `lint-markdown`.

Build and test tooling arrives with the first code task.

### Setup
Install the tools, preferably into a virtual environment:

```bash
python -m pip install "git+https://github.com/gpellicciotta/plan.git" -r scripts/requirements.txt
```

The support.python pin lives only in [requirements.txt](../scripts/requirements.txt).

Check the documentation before completing a task:

```bash
python scripts/devops.py check
```

The check runs `lint-markdown check --offline`, which skips external link checks, since links to private repositories fail without credentials.
[.lint-markdown.json](../.lint-markdown.json) excludes `CHANGELOG.md`, which is never linted.
Run `python scripts/devops.py format` to repair formatting, and `lint-markdown help --verbose` for the rule list.

---

## Versioning and Releasing
### Updating Versions
- The top `## v{{version}}-pre` heading in [CHANGELOG.md](../CHANGELOG.md) is the only version source until the package manifest arrives.
- `plan tasks stop {{task-id}} --status completed` raises the patch number for every completed task.
- Never edit the patch number yourself.
- Rename the heading to bump the minor or major version, as the change management guidelines require.

### Making a Release
Release from a clean, up-to-date `main` with [devops.py](../scripts/devops.py).
Preview first, then release:

```bash
python scripts/devops.py release --dry-run
python scripts/devops.py release --yes
```

Without `--yes`, the script asks you to type `release v{{version}}`.
It stops before changing anything when the tree is dirty, `main` is behind `origin`, the tag exists, or the lint fails.
The release then:
1. Replaces the `-pre` suffix of the top heading with `[released: {{yyyy-mm-dd}}]` and commits it as `Released v{{version}}.`.
2. Tags the commit as `v{{version}}`, and pushes `main` and the tag together.
3. Adds a `## v{{next-patch-version}}-pre` heading, commits it as `Started v{{next-patch-version}}-pre.`, and pushes `main`.

Publishing the package arrives with the publish workflow task.

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
