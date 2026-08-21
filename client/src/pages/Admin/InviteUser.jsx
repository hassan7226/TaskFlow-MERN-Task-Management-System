import React, { useState, useEffect } from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout'
import API from '../../utils/axios'
import { LuMail, LuCopy, LuCheck, LuTrash2, LuPlus, LuX } from 'react-icons/lu'

const InviteUser = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [invitationLink, setInvitationLink] = useState('')
  const [invitations, setInvitations] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  const fetchInvitations = async () => {
    try {
      setFetchLoading(true)
      const response = await API.get('/api/invitations')
      setInvitations(response.data.invitations)
    } catch (error) {
      console.error('Failed to fetch invitations:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  useEffect(() => {
    fetchInvitations()
  }, [])

  const handleSendInvitation = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setInvitationLink('')

    if (!email) {
      setError('Please enter an email address')
      return
    }

    try {
      setLoading(true)
      const response = await API.post('/api/invitations/send', { email })
      setSuccess(`Invitation sent to ${email}`)
      setInvitationLink(response.data.invitation.invitationLink)
      setEmail('')
      fetchInvitations()
    } catch (error) {
      console.error('Failed to send invitation:', error)
      setError(error.response?.data?.message || 'Failed to send invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationLink)
    setSuccess('Link copied to clipboard!')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleDeleteInvitation = async (id) => {
    try {
      await API.delete(`/api/invitations/${id}`)
      setSuccess('Invitation deleted successfully')
      fetchInvitations()
    } catch (error) {
      console.error('Failed to delete invitation:', error)
      setError(error.response?.data?.message || 'Failed to delete invitation')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Invite Users</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Send invitations to new team members</p>
          </div>
        </div>

        {/* Send Invitation Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Send New Invitation</h2>
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <LuPlus size={18} />
                      Send Invitation
                    </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {success && !invitationLink && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
                {success}
              </div>
            )}

            {invitationLink && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="text-sm font-medium text-indigo-900">Invitation Link</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 text-sm font-medium self-start sm:self-auto"
                  >
                    <LuCopy size={16} />
                    Copy Link
                  </button>
                </div>
                <div className="bg-white rounded-lg p-3 text-sm text-slate-700 break-all">
                  {invitationLink}
                </div>
                <p className="text-xs text-indigo-600 mt-2">
                  This link will expire in 7 days. Share it with the invited user.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Invitations List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Sent Invitations</h2>
          
          {fetchLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <LuMail size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No invitations sent yet</p>
              <p className="text-slate-400 text-sm mt-1">Send your first invitation to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div
                  key={invitation._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <LuMail className="text-indigo-600" size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {invitation.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getStatusBadge(invitation.status)}`}>
                            {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(invitation.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:ml-4 justify-end">
                    {invitation.status === 'pending' && !isExpired(invitation.expiresAt) && (
                      <button
                        onClick={() => {
                          const link = `${window.location.origin}/signup?token=${invitation.token}`
                          navigator.clipboard.writeText(link)
                          setSuccess('Link copied to clipboard!')
                          setTimeout(() => setSuccess(''), 2000)
                        }}
                        className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Copy invitation link"
                      >
                        <LuCopy size={18} />
                      </button>
                    )}
                    {invitation.status === 'pending' && (
                      <button
                        onClick={() => handleDeleteInvitation(invitation._id)}
                        className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete invitation"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default InviteUser
