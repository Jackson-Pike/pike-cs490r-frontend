import './MoviePoster.css'
export default function MoviePoster({movie}) {
    return (
        <div
        className="movie-poster"
        >
            <p>{movie.title}</p>
            <img src={movie.poster_url} alt={movie.title} />
        </div>
    )
}
