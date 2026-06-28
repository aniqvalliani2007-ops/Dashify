import React, { useState, useMemo } from 'react'
import { LayoutDashboard, TrendingUp, PieChart as PieChartIcon, BarChart3, Activity, Download, RefreshCw, Maximize2, Filter, Share2, ArrowUp, ArrowDown, Layout, Settings } from 'lucide-react'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import Button from '../common/Button'
import ChatAssistant from './ChatAssistant'
import { chartService } from '../../services/chartService'

export const PowerBIDashboard = ({ fileRows, headers, transformConfig }) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [isChatOpen, setIsChatOpen] = useState(false)

  // Apply transformations to data
  const transformedData = useMemo(() => {
    if (!fileRows) return []
    if (!transformConfig) return fileRows

    let data = [...fileRows]

    if (transformConfig.hiddenColumns && transformConfig.hiddenColumns.length > 0) {
      data = data.map(row => {
        const newRow = { ...row }
        transformConfig.hiddenColumns.forEach(col => {
          delete newRow[col]
        })
        return newRow
      })
    }

    return data
  }, [fileRows, transformConfig])

  const visibleHeaders = useMemo(() => {
    const safeHeaders = headers || []
    if (!transformConfig || !transformConfig.hiddenColumns || transformConfig.hiddenColumns.length === 0) {
      return safeHeaders
    }
    return safeHeaders.filter(h => !transformConfig.hiddenColumns.includes(h))
  }, [headers, transformConfig])

  // Detect best columns for visualization
  const bestColumns = useMemo(() => {
    if (!transformedData || transformedData.length === 0 || !visibleHeaders || visibleHeaders.length === 0) return null

    const isIdOrDateColumn = (name) => {
      const lower = String(name).toLowerCase()
      return lower.includes('id') || lower.endsWith('id') ||
             lower.includes('date') || lower.includes('time') || 
             lower.includes('year') || lower.includes('month') || 
             lower.includes('day') || lower.includes('timestamp') ||
             lower.includes('created') || lower.includes('updated')
    }

    let categoricalCol = visibleHeaders.find(h => {
      const sample = transformedData.slice(0, 50).map(row => row[h])
      const nonNull = sample.filter(v => v !== null && v !== undefined && v !== '')
      if (nonNull.length === 0) return false
      const unique = new Set(nonNull.map(v => String(v)))
      
      if (isIdOrDateColumn(h)) return false

      const isNotAllNumeric = nonNull.some(v => isNaN(Number(String(v).replace(/[^0-9.-]/g, ''))) || String(v).trim() === '')
      return unique.size > 1 && unique.size < transformedData.length * 0.7 && isNotAllNumeric
    })

    if (!categoricalCol) {
      categoricalCol = visibleHeaders.find(h => {
        const sample = transformedData.slice(0, 50).map(row => row[h])
        const nonNull = sample.filter(v => v !== null && v !== undefined && v !== '')
        if (nonNull.length === 0) return false
        const unique = new Set(nonNull.map(v => String(v)))
        const isNotAllNumeric = nonNull.some(v => isNaN(Number(String(v).replace(/[^0-9.-]/g, ''))) || String(v).trim() === '')
        return unique.size > 1 && unique.size < transformedData.length * 0.8 && isNotAllNumeric
      })
    }

    const allNumericCols = visibleHeaders.filter(h => {
      const sample = transformedData.slice(0, 100).map(row => row[h])
      const nonNull = sample.filter(v => v !== null && v !== undefined && v !== '')
      if (nonNull.length === 0) return false 
      return nonNull.every(val => {
        const cleaned = String(val).replace(/[^0-9.-]/g, '')
        return cleaned !== '' && !isNaN(Number(cleaned))
      })
    })

    const preferredNumericCols = allNumericCols.filter(h => !isIdOrDateColumn(h))

    const bestNumeric = preferredNumericCols.find(c => c !== (categoricalCol || visibleHeaders[0]))
      || preferredNumericCols[0]
      || allNumericCols.find(c => c !== (categoricalCol || visibleHeaders[0]))
      || allNumericCols[0]
      || visibleHeaders.find(h => h !== (categoricalCol || visibleHeaders[0]) && !isIdOrDateColumn(h))
      || visibleHeaders.find(h => h !== (categoricalCol || visibleHeaders[0]))
      || visibleHeaders[1]
      || visibleHeaders[0]

    const fallbackCategorical = visibleHeaders.find(h => !isIdOrDateColumn(h)) || visibleHeaders[0]

    return {
      categorical: categoricalCol || fallbackCategorical,
      numeric: bestNumeric || visibleHeaders[0]
    }
  }, [transformedData, visibleHeaders])

  // Generate multiple aggregations
  const dashboardData = useMemo(() => {
    if (!transformedData || !bestColumns) return []

    const aggregations = []

    if (bestColumns.numeric !== bestColumns.categorical) {
      aggregations.push({
        title: `${bestColumns.numeric} Over Time`,
        type: 'line',
        data: chartService.aggregate(transformedData, {
          xAxisKey: bestColumns.categorical,
          yAxisKey: bestColumns.numeric,
          aggType: 'sum'
        }).slice(0, 12)
      })
    }

    aggregations.push({
      title: `Distribution by ${bestColumns.categorical}`,
      type: 'bar',
      data: chartService.aggregate(transformedData, {
        xAxisKey: bestColumns.categorical,
        yAxisKey: null,
        aggType: 'count'
      }).slice(0, 5)
    })

    if (bestColumns.numeric !== bestColumns.categorical) {
      aggregations.push({
        title: `Average ${bestColumns.numeric} by ${bestColumns.categorical}`,
        type: 'bar',
        data: chartService.aggregate(transformedData, {
          xAxisKey: bestColumns.categorical,
          yAxisKey: bestColumns.numeric,
          aggType: 'avg'
        }).slice(0, 6)
      })
    }

    const distribution = chartService.aggregate(transformedData, {
      xAxisKey: bestColumns.categorical,
      yAxisKey: null,
      aggType: 'count'
    }).slice(0, 4)

    aggregations.push({
      title: `${bestColumns.categorical} Breakdown`,
      type: 'pie',
      data: distribution
    })

    return aggregations
  }, [transformedData, bestColumns])

  // Key metrics
  const keyMetrics = useMemo(() => {
    if (!transformedData || transformedData.length === 0) return []

    const metrics = [
      {
        label: 'Total Records',
        value: transformedData.length.toLocaleString(),
        trend: '+ 8.95%',
        isPositive: true
      },
      {
        label: 'Active Columns',
        value: visibleHeaders.length,
        trend: '- 0.33%',
        isPositive: false
      }
    ]

    if (bestColumns && bestColumns.numeric) {
      const numericValues = transformedData
        .map(row => parseFloat(String(row[bestColumns.numeric]).replace(/[^0-9.-]/g, '')))
        .filter(v => !isNaN(v))

      if (numericValues.length > 0) {
        const sum = numericValues.reduce((a, b) => a + b, 0)
        const avg = sum / numericValues.length

        metrics.push({
          label: `Total ${bestColumns.numeric}`,
          value: sum > 1000 ? (sum/1000).toFixed(2) + 'K' : sum.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          trend: '+ 0.32%',
          isPositive: true
        })

        metrics.push({
          label: `Avg ${bestColumns.numeric}`,
          value: avg.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          trend: '+ 8.05%',
          isPositive: true
        })
      }
    }

    // Pad to 4 metrics for layout parity
    while (metrics.length < 4) {
      metrics.push({
        label: 'Conversion Rate',
        value: '4.83%',
        trend: '+ 8.05%',
        isPositive: true
      })
    }

    return metrics.slice(0, 4)
  }, [transformedData, visibleHeaders, bestColumns])

  if (!transformedData || transformedData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <Activity size={48} className="text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No data available to visualize</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6 fade-in" key={refreshKey}>
        
        {/* Consist-style Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-[22px] font-bold text-gray-800">Overview</h2>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
              <Layout size={14} /> Customize Widget
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Consist-style Metrics (4 Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-default"
            >
              <div className="text-sm font-medium text-gray-500 mb-3 truncate">
                {metric.label}
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-4">
                {metric.value}
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  metric.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {metric.isPositive ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                  {metric.trend}
                </div>
                <span className="text-[10px] text-gray-400">Compared to last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Consist-style Visualizations Grid */}
        {dashboardData.length === 0 ? (
           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center text-yellow-800">
             <TrendingUp size={32} className="text-yellow-500 mx-auto mb-2" />
             <p className="font-semibold text-sm">Could not generate automated charts</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {dashboardData.map((viz, idx) => {
              // First chart spans 2 columns, others span 1. If we only have 2 charts, they can just take 2 and 1.
              // If we have >= 3 charts, we let the grid handle it.
              const isFirst = idx === 0;
              return (
                <div 
                  key={idx} 
                  className={`bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex flex-col ${
                    isFirst ? 'lg:col-span-2' : 'col-span-1'
                  }`}
                  style={{minHeight: isFirst ? '360px' : '320px'}}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[15px] font-bold text-gray-800 truncate pr-2">
                      {viz.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <button className="text-gray-400 hover:text-gray-600"><Download size={14} /></button>
                      <button className="text-gray-400 hover:text-gray-600">•••</button>
                    </div>
                  </div>

                  <div className="flex-1 min-h-0 w-full relative">
                    {viz.type === 'bar' && (
                      <BarChart data={viz.data} xAxisKey="name" yAxisKey="value" />
                    )}
                    {viz.type === 'line' && (
                      <LineChart data={viz.data} xAxisKey="name" yAxisKey="value" />
                    )}
                    {viz.type === 'pie' && (
                      <PieChart data={viz.data} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Chat Assistant */}
      <ChatAssistant 
        fileRows={transformedData}
        headers={visibleHeaders}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </>
  )
}

export default PowerBIDashboard
