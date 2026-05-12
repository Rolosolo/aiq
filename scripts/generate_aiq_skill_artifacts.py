#!/usr/bin/env python3
"""Generate AIQ skills project artifacts that do not need third-party packages."""

from __future__ import annotations

import datetime as dt
import os
import posixpath
import zipfile
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape


PROJECT = "NVIDIA AIQ Skills and OpenClaw Enablement"
GENERATED_ON = "2026-05-12"


def column_name(index: int) -> str:
    name = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        name = chr(65 + remainder) + name
    return name


def cell_xml(row_index: int, col_index: int, value: object, style: int = 0) -> str:
    ref = f"{column_name(col_index)}{row_index}"
    style_attr = f' s="{style}"' if style else ""
    if value is None:
        return f'<c r="{ref}"{style_attr}/>'
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return f'<c r="{ref}"{style_attr}><v>{value}</v></c>'
    text = escape(str(value), {'"': "&quot;"})
    return f'<c r="{ref}" t="inlineStr"{style_attr}><is><t>{text}</t></is></c>'


def worksheet_xml(rows: list[list[object]], widths: Iterable[int] | None = None) -> str:
    max_cols = max((len(row) for row in rows), default=1)
    dims = f"A1:{column_name(max_cols)}{len(rows) or 1}"
    width_values = list(widths or [])
    if not width_values:
        width_values = [22] * max_cols
    while len(width_values) < max_cols:
        width_values.append(22)

    cols = "".join(
        f'<col min="{idx}" max="{idx}" width="{width}" customWidth="1"/>'
        for idx, width in enumerate(width_values[:max_cols], start=1)
    )

    body = []
    for row_index, row in enumerate(rows, start=1):
        style = 1 if row_index == 1 else 2
        cells = "".join(cell_xml(row_index, col_index, value, style) for col_index, value in enumerate(row, start=1))
        body.append(f'<row r="{row_index}">{cells}</row>')

    auto_filter = f'<autoFilter ref="{dims}"/>' if len(rows) > 1 else ""
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<dimension ref="{dims}"/>'
        '<sheetViews><sheetView workbookViewId="0">'
        '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>'
        '<selection pane="bottomLeft"/>'
        '</sheetView></sheetViews>'
        f'<cols>{cols}</cols>'
        f'<sheetData>{"".join(body)}</sheetData>'
        f'{auto_filter}'
        '</worksheet>'
    )


def styles_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/><family val="2"/></font>
  </fonts>
  <fills count="3">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border><left style="thin"/><right style="thin"/><top style="thin"/><bottom style="thin"/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="3">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
  </cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
  <dxfs count="0"/>
  <tableStyles count="0" defaultTableStyle="TableStyleMedium2" defaultPivotStyle="PivotStyleLight16"/>
</styleSheet>
"""


def workbook_xml(sheet_names: list[str]) -> str:
    sheets = "".join(
        f'<sheet name="{escape(name)}" sheetId="{idx}" r:id="rId{idx}"/>'
        for idx, name in enumerate(sheet_names, start=1)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
        'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f'<sheets>{sheets}</sheets>'
        '</workbook>'
    )


def workbook_rels_xml(sheet_names: list[str]) -> str:
    sheet_rels = "".join(
        f'<Relationship Id="rId{idx}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
        f'Target="worksheets/sheet{idx}.xml"/>'
        for idx, _ in enumerate(sheet_names, start=1)
    )
    styles_id = len(sheet_names) + 1
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        f'{sheet_rels}'
        f'<Relationship Id="rId{styles_id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>'
        '</Relationships>'
    )


def root_rels_xml() -> str:
    return """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>
"""


def content_types_xml(sheet_count: int) -> str:
    sheets = "".join(
        f'<Override PartName="/xl/worksheets/sheet{idx}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
        for idx in range(1, sheet_count + 1)
    )
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
        '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>'
        f'{sheets}'
        '</Types>'
    )


def core_xml() -> str:
    timestamp = dt.datetime(2026, 5, 12, 12, 0, 0, tzinfo=dt.timezone.utc).isoformat().replace("+00:00", "Z")
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" '
        'xmlns:dc="http://purl.org/dc/elements/1.1/" '
        'xmlns:dcterms="http://purl.org/dc/terms/" '
        'xmlns:dcmitype="http://purl.org/dc/dcmitype/" '
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'
        f'<dc:title>{escape(PROJECT)}</dc:title>'
        '<dc:creator>AIQ skills working session</dc:creator>'
        '<cp:lastModifiedBy>AIQ skills working session</cp:lastModifiedBy>'
        f'<dcterms:created xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:created>'
        f'<dcterms:modified xsi:type="dcterms:W3CDTF">{timestamp}</dcterms:modified>'
        '</cp:coreProperties>'
    )


def app_xml(sheet_names: list[str]) -> str:
    heading_pairs = f'<vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant><vt:variant><vt:i4>{len(sheet_names)}</vt:i4></vt:variant>'
    titles = "".join(f'<vt:variant><vt:lpstr>{escape(name)}</vt:lpstr></vt:variant>' for name in sheet_names)
    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" '
        'xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">'
        '<Application>Microsoft Excel</Application>'
        f'<HeadingPairs><vt:vector size="2" baseType="variant">{heading_pairs}</vt:vector></HeadingPairs>'
        f'<TitlesOfParts><vt:vector size="{len(sheet_names)}" baseType="variant">{titles}</vt:vector></TitlesOfParts>'
        '</Properties>'
    )


def write_xlsx(path: Path, sheets: dict[str, tuple[list[list[object]], list[int]]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    sheet_names = list(sheets)
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as package:
        package.writestr("[Content_Types].xml", content_types_xml(len(sheet_names)))
        package.writestr("_rels/.rels", root_rels_xml())
        package.writestr("docProps/core.xml", core_xml())
        package.writestr("docProps/app.xml", app_xml(sheet_names))
        package.writestr("xl/workbook.xml", workbook_xml(sheet_names))
        package.writestr("xl/_rels/workbook.xml.rels", workbook_rels_xml(sheet_names))
        package.writestr("xl/styles.xml", styles_xml())
        for idx, name in enumerate(sheet_names, start=1):
            rows, widths = sheets[name]
            package.writestr(posixpath.join("xl", "worksheets", f"sheet{idx}.xml"), worksheet_xml(rows, widths))


def workbook_data() -> dict[str, tuple[list[list[object]], list[int]]]:
    summary = [
        ["Field", "Value", "Details"],
        ["Project", PROJECT, "AIQ parity package modeled after the RAG/VSS skills process."],
        ["Generated On", GENERATED_ON, "Use this workbook with skills/TRACKER.md for execution tracking."],
        ["Current Stage", "Preview implementation complete; runtime validation pending", "Docs, skills, evals, CI gate, OpenClaw scaffold, Word playbook, and Excel tracker are present."],
        ["Done Items", 14, "Inventory, catalog, skills, evals, playbook, OpenClaw scaffold, compliance checker, CI, PR template, docx, and xlsx."],
        ["In Progress Items", 1, "Reference deepening and real-world validation examples."],
        ["Todo Items", 7, "Security review, runtime validation, OpenClaw install validation, CODEOWNERS, and catalog publication."],
        ["Focused Skills", 10, "All use aiq-* names and include SKILL.md, references, and evals."],
        ["Behavioral Eval Cases", 30, "At least 3 per skill, including negative or security scenarios."],
        ["Existing Skill", ".agents/skills/aiq-research retained", "Mapped to aiq-run-research and aiq-manage-jobs instead of replacing the stable helper."],
        ["Primary Tracker", "skills/TRACKER.md", "Markdown execution tracker in source control."],
        ["Excel Tracker", "project-artifacts/trackers/AIQ_Skills_Project_Tracker.xlsx", "Workbook version for program tracking and stakeholder review."],
        ["Word Playbook", "project-artifacts/skills/AIQ_Skills_Playbook.docx", "Generated from skills/PLAYBOOK.md."],
    ]

    work_items = [
        ["ID", "Phase", "Work Item", "Owner", "Priority", "Status", "Start", "Target", "Actual/Next", "Dependency", "Artifact", "Notes"],
        ["AIQ-001", "Inventory", "Inventory existing aiq-research skill", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "AIQ checkout", ".agents/skills/aiq-research", "Stable helper retained and mapped to focused catalog owners."],
        ["AIQ-002", "Inventory", "Inventory AIQ docs, configs, deploy, frontends, sources, and tokenomics", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "AIQ checkout", "README.md; docs/source; configs; deploy; frontends; sources", "Source-of-truth paths captured in playbook and references."],
        ["AIQ-003", "Inventory", "Compare AIQ needs with RAG/VSS skill process", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "RAG/VSS sample", "skills/PLAYBOOK.md", "Same catalog/playbook/tracker/evals/compliance/OpenClaw pattern applied."],
        ["AIQ-004", "Catalog", "Create AIQ skills catalog README", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Inventory", "skills/README.md", "Catalog, install guidance, and existing skill ownership map added."],
        ["AIQ-005", "Catalog", "Scaffold ten focused aiq-* skills", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Catalog design", "skills/aiq-*", "Setup, deploy, research, jobs, agents, tools, knowledge, eval, tokenomics, troubleshoot."],
        ["AIQ-006", "Catalog", "Add skill references for source maps and workflow details", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "AIQ docs", "skills/aiq-*/references/*.md", "Each skill has at least one reference file."],
        ["AIQ-007", "Evals", "Add behavioral evals with negative/security coverage", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Skill scaffold", "skills/aiq-*/evals/evals.json", "Compliance checker validates case shape and safety gates."],
        ["AIQ-008", "Playbook", "Create comprehensive AIQ skills playbook", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "RAG/VSS sample", "skills/PLAYBOOK.md", "Defines naming, metadata, security, review, lifecycle, OpenClaw, and eval standards."],
        ["AIQ-009", "Tracker", "Create Markdown execution tracker", "Skills owner", "Medium", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Playbook", "skills/TRACKER.md", "Tracks phases and publication readiness."],
        ["AIQ-010", "OpenClaw", "Create OpenClaw manifest, workspace docs, and skill symlinks", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Skill catalog", ".openclaw/", "Manifest and workspace docs added. Runtime install remains pending."],
        ["AIQ-011", "Governance", "Add compliance checker and CI gate", "Skills owner", "High", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Skill schema", "scripts/skill_compliance_check.py; .github/workflows/ci.yml", "Checker passes locally for current catalog."],
        ["AIQ-012", "Governance", "Add PR checklist for skills and OpenClaw changes", "Skills owner", "Medium", "Done", "2026-05-11", "2026-05-11", "2026-05-11", "Governance", ".github/PULL_REQUEST_TEMPLATE.md", "Checklist covers evals, destructive confirmation, runtime data handling, and signoff."],
        ["AIQ-013", "Artifacts", "Generate Word playbook", "Skills owner", "Medium", "Done", "2026-05-12", "2026-05-12", "2026-05-12", "skills/PLAYBOOK.md", "project-artifacts/skills/AIQ_Skills_Playbook.docx", "Generated with Pandoc from source Markdown."],
        ["AIQ-014", "Artifacts", "Generate Excel project tracker", "Skills owner", "Medium", "Done", "2026-05-12", "2026-05-12", "2026-05-12", "Tracker model", "project-artifacts/trackers/AIQ_Skills_Project_Tracker.xlsx", "Workbook includes summary, work items, skill catalog, risks, timeline, and review findings."],
        ["AIQ-015", "Hardening", "Deepen references with mode-specific commands and failure paths", "AIQ engineering", "Medium", "In Progress", "2026-05-12", "2026-05-13", "Add examples from local server, Docker, Helm, NAT, eval, and tokenomics runs", "Runtime validation", "skills/aiq-*/references/*.md", "Current references are complete enough for preview; production examples need real run evidence."],
        ["AIQ-016", "Validation", "Run local API/server/UI research workflows with skills", "AIQ engineering", "High", "Todo", "", "2026-05-18", "Capture commands, logs, and fixes", "Working dev environment and keys", "docs/source/integration; frontends", "Do not publish until real local-server workflows are exercised."],
        ["AIQ-017", "Validation", "Run Docker Compose and Helm validation paths", "Deployment owner", "High", "Todo", "", "2026-05-18", "Capture deployment matrix", "Container and cluster access", "deploy/compose; deploy/helm", "Confirm teardown gates and data retention wording."],
        ["AIQ-018", "Security", "Complete security review for keys, external tools, JWT/auth, eval data, and destructive actions", "Security reviewer", "High", "Todo", "", "2026-05-15", "Record signoff and required changes", "Skill package", "SECURITY.md; .github/PULL_REQUEST_TEMPLATE.md", "Required before broader distribution."],
        ["AIQ-019", "OpenClaw", "Validate OpenClaw plugin install and runtime loading", "Skills platform reviewer", "High", "Todo", "", "2026-05-20", "Run install and smoke test", "OpenClaw runtime", ".openclaw/openclaw.plugin.json", "Manifest is scaffolded; runtime install was not run."],
        ["AIQ-020", "Governance", "Assign CODEOWNERS or reviewer teams for skills and OpenClaw", "AIQ maintainers", "Medium", "Todo", "", "2026-05-15", "Add owner mapping", "Team ownership decision", "CODEOWNERS", "Current PR template has placeholders but not enforcement."],
        ["AIQ-021", "Publication", "Approve central skills catalog sync", "Skills publication owner", "Medium", "Todo", "", "2026-05-22", "Catalog publication request approved", "Security and runtime validation", "skills/README.md; .openclaw/", "Publication path still needs platform-owner approval."],
        ["AIQ-022", "Evidence", "Attach sample validated traces, reports, and benchmark outputs", "AIQ engineering", "Medium", "Todo", "", "2026-05-20", "Store sanitized evidence or links", "Runtime validation", "project-artifacts/evidence/", "Use sanitized artifacts only; no secrets, raw prompts, or confidential data."],
    ]

    skills = [
        ["Skill", "Path", "Primary Outcome", "Owner", "Status", "Eval Cases", "OpenClaw Path", "Primary Sources", "Security/Data Gates", "Next Validation"],
        ["aiq-setup-environment", "skills/aiq-setup-environment", "Install dependencies and validate Python, uv, Node, API keys, env files, and local prerequisites.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-setup-environment", "README.md; docs/source/get-started", "Never print secrets; verify env vars by name only.", "Run on clean workstation."],
        ["aiq-deploy-blueprint", "skills/aiq-deploy-blueprint", "Start, verify, stop, or tear down scripts, Docker Compose, Helm, web, API, and NAT deployment modes.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-deploy-blueprint", "deploy/; docs/source/deployment; scripts/", "Confirm destructive teardown and persisted data deletion.", "Smoke test scripts, Compose, Helm."],
        ["aiq-run-research", "skills/aiq-run-research", "Run shallow or deep research through CLI, NAT, local API, web UI, or existing packaged aiq-research helper.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-run-research", "configs/; frontends/; .agents/skills/aiq-research", "Classify confidential prompts before external providers; preserve citations.", "Run CLI, API, web, helper paths."],
        ["aiq-manage-jobs", "skills/aiq-manage-jobs", "Manage async jobs, status, state, reports, SSE events, cancellation, and event-store troubleshooting.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-manage-jobs", "frontends/aiq_api; docs/source/integration/rest-api.md", "Validate job IDs; confirm cancel/delete actions.", "Exercise job lifecycle on local server."],
        ["aiq-configure-agents", "skills/aiq-configure-agents", "Configure agents, LLM roles, prompts, HITL, routing, frontier model settings, and workflow YAML.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-configure-agents", "configs/; src/aiq_agent/agents; docs/source/customization", "Do not reveal API keys; confirm persistent prompt/config changes.", "Run config swap and prompt validation."],
        ["aiq-configure-tools", "skills/aiq-configure-tools", "Configure Tavily, Serper, Exa, Google Scholar, MCP tools, registry entries, and custom tools.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-configure-tools", "sources/; docs/source/customization/tools-and-sources.md", "Check keys without printing; confirm confidential queries before external calls.", "Validate each configured provider path."],
        ["aiq-manage-knowledge", "skills/aiq-manage-knowledge", "Operate LlamaIndex, Chroma, Foundational RAG, ingestion, retrieval, summaries, and TTL/data retention.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-manage-knowledge", "sources/knowledge_layer; src/aiq_agent/knowledge; tests/knowledge_layer_tests", "Classify docs before ingestion; confirm data deletion.", "Run LlamaIndex and foundational RAG scripts."],
        ["aiq-evaluate-benchmarks", "skills/aiq-evaluate-benchmarks", "Run FreshQA, DeepResearch Bench, DeepSearch QA, NAT eval, dataset preparation, and benchmark export workflows.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-evaluate-benchmarks", "frontends/benchmarks; docs/source/evaluation", "Classify datasets; confirm overwrite of benchmark results.", "Run one small benchmark scenario."],
        ["aiq-analyze-tokenomics", "skills/aiq-analyze-tokenomics", "Generate tokenomics, cost, latency, and comparison reports from NAT profiler traces.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-analyze-tokenomics", "src/aiq_agent/tokenomics; docs/source/profiling", "Sanitize traces; confirm publishing or overwriting reports.", "Generate single and comparison reports."],
        ["aiq-troubleshoot-blueprint", "skills/aiq-troubleshoot-blueprint", "Diagnose setup, deployment, API, UI, NAT, tools, jobs, knowledge, eval, and tokenomics failures.", "nvidia-aiq-team", "Done", 3, ".openclaw/skills/aiq-troubleshoot-blueprint", "docs/source/resources/troubleshooting.md; tests/; deploy/", "Read-only diagnostics first; sanitize logs; confirm cleanup actions.", "Run failure-mode drills."],
        ["aiq-research existing helper", ".agents/skills/aiq-research", "Stable packaged local-server helper for routed chat and async job lifecycle.", "existing package owner", "Retained", "", ".claude/skills/aiq-research symlink", ".agents/skills/aiq-research", "No replacement; route overlapping work through focused skills when broader context is needed.", "Keep compatibility tests with local server helper."],
    ]

    risks = [
        ["ID", "Risk", "Impact", "Likelihood", "Mitigation", "Owner", "Status", "Due"],
        ["R-001", "Skills drift from AIQ docs or runtime behavior.", "High", "Medium", "Use source-of-truth links, compliance checks, and runtime validation before publication.", "AIQ engineering", "Open", "2026-05-18"],
        ["R-002", "Secrets leak through examples, logs, traces, or env checks.", "High", "Medium", "Checker scans common secret patterns; skills instruct agents to verify key names without printing values.", "Security reviewer", "Open", "2026-05-15"],
        ["R-003", "External search providers receive confidential prompts or documents.", "High", "Medium", "Skills require data classification and explicit confirmation before external calls.", "Security reviewer", "Open", "2026-05-15"],
        ["R-004", "Destructive cleanup, job cancellation, or persisted-store deletion occurs without approval.", "High", "Low", "Skills and evals require explicit confirmation gates for destructive operations.", "AIQ engineering", "Open", "2026-05-15"],
        ["R-005", "OpenClaw manifest shape changes or runtime install differs from scaffold.", "Medium", "Medium", "Validate against actual OpenClaw runtime before publication.", "Skills platform reviewer", "Open", "2026-05-20"],
        ["R-006", "Existing aiq-research helper and new catalog create trigger overlap.", "Medium", "Medium", "README maps ownership; broad workflows route to aiq-run-research and aiq-manage-jobs while existing helper remains stable.", "Skills owner", "Mitigated", "2026-05-11"],
        ["R-007", "Benchmark or tokenomics artifacts include sensitive user data.", "High", "Medium", "Classify datasets and traces, sanitize evidence, and require confirmation before publishing reports.", "Security reviewer", "Open", "2026-05-20"],
        ["R-008", "CI catches shape issues but not behavioral quality.", "Medium", "High", "Add runtime smoke tests and agent-driven eval review before catalog publication.", "Skills owner", "Open", "2026-05-18"],
    ]

    timeline = [
        ["Milestone", "Start", "Target", "Actual", "Status", "Exit Criteria", "Notes"],
        ["Inventory and comparison", "2026-05-11", "2026-05-11", "2026-05-11", "Done", "Existing helper and AIQ docs mapped to focused skill owners.", "Completed."],
        ["Preview skill catalog", "2026-05-11", "2026-05-11", "2026-05-11", "Done", "Ten focused aiq-* skills with references and evals exist.", "Completed."],
        ["Playbook, tracker, and OpenClaw scaffold", "2026-05-11", "2026-05-11", "2026-05-11", "Done", "Markdown playbook/tracker and OpenClaw manifest/workspace committed.", "Runtime install still pending."],
        ["Compliance and PR gates", "2026-05-11", "2026-05-11", "2026-05-11", "Done", "Checker passes locally and CI job exists.", "CODEOWNERS still pending."],
        ["Stakeholder artifacts", "2026-05-12", "2026-05-12", "2026-05-12", "Done", "Word playbook and Excel project tracker generated.", "This workbook is the tracker artifact."],
        ["Reference deepening", "2026-05-12", "2026-05-13", "", "In Progress", "References include run evidence and mode-specific failure paths.", "Needs real commands/logs from validation."],
        ["Security review", "", "2026-05-15", "", "Todo", "Security reviewer signs off on secret, data, external-provider, auth, and destructive-action gates.", "Required before publication."],
        ["Runtime validation", "", "2026-05-18", "", "Todo", "Local server, CLI/NAT, Docker Compose, Helm, benchmarks, knowledge, and tokenomics smoke-tested.", "Use sanitized evidence."],
        ["OpenClaw runtime validation", "", "2026-05-20", "", "Todo", "Plugin installs and routes skills correctly in OpenClaw.", "Manifest scaffold only so far."],
        ["Publication readiness", "", "2026-05-22", "", "Todo", "Reviewer owners assigned and central catalog publication approved.", "Depends on security and runtime signoff."],
    ]

    findings = [
        ["ID", "Recommendation / Finding", "Decision", "Status", "Evidence", "Owner", "Next Step"],
        ["F-001", "Do not replace the existing packaged aiq-research helper.", "Retain helper and map ownership to focused run/jobs skills.", "Implemented", "skills/README.md; README.md; docs/source/integration/agent-skills.md", "Skills owner", "Keep compatibility during runtime validation."],
        ["F-002", "Use focused skills instead of one broad AIQ skill.", "Create ten aiq-* skills by operational domain.", "Implemented", "skills/aiq-*", "Skills owner", "Deepen references with runtime evidence."],
        ["F-003", "Add evals that test unsafe or negative behavior, not only happy paths.", "Each skill has at least three eval cases and a negative/security scenario.", "Implemented", "skills/aiq-*/evals/evals.json", "Skills owner", "Run behavioral eval harness when available."],
        ["F-004", "Add machine-checkable quality gates.", "Add compliance checker and CI job.", "Implemented", "scripts/skill_compliance_check.py; .github/workflows/ci.yml", "Skills owner", "Extend checker if platform metadata requirements change."],
        ["F-005", "Make OpenClaw packaging explicit.", "Add manifest, workspace docs, and skill symlinks.", "Implemented", ".openclaw/", "Skills platform reviewer", "Validate actual OpenClaw install."],
        ["F-006", "Create comprehensive playbook comparable to VSS/RAG sample.", "Write Markdown source and generate Word artifact.", "Implemented", "skills/PLAYBOOK.md; project-artifacts/skills/AIQ_Skills_Playbook.docx", "Skills owner", "Collect reviewer comments in this tracker."],
        ["F-007", "Create a project tracker with done, todo, timeline, risks, and ownership.", "Generate Excel workbook with six tracking sheets.", "Implemented", "project-artifacts/trackers/AIQ_Skills_Project_Tracker.xlsx", "Skills owner", "Use workbook to run remaining validation."],
        ["F-008", "Require explicit confirmation before destructive workflows.", "Add wording to deploy/jobs/knowledge/eval/tokenomics/troubleshoot skills and eval gates.", "Implemented", "skills/aiq-*/SKILL.md; evals", "AIQ engineering", "Verify with live runbooks."],
        ["F-009", "Protect API keys, JWT/auth data, prompts, documents, datasets, traces, and reports.", "Add data-classification and no-secret handling across skills.", "Implemented", "skills/PLAYBOOK.md; skill evals; PR checklist", "Security reviewer", "Complete formal security review."],
        ["F-010", "Clarify publication path and reviewer ownership.", "Track as remaining governance work.", "Todo", "skills/TRACKER.md; this workbook", "AIQ maintainers", "Assign CODEOWNERS or equivalent reviewers."],
    ]

    return {
        "Summary": (summary, [24, 48, 82]),
        "Work Items": (work_items, [12, 16, 42, 22, 12, 14, 13, 13, 30, 26, 45, 54]),
        "Skills Catalog": (skills, [28, 36, 58, 22, 14, 12, 42, 52, 58, 38]),
        "Risk Register": (risks, [10, 54, 14, 16, 72, 24, 14, 13]),
        "Timeline": (timeline, [34, 13, 13, 13, 14, 72, 42]),
        "Review Findings": (findings, [10, 62, 52, 14, 62, 24, 42]),
    }


def main() -> int:
    repo_root = Path(os.environ.get("AIQ_REPO_ROOT", Path(__file__).resolve().parents[1]))
    workbook = repo_root / "project-artifacts" / "trackers" / "AIQ_Skills_Project_Tracker.xlsx"
    write_xlsx(workbook, workbook_data())
    print(workbook)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
