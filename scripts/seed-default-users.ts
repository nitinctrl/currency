import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function seedDefaultUsers() {
  console.log("Starting to seed default users...")

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

  for (const user of defaultUsers) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.admin.listUsers()
      const userExists = existingUser?.users.find((u) => u.email === user.email)

      if (userExists) {
        console.log(`User ${user.email} already exists, skipping...`)
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
        console.error(`Error creating user ${user.email}:`, authError)
        continue
      }

      console.log(`✓ Created user: ${user.email} with role: ${user.role}`)

      // Update profile with additional details
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            business_name: user.business_name,
            status: "approved",
            plan: user.role === "superadmin" ? "Enterprise" : "Starter",
          })
          .eq("id", authData.user.id)

        if (profileError) {
          console.error(`Error updating profile for ${user.email}:`, profileError)
        } else {
          console.log(`✓ Updated profile for: ${user.email}`)
        }
      }
    } catch (error) {
      console.error(`Failed to create user ${user.email}:`, error)
    }
  }

  console.log("Default users seeding completed!")
}

seedDefaultUsers()
