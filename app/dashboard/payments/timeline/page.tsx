"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, XCircle } from "lucide-react"

export default function PaymentTimelinePage() {
  const timeline = [
    {
      id: 1,
      date: "2024-01-22",
      time: "10:30 AM",
      type: "received",
      amount: 45000,
      customer: "Acme Corp",
      invoice: "INV-045",
      method: "UPI",
    },
    {
      id: 2,
      date: "2024-01-22",
      time: "09:15 AM",
      type: "pending",
      amount: 32000,
      customer: "Tech Solutions",
      invoice: "INV-046",
      method: "Bank Transfer",
    },
    {
      id: 3,
      date: "2024-01-21",
      time: "04:45 PM",
      type: "received",
      amount: 28000,
      customer: "Global Enterprises",
      invoice: "INV-044",
      method: "Cash",
    },
    {
      id: 4,
      date: "2024-01-21",
      time: "02:20 PM",
      type: "failed",
      amount: 15000,
      customer: "StartUp Inc",
      invoice: "INV-043",
      method: "Card",
    },
    {
      id: 5,
      date: "2024-01-20",
      time: "11:00 AM",
      type: "received",
      amount: 67000,
      customer: "Enterprise Co",
      invoice: "INV-042",
      method: "UPI",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment Timeline</h1>
        <p className="text-muted-foreground">Track all payment activities in chronological order</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Received Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹77,000</div>
            <p className="text-xs text-muted-foreground">2 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹32,000</div>
            <p className="text-xs text-muted-foreground">1 transaction</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹15,000</div>
            <p className="text-xs text-muted-foreground">1 transaction</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
            {timeline.map((item) => (
              <div key={item.id} className="relative flex gap-4">
                <div className="relative z-10">
                  {item.type === "received" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                  {item.type === "pending" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                      <Clock className="h-4 w-4 text-yellow-600" />
                    </div>
                  )}
                  {item.type === "failed" && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <XCircle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-1 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{item.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.invoice} • {item.method}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                      <Badge
                        variant={
                          item.type === "received" ? "default" : item.type === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {item.date} at {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
