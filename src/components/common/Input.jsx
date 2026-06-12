import React from 'react'

export const Input = ({
  label,
  id,
  type = 'text',
  error,
  className = '',
  icon: Icon,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          className={`w-full bg-white border rounded py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
            Icon ? 'pl-10' : 'pl-3'
          } ${
            error
              ? 'border-red-500 focus:ring-red-500/30'
              : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500/20'
          }`}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-600 mt-0.5">{error}</span>
      )}
    </div>
  )
}

export default Input
