import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import MovieCard from '../components/MovieCard'

export default function MovieDetailPage() {
    const {id} = useParams()

    const url = `http://localhost:3000/api/movies/${id}`
    const {movie} = useFetch(url)

    if (!movie) return <p>Loading...</p>
    return <MovieCard movie={data} />

    
}
