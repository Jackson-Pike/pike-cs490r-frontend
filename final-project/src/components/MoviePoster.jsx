import { useState } from 'react'
import './MoviePoster.css'

export default function MoviePoster({movie}) {
    const [imgError, setImgError] = useState(false)

    if (imgError) return null

    return (
        <div className="movie-poster">
            <p>{movie.title}</p>
            <img
                src={movie.poster_url}
                alt={movie.title}
                onError={() => setImgError(true)}
            />
        </div>
    )
}
