'use client'

import { useState } from 'react'

export default function StarterKitBlock({
  eyebrow,
  heading,
  lede,
  bulletPoints,
  bookImage,
  bookLabel = 'Fast Company Press',
  buttonLabel = 'Get the PPP Starter Kit',
}: any) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'starter-kit' }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
      setEmail('')
    } catch (err) {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again or contact us directly.')
    }
  }

  const bookUrl = bookImage?.url || '/images/ppp-book.png'

  return (
    <section className="starter">
      <div className="container">
        <div className="starter__grid">
          <div className="starter__content">
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <div className="accent-line" />
            <h2 className="h2">{heading}</h2>
            {lede && <p className="lede starter__lede">{lede}</p>}
            <ul className="starter__bullets">
              {(bulletPoints || []).map((b: any, i: number) => (
                <li key={i} className="starter__bullet">{b.text}</li>
              ))}
            </ul>
            {status === 'success' ? (
              <div className="starter__success" style={{ padding: '1rem', background: 'rgba(4,147,213,0.08)', borderLeft: '3px solid var(--ow-blue)', borderRadius: '8px' }}>
                <strong style={{ color: 'var(--ow-blue)' }}>Check your inbox.</strong>
                <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>The PPP Starter Kit is on its way.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Your email"
                  style={{
                    flex: '1 1 260px',
                    padding: '12px 16px',
                    border: '1px solid var(--ow-gray-light)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'white',
                  }}
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn btn-primary btn-arrow"
                  style={{ background: 'var(--ow-blue)', color: 'white' }}
                >
                  {status === 'submitting' ? 'Sending...' : buttonLabel}
                </button>
              </form>
            )}
            {errorMsg && <p style={{ marginTop: '0.5rem', color: '#c53030', fontSize: '14px' }}>{errorMsg}</p>}
            <p style={{ marginTop: '1rem', fontSize: '12px', color: 'var(--text-dark-muted)' }}>
              No spam. Unsubscribe anytime.
            </p>
          </div>
          <div className="starter__book">
            <img src={bookUrl} alt="Peak Property Performance — Bill Douglas, Drew Hall, Ryan R. Goble. Fast Company Press." />
          </div>
        </div>
      </div>
    </section>
  )
}
