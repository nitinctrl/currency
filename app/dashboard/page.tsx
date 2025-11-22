"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanUpgradeBanner } from "@/components/plan-upgrade-banner"
import { AISearchBar } from "@/components/ai-search-bar"
import { FileText, Users, Package, TrendingUp, IndianRupee, Clock } from "lucide-react"
import { MOCK_INVOICES } from "@/lib/mock-data"
import { useAuth } from "@/contexts/auth-context"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const profitLossData = [
  { month: "Jan", revenue: 45000, expenses: 32000, profit: 13000 },
  { month: "Feb", revenue: 52000, expenses: 35000, profit: 17000 },
  { month: "Mar", revenue: 48000, expenses: 33000, profit: 15000 },
  { month: "Apr", revenue: 61000, expenses: 38000, profit: 23000 },
  { month: "May", revenue: 55000, expenses: 36000, profit: 19000 },
  { month: "Jun", revenue: 67000, expenses: 40000, profit: 27000 },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    totalRevenue: 0,
    pendingAmount: 0,
    totalCustomers: 0,
    overdueInvoices: 0,
  })

  const [purchaseVsSalesData, setPurchaseVsSalesData] = useState([
    { month: "Jan", purchases: 0, sales: 0 },
    { month: "Feb", purchases: 0, sales: 0 },
    { month: "Mar", purchases: 0, sales: 0 },
    { month: "Apr", purchases: 0, sales: 0 },
    { month: "May", purchases: 0, sales: 0 },
    { month: "Jun", purchases: 0, sales: 0 },
  ])

  useEffect(() => {
    if (!user) return

    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/dashboard/stats?email=${user.email}`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()

    const storedPurchaseOrders = localStorage.getItem("purchaseOrders")
    const storedInvoices = localStorage.getItem("invoices")

    if (storedPurchaseOrders || storedInvoices) {
      const purchaseOrders = storedPurchaseOrders ? JSON.parse(storedPurchaseOrders) : []
      const invoices = storedInvoices ? JSON.parse(storedInvoices) : []

      // Group by month
      const monthlyData: Record<string, { purchases: number; sales: number }> = {}
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      // Initialize all months
      months.forEach((month) => {
        monthlyData[month] = { purchases: 0, sales: 0 }
      })

      // Calculate purchases from purchase orders
      purchaseOrders.forEach((po: any) => {
        const date = new Date(po.date)
        const month = months[date.getMonth()]
        monthlyData[month].purchases += po.subtotal || 0
      })

      // Calculate sales from invoices
      invoices.forEach((inv: any) => {
        const date = new Date(inv.date)
        const month = months[date.getMonth()]
        if (inv.status === "paid") {
          monthlyData[month].sales += inv.total || 0
        }
      })

      // Convert to array for chart
      const chartData = months.slice(0, 6).map((month) => ({
        month,
        purchases: monthlyData[month].purchases,
        sales: monthlyData[month].sales,
      }))

      setPurchaseVsSalesData(chartData)
    }
  }, [user])

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview</p>
        </div>

        <PlanUpgradeBanner />

        <AISearchBar />

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{stats.paidInvoices} paid invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.pendingAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overdueInvoices > 0 && `${stats.overdueInvoices} overdue`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInvoices}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">Active customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">In inventory</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">vs last month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profit & Loss Trend</CardTitle>
              <CardDescription>Monthly revenue, expenses, and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#1e40af" strokeWidth={2} name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="#dc2626" strokeWidth={2} name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="#16a34a" strokeWidth={2} name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purchase vs Sales</CardTitle>
              <CardDescription>Monthly comparison of purchases and sales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={purchaseVsSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="purchases" fill="#ef4444" name="Purchases" />
                  <Bar dataKey="sales" fill="#1e40af" name="Sales" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>Your latest invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {MOCK_INVOICES.slice(0, 3).map((invoice) => (
                <div
                  key={invoice.id}
                  className="mb-4 flex items-center justify-between border-b pb-4 last:mb-0 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{invoice.invoiceNumber}</p>
                    <p className="text-sm text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{invoice.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">{invoice.status}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <a
                href="/dashboard/invoices/new"
                className="block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <p className="font-medium">Create New Invoice</p>
                <p className="text-sm text-muted-foreground">Generate a new invoice for your customer</p>
              </a>
              <a
                href="/dashboard/quotations/new"
                className="block rounded-lg border p-4 transition-colors hover:bg-accent"
              >
                <p className="font-medium">Create Quotation</p>
                <p className="text-sm text-muted-foreground">Send a quote to potential customers</p>
              </a>
              <a href="/dashboard/customers" className="block rounded-lg border p-4 transition-colors hover:bg-accent">
                <p className="font-medium">Add Customer</p>
                <p className="text-sm text-muted-foreground">Add a new customer to your CRM</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  )
}
