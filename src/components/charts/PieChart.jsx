import React, { useState } from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { ChevronDown } from 'lucide-react'

export const PieChart = ({ data }) => {
  const [hoveredLegendItem, setHoveredLegendItem] = useState(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        No aggregated data to display
      </div>
    )
  }

  // Professional color palette for pie segments - blue based
  const COLORS = [
    '#3b82f6', // Blue
    '#0ea5e9', // Sky
    '#06b6d4', // Cyan
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
          <p className="text-sm font-bold text-gray-900">{payload[0].name}</p>
          <p className="text-xs font-semibold text-gray-600 mt-0.5">
            Value: <span className="text-blue-600 font-bold">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  // Truncate long names
  const truncateName = (name, maxLength = 20) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name
  }

  // Calculate percentage
  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  const getPercentage = (value) => {
    return ((value / totalValue) * 100).toFixed(2)
  }

  return (
    <div className="w-full h-full bg-white overflow-y-auto custom-scrollbar">
      {/* Pie Chart Section - Center aligned, compact size */}
      <div className="h-[180px] w-full flex items-center justify-center py-2 border-b border-gray-100">
        <div className="w-full h-full max-w-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="35%"
                outerRadius="75%"
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    stroke="#ffffff" 
                    strokeWidth={2}
                    opacity={hoveredLegendItem === null || hoveredLegendItem === index ? 1 : 0.4}
                    style={{ transition: 'opacity 0.2s ease' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Details Section - flows naturally below */}
      <div className="bg-gray-50">
        {/* Header with hint */}
        <div className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between text-xs font-semibold text-gray-700">
          <span>Detailed Distribution</span>
          <span className="text-gray-400 font-normal">Scroll to see all</span>
        </div>

        {/* Scrollable Details Table */}
        <table className="w-full text-xs">
          <thead className="bg-white border-b border-gray-200 sticky top-0 shadow-sm z-10">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Value</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-700">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr 
                key={`row-${index}`}
                className="hover:bg-white transition-colors cursor-default"
                onMouseEnter={() => setHoveredLegendItem(index)}
                onMouseLeave={() => setHoveredLegendItem(null)}
              >
                <td className="px-4 py-2 text-gray-900 font-medium flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate max-w-[120px]" title={item.name}>{truncateName(item.name, 25)}</span>
                </td>
                <td className="px-4 py-2 text-gray-700 text-right font-semibold">
                  {item.value.toLocaleString()}
                </td>
                <td className="px-4 py-2 text-right">
                  <span className="inline-block bg-blue-50 text-blue-600 px-2 py-1 rounded font-semibold scale-90 origin-right">
                    {getPercentage(item.value)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer Summary */}
        <div className="px-4 py-2 bg-white border-t border-gray-200 text-xs text-gray-600 font-medium flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-2px_6px_rgba(0,0,0,0.02)]">
          <div>
            <span>Total: </span>
            <span className="text-blue-600 font-bold">{totalValue.toLocaleString()}</span>
          </div>
          <div>
            <span>Items: </span>
            <span className="text-gray-900 font-bold">{data.length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PieChart
