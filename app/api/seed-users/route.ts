import { NextResponse } from "next/server"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const defaultUsers = [
      {
        email: "admin@bizacc.in",
        password: "bizacc123", // Updated to default password
        role: "superadmin",
        name: "Super Admin",
        business_name: "BizAcc Platform",
        plan: "Enterprise",
      },
      {
        email: "wildknot01@gmail.com",
        password: "bizacc123", // Updated to default password
        role: "admin",
        name: "Wildknot Admin",
        business_name: "Wildknot Solutions",
        plan: "Enterprise",
      },
      {
        email: "nygifting@gmail.com",
        password: "bizacc123", // Updated to default password
        role: "user",
        name: "NY Gifting",
        business_name: "NY Gifting Store",
        plan: "Starter",
      },
    ]

    const results = []

    for (const user of defaultUsers) {
      // Check if user exists in Auth
      // We can list users by email using admin api
      const {
        data: { users },
        error: listError,
      } = await supabaseAdmin.auth.admin.listUsers()

      // Filter manually since listUsers doesn't support filtering by email directly in all versions/adapters easily
      // or use getUserById if we had ID.
      // Actually, let's try to create and catch error if exists

      let userId = null
      const existingUser = users.find((u) => u.email === user.email)

      if (existingUser) {
        userId = existingUser.id
        // Update password if needed
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: user.password,
          user_metadata: {
            full_name: user.name,
            business_name: user.business_name,
            plan: user.plan,
          },
        })
        results.push({ email: user.email, status: "updated_auth" })
      } else {
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
          user_metadata: {
            full_name: user.name,
            business_name: user.business_name,
            plan: user.plan,
          },
        })

        if (createError) {
          console.error(`Failed to create user ${user.email}:`, createError)
          results.push({ email: user.email, status: "failed", error: createError.message })
          continue
        }
        userId = newUser.user.id
        results.push({ email: user.email, status: "created_auth" })
      }

      // Now sync with profiles table
      if (userId) {
        const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({
          id: userId,
          email: user.email,
          full_name: user.name,
          business_name: user.business_name,
          plan: user.plan,
          role: user.role,
          status: "approved",
          updated_at: new Date().toISOString(),
        })

        if (upsertError) {
          console.error(`Failed to update profile for ${user.email}:`, upsertError)
        }
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
