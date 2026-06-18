import React, { createContext, useState, useEffect, useContext, useRef } from 'react'
import { csvService } from '../services/csvService'
import { chartService } from '../services/chartService'
import { AuthContext } from './AuthContext'

export const CSVContext = createContext()

export const CSVProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [files, setFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileRows, setFileRows] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [isLoadingRows, setIsLoadingRows] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const hasLoadedFiles = useRef(false)

  // Auto-refresh file history when user logs in
  useEffect(() => {
    if (user?.id) {
      // Only refresh once when user logs in
      if (!hasLoadedFiles.current) {
        refreshFiles(user.id)
        hasLoadedFiles.current = true
      }
    } else {
      setFiles([])
      setSelectedFile(null)
      setFileRows([])
      hasLoadedFiles.current = false
    }
  }, [user?.id]) // Only depend on user.id to prevent infinite loops

  // Auto-load row data when a file is selected
  useEffect(() => {
    const loadRows = async () => {
      if (!selectedFile?.id) {
        setFileRows([])
        return
      }

      console.log('Loading rows for file:', selectedFile.original_name, selectedFile.id)
      setIsLoadingRows(true)
      try {
        const rows = await chartService.getFileRows(selectedFile.id)
        console.log('Loaded rows:', rows.length)
        setFileRows(rows)

        // If the loaded rows have different/better column keys than what's stored,
        // update the selectedFile columns so the dashboard uses the correct names
        if (rows.length > 0) {
          const parsedKeys = Object.keys(rows[0])
          const storedCols = selectedFile.columns || []
          const hasGeneric = storedCols.some(c => /^Column_\d+$/.test(String(c)))
          const keysMatchStored = storedCols.length === parsedKeys.length &&
            storedCols.every(c => parsedKeys.includes(c))

          if (!keysMatchStored && parsedKeys.length > 0) {
            console.log('Updating selectedFile columns from parsed rows:', parsedKeys)
            setSelectedFile(prev => ({
              ...prev,
              columns: parsedKeys,
              column_count: parsedKeys.length
            }))
            // Also update the files list so FileHistory shows correct column count
            setFiles(prev => prev.map(f =>
              f.id === selectedFile.id
                ? { ...f, columns: parsedKeys, column_count: parsedKeys.length }
                : f
            ))
          }
        }
      } catch (err) {
        console.error('Failed to load file rows:', err)
        setFileRows([])
      } finally {
        setIsLoadingRows(false)
      }
    }

    loadRows()
  }, [selectedFile?.id]) // Only depend on selectedFile.id

  const refreshFiles = async (userId) => {
    setLoadingFiles(true)
    try {
      const history = await csvService.getFileHistory(userId)
      console.log('Fetched file history:', history.length, 'files')
      setFiles(history)
      // Auto select the most recent file (first in list) when user logs in
      if (history.length > 0 && !selectedFile) {
        console.log('Auto-selecting file:', history[0].original_name)
        setSelectedFile(history[0])
      } else if (history.length === 0) {
        console.log('No files found in history')
        setSelectedFile(null)
      }
    } catch (err) {
      console.error('Failed to fetch file history:', err)
      setFiles([])
      setSelectedFile(null)
    } finally {
      setLoadingFiles(false)
    }
  }

  const uploadFile = async (file, headers, userId) => {
    const record = await csvService.uploadAndProcessCSV(file, headers, userId)
    
    // Add the new file to the files list at the beginning
    setFiles(prev => [record, ...prev])
    
    // Auto select newly uploaded file
    setSelectedFile(record)
    
    return record
  }

  const deleteFile = async (fileId, filePath) => {
    // Update UI immediately for instant feedback
    const deletedFile = files.find(f => f.id === fileId)
    setFiles(prev => prev.filter(f => f.id !== fileId))
    
    if (selectedFile?.id === fileId) {
      // Select the next file in the list if available
      const remainingFiles = files.filter(f => f.id !== fileId)
      if (remainingFiles.length > 0) {
        setSelectedFile(remainingFiles[0])
      } else {
        setSelectedFile(null)
        setFileRows([])
      }
    }
    
    // Then delete from backend
    try {
      await csvService.deleteFile(fileId, filePath)
    } catch (err) {
      // If delete fails, restore the file
      console.error('Failed to delete file:', err)
      setFiles(prev => [...prev, deletedFile].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
      throw err
    }
  }

  const value = {
    files,
    selectedFile,
    setSelectedFile,
    fileRows,
    loadingFiles,
    isLoadingRows,
    isUploadOpen,
    setIsUploadOpen,
    refreshFiles,
    uploadFile,
    deleteFile
  }

  return (
    <CSVContext.Provider value={value}>
      {children}
    </CSVContext.Provider>
  )
}
