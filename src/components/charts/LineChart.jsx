import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export const LineChart = ({ data, xAxisKey = 'name', yAxisKey = 'value' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        No aggregated data to display
      </div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 p-3 rounded shadow-lg">
          <p className="text-xs font-semibold text-gray-600 mb-1">{label}</p>
          <p className="text-sm font-bold text-[#1a5d4e]">
            {payload[0].name}: <span className="text-gray-900">{payload[0].value.toLocaleString()}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a5d4e" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#1a5d4e" stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} vertical={false} />
        <XAxis
          dataKey={xAxisKey}
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis
          stroke="#9ca3af"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          dx={-5}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey={yAxisKey}
          name={yAxisKey}
          stroke="#1a5d4e"
          strokeWidth={2.5}
          fillOpacity={1}
          fill="url(#areaGradient)"
          activeDot={{ r: 6, stroke: '#f5f7fa', strokeWidth: 2, fill: '#1a5d4e' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default LineChart
