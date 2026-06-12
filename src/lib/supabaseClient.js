import { createClient } from '@supabase/supabase-js'

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error(
    'Supabase environment variables `VITE_SUPABASE_URL` or `VITE_SUPABASE_ANON_KEY` are missing. Add them to .env.local and restart the dev server.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
)

// Offline state tracker for dev/local fallback
export let isSupabaseOffline = false
export const setSupabaseOffline = (val) => {
  isSupabaseOffline = val
}
