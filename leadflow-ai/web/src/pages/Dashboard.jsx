import { Fragment, useEffect, useState } from 'react'
import { fetchLeads, needsApiKey } from '../lib/api.js'

const FILTERS = ['all', 'hot', 'warm', 'cold', 'spam']

export default function Dashboard() {
  const [leads, setLeads] = useState([])
  const [filter, setFilter] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [apiKey, setApiKey] = useState('') // kept in memory only
  const [hasLoaded, setHasLoaded] = useState(false)
  const [state, setState] = useState({ loading: !needsApiKey, error: '' })

  async function load() {
    setState({ loading: true, error: '' })
    try {
      const data = await fetchLeads(apiKey)
      setLeads([...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      setHasLoaded(true)
      setState({ loading: false, error: '' })
    } catch (err) {
      setState({ loading: false, error: err.message })
    }
  }

  useEffect(() => {
    if (!needsApiKey) load()
  }, [])

  const visible = filter === 'all' ? leads : leads.filter((l) => l.category === filter)

  return (
    <div>
      <h1>Leads</h1>

      {needsApiKey && (
        <div className="keyrow">
          <label htmlFor="dashboard-key">
            Dashboard API key
            <input id="dashboard-key" type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} autoComplete="off" />
          </label>
          <button type="button" className="primary small" onClick={load}>Load</button>
        </div>
      )}

      <div className="chips" role="group" aria-label="Filter by category">
        {FILTERS.map((f) => (
          <button type="button" key={f} className={filter === f ? 'chip active' : 'chip'} aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {state.loading && <p role="status">Loading...</p>}
      {state.error && <p className="msg err" role="alert">{state.error}</p>}
      {needsApiKey && !hasLoaded && !state.loading && !state.error && (
        <p className="empty-note">Enter the dashboard key and press Load.</p>
      )}

      {hasLoaded && !state.loading && !state.error && (
        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Score</th>
                <th>Category</th>
                <th>Summary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr><td colSpan="6" className="empty">{leads.length === 0 ? 'No leads yet.' : 'No leads in this category.'}</td></tr>
              )}
              {visible.map((l) => (
                <Fragment key={l.lead_id}>
                  <tr
                    className="row"
                    tabIndex={0}
                    aria-expanded={openId === l.lead_id}
                    onClick={() => setOpenId(openId === l.lead_id ? null : l.lead_id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setOpenId(openId === l.lead_id ? null : l.lead_id)
                      }
                    }}
                  >
                    <td>{l.name}</td>
                    <td>{l.company || '-'}</td>
                    <td>{l.score}</td>
                    <td><span className={`badge ${l.category}`}>{l.category}</span></td>
                    <td>{l.summary}</td>
                    <td>{l.status}</td>
                  </tr>
                  {openId === l.lead_id && (
                    <tr className="detail">
                      <td colSpan="6">
                        <p><strong>Message:</strong> {l.message}</p>
                        {l.reply_draft && <p><strong>Drafted reply:</strong> {l.reply_draft}</p>}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
