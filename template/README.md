# {{app-title}}
{{app-title}} is a web app built on the support.webapp design system.

---

## Status
The app holds the generated shell with placeholder screens.
It uses the `{{look}}` look of support.webapp v{{design-version}}, vendored in [src/vendor/design/](src/vendor/design/).

---

## Development
Bootstrap the checkout, then serve the app:

```bash
python scripts/bootstrap-dev-environment.py
python scripts/devops.py serve --port 4173
```

See [requirements.md](docs/requirements.md) for scope, [devops.md](docs/devops.md) for operations, and [index.md](docs/index.md) for all documentation.

---

## License
{{app-title}} is released under the [MIT License](LICENSE.md).
