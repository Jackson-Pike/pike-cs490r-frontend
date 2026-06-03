const BACKEND_URL = 'http://localhost:3000/api/movies'
const OMDB_API_KEY = 'your_omdb_key_here'
const OMDB_URL = 'http://www.omdbapi.com/'
const API_KEY = 'your_pikeapi_key_here'

const headers = { 'x-api-key': API_KEY }

const response = await fetch(BACKEND_URL, { headers })
const movies = await response.json()
console.log(`Found ${movies.length} movies`)

for (const movie of movies) {
    const omdbRes = await fetch(`${OMDB_URL}?t=${encodeURIComponent(movie.title)}&apikey=${OMDB_API_KEY}`)
    const omdbData = await omdbRes.json()

    if (omdbData.Response === 'False' || !omdbData.Poster || omdbData.Poster === 'N/A') {
        console.log(`No poster found for: ${movie.title}`)
        continue
    }

    await fetch(`${BACKEND_URL}/${movie._id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ poster_url: omdbData.Poster })
    })

    console.log(`Updated: ${movie.title}`)
}

console.log('Done')
