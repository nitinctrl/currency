"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lightbulb, TrendingUp, Users, AlertCircle, ArrowRight } from "lucide-react"
import { getUser } from "@/lib/auth"

export function DashboardInsights() {
  const [metrics, setMetrics] = useState({
    leads: [] as any[],
    expectedRevenue30: 0,
    expectedRevenue90: 0,
    conversionRate: 0,
    suggestions: [] as string[],
  })

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const quotations = JSON.parse(localStorage.getItem("quotations") || "[]")
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const contacts = JSON.parse(localStorage.getItem("contacts") || "[]")

    const userQuotations = quotations.filter((q: any) => q.userId === user.id)
    const userInvoices = invoices.filter((i: any) => i.userId === user.id)
    const userContacts = contacts.filter((c: any) => c.userId === user.id)

    // Top Leads Logic (Mock scoring based on recency)
    // In a real app, this would use engagement metrics
    const leads = userContacts
      .filter((c: any) => c.type === "lead" || c.type === "prospect")
      .slice(0, 5)
      .map((c: any) => ({
        ...c,
        score: Math.floor(Math.random() * 40) + 60, // Mock score 60-100
      }))
      .sort((a: any, b: any) => b.score - a.score)

    // Expected Revenue
    // Sum of open quotations valid for next 30/90 days
    const now = new Date()
    const day30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    const day90 = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

    const revenue30 = userQuotations
      .filter((q: any) => q.status === "sent" && new Date(q.validUntil) <= day30)
      .reduce((sum: number, q: any) => sum + (q.total || 0), 0)

    const revenue90 = userQuotations
      .filter((q: any) => q.status === "sent" && new Date(q.validUntil) <= day90)
      .reduce((sum: number, q: any) => sum + (q.total || 0), 0)

    // Conversion Rate
    // Paid Invoices / Total Quotations (simplified)
    const paidInvoicesCount = userInvoices.filter((i: any) => i.status === "paid").length
    const totalQuotationsCount = userQuotations.length || 1
    const rate = Math.round((paidInvoicesCount / totalQuotationsCount) * 100)

    // Suggested Actions
    const suggestions = []
    if (userQuotations.filter((q: any) => q.status === "draft").length > 2) {
      suggestions.push("You have draft quotations waiting to be sent.")
    }
    if (userInvoices.filter((i: any) => i.status === "overdue").length > 0) {
      suggestions.push("Follow up on overdue invoices to improve cash flow.")
    }
    if (leads.length === 0) {
      suggestions.push("Add new leads to your CRM to start tracking opportunities.")
    } else {
      suggestions.push(`Follow up with ${leads[0].name}, your top lead.`)
    }

    setMetrics({
      leads,
      expectedRevenue30: revenue30,
      expectedRevenue90: revenue90,
      conversionRate: rate,
      suggestions: suggestions.slice(0, 3),
    })
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {/* Top Leads */}
      <Card className="col-span-2 lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Top Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          {metrics.leads.length > 0 ? (
            <div className="space-y-4">
              {metrics.leads.slice(0, 3).map((lead, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm font-medium">{lead.name}</span>
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{lead.score}%</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">No active leads found.</p>
          )}
        </CardContent>
      </Card>

      {/* Expected Revenue */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Expected Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{metrics.expectedRevenue30.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Next 30 days</p>
          <div className="mt-3 pt-3 border-t">
            <div className="text-lg font-semibold">₹{metrics.expectedRevenue90.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Next 90 days</p>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
          <p className="text-xs text-muted-foreground">Quotation to Invoice</p>
          <Progress value={metrics.conversionRate} className="mt-3 h-2" />
        </CardContent>
      </Card>

      {/* Suggested Actions */}
      <Card className="col-span-2 lg:col-span-1 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Suggested Actions</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.suggestions.map((suggestion, i) => (
              <div key={i} className="flex gap-2 text-sm text-blue-700 dark:text-blue-300">
                <ArrowRight className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
