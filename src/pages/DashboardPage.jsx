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
import { BarChart3, Database, UploadCloud, TrendingUp, Wand2, Layout } from 'lucide-react'
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

  const [activeTab, setActiveTab] = useState('insights')
  const [transformConfig, setTransformConfig] = useState(null)

  const handleTransformApply = (config) => {
    setTransformConfig(config)
    setActiveTab('insights')
    toast.success('Transformations applied successfully!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {selectedFile ? (
          <>
            {/* Minimal Tab Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('insights')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'insights' ? 'bg-[#1a5d4e] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <BarChart3 size={16} className="inline mr-2" /> Overview
                </button>
                <button
                  onClick={() => setActiveTab('builder')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'builder' ? 'bg-[#1a5d4e] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Layout size={16} className="inline mr-2" /> Builder
                </button>
                <button
                  onClick={() => setActiveTab('transform')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'transform' ? 'bg-[#1a5d4e] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Wand2 size={16} className="inline mr-2" /> Data Transform
                </button>
                <button
                  onClick={() => setActiveTab('relationships')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                    activeTab === 'relationships' ? 'bg-[#1a5d4e] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp size={16} className="inline mr-2" /> Relationships
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {isLoadingRows ? (
              <div className="p-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                <Loader text="Loading data from storage..." />
              </div>
            ) : fileRows && fileRows.length > 0 ? (
              <div className="min-h-[500px]">
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
              </div>
            ) : (
              <div className="p-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-center">
                <div className="space-y-3">
                  <Database size={48} className="text-gray-300 mx-auto" />
                  <p className="text-gray-500 text-sm font-medium">No data rows found in this file.</p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty/Upload State */
          <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-gray-100 shadow-sm rounded-xl max-w-3xl mx-auto text-center gap-6 mt-10">
            <div className="p-4 bg-green-50 text-[#1a5d4e] rounded-full">
              <BarChart3 size={48} />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gray-900">Welcome to your Analytics Overview</h3>
              <p className="text-gray-500 text-sm max-w-lg leading-relaxed mx-auto">
                Transform your CSV data into beautiful, actionable dashboards. Upload a dataset to automatically generate insights and charts.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setIsUploadOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-bold bg-[#1a5d4e] hover:bg-[#134237] text-white rounded-lg shadow-lg shadow-green-900/20"
            >
              <UploadCloud size={18} />
              Upload Dataset
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Dataset"
        size="lg"
      >
        <CSVUploader onClose={() => setIsUploadOpen(false)} />
      </Modal>
    </DashboardLayout>
  )
}

export default DashboardPage
