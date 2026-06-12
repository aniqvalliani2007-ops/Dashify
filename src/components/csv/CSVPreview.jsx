import React from 'react'

export const CSVPreview = ({ data, headers }) => {
  if (!data || data.length === 0) return null

  return (
    <div className="w-full overflow-hidden rounded border border-gray-200 bg-white">
      <div className="overflow-x-auto max-h-60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 sticky top-0 text-gray-700 font-semibold uppercase tracking-wider">
              {headers.map((header) => (
                <th key={header} className="px-4 py-2.5 font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {headers.map((header) => (
                  <td key={header} className="px-4 py-2 text-gray-700 whitespace-nowrap max-w-xs truncate">
                    {row[header] !== undefined && row[header] !== null
                      ? String(row[header])
                      : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CSVPreview
