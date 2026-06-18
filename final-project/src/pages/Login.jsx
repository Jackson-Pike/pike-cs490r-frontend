import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  // DONE(student): implemented handleSubmit — POSTs credentials to /api/auth/login, stores JWT via login(), navigates to /
  async function handleSubmit(e) {
        e.preventDefault()

        try {
            const url = `${import.meta.env.VITE_API_URL}/api/auth/login`
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({email, password })
            }
            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const data = await response.json();

            login(data.token, data.user)
            navigate('/')
        } catch (error){
            setError(error.message)
        }

    }   


  
  return (
    <main className="content">
      <h2>Log In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </main>
  )
}
