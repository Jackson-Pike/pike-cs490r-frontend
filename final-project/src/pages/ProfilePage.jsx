import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
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
  // Use createdAt if present; otherwise derive from MongoDB ObjectId timestamp
  if (user.createdAt) return formatDate(user.createdAt)
  const ts = parseInt(user._id.slice(0, 8), 16) * 1000
  return formatDate(new Date(ts).toISOString())
}

export default function ProfilePage() {
  const { token, user: authUser } = useAuth()

  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
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
  }, [token])

  if (loading) return <p className="profile__status">Loading profile…</p>
  if (error) return <p className="profile__status profile__status--error">{error}</p>

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

      {/* Reviews */}
      <section className="profile__reviews">
        <h2 className="profile__reviews-heading">Your Reviews</h2>

        {reviews.length === 0 && (
          <p className="profile__empty">You haven&apos;t reviewed any movies yet.</p>
        )}

        <ul className="profile__review-list">
          {reviews.map((review) => (
            <li key={review._id} className="profile__review-card">
              <div className="profile__review-header">
                <Link
                  to={`/movies/${review.movie_id}`}
                  className="profile__movie-title"
                >
                  {review.movie_title ?? `Movie ${review.movie_id}`}
                </Link>
                <span className="profile__review-rating">
                  {'★'.repeat(Math.round(review.rating / 2))}
                  {'☆'.repeat(5 - Math.round(review.rating / 2))}
                  <span className="profile__rating-num">{review.rating}/10</span>
                </span>
              </div>
              <p className="profile__review-text">{review.review_text}</p>
              <span className="profile__review-date">{formatDate(review.createdAt)}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
