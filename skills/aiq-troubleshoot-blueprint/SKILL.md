---
name: aiq-troubleshoot-blueprint
description: Troubleshoot NVIDIA AI-Q Blueprint setup, deployment, API server, web UI, CLI, NAT run/eval, async jobs, tools, knowledge layer, tokenomics, Docker, Helm, and benchmark failures. Use when AIQ is broken, unhealthy, failing, hanging, or returning unexpected research results.
owner: nvidia-aiq-team
service: nvidia-aiq-blueprint
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq troubleshoot debug"
---

# AIQ Troubleshoot Blueprint

## Overview

Diagnose broken AIQ setup, run, deployment, job, tool, knowledge, evaluation, and
tokenomics workflows.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/troubleshoot.md`.
- Start with read-only diagnostics.
- Sanitize logs, job state, traces, and API responses before reporting.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate failing surface and expected behavior.
2. Collect environment, config, health, logs, job status, and error output.
3. Classify the failure and route to the owning skill if needed.
4. Apply the smallest safe fix.
5. Verify the originally failing workflow.
6. Report root cause, evidence, fix, and blockers.

Ask for explicit confirmation before destructive cleanup, database deletion,
job cancellation, or benchmark result overwrite.

## Reference

- `references/troubleshoot.md`
- `${AIQ_REPO_ROOT}/docs/source/resources/troubleshooting.md`
- `${AIQ_REPO_ROOT}/docs/source/resources/faq.md`
- `${AIQ_REPO_ROOT}/docs/source/contributing/testing.md`

## Error Handling

Do not report success unless the failing workflow has been rechecked.

## Examples

- "AIQ API server is down."
- "Deep research job is stuck."
- "Knowledge retrieval returns no documents."
- "NAT eval fails."

