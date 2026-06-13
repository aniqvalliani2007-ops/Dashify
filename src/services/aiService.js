export const aiService = {
  /**
   * Send CSV metadata and user query to OpenRouter to get AI analytics insights
   */
  generateInsights: async (columns, sampleData, rowCount, userPrompt) => {
    console.log('🔧 AI Service called with:', { columns, rowCount, userPrompt })
    
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
    console.log('🔑 API Key exists:', !!apiKey, 'Starts with sk-or:', apiKey?.startsWith('sk-or'))
    
    if (!apiKey || apiKey.includes('YOUR_') || !apiKey.startsWith('sk-or')) {
      throw new Error('OpenRouter API Key is not properly configured in your .env.local file. Please add VITE_OPENROUTER_API_KEY=your_key')
    }

    if (!columns || columns.length === 0) {
      throw new Error('No columns provided for AI analysis')
    }

    const systemPrompt = `You are a professional Senior Data Analyst assistant for "Dashify".
You analyze CSV datasets and answer user questions about the data with precision and clarity.
Provide clear, concise, and actionable insights based on the user's specific question.
Format your output using clean Markdown with bullet points and bold key statistics.
Focus on answering the user's question directly and provide data-driven insights.
Be conversational but professional. Keep responses focused and avoid lengthy explanations unless asked.`

    const isFullDataset = sampleData.length === rowCount
    const userMessage = `Dataset Context:
- **Columns**: ${columns.join(', ')}
- **Total Records**: ${rowCount.toLocaleString()} rows
- **${isFullDataset ? 'Complete Dataset (JSON)' : `Sample Data (First ${sampleData.length} rows)`}**: 
${JSON.stringify(sampleData, null, 2)}

User Question: "${userPrompt}"

Please analyze the dataset and answer the user's question with specific insights, trends, and recommendations based on the data.`

    const models = [
      'google/gemma-2-9b-it:free',
      'meta-llama/llama-3-8b-instruct:free',
      'meta-llama/llama-3.2-3b-instruct:free',
      'openrouter/free'
    ]

    let lastError = null

    for (const model of models) {
      try {
        console.log(`📤 Sending request to OpenRouter with model ${model}...`)
        
        // Get the site URL - prioritize env variable, then detect from window location
        const siteUrl = import.meta.env.VITE_SITE_URL || 
                       (window.location.hostname.includes('localhost') 
                         ? 'http://localhost:5173' 
                         : window.location.origin)
        
        console.log(`🌐 Using site URL for OpenRouter: ${siteUrl}`)
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': siteUrl,
            'X-Title': 'Dashify - AI-Powered CSV Analytics Platform'
          },
          body: JSON.stringify({
            model: model,
            messages: [
              { 
                role: 'system', 
                content: systemPrompt 
              },
              { 
                role: 'user', 
                content: userMessage 
              }
            ],
            temperature: 0.7,
            max_tokens: 1500,
            top_p: 0.95
          })
        })

        console.log(`📥 Response status for ${model}:`, response.status)

        if (!response.ok) {
          let errMsg = `API request failed with status ${response.status}`
          try {
            const errData = await response.json()
            console.error(`❌ Error response for ${model}:`, errData)
            if (errData?.error?.message) {
              errMsg = errData.error.message
            }
          } catch (e) {
            // Continue with default error message
          }
          throw new Error(errMsg)
        }

        const data = await response.json()
        console.log(`✅ AI Response received successfully using model ${model}`)
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
          throw new Error('Invalid response format from API')
        }

        return data.choices[0].message.content
      } catch (err) {
        console.warn(`⚠️ Model ${model} failed:`, err.message)
        lastError = err
        
        if (err.message.includes('401') || err.message.includes('Unauthorized') || err.message.includes('API Key Error')) {
          throw err
        }
      }
    }

    if (lastError) {
      if (lastError.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to reach OpenRouter API. Please check your internet connection.')
      }
      if (lastError.message.includes('429')) {
        throw new Error('Rate Limited: Too many requests. Please wait a moment and try again.')
      }
      throw lastError
    }
    throw new Error('All OpenRouter models failed to respond.')
  }
}

export default aiService
