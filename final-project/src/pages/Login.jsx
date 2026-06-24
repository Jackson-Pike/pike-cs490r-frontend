import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setGlobalError(null)
    setFieldErrors({})

    try {
      const url = `${import.meta.env.VITE_API_URL}/api/auth/login`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      })

      const data = await response.json()

      if (!response.ok) {
        // Array of per-field validation errors
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const mapped = {}
          let fallback = null
          data.errors.forEach((err) => {
            if (err.path === 'identifier' || err.path === 'email') {
              mapped.identifier = err.msg
            } else if (err.path === 'password') {
              mapped.password = err.msg
            } else {
              fallback = fallback ?? err.msg
            }
          })
          setFieldErrors(mapped)
          if (fallback && Object.keys(mapped).length === 0) setGlobalError(fallback)
        } else {
          // Single-error shape: { "error": "..." }
          setGlobalError(data.error ?? 'Login failed.')
        }
        return
      }

      login(data.token, data.user)
      navigate('/')
    } catch {
      setGlobalError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/" className="auth-logo">PikeDB</Link>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to continue</p>

        {globalError && <div className="auth-error">{globalError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`input-group${fieldErrors.identifier ? ' input-error' : ''}`}>
            <input
              id="login-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder=" "
              required
              autoComplete="username"
            />
            <label htmlFor="login-identifier">Email or Username</label>
            {fieldErrors.identifier && (
              <span className="field-error">{fieldErrors.identifier}</span>
            )}
          </div>

          <div className={`input-group${fieldErrors.password ? ' input-error' : ''}`}>
              <input
                id="login-password"
                className="has-toggle"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete="current-password"
              />
            <label htmlFor="login-password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            {fieldErrors.password && (
              <span className="field-error">{fieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
