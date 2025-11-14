"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export default function AccountingPage() {
  const transactions = [
    {
      id: "1",
      date: "2025-01-25",
      type: "Income",
      category: "Sales",
      description: "Invoice INV-2025-001",
      amount: 106200,
      balance: 106200,
    },
    {
      id: "2",
      date: "2025-01-24",
      type: "Expense",
      category: "Purchase",
      description: "Supplier payment",
      amount: -45000,
      balance: 61200,
    },
    {
      id: "3",
      date: "2025-01-23",
      type: "Income",
      category: "Sales",
      description: "Invoice INV-2025-002",
      amount: 29500,
      balance: 90700,
    },
    {
      id: "4",
      date: "2025-01-22",
      type: "Expense",
      category: "Rent",
      description: "Office rent",
      amount: -25000,
      balance: 65700,
    },
  ]

  const accounts = [
    { name: "Cash", balance: 150000, type: "Asset" },
    { name: "Bank Account", balance: 450000, type: "Asset" },
    { name: "Accounts Receivable", balance: 280000, type: "Asset" },
    { name: "Accounts Payable", balance: 120000, type: "Liability" },
    { name: "Sales Revenue", balance: 850000, type: "Income" },
    { name: "Operating Expenses", balance: 320000, type: "Expense" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounting</h1>
          <p className="text-muted-foreground">Manage your accounts and transactions</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/accounting/new">
            <Plus className="mr-2 h-4 w-4" />
            New Transaction
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Assets</CardDescription>
            <CardTitle className="text-2xl">₹880,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +15.2% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Liabilities</CardDescription>
            <CardTitle className="text-2xl">₹120,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-red-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              -8.5% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Income</CardDescription>
            <CardTitle className="text-2xl">₹850,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 h-4 w-4" />
              +22.3% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Expenses</CardDescription>
            <CardTitle className="text-2xl">₹320,000</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-green-600">
              <TrendingDown className="mr-1 h-4 w-4" />
              -5.1% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="accounts">Chart of Accounts</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.category}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          transaction.amount > 0 ? "text-green-600" : "text-red-600",
                        )}
                      >
                        {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">₹{transaction.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chart of Accounts</CardTitle>
              <CardDescription>All your business accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((account) => (
                    <TableRow key={account.name}>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell className="text-right">₹{account.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
