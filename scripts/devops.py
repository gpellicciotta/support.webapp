#!/usr/bin/env python3
"""Run repository checks and local development through support-python's DevopsCli.

Install the tools first, as docs/devops.md describes.

Usage:
  python scripts/devops.py lint | format | check
  python scripts/devops.py release [--dry-run] [--skip-checks] [--yes]
  python scripts/devops.py help [--verbose] | version
"""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VENV_DIR = REPO_ROOT / ".venv"
VENV_PYTHON = VENV_DIR / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")

if __name__ == "__main__" and VENV_PYTHON.is_file() and Path(sys.prefix).resolve() != VENV_DIR.resolve():
    sys.exit(subprocess.run([str(VENV_PYTHON), str(Path(__file__).resolve()), *sys.argv[1:]], check=False).returncode)

from support_python.devops import DevopsCli, NodeProject, resolve_executable  # noqa: E402


class WebProject(NodeProject):
    """Run JavaScript and documentation checks through the shared Node adapter."""

    def lint(self) -> bool:
        """Check Markdown offline and JavaScript formatting."""
        return (
            self.markdown("check")
            and self.run_command([sys.executable, "-m", "ruff", "check", "scripts", "tests"])
            and self.run_command([sys.executable, "-m", "ruff", "format", "--check", "scripts", "tests"])
            and super().lint()
        )

    def format(self) -> bool:
        """Repair Markdown and JavaScript formatting."""
        return (
            self.markdown("fix")
            and self.run_command([sys.executable, "-m", "ruff", "check", "--fix", "scripts", "tests"])
            and self.run_command([sys.executable, "-m", "ruff", "format", "scripts", "tests"])
            and super().format()
        )

    def test(self, selection=()) -> bool:
        """Run the Python tooling tests and the selected JavaScript unit tests."""
        return self.run_command([sys.executable, "-m", "pytest"]) and super().test(selection)

    def markdown(self, action: str) -> bool:
        """Run the shared Markdown tool without external link requests."""
        return self.run_command([resolve_executable("lint-markdown") or "lint-markdown", action, "--offline"])

    def build(self) -> bool:
        """Validate the source package without generating or copying assets."""
        return self._npm("pack", "--dry-run")


def build_cli(root: Path = REPO_ROOT) -> DevopsCli:
    """Create the shared CLI with test and local server actions."""
    project = WebProject(root)
    cli = DevopsCli(
        project, description="Run tests, checks, packaging validation, releases, and the local server with serve."
    )
    cli.add_action(
        "tests",
        "run unit tests, or browser tests with --slow",
        cli._test,
        configure_parser=lambda parser: (
            parser.add_argument("--slow", action="store_true"),
            parser.add_argument("selection", nargs="*"),
        ),
    )

    def serve(args, logger) -> int:
        """Serve the web root until interrupted."""
        project.logger = logger
        return 0 if project._npm("run", "serve", "--", "--port", str(args.port)) else 1

    cli.add_action(
        "serve",
        "serve src/ on localhost",
        serve,
        configure_parser=lambda parser: parser.add_argument("--port", type=int, default=4173),
    )
    return cli


if __name__ == "__main__":
    sys.exit(build_cli().run())
