---
name: aiq-configure-tools
description: Configure AIQ tools and data sources including Tavily web search, Serper paper search, MCP tools, data source registry, UI toggles, custom tools, and source-specific API keys. Use when the user asks to add, enable, disable, or debug AIQ tools.
owner: nvidia-aiq-team
service: nvidia-aiq-tools
version: "0.1.0"
reviewed: "2026-05-11"
license: Apache-2.0
data_classification: internal
metadata:
  github-url: "https://github.com/NVIDIA-AI-Blueprints/aiq"
  tags: "nvidia aiq tools mcp data-sources"
---

# AIQ Configure Tools

## Overview

Configure search tools, MCP tools, custom tools, and data source registry.

## Prerequisites

- Resolve `AIQ_REPO_ROOT` first.
- Read `references/tools.md`.
- Check provider keys without printing values.

## Usage

Follow `Validate -> Prepare -> Execute -> Verify -> Report`.

1. Validate target tool/source and required key.
2. Prepare YAML and package changes.
3. Verify registration through NAT/config or a minimal research query.
4. Report enabled/disabled tools and any missing credentials.

Ask for explicit confirmation before enabling a tool that sends confidential
queries or documents to an external provider.

## Reference

- `references/tools.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/tools-and-sources.md`
- `${AIQ_REPO_ROOT}/docs/source/customization/mcp-tools.md`
- `${AIQ_REPO_ROOT}/docs/source/extending/adding-a-tool.md`
- `${AIQ_REPO_ROOT}/docs/source/extending/adding-a-data-source.md`
- `${AIQ_REPO_ROOT}/sources/`

## Error Handling

If a tool is unavailable, distinguish missing package, missing key, config
registration, and provider API failures.

## Examples

- "Enable Serper paper search."
- "Add a custom AIQ tool."
- "Configure MCP tools."

