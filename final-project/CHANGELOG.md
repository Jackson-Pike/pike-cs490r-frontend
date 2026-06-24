# Changelog

## 2026-06-23 — Reviews CRUD + Profile Page

### Branch: `final-frontend`

#### Reviews section (`src/components/ReviewsSection.jsx / .css`)

Full CRUD for the Review model on every movie detail page:

- **Create** — write a review with a 10-star click input (each star = 1 point out of 10) and a text field (2000 char limit with live counter)
- **Read** — community reviews listed in the right column with star ratings, author, and date
- **Update** — edit your own review in-place
- **Delete** — delete with a confirm step; admins can delete any review
- Average rating displayed in the section header with a glowing amber score and star breakdown
- Write panel has a green left-border accent and tighter spacing to stand out from the list

#### Profile page (`src/pages/ProfilePage.jsx / .css`)

New `/profile` route, accessible by clicking the avatar circle in the top-right header:

- Displays username, email, and member-since date (derived from the stored user object — no extra API call)
- Shows all of the user's reviews across every movie, with the movie title linking back to its detail page
- Amber review-count badge in the info card
- Backend: added `GET /api/users/me/reviews` to `reviewRoutes.js` — authenticated, returns reviews with movie title populated via Mongoose `.populate('movie_id', 'title')`

#### Styling

- Added `--amber: #f4a229` as a second accent color (alongside `--green: #00ff85`)
- Amber used for all star ratings and score numbers throughout the app
- Green remains the primary interactive color (buttons, borders, inputs, labels)

---

## 2026-06-06 — Auth MVP + Poster Seed Script

### Context
Backend merged branch `auth/JWT` into `main`, replacing the old `x-api-key` header auth with full JWT (HS256, 24h expiry). A `FRONTEND_HANDOFF.md` was dropped into this repo describing the new API contract. This session brought the frontend up to date.

---

### Branch: `feature/auth-mvp`

**New dependencies**
- `react-router-dom` — client-side routing
- `jwt-decode` — decoding JWT payload for role/userId on the client

**New files**

| File | Purpose |
|---|---|
| `src/contexts/AuthContext.jsx` | Stores `token` + `currentUser` in React state. Exposes `login()`, `logout()`, and `useAuth` hook. `logout` redirects to `/login`. |
| `src/api/auth.js` | `authFetch(url, options, token)` — wraps fetch with `Authorization: Bearer` header. `parseApiError(data)` — normalizes both `{ error }` and `{ errors: [{ msg }] }` response shapes. |
| `src/pages/LoginPage.jsx` | Email + password form → `POST /api/auth/login`. Calls `login()` on success, shows error on failure. |
| `src/pages/SignupPage.jsx` | Username, email, password (+ optional first/last name) → `POST /api/auth/signup`. Client-side password length check before hitting the API. |
| `src/pages/MovieListPage.jsx` | Fetches `GET /api/movies` (public — no auth header). Renders `<MovieCard>` grid, each linking to `/movies/:id`. |
| `src/pages/MovieDetailPage.jsx` | Parallel fetch of movie + reviews on mount. Review form shown when logged in (rating 1–10, textarea up to 2000 chars). Delete button shown for own reviews or admin role. 401 responses redirect to `/login`. |

**Modified files**

| File | Change |
|---|---|
| `src/main.jsx` | Wrapped app in `<BrowserRouter>` then `<AuthProvider>` (provider is inside router because it uses `useNavigate`). |
| `src/App.jsx` | Stripped to `<PikeHeader>` + `<Routes>` for `/`, `/movies/:id`, `/login`, `/signup`. |
| `src/components/Header.jsx` | Shows Login/Sign Up links when logged out; "Hi, username" + Logout button when authenticated. PikeDB title is now a `<Link to="/">`. |

**Verified working**
- Login with seeded user `alice@seed.dev / seedpass1` redirects to home and updates header to "Hi, alice_seeds · Logout"
- Bad credentials show "Invalid email or password." in red
- Movie list loads from public backend endpoint (old `x-api-key` header removed)

---

### Script: `scripts/fetch-posters-and-gen-seed.mjs`

Poster URLs in the backend `seed.js` were placeholder `https://example.com/...` values, lost after a Docker rebuild. The original poster-fetch script was recovered from git history (commit `067e460`) and rewritten for the new auth model.

**What it does**
1. Fetches all movies from `GET /api/movies` (public — no credentials needed)
2. Looks up each title on the OMDB API (`dd8f30b0`) and extracts the `Poster` URL
3. Writes a complete, drop-in `seed.js` directly to `../final-project-Jackson-Pike/seed.js` with real poster URLs and all existing reviews/users preserved

**To run**
```bash
# From week3/beta-frontend/
node scripts/fetch-posters-and-gen-seed.mjs

# Then in the backend repo
docker-compose exec app npm run seed
```

**Note:** The account with `username: "admin"` currently has `role: "user"` in the JWT payload — the DB role was never set to `admin`. Will need a manual MongoDB update or a backend fix to promote it before admin-only routes (movie PATCH/DELETE) are usable from the frontend.
