import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './ReviewsSection.css'

const API = import.meta.env.VITE_API_URL

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function authorId(review) {
  const u = review.user_id
  return typeof u === 'object' && u !== null ? u._id : u
}

function authorLabel(review, currentUser) {
  if (currentUser && authorId(review) === currentUser._id) return 'You'
  const u = review.user_id
  if (typeof u === 'object' && u !== null) {
    const name = [u.first_name, u.last_name].filter(Boolean).join(' ')
    return name || u.username || `User …${String(u._id).slice(-4)}`
  }
  return `User …${String(u).slice(-4)}`
}

function StarRating({ value }) {
  return (
    <span className="reviews__stars" aria-label={`${value} out of 10`}>
      {'★'.repeat(Math.round(value / 2))}{'☆'.repeat(5 - Math.round(value / 2))}
      <span className="reviews__rating-num">{value}/10</span>
    </span>
  )
}

function AverageRating({ avg, count }) {
  return (
    <div className="reviews__avg">
      <span className="reviews__avg-score">{avg}</span>
      <div className="reviews__avg-detail">
        <StarRating value={Math.round(parseFloat(avg))} />
        <span className="reviews__avg-count">{count} {count === 1 ? 'review' : 'reviews'}</span>
      </div>
    </div>
  )
}

function StarInput({ value, onChange }) {
  const [hovered, setHovered] = useState(null)
  const filled = hovered ?? (value ? value : 0)

  return (
    <div className="reviews__star-input" onMouseLeave={() => setHovered(null)}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <button
          key={star}
          type="button"
          className={`reviews__star-btn${filled >= star ? ' reviews__star-btn--on' : ''}`}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 10`}
        >
          ★
        </button>
      ))}
      {value ? (
        <span className="reviews__star-input-num">{value}/10</span>
      ) : (
        <span className="reviews__star-input-hint">click to rate</span>
      )}
    </div>
  )
}

function ReviewForm({ initial, onSubmit, onCancel, submitLabel }) {
  const [rating, setRating] = useState(initial?.rating ?? '')
  const [text, setText] = useState(initial?.review_text ?? '')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    const parsed = parseInt(rating, 10)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 10) {
      setError('Rating must be a whole number between 1 and 10.')
      return
    }
    if (!text.trim()) {
      setError('Review text cannot be empty.')
      return
    }
    if (text.trim().length > 2000) {
      setError('Review text must be 2000 characters or fewer.')
      return
    }

    setSubmitting(true)
    try {
      await onSubmit({ rating: parsed, review_text: text.trim() })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="reviews__form" onSubmit={handleSubmit} noValidate>
      {error && <p className="reviews__form-error">{error}</p>}

      <div className="reviews__field-row">
        <label className="reviews__field-label">Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="reviews__field-row">
        <label className="reviews__field-label" htmlFor="review-text">
          Review
        </label>
        <textarea
          id="review-text"
          className="reviews__input reviews__textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you think?"
          rows={4}
          maxLength={2000}
          required
        />
        <span className="reviews__char-count">{text.length}/2000</span>
      </div>

      <div className="reviews__form-actions">
        <button
          type="submit"
          className="reviews__btn reviews__btn--primary"
          disabled={submitting}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="reviews__btn reviews__btn--ghost"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function ReviewCard({ review, currentUser, token, onUpdated, onDeleted, isOwn }) {
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState(null)

  const isOwner = currentUser && authorId(review) === currentUser._id
  const isAdmin = currentUser?.role === 'admin'
  const canModify = isOwner || isAdmin

  async function handleUpdate(body) {
    const res = await fetch(`${API}/api/reviews/${review._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `Error ${res.status}`)
    }
    const updated = await res.json()
    setEditing(false)
    onUpdated(updated)
  }

  async function handleDelete() {
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`${API}/api/reviews/${review._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Error ${res.status}`)
      }
      onDeleted(review._id)
    } catch (err) {
      setDeleteError(err.message)
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <div className="reviews__card reviews__card--editing">
        <ReviewForm
          initial={review}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Save Changes"
        />
      </div>
    )
  }

  return (
    <div className={`reviews__card${isOwn ? ' reviews__card--own' : ''}`}>
      <div className="reviews__card-header">
        <StarRating value={review.rating} />
        <span className="reviews__author">{authorLabel(review, currentUser)}</span>
        <span className="reviews__date">{formatDate(review.createdAt)}</span>
      </div>

      <p className="reviews__text">{review.review_text}</p>

      {canModify && (
        <div className="reviews__card-footer">
          {confirmDelete ? (
            <div className="reviews__confirm-delete">
              <span className="reviews__confirm-label">Are you sure?</span>
              <button
                className="reviews__btn reviews__btn--danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                className="reviews__btn reviews__btn--ghost"
                onClick={() => {
                  setConfirmDelete(false)
                  setDeleteError(null)
                }}
                disabled={deleting}
              >
                Cancel
              </button>
              {deleteError && (
                <span className="reviews__inline-error">{deleteError}</span>
              )}
            </div>
          ) : (
            <>
              <button
                className="reviews__btn reviews__btn--ghost"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
              <button
                className="reviews__btn reviews__btn--ghost reviews__btn--destructive"
                onClick={() => setConfirmDelete(true)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReviewsSection({ movieId }) {
  const { token, user } = useAuth()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(`${API}/api/movies/${movieId}/reviews`)
      if (!res.ok) throw new Error(`Could not load reviews (${res.status})`)
      const data = await res.json()
      setReviews(data)
    } catch (err) {
      setFetchError(err.message)
    } finally {
      setLoading(false)
    }
  }, [movieId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const userReview = user ? reviews.find((r) => authorId(r) === user._id) : null

  async function handleCreate(body) {
    const res = await fetch(`${API}/api/movies/${movieId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || `Error ${res.status}`)
    }
    const created = await res.json()
    setReviews((prev) => [created, ...prev])
    setSubmitSuccess(true)
    setTimeout(() => setSubmitSuccess(false), 3000)
  }

  function handleUpdated(updated) {
    setReviews((prev) => prev.map((r) => (r._id === updated._id ? updated : r)))
  }

  function handleDeleted(id) {
    setReviews((prev) => prev.filter((r) => r._id !== id))
  }

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <section className="reviews">
      {/* Section heading row: label + rule + avg rating */}
      <div className="reviews__section-header">
        <h2 className="reviews__heading">Reviews</h2>
        <div className="reviews__header-rule" />
        {!loading && avg && <AverageRating avg={avg} count={reviews.length} />}
      </div>

      {/* Two-column body: write on left, list on right */}
      <div className="reviews__columns">

        {/* Left — write panel */}
        <div className="reviews__write-panel">
          <p className="reviews__write-label">
            {userReview ? 'Your Review' : 'Write a Review'}
          </p>
          {token && user ? (
            <>
              {!userReview && (
                <>
                  {submitSuccess && <p className="reviews__success">Review posted!</p>}
                  <ReviewForm onSubmit={handleCreate} submitLabel="Post Review" />
                </>
              )}
              {userReview && (
                <p className="reviews__write-hint">
                  Find your review in the list on the right to edit or delete it.
                </p>
              )}
            </>
          ) : (
            <p className="reviews__login-prompt">
              <Link to="/login" className="reviews__login-link">Log in</Link>
              {' '}to write a review.
            </p>
          )}
        </div>

        {/* Right — community list */}
        <div className="reviews__list-col">
          <div className="reviews__community-header">
            <span className="reviews__community-label">Community Reviews</span>
            {!loading && reviews.length > 0 && (
              <span className="reviews__community-count">{reviews.length}</span>
            )}
          </div>

          {loading && <p className="reviews__status">Loading reviews…</p>}
          {fetchError && <p className="reviews__status reviews__status--error">{fetchError}</p>}

          {!loading && !fetchError && reviews.length === 0 && (
            <p className="reviews__empty">No reviews yet. Be the first!</p>
          )}

          {!loading && !fetchError && reviews.length > 0 && (
            <ul className="reviews__list">
              {[...reviews]
                .sort((a, b) => {
                  const aIsMe = user && authorId(a) === user._id
                  const bIsMe = user && authorId(b) === user._id
                  return aIsMe ? -1 : bIsMe ? 1 : 0
                })
                .map((review) => (
                  <li key={review._id}>
                    <ReviewCard
                      review={review}
                      currentUser={user}
                      token={token}
                      onUpdated={handleUpdated}
                      onDeleted={handleDeleted}
                      isOwn={user && authorId(review) === user._id}
                    />
                  </li>
                ))}
            </ul>
          )}
        </div>

      </div>
    </section>
  )
}
