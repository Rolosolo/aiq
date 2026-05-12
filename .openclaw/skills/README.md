# OpenClaw Skill Routing

OpenClaw loads the canonical AIQ skills through symlinks in this directory.

Do not maintain separate OpenClaw-only copies of the skill instructions. If
OpenClaw needs wrappers or manifest metadata, keep those wrappers thin and route
back to the matching `aiq-*` skill.

