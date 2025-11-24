import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { verifyPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log("[v0] Login attempt for email:", email)

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user, error } = await supabase.from("profiles").select("*").eq("email", email).single()

    console.log("[v0] User query result:", { user, error })

    if (error || !user) {
      console.log("[v0] User not found or error:", error)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!user.password_hash) {
      console.log("[v0] No password_hash found for user")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      console.log("[v0] Password verification failed")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last active
    await supabase.from("user_sessions").insert({
      user_id: user.id,
      profile_id: user.id,
      last_activity: new Date().toISOString(),
      is_active: true,
    })

    // Return user data (excluding password hash)
    const { password_hash, ...userData } = user

    console.log("[v0] Login successful for user:", userData.email)

    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
