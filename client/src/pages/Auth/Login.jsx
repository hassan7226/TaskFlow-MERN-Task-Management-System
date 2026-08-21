import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/input/input'
import { validateEmail } from '../../utils/helper'
import API from '../../utils/axios'
import { useUser } from '../../context/UserContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setUser } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    try {
      const response = await API.post('/auth/login', { email, password })
      const { role, id, name, email: userEmail, profileImageUrl } = response.data

      // Set user data in context
      setUser({
        id,
        name,
        email: userEmail,
        profileImageUrl,
        role
      })

      // Redirect to the appropriate dashboard based on the role
      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      // Handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError('An error occurred during login. Please try again.')
      }
    }
  }
   
  

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="auth-card p-4 sm:p-6">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-600 mt-2 text-sm sm:text-base">Please enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <Input
              type="email"
              label="Email Address"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />

            <Input
              type="password"
              label="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex items-start gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <button type="button" className="text-sm auth-link text-left" onClick={() => navigate('/reset-password')}>
                Forgot Password?
              </button>
            </div>

            <button className="btn-primary w-full py-3 sm:py-3.5 text-base sm:text-lg">
              Log In
            </button>

            <div className="pt-4 sm:pt-6 border-t border-slate-200">
              <p className="text-center text-sm text-slate-600">
                Don't have an account?{' '}
                <button type="button" className="auth-link text-sm" onClick={() => navigate('/signup')}>
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
