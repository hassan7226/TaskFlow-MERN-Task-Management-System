import { useContext, useEffect } from 'react'
import { UserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const useUserAuth = () => {
  const { user, loading, clearUser } = useContext(UserContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) {
      // Still loading, do nothing
      return
    }
    if (user) {
      // User is logged in, do nothing
      return
    }
    if (!loading && !user) {
      clearUser() // Clear user state if not logged in
      navigate('/login') // Redirect to login page
    }
  }, [user, loading, navigate, clearUser])

  return { user, loading }
}