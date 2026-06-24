import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import './ProfilePage.css'

const API = import.meta.env.VITE_API_URL

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function memberSince(user) {
  if (user.createdAt) return formatDate(user.createdAt)
  const ts = parseInt(user._id?.slice(0, 8) ?? '', 16) * 1000
  return isNaN(ts) ? 'Unknown' : formatDate(new Date(ts))
}

function StarRating({ value, onChange }) {
  return (
    <div className="profile__star-rating">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          className={`profile__star${n <= value ? ' profile__star--on' : ''}`}
          onClick={() => onChange(n)}
          aria-label={`${n} out of 10`}
        >
          {n <= value ? '★' : '☆'}
        </button>
      ))}
      <span className="profile__rating-num">{value}/10</span>
    </div>
  )
}

export default function ProfilePage() {
  const { token, user: authUser } = useAuth()
  const { theme, setTheme, themes } = useTheme()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState({ rating: 5, review_text: '' })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    async function load() {
      if (!token || !authUser) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API}/api/users/me/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error(`Could not load reviews (${res.status})`)
        setReviews(await res.json())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, authUser?._id])

  function startEdit(review) {
    setEditingId(review._id)
    setDraft({ rating: review.rating, review_text: review.review_text })
    setSaveError(null)
  }

  function cancelEdit() {
    setEditingId(null)
    setSaveError(null)
  }

  async function handleSaveEdit(reviewId) {
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(`${API}/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Error ${res.status}`)
      }
      const updated = await res.json()
      setReviews((prev) =>
        prev.map((r) => r._id === reviewId ? { ...r, rating: updated.rating, review_text: updated.review_text } : r)
      )
      setEditingId(null)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteReview(reviewId) {
    setDeletingId(reviewId)
    try {
      const res = await fetch(`${API}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error(`Delete failed (${res.status})`)
      setReviews((prev) => prev.filter((r) => r._id !== reviewId))
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) return <p className="profile__status">Loading profile…</p>
  if (error) return <p className="profile__status profile__status--error">{error}</p>
  if (!authUser) return null

  return (
    <main className="profile">
      {/* User info card */}
      <section className="profile__card">
        <div className="profile__avatar">{authUser.username.slice(0, 2).toUpperCase()}</div>
        <div className="profile__info">
          <h1 className="profile__username">{authUser.username}</h1>
          {authUser.email && (
            <p className="profile__meta">{authUser.email}</p>
          )}
          <p className="profile__meta profile__meta--muted">
            Member since {memberSince(authUser)}
          </p>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-num">{reviews.length}</span>
          <span className="profile__stat-label">{reviews.length === 1 ? 'Review' : 'Reviews'}</span>
        </div>
      </section>

      {/* Appearance */}
      <section className="profile__appearance">
        <h2 className="profile__appearance-heading">Appearance</h2>
        <div className="profile__swatches">
          {themes.map((t) => (
            <button
              key={t.id}
              className={`profile__swatch${theme === t.id ? ' profile__swatch--active' : ''}`}
              style={{ '--swatch-color': t.swatch, '--swatch-bg': t.bg }}
              onClick={() => setTheme(t.id)}
              title={t.label}
              aria-label={`Switch to ${t.label} theme${theme === t.id ? ' (current)' : ''}`}
              aria-pressed={theme === t.id}
            >
              {theme === t.id && (
                <span className="profile__swatch-check" aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
        <p className="profile__appearance-label">
          {themes.find((t) => t.id === theme)?.label}
        </p>
      </section>

      {/* Reviews */}
      <section className="profile__reviews">
        <h2 className="profile__reviews-heading">Your Reviews</h2>

        {reviews.length === 0 && (
          <p className="profile__empty">You haven&apos;t reviewed any movies yet.</p>
        )}

        {reviews.length > 0 && (
          <ul className="profile__review-list">
            {reviews.map((review) => (
              <li key={review._id} className="profile__review-card">
                <div className="profile__review-header">
                  <Link to={`/movies/${review.movie_id}`} className="profile__movie-title">
                    {review.movie_title ?? `Movie ${review.movie_id}`}
                  </Link>
                  {editingId !== review._id && (
                    <span className="profile__review-rating">
                      {'★'.repeat(Math.round(review.rating / 2))}
                      {'☆'.repeat(5 - Math.round(review.rating / 2))}
                      <span className="profile__rating-num">{review.rating}/10</span>
                    </span>
                  )}
                </div>

                {editingId === review._id ? (
                  <div className="profile__review-edit">
                    <StarRating
                      value={draft.rating}
                      onChange={(n) => setDraft((p) => ({ ...p, rating: n }))}
                    />
                    <textarea
                      className="profile__review-textarea"
                      value={draft.review_text}
                      onChange={(e) => setDraft((p) => ({ ...p, review_text: e.target.value }))}
                      rows={4}
                    />
                    {saveError && <p className="profile__save-error">{saveError}</p>}
                    <div className="profile__review-footer">
                      <span />
                      <div className="profile__edit-actions">
                        <button
                          className="profile__review-action profile__review-action--save"
                          onClick={() => handleSaveEdit(review._id)}
                          disabled={saving}
                        >
                          {saving ? 'Saving…' : 'Save'}
                        </button>
                        <button
                          className="profile__review-action"
                          onClick={cancelEdit}
                          disabled={saving}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="profile__review-text">{review.review_text}</p>
                    <div className="profile__review-footer">
                      <span className="profile__review-date">{formatDate(review.createdAt)}</span>
                      <div className="profile__edit-actions">
                        <button
                          className="profile__review-action"
                          onClick={() => startEdit(review)}
                        >
                          Edit
                        </button>
                        <button
                          className="profile__review-delete"
                          onClick={() => handleDeleteReview(review._id)}
                          disabled={deletingId === review._id}
                        >
                          {deletingId === review._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
