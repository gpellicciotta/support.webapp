## Walkthrough & Validation
The audit lists 18 promote-now candidates, each with its Auth path, size, consumer apps, and backlog task.
All 26 linked sibling files exist at their pinned commits; the Auth repository is private, so online checks return 404.

```text
$ python scripts/devops.py lint
All 28 markdown files passed linting.
All checks passed!
9 files already formatted
> @gpellicciotta/support.webapp@0.4.0-pre lint
> eslint .
exit code: 0 (python scripts/devops.py lint)
```

```text
$ python -m pytest -q tests/test_markdown_links.py
...                                                                      [100%]
3 passed in 2.08s
exit code: 0
```

```text
$ plan tasks validate
All 23 task files passed validation.
exit code: 0
```
