import React from 'react'

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = 'positive', // positive, negative, neutral
  className = ''
}) => {
  const trendColorMap = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-500 bg-gray-100'
  }

  return (
    <div className={`p-6 glass-card relative overflow-hidden flex flex-col justify-between min-h-[120px] ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-600">
            <Icon size={20} />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center gap-2">
          {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 ${trendColorMap[trendType]}`}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-600 truncate">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}

export default StatsCard
