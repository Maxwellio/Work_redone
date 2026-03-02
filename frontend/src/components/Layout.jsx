import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Layout.css'

function Layout({ children }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="layout">
      <header className="layout-header">
        <h1 className="layout-title">Патрубки</h1>
        {user && (
          <div className="layout-header-actions">
            <span className="layout-user">{user.username}</span>
            <button type="button" className="layout-logout" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        )}
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  )
}

export default Layout
