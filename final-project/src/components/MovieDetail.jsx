import { useNavigate } from 'react-router-dom'
import './MovieDetail.css'

export default function MovieDetail({ movie }) {
    const navigate = useNavigate()
    const releaseYear = movie.releaseDate
        ? new Date(movie.releaseDate).getFullYear()
        : null

    const releaseFormatted = movie.releaseDate
        ? new Date(movie.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : null

    return (
        <>
        <div className="movie-detail__back-row">
            <button className="movie-detail__back-btn" onClick={() => navigate('/')}>
                ← Back to Catalog
            </button>
        </div>
        <article className="movie-detail">
            {/* Left column — poster */}
            <div className="movie-detail__poster-col">
                <div className="movie-detail__poster-frame">
                    <img
                        src={movie.poster_url}
                        alt={`${movie.title} poster`}
                        className="movie-detail__poster-img"
                    />
                </div>
            </div>

            {/* Right column — metadata */}
            <div className="movie-detail__meta-col">
                {/* Title block */}
                <div className="movie-detail__title-block">
                    <h1 className="movie-detail__title">{movie.title}</h1>
                    {releaseYear && (
                        <span className="movie-detail__year">{releaseYear}</span>
                    )}
                </div>

                {/* Quick facts row */}
                <div className="movie-detail__facts">
                    {movie.maturity_rating && (
                        <span className="movie-detail__badge">{movie.maturity_rating}</span>
                    )}
                    {movie.runtime && (
                        <span className="movie-detail__fact">{movie.runtime} min</span>
                    )}
                    {movie.genre && (
                        <span className="movie-detail__fact movie-detail__fact--genre">
                            {movie.genre}
                        </span>
                    )}
                </div>

                <div className="movie-detail__divider" />

                {/* Labelled fields */}
                <dl className="movie-detail__fields">
                    {movie.director && (
                        <div className="movie-detail__field">
                            <dt className="movie-detail__label">Director</dt>
                            <dd className="movie-detail__value">{movie.director}</dd>
                        </div>
                    )}
                    {releaseFormatted && (
                        <div className="movie-detail__field">
                            <dt className="movie-detail__label">Release Date</dt>
                            <dd className="movie-detail__value">{releaseFormatted}</dd>
                        </div>
                    )}
                </dl>

                {/* Synopsis */}
                {movie.synopsis && (
                    <div className="movie-detail__synopsis-block">
                        <p className="movie-detail__label">Synopsis</p>
                        <p className="movie-detail__synopsis">{movie.synopsis}</p>
                    </div>
                )}
            </div>
        </article>
        </>
    )
}
