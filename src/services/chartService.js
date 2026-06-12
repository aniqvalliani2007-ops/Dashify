import { supabase, isSupabaseConfigured, isSupabaseOffline, setSupabaseOffline } from '../lib/supabaseClient'
import { csvParser } from '../lib/csvParser'

import { getLocalCsvRows } from './csvService'

const shouldUseLocalFallback = () => {
  return (import.meta.env.DEV && !isSupabaseConfigured) || isSupabaseOffline
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
      const { data: fileData, error: fileError } = await supabase
        .from('csv_files')
        .select('file_path')
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
      return parsed.data || []
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
