import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCSV } from '../hooks/useCSV'
import { useAuth } from '../hooks/useAuth'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import PowerBIDashboard from '../components/dashboard/PowerBIDashboard'
import DashboardBuilder from '../components/dashboard/DashboardBuilder'
import DataTransformPanel from '../components/dashboard/DataTransformPanel'
import RelationshipDetector from '../components/dashboard/RelationshipDetector'
import FileHistory from '../components/dashboard/FileHistory'
import CSVUploader from '../components/csv/CSVUploader'
import Modal from '../components/common/Modal'
import Loader from '../components/common/Loader'
import { FileSpreadsheet, Layers, Calendar, BarChart3, Database, UploadCloud, Search, Share2, Download, Filter, TrendingUp, Wand2, Layout, Crown, X } from 'lucide-react'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { subscription } = useAuth()
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
  const [showUpgradeBanner, setShowUpgradeBanner] = useState(true)

  const tier = subscription?.subscription_tier || 'free'
  const uploadCount = subscription?.csv_upload_count || 0
  const uploadLimit = subscription?.csv_upload_limit || 3
  const showUpgradePrompt = tier === 'free' && uploadCount >= 2 && showUpgradeBanner

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
      <div className="space-y-4">
        {/* Upgrade Banner - Show when user is near limit */}
        {showUpgradePrompt && (
          <div className="upgrade-banner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-10"></div>
            <div className="relative flex items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg shrink-0">
                  <Crown size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-0.5">
                    You're almost at your free tier limit!
                  </h3>
                  <p className="text-xs text-gray-600">
                    Upgrade to Pro for unlimited CSV uploads, advanced features, and priority support.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={() => navigate('/pricing')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                >
                  Upgrade Now
                </Button>
                <button
                  onClick={() => setShowUpgradeBanner(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Power BI-style Search Bar - More compact */}
        <div className="search-bar p-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Ask a question about your data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-0 text-gray-900 placeholder-gray-400 text-xs focus:outline-none"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors rounded ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter size={12} />
              Filters
            </button>
          </div>
        </div>

        {/* Header with Actions - More compact */}
        <div className="flex flex-col gap-4 pb-4 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h2 className="text-xl font-semibold text-gray-900">
                  Analytics Studio
                </h2>
                {selectedFile && (
                  <span className="badge badge-success flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </span>
                )}
              </div>
              {selectedFile && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-600">
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
            
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              {selectedFile && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5 flex-1 lg:flex-none justify-center px-3 py-1.5 text-xs"
                    onClick={handleShare}
                  >
                    <Share2 size={12} />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-1.5 flex-1 lg:flex-none justify-center px-3 py-1.5 text-xs"
                    onClick={handleExportData}
                  >
                    <Download size={12} />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                </>
              )}
              <Button
                variant="primary"
                size="sm"
                className="flex items-center gap-1.5 flex-1 lg:flex-none justify-center px-3 py-1.5 text-xs"
                onClick={() => setIsUploadOpen(true)}
              >
                <UploadCloud size={12} />
                {selectedFile ? <span className="hidden sm:inline">Upload New</span> : <span className="hidden sm:inline">Upload CSV</span>}
                <span className="sm:hidden">Upload</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Selected file analysis */}
        {selectedFile ? (
          <>
            {/* Tab Navigation - More compact */}
            <div className="flex items-center gap-1 border-b border-gray-200 overflow-x-auto pb-px">
              <button
                onClick={() => setActiveTab('insights')}
                className={`tab-button ${activeTab === 'insights' ? 'active' : ''} flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap`}
              >
                <BarChart3 size={14} />
                Auto Insights
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`tab-button ${activeTab === 'builder' ? 'active' : ''} flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap`}
              >
                <Layout size={14} />
                Dashboard Builder
              </button>
              <button
                onClick={() => setActiveTab('transform')}
                className={`tab-button ${activeTab === 'transform' ? 'active' : ''} flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap`}
              >
                <Wand2 size={14} />
                Transform
              </button>
              <button
                onClick={() => setActiveTab('relationships')}
                className={`tab-button ${activeTab === 'relationships' ? 'active' : ''} flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium whitespace-nowrap`}
              >
                <TrendingUp size={14} />
                Relationships
              </button>
            </div>

            {/* Tab Content */}
            {isLoadingRows ? (
              <div className="p-12 bg-white border border-gray-200 rounded flex items-center justify-center">
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
              <div className="p-10 bg-white border border-gray-200 rounded flex items-center justify-center text-center">
                <div className="space-y-2">
                  <Database size={36} className="text-gray-400 mx-auto" />
                  <p className="text-gray-600 text-xs">No data rows found in the selected file.</p>
                  <p className="text-gray-500 text-xs">Please upload a valid CSV with data.</p>
                </div>
              </div>
            )}
            
            {/* Historical list at the bottom */}
            <div className="pt-4">
              <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-gray-200">
                <TrendingUp size={14} className="text-blue-600" />
                <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Dataset History</h3>
              </div>
              <FileHistory />
            </div>
          </>
        ) : (
          /* Empty/Upload State */
          <div className="flex flex-col items-center justify-center py-10 px-6 bg-white border-2 border-dashed border-gray-300 rounded max-w-3xl mx-auto text-center gap-5">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 text-blue-600 rounded">
              <BarChart3 size={36} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">Welcome to Analytics Studio</h3>
              <p className="text-gray-600 text-xs max-w-lg leading-relaxed">
                Transform your CSV data into powerful visualizations and insights. Upload a dataset to get started with interactive charts, AI-powered analytics, and data exploration tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button
                variant="primary"
                onClick={() => setIsUploadOpen(true)}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-medium"
              >
                <UploadCloud size={14} />
                Upload Your First Dataset
              </Button>
            </div>

            {files.length > 0 && (
              <div className="w-full max-w-2xl pt-5 border-t border-gray-300 mt-3 text-left">
                <div className="flex items-center gap-1.5 mb-3 pb-1.5 border-b border-gray-200">
                  <TrendingUp size={12} className="text-blue-600" />
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
