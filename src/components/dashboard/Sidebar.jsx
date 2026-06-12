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
    <div className="h-full flex flex-col sidebar-dark">
      {/* Upload Button */}
      <div className="p-4 border-b border-gray-700">
        <Button
          variant="primary"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
          onClick={() => {
            setIsUploadOpen(true)
            if (onCloseMobile) onCloseMobile()
          }}
        >
          <Plus size={16} />
          Upload CSV
        </Button>
      </div>

      {/* Section Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <Folder size={14} />
          <span>Datasets</span>
          <span className="ml-auto bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-[10px]">
            {files.length}
          </span>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-2">
        {loadingFiles ? (
          <div className="text-center py-8 text-sm text-gray-400">
            Loading...
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8 px-3 text-xs text-gray-500">
            No datasets yet
          </div>
        ) : (
          <div className="space-y-1">
            {files.map((file) => {
              const isSelected = selectedFile?.id === file.id
              return (
                <div
                  key={file.id}
                  onClick={() => handleSelectFile(file)}
                  className={`sidebar-item group flex flex-col gap-1.5 p-3 rounded cursor-pointer ${
                    isSelected ? 'active' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate flex-1">
                      <FileText size={14} className={isSelected ? 'text-blue-400' : 'text-gray-400'} />
                      <span className="text-xs truncate font-medium">{file.original_name}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteFile(e, file)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 transition-all shrink-0"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Database size={9} />
                      {file.row_count.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={9} />
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

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 text-[10px] text-gray-500">
        Supabase Storage
      </div>
    </div>
  )
}

export default Sidebar
