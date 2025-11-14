"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react'
import { getUser } from "@/lib/auth"

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
]

export default function NewQuotationPage() {
  const router = useRouter()
  const user = getUser()

  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    customerId: "",
    date: today,
    validUntil: today,
    notes: "",
    privateNotes: "",
    referenceNumber: "",
    salesPersonName: "",
    category: "",
    currency: "INR",
  })

  const [items, setItems] = useState([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0,
    },
  ])

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const customerContacts = allContacts.filter((c: any) => c.type === "customer")
      setCustomers(customerContacts)
    }

    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts)
      setProducts(allProducts)
    }
  }, [])

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        taxRate: 18,
        amount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate
          }
          return updated
        }
        return item
      }),
    )
  }

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const quantity = item.quantity || 1
          const rate = product.price
          return {
            ...item,
            description: product.name,
            rate: product.price,
            taxRate: product.taxRate,
            amount: quantity * rate,
          }
        }
        return item
      }),
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.amount * item.taxRate) / 100, 0)
    const total = subtotal + taxAmount
    return { subtotal, taxAmount, total }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const { subtotal, taxAmount, total } = calculateTotals()

    const newQuotation = {
      id: Date.now().toString(),
      quotationNumber: `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      userId: user.id,
      ...formData,
      items,
      subtotal,
      taxAmount,
      total,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const storedQuotations = localStorage.getItem("quotations")
    const allQuotations = storedQuotations ? JSON.parse(storedQuotations) : []
    allQuotations.push(newQuotation)
    localStorage.setItem("quotations", JSON.stringify(allQuotations))

    router.push("/dashboard/quotations")
  }

  const { subtotal, taxAmount, total } = calculateTotals()

  const getCurrentCurrencySymbol = () => {
    return CURRENCIES.find((c) => c.code === formData.currency)?.symbol || "₹"
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create Quotation</h1>
              <p className="text-muted-foreground">Generate a new quotation for your customer</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quotation Details</CardTitle>
                    <CardDescription>Basic quotation information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customerId">Customer *</Label>
                        <Select
                          value={formData.customerId}
                          onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                          required
                        >
                          <SelectTrigger id="customerId">
                            <SelectValue placeholder="Select customer" />
                          </SelectTrigger>
                          <SelectContent>
                            {customers.length === 0 ? (
                              <SelectItem value="none" disabled>
                                No customers found. Add a customer first.
                              </SelectItem>
                            ) : (
                              customers.map((customer) => (
                                <SelectItem key={customer.id} value={customer.id}>
                                  {customer.name} {customer.company ? `(${customer.company})` : ""}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="products">Products</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                            <SelectItem value="consulting">Consulting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Quotation Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="validUntil">Valid Until *</Label>
                        <Input
                          id="validUntil"
                          type="date"
                          value={formData.validUntil}
                          onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referenceNumber">Reference Number</Label>
                        <Input
                          id="referenceNumber"
                          placeholder="REF-2024-001"
                          value={formData.referenceNumber}
                          onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salesPersonName">Sales Person</Label>
                        <Input
                          id="salesPersonName"
                          placeholder="John Doe"
                          value={formData.salesPersonName}
                          onChange={(e) => setFormData({ ...formData, salesPersonName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select
                          value={formData.currency}
                          onValueChange={(value) => setFormData({ ...formData, currency: value })}
                        >
                          <SelectTrigger id="currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.symbol} {currency.name} ({currency.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Line Items</CardTitle>
                        <CardDescription>Add products or services</CardDescription>
                      </div>
                      <Button type="button" size="sm" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item, index) => (
                      <div key={item.id} className="space-y-4 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Item {index + 1}</span>
                          {items.length > 1 && (
                            <Button type="button" size="sm" variant="ghost" onClick={() => removeItem(item.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-5">
                          <div className="md:col-span-2 space-y-2">
                            <Label>Select Product</Label>
                            <Select onValueChange={(value) => handleProductSelect(item.id, value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Choose from products" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.length === 0 ? (
                                  <SelectItem value="none" disabled>
                                    No products found
                                  </SelectItem>
                                ) : (
                                  products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                      {product.name} - ₹{product.price.toLocaleString()}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="md:col-span-3 space-y-2">
                            <Label>Description *</Label>
                            <Input
                              placeholder="Product or service"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Rate *</Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.rate}
                              onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Amount</Label>
                            <Input value={`${getCurrentCurrencySymbol()}${item.amount.toLocaleString()}`} disabled />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notes</CardTitle>
                    <CardDescription>Additional information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Customer Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Terms and conditions, payment details..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="privateNotes">Private Team Notes</Label>
                      <Textarea
                        id="privateNotes"
                        placeholder="Internal notes (not visible to customer)..."
                        value={formData.privateNotes}
                        onChange={(e) => setFormData({ ...formData, privateNotes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{getCurrentCurrencySymbol()}{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{getCurrentCurrencySymbol()}{taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-4 text-lg font-bold">
                      <span>Total</span>
                      <span>{getCurrentCurrencySymbol()}{total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Quotation
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
