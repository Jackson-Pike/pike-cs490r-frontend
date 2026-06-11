import { createContext, useState } from 'react'

const AuthContext = createContext(null)

// TODO(human): implement decodeToken(token)
// A JWT looks like: "header.payload.signature" — three base64 segments joined by dots.
// The payload (middle segment) is base64-encoded JSON containing the user data.
// Use atob() to decode base64, then JSON.parse() to get the object.
// Return null if token is falsy or if parsing fails (wrap in try/catch).

function decodeToken(rawToken) {
  const token = null
  try {
      token = JSON.parse(atob(rawToken.split('.')[1]))
  } catch {
    return console.log("Error parsing token")
  }
  return (token ? )
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(() => decodeToken(localStorage.getItem('token')))

  function login(newToken) {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(decodeToken(newToken))
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
