import React, { useState, useEffect } from 'react'
import BarChart from './BarChart'
import LineChart from './LineChart'
import PieChart from './PieChart'
import { chartService } from '../../services/chartService'
import { aiService } from '../../services/aiService'
import { BarChart3, LineChart as LineIcon, PieChart as PieIcon, Sliders, FileDown, Sparkles, Send, BrainCircuit, RefreshCw } from 'lucide-react'
import Button from '../common/Button'
import Loader from '../common/Loader'
import toast from 'react-hot-toast'

export const ChartContainer = ({ fileRows, headers }) => {
  const [xAxisKey, setXAxisKey] = useState('')
  const [yAxisKey, setYAxisKey] = useState('')
  const [aggType, setAggType] = useState('count') // Default to count so we always display data immediately
  const [aggregatedData, setAggregatedData] = useState([])
  const [isYAxisNonNumeric, setIsYAxisNonNumeric] = useState(false)

  // AI Insights states
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Scan if Y Axis is numeric or text
  useEffect(() => {
    if (yAxisKey && fileRows && fileRows.length > 0) {
      const sample = fileRows.slice(0, 20)
      const nonNumeric = sample.every(row => {
        const val = row[yAxisKey]
        if (val === undefined || val === null) return true
        const str = String(val).trim()
        if (str === '') return true
        const cleaned = str.replace(/[^0-9.-]/g, '')
        return cleaned === '' || isNaN(Number(cleaned))
      })
      setIsYAxisNonNumeric(nonNumeric)
    } else {
      setIsYAxisNonNumeric(false)
    }
  }, [yAxisKey, fileRows])

  // Set default keys when headers load
  useEffect(() => {
    if (headers && headers.length > 0) {
      // Find a likely categorical header for X axis
      let bestXHeader = headers.find(h => {
        const name = h.toLowerCase()
        return name === 'sex' ||
               name === 'gender' ||
               name === 'country' ||
               name.includes('industry') ||
               name.includes('category') ||
               name.includes('status') ||
               name.includes('type') ||
               name.includes('role') ||
               name.includes('job') ||
               name.includes('department') ||
               name.includes('city') ||
               name.includes('state')
      })
      
      // Fallback: first non-numeric header (excluding IDs/keys)
      if (!bestXHeader && fileRows && fileRows.length > 0) {
        const sampleRows = fileRows.slice(0, 20)
        bestXHeader = headers.find(h => {
          const name = h.toLowerCase()
          if (name.includes('id') || name.includes('key') || name.includes('index') || name.includes('url') || name.includes('website') || name.includes('email') || name.includes('phone')) {
            return false
          }
          return sampleRows.some(row => {
            const val = row[h]
            if (typeof val === 'string' && val.trim() !== '') {
              const cleaned = val.replace(/[^0-9.-]/g, '')
              return cleaned === '' || isNaN(Number(cleaned))
            }
            return typeof val !== 'number'
          })
        })
      }

      setXAxisKey(bestXHeader || headers[0])
      
      // 1. Try to find a header matching common numeric names
      let numericHeader = headers.find(h => 
        h.toLowerCase().includes('amount') || 
        h.toLowerCase().includes('value') || 
        h.toLowerCase().includes('count') || 
        h.toLowerCase().includes('price') ||
        h.toLowerCase().includes('sales') ||
        h.toLowerCase().includes('quantity') ||
        h.toLowerCase().includes('employees') ||
        h.toLowerCase().includes('revenue') ||
        h.toLowerCase().includes('score') ||
        h.toLowerCase().includes('founded') ||
        h.toLowerCase().includes('index')
      )

      // 2. If not found, scan fileRows to find the first column that actually contains numbers
      if (!numericHeader && fileRows && fileRows.length > 0) {
        const sampleRows = fileRows.slice(0, 20)
        numericHeader = headers.find(h => {
          return sampleRows.some(row => {
            const val = row[h]
            if (typeof val === 'number') return true
            if (typeof val === 'string' && val.trim() !== '') {
              const cleaned = val.replace(/[^0-9.-]/g, '')
              return cleaned !== '' && !isNaN(Number(cleaned))
            }
            return false
          })
        })
      }

      setYAxisKey(numericHeader || (headers[1] || ''))
    }
  }, [headers, fileRows])

  // Update aggregated data when options or rows change
  useEffect(() => {
    if (fileRows && fileRows.length > 0 && xAxisKey) {
      const agg = chartService.aggregate(fileRows, {
        xAxisKey,
        yAxisKey: aggType === 'count' ? null : yAxisKey,
        aggType
      })
      
      // Sort by value descending so the tallest bars appear first, then limit to top 25 categories
      const sorted = [...agg].sort((a, b) => b.value - a.value)
      setAggregatedData(sorted.slice(0, 25))
    } else {
      setAggregatedData([])
    }
  }, [fileRows, xAxisKey, yAxisKey, aggType])

  // Local metadata stats generator fallback
  const generateLocalStatsSummary = (cols, rows) => {
    if (!rows || rows.length === 0) return ''
    
    let summary = `### 📊 Dataset Overview\n\n`
    summary += `- **Total Rows**: **${rows.length.toLocaleString()}**\n`
    summary += `- **Total Columns**: **${cols.length}**\n\n`
    
    summary += `### 📂 Available Columns\n\n`
    cols.forEach(col => {
      const sample = rows.slice(0, 100)
      const nonNullSample = sample.map(r => r[col]).filter(v => v !== undefined && v !== null && v !== '')
      
      let type = 'Text'
      let uniqueCount = 0
      
      if (nonNullSample.length > 0) {
        const isNumeric = nonNullSample.every(val => {
          if (typeof val === 'number') return true
          const cleaned = String(val).replace(/[^0-9.-]/g, '')
          return cleaned !== '' && !isNaN(Number(cleaned))
        })
        if (isNumeric) type = 'Numeric'
        
        const uniqueValues = new Set(nonNullSample)
        uniqueCount = uniqueValues.size
      }
      
      summary += `- **${col}**: \`${type}\` | ${uniqueCount} unique values\n`
    })
    
    summary += `\n### 💡 Quick Actions\n`
    summary += `- Type a question in the box below (e.g., "what are the trends?")\n`
    summary += `- Click the send button to get AI-powered insights\n`
    summary += `- Use the chart customizer on the left to explore data\n`
    
    return summary
  }

  // Auto-run AI or local stats when active file changes
  useEffect(() => {
    if (fileRows && fileRows.length > 0 && headers && headers.length > 0) {
      // Always show local stats first, user can manually trigger AI
      const localStats = generateLocalStatsSummary(headers, fileRows)
      setAiResponse(localStats)
    }
  }, [fileRows, headers])

  const exportAggregatedCSV = () => {
    if (aggregatedData.length === 0) return

    const csvContent = "data:text/csv;charset=utf-8," 
      + `${xAxisKey},${yAxisKey || 'Count'}\n`
      + aggregatedData.map(row => `"${row.name.replace(/"/g, '""')}",${row.value}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `dashify_export_${xAxisKey}_vs_${yAxisKey || 'count'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleGenerateAI = async (customPrompt) => {
    // Use the custom prompt if provided, otherwise use the aiQuery from the input field
    const promptToSend = customPrompt || aiQuery.trim() || 'Provide a general data overview and statistical summary.'
    
    console.log('🤖 AI Request:', promptToSend)
    console.log('📊 Data:', { headers, rowCount: fileRows.length })
    
    // Only update aiQuery if a custom prompt was passed (for auto-generation)
    if (customPrompt && !aiQuery) {
      setAiQuery(customPrompt)
    }
    
    setIsAiLoading(true)
    try {
      // Send the entire dataset if it is 100 rows or fewer, otherwise send the first 50 rows as a sample
      const sample = fileRows.length <= 100 ? fileRows : fileRows.slice(0, 50)
      console.log('🔄 Calling AI service...')
      const insights = await aiService.generateInsights(headers, sample, fileRows.length, promptToSend)
      console.log('✅ AI Response received:', insights.substring(0, 100))
      setAiResponse(insights)
      toast.success('✨ AI insights generated!')
      
      // Clear the input after successful response (only if it was a user query, not auto-generation)
      if (!customPrompt && aiQuery) {
        setAiQuery('')
      }
    } catch (err) {
      console.error('❌ AI Error:', err)
      
      // Show user-friendly error message
      const errorMsg = err.message || 'Failed to generate AI insights'
      
      if (errorMsg.includes('401') || errorMsg.includes('Unauthorized')) {
        toast.error('⚠️ OpenRouter API key is invalid or expired. Please check your API key.')
        setAiResponse(`### ⚠️ AI Service Unavailable\n\nThe OpenRouter API key appears to be invalid or doesn't have access.\n\n**To fix this:**\n1. Go to [OpenRouter.ai](https://openrouter.ai)\n2. Sign up or log in\n3. Get a valid API key with credits\n4. Add it to your \`.env.local\` file\n5. Restart the dev server\n\n**For now, you can:**\n- Use the chart customizer to explore your data\n- View the dataset overview above\n- Export aggregated data as CSV`)
      } else {
        toast.error(errorMsg)
        // Fallback to local stats
        const localStats = generateLocalStatsSummary(headers, fileRows)
        setAiResponse(localStats)
      }
    } finally {
      setIsAiLoading(false)
    }
  }

  // Regex-based simple Markdown formatter for client side
  const formatMarkdown = (text) => {
    if (!text) return null
    
    return text.split('\n').map((line, idx) => {
      let content = line.trim()
      
      if (content.startsWith('### ')) {
        return <h5 key={idx} className="text-sm font-bold text-gray-900 mt-4 mb-2 flex items-center gap-1.5">{content.replace('### ', '')}</h5>
      }
      if (content.startsWith('## ')) {
        return <h4 key={idx} className="text-base font-extrabold text-blue-600 mt-5 mb-2 border-b border-gray-300 pb-1">{content.replace('## ', '')}</h4>
      }
      if (content.startsWith('# ')) {
        return <h3 key={idx} className="text-lg font-black text-blue-700 mt-6 mb-3">{content.replace('# ', '')}</h3>
      }

      if (content.startsWith('- ') || content.startsWith('* ')) {
        const cleanContent = content.substring(2)
        return (
          <li key={idx} className="ml-5 list-disc text-gray-600 mb-1.5 text-sm leading-relaxed">
            {parseBoldText(cleanContent)}
          </li>
        )
      }

      if (content === '') {
        return <div key={idx} className="h-3" />
      }

      return <p key={idx} className="text-gray-600 mb-2.5 text-sm leading-relaxed">{parseBoldText(content)}</p>
    })
  }

  const parseBoldText = (text) => {
    const parts = text.split(/\*\*(.*?)\*\*/g)
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <strong key={index} className="text-blue-600 font-semibold">{part}</strong>
      }
      return part
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Left panel: Customizer (1 column) */}
      <div className="xl:col-span-1 glass-card p-4 sm:p-5 border border-gray-200 flex flex-col gap-4 sm:gap-5 h-fit xl:sticky xl:top-6">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
          <Sliders size={18} className="text-blue-600" />
          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide uppercase">Chart Customizer</h4>
        </div>

        {/* X Axis selector */}
        <div className="space-y-2">
          <label htmlFor="xAxis" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">X-Axis (Dimension)</label>
          <select
            id="xAxis"
            value={xAxisKey}
            onChange={(e) => setXAxisKey(e.target.value)}
            className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 text-gray-900 py-2 px-3 text-sm focus:outline-none"
          >
            {headers.map(h => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Y Axis selector */}
        {aggType !== 'count' && (
          <div className="space-y-2">
            <label htmlFor="yAxis" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Y-Axis (Metric)</label>
            <select
              id="yAxis"
              value={yAxisKey}
              onChange={(e) => setYAxisKey(e.target.value)}
              className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 text-gray-900 py-2 px-3 text-sm focus:outline-none"
            >
              {headers.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        )}

        {/* Aggregation operator */}
        <div className="space-y-2">
          <label htmlFor="aggType" className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Aggregation</label>
          <select
            id="aggType"
            value={aggType}
            onChange={(e) => setAggType(e.target.value)}
            className="w-full bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 text-gray-900 py-2 px-3 text-sm focus:outline-none"
          >
            <option value="count">Count (Rows)</option>
            <option value="sum">Sum</option>
            <option value="avg">Average</option>
            <option value="min">Minimum</option>
            <option value="max">Maximum</option>
          </select>
        </div>

        {/* Export Data Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={exportAggregatedCSV}
          disabled={aggregatedData.length === 0}
          className="mt-2 flex items-center justify-center gap-1.5 py-2 text-xs sm:text-sm"
        >
          <FileDown size={14} />
          <span className="hidden sm:inline">Export Aggregated CSV</span>
          <span className="sm:hidden">Export CSV</span>
        </Button>
      </div>

      {/* Right panel: Grid of all charts (3 columns) */}
      <div className="xl:col-span-3 flex flex-col gap-6">
        
        {/* Warning message if non-numeric Y axis selected */}
        {isYAxisNonNumeric && aggType !== 'count' && (
          <div className="p-3 sm:p-4 border border-amber-200 bg-amber-50 text-xs text-amber-800 flex items-start gap-2.5">
            <span className="text-base select-none shrink-0 mt-0.5">⚠️</span>
            <div className="space-y-1">
              <p className="font-bold text-amber-900">Non-Numeric Y-Axis Metric Selected</p>
              <p className="leading-relaxed">
                <strong>"{yAxisKey}"</strong> appears to contain text values. Mathematically, you cannot perform a <strong>{aggType.toUpperCase()}</strong> on text. 
                To fix this, change the <strong>Aggregation</strong> to <strong>"Count (Rows)"</strong> or select a numeric column as your <strong>Y-Axis (Metric)</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Card 1: Bar Chart */}
          <div className="glass-card p-4 sm:p-5 border border-gray-200 flex flex-col h-[300px] sm:h-[380px]">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
              <BarChart3 size={16} className="text-blue-600 shrink-0" />
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide capitalize truncate">
                Bar Chart: {aggType === 'count' ? 'Row Count' : `${aggType} of ${yAxisKey}`} by {xAxisKey}
              </h5>
            </div>
            <div className="flex-1 w-full relative min-h-0">
              <BarChart data={aggregatedData} xAxisKey="name" yAxisKey="value" />
            </div>
          </div>

          {/* Card 2: Line Chart */}
          <div className="glass-card p-4 sm:p-5 border border-gray-200 flex flex-col h-[300px] sm:h-[380px]">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
              <LineIcon size={16} className="text-blue-600 shrink-0" />
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide capitalize truncate">
                Line Chart: {aggType === 'count' ? 'Row Count' : `${aggType} of ${yAxisKey}`} by {xAxisKey}
              </h5>
            </div>
            <div className="flex-1 w-full relative min-h-0">
              <LineChart data={aggregatedData} xAxisKey="name" yAxisKey="value" />
            </div>
          </div>

          {/* Card 3: Pie Chart */}
          <div className="glass-card p-4 sm:p-5 border border-gray-200 flex flex-col h-[300px] sm:h-[380px]">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b border-gray-200">
              <PieIcon size={16} className="text-blue-600 shrink-0" />
              <h5 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide capitalize truncate">
                Pie Chart: Distribution by {xAxisKey}
              </h5>
            </div>
            <div className="flex-1 w-full relative min-h-0">
              <PieChart data={aggregatedData} />
            </div>
          </div>

          {/* Card 4: AI Insights Panel */}
          <div className="glass-card p-4 sm:p-5 border border-gray-200 flex flex-col h-[300px] sm:h-[380px]">
            <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600 shrink-0" />
                <h5 className="font-semibold text-gray-900 text-xs sm:text-sm tracking-wide">
                  AI Data Analyst
                </h5>
              </div>
              {aiResponse && !isAiLoading && (
                <button
                  onClick={() => handleGenerateAI(aiQuery)}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer bg-transparent border-0"
                  disabled={isAiLoading}
                >
                  <RefreshCw size={12} className={isAiLoading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}
            </div>

            {/* AI Response Scroll Area */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs">
              {isAiLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                  <Loader text="AI Analyst is crunching data..." />
                </div>
              ) : aiResponse ? (
                <div className="p-3 sm:p-4 border border-gray-200 bg-gray-50 text-gray-700 leading-relaxed overflow-x-auto">
                  {formatMarkdown(aiResponse)}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center h-full gap-2 text-gray-500 p-4">
                  <Sparkles size={24} className="text-gray-400 animate-pulse" />
                  <p className="text-xs">Click "Analyze Dataset" to generate insights.</p>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleGenerateAI()
              }}
              className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200"
            >
              <input
                type="text"
                placeholder="Ask about data..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                disabled={isAiLoading}
                className="flex-1 bg-white border border-gray-300 hover:border-gray-400 focus:border-blue-500 text-gray-900 py-1.5 px-2 sm:px-3 text-xs focus:outline-none placeholder-gray-400 disabled:opacity-50"
              />
              <Button
                type="submit"
                variant="primary"
                className="rounded-lg flex items-center justify-center p-1.5 shrink-0"
                disabled={!aiQuery.trim() || isAiLoading}
              >
                <Send size={12} />
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ChartContainer
