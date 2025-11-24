import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashToken } from "@/lib/token-generator"

export async function POST(request: Request) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Hash the token to match against database
    const tokenHash = hashToken(token)

    // Find user with this token
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, email, reset_token_expires")
      .eq("password_reset_token", tokenHash)
      .single()

    if (error || !user) {
      return NextResponse.json({ valid: false, error: "Invalid reset token" }, { status: 400 })
    }

    // Check if token has expired
    const expiresAt = new Date(user.reset_token_expires)
    if (expiresAt < new Date()) {
      return NextResponse.json({ valid: false, error: "Reset token has expired" }, { status: 400 })
    }

    return NextResponse.json({
      valid: true,
      email: user.email,
    })
  } catch (error) {
    console.error("Verify token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
