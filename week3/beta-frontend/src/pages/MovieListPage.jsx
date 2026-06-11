import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'

export default function MovieListPage() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // TODO(human): add a useEffect here that fetches movies from
  // 'http://localhost:3000/api/movies' and stores them in state.
  // Use the same pattern from App.jsx — setLoading, try/catch/finally, setMovies, setError.
  // The fetch needs an 'x-api-key' header using import.meta.env.VITE_PIKEAPI_KEY.

  return (
    <main className="content">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))
      )}
    </main>
  )
}
