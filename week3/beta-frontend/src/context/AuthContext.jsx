import { createContext, useState } from 'react'

const AuthContext = createContext(null)

// DONE(student): implemented decodeToken — splits JWT on '.', decodes base64 payload with atob(), parses JSON
function decodeToken(rawToken) {
  if (!rawToken) return null
  try {
    return JSON.parse(atob(rawToken.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem('token')))

  function login(newToken, userData) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }
