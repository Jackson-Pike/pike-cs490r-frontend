import { useAuth } from '../hooks/useAuth'
// AI: added Link for SPA navigation (no page reload)
import { useLocation, Link } from 'react-router-dom';

export default function PikeHeader() {
  const { user, logout } = useAuth()

  const location = useLocation();
  const isActive = location.pathname === '/';

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
          {/* AI: <Link> instead of <a> to stay in SPA mode */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
          </>
        )}
        {/* AI: <Link> instead of <a> to stay in SPA mode */}
        {(!isActive && user) ? (
          <Link to="/">All Movies</Link>
        ) : (
          <></>
        )}
      </nav>
    </header>
  )
}
