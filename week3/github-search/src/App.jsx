import './App.css'
import { useState, useEffect } from 'react'


export default function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadMovies() {
      const url = 'http://localhost:3000/api/movies'
      try {
        setLoading(true)
        const response = await fetch(url, {
          headers: {
              "x-api-key": import.meta.env.VITE_PIKEAPI_KEY
          }
        });

        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        setMovies(result)
        console.log(result)
        
        
      } catch (error) {
        setError(error.message)
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadMovies()

  }, [])
  return (
    <div className="app">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          movies.map ((movie) => {
            return <p>{movie.title}</p>
          })
        )}
    </div>
  )
}
