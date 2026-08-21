import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-8'>
      <div className="w-full max-w-6xl">
        <main className="flex items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
