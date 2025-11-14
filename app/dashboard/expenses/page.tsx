"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockExpenses = [
  { id: 1, date: "2024-01-15", category: "Office Supplies", amount: 5000, vendor: "ABC Stationery", status: "paid" },
  { id: 2, date: "2024-01-20", category: "Travel", amount: 12000, vendor: "XYZ Travels", status: "paid" },
  { id: 3, date: "2024-01-25", category: "Utilities", amount: 8000, vendor: "Power Company", status: "pending" },
  { id: 4, date: "2024-02-01", category: "Marketing", amount: 25000, vendor: "Digital Agency", status: "paid" },
]

export default function ExpensesPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [vendor, setVendor] = useState("")
  const [description, setDescription] = useState("")
  const [expenses, setExpenses] = useState(mockExpenses)

  const handleSaveExpense = () => {
    const newExpense = {
      id: Date.now(),
      date,
      category,
      amount: Number.parseFloat(amount),
      vendor,
      description,
      status: "pending",
    }

    const existing = JSON.parse(localStorage.getItem("expenses") || "[]")
    const updated = [...existing, newExpense]
    localStorage.setItem("expenses", JSON.stringify(updated))

    setExpenses([...expenses, newExpense])

    // Reset form
    setDate(new Date().toISOString().split("T")[0])
    setCategory("")
    setAmount("")
    setVendor("")
    setDescription("")
    setShowAddForm(false)
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Expenses</h1>
              <p className="text-muted-foreground">Track and manage your business expenses</p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>

          {showAddForm && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Expense</CardTitle>
                <CardDescription>Record a new business expense</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expense-date">Date</Label>
                    <Input id="expense-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="expense-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office Supplies</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="salary">Salary</SelectItem>
                        <SelectItem value="rent">Rent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-vendor">Vendor</Label>
                    <Input
                      id="expense-vendor"
                      placeholder="Vendor name"
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="expense-description">Description</Label>
                    <Input
                      id="expense-description"
                      placeholder="Expense description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleSaveExpense} disabled={!category || !amount || !vendor}>
                    Save Expense
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Expense List</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search expenses..." className="pl-10 w-[250px]" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                      <TableCell>{expense.category}</TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell className="font-semibold">₹{expense.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={expense.status === "paid" ? "default" : "secondary"}>{expense.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
