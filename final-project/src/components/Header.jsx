import { useAuth } from '../hooks/useAuth'

export default function PikeHeader() {
  const { user, logout } = useAuth()

  // DONE(student): implemented conditional auth nav — ternary on user shows login/signup links when logged out, username + logout button when logged in

  return (
    <header className="header">
      <h1>PikeDB</h1>
      <nav>
        {user ? (
          <>
          <span>{user.username}</span>
          <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
          <a href="/login">Login</a>
          <a href="/signup">Signup</a>
          </>
        )}
      </nav>
    </header>
  )
}
