import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useCSV } from '../../hooks/useCSV'
import { useAuth } from '../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { csvParser } from '../../lib/csvParser'
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, BarChart3 } from 'lucide-react'
import ColumnMapper from './ColumnMapper'
import CSVPreview from './CSVPreview'
import Button from '../common/Button'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'

export const CSVUploader = ({ onClose }) => {
  const { uploadFile, setSelectedFile } = useCSV()
  const { user } = useAuth()
  
  // Demo mode: use a test user if no real user is logged in (development only)
  const testUser = import.meta.env.DEV ? { id: 'demo-user-test-123', email: 'demo@dashify.local' } : null
  const effectiveUser = user || testUser
  
  const [file, setFile] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  const [headers, setHeaders] = useState([])
  const [step, setStep] = useState(1) // 1: dropzone, 2: preview & map, 3: uploading, 4: success
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files - try to process them anyway if they have a valid extension
    let droppedFile = acceptedFiles[0]
    
    if (!droppedFile && rejectedFiles && rejectedFiles.length > 0) {
      // Try to use rejected files if they might be CSV/Excel based on name
      const rejectedFile = rejectedFiles[0]
      console.warn('File rejected by MIME type, attempting to process anyway:', rejectedFile)
      droppedFile = rejectedFile.file || rejectedFile
    }

    if (!droppedFile) {
      setError('No file selected. Please drag and drop a CSV or Excel file.')
      return
    }

    const fileName = droppedFile.name.toLowerCase()
    const isCSV = fileName.endsWith('.csv')
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.xlsm')
    const isText = fileName.endsWith('.txt')

    // Allow CSV, Excel, and treat text files as CSV
    if (!isCSV && !isExcel && !isText) {
      setError(`Unsupported file type: "${droppedFile.name}". Please use CSV or Excel files (.csv, .xlsx, .xls, .xlsm).`)
      toast.error('File type not supported. Use CSV or Excel.')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      
      // Process the file (works with any actual file, MIME type doesn't matter for PapaParse)
      const fileToProcess = droppedFile
      
      const preview = await csvParser.preview(fileToProcess, 6)
      
      if (!preview.data || preview.data.length === 0) {
        setError('File appears to be empty or has no valid data rows. Ensure the file has a header row and at least one data row.')
        toast.error('Empty file - no data found')
        setIsLoading(false)
        return
      }

      if (!preview.meta || !preview.meta.fields || preview.meta.fields.length === 0) {
        setError('File has no column headers. CSV files must have a header row.')
        toast.error('No headers found in file')
        setIsLoading(false)
        return
      }
      
      setFile(droppedFile)
      setHeaders(preview.meta.fields || [])
      setPreviewData(preview.data || [])
      setStep(2)
      toast.success('✅ File parsed successfully!')
    } catch (err) {
      console.error('File processing error:', err)
      setError(`Failed to parse file: ${err.message || 'Invalid file format. Ensure it\'s a valid CSV or Excel file with proper formatting.'}`)
      toast.error('File parsing failed')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 500 * 1024 * 1024, // 500MB max (increased for large files)
    noClick: false,
    noKeyboard: false,
    // Be lenient with file types but validate in onDrop
    accept: {
      'text/plain': ['.csv', '.txt'],
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsm', '.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    }
  })

  const handleUpload = async (mappedHeaders) => {
    setIsLoading(true)
    setError('')
    setStep(3)
    
    try {
      if (!effectiveUser) throw new Error('User session required')
      if (!mappedHeaders || mappedHeaders.length === 0) throw new Error('No columns selected')
      
      // Use effective user (real or demo)
      const uploadResult = await uploadFile(file, mappedHeaders, effectiveUser.id)
      
      if (!uploadResult) throw new Error('Upload returned no result')
      
      toast.success('✅ File uploaded successfully!')
      
      // Store the uploaded file - no need to refresh since uploadFile already updates the context
      setUploadedFile(uploadResult)
      
      // Go to success step
      setStep(4)
    } catch (err) {
      console.error('Upload error details:', err)
      const errorMsg = err.message || 'An error occurred during file upload. Please try again.'
      setError(errorMsg)
      toast.error(errorMsg)
      setStep(2) // return to mapping
    } finally {
      setIsLoading(false)
    }
  }

  const handleVisualize = async () => {
    if (uploadedFile && setSelectedFile) {
      setSelectedFile(uploadedFile)
    }
    if (onClose) onClose()
  }

  return (
    <div className="space-y-6">
      {!user && !import.meta.env.DEV && (
        <div className="p-4 rounded bg-blue-50 border border-blue-200 text-blue-900">
          <p className="text-sm font-semibold mb-2">Please sign in to upload CSV files.</p>
          <Link to="/login" className="text-blue-600 hover:underline">Go to Sign In</Link>
        </div>
      )}
      {!user && import.meta.env.DEV && (
        <div className="p-4 rounded bg-blue-50 border border-blue-200 text-blue-900">
          <p className="text-sm font-semibold mb-1">✨ Demo Mode Enabled</p>
          <p className="text-xs">You're in development mode. Upload will work with a test account.</p>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start gap-2.5 text-red-700 text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {step === 1 && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-blue-50 text-blue-600 border border-blue-200">
              <UploadCloud size={32} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your data file here'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Supports CSV and Excel files (.csv, .xlsx, .xls) • Max 500MB</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && previewData && (
        <div className="space-y-6">
          <div className="p-4 rounded bg-white border border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600">
                <FileText size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-600">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
              Change File
            </Button>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">CSV Preview (First 5 Rows)</h4>
            <CSVPreview data={previewData} headers={headers} />
          </div>

          <ColumnMapper headers={headers} onConfirm={handleUpload} isLoading={isLoading} />
        </div>
      )}

      {step === 3 && (
        <div className="py-12 flex flex-col items-center justify-center">
          <Loader text="Uploading & processing your data..." />
        </div>
      )}

      {step === 4 && uploadedFile && (
        <div className="py-8 flex flex-col items-center justify-center text-center gap-6">
          <div className="p-4 rounded bg-green-50 border border-green-200 text-green-600 animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-gray-900">Upload Successful! 🎉</h3>
            <p className="text-gray-600 text-sm max-w-sm">
              Your file "<strong>{uploadedFile.original_name}</strong>" has been processed and is ready for visualization.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {uploadedFile.row_count || 0} rows • {uploadedFile.column_count || uploadedFile.columns?.length || 0} columns
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={handleVisualize}
              className="flex items-center justify-center gap-2 px-6"
            >
              <BarChart3 size={18} />
              Visualize Now
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => {
                setStep(1)
                setFile(null)
                setPreviewData(null)
                setHeaders([])
                setUploadedFile(null)
              }}
              className="px-6"
            >
              Upload Another
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CSVUploader
