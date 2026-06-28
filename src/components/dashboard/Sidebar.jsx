import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSV } from '../../hooks/useCSV'
import { useAuth } from '../../hooks/useAuth'
import { FileText, Database, Plus, Trash2, Calendar, Folder, Crown, AlertCircle, LayoutDashboard, LineChart, Users, MessageSquare, Monitor, HelpCircle, MessageCircle } from 'lucide-react'
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
        <div className="w-6 h-6 bg-[#1a5d4e] rounded flex items-center justify-center mr-3">
          <div className="w-3 h-3 border-2 border-white rounded-sm transform rotate-45"></div>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Dashify</span>
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

      {/* Bottom Actions Area */}
      <div className="p-4 shrink-0 border-t border-gray-100">
        
        {/* Toggle & Small Links */}
        <div className="space-y-1 mb-6 px-2">
          <div className="flex items-center justify-between py-2 cursor-pointer group">
            <div className="flex items-center gap-3 text-sm font-medium text-gray-500 group-hover:text-gray-900">
              <Monitor size={18} className="text-gray-400" /> Demo Mode
            </div>
            <div className="w-8 h-4 bg-[#1a5d4e] rounded-full relative shadow-inner">
              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          
          <button className="w-full flex items-center gap-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <MessageCircle size={18} className="text-gray-400" /> Feedback
          </button>
          
          <button className="w-full flex items-center gap-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            <HelpCircle size={18} className="text-gray-400" /> Help and docs
          </button>
        </div>

        {/* Upgrade Card */}
        {tier === 'free' && (
          <div className="bg-[#1a5d4e] rounded-xl p-4 text-white relative overflow-hidden shadow-lg shadow-green-900/10">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border border-white/10 rounded-full"></div>
            <div className="absolute -bottom-10 -left-6 w-28 h-28 border border-white/10 rounded-full"></div>
            
            <div className="w-8 h-8 rounded-full bg-orange-400 shadow-inner flex items-center justify-center mb-3 relative z-10 border border-orange-300">
              <div className="w-4 h-4 rounded-full bg-orange-300"></div>
            </div>
            
            <p className="text-xs font-medium leading-relaxed mb-4 relative z-10 opacity-90">
              Get detailed analytics for help you, upgrade pro
            </p>
            
            <button 
              onClick={() => navigate('/pricing')}
              className="bg-white text-[#1a5d4e] text-[11px] font-bold px-3 py-1.5 rounded relative z-10 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
