This project tracks its work with plan in `PLAN.md` and `.plan/tasks/`.
Load the `plan-task-usage-guidelines` skill before creating, starting, or changing tasks.
Change `PLAN.md` and task frontmatter only through `plan` commands.

# support.webapp
A shared visual design system and app starter for the sibling web apps.
The repository serves package sources directly and validates them with Vitest, Playwright, ESLint, Ruff, and Markdown lint.

See [README.md](README.md), [requirements.md](docs/requirements.md), and [devops.md](docs/devops.md).

## Commands
- Install the tools: see [Setup](docs/devops.md#setup).
- Bootstrap: `python scripts/bootstrap-dev-environment.py`.
- Run fast tests: `python scripts/devops.py tests`.
- Start the server: `python scripts/devops.py serve --port 4173`.
- Run all checks before completing a task:
  ```bash
  python scripts/devops.py check
  ```
- Release from a clean `main`: `python scripts/devops.py release --yes`.

## Architecture
- [src/](src/): the package web root, served directly without a build step.
- [tests/](tests/): fast unit tests and slow browser checks.
- [scripts/](scripts/): the devops script, with its pinned support.python requirement.
- [docs/adrs/](docs/adrs/): architecture decision records of the design system.
- [docs/analysis/](docs/analysis/): the UI design comparison of the sibling apps.
- [docs/roadmap.md](docs/roadmap.md): the adoption roadmap.

## Project Conventions
- Follow [dev-guidelines](https://github.com/gpellicciotta/dev-guidelines) v2.0.0.
- Never check `CHANGELOG.md` with `lint-markdown`; [.lint-markdown.json](.lint-markdown.json) excludes it.
- Pin support.python at `v3.1.0` in [requirements.txt](scripts/requirements.txt).

## Boundaries
- Keep package sources under `src/`; do not add a copy step without a build requirement.
