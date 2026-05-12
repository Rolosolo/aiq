# Setup Reference

## Source Docs

| Goal | Source |
|---|---|
| Overview and prerequisites | `README.md` |
| Installation details | `docs/source/get-started/installation.md` |
| Developer workflow | `docs/source/get-started/developer-guide.md` |
| Package groups | `pyproject.toml` |
| Helper scripts | `scripts/README.md` |

## Verification

- `python3 --version`
- `uv --version`
- selected `uv pip install -e ...` package imports
- `deploy/.env` exists when running deployed surfaces
- required API keys are set, checked without printing values

