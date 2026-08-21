import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import API from '../../utils/axios'
import { LuDownload, LuTrash2 } from 'react-icons/lu'

const ManageUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch users and tasks in parallel
      const [usersResponse, tasksResponse] = await Promise.all([
        API.get('/api/users'),
        API.get('/api/tasks')
      ])
      
      const usersData = usersResponse.data || []
      const allTasks = tasksResponse.data.tasks || []
      
      // Calculate task statistics for each user locally
      const usersWithStats = usersData.map((user) => {
        // Filter tasks assigned to this user
        const userTasks = allTasks.filter(task => 
          task.assignedTo && task.assignedTo.some(u => u._id === user._id)
        )
        
        // Calculate task counts
        const pending = userTasks.filter(task => task.status === 'pending').length
        const inProgress = userTasks.filter(task => task.status === 'in-progress').length
        const completed = userTasks.filter(task => task.status === 'completed').length
        
        return {
          ...user,
          taskStats: {
            pending,
            inProgress,
            completed,
            total: userTasks.length
          }
        }
      })
      
      setUsers(usersWithStats)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      setError('Failed to load team members')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async () => {
    try {
      const response = await API.get('/api/reports/user-report', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'user_report.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report')
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return
    }

    try {
      await API.delete(`/api/users/${userId}`)
      // Refresh the users list after deletion
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user: ' + (error.response?.data?.message || error.message))
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full animate-fade-in">
        {/* Header Section */}
        <div className=" ">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Team Members</h1>
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium hover:bg-green-100 transition-all duration-200"
            >
              <LuDownload size={18} />
              <span>Download Report</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse mx-auto"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse mx-auto"></div>
                  <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="flex gap-1.5 justify-center">
                    <div className="h-6 w-12 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-6 w-12 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-xl p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="text-red-500 mt-0.5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-red-700 font-medium text-sm">{error}</p>
                <button
                  onClick={fetchUsers}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Grid */}
        {!loading && !error && users.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/60 p-8 text-center">
            <div className="text-slate-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No team members found</p>
            <p className="text-slate-500 text-sm mt-1">Start by adding team members to your organization</p>
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div key={user._id} className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 hover:shadow-md transition-all duration-300 relative group">
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteUser(user._id, user.name)}
                  className="absolute top-3 right-3 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete Member"
                >
                  <LuTrash2 size={16} />
                </button>

                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-semibold mb-2 shadow-md">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  
                  {/* Name */}
                  <h3 className="text-sm font-semibold text-slate-900 mb-0.5">{user.name}</h3>
                  
                  {/* Email */}
                  <p className="text-xs text-slate-500 mb-2">{user.email}</p>
                </div>

                {/* Task Statistics */}
                <div className="flex justify-center gap-1.5">
                  <div className="text-center px-2 py-1.5 bg-purple-50 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-0.5">Pending</p>
                    <p className="text-sm font-bold text-purple-700">{user.taskStats?.pending || 0}</p>
                  </div>
                  <div className="text-center px-2 py-1.5 bg-cyan-50 rounded-lg border border-cyan-100">
                    <p className="text-xs text-cyan-600 font-medium mb-0.5">In Progress</p>
                    <p className="text-sm font-bold text-cyan-700">{user.taskStats?.inProgress || 0}</p>
                  </div>
                  <div className="text-center px-2 py-1.5 bg-green-50 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-medium mb-0.5">Completed</p>
                    <p className="text-sm font-bold text-green-700">{user.taskStats?.completed || 0}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageUsers
