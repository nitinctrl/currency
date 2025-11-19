"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Printer, Download } from 'lucide-react'

export default function PublicInvoiceView() {
  const searchParams = useSearchParams()
  const [invoice, setInvoice] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const data = searchParams.get("data")
    if (data) {
      try {
        const decoded = JSON.parse(atob(data))
        setInvoice(decoded)
      } catch (e) {
        setError("Invalid invoice data")
      }
    } else {
      setError("No invoice data found")
    }
  }, [searchParams])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!invoice) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 print:bg-white print:p-0">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center print:hidden">
          <h1 className="text-2xl font-bold">Invoice View</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print / Save as PDF
            </Button>
          </div>
        </div>

        <Card className="print:shadow-none print:border-none">
          <CardContent className="p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                {invoice.companyLogo && (
                  <img src={invoice.companyLogo || "/placeholder.svg"} alt="Logo" className="h-16 object-contain mb-4" />
                )}
                <h2 className="text-2xl font-bold text-primary">{invoice.companyName || "BizAcc"}</h2>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-gray-200">INVOICE</h1>
                <p className="font-medium mt-2">#{invoice.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                {invoice.dueDate && <p className="text-sm text-muted-foreground">Due Date: {invoice.dueDate}</p>}
              </div>
            </div>

            {/* Bill To */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-500 mb-2">Bill To:</h3>
                <div className="space-y-1">
                  <p className="font-bold">{invoice.customerName}</p>
                  {invoice.customerCompany && <p>{invoice.customerCompany}</p>}
                  {invoice.customerAddress && <p>{invoice.customerAddress}</p>}
                  {invoice.customerCity && <p>{invoice.customerCity}, {invoice.customerState} {invoice.customerPincode}</p>}
                  {invoice.customerPhone && <p>Phone: {invoice.customerPhone}</p>}
                  {invoice.customerGstin && <p>GSTIN: {invoice.customerGstin}</p>}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-left">HSN</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Rate</th>
                    <th className="p-3 text-right">Tax %</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoice.items.map((item: any, i: number) => (
                    <tr key={i}>
                      <td className="p-3">
                        <p className="font-medium">{item.description}</p>
                        {item.modelNumber && <p className="text-xs text-muted-foreground">{item.modelNumber}</p>}
                      </td>
                      <td className="p-3">{item.hsnCode || "-"}</td>
                      <td className="p-3 text-right">{item.quantity}</td>
                      <td className="p-3 text-right">₹{item.rate?.toLocaleString()}</td>
                      <td className="p-3 text-right">{item.taxRate}%</td>
                      <td className="p-3 text-right font-medium">₹{item.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{invoice.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax Amount:</span>
                  <span>₹{invoice.taxAmount?.toLocaleString()}</span>
                </div>
                {invoice.additionalCharges && Object.values(invoice.additionalCharges).some((v: any) => v > 0) && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Additional Charges:</span>
                    <span>₹{Object.values(invoice.additionalCharges).reduce((a: any, b: any) => a + b, 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold text-lg">
                  <span>Total:</span>
                  <span>₹{invoice.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-500 mb-2">Notes:</h3>
                <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
