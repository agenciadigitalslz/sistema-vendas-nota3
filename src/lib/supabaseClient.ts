import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vdnkfjlxqwzmaydzflgq.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmtmamx4cXd6bWF5ZHpmbGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjg4MzIsImV4cCI6MjA1ODg0NDgzMn0.ar9plHnCFzUVJJfJdTuCgcxylpWH03z0J0Pk6kxjxDE"

export const supabase = createClient(supabaseUrl, supabaseKey)
