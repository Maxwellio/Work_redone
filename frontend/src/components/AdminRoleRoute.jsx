import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { userHasAdminRole } from '../utils/userRoles'

/**
 * Использовать внутри ProtectedRoute: для залогиненного без ROLE_ADMIN — редирект на /.
 */
function AdminRoleRoute({ children }) {
  const { user } = useAuth()
  if (!userHasAdminRole(user)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default AdminRoleRoute
