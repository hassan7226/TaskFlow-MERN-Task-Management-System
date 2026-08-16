import React from 'react'
import AuthLayout from '../../components/Layout/AuthLayout'
import Input from '../../components/input/input'
import ProfilePhotoSelecter from '../../components/input/ProfilePhotoSelecter'
import { validateEmail } from '../../utils/helper'
import { useNavigate } from 'react-router-dom'
import API from '../../utils/axios'
import { uploadProfileImage } from '../../utils/imageupload'
import { useUser } from '../../context/UserContext'

const Signup = () => {
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [profilePicture, setProfilePicture] = React.useState(null)
  const [adminInviteCode, setAdminInviteCode] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const navigate = useNavigate()
  const { setUser } = useUser()

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
        adminInviteToken: adminInviteCode.trim() || undefined,
      }

      const response = await API.post('/auth/register', payload)
      const { id, name: userName, email: userEmail, profileImageUrl: returnedProfileImageUrl, role } = response.data

      // Set user data in context
      setUser({
        id,
        name: userName,
        email: userEmail,
        profileImageUrl: returnedProfileImageUrl,
        role
      })

      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/user/dashboard')
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Signup failed. Please try again.'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
        <div className="auth-card p-3 sm:p-4">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create an account</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-3">
              <div className="lg:col-span-2 space-y-2 sm:space-y-2.5">
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
                />

                <Input
                  type="password"
                  label="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                />

                <Input
                  type="text"
                  label="Admin Invite Code (optional)"
                  id="invite"
                  value={adminInviteCode}
                  onChange={(e) => setAdminInviteCode(e.target.value)}
                  placeholder="Enter code if you have one"
                />

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-2 py-1.5 flex items-start gap-2">
                    <svg className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-600 text-[10px]">{error}</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-1 flex flex-col items-center justify-start">
                <ProfilePhotoSelecter image={profilePicture} setImage={setProfilePicture} size={80} />
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-200">
              <button className="btn-primary w-full py-2" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>

              <p className="text-center text-[10px] text-slate-600 mt-2">
                Already have an account?{' '}
                <button type="button" className="auth-link text-[10px]" onClick={() => navigate('/login')}>
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Signup
