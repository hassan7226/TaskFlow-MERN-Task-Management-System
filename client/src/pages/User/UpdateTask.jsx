import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import UserDashboardLayout from '../../components/UserDashboard/UserDashboardLayout'
import API from '../../utils/axios'

const UpdateTask = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fetchLoading, setFetchLoading] = useState(true)

  // Form state - only editable fields for users
  const [formData, setFormData] = useState({
    status: 'pending',
    todoChecklist: []
  })

  // Read-only data
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    dueDate: '',
    assignedTo: [],
    attachments: [],
    createdAt: ''
  })

  // Fetch task data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true)
        
        // Fetch task data
        const taskResponse = await API.get(`/tasks/${taskId}`)
        const task = taskResponse.data.task
        
        // Set editable form data
        setFormData({
          status: task.status || 'pending',
          todoChecklist: task.todoChecklist || []
        })

        // Set read-only data
        setTaskData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          assignedTo: task.assignedTo || [],
          attachments: task.attachments || [],
          createdAt: task.createdAt || ''
        })
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load task data')
      } finally {
        setFetchLoading(false)
      }
    }
    
    fetchData()
  }, [taskId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTodoToggle = (index) => {
    setFormData(prev => ({
      ...prev,
      todoChecklist: prev.todoChecklist.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      // Update status
      await API.put(`/tasks/${taskId}/status`, { status: formData.status })
      // Update todo checklist
      await API.put(`/tasks/${taskId}/todo`, { todoChecklist: formData.todoChecklist })
      navigate('/user/my-tasks')
    } catch (error) {
      console.error('Failed to update task:', error)
      setError(error.response?.data?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

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

  if (fetchLoading) {
    return (
      <UserDashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading task data...</p>
          </div>
        </div>
      </UserDashboardLayout>
    )
  }

  const completedTodos = formData.todoChecklist.filter(item => item.completed).length || 0
  const totalTodos = formData.todoChecklist.length || 0
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  return (
    <UserDashboardLayout>
      <div className="max-h-screen overflow-y-auto py-6 px-4 animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Update Task</h1>
              <p className="text-slate-600 mt-1 text-sm">Update task status and progress.</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 space-y-6">
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/60 rounded-xl p-4 text-red-700 text-sm">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Read-only Task Info */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Task Title</label>
                  <p className="text-sm font-semibold text-slate-900">{taskData.title}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(formData.status)}`}>
                    {formData.status === 'in-progress' ? 'In Progress' : formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityColor(taskData.priority)}`}>
                    {taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1)} Priority
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <p className="text-sm text-slate-700">{taskData.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                  <p className="text-sm text-slate-700">{formatDate(taskData.dueDate)}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Created</label>
                  <p className="text-sm text-slate-700">{formatDate(taskData.createdAt)}</p>
                </div>
              </div>

              {taskData.assignedTo && taskData.assignedTo.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Assigned Team Members</label>
                  <div className="flex flex-wrap gap-2">
                    {taskData.assignedTo.map((user, index) => (
                      <div key={index} className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
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
                        <span className="text-xs text-slate-700 font-medium">{user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {taskData.attachments && taskData.attachments.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-2">Attachments</label>
                  <div className="flex flex-wrap gap-2">
                    {taskData.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:text-indigo-800 underline"
                      >
                        {attachment.split('/').pop()}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status - Editable */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-sm appearance-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

           
            {/* Progress Bar */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-700">Task Progress</span>
                <span className="text-sm font-medium text-slate-600">{completedTodos} / {totalTodos} completed</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">{Math.round(progress)}% complete</p>
            </div>

            {/* Todo Checklist - Editable (only mark as complete) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Todo Checklist</label>
              <div className="space-y-3">
                {formData.todoChecklist.length === 0 ? (
                  <p className="text-sm text-slate-500 italic">No checklist items for this task</p>
                ) : (
                  formData.todoChecklist.map((todo, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleTodoToggle(index)}
                        className="w-5 h-5 rounded-lg border-slate-300 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/user/my-tasks')}
                className="flex-1 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Updating Task...' : 'Update Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </UserDashboardLayout>
  )
}

export default UpdateTask
