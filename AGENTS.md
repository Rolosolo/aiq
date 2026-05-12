# NVIDIA AI-Q Blueprint

Use this repository as the source of truth for AIQ code, docs, configs, and
agent skills.

## Project Structure

- `src/aiq_agent/` - core AIQ agents, auth, knowledge, tokenomics, and shared code.
- `configs/` - NAT workflow YAML configs.
- `frontends/` - API, CLI, debug, UI, and benchmark packages.
- `sources/` - tool and data-source integrations.
- `deploy/` - Docker Compose and Helm deployment assets.
- `docs/source/` - product documentation.
- `.agents/skills/aiq-research/` - stable packaged local-server helper skill.
- `skills/` - preview focused `aiq-*` skills catalog.

## Development Commands

```bash
uv sync --group dev
ruff check .
ruff format --check .
python -m pytest tests/ -v
python3 scripts/skill_compliance_check.py --skills-dir skills --openclaw-dir .openclaw --prefix aiq --strict
```

## Operations - AIQ Skills

For operational tasks, use the focused skills under `skills/` and start with
`skills/README.md`.

- **Setup** - `skills/aiq-setup-environment/SKILL.md`
- **Deploy / shutdown** - `skills/aiq-deploy-blueprint/SKILL.md`
- **Run research** - `skills/aiq-run-research/SKILL.md`
- **Async jobs** - `skills/aiq-manage-jobs/SKILL.md`
- **Configure agents** - `skills/aiq-configure-agents/SKILL.md`
- **Configure tools** - `skills/aiq-configure-tools/SKILL.md`
- **Knowledge layer** - `skills/aiq-manage-knowledge/SKILL.md`
- **Evaluate** - `skills/aiq-evaluate-benchmarks/SKILL.md`
- **Tokenomics** - `skills/aiq-analyze-tokenomics/SKILL.md`
- **Troubleshoot** - `skills/aiq-troubleshoot-blueprint/SKILL.md`

Check key presence without printing values. Ask for confirmation before
teardown, data deletion, job cancellation, benchmark overwrite, or publishing
trace-derived artifacts.

