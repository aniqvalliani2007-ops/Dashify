/**
 * Validates email address format
 */
export const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return re.test(String(email).toLowerCase())
}

/**
 * Validates password strength (min 6 characters)
 */
export const isValidPassword = (password) => {
  return password && password.length >= 6
}

/**
 * Validates if a file is a CSV and fits inside size limits (e.g. 10MB)
 */
export const validateCSVFile = (file, maxSizeInMB = 10) => {
  if (!file) {
    return { isValid: false, message: 'No file provided.' }
  }

  // Check file type
  const isCSV = file.name.endsWith('.csv') || file.type === 'text/csv'
  if (!isCSV) {
    return { isValid: false, message: 'Only CSV files are allowed.' }
  }

  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024
  if (file.size > maxSizeInBytes) {
    return { 
      isValid: false, 
      message: `File size exceeds the limit of ${maxSizeInMB}MB. Please upload a smaller file.` 
    }
  }

  return { isValid: true, message: '' }
}
