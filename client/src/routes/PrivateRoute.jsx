import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login')
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect based on user's actual role
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate('/user/dashboard')
        }
      }
    }
  }, [user, loading, allowedRoles, navigate])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null // Will redirect in useEffect
  }

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default PrivateRoute
