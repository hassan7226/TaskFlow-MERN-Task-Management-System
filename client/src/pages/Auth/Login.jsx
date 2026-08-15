import React from 'react'
import AuthLayout from '../../components/Layout/AuthLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/input/input'
import { validateEmail } from '../../utils/helper'
import API from '../../utils/axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

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
      const { role } = response.data

     // Redirect to the appropriate dashboard based on the role
     if (role === 'admin') {
       navigate('/admin/dashboard')
     } 
     else {
       navigate('/user/dashboard')
     } 
    }

    catch(error) {
        // Handle login error
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message)
        }
        else {
          setError('An error occurred during login. Please try again.')
        }
      };
  }
   
  

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="auth-card">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-600 mt-1 text-xs sm:text-sm">Please enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
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
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <button type="button" className="text-xs auth-link text-left" onClick={() => navigate('/reset-password')}>
                Forgot Password?
              </button>
              <button type="button" className="text-xs auth-link text-left sm:text-right" onClick={() => navigate('/verify-email')}>
                Verify Email
              </button>
            </div>

            <button className="btn-primary w-full">
              Log In
            </button>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-center text-xs text-slate-600">
                Don't have an account?{' '}
                <button type="button" className="auth-link text-xs" onClick={() => navigate('/signup')}>
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
