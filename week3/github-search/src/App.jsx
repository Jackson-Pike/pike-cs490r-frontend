import './App.css'
import { useState, useEffect } from 'react'


export default function App() {
  useEffect(() => {
    async function loadMovies() {
      const url = 'http://localhost:3000/api/movies'
      try {
        const response = await fetch(url, {
          headers: {
              "x-api-key": import.meta.env.VITE_PIKEAPI_KEY
          }
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
      } catch (error) {
        console.error(error.message);
      }
        
      }
      loadMovies()

  }, [])
  return (
    <div className="app">
      
    </div>
  )
}
