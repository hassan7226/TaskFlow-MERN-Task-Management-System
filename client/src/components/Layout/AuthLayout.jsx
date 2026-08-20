import React from 'react'

const AuthLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-4 sm:py-6'>
      <div className="w-full max-w-6xl">
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}

export default AuthLayout
