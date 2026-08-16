import React, { createContext, useContext, useEffect, useState } from 'react'

import API from '../utils/axios'



const UserContext = createContext(null)



export const UserProvider = ({ children }) => {

  const [user, setUser] = useState(null)

  const [loading, setLoading] = useState(true)



  const fetchUser = async () => {

    try {

      setLoading(true)

      const response = await API.get('/auth/profile')

      setUser(response.data.user)

    } catch (error) {

      console.error('Failed to fetch user:', error)

      clearUser() // Clear user state on error (e.g., unauthorized)

     

    } finally {

      setLoading(false)

    }

  }



  const updateUser = async (userData) => {

    try {

      const response = await API.put('/auth/update-profile', userData)

      const updatedUser = response.data.user

      setUser(updatedUser)

    } catch (error) {

      console.error('Failed to update user:', error)

      throw error

    }

  }



  const clearUser = () => {

    setUser(null)

    setLoading(false)

  }



  useEffect(() => {

    fetchUser()

  }, [])



  const value = {

    user,

    loading,

    setUser,

    fetchUser,

    updateUser,

    clearUser,

  }



  return <UserContext.Provider value={value}>{children}</UserContext.Provider>

}



export const useUser = () => {

  const context = useContext(UserContext)



  if (!context) {

    throw new Error('useUser must be used inside a UserProvider')

  }



  return context

}



export default UserContext

