# AIQ OpenClaw Manual

## Routing

| User asks for | Route |
|---|---|
| Install, env, keys, packages | `aiq-setup-environment` |
| Deploy, start, stop, web UI, API, Docker, Helm | `aiq-deploy-blueprint` |
| Run research, ask a question, cited answer | `aiq-run-research` |
| Async job status, report, stream, cancel | `aiq-manage-jobs` |
| LLMs, prompts, HITL, routing, agent roles | `aiq-configure-agents` |
| Tavily, Serper, MCP, custom tools | `aiq-configure-tools` |
| Knowledge layer, LlamaIndex, Chroma, Foundational RAG | `aiq-manage-knowledge` |
| FreshQA, DeepResearch Bench, NAT eval | `aiq-evaluate-benchmarks` |
| NAT trace cost/latency reports | `aiq-analyze-tokenomics` |
| Broken setup, service, job, tool, eval | `aiq-troubleshoot-blueprint` |

## Operating Rules

- Resolve `AIQ_REPO_ROOT` before opening source docs.
- Check key presence without printing key values.
- Classify prompts, documents, traces, and eval datasets before external calls.
- Ask before teardown, data deletion, job cancellation, benchmark overwrite, or
  publishing trace-derived reports.
- Verify the workflow after changes.

