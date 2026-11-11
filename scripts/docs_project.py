"""Project adapter of this documentation-only repository, whose version lives only in the CHANGELOG.md heading."""

from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from typing import Optional, Sequence

from support_python.devops import (
    Project,
    capture_command,
    changelog_top_version,
    confirm_typed,
    extract_release_notes,
    freeze_changelog,
    next_dev_version,
    release_version,
    resolve_executable,
)

MAIN_BRANCH = "main"


class DocsProject(Project):
    """Lints the Markdown documentation and releases by tagging the version in the CHANGELOG.md top heading."""

    def lint(self) -> bool:
        """Check the Markdown files, skipping external links."""
        return self._lint_markdown("check", "--offline")

    def format(self) -> bool:
        """Fix the Markdown formatting in place."""
        return self._lint_markdown("fix", "--offline")

    def test(self, selection: Sequence[str] = ()) -> bool:
        """Skip tests, since the project has none."""
        self.logger.info("No tests configured; skipping.")
        return True

    def build(self) -> bool:
        """Skip the build, since the project has no outputs."""
        self.logger.info("Nothing to build; skipping.")
        return True

    def clean(self) -> bool:
        """Skip the cleanup, since the project has no outputs."""
        return True

    def action_summaries(self) -> dict[str, str]:
        """Describe the actions for this project."""
        return {
            "release": "freeze the CHANGELOG.md version, tag it, push, and open the next -pre version",
            "test": "skipped: the project has no tests",
            "build": "skipped: the project has no outputs",
        }

    def release(self, *, dry_run: bool = False, assume_yes: bool = False) -> Optional[bool]:
        """Freeze the top CHANGELOG.md version, tag, push both, then open the next patch version and push it."""
        changelog = self.root / "CHANGELOG.md"
        text = changelog.read_bytes().decode("utf-8")
        current = changelog_top_version(text)
        if current is None or not current.endswith("-pre"):
            return self._fail(f"The top CHANGELOG.md heading must be a -pre version, found {current or 'none'}.")
        version = release_version(current)
        tag = f"v{version}"
        next_version = next_dev_version(version)
        problem = self._precondition_problem(tag)
        if problem:
            return self._fail(problem)
        try:
            extract_release_notes(text, current)
        except ValueError as exc:
            return self._fail(str(exc))
        steps = [
            f"Freeze the CHANGELOG.md heading as v{version} [released: {date.today().isoformat()}] and commit it",
            f"Tag {tag}",
            f"Push {MAIN_BRANCH} and {tag} to origin",
            f"Add the v{next_version} heading to CHANGELOG.md, commit it, and push {MAIN_BRANCH}",
        ]
        self.logger.info(f"Release version: {tag}")
        self.logger.info(f"Next version: v{next_version}")
        if dry_run:
            for step in steps:
                self.logger.info(f"[dry-run] {step}")
            self.logger.info("[dry-run] No changes were made.")
            return True
        if not self.lint():
            return self._fail("Lint failed; nothing was changed.")
        summary = [f"About to release {tag}:", *(f"  {step}" for step in steps)]
        if not assume_yes and not confirm_typed(summary, f"release {tag}"):
            return self._fail("Release not confirmed; nothing was changed.")
        return self._release_steps(changelog, text, current, tag, next_version)

    def _release_steps(self, changelog: Path, text: str, current: str, tag: str, next_version: str) -> bool:
        frozen = freeze_changelog(text, current, f"released: {date.today().isoformat()}")
        changelog.write_bytes(frozen.encode("utf-8"))
        if not (
            self.run_command(["git", "add", "CHANGELOG.md"])
            and self.run_command(["git", "commit", "-m", f"Released {tag}."])
            and self.run_command(["git", "tag", "-a", tag, "-m", f"Released {tag}."])
            and self.run_command(["git", "push", "--atomic", "origin", MAIN_BRANCH, tag])
        ):
            return self._fail(f"A release step failed; review the repository state before retrying {tag}.")
        newline = "\r\n" if "\r\n" in frozen else "\n"
        reopened = re.sub(r"^(##\s+v)", rf"## v{next_version}{newline}{newline}\1", frozen, count=1, flags=re.MULTILINE)
        changelog.write_bytes(reopened.encode("utf-8"))
        if not (
            self.run_command(["git", "add", "CHANGELOG.md"])
            and self.run_command(["git", "commit", "-m", f"Started v{next_version}."])
            and self.run_command(["git", "push", "origin", MAIN_BRANCH])
        ):
            return self._fail(f"Released {tag}, but opening v{next_version} failed; finish it by hand.")
        self.logger.info(f"Released {tag}.")
        return True

    def _precondition_problem(self, tag: str) -> Optional[str]:
        code, out = capture_command(["git", "status", "--porcelain"], self.root)
        if code != 0 or out.strip():
            return "The working tree must be clean; commit or stash your changes before releasing."
        code, out = capture_command(["git", "branch", "--show-current"], self.root)
        if code != 0 or out.strip() != MAIN_BRANCH:
            return f"Releases must be cut from branch '{MAIN_BRANCH}' (currently on '{out.strip()}')."
        code, out = capture_command(["git", "fetch", "origin", MAIN_BRANCH, "--tags"], self.root)
        if code != 0:
            return f"Could not fetch origin/{MAIN_BRANCH}: {out}"
        code, out = capture_command(["git", "rev-list", "--count", f"HEAD..origin/{MAIN_BRANCH}"], self.root)
        if code != 0 or out.strip() != "0":
            return f"Local {MAIN_BRANCH} is behind origin/{MAIN_BRANCH}; pull before releasing."
        if capture_command(["git", "rev-parse", "-q", "--verify", f"refs/tags/{tag}"], self.root)[0] == 0:
            return f"Tag '{tag}' already exists."
        return None

    def _lint_markdown(self, *args: str) -> bool:
        executable = resolve_executable("lint-markdown")
        if executable is None:
            self.logger.error("lint-markdown not found; install the tools as docs/devops.md describes.")
            return False
        return self.run_command([executable, *args])

    def _fail(self, message: str) -> bool:
        self.logger.error(message)
        return False
