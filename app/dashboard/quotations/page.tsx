"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, Share2, Edit, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [contacts, setContacts] = useState<any[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const user = getUser()
      if (!user) return

      // Fetch customers from Supabase
      const { data: supabaseCustomers } = await supabase.from("customers").select("*")

      // Fetch legacy contacts from LocalStorage
      const storedContacts = localStorage.getItem("contacts")
      let localContacts: any[] = []
      if (storedContacts) {
        localContacts = JSON.parse(storedContacts)
      }

      // Merge contacts (Supabase takes precedence if ID conflicts, though IDs should be unique)
      // We use a map to ensure uniqueness by ID
      const contactMap = new Map()

      // Add local first
      localContacts.forEach((c) => contactMap.set(c.id, c))

      // Add Supabase (overwriting local if same ID, which effectively "migrates" the view)
      if (supabaseCustomers) {
        supabaseCustomers.forEach((c) => contactMap.set(c.id, c))
      }

      setContacts(Array.from(contactMap.values()))

      const storedQuotations = localStorage.getItem("quotations")
      if (storedQuotations) {
        const allQuotations = JSON.parse(storedQuotations)
        setQuotations(allQuotations.filter((q: any) => q.userId === user.id).reverse())
      }
    }

    fetchData()
  }, [])

  const filteredQuotations = quotations.filter(
    (q) =>
      q.quotationNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(q.customerId).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function getCustomerName(id: string) {
    const contact = contacts.find((c) => c.id === id)
    return contact ? contact.name : "Unknown"
  }

  const deleteQuotation = (id: string) => {
    const newQuotations = quotations.filter((q) => q.id !== id)
    setQuotations(newQuotations)

    const allQuotations = JSON.parse(localStorage.getItem("quotations") || "[]")
    const updatedAll = allQuotations.filter((q: any) => q.id !== id)
    localStorage.setItem("quotations", JSON.stringify(updatedAll))

    toast({
      title: "Deleted",
      description: "Quotation deleted successfully",
    })
  }

  const shareWhatsApp = (quotation: any) => {
    const customer = contacts.find((c) => c.id === quotation.customerId)
    if (customer?.phone) {
      const quotationData = {
        ...quotation,
        customerName: customer.name,
        customerCompany: customer.company, // Handle legacy field
        customerAddress: customer.address,
        customerCity: customer.city,
        customerState: customer.state,
        customerPincode: customer.pincode,
        customerPhone: customer.phone,
        customerGstin: customer.gst_number || customer.gstin, // Handle legacy field
      }
      // Using encodeURIComponent for the data to ensure safety, though base64 is usually safe-ish
      const encodedData = btoa(JSON.stringify(quotationData))
      const publicLink = `${window.location.origin}/public/quotation/view?data=${encodedData}`

      const message = `*Quotation ${quotation.quotationNumber}*\n\nDear ${customer.name},\n\nPlease find the quotation details below:\nTotal Amount: ₹${quotation.total.toLocaleString()}\n\nView & Download PDF: ${publicLink}\n\nRegards,\nBizAcc`

      // Ensure phone number is clean
      const cleanPhone = customer.phone.replace(/\D/g, "")
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, "_blank")
    } else {
      toast({ title: "Error", description: "Customer phone number not found", variant: "destructive" })
    }
  }

  return (
    <AuthGuard requireApproved>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quotations</h1>
            <p className="text-muted-foreground">Manage and track your quotations</p>
          </div>
          <Link href="/dashboard/quotations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Quotation
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Quotations</CardTitle>
                <CardDescription>View list of all generated quotations</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search number or customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredQuotations.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  {searchTerm ? "No quotations found matching your search." : "No quotations created yet."}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quotation Number</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotations.map((quotation) => (
                    <TableRow key={quotation.id}>
                      <TableCell className="font-medium">{quotation.quotationNumber}</TableCell>
                      <TableCell>
                        {new Date(quotation.quotationDate || quotation.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getCustomerName(quotation.customerId)}</TableCell>
                      <TableCell>₹{quotation.total?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={quotation.status === "accepted" ? "default" : "secondary"}>
                          {quotation.status || "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => shareWhatsApp(quotation)}
                            title="Share WhatsApp"
                          >
                            <Share2 className="h-4 w-4 text-green-600" />
                          </Button>
                          <Link href={`/public/quotation/view?data=${btoa(JSON.stringify(quotation))}`} target="_blank">
                            <Button size="sm" variant="ghost" title="View/Print">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/quotations/${quotation.id}/edit`}>
                            <Button size="sm" variant="ghost" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteQuotation(quotation.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
