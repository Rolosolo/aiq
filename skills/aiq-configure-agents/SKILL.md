---
name: aiq-configure-agents
description: Configure AIQ agents, workflow YAML, LLM roles, orchestrator, planner, researcher, shallow/deep routing, HITL approvals, prompts, and frontier model settings. Use when the user asks to change models, prompts, agent roles, thinking, routing, or human-in-the-loop behavior.
owner: nvidia-aiq-team
service: nvidia-aiq-agents
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq agents config"
---

# AIQ Configure Agents

## Overview

Configure AIQ workflow YAML, agent roles, LLMs, prompts, and HITL behavior.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/agents.md`.
- Check key presence without printing values.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate target config and agent role.
2. Prepare edits in the selected YAML or prompt file.
3. Restart or rerun the selected surface.
4. Verify with a minimal research query.
5. Report config changed and behavior verified.

Ask for explicit confirmation before modifying production configs or persistent
prompt files.

## Reference

- `references/agents.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/configuration-reference.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/prompts.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/hitl.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/swapping-models.md`
- `${AIQ_REPO_ROOT}/configs/`

## Error Handling

If a config fails to load, report the YAML path and error. Do not switch model
providers silently.

## Examples

- "Change planner to GPT-5.2."
- "Edit the deep researcher prompt."
- "Disable HITL plan approval."

