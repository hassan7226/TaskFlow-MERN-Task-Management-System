import React from 'react'
import { useNavigate } from 'react-router-dom'
import { LuPaperclip, LuCalendar, LuUsers } from 'react-icons/lu'

const TaskCard = ({ task }) => {
  const navigate = useNavigate()
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

  const completedTodos = task.todoChecklist?.filter(item => item.completed).length || 0
  const totalTodos = task.todoChecklist?.length || 0
  const progress = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

  const handleCardClick = () => {
    navigate(`/admin/update-task/${task._id}`)
  }

  return (
    <div 
      onClick={handleCardClick}
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
            {task.assignedTo.slice(0, 3).map((user, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-medium shadow-sm"
                title={user.name || 'User'}
              >
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
            <LuPaperclip size={16} />
            <span className="text-xs font-medium">{task.attachments.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard