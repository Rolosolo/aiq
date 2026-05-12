# Deployment Reference

| Mode | Source | Verification |
|---|---|---|
| CLI | `scripts/start_cli.sh`, `configs/config_cli_default.yml` | CLI starts and accepts a query |
| Web local | `scripts/start_e2e.sh`, `configs/config_web_default_llamaindex.yml` | API `localhost:8000`, UI `localhost:3000` |
| Docker Compose | `deploy/compose/docker-compose.yaml`, `deploy/.env` | containers up and API reachable |
| Helm | `deploy/helm/deployment-k8s/values.yaml` | pods ready and service reachable |
| NAT serve/run | NAT docs and configs | NAT command returns or serves |

Confirm before deleting databases, volumes, jobs, or event stores.

