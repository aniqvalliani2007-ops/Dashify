import React, { useState } from 'react'
import { Check, Settings2 } from 'lucide-react'
import Button from '../common/Button'

export const ColumnMapper = ({ headers, onConfirm, isLoading }) => {
  // Map internal states: { [originalHeader]: { selected: boolean, mappedName: string } }
  const [mapping, setMapping] = useState(
    headers.reduce((acc, header) => {
      acc[header] = { selected: true, mappedName: header }
      return acc
    }, {})
  )

  const handleToggle = (header) => {
    setMapping((prev) => ({
      ...prev,
      [header]: {
        ...prev[header],
        selected: !prev[header].selected
      }
    }))
  }

  const handleNameChange = (header, value) => {
    setMapping((prev) => ({
      ...prev,
      [header]: {
        ...prev[header],
        mappedName: value
      }
    }))
  }

  const handleSubmit = () => {
    // Collect final names for selected columns
    const selectedHeaders = Object.keys(mapping)
      .filter((h) => mapping[h].selected)
      .map((h) => mapping[h].mappedName.trim() || h)

    if (selectedHeaders.length === 0) {
      alert('You must select at least one column to import.')
      return
    }

    onConfirm(selectedHeaders)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
        <Settings2 size={16} className="text-blue-600" />
        <h4 className="text-sm font-semibold text-gray-900">Map Columns for Import</h4>
      </div>

      <p className="text-xs text-gray-600">
        Select which columns to import. Optionally rename the column headers below.
      </p>

      <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
        {headers.map((header) => {
          const item = mapping[header]
          return (
            <div
              key={header}
              className={`flex items-center gap-3 p-3 rounded border transition-colors ${
                item.selected
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-transparent border-transparent opacity-60'
              }`}
            >
              <input
                type="checkbox"
                id={`chk-${header}`}
                checked={item.selected}
                onChange={() => handleToggle(header)}
                className="rounded bg-white border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-white cursor-pointer h-4 w-4"
              />
              
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
                <label
                  htmlFor={`chk-${header}`}
                  className="text-xs font-semibold text-gray-700 truncate cursor-pointer"
                  title={header}
                >
                  {header}
                </label>
                
                {item.selected && (
                  <input
                    type="text"
                    value={item.mappedName}
                    onChange={(e) => handleNameChange(header, e.target.value)}
                    className="bg-white border border-gray-300 focus:border-blue-500 rounded px-2 py-1 text-xs text-gray-900 focus:outline-none placeholder-gray-400"
                    placeholder="New column name..."
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          onClick={handleSubmit}
          className="w-full flex items-center justify-center gap-2"
          isLoading={isLoading}
        >
          <Check size={16} />
          Confirm & Import Dataset
        </Button>
      </div>
    </div>
  )
}

export default ColumnMapper
