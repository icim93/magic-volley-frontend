import { Navigate } from 'react-router-dom'
import { useGuardianAuth } from '../context/GuardianAuthContext'

export default function GuardianProtectedRoute({ children }) {
  const { isAuthenticated } = useGuardianAuth()
  if (!isAuthenticated) return <Navigate to="/area-riservata/login" replace />
  return children
}
