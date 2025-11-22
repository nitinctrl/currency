import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyPassword } from "@/lib/auth-neon"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const users = await sql`SELECT * FROM profiles WHERE email = ${email}`
    const user = users[0]

    if (!user || !user.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Update last active
    await sql`
      INSERT INTO user_sessions (user_id, last_active)
      VALUES (${user.id}, NOW())
    `

    // Return user data (excluding password hash)
    const { password_hash, ...userData } = user

    return NextResponse.json({
      success: true,
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
