import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase environment variables are missing!")
    // Return a dummy client to prevent crash, requests will fail but app will load
    return createBrowserClient("https://placeholder.supabase.co", "placeholder")
  }

  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
