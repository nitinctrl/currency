"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function SalesOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [salesOrders, setSalesOrders] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])
  const [quotations, setQuotations] = useState<any[]>([])

  const [formData, setFormData] = useState({
    quotationId: "",
    customerId: "",
    deliveryDate: "",
    notes: "",
  })

  useEffect(() => {
    const user = getUser()
    if (!user) return

    const stored = localStorage.getItem("salesOrders")
    if (stored) {
      const allOrders = JSON.parse(stored)
      const userOrders = allOrders.filter((o: any) => o.userId === user.id)
      setSalesOrders(userOrders)
    }

    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      setCustomers(allContacts.filter((c: any) => c.type === "customer"))
    }

    const storedQuotations = localStorage.getItem("quotations")
    if (storedQuotations) {
      const allQuotations = JSON.parse(storedQuotations)
      setQuotations(allQuotations.filter((q: any) => q.status === "accepted" && q.userId === user.id))
    }
  }, [])

  const handleCreateSalesOrder = () => {
    const user = getUser()
    if (!user) return

    if (!formData.quotationId && !formData.customerId) {
      toast({
        title: "Error",
        description: "Please select a quotation or customer",
        variant: "destructive",
      })
      return
    }

    const quotation = quotations.find((q) => q.id === formData.quotationId)
    const customer = customers.find((c) => c.id === formData.customerId)

    const newSalesOrder = {
      id: Date.now().toString(),
      soNumber: `SO-${String(Date.now()).slice(-6)}`,
      userId: user.id,
      quotationId: formData.quotationId || null,
      customerId: formData.customerId || quotation?.customerId,
      customerName: customer?.name || quotation?.customerName,
      items: quotation?.items || [],
      total: quotation?.total || 0,
      deliveryDate: formData.deliveryDate,
      notes: formData.notes,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    }

    const stored = localStorage.getItem("salesOrders")
    const allOrders = stored ? JSON.parse(stored) : []
    allOrders.push(newSalesOrder)
    localStorage.setItem("salesOrders", JSON.stringify(allOrders))

    setSalesOrders([...salesOrders, newSalesOrder])
    setIsDialogOpen(false)
    setFormData({ quotationId: "", customerId: "", deliveryDate: "", notes: "" })

    toast({
      title: "Success!",
      description: "Sales order created successfully",
    })
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Sales Orders</h1>
              <p className="text-muted-foreground">Manage confirmed sales orders</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Sales Order
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Sales Order</DialogTitle>
                  <DialogDescription>Create a new sales order from a quotation or customer</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Quotation (Optional)</Label>
                    <Select
                      value={formData.quotationId}
                      onValueChange={(value) => setFormData({ ...formData, quotationId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose from accepted quotations" />
                      </SelectTrigger>
                      <SelectContent>
                        {quotations.map((q) => (
                          <SelectItem key={q.id} value={q.id}>
                            {q.quotationNumber} - {q.customerName} - ₹{q.total.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Or Select Customer</Label>
                    <Select
                      value={formData.customerId}
                      onValueChange={(value) => setFormData({ ...formData, customerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Date</Label>
                    <Input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Additional notes..."
                    />
                  </div>

                  <Button onClick={handleCreateSalesOrder} className="w-full">
                    Create Sales Order
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Sales Orders</CardTitle>
              <CardDescription>View and manage sales orders</CardDescription>
              <div className="flex items-center gap-4 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search sales orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {salesOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No sales orders yet. Create your first sales order.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {salesOrders
                    .filter(
                      (so) =>
                        so.soNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        so.customerName.toLowerCase().includes(searchQuery.toLowerCase()),
                    )
                    .map((so) => (
                      <div key={so.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{so.soNumber}</p>
                            <Badge variant={so.status === "shipped" ? "default" : "secondary"}>{so.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{so.customerName}</p>
                          <p className="text-xs text-muted-foreground">
                            {so.items?.length || 0} items • {new Date(so.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{so.total?.toLocaleString() || 0}</p>
                          <Button variant="ghost" size="sm" className="mt-2">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
