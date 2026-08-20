import React, { useState } from 'react'
import { useUser } from '../../context/UserContext'
import UserDashboardNavbar from './UserDashboardNavbar'
import UserDashboardSidebar from './UserDashboardSidebar'

const UserDashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useUser()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 w-full overflow-x-hidden flex flex-col">
      <UserDashboardNavbar onMenuClick={toggleSidebar} />

      <div className="flex w-full flex-1 pt-16">
        <UserDashboardSidebar
          isOpen={sidebarOpen}
          onClose={closeSidebar}
          user={user}
        />

        <main className="flex-1 w-full overflow-x-hidden min-w-0 lg:ml-72 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default UserDashboardLayout
