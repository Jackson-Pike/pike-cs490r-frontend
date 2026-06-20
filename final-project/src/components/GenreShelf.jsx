import { Link } from 'react-router-dom'
import MoviePoster from './MoviePoster'
import './GenreShelf.css'

// GenreShelf renders a single horizontal scrollable row for one genre.
// Props:
//   genre  — string, e.g. "Action"
//   movies — array of movie objects that belong to this genre
export default function GenreShelf({ genre, movies }) {
  return (
    <section className="genre-shelf">
      <h2 className="genre-shelf__heading">{genre}</h2>

      <div className="genre-shelf__row">
        {movies.map((movie) => (
          <Link
            key={movie._id}
            to={`/movies/${movie._id}`}
            className="genre-shelf__item"
          >
            <MoviePoster movie={movie} />
          </Link>
        ))}
      </div>
    </section>
  )
}
