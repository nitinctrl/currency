"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Send, Share2, ArrowLeft } from "lucide-react"
import type { Invoice } from "@/lib/types"
import { generateInvoicePDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

export default function InvoicePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [companySettings, setCompanySettings] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const invoiceId = params.id as string

    const settings = localStorage.getItem("companySettings")
    const parsedSettings = settings ? JSON.parse(settings) : {}
    setCompanySettings(parsedSettings)

    const storedInvoices = localStorage.getItem("invoices")
    if (storedInvoices) {
      const allInvoices = JSON.parse(storedInvoices)
      const foundInvoice = allInvoices.find((inv: Invoice) => inv.id === invoiceId)

      if (foundInvoice) {
        setInvoice(foundInvoice)

        const upiString = `upi://pay?pa=${parsedSettings?.upiId || "merchant@upi"}&pn=${parsedSettings?.companyName || "Company"}&am=${foundInvoice.total}&cu=INR&tn=Invoice ${foundInvoice.invoiceNumber}`
        QRCode.toDataURL(upiString)
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error("QR code generation error:", err))

        // Load customer
        const contacts = localStorage.getItem("contacts")
        if (contacts) {
          const allContacts = JSON.parse(contacts)
          const customerData = allContacts.find((c: any) => c.id === foundInvoice.customerId)
          setCustomer(customerData)
        }
      }
    }

    setLoading(false)
  }, [params.id])

  const handleDownloadPDF = async () => {
    if (!invoice) return

    try {
      await generateInvoicePDF(invoice, companySettings, customer)
      toast({
        title: "Downloaded!",
        description: "Invoice PDF downloaded successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      })
    }
  }

  const handleSendEmail = () => {
    if (!companySettings?.email) {
      toast({
        title: "Setup Required",
        description: "Please add your company email in Settings",
        variant: "destructive",
      })
      return
    }

    if (!customer?.email) {
      toast({
        title: "No Email",
        description: "Customer email not found",
        variant: "destructive",
      })
      return
    }

    const subject = `Invoice ${invoice?.invoiceNumber} from ${companySettings.companyName}`
    const body = `Dear ${customer.name},\n\nPlease find your invoice ${invoice?.invoiceNumber} for ₹${invoice?.total.toFixed(2)}.\n\nView invoice: ${window.location.href}\n\nThank you for your business!`

    window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleSendWhatsApp = () => {
    if (!customer?.phone && !companySettings?.whatsapp) {
      toast({
        title: "No Phone Number",
        description: "Customer phone number not found",
        variant: "destructive",
      })
      return
    }

    const message = `Hi ${customer?.name || "there"}! 👋\n\nHere's your invoice from ${companySettings?.companyName || "us"}:\n\n📄 Invoice: ${invoice?.invoiceNumber}\n💰 Amount: ₹${invoice?.total.toFixed(2)}\n📅 Due Date: ${new Date(invoice?.dueDate || "").toLocaleDateString()}\n\n🔗 View invoice: ${window.location.href}\n\nThank you for your business!`

    const phoneNumber = customer?.phone || companySettings?.whatsapp || ""
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "")
    const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, "_blank")

    toast({
      title: "WhatsApp Opened",
      description: "Invoice details sent to WhatsApp",
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading invoice...</p>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Invoice not found</p>
        <Button onClick={() => router.push("/dashboard/invoices")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
      </div>
    )
  }

  const balanceDue = invoice.total - (invoice.paidAmount || 0)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full px-4">
        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <Button variant="ghost" onClick={() => router.push("/dashboard/invoices")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleDownloadPDF} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={handleSendEmail} variant="outline">
              <Send className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button onClick={handleSendWhatsApp} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
          </div>
        </div>

        <div
          className="mx-auto w-full rounded-lg bg-white p-16 shadow-lg print:shadow-none"
          style={{ minHeight: "297mm", maxWidth: "210mm" }}
        >
          {/* Header */}
          <div className="mb-8 flex items-start justify-between">
            <div>
              {companySettings?.logo && (
                <img
                  src={companySettings.logo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="mb-4 h-24 w-auto object-contain"
                />
              )}
              <h1 className="text-5xl font-bold text-blue-700">INVOICE</h1>
              <p className="mt-2 text-base text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
              <p className="text-base text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
              <p className="text-base text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">{companySettings?.companyName || "Your Company"}</h2>
              {companySettings?.address && <p className="text-sm text-gray-600">{companySettings.address}</p>}
              {companySettings?.city && (
                <p className="text-sm text-gray-600">
                  {companySettings.city}, {companySettings.state} {companySettings.pincode}
                </p>
              )}
              {companySettings?.gstNumber && <p className="text-sm text-gray-600">GST: {companySettings.gstNumber}</p>}
              {companySettings?.email && <p className="text-sm text-gray-600">{companySettings.email}</p>}
              {companySettings?.phone && <p className="text-sm text-gray-600">{companySettings.phone}</p>}
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="mb-2 text-lg font-semibold">Bill To:</h3>
            {customer ? (
              <>
                <p className="text-base font-medium">{customer.name}</p>
                {customer.company && <p className="text-sm text-gray-600">{customer.company}</p>}
                {customer.address && <p className="text-sm text-gray-600">{customer.address}</p>}
                {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
                {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
              </>
            ) : (
              <p className="text-sm text-gray-600">Customer information not available</p>
            )}
          </div>

          {/* Items Table */}
          <table className="mb-8 w-full text-base">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="pb-3 text-left">Description</th>
                <th className="pb-3 text-center">HSN</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Tax %</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-center text-sm">{item.hsnCode || "-"}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="py-3 text-right">{item.taxRate}%</td>
                  <td className="py-3 text-right">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals and QR Code */}
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              {qrCodeUrl && (
                <>
                  <img src={qrCodeUrl || "/placeholder.svg"} alt="Payment QR Code" className="h-32 w-32" />
                  <p className="mt-2 text-xs text-gray-600">Scan to Pay</p>
                </>
              )}
            </div>

            <div className="w-80 space-y-2 text-base">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{invoice.taxAmount.toFixed(2)}</span>
              </div>
              {invoice.additionalCharges?.packaging && (
                <div className="flex justify-between">
                  <span>Packaging:</span>
                  <span>₹{invoice.additionalCharges.packaging.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t-2 pt-2 text-xl font-bold">
                <span>Total:</span>
                <span>₹{invoice.total.toFixed(2)}</span>
              </div>
              {invoice.paidAmount && invoice.paidAmount > 0 && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Paid:</span>
                    <span>₹{invoice.paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-lg font-bold text-red-600">
                    <span>Balance Due:</span>
                    <span>₹{balanceDue.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 border-t pt-4">
              <h3 className="mb-2 font-semibold">Notes:</h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t pt-4 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
