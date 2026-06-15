import React, { useState } from 'react'
import { useCSV } from '../hooks/useCSV'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import PowerBIDashboard from '../components/dashboard/PowerBIDashboard'
import DashboardBuilder from '../components/dashboard/DashboardBuilder'
import DataTransformPanel from '../components/dashboard/DataTransformPanel'
import RelationshipDetector from '../components/dashboard/RelationshipDetector'
import FileHistory from '../components/dashboard/FileHistory'
import CSVUploader from '../components/csv/CSVUploader'
import Modal from '../components/common/Modal'
import Loader from '../components/common/Loader'
import { FileSpreadsheet, Layers, Calendar, BarChart3, Database, UploadCloud, Search, Share2, Download, Filter, TrendingUp, Wand2, Layout } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState('insights') // insights, builder, transform, relationships
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
    setActiveTab('insights')
    toast.success('Transformations applied successfully!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Power BI-style Search Bar */}
        <div className="search-bar p-5">
          <div className="flex items-center gap-4">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Ask a question about your data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 text-gray-900 placeholder-gray-400 text-sm focus:outline-none"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2.5 px-5 py-2.5 text-xs font-medium transition-colors ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{borderRadius: '2px'}}
            >
              <Filter size={14} />
              Filters
            </button>
          </div>
        </div>

        {/* Header with Actions */}
        <div className="flex flex-col gap-8 pb-8 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3 flex-wrap">
                <h2 className="text-3xl font-semibold text-gray-900" style={{letterSpacing: '-0.03em'}}>
                  Analytics Studio
                </h2>
                {selectedFile && (
                  <span className="badge badge-success flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </span>
                )}
              </div>
              {selectedFile && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                  <span className="flex items-center gap-2.5">
                    <FileSpreadsheet size={16} className="text-blue-600 shrink-0" />
                    <strong className="text-gray-900 truncate max-w-[250px]">{selectedFile.original_name}</strong>
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Database size={16} className="text-gray-500 shrink-0" />
                    {selectedFile.row_count?.toLocaleString() || 0} rows
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Layers size={16} className="text-gray-500 shrink-0" />
                    {selectedFile.column_count || selectedFile.columns?.length || 0} columns
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Calendar size={16} className="text-gray-500 shrink-0" />
                    {new Date(selectedFile.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {selectedFile && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 flex-1 lg:flex-none justify-center px-5 py-2.5"
                    onClick={handleShare}
                    style={{borderRadius: '2px'}}
                  >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2 flex-1 lg:flex-none justify-center px-5 py-2.5"
                    onClick={handleExportData}
                    style={{borderRadius: '2px'}}
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-2 flex-1 lg:flex-none justify-center px-5 py-2.5"
                onClick={() => setIsUploadOpen(true)}
                style={{borderRadius: '2px'}}
              >
                <UploadCloud size={16} />
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
            <div className="flex items-center gap-3 border-b border-gray-200 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('insights')}
                className={`tab-button ${activeTab === 'insights' ? 'active' : ''} flex items-center gap-2.5 px-6 py-4 text-sm font-medium whitespace-nowrap`}
              >
                <BarChart3 size={18} />
                Auto Insights
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`tab-button ${activeTab === 'builder' ? 'active' : ''} flex items-center gap-2.5 px-6 py-4 text-sm font-medium whitespace-nowrap`}
              >
                <Layout size={18} />
                Dashboard Builder
              </button>
              <button
                onClick={() => setActiveTab('transform')}
                className={`tab-button ${activeTab === 'transform' ? 'active' : ''} flex items-center gap-2.5 px-6 py-4 text-sm font-medium whitespace-nowrap`}
              >
                <Wand2 size={18} />
                Transform
              </button>
              <button
                onClick={() => setActiveTab('relationships')}
                className={`tab-button ${activeTab === 'relationships' ? 'active' : ''} flex items-center gap-2.5 px-6 py-4 text-sm font-medium whitespace-nowrap`}
              >
                <TrendingUp size={18} />
                Relationships
              </button>
            </div>

            {/* Tab Content */}
            {isLoadingRows ? (
              <div className="p-24 glass-card border border-gray-200 flex items-center justify-center">
                <Loader text="Loading data from storage..." />
              </div>
            ) : fileRows && fileRows.length > 0 ? (
              <>
                {activeTab === 'insights' && (
                  <PowerBIDashboard 
                    fileRows={fileRows} 
                    headers={selectedFile.columns || []}
                    transformConfig={transformConfig}
                  />
                )}

                {activeTab === 'builder' && (
                  <DashboardBuilder
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
              <div className="p-16 glass-card border border-gray-200 flex items-center justify-center text-center">
                <div className="space-y-4">
                  <Database size={48} className="text-gray-400 mx-auto" />
                  <p className="text-gray-600 text-sm">No data rows found in the selected file.</p>
                  <p className="text-gray-500 text-xs">Please upload a valid CSV with data.</p>
                </div>
              </div>
            )}
            
            {/* Historical list at the bottom */}
            <div className="pt-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <TrendingUp size={18} className="text-blue-600" />
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Dataset History</h3>
              </div>
              <FileHistory />
            </div>
          </>
        ) : (
          /* Empty/Upload State */
          <div className="flex flex-col items-center justify-center py-20 px-8 glass-card border-2 border-dashed border-gray-300 max-w-4xl mx-auto text-center gap-8 bg-white">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded-lg">
              <BarChart3 size={56} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900">Welcome to Analytics Studio</h3>
              <p className="text-gray-600 text-base max-w-2xl leading-relaxed">
                Transform your CSV data into powerful visualizations and insights. Upload a dataset to get started with interactive charts, AI-powered analytics, and data exploration tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                variant="primary"
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-2.5 px-8 py-3.5 text-base font-medium"
              >
                <UploadCloud size={20} />
                Upload Your First Dataset
              </Button>
            </div>

            {files.length > 0 && (
              <div className="w-full max-w-2xl pt-10 border-t border-gray-300 mt-8 text-left">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                  <TrendingUp size={18} className="text-blue-600" />
                  <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
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
