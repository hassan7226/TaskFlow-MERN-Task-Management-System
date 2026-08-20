import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
      <div className="w-full max-w-6xl">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-slate-900 text-center">Task Manager</h1>
        </header>
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
