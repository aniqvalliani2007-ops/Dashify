import Papa from 'papaparse'
import * as XLSX from 'xlsx'

/**
 * Check if the given file is an Excel spreadsheet based on its name or type
 */
const isExcelFile = (file) => {
  if (!file || typeof file === 'string') return false
  
  if (file.name) {
    const name = file.name.toLowerCase()
    return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsm')
  }
  
  if (file.type) {
    const type = file.type.toLowerCase()
    return type.includes('excel') || type.includes('spreadsheetml') || type.includes('officedocument.spreadsheetml')
  }
  
  return false
}

/**
 * Parse Excel file to PapaParse-like schema
 */
const parseExcel = (file, previewRows = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        
        if (!sheetName) {
          return reject(new Error('Excel file has no sheets'))
        }
        
        const worksheet = workbook.Sheets[sheetName]
        // Get rows as 2D array
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })
        
        if (rows.length === 0) {
          return resolve({
            data: [],
            meta: { fields: [] },
            errors: []
          })
        }
        
        // Extract and clean headers
        const rawFields = rows[0] || []
        const fields = rawFields.map((h, i) => {
          const trimmed = String(h || '').trim()
          return trimmed || `Column_${i + 1}`
        })
        
        // Filter out empty rows
        let dataRows = rows.slice(1)
        dataRows = dataRows.filter(row => row.some(cell => String(cell).trim() !== ''))
        
        // Limit if preview rows are specified
        if (previewRows !== null) {
          dataRows = dataRows.slice(0, previewRows)
        }
        
        // Map rows to objects matching the headers
        const dataObjects = dataRows.map(row => {
          const obj = {}
          fields.forEach((field, index) => {
            let val = row[index]
            
            if (val !== undefined && val !== null && val !== '') {
              if (typeof val === 'string') {
                const trimmed = val.trim()
                const num = Number(trimmed)
                if (trimmed !== '' && !isNaN(num)) {
                  val = num
                }
              }
            } else {
              val = null
            }
            obj[field] = val
          })
          return obj
        })
        
        resolve({
          data: dataObjects,
          meta: { fields },
          errors: []
        })
      } catch (err) {
        reject(err)
      }
    }
    
    reader.onerror = (err) => reject(err)
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Parsers wrapper for PapaParse and SheetJS
 */
export const csvParser = {
  /**
   * Parse a local CSV or Excel file into objects/arrays
   * @param {File|Blob|string} file 
   * @param {Object} options 
   * @returns {Promise<Object>}
   */
  parse: (file, options = {}) => {
    if (isExcelFile(file)) {
      return parseExcel(file)
    }
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          resolve(results)
        },
        error: (error) => {
          reject(error)
        },
        ...options
      })
    })
  },

  /**
   * Preview first N rows of a CSV or Excel file without loading the entire file into memory
   * @param {File|Blob|string} file 
   * @param {number} previewRows 
   * @returns {Promise<Object>}
   */
  preview: (file, previewRows = 10) => {
    if (isExcelFile(file)) {
      return parseExcel(file, previewRows)
    }
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        preview: previewRows,
        complete: (results) => {
          resolve(results)
        },
        error: (error) => {
          reject(error)
        }
      })
    })
  }
}

