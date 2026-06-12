import React from 'react'
import { AuthProvider } from './context/AuthContext'
import { CSVProvider } from './context/CSVContext'
import AppRouter from './routes/AppRouter'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <AuthProvider>
      <CSVProvider>
        <AppRouter />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f172a',
              color: '#f3f4f6',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '14px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            }
          }}
        />
      </CSVProvider>
    </AuthProvider>
  )
}
