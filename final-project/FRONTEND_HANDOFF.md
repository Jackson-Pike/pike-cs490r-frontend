# Frontend Handoff — Movie Review API

**Project:** CS490R Final Project — Jackson Pike  
**Backend repo:** `BYUHCS490R/final-project-Jackson-Pike` (branch `main` after merge of `auth/JWT`)  
**API base URL (local dev):** `http://localhost:3000`  
**Stack:** Node 20 · Express 5 · MongoDB · Mongoose 9 · JWT (HS256, 24h expiry)

This document is the complete reference for a frontend agent building against this API. No other files need to be read.

---
l
## Quick-start

```bash
# Start the backend
docker-compose up --build

# Seed sample data (10 movies, 41 reviews, 5 users)
docker-compose exec app npm run seed
```

---

## Authentication

### How it works

1. User signs up (`POST /api/auth/signup`) or logs in (`POST /api/auth/login`)
2. Server returns a **JWT** in the response body as `{ token, user }`
3. Client stores the token and attaches it to every protected request:
   ```
   Authorization: Bearer <token>
   ```
4. Token expires after **24 hours** — user must log in again
5. No refresh token. On expiry, redirect to login

### Token storage recommendation

- **React SPA:** store in memory (React state / context) for best XSS safety. Use `localStorage` only if session persistence across page reloads is required and XSS risk is acceptable
- Token payload (do not trust without verification — just useful for UI): `{ userId, role, iat, exp }`
- Decode with `jwt-decode` (client-side, no verification): `const { userId, role } = jwtDecode(token)`

### When a token is rejected

- `401 { "error": "Authentication token required." }` — no token was sent
- `401 { "error": "Invalid or expired token." }` — token is malformed, expired, or signed with wrong secret → redirect to login

### Roles

| Role | Value | Capabilities |
|---|---|---|
| Regular user | `"user"` | Browse everything; post reviews; edit/delete own reviews; update own profile |
| Admin | `"admin"` | All of the above + edit/delete any movie + edit/delete any review |

The `role` is encoded in the JWT payload. Decode it client-side to conditionally show admin UI (edit/delete buttons on movies, etc.). **Always enforce server-side too** — UI hiding is UX, not security.

---

## Authorization at a glance

| Method | Path | Auth | Who |
|---|---|---|---|
| GET | `/api/movies` | None | Public |
| GET | `/api/movies/:id` | None | Public |
| POST | `/api/movies` | JWT | Any authenticated user |
| PATCH | `/api/movies/:id` | JWT | **Admin only** |
| DELETE | `/api/movies/:id` | JWT | **Admin only** |
| GET | `/api/movies/:movieId/reviews` | None | Public |
| GET | `/api/reviews/:id` | None | Public |
| POST | `/api/movies/:movieId/reviews` | JWT | Any authenticated user |
| PATCH | `/api/reviews/:id` | JWT | **Owner or admin** |
| DELETE | `/api/reviews/:id` | JWT | **Owner or admin** |
| POST | `/api/auth/signup` | None | Public |
| POST | `/api/auth/login` | None | Public |
| PATCH | `/api/auth/me` | JWT | Authenticated user (own account only) |
| GET | `/api/health` | None | Public |
| GET | `/api/stats` | None | Public |

---

## Data shapes

### Movie

```json
{
  "_id": "6a23da1410c7489f57f0ed18",
  "title": "Inception",
  "synopsis": "A skilled thief who enters people's dreams...",
  "releaseDate": "2010-07-16T00:00:00.000Z",
  "runtime": 148,
  "maturity_rating": "PG-13",
  "poster_url": "https://example.com/poster.jpg",
  "genre": "Sci-Fi",
  "director": "Christopher Nolan",
  "createdAt": "2026-06-06T08:00:00.000Z",
  "updatedAt": "2026-06-06T08:00:00.000Z",
  "__v": 0
}
```

### Review

```json
{
  "_id": "6a23db73752c127de73d167e",
  "movie_id": "6a23da1410c7489f57f0ed18",
  "user_id": "6a23db73752c127de73d167c",
  "rating": 9,
  "review_text": "Mind-bending and visually spectacular.",
  "like_count": 0,
  "createdAt": "2026-06-06T08:33:55.468Z",
  "updatedAt": "2026-06-06T08:33:55.468Z",
  "__v": 0
}
```

> `user_id` is an ObjectId ref to the User collection. To show the reviewer's username, you will need to either fetch the user separately or have the backend populate it (not currently implemented — raise with backend if needed).

### User (as returned by auth routes — password is always stripped)

```json
{
  "_id": "6a23da1c752c127de73d1672",
  "first_name": "Jackson",
  "last_name": "Pike",
  "username": "admin",
  "email": "pikej1@byuh.edu",
  "displayName": "Jackson Pike",
  "bio": "CS student at BYUH",
  "avatar_url": "https://example.com/avatar.jpg",
  "role": "user",
  "provider": "local",
  "createdAt": "2026-06-06T08:28:12.250Z",
  "updatedAt": "2026-06-06T08:28:12.250Z",
  "__v": 0
}
```

---

## Endpoints

### Auth

#### `POST /api/auth/signup`

Creates a new account and returns a token immediately — user is logged in on signup.

**Request body:**
```json
{
  "username": "jackson",        // required, string, must be unique
  "email": "j@example.com",     // required, valid email, must be unique
  "password": "mypassword",     // required, min 6 characters
  "first_name": "Jackson",      // optional
  "last_name": "Pike",          // optional
  "displayName": "Jackson",     // optional
  "bio": "Film lover",          // optional
  "avatar_url": "https://..."   // optional, must be a valid URL if provided
}
```

**Success `201`:**
```json
{
  "token": "<jwt>",
  "user": { ...User object }
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `400` | `{ "errors": [{ "msg": "..." }] }` | Validation failure (missing/invalid fields) |
| `400` | `{ "errors": [{ "msg": "Username is already taken." }] }` | Duplicate username |
| `400` | `{ "errors": [{ "msg": "Email is already registered." }] }` | Duplicate email |
| `400` | `{ "error": "Username or email is already taken." }` | Race-condition duplicate (rare) |

---

#### `POST /api/auth/login`

**Request body:**
```json
{
  "email": "j@example.com",   // required
  "password": "mypassword"    // required
}
```

**Success `200`:**
```json
{
  "token": "<jwt>",
  "user": { ...User object }
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `400` | `{ "errors": [...] }` | Validation failure |
| `401` | `{ "error": "Invalid email or password." }` | Wrong credentials (intentionally vague — cannot distinguish bad email from bad password) |

---

#### `PATCH /api/auth/me` — JWT required

Update the authenticated user's own profile. To change the password, `current_password` is required.

**Request body (all fields optional):**
```json
{
  "first_name": "Jack",
  "last_name": "Pike",
  "username": "jackpike",
  "displayName": "Jack",
  "bio": "Updated bio",
  "avatar_url": "https://...",
  "password": "newpassword",       // min 6 chars; requires current_password
  "current_password": "oldpassword"
}
```

> `role` and `provider` are silently stripped — sending them has no effect.

**Success `200`:**
```json
{
  "user": { ...updated User object }
}
```

**Errors:**
| Status | Body | Cause |
|---|---|---|
| `400` | `{ "errors": [...] }` | Validation failure |
| `400` | `{ "error": "current_password is required to change password." }` | `password` sent without `current_password` |
| `400` | `{ "error": "current_password is incorrect." }` | Wrong current password |
| `400` | `{ "error": "Username is already taken." }` | New username conflicts |
| `401` | `{ "error": "Authentication token required." }` | No token |

---

### Movies

#### `GET /api/movies` — public

Returns all movies as a JSON array. No pagination currently.

**Success `200`:** `[ ...Movie objects ]`

---

#### `GET /api/movies/:id` — public

**Success `200`:** `{ ...Movie object }`  
**Error `404`:** `{ "error": "Could not find movie." }`

---

#### `POST /api/movies` — JWT required

**Request body:**
```json
{
  "title": "Dune",              // required, string, max 200 chars, must be unique
  "releaseDate": "2021-10-22",  // optional, ISO 8601 date
  "runtime": 155,               // optional, number > 0 (minutes)
  "maturity_rating": "PG-13",   // optional, one of: G PG PG-13 R NC-17
  "synopsis": "...",            // optional, max 1000 chars
  "poster_url": "https://...",  // optional, valid URL
  "genre": "Sci-Fi",            // optional, see genre list below
  "director": "Denis Villeneuve" // optional, string
}
```

**Success `201`:** `{ ...Movie object }`  
**Errors:** `400` (validation), `401` (no token)

---

#### `PATCH /api/movies/:id` — JWT + admin only

Same fields as POST, all optional.

**Success `200`:** `{ ...updated Movie object }`  
**Errors:** `400` (validation), `401` (no token), `403` (not admin), `404` (not found)

---

#### `DELETE /api/movies/:id` — JWT + admin only

**Success `204`:** no body  
**Errors:** `401`, `403`, `404`

---

### Reviews

#### `GET /api/movies/:movieId/reviews` — public

Returns all reviews for a movie.

**Success `200`:** `[ ...Review objects ]`

---

#### `GET /api/reviews/:id` — public

**Success `200`:** `{ ...Review object }`  
**Error `404`:** `{ "error": "Could not find review." }`

---

#### `POST /api/movies/:movieId/reviews` — JWT required

`user_id` is automatically set from the JWT — do not send it in the body.

**Request body:**
```json
{
  "rating": 9,                         // required, integer 1–10
  "review_text": "Fantastic film."     // required, string, max 2000 chars
}
```

**Success `201`:** `{ ...Review object }`  
**Errors:** `400` (validation — movie not found, bad rating, etc.), `401`

---

#### `PATCH /api/reviews/:id` — JWT + owner or admin

**Request body (all optional):**
```json
{
  "rating": 7,
  "review_text": "On reflection, still great."
}
```

**Success `200`:** `{ ...updated Review object }`  
**Errors:** `400`, `401`, `403 { "error": "Forbidden: you do not own this review." }`, `404`

---

#### `DELETE /api/reviews/:id` — JWT + owner or admin

**Success `204`:** no body  
**Errors:** `401`, `403`, `404`

---

### Utility

#### `GET /api/health` — public

```json
{ "status": "ok", "db": "connected" }
```

`db` values: `"connected"` | `"disconnected"` | `"connecting"` | `"disconnecting"`

---

#### `GET /api/stats` — public

```json
{
  "totalMovies": 10,
  "avgRuntime": 132.3,
  "moviesByGenre": [
    { "_id": "Action", "count": 1 },
    { "_id": "Drama", "count": 1 }
  ],
  "mostReviewedMovie": { "title": "The Shawshank Redemption", "reviewCount": 5 },
  "avgRatingPerMovie": [
    { "title": "Mad Max: Fury Road", "avgRating": 9.25 },
    { "title": "Inception", "avgRating": 8.5 }
  ]
}
```

`avgRuntime` and `mostReviewedMovie` may be `null` if no data exists.

---

## Validation constraints reference

Use these on the frontend to give immediate feedback before hitting the API.

### Movie fields
| Field | Rule |
|---|---|
| `title` | Required on create. Max 200 chars. Must be globally unique. |
| `releaseDate` | Optional. ISO 8601 format (`YYYY-MM-DD`). |
| `runtime` | Optional. Positive number (minutes). |
| `maturity_rating` | Optional. One of: `G` `PG` `PG-13` `R` `NC-17` |
| `synopsis` | Optional. Max 1000 chars. |
| `poster_url` | Optional. Valid URL (must include protocol). |
| `genre` | Optional. Must be from the standardized list below. |
| `director` | Optional. String. |

### Review fields
| Field | Rule |
|---|---|
| `rating` | Required. Integer between 1 and 10 (inclusive). |
| `review_text` | Required. Max 2000 chars. |

### User / signup fields
| Field | Rule |
|---|---|
| `username` | Required. String. Must be unique. |
| `email` | Required. Valid email format. Must be unique. |
| `password` | Required on signup. Min 6 characters. |
| `avatar_url` | Optional. Valid URL if provided. |

---

## Standardized genre list

Use exactly these values for dropdowns — the API rejects anything else:

```
Action · Drama · Sci-Fi · Comedy · Thriller · Horror · Romance · Animation · Documentary · Fantasy
```

---

## Error response shapes

The API returns errors in two formats depending on source:

**Validation errors (express-validator):**
```json
{ "errors": [{ "msg": "title is required", "path": "title", "location": "body" }] }
```

**Route/logic errors:**
```json
{ "error": "Human-readable message here." }
```

Always check for both `error` and `errors` keys when handling API failures.

---

## CORS

CORS is fully open (`Access-Control-Allow-Origin: *`). The frontend can run on any port during development without proxy configuration. No credentials are sent via cookies — auth is entirely header-based (`Authorization: Bearer`).

---

## Suggested auth flow (React)

```js
// 1. Signup or login
const { token, user } = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
}).then(r => r.json())

// 2. Store token (context / state)
setAuthToken(token)
setCurrentUser(user)

// 3. Authenticated request helper
const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    }
  })

// 4. Check if current user owns a review (for showing edit/delete buttons)
const isOwner = (review) => review.user_id === currentUser._id
const canEdit  = (review) => isOwner(review) || currentUser.role === 'admin'
```

---

## Known gaps / future work

- **Review `user_id` is not populated** — reviews return a raw ObjectId for `user_id`, not a user object. To display reviewer names/avatars, the frontend must either fetch users separately or request a backend change to populate the field.
- **No pagination** — `GET /api/movies` returns all movies in one response. Fine for current seed data; will need pagination for larger datasets.
- **No search/filter** — movies can only be fetched all-at-once or by exact `_id`. Filtering by genre, director, etc. is not implemented on the backend yet.
- **GitHub OAuth** — planned but not yet implemented. When added, the login flow will gain a `/api/auth/github` redirect; the returned token shape will be identical (`{ token, user }`).
- **Role changes require re-login** — role is encoded in the JWT at login time. If a user is promoted to admin, they must log out and back in to get an admin token.
- **No email verification** — accounts are immediately active after signup.
- **`like_count` on reviews** — field exists in the schema (default 0) but there is no endpoint to increment it yet.
