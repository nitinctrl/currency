"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Download, Send, Share2, ArrowLeft, FileText, Receipt } from "lucide-react"
import { generateQuotationPDF } from "@/lib/pdf-generator"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

export default function QuotationPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quotation, setQuotation] = useState<any>(null)
  const [companySettings, setCompanySettings] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    const quotationId = params.id as string

    const settings = localStorage.getItem("companySettings")
    const parsedSettings = settings ? JSON.parse(settings) : {}
    setCompanySettings(parsedSettings)

    const storedQuotations = localStorage.getItem("quotations")
    if (storedQuotations) {
      const allQuotations = JSON.parse(storedQuotations)
      const foundQuotation = allQuotations.find((q: any) => q.id === quotationId)

      if (foundQuotation) {
        setQuotation(foundQuotation)

        const upiString = `upi://pay?pa=${parsedSettings?.upiId || "merchant@upi"}&pn=${parsedSettings?.companyName || "Company"}&am=${foundQuotation.total}&cu=INR&tn=Quotation ${foundQuotation.quotationNumber}`
        QRCode.toDataURL(upiString)
          .then((url) => setQrCodeUrl(url))
          .catch((err) => console.error("[v0] QR code generation error:", err))

        const contacts = localStorage.getItem("contacts")
        if (contacts) {
          const allContacts = JSON.parse(contacts)
          const customerData = allContacts.find((c: any) => c.id === foundQuotation.customerId)
          setCustomer(customerData)
        }
      }
    }

    setLoading(false)
  }, [params.id])

  const handleDownloadPDF = async () => {
    if (!quotation) return

    try {
      await generateQuotationPDF(quotation, companySettings, customer)
      toast({
        title: "Downloaded!",
        description: "Quotation PDF downloaded successfully",
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

    const subject = `Quotation ${quotation?.quotationNumber} from ${companySettings.companyName}`
    const body = `Dear ${customer.name},\n\nPlease find your quotation ${quotation?.quotationNumber} for ₹${quotation?.total.toFixed(2)}.\n\nValid Until: ${new Date(quotation.validUntil).toLocaleDateString()}\n\nView quotation: ${window.location.href}\n\nThank you!\n\nBest regards,\n${companySettings.companyName}`

    window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    toast({
      title: "Email Client Opened",
      description: "Your email client has been opened with the quotation details",
    })
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

    const message = `Hi ${customer?.name || "there"}! 👋\n\nHere's your quotation from ${companySettings?.companyName || "us"}:\n\n📄 Quotation: ${quotation?.quotationNumber}\n💰 Amount: ₹${quotation?.total.toFixed(2)}\n📅 Valid Until: ${new Date(quotation?.validUntil || "").toLocaleDateString()}\n\n🔗 View quotation: ${window.location.href}\n\nThank you!`

    const phoneNumber = customer?.phone || companySettings?.whatsapp || ""
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "")
    const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`

    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`, "_blank")

    toast({
      title: "WhatsApp Opened",
      description: "Quotation details sent to WhatsApp",
    })
  }

  const handleConvertToInvoice = () => {
    if (!quotation) return

    const invoices = localStorage.getItem("invoices")
    const allInvoices = invoices ? JSON.parse(invoices) : []

    const settings = localStorage.getItem("companySettings")
    const parsedSettings = settings ? JSON.parse(settings) : {}
    const invoicePrefix = parsedSettings.invoicePrefix || "INV"
    const invoiceStart = parsedSettings.invoiceStartNumber || 1
    const invoiceNumber = `${invoicePrefix}-${String(invoiceStart + allInvoices.length).padStart(3, "0")}`

    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber,
      customerId: quotation.customerId,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      items: quotation.items,
      subtotal: quotation.subtotal,
      taxAmount: quotation.taxAmount,
      total: quotation.total,
      status: "unpaid",
      paidAmount: 0,
      notes: quotation.notes,
    }

    allInvoices.push(newInvoice)
    localStorage.setItem("invoices", JSON.stringify(allInvoices))

    const quotations = localStorage.getItem("quotations")
    const allQuotations = quotations ? JSON.parse(quotations) : []
    const updatedQuotations = allQuotations.map((q: any) => (q.id === quotation.id ? { ...q, status: "converted" } : q))
    localStorage.setItem("quotations", JSON.stringify(updatedQuotations))

    toast({
      title: "Converted!",
      description: `Invoice ${invoiceNumber} created successfully`,
    })

    router.push("/dashboard/invoices")
  }

  const handleConvertToProforma = () => {
    if (!quotation) return

    const proformas = localStorage.getItem("proformaInvoices")
    const allProformas = proformas ? JSON.parse(proformas) : []

    const settings = localStorage.getItem("companySettings")
    const parsedSettings = settings ? JSON.parse(settings) : {}
    const proformaPrefix = parsedSettings.proformaPrefix || "PRO"
    const proformaStart = parsedSettings.proformaStartNumber || 1
    const proformaNumber = `${proformaPrefix}-${String(proformaStart + allProformas.length).padStart(3, "0")}`

    const newProforma = {
      id: Date.now().toString(),
      proformaNumber,
      customerId: quotation.customerId,
      date: new Date().toISOString(),
      validUntil: quotation.validUntil,
      items: quotation.items,
      subtotal: quotation.subtotal,
      taxAmount: quotation.taxAmount,
      total: quotation.total,
      status: "pending",
      notes: quotation.notes,
    }

    allProformas.push(newProforma)
    localStorage.setItem("proformaInvoices", JSON.stringify(allProformas))

    const quotations = localStorage.getItem("quotations")
    const allQuotations = quotations ? JSON.parse(quotations) : []
    const updatedQuotations = allQuotations.map((q: any) => (q.id === quotation.id ? { ...q, status: "converted" } : q))
    localStorage.setItem("quotations", JSON.stringify(updatedQuotations))

    toast({
      title: "Converted!",
      description: `Proforma Invoice ${proformaNumber} created successfully`,
    })

    router.push("/dashboard/quotations/proforma")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading quotation...</p>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Quotation not found</p>
        <Button onClick={() => router.push("/dashboard/quotations")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Quotations
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto w-full px-4">
        {/* Action Bar */}
        <div className="mb-6 flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <Button variant="ghost" onClick={() => router.push("/dashboard/quotations")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleConvertToInvoice} variant="default">
              <Receipt className="mr-2 h-4 w-4" />
              Convert to Invoice
            </Button>
            <Button onClick={handleConvertToProforma} variant="default">
              <FileText className="mr-2 h-4 w-4" />
              Convert to Proforma
            </Button>
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
              <h1 className="text-5xl font-bold text-blue-700">QUOTATION</h1>
              <p className="mt-2 text-base text-gray-600">Quotation #: {quotation.quotationNumber}</p>
              <p className="text-base text-gray-600">Date: {new Date(quotation.date).toLocaleDateString()}</p>
              <p className="text-base text-gray-600">
                Valid Until: {new Date(quotation.validUntil).toLocaleDateString()}
              </p>
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

          {/* Quote To */}
          <div className="mb-8">
            <h3 className="mb-2 text-lg font-semibold">Quote To:</h3>
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
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Rate</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item: any, index: number) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{item.description}</td>
                  <td className="py-3 text-right">{item.quantity}</td>
                  <td className="py-3 text-right">₹{item.rate.toFixed(2)}</td>
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
                <span>₹{quotation.subtotal.toFixed(2)}</span>
              </div>
              {quotation.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-₹{quotation.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>₹{quotation.taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t-2 pt-2 text-xl font-bold">
                <span>Total:</span>
                <span>₹{quotation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {quotation.notes && (
            <div className="mt-8 border-t pt-4">
              <h3 className="mb-2 font-semibold">Notes:</h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">{quotation.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 border-t pt-4 text-center text-sm text-gray-500">
            <p>Thank you for your interest!</p>
          </div>
        </div>
      </div>
    </div>
  )
}
