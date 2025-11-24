import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { hashPassword } from "@/lib/auth-utils"

export async function POST() {
  try {
    const defaultUsers = [
      {
        email: "admin@bizacc.in",
        password: "123456",
        role: "superadmin",
        name: "Super Admin",
        business_name: "BizAcc Platform",
        plan: "Enterprise",
      },
      {
        email: "wildknot01@gmail.com",
        password: "123456",
        role: "admin",
        name: "Wildknot Admin",
        business_name: "Wildknot Solutions",
        plan: "Enterprise",
      },
      {
        email: "nygifting@gmail.com",
        password: "123456",
        role: "user",
        name: "NY Gifting",
        business_name: "NY Gifting Store",
        plan: "Starter",
      },
    ]

    const supabase = await createClient()

    const results = []

    for (const user of defaultUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabase.from("profiles").select("*").eq("email", user.email)

      if (existingUsers && existingUsers.length > 0) {
        // Update existing user
        const passwordHash = await hashPassword(user.password)
        await supabase
          .from("profiles")
          .update({
            password_hash: passwordHash,
            role: user.role,
            name: user.name,
            business_name: user.business_name,
            plan: user.plan,
            status: "approved",
          })
          .eq("email", user.email)
        results.push({ email: user.email, status: "updated" })
      } else {
        // Create new user
        const passwordHash = await hashPassword(user.password)
        await supabase.from("profiles").insert({
          email: user.email,
          password_hash: passwordHash,
          role: user.role,
          name: user.name,
          business_name: user.business_name,
          plan: user.plan,
          status: "approved",
        })
        results.push({ email: user.email, status: "created" })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
