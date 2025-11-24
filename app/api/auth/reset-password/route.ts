import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashToken } from "@/lib/token-generator"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    // Validate password strength
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
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
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    // Check if token has expired
    const expiresAt = new Date(user.reset_token_expires)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password and clear reset token
    await supabase
      .from("profiles")
      .update({
        password_hash: newPasswordHash,
        password_reset_token: null,
        reset_token_expires: null,
        last_password_reset: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
