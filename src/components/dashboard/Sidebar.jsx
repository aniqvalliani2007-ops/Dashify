import React from 'react'
import { useCSV } from '../../hooks/useCSV'
import { FileText, Database, Plus, Trash2, Calendar, Folder } from 'lucide-react'
import { Button } from '../common/Button'

export const Sidebar = ({ onCloseMobile }) => {
  const {
    files,
    selectedFile,
    setSelectedFile,
    deleteFile,
    setIsUploadOpen,
    loadingFiles
  } = useCSV()

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
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold rounded-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300"
          onClick={() => {
            setIsUploadOpen(true)
            if (onCloseMobile) onCloseMobile()
          }}
        >
          <Plus size={18} />
          Upload Dataset
        </Button>
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
