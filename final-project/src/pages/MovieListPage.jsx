import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'

export default function MovieListPage() {

  //const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // DONE(student): implemented useEffect fetch — loads movies from API with loading/error/finally state pattern
  const url = 'http://localhost:3000/api/movies'

  const { data: movies, loading, error } = useFetch(url)

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
