import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ReviewsSection from './ReviewsSection'
import './MovieDetail.css'

const API = import.meta.env.VITE_API_URL
const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR']
const GENRES = ['Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Animation', 'Documentary', 'Fantasy']

export default function MovieDetail({ movie }) {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const isAdmin = user?.role === 'admin'

  // Local copy of movie — updated after a successful PATCH
  const [localMovie, setLocalMovie] = useState(movie)

  // Edit state: null = not editing, object = draft fields
  const [draft, setDraft] = useState(null)
  const [saveError, setSaveError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deleteState, setDeleteState] = useState('idle') // 'idle' | 'confirming' | 'deleting'
  const [deleteError, setDeleteError] = useState(null)

  const releaseYear = localMovie.releaseDate
    ? new Date(localMovie.releaseDate).getFullYear()
    : null

  const releaseFormatted = localMovie.releaseDate
    ? new Date(localMovie.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  // releaseDate formatted for <input type="date"> (YYYY-MM-DD)
  const releaseDateInputValue = localMovie.releaseDate
    ? new Date(localMovie.releaseDate).toISOString().slice(0, 10)
    : ''

  function startEdit() {
    setSaveError(null)
    setDraft({
      title: localMovie.title ?? '',
      director: localMovie.director ?? '',
      genre: localMovie.genre ?? '',
      releaseDate: releaseDateInputValue,
      runtime: localMovie.runtime ?? '',
      maturity_rating: localMovie.maturity_rating ?? '',
      poster_url: localMovie.poster_url ?? '',
      synopsis: localMovie.synopsis ?? '',
    })
  }

  function cancelEdit() {
    setDraft(null)
    setSaveError(null)
  }

  function handleDraftChange(e) {
    const { name, value } = e.target
    setDraft((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    setSaveError(null)
    if (!draft.title.trim()) {
      setSaveError('Title is required.')
      return
    }
    setSaving(true)
    try {
      const body = { ...draft }
      if (body.runtime) body.runtime = Number(body.runtime)
      Object.keys(body).forEach((k) => { if (body[k] === '') delete body[k] })

      const res = await fetch(`${API}/api/movies/${localMovie._id}`, {
        method: 'PATCH',
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
      const updated = await res.json()
      setLocalMovie(updated)
      setDraft(null)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleteState('deleting')
    setDeleteError(null)
    try {
      const res = await fetch(`${API}/api/movies/${localMovie._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }
      navigate('/')
    } catch (err) {
      setDeleteError(err.message)
      setDeleteState('confirming')
    }
  }

  const editing = draft !== null

  return (
    <>
      <div className="movie-detail__back-row">
        <button className="movie-detail__back-btn" onClick={() => navigate('/')}>
          ← Back to Catalog
        </button>
      </div>

      <article className="movie-detail">
        {/* Left column — poster */}
        <div className="movie-detail__poster-col">
          <div className="movie-detail__poster-frame">
            <img
              src={editing ? (draft.poster_url || localMovie.poster_url) : localMovie.poster_url}
              alt={`${localMovie.title} poster`}
              className="movie-detail__poster-img"
            />
          </div>
          {editing && (
            <div className="movie-detail__field movie-detail__poster-url-field">
              <label className="movie-detail__label" htmlFor="poster_url">Poster URL</label>
              <input
                id="poster_url"
                name="poster_url"
                className="movie-detail__input"
                value={draft.poster_url}
                onChange={handleDraftChange}
                type="url"
              />
            </div>
          )}
        </div>

        {/* Right column — metadata */}
        <div className="movie-detail__meta-col">

          {/* Admin edit actions */}
          {editing ? (
            <div className="movie-detail__edit-actions">
              {saveError && <span className="movie-detail__save-error">{saveError}</span>}
              <button className="movie-detail__admin-btn movie-detail__admin-btn--save" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button className="movie-detail__admin-btn" onClick={cancelEdit} disabled={saving}>
                Cancel
              </button>
            </div>
          ) : isAdmin && (
            <div className="movie-detail__admin-row">
              {deleteState === 'confirming' || deleteState === 'deleting' ? (
                <>
                  <span className="movie-detail__confirm-label">Delete this movie?</span>
                  <button
                    className="movie-detail__admin-btn movie-detail__admin-btn--danger"
                    onClick={handleDelete}
                    disabled={deleteState === 'deleting'}
                  >
                    {deleteState === 'deleting' ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    className="movie-detail__admin-btn"
                    onClick={() => { setDeleteState('idle'); setDeleteError(null) }}
                    disabled={deleteState === 'deleting'}
                  >
                    Cancel
                  </button>
                  {deleteError && <span className="movie-detail__save-error">{deleteError}</span>}
                </>
              ) : (
                <>
                  <button className="movie-detail__admin-btn" onClick={startEdit}>Edit</button>
                  <button className="movie-detail__admin-btn movie-detail__admin-btn--danger" onClick={() => setDeleteState('confirming')}>Delete</button>
                </>
              )}
            </div>
          )}

          {/* Title block */}
          <div className="movie-detail__title-block">
            {editing ? (
              <input
                name="title"
                className="movie-detail__input movie-detail__title-input"
                value={draft.title}
                onChange={handleDraftChange}
              />
            ) : (
              <>
                <h1 className="movie-detail__title">{localMovie.title}</h1>
                {releaseYear && <span className="movie-detail__year">{releaseYear}</span>}
              </>
            )}
          </div>

          {/* Quick facts row */}
          <div className="movie-detail__facts">
            {editing ? (
              <>
                <select name="maturity_rating" className="movie-detail__input movie-detail__input--inline" value={draft.maturity_rating} onChange={handleDraftChange}>
                  <option value="">Rating—</option>
                  {MATURITY_RATINGS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <input name="runtime" type="number" min="1" className="movie-detail__input movie-detail__input--inline" placeholder="Runtime (min)" value={draft.runtime} onChange={handleDraftChange} />
                <select name="genre" className="movie-detail__input movie-detail__input--inline" value={draft.genre} onChange={handleDraftChange}>
                  <option value="">Genre—</option>
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </>
            ) : (
              <>
                {localMovie.maturity_rating && <span className="movie-detail__badge">{localMovie.maturity_rating}</span>}
                {localMovie.runtime && <span className="movie-detail__fact">{localMovie.runtime} min</span>}
                {localMovie.genre && <span className="movie-detail__fact movie-detail__fact--genre">{localMovie.genre}</span>}
              </>
            )}
          </div>

          <div className="movie-detail__divider" />

          {/* Labelled fields */}
          <dl className="movie-detail__fields">
            <div className="movie-detail__field">
              <dt className="movie-detail__label">Director</dt>
              {editing ? (
                <input name="director" className="movie-detail__input" value={draft.director} onChange={handleDraftChange} />
              ) : (
                <dd className="movie-detail__value">{localMovie.director}</dd>
              )}
            </div>
            <div className="movie-detail__field">
              <dt className="movie-detail__label">Release Date</dt>
              {editing ? (
                <input name="releaseDate" type="date" className="movie-detail__input" value={draft.releaseDate} onChange={handleDraftChange} />
              ) : (
                releaseFormatted && <dd className="movie-detail__value">{releaseFormatted}</dd>
              )}
            </div>
          </dl>

          {/* Synopsis */}
          <div className="movie-detail__synopsis-block">
            <p className="movie-detail__label">Synopsis</p>
            {editing ? (
              <textarea name="synopsis" className="movie-detail__input movie-detail__textarea" value={draft.synopsis} onChange={handleDraftChange} rows={6} />
            ) : (
              localMovie.synopsis && <p className="movie-detail__synopsis">{localMovie.synopsis}</p>
            )}
          </div>

          <ReviewsSection movieId={localMovie._id} />
        </div>
      </article>
    </>
  )
}
