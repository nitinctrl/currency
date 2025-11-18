"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

interface QuotationItem {
  productId: string
  productName: string
  quantity: number
  rate: number
  amount: number
}

interface Quotation {
  id: string
  quotationNumber: string
  date: string
  customerId: string
  items: QuotationItem[]
  total: number
  status: string
}

export default function EditQuotationPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState("")
  const [items, setItems] = useState<QuotationItem[]>([])
  const [quotationNumber, setQuotationNumber] = useState("")

  useEffect(() => {
    // Load customers and products
    const storedCustomers = JSON.parse(localStorage.getItem("contacts") || "[]")
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
    setCustomers(storedCustomers)
    setProducts(storedProducts)

    // Load quotation data
    const storedQuotations = localStorage.getItem("quotations")
    if (storedQuotations) {
      const allQuotations: Quotation[] = JSON.parse(storedQuotations)
      const quotation = allQuotations.find((q) => q.id === params.id)
      if (quotation) {
        setQuotationNumber(quotation.quotationNumber)
        setSelectedCustomer(quotation.customerId)
        setItems(quotation.items)
      }
    }
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const storedQuotations = localStorage.getItem("quotations")
      if (storedQuotations) {
        const allQuotations: Quotation[] = JSON.parse(storedQuotations)
        const total = items.reduce((sum, i) => sum + i.amount, 0)
        
        const updatedQuotations = allQuotations.map((q) =>
          q.id === params.id
            ? {
                ...q,
                customerId: selectedCustomer,
                items,
                total,
                updatedAt: new Date().toISOString(),
              }
            : q
        )
        localStorage.setItem("quotations", JSON.stringify(updatedQuotations))
        
        toast({
          title: "Quotation Updated",
          description: `Quotation ${quotationNumber} has been updated successfully.`,
        })
        router.push("/dashboard/quotations")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quotation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addItem = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const amount = quantity * product.price
    setItems([...items, {
      productId: product.id,
      productName: product.name,
      quantity,
      rate: product.price,
      amount
    }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItemQuantity = (index: number, quantity: number) => {
    const updatedItems = [...items]
    updatedItems[index].quantity = quantity
    updatedItems[index].amount = quantity * updatedItems[index].rate
    setItems(updatedItems)
  }

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Quotation</h1>
            <p className="text-muted-foreground">Update quotation details: {quotationNumber}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quotation Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer *</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Line Items</Label>
                </div>

                {items.length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-3 text-left">Product</th>
                          <th className="p-3 text-right">Quantity</th>
                          <th className="p-3 text-right">Rate</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-3">{item.productName}</td>
                            <td className="p-3 text-right">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(idx, parseInt(e.target.value) || 1)}
                                className="w-20 ml-auto"
                              />
                            </td>
                            <td className="p-3 text-right">₹{item.rate.toFixed(2)}</td>
                            <td className="p-3 text-right font-medium">₹{item.amount.toFixed(2)}</td>
                            <td className="p-3 text-right">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(idx)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t bg-muted/50">
                          <td colSpan={3} className="p-3 text-right font-semibold">Total:</td>
                          <td className="p-3 text-right font-bold">
                            ₹{items.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || items.length === 0}>
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
