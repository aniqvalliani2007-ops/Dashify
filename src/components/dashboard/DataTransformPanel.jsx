import React, { useState, useMemo } from 'react'
import { Wand2, Filter, SortAsc, Calculator, Eye, EyeOff, Settings, CheckCircle2 } from 'lucide-react'
import Button from '../common/Button'

export const DataTransformPanel = ({ data, columns, onTransformApply }) => {
  const [transforms, setTransforms] = useState([])
  const [hiddenColumns, setHiddenColumns] = useState([])
  const [filters, setFilters] = useState({})
  const [sortConfig, setSortConfig] = useState(null)

  // Data type detection
  const columnTypes = useMemo(() => {
    if (!data || data.length === 0) return {}
    
    const types = {}
    columns.forEach(col => {
      const sample = data.slice(0, 100).map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '')
      
      if (sample.length === 0) {
        types[col] = 'text'
        return
      }

      const allNumbers = sample.every(val => {
        const cleaned = String(val).replace(/[^0-9.-]/g, '')
        return cleaned !== '' && !isNaN(Number(cleaned))
      })

      const allDates = sample.every(val => {
        const str = String(val)
        return !isNaN(Date.parse(str))
      })

      if (allNumbers) {
        types[col] = 'number'
      } else if (allDates && !allNumbers) {
        types[col] = 'date'
      } else {
        types[col] = 'text'
      }
    })
    
    return types
  }, [data, columns])

  // Data quality metrics
  const dataQuality = useMemo(() => {
    if (!data || data.length === 0) return {}
    
    const quality = {}
    columns.forEach(col => {
      const values = data.map(row => row[col])
      const nonNull = values.filter(v => v !== null && v !== undefined && v !== '')
      const unique = new Set(nonNull)
      
      quality[col] = {
        completeness: ((nonNull.length / values.length) * 100).toFixed(1),
        uniqueCount: unique.size,
        nullCount: values.length - nonNull.length
      }
    })
    
    return quality
  }, [data, columns])

  const toggleColumn = (col) => {
    setHiddenColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    )
  }

  const applyTransforms = () => {
    onTransformApply({
      hiddenColumns,
      filters,
      sortConfig,
      columnTypes
    })
  }

  return (
    <div className="glass-card border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Wand2 size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Data Transformation</h3>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={applyTransforms}
          className="flex items-center gap-2"
        >
          <CheckCircle2 size={14} />
          Apply Changes
        </Button>
      </div>

      {/* Column Management */}
      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Settings size={16} className="text-gray-500" />
            Column Configuration
          </h4>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {columns.map(col => {
            const isHidden = hiddenColumns.includes(col)
            const type = columnTypes[col]
            const quality = dataQuality[col]

            return (
              <div
                key={col}
                className={`p-3 border rounded transition-all ${
                  isHidden 
                    ? 'border-gray-200 bg-gray-50 opacity-60' 
                    : 'border-blue-200 bg-blue-50/30 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 truncate">
                        {col}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        type === 'number' 
                          ? 'bg-green-100 text-green-700'
                          : type === 'date'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {type}
                      </span>
                    </div>
                    
                    {quality && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${
                            parseFloat(quality.completeness) > 90 
                              ? 'bg-green-500' 
                              : parseFloat(quality.completeness) > 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`} />
                          {quality.completeness}% Complete
                        </span>
                        <span>{quality.uniqueCount} Unique</span>
                        {quality.nullCount > 0 && (
                          <span className="text-red-600">{quality.nullCount} Null</span>
                        )}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => toggleColumn(col)}
                    className={`p-2 rounded transition-colors shrink-0 ${
                      isHidden
                        ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                    title={isHidden ? 'Show Column' : 'Hide Column'}
                  >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transform Summary */}
      {(hiddenColumns.length > 0 || Object.keys(filters).length > 0) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h5 className="text-xs font-semibold text-blue-900 mb-2">Active Transformations</h5>
          <div className="space-y-1 text-xs text-blue-700">
            {hiddenColumns.length > 0 && (
              <div>• {hiddenColumns.length} column(s) hidden</div>
            )}
            {Object.keys(filters).length > 0 && (
              <div>• {Object.keys(filters).length} filter(s) applied</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTransformPanel
