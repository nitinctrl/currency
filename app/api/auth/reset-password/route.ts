import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashToken } from "@/lib/token-generator"
import { hashPassword } from "@/lib/auth-neon"

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

    // Hash the token to match against database
    const tokenHash = hashToken(token)

    // Find user with this token
    const users = await sql`
      SELECT id, email, reset_token_expires 
      FROM profiles 
      WHERE password_reset_token = ${tokenHash}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 })
    }

    const user = users[0]

    // Check if token has expired
    const expiresAt = new Date(user.reset_token_expires)
    if (expiresAt < new Date()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 })
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword)

    // Update password and clear reset token
    await sql`
      UPDATE profiles 
      SET password_hash = ${newPasswordHash},
          password_reset_token = NULL,
          reset_token_expires = NULL,
          last_password_reset = NOW(),
          updated_at = NOW()
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
