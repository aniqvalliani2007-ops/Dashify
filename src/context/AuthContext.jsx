import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [subscription, setSubscription] = useState({
    subscription_tier: 'free',
    csv_upload_count: 0,
    csv_upload_limit: 3
  })

  // Fetch subscription data when user changes
  useEffect(() => {
    const fetchSubscription = async () => {
      if (user?.id && isSupabaseConfigured) {
        try {
          const subData = await authService.getUserSubscription(user.id)
          setSubscription(subData)
        } catch (err) {
          console.error('Failed to fetch subscription:', err)
        }
      } else if (!user) {
        // Reset to default free tier when logged out
        setSubscription({
          subscription_tier: 'free',
          csv_upload_count: 0,
          csv_upload_limit: 3
        })
      }
    }
    fetchSubscription()
  }, [user?.id])

  // Listen to Supabase auth changes and handle initial session
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Just use the session user without trying to fetch profile
          // This prevents "User not found" errors
          setUser(session.user)
        } else {
          setUser(null)
        }
        setIsLoading(false)
      }
    )

    const subscription = data?.subscription

    return () => {
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signUp = async (email, password) => {
    return await authService.signUp(email, password)
  }

  const signIn = async (email, password) => {
    setIsLoading(true)
    const res = await authService.signIn(email, password)

    // If running without Supabase configured or auth fallback in dev, authService returns a fake user
    if (import.meta.env.DEV) {
      const userObj = res?.user || res?.session?.user || null
      if (userObj) {
        setUser(userObj)
        setIsLoading(false)
      }
    }

    return res
  }

  const signInWithGoogle = async () => {
    return await authService.signInWithGoogle()
  }

  const signOut = async () => {
    // Clear user immediately
    setUser(null)
    setIsLoading(false)
    // Then call Supabase signOut
    try {
      await authService.signOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const refreshSubscription = async () => {
    if (user?.id && isSupabaseConfigured) {
      try {
        const subData = await authService.getUserSubscription(user.id)
        setSubscription(subData)
      } catch (err) {
        console.error('Failed to refresh subscription:', err)
      }
    }
  }

  const value = {
    user,
    isLoading,
    subscription,
    refreshSubscription,
    signUp,
    signIn,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

