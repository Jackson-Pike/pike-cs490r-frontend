# Learning Journal — Auth MVP
**CS490R Week 3 | 2026-06-10**

This document captures the collaborative, tutorial-style process used to build the auth layer for PikeDB. The session was guided (scaffolding, explanations, skeletons provided), but all key logic was written by the student.

---

## What Was Built

A complete frontend authentication flow on top of a pre-existing Express/JWT backend:
- `AuthContext` — global auth state using React Context
- `useAuth` hook — clean context consumer
- Login and Signup pages with form handling and API integration
- Client-side routing with `react-router-dom`
- Conditional Header UI reflecting login state
- JWT + user object persisted in `localStorage`

---

## Design Decisions Made

Before writing any code, the following decisions were discussed and chosen:

| Decision | Choice | Why |
|----------|--------|-----|
| JWT storage | `localStorage` | Survives refresh; XSS risk acceptable for learning project |
| Auth state | React Context | Avoids prop drilling; user/token needed across many components |
| Routing | `react-router-dom` | Real URLs; foundation for future protected routes |
| User display info | `data.user` from API | JWT payload has no `username`; API returns full user object alongside token |

---

## Student-Implemented Sections

The student wrote the following logic from scratch (marked `DONE(student)` in code):

### 1. `decodeToken(rawToken)` — `AuthContext.jsx`
Decodes a JWT's base64 payload without an external library. Splits on `.`, uses `atob()` to decode the middle segment, `JSON.parse()` to deserialize. Includes null guard and `try/catch` for malformed tokens.

**Concept encountered:** `try/catch` as a control flow mechanism — every branch can `return` directly without an intermediate variable.

### 2. `useEffect` fetch — `MovieListPage.jsx`
Repeated the movie-fetching pattern from `App.jsx` with fresh hands: async function inside `useEffect`, `setLoading`/`try`/`catch`/`finally`, empty dependency array.

**Bug caught and fixed:** Missing `loadMovies()` call inside `useEffect` (function defined but never invoked), and missing `[]` dependency array causing infinite re-renders.

### 3. `handleSubmit(e)` — `Login.jsx`
Full login form submit handler: `e.preventDefault()`, POST with JSON body, `response.ok` check, `login(data.token, data.user)`, `navigate('/')`, and error display on failure.

**Concepts encountered:** Controlled inputs (React owns form values in state, not the DOM). Why `async` can't be on the `useEffect` callback directly.

### 4. Conditional auth UI — `Header.jsx`
Ternary on `user` to show login/signup links when logged out, and username + logout button when logged in.

**Bug caught:** Ternary was reversed (`user ?` showed login links). Also corrected `onclick` → `onClick` (JSX uses camelCase event handlers).

---

## Notable Questions & Conversations

- **"What is Context?"** — Led to an explanation of prop drilling vs. broadcast state. Context is a distribution mechanism; the state still lives in `useState`.
- **"Where do email and password come from in handleSubmit?"** — Introduced the controlled input pattern: React owns form values, no DOM querying needed.
- **"Where does the JWT come in?"** — Clarified the server creates and returns the token; the client never generates tokens.
- **"Where is decodeToken ever called?"** — Student spotted dead code after the refactor to store `data.user` directly. Led to a discussion of code rot and when to delete vs. keep.
- **"Should we avoid hardcoding API URLs?"** — Led to a discussion of `VITE_API_URL` env vars and API client modules. `VITE_API_URL` was already set in `.env`.

---

## Key Concepts Covered

- **React Context** — global state distribution without prop drilling
- **Lazy `useState` initializer** — `useState(() => fn())` runs once on mount
- **JWT structure** — three base64 segments; payload contains claims, not secrets
- **Controlled inputs** — React state as source of truth for form fields
- **`useEffect` + async** — why the callback can't be `async`; inner async function pattern
- **JSX vs HTML** — `onClick` not `onclick`, `className` not `class`; JSX compiles to JS function calls
