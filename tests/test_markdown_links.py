"""Verify portable link checks retain failures for missing project documents."""

import importlib.util
import tempfile
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location(
    "links", Path(__file__).resolve().parents[1] / "scripts/markdown-links.py"
)
LINKS = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(LINKS)


class PortableLinksTests(unittest.TestCase):
    """Check repository links independently of optional sibling checkouts."""

    def test_internal_links_still_fail(self):
        """Missing internal files must fail."""
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            issues = LINKS.PortableLinks().lint("[Missing](docs/missing.md)", root / "README.md", project_root=root)
            self.assertEqual(len(issues), 1)

    def test_external_evidence_and_plan_store_are_optional(self):
        """External evidence and plan store links do not belong to a source-only checkout."""
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            text = "[Plan](PLAN.md) [Evidence](../sibling/src/index.html) [Proof](.plan/tasks/proof.png)"
            self.assertEqual(LINKS.PortableLinks().lint(text, root / "README.md", project_root=root), [])

    def test_root_relative_links_still_fail(self):
        """Root-relative paths must remain internal repository links."""
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            issues = LINKS.PortableLinks().lint("[Missing](/docs/missing.md)", root / "README.md", project_root=root)
            self.assertEqual(len(issues), 1)


if __name__ == "__main__":
    unittest.main()
