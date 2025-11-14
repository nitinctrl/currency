"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InvoicePreviewModal } from "@/components/invoice-preview-modal"
import { PaymentQRModal } from "@/components/payment-qr-modal"
import { Plus, Eye, QrCode } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { MOCK_INVOICES } from "@/lib/mock-data"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { migrateUserData } from "@/lib/data-migration"

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log("[v0] Loading invoices from localStorage")
    const user = getUser()

    if (!user) {
      console.error("[v0] ERROR: No user found")
      return
    }

    console.log("[v0] Current user:", user)

    migrateUserData()

    const storedInvoices = localStorage.getItem("invoices")
    console.log("[v0] Raw localStorage data:", storedInvoices)

    if (storedInvoices) {
      const allInvoices = JSON.parse(storedInvoices)
      console.log("[v0] Total invoices in storage:", allInvoices.length)
      console.log("[v0] All invoices:", allInvoices)

      const userInvoices = allInvoices.filter((inv: Invoice) => inv.userId === user.id)
      console.log("[v0] User's invoices:", userInvoices.length)
      console.log("[v0] Filtered invoices:", userInvoices)

      setInvoices(userInvoices)
    } else {
      console.log("[v0] No invoices in localStorage, using mock data")
      const userInvoices = MOCK_INVOICES.filter((inv) => inv.userId === user.id)
      console.log("[v0] Mock invoices for user:", userInvoices.length)
      setInvoices(userInvoices)
      localStorage.setItem("invoices", JSON.stringify(MOCK_INVOICES))
    }
  }, [])

  const handlePreview = (invoice: Invoice) => {
    console.log("[v0] Opening preview for invoice:", invoice.id)
    console.log("[v0] Invoice data:", invoice)

    if (!invoice.id) {
      console.error("[v0] ERROR: Invoice ID is missing!")
      toast({
        title: "Error",
        description: "Invoice ID is missing. Cannot preview.",
        variant: "destructive",
      })
      return
    }

    if (!invoice.customerId) {
      console.error("[v0] ERROR: Customer ID is missing!")
      toast({
        title: "Warning",
        description: "Customer information is missing from this invoice.",
        variant: "destructive",
      })
    }

    setSelectedInvoice(invoice)
    setPreviewOpen(true)
    console.log("[v0] Preview modal opened")
  }

  const handleShowQR = (invoice: Invoice) => {
    console.log("[v0] Opening QR modal for invoice:", invoice.id)
    console.log("[v0] Invoice amount:", invoice.total)
    setSelectedInvoice(invoice)
    setQrOpen(true)
  }

  const handleDownloadPDF = async () => {
    if (!selectedInvoice) {
      console.error("[v0] ERROR: No invoice selected")
      return
    }

    console.log("[v0] Generating PDF for invoice:", selectedInvoice.id)
    console.log("[v0] Invoice data for PDF:", selectedInvoice)

    toast({
      title: "Generating PDF...",
      description: "Your invoice PDF is being generated",
    })

    try {
      // Load company settings
      const companySettings = JSON.parse(localStorage.getItem("companySettings") || "{}")
      console.log("[v0] Company settings loaded:", companySettings)

      // Load customer data
      const customers = JSON.parse(localStorage.getItem("customers") || "[]")
      const customer = customers.find((c: any) => c.id === selectedInvoice.customerId)
      console.log("[v0] Customer data loaded:", customer)

      // Generate PDF
      await generateInvoicePDF(selectedInvoice, companySettings, customer)

      console.log("[v0] PDF generation complete")
      toast({
        title: "Downloaded!",
        description: "Invoice PDF downloaded successfully",
      })
    } catch (error) {
      console.error("[v0] PDF generation error:", error)
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = () => {
    const companySettings = JSON.parse(localStorage.getItem("companySettings") || "{}")

    if (!companySettings.email) {
      toast({
        title: "Setup Required",
        description: "Please add your company email in Settings → Company Details",
        variant: "destructive",
      })
      return
    }

    if (!selectedInvoice) return

    const customers = JSON.parse(localStorage.getItem("contacts") || "[]")
    const customer = customers.find((c: any) => c.id === selectedInvoice.customerId)

    if (!customer || !customer.email) {
      toast({
        title: "No Email",
        description: "Customer email not found. Please add it in Contacts.",
        variant: "destructive",
      })
      return
    }

    const subject = `Invoice ${selectedInvoice.invoiceNumber} from ${companySettings.companyName}`
    const body = `Dear ${customer.name},\n\nPlease find attached your invoice ${selectedInvoice.invoiceNumber} for ₹${selectedInvoice.total.toFixed(2)}.\n\nDue Date: ${new Date(selectedInvoice.dueDate).toLocaleDateString()}\n\nView invoice: ${window.location.origin}/invoice/${selectedInvoice.id}\n\nThank you for your business!\n\nBest regards,\n${companySettings.companyName}`

    const mailtoLink = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with the invoice details",
    })
  }

  const handleSendWhatsApp = () => {
    if (!selectedInvoice) return

    const companySettings = JSON.parse(localStorage.getItem("companySettings") || "{}")
    const customers = JSON.parse(localStorage.getItem("contacts") || "[]")
    const customer = customers.find((c: any) => c.id === selectedInvoice.customerId)

    const customerPhone = customer?.phone || companySettings.whatsapp
    if (!customerPhone) {
      toast({
        title: "No Phone Number",
        description: "Please add customer phone number or WhatsApp number in Settings",
        variant: "destructive",
      })
      return
    }

    const message = `Hi ${customer?.name || "there"}! 👋\n\nHere's your invoice from ${companySettings.companyName || "us"}:\n\n📄 Invoice: ${selectedInvoice.invoiceNumber}\n💰 Amount: ₹${selectedInvoice.total.toFixed(2)}\n📅 Due Date: ${new Date(selectedInvoice.dueDate).toLocaleDateString()}\n\n🔗 View invoice: ${window.location.origin}/invoice/${selectedInvoice.id}\n\nThank you for your business!`

    const cleanPhone = customerPhone.replace(/[^0-9]/g, "")
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")

    toast({
      title: "WhatsApp Opened",
      description: "Invoice details sent to WhatsApp",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      sent: "secondary",
      paid: "default",
      overdue: "destructive",
      cancelled: "outline",
    }
    return <Badge variant={variants[status] || "default"}>{status}</Badge>
  }

  return (
    <AuthGuard requireApproved>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Invoices</h1>
              <p className="text-muted-foreground">Manage your invoices</p>
            </div>
            <Link href="/dashboard/invoices/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>View and manage your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No invoices yet. Create your first invoice to get started.</p>
                  <Link href="/dashboard/invoices/new">
                    <Button className="mt-4">Create Invoice</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
                        <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell>Customer #{invoice.customerId}</TableCell>
                        <TableCell>₹{invoice.total.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handlePreview(invoice)} title="Preview">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleShowQR(invoice)} title="Payment QR">
                              <QrCode className="h-4 w-4" />
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

        <InvoicePreviewModal
          invoice={selectedInvoice}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          onDownloadPDF={handleDownloadPDF}
          onSendEmail={handleSendEmail}
          onSendWhatsApp={handleSendWhatsApp}
        />

        <PaymentQRModal
          open={qrOpen}
          onClose={() => setQrOpen(false)}
          amount={selectedInvoice?.total || 0}
          invoiceNumber={selectedInvoice?.invoiceNumber || ""}
        />
      </DashboardLayout>
    </AuthGuard>
  )
}
