import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

const users = [
  {
    email: "admin@bizacc.in",
    password: "123456",
    name: "Super Admin",
    role: "superadmin",
    plan: "Enterprise",
  },
  {
    email: "wildknot01@gmail.com",
    password: "123456",
    name: "Admin User",
    role: "admin",
    plan: "Pro",
  },
  {
    email: "nygifting@gmail.com",
    password: "123456",
    name: "Regular User",
    role: "user",
    plan: "Free",
  },
]

async function createUsers() {
  console.log("🚀 Creating users in Supabase Auth...")

  for (const user of users) {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

      if (authError) {
        console.error(`❌ Auth error (${user.email}):`, authError.message)
        continue
      }

      console.log(`✅ Auth user created: ${user.email}`)

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: authData.user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: "approved",
            plan: user.plan,
          },
          { onConflict: "id" }
        )

      if (profileError) {
        console.error(`❌ Profile error (${user.email}):`, profileError.message)
      } else {
        console.log(`✅ Profile created: ${user.email}`)
      }
    } catch (err) {
      console.error(`❌ Unexpected error (${user.email}):`, err)
    }
  }

  console.log("🎉 User creation completed!")
}

createUsers()
