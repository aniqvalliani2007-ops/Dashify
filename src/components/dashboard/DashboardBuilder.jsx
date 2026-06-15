import React, { useState, useMemo } from 'react'
import { Plus, BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, X, Settings, Maximize2, Download, RefreshCw } from 'lucide-react'
import BarChart from '../charts/BarChart'
import LineChart from '../charts/LineChart'
import PieChart from '../charts/PieChart'
import Button from '../common/Button'
import { chartService } from '../../services/chartService'
import toast from 'react-hot-toast'

export const DashboardBuilder = ({ fileRows, headers, transformConfig }) => {
  const [visualizations, setVisualizations] = useState([])
  const [showAddPanel, setShowAddPanel] = useState(false)
  const [editingViz, setEditingViz] = useState(null)

  // Apply transformations
  const transformedData = useMemo(() => {
    if (!fileRows || !transformConfig) return fileRows
    let data = [...fileRows]
    if (transformConfig.hiddenColumns && transformConfig.hiddenColumns.length > 0) {
      data = data.map(row => {
        const newRow = { ...row }
        transformConfig.hiddenColumns.forEach(col => delete newRow[col])
        return newRow
      })
    }
    return data
  }, [fileRows, transformConfig])

  const visibleHeaders = useMemo(() => {
    if (!headers || !transformConfig || !transformConfig.hiddenColumns) return headers
    return headers.filter(h => !transformConfig.hiddenColumns.includes(h))
  }, [headers, transformConfig])

  // Detect column types
  const columnTypes = useMemo(() => {
    if (!transformedData || transformedData.length === 0) return {}
    const types = {}
    visibleHeaders.forEach(col => {
      const sample = transformedData.slice(0, 50).map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '')
      const allNumbers = sample.every(val => {
        const cleaned = String(val).replace(/[^0-9.-]/g, '')
        return cleaned !== '' && !isNaN(Number(cleaned))
      })
      types[col] = allNumbers ? 'number' : 'text'
    })
    return types
  }, [transformedData, visibleHeaders])

  const numericColumns = useMemo(() => 
    visibleHeaders.filter(h => columnTypes[h] === 'number'),
    [visibleHeaders, columnTypes]
  )

  const categoricalColumns = useMemo(() => 
    visibleHeaders.filter(h => columnTypes[h] === 'text'),
    [visibleHeaders, columnTypes]
  )

  const addVisualization = (type) => {
    const viz = {
      id: Date.now(),
      type,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Chart`,
      xAxis: categoricalColumns[0] || visibleHeaders[0],
      yAxis: numericColumns[0] || visibleHeaders[1] || visibleHeaders[0],
      aggregation: 'count'
    }
    setVisualizations([...visualizations, viz])
    setEditingViz(viz.id)
    setShowAddPanel(false)
    toast.success('Visualization added!')
  }

  const removeVisualization = (id) => {
    setVisualizations(visualizations.filter(v => v.id !== id))
    toast.success('Visualization removed')
  }

  const updateVisualization = (id, updates) => {
    setVisualizations(visualizations.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  const getChartData = (viz) => {
    if (!transformedData || transformedData.length === 0) return []
    return chartService.aggregate(transformedData, {
      xAxisKey: viz.xAxis,
      yAxisKey: viz.aggregation === 'count' ? null : viz.yAxis,
      aggType: viz.aggregation
    }).slice(0, 15)
  }

  if (!transformedData || transformedData.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <BarChart3 size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No data available. Please upload a CSV file.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Builder</h2>
          <p className="text-base text-gray-600">Create custom visualizations by adding charts below</p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddPanel(true)}
          className="flex items-center gap-2.5 px-6 py-3"
          style={{borderRadius: '2px'}}
        >
          <Plus size={20} />
          Add Visualization
        </Button>
      </div>

      {/* Add Visualization Panel */}
      {showAddPanel && (
        <div className="glass-card p-8 border-2 border-blue-200 slide-in-right" style={{borderRadius: '2px'}}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Choose Visualization Type</h3>
            <button 
              onClick={() => setShowAddPanel(false)} 
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 transition-colors"
              style={{borderRadius: '2px'}}
            >
              <X size={22} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <button
              onClick={() => addVisualization('bar')}
              className="p-8 border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
              style={{borderRadius: '2px'}}
            >
              <BarChart3 size={48} className="text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-base">Bar Chart</h4>
              <p className="text-sm text-gray-600">Compare categories</p>
            </button>
            <button
              onClick={() => addVisualization('line')}
              className="p-8 border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all group"
              style={{borderRadius: '2px'}}
            >
              <LineChartIcon size={48} className="text-green-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-base">Line Chart</h4>
              <p className="text-sm text-gray-600">Show trends over time</p>
            </button>
            <button
              onClick={() => addVisualization('pie')}
              className="p-8 border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
              style={{borderRadius: '2px'}}
            >
              <PieChartIcon size={48} className="text-purple-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2 text-base">Pie Chart</h4>
              <p className="text-sm text-gray-600">Show proportions</p>
            </button>
          </div>
        </div>
      )}

      {/* Visualizations Grid */}
      {visualizations.length === 0 ? (
        <div className="glass-card p-20 text-center border-2 border-dashed border-gray-300" style={{borderRadius: '2px'}}>
          <BarChart3 size={72} className="text-gray-300 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Visualizations Yet</h3>
          <p className="text-gray-600 mb-8 text-base">Click "Add Visualization" to start building your dashboard</p>
          <Button
            variant="primary"
            onClick={() => setShowAddPanel(true)}
            className="mx-auto flex items-center gap-2.5 px-6 py-3"
            style={{borderRadius: '2px'}}
          >
            <Plus size={20} />
            Add Your First Chart
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {visualizations.map((viz) => (
            <div key={viz.id} className="chart-container">
              {/* Chart Header */}
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">{viz.title}</h3>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setEditingViz(editingViz === viz.id ? null : viz.id)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                    style={{borderRadius: '2px'}}
                    title="Configure"
                  >
                    <Settings size={18} className="text-gray-600" />
                  </button>
                  <button
                    onClick={() => removeVisualization(viz.id)}
                    className="p-2 hover:bg-red-50 transition-colors"
                    style={{borderRadius: '2px'}}
                    title="Remove"
                  >
                    <X size={18} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Configuration Panel */}
              {editingViz === viz.id && (
                <div className="mb-6 p-5 bg-gray-50 border border-gray-200 space-y-4" style={{borderRadius: '2px'}}>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Chart Title</label>
                    <input
                      type="text"
                      value={viz.title}
                      onChange={(e) => updateVisualization(viz.id, { title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 text-sm"
                      style={{borderRadius: '2px'}}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">X-Axis (Category)</label>
                    <select
                      value={viz.xAxis}
                      onChange={(e) => updateVisualization(viz.id, { xAxis: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 text-sm"
                      style={{borderRadius: '2px'}}
                    >
                      {visibleHeaders.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                  {viz.aggregation !== 'count' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Y-Axis (Metric)</label>
                      <select
                        value={viz.yAxis}
                        onChange={(e) => updateVisualization(viz.id, { yAxis: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 text-sm"
                        style={{borderRadius: '2px'}}
                      >
                        {visibleHeaders.map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Aggregation</label>
                    <select
                      value={viz.aggregation}
                      onChange={(e) => updateVisualization(viz.id, { aggregation: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 text-sm"
                      style={{borderRadius: '2px'}}
                    >
                      <option value="count">Count</option>
                      <option value="sum">Sum</option>
                      <option value="avg">Average</option>
                      <option value="min">Minimum</option>
                      <option value="max">Maximum</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Chart */}
              <div className="h-96 w-full">
                {viz.type === 'bar' && (
                  <BarChart data={getChartData(viz)} xAxisKey="name" yAxisKey="value" />
                )}
                {viz.type === 'line' && (
                  <LineChart data={getChartData(viz)} xAxisKey="name" yAxisKey="value" />
                )}
                {viz.type === 'pie' && (
                  <PieChart data={getChartData(viz)} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DashboardBuilder
