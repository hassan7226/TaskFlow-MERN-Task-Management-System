import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout'
import API from '../../utils/axios'

const EmailVerify = () => {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [statusMessage, setStatusMessage] = useState('')
  const [error, setError] = useState('')
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const otpRefs = useRef([])
  const navigate = useNavigate()

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (event) => {
    event.preventDefault()
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return

    const next = [...otpDigits]
    for (let i = 0; i < 6; i += 1) {
      next[i] = pasted[i] || ''
    }
    setOtpDigits(next)

    const focusIndex = Math.min(pasted.length, 6) - 1
    if (focusIndex >= 0) otpRefs.current[focusIndex]?.focus()
  }

  const checkVerificationStatus = async () => {
    try {
      setCheckingStatus(true)
      setError('')
      const response = await API.post('/auth/is-user-verified')
      const verified = response?.data?.isVerified

      if (verified) {
        setStatusMessage('Your account is verified.')
      } else {
        setStatusMessage('Your account is not verified yet.')
      }
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not check verification status.'
      setError(message)
    } finally {
      setCheckingStatus(false)
    }
  }

  const handleSendOtp = async () => {
    try {
      setSendingOtp(true)
      setError('')
      setStatusMessage('')
      const response = await API.post('/auth/send-verify-otp')
      setStatusMessage(response?.data?.message || 'OTP sent to your email.')
      otpRefs.current[0]?.focus()
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to send OTP.'
      setError(message)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const otp = otpDigits.join('')

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    try {
      setVerifyingOtp(true)
      setError('')
      setStatusMessage('')
      const response = await API.post('/auth/verify-account', { otp })
      setStatusMessage(response?.data?.message || 'Email verified successfully.')
      setOtpDigits(['', '', '', '', '', ''])
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to verify OTP.'
      setError(message)
    } finally {
      setVerifyingOtp(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto px-4 sm:px-0">
        <div className="auth-card">
          <div className="text-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Verify Your Email</h2>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                className="btn-primary sm:flex-1 py-2"
                onClick={handleSendOtp}
                disabled={sendingOtp}
              >
                {sendingOtp ? 'Sending...' : 'Send OTP'}
              </button>

              <button
                type="button"
                className="btn-secondary sm:flex-1 py-2"
                onClick={checkVerificationStatus}
                disabled={checkingStatus}
              >
                {checkingStatus ? 'Checking...' : 'Check Status'}
              </button>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-3">
              <div className="flex flex-col gap-2">
                <label className="auth-input-label">OTP Code</label>
                <div className="grid grid-cols-6 gap-1.5 sm:gap-2" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        otpRefs.current[index] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="h-10 sm:h-12 w-full rounded-lg border border-slate-300 bg-slate-50 text-center text-base sm:text-lg font-semibold text-slate-800 outline-none transition-all focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500">Tip: you can paste the full OTP code directly.</p>
              </div>

              <button type="submit" className="btn-primary py-2" disabled={verifyingOtp}>
                {verifyingOtp ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            {statusMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-600 text-sm">{statusMessage}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200">
              <p className="text-center text-sm text-slate-600">
                Back to{' '}
                <button type="button" className="auth-link text-sm" onClick={() => navigate('/login')}>
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default EmailVerify
