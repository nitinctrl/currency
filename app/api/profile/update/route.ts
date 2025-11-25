import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { email, name, businessName } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await sql`
      UPDATE profiles 
      SET full_name = ${name}, 
          business_name = ${businessName},
          updated_at = NOW()
      WHERE email = ${email}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
