import { supabase, isSupabaseConfigured, isSupabaseOffline, setSupabaseOffline } from '../lib/supabaseClient'
import { csvParser } from '../lib/csvParser'

const REQUEST_TIMEOUT_MS = 30000

const withTimeout = (p, ms = REQUEST_TIMEOUT_MS) => {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Request timed out')), ms))
  ])
}

const LOCAL_CSV_FILES_KEY = 'dashify_local_csv_files'
const LOCAL_CSV_ROWS_KEY = 'dashify_local_csv_rows'

const isBrowser = typeof window !== 'undefined'
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

const validateHeaders = (headers) => {
  if (!headers || !Array.isArray(headers) || headers.length === 0) {
    throw new Error('CSV file has no headers or columns detected')
  }
  return headers.map(h => String(h).trim()).filter(h => h.length > 0)
}

const getLocalJson = (key) => {
  if (!isBrowser) return null
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : null
  } catch (err) {
    console.warn('Failed to parse local storage key', key, err)
    return null
  }
}

const setLocalJson = (key, value) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value || []))
  } catch (err) {
    console.warn('Failed to save to local storage key', key, err)
  }
}

// In-memory cache for dev fallback to bypass localStorage 5MB size limit
const devMemoryFiles = []
const devMemoryRows = {}

const getLocalCsvFiles = (userId) => {
  const stored = getLocalJson(LOCAL_CSV_FILES_KEY) || []
  const combined = [...devMemoryFiles]
  
  if (Array.isArray(stored)) {
    stored.forEach(item => {
      if (!combined.some(c => c.id === item.id)) {
        combined.push(item)
      }
    })
  }

  if (import.meta.env.DEV) {
    // In DEV mode, return all local files to prevent them from disappearing during dev login/logout switches
    return combined
  }
  return combined.filter((item) => item.user_id === userId)
}

export const getLocalCsvRows = (fileId) => {
  if (devMemoryRows[fileId]) {
    return devMemoryRows[fileId]
  }
  const stored = getLocalJson(LOCAL_CSV_ROWS_KEY)
  if (!stored || typeof stored !== 'object') return []
  return stored[fileId] || []
}

const saveLocalCsvFile = (record) => {
  devMemoryFiles.push(record)
  try {
    const existing = getLocalJson(LOCAL_CSV_FILES_KEY) || []
    existing.push(record)
    setLocalJson(LOCAL_CSV_FILES_KEY, existing)
  } catch (err) {
    console.warn('Failed to save file metadata to localStorage:', err)
  }
}

const saveLocalCsvRows = (fileId, rows) => {
  devMemoryRows[fileId] = rows
  try {
    const existing = getLocalJson(LOCAL_CSV_ROWS_KEY) || {}
    existing[fileId] = rows
    setLocalJson(LOCAL_CSV_ROWS_KEY, existing)
  } catch (err) {
    console.warn('LocalStorage limit exceeded (5MB), file cached in-memory only:', err.message)
  }
}

const deleteLocalCsvFile = (fileId) => {
  const idx = devMemoryFiles.findIndex(f => f.id === fileId)
  if (idx !== -1) devMemoryFiles.splice(idx, 1)
  delete devMemoryRows[fileId]

  const files = getLocalJson(LOCAL_CSV_FILES_KEY) || []
  setLocalJson(LOCAL_CSV_FILES_KEY, files.filter((item) => item.id !== fileId))
  const rows = getLocalJson(LOCAL_CSV_ROWS_KEY) || {}
  delete rows[fileId]
  setLocalJson(LOCAL_CSV_ROWS_KEY, rows)
}

const shouldUseLocalFallback = () => {
  return (import.meta.env.DEV && !isSupabaseConfigured) || isSupabaseOffline
}

export const csvService = {
  /**
   * Upload file to Storage, add to csv_files database table, and save metadata & sample
   */
  uploadAndProcessCSV: async (file, headers, userId) => {
    // Validate input
    if (!file) throw new Error('No file provided')
    if (!userId) throw new Error('User ID is required')
    if (!headers || headers.length === 0) throw new Error('No column headers provided')
    
    // Validate headers
    const validatedHeaders = validateHeaders(headers)
    
    // 1. Parse locally to get stats and data sample
    const parsed = await csvParser.parse(file)
    const records = parsed.data || []
    
    if (records.length === 0) {
      throw new Error('CSV file is empty - no data rows found')
    }
    
    const sample = records.slice(0, 5)
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`
    const filePath = `${fileName}`
    const localId = generateId()

    const createLocalRecord = () => {
      const fileRecord = {
        id: localId,
        user_id: userId,
        file_name: fileName,
        original_name: file.name,
        file_size: file.size,
        file_path: filePath,
        mime_type: file.type || 'text/csv',
        row_count: records.length,
        column_count: validatedHeaders.length,
        columns: validatedHeaders,
        data_sample: sample,
        status: 'processed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      saveLocalCsvFile(fileRecord)
      saveLocalCsvRows(fileRecord.id, records)
      return fileRecord
    }

    if (!shouldUseLocalFallback()) {
      try {
        await withTimeout(
          supabase.from('csv_files').select('id').limit(1),
          3000
        )
      } catch (pingErr) {
        console.warn('Supabase ping failed, switching to local dev fallback:', pingErr.message)
        setSupabaseOffline(true)
      }
    }

    if (shouldUseLocalFallback()) {
      console.log('Using local fallback for CSV storage')
      return createLocalRecord()
    }

    try {
      const { data: storageData, error: storageError } = await withTimeout(
        supabase.storage
          .from('csv_files')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          }),
        300000 // 5 minutes upload timeout
      )

      if (storageError) {
        throw new Error(`Storage upload failed: ${storageError.message}`)
      }

      const { data: fileRecord, error: dbError } = await withTimeout(
        supabase
          .from('csv_files')
          .insert({
            user_id: userId,
            file_name: fileName,
            original_name: file.name,
            file_size: file.size,
            file_path: filePath,
            mime_type: file.type || 'text/csv',
            row_count: records.length,
            column_count: validatedHeaders.length,
            columns: validatedHeaders,
            data_sample: sample,
            status: 'processing'
          })
          .select()
          .single()
      )

      if (dbError) {
        // Clean up uploaded file if DB insert fails
        try {
          await supabase.storage.from('csv_files').remove([filePath])
        } catch (cleanupErr) {
          console.error('Failed to clean up storage after DB error:', cleanupErr)
        }
        throw new Error(`Database insert failed: ${dbError.message}`)
      }

      if (!fileRecord) {
        throw new Error('No file record returned from database')
      }

      try {
        const invokeRes = await withTimeout(
          supabase.functions.invoke('process-csv', {
            body: { file_id: fileRecord.id }
          })
        )

        if (invokeRes?.error) {
          console.warn('process-csv invocation returned error:', invokeRes.error)
          // Continue anyway - marking as pending
          await supabase
            .from('csv_files')
            .update({ status: 'pending' })
            .eq('id', fileRecord.id)
        }
      } catch (invokeErr) {
        console.error('Failed to invoke processing function:', invokeErr)
        // Mark as pending if processing function fails
        await supabase
          .from('csv_files')
          .update({ status: 'pending' })
          .eq('id', fileRecord.id)
      }

      return fileRecord
    } catch (err) {
      console.warn('Supabase upload failed, attempting local fallback:', err.message)
      if (err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('network')) {
        setSupabaseOffline(true)
      }
      if (import.meta.env.DEV) {
        return createLocalRecord()
      }
      throw err
    }
  },

  /**
   * Fetch all uploaded CSVs for the current user
   */
  getFileHistory: async (userId) => {
    if (shouldUseLocalFallback()) {
      return getLocalCsvFiles(userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    try {
      const { data, error } = await withTimeout(
        supabase
          .from('csv_files')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false }),
        10000 // 10 seconds timeout for select query
      )

      if (error) throw error
      
      // If in DEV mode, merge with any locally uploaded files so they don't disappear from the sidebar
      if (import.meta.env.DEV) {
        const localFiles = getLocalCsvFiles(userId)
        const combined = [...(data || [])]
        localFiles.forEach(lf => {
          if (!combined.some(rf => rf.id === lf.id)) {
            combined.push(lf)
          }
        })
        return combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      return data
    } catch (err) {
      console.warn('Failed to fetch Supabase file history, using local dev files:', err)
      if (err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('network')) {
        setSupabaseOffline(true)
      }
      return getLocalCsvFiles(userId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  },

  /**
   * Delete a CSV file, its db records (via cascade), and storage file
   */
  deleteFile: async (fileId, filePath) => {
    // Always clean up local storage in case it was a local fallback file
    deleteLocalCsvFile(fileId)

    if (shouldUseLocalFallback()) {
      return true
    }

    try {
      const { error: dbError } = await withTimeout(
        supabase
          .from('csv_files')
          .delete()
          .eq('id', fileId),
        10000 // 10s timeout
      )

      if (dbError) throw dbError

      if (filePath) {
        const { error: storageError } = await withTimeout(
          supabase.storage
            .from('csv_files')
            .remove([filePath]),
          10000 // 10s timeout
        )

        if (storageError) {
          console.error('Storage cleanup failed:', storageError)
        }
      }
      return true
    } catch (err) {
      console.warn('Delete failed, using local dev cleanup if available:', err)
      if (err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('network')) {
        setSupabaseOffline(true)
      }
      if (import.meta.env.DEV) {
        deleteLocalCsvFile(fileId)
        return true
      }
      throw err
    }
  }
}
