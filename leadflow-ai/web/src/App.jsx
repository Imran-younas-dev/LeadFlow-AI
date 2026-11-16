import { useState } from 'react'
import LeadForm from './pages/LeadForm.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { formUsesMock, dashboardUsesMock } from './lib/api.js'

export default function App() {
  const [page, setPage] = useState('form')

  return (
    <>
      <header className="topbar">
        <strong className="brand">LeadFlow AI</strong>
        <nav>
          <button type="button" className={page === 'form' ? 'link active' : 'link'} aria-current={page === 'form' ? 'page' : undefined} onClick={() => setPage('form')}>
            Submit lead
          </button>
          <button type="button" className={page === 'dashboard' ? 'link active' : 'link'} aria-current={page === 'dashboard' ? 'page' : undefined} onClick={() => setPage('dashboard')}>
            Dashboard
          </button>
        </nav>
      </header>

      {formUsesMock && dashboardUsesMock && (
        <div className="banner">Mock mode: no n8n connected yet. Leads are scored by a fake rule and saved in your browser.</div>
      )}
      {!formUsesMock && dashboardUsesMock && (
        <div className="banner">The form posts to n8n. The dashboard still uses browser data until VITE_DASHBOARD_URL is set.</div>
      )}
      {formUsesMock && !dashboardUsesMock && (
        <div className="banner">The dashboard reads n8n. The form stays in mock mode until VITE_WEBHOOK_URL is set.</div>
      )}

      <main className="container">{page === 'form' ? <LeadForm /> : <Dashboard />}</main>
    </>
  )
}
