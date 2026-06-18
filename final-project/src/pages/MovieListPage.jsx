import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'

export default function MovieListPage() {

  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // DONE(student): implemented useEffect fetch — loads movies from API with loading/error/finally state pattern
  useEffect(() => {
    async function loadMovies() {
        const url = 'http://localhost:3000/api/movies'

        try {
            setLoading(true)
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            setMovies(result)
            console.log(result)
        } catch (error) {
            setError(error.message)
            console.error(error.message)
        } finally {
            setLoading(false);
        }
    }
    loadMovies()
  }, [])
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
