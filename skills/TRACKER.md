# AIQ Skills and OpenClaw Tracker

Status values: `Not Started`, `In Progress`, `Blocked`, `Done`.

## Phase 1: Inventory

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| Done | Inventory existing AIQ skill | `.agents/skills/aiq-research` mapped to focused skill owners. |
| Done | Inventory AIQ docs and configs | README, docs/source, configs, deploy, frontends, sources, and tokenomics docs reviewed. |
| Done | Compare with RAG/VSS skill process | AIQ catalog follows the same playbook/tracker/compliance/OpenClaw pattern. |

## Phase 2: Skill Catalog

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| Done | Add catalog README | `skills/README.md` lists focused AIQ skills and install guidance. |
| Done | Scaffold focused skills | Initial `aiq-*` skill folders, references, and evals exist. |
| Done | Map existing skill ownership | Existing `aiq-research` helper is mapped to `aiq-run-research` and `aiq-manage-jobs`. |
| In Progress | Deepen each reference | Add more mode-specific command examples and known failure paths. |

## Phase 3: Playbook and Evals

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| Done | Add AIQ Skills Playbook | `skills/PLAYBOOK.md` defines naming, metadata, security, eval, review, and OpenClaw rules. |
| Done | Add starter evals | Each skill has at least 3 cases including negative/security coverage. |
| Done | Add behavior gates | Evals include confirmation, validation, source-doc, health, and safe-refusal assertions. |
| Done | Add compliance checker | `scripts/skill_compliance_check.py` validates skills and OpenClaw manifest. |

## Phase 4: OpenClaw

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| Done | Add OpenClaw workspace | `.openclaw/workspace` documents identity, overview, and manual. |
| Done | Add OpenClaw manifest | `.openclaw/openclaw.plugin.json` declares id, config schema, and skill paths. |
| In Progress | Validate OpenClaw install | Manifest and skill symlinks exist; runtime install needs validation. |

## Phase 5: Project Artifacts

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| Done | Generate Word playbook | `project-artifacts/skills/AIQ_Skills_Playbook.docx` is generated from `skills/PLAYBOOK.md`. |
| Done | Generate Excel project tracker | `project-artifacts/trackers/AIQ_Skills_Project_Tracker.xlsx` tracks summary, work items, skills catalog, risks, timeline, and review findings. |

## Phase 6: Review and Publication

| Status | Work Item | Acceptance Criteria |
|---|---|---|
| In Progress | CI and PR gates | CI job and PR checklist added; reviewer teams still need real CODEOWNERS assignment. |
| Not Started | Security review | Credentials, data-source keys, auth/JWT, eval data, and destructive actions reviewed. |
| Not Started | Runtime validation | Skills tested on local API server, Docker Compose, Helm, NAT eval, and OpenClaw. |
| Not Started | Central catalog sync | NVIDIA skills catalog publication path approved. |

## Project Tracker Artifact

An Excel tracker with summary, work items, skill catalog, risks, timeline, and
review findings is generated at
`project-artifacts/trackers/AIQ_Skills_Project_Tracker.xlsx`.
