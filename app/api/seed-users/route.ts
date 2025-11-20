import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const defaultUsers = [
      {
        email: "admin@bizacc.in",
        password: "Admin@123",
        role: "superadmin",
        name: "Super Admin",
        business_name: "BizAcc Platform",
      },
      {
        email: "wildknot01@gmail.com",
        password: "Wildknot@123",
        role: "admin",
        name: "Wildknot Admin",
        business_name: "Wildknot Solutions",
      },
      {
        email: "nygifting@gmail.com",
        password: "User@123",
        role: "user",
        name: "NY Gifting",
        business_name: "NY Gifting Store",
      },
    ]

    const results = []

    for (const user of defaultUsers) {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const userExists = existingUser?.users.find((u) => u.email === user.email)

      if (userExists) {
        results.push({ email: user.email, status: "already_exists" })
        continue
      }

      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          role: user.role,
          name: user.name,
          business_name: user.business_name,
        },
      })

      if (authError) {
        results.push({ email: user.email, status: "error", error: authError.message })
        continue
      }

      // Update profile
      if (authData.user) {
        await supabase
          .from("profiles")
          .update({
            business_name: user.business_name,
            status: "approved",
            plan: user.role === "superadmin" ? "Enterprise" : "Starter",
          })
          .eq("id", authData.user.id)
      }

      results.push({ email: user.email, status: "created", role: user.role })
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
