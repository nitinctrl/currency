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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { getUser } from "@/lib/auth"

export default function NewCreditNotePage() {
  const router = useRouter()
  const user = getUser()

  const [customers, setCustomers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    customerId: "",
    invoiceId: "",
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    reason: "",
    notes: "",
  })

  useEffect(() => {
    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const customerContacts = allContacts.filter((c: any) => c.type === "customer")
      setCustomers(customerContacts)
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newCreditNote = {
      id: Date.now().toString(),
      creditNoteNumber: `CN-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`,
      userId: user.id,
      ...formData,
      status: "issued",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const storedCreditNotes = localStorage.getItem("creditNotes")
    const allCreditNotes = storedCreditNotes ? JSON.parse(storedCreditNotes) : []
    allCreditNotes.push(newCreditNote)
    localStorage.setItem("creditNotes", JSON.stringify(allCreditNotes))

    router.push("/dashboard/invoices/credit-notes")
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
              <h1 className="text-3xl font-bold">Create Credit Note</h1>
              <p className="text-muted-foreground">Issue a credit note for invoice adjustment</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Credit Note Details</CardTitle>
                    <CardDescription>Basic credit note information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
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
                        <Label htmlFor="invoiceId">Related Invoice</Label>
                        <Input
                          id="invoiceId"
                          placeholder="INV-2024-001"
                          value={formData.invoiceId}
                          onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Credit Note Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount *</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Credit Note *</Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe the reason for issuing this credit note..."
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Credit Amount</span>
                      <span>₹{formData.amount.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Button type="submit" className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Issue Credit Note
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
