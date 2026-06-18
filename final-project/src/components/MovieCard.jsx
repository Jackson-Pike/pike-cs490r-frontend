
import { Link } from 'react-router-dom'
export default function MovieCard({movie}) {
    return (
        <div 
        className="movie-card"
        style={{ border: '1px solid black', padding: '8px', margin: '8px' }}>
            <p><Link to={`/movies/${movie._id}`}>{movie.title}</Link></p>
            <p>{movie.director}</p>
            <p>{movie.genre}</p>
            <p>{new Date(movie.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p>{movie.synopsis}</p>
            <p>{movie.runtime}</p>
            <p>{movie.maturity_rating}</p>
            <img src={movie.poster_url} alt={movie.title} />
        </div>
    )
}