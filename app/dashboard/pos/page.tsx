"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Scan,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingCart,
  Lock,
  ArrowRight,
} from "lucide-react"
import type { Product, POSItem, User } from "@/lib/types"
import { useRouter } from "next/navigation"

export default function POSPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<POSItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [barcode, setBarcode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "upi" | "card">("cash")
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const storedProducts = localStorage.getItem("products")
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts))
    }
  }, [])

  // Check if user has POS access
  const hasPOSAccess =
    user?.plan === "Professional + POS" || user?.plan === "Enterprise" || user?.plan === "Professional"

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const existingItem = cartItems.find((item) => item.productId === productId)

    if (existingItem) {
      updateQuantity(productId, existingItem.quantity + 1)
    } else {
      const newItem: POSItem = {
        productId: product.id,
        name: product.name,
        quantity: 1,
        price: product.price,
        discount: 0,
        taxRate: product.taxRate,
        total: product.price * (1 + product.taxRate / 100),
      }
      setCartItems([...cartItems, newItem])
    }
    setSelectedProduct("")
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.productId === productId) {
          const subtotal = item.price * newQuantity
          const discountAmount = (subtotal * item.discount) / 100
          const taxableAmount = subtotal - discountAmount
          const total = taxableAmount * (1 + item.taxRate / 100)
          return { ...item, quantity: newQuantity, total }
        }
        return item
      }),
    )
  }

  const updateDiscount = (productId: string, discount: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.productId === productId) {
          const subtotal = item.price * item.quantity
          const discountAmount = (subtotal * discount) / 100
          const taxableAmount = subtotal - discountAmount
          const total = taxableAmount * (1 + item.taxRate / 100)
          return { ...item, discount, total }
        }
        return item
      }),
    )
  }

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter((item) => item.productId !== productId))
  }

  const handleBarcodeInput = (value: string) => {
    setBarcode(value)
    // Auto-search product by SKU when barcode is entered
    const product = products.find((p) => p.sku === value)
    if (product) {
      addToCart(product.id)
      setBarcode("")
    }
  }

  const handleScanBarcode = () => {
    setScanning(true)
    // In a real app, this would open the camera for barcode scanning
    alert("Camera barcode scanner would open here on mobile devices")
    setScanning(false)
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const discount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity * item.discount) / 100, 0)
    const taxAmount = cartItems.reduce((sum, item) => {
      const itemSubtotal = item.price * item.quantity
      const itemDiscount = (itemSubtotal * item.discount) / 100
      const taxableAmount = itemSubtotal - itemDiscount
      return sum + (taxableAmount * item.taxRate) / 100
    }, 0)
    const total = cartItems.reduce((sum, item) => sum + item.total, 0)

    return { subtotal, discount, taxAmount, total }
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return

    const transaction = {
      id: Date.now().toString(),
      userId: user?.id || "",
      items: cartItems,
      ...calculateTotals(),
      paymentMethod,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    // Save transaction
    const storedTransactions = localStorage.getItem("posTransactions")
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : []
    localStorage.setItem("posTransactions", JSON.stringify([...transactions, transaction]))

    // Clear cart
    setCartItems([])
    alert("Transaction completed successfully!")
  }

  const totals = calculateTotals()

  // Show upgrade prompt if no POS access
  if (!hasPOSAccess) {
    return (
      <AuthGuard requireApproved>
        <DashboardLayout>
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="max-w-md">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>POS System Locked</CardTitle>
                <CardDescription>Upgrade your plan to access the Point of Sale system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-medium">Your current plan: {user?.plan}</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Professional + POS (₹1,098/year) to unlock:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      POS System with product selection
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Barcode Scanner Support
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Mobile POS access
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      Real-time inventory sync
                    </li>
                  </ul>
                </div>
                <Button className="w-full" onClick={() => router.push("/plans")}>
                  Upgrade Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Point of Sale</h1>
              <p className="text-muted-foreground">Quick sales and checkout</p>
            </div>
            <Badge variant="secondary">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {cartItems.length} items
            </Badge>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Add Products</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Barcode Scanner */}
                  <div className="space-y-2">
                    <Label>Barcode Scanner</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Scan or enter barcode/SKU..."
                        value={barcode}
                        onChange={(e) => handleBarcodeInput(e.target.value)}
                      />
                      <Button onClick={handleScanBarcode} disabled={scanning} variant="outline">
                        <Scan className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Product Selection */}
                  <div className="space-y-2">
                    <Label>Select Product</Label>
                    <div className="flex gap-2">
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a product..." />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name} - ₹{product.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={() => addToCart(selectedProduct)} disabled={!selectedProduct}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cart Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {cartItems.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">No items in cart</p>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.productId} className="space-y-2 rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.productId)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Quantity</Label>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.productId, Number.parseInt(e.target.value) || 0)}
                                  className="h-8 w-16 text-center"
                                />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8 bg-transparent"
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Discount %</Label>
                              <Input
                                type="number"
                                value={item.discount}
                                onChange={(e) => updateDiscount(item.productId, Number.parseFloat(e.target.value) || 0)}
                                className="h-8"
                                min="0"
                                max="100"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-xs">Total</Label>
                              <p className="flex h-8 items-center text-lg font-bold">₹{item.total.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Checkout Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-destructive">-₹{totals.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>₹{totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("cash")}
                        className="flex-col gap-1 h-auto py-3"
                      >
                        <Banknote className="h-5 w-5" />
                        <span className="text-xs">Cash</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "upi" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("upi")}
                        className="flex-col gap-1 h-auto py-3"
                      >
                        <Smartphone className="h-5 w-5" />
                        <span className="text-xs">UPI</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        onClick={() => setPaymentMethod("card")}
                        className="flex-col gap-1 h-auto py-3"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span className="text-xs">Card</span>
                      </Button>
                    </div>
                  </div>

                  {paymentMethod === "upi" && (
                    <div className="rounded-lg bg-muted p-4 text-center">
                      <p className="mb-2 text-sm font-medium">UPI Payment</p>
                      <div className="mx-auto mb-2 h-32 w-32 rounded-lg bg-white p-2">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=wildknot01@okhdfcbank&pn=BizAcc&am=${totals.total.toFixed(2)}&cu=INR`}
                          alt="UPI QR Code"
                          className="h-full w-full"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">wildknot01@okhdfcbank</p>
                    </div>
                  )}

                  <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cartItems.length === 0}>
                    Complete Sale
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
