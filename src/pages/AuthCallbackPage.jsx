import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/**
 * Handles the OAuth redirect from Supabase after Google sign-in.
 * Supabase automatically parses the URL hash/code and establishes the session.
 * We just wait for the session, then redirect to /dashboard.
 */
export const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase JS v2 automatically exchanges the code in the URL for a session.
        // We call getSession() to confirm it completed.
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('OAuth callback error:', error)
          setError(error.message || 'Authentication failed. Please try again.')
          setTimeout(() => navigate('/login', { replace: true }), 3000)
          return
        }

        if (data?.session) {
          // Session established — go to dashboard
          navigate('/dashboard', { replace: true })
        } else {
          // No session yet — listen for it (handles PKCE flow)
          const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
              listener.subscription.unsubscribe()
              navigate('/dashboard', { replace: true })
            }
          })

          // Fallback timeout
          setTimeout(() => {
            setError('Sign-in timed out. Please try again.')
            setTimeout(() => navigate('/login', { replace: true }), 3000)
          }, 10000)
        }
      } catch (err) {
        console.error('Callback handling error:', err)
        setError('Something went wrong. Redirecting to login...')
        setTimeout(() => navigate('/login', { replace: true }), 3000)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        {error ? (
          <>
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-red-600 font-medium text-sm">{error}</p>
            <p className="text-gray-500 text-xs">Redirecting to login...</p>
          </>
        ) : (
          <>
            {/* Spinner */}
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto" />
            <p className="text-gray-700 font-medium text-sm">Completing sign-in...</p>
            <p className="text-gray-400 text-xs">Please wait while we set up your session</p>
          </>
        )}
      </div>
    </div>
  )
}

export default AuthCallbackPage
