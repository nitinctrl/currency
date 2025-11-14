"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, TrendingUp, TrendingDown } from "lucide-react"

export default function ProfitLossPage() {
  const [period, setPeriod] = useState("jan-2025")
  const [revenue, setRevenue] = useState(0)
  const [expenses, setExpenses] = useState(0)

  useEffect(() => {
    // Calculate revenue from invoices
    const invoices = localStorage.getItem("invoices")
    if (invoices) {
      const allInvoices = JSON.parse(invoices)
      const totalRevenue = allInvoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0)
      setRevenue(totalRevenue)
    }

    // Calculate expenses from purchases
    const purchases = localStorage.getItem("purchaseOrders")
    if (purchases) {
      const allPurchases = JSON.parse(purchases)
      const totalExpenses = allPurchases.reduce((sum: number, po: any) => sum + (po.amount || 0), 0)
      setExpenses(totalExpenses)
    }
  }, [period])

  const grossProfit = revenue - expenses
  const profitMargin = revenue > 0 ? ((grossProfit / revenue) * 100).toFixed(2) : "0.00"

  const handleDownload = () => {
    alert(`Downloading Profit & Loss report for ${period}`)
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Profit & Loss Statement</h1>
              <p className="text-muted-foreground">Financial performance overview</p>
            </div>
            <div className="flex gap-2">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan-2025">January 2025</SelectItem>
                  <SelectItem value="feb-2025">February 2025</SelectItem>
                  <SelectItem value="mar-2025">March 2025</SelectItem>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="fy-2024">FY 2024</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{revenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From invoices</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">₹{expenses.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">From purchases</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                {grossProfit >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ₹{grossProfit.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Profit margin: {profitMargin}%</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Statement</CardTitle>
              <CardDescription>Income and expenses breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-green-600">Revenue</h3>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span>Sales Revenue</span>
                    <span className="font-semibold">₹{revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total Revenue</span>
                    <span className="text-green-600">₹{revenue.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-red-600">Expenses</h3>
                <div className="space-y-2 rounded-lg border p-4">
                  <div className="flex justify-between">
                    <span>Cost of Goods Sold</span>
                    <span className="font-semibold">₹{expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Operating Expenses</span>
                    <span className="font-semibold">₹0</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold">
                    <span>Total Expenses</span>
                    <span className="text-red-600">₹{expenses.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border-2 border-primary bg-primary/5 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Net Profit/Loss</h3>
                    <p className="text-sm text-muted-foreground">For the period {period}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      ₹{grossProfit.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Margin: {profitMargin}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
