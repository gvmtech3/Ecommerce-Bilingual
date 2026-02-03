import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children, requireCustomer }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (requireCustomer && user?.role !== 'customer') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
