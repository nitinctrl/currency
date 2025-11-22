import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, plan, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Note: This requires SUPABASE_SERVICE_ROLE_KEY to be set in environment variables
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // 1. Create the user using Admin API to bypass email confirmation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm the user
      user_metadata: {
        full_name: name,
        business_name: businessName,
        plan: plan,
        phone: phone,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // 2. Create profile entry
    // We can use the same admin client to bypass any RLS issues during signup
    const { error: profileError } = await supabaseAdmin.from("profiles").insert({
      id: authData.user.id,
      email: email,
      full_name: name,
      business_name: businessName,
      plan: plan,
      role: "user",
      status: "pending", // Keeping 'pending' for admin approval if that's the workflow, but auth is active
    })

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // We don't return error here as the user account is already created
    }

    return NextResponse.json({ success: true, user: authData.user })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
