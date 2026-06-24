import { useState } from 'react'
import './MoviePoster.css'

export default function MoviePoster({movie}) {
    const [imgError, setImgError] = useState(false)
    // Mirrors imgError: tracks whether THIS poster's image has finished
    // downloading. Starts false → we show a shimmer until onLoad fires.
    const [imgLoaded, setImgLoaded] = useState(false)

    if (imgError) return null

    return (
        <div className="movie-poster">
            <p>{movie.title}</p>

            {/* Shimmer placeholder, shown only until the image loads */}
            {!imgLoaded && <div className="movie-poster__skeleton skeleton" />}

            <img
                className={imgLoaded ? 'is-loaded' : ''}
                src={movie.poster_url}
                alt={movie.title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
            />
        </div>
    )
}
