"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, Trash2, Save, Send } from 'lucide-react'
import { getUser } from "@/lib/auth"

export default function NewQuotationPage() {
  const router = useRouter()
  const user = getUser()

  const [customers, setCustomers] = useState<any[]>([])
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false)
  
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    customerId: "",
    quotationDate: today,
    validUntil: today,
    notes: "",
    companyName: "BizAcc",
    companyLogo: "",
  })

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    gstin: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  const [items, setItems] = useState([
    { id: "1", description: "", hsn: "", quantity: 1, rate: 0, gst: 18, amount: 0 },
  ])

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      setCustomers(allContacts.filter((c: any) => c.type === "customer"))
    }
  }, [])

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: "", hsn: "", quantity: 1, rate: 0, gst: 18, amount: 0 },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
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

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
    const gstAmount = items.reduce((sum, item) => sum + (item.amount * item.gst) / 100, 0)
    const total = subtotal + gstAmount
    return { subtotal, gstAmount, total }
  }

  const handleAddCustomer = () => {
    if (!user || !newCustomer.name || !newCustomer.phone) {
      toast({ title: "Error", description: "Name and phone are required", variant: "destructive" })
      return
    }
    
    const customer = {
      id: Date.now().toString(),
      userId: user.id,
      type: "customer" as const,
      ...newCustomer,
      createdAt: new Date().toISOString(),
    }

    const storedContacts = localStorage.getItem("contacts")
    const allContacts = storedContacts ? JSON.parse(storedContacts) : []
    allContacts.push(customer)
    localStorage.setItem("contacts", JSON.stringify(allContacts))

    setCustomers([...customers, customer])
    setFormData({ ...formData, customerId: customer.id })
    setShowNewCustomerDialog(false)
    setNewCustomer({ name: "", company: "", email: "", phone: "", gstin: "", address: "", city: "", state: "", pincode: "" })

    toast({ title: "Success!", description: "Customer added successfully" })
  }

  const handleSubmit = (shareWhatsApp = false) => {
    if (!user || !formData.customerId) {
      toast({ title: "Error", description: "Please select a customer", variant: "destructive" })
      return
    }

    const { subtotal, gstAmount, total } = calculateTotals()
    const quotationNumber = `QUO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`

    const quotation = {
      id: Date.now().toString(),
      quotationNumber,
      userId: user.id,
      ...formData,
      items,
      subtotal,
      gstAmount,
      total,
      status: "draft",
      createdAt: new Date().toISOString(),
    }

    const stored = localStorage.getItem("quotations")
    const all = stored ? JSON.parse(stored) : []
    all.push(quotation)
    localStorage.setItem("quotations", JSON.stringify(all))

    if (shareWhatsApp) {
      const customer = customers.find(c => c.id === formData.customerId)
      if (customer?.phone) {
        const quotationData = {
          ...quotation,
          customerName: customer.name,
          customerCompany: customer.company,
          customerAddress: customer.address,
          customerCity: customer.city,
          customerState: customer.state,
          customerPincode: customer.pincode,
          customerPhone: customer.phone,
          customerGstin: customer.gstin,
          companyName: formData.companyName,
          companyLogo: formData.companyLogo
        }
        const encodedData = btoa(JSON.stringify(quotationData))
        const publicLink = `${window.location.origin}/public/quotation/view?data=${encodedData}`

        const message = `Hi ${customer.name}! Here's your quotation ${quotationNumber} from ${formData.companyName}. Total: ₹${total.toLocaleString()}. View & Download PDF here: ${publicLink}`
        const whatsappUrl = `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
      }
    }

    toast({ title: "Success!", description: "Quotation created successfully" })
    router.push("/dashboard/quotations")
  }

  const { subtotal, gstAmount, total } = calculateTotals()

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Quotation</h1>
            <p className="text-muted-foreground">Create a quotation with full client details</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company Logo</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          const reader = new FileReader()
                          reader.onloadend = () => setFormData({ ...formData, companyLogo: reader.result as string })
                          reader.readAsDataURL(file)
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.company && `(${c.company})`}
                        </SelectItem>
                      ))}
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
                        <DialogTitle>Add New Client</DialogTitle>
                        <DialogDescription>Enter complete client information</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Full Name *</Label>
                            <Input
                              value={newCustomer.name}
                              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                              value={newCustomer.company}
                              onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                              type="email"
                              value={newCustomer.email}
                              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>WhatsApp Number *</Label>
                            <Input
                              value={newCustomer.phone}
                              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>GSTIN</Label>
                            <Input
                              value={newCustomer.gstin}
                              onChange={(e) => setNewCustomer({ ...newCustomer, gstin: e.target.value })}
                              maxLength={15}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label>Address</Label>
                            <Input
                              value={newCustomer.address}
                              onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              value={newCustomer.city}
                              onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>State</Label>
                            <Input
                              value={newCustomer.state}
                              onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Pincode</Label>
                            <Input
                              value={newCustomer.pincode}
                              onChange={(e) => setNewCustomer({ ...newCustomer, pincode: e.target.value })}
                              maxLength={6}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleAddCustomer}>Add Client</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quotation Date</Label>
                    <Input
                      type="date"
                      value={formData.quotationDate}
                      onChange={(e) => setFormData({ ...formData, quotationDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Valid Until</Label>
                    <Input
                      type="date"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Items</CardTitle>
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
                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          placeholder="Product/Service"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>HSN Code</Label>
                        <Input
                          value={item.hsn}
                          onChange={(e) => updateItem(item.id, "hsn", e.target.value)}
                          placeholder="HSN"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Rate (₹)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>GST %</Label>
                        <Select
                          value={item.gst.toString()}
                          onValueChange={(value) => updateItem(item.id, "gst", Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0%</SelectItem>
                            <SelectItem value="5">5%</SelectItem>
                            <SelectItem value="12">12%</SelectItem>
                            <SelectItem value="18">18%</SelectItem>
                            <SelectItem value="28">28%</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Amount: </span>
                      <span className="font-semibold">₹{item.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Terms and conditions..."
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
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span>₹{gstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Button className="w-full" onClick={() => handleSubmit(false)}>
                <Save className="mr-2 h-4 w-4" />
                Save Quotation
              </Button>
              <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => handleSubmit(true)}>
                <Send className="mr-2 h-4 w-4" />
                Save & Share via WhatsApp
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
