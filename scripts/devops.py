#!/usr/bin/env python3
"""Run repository checks and local development through support-python's DevopsCli.

Install the tools first, as docs/devops.md describes.

Usage:
  python scripts/devops.py lint | format | check
  python scripts/devops.py release [--dry-run] [--skip-checks] [--yes]
  python scripts/devops.py generate-app NAME --look LOOK [options] [-o FOLDER]
  python scripts/devops.py help [--verbose] | version
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
VENV_DIR = REPO_ROOT / ".venv"
VENV_PYTHON = VENV_DIR / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")

if __name__ == "__main__" and VENV_PYTHON.is_file() and Path(sys.prefix).resolve() != VENV_DIR.resolve():
    sys.exit(subprocess.run([str(VENV_PYTHON), str(Path(__file__).resolve()), *sys.argv[1:]], check=False).returncode)

sys.path.insert(0, str(Path(__file__).resolve().parent))

import generate_app  # noqa: E402
from support_python.devops import DevopsCli, NodeProject, resolve_executable  # noqa: E402
from support_python.devops.release import ReleasePipeline  # noqa: E402
from support_python.files import atomic_write_text  # noqa: E402

LOCKFILE_NAME = "package-lock.json"


LOCKFILE_VERSIONS = (
    # The top-level version, indented by two spaces like every top-level key.
    re.compile(r'^(  "version": ")[^"]*(")', re.MULTILINE),
    # The version of the root package, keyed by the empty path under "packages".
    re.compile(r'("packages": \{\s*"": \{[^{}]*?"version": ")[^"]*(")'),
)


def set_lockfile_version(root: Path, version: str) -> None:
    """Set both root versions of package-lock.json, leaving every other byte in place.

    Raises:
        ValueError: If the lockfile lacks either root version.
    """
    path = Path(root) / LOCKFILE_NAME
    text = path.read_bytes().decode("utf-8")
    for pattern in LOCKFILE_VERSIONS:
        text, count = pattern.subn(lambda match: f"{match.group(1)}{version}{match.group(2)}", text, count=1)
        if count != 1:
            raise ValueError(f"No root version to update in {LOCKFILE_NAME}.")
    data = json.loads(text)
    if data.get("version") != version or data.get("packages", {}).get("", {}).get("version") != version:
        raise ValueError(f"Could not set the root versions of {LOCKFILE_NAME} to {version}.")
    atomic_write_text(path, text, newline="")


class LockfileReleasePipeline(ReleasePipeline):
    """Release like ReleasePipeline, also setting the package-lock.json root versions with package.json."""

    def _plan(self, *args, **kwargs):
        """Follow each package.json version edit with the matching lockfile edit."""
        self._version_edits = {}
        steps = []
        for step in super()._plan(*args, **kwargs):
            steps.append(step)
            if step[0] in self._version_edits:
                steps.append(self._set_lockfile_version(Path(self.root), self._version_edits[step[0]]))
        return steps

    def _set_version(self, root, entry, name, version):
        """Remember which version each version file edit writes."""
        step = super()._set_version(root, entry, name, version)
        self._version_edits[step[0]] = version
        return step

    def _command(self, root, argv):
        """Stage the lockfile with the version file."""
        if argv[:2] == ["git", "add"]:
            argv = [*argv, LOCKFILE_NAME]
        return super()._command(root, argv)

    def _set_lockfile_version(self, root, version):
        """Return the step setting both lockfile root versions."""

        def action() -> bool:
            try:
                set_lockfile_version(root, version)
            except (OSError, ValueError) as exc:
                self.logger.error(f"Could not update {LOCKFILE_NAME}: {exc}")
                return False
            return True

        return f"edit {LOCKFILE_NAME}: root versions {version}", action


class WebDevopsCli(DevopsCli):
    """Run the shared CLI, releasing through the lockfile-aware pipeline."""

    def _release(self, args, logger) -> int:
        """Release with the same settings as DevopsCli, keeping package-lock.json in step."""
        self.project.logger = logger
        pipeline = LockfileReleasePipeline(
            root=self.project.root,
            logger=logger,
            quality_check=None if args.skip_checks else self.project.check,
            assets=self.project.release_assets,
            build=self.project.build,
            dry_run=args.dry_run,
            assume_yes=args.yes,
            runner=self.project.runner,
        )
        return pipeline.run()


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

    def test_slow(self, selection=()) -> bool:
        """Run the browser tests, then the pack-and-vendor integration test unless a selection is given."""
        return super().test_slow(selection) and (bool(selection) or self._npm_script("test:integration"))

    def markdown(self, action: str) -> bool:
        """Run the shared Markdown tool without external link requests."""
        return self.run_command([resolve_executable("lint-markdown") or "lint-markdown", action, "--offline"])

    def build(self) -> bool:
        """Validate the source package without generating or copying assets."""
        return self._npm("pack", "--dry-run")


def build_cli(root: Path = REPO_ROOT) -> DevopsCli:
    """Create the shared CLI with test and local server actions."""
    project = WebProject(root)
    cli = WebDevopsCli(
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
    cli.add_action(
        "generate-app",
        "generate a new web app from template/ with a look and shell options",
        generate_app.run_action,
        detail="Run from a checkout at a release tag; the app gets this version's vendored design files.",
        usage_suffix="NAME --look LOOK [--scroll main|page] [--nav NAV]... [--width WIDTH] [options] [-o FOLDER]",
        configure_parser=generate_app.configure_parser,
    )
    return cli


if __name__ == "__main__":
    sys.exit(build_cli().run())
