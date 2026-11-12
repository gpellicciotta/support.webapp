#!/usr/bin/env python3
"""Install the pinned Python tools, npm dependencies, and Chromium using standard-library Python."""

import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VENV = ROOT / ".venv"
PYTHON = VENV / ("Scripts/python.exe" if sys.platform == "win32" else "bin/python")


def run(*argv: object) -> None:
    """Print and run a command, stopping on failure."""
    command = [str(arg) for arg in argv]
    print("$ " + " ".join(command), flush=True)
    subprocess.run(command, cwd=ROOT, check=True)


def main() -> int:
    """Prepare all development tools and verify the checkout."""
    npm = shutil.which("npm")
    npx = shutil.which("npx")
    if not npm or not npx:
        print("Node.js and npm must be installed first.", file=sys.stderr)
        return 1
    if not PYTHON.is_file():
        run(sys.executable, "-m", "venv", VENV)
    run(PYTHON, "-m", "pip", "install", "-r", ROOT / "scripts/requirements.txt")
    run(npm, "ci")
    run(npx, "playwright", "install", "chromium")
    run(PYTHON, ROOT / "scripts/devops.py", "check")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (OSError, subprocess.CalledProcessError) as error:
        print(f"Bootstrap failed: {error}", file=sys.stderr)
        sys.exit(1)
