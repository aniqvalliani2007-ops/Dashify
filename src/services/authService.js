import { supabase, isSupabaseConfigured, supabaseUrl } from '../lib/supabaseClient'

const REQUEST_TIMEOUT_MS = 10000

const withTimeout = (p, ms = REQUEST_TIMEOUT_MS) => {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Request timed out')), ms))
  ])
}

const shortTimeout = (ms) => (p) => {
  return Promise.race([
    p,
    new Promise((_, rej) => setTimeout(() => rej(new Error('Diagnostic timed out')), ms))
  ])
}

const pingSupabase = async (timeoutMs = 3000) => {
  if (!supabaseUrl) return { ok: false, reason: 'No SUPABASE URL configured' }
  try {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(supabaseUrl, { method: 'GET', signal: controller.signal })
    clearTimeout(id)
    return { ok: true, status: res.status }
  } catch (err) {
    return { ok: false, reason: err.message }
  }
}

export const authService = {
  /**
   * Register a new user
   */
  signUp: async (email, password, metadata = {}) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local and restart the dev server.')
    }
    const { data, error } = await withTimeout(
      supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata // Pass full_name and other metadata
        }
      })
    )
    if (error) throw error
    return data
  },

  /**
   * Log in an existing user
   */
  signIn: async (email, password) => {
    if (!isSupabaseConfigured) {
      // Dev fallback: allow local development without Supabase configured
      if (import.meta.env.DEV) {
        const fakeUser = { id: 'dev-user', email }
        const fakeSession = { access_token: 'dev-token', user: fakeUser }
        return { user: fakeUser, session: fakeSession }
      }
      throw new Error('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local and restart the dev server.')
    }
    try {
      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email, password })
      )
      if (error) throw error
      return data
    } catch (err) {
      const message = err?.message || ''
      if (import.meta.env.DEV && (message.includes('timed out') || message.includes('Failed to fetch') || message.includes('NetworkError') || message.includes('network'))) {
        console.warn('Supabase auth failed in dev; falling back to local dev auth.', err)
        const fakeUser = { id: 'dev-user', email }
        const fakeSession = { access_token: 'dev-token', user: fakeUser }
        return { user: fakeUser, session: fakeSession }
      }
      if (message.includes('timed out')) {
        const ping = await pingSupabase(3000)
        if (!ping.ok) {
          throw new Error(`Request timed out while contacting Supabase. Diagnostic: ${ping.reason || 'host unreachable'}. Check your internet connection and VITE_SUPABASE_URL in .env.local.`)
        }
        throw new Error('Request timed out contacting Supabase auth. The Supabase host is reachable but the auth request did not complete; check network/CORS or try again.')
      }
      throw err
    }
  },

  /**
   * Log out the current user
   */
  signOut: async () => {
    if (!isSupabaseConfigured) {
      // In dev mode without Supabase, just return success
      if (import.meta.env.DEV) {
        return { error: null }
      }
      throw new Error('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local and restart the dev server.')
    }
    const { error } = await withTimeout(supabase.auth.signOut())
    if (error) throw error
  },

  /**
   * Get current session profile
   */
  getCurrentUser: async () => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local and restart the dev server.')
    }
    const { data: { session }, error: sessionError } = await withTimeout(
      supabase.auth.getSession()
    )
    if (sessionError) throw sessionError
    const user = session?.user
    if (!user) return null

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      // Return user info even if profile fetch fails
      return { ...user, profile: null }
    }

    return { ...user, profile }
  },

  /**
   * Get user subscription status
   */
  getUserSubscription: async (userId) => {
    if (!isSupabaseConfigured) {
      // Dev fallback
      if (import.meta.env.DEV) {
        return {
          subscription_tier: 'free',
          csv_upload_count: 0,
          csv_upload_limit: 3
        }
      }
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier, csv_upload_count, csv_upload_limit, subscription_started_at, subscription_expires_at')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching subscription:', error)
      // Fallback to free tier
      return {
        subscription_tier: 'free',
        csv_upload_count: 0,
        csv_upload_limit: 3
      }
    }

    return data
  },

  /**
   * Check if user can upload more files
   */
  canUploadCSV: async (userId) => {
    if (!isSupabaseConfigured) {
      if (import.meta.env.DEV) {
        return true
      }
      throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase.rpc('can_upload_csv', { user_uuid: userId })

    if (error) {
      console.error('Error checking upload permission:', error)
      return false
    }

    return data
  }
}
