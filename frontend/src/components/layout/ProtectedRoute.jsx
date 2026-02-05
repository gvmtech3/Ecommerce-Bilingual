// src/components/layout/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function ProtectedRoute({ children, requireCustomer }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth?mode=signin" replace />
  }

  if (requireCustomer && user?.role !== 'customer') {
    return <Navigate to="/" replace />
  }

  // If not requireCustomer, we just check auth; brand/customer both allowed
  return children
}

export default ProtectedRoute
