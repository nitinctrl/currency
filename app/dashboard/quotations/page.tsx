"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  name: string
}

interface Product {
  id: string
  name: string
  rate: number
}

interface PurchaseOrderItem {
  productId: string
  productName: string
  quantity: number
  rate: number
  amount: number
}

export default function PurchaseOrderForm() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [items, setItems] = useState<PurchaseOrderItem[]>([])
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const storedCustomers = JSON.parse(localStorage.getItem("contacts") || "[]")
    const storedProducts = JSON.parse(localStorage.getItem("products") || "[]")
    setCustomers(storedCustomers)
    setProducts(storedProducts)
  }, [])

  function addItem() {
    if (!selectedProduct || quantity <= 0) {
      toast({ title: "Select product and enter valid quantity", variant: "destructive" })
      return
    }
    const product = products.find((p) => p.id === selectedProduct)
    if (!product) {
      toast({ title: "Invalid product selected", variant: "destructive" })
      return
    }
    const amount = quantity * product.rate
    setItems([...items, { productId: product.id, productName: product.name, quantity, rate: product.rate, amount }])
    // Reset selection
    setSelectedProduct("")
    setQuantity(1)
  }

  function savePurchaseOrder() {
    if (!selectedCustomer) {
      toast({ title: "Select a customer", variant: "destructive" })
      return
    }
    if (items.length === 0) {
      toast({ title: "Add at least one item", variant: "destructive" })
      return
    }
    const poNumber = `PO-${String(Date.now()).slice(-6)}`
    const total = items.reduce((sum, i) => sum + i.amount, 0)
    const purchaseOrders = JSON.parse(localStorage.getItem("purchaseOrders") || "[]")
    const newPO = {
      id: Date.now().toString(),
      poNumber,
      date: new Date().toISOString(),
      customerId: selectedCustomer,
      items,
      total,
      status: "draft",
    }
    purchaseOrders.push(newPO)
    localStorage.setItem("purchaseOrders", JSON.stringify(purchaseOrders))
    toast({ title: "Purchase Order Saved", description: `PO ${poNumber} saved successfully` })
    router.push("/dashboard/purchases/orders") // or your PO list page
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">New Purchase Order</h2>
      
      <div className="mb-4">
        <Label htmlFor="customer-select">Customer</Label>
        <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
          <SelectTrigger id="customer-select" className="w-full">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customers.map((c) => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-4 items-end">
        <div>
          <Label htmlFor="product-select">Product</Label>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger id="product-select" className="w-full">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name} (₹{p.rate})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity-input">Quantity</Label>
          <Input
            id="quantity-input"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <Button onClick={addItem} className="w-full">Add Item</Button>
        </div>
      </div>

      {items.length > 0 && (
        <table className="w-full mb-4 border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b border-gray-300 text-left">Product</th>
              <th className="p-2 border-b border-gray-300 text-right">Quantity</th>
              <th className="p-2 border-b border-gray-300 text-right">Rate</th>
              <th className="p-2 border-b border-gray-300 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="p-2 border-b border-gray-300">{item.productName}</td>
                <td className="p-2 border-b border-gray-300 text-right">{item.quantity}</td>
                <td className="p-2 border-b border-gray-300 text-right">₹{item.rate}</td>
                <td className="p-2 border-b border-gray-300 text-right">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button onClick={savePurchaseOrder} disabled={items.length === 0 || !selectedCustomer}>
        Save Purchase Order
      </Button>
    </div>
  )
}
