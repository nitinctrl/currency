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
import { ArrowLeft, Plus, Trash2, Printer, Save } from 'lucide-react'
import { getUser } from "@/lib/auth"
import type { Invoice, InvoiceItem } from "@/lib/types"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
]

export default function NewInvoicePage() {
  const router = useRouter()
  const user = getUser()

  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    customerId: "",
    date: today,
    dueDate: today,
    notes: "",
    privateNotes: "",
    referenceNumber: "",
    salesPersonName: "",
    salesPersonId: "",
    category: "",
    globalDiscount: 0,
    currency: "INR",
    additionalCharges: {
      freight: 0,
      packaging: 0,
      miscellaneous: 0,
    },
  })

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      taxRate: 18,
      amount: 0,
      grm: 0,
      weight: "",
      modelNumber: "",
      hsnCode: "",
      discount: 0,
    },
  ])

  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false)
  const [newCustomerData, setNewCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

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
        grm: 0,
        weight: "",
        modelNumber: "",
        hsnCode: "",
        discount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "rate" || field === "discount") {
            const baseAmount = updated.quantity * updated.rate
            const discountAmount = baseAmount * ((updated.discount || 0) / 100)
            updated.amount = baseAmount - discountAmount
          }
          return updated
        }
        return item
      }),
    )
  }

  const applyGlobalDiscount = () => {
    setItems(
      items.map((item) => ({
        ...item,
        discount: formData.globalDiscount,
        amount: item.quantity * item.rate * (1 - formData.globalDiscount / 100),
      })),
    )
  }

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = items.reduce((sum, item) => sum + (item.amount * item.taxRate) / 100, 0)
    const additionalTotal =
      (formData.additionalCharges.freight || 0) +
      (formData.additionalCharges.packaging || 0) +
      (formData.additionalCharges.miscellaneous || 0)
    const total = subtotal + taxAmount + additionalTotal
    return { subtotal, taxAmount, additionalTotal, total }
  }

  const handleSubmit = (e: React.FormEvent, status: "draft" | "sent" = "draft", shouldPrint = false) => {
    e.preventDefault()
    if (!user) return

    console.log("[v0] Starting invoice submission")
    console.log("[v0] Form data:", formData)
    console.log("[v0] Items:", items)
    console.log("[v0] User:", user)

    const { subtotal, taxAmount, total } = calculateTotals()

    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      userId: user.id,
      customerId: formData.customerId,
      date: formData.date,
      dueDate: formData.dueDate,
      status,
      items,
      subtotal,
      taxAmount,
      total,
      notes: formData.notes,
      privateNotes: formData.privateNotes,
      referenceNumber: formData.referenceNumber,
      salesPersonName: formData.salesPersonName,
      salesPersonId: formData.salesPersonId,
      category: formData.category,
      globalDiscount: formData.globalDiscount,
      currency: formData.currency,
      additionalCharges: formData.additionalCharges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    console.log("[v0] Created invoice object:", newInvoice)
    console.log("[v0] Invoice ID:", newInvoice.id)
    console.log("[v0] Customer ID:", newInvoice.customerId)

    if (!newInvoice.customerId) {
      console.error("[v0] ERROR: Customer ID is missing!")
      alert("Please select a customer before saving the invoice")
      return
    }

    const storedInvoices = localStorage.getItem("invoices")
    const allInvoices = storedInvoices ? JSON.parse(storedInvoices) : []

    console.log("[v0] Existing invoices count:", allInvoices.length)

    allInvoices.push(newInvoice)
    localStorage.setItem("invoices", JSON.stringify(allInvoices))

    console.log("[v0] Invoice saved to localStorage")
    console.log("[v0] Total invoices now:", allInvoices.length)

    if (shouldPrint) {
      console.log("[v0] Triggering print dialog")
      window.print()
    }

    console.log("[v0] Redirecting to invoices list")
    router.push("/dashboard/invoices")
  }

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          const quantity = item.quantity || 1
          const rate = product.price
          const baseAmount = quantity * rate
          const discountAmount = baseAmount * ((item.discount || 0) / 100)
          return {
            ...item,
            description: product.name,
            rate: product.price,
            taxRate: product.taxRate,
            hsnCode: product.hsn || "",
            amount: baseAmount - discountAmount,
          }
        }
        return item
      }),
    )
  }

  const handleAddNewCustomer = () => {
    if (!user) return
    
    const newContact = {
      id: Date.now().toString(),
      userId: user.id,
      type: "customer" as const,
      ...newCustomerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const storedContacts = localStorage.getItem("contacts")
    const allContacts = storedContacts ? JSON.parse(storedContacts) : []
    allContacts.push(newContact)
    localStorage.setItem("contacts", JSON.stringify(allContacts))

    setCustomers([...customers, newContact])
    setFormData({ ...formData, customerId: newContact.id })
    setShowNewCustomerDialog(false)
    setNewCustomerData({
      name: "",
      email: "",
      phone: "",
      company: "",
      gstin: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    })

    toast({
      title: "Success!",
      description: "Customer added successfully",
    })
  }

  const getCurrentCurrencySymbol = () => {
    return CURRENCIES.find((c) => c.code === formData.currency)?.symbol || "₹"
  }

  const { subtotal, taxAmount, additionalTotal, total } = calculateTotals()

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create Invoice</h1>
              <p className="text-muted-foreground">Generate a new invoice for your customer</p>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Invoice Details</CardTitle>
                    <CardDescription>Basic invoice information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customerId">Customer</Label>
                        <div className="flex gap-2">
                          <Select
                            value={formData.customerId}
                            onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                            required
                          >
                            <SelectTrigger id="customerId" className="flex-1">
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
                          <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
                            <DialogTrigger asChild>
                              <Button type="button" size="icon" variant="outline">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Add New Customer</DialogTitle>
                                <DialogDescription>
                                  Add customer details directly from this form
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerName">Full Name *</Label>
                                    <Input
                                      id="newCustomerName"
                                      placeholder="John Doe"
                                      value={newCustomerData.name}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, name: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerCompany">Company Name</Label>
                                    <Input
                                      id="newCustomerCompany"
                                      placeholder="Acme Corporation"
                                      value={newCustomerData.company}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, company: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerEmail">Email *</Label>
                                    <Input
                                      id="newCustomerEmail"
                                      type="email"
                                      placeholder="john@example.com"
                                      value={newCustomerData.email}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, email: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerPhone">Phone *</Label>
                                    <Input
                                      id="newCustomerPhone"
                                      placeholder="+91 98765 43210"
                                      value={newCustomerData.phone}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, phone: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="newCustomerGstin">GSTIN</Label>
                                    <Input
                                      id="newCustomerGstin"
                                      placeholder="29ABCDE1234F1Z5"
                                      value={newCustomerData.gstin}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, gstin: e.target.value })}
                                      maxLength={15}
                                    />
                                  </div>
                                  <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="newCustomerAddress">Address</Label>
                                    <Input
                                      id="newCustomerAddress"
                                      placeholder="123 Business Park"
                                      value={newCustomerData.address}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, address: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerCity">City</Label>
                                    <Input
                                      id="newCustomerCity"
                                      placeholder="Mumbai"
                                      value={newCustomerData.city}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, city: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerState">State</Label>
                                    <Input
                                      id="newCustomerState"
                                      placeholder="Maharashtra"
                                      value={newCustomerData.state}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, state: e.target.value })}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="newCustomerPincode">Pincode</Label>
                                    <Input
                                      id="newCustomerPincode"
                                      placeholder="400001"
                                      value={newCustomerData.pincode}
                                      onChange={(e) => setNewCustomerData({ ...newCustomerData, pincode: e.target.value })}
                                      maxLength={6}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowNewCustomerDialog(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={handleAddNewCustomer}
                                    disabled={!newCustomerData.name || !newCustomerData.email || !newCustomerData.phone}
                                  >
                                    Add Customer
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
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
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Invoice Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referenceNumber">Reference / PO Number</Label>
                        <Input
                          id="referenceNumber"
                          placeholder="PO-2024-001"
                          value={formData.referenceNumber}
                          onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salesPersonName">Sales Person Name</Label>
                        <Input
                          id="salesPersonName"
                          placeholder="John Doe"
                          value={formData.salesPersonName}
                          onChange={(e) => setFormData({ ...formData, salesPersonName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salesPersonId">Sales Person ID</Label>
                        <Input
                          id="salesPersonId"
                          placeholder="SP-001"
                          value={formData.salesPersonId}
                          onChange={(e) => setFormData({ ...formData, salesPersonId: e.target.value })}
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
                    <div className="flex items-center gap-4 rounded-lg border bg-muted/50 p-4">
                      <div className="flex-1 space-y-2">
                        <Label htmlFor="globalDiscount">Apply Discount % to All Items</Label>
                        <Input
                          id="globalDiscount"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0"
                          value={formData.globalDiscount}
                          onChange={(e) => setFormData({ ...formData, globalDiscount: Number(e.target.value) })}
                        />
                      </div>
                      <Button type="button" onClick={applyGlobalDiscount} className="mt-8">
                        Apply to All
                      </Button>
                    </div>

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
                        <div className="grid gap-4 md:grid-cols-4">
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
                          <div className="md:col-span-2 space-y-2">
                            <Label>Description</Label>
                            <Input
                              placeholder="Product or service"
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>HSN Code</Label>
                            <Input
                              placeholder="8471"
                              value={item.hsnCode}
                              onChange={(e) => updateItem(item.id, "hsnCode", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Model Number</Label>
                            <Input
                              placeholder="MOD-123"
                              value={item.modelNumber}
                              onChange={(e) => updateItem(item.id, "modelNumber", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Quantity</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Rate</Label>
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
                            <Label>Weight (GRM)</Label>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={item.grm}
                              onChange={(e) => updateItem(item.id, "grm", Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Weight (Unit)</Label>
                            <Input
                              placeholder="1 kg"
                              value={item.weight}
                              onChange={(e) => updateItem(item.id, "weight", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Discount (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={item.discount}
                              onChange={(e) => updateItem(item.id, "discount", Number(e.target.value))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Tax Rate (%)</Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={item.taxRate}
                              onChange={(e) => updateItem(item.id, "taxRate", Number(e.target.value))}
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
                    <CardTitle>Additional Charges</CardTitle>
                    <CardDescription>Add freight, packaging, or other charges</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="freight">Freight Charges</Label>
                        <Input
                          id="freight"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          value={formData.additionalCharges.freight}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additionalCharges: {
                                ...formData.additionalCharges,
                                freight: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="packaging">Packaging Charges</Label>
                        <Input
                          id="packaging"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          value={formData.additionalCharges.packaging}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additionalCharges: {
                                ...formData.additionalCharges,
                                packaging: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="miscellaneous">Miscellaneous Charges</Label>
                        <Input
                          id="miscellaneous"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0"
                          value={formData.additionalCharges.miscellaneous}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additionalCharges: {
                                ...formData.additionalCharges,
                                miscellaneous: Number(e.target.value),
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Customer Notes</CardTitle>
                    <CardDescription>Notes visible to customer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Payment terms, thank you note, etc."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Private Team Notes</CardTitle>
                    <CardDescription>Internal notes (not visible to customer)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Internal notes for your team..."
                      value={formData.privateNotes}
                      onChange={(e) => setFormData({ ...formData, privateNotes: e.target.value })}
                      rows={3}
                    />
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
                    {additionalTotal > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Additional Charges</span>
                        <span>{getCurrentCurrencySymbol()}{additionalTotal.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t pt-4 text-lg font-bold">
                      <span>Total</span>
                      <span>{getCurrentCurrencySymbol()}{total.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button type="button" className="w-full" variant="secondary" onClick={(e) => handleSubmit(e, "sent")}>
                    Save Only
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={(e) => handleSubmit(e, "sent", true)}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Save and Print
                  </Button>
                  <Button type="button" variant="ghost" className="w-full" onClick={() => router.back()}>
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
