---
name: aiq-manage-knowledge
description: Configure and operate the AIQ knowledge layer, including LlamaIndex, ChromaDB, Foundational RAG, document ingestion, retrieval, summaries, collection TTL, and knowledge API routes. Use when the user asks to add documents, enable knowledge retrieval, use RAG-backed AIQ, or debug knowledge answers.
owner: nvidia-aiq-team
service: nvidia-aiq-knowledge
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq knowledge rag retrieval"
---

# AIQ Manage Knowledge

## Overview

Configure and operate AIQ knowledge retrieval through LlamaIndex/Chroma or
Foundational RAG.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/knowledge.md`.
- Classify documents before ingestion and confirm the target environment is
  approved for confidential content.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate backend choice, config, document paths, and collection names.
2. Prepare ingestion/retrieval settings and required services.
3. Execute ingestion or retrieval.
4. Verify with a known query and source inspection.
5. Report collection, file status, retrieval evidence, and failures.

Ask for explicit confirmation before deleting collections, clearing summaries,
or removing persisted Chroma/RAG data.

## Reference

- `references/knowledge.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/knowledge-layer.md`
- `${AIQ_REPO_ROOT}/sources/knowledge_layer/README.md`
- `${AIQ_REPO_ROOT}/sources/knowledge_layer/KNOWLEDGE-LAYER-SETUP.md`
- `${AIQ_REPO_ROOT}/docs/source/reference/knowledge-layer-sdk.md`

## Error Handling

If answers ignore documents, check ingestion status, active backend, collection,
retriever registration, and source selection before changing models.

## Examples

- "Enable AIQ knowledge retrieval with LlamaIndex."
- "Use Foundational RAG as AIQ knowledge backend."
- "Ingest this folder into AIQ knowledge."

