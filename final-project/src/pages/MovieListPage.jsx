import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'

export default function MovieListPage() {


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
        // CHANGED: wrapped MovieCard in <Link> so the whole card is clickable — navigation moved here from MovieCard
        movies?.map((movie) => (
          <Link key={movie._id} to={`/movies/${movie._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <MovieCard movie={movie} />
          </Link>
        ))
      )}
    </main>
  )
}
