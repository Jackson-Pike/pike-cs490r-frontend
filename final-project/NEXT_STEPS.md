# LFE4 — Next Steps

## Where we left off
Movies are loading from the backend into the browser console. ✅
- `useEffect` + `fetch` + `async/await` is working
- API key is stored in `.env` as `VITE_PIKEAPI_KEY`
- Backend has CORS enabled

## What's left to build

### 1. Store movies in state and handle loading/error
You have `useEffect` fetching movies but not storing them yet. Add:
- `const [movies, setMovies] = useState([])`
- `const [loading, setLoading] = useState(false)`
- `const [error, setError] = useState(null)`

In `loadMovies`: set loading before fetch, set movies on success, set error on failure, set loading false when done (use `finally`).

### 2. Render the movies list
In your JSX, use conditional rendering to show:
- "Loading..." while `loading` is true
- The error message if `error` is set
- A list of movies when data is ready

To render the list, use `.map()` on the movies array. Each movie has: `title`, `director`, `genre`, `releaseDate`, `synopsis`, `runtime`, `maturity_rating`, `poster_url`.

### 3. Extract a MovieCard component
Once you can see movies rendering, pull the "one movie" JSX into its own component file `src/components/MovieCard.jsx`. It should accept a `movie` prop and display the movie's info.

This is the "parent passes data to child" pattern — App fetches and holds the data, MovieCard just displays it.

### 4. Commit as you go
Make a commit after each step above. Your commit history is part of the grade.

---

## For the screencast (LFE4)
Record ~3 min showing:
1. The app working — movies loading and displaying
2. One architecture decision you made and why (e.g. "I put the fetch in App instead of MovieCard because App needs to own the data and pass it down")
3. Where you are in your LearningPlan.md

---

## Week 4 preview (LFE5 — due June 9)
Next week is authentication. Your backend uses `x-api-key` (already working). Week 4 will likely add user login — the backend would need `POST /api/auth/login` returning a token, and your frontend stores + sends it. Start thinking about what a login form would look like.
