import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to execute SQL-like queries using Supabase
export const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  // This is a compatibility layer for the existing code that uses sql templates
  // Convert to Supabase queries - this is a simplified version
  throw new Error("Direct SQL queries should be replaced with Supabase client calls")
}
