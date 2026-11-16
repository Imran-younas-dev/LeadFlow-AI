# LeadFlow AI

Portfolio project: a website form sends a lead to n8n. n8n validates it, asks Claude for structured JSON, routes hot / warm / cold / spam, stores the row in Google Sheets, and serves a small React dashboard. A failed run must still save the lead.

## Current status

- Updated: 16 Nov 2026.
- Git branch: `main`. Day 1 "done when" is met by `docs/research.md`, `docs/problem.md`, and `docs/architecture.md`.
- Next day: **Day 2** (`day-02-n8n-setup`). Run n8n, connect credentials, and append one test row to Google Sheets. Do not start a second workflow.
- In the repo now: mock React form and dashboard, `docker-compose.yml` (n8n bound to `127.0.0.1:5678`), `schemas/lead-score.schema.json`, and `test-data/leads.json` (sample leads, six invalid inputs, one honeypot lead).
- Not built yet: `prompts/`, exported workflows, Google Sheet, evaluation numbers, deployment.
- Mock behavior: both Vite URLs empty means the form and dashboard stay in the browser. A filled honeypot is stored as spam / `dropped`. Cold is `logged`, hot is `alerted`, warm is `auto_replied`. The banner stays up until both `VITE_WEBHOOK_URL` and `VITE_DASHBOARD_URL` are set.
- Results: none measured. Do not put accuracy, latency, or cost in the README until `docs/evaluation.md` has a real run.

The schedule is `../20-day-plan.md` at the git root.
