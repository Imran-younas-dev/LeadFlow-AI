# Research

Read on 16 Nov 2026. Each note is taken from the public description of that project. Weaknesses are gaps in that description, not a claim that the author has no private handling.

## 1. Qualify inbound leads from forms with Claude, Google Sheets, Slack and Gmail

- Source: Keith Uy, n8n template 16290. https://n8n.io/workflows/16290-qualify-inbound-leads-from-forms-with-claude-google-sheets-slack-and-gmail/
- Problem: inbound form leads need a fit score before a person spends time on them.
- Trigger: an n8n Form submission (name, email, website, budget, needs).
- AI step: Claude scores the submission against a plain-language ideal-customer profile and returns a fit score, tier, reasoning, and next action.
- Tools: n8n, Claude, Google Sheets, Slack, Gmail.
- Output: every lead is appended to a Leads sheet. If the score meets a threshold, Slack and Gmail alert the team.
- Weakness: the published flow notifies only above one threshold. It does not describe a checked JSON schema, a `needs_manual_review` path when the model fails, or a labelled test set.

## 2. Score and route inbound leads with Claude, HubSpot, Slack, and Gmail

- Source: Amplence, n8n template 19767. https://n8n.io/workflows/19767-score-and-route-inbound-leads-with-claude-hubspot-slack-and-gmail/
- Problem: website form posts should become a scored contact, with a short alert for the ones worth a fast reply.
- Trigger: `POST` webhook. The workflow normalizes name, email, company, website, message, and source, and alerts Slack if email or message is missing.
- AI step: fetch the company site, then call the Claude Messages API for a 0–100 score, reasons, concerns, summary, and next step. The workflow, not the model, assigns hot, warm, cold, or review when parsing fails.
- Tools: n8n, Claude over HTTP, HubSpot, Slack, Gmail.
- Output: hot leads get a Slack brief, warm and hot leads get an acknowledgement email, and scored leads are upserted in HubSpot.
- Weakness: hot leads still receive an automatic email. The published description does not separate spam from cold, and it does not publish accuracy or cost on a fixed set of leads.

## 3. Lead qualifier that scores inbound enquiries and drafts the reply

- Source: Ahmed ElTigi, n8n community, 5 Aug 2026. https://community.n8n.io/t/lead-qualifier-that-scores-inbound-enquiries-and-drafts-the-reply/306355
- Problem: a person should not read every enquiry before knowing the score and having a draft reply.
- Trigger: webhook.
- AI step: a Code node builds the prompt, an HTTP Request calls Claude through OpenRouter, and a Code node checks the shape (with a regex fallback if the JSON is fenced).
- Tools: n8n, Claude via OpenRouter, Google Sheets, Slack.
- Output: a score out of 100, a short reason, and a drafted reply, in about nine seconds on the author's runs. Slack pings only at 70 or above. Lower scores are logged.
- Weakness: the prompt lives inside a Code node, so it is not a versioned text file. The post does not describe honeypot or injection tests, a dashboard, or a count of labelled leads used to check the score.

## What LeadFlow AI keeps from these

Use a webhook, force structured JSON, validate it in code, store every lead, and alert a human for the best ones. Add the pieces these write-ups leave out: validation before the model call, hot leads drafted for a person instead of auto-sent, a failure status that still saves the lead, and a results section that only quotes numbers measured on `test-data/leads.json`.
