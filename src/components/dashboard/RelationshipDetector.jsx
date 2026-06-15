import React, { useMemo } from 'react'
import { Link2, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export const RelationshipDetector = ({ data, columns }) => {
  // Detect potential relationships between columns
  const relationships = useMemo(() => {
    if (!data || data.length === 0 || columns.length < 2) return []
    
    const detected = []
    
    // Check for potential foreign key relationships
    for (let i = 0; i < columns.length; i++) {
      for (let j = i + 1; j < columns.length; j++) {
        const col1 = columns[i]
        const col2 = columns[j]
        
        // Extract values
        const values1 = data.map(row => row[col1]).filter(v => v !== null && v !== undefined && v !== '')
        const values2 = data.map(row => row[col2]).filter(v => v !== null && v !== undefined && v !== '')
        
        if (values1.length === 0 || values2.length === 0) continue
        
        // Check if one column's values are subset of another (potential FK relationship)
        const set1 = new Set(values1)
        const set2 = new Set(values2)
        
        const overlap = [...set1].filter(v => set2.has(v)).length
        const overlapPercentage = (overlap / Math.min(set1.size, set2.size)) * 100
        
        // If high overlap, it might be a relationship
        if (overlapPercentage > 30) {
          detected.push({
            from: col1,
            to: col2,
            strength: overlapPercentage.toFixed(0),
            type: overlapPercentage > 80 ? 'strong' : overlapPercentage > 50 ? 'moderate' : 'weak',
            commonValues: overlap
          })
        }
      }
    }
    
    return detected.sort((a, b) => parseFloat(b.strength) - parseFloat(a.strength))
  }, [data, columns])

  // Correlation analysis for numeric columns
  const correlations = useMemo(() => {
    if (!data || data.length === 0) return []
    
    const numericCols = columns.filter(col => {
      const sample = data.slice(0, 100).map(row => row[col])
      return sample.every(val => {
        if (val === null || val === undefined || val === '') return true
        const cleaned = String(val).replace(/[^0-9.-]/g, '')
        return cleaned !== '' && !isNaN(Number(cleaned))
      })
    })
    
    if (numericCols.length < 2) return []
    
    const correlationPairs = []
    
    for (let i = 0; i < numericCols.length; i++) {
      for (let j = i + 1; j < numericCols.length; j++) {
        const col1 = numericCols[i]
        const col2 = numericCols[j]
        
        // Get numeric values
        const pairs = data
          .map(row => ({
            x: parseFloat(String(row[col1]).replace(/[^0-9.-]/g, '')),
            y: parseFloat(String(row[col2]).replace(/[^0-9.-]/g, ''))
          }))
          .filter(p => !isNaN(p.x) && !isNaN(p.y))
        
        if (pairs.length < 10) continue
        
        // Simple correlation coefficient
        const n = pairs.length
        const sumX = pairs.reduce((sum, p) => sum + p.x, 0)
        const sumY = pairs.reduce((sum, p) => sum + p.y, 0)
        const sumXY = pairs.reduce((sum, p) => sum + (p.x * p.y), 0)
        const sumX2 = pairs.reduce((sum, p) => sum + (p.x * p.x), 0)
        const sumY2 = pairs.reduce((sum, p) => sum + (p.y * p.y), 0)
        
        const numerator = (n * sumXY) - (sumX * sumY)
        const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)))
        
        if (denominator === 0) continue
        
        const correlation = numerator / denominator
        
        if (Math.abs(correlation) > 0.3) {
          correlationPairs.push({
            col1,
            col2,
            correlation: correlation.toFixed(2),
            strength: Math.abs(correlation) > 0.7 ? 'strong' : Math.abs(correlation) > 0.5 ? 'moderate' : 'weak',
            direction: correlation > 0 ? 'positive' : 'negative'
          })
        }
      }
    }
    
    return correlationPairs.sort((a, b) => Math.abs(parseFloat(b.correlation)) - Math.abs(parseFloat(a.correlation)))
  }, [data, columns])

  if (relationships.length === 0 && correlations.length === 0) {
    return (
      <div className="glass-card border border-gray-200 p-6 text-center">
        <AlertCircle size={40} className="text-gray-400 mx-auto mb-3" />
        <p className="text-sm text-gray-600">No relationships detected in the current dataset</p>
      </div>
    )
  }

  return (
    <div className="glass-card border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-6">
        <Link2 size={20} className="text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Data Relationships</h3>
      </div>

      {/* Column Relationships */}
      {relationships.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Link2 size={14} className="text-gray-500" />
            Column Relationships ({relationships.length})
          </h4>
          <div className="space-y-2">
            {relationships.slice(0, 5).map((rel, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  rel.type === 'strong' 
                    ? 'border-green-200 bg-green-50' 
                    : rel.type === 'moderate'
                    ? 'border-yellow-200 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">{rel.from}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-gray-900 truncate">{rel.to}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    rel.type === 'strong'
                      ? 'bg-green-100 text-green-700'
                      : rel.type === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {rel.strength}%
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {rel.commonValues} common values • {rel.type} relationship
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Numeric Correlations */}
      {correlations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={14} className="text-gray-500" />
            Numeric Correlations ({correlations.length})
          </h4>
          <div className="space-y-2">
            {correlations.slice(0, 5).map((corr, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border ${
                  corr.strength === 'strong'
                    ? 'border-purple-200 bg-purple-50'
                    : corr.strength === 'moderate'
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">{corr.col1}</span>
                    <span className={`${corr.direction === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {corr.direction === 'positive' ? '↗' : '↘'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 truncate">{corr.col2}</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-white border border-gray-200 rounded-full font-mono font-semibold text-gray-700">
                    {corr.correlation}
                  </span>
                </div>
                <p className="text-xs text-gray-600">
                  {corr.strength} {corr.direction} correlation
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded">
        <div className="flex items-start gap-3">
          <CheckCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h5 className="text-xs font-semibold text-blue-900 mb-1">Analysis Complete</h5>
            <p className="text-xs text-blue-700 leading-relaxed">
              Detected {relationships.length + correlations.length} potential relationship(s) in your dataset. 
              These insights can help you create more meaningful visualizations and understand data dependencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RelationshipDetector
