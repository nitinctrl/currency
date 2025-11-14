"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, CheckCircle2, AlertCircle } from "lucide-react"

export default function BankReconciliationPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const transactions = [
    {
      id: 1,
      date: "2024-01-20",
      description: "Payment from Acme Corp",
      bookAmount: 45000,
      bankAmount: 45000,
      matched: true,
    },
    { id: 2, date: "2024-01-19", description: "Bank Charges", bookAmount: 0, bankAmount: 500, matched: false },
    {
      id: 3,
      date: "2024-01-18",
      description: "Payment to Vendor",
      bookAmount: 32000,
      bankAmount: 32000,
      matched: true,
    },
    { id: 4, date: "2024-01-17", description: "Interest Credit", bookAmount: 0, bankAmount: 250, matched: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bank Reconciliation</h1>
          <p className="text-muted-foreground">Match your books with bank statements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Statement
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Book Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,45,000</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,45,750</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unmatched</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div className="flex items-center gap-4">
                  {txn.matched ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{txn.description}</p>
                    <p className="text-xs text-muted-foreground">{txn.date}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Books</p>
                      <p className="font-semibold">₹{txn.bookAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bank</p>
                      <p className="font-semibold">₹{txn.bankAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  {!txn.matched && (
                    <Button variant="outline" size="sm">
                      Match
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
