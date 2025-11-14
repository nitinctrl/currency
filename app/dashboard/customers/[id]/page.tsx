"use client"

import { Textarea } from "@/components/ui/textarea"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, MapPin, FileText, IndianRupee, Plus, Lock } from "lucide-react"
import type { Contact, Invoice, ContactNote, User } from "@/lib/types"

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [customer, setCustomer] = useState<Contact | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [notes, setNotes] = useState<ContactNote[]>([])
  const [newNote, setNewNote] = useState("")
  const [newPrivateNote, setNewPrivateNote] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }

    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const found = allContacts.find((c: Contact) => c.id === params.id)
      setCustomer(found || null)
      if (found?.notes) {
        setNotes(found.notes)
      }
    }

    const storedInvoices = localStorage.getItem("invoices")
    if (storedInvoices) {
      const allInvoices = JSON.parse(storedInvoices)
      setInvoices(allInvoices.filter((inv: Invoice) => inv.customerId === params.id))
    }
  }, [params.id])

  const handleAddNote = (isPrivate: boolean) => {
    const content = isPrivate ? newPrivateNote : newNote
    if (!content.trim() || !customer || !currentUser) return

    const note: ContactNote = {
      id: Date.now().toString(),
      contactId: customer.id,
      userId: currentUser.id,
      content: content.trim(),
      isPrivate,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.name,
    }

    const updatedNotes = [...notes, note]
    setNotes(updatedNotes)

    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const updatedContacts = allContacts.map((c: Contact) =>
        c.id === customer.id ? { ...c, notes: updatedNotes } : c,
      )
      localStorage.setItem("contacts", JSON.stringify(updatedContacts))
    }

    if (isPrivate) {
      setNewPrivateNote("")
    } else {
      setNewNote("")
    }
  }

  if (!customer) {
    return (
      <AuthGuard requireApproved>
        <DashboardLayout>
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Customer not found</p>
            <Button className="mt-4" onClick={() => router.push("/dashboard/customers")}>
              Back to Customers
            </Button>
          </div>
        </DashboardLayout>
      </AuthGuard>
    )
  }

  const totalRevenue = invoices.filter((inv) => inv.status === "paid").reduce((sum, inv) => sum + inv.total, 0)
  const pendingAmount = invoices
    .filter((inv) => inv.status === "sent" || inv.status === "overdue")
    .reduce((sum, inv) => sum + inv.total, 0)

  const publicNotes = notes.filter((n) => !n.isPrivate)
  const privateNotes = notes.filter((n) => n.isPrivate)
  const isAdmin = currentUser?.role === "admin"

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <p className="text-muted-foreground">{customer.company}</p>
            </div>
            <Button>Edit Customer</Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
                  <TabsTrigger value="notes">Notes ({publicNotes.length})</TabsTrigger>
                  {isAdmin && <TabsTrigger value="private">Private Notes ({privateNotes.length})</TabsTrigger>}
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium">{customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p className="font-medium">{customer.phone}</p>
                        </div>
                      </div>
                      {customer.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-1 h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">
                              {customer.address}
                              <br />
                              {customer.city}, {customer.state} {customer.pincode}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {customer.gstin && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <p className="text-sm text-muted-foreground">GSTIN</p>
                          <Badge variant="outline" className="mt-1">
                            {customer.gstin}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="invoices">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invoice History</CardTitle>
                      <CardDescription>All invoices for this customer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {invoices.length === 0 ? (
                        <p className="py-8 text-center text-muted-foreground">No invoices yet</p>
                      ) : (
                        <div className="space-y-4">
                          {invoices.map((invoice) => (
                            <div
                              key={invoice.id}
                              className="flex items-center justify-between border-b pb-4 last:border-0"
                            >
                              <div>
                                <p className="font-medium">{invoice.invoiceNumber}</p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(invoice.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">₹{invoice.total.toLocaleString()}</p>
                                <Badge variant={invoice.status === "paid" ? "default" : "secondary"}>
                                  {invoice.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>CRM Notes</CardTitle>
                      <CardDescription>Internal notes and follow-up comments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Add a note about this customer..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                        />
                        <Button onClick={() => handleAddNote(false)} size="sm">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {publicNotes.length === 0 ? (
                          <p className="py-8 text-center text-muted-foreground">No notes yet</p>
                        ) : (
                          publicNotes.map((note) => (
                            <div key={note.id} className="rounded-lg border p-4">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium">{note.createdBy}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(note.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm">{note.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {isAdmin && (
                  <TabsContent value="private" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          Private Team Notes
                        </CardTitle>
                        <CardDescription>Only visible to admin and internal team</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Textarea
                            placeholder="Add a private note (admin only)..."
                            value={newPrivateNote}
                            onChange={(e) => setNewPrivateNote(e.target.value)}
                            rows={3}
                          />
                          <Button onClick={() => handleAddNote(true)} size="sm" variant="secondary">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Private Note
                          </Button>
                        </div>

                        <div className="space-y-3">
                          {privateNotes.length === 0 ? (
                            <p className="py-8 text-center text-muted-foreground">No private notes yet</p>
                          ) : (
                            privateNotes.map((note) => (
                              <div key={note.id} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                  <span className="text-sm font-medium">{note.createdBy}</span>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm">{note.content}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="py-8 text-center text-muted-foreground">No recent activity</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Total Invoices</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold">{invoices.length}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-sm">Total Revenue</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <IndianRupee className="h-4 w-4" />
                      <span className="text-sm">Pending Amount</span>
                    </div>
                    <p className="mt-1 text-2xl font-bold">₹{pendingAmount.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    className="w-full bg-transparent"
                    variant="outline"
                    onClick={() => router.push(`/dashboard/invoices/new?customerId=${customer.id}`)}
                  >
                    Create Invoice
                  </Button>
                  <Button className="w-full bg-transparent" variant="outline">
                    Send Email
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
