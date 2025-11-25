import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth-neon"

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    // Basic validation
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch user by email
    const users = await sql`SELECT * FROM profiles WHERE email = ${email}`
    const user = users[0]

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Verify existing password
    const isValid = await verifyPassword(currentPassword, user.password_hash)
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 })
    }

    // Hash new password
    const newHash = await hashPassword(newPassword)

    // Update password
    await sql`
      UPDATE profiles 
      SET password_hash = ${newHash}, updated_at = NOW()
      WHERE email = ${email}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
