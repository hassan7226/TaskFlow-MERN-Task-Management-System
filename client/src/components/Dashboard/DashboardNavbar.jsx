import React from 'react'
import { LuMenu } from 'react-icons/lu'

const DashboardNavbar = ({ onMenuClick }) => {
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <LuMenu size={24} />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              TaskFlow
            </h1>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
