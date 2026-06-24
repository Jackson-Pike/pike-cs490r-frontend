# Profile Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/profile` page that shows the logged-in user's account info and all of their reviews across every movie title, accessible by clicking the avatar circle in the header.

**Architecture:** The avatar in `Header.jsx` becomes a `<Link to="/profile">`. A new `ProfilePage` fetches (1) fresh user data from `GET /api/users/me` for email and `createdAt`, and (2) the user's reviews from `GET /api/users/:id/reviews` — each review card links back to the movie detail page. Everything sits behind the existing `ProtectedRoute`.

**Tech Stack:** React 18, React Router v6, CSS Modules-style plain CSS, `useAuth` hook for token/user, `VITE_API_URL` env var for API base.

## Global Constraints

- API base comes from `import.meta.env.VITE_API_URL` — never hardcode the URL.
- Auth token lives in `useAuth().token` as a Bearer string — include it in every authenticated request.
- `useAuth().user` shape from localStorage: `{ _id, username, role }` — email and createdAt are NOT guaranteed to be here; fetch them fresh from the API.
- Existing CSS variables: `--green: #00ff85`, `--amber: #f4a229`, `--bg-dark: #121212`, `--bg-dark-secondary: #1a1a1a`, `--white: #ffffff`.
- No new dependencies — use only what's already installed.

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/Header.jsx` | Modify | Make avatar a `<Link>` instead of a plain `<div>` |
| `src/components/Header.css` | Modify | Add hover/cursor style for the now-clickable avatar |
| `src/App.jsx` | Modify | Register `<Route path="/profile">` inside `ProtectedRoute` |
| `src/pages/ProfilePage.jsx` | Create | Page component — fetches user info + reviews, renders both |
| `src/pages/ProfilePage.css` | Create | All styles for the profile page |

---

### Task 1: Make the avatar circle navigate to `/profile`

**Files:**
- Modify: `src/components/Header.jsx`
- Modify: `src/components/Header.css`

**Interfaces:**
- Consumes: React Router's `<Link>` (already imported in this file)
- Produces: clicking the avatar navigates to `/profile`

- [ ] **Step 1: Replace `<div className="nav-avatar">` with a Link**

Open `src/components/Header.jsx`. Find this block:

```jsx
<div className="nav-avatar" title={user.username}>
  {getInitials(user.username)}
</div>
```

Replace it with:

```jsx
<Link to="/profile" className="nav-avatar" title={`${user.username} — view profile`}>
  {getInitials(user.username)}
</Link>
```

- [ ] **Step 2: Add cursor and hover style to the avatar**

Open `src/components/Header.css`. Find the `.nav-avatar` rule and add these two lines:

```css
.nav-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--green);
  color: #0a0a0a;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-decoration: none;        /* new */
  cursor: pointer;              /* new */
  transition: box-shadow 0.2s; /* new */
}

.nav-avatar:hover {
  box-shadow: 0 0 0 2px #0a0a0a, 0 0 0 4px var(--green);
}
```

- [ ] **Step 3: Verify in the browser**

Run `npm run dev` (if not already running). Log in, look at the top-right avatar circle. It should show a pointer cursor on hover and a green ring. Clicking it should navigate to `/profile` (which will 404 for now — that's fine).

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.jsx src/components/Header.css
git commit -m "feat: make avatar circle a link to /profile"
```

---

### Task 2: Register the `/profile` route

**Files:**
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `ProfilePage` component (created in Task 3 — add the import now, the file will exist after Task 3)
- Produces: `<Route path="/profile">` wrapped in `ProtectedRoute`, so unauthenticated users bounce to login

- [ ] **Step 1: Add the import and route to App.jsx**

Open `src/App.jsx`. Add the import at the top (with the other page imports):

```jsx
import ProfilePage from './pages/ProfilePage'
```

Inside `<Routes>`, add the new route after the `/movies/:id` route:

```jsx
<Route path="/profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
```

The full `<Routes>` block should now look like:

```jsx
<Routes>
  <Route path="/" element={
    <ProtectedRoute>
      <MovieListPage />
    </ProtectedRoute>}/>
  <Route path="/movies/:id" element={
    <ProtectedRoute>
      <MovieDetailPage />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />
</Routes>
```

- [ ] **Step 2: Create a placeholder ProfilePage so the app doesn't crash**

Create `src/pages/ProfilePage.jsx` with just enough to confirm routing works:

```jsx
export default function ProfilePage() {
  return <div style={{ color: 'white', padding: '40px' }}>Profile coming soon</div>
}
```

- [ ] **Step 3: Verify routing**

Click the avatar in the header. The page should render "Profile coming soon" at `/profile`. The back button should return to the previous page.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx src/pages/ProfilePage.jsx
git commit -m "feat: add /profile route behind ProtectedRoute"
```

---

### Task 3: Build the ProfilePage — user info + reviews

**Files:**
- Create: `src/pages/ProfilePage.jsx` (replaces placeholder from Task 2)
- Create: `src/pages/ProfilePage.css`

**Interfaces:**
- Consumes:
  - `useAuth()` → `{ token, user }` where `user = { _id, username, role }`
  - `GET ${VITE_API_URL}/api/users/me` with `Authorization: Bearer <token>` → `{ _id, username, email, role, createdAt }`
  - `GET ${VITE_API_URL}/api/users/:id/reviews` with `Authorization: Bearer <token>` → array of `{ _id, rating, review_text, createdAt, movie_id, movie_title }`
  - `<Link to={`/movies/${review.movie_id}`}>` for linking each review back to the movie
- Produces: A styled page component with user info header and a review list

> **⚠️ Backend note:** Before writing the fetch calls, open your browser's network tab (or ask your instructor) and confirm:
> - Does `GET /api/users/me` exist and return `{ email, createdAt, ... }`?
> - Does `GET /api/users/:id/reviews` exist and what shape does it return?
>
> If `/api/users/me` doesn't exist, you can fall back to `user.email` and derive `createdAt` from the MongoDB ObjectId: `new Date(parseInt(user._id.slice(0,8), 16) * 1000)`.
> If the reviews endpoint shape differs, adjust the field names in the render step below.

- [ ] **Step 1: Write ProfilePage.jsx**

Replace `src/pages/ProfilePage.jsx` entirely:

```jsx
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

  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        // Fetch fresh user profile (email, createdAt, etc.)
        const userRes = await fetch(`${API}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const userData = userRes.ok ? await userRes.json() : authUser

        // Fetch all reviews by this user
        const reviewsRes = await fetch(`${API}/api/users/${authUser._id}/reviews`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!reviewsRes.ok) throw new Error(`Could not load reviews (${reviewsRes.status})`)
        const reviewsData = await reviewsRes.json()

        setProfile(userData)
        setReviews(reviewsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token, authUser])

  if (loading) return <p className="profile__status">Loading profile…</p>
  if (error) return <p className="profile__status profile__status--error">{error}</p>

  return (
    <main className="profile">
      {/* User info card */}
      <section className="profile__card">
        <div className="profile__avatar">{authUser.username.slice(0, 2).toUpperCase()}</div>
        <div className="profile__info">
          <h1 className="profile__username">{profile?.username ?? authUser.username}</h1>
          {profile?.email && (
            <p className="profile__meta">{profile.email}</p>
          )}
          <p className="profile__meta profile__meta--muted">
            Member since {memberSince(profile ?? authUser)}
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
          <p className="profile__empty">You haven't reviewed any movies yet.</p>
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
```

- [ ] **Step 2: Write ProfilePage.css**

Create `src/pages/ProfilePage.css`:

```css
/* ─── Page wrapper ───────────────────────────────────────────────────────── */

.profile {
  max-width: 860px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  color: var(--white);
}

/* ─── User info card ─────────────────────────────────────────────────────── */

.profile__card {
  display: flex;
  align-items: center;
  gap: 20px;
  background: rgba(0, 255, 133, 0.04);
  border: 1px solid rgba(0, 255, 133, 0.2);
  border-left: 3px solid var(--green);
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 36px;
}

.profile__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--green);
  color: #0a0a0a;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.profile__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.profile__username {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--white);
}

.profile__meta {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.55);
}

.profile__meta--muted {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.3);
}

/* Review count stat — floated to the right */
.profile__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding-left: 20px;
  border-left: 1px solid rgba(255, 255, 255, 0.07);
}

.profile__stat-num {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--amber);
  text-shadow: 0 0 12px rgba(244, 162, 41, 0.4);
}

.profile__stat-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
}

/* ─── Reviews section ────────────────────────────────────────────────────── */

.profile__reviews-heading {
  margin: 0 0 16px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--green);
  opacity: 0.7;
}

.profile__empty {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
  margin: 0;
}

.profile__review-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ─── Review card ────────────────────────────────────────────────────────── */

.profile__review-card {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(0, 255, 133, 0.15);
  border-radius: 8px;
  padding: 14px 18px;
  transition: border-color 0.2s;
}

.profile__review-card:hover {
  border-color: rgba(0, 255, 133, 0.3);
}

.profile__review-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.profile__movie-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--white);
  text-decoration: none;
  transition: color 0.2s;
}

.profile__movie-title:hover {
  color: var(--green);
}

.profile__review-rating {
  color: var(--amber);
  font-size: 0.9rem;
  display: flex;
  align-items: baseline;
  gap: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.profile__rating-num {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(244, 162, 41, 0.8);
}

.profile__review-text {
  margin: 0 0 8px;
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
}

.profile__review-date {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.25);
}

/* ─── Status messages ────────────────────────────────────────────────────── */

.profile__status {
  padding: 40px 24px;
  text-align: center;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.9rem;
}

.profile__status--error {
  color: #ff6b6b;
}

/* ─── Mobile ─────────────────────────────────────────────────────────────── */

@media (max-width: 600px) {
  .profile__card {
    flex-wrap: wrap;
  }

  .profile__stat {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    padding: 12px 0 0;
    width: 100%;
    flex-direction: row;
    gap: 8px;
    align-items: baseline;
  }

  .profile__stat-num {
    font-size: 1.4rem;
  }

  .profile__review-header {
    flex-direction: column;
    gap: 4px;
  }
}
```

- [ ] **Step 3: Verify the page in the browser**

Navigate to `/profile`. Check:
- [ ] Avatar, username, email, and "Member since" date render
- [ ] Review count badge shows correctly
- [ ] Each review card shows the movie title (as a link), star rating, review text, and date
- [ ] Clicking a movie title navigates to `/movies/:id`
- [ ] Empty state ("You haven't reviewed any movies yet") shows if no reviews exist

> **If the API returns an error:** Open DevTools → Network. Look at the failed request URL and status. If `GET /api/users/me` returns 404, the backend doesn't expose that route — replace `setProfile(userData)` with `setProfile(authUser)` and the page will fall back to the stored user object (which won't have email). If `GET /api/users/:id/reviews` returns 404, ask your instructor what the correct endpoint is.

- [ ] **Step 4: Commit**

```bash
git add src/pages/ProfilePage.jsx src/pages/ProfilePage.css
git commit -m "feat: profile page with user info and review history"
```
