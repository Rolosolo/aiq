---
name: aiq-evaluate-benchmarks
description: Run and interpret AIQ evaluations, NAT eval, FreshQA, DeepResearch Bench, DeepSearch QA, benchmark dataset download, export, scoring, and result comparison. Use when the user asks to evaluate research quality, run benchmarks, or compare AIQ configurations.
owner: nvidia-aiq-team
service: nvidia-aiq-evaluation
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq evaluation benchmarks nat"
---

# AIQ Evaluate Benchmarks

## Overview

Run AIQ quality evaluations and benchmark workflows.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/evaluation.md`.
- Classify datasets and confirm external judge/model endpoints are approved.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate benchmark, dataset, config, judge/model keys, and output path.
2. Prepare dataset and eval config.
3. Run NAT eval or benchmark scripts.
4. Verify result files and metrics.
5. Report dataset, config, model versions, metrics, and artifacts.

Ask for explicit confirmation before overwriting benchmark results or exporting
confidential evaluation data.

## Reference

- `references/evaluation.md`
- `${AIQ_REPO_ROOT}/docs/source/evaluation/index.md`
- `${AIQ_REPO_ROOT}/frontends/benchmarks/deepresearch_bench/README.md`
- `${AIQ_REPO_ROOT}/frontends/benchmarks/freshqa/README.md`
- `${AIQ_REPO_ROOT}/frontends/benchmarks/deepsearch_qa/README.md`

## Error Handling

Do not compare runs unless dataset, config, model, and scoring method are
recorded.

## Examples

- "Run DeepResearch Bench."
- "Evaluate AIQ with FreshQA."
- "Compare benchmark results for two configs."

