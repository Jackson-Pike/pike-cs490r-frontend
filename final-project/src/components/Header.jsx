import { useAuth } from '../hooks/useAuth'
import './Header.css'
import { useLocation, Link } from 'react-router-dom';

function getInitials(username) {
  const parts = username.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return username.slice(0, 2).toUpperCase()
}

export default function PikeHeader() {
  const { user, logout } = useAuth()
  const location = useLocation();
  const isActive = location.pathname === '/';

  return (
    <header className="header">
      <Link to="/" className="header-logo">PikeDB</Link>
      <nav>
        {user ? (
          <>
            {!isActive && <Link to="/" className="nav-btn">All Movies</Link>}
            <button onClick={logout} className="nav-btn nav-btn--danger">Logout</button>
            <Link to="/profile" className="nav-avatar" title={`${user.username} — view profile`}>
              {getInitials(user.username)}
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/signup" className="nav-btn nav-btn--primary">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  )
}
