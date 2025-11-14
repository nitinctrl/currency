"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send } from "lucide-react"
import { getUser } from "@/lib/auth"

export default function NewEInvoicePage() {
  const router = useRouter()
  const user = getUser()

  const [customers, setCustomers] = useState<any[]>([])
  const [invoices, setInvoices] = useState<any[]>([])
  const [formData, setFormData] = useState({
    invoiceId: "",
    customerId: "",
    irn: "",
    ackNo: "",
    ackDate: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const customerContacts = allContacts.filter((c: any) => c.type === "customer")
      setCustomers(customerContacts)
    }

    const storedInvoices = localStorage.getItem("invoices")
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newEInvoice = {
      id: Date.now().toString(),
      userId: user.id,
      ...formData,
      status: "verified",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const storedEInvoices = localStorage.getItem("eInvoices")
    const allEInvoices = storedEInvoices ? JSON.parse(storedEInvoices) : []
    allEInvoices.push(newEInvoice)
    localStorage.setItem("eInvoices", JSON.stringify(allEInvoices))

    router.push("/dashboard/invoices/e-invoice")
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
              <h1 className="text-3xl font-bold">Generate E-Invoice</h1>
              <p className="text-muted-foreground">Create GST-compliant electronic invoice</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>E-Invoice Details</CardTitle>
                    <CardDescription>Select invoice and enter IRN details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceId">Select Invoice *</Label>
                        <Select
                          value={formData.invoiceId}
                          onValueChange={(value) => setFormData({ ...formData, invoiceId: value })}
                          required
                        >
                          <SelectTrigger id="invoiceId">
                            <SelectValue placeholder="Select invoice" />
                          </SelectTrigger>
                          <SelectContent>
                            {invoices.length === 0 ? (
                              <SelectItem value="none" disabled>
                                No invoices found
                              </SelectItem>
                            ) : (
                              invoices.map((invoice) => (
                                <SelectItem key={invoice.id} value={invoice.id}>
                                  {invoice.invoiceNumber} - ₹{invoice.total.toLocaleString()}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
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
                                No customers found
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
                        <Label htmlFor="irn">IRN (Invoice Reference Number) *</Label>
                        <Input
                          id="irn"
                          placeholder="Enter 64-character IRN"
                          value={formData.irn}
                          onChange={(e) => setFormData({ ...formData, irn: e.target.value })}
                          maxLength={64}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ackNo">Acknowledgement Number *</Label>
                        <Input
                          id="ackNo"
                          placeholder="Enter Ack No"
                          value={formData.ackNo}
                          onChange={(e) => setFormData({ ...formData, ackNo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ackDate">Acknowledgement Date *</Label>
                        <Input
                          id="ackDate"
                          type="date"
                          value={formData.ackDate}
                          onChange={(e) => setFormData({ ...formData, ackDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>E-Invoice Information</CardTitle>
                    <CardDescription>About GST e-invoicing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>E-invoicing is mandatory for businesses with turnover above ₹5 crores.</p>
                    <p>The IRN is generated by the GST portal after uploading invoice details.</p>
                    <p>Each e-invoice must have a unique IRN for GST compliance.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">Ready to generate e-invoice</div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Generate E-Invoice
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
