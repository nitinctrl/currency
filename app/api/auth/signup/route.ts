import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth-neon"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, plan, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`SELECT * FROM profiles WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    // Create new user
    // Note: phone is not in the profiles table schema I created earlier, so I'll skip it for now or add it to profiles if needed.
    // The schema has: id, email, full_name, role, password_hash, business_name, status, plan, created_at, updated_at
    // I'll map 'name' to 'full_name' and 'businessName' to 'business_name'

    const result = await sql`
      INSERT INTO profiles (email, password_hash, role, full_name, business_name, plan, status)
      VALUES (${email}, ${passwordHash}, 'user', ${name}, ${businessName}, ${plan}, 'pending')
      RETURNING id, email, full_name, role, business_name, plan, status
    `

    const newUser = result[0]

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
