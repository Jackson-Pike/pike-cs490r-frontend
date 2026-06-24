import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Auth.css'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [globalError, setGlobalError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const passwordsMatch = password === confirmPassword

  function validate() {
    const errors = {}

    if (!username.trim()) {
      errors.username = 'Username is required.'
    } else if (username.includes(' ')) {
      errors.username = 'Username cannot contain spaces.'
    } else if (username.length < 3) {
      errors.username = 'Username must be at least 3 characters.'
    }

    if (!email.trim() || !email.includes('@')) {
      errors.email = 'A valid email address is required.'
    }

    if (!password) {
      errors.password = 'Password is required.'
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.'
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.'
      // Also flag the password field so both underlines turn red
      errors.password = errors.password ?? 'Passwords do not match.'
    }

    return errors
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setGlobalError(null)

    const errors = validate()
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
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
        if (Array.isArray(data.errors) && data.errors.length > 0) {
          const mapped = {}
          let fallback = null
          data.errors.forEach((err) => {
            if (err.path === 'username' || err.path === 'email' || err.path === 'password') {
              mapped[err.path] = err.msg
            } else {
              fallback = fallback ?? err.msg
            }
          })
          setFieldErrors(mapped)
          if (fallback && Object.keys(mapped).length === 0) setGlobalError(fallback)
        } else {
          // Race-condition fallback or generic error shape
          setGlobalError(data.error ?? 'Signup failed.')
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
        <h1 className="auth-heading">Create your account</h1>
        <p className="auth-sub">Join PikeDB to rate and track films</p>

        {globalError && <div className="auth-error">{globalError}</div>}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className={`input-group${fieldErrors.username ? ' input-error' : ''}`}>
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
            {fieldErrors.username && (
              <span className="field-error">{fieldErrors.username}</span>
            )}
          </div>

          <div className={`input-group${fieldErrors.email ? ' input-error' : ''}`}>
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
            {fieldErrors.email && (
              <span className="field-error">{fieldErrors.email}</span>
            )}
          </div>

          <div className={`input-group${fieldErrors.password ? ' input-error' : ''}`}>
              <input
                id="signup-password"
                className="has-toggle"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete="new-password"
              />
            <label htmlFor="signup-password">Password</label>
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

          <div className={`input-group${fieldErrors.confirmPassword ? ' input-error' : ''}`}>
              <input
                id="signup-confirm"
                className="has-toggle"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete="new-password"
              />
            <label htmlFor="signup-confirm">Confirm Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            {confirmPassword.length > 0 && (
              <span className={`password-match-hint${passwordsMatch ? ' match' : ' no-match'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords don\'t match yet'}
              </span>
            )}
            {fieldErrors.confirmPassword && (
              <span className="field-error">{fieldErrors.confirmPassword}</span>
            )}
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
