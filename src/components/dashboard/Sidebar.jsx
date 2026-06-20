import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSV } from '../../hooks/useCSV'
import { useAuth } from '../../hooks/useAuth'
import { FileText, Database, Plus, Trash2, Calendar, Folder, Crown, AlertCircle } from 'lucide-react'
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
  const uploadsLeft = uploadLimit - uploadCount
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
    <div className="h-full flex flex-col sidebar-glassy">
      {/* Upload Button - Glassy design */}
      <div className="p-4 border-b border-gray-200/50">
        <Button
          variant="primary"
          className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg shadow-lg transition-all duration-300 ${
            isLimitReached
              ? 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white shadow-gray-400/25'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
          }`}
          onClick={handleUploadClick}
        >
          <Plus size={18} />
          {isLimitReached ? 'Limit Reached' : 'Upload Dataset'}
        </Button>
        
        {/* Upload Limit Indicator */}
        {tier === 'free' && (
          <div className="mt-3 p-2.5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-700">Free Tier</span>
              <span className="text-xs font-bold text-blue-600">{uploadCount} / {uploadLimit}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  uploadCount >= uploadLimit 
                    ? 'bg-gradient-to-r from-red-400 to-red-500' 
                    : uploadCount >= uploadLimit * 0.7
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${Math.min((uploadCount / uploadLimit) * 100, 100)}%` }}
              />
            </div>
            {uploadsLeft > 0 ? (
              <p className="text-[10px] text-gray-600 mt-1.5 font-medium">
                {uploadsLeft} upload{uploadsLeft !== 1 ? 's' : ''} remaining
              </p>
            ) : (
              <button
                onClick={() => navigate('/pricing')}
                className="flex items-center gap-1.5 text-[10px] text-blue-600 hover:text-blue-700 font-bold mt-1.5 transition-colors"
              >
                <Crown size={10} />
                Upgrade to Pro
              </button>
            )}
          </div>
        )}
        
        {tier === 'pro' && (
          <div className="mt-3 p-2.5 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200/50">
            <div className="flex items-center gap-2">
              <Crown size={14} className="text-yellow-600" />
              <span className="text-xs font-bold text-gray-700">Pro Plan</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1 font-medium">Unlimited uploads</p>
          </div>
        )}
      </div>

      {/* Section Header - Modern glassy */}
      <div className="px-4 py-3.5 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/30">
        <div className="flex items-center gap-2.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
          <div className="p-1.5 bg-blue-500/10 rounded-md">
            <Folder size={14} className="text-blue-600" />
          </div>
          <span>My Datasets</span>
          <span className="ml-auto bg-gradient-to-br from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm">
            {files.length}
          </span>
        </div>
      </div>

      {/* Files List - Glassy cards */}
      <div className="flex-1 overflow-y-auto p-3">
        {loadingFiles ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
            <p className="mt-3 text-sm text-gray-500 font-medium">Loading datasets...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 mb-3">
              <Database size={24} className="text-blue-400" />
            </div>
            <p className="text-sm text-gray-500 font-medium">No datasets yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your first CSV file</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {files.map((file) => {
              const isSelected = selectedFile?.id === file.id
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`sidebar-glassy-item group flex flex-col gap-2 p-3.5 rounded-lg cursor-pointer transition-all duration-300 ${
                    isSelected ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 truncate flex-1">
                      <div className={`p-1.5 rounded-md transition-all duration-300 ${
                        isSelected 
                          ? 'bg-blue-500 shadow-lg shadow-blue-500/30' 
                          : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-50 group-hover:to-purple-50'
                      }`}>
                        <FileText size={14} className={isSelected ? 'text-white' : 'text-gray-600 group-hover:text-blue-500'} />
                      </div>
                      <span className={`text-xs truncate font-semibold transition-colors ${
                        isSelected ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                      }`}>
                        {file.original_name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteFile(e, file)}
                      className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 p-1.5 rounded-md transition-all shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-[10px] font-medium">
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-gray-50 text-gray-500 group-hover:bg-blue-50/50 group-hover:text-blue-500'
                    }`}>
                      <Database size={10} />
                      {file.row_count.toLocaleString()} rows
                    </span>
                    <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-gray-50 text-gray-500 group-hover:bg-purple-50/50 group-hover:text-purple-500'
                    }`}>
                      <Calendar size={10} />
                      {new Date(file.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer - Glassy accent */}
      <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-blue-50/40">
        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50"></div>
          <span>Powered by Supabase</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
