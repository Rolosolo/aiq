---
name: aiq-run-research
description: Run AIQ shallow or deep research through CLI, NAT run, local API, web UI, or the packaged aiq-research helper. Use when the user asks a research question, wants cited answers, deep reports, routed chat, or source-preserving research output.
owner: nvidia-aiq-team
service: nvidia-aiq-research
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq research run"
---

# AIQ Run Research

## Overview

Run shallow or deep AIQ research and preserve citations, sources, and reports.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Confirm the run surface: CLI, NAT run, local API, web UI, or packaged
  `.agents/skills/aiq-research` helper.
- Read `references/research.md`.
- Classify confidential prompts before sending them to external tools or model
  providers.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate query, config, server availability, and required provider keys.
2. Prepare the selected run command or helper script.
3. Execute the request.
4. If a deep research job is returned, route lifecycle management to
   `aiq-manage-jobs`.
5. Report answer or job id with citations intact.

## Reference

- `references/research.md`
- `${AIQ_REPO_ROOT}/README.md`
- `${AIQ_REPO_ROOT}/docs/source/examples/index.md`
- `${AIQ_REPO_ROOT}/docs/source/integration/agent-skills.md`
- `${AIQ_REPO_ROOT}/.agents/skills/aiq-research/SKILL.md`

## Error Handling

If the research request fails, do not retry automatically with broader prompts.
Report the status and route to troubleshooting when the server or workflow is
unhealthy.

## Examples

- "Research recent approaches to agent evaluation."
- "Run a deep research report through AIQ."
- "Use the local AIQ server for this question."

