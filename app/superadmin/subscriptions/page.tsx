"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Users, Calendar } from 'lucide-react'

export default function SubscriptionsPage() {
  const subscriptions = [
    {
      id: 1,
      organization: "Tech Solutions Ltd",
      plan: "Professional",
      price: "₹2,999",
      status: "active",
      startDate: "2024-01-10",
      endDate: "2025-01-10",
      autoRenew: true,
    },
    {
      id: 2,
      organization: "Digital Shop Inc",
      plan: "Enterprise",
      price: "₹5,999",
      status: "active",
      startDate: "2023-11-15",
      endDate: "2024-11-15",
      autoRenew: true,
    },
    {
      id: 3,
      organization: "Startup Hub",
      plan: "Starter",
      price: "₹1,599",
      status: "trial",
      startDate: "2024-01-20",
      endDate: "2024-04-20",
      autoRenew: false,
    },
  ]

  const stats = {
    totalRevenue: subscriptions.reduce((sum, sub) => 
      sum + Number.parseInt(sub.price.replace(/[₹,]/g, '')), 0
    ),
    activeSubscriptions: subscriptions.filter(s => s.status === "active").length,
    trialSubscriptions: subscriptions.filter(s => s.status === "trial").length,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-muted-foreground mt-2">Monitor all active subscriptions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Monthly recurring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <Users className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">Paying customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Trial Users</CardTitle>
            <TrendingUp className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.trialSubscriptions}</div>
            <p className="text-xs text-muted-foreground mt-1">Free trials</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {subscriptions.map((sub) => (
          <Card key={sub.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{sub.organization}</h3>
                      <p className="text-sm text-muted-foreground">{sub.plan} Plan</p>
                    </div>
                    <Badge variant={sub.status === "active" ? "default" : "secondary"}>
                      {sub.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <p className="font-medium text-primary">{sub.price}/year</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Start Date:</span>
                      <p className="font-medium">{sub.startDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">End Date:</span>
                      <p className="font-medium">{sub.endDate}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Auto Renew:</span>
                      <p className="font-medium">{sub.autoRenew ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
