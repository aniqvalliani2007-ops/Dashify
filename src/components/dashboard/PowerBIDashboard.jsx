import React, { useState, useMemo } from 'react'
import { LayoutDashboard, TrendingUp, PieChart as PieChartIcon, BarChart3, Activity, Download, RefreshCw, Maximize2, Sparkles, Send } from 'lucide-react'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import Button from '../common/Button'
import Loader from '../common/Loader'
import { chartService } from '../../services/chartService'
import { aiService } from '../../services/aiService'
import toast from 'react-hot-toast'

export const PowerBIDashboard = ({ fileRows, headers, transformConfig }) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Apply transformations to data
  const transformedData = useMemo(() => {
    if (!fileRows || !transformConfig) return fileRows

    let data = [...fileRows]

    // Filter hidden columns
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
    if (!headers || !transformConfig || !transformConfig.hiddenColumns) return headers
    return headers.filter(h => !transformConfig.hiddenColumns.includes(h))
  }, [headers, transformConfig])

  // Detect best columns for visualization
  const bestColumns = useMemo(() => {
    if (!transformedData || transformedData.length === 0 || !visibleHeaders) return null

    // Find categorical column (for X-axis)
    const categoricalCol = visibleHeaders.find(h => {
      const sample = transformedData.slice(0, 50).map(row => row[h])
      const unique = new Set(sample.filter(v => v !== null && v !== undefined && v !== ''))
      return unique.size > 1 && unique.size < transformedData.length * 0.7
    })

    // Find numeric columns (for Y-axis)
    const numericCols = visibleHeaders.filter(h => {
      const sample = transformedData.slice(0, 100).map(row => row[h])
      return sample.every(val => {
        if (val === null || val === undefined || val === '') return true
        const cleaned = String(val).replace(/[^0-9.-]/g, '')
        return cleaned !== '' && !isNaN(Number(cleaned))
      })
    })

    return {
      categorical: categoricalCol || visibleHeaders[0],
      numeric: numericCols.length > 0 ? numericCols[0] : visibleHeaders[1] || visibleHeaders[0]
    }
  }, [transformedData, visibleHeaders])

  // Generate multiple aggregations
  const dashboardData = useMemo(() => {
    if (!transformedData || !bestColumns) return []

    const aggregations = []

    // Count by category
    aggregations.push({
      title: `Count by ${bestColumns.categorical}`,
      type: 'bar',
      data: chartService.aggregate(transformedData, {
        xAxisKey: bestColumns.categorical,
        yAxisKey: null,
        aggType: 'count'
      }).slice(0, 10)
    })

    // Sum of numeric column by category
    if (bestColumns.numeric !== bestColumns.categorical) {
      aggregations.push({
        title: `Sum of ${bestColumns.numeric} by ${bestColumns.categorical}`,
        type: 'line',
        data: chartService.aggregate(transformedData, {
          xAxisKey: bestColumns.categorical,
          yAxisKey: bestColumns.numeric,
          aggType: 'sum'
        }).slice(0, 10)
      })

      aggregations.push({
        title: `Average ${bestColumns.numeric} by ${bestColumns.categorical}`,
        type: 'bar',
        data: chartService.aggregate(transformedData, {
          xAxisKey: bestColumns.categorical,
          yAxisKey: bestColumns.numeric,
          aggType: 'avg'
        }).slice(0, 10)
      })
    }

    // Distribution (top categories)
    const distribution = chartService.aggregate(transformedData, {
      xAxisKey: bestColumns.categorical,
      yAxisKey: null,
      aggType: 'count'
    }).slice(0, 8)

    aggregations.push({
      title: `Distribution by ${bestColumns.categorical}`,
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
        icon: Activity,
        color: 'blue'
      },
      {
        label: 'Active Columns',
        value: visibleHeaders.length,
        icon: BarChart3,
        color: 'green'
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
          value: sum.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          icon: TrendingUp,
          color: 'purple'
        })

        metrics.push({
          label: `Avg ${bestColumns.numeric}`,
          value: avg.toLocaleString(undefined, { maximumFractionDigits: 2 }),
          icon: PieChartIcon,
          color: 'orange'
        })
      }
    }

    return metrics
  }, [transformedData, visibleHeaders, bestColumns])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleAskAI = async () => {
    if (!aiQuery.trim()) return
    
    setIsAiLoading(true)
    try {
      const sample = transformedData.length <= 100 ? transformedData : transformedData.slice(0, 50)
      const insights = await aiService.generateInsights(visibleHeaders, sample, transformedData.length, aiQuery)
      setAiResponse(insights)
      toast.success('✨ AI insights generated!')
      setAiQuery('')
    } catch (err) {
      console.error('AI Error:', err)
      const errorMsg = err.message || 'Failed to generate AI insights'
      toast.error(errorMsg)
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        setAiResponse('⚠️ OpenRouter API key is invalid. Please check your .env.local file and add a valid VITE_OPENROUTER_API_KEY.')
      }
    } finally {
      setIsAiLoading(false)
    }
  }

  const formatMarkdown = (text) => {
    if (!text) return null
    return text.split('\n').map((line, idx) => {
      let content = line.trim()
      if (content.startsWith('### ')) {
        return <h5 key={idx} className="text-sm font-bold text-gray-900 mt-3 mb-2">{content.replace('### ', '')}</h5>
      }
      if (content.startsWith('## ')) {
        return <h4 key={idx} className="text-base font-bold text-blue-600 mt-4 mb-2 border-b border-gray-300 pb-1">{content.replace('## ', '')}</h4>
      }
      if (content.startsWith('- ') || content.startsWith('* ')) {
        const cleanContent = content.substring(2)
        return <li key={idx} className="ml-4 list-disc text-gray-600 mb-1 text-sm">{cleanContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>
      }
      if (content === '') return <div key={idx} className="h-2" />
      return <p key={idx} className="text-gray-600 mb-2 text-sm" dangerouslySetInnerHTML={{__html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-blue-600 font-semibold">$1</strong>')}}></p>
    })
  }

  if (!transformedData || transformedData.length === 0) {
    return (
      <div className="glass-card border border-gray-200 p-12 text-center">
        <Activity size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No data available to visualize</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in" key={refreshKey}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-600 text-white" style={{borderRadius: '2px'}}>
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1" style={{letterSpacing: '-0.03em'}}>Power BI Dashboard</h2>
            <p className="text-sm text-gray-600">Auto-generated intelligent insights</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2"
            style={{borderRadius: '2px'}}
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="flex items-center gap-2 px-4 py-2"
            style={{borderRadius: '2px'}}
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, idx) => (
          <div
            key={idx}
            className="metric-card cursor-pointer group"
            onClick={() => setSelectedMetric(metric)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 bg-${metric.color}-50 text-${metric.color}-600`} style={{borderRadius: '2px'}}>
                <metric.icon size={18} />
              </div>
              <Maximize2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1.5">
              {metric.value}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* AI Chat Assistant - Prominent Position */}
      <div className="glass-card p-5 border-2 border-blue-200 bg-gradient-to-r from-blue-50/30 to-blue-100/30" style={{borderRadius: '2px'}}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600" />
            <h3 className="text-base font-semibold text-gray-900">AI Data Assistant</h3>
          </div>
          {aiResponse && !isAiLoading && (
            <button
              onClick={() => {setAiResponse(''); setAiQuery('')}}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* AI Response */}
        {isAiLoading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader text="AI is analyzing your data..." />
          </div>
        ) : aiResponse ? (
          <div className="p-4 bg-white border border-gray-200 max-h-60 overflow-y-auto mb-4" style={{borderRadius: '2px'}}>
            {formatMarkdown(aiResponse)}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500 text-sm mb-4 bg-white/50 border border-dashed border-gray-300" style={{borderRadius: '2px'}}>
            <Sparkles size={20} className="text-gray-400 mx-auto mb-2" />
            <p>Ask me anything about your data...</p>
          </div>
        )}

        {/* Chat Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleAskAI()
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="E.g., What are the key trends in this data?"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            disabled={isAiLoading}
            className="flex-1 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 text-gray-900 py-2.5 px-4 text-sm focus:outline-none placeholder-gray-400 disabled:opacity-50"
            style={{borderRadius: '2px'}}
          />
          <Button
            type="submit"
            variant="primary"
            className="flex items-center justify-center px-4 py-2.5"
            style={{borderRadius: '2px'}}
            disabled={!aiQuery.trim() || isAiLoading}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {dashboardData.map((viz, idx) => (
          <div key={idx} className="chart-container flex flex-col" style={{minHeight: '380px'}}>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900 truncate pr-4">
                {viz.title}
              </h3>
              <div className={`p-2 ${
                viz.type === 'bar' ? 'bg-blue-50 text-blue-600' :
                viz.type === 'line' ? 'bg-green-50 text-green-600' :
                'bg-purple-50 text-purple-600'
              }`} style={{borderRadius: '2px'}}>
                {viz.type === 'bar' && <BarChart3 size={16} />}
                {viz.type === 'line' && <Activity size={16} />}
                {viz.type === 'pie' && <PieChartIcon size={16} />}
              </div>
            </div>

            <div className="flex-1 min-h-0 w-full">
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
        ))}
      </div>

      {/* Data Insights */}
      <div className="glass-card p-5 border border-blue-100 bg-gradient-to-r from-blue-50/50 to-blue-100/50" style={{borderRadius: '2px'}}>
        <h3 className="text-base font-semibold text-blue-900 mb-4 flex items-center gap-2">
          <TrendingUp size={18} />
          Quick Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
            <p className="leading-relaxed">Dataset contains <strong>{transformedData.length.toLocaleString()}</strong> records across <strong>{visibleHeaders.length}</strong> columns</p>
          </div>
          {bestColumns && (
            <>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <p className="leading-relaxed">Primary categorical dimension: <strong>{bestColumns.categorical}</strong></p>
              </div>
              {bestColumns.numeric !== bestColumns.categorical && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <p className="leading-relaxed">Primary numeric measure: <strong>{bestColumns.numeric}</strong></p>
                </div>
              )}
            </>
          )}
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
            <p className="leading-relaxed">Dashboard automatically adapts to your data structure</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PowerBIDashboard
