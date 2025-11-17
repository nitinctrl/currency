"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function BillingPage() {
  const payments = [
    {
      id: 1,
      organization: "Tech Solutions Ltd",
      amount: "₹2,999",
      plan: "Professional",
      status: "completed",
      method: "UPI",
      transactionId: "TXN123456789",
      date: "2024-01-10",
    },
    {
      id: 2,
      organization: "Digital Shop Inc",
      amount: "₹5,999",
      plan: "Enterprise",
      status: "completed",
      method: "Bank Transfer",
      transactionId: "TXN987654321",
      date: "2023-11-15",
    },
    {
      id: 3,
      organization: "Startup Hub",
      amount: "₹1,599",
      plan: "Starter",
      status: "pending",
      method: "UPI",
      transactionId: "TXN456789123",
      date: "2024-01-20",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <p className="text-muted-foreground mt-2">Track all payment transactions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">₹8,998</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {payments.filter(p => p.status === "completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {payments.filter(p => p.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹2,999</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Receipt className="h-5 w-5" />
                        {payment.organization}
                      </h3>
                      <p className="text-sm text-muted-foreground">{payment.plan} Plan</p>
                    </div>
                    <Badge 
                      variant={payment.status === "completed" ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {payment.status === "completed" && <CheckCircle className="h-3 w-3" />}
                      {payment.status === "pending" && <Clock className="h-3 w-3" />}
                      {payment.status === "failed" && <XCircle className="h-3 w-3" />}
                      {payment.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p className="font-medium text-primary">{payment.amount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Method:</span>
                      <p className="font-medium">{payment.method}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Transaction ID:</span>
                      <p className="font-medium">{payment.transactionId}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{payment.date}</p>
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
