import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import UserDashboardLayout from '../../components/UserDashboard/UserDashboardLayout'
import API from '../../utils/axios'
import { useUser } from '../../context/UserContext'

const MyTasks = () => {
  const { user } = useUser()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await API.get('/api/tasks')
      // Filter tasks assigned to current user
      const allTasks = response.data.tasks || []
      const userTasks = allTasks.filter(task => 
        task.assignedTo?.some(assignedUser => 
          (assignedUser._id || assignedUser.id) === user?._id
        )
      )
      setTasks(userTasks)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTasks()
    }
  }, [user])

  useEffect(() => {
    // Filter tasks based on active filter
    if (activeFilter === 'all') {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter(task => task.status === activeFilter))
    }
  }, [activeFilter, tasks])

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      completed: tasks.filter(task => task.status === 'completed').length
    }
  }

  const counts = getTaskCounts()

  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'in-progress', label: 'In Progress', count: counts.inProgress },
    { id: 'completed', label: 'Completed', count: counts.completed }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-100 text-purple-700'
      case 'in-progress':
        return 'bg-cyan-100 text-cyan-700'
      case 'completed':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-700'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700'
      case 'high':
        return 'bg-pink-100 text-pink-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      const day = date.getDate()
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const year = date.getFullYear()
      const ordinal = day => {
        const s = ["th", "st", "nd", "rd"]
        const v = day % 100
        return (s[(v - 20) % 10] || s[v] || s[0])
      }
      return `${day}${ordinal(day)} ${month} ${year}`
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const handleCardClick = (taskId) => {
    navigate(`/user/update-task/${taskId}`)
  }

  return (
    <UserDashboardLayout>
      <div className="space-y-6 w-full animate-fade-in">
        {/* Header Section */}
        <div className="p-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Title */}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">My Tasks</h1>

            {/* Status Filters */}
            <div className="flex items-center gap-6 overflow-x-auto pb-2 sm:pb-0">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    flex items-center gap-2 text-sm font-medium whitespace-nowrap transition-all duration-200 relative pb-2
                    ${activeFilter === filter.id
                      ? 'text-indigo-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 font-normal'
                    }
                  `}
                >
                  {filter.label}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${activeFilter === filter.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-slate-100 text-slate-600'
                    }
                  `}>
                    {filter.count}
                  </span>
                  {activeFilter === filter.id && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-5">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-2 w-full bg-slate-200 rounded animate-pulse"></div>
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
                  onClick={fetchTasks}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/60 p-8 text-center">
            <div className="text-slate-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No tasks found</p>
            <p className="text-slate-500 text-sm mt-1">You don't have any assigned tasks yet</p>
          </div>
        )}

        {/* Tasks Grid */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => {
              const completedTodos = task.todoChecklist?.filter(item => item.completed).length || 0
              const totalTodos = task.todoChecklist?.length || 0
              const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

              return (
                <div 
                  key={task._id}
                  onClick={() => handleCardClick(task._id)}
                  className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-5 hover:shadow-md hover:border-primary/50 cursor-pointer transition-all duration-300"
                >
                  {/* Header with Status and Priority */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                        {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </span>
                    </div>
                  </div>

                  {/* Task Title */}
                  <h3 className="text-base font-semibold text-slate-900 mb-2 line-clamp-2">
                    {task.title}
                  </h3>

                  {/* Task Description */}
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                    {task.description || 'No description provided'}
                  </p>

                  {/* Progress Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">Task Done: {completedTodos} / {totalTodos}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <div className="flex flex-col">
                      <span className="text-slate-400 font-medium mb-0.5">Start Date</span>
                      <span className="text-slate-700 font-medium">{formatDate(task.createdAt || task.startDate)}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-slate-400 font-medium mb-0.5">Due Date</span>
                      <span className="text-slate-700 font-medium">{formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  {/* Bottom Section: Users and Attachments */}
                  <div className="flex items-center justify-between">
                    {/* Assigned Team Members */}
                    {task.assignedTo && task.assignedTo.length > 0 && (
                      <div className="flex -space-x-2">
                        {task.assignedTo.slice(0, 3).map((assignedUser, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-medium shadow-sm"
                            title={assignedUser.name || 'User'}
                          >
                            {assignedUser.profileImageUrl ? (
                              <img
                                src={assignedUser.profileImageUrl}
                                alt={assignedUser.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span>{assignedUser.name?.charAt(0).toUpperCase() || 'U'}</span>
                            )}
                          </div>
                        ))}
                        {task.assignedTo.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-slate-700 text-xs font-medium shadow-sm">
                            +{task.assignedTo.length - 3}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Attachments */}
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        <span className="text-xs font-medium">{task.attachments.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </UserDashboardLayout>
  )
}

export default MyTasks
