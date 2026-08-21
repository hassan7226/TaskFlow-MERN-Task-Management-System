import React, { useEffect, useState } from 'react'
import UserDashboardLayout from '../../components/UserDashboard/UserDashboardLayout'
import TaskDistributionChart from '../../components/Dashboard/TaskDistributionChart'
import TaskPriorityChart from '../../components/Dashboard/TaskPriorityChart'
import RecentTasks from '../../components/Dashboard/RecentTasks'
import API from '../../utils/axios'
import { useUser } from '../../context/UserContext'
import moment from 'moment'

const UserDashboard = () => {
  const { user } = useUser()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await API.get('/api/tasks/user-dashboard-data')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Failed to fetch user dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Format the API data for the chart components
  const formatTaskDistributionData = (apiData) => {
    if (!apiData || !apiData.charts) return null
    const distribution = apiData.charts.taskDistribution
    return [
      { name: 'Pending', value: distribution.pending || 0 },
      { name: 'In Progress', value: distribution['in-progress'] || 0 },
      { name: 'Completed', value: distribution.completed || 0 }
    ]
  }

  const formatPriorityData = (apiData) => {
    if (!apiData || !apiData.charts) return null
    const priority = apiData.charts.taskPriorityLevels
    return [
      { name: 'Low', value: priority.low || 0 },
      { name: 'Medium', value: priority.medium || 0 },
      { name: 'High', value: priority.high || 0 }
    ]
  }

  // Statistics data for the overview card
  const getStatistics = () => {
    if (!dashboardData || !dashboardData.statistics) return []
    const stats = dashboardData.statistics
    return [
      {
        title: 'My Tasks',
        count: stats.totalTasks || 0,
        color: 'bg-blue-500'
      },
      {
        title: 'Pending',
        count: stats.pendingTasks || 0,
        color: 'bg-purple-500'
      },
      {
        title: 'In Progress',
        count: stats.inProgressTasks || 0,
        color: 'bg-cyan-500'
      },
      {
        title: 'Completed',
        count: stats.completedTasks || 0,
        color: 'bg-green-500'
      }
    ]
  }

  const getGreeting = () => {
    const hour = moment().hour()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const currentDate = moment().format('dddd Do MMM YYYY')

  return (
    <UserDashboardLayout>
      <div className="space-y-6 w-full animate-fade-in">
        {/* Main Overview Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200/60 p-4 sm:p-5 w-full hover:shadow-xl transition-shadow duration-300">
          {/* Greeting Section */}
          <div className="mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {getGreeting()}! {user?.name || 'User'}
            </h1>
            <p className="text-slate-600 mt-1 text-sm font-medium">{currentDate}</p>
          </div>

          {/* Statistics Row */}
          {!loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {getStatistics().map((stat, index) => (
                <div key={index} className="flex items-center gap-2 group hover:scale-105 transition-transform duration-200">
                  <div className={`w-1 h-6 ${stat.color} rounded-full shadow-sm`}></div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{stat.count}</p>
                    <p className="text-xs text-slate-600 font-medium">{stat.title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Professional Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1 h-6 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-6 w-10 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-3 w-20 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Professional Error State */}
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
                  onClick={fetchDashboardData}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline underline-offset-2 transition-colors"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Section - Two Column Layout */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Left: Task Distribution Chart */}
            <div className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <TaskDistributionChart data={formatTaskDistributionData(dashboardData)} />
            </div>

            {/* Right: Task Priority Levels Chart */}
            <div className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <TaskPriorityChart data={formatPriorityData(dashboardData)} />
            </div>
          </div>
        )}

        {/* Recent Tasks Section */}
        {!loading && !error && (
          <div className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <RecentTasks tasks={dashboardData?.recentTasks || []} />
          </div>
        )}
      </div>
    </UserDashboardLayout>
  )
}

export default UserDashboard
