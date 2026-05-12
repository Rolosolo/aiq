# AIQ Skills

Preview agent skills for working with the NVIDIA AI-Q Blueprint. Each
subdirectory is a focused `aiq-*` skill with `SKILL.md`, references, and evals.

The existing packaged skill at `.agents/skills/aiq-research/` remains the stable
local-server helper for routed chat and async job lifecycle. This preview
catalog broadens the coverage to setup, deployment, configuration, knowledge
layer, evaluation, tokenomics, troubleshooting, and OpenClaw packaging.

## Catalog

| Skill | Description |
|---|---|
| [aiq-setup-environment](aiq-setup-environment/SKILL.md) | Set up Python, uv, Node, API keys, env files, packages, and local prerequisites. |
| [aiq-deploy-blueprint](aiq-deploy-blueprint/SKILL.md) | Deploy, start, verify, stop, or tear down AI-Q through scripts, Docker Compose, Helm, or NAT. |
| [aiq-run-research](aiq-run-research/SKILL.md) | Run shallow/deep research through CLI, NAT, local API, web UI, or the packaged `aiq-research` helper. |
| [aiq-manage-jobs](aiq-manage-jobs/SKILL.md) | Manage async deep research jobs, status, SSE events, reports, state artifacts, and cancellation. |
| [aiq-configure-agents](aiq-configure-agents/SKILL.md) | Configure AIQ agents, LLM roles, prompts, HITL behavior, routing, and frontier model settings. |
| [aiq-configure-tools](aiq-configure-tools/SKILL.md) | Configure web search, paper search, MCP tools, data source registry, tool toggles, and custom tools. |
| [aiq-manage-knowledge](aiq-manage-knowledge/SKILL.md) | Configure and operate the AIQ knowledge layer, LlamaIndex, Chroma, Foundational RAG, ingestion, and retrieval. |
| [aiq-evaluate-benchmarks](aiq-evaluate-benchmarks/SKILL.md) | Run and interpret FreshQA, DeepResearch Bench, NAT eval, and benchmark export workflows. |
| [aiq-analyze-tokenomics](aiq-analyze-tokenomics/SKILL.md) | Parse NAT profiler traces and generate tokenomics/cost/latency reports. |
| [aiq-troubleshoot-blueprint](aiq-troubleshoot-blueprint/SKILL.md) | Diagnose broken setup, deployment, API, UI, NAT, tools, jobs, knowledge, and evaluation workflows. |

## Install

Preview install uses symlinks. Do not install overlapping local-server helper
skills beside `aiq-run-research` unless you intentionally want both trigger
surfaces.

Ask your coding agent to install the catalog:

> Read `skills/README.md` and every `SKILL.md` under `skills/`. Install each
> skill for this host using symlinks, not copies:
>
> - Claude Code: `~/.claude/skills/<name>/`
> - Codex: `~/.codex/skills/<name>/`
> - Universal hosts: `~/.agents/skills/<name>/`
>
> Skip skills already installed and pointing at this checkout. List the skills
> registered and the target directory used.

Each skill must first resolve `AIQ_REPO_ROOT` to the repository checkout before
opening source docs. If a skill was copied rather than symlinked, set
`AIQ_REPO_ROOT` explicitly.

## Existing Skill Ownership

| Existing route | Focused catalog owner |
|---|---|
| `.agents/skills/aiq-research` local helper | `aiq-run-research` and `aiq-manage-jobs` |
| CLI and NAT run | `aiq-run-research` |
| API server, web UI, Docker, Helm | `aiq-deploy-blueprint` |
| Async jobs, SSE, reports, event store | `aiq-manage-jobs` |
| LLMs, prompts, HITL, orchestrator/planner/researcher roles | `aiq-configure-agents` |
| Tavily, Serper, data source registry, MCP, custom tools | `aiq-configure-tools` |
| LlamaIndex, Chroma, Foundational RAG, ingestion/retrieval | `aiq-manage-knowledge` |
| FreshQA, DeepResearch Bench, NAT eval | `aiq-evaluate-benchmarks` |
| NAT trace cost/latency reports | `aiq-analyze-tokenomics` |
| Broken setup, service, API, job, or eval | `aiq-troubleshoot-blueprint` |

## Development Process

- Use [PLAYBOOK.md](PLAYBOOK.md) for naming, structure, security, eval, and
  review rules.
- Use [TRACKER.md](TRACKER.md) to track work needed to move from preview to
  publishable AIQ skills and OpenClaw package.
- Generated artifacts live outside the skill catalog under `project-artifacts/`.

