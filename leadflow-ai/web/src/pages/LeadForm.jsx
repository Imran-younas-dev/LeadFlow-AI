import { useState } from 'react'
import { submitLead } from '../lib/api.js'

const empty = {
  name: '',
  email: '',
  company: '',
  website: '',
  budget_range: 'Not sure',
  message: '',
  website_url_confirm: '', // honeypot: real users never fill this
}

export default function LeadForm() {
  const [form, setForm] = useState(empty)
  const [state, setState] = useState({ status: 'idle', message: '' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setState({ status: 'sending', message: '' })
    try {
      await submitLead(form)
      setState({ status: 'success', message: 'Thanks! We will reply shortly.' })
      setForm(empty)
    } catch (err) {
      setState({ status: 'error', message: err.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <div className="card">
      <h1>Tell us about your project</h1>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={update} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={update} required />
        </label>
        <label>
          Company
          <input name="company" value={form.company} onChange={update} />
        </label>
        <label>
          Website
          <input name="website" value={form.website} onChange={update} placeholder="https://" />
        </label>
        <label>
          Budget range
          <select name="budget_range" value={form.budget_range} onChange={update}>
            <option>Not sure</option>
            <option>Under $1k</option>
            <option>$1k-$2k</option>
            <option>$2k-$5k</option>
            <option>$5k+</option>
          </select>
        </label>
        <label>
          Message
          <textarea name="message" rows="5" value={form.message} onChange={update} minLength="10" maxLength="2000" required />
        </label>

        {/* honeypot */}
        <input name="website_url_confirm" value={form.website_url_confirm} onChange={update} className="hp" tabIndex="-1" autoComplete="off" aria-hidden="true" />

        <button className="primary" type="submit" disabled={state.status === 'sending'}>
          {state.status === 'sending' ? 'Sending...' : 'Submit'}
        </button>

        {state.status === 'success' && <p className="msg ok" role="status" aria-live="polite">{state.message}</p>}
        {state.status === 'error' && <p className="msg err" role="status" aria-live="polite">{state.message}</p>}
      </form>
    </div>
  )
}
