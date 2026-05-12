## Description

<!-- Provide a standalone description of changes in this PR. -->

## Checklist

- [ ] New or existing tests cover these changes.
- [ ] Documentation is up to date.
- [ ] I did not include credentials, tokens, or sensitive data.

## Skills / OpenClaw Changes

<!-- Complete when touching skills/**, .openclaw/**, or scripts/skill_compliance_check.py. -->

- [ ] I ran `python3 scripts/skill_compliance_check.py --skills-dir skills --openclaw-dir .openclaw --prefix aiq --strict`.
- [ ] Skill changes have updated `evals/evals.json` with positive and negative/security cases.
- [ ] Destructive actions require explicit confirmation.
- [ ] Runtime data classification and secret-handling gates are documented.
- [ ] Reviewer/approver signoff is recorded per `skills/PLAYBOOK.md`.
