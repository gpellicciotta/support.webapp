# Webapp Support
A shared visual design system and templates for web apps.

---

## Purpose
- Document every aspect of a design: tokens, components, patterns, and app shells.
- Offer several looks on one shared token contract, and add looks over time.
- Generate the boilerplate of a new web app from a chosen look and shell.
- Let existing apps pick up design improvements through versioned releases.

---

## Status
The project is building phase 1 of the [roadmap](docs/roadmap.md): base tokens, the neutral look, and the command line tool.
[PLAN.md](PLAN.md) lists the current tasks.

---

## Releases
Each GitHub release publishes `@gpellicciotta/support.webapp` to GitHub Packages.
Apps copy one pinned release into their web root with the `vendor` command; they never copy files by hand.
See [Versioning and Releasing](docs/devops.md#versioning-and-releasing) for the release flow and registry token setup.

See [requirements.md](docs/requirements.md) for scope and [index.md](docs/index.md) for all documentation.

---

## Guidelines
This project follows the cross-project [dev-guidelines](https://github.com/gpellicciotta/dev-guidelines).
