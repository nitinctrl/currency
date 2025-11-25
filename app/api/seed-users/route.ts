import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hashPassword } from "@/lib/auth-neon"

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

    const results = []

    for (const user of defaultUsers) {
      // Check if user already exists
      const existingUsers = await sql`SELECT * FROM profiles WHERE email = ${user.email}`

      if (existingUsers.length > 0) {
        // Update existing user
        const passwordHash = await hashPassword(user.password)
        await sql`
          UPDATE profiles 
          SET password_hash = ${passwordHash}, 
              role = ${user.role}, 
              full_name = ${user.name}, 
              business_name = ${user.business_name},
              plan = ${user.plan},
              status = 'approved'
          WHERE email = ${user.email}
        `
        results.push({ email: user.email, status: "updated" })
      } else {
        // Create new user
        const passwordHash = await hashPassword(user.password)
        await sql`
          INSERT INTO profiles (email, password_hash, role, full_name, business_name, plan, status)
          VALUES (${user.email}, ${passwordHash}, ${user.role}, ${user.name}, ${user.business_name}, ${user.plan}, 'approved')
        `
        results.push({ email: user.email, status: "created" })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error seeding users:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
