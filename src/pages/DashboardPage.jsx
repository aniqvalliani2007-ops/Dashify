import React, { useState } from 'react'
import { useCSV } from '../hooks/useCSV'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import PowerBIDashboard from '../components/dashboard/PowerBIDashboard'
import DataTransformPanel from '../components/dashboard/DataTransformPanel'
import RelationshipDetector from '../components/dashboard/RelationshipDetector'
import FileHistory from '../components/dashboard/FileHistory'
import CSVUploader from '../components/csv/CSVUploader'
import Modal from '../components/common/Modal'
import Loader from '../components/common/Loader'
import { FileSpreadsheet, Layers, Calendar, BarChart3, Database, UploadCloud, Search, Share2, Download, Filter, TrendingUp, Wand2 } from 'lucide-react'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export const DashboardPage = () => {
  const {
    selectedFile,
    fileRows,
    isLoadingRows,
    isUploadOpen,
    setIsUploadOpen,
    files
  } = useCSV()

  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, transform, relationships
  const [transformConfig, setTransformConfig] = useState(null)

  const handleExportData = () => {
    if (!selectedFile || !fileRows || fileRows.length === 0) {
      toast.error('No data to export')
      return
    }
    
    const headers = selectedFile.columns || []
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + fileRows.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',')).join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${selectedFile.original_name}`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Data exported successfully!')
  }

  const handleShare = () => {
    toast.success('Share functionality coming soon!')
  }

  const handleTransformApply = (config) => {
    setTransformConfig(config)
    setActiveTab('dashboard')
    toast.success('Transformations applied successfully!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Power BI-style Search Bar */}
        <div className="glass-card border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Ask a question about your data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 text-gray-900 placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Header with Actions */}
        <div className="flex flex-col gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                  Analytics Studio
                </h2>
                {selectedFile && (
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </span>
                )}
              </div>
              {selectedFile && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <FileSpreadsheet size={12} className="text-blue-600 shrink-0" />
                    <strong className="text-gray-900 truncate max-w-[200px]">{selectedFile.original_name}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Database size={12} className="text-gray-500 shrink-0" />
                    {selectedFile.row_count?.toLocaleString() || 0} rows
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers size={12} className="text-gray-500 shrink-0" />
                    {selectedFile.column_count || selectedFile.columns?.length || 0} columns
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-gray-500 shrink-0" />
                    {new Date(selectedFile.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {selectedFile && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                    onClick={handleShare}
                  >
                    <Share2 size={14} />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                    onClick={handleExportData}
                  >
                    <Download size={14} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 flex-1 sm:flex-none justify-center"
                onClick={() => setIsUploadOpen(true)}
              >
                <UploadCloud size={14} />
                {selectedFile ? <span className="hidden sm:inline">Upload New</span> : <span className="hidden sm:inline">Upload CSV</span>}
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Selected file analysis */}
        {selectedFile ? (
          <>
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'dashboard'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <BarChart3 size={16} />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transform')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'transform'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <Wand2 size={16} />
                Transform
              </button>
              <button
                onClick={() => setActiveTab('relationships')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'relationships'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <TrendingUp size={16} />
                Relationships
              </button>
            </div>

            {/* Tab Content */}
            {isLoadingRows ? (
              <div className="p-20 glass-card border border-gray-200 flex items-center justify-center">
                <Loader text="Loading data from storage..." />
              </div>
            ) : fileRows && fileRows.length > 0 ? (
              <>
                {activeTab === 'dashboard' && (
                  <PowerBIDashboard 
                    fileRows={fileRows} 
                    headers={selectedFile.columns || []}
                    transformConfig={transformConfig}
                  />
                )}

                {activeTab === 'transform' && (
                  <DataTransformPanel
                    data={fileRows}
                    columns={selectedFile.columns || []}
                    onTransformApply={handleTransformApply}
                  />
                )}

                {activeTab === 'relationships' && (
                  <RelationshipDetector
                    data={fileRows}
                    columns={selectedFile.columns || []}
                  />
                )}
              </>
            ) : (
              <div className="p-12 glass-card border border-gray-200 flex items-center justify-center text-center">
                <div className="space-y-3">
                  <Database size={40} className="text-gray-400 mx-auto" />
                  <p className="text-gray-600 text-sm">No data rows found in the selected file.</p>
                  <p className="text-gray-500 text-xs">Please upload a valid CSV with data.</p>
                </div>
              </div>
            )}
            
            {/* Historical list at the bottom */}
            <div className="pt-4">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                <TrendingUp size={16} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Dataset History</h3>
              </div>
              <FileHistory />
            </div>
          </>
        ) : (
          /* Empty/Upload State */
          <div className="flex flex-col items-center justify-center py-16 px-6 glass-card border-2 border-dashed border-gray-300 max-w-4xl mx-auto text-center gap-6 bg-white">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-lg">
              <BarChart3 size={48} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">Welcome to Analytics Studio</h3>
              <p className="text-gray-600 text-sm max-w-lg leading-relaxed">
                Transform your CSV data into powerful visualizations and insights. Upload a dataset to get started with interactive charts, AI-powered analytics, and data exploration tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button
                variant="primary"
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium"
              >
                <UploadCloud size={18} />
                Upload Your First Dataset
              </Button>
            </div>

            {files.length > 0 && (
              <div className="w-full max-w-2xl pt-8 border-t border-gray-300 mt-6 text-left">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <TrendingUp size={16} className="text-blue-600" />
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Your Datasets
                  </h4>
                </div>
                <FileHistory />
              </div>
            )}
          </div>
        )}
      </div>

      {/* CSV Upload Modal */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload & Mappings Settings"
        size="lg"
      >
        <CSVUploader onClose={() => setIsUploadOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}

export default DashboardPage
