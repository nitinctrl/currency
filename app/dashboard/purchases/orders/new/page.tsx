"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const [vendor, setVendor] = useState("")
  const [poNumber, setPoNumber] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [deliveryDate, setDeliveryDate] = useState("")
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [notes, setNotes] = useState("")

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    if (field === "quantity" || field === "rate") {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }
    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

  const handleSave = () => {
    const purchaseOrder = {
      id: `PO-${Date.now()}`,
      vendor,
      poNumber,
      date,
      deliveryDate,
      items,
      subtotal,
      notes,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    const existing = JSON.parse(localStorage.getItem("purchaseOrders") || "[]")
    localStorage.setItem("purchaseOrders", JSON.stringify([...existing, purchaseOrder]))

    router.push("/dashboard/purchases/orders")
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/purchases/orders">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">New Purchase Order</h1>
              <p className="text-muted-foreground">Create a new purchase order</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Purchase Order Details</CardTitle>
              <CardDescription>Enter the purchase order information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vendor">Vendor Name *</Label>
                  <Input
                    id="vendor"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    placeholder="Enter vendor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poNumber">PO Number *</Label>
                  <Input
                    id="poNumber"
                    value={poNumber}
                    onChange={(e) => setPoNumber(e.target.value)}
                    placeholder="PO-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Order Date *</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Expected Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Item
                  </Button>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="grid gap-4 rounded-lg border p-4 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <Label>Description</Label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Rate</Label>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, "rate", Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Amount</Label>
                      <Input value={item.amount.toFixed(2)} disabled />
                    </div>
                    <div className="flex items-end md:col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or terms"
                  rows={3}
                />
              </div>

              <div className="flex justify-end border-t pt-4">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={!vendor || !poNumber}>
                  Save Purchase Order
                </Button>
                <Button variant="outline" onClick={() => router.push("/dashboard/purchases/orders")}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
