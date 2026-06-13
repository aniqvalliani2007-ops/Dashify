import React from 'react'
import { useCSV } from '../../hooks/useCSV'
import { FileSpreadsheet, Trash2, ArrowUpRight, Calendar, Layers } from 'lucide-react'
import Button from '../common/Button'

export const FileHistory = () => {
  const { files, selectedFile, setSelectedFile, deleteFile, loadingFiles } = useCSV()

  const handleDelete = async (e, file) => {
    e.stopPropagation()
    if (confirm(`Are you sure you want to delete dataset "${file.original_name}"?`)) {
      try {
        await deleteFile(file.id, file.file_path)
      } catch (err) {
        alert('Failed to delete file: ' + err.message)
      }
    }
  }

  if (loadingFiles) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading files...
      </div>
    )
  }

  if (files.length === 0) {
    return null
  }

  return (
    <div className="w-full glass-card border border-gray-200 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">Dataset Upload History</h3>
        <span className="text-xs text-gray-600">{files.length} Total</span>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-700 font-medium text-xs uppercase bg-gray-50">
              <th className="px-6 py-3.5">Filename</th>
              <th className="px-6 py-3.5">Uploaded</th>
              <th className="px-6 py-3.5">Dimensions</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {files.map((file) => {
              const isSelected = selectedFile?.id === file.id
              const createdDate = new Date(file.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })

              return (
                <tr
                  key={file.id}
                  className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedFile(file)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600">
                        <FileSpreadsheet size={16} />
                      </div>
                      <span className="font-medium text-gray-900 hover:text-gray-700 truncate max-w-[240px]">
                        {file.original_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-gray-400" />
                      {createdDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Layers size={13} className="text-gray-400" />
                      {file.row_count.toLocaleString()} rows × {file.column_count || 0} cols
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="blue"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setSelectedFile(file)}
                      >
                        Analyze
                        <ArrowUpRight size={13} />
                      </Button>
                      <button
                        onClick={(e) => handleDelete(e, file)}
                        className="p-2 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-300 hover:border-red-300 transition-all duration-200 cursor-pointer"
                        title="Delete Dataset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View - Shown on mobile */}
      <div className="lg:hidden divide-y divide-gray-200">
        {files.map((file) => {
          const isSelected = selectedFile?.id === file.id
          const createdDate = new Date(file.created_at).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })

          return (
            <div
              key={file.id}
              className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                isSelected ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedFile(file)}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 bg-blue-50 text-blue-600 shrink-0">
                  <FileSpreadsheet size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                    {file.original_name}
                  </h4>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-gray-400" />
                      {createdDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers size={11} className="text-gray-400" />
                      {file.row_count.toLocaleString()} × {file.column_count || 0}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="blue"
                  size="sm"
                  className="flex-1 flex items-center justify-center gap-1 text-xs"
                  onClick={() => setSelectedFile(file)}
                >
                  Analyze
                  <ArrowUpRight size={12} />
                </Button>
                <button
                  onClick={(e) => handleDelete(e, file)}
                  className="p-2 text-gray-500 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-300 hover:border-red-300 transition-all duration-200 cursor-pointer shrink-0"
                  title="Delete Dataset"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FileHistory
