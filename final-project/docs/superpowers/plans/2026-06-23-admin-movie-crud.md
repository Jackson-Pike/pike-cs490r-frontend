# Admin Movie CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give admin users the ability to create, edit, and delete movies — with inline editing on the detail page and a dedicated create form.

**Architecture:** The backend POST route gets a `requireAdmin` guard. The frontend gates all admin UI on `user?.role === 'admin'` from `useAuth()`. MovieDetail manages its own local copy of the movie so inline edits update in place without a page reload. A new `MovieFormPage` handles creation.

**Tech Stack:** React 18, React Router v6, Vite, vanilla `fetch`, CSS custom properties (existing design system)

## Global Constraints

- Admin check: `user?.role === 'admin'` via `useAuth()` — never trust client role for security, only for UI gating
- API base: `import.meta.env.VITE_API_URL` — always use this, never hardcode
- Auth header: `Authorization: Bearer ${token}` — always include on mutating requests
- Follow existing fetch pattern from `ReviewsSection.jsx`: direct `fetch()`, throw on `!res.ok`, parse error from `res.json()`
- CSS: use existing `var(--*)` tokens; no new color values
- No test framework exists — verification is manual in the browser

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `final-project-Jackson-Pike/routes.js` | Modify line 28 | Add `requireAdmin` to POST /movies |
| `src/pages/MovieListPage.jsx` | Modify | Add "Add Movie" button for admins |
| `src/pages/MovieListPage.css` | Modify | Toolbar styles |
| `src/pages/MovieFormPage.jsx` | Create | Create-movie form page |
| `src/pages/MovieFormPage.css` | Create | Form page styles |
| `src/App.jsx` | Modify | Add `/movies/new` route |
| `src/components/MovieDetail.jsx` | Modify | Local movie state, inline edit/delete |
| `src/components/MovieDetail.css` | Modify | Admin button + input styles |

---

## Task 1: Lock down POST /api/movies to admin-only

**Files:**
- Modify: `final-project-Jackson-Pike/routes.js:28`

**Interfaces:**
- Produces: `POST /api/movies` returns 403 for non-admin authenticated users

- [ ] **Step 1: Add `requireAdmin` to the POST route**

Open `final-project-Jackson-Pike/routes.js`. Change line 28 from:

```js
router.post("/movies", authenticateToken, movieValidation.post, handleValidationErrors, async (req, res) => {
```

to:

```js
router.post("/movies", authenticateToken, requireAdmin, movieValidation.post, handleValidationErrors, async (req, res) => {
```

`requireAdmin` is already imported at the top of the file (line 7). No other changes needed.

- [ ] **Step 2: Verify**

Start the backend if it isn't running. With a non-admin token (any regular user), send:

```
POST /api/movies
Authorization: Bearer <user-token>
Content-Type: application/json
{"title": "Test"}
```

Expected: `403 { "error": "Admin access required." }`

With an admin token, same request should return `201`.

- [ ] **Step 3: Commit**

```bash
cd /Users/kahuku-air/Developer/slade-490R/final-project-Jackson-Pike
git add routes.js
git commit -m "feat: require admin role to create movies"
```

---

## Task 2: Add Movie button on MovieListPage

**Files:**
- Modify: `src/pages/MovieListPage.jsx`
- Modify: `src/pages/MovieListPage.css`

**Interfaces:**
- Consumes: `useAuth()` → `{ user }`, `useNavigate()` from react-router-dom
- Produces: visible "Add Movie" button for admins above the genre shelves

- [ ] **Step 1: Update MovieListPage.jsx**

Replace the entire file contents:

```jsx
import { useNavigate } from 'react-router-dom'
import GenreShelf from '../components/GenreShelf'
import GenreShelfSkeleton from '../components/GenreShelfSkeleton'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import './MovieListPage.css'

const GENRES = [
  'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller',
  'Horror', 'Romance', 'Animation', 'Documentary', 'Fantasy',
]

function groupByGenre(movies) {
  const groups = {}
  for (const movie of movies) {
    if (!movie.genre) continue
    if (!groups[movie.genre]) groups[movie.genre] = []
    groups[movie.genre].push(movie)
  }
  return groups
}

export default function MovieListPage() {
  const url = `${import.meta.env.VITE_API_URL}/api/movies`
  const { data: movies, loading, error } = useFetch(url)
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const moviesWithPosters = movies?.filter((movie) => movie.poster_url) ?? []
  const moviesByGenre = groupByGenre(moviesWithPosters)

  return (
    <main className="content">
      {isAdmin && (
        <div className="content__toolbar">
          <button className="content__add-btn" onClick={() => navigate('/movies/new')}>
            + Add Movie
          </button>
        </div>
      )}
      {loading ? (
        <>
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
        </>
      ) : error ? (
        <p className="content__status">{error}</p>
      ) : (
        GENRES.filter((genre) => moviesByGenre[genre]?.length > 0).map((genre) => (
          <GenreShelf key={genre} genre={genre} movies={moviesByGenre[genre]} />
        ))
      )}
    </main>
  )
}
```

- [ ] **Step 2: Add toolbar styles to MovieListPage.css**

Append to the end of `src/pages/MovieListPage.css`:

```css
.content__toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 0 clamp(24px, 6vw, 120px) 16px;
}

.content__add-btn {
  background: var(--primary);
  color: #0a0a0a;
  border: none;
  border-radius: 4px;
  font: 600 0.8rem/1 inherit;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 8px 18px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.content__add-btn:hover {
  box-shadow: 0 0 14px rgba(var(--primary-rgb), 0.4);
}
```

- [ ] **Step 3: Verify**

Start the frontend (`npm run dev`). Log in as an admin — you should see "+ Add Movie" in the top-right above the shelves. Log in as a regular user — the button should not appear.

- [ ] **Step 4: Commit**

```bash
git add src/pages/MovieListPage.jsx src/pages/MovieListPage.css
git commit -m "feat: show Add Movie button for admin users on movie list"
```

---

## Task 3: MovieFormPage — create movie

**Files:**
- Create: `src/pages/MovieFormPage.jsx`
- Create: `src/pages/MovieFormPage.css`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `useAuth()` → `{ token }`, `POST /api/movies`
- Produces: `/movies/new` route renders the create form; on success navigates to `/movies/:newId`

- [ ] **Step 1: Create MovieFormPage.jsx**

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './MovieFormPage.css'

const API = import.meta.env.VITE_API_URL

const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR']

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
  const { token } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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
            <input id="genre" name="genre" className="mfp__input" value={form.genre} onChange={handleChange} />
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
```

- [ ] **Step 2: Create MovieFormPage.css**

```css
.mfp {
  background: var(--bg);
  min-height: calc(100vh - 80px);
}

.mfp__back-row {
  padding: 20px clamp(24px, 6vw, 120px) 0;
}

.mfp__back-btn {
  background: transparent;
  border: 1px solid rgba(var(--primary-rgb), 0.3);
  color: rgba(var(--primary-rgb), 0.8);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 7px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
}

.mfp__back-btn:hover {
  border-color: rgba(var(--primary-rgb), 0.7);
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.06);
}

.mfp__shell {
  max-width: 680px;
  margin: 0 auto;
  padding: 40px clamp(24px, 6vw, 120px) 80px;
}

.mfp__heading {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-h);
  margin: 0 0 28px;
}

.mfp__error {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin: 0 0 16px;
}

.mfp__form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mfp__row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.mfp__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mfp__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  opacity: 0.8;
}

.mfp__input {
  background: var(--bg-secondary);
  border: 1.5px solid var(--border);
  border-radius: 4px;
  color: var(--text-h);
  font: inherit;
  font-size: 0.95rem;
  padding: 9px 12px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.mfp__input:focus {
  border-color: var(--primary);
  outline: none;
}

.mfp__textarea {
  resize: vertical;
  min-height: 120px;
}

.mfp__actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
}

.mfp__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 9px 22px;
  border-radius: 4px;
  font: 600 0.82rem/1 inherit;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
}

.mfp__btn--primary {
  background: var(--primary);
  color: #0a0a0a;
  border: none;
}

.mfp__btn--primary:hover:not(:disabled) {
  box-shadow: 0 0 14px rgba(var(--primary-rgb), 0.4);
}

.mfp__btn--ghost {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text-subtle);
}

.mfp__btn--ghost:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.mfp__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .mfp__row {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: Add the route in App.jsx**

In `src/App.jsx`, add this import at the top (with the other page imports):

```jsx
import MovieFormPage from './pages/MovieFormPage'
```

Then inside `<Routes>`, after the `/movies/:id` route, add:

```jsx
<Route path="/movies/new" element={
  <ProtectedRoute>
    <MovieFormPage />
  </ProtectedRoute>
} />
```

- [ ] **Step 4: Verify**

Navigate to `/movies/new` as an admin. Fill in at minimum a title. Submit — should redirect to the new movie's detail page. Try submitting with an empty title — should show "Title is required." error inline.

- [ ] **Step 5: Commit**

```bash
git add src/pages/MovieFormPage.jsx src/pages/MovieFormPage.css src/App.jsx
git commit -m "feat: add MovieFormPage for admin movie creation"
```

---

## Task 4: Delete movie — inline confirmation on MovieDetail

**Files:**
- Modify: `src/components/MovieDetail.jsx`
- Modify: `src/components/MovieDetail.css`

**Interfaces:**
- Consumes: `useAuth()` → `{ user, token }`, `DELETE /api/movies/:id`
- Produces: admin sees Edit + Delete buttons on detail page; Delete shows confirm flow and navigates to `/` on success

- [ ] **Step 1: Update MovieDetail.jsx**

Replace the entire file:

```jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import ReviewsSection from './ReviewsSection'
import './MovieDetail.css'

const API = import.meta.env.VITE_API_URL
const MATURITY_RATINGS = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'NR']

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
                <input name="genre" className="movie-detail__input movie-detail__input--inline" placeholder="Genre" value={draft.genre} onChange={handleDraftChange} />
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
```

- [ ] **Step 2: Add admin and edit-mode styles to MovieDetail.css**

Append to the end of `src/components/MovieDetail.css`:

```css
/* ─── Admin Buttons ──────────────────────────────────────────────────────── */

.movie-detail__admin-row,
.movie-detail__edit-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.movie-detail__admin-btn {
  background: none;
  border: 1.5px solid var(--border);
  border-radius: 4px;
  color: var(--text-subtle);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 5px 14px;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s;
}

.movie-detail__admin-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.movie-detail__admin-btn--save {
  background: var(--primary);
  border-color: var(--primary);
  color: #0a0a0a;
}

.movie-detail__admin-btn--save:hover:not(:disabled) {
  box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.4);
  color: #0a0a0a;
}

.movie-detail__admin-btn--danger:hover:not(:disabled) {
  border-color: #ff4d4d;
  color: #ff4d4d;
}

.movie-detail__admin-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.movie-detail__confirm-label {
  font-size: 0.82rem;
  color: var(--text-subtle);
}

.movie-detail__save-error {
  font-size: 0.82rem;
  color: #ff4d4d;
}

/* ─── Edit-mode inputs ───────────────────────────────────────────────────── */

.movie-detail__input {
  background: var(--bg-secondary);
  border: 1.5px solid var(--border);
  border-radius: 4px;
  color: var(--text-h);
  font: inherit;
  font-size: 0.95rem;
  padding: 7px 10px;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.movie-detail__input:focus {
  border-color: var(--primary);
  outline: none;
}

/* Inline inputs (facts row) don't take full width */
.movie-detail__input--inline {
  width: auto;
  flex: 1;
  min-width: 80px;
  max-width: 160px;
}

.movie-detail__title-input {
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  width: 100%;
}

.movie-detail__textarea {
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
}

.movie-detail__poster-url-field {
  margin-top: 12px;
}
```

- [ ] **Step 3: Verify delete**

As an admin, navigate to any movie detail page. You should see "Edit" and "Delete" buttons. Click Delete — it should show "Delete this movie? / Yes, delete / Cancel". Click "Yes, delete" — it should delete the movie and redirect to `/`. Click Cancel — confirm row should disappear and Edit/Delete buttons return.

- [ ] **Step 4: Commit**

```bash
git add src/components/MovieDetail.jsx src/components/MovieDetail.css
git commit -m "feat: add inline delete + edit scaffold for admin on movie detail"
```

---

## Task 5: Verify inline edit end-to-end

This task has no new code — it is a verification pass for the edit flow already wired in Task 4.

- [ ] **Step 1: Verify edit mode activates**

As admin on a movie detail page, click "Edit". Every field should flip to an input: title becomes a large text input, the facts row shows select + two inputs, director and release date become inputs, synopsis becomes a textarea, and a Poster URL input appears below the poster.

- [ ] **Step 2: Verify cancel resets**

Change the title to something else. Click Cancel. The original title should be restored — no API call.

- [ ] **Step 3: Verify save**

Edit the title. Click Save. The page should update in place with the new title and return to read mode.

- [ ] **Step 4: Verify error handling**

Clear the title field entirely. Click Save. Should show "Title is required." inline, stay in edit mode.

- [ ] **Step 5: Verify non-admin sees nothing**

Log in as a regular user. Navigate to a movie detail. No Edit or Delete buttons should be visible.

- [ ] **Step 6: Commit**

```bash
git add -p  # stage only if any fixes were needed
git commit -m "fix: inline edit verified and any edge cases resolved"
```

---

## Self-Review

**Spec coverage:**
- ✅ POST /movies locked to admin — Task 1
- ✅ Create movie form + route — Task 3
- ✅ "Add Movie" button admin-only on list page — Task 2
- ✅ Inline edit on detail page, fields flip to inputs — Task 4
- ✅ Save calls PATCH, updates in place — Task 4
- ✅ Cancel resets to original data — Task 4
- ✅ Delete inline confirmation, navigates to / on success — Task 4
- ✅ poster_url editable in edit mode — Task 4

**Placeholder scan:** None found.

**Type consistency:** `localMovie`, `draft`, `deleteState`, `handleDraftChange`, `handleSave`, `handleDelete` — all names consistent across tasks.
