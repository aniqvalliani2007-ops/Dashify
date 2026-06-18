import { supabase, isSupabaseConfigured, isSupabaseOffline, setSupabaseOffline } from '../lib/supabaseClient'
import { csvParser } from '../lib/csvParser'

import { getLocalCsvRows } from './csvService'

const shouldUseLocalFallback = () => {
  return (import.meta.env.DEV && !isSupabaseConfigured) || isSupabaseOffline
}

/**
 * Check if a columns array looks like auto-generated fallback names (Column_2, Column_3 etc.)
 * This means the file had a title row that was misread as headers on a previous upload.
 */
const hasGenericColumnNames = (columns) => {
  if (!columns || columns.length < 2) return false
  // If more than half the columns are named Column_N, treat as bad headers
  const genericCount = columns.filter(c => /^Column_\d+$/.test(String(c))).length
  return genericCount > columns.length / 2
}

/**
 * Re-map row keys from what the CSV parser produced to the actual 
 * column names saved in the database (user-confirmed names).
 * Only remaps when counts match exactly and names actually differ.
 */
const remapRowsToStoredColumns = (rows, storedColumns) => {
  if (!rows || rows.length === 0 || !storedColumns || storedColumns.length === 0) return rows

  const firstRowKeys = Object.keys(rows[0])

  // If every stored column already exists as a key, no remapping needed
  const allMatch = storedColumns.every(col => firstRowKeys.includes(col))
  if (allMatch) return rows

  // Only do positional remap when counts match exactly
  if (firstRowKeys.length === storedColumns.length) {
    return rows.map(row => {
      const newRow = {}
      firstRowKeys.forEach((key, idx) => {
        newRow[storedColumns[idx]] = row[key]
      })
      return newRow
    })
  }

  // Count mismatch — keep original keys
  console.warn('[chartService] Column count mismatch. parsedKeys:', firstRowKeys.length, 'storedColumns:', storedColumns.length, '— keeping original keys.')
  return rows
}

export const chartService = {
  /**
   * Fetch all records of a specific CSV file by downloading from Supabase Storage
   */
  getFileRows: async (fileId) => {
    if (shouldUseLocalFallback()) {
      return getLocalCsvRows(fileId)
    }

    try {
      // Fetch both the file path AND the stored column names
      const { data: fileData, error: fileError } = await supabase
        .from('csv_files')
        .select('file_path, columns')
        .eq('id', fileId)
        .single()

      if (fileError || !fileData) {
        throw new Error(fileError?.message || 'File record not found')
      }

      const { data: storageBlob, error: storageError } = await supabase
        .storage
        .from('csv_files')
        .download(fileData.file_path)

      if (storageError || !storageBlob) {
        throw new Error(storageError?.message || 'Failed to download file from Storage')
      }

      const fileObj = new File([storageBlob], fileData.file_path, { type: storageBlob.type })
      const parsed = await csvParser.parse(fileObj)
      const rows = parsed.data || []

      // If stored columns look like Column_2, Column_3 (bad old upload),
      // use the freshly-parsed headers from the file instead — they are correct now.
      const storedColumns = fileData.columns || []
      let finalColumns = storedColumns

      if (hasGenericColumnNames(storedColumns) && parsed.meta?.fields?.length > 0) {
        console.log('[chartService] Stored columns have generic names — using re-parsed headers from file.')
        finalColumns = parsed.meta.fields
        // Also update the DB record so future loads are fast
        try {
          await supabase
            .from('csv_files')
            .update({ columns: finalColumns, column_count: finalColumns.length })
            .eq('id', fileId)
        } catch (updateErr) {
          console.warn('[chartService] Could not update columns in DB:', updateErr.message)
        }
      }

      const remapped = remapRowsToStoredColumns(rows, finalColumns)
      return remapped
    } catch (err) {
      console.warn('Supabase getFileRows failed, falling back to local dev rows:', err)
      if (err.message.includes('timeout') || err.message.includes('fetch') || err.message.includes('network')) {
        setSupabaseOffline(true)
      }
      const localRows = getLocalCsvRows(fileId)
      if (localRows.length > 0) {
        return localRows
      }
      throw err
    }
  },

  /**
   * Process and aggregate records for charting in JavaScript
   */
  aggregate: (data, { xAxisKey, yAxisKey, aggType = 'sum' }) => {
    if (!data || data.length === 0 || !xAxisKey) return []

    const groups = {}

    data.forEach(row => {
      const groupVal = row[xAxisKey] !== undefined && row[xAxisKey] !== null ? String(row[xAxisKey]) : 'Unknown'
      
      let metricVal = 0
      if (yAxisKey) {
        const rawMetric = row[yAxisKey]
        if (typeof rawMetric === 'number') {
          metricVal = rawMetric
        } else if (typeof rawMetric === 'string') {
          // Clean string and try to parse
          const parsed = parseFloat(rawMetric.replace(/[^0-9.-]/g, ''))
          metricVal = isNaN(parsed) ? 0 : parsed
        }
      } else {
        metricVal = 1 // Count
      }

      if (!groups[groupVal]) {
        groups[groupVal] = {
          count: 0,
          sum: 0,
          min: metricVal,
          max: metricVal,
          values: []
        }
      }

      groups[groupVal].count += 1
      groups[groupVal].sum += metricVal
      groups[groupVal].min = Math.min(groups[groupVal].min, metricVal)
      groups[groupVal].max = Math.max(groups[groupVal].max, metricVal)
      groups[groupVal].values.push(metricVal)
    })

    return Object.keys(groups).map(key => {
      const group = groups[key]
      let value = 0

      if (!yAxisKey) {
        value = group.count
      } else {
        switch (aggType.toLowerCase()) {
          case 'sum':
            value = group.sum
            break
          case 'avg':
            value = group.sum / group.count
            break
          case 'count':
            value = group.count
            break
          case 'min':
            value = group.min
            break
          case 'max':
            value = group.max
            break
          default:
            value = group.sum
        }
      }

      // Round value to 2 decimal places if it's a number
      if (typeof value === 'number') {
        value = Math.round(value * 100) / 100
      }

      return {
        name: key,
        value: value,
        count: group.count
      }
    })
  }
}
