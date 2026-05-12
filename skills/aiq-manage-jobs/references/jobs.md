# Jobs Reference

| Goal | Source |
|---|---|
| Async API lifecycle | `frontends/aiq_api/README.md` |
| Helper script commands | `.agents/skills/aiq-research/SKILL.md` |
| Job routes implementation | `frontends/aiq_api/src/aiq_api/routes/jobs.py` |

Terminal states should be reported directly. Non-terminal states may continue
polling. Failed/cancelled states should not be retried automatically.

