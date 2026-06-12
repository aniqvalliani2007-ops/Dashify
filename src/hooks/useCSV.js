import { useContext } from 'react'
import { CSVContext } from '../context/CSVContext'

export const useCSV = () => {
  const context = useContext(CSVContext)
  if (context === undefined) {
    throw new Error('useCSV must be used within a CSVProvider')
  }
  return context
}

export default useCSV
