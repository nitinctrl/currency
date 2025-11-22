"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Plus, Eye, Mail, Phone, Search, StickyNote, RefreshCw } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function CustomersPage() {
  const [contacts, setContacts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [note, setNote] = useState("")
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error("Error fetching contacts:", error)
      // Fallback to local storage if Supabase fails or is empty (during migration)
      const storedContacts = localStorage.getItem("contacts")
      if (storedContacts) {
        const user = getUser()
        const allContacts = JSON.parse(storedContacts)
        const userContacts = allContacts.filter((c: any) => c.userId === user?.id && c.type === "customer")
        if (userContacts.length > 0) {
          // Suggest migration
          toast({
            title: "Data Found",
            description: "Local data found. Click 'Sync' to upload to cloud.",
          })
        }
        setContacts(userContacts)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const syncData = async () => {
    setIsLoading(true)
    const user = getUser()
    if (!user) return

    const storedContacts = localStorage.getItem("contacts")
    if (storedContacts) {
      const allContacts = JSON.parse(storedContacts)
      const userContacts = allContacts.filter((c: any) => c.userId === user.id && c.type === "customer")

      let count = 0
      for (const contact of userContacts) {
        // Check if exists
        const { data } = await supabase.from("customers").select("id").eq("email", contact.email).single()
        if (!data) {
          await supabase.from("customers").insert({
            id: contact.id, // Try to keep ID if UUID, otherwise let DB generate
            user_id: user.id,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            gst_number: contact.gstin,
            address: contact.address,
            city: contact.city,
            state: contact.state,
            pincode: contact.pincode,
            notes: contact.notes || (contact.company ? `Company: ${contact.company}` : ""),
          })
          count++
        }
      }
      toast({ title: "Sync Complete", description: `Uploaded ${count} customers to Supabase.` })
      fetchContacts()
    }
  }

  const saveNote = async () => {
    if (!selectedContact) return

    try {
      const { error } = await supabase.from("customers").update({ notes: note }).eq("id", selectedContact.id)

      if (error) throw error

      const updatedContacts = contacts.map((c) => {
        if (c.id === selectedContact.id) {
          return { ...c, notes: note }
        }
        return c
      })
      setContacts(updatedContacts)
      toast({ title: "Note Saved", description: "Customer note updated successfully" })
      setIsNoteOpen(false)
    } catch (error) {
      console.error("Error updating note:", error)
      toast({ title: "Error", description: "Failed to save note", variant: "destructive" })
    }
  }

  const openNoteDialog = (contact: any) => {
    setSelectedContact(contact)
    setNote(contact.notes || "")
    setIsNoteOpen(true)
  }

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.notes?.toLowerCase().includes(searchTerm.toLowerCase()), // Search in notes (company)
  )

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-muted-foreground">Manage your customer relationships</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={syncData} title="Sync Local Data">
              <RefreshCw className="mr-2 h-4 w-4" /> Sync
            </Button>
            <Link href="/dashboard/customers/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Customers</CardTitle>
                <CardDescription>View and manage your customers</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center">Loading customers...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No customers found matching your search."
                    : "No customers yet. Add your first customer to get started."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Company / Notes</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>GSTIN</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={contact.notes}>
                        {contact.notes || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {contact.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {contact.phone}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.city}
                        {contact.state ? `, ${contact.state}` : ""}
                      </TableCell>
                      <TableCell>
                        {contact.gst_number ? <Badge variant="outline">{contact.gst_number}</Badge> : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openNoteDialog(contact)} title="Quick Note">
                            <StickyNote
                              className={`h-4 w-4 ${contact.notes ? "text-blue-600 fill-blue-100" : "text-muted-foreground"}`}
                            />
                          </Button>
                          <Link href={`/dashboard/customers/${contact.id}`}>
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Note for {selectedContact?.name}</DialogTitle>
              <DialogDescription>Add or edit notes for this customer.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter customer requirements, follow-up details, etc."
                className="min-h-[150px]"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNoteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveNote}>Save Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  )
}
