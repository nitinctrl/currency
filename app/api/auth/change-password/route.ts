import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword, verifyPassword } from "@/lib/auth-utils"

export async function POST(request: Request) {
  try {
    const { email, currentPassword, newPassword } = await request.json()

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify current password
    const { data: user, error } = await supabase.from("profiles").select("*").eq("email", email).single()

    if (error || !user || !user.password_hash) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash)

    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 401 })
    }

    // Update password
    const newPasswordHash = await hashPassword(newPassword)

    await supabase
      .from("profiles")
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Password change error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
