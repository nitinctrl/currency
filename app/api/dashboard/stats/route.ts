import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const users = await sql`SELECT id FROM profiles WHERE email = ${email}`
    const user = users[0]

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Fetch stats
    const invoices = await sql`SELECT * FROM invoices WHERE user_id = ${user.id}`
    const customers = await sql`SELECT * FROM customers WHERE user_id = ${user.id}`

    const totalInvoices = invoices.length
    const paidInvoices = invoices.filter((inv: any) => inv.status === "paid").length
    const totalRevenue = invoices
      .filter((inv: any) => inv.status === "paid")
      .reduce((sum: number, inv: any) => sum + Number(inv.total_amount), 0)

    const pendingAmount = invoices
      .filter((inv: any) => inv.status === "sent" || inv.status === "overdue")
      .reduce((sum: number, inv: any) => sum + Number(inv.total_amount), 0)

    const overdueInvoices = invoices.filter((inv: any) => inv.status === "overdue").length

    return NextResponse.json({
      totalInvoices,
      paidInvoices,
      totalRevenue,
      pendingAmount,
      totalCustomers: customers.length,
      overdueInvoices,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
