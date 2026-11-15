# {{app-title}}
{{app-title}} is a web app built on the support.webapp design system, served from `src/` without a build step.
See [README.md](README.md), [requirements.md](docs/requirements.md), and [devops.md](docs/devops.md).

## Commands
- Bootstrap: `python scripts/bootstrap-dev-environment.py`.
- Run fast tests: `python scripts/devops.py tests`.
- Run browser tests: `python scripts/devops.py tests --slow`.
- Start the server: `python scripts/devops.py serve --port 4173`.
- Run all checks before completing a task:
  ```bash
  python scripts/devops.py check
  ```

## Architecture
- [src/](src/): the web root, with the shell in `index.html` and the service worker.
- [src/css/](src/css/): `style.css`, the only stylesheet pages link, and the app's partials.
- [src/js/](src/js/): `main.js`, the app entry point.
- [src/vendor/design/](src/vendor/design/): the vendored design system; never edit it by hand.
- [tests/](tests/): Vitest unit tests and Playwright browser tests.
- [scripts/](scripts/): the bootstrap and devops scripts, with the pinned support.python requirement.

## Project Conventions
- Use semantic tokens of the design system in app styles; app tokens live in `src/css/tokens.css`.
- List every app token and component in the [visual style guide](docs/specs/visual-style-guide.md).
- Upgrade the design system only with its `vendor` command, as [devops.md](docs/devops.md) describes.

## Boundaries
- Never edit files under `src/vendor/design/`; the conformance check fails on any change.
