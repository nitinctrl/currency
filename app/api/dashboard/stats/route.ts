import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: user } = await supabase.from("profiles").select("id").eq("email", email).single()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch stats
    const { data: invoices } = await supabase.from("invoices").select("*").eq("user_id", user.id)

    const { data: customers } = await supabase.from("customers").select("*").eq("user_id", user.id)

    const totalInvoices = invoices?.length || 0
    const paidInvoices = invoices?.filter((inv) => inv.status === "paid").length || 0
    const totalRevenue =
      invoices?.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

    const pendingAmount =
      invoices
        ?.filter((inv) => inv.status === "sent" || inv.status === "overdue")
        .reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0

    const overdueInvoices = invoices?.filter((inv) => inv.status === "overdue").length || 0

    return NextResponse.json({
      totalInvoices,
      paidInvoices,
      totalRevenue,
      pendingAmount,
      totalCustomers: customers?.length || 0,
      overdueInvoices,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
