# AIQ OpenClaw Plugin

This directory contains a native OpenClaw package for the NVIDIA AI-Q Blueprint.
It includes `openclaw.plugin.json`, workspace identity/manual files, and
package-local symlinks to the canonical `../skills/aiq-*` catalog.

## Install

From the AIQ repository root:

```bash
openclaw plugins install ./.openclaw/
```

The manifest declares skill directories relative to the plugin root. The
`skills/aiq-*` entries are symlinks back to the canonical `../skills/aiq-*`
catalog, so use a checkout or archive format that preserves symlinks.

Manifest reference: https://docs.openclaw.ai/plugins/manifest

