import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth' // Import the custom hook
import { UserContext } from '../../context/UserContext' // Import the UserContext

const Dashboard = () => {
    useUserAuth() // Custom hook to check user authentication
    const { user } = useUser() // Get the current user from context

    

  return (
    <div>
      <h1>Admin Dashboard</h1>

    </div>
  )
}

export default Dashboard
