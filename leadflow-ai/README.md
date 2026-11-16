# LeadFlow AI (starter)

AI lead qualification and routing. This starter gives you a working UI in **mock mode** so you can see something on screen today. The real automation (n8n + Claude) is added day by day from `20-day-plan.md`.

## Run the UI (2 minutes)

Requirements: Node.js 18+ (20 recommended).

```bash
cd web
npm install
npm run dev
```

Open http://localhost:5173

- **Submit lead** page: fill the form and submit. In mock mode a fake rule scores it and saves it in your browser.
- **Dashboard** page: see leads in a table, filter by Hot / Warm / Cold / Spam, click a row to expand the message and drafted reply.

## Run n8n (when you reach Day 2)

```bash
docker compose up -d
```

Open http://localhost:5678 and create your owner account.

## Connect the UI to n8n (Day 15/16)

1. In n8n, activate your workflow and copy the **production** webhook URL.
2. Edit `web/.env`:

```
VITE_WEBHOOK_URL=http://localhost:5678/webhook/lead-intake
VITE_DASHBOARD_URL=http://localhost:5678/webhook/leads
```

3. In the n8n Webhook node, set **Allowed Origins** to `http://localhost:5173` (CORS).
4. Restart `npm run dev`. The "Mock mode" banner disappears.

## Folder map

```
web/        React (Vite) UI: lead form + dashboard
workflows/  exported n8n workflow JSON (one per workflow)
prompts/    LLM system prompts as text files
schemas/    JSON schema for the structured LLM output
test-data/  labelled test leads
docs/       research, architecture, evaluation notes
```

## Scripts (inside `web/`)

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `web/dist` |
| `npm run preview` | Preview the production build locally |
