import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import TaskCard from '../../components/Dashboard/TaskCard'
import API from '../../utils/axios'
import { LuDownload } from 'react-icons/lu'

const ManageTasks = () => {
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
      setTasks(response.data.tasks || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

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

  const handleDownloadReport = async () => {
    try {
      const response = await API.get('/api/reports/task-report', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'task_report.xlsx')
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Failed to download report:', error)
      alert('Failed to download report')
    }
  }

  const counts = getTaskCounts()

  const filters = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'pending', label: 'Pending', count: counts.pending },
    { id: 'in-progress', label: 'In Progress', count: counts.inProgress },
    { id: 'completed', label: 'Completed', count: counts.completed }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full animate-fade-in">
        {/* Header Section - Single Horizontal Toolbar */}
        <div className="p-3 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Page Title - Left */}
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">My Tasks</h1>

            {/* Center - Status Filters */}
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
                  {/* Count Badge */}
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${activeFilter === filter.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-slate-100 text-slate-600'
                    }
                  `}>
                    {filter.count}
                  </span>
                  {/* Active Underline */}
                  {activeFilter === filter.id && (
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Download Report Button - Right */}
            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium hover:bg-indigo-100 transition-all duration-200"
            >
              <LuDownload size={18} />
              <span>Download Report</span>
            </button>
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

        {/* Tasks Grid */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200/60 p-8 text-center">
            <div className="text-slate-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-600 font-medium">No tasks found</p>
            <p className="text-slate-500 text-sm mt-1">Try changing the filter or create a new task</p>
          </div>
        )}

        {!loading && !error && filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default ManageTasks
