# DevOps
Development environment, versioning, planning workflow, and operational procedures for `support.webapp`.

---

## Development Environment
### Prerequisites
- Git, with access to the `gpellicciotta/support.webapp` GitHub repository.
- Python 3.9 or later, to install the tools below.
- The [plan](https://github.com/gpellicciotta/plan) CLI, for tasks and the plan store.
- [support.python](https://github.com/gpellicciotta/support.python) v3.1.0 or later, which provides `lint-markdown`.

Build and test tooling arrives with the first code task, together with the `scripts/` folder.

### Setup
Install the tools, preferably into a virtual environment:

```bash
python -m pip install "git+https://github.com/gpellicciotta/plan.git" "git+https://github.com/gpellicciotta/support.python.git@v3.1.0"
```

Check the documentation before completing a task:

```bash
lint-markdown check --offline
```

`--offline` skips external link checks, since links to private repositories fail without credentials.
Run `lint-markdown help --verbose` for the rule list, and `lint-markdown fix` to repair formatting.

---

## Versioning and Releasing
### Updating Versions
- The top `## v{{version}}-pre` heading in [CHANGELOG.md](../CHANGELOG.md) is the only version source until the package manifest arrives.
- `plan tasks stop {{task-id}} --status completed` raises the patch number for every completed task.
- Never edit the patch number yourself.
- Rename the heading to bump the minor or major version, as the change management guidelines require.

### Making a Release
The release commit carries no `-pre` heading; the next `-pre` heading gets its own commit.
Publishing the package arrives with the publish workflow task.
1. Run the checks on a clean, up-to-date `main`:
   ```bash
   git switch main
   git pull --ff-only
   git status --short
   lint-markdown check --offline
   ```
2. Replace the `-pre` suffix of the top heading in [CHANGELOG.md](../CHANGELOG.md) with `[released: {{yyyy-mm-dd}}]`.
3. Commit only that change:
   ```bash
   git add CHANGELOG.md
   git commit -m "Released v{{version}}."
   ```
4. Tag the commit, then push both after confirming with the owner:
   ```bash
   git tag -a v{{version}} -m "Released v{{version}}."
   git push --atomic origin main v{{version}}
   ```
5. Add a `## v{{next-patch-version}}-pre` heading above the released one, and commit it:
   ```bash
   git add CHANGELOG.md
   git commit -m "Started v{{next-patch-version}}-pre."
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
