import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/input/input'
import ProfilePhotoSelecter from '../../components/input/ProfilePhotoSelecter'
import { validateEmail } from '../../utils/helper'
import API from '../../utils/axios'
import { uploadProfileImage } from '../../utils/imageupload'
import { useUser } from '../../context/UserContext'

const Signup = () => {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [role, setRole] = useState('member')
  const [invitationToken, setInvitationToken] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingToken, setIsValidatingToken] = useState(false)
  const [tokenValid, setTokenValid] = useState(false)
  const navigate = useNavigate()
  const { setUser } = useUser()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setInvitationToken(token)
      setRole('member')
      validateInvitationToken(token)
    }
  }, [searchParams])

  const validateInvitationToken = async (token) => {
    setIsValidatingToken(true)
    try {
      const response = await API.get(`/invitations/validate/${token}`)
      setEmail(response.data.email)
      setTokenValid(true)
    } catch (error) {
      console.error('Invalid invitation token:', error)
      setError('Invalid or expired invitation link. Please contact your administrator for a new invitation.')
      setTokenValid(false)
    } finally {
      setIsValidatingToken(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (role === 'member' && invitationToken && !tokenValid) {
      setError('Invalid invitation token. Please contact your administrator.')
      return
    }

    if (role === 'member' && !invitationToken) {
      setError('Invitation token is required for team members. Please use the invitation link sent by your admin.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      let profileImageUrl = null

      if (profilePicture) {
        const uploadedImage = await uploadProfileImage(profilePicture)
        profileImageUrl = uploadedImage?.imageUrl || null
      }

      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        profileImageUrl,
        role,
        invitationToken: invitationToken || undefined,
      }

      const response = await API.post('/auth/register', payload)
      const { id, name: userName, email: userEmail, profileImageUrl: returnedProfileImageUrl, role: userRole } = response.data

      // Set user data in context
      setUser({
        id,
        name: userName,
        email: userEmail,
        profileImageUrl: returnedProfileImageUrl,
        role: userRole
      })

      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Signup failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
        <div className="auth-card p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Create an account</h2>
            {tokenValid && (
              <p className="text-sm text-green-600 mt-1">You've been invited to join the team!</p>
            )}
          </div>

          {isValidatingToken ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col items-center justify-center mb-2">
                  <ProfilePhotoSelecter image={profilePicture} setImage={setProfilePicture} size={100} />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Input
                    type="text"
                    label="Full Name"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                  />

                  <Input
                    type="email"
                    label="Email Address"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    disabled={tokenValid}
                    className={tokenValid ? 'bg-slate-100 cursor-not-allowed' : ''}
                  />

                  <Input
                    type="password"
                    label="Password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                  />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      disabled={tokenValid}
                      className={`w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm bg-white appearance-none cursor-pointer ${tokenValid ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="admin">Admin - Create your own workspace</option>
                      <option value="member">Member - Join an existing team</option>
                    </select>
                    {role === 'member' && !tokenValid && (
                      <p className="text-xs text-slate-500 mt-1">
                        Members need an invitation link from their admin. Please use the link sent to your email.
                      </p>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 sm:px-4 sm:py-3 flex items-start gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
                <button 
                  className="btn-primary w-full py-3 sm:py-3.5 text-base sm:text-lg" 
                  disabled={isSubmitting || (role === 'member' && invitationToken && !tokenValid)}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Create Account'}
                </button>

                <p className="text-center text-sm text-slate-600 mt-3 sm:mt-4">
                  Already have an account?{' '}
                  <button type="button" className="auth-link text-sm" onClick={() => navigate('/login')}>
                    Login here
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthLayout>
  )
}

export default Signup
