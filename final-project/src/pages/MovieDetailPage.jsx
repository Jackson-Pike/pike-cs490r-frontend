import { useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import MovieDetail from '../components/MovieDetail'
import './MovieDetailPage.css'

export default function MovieDetailPage() {
    const {id} = useParams()

    const url = `${import.meta.env.VITE_API_URL}/api/movies/${id}`
    // CHANGED: useFetch returns {data, loading, error} — aliased data as "movie" for clarity
    const { data: movie, loading, error } = useFetch(url)

    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>
    // CHANGED: was referencing "data" (undefined) — fixed to use "movie" which is the aliased variable
    if (!movie) return null
    return <MovieDetail movie={movie} />

    
}
