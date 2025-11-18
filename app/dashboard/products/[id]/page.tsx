"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from 'next/navigation'
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    hsn: "",
    price: 0,
    purchasePrice: 0,
    quantity: 0,
    taxRate: 18,
    unit: "piece",
  })

  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts)
      const found = allProducts.find((p: Product) => p.id === params.id)
      if (found) {
        setProduct(found)
        setFormData({
          name: found.name,
          description: found.description || "",
          sku: found.sku || "",
          hsn: found.hsn || "",
          price: found.price,
          purchasePrice: found.purchasePrice || 0,
          quantity: found.stock || 0,
          taxRate: found.taxRate || 18,
          unit: found.unit || "piece",
        })
      }
    }
  }, [params.id])

  const handleSave = () => {
    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      const allProducts = JSON.parse(storedProducts)
      const updatedProducts = allProducts.map((p: Product) =>
        p.id === params.id
          ? {
              ...p,
              name: formData.name,
              description: formData.description,
              sku: formData.sku,
              hsn: formData.hsn,
              price: formData.price,
              purchasePrice: formData.purchasePrice,
              stock: formData.quantity,
              taxRate: formData.taxRate,
              unit: formData.unit,
              updatedAt: new Date().toISOString(),
            }
          : p,
      )
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      toast({
        title: "Product Updated",
        description: "Product details have been saved successfully",
      })
      router.push("/dashboard/products")
    }
  }

  if (!product) {
    return (
      <AuthGuard requireApproved>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/products")}>
            Back to Products
          </Button>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Edit Product</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hsn">HSN Code</Label>
                <Input
                  id="hsn"
                  value={formData.hsn}
                  onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Selling Price (₹)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchasePrice">Purchase Price (₹)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
