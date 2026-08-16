import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LuLayoutDashboard, LuListTodo, LuPlus, LuUsers, LuLogOut, LuX } from 'react-icons/lu'
import { useUser } from '../../context/UserContext'

const DashboardSidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearUser } = useUser()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LuLayoutDashboard, label: 'Dashboard' },
    { path: '/admin/manage-tasks', icon: LuListTodo, label: 'Manage Tasks' },
    { path: '/admin/create-task', icon: LuPlus, label: 'Create Task' },
    { path: '/admin/manage-user', icon: LuUsers, label: 'Team Members' },
  ]

  const currentPath = location.pathname

  const checkActive = (path) => {
    return currentPath === path
  }

  const handleNavClick = (path) => {
    navigate(path)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 bg-white border-r border-slate-200 shadow-lg lg:shadow-none
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col max-h-full">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
            <span className="font-semibold text-slate-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            >
              <LuX size={20} />
            </button>
          </div>

          <div className="p-4 sm:p-6 border-b border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md mb-3">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate w-full">
                {user?.name || 'User'}
              </h3>
              <p className="text-xs text-slate-500 capitalize mt-0.5">
                {user?.role || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate w-full mt-1">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = checkActive(item.path)
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                        transition-all duration-200
                        ${active
                          ? 'bg-primary/10 text-primary'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }
                      `}
                    >
                      <Icon size={20} className={active ? 'text-primary' : 'text-slate-500'} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
            >
              <LuLogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default DashboardSidebar
