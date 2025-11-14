"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"

export default function SettlementsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const settlements = [
    {
      id: "SET-001",
      date: "2024-01-20",
      amount: 125000,
      transactions: 8,
      status: "completed",
      bankAccount: "****4567",
    },
    { id: "SET-002", date: "2024-01-15", amount: 98000, transactions: 6, status: "completed", bankAccount: "****4567" },
    {
      id: "SET-003",
      date: "2024-01-10",
      amount: 156000,
      transactions: 12,
      status: "completed",
      bankAccount: "****4567",
    },
    { id: "SET-004", date: "2024-01-22", amount: 45000, transactions: 3, status: "pending", bankAccount: "****4567" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settlements</h1>
          <p className="text-muted-foreground">Track payment settlements to your bank account</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Settled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3,79,000</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,000</div>
            <p className="text-xs text-muted-foreground">3 transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Settlement Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2-3 days</div>
            <p className="text-xs text-muted-foreground">Business days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search settlements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settlements.map((settlement) => (
              <div key={settlement.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{settlement.id}</p>
                    <Badge variant={settlement.status === "completed" ? "default" : "secondary"}>
                      {settlement.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {settlement.transactions} transactions • Bank: {settlement.bankAccount}
                  </p>
                  <p className="text-xs text-muted-foreground">{settlement.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{settlement.amount.toLocaleString()}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
