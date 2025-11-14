"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, Send, Share2, DollarSign } from "lucide-react"
import type { Invoice } from "@/lib/types"

interface InvoicePreviewModalProps {
  invoice: Invoice | null
  open: boolean
  onClose: () => void
  onDownloadPDF: () => void
  onSendEmail: () => void
  onSendWhatsApp: () => void
}

export function InvoicePreviewModal({
  invoice,
  open,
  onClose,
  onDownloadPDF,
  onSendEmail,
  onSendWhatsApp,
}: InvoicePreviewModalProps) {
  const [companySettings, setCompanySettings] = useState<any>(null)
  const [customer, setCustomer] = useState<any>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paidAmount, setPaidAmount] = useState(0)

  useEffect(() => {
    if (!invoice || !open) return

    const loadSettings = () => {
      const settings = localStorage.getItem("companySettings")
      if (settings) {
        setCompanySettings(JSON.parse(settings))
      }
    }
    loadSettings()

    if (invoice.customerId) {
      const contacts = localStorage.getItem("contacts")
      if (contacts) {
        const allContacts = JSON.parse(contacts)
        const customerData = allContacts.find((c: any) => c.id === invoice.customerId)
        setCustomer(customerData)
      }
    }

    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const currentInvoice = invoices.find((inv: any) => inv.id === invoice.id)
    if (currentInvoice && currentInvoice.paidAmount) {
      setPaidAmount(currentInvoice.paidAmount)
    }
  }, [invoice, open])

  const handleRecordPayment = () => {
    if (!invoice || !paymentAmount) return

    const amount = Number.parseFloat(paymentAmount)
    if (isNaN(amount) || amount <= 0) return

    const newPaidAmount = paidAmount + amount

    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const updatedInvoices = invoices.map((inv: any) => {
      if (inv.id === invoice.id) {
        return {
          ...inv,
          paidAmount: newPaidAmount,
          status: newPaidAmount >= invoice.total ? "paid" : inv.status,
        }
      }
      return inv
    })
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))

    const payments = JSON.parse(localStorage.getItem("payments") || "[]")
    const newPayment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      customerName: customer?.name || "Unknown Customer",
      amount: amount,
      method: "cash" as const,
      status: "completed" as const,
      userId: invoice.userId,
    }
    payments.push(newPayment)
    localStorage.setItem("payments", JSON.stringify(payments))

    setPaidAmount(newPaidAmount)
    setPaymentAmount("")
    setShowPaymentForm(false)
  }

  if (!invoice) {
    return null
  }

  const balanceDue = invoice.total - paidAmount

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview - {invoice.invoiceNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {paidAmount > 0 && (
            <div className="rounded-lg border bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-xs text-muted-foreground">
                    Paid: ₹{paidAmount.toFixed(2)} | Balance: ₹{balanceDue.toFixed(2)}
                  </p>
                </div>
                {balanceDue > 0 && (
                  <Button size="sm" onClick={() => setShowPaymentForm(!showPaymentForm)}>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Record Payment
                  </Button>
                )}
              </div>
            </div>
          )}

          {showPaymentForm && (
            <div className="rounded-lg border bg-gray-50 p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paymentAmount">Payment Amount</Label>
                <Input
                  id="paymentAmount"
                  type="number"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Balance Due: ₹{balanceDue.toFixed(2)}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleRecordPayment}>Record Payment</Button>
                <Button variant="outline" onClick={() => setPaymentAmount(balanceDue.toString())}>
                  Full Payment
                </Button>
                <Button variant="ghost" onClick={() => setShowPaymentForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Invoice Preview */}
          <div className="rounded-lg border bg-white p-8 text-black">
            <div className="mb-8 flex items-start justify-between">
              <div>
                {companySettings?.logo && (
                  <img
                    src={companySettings.logo || "/placeholder.svg"}
                    alt="Company Logo"
                    className="h-16 w-auto mb-4 object-contain"
                  />
                )}
                <h1 className="text-3xl font-bold text-blue-700">INVOICE</h1>
                <p className="mt-2 text-sm text-gray-600">Invoice #: {invoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
                {invoice.referenceNumber && (
                  <p className="text-sm text-gray-600">Reference: {invoice.referenceNumber}</p>
                )}
              </div>
              <div className="text-right">
                <h2 className="text-xl font-bold">{companySettings?.companyName || "Your Company Name"}</h2>
                {companySettings?.address && (
                  <>
                    <p className="text-sm text-gray-600">{companySettings.address}</p>
                    <p className="text-sm text-gray-600">
                      {companySettings.city}, {companySettings.state} {companySettings.pincode}
                    </p>
                  </>
                )}
                {companySettings?.gstNumber && (
                  <p className="text-sm text-gray-600">GST: {companySettings.gstNumber}</p>
                )}
                {companySettings?.email && <p className="text-sm text-gray-600">{companySettings.email}</p>}
                {companySettings?.phone && <p className="text-sm text-gray-600">{companySettings.phone}</p>}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="mb-2 font-semibold">Bill To:</h3>
              {customer ? (
                <>
                  <p className="text-sm font-medium">{customer.name}</p>
                  {customer.company && <p className="text-sm text-gray-600">{customer.company}</p>}
                  {customer.address && <p className="text-sm text-gray-600">{customer.address}</p>}
                  {customer.city && (
                    <p className="text-sm text-gray-600">
                      {customer.city}, {customer.state} {customer.pincode}
                    </p>
                  )}
                  {customer.gstin && <p className="text-sm text-gray-600">GST: {customer.gstin}</p>}
                  {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
                  {customer.phone && <p className="text-sm text-gray-600">{customer.phone}</p>}
                </>
              ) : (
                <p className="text-sm text-gray-600">Customer information not available</p>
              )}
            </div>

            <table className="mb-8 w-full">
              <thead className="border-b-2 border-gray-300">
                <tr>
                  <th className="pb-2 text-left">Description</th>
                  <th className="pb-2 text-center">HSN</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Tax %</th>
                  <th className="pb-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">
                      {item.description}
                      {item.modelNumber && (
                        <span className="block text-xs text-gray-500">Model: {item.modelNumber}</span>
                      )}
                    </td>
                    <td className="py-2 text-center text-sm">{item.hsnCode || "-"}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">₹{item.rate.toFixed(2)}</td>
                    <td className="py-2 text-right">{item.taxRate}%</td>
                    <td className="py-2 text-right">₹{item.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{invoice.taxAmount.toFixed(2)}</span>
                </div>
                {invoice.additionalCharges && (
                  <>
                    {invoice.additionalCharges.freight > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Freight:</span>
                        <span>₹{invoice.additionalCharges.freight.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.additionalCharges.packaging > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Packaging:</span>
                        <span>₹{invoice.additionalCharges.packaging.toFixed(2)}</span>
                      </div>
                    )}
                    {invoice.additionalCharges.miscellaneous > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Miscellaneous:</span>
                        <span>₹{invoice.additionalCharges.miscellaneous.toFixed(2)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex justify-between border-t-2 pt-2 text-lg font-bold">
                  <span>Total:</span>
                  <span>₹{invoice.total.toFixed(2)}</span>
                </div>
                {paidAmount > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Paid Amount:</span>
                      <span>₹{paidAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 text-lg font-bold text-red-600">
                      <span>Balance Due:</span>
                      <span>₹{balanceDue.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 border-t pt-4">
                <h3 className="mb-2 font-semibold">Notes:</h3>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}

            <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
              <p>Thank you for your business!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {balanceDue > 0 && !showPaymentForm && (
              <Button onClick={() => setShowPaymentForm(true)} variant="outline">
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            )}
            <Button onClick={onDownloadPDF} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={onSendEmail} variant="outline" className="flex-1 bg-transparent">
              <Send className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button onClick={onSendWhatsApp} variant="outline" className="flex-1 bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Send WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
