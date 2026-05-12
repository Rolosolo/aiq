---
name: aiq-manage-jobs
description: Manage AIQ async deep research jobs, job status, event-store state, SSE streams, reports, polling, retries, and cancellation. Use when the user has a job id, wants progress, final reports, state artifacts, or wants to cancel an AIQ job.
owner: nvidia-aiq-team
service: nvidia-aiq-jobs
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq jobs async"
---

# AIQ Manage Jobs

## Overview

Manage async deep research lifecycle through the API frontend or packaged
`aiq-research` helper.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Validate job IDs before use.
- Read `references/jobs.md`.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate server health and job id format.
2. Fetch status, state, report, or stream as requested.
3. Continue polling only for non-terminal states.
4. Report terminal status and artifacts.

Ask for explicit confirmation before cancelling jobs or deleting job/event-store
data.

## Reference

- `references/jobs.md`
- `${AIQ_REPO_ROOT}/frontends/aiq_api/README.md`
- `${AIQ_REPO_ROOT}/.agents/skills/aiq-research/SKILL.md`

## Error Handling

If a job failed, show the sanitized error and do not retry automatically.

## Examples

- "Check this AIQ job status."
- "Stream events for this job."
- "Cancel this running deep research job."

