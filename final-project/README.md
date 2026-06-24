# PikeDB — Frontend

A movie review web app (think IMDB-lite) built with React + Vite, backed by a Node/Express + MongoDB API.

## What it does

- **Browse movies** by genre on the home page (horizontal genre shelves)
- **Movie detail page** with synopsis, metadata, and community reviews
- **Write, edit, and delete reviews** on any movie — 10-star click input, up to 2000 characters
- **Auth** — sign up, log in with email or username, JWT stored in localStorage
- **Profile page** — click your avatar circle in the top right to see your account info and all your reviews across every title

## Tech stack

| Layer | Tool |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Plain CSS with CSS custom properties |
| Auth | JWT (stored in localStorage via `AuthContext`) |
| API | `VITE_API_URL` env var → Node/Express backend |

## Running locally

```bash
npm install
npm run dev
```

Requires a `.env.local` file with:

```
VITE_API_URL=http://<backend-host>:3000
VITE_PIKEAPI_KEY=<key>
```

## Project structure

```
src/
  components/
    Header.jsx / .css        # Nav bar with avatar link to /profile
    MovieDetail.jsx / .css   # Movie info layout
    MoviePoster.jsx / .css   # Poster with fallback
    ReviewsSection.jsx / .css  # Full review CRUD — create, list, edit, delete
    GenreShelf.jsx / .css    # Horizontal scrolling row per genre
  pages/
    MovieListPage.jsx / .css # Home — all movies grouped by genre
    MovieDetailPage.jsx / .css
    ProfilePage.jsx / .css   # User info + all their reviews
    Login.jsx
    Signup.jsx
  context/
    AuthContext.jsx          # token + user state, login(), logout()
  hooks/
    useAuth.js               # Thin wrapper around AuthContext
    useFetch.js              # Generic fetch hook
```

## Design

Dark background (`#121212`) with two accent colors:
- **Neon green** `#00ff85` — primary brand, interactive chrome (buttons, borders, inputs)
- **Amber** `#f4a229` — star ratings and review scores

## API endpoints used

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/login` | — | Log in, receive JWT + user |
| `POST` | `/api/auth/signup` | — | Create account |
| `GET` | `/api/movies` | — | All movies |
| `GET` | `/api/movies/:id` | — | Single movie |
| `GET` | `/api/movies/:id/reviews` | — | Reviews for a movie |
| `POST` | `/api/movies/:id/reviews` | Bearer | Create review |
| `PATCH` | `/api/reviews/:id` | Bearer | Edit own review |
| `DELETE` | `/api/reviews/:id` | Bearer | Delete own review |
| `GET` | `/api/users/me/reviews` | Bearer | All reviews by the logged-in user |
