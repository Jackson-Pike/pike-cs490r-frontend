import './App.css'
import { useState } from 'react'


export default function App() {
  const [searchKey, setSearchKey] = useState('')
  return (
    <div className="app">
      <h1>GitHub User Search</h1>
      <form>
        <label htmlFor="username">Username</label>
        <input name="username" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
        <button type="submit" onSubmit={(e) => { e.preventDefault(); console.log(searchKey)}}>Search</button>
      </form>
    </div>
  )
}
