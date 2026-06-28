import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSV } from '../../hooks/useCSV'
import { useAuth } from '../../hooks/useAuth'
import { FileText, Database, Plus, Trash2, Calendar, Folder, Crown, AlertCircle, LayoutDashboard, LineChart, Users, MessageSquare, Monitor, HelpCircle, MessageCircle, BarChart3 } from 'lucide-react'
import { Button } from '../common/Button'

export const Sidebar = ({ onCloseMobile }) => {
  const navigate = useNavigate()
  const { subscription } = useAuth()
  const {
    files,
    selectedFile,
    setSelectedFile,
    deleteFile,
    setIsUploadOpen,
    loadingFiles
  } = useCSV()

  const tier = subscription?.subscription_tier || 'free'
  const uploadCount = subscription?.csv_upload_count || 0
  const uploadLimit = subscription?.csv_upload_limit || 3
  const isLimitReached = tier === 'free' && uploadCount >= uploadLimit

  const handleUploadClick = () => {
    if (isLimitReached) {
      if (window.confirm('You\'ve reached your free tier limit of 3 files. Upgrade to Pro for unlimited uploads?')) {
        navigate('/pricing')
      }
      return
    }
    setIsUploadOpen(true)
    if (onCloseMobile) onCloseMobile()
  }

  const handleSelectFile = (file) => {
    setSelectedFile(file)
    if (onCloseMobile) onCloseMobile()
  }

  const handleDeleteFile = async (e, file) => {
    e.stopPropagation()
    if (confirm(`Delete "${file.original_name}"?`)) {
      try {
        await deleteFile(file.id, file.file_path)
      } catch (err) {
        alert('Failed to delete: ' + err.message)
      }
    }
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Brand / Logo Area */}
      <div className="h-16 flex items-center px-6 shrink-0 cursor-pointer" onClick={() => navigate('/')}>
        <div className="bg-blue-600 p-1 rounded-sm hover:bg-blue-700 transition-colors mr-2.5">
          <BarChart3 size={18} className="text-white" />
        </div>
        <span className="text-xl font-medium tracking-tight text-gray-900">
          Dashify
        </span>
      </div>

      {/* Main Menu Label */}
      <div className="px-6 py-4 pb-2">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Main Menu</p>
      </div>

      {/* Files List as Menu Items */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
        
        <button 
          onClick={handleUploadClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors group mb-4"
        >
          <Plus size={18} className="text-gray-400 group-hover:text-green-600" />
          {isLimitReached ? 'Limit Reached' : 'Upload Dataset'}
        </button>

        {loadingFiles ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-[#1a5d4e] border-t-transparent"></div>
          </div>
        ) : files.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-gray-400">No datasets yet</p>
          </div>
        ) : (
          files.map((file) => {
            const isSelected = selectedFile?.id === file.id
            return (
              <div
                key={file.id}
                onClick={() => handleSelectFile(file)}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#1a5d4e] text-white shadow-md shadow-green-900/10' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <LayoutDashboard size={18} className={isSelected ? 'text-white' : 'text-gray-400'} />
                  <span className="text-sm font-medium truncate">{file.original_name}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteFile(e, file)}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all shrink-0 ${
                    isSelected ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 text-red-400'
                  }`}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Note: Bottom Actions Area was removed as per user request */}
    </div>
  )
}

export default Sidebar
