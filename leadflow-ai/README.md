# LeadFlow AI (starter)

AI lead qualification and routing. This starter gives you a working UI in **mock mode** so you can see something on screen today. The real automation (n8n + Claude) is added day by day from [`../20-day-plan.md`](../20-day-plan.md).

Day 1 research, the problem statement, and the architecture are in `docs/`. No accuracy, latency, or cost number has been measured yet.

## Run the UI (2 minutes)

Requirements: Node.js 18+ (20 recommended).

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173

- **Submit lead** page: fill the form and submit. In mock mode a fake rule scores it and saves it in your browser. A filled honeypot is stored as spam. Cold leads are `logged`, hot leads are `alerted`, warm leads are `auto_replied`.
- **Dashboard** page: see leads in a table, filter by Hot / Warm / Cold / Spam, click a row or press Enter to expand the message and drafted reply.

## Run n8n (when you reach Day 2)

```bash
docker compose up -d
```

Open http://127.0.0.1:5678 and create your owner account. The port is bound to localhost only.

## Connect the UI to n8n (Day 15/16)

1. In n8n, activate your workflow and copy the **production** webhook URL.
2. Edit `web/.env`:

```
VITE_WEBHOOK_URL=http://localhost:5678/webhook/lead-intake
VITE_DASHBOARD_URL=http://localhost:5678/webhook/leads
```

3. In the n8n Webhook node, set **Allowed Origins** to `http://localhost:5173` (CORS).
4. Restart `npm run dev`. The banner disappears only when both URLs are set. If only one is set, the banner says which side is still mocked.

## Folder map

```
web/        React (Vite) UI: lead form + dashboard
workflows/  empty until each n8n workflow is exported
prompts/    empty until the system prompts are written
schemas/    JSON schema for the structured LLM output
test-data/  labelled sample leads, six invalid inputs, one honeypot lead
docs/       research, problem, architecture, current status
```

## Scripts (inside `web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `web/dist` |
| `npm run preview` | Preview the production build locally |
