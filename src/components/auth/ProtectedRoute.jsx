import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Loader from '../common/Loader'

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <Loader fullScreen text="Authenticating user session..." />
  }

  // Allow access if user is logged in OR if in development mode
  const isDemoMode = import.meta.env.DEV
  if (!user && !isDemoMode) {
    // Redirect them to the login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
