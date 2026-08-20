import React from 'react'
import { LuMenu, LuBell, LuSearch, LuSettings } from 'react-icons/lu'
import { useUser } from '../../context/UserContext'

const UserDashboardNavbar = ({ onMenuClick }) => {
  const { user } = useUser()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-slate-200/60 shadow-sm z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
          >
            <LuMenu size={24} />
          </button>

          <div className="flex-1 lg:flex-none flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">
                TaskFlow
              </h1>
            </div>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search my tasks..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 relative">
              <LuBell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <button className="hidden sm:block p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200">
              <LuSettings size={20} />
            </button>

            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default UserDashboardNavbar
