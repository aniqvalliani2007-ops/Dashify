import React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

export const BarChart = ({ data, xAxisKey = 'name', yAxisKey = 'value' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        No aggregated data to display
      </div>
    )
  }

  // Custom tooltips for premium feel
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
      <RechartsBarChart
        data={data}
        margin={{ top: 10, right: 10, left: -10, bottom: 20 }}
      >
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a5d4e" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#237e69" stopOpacity={0.1} />
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
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(26, 93, 78, 0.05)', radius: 4 }} />
        <Bar
          dataKey={yAxisKey}
          name={yAxisKey}
          fill="url(#barGradient)"
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export default BarChart
