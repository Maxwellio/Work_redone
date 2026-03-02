import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Обёртка для маршрутов, требующих авторизации.
 * При заходе вызывает GET /api/current-user; при 200 — рендер children, при 401 — редирект на /login.
 */
function ProtectedRoute({ children }) {
  const { user, loading, fetchUser } = useAuth()
  const location = useLocation()
  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    if (user !== null) {
      setInitialCheckDone(true)
      return
    }
    let cancelled = false
    fetchUser().then((u) => {
      if (!cancelled) setInitialCheckDone(true)
    })
    return () => { cancelled = true }
  }, [user, fetchUser])

  if (!initialCheckDone || (loading && user === null)) {
    return (
      <div className="protected-loading" style={{ padding: '1rem', textAlign: 'center' }}>
        Проверка авторизации…
      </div>
    )
  }

  if (user === null) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
