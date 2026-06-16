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
    <div className={`p-4 bg-white border border-gray-200 rounded relative overflow-hidden flex flex-col justify-between min-h-[100px] hover:shadow-md transition-shadow ${className}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-xl font-bold text-gray-900">{value}</h3>
        </div>
        {Icon && (
          <div className="p-2 bg-blue-50 border border-blue-200 text-blue-600 rounded">
            <Icon size={16} />
          </div>
        )}
      </div>

      {(description || trend) && (
        <div className="mt-3 flex items-center gap-1.5">
          {trend && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trendColorMap[trendType]}`}>
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
