"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { getUser } from "@/lib/auth"
import type { Product } from "@/lib/types"

const UNITS = ["piece", "kg", "gram", "liter", "meter", "box", "dozen", "set"]

export default function NewProductPage() {
  const router = useRouter()
  const user = getUser()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    hsn: "",
    purchasePrice: "",
    price: "",
    taxRate: "18",
    stock: "",
    unit: "piece",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newProduct: Product = {
      id: Date.now().toString(),
      userId: user.id,
      name: formData.name,
      description: formData.description,
      sku: formData.sku,
      hsn: formData.hsn,
      purchasePrice: Number(formData.purchasePrice),
      price: Number(formData.price),
      taxRate: Number(formData.taxRate),
      stock: Number(formData.stock),
      unit: formData.unit,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const storedProducts = localStorage.getItem("products")
    const allProducts = storedProducts ? JSON.parse(storedProducts) : []
    allProducts.push(newProduct)
    localStorage.setItem("products", JSON.stringify(allProducts))

    router.push("/dashboard/products")
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
              <h1 className="text-3xl font-bold">Add Product</h1>
              <p className="text-muted-foreground">Add a new product to your inventory</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                    <CardDescription>Basic product details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        placeholder="Laptop Computer"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="High-performance business laptop"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sku">SKU</Label>
                        <Input
                          id="sku"
                          placeholder="LAP-001"
                          value={formData.sku}
                          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hsn">HSN Code</Label>
                        <Input
                          id="hsn"
                          placeholder="8471"
                          value={formData.hsn}
                          onChange={(e) => setFormData({ ...formData, hsn: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground">Harmonized System of Nomenclature code</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Tax</CardTitle>
                    <CardDescription>Set product pricing and tax information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="purchasePrice">Purchase Price *</Label>
                        <Input
                          id="purchasePrice"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="35000"
                          value={formData.purchasePrice}
                          onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Cost price for inventory tracking</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="price">Selling Price *</Label>
                        <Input
                          id="price"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="45000"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">Price shown to customers</p>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="taxRate">Tax Rate (%) *</Label>
                        <Select
                          value={formData.taxRate}
                          onValueChange={(value) => setFormData({ ...formData, taxRate: value })}
                        >
                          <SelectTrigger id="taxRate">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">0% - Exempt</SelectItem>
                            <SelectItem value="5">5% - GST</SelectItem>
                            <SelectItem value="12">12% - GST</SelectItem>
                            <SelectItem value="18">18% - GST</SelectItem>
                            <SelectItem value="28">28% - GST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory</CardTitle>
                    <CardDescription>Stock and unit information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="stock">Initial Stock *</Label>
                        <Input
                          id="stock"
                          type="number"
                          min="0"
                          placeholder="25"
                          value={formData.stock}
                          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit *</Label>
                        <Select
                          value={formData.unit}
                          onValueChange={(value) => setFormData({ ...formData, unit: value })}
                        >
                          <SelectTrigger id="unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {UNITS.map((unit) => (
                              <SelectItem key={unit} value={unit} className="capitalize">
                                {unit}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Product Name</p>
                      <p className="font-medium">{formData.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Purchase Price</p>
                      <p className="font-medium">
                        ₹{formData.purchasePrice ? Number(formData.purchasePrice).toLocaleString() : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Selling Price</p>
                      <p className="font-medium">₹{formData.price ? Number(formData.price).toLocaleString() : "-"}</p>
                    </div>
                    {formData.purchasePrice && formData.price && (
                      <div>
                        <p className="text-muted-foreground">Profit Margin</p>
                        <p className="font-medium text-green-600">
                          ₹{(Number(formData.price) - Number(formData.purchasePrice)).toLocaleString()} (
                          {(
                            ((Number(formData.price) - Number(formData.purchasePrice)) / Number(formData.price)) *
                            100
                          ).toFixed(1)}
                          %)
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Stock</p>
                      <p className="font-medium">
                        {formData.stock || "0"} {formData.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Total Value</p>
                      <p className="text-lg font-bold">
                        ₹
                        {formData.price && formData.stock
                          ? (Number(formData.price) * Number(formData.stock)).toLocaleString()
                          : "0"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    Add Product
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
