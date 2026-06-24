import { useNavigate } from 'react-router-dom'
import GenreShelf from '../components/GenreShelf'
import GenreShelfSkeleton from '../components/GenreShelfSkeleton'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../hooks/useAuth'
import './MovieListPage.css'

const GENRES = [
  'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller',
  'Horror', 'Romance', 'Animation', 'Documentary', 'Fantasy',
]

function groupByGenre(movies) {
  const groups = {}
  for (const movie of movies) {
    if (!movie.genre) continue
    if (!groups[movie.genre]) groups[movie.genre] = []
    groups[movie.genre].push(movie)
  }
  return groups
}

export default function MovieListPage() {
  const url = `${import.meta.env.VITE_API_URL}/api/movies`
  const { data: movies, loading, error } = useFetch(url)
  const { user } = useAuth()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'

  const moviesWithPosters = movies?.filter((movie) => movie.poster_url) ?? []
  const moviesByGenre = groupByGenre(moviesWithPosters)

  return (
    <main className="content">
      {isAdmin && (
        <div className="content__toolbar">
          <button className="content__add-btn" onClick={() => navigate('/movies/new')}>
            + Add Movie
          </button>
        </div>
      )}
      {loading ? (
        <>
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
        </>
      ) : error ? (
        <p className="content__status">{error}</p>
      ) : (
        GENRES.filter((genre) => moviesByGenre[genre]?.length > 0).map((genre) => (
          <GenreShelf key={genre} genre={genre} movies={moviesByGenre[genre]} />
        ))
      )}
    </main>
  )
}
