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
 * Detect if row is a "title row" — only 1 non-empty cell out of many columns.
 * This happens with Excel exports that have a report title on the first row.
 * e.g.  ["A/R Invoice and Credit Memo List", "", "", "", "", ...]
 */
const isTitleRow = (row) => {
  if (!Array.isArray(row)) return false
  const nonEmpty = row.filter(cell => String(cell ?? '').trim() !== '')
  // Title row: only 1 non-empty cell AND total columns > 2
  return nonEmpty.length === 1 && row.length > 2
}

/**
 * Clean and deduplicate an array of header strings.
 * Empty headers become Column_N, duplicates get a _N suffix.
 */
const cleanHeaders = (rawFields) => {
  const seenNames = {}
  return rawFields.map((h, i) => {
    let name = String(h ?? '').replace(/^\uFEFF/, '').trim()
    if (!name) name = `Column_${i + 1}`
    if (seenNames[name] !== undefined) {
      seenNames[name]++
      name = `${name}_${seenNames[name]}`
    } else {
      seenNames[name] = 0
    }
    return name
  })
}

/**
 * Build row objects from a 2-D array using a headers array.
 */
const buildObjects = (rows, fields) =>
  rows.map(row => {
    const obj = {}
    fields.forEach((field, index) => {
      let val = row[index]
      if (val !== undefined && val !== null && val !== '') {
        if (typeof val === 'string') {
          const trimmed = val.trim()
          if (trimmed !== '' && !isNaN(Number(trimmed))) val = Number(trimmed)
          else val = trimmed === '' ? null : trimmed
        }
      } else {
        val = null
      }
      obj[field] = val
    })
    return obj
  })

/**
 * Parse Excel file to PapaParse-like schema.
 * Automatically skips a title row when detected.
 */
const parseExcel = (file, previewRows = null) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        if (!sheetName) return reject(new Error('Excel file has no sheets'))

        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' })

        if (rows.length === 0) {
          return resolve({ data: [], meta: { fields: [] }, errors: [] })
        }

        // Auto-detect title row and skip it
        let headerRowIndex = 0
        if (isTitleRow(rows[0]) && rows.length > 1) {
          headerRowIndex = 1
        }

        const rawFields = rows[headerRowIndex] || []
        const fields = cleanHeaders(rawFields)

        // Data rows start after the header row; filter truly empty rows
        let dataRows = rows.slice(headerRowIndex + 1)
          .filter(row => row.some(cell => String(cell ?? '').trim() !== ''))

        if (previewRows !== null) dataRows = dataRows.slice(0, previewRows)

        resolve({
          data: buildObjects(dataRows, fields),
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
 * For CSV text files: parse raw text without header mode first to inspect
 * row 1, decide if it's a title row, then re-parse with the correct header row.
 */
const parseCsvWithAutoHeaderDetect = (file, previewRows = null) => {
  return new Promise((resolve, reject) => {
    // Step 1: read all rows as arrays (no header mode) to inspect
    Papa.parse(file, {
      header: false,
      skipEmptyLines: true,
      complete: (rawResult) => {
        try {
          const rawRows = rawResult.data || []
          if (rawRows.length === 0) {
            return resolve({ data: [], meta: { fields: [] }, errors: [] })
          }

          // Decide which row contains the real headers
          let headerRowIndex = 0
          if (isTitleRow(rawRows[0]) && rawRows.length > 1) {
            headerRowIndex = 1
          }

          const rawFields = rawRows[headerRowIndex] || []
          const fields = cleanHeaders(rawFields)

          // Data rows
          let dataRows = rawRows.slice(headerRowIndex + 1)
            .filter(row => row.some(cell => String(cell ?? '').trim() !== ''))

          if (previewRows !== null) dataRows = dataRows.slice(0, previewRows)

          // Build objects with dynamic typing
          const data = dataRows.map(row => {
            const obj = {}
            fields.forEach((field, index) => {
              let val = row[index] ?? null
              if (typeof val === 'string') {
                const trimmed = val.trim()
                if (trimmed === '') {
                  val = null
                } else if (!isNaN(Number(trimmed)) && trimmed !== '') {
                  val = Number(trimmed)
                } else {
                  val = trimmed
                }
              }
              obj[field] = val
            })
            return obj
          })

          resolve({ data, meta: { fields }, errors: [] })
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(err)
    })
  })
}

/**
 * Parsers wrapper for PapaParse and SheetJS
 */
export const csvParser = {
  /**
   * Parse a local CSV or Excel file into objects/arrays.
   * Automatically detects and skips title rows.
   */
  parse: (file, options = {}) => {
    if (isExcelFile(file)) return parseExcel(file)
    return parseCsvWithAutoHeaderDetect(file)
  },

  /**
   * Preview first N rows of a CSV or Excel file.
   * Automatically detects and skips title rows.
   */
  preview: (file, previewRows = 10) => {
    if (isExcelFile(file)) return parseExcel(file, previewRows)
    return parseCsvWithAutoHeaderDetect(file, previewRows)
  }
}
