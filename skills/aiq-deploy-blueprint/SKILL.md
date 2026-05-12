---
name: aiq-deploy-blueprint
description: Deploy, start, verify, stop, or tear down the NVIDIA AI-Q Blueprint through scripts, Docker Compose, Helm, web UI, API server, or NAT serve. Use when the user asks to run AIQ end-to-end, deploy AIQ, start the web app, or stop AIQ services.
owner: nvidia-aiq-team
service: nvidia-aiq-blueprint
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq deploy"
---

# AIQ Deploy Blueprint

## Overview

Deploy and manage AIQ through local scripts, NAT, Docker Compose, or Helm.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/deployment.md`.
- Check API key presence without printing values.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate requested mode: CLI, web local, Docker Compose, Helm, or NAT serve.
2. Prepare the correct config and env source.
3. Execute documented startup or shutdown.
4. Verify API health, UI availability, container/pod state, or NAT command output.
5. Report endpoints, config used, and blockers.

Ask for explicit confirmation before destructive teardown, database deletion,
volume removal, or job/event-store cleanup.

## Reference

- `references/deployment.md`
- `${AIQ_REPO_ROOT}/README.md`
- `${AIQ_REPO_ROOT}/deploy/compose/README.md`
- `${AIQ_REPO_ROOT}/deploy/helm/README.md`
- `${AIQ_REPO_ROOT}/docs/source/deployment/docker-compose.md`
- `${AIQ_REPO_ROOT}/docs/source/deployment/kubernetes.md`
- `${AIQ_REPO_ROOT}/frontends/aiq_api/README.md`

## Error Handling

If deployment fails, route unknown failures to `aiq-troubleshoot-blueprint`.
Do not switch modes silently.

## Examples

- "Start AIQ web UI."
- "Deploy AIQ with Docker Compose."
- "Stop all AIQ services."

