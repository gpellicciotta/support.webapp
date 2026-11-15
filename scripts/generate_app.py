"""Generate a new web app from template/ and vendor the design system into it, as ADR-0006 decides.

The generator copies every template file, keeps the shell areas the options select, fills the placeholders,
and runs `node bin/cli.mjs vendor` inside the new app. It never runs `git init` or `plan init`.
"""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import tempfile
from dataclasses import dataclass, replace
from datetime import date
from pathlib import Path
from typing import Callable, Optional

REPO_ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_DIR = REPO_ROOT / "template"
VENDOR_TARGET = "src/vendor/design"
STYLES_FOLDER = "src/css"

SCROLLS = ("main", "page")
NAVS = ("sidebar", "bottom", "menu", "breadcrumb", "none")
WIDTHS = ("reading", "narrow", "content", "full")
CONDITIONS = ("sidebar", "bottom", "menu", "breadcrumb", "action-bar", "side-panel")

APP_NAME = re.compile(r"^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$")
# A backslash before the braces keeps a documentation placeholder literal.
PLACEHOLDER = re.compile(r"(\\?)\{\{([A-Za-z][\w-]*)\}\}")
# Titles and owners land unescaped in JSON, HTML, Python, and Markdown files, so characters that break them are refused.
UNSAFE_TEXT = re.compile(r'["\\<>&{}\x00-\x1f\x7f]')
MARKER = re.compile(r"^\s*<!-- (if|end):(!?)([a-z-]+) -->\s*$")


class GenerateError(Exception):
    """A generation failure; exit code 2 marks invalid options, 1 an operational failure."""

    def __init__(self, message: str, exit_code: int = 1) -> None:
        super().__init__(message)
        self.exit_code = exit_code


@dataclass(frozen=True)
class AppOptions:
    """The options of one generated app, as the generate-app flags give them."""

    name: str
    look: str
    title: Optional[str] = None
    scroll: str = "main"
    nav: tuple[str, ...] = ()
    width: str = "full"
    action_bar: bool = False
    side_panel: bool = False
    owner: Optional[str] = None
    output: Optional[Path] = None


def available_looks(repo_root: Path = REPO_ROOT) -> list[str]:
    """Return the looks a checkout ships; folders starting with an underscore are templates, not looks."""
    return sorted(item.name for item in (repo_root / "src/looks").iterdir() if item.is_dir() and item.name[0] != "_")


def read_version(repo_root: Path = REPO_ROOT) -> str:
    """Return the design system version of the checkout, from package.json."""
    return json.loads((repo_root / "package.json").read_text(encoding="utf-8"))["version"]


def read_git_user() -> Optional[str]:
    """Return the Git user name, or None when Git is missing or has none."""
    try:
        result = subprocess.run(["git", "config", "user.name"], capture_output=True, text=True, check=False)
    except OSError:
        return None
    return result.stdout.strip() or None


def resolve(
    options: AppOptions, *, repo_root: Path = REPO_ROOT, git_user: Callable[[], Optional[str]] = read_git_user
) -> AppOptions:
    """Validate the options and fill the defaults of title, owner, and output folder."""
    if not APP_NAME.match(options.name):
        raise GenerateError(f"Invalid app name '{options.name}': use lowercase words joined by dashes", 2)
    looks = available_looks(repo_root)
    if options.look not in looks:
        raise GenerateError(f"Unknown look '{options.look}': choose one of {', '.join(looks)}", 2)
    if options.scroll not in SCROLLS:
        raise GenerateError(f"Unknown scroll mode '{options.scroll}': choose one of {', '.join(SCROLLS)}", 2)
    if options.width not in WIDTHS:
        raise GenerateError(f"Unknown width '{options.width}': choose one of {', '.join(WIDTHS)}", 2)
    unknown = [item for item in options.nav if item not in NAVS]
    if unknown:
        raise GenerateError(f"Unknown navigation '{unknown[0]}': choose from {', '.join(NAVS)}", 2)
    if "none" in options.nav and len(set(options.nav)) > 1:
        raise GenerateError("--nav none cannot combine with other navigation values", 2)
    title = options.title or " ".join(word.capitalize() for word in options.name.split("-"))
    owner = options.owner or git_user()
    if not owner:
        raise GenerateError("No copyright owner: pass --owner or set the Git user name", 2)
    for label, value in (("title", title), ("owner", owner)):
        if UNSAFE_TEXT.search(value):
            raise GenerateError(f"The {label} holds a quote, backslash, <, >, &, brace, or control character", 2)
    output = Path(options.output) if options.output else Path.cwd() / options.name
    return replace(options, title=title, owner=owner, output=output, nav=tuple(dict.fromkeys(options.nav)))


def conditions(options: AppOptions) -> set[str]:
    """Return the area conditions that the options switch on."""
    selected = {item for item in options.nav if item != "none"}
    if options.action_bar:
        selected.add("action-bar")
    if options.side_panel:
        selected.add("side-panel")
    return selected


def shell_classes(options: AppOptions) -> str:
    """Return the body classes of the shell for the scroll and width options."""
    classes = ["app", f"app--scroll-{options.scroll}"]
    if options.width != "full":
        classes.append(f"app--width-{options.width}")
    return " ".join(classes)


def select_areas(text: str, selected: set[str], path: Path) -> str:
    """Keep the lines between matching if and end markers when their condition holds, and drop the markers."""
    kept: list[str] = []
    stack: list[tuple[str, bool]] = []
    for line in text.splitlines(keepends=True):
        match = MARKER.match(line)
        if not match:
            if all(active for _, active in stack):
                kept.append(line)
            continue
        kind, negated, name = match.groups()
        if name not in CONDITIONS:
            raise GenerateError(f"{path.as_posix()}: unknown area condition '{name}'")
        key = f"{negated}{name}"
        if kind == "if":
            stack.append((key, (name in selected) != bool(negated)))
        elif not stack or stack.pop()[0] != key:
            raise GenerateError(f"{path.as_posix()}: end marker '{key}' without a matching if marker")
    if stack:
        raise GenerateError(f"{path.as_posix()}: unclosed area condition '{stack[-1][0]}'")
    return "".join(kept)


def fill(text: str, values: dict[str, str], path: Path) -> str:
    """Replace every placeholder with its value, keeping escaped ones literal; fail on an unknown one."""

    def substitute(match: re.Match) -> str:
        escaped, name = match.groups()
        if escaped:
            return "{{" + name + "}}"
        key = name.replace("_", "-")
        if key not in values:
            raise GenerateError(f"{path.as_posix()}: unfilled placeholder {{{{{name}}}}}")
        return values[key]

    return PLACEHOLDER.sub(substitute, text)


def placeholder_values(options: AppOptions, version: str, year: int) -> dict[str, str]:
    """Return the value of every template placeholder."""
    return {
        "app-name": options.name,
        "app-title": options.title,
        "look": options.look,
        "owner": options.owner,
        "year": str(year),
        "design-version": version,
        "shell-classes": shell_classes(options),
    }


def run_vendor(app_dir: Path, look: str, repo_root: Path = REPO_ROOT) -> None:
    """Vendor the checkout's design files into the app with the Node vendor command."""
    node = shutil.which("node")
    if node is None:
        raise GenerateError("Node.js not found on PATH; install Node.js 22 or later")
    command = [node, str(repo_root / "bin/cli.mjs"), "vendor", "--look", look, "--to", VENDOR_TARGET]
    result = subprocess.run(
        [*command, "--styles", STYLES_FOLDER], cwd=app_dir, capture_output=True, text=True, check=False
    )
    if result.returncode != 0:
        raise GenerateError(f"vendor failed with exit code {result.returncode}: {result.stderr.strip()}")


def generate(
    options: AppOptions,
    *,
    repo_root: Path = REPO_ROOT,
    template: Path = TEMPLATE_DIR,
    vendor: Callable[[Path, str, Path], None] = run_vendor,
    git_user: Callable[[], Optional[str]] = read_git_user,
    today: Callable[[], date] = date.today,
) -> Path:
    """Generate the app into its output folder and return that folder.

    The app is written to a temporary folder beside the output and renamed at the end,
    so a failure leaves neither a partial app nor the temporary folder; created parent folders stay.
    """
    resolved = resolve(options, repo_root=repo_root, git_user=git_user)
    output = resolved.output.resolve()
    if output.exists():
        raise GenerateError(f"Output folder {output} exists; choose a new folder", 2)
    output.parent.mkdir(parents=True, exist_ok=True)
    values = placeholder_values(resolved, read_version(repo_root), today().year)
    selected = conditions(resolved)
    staging = Path(tempfile.mkdtemp(prefix=f".{resolved.name}-", dir=output.parent))
    try:
        for source in sorted(template.rglob("*")):
            if not source.is_file():
                continue
            relative = source.relative_to(template)
            text = source.read_text(encoding="utf-8")
            if source.suffix == ".html":
                text = select_areas(text, selected, relative)
            destination = staging / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_text(fill(text, values, relative), encoding="utf-8", newline="\n")
        vendor(staging, resolved.look, repo_root)
        # mkdtemp creates a private folder; the app folder takes the usual permissions instead.
        staging.chmod(0o755)
        staging.rename(output)
    except BaseException:
        shutil.rmtree(staging, ignore_errors=True)
        raise
    return output


def configure_parser(parser) -> None:
    """Add the generate-app flags of ADR-0006 to an argparse parser."""
    parser.add_argument("name", help="the app name, in lowercase words joined by dashes")
    parser.add_argument("--look", required=True, help="the look the app imports")
    parser.add_argument("--title", help="the display name; defaults to the app name in title case")
    parser.add_argument("--scroll", default="main", help="main keeps the bars in place; page scrolls the document")
    parser.add_argument("--nav", action="append", default=[], help="sidebar, bottom, menu, breadcrumb, or none")
    parser.add_argument("--width", default="full", help="reading, narrow, content, or full")
    parser.add_argument("--action-bar", action="store_true", help="add the action bar")
    parser.add_argument("--side-panel", action="store_true", help="add the side panel")
    parser.add_argument("--owner", help="the copyright owner; defaults to the Git user name")
    parser.add_argument("-o", "--output", type=Path, help="the folder that receives the app; it must not exist")


def run_action(args, logger) -> int:
    """Run the generate-app action and report the next steps."""
    options = AppOptions(
        name=args.name,
        look=args.look,
        title=args.title,
        scroll=args.scroll,
        nav=tuple(args.nav),
        width=args.width,
        action_bar=args.action_bar,
        side_panel=args.side_panel,
        owner=args.owner,
        output=args.output,
    )
    version = read_version()
    if "-" in version:
        logger.warning(f"Version {version} is a pre-release; generate production apps from a release tag checkout.")
    try:
        output = generate(options)
    except GenerateError as error:
        logger.error(str(error))
        return error.exit_code
    logger.info(f"Generated {options.name} at {output} on support.webapp v{version}.")
    logger.info(f"Next: cd {output}; git init; plan init; python scripts/bootstrap-dev-environment.py")
    return 0
