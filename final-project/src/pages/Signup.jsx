import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    // TODO(human): add a client-side validation guard here.
    // Before we spend a network round-trip, catch obviously-bad input
    // and reject it early. Decide what "valid enough to submit" means
    // for this form, set an error message, and `return` if it fails.
    // (e.g. a minimum password length — the backend should still check
    // too, but failing fast is kinder to the user.)

    setSubmitting(true)
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth/signup`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.error ?? 'Signup failed')
        return
      }
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">PikeDB</Link>
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Join PikeDB to rate and track films</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              id="signup-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
              autoComplete="username"
            />
            <label htmlFor="signup-username">Username</label>
          </div>

          <div className="input-group">
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              autoComplete="email"
            />
            <label htmlFor="signup-email">Email</label>
          </div>

          <div className="input-group">
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              autoComplete="new-password"
            />
            <label htmlFor="signup-password">Password</label>
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}
