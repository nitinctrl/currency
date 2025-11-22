import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch stats using Supabase
    // We can use .count() for totals to avoid fetching all data if we just need the count
    // But for revenue we need the data.

    const { data: invoices, error: invoicesError } = await supabase.from("invoices").select("*").eq("user_id", user.id)

    if (invoicesError) throw invoicesError

    const { count: totalCustomers, error: customersError } = await supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (customersError) throw customersError

    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter((inv) => inv.status === "paid").length

    // Note: Ensure total_amount is a number or can be converted
    const totalRevenue = invoices
      .filter((inv) => inv.status === "paid")
      .reduce((sum, inv) => sum + (Number(inv.total) || Number(inv.total_amount) || 0), 0)

    const pendingAmount = invoices
      .filter((inv) => inv.status === "sent" || inv.status === "overdue")
      .reduce((sum, inv) => sum + (Number(inv.total) || Number(inv.total_amount) || 0), 0)

    const overdueInvoices = invoices.filter((inv) => inv.status === "overdue").length

    return NextResponse.json({
      totalInvoices,
      paidInvoices,
      totalRevenue,
      pendingAmount,
      totalCustomers: totalCustomers || 0,
      overdueInvoices,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
