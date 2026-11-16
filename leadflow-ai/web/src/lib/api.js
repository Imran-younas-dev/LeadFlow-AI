import { mockLeads } from '../data/mockLeads.js'

const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL
const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL

export const formUsesMock = !WEBHOOK_URL
export const dashboardUsesMock = !DASHBOARD_URL
export const isMockMode = formUsesMock && dashboardUsesMock

const STORAGE_KEY = 'leadflow_mock_leads_v2'

function loadMock() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return saved ?? mockLeads
  } catch {
    return mockLeads
  }
}

function saveMock(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch {
    /* storage can fail; ignore in mock mode */
  }
}

// Fake scoring so the UI shows badges before the real LLM exists (Day 6-8 replaces this).
function fakeScore({ message = '', budget_range = '' }) {
  const text = message.toLowerCase()
  const links = (text.match(/http/g) || []).length
  if (links >= 2 || /casino|seo|crypto|backlinks/.test(text)) {
    return { category: 'spam', score: 3, summary: 'Looks like promotional spam.' }
  }
  const urgent = /urgent|asap|this week|deadline|before/.test(text)
  const hasBudget = budget_range && !/not sure/i.test(budget_range)
  if (urgent && hasBudget) return { category: 'hot', score: 88, summary: 'Clear need, budget stated, urgent timeline.' }
  if (hasBudget || urgent) return { category: 'warm', score: 62, summary: 'Real interest but missing budget or timeline.' }
  return { category: 'cold', score: 25, summary: 'Vague inquiry with no budget or timeline.' }
}

function statusFor(category) {
  if (category === 'spam') return 'dropped'
  if (category === 'hot') return 'alerted'
  if (category === 'cold') return 'logged'
  return 'auto_replied'
}

export async function submitLead(lead) {
  if (WEBHOOK_URL) {
    const res = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`)
    return data
  }

  // Mock path. The honeypot is not stored.
  await new Promise((r) => setTimeout(r, 600))
  const { website_url_confirm, ...fields } = lead
  const honeypotHit = Boolean((website_url_confirm || '').trim())
  const result = honeypotHit
    ? { category: 'spam', score: 0, summary: 'Honeypot field was filled.' }
    : fakeScore(fields)
  const saved = {
    lead_id: `L-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...fields,
    ...result,
    status: statusFor(result.category),
    reply_draft: result.category === 'hot' ? `Hi ${fields.name}, thanks for reaching out. We would love to talk this week.` : '',
  }
  saveMock([saved, ...loadMock()])
  return { ok: true, lead_id: saved.lead_id }
}

export async function fetchLeads(apiKey) {
  if (DASHBOARD_URL) {
    const res = await fetch(DASHBOARD_URL, { headers: { 'x-api-key': apiKey || '' } })
    if (res.status === 401) throw new Error('Wrong or missing API key')
    if (!res.ok) throw new Error(`Request failed (${res.status})`)
    const data = await res.json()
    return Array.isArray(data) ? data : data.leads || []
  }
  return loadMock()
}

export const needsApiKey = Boolean(DASHBOARD_URL)
