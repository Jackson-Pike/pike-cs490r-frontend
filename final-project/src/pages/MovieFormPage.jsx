import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './MovieFormPage.css'

const API = import.meta.env.VITE_API_URL

const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR']
const GENRES = ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Animation', 'Documentary', 'Fantasy']

const EMPTY_FORM = {
  title: '',
  director: '',
  genre: '',
  releaseDate: '',
  runtime: '',
  maturity_rating: '',
  poster_url: '',
  synopsis: '',
}

export default function MovieFormPage() {
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const body = { ...form }
      if (body.runtime) body.runtime = Number(body.runtime)
      Object.keys(body).forEach((k) => { if (body[k] === '') delete body[k] })

      const res = await fetch(`${API}/api/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }
      const movie = await res.json()
      navigate(`/movies/${movie._id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mfp">
      <div className="mfp__back-row">
        <button className="mfp__back-btn" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <div className="mfp__shell">
        <h1 className="mfp__heading">Add Movie</h1>
        {error && <p className="mfp__error">{error}</p>}
        <form className="mfp__form" onSubmit={handleSubmit} noValidate>

          <div className="mfp__field">
            <label className="mfp__label" htmlFor="title">Title *</label>
            <input id="title" name="title" className="mfp__input" value={form.title} onChange={handleChange} required />
          </div>

          <div className="mfp__field">
            <label className="mfp__label" htmlFor="director">Director</label>
            <input id="director" name="director" className="mfp__input" value={form.director} onChange={handleChange} />
          </div>

          <div className="mfp__field">
            <label className="mfp__label" htmlFor="genre">Genre</label>
            <select id="genre" name="genre" className="mfp__input" value={form.genre} onChange={handleChange}>
              <option value="">—</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div className="mfp__row">
            <div className="mfp__field">
              <label className="mfp__label" htmlFor="releaseDate">Release Date</label>
              <input id="releaseDate" name="releaseDate" type="date" className="mfp__input" value={form.releaseDate} onChange={handleChange} />
            </div>
            <div className="mfp__field">
              <label className="mfp__label" htmlFor="runtime">Runtime (min)</label>
              <input id="runtime" name="runtime" type="number" min="1" className="mfp__input" value={form.runtime} onChange={handleChange} />
            </div>
            <div className="mfp__field">
              <label className="mfp__label" htmlFor="maturity_rating">Rating</label>
              <select id="maturity_rating" name="maturity_rating" className="mfp__input" value={form.maturity_rating} onChange={handleChange}>
                <option value="">—</option>
                {MATURITY_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="mfp__field">
            <label className="mfp__label" htmlFor="poster_url">Poster URL</label>
            <input id="poster_url" name="poster_url" type="url" className="mfp__input" value={form.poster_url} onChange={handleChange} />
          </div>

          <div className="mfp__field">
            <label className="mfp__label" htmlFor="synopsis">Synopsis</label>
            <textarea id="synopsis" name="synopsis" className="mfp__input mfp__textarea" value={form.synopsis} onChange={handleChange} rows={5} />
          </div>

          <div className="mfp__actions">
            <button type="submit" className="mfp__btn mfp__btn--primary" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add Movie'}
            </button>
            <button type="button" className="mfp__btn mfp__btn--ghost" onClick={() => navigate(-1)} disabled={submitting}>
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
