---
name: aiq-analyze-tokenomics
description: Analyze AIQ tokenomics, NAT profiler traces, model cost, latency, phase attribution, single-run reports, and comparison reports. Use when the user asks to parse a trace, estimate costs, inspect token usage, or generate tokenomics HTML reports.
owner: nvidia-aiq-team
service: nvidia-aiq-tokenomics
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq tokenomics profiling"
---

# AIQ Analyze Tokenomics

## Overview

Generate and interpret tokenomics reports from NAT profiler traces.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/tokenomics.md`.
- Classify traces before sharing or publishing reports; traces may contain
  prompts, tool inputs, and retrieved content.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate trace path, pricing config, output path, and comparison inputs.
2. Run the tokenomics report module.
3. Verify the HTML report exists and references the intended trace(s).
4. Report key cost, token, and latency findings.

Ask for explicit confirmation before overwriting existing reports or publishing
trace-derived artifacts.

## Reference

- `references/tokenomics.md`
- `${AIQ_REPO_ROOT}/src/aiq_agent/tokenomics/README.md`
- `${AIQ_REPO_ROOT}/src/aiq_agent/tokenomics/report/`

## Error Handling

If parsing fails, report the trace path and NAT trace compatibility issue. Do not
silently drop requests from the report.

## Examples

- "Generate a tokenomics report from this NAT trace."
- "Compare two AIQ tokenomics runs."
- "Summarize token cost by workflow phase."

