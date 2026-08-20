import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import API from '../../utils/axios'
import { LuPlus, LuX, LuUpload, LuUsers, LuTrash2 } from 'react-icons/lu'

const UpdateTask = () => {
  const { taskId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [users, setUsers] = useState([])
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: [],
    attachments: [],
    todoChecklist: []
  })

  // Todo checklist state
  const [newTodo, setNewTodo] = useState('')

  // Fetch task data and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true)
        
        // Fetch task data
        const taskResponse = await API.get(`/tasks/${taskId}`)
        const task = taskResponse.data.task
        
        setFormData({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'medium',
          status: task.status || 'pending',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          assignedTo: task.assignedTo?.map(user => user._id || user.id) || [],
          attachments: task.attachments || [],
          todoChecklist: task.todoChecklist || []
        })

        // Fetch users for assignment
        const usersResponse = await API.get('/users')
        setUsers(usersResponse.data || [])
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load task data')
        
        // Try to get users at least
        try {
          const authResponse = await API.get('/auth/profile')
          if (authResponse.data?.user) {
            setUsers([authResponse.data.user])
          }
        } catch (authError) {
          setUsers([{
            _id: 'test-user-1',
            name: 'Test User',
            email: 'test@example.com',
            profileImageUrl: null
          }])
        }
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

  const handleAssignedToChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }))
  }

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setFormData(prev => ({
        ...prev,
        todoChecklist: [...prev.todoChecklist, { text: newTodo.trim(), completed: false }]
      }))
      setNewTodo('')
    }
  }

  const handleRemoveTodo = (index) => {
    setFormData(prev => ({
      ...prev,
      todoChecklist: prev.todoChecklist.filter((_, i) => i !== index)
    }))
  }

  const handleTodoToggle = (index) => {
    setFormData(prev => ({
      ...prev,
      todoChecklist: prev.todoChecklist.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    }))
  }

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setLoading(true)
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)
        const response = await API.post('/auth/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return response.data.imageUrl
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('File upload failed:', error)
      setError('Failed to upload files: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAttachment = (index) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }
    if (!formData.dueDate) {
      setError('Due date is required')
      return
    }
    if (formData.assignedTo.length === 0) {
      setError('Please assign at least one team member')
      return
    }

    try {
      setLoading(true)
      await API.put(`/tasks/${taskId}`, formData)
      navigate('/admin/manage-tasks')
    } catch (error) {
      console.error('Failed to update task:', error)
      setError(error.response?.data?.message || 'Failed to update task')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      await API.delete(`/tasks/${taskId}`)
      navigate('/admin/manage-tasks')
    } catch (error) {
      console.error('Failed to delete task:', error)
      setError(error.response?.data?.message || 'Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  const getAssignedUsers = () => {
    return users.filter(user => formData.assignedTo.includes(user._id || user.id))
  }

  if (fetchLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading task data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-h-screen overflow-y-auto py-6 px-4 animate-fade-in">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Update Task</h1>
              <p className="text-slate-600 mt-1 text-sm">Edit the task details below.</p>
            </div>
            <button
              type="button"
              onClick={handleDeleteTask}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
              title="Delete Task"
            >
              <LuTrash2 size={16} />
              <span>Delete</span>
            </button>
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

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Task Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a descriptive task title"
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about this task..."
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-sm bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Status, Priority, Due Date, and Assigned To */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white text-sm appearance-none cursor-pointer"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign To *</label>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(true)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all text-sm bg-slate-50"
                >
                  <LuUsers size={18} />
                  <span>Select Members</span>
                  <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {formData.assignedTo.length}
                  </span>
                </button>
                {/* Selected Members Display */}
                {formData.assignedTo.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {getAssignedUsers().map(user => (
                      <div key={user._id} className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
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
                        <button
                          type="button"
                          onClick={() => handleAssignedToChange(user._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Todo Checklist */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Todo Checklist</label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTodo())}
                    placeholder="Add a checklist item..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-slate-50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddTodo}
                    className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <LuPlus size={18} />
                  </button>
                </div>
                {formData.todoChecklist.map((todo, index) => (
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
                    <button
                      type="button"
                      onClick={() => handleRemoveTodo(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <LuX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Attachments</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-500/50 hover:bg-indigo-50/10 transition-all cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer flex flex-col items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <LuUpload size={24} className="text-indigo-500" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">{loading ? 'Uploading...' : 'Click to upload images'}</span>
                  <span className="text-xs text-slate-500">JPG, PNG, GIF, WEBP up to 5MB</span>
                </label>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                      <span className="text-sm text-slate-700 truncate flex-1">{attachment}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1 ml-2"
                      >
                        <LuX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/admin/manage-tasks')}
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

        {/* Member Selection Modal */}
        {showMemberModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-slate-200/60 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Select Team Members</h3>
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <LuX size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {users.map(user => {
                    const userId = user._id || user.id
                    return (
                      <div
                        key={userId}
                        onClick={() => handleAssignedToChange(userId)}
                        className={`
                          flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md
                          ${formData.assignedTo.includes(userId)
                            ? 'border-indigo-500 bg-indigo-50/50 shadow-md'
                            : 'border-slate-200 hover:border-slate-300'
                          }
                        `}
                      >
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
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
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        {formData.assignedTo.includes(userId) && (
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="p-6 border-t border-slate-200/60">
                <button
                  onClick={() => setShowMemberModal(false)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default UpdateTask