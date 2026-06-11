# Auth MVP — Design Spec
**Date:** 2026-06-10  
**Project:** PikeDB (CS490R Week 3)

---

## Problem

The app rendered a public movie list with no authentication. The backend was fully wired with JWT auth — login and signup endpoints existed and returned tokens — but the frontend had no way to log in, store a token, or pass it to protected endpoints.

---

## Goals

- Users can browse movies and reviews without logging in
- Users can log in or sign up to get a JWT
- The JWT persists across page refreshes
- The Header reflects the current auth state (login links vs. username + logout)
- Foundation is laid for protected requests (create/edit/delete reviews)

---

## Design Decisions

### JWT Storage: `localStorage`
Chosen over `sessionStorage` (loses token on tab close) and in-memory state (loses token on refresh). XSS risk is acceptable for a learning project. In production, `httpOnly` cookies would be preferred.

### Auth State: React Context
`AuthContext` broadcasts `token`, `user`, `login()`, and `logout()` to the full component tree. Any component can call `useAuth()` without prop drilling. State still lives in `useState` inside `AuthProvider` — Context is the distribution mechanism, not the state manager.

### Routing: `react-router-dom` with `BrowserRouter`
Real URLs (`/`, `/login`, `/signup`) rather than conditional rendering. No `ProtectedRoute` this week — added later when review CRUD is implemented.

### JWT Decode: Manual + API user object
The JWT payload only contains `{ userId, role, iat, exp }` — no `username`. Rather than fetching the user separately, the login/signup API response returns `{ token, user }`. The full `user` object is stored in `localStorage` for UI display (Header username). The token is stored separately for auth headers on future protected requests.

---

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx     — token + user state, login(), logout(), localStorage sync
├── hooks/
│   └── useAuth.js          — useContext(AuthContext) wrapper
├── pages/
│   ├── MovieListPage.jsx   — movie fetch + render (extracted from App.jsx)
│   ├── Login.jsx           — controlled form → POST /api/auth/login → login() → navigate /
│   └── Signup.jsx          — controlled form → POST /api/auth/signup → login() → navigate /
└── App.jsx                 — router shell: AuthProvider > BrowserRouter > Header + Routes
```

---

## Data Flow

**Login:**
```
form submit → POST /api/auth/login → { token, user }
           → login(token, user)
           → localStorage.setItem('token') + localStorage.setItem('user')
           → setToken() + setUser() → Header re-renders → navigate('/')
```

**Page refresh:**
```
AuthProvider mounts
→ useState lazy init reads localStorage
→ token + user restored → user stays logged in
```

**Logout:**
```
logout() → localStorage.removeItem('token' + 'user')
         → setToken(null) + setUser(null) → Header re-renders
```

**Future protected request:**
```
const { token } = useAuth()
fetch(url, { headers: { Authorization: `Bearer ${token}` } })
```
