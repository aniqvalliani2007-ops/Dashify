import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import { Mail, Calendar, User, MessageSquare, Trash2, Download, RefreshCw } from 'lucide-react'
import emailService from '../services/emailService'
import toast from 'react-hot-toast'

export const AdminSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = () => {
    const data = emailService.getSubmissions()
    setSubmissions(data.reverse()) // Most recent first
  }

  const deleteSubmission = (index) => {
    if (confirm('Delete this submission?')) {
      const updated = [...submissions]
      updated.splice(index, 1)
      localStorage.setItem('contactSubmissions', JSON.stringify(updated.reverse()))
      setSubmissions(updated)
      setSelectedSubmission(null)
      toast.success('Submission deleted')
    }
  }

  const clearAll = () => {
    if (confirm('Delete ALL submissions? This cannot be undone.')) {
      localStorage.removeItem('contactSubmissions')
      setSubmissions([])
      setSelectedSubmission(null)
      toast.success('All submissions cleared')
    }
  }

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast.error('No submissions to export')
      return
    }

    const headers = ['Name', 'Email', 'Subject', 'Message', 'Timestamp']
    const rows = submissions.map(sub => [
      sub.name,
      sub.email,
      sub.subject,
      sub.message,
      sub.timestamp
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `contact-submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    toast.success('Exported to CSV')
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Form Submissions</h1>
            <p className="text-gray-600">View and manage contact form submissions stored in localStorage</p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={loadSubmissions}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            <button
              onClick={exportToCSV}
              disabled={submissions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={clearAll}
              disabled={submissions.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Clear All
            </button>
            <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold">{submissions.length}</span>
              <span>submission{submissions.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Content */}
          {submissions.length === 0 ? (
            <div className="glass-card border border-gray-200 p-12 text-center bg-white">
              <Mail size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
              <p className="text-gray-600 mb-6">
                Contact form submissions will appear here. Try submitting the contact form to see them.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 transition-colors"
              >
                Go to Contact Page
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submissions List */}
              <div className="lg:col-span-1 space-y-3">
                {submissions.map((submission, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedSubmission(submission)}
                    className={`glass-card border p-4 cursor-pointer transition-all ${
                      selectedSubmission === submission
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {submission.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteSubmission(index)
                        }}
                        className="text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 truncate">{submission.subject}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      {new Date(submission.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Submission Detail */}
              <div className="lg:col-span-2">
                {selectedSubmission ? (
                  <div className="glass-card border border-gray-200 p-6 bg-white">
                    <div className="flex items-start justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Submission Details</h2>
                      <button
                        onClick={() => deleteSubmission(submissions.indexOf(selectedSubmission))}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-medium transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <User size={16} className="text-blue-600" />
                          Name
                        </div>
                        <p className="text-gray-900 pl-6">{selectedSubmission.name}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Mail size={16} className="text-blue-600" />
                          Email
                        </div>
                        <a
                          href={`mailto:${selectedSubmission.email}`}
                          className="text-blue-600 hover:text-blue-700 pl-6"
                        >
                          {selectedSubmission.email}
                        </a>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <MessageSquare size={16} className="text-blue-600" />
                          Subject
                        </div>
                        <p className="text-gray-900 pl-6">{selectedSubmission.subject}</p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <MessageSquare size={16} className="text-blue-600" />
                          Message
                        </div>
                        <div className="pl-6 p-4 bg-gray-50 border border-gray-200 text-gray-900 whitespace-pre-wrap">
                          {selectedSubmission.message}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                          <Calendar size={16} className="text-blue-600" />
                          Submitted
                        </div>
                        <p className="text-gray-900 pl-6">
                          {new Date(selectedSubmission.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <a
                        href={`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`}
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 transition-colors"
                      >
                        <Mail size={16} />
                        Reply via Email
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="glass-card border border-gray-200 p-12 text-center bg-white">
                    <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Select a submission to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSubmissionsPage
