import React from 'react'
import { useNavigate } from 'react-router-dom'

const RecentTasks = ({ tasks = [] }) => {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-500 text-white shadow-sm'
      case 'in-progress':
        return 'bg-blue-500 text-white shadow-sm'
      case 'completed':
        return 'bg-green-500 text-white shadow-sm'
      default:
        return 'bg-slate-500 text-white shadow-sm'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500 text-white shadow-sm'
      case 'medium':
        return 'bg-orange-500 text-white shadow-sm'
      case 'high':
        return 'bg-red-500 text-white shadow-sm'
      default:
        return 'bg-slate-500 text-white shadow-sm'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      return date.toLocaleDateString('en-US', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const handleSeeAll = () => {
    navigate('/admin/manage-tasks')
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-4 w-full hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Tasks</h2>
          <button 
            onClick={handleSeeAll}
            className="text-sm text-primary hover:text-primary-dark font-medium transition-colors"
          >
            See All →
          </button>
        </div>
        <p className="text-slate-500 text-sm">No recent tasks found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-4 w-full hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Tasks</h2>
        <button 
          onClick={handleSeeAll}
          className="text-sm text-primary hover:text-primary-dark font-medium transition-colors hover:underline underline-offset-2"
        >
          See All →
        </button>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden sm:grid grid-cols-12 gap-2 mb-3 px-2">
        <div className="col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Name
        </div>
        <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Status
        </div>
        <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Priority
        </div>
        <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
          Created On
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className="hidden sm:grid grid-cols-12 gap-2 p-2 rounded-lg hover:bg-slate-50 transition-all duration-200 items-center hover:shadow-sm"
          >
            {/* Name */}
            <div className="col-span-5 min-w-0">
              <h3 className="text-sm font-medium text-slate-900 truncate hover:text-primary transition-colors">
                {task.title}
              </h3>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)} hover:opacity-90 transition-opacity`}>
                {task.status}
              </span>
            </div>

            {/* Priority */}
            <div className="col-span-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)} hover:opacity-90 transition-opacity`}>
                {task.priority}
              </span>
            </div>

            {/* Created On */}
            <div className="col-span-3 text-right">
              <p className="text-sm text-slate-600 font-medium">
                {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
        ))}

        {/* Mobile View - Card Layout */}
        {tasks.map((task, index) => (
          <div 
            key={`mobile-${index}`} 
            className="sm:hidden p-3 rounded-lg hover:bg-slate-50 transition-all duration-200 hover:shadow-sm border border-slate-100"
          >
            <div className="flex flex-col gap-2">
              {/* Name */}
              <h3 className="text-sm font-medium text-slate-900 hover:text-primary transition-colors">
                {task.title}
              </h3>

              {/* Status and Priority Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)} hover:opacity-90 transition-opacity`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)} hover:opacity-90 transition-opacity`}>
                  {task.priority}
                </span>
              </div>

              {/* Created On */}
              <p className="text-xs text-slate-500 font-medium">
                Created: {formatDate(task.createdAt)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTasks