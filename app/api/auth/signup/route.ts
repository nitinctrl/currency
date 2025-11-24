import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, plan, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user already exists
    const { data: existingUsers } = await supabase.from("profiles").select("*").eq("email", email)

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)

    // Create new user
    const { data: newUser, error } = await supabase
      .from("profiles")
      .insert({
        email,
        password_hash: passwordHash,
        role: "user",
        name,
        business_name: businessName,
        plan: plan || "Free",
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Signup error:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json({ success: true, user: newUser })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
