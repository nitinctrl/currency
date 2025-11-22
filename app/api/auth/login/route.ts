import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const headersList = await headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const adminClient = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: attempt } = await adminClient.from("auth_attempts").select("*").eq("email", email).single()

    if (attempt) {
      if (attempt.locked_until && new Date(attempt.locked_until) > new Date()) {
        const minutesLeft = Math.ceil((new Date(attempt.locked_until).getTime() - new Date().getTime()) / 60000)
        return NextResponse.json({ error: `Account locked. Try again in ${minutesLeft} minutes.` }, { status: 429 })
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const newAttempts = (attempt?.attempts || 0) + 1
      let lockedUntil = null

      if (newAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString()
      }

      if (attempt) {
        await adminClient
          .from("auth_attempts")
          .update({
            attempts: newAttempts,
            last_attempt_at: new Date().toISOString(),
            locked_until: lockedUntil,
            ip_address: ip,
          })
          .eq("id", attempt.id)
      } else {
        await adminClient.from("auth_attempts").insert({
          email,
          attempts: newAttempts,
          ip_address: ip,
          locked_until: lockedUntil,
        })
      }

      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    if (attempt) {
      await adminClient
        .from("auth_attempts")
        .update({ attempts: 0, locked_until: null, last_attempt_at: new Date().toISOString() })
        .eq("id", attempt.id)
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

    return NextResponse.json({
      success: true,
      user: {
        ...data.user,
        ...profile,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
