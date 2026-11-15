#!/usr/bin/env python3
"""Run the checks and local development of {{app-title}} through support-python's DevopsCli.

Install the tools first with scripts/bootstrap-dev-environment.py, as docs/devops.md describes.

Usage:
  python scripts/devops.py lint | format | tests [--slow] | check
  python scripts/devops.py serve [--port PORT]
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


class WebApp(NodeProject):
    """Run the documentation, script, JavaScript, and design checks of a web app without a build step."""

    def lint(self) -> bool:
        """Check Markdown offline, the Python scripts, JavaScript formatting, and design conformance."""
        return (
            self.markdown("check")
            and self.run_command([sys.executable, "-m", "ruff", "check", "scripts"])
            and self.run_command([sys.executable, "-m", "ruff", "format", "--check", "scripts"])
            and super().lint()
            and self._npm_script("check:design")
        )

    def format(self) -> bool:
        """Repair Markdown, Python, and JavaScript formatting."""
        return (
            self.markdown("fix")
            and self.run_command([sys.executable, "-m", "ruff", "check", "--fix", "scripts"])
            and self.run_command([sys.executable, "-m", "ruff", "format", "scripts"])
            and super().format()
        )

    def markdown(self, action: str) -> bool:
        """Run the shared Markdown tool without external link requests."""
        return self.run_command([resolve_executable("lint-markdown") or "lint-markdown", action, "--offline"])

    def build(self) -> bool:
        """Report that the web root is served as it is, with no build step."""
        self.logger.info("No build step: src/ is the web root.")
        return True


def build_cli(root: Path = REPO_ROOT) -> DevopsCli:
    """Create the shared CLI with test and local server actions."""
    project = WebApp(root)
    cli = DevopsCli(project, description="Run the checks, tests, releases, and the local server of {{app-title}}.")
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
