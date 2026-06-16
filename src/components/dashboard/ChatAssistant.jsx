import React, { useState, useRef, useEffect } from 'react'
import { MessageSquare, Send, X, Minimize2, Maximize2, Sparkles, User, Bot } from 'lucide-react'
import Button from '../common/Button'
import Loader from '../common/Loader'
import { aiService } from '../../services/aiService'
import toast from 'react-hot-toast'

export const ChatAssistant = ({ fileRows, headers, isOpen, onClose, onToggle }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your data assistant. Ask me anything about your dataset, and I\'ll help you analyze it.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const sample = fileRows?.length <= 100 ? fileRows : fileRows?.slice(0, 50)
      const response = await aiService.generateInsights(headers, sample, fileRows?.length || 0, input)
      
      const assistantMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      console.error('Chat error:', err)
      const errorMessage = {
        role: 'assistant',
        content: err.message?.includes('401') || err.message?.includes('Unauthorized')
          ? '⚠️ I couldn\'t connect to the AI service. Please check your API configuration.'
          : '⚠️ Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to get response')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatMessage = (text) => {
    if (!text) return null
    
    return text.split('\n').map((line, idx) => {
      const content = line.trim()
      
      if (content.startsWith('### ')) {
        return <h5 key={idx} className="text-xs font-bold text-gray-900 mt-2 mb-1">{content.replace('### ', '')}</h5>
      }
      if (content.startsWith('## ')) {
        return <h4 key={idx} className="text-sm font-bold text-blue-700 mt-3 mb-1.5">{content.replace('## ', '')}</h4>
      }
      if (content.startsWith('- ') || content.startsWith('* ')) {
        return (
          <li key={idx} className="ml-3 list-disc text-gray-700 mb-0.5 text-xs leading-relaxed">
            {content.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
          </li>
        )
      }
      if (content === '') return <div key={idx} className="h-1" />
      
      return (
        <p 
          key={idx} 
          className="text-gray-700 mb-1.5 text-xs leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
          }}
        />
      )
    })
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat cleared. How can I help you with your data?',
        timestamp: new Date()
      }
    ])
  }

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 z-50 flex items-center gap-2 group"
        aria-label="Open chat assistant"
      >
        <MessageSquare size={24} />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap text-sm font-medium">
          Ask AI
        </span>
      </button>
    )
  }

  return (
    <div 
      className={`fixed right-6 bg-white border border-gray-200 shadow-2xl z-50 flex flex-col transition-all duration-300 ${
        isMinimized ? 'bottom-6 w-80' : 'bottom-6 w-96 h-[600px]'
      }`}
      style={{ borderRadius: '8px', maxHeight: '85vh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-full">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Data Assistant</h3>
            {!isMinimized && <p className="text-xs text-blue-100">Ask questions about your data</p>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            aria-label="Close chat"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot size={14} className="text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.isError
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.role === 'user' ? (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  ) : (
                    <div className="text-sm">{formatMessage(message.content)}</div>
                  )}
                  <div className={`text-[10px] mt-1.5 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User size={14} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-blue-600" />
                </div>
                <div className="bg-white border border-gray-200 px-4 py-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={clearChat}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear chat
              </button>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatAssistant
