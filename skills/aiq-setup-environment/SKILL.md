---
name: aiq-setup-environment
description: Set up the NVIDIA AI-Q Blueprint local environment. Use when the user asks to install AIQ, configure uv or Python, install frontends, set API keys, create deploy/.env, install data sources, or verify local prerequisites.
owner: nvidia-aiq-team
service: nvidia-aiq-blueprint
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq setup environment"
---

# AIQ Setup Environment

## Overview

Prepare a local AIQ development or run environment: Python, uv, Node, packages,
data sources, env files, and API key presence.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first. If the skill was copied rather than symlinked,
  ask the user to set it to the repository checkout path.
- Read `references/setup.md` before making setup decisions.
- Check key presence without printing values.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate OS, Python, uv, Node, repo root, and requested run surface.
2. Prepare `deploy/.env` from `deploy/.env.example` when needed.
3. Install only the packages required for the user's target workflow.
4. Verify imports, CLI command availability, and selected config readability.
5. Report installed surfaces, missing keys, and next run command.

Do not print API keys or copy real secrets into examples.

## Reference

- `references/setup.md`
- `${AIQ_REPO_ROOT}/README.md`
- `${AIQ_REPO_ROOT}/docs/source/get-started/installation.md`
- `${AIQ_REPO_ROOT}/docs/source/get-started/developer-guide.md`
- `${AIQ_REPO_ROOT}/scripts/README.md`
- `${AIQ_REPO_ROOT}/pyproject.toml`

## Error Handling

If dependency installation fails, report the failing package group and target
workflow. Do not install all optional extras unless the user requested a full
developer environment.

## Examples

- "Set up AIQ locally."
- "Install only the API frontend."
- "Check whether my API keys are configured."

