import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { name, email, password, businessName, plan, phone } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if user exists (Supabase handles this, but we can also check profiles if needed)
    // auth.signUp will return an error or existing user if configured

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          business_name: businessName,
          plan: plan,
          phone: phone,
        },
      },
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      // Create profile entry if it wasn't created by a trigger
      // We check if it exists first to avoid errors if a trigger exists
      const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()

      if (!existingProfile) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          email: email,
          full_name: name,
          business_name: businessName,
          plan: plan,
          role: "user",
          status: "pending",
        })
      }
    }

    return NextResponse.json({ success: true, user: data.user })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
