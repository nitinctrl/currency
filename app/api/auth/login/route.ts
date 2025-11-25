import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Get user from profiles table by email
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email.toLowerCase())
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user has a password hash
    if (!profile.password_hash) {
      return NextResponse.json({ error: "Password not set for this account" }, { status: 401 })
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, profile.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if user is approved
    if (profile.status !== "approved") {
      return NextResponse.json({ error: "Account pending approval" }, { status: 403 })
    }

    // Update last active session
    await supabase
      .from("user_sessions")
      .upsert({ user_id: profile.id, last_active: new Date().toISOString() }, { onConflict: "user_id" })
      .catch(() => {}) // Ignore session errors

    // Return user data without sensitive fields
    const { password_hash, ...safeProfile } = profile

    return NextResponse.json({
      success: true,
      user: safeProfile,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
