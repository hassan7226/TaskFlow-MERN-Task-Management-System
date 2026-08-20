import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LuArrowRight, LuClock } from 'react-icons/lu'

const RecentTasks = ({ tasks = [] }) => {
  const navigate = useNavigate()

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'medium':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Tasks</h2>
          <button 
            onClick={handleSeeAll}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center gap-1"
          >
            See All <LuArrowRight size={16} />
          </button>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LuClock size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500 font-medium">No recent tasks found</p>
          <p className="text-slate-400 text-sm mt-1">Create your first task to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 w-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Tasks</h2>
        <button 
          onClick={handleSeeAll}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors flex items-center gap-1 hover:underline underline-offset-2"
        >
          See All <LuArrowRight size={16} />
        </button>
      </div>

      {/* Table Header - Desktop */}
      <div className="hidden sm:grid grid-cols-12 gap-4 mb-4 px-4 py-2 bg-slate-50 rounded-xl">
        <div className="col-span-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Task Name
        </div>
        <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Status
        </div>
        <div className="col-span-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Priority
        </div>
        <div className="col-span-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
          Created
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div 
            key={index} 
            className="hidden sm:grid grid-cols-12 gap-4 p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 items-center hover:shadow-sm border border-transparent hover:border-slate-100"
          >
            {/* Name */}
            <div className="col-span-5 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 truncate hover:text-indigo-600 transition-colors cursor-pointer">
                {task.title}
              </h3>
            </div>

            {/* Status */}
            <div className="col-span-2">
              <span className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${getStatusColor(task.status)} hover:opacity-90 transition-opacity`}>
                {task.status}
              </span>
            </div>

            {/* Priority */}
            <div className="col-span-2">
              <span className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${getPriorityColor(task.priority)} hover:opacity-90 transition-opacity`}>
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
            className="sm:hidden p-4 rounded-xl hover:bg-slate-50 transition-all duration-200 hover:shadow-sm border border-slate-100"
          >
            <div className="flex flex-col gap-3">
              {/* Name */}
              <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer">
                {task.title}
              </h3>

              {/* Status and Priority Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${getStatusColor(task.status)} hover:opacity-90 transition-opacity`}>
                  {task.status}
                </span>
                <span className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${getPriorityColor(task.priority)} hover:opacity-90 transition-opacity`}>
                  {task.priority}
                </span>
              </div>

              {/* Created On */}
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <LuClock size={14} />
                <span>Created: {formatDate(task.createdAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTasks