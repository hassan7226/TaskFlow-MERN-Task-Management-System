import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LuLayoutDashboard, LuListTodo, LuCalendar, LuLogOut, LuX } from 'react-icons/lu'
import { useUser } from '../../context/UserContext'

const UserDashboardSidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { clearUser } = useUser()

  const handleLogout = () => {
    clearUser()
    navigate('/login')
  }

  const navItems = [
    {
      path: '/user/dashboard',
      icon: LuLayoutDashboard,
      label: 'Dashboard',
      description: 'My overview'
    },
    {
      path: '/user/my-tasks',
      icon: LuListTodo,
      label: 'My Tasks',
      description: 'Assigned tasks'
    },
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 pt-16
          w-72 bg-white/95 backdrop-blur-lg border-r border-slate-200/60 shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col max-h-full">
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200/60">
            <span className="font-semibold text-slate-900">Menu</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
            >
              <LuX size={20} />
            </button>
          </div>

          <div className="p-6 border-b border-slate-200/60">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-base truncate">
                  {user?.name || 'User'}
                </h3>
                <p className="text-xs text-slate-500 capitalize mt-0.5">
                  {user?.role || 'User'}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4">
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
                Main Menu
              </p>
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = checkActive(item.path)
                  return (
                    <li key={item.path}>
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium
                          transition-all duration-200 group relative overflow-hidden
                          ${active
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                          }
                        `}
                      >
                        <Icon size={20} className={active ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'} />
                        <div className="flex-1 text-left">
                          <span className="block">{item.label}</span>
                          <span className={`text-xs ${active ? 'text-emerald-100' : 'text-slate-400'}`}>
                            {item.description}
                          </span>
                        </div>
                        {active && (
                          <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-slate-200/60">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
            >
              <LuLogOut size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default UserDashboardSidebar
