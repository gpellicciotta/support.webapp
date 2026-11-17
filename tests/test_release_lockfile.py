"""Verify the release action moves the package-lock.json root versions with package.json."""

import importlib.util
import json
import sys
from datetime import date
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("devops", REPO_ROOT / "scripts/devops.py")
DEVOPS = importlib.util.module_from_spec(SPEC)
sys.modules["devops"] = DEVOPS
SPEC.loader.exec_module(DEVOPS)

LOCKFILE = """{
  "name": "@example/app",
  "version": "0.3.0-pre",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "@example/app",
      "version": "0.3.0-pre",
      "devDependencies": {
        "left-pad": "^1.3.0"
      }
    },
    "node_modules/left-pad": {
      "version": "1.3.0",
      "dev": true
    }
  }
}
"""

CHANGELOG = """# Versioned Changes

---

## v0.3.0-pre
- Added a feature.

## v0.2.0 [released: 2026-11-01]
- Started.
"""


class RecordingLogger:
    """Collect log lines by level."""

    def __init__(self):
        self.lines = []

    def info(self, message):
        self.lines.append(("info", message))

    def warning(self, message):
        self.lines.append(("warning", message))

    def error(self, message):
        self.lines.append(("error", message))


def write_project(root: Path, newline: str = "\n") -> None:
    """Write a releasable npm project at 0.3.0-pre."""
    files = {
        "package.json": '{\n  "name": "@example/app",\n  "version": "0.3.0-pre"\n}\n',
        "package-lock.json": LOCKFILE,
        "CHANGELOG.md": CHANGELOG,
    }
    for name, text in files.items():
        (root / name).write_text(text, encoding="utf-8", newline=newline)


def passing_query(argv, cwd):
    """Answer the release preconditions as a clean main branch with no existing tag or release."""
    command = list(argv)
    if command[:2] == ["git", "branch"]:
        return 0, "main\n"
    if command[:2] == ["git", "rev-parse"] or command[:3] == ["gh", "release", "view"]:
        return 1, ""
    return 0, ""


def lock_versions(root: Path) -> tuple[str, str]:
    """Return the top-level and root-package versions of the lockfile."""
    data = json.loads((root / "package-lock.json").read_text(encoding="utf-8"))
    return data["version"], data["packages"][""]["version"]


def make_pipeline(root: Path, runner, *, dry_run: bool = False):
    """Create the devops release pipeline with fake commands."""
    return DEVOPS.LockfileReleasePipeline(
        root=root,
        logger=RecordingLogger(),
        dry_run=dry_run,
        assume_yes=True,
        runner=runner,
        query=passing_query,
        today=lambda: date(2026, 11, 17),
    )


def test_release_freezes_and_reopens_lockfile_versions(tmp_path):
    write_project(tmp_path)
    commands = []
    committed = {}

    def runner(argv, cwd, logger):
        commands.append(list(argv))
        if argv[:2] == ["git", "commit"]:
            committed[argv[-1]] = lock_versions(tmp_path)
        return 0

    assert make_pipeline(tmp_path, runner).run() == 0
    assert committed["Released version 0.3.0."] == ("0.3.0", "0.3.0")
    assert committed["Started version 0.3.1-pre after the 0.3.0 release."] == ("0.3.1-pre", "0.3.1-pre")
    adds = [command for command in commands if command[:2] == ["git", "add"]]
    assert len(adds) == 2
    assert all("package-lock.json" in command for command in adds)


def test_lockfile_edit_keeps_dependency_versions_and_line_endings(tmp_path):
    write_project(tmp_path, newline="\r\n")
    DEVOPS.set_lockfile_version(tmp_path, "0.3.0")
    text = (tmp_path / "package-lock.json").read_bytes().decode("utf-8")
    expected = LOCKFILE.replace('"version": "0.3.0-pre"', '"version": "0.3.0"').replace("\n", "\r\n")
    assert text == expected


def test_lockfile_edit_rejects_a_lockfile_without_root_versions(tmp_path):
    (tmp_path / "package-lock.json").write_text('{\n  "lockfileVersion": 3\n}\n', encoding="utf-8")
    with pytest.raises(ValueError, match="package-lock.json"):
        DEVOPS.set_lockfile_version(tmp_path, "0.3.0")


def test_dry_run_lists_the_lockfile_in_both_version_steps(tmp_path):
    write_project(tmp_path)
    pipeline = make_pipeline(tmp_path, lambda argv, cwd, logger: pytest.fail(f"dry run ran {argv}"), dry_run=True)
    assert pipeline.run() == 0
    planned = [message for level, message in pipeline.logger.lines if message.startswith("[dry-run] ")]
    assert [line for line in planned if "edit package-lock.json" in line] == [
        "[dry-run] edit package-lock.json: root versions 0.3.0",
        "[dry-run] edit package-lock.json: root versions 0.3.1-pre",
    ]
    assert sum("git add" in line and "package-lock.json" in line for line in planned) == 2
    assert lock_versions(tmp_path) == ("0.3.0-pre", "0.3.0-pre")


def test_release_action_uses_the_lockfile_pipeline(tmp_path, monkeypatch):
    created = {}

    class FakePipeline:
        def __init__(self, **kwargs):
            created.update(kwargs)

        def run(self):
            return 0

    monkeypatch.setattr(DEVOPS, "LockfileReleasePipeline", FakePipeline)
    assert DEVOPS.build_cli(tmp_path).run(["release", "--dry-run", "--skip-checks"]) == 0
    assert created["root"] == tmp_path
    assert created["dry_run"] is True
    assert created["quality_check"] is None
