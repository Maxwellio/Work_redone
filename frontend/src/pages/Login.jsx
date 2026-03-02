import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLogin } from '../hooks/useLogin'
import '../styles/Login.css'

/**
 * Страница входа: форма логин/пароль, вызов POST /api/login (form-urlencoded),
 * после успеха — getCurrentUser и редирект на /.
 * При заходе на /login авторизованного пользователя — проверка сессии и редирект на главную.
 */
function Login() {
  const navigate = useNavigate()
  const { user, fetchUser } = useAuth()
  const {
    username,
    password,
    error,
    submitting,
    sessionChecked,
    setUsername,
    setPassword,
    handleSubmit,
  } = useLogin(fetchUser, navigate)

  if (!sessionChecked) {
    return (
      <div className="login-page">
        <div className="login-card">
          <p className="login-hint">Проверка авторизации…</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Вход</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-label">
            Логин
            <input
              type="text"
              className="login-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
              disabled={submitting}
            />
          </label>
          <label className="login-label">
            Пароль
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              disabled={submitting}
            />
          </label>
          <p className="login-hint">Проверяйте вводимые данные</p>
          {error && <p className="login-error" role="alert">{error}</p>}
          <button type="submit" className="login-submit" disabled={submitting}>
            {submitting ? 'Вход…' : 'Войти'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
