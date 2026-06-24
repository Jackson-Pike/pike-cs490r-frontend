# Admin Movie CRUD — Design Spec
_2026-06-23_

## Overview

Add Create, Edit, and Delete capabilities for Movie records, visible and accessible only to users with `role === 'admin'`. The admin role is already stored in the JWT and surfaced via `useAuth()`.

---

## Backend change

**File:** `final-project-Jackson-Pike/routes.js`

Add `requireAdmin` middleware to the `POST /api/movies` route (currently only requires `authenticateToken`). This closes the gap where any logged-in user could create movies via the API directly.

```
Before: router.post("/movies", authenticateToken, ...)
After:  router.post("/movies", authenticateToken, requireAdmin, ...)
```

---

## Create Movie

**Entry point:** `MovieListPage` — admins see an "Add Movie" button (top-right of the page, above the genre shelves). Non-admins see nothing.

**Route:** `/movies/new` — a new `ProtectedRoute`-wrapped route in `App.jsx`.

**Component:** `src/pages/MovieFormPage.jsx` with `src/pages/MovieFormPage.css`.

**Fields (all optional except title):**
| Field | Input type | Notes |
|---|---|---|
| title | text | required |
| director | text | |
| genre | text | |
| releaseDate | date | |
| runtime | number | label shows "minutes" |
| maturity_rating | select | options: G, PG, PG-13, R, NC-17, NR |
| poster_url | text | |
| synopsis | textarea | |

**API call:** `POST /api/movies` with `Authorization: Bearer ${token}`.

**On success:** navigate to `/movies/:newId`.

**On error:** display the error message inline above the form.

---

## Edit Movie (inline on detail page)

**Entry point:** `MovieDetail` — admins see an "Edit" button in the movie's title area. Clicking flips the entire metadata section into edit mode.

**Edit mode behaviour:**
- Every displayed field is replaced by an appropriate input (same layout, just editable):
  - `h1` title → `<input type="text">`
  - year badge is hidden (derived from releaseDate; the date input covers it)
  - maturity_rating badge → `<select>`
  - runtime fact → `<input type="number">`
  - genre fact → `<input type="text">`
  - director `<dd>` → `<input type="text">`
  - releaseDate `<dd>` → `<input type="date">`
  - synopsis `<p>` → `<textarea>`
  - poster_url — add a URL input below the poster image so the admin can change it
- Save and Cancel buttons appear at the top of the meta column.

**Cancel:** resets all field values to the original movie data, exits edit mode. No API call.

**Save:** calls `PATCH /api/movies/:id` with only the changed fields. On success, updates the displayed movie data in place and exits edit mode. On error, shows an inline error message; stays in edit mode.

**State:** `editing` boolean + a `draft` object (copy of movie fields) managed inside `MovieDetail`. The parent `MovieDetailPage` does not need to change.

---

## Delete Movie (inline confirmation on detail page)

**Entry point:** "Delete" button next to the Edit button in the title area (admin only).

**Flow:** clicking Delete replaces the Edit/Delete buttons with "Are you sure? / Yes, delete / Cancel" — matching the inline confirmation pattern already used in `ReviewsSection`.

**API call:** `DELETE /api/movies/:id` with `Authorization: Bearer ${token}`.

**On success:** navigate to `/` (movie list).

**On error:** show inline error message; stay in confirm state.

---

## Files changed

| File | Change |
|---|---|
| `final-project-Jackson-Pike/routes.js` | add `requireAdmin` to POST /movies |
| `src/App.jsx` | add `/movies/new` route |
| `src/pages/MovieListPage.jsx` | add "Add Movie" button for admins |
| `src/pages/MovieFormPage.jsx` | new — create form page |
| `src/pages/MovieFormPage.css` | new — form styles |
| `src/components/MovieDetail.jsx` | inline edit + delete logic |
| `src/components/MovieDetail.css` | edit-mode input styles |

---

## Auth pattern

Admin check follows the existing pattern in `ReviewsSection`:
```js
const { user, token } = useAuth()
const isAdmin = user?.role === 'admin'
```

API calls follow the existing fetch pattern:
```js
fetch(`${API}/api/movies/${id}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(draft),
})
```

---

## Out of scope

- Image upload (poster URL is a text field only)
- Admin management (promoting users to admin)
- Bulk operations
