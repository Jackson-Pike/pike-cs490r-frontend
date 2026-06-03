

export default function MovieCard({movie}) {
    return <p key={movie._id}>{movie.title}</p>
}