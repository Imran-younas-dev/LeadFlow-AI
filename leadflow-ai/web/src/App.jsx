import { useState } from 'react'
import LeadForm from './pages/LeadForm.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { isMockMode } from './lib/api.js'

export default function App() {
  const [page, setPage] = useState('form')

  return (
    <>
      <header className="topbar">
        <strong className="brand">LeadFlow AI</strong>
        <nav>
          <button className={page === 'form' ? 'link active' : 'link'} onClick={() => setPage('form')}>
            Submit lead
          </button>
          <button className={page === 'dashboard' ? 'link active' : 'link'} onClick={() => setPage('dashboard')}>
            Dashboard
          </button>
        </nav>
      </header>

      {isMockMode && (
        <div className="banner">Mock mode: no n8n connected yet. Leads are scored by a fake rule and saved in your browser.</div>
      )}

      <main className="container">{page === 'form' ? <LeadForm /> : <Dashboard />}</main>
    </>
  )
}
