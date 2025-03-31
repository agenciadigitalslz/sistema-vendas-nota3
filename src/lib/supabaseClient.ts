
import { createClient } from '@supabase/supabase-js'

// Direct use of environment variables without using process.env
// This prevents "process is not defined" errors in the browser
const supabaseUrl = "https://vdnkfjlxqwzmaydzflgq.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmtmamx4cXd6bWF5ZHpmbGdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjg4MzIsImV4cCI6MjA1ODg0NDgzMn0.ar9plHnCFzUVJJfJdTuCgcxylpWH03z0J0Pk6kxjxDE"

export const supabase = createClient(supabaseUrl, supabaseKey)
