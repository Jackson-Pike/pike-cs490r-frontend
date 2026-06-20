import GenreShelf from '../components/GenreShelf'
import GenreShelfSkeleton from '../components/GenreShelfSkeleton'
import { useFetch } from '../hooks/useFetch'
import './MovieListPage.css'

// The genres we want to display, in the order they appear on the page.
// Any movie whose genre isn't in this list will be skipped.
const GENRES = [
  'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller',
  'Horror', 'Romance', 'Animation', 'Documentary', 'Fantasy',
]

// groupByGenre takes a flat array of movies and returns an object where
// each key is a genre string and each value is an array of movies.
// Example: { Action: [...], Drama: [...] }
function groupByGenre(movies) {
  const groups = {}

  for (const movie of movies) {
    const genre = movie.genre

    // Skip movies without a genre we recognise
    if (!genre) continue

    if (!groups[genre]) {
      groups[genre] = []
    }

    groups[genre].push(movie)
  }

  return groups
}

export default function MovieListPage() {
  const url = `${import.meta.env.VITE_API_URL}/api/movies`
  const { data: movies, loading, error } = useFetch(url)

  // Only keep movies that have a poster so ghost cards don't appear
  const moviesWithPosters = movies?.filter((movie) => movie.poster_url) ?? []

  const moviesByGenre = groupByGenre(moviesWithPosters)

  return (
    <main className="content">
      {loading ? (
        // While the JSON is in flight, show a few placeholder shelves
        // instead of a bare "Loading..." line.
        <>
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
          <GenreShelfSkeleton />
        </>
      ) : error ? (
        <p className="content__status">{error}</p>
      ) : (
        // Render one GenreShelf per genre, in the fixed order defined above.
        // Skip any genre that has no movies in the current dataset.
        GENRES.filter((genre) => moviesByGenre[genre]?.length > 0).map((genre) => (
          <GenreShelf
            key={genre}
            genre={genre}
            movies={moviesByGenre[genre]}
          />
        ))
      )}
    </main>
  )
}
