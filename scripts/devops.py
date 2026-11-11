#!/usr/bin/env python3
"""Runs the typical operations of this documentation-only project on support-python's DevopsCli.

Install the tools first, as docs/devops.md describes.

Usage:
  python scripts/devops.py lint | format | check
  python scripts/devops.py release [--dry-run] [--skip-checks] [--yes]
  python scripts/devops.py help [--verbose] | version
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from docs_project import DocsProject  # noqa: E402
from support_python.devops import DevopsCli  # noqa: E402

if __name__ == "__main__":
    sys.exit(DevopsCli(DocsProject(REPO_ROOT), description="Runs the lint, format, check, and release operations.").run())
