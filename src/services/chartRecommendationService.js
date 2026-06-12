/**
 * AI Chart Recommendation Service
 * CSV Visualization Flow Steps 6-8:
 * 6. Send metadata to OpenRouter API
 * 7. AI analyzes metadata and returns chart recommendations
 * 8. Receive AI response in JSON format
 */

/**
 * Generate chart recommendations using AI
 * Sends dataset metadata to OpenRouter API and returns structured chart configurations
 */
export const generateChartRecommendations = async (metadata) => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  
  if (!apiKey || apiKey.includes('YOUR_') || !apiKey.startsWith('sk-or')) {
    throw new Error('OpenRouter API Key is not properly configured. Please add VITE_OPENROUTER_API_KEY to your .env.local')
  }

  if (!metadata || !metadata.columns) {
    throw new Error('Invalid metadata provided for chart recommendations')
  }

  // Build the metadata summary for AI
  const metadataSummary = buildMetadataSummary(metadata)

  const systemPrompt = `You are an expert data visualization specialist for "Dashify".
Your task is to analyze dataset metadata and recommend the best chart configurations for visualizing the data.

Respond with a JSON object containing an array of chart recommendations. Each recommendation should include:
- type: 'line', 'bar', 'pie', 'scatter', or 'area'
- title: A descriptive title for the chart
- xAxis: The column to use for X-axis
- yAxis: The column(s) to use for Y-axis (can be array for multiple metrics)
- aggregation: 'sum', 'avg', 'count', 'min', or 'max'
- reason: Why this visualization is suitable
- priority: 'high', 'medium', or 'low'

IMPORTANT: Return ONLY valid JSON, no markdown, no code blocks, no explanations. Start with { and end with }.`

  const userMessage = `Analyze this dataset metadata and recommend the best charts for visualization:

${metadataSummary}

Generate 3-5 highly relevant chart recommendations in JSON format with this exact structure:
{
  "recommendations": [
    {
      "type": "bar|line|pie|scatter|area",
      "title": "chart title",
      "xAxis": "column_name",
      "yAxis": "column_name or [column1, column2]",
      "aggregation": "sum|avg|count|min|max",
      "reason": "why this chart is good",
      "priority": "high|medium|low"
    }
  ]
}`

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin || 'https://dashify.analytics',
        'X-Title': 'Dashify Chart Recommendations'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.4,
        max_tokens: 2048
      })
    })

    if (!response.ok) {
      let errMsg = `API request failed with status ${response.status}`
      try {
        const errData = await response.json()
        if (errData?.error?.message) {
          errMsg = errData.error.message
        }
      } catch (e) {
        // Continue with default error message
      }
      throw new Error(errMsg)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from API')
    }

    const content = data.choices[0].message.content.trim()
    
    // Parse JSON response
    let recommendations = {}
    try {
      recommendations = JSON.parse(content)
    } catch (parseErr) {
      console.error('Failed to parse AI response as JSON:', content)
      throw new Error('AI returned invalid JSON format')
    }

    // Validate and enhance recommendations
    return validateAndEnhanceRecommendations(recommendations, metadata)
  } catch (err) {
    if (err.message.includes('Failed to fetch')) {
      throw new Error('Network error: Unable to reach OpenRouter API')
    }
    throw err
  }
}

/**
 * Helper: Build metadata summary for AI
 */
const buildMetadataSummary = (metadata) => {
  let summary = `Dataset: ${metadata.fileName}\n`
  summary += `Records: ${metadata.dataShape.rowCount}\n`
  summary += `Columns: ${metadata.dataShape.columnCount}\n\n`

  summary += `Column Details:\n`
  Object.entries(metadata.columnDetails).forEach(([col, details]) => {
    summary += `- ${col} (${details.type}): `
    if (details.type === 'number') {
      summary += `Range: ${details.min} to ${details.max}, Avg: ${details.average}`
    } else if (details.type === 'date') {
      summary += `Range: ${details.minDate} to ${details.maxDate}`
    } else {
      summary += `${details.uniqueCount} unique values`
    }
    if (details.nullPercentage > 0) {
      summary += `, ${details.nullPercentage}% null`
    }
    summary += '\n'
  })

  summary += `\nNumeric Columns: ${metadata.statistics.numericColumns.join(', ')}\n`
  summary += `Date Columns: ${metadata.statistics.dateColumns.join(', ')}\n`
  summary += `Category Columns: ${metadata.statistics.categoryColumns.join(', ')}\n`

  if (metadata.statistics.correlations.length > 0) {
    summary += `\nCorrelations Detected:\n`
    metadata.statistics.correlations.forEach(corr => {
      summary += `- ${corr.column1} ↔ ${corr.column2}: ${corr.strength} (${corr.correlation})\n`
    })
  }

  summary += `\nData Quality: ${metadata.summary.dataQuality.completeness} complete\n`

  return summary
}

/**
 * Helper: Validate and enhance recommendations
 */
const validateAndEnhanceRecommendations = (response, metadata) => {
  const recommendations = response.recommendations || response || []
  
  if (!Array.isArray(recommendations)) {
    throw new Error('Invalid recommendations format from AI')
  }

  return recommendations
    .filter(rec => rec && rec.type && rec.xAxis)
    .map(rec => enhanceRecommendation(rec, metadata))
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
    })
}

/**
 * Helper: Enhance a single recommendation
 */
const enhanceRecommendation = (rec, metadata) => {
  // Validate axis columns exist
  const columns = metadata.columns.names
  
  let xAxis = rec.xAxis
  let yAxis = rec.yAxis
  
  if (!columns.includes(xAxis)) {
    xAxis = columns[0]
  }
  
  if (typeof yAxis === 'string' && !columns.includes(yAxis)) {
    yAxis = columns[columns.length > 1 ? 1 : 0]
  } else if (Array.isArray(yAxis)) {
    yAxis = yAxis.filter(col => columns.includes(col))
    if (yAxis.length === 0) {
      yAxis = columns[columns.length > 1 ? 1 : 0]
    }
  }

  return {
    type: validateChartType(rec.type),
    title: rec.title || `${rec.type} Chart`,
    xAxis,
    yAxis,
    aggregation: rec.aggregation || 'sum',
    reason: rec.reason || 'Recommended visualization',
    priority: rec.priority || 'medium',
    config: generateChartConfig(rec.type, xAxis, yAxis, rec.aggregation || 'sum')
  }
}

/**
 * Helper: Validate chart type
 */
const validateChartType = (type) => {
  const validTypes = ['line', 'bar', 'pie', 'scatter', 'area']
  return validTypes.includes(type) ? type : 'bar'
}

/**
 * Helper: Generate full chart configuration for Recharts
 */
const generateChartConfig = (type, xAxis, yAxis, aggregation) => {
  const baseConfig = {
    type,
    xAxis,
    yAxis: typeof yAxis === 'string' ? [yAxis] : yAxis,
    aggregation
  }

  switch (type) {
    case 'line':
      return {
        ...baseConfig,
        options: {
          responsiveContainer: { width: '100%', height: 400 },
          margin: { top: 5, right: 30, left: 0, bottom: 5 },
          strokeWidth: 2.5,
          dot: false,
          tooltip: { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' } }
        }
      }
    
    case 'bar':
      return {
        ...baseConfig,
        options: {
          responsiveContainer: { width: '100%', height: 400 },
          margin: { top: 20, right: 30, left: 0, bottom: 5 },
          barSize: 'dataMax * 0.8',
          tooltip: { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' } }
        }
      }
    
    case 'pie':
      return {
        ...baseConfig,
        options: {
          responsiveContainer: { width: '100%', height: 400 },
          startAngle: 0,
          endAngle: 360,
          tooltip: { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' } }
        }
      }
    
    case 'scatter':
      return {
        ...baseConfig,
        options: {
          responsiveContainer: { width: '100%', height: 400 },
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
          dot: { r: 4 },
          tooltip: { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' } }
        }
      }
    
    case 'area':
      return {
        ...baseConfig,
        options: {
          responsiveContainer: { width: '100%', height: 400 },
          margin: { top: 5, right: 30, left: 0, bottom: 5 },
          strokeWidth: 2,
          fillOpacity: 0.6,
          tooltip: { contentStyle: { backgroundColor: '#fff', border: '1px solid #e5e7eb' } }
        }
      }
    
    default:
      return baseConfig
  }
}

/**
 * Generate chart recommendations with fallback (if AI fails)
 */
export const generateChartRecommendationsWithFallback = async (metadata) => {
  try {
    return await generateChartRecommendations(metadata)
  } catch (error) {
    console.warn('AI recommendations failed, using fallback suggestions:', error)
    return generateFallbackRecommendations(metadata)
  }
}

/**
 * Fallback recommendations based on data structure
 */
const generateFallbackRecommendations = (metadata) => {
  const recommendations = []
  const numericCols = metadata.statistics.numericColumns
  const dateCols = metadata.statistics.dateColumns
  const categoryCols = metadata.statistics.categoryColumns

  // Time series line chart
  if (dateCols.length > 0 && numericCols.length > 0) {
    recommendations.push({
      type: 'line',
      title: `${numericCols[0]} Over Time`,
      xAxis: dateCols[0],
      yAxis: numericCols[0],
      aggregation: 'sum',
      reason: 'Time series visualization',
      priority: 'high',
      config: generateChartConfig('line', dateCols[0], numericCols[0], 'sum')
    })
  }

  // Category bar chart
  if (categoryCols.length > 0 && numericCols.length > 0) {
    recommendations.push({
      type: 'bar',
      title: `${numericCols[0]} by ${categoryCols[0]}`,
      xAxis: categoryCols[0],
      yAxis: numericCols[0],
      aggregation: 'sum',
      reason: 'Categorical comparison',
      priority: 'high',
      config: generateChartConfig('bar', categoryCols[0], numericCols[0], 'sum')
    })
  }

  // Pie chart for proportions
  if (categoryCols.length > 0 && numericCols.length > 0) {
    const uniqueCount = metadata.columnDetails[categoryCols[0]]?.uniqueCount
    if (uniqueCount && uniqueCount <= 10) {
      recommendations.push({
        type: 'pie',
        title: `${numericCols[0]} Distribution`,
        xAxis: categoryCols[0],
        yAxis: numericCols[0],
        aggregation: 'sum',
        reason: 'Proportion visualization',
        priority: 'medium',
        config: generateChartConfig('pie', categoryCols[0], numericCols[0], 'sum')
      })
    }
  }

  // Scatter plot for correlation
  if (numericCols.length >= 2) {
    recommendations.push({
      type: 'scatter',
      title: `${numericCols[0]} vs ${numericCols[1]}`,
      xAxis: numericCols[0],
      yAxis: numericCols[1],
      aggregation: 'sum',
      reason: 'Correlation analysis',
      priority: 'medium',
      config: generateChartConfig('scatter', numericCols[0], numericCols[1], 'sum')
    })
  }

  // Count by category
  if (categoryCols.length > 0 && (numericCols.length === 0 || numericCols.length > 2)) {
    recommendations.push({
      type: 'bar',
      title: `Records by ${categoryCols[0]}`,
      xAxis: categoryCols[0],
      yAxis: 'count',
      aggregation: 'count',
      reason: 'Count distribution',
      priority: 'low',
      config: generateChartConfig('bar', categoryCols[0], 'count', 'count')
    })
  }

  return recommendations.slice(0, 5)
}

export default {
  generateChartRecommendations,
  generateChartRecommendationsWithFallback
}
