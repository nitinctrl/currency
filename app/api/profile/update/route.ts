import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, name, businessName } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // We should strictly check if the authenticated user matches the email being updated
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (user.email !== email) {
      return NextResponse.json({ error: "Forbidden: You can only update your own profile" }, { status: 403 })
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        business_name: businessName,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
