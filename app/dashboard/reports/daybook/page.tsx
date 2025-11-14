"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Calendar, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DaybookPage() {
  const [selectedDate, setSelectedDate] = useState("2025-01-22")
  const [filterType, setFilterType] = useState("all")

  const transactions = [
    {
      id: 1,
      time: "09:15 AM",
      type: "Opening Balance",
      description: "Opening balance for the day",
      account: "Cash",
      debit: 150000,
      credit: 0,
      balance: 150000,
      voucher: "-",
    },
    {
      id: 2,
      time: "10:30 AM",
      type: "Sales",
      description: "Invoice INV-045 - ABC Corp",
      account: "Sales Account",
      debit: 45000,
      credit: 0,
      balance: 195000,
      voucher: "INV-045",
    },
    {
      id: 3,
      time: "11:15 AM",
      type: "Purchase",
      description: "Bill from ABC Suppliers",
      account: "Purchase Account",
      debit: 0,
      credit: 32000,
      balance: 163000,
      voucher: "BILL-123",
    },
    {
      id: 4,
      time: "12:30 PM",
      type: "Payment",
      description: "Vendor payment - XYZ Ltd",
      account: "Bank Account",
      debit: 0,
      credit: 15000,
      balance: 148000,
      voucher: "PAY-089",
    },
    {
      id: 5,
      time: "02:30 PM",
      type: "Expense",
      description: "Office Rent - January 2025",
      account: "Rent Expense",
      debit: 0,
      credit: 25000,
      balance: 123000,
      voucher: "EXP-034",
    },
    {
      id: 6,
      time: "03:45 PM",
      type: "Receipt",
      description: "Payment received from PQR Industries",
      account: "Bank Account",
      debit: 50000,
      credit: 0,
      balance: 173000,
      voucher: "REC-067",
    },
    {
      id: 7,
      time: "04:30 PM",
      type: "Expense",
      description: "Electricity Bill",
      account: "Utilities",
      debit: 0,
      credit: 8000,
      balance: 165000,
      voucher: "EXP-035",
    },
    {
      id: 8,
      time: "05:15 PM",
      type: "Sales",
      description: "Invoice INV-046 - LMN Enterprises",
      account: "Sales Account",
      debit: 35000,
      credit: 0,
      balance: 200000,
      voucher: "INV-046",
    },
  ]

  const filteredTransactions =
    filterType === "all" ? transactions : transactions.filter((t) => t.type.toLowerCase() === filterType.toLowerCase())

  const totalDebit = transactions.reduce((sum, t) => sum + t.debit, 0)
  const totalCredit = transactions.reduce((sum, t) => sum + t.credit, 0)
  const netBalance = totalDebit - totalCredit

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "sales":
      case "receipt":
        return "default"
      case "purchase":
      case "payment":
      case "expense":
        return "destructive"
      case "opening balance":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Day Book</h1>
              <p className="text-muted-foreground">Daily transaction register and cash flow</p>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-[180px]"
                />
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Opening Balance</CardDescription>
                <CardTitle className="text-2xl">₹1,50,000</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Start of day</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Receipts</CardDescription>
                <CardTitle className="text-2xl text-green-600">₹{totalDebit.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Money in</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Payments</CardDescription>
                <CardTitle className="text-2xl text-red-600">₹{totalCredit.toLocaleString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">Money out</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Closing Balance</CardDescription>
                <CardTitle className="text-2xl">₹2,00,000</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">End of day</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>Transaction Details</CardTitle>
                  <CardDescription>All transactions for {selectedDate}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transactions</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead>Voucher</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="text-xs text-muted-foreground">{txn.time}</TableCell>
                        <TableCell>
                          <Badge variant={getTypeColor(txn.type)}>{txn.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px]">{txn.description}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{txn.account}</TableCell>
                        <TableCell className="font-mono text-xs">{txn.voucher}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {txn.debit > 0 ? `₹${txn.debit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-red-600">
                          {txn.credit > 0 ? `₹${txn.credit.toLocaleString()}` : "-"}
                        </TableCell>
                        <TableCell className="text-right font-semibold">₹{txn.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-bold">
                      <TableCell colSpan={5}>Total</TableCell>
                      <TableCell className="text-right text-green-600">₹{totalDebit.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-red-600">₹{totalCredit.toLocaleString()}</TableCell>
                      <TableCell className="text-right">₹2,00,000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction Summary by Type</CardTitle>
              <CardDescription>Breakdown of transactions by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Sales</p>
                  <p className="text-2xl font-bold">₹80,000</p>
                  <p className="text-xs text-muted-foreground">2 transactions</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Purchases</p>
                  <p className="text-2xl font-bold">₹32,000</p>
                  <p className="text-xs text-muted-foreground">1 transaction</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Receipts</p>
                  <p className="text-2xl font-bold">₹50,000</p>
                  <p className="text-xs text-muted-foreground">1 transaction</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold">₹33,000</p>
                  <p className="text-xs text-muted-foreground">2 transactions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
